import { useMemo, useState } from "react";
import { Search, UserRound } from "lucide-react";
import { useLeads } from "@/hooks/useLeads";
import { useConnections } from "@/hooks/useConnections";
import { useAuth } from "@/hooks/useAuth";
import { useCompanyId } from "@/hooks/useCompanyId";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type Props = {
  onConversationOpened: (id: string) => void;
};

const normalizePhone = (value?: string | null) => String(value || "").replace(/\D/g, "");

export const NewConversationDialog = ({ onConversationOpened }: Props) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [openingId, setOpeningId] = useState<string | null>(null);
  const { leads, isLoading } = useLeads();
  const { connections } = useConnections();
  const { user } = useAuth();
  const { companyId } = useCompanyId();

  const results = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    const digits = normalizePhone(search);
    if (!term) return [];
    return leads
      .filter((lead) => lead.phone && (
        lead.name.toLocaleLowerCase("pt-BR").includes(term) ||
        (digits && normalizePhone(lead.phone).includes(digits))
      ))
      .slice(0, 50);
  }, [leads, search]);

  const handleOpen = async (lead: (typeof leads)[number]) => {
    const phone = normalizePhone(lead.phone);
    if (!phone || !user?.id || !companyId) return;
    setOpeningId(lead.id);
    try {
      const { data: existing, error: existingError } = await supabase
        .from("conversations")
        .select("id")
        .eq("company_id", companyId)
        .eq("contact_phone", phone)
        .eq("status", "open")
        .limit(1)
        .maybeSingle();
      if (existingError) throw existingError;

      let conversationId = existing?.id;
      if (!conversationId) {
        const connection = connections.find((item) => item.is_active) || connections[0];
        if (!connection) throw new Error("Conecte um WhatsApp antes de iniciar uma conversa");
        const { data: created, error } = await supabase
          .from("conversations")
          .insert({
            user_id: user.id,
            company_id: companyId,
            connection_id: connection.id,
            contact_phone: phone,
            contact_name: lead.name || phone,
            status: "open",
            attendance_type: "agent",
            assigned_to: user.id,
            unread_count: 0,
          })
          .select("id")
          .single();
        if (error) throw error;
        conversationId = created.id;
      }

      setOpen(false);
      setSearch("");
      onConversationOpened(conversationId);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível abrir a conversa");
    } finally {
      setOpeningId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" title="Pesquisar contato para conversar">
          <UserRound className="h-4 w-4" />
          <span className="sr-only">Nova conversa</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md gap-3">
        <DialogHeader>
          <DialogTitle>Nova conversa</DialogTitle>
          <DialogDescription>Pesquise um contato pelo nome ou telefone.</DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input autoFocus value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nome ou telefone" className="pl-9" />
        </div>
        <ScrollArea className="h-80 border border-border rounded-md">
          {isLoading ? (
            <p className="p-6 text-center text-sm text-muted-foreground">Carregando contatos...</p>
          ) : !search.trim() ? (
            <p className="p-6 text-center text-sm text-muted-foreground">Digite para pesquisar seus contatos.</p>
          ) : results.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">Nenhum contato encontrado.</p>
          ) : (
            <div className="divide-y divide-border">
              {results.map((lead) => (
                <Button
                  key={lead.id}
                  variant="ghost"
                  disabled={openingId === lead.id}
                  onClick={() => handleOpen(lead)}
                  className="h-auto w-full justify-start rounded-none px-3 py-3 text-left"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{lead.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{lead.phone}</p>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};