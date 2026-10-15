const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { initializeApp, cert, getApps, getApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

// 1. CẤU HÌNH BƯU TÁ GMAIL / GOOGLE WORKSPACE SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mhent@mhentuniverse.com',
        pass: 'jjlbdlgpnjnnmqjn'
    }
});

// 2. TẢI THÔNG TIN SERVICE ACCOUNT
function getServiceAccount() {
    // Ưu tiên 1: Biến môi trường trên Vercel (Chuẩn an toàn production)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        } catch (e) {
            console.error('Lỗi phân tích cú pháp FIREBASE_SERVICE_ACCOUNT:', e);
        }
    }

    // Ưu tiên 2: File Service Account cục bộ
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
                return JSON.parse(fs.readFileSync(filePath, 'utf8'));
            } catch (err) {
                console.error(`Lỗi đọc file ${filePath}:`, err);
            }
        }
    }

    return null;
}

function getFirebaseAuth() {
    if (getApps().length > 0) {
        return getAuth(getApp());
    }

    const serviceAccount = getServiceAccount();
    if (serviceAccount) {
        const app = initializeApp({
            credential: cert(serviceAccount)
        });
        return getAuth(app);
    }

    // Fallback nếu có Google Cloud default credentials
    const app = initializeApp();
    return getAuth(app);
}

// 3. VERCEL SERVERLESS HANDLER
module.exports = async (req, res) => {
    // Bật CORS cho toàn bộ hệ sinh thái MHEnt Universe
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

        const auth = getFirebaseAuth();

        const actionCodeSettings = {
            url: 'https://accounts.mhentuniverse.com/auth-action',
            handleCodeInApp: false
        };

        let actionLink = '';
        let subject = '';
        let htmlContent = '';
        let recipient = targetEmail;
        const safeName = displayName || targetEmail.split('@')[0] || 'cậu';

        // ==========================================
        // CHỮ KÝ DOANH NGHIỆP CHÍNH THỨC CỦA MHENT
        // ==========================================
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

        async function createActionLink(generatorFn, ...args) {
            let settings = {
                url: 'https://accounts.mhentuniverse.com/auth-action',
                handleCodeInApp: false
            };
            try {
                return await generatorFn(...args, settings);
            } catch (err) {
                if (err.code === 'auth/unauthorized-continue-uri') {
                    settings.url = 'https://mhentuniverse.com/auth-action.html';
                    return await generatorFn(...args, settings);
                }
                throw err;
            }
        }

        // ==========================================
        // TRƯỜNG HỢP 1: QUÊN MẬT KHẨU (RESET PASSWORD)
        // ==========================================
        if (type === 'resetPassword') {
            actionLink = await createActionLink((e, s) => auth.generatePasswordResetLink(e, s), targetEmail);

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
            actionLink = await createActionLink((e, s) => auth.generateEmailVerificationLink(e, s), targetEmail);

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

            actionLink = await createActionLink((e, ne, s) => auth.generateVerifyAndChangeEmailLink(e, ne, s), targetEmail, newEmail);
            recipient = newEmail; // Gửi đến hòm thư mới để xác nhận

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
            targetEmail: recipient
        });

    } catch (error) {
        console.error('Lỗi gửi mail xác thực qua Vercel API:', error);
        
        let clientMsg = error.message;
        if (error.code === 'auth/user-not-found') {
            clientMsg = 'Không tìm thấy tài khoản tương ứng với email này trong hệ thống MHEnt!';
        } else if (error.code === 'auth/invalid-email') {
            clientMsg = 'Địa chỉ email không đúng định dạng.';
        }

        return res.status(500).json({
            status: 'error',
            message: clientMsg,
            code: error.code || 'internal-error'
        });
    }
};
