# PM2 Service Management Guide

Your WhatsApp to Google Drive services are now running with PM2, which means they will continue running even after you close the terminal!

---

## 🚀 Current Status

Both services are running:

1. **whatsapp-gdrive** - Your webhook server (port 3000)
2. **ngrok-tunnel** - Public tunnel to expose your server

**Your webhook URL:** `https://unanimating-raptly-amee.ngrok-free.dev/webhook/evolution-whatsapp-media`

---

## 📊 Useful PM2 Commands

### View Running Services
```bash
pm2 list
```

### View Real-Time Logs
```bash
# All services
pm2 logs

# Specific service
pm2 logs whatsapp-gdrive
pm2 logs ngrok-tunnel
```

### Stop Services
```bash
# Stop all
pm2 stop all

# Stop specific service
pm2 stop whatsapp-gdrive
pm2 stop ngrok-tunnel
```

### Restart Services
```bash
# Restart all
pm2 restart all

# Restart specific service
pm2 restart whatsapp-gdrive
pm2 restart ngrok-tunnel
```

### Delete Services (Stop and Remove)
```bash
# Delete all
pm2 delete all

# Delete specific service
pm2 delete whatsapp-gdrive
pm2 delete ngrok-tunnel
```

### View Detailed Information
```bash
pm2 show whatsapp-gdrive
pm2 show ngrok-tunnel
```

### Monitor Resources
```bash
pm2 monit
```

---

## 🔄 After System Restart

On Windows, PM2 services don't auto-start on reboot. After restarting your computer:

```bash
# Resurrect all saved processes
pm2 resurrect
```

Or manually start them:

```bash
cd "D:\Projects\whatsapp asset to gdrive"
pm2 start src/server.js --name whatsapp-gdrive
pm2 start start-ngrok.js --name ngrok-tunnel
pm2 save
```

---

## 🌐 Getting Your Ngrok URL

If you need to find your current ngrok URL:

1. **Via API:**
   ```bash
   curl http://localhost:4040/api/tunnels
   ```

2. **Via Web Dashboard:**
   Open: http://localhost:4040

3. **From Logs:**
   ```bash
   pm2 logs ngrok-tunnel
   ```

**Note:** The ngrok URL changes each time ngrok restarts (unless you have a paid account with a static domain).

---

## 🛠️ Update Your Code

If you make changes to your code:

```bash
# Restart the server to apply changes
pm2 restart whatsapp-gdrive

# View logs to verify
pm2 logs whatsapp-gdrive
```

---

## 🔧 Troubleshooting

### Service Won't Start
```bash
pm2 delete whatsapp-gdrive
pm2 start src/server.js --name whatsapp-gdrive
pm2 save
```

### Check for Errors
```bash
pm2 logs whatsapp-gdrive --err
```

### Clear Logs
```bash
pm2 flush
```

### View Process Details
```bash
pm2 describe whatsapp-gdrive
```

---

## 💾 Backup PM2 Configuration

Your PM2 configuration is saved in:
```
C:\Users\Admin\.pm2\dump.pm2
```

To backup, copy this file to a safe location.

---

## 🔒 Security Tips for Production

If deploying to a real server:

1. **Use a proper domain** instead of ngrok
2. **Add authentication** to your webhook endpoint
3. **Use HTTPS** (Let's Encrypt with Nginx/Caddy)
4. **Set up PM2 monitoring** with Keymetrics
5. **Enable log rotation:**
   ```bash
   pm2 install pm2-logrotate
   ```

---

## 📱 Evolution API Configuration

Remember to update your Evolution API webhook URL to:
```
https://unanimating-raptly-amee.ngrok-free.dev/webhook/evolution-whatsapp-media
```

**Note:** This URL will change if you restart ngrok!

---

## ✅ You Can Now Close This Terminal!

The services will continue running in the background. Open a new terminal anytime to manage them with the commands above.
