/**
 * Extract media information from Evolution API webhook payload
 * Mirrors the "Code: Extract Media" node from n8n workflow
 */
function extractMedia(webhookData) {
  const root = webhookData.body?.data || webhookData.data || {};
  const msg = root.message || {};

  let messageType;
  let url = webhookData.url;
  let base64 = webhookData.base64;
  let fileName = webhookData.fileName;
  let mimetype = webhookData.mimetype;

  // Helper function to pick first non-empty value
  const pick = (...vals) => vals.find(v => v !== undefined && v !== null && v !== '');

  // Check for image message
  if (msg.imageMessage) {
    const im = msg.imageMessage;
    messageType = 'image';
    url = pick(url, im.url);
    mimetype = pick(mimetype, im.mimetype, 'image/jpeg');
    fileName = pick(fileName, im.fileName, 'image.jpg');
  }
  // Check for video message
  else if (msg.videoMessage) {
    const vm = msg.videoMessage;
    messageType = 'video';
    url = pick(url, vm.url);
    mimetype = pick(mimetype, vm.mimetype, 'video/mp4');
    fileName = pick(fileName, vm.fileName, 'video.mp4');
  }
  // Check for document message
  else if (msg.documentMessage) {
    const dm = msg.documentMessage;

    // Coerce to video if mimetype is video/*
    if (dm.mimetype?.startsWith('video/')) {
      messageType = 'video';
      url = pick(url, dm.url);
      mimetype = pick(mimetype, dm.mimetype, 'video/mp4');
      fileName = pick(fileName, dm.fileName, 'video.mp4');
    }
    // Coerce to image if mimetype is image/*
    else if (dm.mimetype?.startsWith('image/')) {
      messageType = 'image';
      url = pick(url, dm.url);
      mimetype = pick(mimetype, dm.mimetype, 'image/jpeg');
      fileName = pick(fileName, dm.fileName, 'image.jpg');
    }
    // Otherwise treat as document
    else {
      messageType = 'document';
      url = pick(url, dm.url);
      mimetype = pick(mimetype, dm.mimetype, 'application/octet-stream');
      fileName = pick(fileName, dm.fileName, 'file.bin');
    }
  }
  // Fallback: determine type from mimetype if no specific message block
  else {
    if (mimetype?.startsWith('image/')) {
      messageType = 'image';
      fileName = fileName || 'image.jpg';
    } else if (mimetype?.startsWith('video/')) {
      messageType = 'video';
      fileName = fileName || 'video.mp4';
    } else if (mimetype) {
      messageType = 'document';
      fileName = fileName || 'file.bin';
    }
  }

  return {
    messageType,
    url,
    base64,
    fileName,
    mimetype
  };
}

module.exports = { extractMedia };
