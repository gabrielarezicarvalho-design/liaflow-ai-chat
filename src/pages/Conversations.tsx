import { useState, useRef, useEffect, useMemo } from "react";
import { useConversations } from "@/hooks/useConversations";
import { useConnections } from "@/hooks/useConnections";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";
import { useCompanyId } from "@/hooks/useCompanyId";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  MessageSquare,
  Send,
  Paperclip,
  Smile,
  Phone,
  MoreVertical,
  ArrowLeft,
  CheckCheck,
  Check,
  Clock,
  User,
  Image as ImageIcon,
  XCircle,
  Bot,
  Headphones,
  GitBranch,
  ArrowRightLeft,
  Users,
  RefreshCw,
} from "lucide-react";
import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CloseConversationDialog } from "@/components/conversations/CloseConversationDialog";
import { TransferDialog } from "@/components/conversations/TransferDialog";
import { MessageContent } from "@/components/conversations/MessageContent";
import { EditContactDialog } from "@/components/conversations/EditContactDialog";
import { NewConversationDialog } from "@/components/conversations/NewConversationDialog";
import { MediaSendPopover } from "@/components/conversations/MediaSendPopover";
import { EmojiPickerPopover } from "@/components/conversations/EmojiPickerPopover";
import { StatusComposerDialog } from "@/components/conversations/StatusComposerDialog";



const Conversations = () => {
  const { conversations, isLoading, deleteConversation, updateConversation, refetch } = useConversations();
  const { connections } = useConnections();
  const queryClient = useQueryClient();
  const [syncingChats, setSyncingChats] = useState(false);
  const historyFetchedRef = useRef<Set<string>>(new Set());
  const { user } = useAuth();
  const { companyId } = useCompanyId();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"agent" | "ai" | "ura" | "queue">("ura");
  const [showOnlyMine, setShowOnlyMine] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [headerTransferDialogOpen, setHeaderTransferDialogOpen] = useState(false);
  const [editContactDialogOpen, setEditContactDialogOpen] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load profiles to map assigned_to → name
  const { data: profilesMap } = useQuery({
    queryKey: ['profiles-map', companyId],
    queryFn: async () => {
      let query = supabase.from('profiles').select('id, full_name');
      if (companyId) {
        query = query.eq('company_id', companyId);
      }
      const { data } = await query;
      const map: Record<string, string> = {};
      data?.forEach(p => { map[p.id] = p.full_name || 'Sem nome'; });
      return map;
    },
    staleTime: 60000,
  });

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId);
  const { messages, isLoading: messagesLoading } = useMessages(selectedConversationId || undefined);
  
  const isURA = (selectedConversation as any)?.attendance_type === "ura" || 
    (!(selectedConversation as any)?.attendance_type);

  const filteredConversations = conversations.filter(
    (conv) => {
      const matchesSearch = conv.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.contact_phone?.includes(searchTerm);
      const matchesTab = (conv as any).attendance_type === activeTab || 
        (!((conv as any).attendance_type) && activeTab === "ura");
      const matchesMine = !showOnlyMine || activeTab !== "agent" || conv.assigned_to === user?.id;
      return matchesSearch && matchesTab && matchesMine;
    }
  );

  const getTabCount = (tab: string) => {
    return conversations.filter(c => {
      const type = (c as any).attendance_type;
      return type === tab || (!type && tab === "ura");
    }).length;
  };

  const markAsRead = (id: string) => {
    supabase
      .from("conversations")
      .update({ unread_count: 0 })
      .eq("id", id)
      .then(() => {
        updateConversation.mutate({ id, updates: { unread_count: 0 } });
      });
  };

  const isNearBottom = () => {
    const el = messagesEndRef.current?.parentElement?.parentElement as HTMLElement | null;
    // Fallback: find scrollable viewport ancestor
    const viewport =
      (messagesEndRef.current?.closest("[data-radix-scroll-area-viewport]") as HTMLElement | null) ||
      el;
    if (!viewport) return true;
    return viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 120;
  };

  // Auto-scroll to bottom on new messages + auto-mark-as-read if near bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (
      selectedConversationId &&
      selectedConversation &&
      (selectedConversation.unread_count ?? 0) > 0 &&
      isNearBottom()
    ) {
      markAsRead(selectedConversationId);
    }
  }, [messages, selectedConversationId, selectedConversation?.unread_count]);

  // Focus input and reset unread count when conversation selected
  useEffect(() => {
    if (selectedConversationId) {
      setTimeout(() => inputRef.current?.focus(), 100);
      markAsRead(selectedConversationId);
    }
  }, [selectedConversationId]);

  // Mark as read when user scrolls to bottom
  useEffect(() => {
    const viewport = document.querySelector(
      '[data-conversation-viewport] [data-radix-scroll-area-viewport]'
    ) as HTMLElement | null;
    if (!viewport || !selectedConversationId) return;
    const handler = () => {
      if (
        viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 120 &&
        (selectedConversation?.unread_count ?? 0) > 0
      ) {
        markAsRead(selectedConversationId);
      }
    };
    viewport.addEventListener("scroll", handler, { passive: true });
    return () => viewport.removeEventListener("scroll", handler);
  }, [selectedConversationId, selectedConversation?.unread_count]);


  // Importa todas as conversas do WhatsApp (Evolution) para a lateral
  const handleSyncChats = async () => {
    if (syncingChats) return;
    const evoConnections = (connections || []).filter(
      (c: any) => String(c.environment || "").toUpperCase() === "EVOLUTION" || c.is_active
    );
    if (evoConnections.length === 0) {
      toast.error("Nenhuma conexão de WhatsApp encontrada");
      return;
    }
    setSyncingChats(true);
    try {
      let imported = 0;
      for (const conn of evoConnections) {
        const { data, error } = await supabase.functions.invoke("wa-sync-chats", {
          body: { connectionId: conn.id },
        });
        if (error) continue;
        if ((data as any)?.success) imported += (data as any).imported || 0;
      }
      await refetch?.();
      toast.success(
        imported > 0
          ? `${imported} conversa(s) importada(s) do WhatsApp`
          : "Nenhuma conversa nova encontrada"
      );
    } catch (e) {
      toast.error("Erro ao sincronizar conversas");
    } finally {
      setSyncingChats(false);
    }
  };

  // Atualiza o histórico completo da Evolution na primeira vez que a conversa é aberta
  useEffect(() => {
    if (!selectedConversationId || messagesLoading) return;
    if (historyFetchedRef.current.has(selectedConversationId)) return;
    historyFetchedRef.current.add(selectedConversationId);
    const convId = selectedConversationId;
    supabase.functions
      .invoke("wa-fetch-messages", { body: { conversationId: convId } })
      .then(({ data }: any) => {
        if (data?.imported > 0) {
          queryClient.invalidateQueries({ queryKey: ["messages", convId] });
        }
      })
      .catch(() => {});
  }, [selectedConversationId, messagesLoading, queryClient]);

  const getInitials = (name: string | null) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const formatMessageTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, "HH:mm");
  };

  const formatConversationDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isToday(date)) return format(date, "HH:mm");
    if (isYesterday(date)) return "Ontem";
    return format(date, "dd/MM/yyyy");
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversationId || sending) return;

    const text = messageText.trim();
    setMessageText("");
    setSending(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Usuário não autenticado");
        return;
      }

      // Save message to DB
      const { data: inserted, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: selectedConversationId,
          content: text,
          sender_type: "agent",
          sender_id: user.id,
          message_type: "text",
          status: "sent",
        })
        .select("id")
        .single();

      if (error) throw error;

      // Update conversation last message
      await supabase
        .from("conversations")
        .update({
          last_message: text,
          last_message_at: new Date().toISOString(),
        })
        .eq("id", selectedConversationId);

      // Send via WhatsApp using the conversation's connection
      const connId = (selectedConversation as any)?.connection_id;
      if (selectedConversation?.contact_phone && connId) {
        const { data: sendData, error: sendError } = await supabase.functions.invoke("wa-send-text", {
          body: {
            connectionId: connId,
            phone: selectedConversation.contact_phone,
            text: text,
          },
        });

        if (sendError || (sendData && sendData.success === false)) {
          console.error("Erro ao enviar via WhatsApp:", sendError || sendData);
          toast.warning("Mensagem salva, mas falha ao enviar via WhatsApp");
        } else {
          // Guarda o ID do WhatsApp para evitar mensagens duplicadas na sincronização
          const waId =
            sendData?.data?.key?.id ||
            sendData?.data?.messageId ||
            sendData?.data?.id ||
            null;
          if (waId && inserted?.id) {
            await supabase
              .from("messages")
              .update({ external_id: String(waId) })
              .eq("id", inserted.id);
          }
        }
      }

    } catch (error: any) {
      toast.error("Erro ao enviar mensagem");
      setMessageText(text);
    } finally {
      setSending(false);
    }
  };

  const doTransfer = async (aiAgentId?: string, departmentId?: string, humanAgentId?: string) => {
    if (!selectedConversationId || transferring) return;
    setTransferring(true);
    try {
      const updates: any = {};
      let nextTab: "agent" | "ai" | "ura" | "queue" = activeTab;

      if (humanAgentId) {
        updates.attendance_type = "agent";
        updates.assigned_to = humanAgentId;
        updates.department_id = null;
        nextTab = "agent";
      } else if (aiAgentId) {
        updates.attendance_type = "ai";
        updates.assigned_to = aiAgentId;
        updates.department_id = null;
        nextTab = "ai";
      } else if (departmentId) {
        updates.attendance_type = "queue";
        updates.assigned_to = null;
        updates.department_id = departmentId;
        nextTab = "queue";
      } else {
        toast.error("Selecione um destino para a transferência");
        return;
      }

      await updateConversation.mutateAsync({
        id: selectedConversationId,
        updates,
      });
      toast.success("Conversa transferida com sucesso!");
      setActiveTab(nextTab);
    } catch {
      toast.error("Erro ao transferir conversa");
    } finally {
      setTransferring(false);
    }
  };

  const handleTransferFromURA = doTransfer;
  const handleHeaderTransfer = doTransfer;


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageStatusIcon = (status: string | null) => {
    switch (status) {
      case "read":
        return <CheckCheck className="w-3.5 h-3.5 text-sky-400" />;
      case "delivered":
        return <CheckCheck className="w-3.5 h-3.5 text-muted-foreground/60" />;
      case "sent":
        return <Check className="w-3.5 h-3.5 text-muted-foreground/60" />;
      default:
        return <Clock className="w-3 h-3 text-muted-foreground/40" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] text-sm text-muted-foreground">
        Carregando conversas…
      </div>
    );
  }


  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-card font-sans">
      {/* ==================== LEFT PANEL - Conversations List ==================== */}
      <div
        className={cn(
          "w-full md:w-[350px] md:min-w-[320px] md:max-w-[390px] flex flex-col border-r border-border bg-card",
          selectedConversationId && "hidden md:flex"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Mensagens</h2>
            <p className="text-[11px] text-muted-foreground">Central de conversas Next Pro</p>
          </div>
          <div className="flex items-center gap-1">
            <NewConversationDialog
              onConversationOpened={async (id) => {
                setActiveTab("agent");
                await refetch?.();
                setSelectedConversationId(id);
              }}
            />
            <StatusComposerDialog
              connections={(connections || []).filter(
                (c: any) =>
                  String(c.environment || "").toUpperCase() === "EVOLUTION" || c.is_active
              ) as any}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSyncChats}
              disabled={syncingChats}
              title="Sincronizar conversas do WhatsApp"
              className="h-8 w-8 p-0 text-muted-foreground transition-none"
            >
              <RefreshCw className={cn("h-4 w-4", syncingChats && "animate-spin")} />
              <span className="sr-only">{syncingChats ? "Sincronizando..." : "Sincronizar"}</span>
            </Button>

            <Badge variant="secondary" className="h-6 min-w-6 justify-center rounded-full px-1.5 text-[10px]">
              {filteredConversations.length}
            </Badge>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar ou iniciar uma conversa"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 rounded-lg border-0 bg-muted/60 pl-9 text-sm shadow-none focus-visible:ring-0 transition-none"
            />
          </div>
        </div>


        {/* Tabs */}
        <div className="flex justify-between gap-1 overflow-x-auto border-b border-border px-3 pb-3 scrollbar-hide">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setActiveTab("agent"); setSelectedConversationId(null); }}
            className={cn(
              "h-6 flex-1 shrink-0 gap-0.5 whitespace-nowrap rounded-full border px-2 text-[10px] font-medium transition-none",
              activeTab === "agent"
                ? "border-primary/20 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground"
            )}
          >
            <Headphones className="w-2.5 h-2.5" />
            <span>Atendente</span>
            {getTabCount("agent") > 0 && (
              <Badge variant="secondary" className="h-3 min-w-3 px-0.5 text-[8px] rounded-full">
                {getTabCount("agent")}
              </Badge>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setActiveTab("ai"); setSelectedConversationId(null); }}
            className={cn(
              "h-6 flex-1 shrink-0 gap-0.5 whitespace-nowrap rounded-full border px-2 text-[10px] font-medium transition-none",
              activeTab === "ai"
                ? "border-primary/20 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground"
            )}
          >
            <Bot className="w-2.5 h-2.5" />
            <span>IA</span>
            {getTabCount("ai") > 0 && (
              <Badge variant="secondary" className="h-3 min-w-3 px-0.5 text-[8px] rounded-full">
                {getTabCount("ai")}
              </Badge>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setActiveTab("ura"); setSelectedConversationId(null); }}
            className={cn(
              "h-6 flex-1 shrink-0 gap-0.5 whitespace-nowrap rounded-full border px-2 text-[10px] font-medium transition-none",
              activeTab === "ura"
                ? "border-primary/20 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground"
            )}
          >
            <GitBranch className="w-2.5 h-2.5" />
            <span>URA</span>
            {getTabCount("ura") > 0 && (
              <Badge variant="secondary" className="h-3 min-w-3 px-0.5 text-[8px] rounded-full">
                {getTabCount("ura")}
              </Badge>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setActiveTab("queue"); setSelectedConversationId(null); }}
            className={cn(
              "h-6 flex-1 shrink-0 gap-0.5 whitespace-nowrap rounded-full border px-2 text-[10px] font-medium transition-none",
              activeTab === "queue"
                ? "border-primary/20 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground"
            )}
          >
            <Users className="w-2.5 h-2.5" />
            <span>Fila</span>
            {getTabCount("queue") > 0 && (
              <Badge variant="secondary" className="h-3 min-w-3 px-0.5 text-[8px] rounded-full">
                {getTabCount("queue")}
              </Badge>
            )}
          </Button>

        </div>


        {/* Filter: Meus / Todos (only on agent tab) */}
        {activeTab === "agent" && (
          <div className="flex items-center gap-1 border-b border-border px-3 py-2">
            <Button
              variant={showOnlyMine ? "default" : "ghost"}
              size="sm"
              className="h-7 rounded-full px-3 text-xs"
              onClick={() => setShowOnlyMine(true)}
            >
              Meus
            </Button>
            <Button
              variant={!showOnlyMine ? "default" : "ghost"}
              size="sm"
              className="h-7 rounded-full px-3 text-xs"
              onClick={() => setShowOnlyMine(false)}
            >
              Todos
            </Button>
          </div>
        )}

        {/* Conversations list */}
        <ScrollArea className="flex-1">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              {activeTab === "agent" && <Headphones className="w-10 h-10 text-muted-foreground/40 mb-3" />}
              {activeTab === "ai" && <Bot className="w-10 h-10 text-muted-foreground/40 mb-3" />}
              {activeTab === "ura" && <GitBranch className="w-10 h-10 text-muted-foreground/40 mb-3" />}
              {activeTab === "queue" && <Users className="w-10 h-10 text-muted-foreground/40 mb-3" />}
              <p className="text-sm text-muted-foreground">
                {activeTab === "agent" && "Nenhum atendimento humano"}
                {activeTab === "ai" && "Nenhum atendimento com IA"}
                {activeTab === "ura" && "Nenhum cliente na URA"}
                {activeTab === "queue" && "Nenhuma conversa na fila"}

              </p>
            </div>
          ) : (
            <div className="px-2 py-1">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversationId(conv.id)}
                  className={cn(
                    "my-1 flex cursor-pointer items-center gap-3 rounded-lg border border-transparent px-3 py-3 transition-none",
                    selectedConversationId === conv.id && "border-primary/10 bg-primary/10"
                  )}
                >
                  <Avatar className="h-12 w-12 shrink-0">
                    {conv.contact_avatar && (
                      <AvatarImage src={conv.contact_avatar} alt={conv.contact_name || "Contato"} />
                    )}
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                      {getInitials(conv.contact_name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-foreground">
                        {conv.contact_name || conv.contact_phone || "Desconhecido"}
                      </span>
                      <span className="text-[11px] text-muted-foreground shrink-0">
                        {formatConversationDate(conv.last_message_at)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <div className="flex items-center gap-1 min-w-0">
                        <p className="truncate text-xs text-muted-foreground">
                          {conv.last_message || "Nenhuma mensagem"}
                        </p>
                      </div>
                      {conv.unread_count && conv.unread_count > 0 ? (
                        <Badge className="h-5 min-w-5 shrink-0 rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">
                          {conv.unread_count}
                        </Badge>
                      ) : null}
                    </div>
                    {conv.assigned_to && profilesMap?.[conv.assigned_to] && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <User className="w-3 h-3 text-primary/60" />
                        <span className="text-[10px] text-primary/80 truncate">
                          {profilesMap[conv.assigned_to]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

            </div>
          )}
        </ScrollArea>
      </div>

      {/* ==================== RIGHT PANEL - Chat ==================== */}
      <div
        className={cn(
          "flex-1 flex flex-col bg-background",
          !selectedConversationId && "hidden md:flex"
        )}
      >
        {selectedConversation ? (
          <>
            {/* Chat header */}
            <div className="flex h-16 items-center gap-3 border-b border-border bg-card px-4">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden shrink-0 transition-none"
                onClick={() => setSelectedConversationId(null)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>

              <Avatar className="h-10 w-10 shrink-0">
                {selectedConversation.contact_avatar && (
                  <AvatarImage src={selectedConversation.contact_avatar} alt={selectedConversation.contact_name || "Contato"} />
                )}
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                  {getInitials(selectedConversation.contact_name)}
                </AvatarFallback>
              </Avatar>

              <div 
                className="flex-1 min-w-0 cursor-pointer"
                onClick={() => setEditContactDialogOpen(true)}
                title="Clique para editar dados do contato"
              >

                <h3 className="truncate text-sm font-semibold text-foreground">
                  {selectedConversation.contact_name || selectedConversation.contact_phone}
                </h3>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">
                    {selectedConversation.contact_phone}
                  </p>
                  {selectedConversation.assigned_to && profilesMap?.[selectedConversation.assigned_to] && (
                    <span className="text-[10px] text-primary/80 flex items-center gap-0.5">
                      <User className="w-3 h-3" />
                      {profilesMap[selectedConversation.assigned_to]}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Badge variant="secondary" className="hidden h-6 rounded-full px-2 text-[10px] sm:flex">
                  <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full", selectedConversation.status === "open" ? "bg-success" : "bg-muted-foreground")} />
                  {selectedConversation.status === "open" ? "Atendimento aberto" : "Encerrado"}
                </Badge>
                {selectedConversation.status === "open" && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-primary transition-none"
                      onClick={() => setHeaderTransferDialogOpen(true)}
                      title="Transferir conversa"
                    >
                      <ArrowRightLeft className="w-4 h-4 mr-1" />
                      <span className="text-xs hidden sm:inline">Transferir</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-destructive transition-none"
                      onClick={() => setCloseDialogOpen(true)}
                      title="Encerrar conversa"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      <span className="text-xs hidden sm:inline">Encerrar</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground transition-none" title="Mais opções">
                      <MoreVertical className="h-4 w-4" />
                    </Button>

                  </>
                )}
              </div>
            </div>

            {/* Messages area */}
            <ScrollArea className="flex-1 bg-card px-4 py-5" data-conversation-viewport>

              <div className="mx-auto max-w-3xl space-y-2">
                  {messagesLoading ? (
                    <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
                      Carregando mensagens…
                    </div>

                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <MessageSquare className="w-10 h-10 text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">Nenhuma mensagem ainda</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Envie a primeira mensagem
                    </p>
                  </div>
                ) : (
                  messages.map((msg: any) => {
                    const isAgent = msg.sender_type === "agent";
                    const isSystem = msg.sender_type === "system" || msg.sender_type === "bot";
                    const isContact = msg.sender_type === "contact";

                    // System/bot messages: centered info style
                    if (isSystem) {
                      return (
                        <div key={msg.id} className="flex justify-center mb-2">
                           <div className="max-w-[85%] rounded-lg border border-border/60 bg-card/90 px-4 py-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Bot className="w-3 h-3 text-primary/70" />
                              <span className="font-medium text-primary/80">Sistema</span>
                            </div>
                            <MessageContent content={msg.content || ''} type={msg.message_type || 'text'} mediaUrl={msg.media_url} metadata={msg.metadata} isSent={false} />
                            <div className="flex justify-end mt-1">
                              <span className="text-[10px] text-muted-foreground/50">
                                {formatMessageTime(msg.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }


                    return (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex mb-1",
                          isAgent ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "relative max-w-[75%] rounded-2xl px-3 py-2 text-sm",
                            isAgent
                              ? "rounded-tr-sm bg-primary text-primary-foreground"
                              : "rounded-tl-sm border border-border bg-card text-foreground"
                          )}
                        >

                          <MessageContent 
                            content={msg.content || ''} 
                            type={msg.message_type || 'text'} 
                             mediaUrl={msg.media_url}
                             metadata={msg.metadata}
                            isSent={isAgent} 
                          />
                          <div className={cn("flex items-center gap-1 mt-1 justify-end")}>
                            <span
                              className={cn(
                                "text-[10px]",
                                 isAgent ? "text-primary-foreground/70" : "text-muted-foreground/60"
                              )}
                            >
                              {formatMessageTime(msg.created_at)}
                            </span>
                            {isAgent && getMessageStatusIcon(msg.status)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message input */}
            <div className="border-t border-border bg-card px-4 py-3">
              {isURA ? (
                <div className="flex items-center justify-between gap-3 max-w-3xl mx-auto bg-muted/50 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GitBranch className="w-4 h-4 shrink-0" />
                    <span className="text-sm">Cliente em fluxo URA. Transfira para atender manualmente.</span>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => setTransferDialogOpen(true)}
                    disabled={transferring}
                    className="shrink-0"
                  >
                    <Headphones className="w-4 h-4 mr-1" />
                    {transferring ? "Transferindo..." : "Transferir"}
                  </Button>
                </div>
              ) : (
                <div className="mx-auto flex max-w-3xl items-center gap-2 rounded-2xl border border-border bg-muted/50 px-2 py-1.5">
                  <EmojiPickerPopover
                    disabled={sending}
                    onSelect={(emoji) => {
                      setMessageText((prev) => prev + emoji);
                      inputRef.current?.focus();
                    }}
                  />
                  {(selectedConversation as any)?.connection_id && selectedConversation?.contact_phone ? (
                    <MediaSendPopover
                      connectionId={(selectedConversation as any).connection_id}
                      phone={selectedConversation.contact_phone}
                      conversationId={selectedConversationId!}
                      disabled={sending}
                      onSent={() => {
                        queryClient.invalidateQueries({ queryKey: ["messages", selectedConversationId] });
                        queryClient.invalidateQueries({ queryKey: ["conversations"] });
                      }}
                    />
                  ) : (
                    <Button variant="ghost" size="icon" disabled className="h-9 w-9 shrink-0 text-muted-foreground transition-none">
                      <Paperclip className="w-5 h-5" />
                    </Button>
                  )}

                  <Input
                    ref={inputRef}
                    placeholder="Digite uma mensagem..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="h-10 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 transition-none"
                    disabled={sending}
                  />
                  <Button
                    size="icon"
                    className="h-9 w-9 shrink-0 rounded-xl transition-none"
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || sending}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

              )}
            </div>
          </>
        ) : (
          /* Empty state - no conversation selected */
          <div className="flex flex-1 flex-col items-center justify-center bg-card p-8 text-center">

            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition-none">
              <MessageSquare className="h-8 w-8" />
            </div>

            <h3 className="mb-2 text-xl font-semibold text-foreground">
              NEXT PRO&nbsp;Chat
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Selecione uma conversa para começar a atender seus clientes
            </p>
          </div>
        )}
      </div>

      <CloseConversationDialog
        open={closeDialogOpen}
        onOpenChange={setCloseDialogOpen}
        conversationId={selectedConversationId || ""}
        protocolNumber={selectedConversation?.protocol || undefined}
        onClose={() => {
          if (selectedConversationId) {
            updateConversation.mutate({ id: selectedConversationId, updates: { status: 'closed' } });
          }
          setSelectedConversationId(null);
          setCloseDialogOpen(false);
        }}
      />

      <TransferDialog
        open={transferDialogOpen}
        onOpenChange={setTransferDialogOpen}
        onTransfer={handleTransferFromURA}
        showSelfOption
      />

      <TransferDialog
        open={headerTransferDialogOpen}
        onOpenChange={setHeaderTransferDialogOpen}
        onTransfer={handleHeaderTransfer}
        showSelfOption
      />

      {selectedConversation && (
        <EditContactDialog
          open={editContactDialogOpen}
          onOpenChange={setEditContactDialogOpen}
          contact={{
            id: selectedConversation.id,
            name: selectedConversation.contact_name,
            phone: selectedConversation.contact_phone,
          }}
          onUpdated={(updates) => {
            if (selectedConversationId) {
              updateConversation.mutate({
                id: selectedConversationId,
                updates: {
                  contact_name: updates.name,
                },
              });
            }
          }}
        />
      )}
    </div>
  );
};

export default Conversations;
