import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, ChevronLeft, Search, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface GroupItem {
  id: string;
  subject: string;
  size: number | null;
  pictureUrl: string | null;
}

interface ParticipantItem {
  phone: string;
  jid: string;
  name: string;
  admin: string | null;
  avatar_url: string | null;
}

interface Props {
  connectionId?: string;
}

const initials = (value: string) =>
  value.replace(/[^\p{L}\p{N} ]/gu, "").trim().split(/\s+/).slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "").join("") || "#";

export function GroupImportDialog({ connectionId }: Props) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [importing, setImporting] = useState(false);
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [group, setGroup] = useState<GroupItem | null>(null);
  const [participants, setParticipants] = useState<ParticipantItem[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  const call = async (body: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke("wa-groups", {
      body: { connectionId, ...body },
    });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    return data;
  };

  const loadGroups = async () => {
    if (!connectionId) {
      toast.error("Nenhuma conexão ativa encontrada");
      return;
    }
    setLoadingGroups(true);
    try {
      const data = await call({ action: "groups" });
      setGroups(data?.groups ?? []);
    } catch (err: any) {
      toast.error(err?.message || "Erro ao carregar grupos");
    } finally {
      setLoadingGroups(false);
    }
  };

  const openDialog = (value: boolean) => {
    setOpen(value);
    if (value) {
      setGroup(null);
      setParticipants([]);
      setSelected(new Set());
      setSearch("");
      loadGroups();
    }
  };

  const openGroup = async (item: GroupItem) => {
    setGroup(item);
    setParticipants([]);
    setSelected(new Set());
    setSearch("");
    setLoadingParticipants(true);
    try {
      const data = await call({ action: "participants", groupJid: item.id });
      const list: ParticipantItem[] = data?.participants ?? [];
      setParticipants(list);
      setSelected(new Set(list.map((p) => p.phone)));
    } catch (err: any) {
      toast.error(err?.message || "Erro ao carregar participantes");
    } finally {
      setLoadingParticipants(false);
    }
  };

  const toggle = (phone: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(phone) ? next.delete(phone) : next.add(phone);
      return next;
    });
  };

  const filtered = participants.filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return p.name.toLowerCase().includes(q) || p.phone.includes(q.replace(/\D/g, ""));
  });

  const importSelected = async () => {
    const chosen = participants
      .filter((p) => selected.has(p.phone))
      .map((p) => ({ ...p, groupJid: group?.id, groupName: group?.subject }));
    if (!chosen.length) {
      toast.error("Selecione ao menos um participante");
      return;
    }
    setImporting(true);
    try {
      const data = await call({ action: "import", groupJid: group?.id, participants: chosen });
      toast.success(`${data.added} contatos importados (${data.skipped} ignorados)`);
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Erro ao importar contatos");
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={openDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Users className="w-4 h-4" />
          Importar de grupos
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {group && (
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setGroup(null)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}
            {group ? group.subject : "Participantes de grupos"}
          </DialogTitle>
        </DialogHeader>

        {!group && (
          <div className="space-y-2">
            {loadingGroups ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-6 justify-center">
                <Loader2 className="w-4 h-4 animate-spin" /> Carregando grupos...
              </div>
            ) : groups.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                Nenhum grupo encontrado nesta conexão.
              </p>
            ) : (
              <ScrollArea className="h-[380px] pr-3">
                <div className="space-y-1">
                  {groups.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => openGroup(g)}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted text-left"
                    >
                      <Avatar className="h-9 w-9">
                        {g.pictureUrl && <AvatarImage src={g.pictureUrl} alt={g.subject} />}
                        <AvatarFallback>{initials(g.subject)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{g.subject}</p>
                        {g.size != null && (
                          <p className="text-xs text-muted-foreground">{g.size} participantes</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        )}

        {group && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Buscar participante..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {loadingParticipants ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-6 justify-center">
                <Loader2 className="w-4 h-4 animate-spin" /> Carregando participantes e fotos...
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{selected.size} de {participants.length} selecionados</span>
                  <button
                    className="underline"
                    onClick={() =>
                      setSelected(
                        selected.size === participants.length
                          ? new Set()
                          : new Set(participants.map((p) => p.phone)),
                      )
                    }
                  >
                    {selected.size === participants.length ? "Limpar seleção" : "Selecionar todos"}
                  </button>
                </div>
                <ScrollArea className="h-[320px] pr-3">
                  <div className="space-y-1">
                    {filtered.map((p) => (
                      <label
                        key={p.phone}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
                      >
                        <Checkbox
                          checked={selected.has(p.phone)}
                          onCheckedChange={() => toggle(p.phone)}
                        />
                        <Avatar className="h-8 w-8">
                          {p.avatar_url && <AvatarImage src={p.avatar_url} alt={p.name || p.phone} />}
                          <AvatarFallback>{initials(p.name || p.phone)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm truncate">{p.name || p.phone}</p>
                          <p className="text-xs text-muted-foreground">{p.phone}</p>
                        </div>
                        {p.admin && <Badge variant="secondary" className="text-[10px]">admin</Badge>}
                      </label>
                    ))}
                  </div>
                </ScrollArea>
                <Button className="w-full" onClick={importSelected} disabled={importing}>
                  {importing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Importar {selected.size} contatos
                </Button>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
