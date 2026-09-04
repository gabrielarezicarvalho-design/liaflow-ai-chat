# Importar todas as conversas do WhatsApp (Evolution) na aba Conversas

Hoje a conversa só aparece quando o cliente manda mensagem (via webhook). A ideia é boa: puxar os chats existentes da Evolution para a lateral já ficar cheia, e abrir o histórico ao clicar. Vale fazer com duas ressalvas: importar histórico completo de tudo é pesado, então o histórico das mensagens é carregado **sob demanda** (ao abrir a conversa), e as conversas importadas entram como "Fila/URA" — a IA só responde quando o cliente escrever, para não disparar mensagem sozinha em contato antigo.

## O que será feito

### 1. Sincronizar a lista de conversas
Nova função `wa-sync-chats` que:
- Lê a conexão Evolution da empresa e chama `/chat/findChats/{instance}`.
- Ignora grupos, broadcast, newsletter e status (só contatos individuais).
- Cria/atualiza registros em `conversations` com telefone, nome, foto de perfil, última mensagem e data, marcando `attendance_type = 'queue'` para as novas.
- Não duplica: usa telefone + conexão como chave.

### 2. Botão "Sincronizar conversas" na lateral
- Botão no topo da lista de Conversas, com estado de carregando e toast do total importado.
- Após sincronizar, a lista recarrega sozinha.

### 3. Histórico ao abrir a conversa
Nova função `wa-fetch-messages` que:
- Chama `/chat/findMessages/{instance}` para o telefone da conversa.
- Grava as mensagens em `messages` (sem duplicar, usando o id externo do WhatsApp).
- É chamada automaticamente na primeira vez que a conversa é aberta; nas próximas o histórico já vem do banco.

### 4. IA e transferência
- A conversa importada fica na aba **Fila** até o cliente responder.
- Quando chega mensagem nova, o fluxo atual (webhook + IA) segue igual.
- O botão **Transferir** já existe no cabeçalho e na área da URA — continua funcionando para IA, departamento ou atendente.

## Detalhes técnicos
- Novas edge functions: `supabase/functions/wa-sync-chats/index.ts`, `supabase/functions/wa-fetch-messages/index.ts`, com helpers `evolutionFindChats` / `evolutionFindMessages` em `_shared/evolution.ts`.
- Frontend: botão e hook de sync em `src/pages/Conversations.tsx` + `src/hooks/useConversations.tsx`; carregamento de histórico ao selecionar a conversa.
- Sem mudança de schema: `conversations` e `messages` já têm os campos necessários (`contact_phone`, `contact_avatar`, `external_id`, `attendance_type`).
- Paginação/limite: sync traz os chats mais recentes (limite configurável, padrão 500) para não estourar tempo da função.
