# Configuration Summary

## ✅ Configuration Complete!

Your WhatsApp to Google Drive application is fully configured and ready to run.

---

## Google Cloud Configuration

**Project ID:** `trim-modem-473621-a6`

**Service Account:** `whatsappasset@trim-modem-473621-a6.iam.gserviceaccount.com`

**Service Account ID:** `107231956601599410938`

---

## WhatsApp Group → Google Drive Folder Mapping

| WhatsApp Group ID | Google Drive Folder ID |
|-------------------|------------------------|
| `120363419161996836@g.us` | `1lqhYfmEZnbYV-fHFyHImMy9RqdiuT7m6` |
| `120363422006891805@g.us` | `18RPD_d9FitZu-L2w9zNL0PNoJky7fWNg` |
| `120363404142563929@g.us` | `1h6sNx8dxNnFZKT0YR9fVhZ0Gu-djf-GM` |
| `120363405028078411@g.us` | Uses Fallback ⬇️ |
| **Fallback (any other group)** | `1j5rQKrTbBbosf_qD1DjJj0XqsdB9H9iq` |

---

## Required Actions Before Starting

### 1. Enable Google Drive API ⚠️

**MUST DO THIS FIRST:**

Go to: https://console.cloud.google.com/apis/library/drive.googleapis.com?project=trim-modem-473621-a6

Click the **"ENABLE"** button.

### 2. Share Folders with Service Account ⚠️

You need to share **all 4 folders** with the service account:

**Service Account Email:** `whatsappasset@trim-modem-473621-a6.iam.gserviceaccount.com`

For each of these folder IDs:
- `1lqhYfmEZnbYV-fHFyHImMy9RqdiuT7m6`
- `18RPD_d9FitZu-L2w9zNL0PNoJky7fWNg`
- `1h6sNx8dxNnFZKT0YR9fVhZ0Gu-djf-GM`
- `1j5rQKrTbBbosf_qD1DjJj0XqsdB9H9iq`

**How to share:**
1. Go to Google Drive
2. Find the folder (paste folder ID in search if needed)
3. Right-click → Share
4. Add: `whatsappasset@trim-modem-473621-a6.iam.gserviceaccount.com`
5. Permission: **Editor**
6. Click Share

---

## Start the Application

Once you've completed the two actions above:

```bash
# Install dependencies (first time only)
npm install

# Verify setup
node check-setup.js

# Start the server
npm start
```

The server will start on: `http://localhost:3000`

Webhook endpoint: `http://localhost:3000/webhook/evolution-whatsapp-media`

---

## Configure Evolution API

In your Evolution API instance, set the webhook URL to your server:

**For local testing (use ngrok):**
```bash
ngrok http 3000
```
Then use: `https://your-ngrok-url.ngrok.io/webhook/evolution-whatsapp-media`

**For production deployment:**
Use your domain: `https://your-domain.com/webhook/evolution-whatsapp-media`

---

## How It Works

1. Evolution API sends webhook when media is received in WhatsApp
2. App checks if message is from allowed group
3. Extracts media (image/video/document)
4. Downloads or decodes base64
5. Maps group to correct Google Drive folder
6. Uploads with date-stamped filename (e.g., `image__2025-10-14.jpg`)
7. Logs success with Drive file link

---

## Files & Structure

```
whatsapp-asset-to-gdrive/
├── src/
│   ├── server.js              # Express server
│   ├── webhookHandler.js      # Main logic & group filtering
│   ├── mediaExtractor.js      # Extracts media from webhook
│   ├── mediaDownloader.js     # Downloads from URLs
│   └── driveUploader.js       # Google Drive upload
├── .env                       # Your credentials (DO NOT COMMIT)
├── package.json
└── README.md
```

---

## Security Notes

- ✅ `.env` is in `.gitignore` (credentials won't be committed)
- ✅ Service account has minimal required permissions
- ✅ Only processes messages from allowed groups
- ⚠️ Consider adding authentication to webhook endpoint for production
- ⚠️ Consider adding rate limiting for production

---

## Troubleshooting

**"Permission denied" errors:**
- Ensure folders are shared with service account
- Check that service account has "Editor" permission

**"Drive API not enabled":**
- Go to the API library link above and enable it

**No files uploading:**
- Check console logs for specific errors
- Verify webhook is reaching your server
- Test with: `node check-setup.js`

---

Need help? Check the logs - the app provides detailed logging for each step!
