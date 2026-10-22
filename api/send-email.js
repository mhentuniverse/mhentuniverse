const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mhent@mhentuniverse.com',
        pass: 'jjlbdlgpnjnnmqjn'
    }
});

module.exports = async (req, res) => {
    // Kích hoạt CORS cho toàn bộ hệ thống
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ status: 'error', message: 'Phương thức không được hỗ trợ' });
    }

    try {
        let payload = req.body;
        if (typeof payload === 'string') {
            try { payload = JSON.parse(payload); } catch (e) {}
        }

        const { emails, email, to, targetEmail, subject, body, html, htmlBody, senderName, replyTo } = payload || {};
        const recipients = emails || (email || to || targetEmail ? [email || to || targetEmail] : []);

        if (!recipients || recipients.length === 0) {
            return res.status(400).json({ status: 'error', message: 'Thiếu email người nhận.' });
        }

        const mailSubject = subject || '🎟️ Thông Báo Từ MHEnt. Universe';
        const content = html || htmlBody || body || '';
        const fromName = senderName || 'MHEnt. Universe (No-Reply)';
        const replyToEmail = (replyTo || 'support@mhentuniverse.com').trim();

        for (const r of recipients) {
            await transporter.sendMail({
                from: `"${fromName}" <noreply@mhentuniverse.com>`,
                to: r,
                replyTo: replyToEmail,
                subject: mailSubject,
                html: content
            });
        }

        return res.status(200).json({ status: 'success', message: 'Đã gửi thư thành công từ noreply@mhentuniverse.com!' });
    } catch (error) {
        console.error('Lỗi gửi mail SMTP Vercel:', error);
        return res.status(500).json({ status: 'error', message: error.message });
    }
};
