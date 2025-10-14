# Railway Deployment Guide

This guide will walk you through deploying your WhatsApp to Google Drive webhook application on Railway.

## Prerequisites

- Railway account (sign up at https://railway.app)
- Git repository (GitHub, GitLab, or Bitbucket)
- Google Cloud Service Account credentials
- Google Drive folder IDs

## Quick Start

### Option 1: Deploy from GitHub (Recommended)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **Create a new project on Railway**
   - Go to https://railway.app/new
   - Click "Deploy from GitHub repo"
   - Select your repository
   - Railway will automatically detect your Node.js app

3. **Configure environment variables** (see below)

4. **Deploy!**
   - Railway will automatically build and deploy your application
   - You'll get a public URL like `https://your-app.up.railway.app`

### Option 2: Deploy using Railway CLI

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Initialize Railway project**
   ```bash
   railway init
   ```

4. **Link to your project**
   ```bash
   railway link
   ```

5. **Deploy**
   ```bash
   railway up
   ```

## Environment Variables Configuration

You need to add these environment variables in Railway:

### In Railway Dashboard:

1. Go to your project
2. Click on "Variables" tab
3. Add each variable:

```env
# Server Configuration
PORT=3000

# Google Drive Service Account Credentials
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_PRIVATE_KEY_ID=your-private-key-id
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n
GOOGLE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=your-client-id

# Fallback Google Drive Folder ID
FALLBACK_FOLDER_ID=your-fallback-folder-id
```

**IMPORTANT NOTES:**
- For `GOOGLE_PRIVATE_KEY`: Keep the `\n` characters for line breaks
- You can paste the entire private key from your service account JSON file
- Don't wrap the private key in additional quotes in Railway (Railway handles quotes automatically)

### Using Railway CLI:

```bash
railway variables set GOOGLE_PROJECT_ID="your-project-id"
railway variables set GOOGLE_PRIVATE_KEY_ID="your-private-key-id"
railway variables set GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Key\n-----END PRIVATE KEY-----\n"
railway variables set GOOGLE_CLIENT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
railway variables set GOOGLE_CLIENT_ID="your-client-id"
railway variables set FALLBACK_FOLDER_ID="your-fallback-folder-id"
```

## Configure WhatsApp Group Mappings

Before deploying, update your group-to-folder mappings:

Edit `src/webhookHandler.js`:
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

Commit and push changes:
```bash
git add src/webhookHandler.js
git commit -m "Configure group mappings"
git push
```

Railway will automatically redeploy.

## Get Your Public URL

1. Go to Railway dashboard
2. Click on your service
3. Go to "Settings" tab
4. Under "Networking", click "Generate Domain"
5. Copy your public URL: `https://your-app.up.railway.app`

## Configure Evolution API Webhook

Set your Evolution API webhook URL to:
```
https://your-app.up.railway.app/webhook/evolution-whatsapp-media
```

## Monitoring and Logs

### View Logs in Dashboard
1. Go to your Railway project
2. Click on "Deployments" tab
3. Click on the latest deployment
4. View real-time logs

### View Logs using CLI
```bash
railway logs
```

### Health Check
Your app has a health check endpoint at:
```
https://your-app.up.railway.app/
```

Response:
```json
{
  "status": "ok",
  "service": "WhatsApp Asset to Google Drive",
  "timestamp": "2024-10-15T12:00:00.000Z"
}
```

## Troubleshooting

### Deployment Fails

**Check build logs:**
```bash
railway logs --deployment
```

**Common issues:**
- Missing dependencies in package.json
- Incorrect Node.js version (add engines to package.json)

### Application Crashes

**Check runtime logs:**
```bash
railway logs
```

**Common issues:**
- Missing environment variables
- Invalid Google Service Account credentials
- Incorrect folder IDs

### Google Drive Authentication Error

1. Verify all Google credentials are set correctly
2. Ensure `GOOGLE_PRIVATE_KEY` has proper line breaks (`\n`)
3. Check that folders are shared with service account email
4. Verify service account has "Editor" permissions

### Files Not Uploading

1. Check Railway logs for specific errors
2. Verify folder IDs in `GROUP_TO_FOLDER` mapping
3. Ensure service account email has access to folders
4. Test health endpoint to ensure app is running

### Webhook Not Receiving Data

1. Verify Evolution API webhook URL is correct
2. Test webhook manually:
   ```bash
   curl -X POST https://your-app.up.railway.app/webhook/evolution-whatsapp-media \
     -H "Content-Type: application/json" \
     -d '{"test": true}'
   ```
3. Check Railway logs to see if request arrived

## Updating Your Application

### With GitHub (Automatic)
Simply push to your connected branch:
```bash
git add .
git commit -m "Update application"
git push
```

Railway will automatically detect changes and redeploy.

### With Railway CLI
```bash
railway up
```

## Scaling and Performance

Railway automatically handles:
- Auto-scaling based on traffic
- SSL certificates
- DDoS protection
- CDN

### Monitor Resource Usage
- Check "Metrics" tab in Railway dashboard
- View CPU, Memory, and Network usage

## Cost Considerations

Railway offers:
- **Free tier**: $5 of usage per month
- **Pro plan**: $20/month + usage

Your app should be very efficient:
- Minimal memory usage (~50-100 MB)
- Low CPU usage (only when processing webhooks)
- Minimal network traffic

Estimated cost: **Free to ~$5/month** for moderate usage.

## Best Practices

1. **Use Environment Variables**: Never hardcode credentials
2. **Monitor Logs**: Regularly check logs for errors
3. **Test Webhooks**: Use curl or Postman to test endpoints
4. **Backup Configurations**: Keep your group mappings documented
5. **Update Dependencies**: Regularly update npm packages for security

## Railway Commands Cheat Sheet

```bash
# Login
railway login

# Initialize project
railway init

# Link to project
railway link

# Deploy
railway up

# View logs
railway logs

# Open dashboard
railway open

# Set variable
railway variables set KEY=value

# List variables
railway variables

# Open in browser
railway open
```

## Support

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Railway Status**: https://status.railway.app

## Security Recommendations

1. **Rotate Credentials**: Periodically rotate service account keys
2. **Monitor Access**: Check Google Drive activity logs
3. **Limit Permissions**: Only grant necessary folder access
4. **Enable 2FA**: Enable two-factor auth on Railway account
5. **Review Logs**: Regularly audit application logs

## Next Steps

After successful deployment:

1. Test the webhook endpoint with curl
2. Send a test media file in WhatsApp group
3. Verify file appears in Google Drive
4. Monitor Railway logs for any errors
5. Set up Evolution API webhook URL
6. Test with real WhatsApp messages

## Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Google Drive API Documentation](https://developers.google.com/drive)
- [Evolution API Documentation](https://doc.evolution-api.com)

---

**Need help?** Open an issue or check Railway's excellent documentation and support channels.
