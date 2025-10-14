const axios = require('axios');

/**
 * Download media file from URL
 * Mirrors the "HTTP: Download From URL" node from n8n workflow
 */
async function downloadFromUrl(url) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      maxRedirects: 0,
      validateStatus: (status) => status < 400
    });

    return Buffer.from(response.data);
  } catch (error) {
    console.error('Error downloading from URL:', error.message);
    throw new Error(`Failed to download media from URL: ${error.message}`);
  }
}

module.exports = { downloadFromUrl };
