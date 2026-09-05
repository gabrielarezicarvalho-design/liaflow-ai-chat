import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  isEvolutionConnection,
  resolveEvolutionCreds,
  evolutionFindMessages,
} from "../_shared/evolution.ts";
import { normalizeEvolutionMessage } from "../_shared/evolution-message.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const tsToIso = (t: any): string => {
  const n = Number(t);
  if (Number.isFinite(n) && n > 0) return new Date(n > 1e12 ? n : n * 1000).toISOString();
  const d = new Date(t);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { conversationId } = await req.json();
    if (!conversationId) return json({ error: "conversationId é obrigatório" }, 400);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: conversation } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .maybeSingle();

    if (!conversation) return json({ error: "Conversa não encontrada" }, 404);
    if (!conversation.connection_id) return json({ success: true, imported: 0, skipped: "sem conexão" });

    const { data: connection } = await supabase
      .from("connections")
      .select("*")
      .eq("id", conversation.connection_id)
      .maybeSingle();

    if (!connection || !isEvolutionConnection(connection)) {
      return json({ success: true, imported: 0, skipped: "conexão não Evolution" });
    }

    const creds = resolveEvolutionCreds(connection);
    if (!creds) return json({ error: "Conexão Evolution incompleta" }, 400);

    const pickRecords = (d: any): any[] => {
      const value = d?.messages?.records || d?.records || d?.data?.records || d?.data || d?.messages || d;
      return Array.isArray(value) ? value : [];
    };
    const pageCount = (d: any): number =>
      Number(d?.messages?.pages || d?.pages || d?.data?.pages || 0);

    const rawPhone = String(conversation.contact_phone || "");
    const remoteJid = rawPhone.toLowerCase().includes("@lid")
      ? `${rawPhone.replace(/@.*$/, "")}@lid`
      : `${rawPhone}@s.whatsapp.net`;
    const fetchAllPages = async (byAlt = false) => {
      const all: any[] = [];
      const seenPages = new Set<string>();
      let expectedPages = 1;
      for (let page = 1; page <= Math.min(expectedPages, 200); page += 1) {
        const result = await evolutionFindMessages({ ...creds, remoteJid, page, offset: 100, byAlt });
        if (!result.ok) {
          if (page === 1) throw new Error("Falha ao buscar mensagens na Evolution");
          break;
        }
        const records = pickRecords(result.data);
        expectedPages = Math.max(expectedPages, pageCount(result.data) || page);
        if (records.length === 0) break;
        const fingerprint = records.map((item) => item?.key?.id || item?.id).filter(Boolean).join("|");
        if (fingerprint && seenPages.has(fingerprint)) break;
        if (fingerprint) seenPages.add(fingerprint);
        all.push(...records);
        if (!pageCount(result.data) && records.length < 100) break;
        if (!pageCount(result.data)) expectedPages = page + 1;
      }
      return all;
    };

    let raw = await fetchAllPages(false);
    if (raw.length === 0) raw = await fetchAllPages(true);

    if (!Array.isArray(raw) || raw.length === 0) {
      return json({ success: true, imported: 0, total: 0 });
    }

    const { data: existing } = await supabase
      .from("messages")
      .select("external_id")
      .eq("conversation_id", conversationId)
      .not("external_id", "is", null);

    const known = new Set((existing || []).map((m: any) => String(m.external_id)));

    const rows: any[] = [];
    for (const m of raw) {
      const externalId = m?.key?.id || m?.id;
      if (!externalId || known.has(String(externalId))) continue;
      const normalized = normalizeEvolutionMessage(m);
      if (!normalized) continue;
      const { content, type, media, metadata } = normalized;
      const fromMe = Boolean(m?.key?.fromMe);
      rows.push({
        conversation_id: conversationId,
        sender_type: fromMe ? "agent" : "contact",
        sender_id: fromMe ? null : conversation.contact_phone,
        content,
        message_type: type,
        media_url: media,
        status: "read",
        external_id: String(externalId),
        created_at: tsToIso(m?.messageTimestamp),
        metadata: { source: "evolution-history", ...metadata },
      });
      known.add(String(externalId));
    }

    if (rows.length === 0) return json({ success: true, imported: 0, total: raw.length });

    rows.sort((a, b) => a.created_at.localeCompare(b.created_at));

    for (let index = 0; index < rows.length; index += 500) {
      const { error } = await supabase.from("messages").insert(rows.slice(index, index + 500));
      if (error) return json({ success: false, error: error.message }, 500);
    }

    // Importing history triggers the unread counter; restore previous state.
    await supabase
      .from("conversations")
      .update({
        unread_count: conversation.unread_count ?? 0,
        last_message: conversation.last_message,
        last_message_at: conversation.last_message_at,
        updated_at: conversation.updated_at,
      })
      .eq("id", conversationId);

    return json({ success: true, imported: rows.length, total: raw.length });
  } catch (e) {
    console.error("wa-fetch-messages error", e);
    return json({ error: String((e as Error)?.message || e) }, 500);
  }
});
