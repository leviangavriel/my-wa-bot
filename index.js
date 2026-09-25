const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

// Express server untuk port Railway
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bot WhatsApp Aktif & Berjalan di Railway!');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server web berjalan pada port ${PORT}`);
});

// Inisialisasi Bot WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        executablePath: process.env.EXECUTABLE_PATH || '/usr/bin/chromium',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--single-process'
        ]
    }
});

// Menampilkan QR Code di terminal log
client.on('qr', (qr) => {
    console.log('=== PINDAI QR CODE DI BAWAH INI ===');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Bot WhatsApp (my-wa-bot) Berhasil Terhubung!');
});

// Event penanganan pesan grup
client.on('message', async (msg) => {
    try {
        const chat = await msg.getChat();

        if (chat.isGroup) {
            const pesan = msg.body.toLowerCase();

            if (pesan === '!ping') {
                await msg.reply('Pong! Bot aktif.');
            }

            if (pesan === '!infogrup') {
                await msg.reply(
                    `📌 *INFO GRUP*\n\n` +
                    `• *Nama Grup:* ${chat.name}\n` +
                    `• *Jumlah Anggota:* ${chat.participants.length}`
                );
            }

            if (pesan === '!tagall') {
                let teks = '📣 *PANGGILAN UNTUK SEMUA ANGGOTA*\n\n';
                let mentions = [];

                for (let participant of chat.participants) {
                    const contact = await client.getContactById(participant.id._serialized);
                    mentions.push(contact);
                    teks += `@${participant.id.user} `;
                }

                await chat.sendMessage(teks, { mentions });
            }

            if (pesan === '!help') {
                await msg.reply(
                    '🤖 *MENU BOT (my-wa-bot)*\n\n' +
                    '• `!ping` - Cek status bot\n' +
                    '• `!infogrup` - Melihat info grup\n' +
                    '• `!tagall` - Tag seluruh anggota\n' +
                    '• `!help` - Menampilkan menu ini'
                );
            }
        }
    } catch (err) {
        console.error('Error penanganan pesan:', err);
    }
});

client.initialize();
