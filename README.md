# WhatsApp Asset to Google Drive

Standalone Node.js application that receives WhatsApp media from Evolution API webhooks and automatically uploads them to Google Drive.

## Features

- Receives webhooks from Evolution API (WhatsApp)
- Filters messages from specific WhatsApp groups
- Handles images, videos, and documents
- Supports both base64-encoded media and URL downloads
- Automatically uploads to designated Google Drive folders
- Date-stamped file naming
- Asynchronous processing for fast webhook responses

## Architecture

The application follows this flow:

1. **Webhook Endpoint** - Receives POST requests from Evolution API
2. **Group Filter** - Validates message is from allowed WhatsApp groups
3. **Media Extraction** - Extracts media information (type, URL, base64, filename)
4. **Media Processing** - Converts base64 or downloads from URL
5. **Drive Upload** - Uploads to mapped Google Drive folder with date-stamped filename

## Project Structure

```
whatsapp-asset-to-gdrive/
├── src/
│   ├── server.js           # Express server & webhook endpoint
│   ├── webhookHandler.js   # Main webhook processing logic
│   ├── mediaExtractor.js   # Extracts media info from webhook
│   ├── mediaDownloader.js  # Downloads media from URLs
│   └── driveUploader.js    # Uploads to Google Drive
├── .env.example            # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Prerequisites

- Node.js 16+ and npm
- Google Cloud Project with Drive API enabled
- Google Service Account with Drive access
- Evolution API instance for WhatsApp

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Google Drive

#### Create Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Drive API
4. Create a Service Account:
   - Go to IAM & Admin > Service Accounts
   - Click "Create Service Account"
   - Give it a name (e.g., "whatsapp-drive-uploader")
   - Grant role: "Editor" or custom role with Drive access
   - Create and download JSON key

#### Share Drive Folders

1. Get your folder IDs from Google Drive URLs
2. Share each folder with the service account email
3. Grant "Editor" permissions

### 3. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
PORT=3000

# From your service account JSON file
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_PRIVATE_KEY_ID=your-private-key-id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Key-Here\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=your-client-id

FALLBACK_FOLDER_ID=your-fallback-folder-id
```

### 4. Configure WhatsApp Groups & Drive Folders

Edit `src/webhookHandler.js` to map your groups to folders:

```javascript
const ALLOWED_GROUPS = [
  'your-group-id-1@g.us',
  'your-group-id-2@g.us',
];

const GROUP_TO_FOLDER = {
  'your-group-id-1@g.us': 'google-drive-folder-id-1',
  'your-group-id-2@g.us': 'google-drive-folder-id-2',
};
```

### 5. Run the Application

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

### 6. Configure Evolution API Webhook

In your Evolution API instance, set the webhook URL to:

```
https://your-domain.com/webhook/evolution-whatsapp-media
```

Or if testing locally with ngrok:
```
https://your-ngrok-url.ngrok.io/webhook/evolution-whatsapp-media
```

## Deployment

### Using PM2 (Recommended for Production)

Install PM2:
```bash
npm install -g pm2
```

Start the application:
```bash
pm2 start src/server.js --name whatsapp-gdrive
pm2 save
pm2 startup
```

### Using Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "src/server.js"]
```

Build and run:
```bash
docker build -t whatsapp-gdrive .
docker run -d -p 3000:3000 --env-file .env whatsapp-gdrive
```

### Deploy to Cloud

- **Railway**: Connect your Git repo, set environment variables
- **Heroku**: Use Heroku CLI or connect GitHub repo
- **DigitalOcean App Platform**: Deploy from GitHub
- **AWS EC2**: Run with PM2 or Docker
- **Google Cloud Run**: Deploy containerized version

## Testing

Test the webhook endpoint:

```bash
curl -X POST http://localhost:3000/webhook/evolution-whatsapp-media \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "data": {
        "key": {
          "remoteJid": "120363419161996836@g.us"
        },
        "message": {
          "imageMessage": {
            "url": "https://example.com/image.jpg",
            "mimetype": "image/jpeg",
            "fileName": "test.jpg"
          }
        }
      }
    }
  }'
```

## Troubleshooting

### Common Issues

**Google Drive authentication error:**
- Verify service account credentials in `.env`
- Ensure private key has proper line breaks (`\n`)
- Check that folders are shared with service account email

**Files not uploading:**
- Check folder IDs in `GROUP_TO_FOLDER` mapping
- Verify service account has Editor permissions on folders
- Check console logs for specific errors

**Webhook not receiving data:**
- Verify Evolution API webhook URL is correct
- Check firewall/port settings
- Use ngrok for local testing

### Logs

The application logs each step:
- `📨 Webhook received` - Incoming webhook
- `✅ Allowed group` - Group validated
- `📎 Media type` - Media detected
- `⬇️ Downloading from URL` - Fetching media
- `✅ Upload successful` - Upload completed

## WhatsApp Group ID

To find your WhatsApp group ID:

1. Send a test message to the group
2. Check the webhook payload
3. Look for `data.key.remoteJid`
4. Format: `120363XXXXXXXXXX@g.us`

## Google Drive Folder ID

To get folder ID:

1. Open folder in Google Drive
2. Copy URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
3. The folder ID is the last part of the URL

## Security Notes

- Never commit `.env` file
- Keep service account credentials secure
- Use environment variables in production
- Implement rate limiting for production use
- Consider adding authentication to webhook endpoint

## License

MIT
