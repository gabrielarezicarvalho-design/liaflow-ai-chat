type NormalizedMessage = {
  content: string | null;
  type: string;
  media: string | null;
  metadata: Record<string, unknown>;
};

const firstText = (...values: unknown[]): string | null => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
};

const unwrapMessage = (value: any): { message: any; viewOnce: boolean } => {
  let message = value?.message || value || {};
  let viewOnce = false;
  for (let depth = 0; depth < 8; depth += 1) {
    if (message?.ephemeralMessage?.message) {
      message = message.ephemeralMessage.message;
      continue;
    }
    const wrapped = message?.viewOnceMessage?.message ||
      message?.viewOnceMessageV2?.message ||
      message?.viewOnceMessageV2Extension?.message;
    if (wrapped) {
      viewOnce = true;
      message = wrapped;
      continue;
    }
    if (message?.documentWithCaptionMessage?.message) {
      message = message.documentWithCaptionMessage.message;
      continue;
    }
    break;
  }
  return { message, viewOnce };
};

const mediaUrl = (media: any): string | null =>
  firstText(media?.url, media?.URL, media?.mediaUrl, media?.directPath);

export const normalizeEvolutionMessage = (raw: any): NormalizedMessage | null => {
  const { message: m, viewOnce } = unwrapMessage(raw);
  const baseMetadata: Record<string, unknown> = {
    rawType: raw?.messageType || Object.keys(m || {})[0] || "unknown",
    viewOnce,
  };

  if (m?.protocolMessage) {
    const protocol = m.protocolMessage;
    const protocolType = protocol.type;
    if (protocolType === 0 || protocolType === "REVOKE") {
      return {
        content: "Mensagem apagada",
        type: "system",
        media: null,
        metadata: { ...baseMetadata, protocol: protocolType, targetId: protocol.key?.id },
      };
    }
    return null;
  }
  if (m?.senderKeyDistributionMessage && Object.keys(m).length === 1) return null;

  const text = firstText(m?.conversation, m?.extendedTextMessage?.text);
  if (text) return { content: text, type: "text", media: null, metadata: baseMetadata };

  if (m?.imageMessage) return {
    content: firstText(m.imageMessage.caption), type: "image", media: mediaUrl(m.imageMessage),
    metadata: { ...baseMetadata, mimetype: m.imageMessage.mimetype },
  };
  if (m?.videoMessage) return {
    content: firstText(m.videoMessage.caption), type: "video", media: mediaUrl(m.videoMessage),
    metadata: { ...baseMetadata, mimetype: m.videoMessage.mimetype, gifPlayback: m.videoMessage.gifPlayback },
  };
  if (m?.audioMessage) return {
    content: "Áudio", type: "audio", media: mediaUrl(m.audioMessage),
    metadata: { ...baseMetadata, mimetype: m.audioMessage.mimetype, ptt: m.audioMessage.ptt, seconds: m.audioMessage.seconds },
  };
  if (m?.documentMessage) return {
    content: firstText(m.documentMessage.fileName, m.documentMessage.title, m.documentMessage.caption, "Documento"),
    type: "document", media: mediaUrl(m.documentMessage),
    metadata: { ...baseMetadata, mimetype: m.documentMessage.mimetype, fileName: m.documentMessage.fileName },
  };
  if (m?.stickerMessage) return {
    content: "Figurinha", type: "sticker", media: mediaUrl(m.stickerMessage),
    metadata: { ...baseMetadata, mimetype: m.stickerMessage.mimetype, animated: m.stickerMessage.isAnimated },
  };
  if (m?.contactMessage) return {
    content: firstText(m.contactMessage.displayName, "Contato"), type: "contact", media: null,
    metadata: { ...baseMetadata, vcard: m.contactMessage.vcard },
  };
  if (m?.contactsArrayMessage) return {
    content: `${m.contactsArrayMessage.contacts?.length || 0} contato(s)`, type: "contact", media: null,
    metadata: { ...baseMetadata, contacts: m.contactsArrayMessage.contacts || [] },
  };
  const location = m?.locationMessage || m?.liveLocationMessage;
  if (location) return {
    content: firstText(location.name, location.address, m.liveLocationMessage ? "Localização em tempo real" : "Localização"),
    type: "location", media: null,
    metadata: { ...baseMetadata, latitude: location.degreesLatitude, longitude: location.degreesLongitude },
  };
  if (m?.reactionMessage) return {
    content: firstText(m.reactionMessage.text, "Reação removida"), type: "reaction", media: null,
    metadata: { ...baseMetadata, targetId: m.reactionMessage.key?.id, emoji: m.reactionMessage.text },
  };
  const poll = m?.pollCreationMessage || m?.pollCreationMessageV2 || m?.pollCreationMessageV3;
  if (poll) return {
    content: firstText(poll.name, "Enquete"), type: "poll", media: null,
    metadata: { ...baseMetadata, options: (poll.options || []).map((option: any) => option.optionName) },
  };
  if (m?.pollUpdateMessage) return {
    content: "Voto em enquete", type: "poll", media: null,
    metadata: { ...baseMetadata, targetId: m.pollUpdateMessage.pollCreationMessageKey?.id },
  };
  if (m?.buttonsResponseMessage) return {
    content: firstText(m.buttonsResponseMessage.selectedDisplayText, m.buttonsResponseMessage.selectedButtonId, "Resposta de botão"),
    type: "text", media: null, metadata: baseMetadata,
  };
  if (m?.listResponseMessage) return {
    content: firstText(m.listResponseMessage.title, m.listResponseMessage.singleSelectReply?.selectedRowId, "Resposta de lista"),
    type: "text", media: null, metadata: baseMetadata,
  };
  if (m?.templateButtonReplyMessage) return {
    content: firstText(m.templateButtonReplyMessage.selectedDisplayText, m.templateButtonReplyMessage.selectedId, "Resposta rápida"),
    type: "text", media: null, metadata: baseMetadata,
  };
  if (m?.buttonsMessage) return {
    content: firstText(m.buttonsMessage.contentText, m.buttonsMessage.caption, m.buttonsMessage.text, "Mensagem com botões"),
    type: "text", media: null, metadata: { ...baseMetadata, buttons: m.buttonsMessage.buttons || [] },
  };
  if (m?.listMessage) return {
    content: firstText(m.listMessage.description, m.listMessage.title, "Lista"), type: "text", media: null,
    metadata: { ...baseMetadata, sections: m.listMessage.sections || [] },
  };
  if (m?.templateMessage) return {
    content: firstText(
      m.templateMessage.hydratedTemplate?.hydratedContentText,
      m.templateMessage.hydratedFourRowTemplate?.hydratedContentText,
      "Mensagem de modelo",
    ), type: "text", media: null, metadata: baseMetadata,
  };
  if (m?.groupInviteMessage) return {
    content: firstText(m.groupInviteMessage.caption, "Convite de grupo"), type: "text", media: null,
    metadata: { ...baseMetadata, inviteCode: m.groupInviteMessage.inviteCode },
  };

  return {
    content: `Mensagem não suportada (${String(baseMetadata.rawType)})`,
    type: "unsupported",
    media: null,
    metadata: { ...baseMetadata, rawKeys: Object.keys(m || {}) },
  };
};