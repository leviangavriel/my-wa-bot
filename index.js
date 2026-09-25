const express = require('express');
const app = express();

// Middleware untuk membaca JSON dari body request
app.use(express.json());

// Endpoint GET dasar
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server HTTP / API aktif!',
    timestamp: new Date().toISOString()
  });
});

// Endpoint POST sederhana
app.post('/api/message', (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({
      status: 'error',
      message: 'Parameter "text" wajib diisi'
    });
  }

  res.status(200).json({
    status: 'success',
    reply: `Pesan diterima: "${text}"`
  });
});

// Port lokal (dipakai saat dijalankan sendiri, misal: node index.js)
const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

// Export aplikasi untuk kebutuhan serverless (seperti Vercel)
module.exports = app;
