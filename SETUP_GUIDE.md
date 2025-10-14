# Setup Guide - Service Account Creation

You've provided OAuth2 credentials, but this application needs **Service Account** credentials for automated operation. Here's how to create one:

## Step 1: Create Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: **trim-modem-473621-a6**
3. Navigate to **IAM & Admin** → **Service Accounts**
4. Click **"+ CREATE SERVICE ACCOUNT"**

### Service Account Details:
- **Name**: `whatsapp-drive-uploader`
- **Description**: `Service account for WhatsApp media uploads to Google Drive`
- Click **"CREATE AND CONTINUE"**

### Grant Access:
- **Role**: Select **"Editor"** or **"Basic" → "Editor"**
- Click **"CONTINUE"** then **"DONE"**

## Step 2: Create & Download Key

1. Find your new service account in the list
2. Click on it to open details
3. Go to **"KEYS"** tab
4. Click **"ADD KEY"** → **"Create new key"**
5. Choose **JSON** format
6. Click **"CREATE"**
7. A JSON file will download automatically - **SAVE THIS FILE SECURELY**

## Step 3: Extract Credentials from JSON

Open the downloaded JSON file. It looks like this:

```json
{
  "type": "service_account",
  "project_id": "trim-modem-473621-a6",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n",
  "client_email": "whatsapp-drive-uploader@trim-modem-473621-a6.iam.gserviceaccount.com",
  "client_id": "123456789...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  ...
}
```

## Step 4: Update .env File

Copy values from the JSON file to your `.env`:

```env
GOOGLE_PROJECT_ID=trim-modem-473621-a6
GOOGLE_PRIVATE_KEY_ID=abc123...
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=whatsapp-drive-uploader@trim-modem-473621-a6.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=123456789...
```

**IMPORTANT**: Keep the private key in quotes and keep the `\n` line breaks!

## Step 5: Enable Google Drive API

1. In Google Cloud Console, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google Drive API"**
3. Click on it and click **"ENABLE"**

## Step 6: Share Google Drive Folders

Your service account needs access to the folders where files will be uploaded:

1. Open Google Drive
2. Find or create the folders you want to use
3. For each folder:
   - Right-click → **"Share"**
   - Add the service account email: `whatsapp-drive-uploader@trim-modem-473621-a6.iam.gserviceaccount.com`
   - Give it **"Editor"** permission
   - Click **"Share"**

## Step 7: Get Folder IDs

For each shared folder:

1. Open the folder in Google Drive
2. Look at the URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
3. Copy the folder ID (the last part of the URL)
4. Update `src/webhookHandler.js` with your folder IDs:

```javascript
const GROUP_TO_FOLDER = {
  '120363419161996836@g.us': 'your-folder-id-1',
  '120363422006891805@g.us': 'your-folder-id-2',
  '120363404142563929@g.us': 'your-folder-id-3',
};
```

## Step 8: Test the Application

```bash
# Install dependencies
npm install

# Run the application
npm start
```

You should see:
```
🚀 Server running on port 3000
📡 Webhook endpoint: http://localhost:3000/webhook/evolution-whatsapp-media
```

## Alternative: Use OAuth2 (Not Recommended)

If you prefer to use your existing OAuth2 credentials, I can modify the application, but **this is not recommended** for automated webhooks because:

- Requires user login/authorization
- Tokens expire and need refresh
- Not suitable for server-to-server automation

Let me know if you want me to modify it for OAuth2 instead!

## Need Help?

If you get stuck, let me know at which step and I'll help you troubleshoot!
