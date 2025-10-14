# Next Steps to Complete Setup

## 1. Enable Google Drive API

1. Go to: https://console.cloud.google.com/apis/library/drive.googleapis.com?project=trim-modem-473621-a6
2. Click **"ENABLE"** button
3. Wait for it to activate (takes a few seconds)

## 2. Create Google Drive Folders

1. Go to [Google Drive](https://drive.google.com/)
2. Create folders for each WhatsApp group (or use existing folders)
3. For each folder:
   - Right-click the folder → **"Share"**
   - Add this email: `whatsappasset@trim-modem-473621-a6.iam.gserviceaccount.com`
   - Give it **"Editor"** permission
   - Click **"Share"**

## 3. Get Folder IDs

For each folder you created/shared:

1. Open the folder in Google Drive
2. Look at the URL in your browser
3. The URL looks like: `https://drive.google.com/drive/folders/ABC123xyz`
4. Copy the folder ID (the part after `/folders/`)

Example:
- URL: `https://drive.google.com/drive/folders/1lqhYfmEZnbYV-fHFyHImMy9RqdiuT7m6`
- Folder ID: `1lqhYfmEZnbYV-fHFyHImMy9RqdiuT7m6`

## 4. Update Configuration

You need to tell me:

1. **Your WhatsApp group IDs** (from your n8n workflow, you had these):
   - 120363419161996836@g.us
   - 120363422006891805@g.us
   - 120363405028078411@g.us
   - 120363404142563929@g.us

2. **Which Google Drive folder ID goes with which group**

Example format:
```
Group: 120363419161996836@g.us → Folder ID: 1abc...
Group: 120363422006891805@g.us → Folder ID: 2def...
Group: 120363404142563929@g.us → Folder ID: 3ghi...
```

## 5. Install Dependencies & Test

Once I update the folder mappings, run:

```bash
# Install dependencies
npm install

# Check setup
node check-setup.js

# Start the server
npm start
```

---

**What I need from you now:**

1. Confirm you've enabled the Google Drive API
2. Your Google Drive folder IDs for each WhatsApp group
3. A fallback folder ID (for any groups not in the main list)
