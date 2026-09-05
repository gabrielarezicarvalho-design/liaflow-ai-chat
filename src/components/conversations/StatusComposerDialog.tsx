import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CircleDashed, Image as ImageIcon, Loader2, Music, Type, Video, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type StatusType = "text" | "image" | "video" | "audio";

const BG_COLORS = ["#004DFF", "#0F172A", "#059669", "#DC2626", "#7C3AED", "#F59E0B"];

const ACCEPT: Record<Exclude<StatusType, "text">, string> = {
  image: "image/*",
  video: "video/*",
  audio: "audio/*",
};

interface StatusComposerDialogProps {
  connections: Array<{ id: string; name?: string | null; instance_name?: string | null }>;
}

export const StatusComposerDialog = ({ connections }: StatusComposerDialogProps) => {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [triggerLoading, setTriggerLoading] = useState(false);
  const [type, setType] = useState<StatusType>("text");
  const [text, setText] = useState("");
  const [caption, setCaption] = useState("");
  const [bg, setBg] = useState(BG_COLORS[0]);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [connectionId, setConnectionId] = useState<string>(connections[0]?.id ?? "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!triggerLoading) return;
    const t = setTimeout(() => setTriggerLoading(false), 600);
    return () => clearTimeout(t);
  }, [triggerLoading]);

  const activeConnectionId = useMemo(
    () => connectionId || connections[0]?.id || "",
    [connectionId, connections]
  );

  const clearFile = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const max = f.type.startsWith("video/") ? 64 * 1024 * 1024 : 16 * 1024 * 1024;
    if (f.size > max) {
      toast.error(`Arquivo muito grande. Máximo: ${Math.round(max / 1024 / 1024)}MB`);
      return;
    }
    setFile(f);
    setPreviewUrl(
      f.type.startsWith("image/") || f.type.startsWith("video/") ? URL.createObjectURL(f) : null
    );
  };

  const fileToBase64 = (f: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = String(reader.result || "");
        resolve(result.includes(",") ? result.split(",")[1] : result);
      };
      reader.onerror = () => reject(new Error("Não foi possível ler o arquivo"));
      reader.readAsDataURL(f);
    });

  const handlePublish = async () => {
    if (!activeConnectionId) {
      toast.error("Nenhuma conexão de WhatsApp disponível");
      return;
    }
    if (type === "text" && !text.trim()) {
      toast.error("Escreva o texto do status");
      return;
    }
    if (type !== "text" && !file) {
      toast.error("Escolha um arquivo");
      return;
    }

    setSending(true);
    try {
      const content = type === "text" ? text.trim() : await fileToBase64(file!);
      const { data, error } = await supabase.functions.invoke("wa-send-status", {
        body: {
          connectionId: activeConnectionId,
          type,
          content,
          caption: type === "text" ? undefined : caption || undefined,
          backgroundColor: type === "text" ? bg : undefined,
        },
      });

      if (error || !(data as any)?.success) {
        toast.error((data as any)?.error || "Não foi possível publicar o status");
        return;
      }

      toast.success("Status publicado no WhatsApp");
      setText("");
      setCaption("");
      clearFile();
      setOpen(false);
    } catch (e) {
      toast.error("Erro ao publicar o status");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) clearFile();
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          title="Publicar status"
          disabled={triggerLoading}
          onClick={() => setTriggerLoading(true)}
          className="h-8 w-8 p-0 text-muted-foreground transition-none"
        >
          {triggerLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CircleDashed className="h-4 w-4" />
          )}
          <span className="sr-only">Publicar status</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Publicar status</DialogTitle>
          <DialogDescription className="text-xs">
            O status fica visível por 24 horas para os seus contatos do WhatsApp.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {connections.length > 1 && (
            <div className="space-y-1.5">
              <Label className="text-xs">Número</Label>
              <Select value={activeConnectionId} onValueChange={setConnectionId}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Escolha a conexão" />
                </SelectTrigger>
                <SelectContent>
                  {connections.map((c) => (
                    <SelectItem key={c.id} value={c.id} className="text-xs">
                      {c.name || c.instance_name || "Conexão"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-4 gap-1.5">
            {(
              [
                { key: "text", label: "Texto", Icon: Type },
                { key: "image", label: "Foto", Icon: ImageIcon },
                { key: "video", label: "Vídeo", Icon: Video },
                { key: "audio", label: "Áudio", Icon: Music },
              ] as const
            ).map(({ key, label, Icon }) => (
              <Button
                key={key}
                type="button"
                variant="outline"
                onClick={() => {
                  setType(key);
                  clearFile();
                }}
                className={cn(
                  "h-14 flex-col gap-1 rounded-lg px-1 text-[10px] transition-none",
                  type === key && "border-primary/30 bg-primary/10 text-primary"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>

          {type === "text" ? (
            <div className="space-y-2">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 700))}
                placeholder="Escreva seu status..."
                className="min-h-24 resize-none text-sm"
                style={{ backgroundColor: bg, color: "#fff" }}
              />
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">Fundo:</span>
                {BG_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setBg(c)}
                    style={{ backgroundColor: c }}
                    className={cn(
                      "h-5 w-5 rounded-full border",
                      bg === c ? "border-foreground" : "border-transparent"
                    )}
                    aria-label={`Cor ${c}`}
                  />
                ))}
                <span className="ml-auto text-[10px] text-muted-foreground">{text.length}/700</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPT[type]}
                onChange={handleFile}
                className="hidden"
              />
              {file ? (
                <div className="rounded-lg border border-border p-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFile}
                      className="h-6 w-6 p-0 transition-none"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  {previewUrl && type === "image" && (
                    <img src={previewUrl} alt="Prévia do status" className="mt-2 max-h-40 rounded" />
                  )}
                  {previewUrl && type === "video" && (
                    <video src={previewUrl} controls className="mt-2 max-h-40 w-full rounded" />
                  )}
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-9 w-full text-xs transition-none"
                >
                  Escolher arquivo
                </Button>
              )}
              {type !== "audio" && (
                <Input
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Legenda (opcional)"
                  className="h-9 text-xs"
                />
              )}
            </div>
          )}

          <Button
            onClick={handlePublish}
            disabled={sending}
            className="h-9 w-full text-xs transition-none"
          >
            {sending ? "Publicando..." : "Publicar status"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
