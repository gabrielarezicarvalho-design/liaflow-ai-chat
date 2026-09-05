import { requireActivePlan } from "../_shared/planGuard.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  evolutionSendStatus,
  extractEvolutionMessageId,
  isEvolutionConnection,
  resolveEvolutionCreds,
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const blocked = await requireActivePlan(req, corsHeaders);
  if (blocked) return blocked;

  try {
    const body = await req.json().catch(() => ({}));
    const connectionId = String(body?.connectionId ?? "").trim();
    const type = String(body?.type ?? "").trim() as "text" | "image" | "video" | "audio";
    const content = String(body?.content ?? "").trim();
    const caption = typeof body?.caption === "string" ? body.caption.slice(0, 1000) : undefined;
    const backgroundColor =
      typeof body?.backgroundColor === "string" ? body.backgroundColor : undefined;
    const statusJidList = Array.isArray(body?.statusJidList)
      ? body.statusJidList.filter((v: unknown) => typeof v === "string").slice(0, 500)
      : undefined;

    if (!connectionId) return json({ success: false, error: "connectionId é obrigatório" }, 400);
    if (!["text", "image", "video", "audio"].includes(type)) {
      return json({ success: false, error: "type inválido (text, image, video, audio)" }, 400);
    }
    if (!content) return json({ success: false, error: "Conteúdo do status vazio" }, 400);
    if (type === "text" && content.length > 700) {
      return json({ success: false, error: "Texto muito longo (máx. 700 caracteres)" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Valida o usuário e a posse da conexão
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) return json({ success: false, error: "Não autenticado" }, 401);

    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user) return json({ success: false, error: "Não autenticado" }, 401);

    const { data: profile } = await supabase
      .from("profiles")
      .select("company_id")
      .eq("id", userData.user.id)
      .maybeSingle();

    const { data: connection, error: connError } = await supabase
      .from("connections")
      .select("*")
      .eq("id", connectionId)
      .maybeSingle();

    if (connError || !connection) return json({ success: false, error: "Conexão não encontrada" }, 404);

    const connCompany = (connection as any).company_id ?? null;
    if (connCompany && profile?.company_id && connCompany !== profile.company_id) {
      return json({ success: false, error: "Sem permissão para esta conexão" }, 403);
    }

    if (!isEvolutionConnection(connection)) {
      return json({ success: false, error: "Esta conexão não é Evolution API" }, 400);
    }

    const creds = resolveEvolutionCreds(connection);
    if (!creds) {
      return json({ success: false, error: "Conexão sem base_url, apiKey ou instância" }, 400);
    }

    const res = await evolutionSendStatus({
      ...creds,
      type,
      content,
      caption,
      backgroundColor,
      statusJidList,
    });

    if (!res.ok) {
      console.error("[wa-send-status] falha:", res.status, res.data);
      return json(
        { success: false, error: "Não foi possível publicar o status", details: res.data },
        res.status || 502,
      );
    }

    return json({ success: true, messageId: extractEvolutionMessageId(res.data) });
  } catch (e) {
    console.error("[wa-send-status] erro:", e);
    return json({ success: false, error: (e as Error).message }, 500);
  }
});
