const { google } = require('googleapis');
const { Readable } = require('stream');

let drive = null;

/**
 * Initialize Google Drive client
 */
function initializeDrive() {
  if (drive) return drive;

  const auth = new google.auth.GoogleAuth({
    credentials: {
      type: 'service_account',
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
    },
    scopes: ['https://www.googleapis.com/auth/drive.file']
  });

  drive = google.drive({ version: 'v3', auth });
  return drive;
}

/**
 * Upload file to Google Drive
 * Mirrors the "Google Drive: Upload" node from n8n workflow
 */
async function uploadToGoogleDrive({ buffer, fileName, mimeType, folderId }) {
  try {
    const driveClient = initializeDrive();

    // Convert buffer to readable stream
    const stream = Readable.from(buffer);

    // Prepare file metadata
    const fileMetadata = {
      name: fileName,
      parents: [folderId]
    };

    // Upload file
    const response = await driveClient.files.create({
      requestBody: fileMetadata,
      media: {
        mimeType: mimeType,
        body: stream
      },
      fields: 'id, name, mimeType, size, webViewLink'
    });

    return response.data;

  } catch (error) {
    console.error('Error uploading to Google Drive:', error.message);
    throw new Error(`Failed to upload to Google Drive: ${error.message}`);
  }
}

module.exports = { uploadToGoogleDrive };
