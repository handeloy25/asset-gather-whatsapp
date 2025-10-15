require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { processWebhook } = require('./webhookHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - increased limit for large media files from WhatsApp
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'WhatsApp Asset to Google Drive',
    timestamp: new Date().toISOString()
  });
});

// Webhook endpoint for Evolution API
app.post('/webhook/evolution-whatsapp-media', async (req, res) => {
  try {
    console.log('📨 Webhook received:', new Date().toISOString());
    console.log('📦 Payload preview:', JSON.stringify(req.body).substring(0, 500));

    // Acknowledge receipt immediately
    res.status(200).json({ received: true });

    // Process webhook asynchronously
    processWebhook(req.body).catch(err => {
      console.error('❌ Error processing webhook:', err);
    });

  } catch (error) {
    console.error('❌ Webhook endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Webhook endpoint: http://localhost:${PORT}/webhook/evolution-whatsapp-media`);
});
