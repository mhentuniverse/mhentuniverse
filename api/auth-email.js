const nodemailer = require('nodemailer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// 1. CẤU HÌNH BƯU TÁ GMAIL / GOOGLE WORKSPACE SMTP CHÍNH CHỦ
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mhent@mhentuniverse.com',
        pass: 'jjlbdlgpnjnnmqjn'
    }
});

let cachedToken = null;
let tokenExpiry = 0;

// 2. LẤY THÔNG TIN SERVICE ACCOUNT
function getServiceAccount() {
    // 2.1. Biến môi trường Vercel (khuyến nghị trên Production)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
            const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
            if (parsed && parsed.private_key) {
                parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
            }
            return parsed;
        } catch (e) {
            console.error('Lỗi parse FIREBASE_SERVICE_ACCOUNT:', e);
        }
    }

    // 2.2. Hỗ trợ biến môi trường riêng lẻ
    if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        return {
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
            private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            project_id: process.env.FIREBASE_PROJECT_ID || 'mhentuniverse'
        };
    }

    // 2.3. Tìm file Service Account cục bộ (cho môi trường local / preview)
    const possiblePaths = [
        path.join(process.cwd(), 'firebase-service-account.json'),
        path.join(process.cwd(), 'mhentuniverse-firebase-adminsdk-fbsvc-1cf272936c.json'),
        path.join(__dirname, '..', 'firebase-service-account.json'),
        path.join(__dirname, '..', 'mhentuniverse-firebase-adminsdk-fbsvc-1cf272936c.json'),
        path.join(__dirname, '..', '..', 'mhentuniverse-firebase-adminsdk-fbsvc-1cf272936c.json'),
        path.join(__dirname, 'firebase-service-account.json')
    ];

    for (const filePath of possiblePaths) {
        if (fs.existsSync(filePath)) {
            try {
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                if (data && data.private_key) {
                    data.private_key = data.private_key.replace(/\\n/g, '\n');
                }
                return data;
            } catch (err) {
                console.error(`Lỗi đọc file ${filePath}:`, err);
            }
        }
    }

    return null;
}

// 3. TẠO GOOGLE OAUTH 2.0 ACCESS TOKEN TỪ SERVICE ACCOUNT (THUẦN NODE CRYPTO, KHÔNG CẦN THƯ VIỆN NẶNG)
async function getGoogleAccessToken(sa) {
    const now = Math.floor(Date.now() / 1000);
    if (cachedToken && tokenExpiry > now + 60) {
        return cachedToken;
    }

    const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
    const claimSet = Buffer.from(JSON.stringify({
        iss: sa.client_email,
        scope: 'https://www.googleapis.com/auth/identitytoolkit https://www.googleapis.com/auth/firebase',
        aud: 'https://oauth2.googleapis.com/token',
        exp: now + 3600,
        iat: now
    })).toString('base64url');

    const sign = crypto.createSign('RSA-SHA256');
    sign.update(header + '.' + claimSet);
    const signature = sign.sign(sa.private_key, 'base64url');
    const jwt = header + '.' + claimSet + '.' + signature;

    const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: jwt
        })
    });

    const data = await res.json();
    if (!res.ok || !data.access_token) {
        throw new Error('Không thể xác thực Service Account với Google: ' + (data.error_description || data.error || JSON.stringify(data)));
    }

    cachedToken = data.access_token;
    tokenExpiry = now + (data.expires_in || 3600);
    return cachedToken;
}

// 4. TRA CỨU USERNAME / DISPLAYNAME TỪ FIREBASE AUTH NẾU CLIENT CHƯA TRUYỀN
async function lookupUserInfo(accessToken, email) {
    try {
        const res = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: [email] })
        });
        const data = await res.json();
        if (data && data.users && data.users.length > 0) {
            return data.users[0];
        }
    } catch (e) {
        console.error('Lỗi lookupUserInfo:', e);
    }
    return null;
}

// 5. CHUYỂN HƯỚNG LIÊN KẾT XÁC THỰC THẲNG VÀO TRANG MHEnt ID
function buildDirectActionLink(rawLink, fallbackType, targetEmail = '', displayName = '') {
    try {
        const parsed = new URL(rawLink);
        const mode = parsed.searchParams.get('mode') || fallbackType;
        const oobCode = parsed.searchParams.get('oobCode');
        const apiKey = parsed.searchParams.get('apiKey');
        const lang = parsed.searchParams.get('lang') || 'vi';

        if (oobCode) {
            const directUrl = new URL('https://accounts.mhentuniverse.com/auth-action.html');
            directUrl.searchParams.set('mode', mode);
            directUrl.searchParams.set('oobCode', oobCode);
            if (apiKey) directUrl.searchParams.set('apiKey', apiKey);
            if (lang) directUrl.searchParams.set('lang', lang);
            if (targetEmail) directUrl.searchParams.set('email', targetEmail);
            if (displayName) directUrl.searchParams.set('name', displayName);
            return directUrl.toString();
        }
    } catch (e) {
        console.error('Lỗi buildDirectActionLink:', e);
    }
    return rawLink;
}

// 6. GỌI IDENTITY TOOLKIT REST API ĐỂ TẠO LIÊN KẾT (TƯƠNG THÍCH MỌI PHIÊN BẢN NODE)
async function generateActionLink(accessToken, requestType, targetEmail, displayName = '', newEmail = null) {
    const bodyPayload = {
        requestType: requestType,
        email: targetEmail,
        returnOobLink: true
    };
    if (newEmail) {
        bodyPayload.newEmail = newEmail;
    }

    const res = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyPayload)
    });

    const data = await res.json();
    if (!res.ok) {
        const errMsg = data.error?.message || 'Lỗi khi tạo liên kết từ Identity Toolkit';
        const err = new Error(errMsg);
        err.code = data.error?.message;
        throw err;
    }

    if (!data.oobLink) {
        const err = new Error('Không tìm thấy tài khoản tương ứng với email này trong hệ thống MHEnt!');
        err.code = 'auth/user-not-found';
        throw err;
    }

    let fallbackType = 'resetPassword';
    if (requestType === 'VERIFY_EMAIL') fallbackType = 'verifyEmail';
    if (requestType === 'VERIFY_AND_CHANGE_EMAIL') fallbackType = 'verifyAndChangeEmail';

    return buildDirectActionLink(data.oobLink, fallbackType, targetEmail, displayName);
}

// 7. VERCEL SERVERLESS FUNCTION HANDLER
module.exports = async (req, res) => {
    // Thiết lập CORS đầy đủ cho toàn bộ hệ thống
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    // Xử lý Preflight OPTIONS tức thì
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ status: 'error', message: 'Phương thức không được hỗ trợ' });
    }

    try {
        let payload = req.body;
        if (typeof payload === 'string') {
            try { payload = JSON.parse(payload); } catch (e) { }
        }

        const { email, type, displayName, newEmail } = payload || {};
        const targetEmail = (email || '').trim();

        if (!targetEmail) {
            return res.status(400).json({ status: 'error', message: 'Thiếu địa chỉ email người nhận.' });
        }

        if (!type) {
            return res.status(400).json({ status: 'error', message: 'Thiếu tham số loại email (type).' });
        }

        const sa = getServiceAccount();
        if (!sa) {
            const err = new Error('Chưa cấu hình FIREBASE_SERVICE_ACCOUNT trên biến môi trường Vercel!');
            err.code = 'missing-service-account';
            throw err;
        }

        const accessToken = await getGoogleAccessToken(sa);

        // Lấy chính xác username / displayName thực tế của tài khoản
        let safeName = (displayName || '').trim();
        if (!safeName) {
            const userInfo = await lookupUserInfo(accessToken, targetEmail);
            if (userInfo && userInfo.displayName) {
                safeName = userInfo.displayName;
            } else {
                safeName = targetEmail.split('@')[0] || 'cậu';
            }
        }

        let actionLink = '';
        let subject = '';
        let htmlContent = '';
        let recipient = targetEmail;

        // CHỮ KÝ DOANH NGHIỆP CHÍNH THỨC CỦA MHENT
        const companySignature = `
            <div style="margin-top: 35px; border-top: 2px solid #4338ca; padding-top: 15px;">
                <div style="height: 2px; width: 70px; background-color: #4338ca; margin-bottom: 18px;"></div>
                <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                    <tr>
                        <td style="width: 90px; vertical-align: top; padding-right: 20px;">
                            <img src="https://www.mhentuniverse.com/assets/icon-logo.png" width="90" height="90" alt="MHEnt Logo" style="display: block; width: 90px; height: auto;">
                        </td>
                        <td style="vertical-align: top; font-size: 13.5px; line-height: 1.6; color: #334155;">
                            <div style="font-weight: 800; font-size: 15px; color: #4338ca; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px;">
                                MIYAZAKI HARUTO ENTERTAINMENT CO., LTD.
                            </div>
                            <div style="color: #64748b; font-size: 13px; margin-bottom: 12px;">
                                📍 Operating in Vietnam and Online World
                            </div>
                            <div style="margin-bottom: 3px;">
                                ✉️ <strong>Contact Email:</strong> <a href="mailto:contact@mhentuniverse.com" style="color: #4338ca; text-decoration: underline;">contact@mhentuniverse.com</a>
                            </div>
                            <div style="margin-bottom: 3px;">
                                ✉️ <strong>Support Email:</strong> <a href="mailto:support@mhentuniverse.com" style="color: #4338ca; text-decoration: underline;">support@mhentuniverse.com</a>
                            </div>
                            <div style="margin-bottom: 3px;">
                                🌐 <strong>Website:</strong> <a href="https://www.mhentuniverse.com" style="color: #4338ca; text-decoration: underline;">MHEnt. Universe</a>
                            </div>
                            <div style="margin-bottom: 10px;">
                                🔗 <strong>Contact with us:</strong> <a href="https://www.facebook.com/mharuto.entertainment" style="color: #4338ca; text-decoration: underline;">MHEnt. Facebook</a> | <a href="https://www.facebook.com/mhentuniverse" style="color: #4338ca; text-decoration: underline;">MHEnt. Universe Community</a>
                            </div>
                            <div style="font-style: italic; color: #94a3b8; font-size: 12.5px; margin-top: 8px;">
                                — Khơi nguồn sáng tạo vô tận —
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        `;

        // ==========================================
        // TRƯỜNG HỢP 1: QUÊN MẬT KHẨU (RESET PASSWORD)
        // ==========================================
        if (type === 'resetPassword') {
            actionLink = await generateActionLink(accessToken, 'PASSWORD_RESET', targetEmail, safeName);

            subject = '🗝️ Chìa khóa dự phòng cho tài khoản MHEnt của cậu đây!';
            htmlContent = `
                <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #334155; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 2px solid #fce7f3; border-radius: 20px; padding: 35px; background-color: #ffffff; box-shadow: 0 10px 30px rgba(244, 63, 94, 0.08);">
                    <div style="text-align: center; margin-bottom: 25px;">
                        <h2 style="color: #f43f5e; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 1px; font-weight: 800;">Miyazaki Haruto Entertainment</h2>
                        <div style="height: 4px; width: 60px; background: linear-gradient(90deg, #f43f5e, #fb7185); margin: 12px auto; border-radius: 10px;"></div>
                    </div>
                    
                    <p style="font-size: 16px;">Xin chào <strong>${safeName}</strong>,</p>
                    <p style="font-size: 16px;">Tớ nghe nói cậu lỡ làm rơi mất chìa khóa vào MHEnt. Universe rồi đúng hong? Đừng lo lắng nha, tớ đúc sẵn cho cậu một chiếc chìa khóa dự phòng rồi đây! 🛠️</p>
                    <p style="font-size: 16px;">Cậu hãy nhấn vào nút bên dưới để tạo lại mật khẩu mới nhé:</p>
                    
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="${actionLink}" style="display: inline-block; background: linear-gradient(135deg, #f43f5e, #fb7185); color: #ffffff !important; padding: 15px 35px; text-decoration: none; border-radius: 14px; font-weight: 800; font-size: 16px; box-shadow: 0 6px 20px rgba(244, 63, 94, 0.35); letter-spacing: 0.5px;">Tạo Mật Khẩu Mới</a>
                    </div>
                    
                    <p style="font-size: 14px; color: #64748b; background-color: #f8fafc; padding: 15px 18px; border-radius: 12px; border-left: 4px solid #f43f5e; margin: 25px 0;">
                        🔒 <strong>Lưu ý an toàn:</strong> Liên kết này chỉ có hiệu lực một lần duy nhất. Nếu cậu không yêu cầu đổi mật khẩu hoặc đã nhớ lại mật khẩu cũ, cậu chỉ cần phớt lờ email này nhé!
                    </p>
                    
                    <p style="font-size: 15px; margin-top: 30px;">
                        Nhớ giữ chìa khóa cẩn thận nha cậu ơi! ✨<br>
                        Thân mến,<br>
                        <strong style="color: #f43f5e; font-size: 16px;">Ban Quản Trị MHEnt. Universe</strong>
                    </p>
                    ${companySignature}
                </div>
            `;
        }
        // ==========================================
        // TRƯỜNG HỢP 2: XÁC MINH EMAIL (VERIFY EMAIL)
        // ==========================================
        else if (type === 'verifyEmail') {
            actionLink = await generateActionLink(accessToken, 'VERIFY_EMAIL', targetEmail, safeName);

            subject = '🌟 Kích hoạt thẻ căn cước đa vũ trụ MHEnt của cậu nè!';
            htmlContent = `
                <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #334155; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 2px solid #e0f2fe; border-radius: 20px; padding: 35px; background-color: #ffffff; box-shadow: 0 10px 30px rgba(14, 165, 233, 0.08);">
                    <div style="text-align: center; margin-bottom: 25px;">
                        <h2 style="color: #0ea5e9; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 1px; font-weight: 800;">Miyazaki Haruto Entertainment</h2>
                        <div style="height: 4px; width: 60px; background: linear-gradient(90deg, #0ea5e9, #38bdf8); margin: 12px auto; border-radius: 10px;"></div>
                    </div>
                    
                    <p style="font-size: 16px;">Xin chào <strong>${safeName}</strong>,</p>
                    <p style="font-size: 16px;">Chào mừng cậu đã đặt chân đến đa vũ trụ MHEnt nha! 🎉</p>
                    <p style="font-size: 16px;">Để hoàn tất việc cấp "thẻ căn cước" và bắt đầu hành trình khám phá các trạm không gian (Cinema, Game, Edu, Study...), cậu nhấn vào nút bên dưới để xác minh email chính chủ giúp tớ nhé:</p>
                    
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="${actionLink}" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9, #38bdf8); color: #ffffff !important; padding: 15px 35px; text-decoration: none; border-radius: 14px; font-weight: 800; font-size: 16px; box-shadow: 0 6px 20px rgba(14, 165, 233, 0.35); letter-spacing: 0.5px;">Kích Hoạt Tài Khoản</a>
                    </div>
                    
                    <p style="font-size: 14px; color: #64748b; background-color: #f8fafc; padding: 15px 18px; border-radius: 12px; border-left: 4px solid #0ea5e9; margin: 25px 0;">
                        Nếu cậu không đăng ký tài khoản này, cậu có thể bỏ qua thư này một cách an toàn.
                    </p>
                    
                    <p style="font-size: 15px; margin-top: 30px;">
                        Hẹn gặp cậu tại Đại Sảnh MHEnt! 🚀<br>
                        Thân mến,<br>
                        <strong style="color: #0ea5e9; font-size: 16px;">Ban Quản Trị MHEnt. Universe</strong>
                    </p>
                    ${companySignature}
                </div>
            `;
        }
        // ==========================================
        // TRƯỜNG HỢP 3: ĐỔI SANG EMAIL MỚI (CHANGE EMAIL)
        // ==========================================
        else if (type === 'changeEmail') {
            if (!newEmail) {
                return res.status(400).json({ status: 'error', message: 'Chưa cung cấp địa chỉ email mới.' });
            }

            actionLink = await generateActionLink(accessToken, 'VERIFY_AND_CHANGE_EMAIL', targetEmail, safeName, newEmail);
            recipient = newEmail;

            subject = '💌 Xác nhận chuyển sang hòm thư mới tại MHEnt. Universe!';
            htmlContent = `
                <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #334155; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 2px solid #ede9fe; border-radius: 20px; padding: 35px; background-color: #ffffff; box-shadow: 0 10px 30px rgba(139, 92, 246, 0.08);">
                    <div style="text-align: center; margin-bottom: 25px;">
                        <h2 style="color: #8b5cf6; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 1px; font-weight: 800;">Miyazaki Haruto Entertainment</h2>
                        <div style="height: 4px; width: 60px; background: linear-gradient(90deg, #8b5cf6, #a78bfa); margin: 12px auto; border-radius: 10px;"></div>
                    </div>
                    
                    <p style="font-size: 16px;">Xin chào <strong>${safeName}</strong>,</p>
                    <p style="font-size: 16px;">Tớ vừa nhận được yêu cầu đổi địa chỉ liên lạc của tài khoản MHEnt sang hòm thư mới này (<strong>${newEmail}</strong>).</p>
                    <p style="font-size: 16px;">Để xác nhận đây đúng là nhà mới của cậu, cậu nhấn vào nút bên dưới giúp tớ nha:</p>
                    
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="${actionLink}" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6, #a78bfa); color: #ffffff !important; padding: 15px 35px; text-decoration: none; border-radius: 14px; font-weight: 800; font-size: 16px; box-shadow: 0 6px 20px rgba(139, 92, 246, 0.35); letter-spacing: 0.5px;">Xác Nhận Đổi Email</a>
                    </div>
                    
                    <p style="font-size: 14px; color: #ef4444; background-color: #fef2f2; padding: 15px 18px; border-radius: 12px; border-left: 4px solid #ef4444; margin: 25px 0;">
                        ⚠️ Nếu cậu không hề thực hiện yêu cầu này, hãy lập tức bỏ qua email và kiểm tra lại bảo mật tài khoản nhé!
                    </p>
                    
                    <p style="font-size: 15px; margin-top: 30px;">
                        Chúc cậu một ngày thật vui vẻ! 🌸<br>
                        Thân mến,<br>
                        <strong style="color: #8b5cf6; font-size: 16px;">Ban Quản Trị MHEnt. Universe</strong>
                    </p>
                    ${companySignature}
                </div>
            `;
        }
        else {
            return res.status(400).json({ status: 'error', message: "Loại yêu cầu không hợp lệ. Hỗ trợ: 'resetPassword', 'verifyEmail', 'changeEmail'." });
        }

        // Gửi email qua Google Workspace SMTP chính chủ
        await transporter.sendMail({
            from: '"Miyazaki Haruto Entertainment" <noreply@mhentuniverse.com>',
            to: recipient,
            replyTo: 'contact@mhentuniverse.com',
            subject: subject,
            html: htmlContent
        });

        return res.status(200).json({
            status: 'success',
            message: `Đã gửi thư [${type}] thành công từ noreply@mhentuniverse.com tới ${recipient}!`,
            targetEmail: recipient,
            displayName: safeName
        });

    } catch (error) {
        console.error('Lỗi gửi mail xác thực qua Vercel API:', error);
        
        let clientMsg = error.message;
        if (error.code === 'auth/user-not-found' || error.message?.includes('EMAIL_NOT_FOUND')) {
            clientMsg = 'Không tìm thấy tài khoản tương ứng với email này trong hệ thống MHEnt!';
        } else if (error.code === 'auth/invalid-email' || error.message?.includes('INVALID_EMAIL')) {
            clientMsg = 'Địa chỉ email không đúng định dạng.';
        } else if (error.code === 'missing-service-account') {
            clientMsg = 'Hệ thống máy chủ chưa cấu hình FIREBASE_SERVICE_ACCOUNT. Vui lòng cấu hình trên Vercel Environment Variables.';
        }

        return res.status(500).json({
            status: 'error',
            message: clientMsg,
            code: error.code || 'internal-error'
        });
    }
};
