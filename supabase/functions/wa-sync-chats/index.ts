import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  isEvolutionConnection,
  resolveEvolutionCreds,
  evolutionFindChats,
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

const isIndividualJid = (jid: string): boolean => {
  const s = String(jid || "").toLowerCase();
  if (!s) return false;
  if (s.includes("@g.us")) return false;
  if (s.includes("@broadcast")) return false;
  if (s.includes("@newsletter")) return false;
  if (s.startsWith("status@")) return false;
  return (
    s.includes("@s.whatsapp.net") || s.includes("@c.us") || s.includes("@lid") || /^\d+$/.test(s)
  );
};

const phoneFromJid = (jid: string) =>
  String(jid || "").replace(/@.*$/, "").replace(/\D/g, "");

const chatName = (chat: any, phone: string): string => {
  const v = chat?.pushName || chat?.name || chat?.contact?.name || chat?.subject;
  return typeof v === "string" && v.trim() ? v.trim() : phone;
};

const chatJid = (chat: any): string =>
  chat?.remoteJid || chat?.key?.remoteJid || chat?.jid || chat?.id || "";

// Newer Evolution versions address chats by @lid; the real phone number lives
// in remoteJidAlt on the last message.
const realPhoneJid = (chat: any): string => {
  const jid = chatJid(chat);
  if (!String(jid).toLowerCase().includes("@lid")) return jid;
  const alt =
    chat?.lastMessage?.key?.remoteJidAlt ||
    chat?.remoteJidAlt ||
    chat?.lastMessage?.key?.participantAlt ||
    "";
  return alt || "";
};

const lastMessageText = (chat: any): string | null => {
  const m = chat?.lastMessage?.message || chat?.lastMsg?.message;
  if (!m) return null;
  return (
    m.conversation ||
    m.extendedTextMessage?.text ||
    m.imageMessage?.caption ||
    m.videoMessage?.caption ||
    null
  );
};

const lastMessageAt = (chat: any): string | null => {
  const t =
    chat?.lastMessage?.messageTimestamp ??
    chat?.updatedAt ??
    chat?.lastMsgTimestamp ??
    chat?.createdAt;
  if (!t) return null;
  const n = Number(t);
  if (Number.isFinite(n) && n > 0) {
    return new Date(n > 1e12 ? n : n * 1000).toISOString();
  }
  const d = new Date(t);
  return isNaN(d.getTime()) ? null : d.toISOString();
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { connectionId, limit } = await req.json();
    if (!connectionId) return json({ error: "connectionId é obrigatório" }, 400);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: connection, error: connError } = await supabase
      .from("connections")
      .select("*")
      .eq("id", connectionId)
      .maybeSingle();

    if (connError || !connection) return json({ error: "Conexão não encontrada" }, 404);
    if (!isEvolutionConnection(connection)) {
      return json({ error: "Conexão não é Evolution API" }, 400);
    }

    const creds = resolveEvolutionCreds(connection);
    if (!creds) return json({ error: "Conexão Evolution sem base_url, token ou instância" }, 400);

    let companyId: string | null = connection.company_id ?? null;
    if (!companyId && connection.user_id) {
      const { data: prof } = await supabase
        .from("profiles")
        .select("company_id")
        .eq("id", connection.user_id)
        .maybeSingle();
      companyId = prof?.company_id ?? null;
    }

    const r = await evolutionFindChats(creds);
    if (!r.ok) {
      return json({ success: false, error: "Falha ao buscar conversas na Evolution", details: r.data });
    }

    const raw: any[] = Array.isArray(r.data)
      ? r.data
      : (r.data?.records || r.data?.chats?.records || r.data?.chats || r.data?.data || r.data?.response || []);
    console.log("findChats shape:", Array.isArray(r.data) ? `array(${r.data.length})` : JSON.stringify(r.data).slice(0, 600));

    const max = Number(limit) > 0 ? Number(limit) : 500;

    // Dedupe by phone, keep most recent
    const byPhone = new Map<string, { phone: string; name: string; avatar: string | null; last: string | null; at: string | null }>();
    for (const chat of raw) {
      if (!isIndividualJid(chatJid(chat))) continue;
      const jid = realPhoneJid(chat);
      if (!jid) continue;
      const phone = phoneFromJid(jid);
      if (!phone || phone.length < 8 || phone.length > 15) continue;
      const entry = {
        phone,
        name: chatName(chat, phone),
        avatar: chat?.profilePicUrl || chat?.profilePictureUrl || null,
        last: lastMessageText(chat),
        at: lastMessageAt(chat),
      };
      const prev = byPhone.get(phone);
      if (!prev || (entry.at && (!prev.at || entry.at > prev.at))) byPhone.set(phone, entry);
    }

    const chats = Array.from(byPhone.values())
      .sort((a, b) => (b.at || "").localeCompare(a.at || ""))
      .slice(0, max);

    if (chats.length === 0) {
      return json({
        success: true,
        imported: 0,
        updated: 0,
        total: 0,
        debug: JSON.stringify(r.data).slice(0, 800),
      });
    }

    // Existing conversations for this connection
    const { data: existing } = await supabase
      .from("conversations")
      .select("id, contact_phone, contact_name, contact_avatar")
      .eq("connection_id", connectionId);

    const existingMap = new Map<string, any>();
    (existing || []).forEach((c) => existingMap.set(String(c.contact_phone), c));

    const toInsert: any[] = [];
    let updated = 0;

    for (const c of chats) {
      const found = existingMap.get(c.phone);
      if (found) {
        const updates: any = {};
        if (!found.contact_avatar && c.avatar) updates.contact_avatar = c.avatar;
        if ((!found.contact_name || found.contact_name === c.phone) && c.name !== c.phone) {
          updates.contact_name = c.name;
        }
        if (Object.keys(updates).length > 0) {
          await supabase.from("conversations").update(updates).eq("id", found.id);
          updated++;
        }
        continue;
      }

      toInsert.push({
        company_id: companyId,
        user_id: connection.user_id ?? null,
        connection_id: connectionId,
        contact_phone: c.phone,
        contact_name: c.name,
        contact_avatar: c.avatar,
        status: "open",
        attendance_type: "queue",
        unread_count: 0,
        last_message: c.last,
        last_message_at: c.at,
        updated_at: c.at || new Date().toISOString(),
      });
    }

    let imported = 0;
    for (let i = 0; i < toInsert.length; i += 200) {
      const batch = toInsert.slice(i, i + 200);
      const { error } = await supabase.from("conversations").insert(batch);
      if (error) {
        console.error("insert error", error);
      } else {
        imported += batch.length;
      }
    }

    return json({ success: true, imported, updated, total: chats.length });
  } catch (e) {
    console.error("wa-sync-chats error", e);
    return json({ error: String((e as Error)?.message || e) }, 500);
  }
});
