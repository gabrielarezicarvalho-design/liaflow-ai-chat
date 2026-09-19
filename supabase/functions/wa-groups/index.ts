import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  isEvolutionConnection,
  resolveEvolutionCreds,
  evolutionFetchAllGroups,
  evolutionFindGroupParticipants,
  evolutionFetchProfilePictureUrl,
} from "../_shared/evolution.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const digits = (v: unknown) => String(v ?? "").replace(/@.*$/, "").replace(/\D/g, "");

const asArray = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    return data.groups || data.data || data.response || data.participants || [];
  }
  return [];
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Auth: identify the caller from the JWT.
    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace(/^Bearer\s+/i, "");
    const { data: userData } = jwt ? await supabase.auth.getUser(jwt) : { data: { user: null } };
    const user = userData?.user;
    if (!user) return json({ error: "Não autenticado" }, 401);

    const { action, connectionId, groupJid, participants, withAvatars } = await req.json();
    if (!connectionId) return json({ error: "connectionId obrigatório" }, 400);

    const { data: connection } = await supabase
      .from("connections")
      .select("*")
      .eq("id", connectionId)
      .maybeSingle();
    if (!connection) return json({ error: "Conexão não encontrada" }, 404);

    const { data: profile } = await supabase
      .from("profiles")
      .select("company_id")
      .eq("id", user.id)
      .maybeSingle();
    const companyId = connection.company_id ?? profile?.company_id ?? null;
    if (connection.company_id && profile?.company_id && connection.company_id !== profile.company_id) {
      return json({ error: "Sem permissão para esta conexão" }, 403);
    }

    if (!isEvolutionConnection(connection)) {
      return json({ error: "Conexão não é Evolution" }, 400);
    }
    const creds = resolveEvolutionCreds(connection);
    if (!creds) return json({ error: "Conexão sem base_url, token ou instância" }, 400);

    // ---------- LIST GROUPS ----------
    if (action === "groups") {
      const r = await evolutionFetchAllGroups({ ...creds, getParticipants: false });
      if (!r.ok) return json({ success: false, error: "Falha ao buscar grupos", details: r.data });
      const groups = asArray(r.data)
        .map((g: any) => ({
          id: g.id || g.jid || g.remoteJid || "",
          subject: g.subject || g.name || "Grupo sem nome",
          size: g.size ?? g.participantsCount ?? (Array.isArray(g.participants) ? g.participants.length : null),
          pictureUrl: g.pictureUrl || g.profilePicUrl || null,
        }))
        .filter((g: any) => String(g.id).includes("@g.us"));
      return json({ success: true, groups });
    }

    // ---------- LIST PARTICIPANTS ----------
    if (action === "participants") {
      if (!groupJid) return json({ error: "groupJid obrigatório" }, 400);
      const r = await evolutionFindGroupParticipants({ ...creds, groupJid });
      if (!r.ok) return json({ success: false, error: "Falha ao buscar participantes", details: r.data });

      const raw = asArray(r.data);
      const seen = new Set<string>();
      const list: any[] = [];
      for (const p of raw) {
        const jid = p?.id || p?.jid || p?.number || "";
        const phone = digits(jid);
        if (!phone || phone.length < 8 || phone.length > 15 || seen.has(phone)) continue;
        seen.add(phone);
        list.push({
          phone,
          jid,
          name: p?.name || p?.pushName || p?.notify || "",
          admin: p?.admin ?? null,
          avatar_url: p?.imgUrl || p?.profilePicUrl || null,
        });
      }

      // Fotos: busca as que o endpoint de grupo não retornou (limitado para não estourar o tempo).
      if (withAvatars !== false) {
        const pending = list.filter((p) => !p.avatar_url).slice(0, 60);
        const CHUNK = 10;
        for (let i = 0; i < pending.length; i += CHUNK) {
          const slice = pending.slice(i, i + CHUNK);
          await Promise.all(
            slice.map(async (p) => {
              p.avatar_url = await evolutionFetchProfilePictureUrl({ ...creds, phone: p.phone });
            }),
          );
        }
      }

      return json({ success: true, participants: list, total: list.length });
    }

    // ---------- IMPORT AS LEADS ----------
    if (action === "import") {
      const incoming = Array.isArray(participants) ? participants : [];
      if (!incoming.length) return json({ error: "Nenhum participante enviado" }, 400);

      const { data: existing } = await supabase
        .from("leads")
        .select("phone")
        .eq("user_id", user.id);
      const existingPhones = new Set(
        (existing || []).map((l: any) => digits(l.phone)).filter(Boolean),
      );

      const seen = new Set<string>();
      const rows: any[] = [];
      let skipped = 0;
      for (const p of incoming) {
        const phone = digits(p?.phone || p?.jid);
        if (!phone || phone.length < 8 || phone.length > 15) { skipped++; continue; }
        if (seen.has(phone) || existingPhones.has(phone)) { skipped++; continue; }
        seen.add(phone);
        rows.push({
          user_id: user.id,
          company_id: companyId,
          phone,
          name: (typeof p?.name === "string" && p.name.trim()) ? p.name.trim() : phone,
          source: "WhatsApp Grupo",
          status: "new",
          notes: p?.groupName ? `Participante do grupo: ${p.groupName}` : null,
          custom_fields: {
            avatar_url: p?.avatar_url ?? null,
            group_jid: p?.groupJid ?? groupJid ?? null,
            group_name: p?.groupName ?? null,
          },
        });
      }

      let added = 0;
      const CHUNK = 500;
      for (let i = 0; i < rows.length; i += CHUNK) {
        const slice = rows.slice(i, i + CHUNK);
        const { data: inserted, error } = await supabase.from("leads").insert(slice).select("id");
        if (error) {
          console.error("[wa-groups] insert error:", error.message);
          skipped += slice.length;
        } else {
          added += inserted?.length ?? slice.length;
        }
      }

      return json({ success: true, added, skipped, total: incoming.length });
    }

    return json({ error: "Ação inválida" }, 400);
  } catch (err) {
    console.error("[wa-groups] error:", err);
    return json({ error: String((err as Error)?.message || err) }, 500);
  }
});
