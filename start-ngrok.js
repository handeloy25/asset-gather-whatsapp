/**
 * Ngrok wrapper for PM2
 * Keeps ngrok tunnel running persistently
 */

const { spawn } = require('child_process');

console.log('Starting ngrok tunnel on port 3000...');

const ngrok = spawn('ngrok', ['http', '3000'], {
  stdio: 'inherit'
});

ngrok.on('error', (error) => {
  console.error('Failed to start ngrok:', error);
  process.exit(1);
});

ngrok.on('exit', (code) => {
  console.log(`Ngrok exited with code ${code}`);
  process.exit(code);
});

// Keep process alive
process.on('SIGINT', () => {
  console.log('Stopping ngrok...');
  ngrok.kill();
  process.exit(0);
});
