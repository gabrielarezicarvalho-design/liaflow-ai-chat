import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  isEvolutionConnection,
  resolveEvolutionCreds,
  evolutionFindMessages,
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

const textFromMessage = (m: any): { content: string | null; type: string; media: string | null } => {
  const msg = m?.message || {};
  if (msg.conversation) return { content: msg.conversation, type: "text", media: null };
  if (msg.extendedTextMessage?.text)
    return { content: msg.extendedTextMessage.text, type: "text", media: null };
  if (msg.imageMessage)
    return { content: msg.imageMessage.caption || null, type: "image", media: msg.imageMessage.url || null };
  if (msg.videoMessage)
    return { content: msg.videoMessage.caption || null, type: "video", media: msg.videoMessage.url || null };
  if (msg.audioMessage) return { content: null, type: "audio", media: msg.audioMessage.url || null };
  if (msg.documentMessage)
    return {
      content: msg.documentMessage.fileName || null,
      type: "document",
      media: msg.documentMessage.url || null,
    };
  if (msg.stickerMessage) return { content: null, type: "image", media: msg.stickerMessage.url || null };
  return { content: null, type: "text", media: null };
};

const tsToIso = (t: any): string => {
  const n = Number(t);
  if (Number.isFinite(n) && n > 0) return new Date(n > 1e12 ? n : n * 1000).toISOString();
  const d = new Date(t);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { conversationId, limit } = await req.json();
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

    const pickRecords = (d: any): any[] =>
      Array.isArray(d) ? d : (d?.messages?.records || d?.messages || d?.records || d?.data || []);

    const remoteJid = `${conversation.contact_phone}@s.whatsapp.net`;
    const r = await evolutionFindMessages({ ...creds, remoteJid, limit: Number(limit) || 50 });
    if (!r.ok) {
      return json({ success: false, error: "Falha ao buscar mensagens", details: r.data });
    }

    let raw: any[] = pickRecords(r.data);

    // Newer Evolution versions address chats by @lid: retry using remoteJidAlt.
    if (raw.length === 0) {
      const alt = await evolutionFindMessages({
        ...creds,
        remoteJid,
        limit: Number(limit) || 50,
        byAlt: true,
      });
      if (alt.ok) raw = pickRecords(alt.data);
    }

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
      const { content, type, media } = textFromMessage(m);
      if (!content && !media) continue;
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
        metadata: { source: "evolution-history" },
      });
      known.add(String(externalId));
    }

    if (rows.length === 0) return json({ success: true, imported: 0, total: raw.length });

    rows.sort((a, b) => a.created_at.localeCompare(b.created_at));

    const { error } = await supabase.from("messages").insert(rows);
    if (error) return json({ success: false, error: error.message }, 500);

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
