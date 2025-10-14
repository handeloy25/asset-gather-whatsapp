require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { processWebhook } = require('./webhookHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

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
