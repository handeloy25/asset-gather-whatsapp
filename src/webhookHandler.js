const { extractMedia } = require('./mediaExtractor');
const { downloadFromUrl } = require('./mediaDownloader');
const { uploadToGoogleDrive } = require('./driveUploader');

// Allowed WhatsApp group IDs
const ALLOWED_GROUPS = [
  '120363419161996836@g.us',
  '120363422006891805@g.us',
  '120363405028078411@g.us',
  '120363404142563929@g.us'
];

// Group to Google Drive folder mapping
const GROUP_TO_FOLDER = {
  '120363419161996836@g.us': '1lqhYfmEZnbYV-fHFyHImMy9RqdiuT7m6',
  '120363422006891805@g.us': '18RPD_d9FitZu-L2w9zNL0PNoJky7fWNg',
  '120363404142563929@g.us': '1h6sNx8dxNnFZKT0YR9fVhZ0Gu-djf-GM'
};

const FALLBACK_FOLDER_ID = process.env.FALLBACK_FOLDER_ID || 'FALLBACK_FOLDER_ID';

/**
 * Check if message is from a WhatsApp group
 */
function isGroup(data) {
  const remoteJid = data?.data?.key?.remoteJid || data?.body?.data?.key?.remoteJid || '';
  return remoteJid.trim().endsWith('@g.us');
}

/**
 * Check if group is in allowed list
 */
function isAllowedGroup(data) {
  const remoteJid = data?.body?.data?.key?.remoteJid || '';
  return ALLOWED_GROUPS.includes(remoteJid);
}

/**
 * Main webhook processing function
 */
async function processWebhook(webhookData) {
  try {
    console.log('🔍 Processing webhook...');

    // Step 1: Check if it's from a group
    if (!isGroup(webhookData)) {
      console.log('⏭️  Not a group message, skipping');
      return;
    }

    // Step 2: Check if it's an allowed group
    if (!isAllowedGroup(webhookData)) {
      console.log('⏭️  Not an allowed group, skipping');
      return;
    }

    const groupId = webhookData?.body?.data?.key?.remoteJid || '';
    console.log(`✅ Allowed group: ${groupId}`);

    // Step 3: Extract media information
    const mediaInfo = extractMedia(webhookData);

    if (!mediaInfo.messageType) {
      console.log('⏭️  No media found in message, skipping');
      return;
    }

    console.log(`📎 Media type: ${mediaInfo.messageType}`);
    console.log(`📄 File name: ${mediaInfo.fileName}`);

    // Step 4: Get media as buffer
    let mediaBuffer;

    if (mediaInfo.base64) {
      console.log('📦 Converting base64 to buffer...');
      // Remove data URL prefix if present
      const base64Data = mediaInfo.base64.replace(/^data:[^;]+;base64,/, '');
      mediaBuffer = Buffer.from(base64Data, 'base64');
    } else if (mediaInfo.url) {
      console.log('⬇️  Downloading from URL...');
      mediaBuffer = await downloadFromUrl(mediaInfo.url);
    } else {
      console.log('❌ No base64 or URL found, cannot process media');
      return;
    }

    console.log(`📊 Media size: ${(mediaBuffer.length / 1024 / 1024).toFixed(2)} MB`);

    // Step 5: Prepare for Google Drive upload
    const driveFolderId = GROUP_TO_FOLDER[groupId] || FALLBACK_FOLDER_ID;

    // Create filename with date stamp
    const now = new Date();
    const dateStamp = now.toISOString().slice(0, 10);
    const fileName = mediaInfo.fileName || 'file';
    const lastDot = fileName.lastIndexOf('.');
    const baseName = lastDot >= 0 ? fileName.slice(0, lastDot) : fileName;
    const extension = lastDot >= 0 ? fileName.slice(lastDot) : '.bin';
    const finalFileName = `${baseName.replace(/[^\w.-]+/g, '_')}__${dateStamp}${extension}`;

    console.log(`📂 Target folder: ${driveFolderId}`);
    console.log(`📝 Final file name: ${finalFileName}`);

    // Step 6: Upload to Google Drive
    const uploadResult = await uploadToGoogleDrive({
      buffer: mediaBuffer,
      fileName: finalFileName,
      mimeType: mediaInfo.mimetype,
      folderId: driveFolderId
    });

    console.log(`✅ Upload successful! File ID: ${uploadResult.id}`);
    console.log(`🔗 File URL: https://drive.google.com/file/d/${uploadResult.id}/view`);

  } catch (error) {
    console.error('❌ Error in processWebhook:', error.message);
    throw error;
  }
}

module.exports = { processWebhook };
