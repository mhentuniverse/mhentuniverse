const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// 1. CẤU HÌNH BƯU TÁ GMAIL (Thay bằng mật khẩu ứng dụng 16 chữ của cậu)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mhent@mhentuniverse.com', // Email gửi đi
        pass: 'jjlbdlgpnjnnmqjn' // Mật khẩu ứng dụng 16 chữ
    }
});

// 2. HÀM TỔNG XỬ LÝ MAIL TỰ ĐỘNG
exports.sendCustomAuthEmail = functions.https.onCall(async (data, context) => {
    // Nhận các thông số từ giao diện Web truyền lên
    const { email, type, displayName, newEmail } = data;

    let actionLink = '';
    let subject = '';
    let htmlContent = '';
    let safeName = displayName || "cậu";
    let targetEmail = email; // Mặc định gửi vào email hiện tại

    // 🌟 TRICK QUAN TRỌNG: Ép link phải trỏ về tên miền xịn của MHEnt
    const actionCodeSettings = {
        url: 'https://mhentuniverse.com/auth-action.html',
        handleCodeInApp: false
    };

    try {
        // ==========================================
        // TRƯỜNG HỢP 1: QUÊN MẬT KHẨU (RESET PASSWORD)
        // ==========================================
        if (type === 'resetPassword') {
            actionLink = await admin.auth().generatePasswordResetLink(email, actionCodeSettings);

            subject = '🗝️ Chìa khóa dự phòng cho tài khoản MHEnt của cậu đây!';
            htmlContent = `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #334155; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 2px solid #fce7f3; border-radius: 16px; padding: 30px; background-color: #ffffff; box-shadow: 0 10px 25px rgba(244, 63, 94, 0.05);">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="color: #f43f5e; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 1px;">Miyazaki Haruto Entertainment</h2>
                        <div style="height: 3px; width: 50px; background-color: #f43f5e; margin: 10px auto; border-radius: 10px;"></div>
                    </div>
                    <p style="font-size: 16px;">Xin chào <strong>${safeName}</strong>,</p>
                    <p style="font-size: 16px;">Tớ nghe nói cậu lỡ làm rơi mất chìa khóa vào MHEnt. Universe rồi đúng hong? Đừng lo nha, tớ đúc sẵn cho cậu một chiếc chìa khóa dự phòng rồi đây! 🛠️</p>
                    <p style="font-size: 16px;">Cậu hãy nhấn vào nút bên dưới để thiết lập lại mật khẩu mới nhé:</p>
                    
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="${actionLink}" style="background: linear-gradient(135deg, #f43f5e, #fb7185); color: white; padding: 14px 30px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(244, 63, 94, 0.3);">Tạo Mật Khẩu Mới</a>
                    </div>
                    
                    <p style="font-size: 14px; color: #64748b; background-color: #f8fafc; padding: 15px; border-radius: 8px;">Link này chỉ có tác dụng một lần thôi á. Nếu cậu đột nhiên nhớ ra mật khẩu cũ hoặc không hề yêu cầu đổi mật khẩu, thì cứ phớt lờ chiếc mail này nha.</p>
                    <p style="font-size: 16px; margin-top: 30px;">Nhớ giữ chìa khóa cẩn thận nha cậu ơi!<br>Thân mến,<br><strong style="color: #f43f5e;">Ban Quản Trị MHEnt. Universe</strong></p>
                </div>
            `;
        }
        // ==========================================
        // TRƯỜNG HỢP 2: XÁC MINH TÀI KHOẢN (VERIFY EMAIL)
        // ==========================================
        else if (type === 'verifyEmail') {
            actionLink = await admin.auth().generateEmailVerificationLink(email, actionCodeSettings);

            subject = '🌟 Kích hoạt thẻ căn cước đa vũ trụ MHEnt của cậu nè!';
            htmlContent = `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #334155; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 2px solid #e0f2fe; border-radius: 16px; padding: 30px; background-color: #ffffff; box-shadow: 0 10px 25px rgba(14, 165, 233, 0.05);">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="color: #0ea5e9; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 1px;">Miyazaki Haruto Entertainment</h2>
                        <div style="height: 3px; width: 50px; background-color: #0ea5e9; margin: 10px auto; border-radius: 10px;"></div>
                    </div>
                    <p style="font-size: 16px;">Xin chào <strong>${safeName}</strong>,</p>
                    <p style="font-size: 16px;">Chào mừng cậu đã đặt chân đến vũ trụ MHEnt nha! 🎉</p>
                    <p style="font-size: 16px;">Để hoàn tất việc cấp "thẻ căn cước" và bắt đầu hành trình khám phá các trạm không gian (Cinema, Game, Edu...), cậu nhấn vào nút bên dưới để xác minh email chính chủ giúp tớ nhé:</p>
                    
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="${actionLink}" style="background: linear-gradient(135deg, #0ea5e9, #38bdf8); color: white; padding: 14px 30px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);">Kích Hoạt Tài Khoản</a>
                    </div>
                    
                    <p style="font-size: 14px; color: #64748b; background-color: #f8fafc; padding: 15px; border-radius: 8px;">Nếu cậu không tạo tài khoản này thì cứ bơ chiếc mail này đi nha, không sao cả đâu.</p>
                    <p style="font-size: 16px; margin-top: 30px;">Hẹn gặp cậu tại Đại Sảnh!<br>Thân mến,<br><strong style="color: #0ea5e9;">Ban Quản Trị MHEnt. Universe</strong></p>
                </div>
            `;
        }
        // ==========================================
        // TRƯỜNG HỢP 3: ĐỔI SANG EMAIL MỚI (CHANGE EMAIL)
        // ==========================================
        else if (type === 'changeEmail') {
            if (!newEmail) throw new Error("Chưa cung cấp địa chỉ email mới để chuyển nhà!");

            // Link xác nhận sẽ được gửi đến email MỚI để verify
            actionLink = await admin.auth().generateVerifyAndChangeEmailLink(email, newEmail, actionCodeSettings);
            targetEmail = newEmail; // Chuyển đích đến là email mới

            subject = '💌 Xác nhận dời nhà sang hòm thư mới tại MHEnt. Universe!';
            htmlContent = `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #334155; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 2px solid #ede9fe; border-radius: 16px; padding: 30px; background-color: #ffffff; box-shadow: 0 10px 25px rgba(139, 92, 246, 0.05);">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="color: #8b5cf6; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 1px;">Miyazaki Haruto Entertainment</h2>
                        <div style="height: 3px; width: 50px; background-color: #8b5cf6; margin: 10px auto; border-radius: 10px;"></div>
                    </div>
                    <p style="font-size: 16px;">Xin chào <strong>${safeName}</strong>,</p>
                    <p style="font-size: 16px;">Tớ vừa nhận được yêu cầu đổi địa chỉ liên lạc của thẻ căn cước MHEnt sang hòm thư mới này (<strong>${newEmail}</strong>).</p>
                    <p style="font-size: 16px;">Để xác nhận đây đúng là nhà mới của cậu, cậu nhấn vào nút bên dưới giúp tớ nha:</p>
                    
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="${actionLink}" style="background: linear-gradient(135deg, #8b5cf6, #a78bfa); color: white; padding: 14px 30px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);">Xác Nhận Đổi Email</a>
                    </div>
                    
                    <p style="font-size: 14px; color: #ef4444; background-color: #fef2f2; padding: 15px; border-radius: 8px;">Nếu cậu không hề yêu cầu đổi email, hãy lập tức bỏ qua mail này và kiểm tra lại bảo mật tài khoản của mình nhé!</p>
                    <p style="font-size: 16px; margin-top: 30px;">Chúc cậu một ngày vui vẻ!<br>Thân mến,<br><strong style="color: #8b5cf6;">Ban Quản Trị MHEnt. Universe</strong></p>
                </div>
            `;
        }
        else {
            throw new Error("Mã lệnh gửi mail không hợp lệ. Vui lòng kiểm tra lại tham số 'type'.");
        }

        // 3. XUẤT LỆNH GỬI MAIL
        await transporter.sendMail({
            from: '"Miyazaki Haruto Entertainment" <noreply@mhentuniverse.com>',
            to: targetEmail,
            replyTo: 'support@mhentuniverse.com',
            subject: subject,
            html: htmlContent
        });

        return { success: true, message: `Thư [${type}] đã được chuyển phát an toàn!` };

    } catch (error) {
        console.error(`Lỗi hệ thống khi gửi mail [${type}]:`, error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});

// ==========================================
// 3. API XUẤT CSV CHO GOOGLE SHEET (=IMPORTDATA)
// ==========================================
exports.exportFormCSV = functions.https.onRequest(async (req, res) => {
    // CORS headers cho Google và trình duyệt
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    const formId = req.query.id;
    if (!formId) {
        res.status(400).send("Thiếu tham số 'id' của biểu mẫu.");
        return;
    }

    try {
        const formDoc = await admin.firestore().collection("mhent_forms").doc(formId).get();
        if (!formDoc.exists) {
            res.status(404).send("Biểu mẫu không tồn tại.");
            return;
        }

        const formData = formDoc.data();
        const presets = formData.presets || {};
        const fields = (formData.fields || []).filter(q => q.type !== 'section');

        const responsesSnap = await admin.firestore().collection("mhent_form_responses")
            .where("formId", "==", formId)
            .get();

        const responses = [];
        responsesSnap.forEach(doc => responses.push(doc.data()));

        // Sắp xếp theo submittedAt / clientTimestamp tăng dần
        responses.sort((a, b) => {
            const tA = a.submittedAt?.toMillis ? a.submittedAt.toMillis() : new Date(a.clientTimestamp || 0).getTime();
            const tB = b.submittedAt?.toMillis ? b.submittedAt.toMillis() : new Date(b.clientTimestamp || 0).getTime();
            return tA - tB;
        });

        const showName = (presets.name !== false) || responses.some(r => !!r.userName);
        const showEmail = (presets.email !== false) || responses.some(r => !!r.userEmail);
        const showPhone = !!presets.phone || responses.some(r => !!r.userPhone);
        const showOrg = !!presets.org || responses.some(r => !!r.userOrg);

        const headers = ["STT", "Thời gian nộp", "Trạng thái"];
        if (showName) headers.push("Họ và tên");
        if (showEmail) headers.push("Email");
        if (showPhone) headers.push("Số điện thoại");
        if (showOrg) headers.push("Đơn vị / Lớp");
        fields.forEach(q => headers.push(q.title));
        headers.push("Ghi chú");

        const rows = [];
        responses.forEach((r, idx) => {
            const dateStr = r.submittedAt?.toDate ? r.submittedAt.toDate().toLocaleString('vi-VN') : (r.clientTimestamp ? new Date(r.clientTimestamp).toLocaleString('vi-VN') : '');
            const row = [idx + 1, dateStr, r.status || 'Chờ duyệt'];

            if (showName) row.push(r.userName || '');
            if (showEmail) row.push(r.userEmail || '');
            if (showPhone) row.push(r.userPhone || '');
            if (showOrg) row.push(r.userOrg || '');

            fields.forEach(q => {
                let val = (r.answers && r.answers[q.id] !== undefined) ? r.answers[q.id] : '';
                if (Array.isArray(val)) val = val.join('; ');
                row.push(val);
            });

            row.push(r.note || '');
            rows.push(row);
        });

        let csvContent = "\uFEFF"; // UTF-8 BOM
        const allRows = [headers, ...rows];
        allRows.forEach(rowArr => {
            const line = rowArr.map(cell => `"${String(cell !== undefined && cell !== null ? cell : '').replace(/"/g, '""')}"`).join(',');
            csvContent += line + "\r\n";
        });

        res.set('Content-Type', 'text/csv; charset=utf-8');
        res.set('Cache-Control', 'public, max-age=60, s-maxage=60'); // Cache 60s
        res.status(200).send(csvContent);

    } catch (err) {
        console.error("Lỗi xuất CSV cho Google Sheet:", err);
        res.status(500).send("Lỗi máy chủ khi xuất CSV: " + err.message);
    }
});

// ==========================================
// 4. API GỬI VÉ ĐIỆN TỬ CHECK-IN (E-TICKET) TỪ NOREPLY@MHENTUNIVERSE.COM
// ==========================================
exports.sendTicketEmail = functions.https.onCall(async (data, context) => {
    const { email, to, targetEmail, subject, html, htmlBody, body, senderName } = data || {};
    const recipient = (email || to || targetEmail || '').trim();
    if (!recipient) {
        throw new functions.https.HttpsError('invalid-argument', 'Thiếu địa chỉ email người nhận.');
    }

    const mailSubject = subject || '🎟️ [Vé Tham Dự] E-Ticket MHEnt';
    const content = html || htmlBody || body || '';
    const fromName = senderName || 'MHEnt. Universe (No-Reply)';

    try {
        await transporter.sendMail({
            from: `"${fromName}" <noreply@mhentuniverse.com>`,
            to: recipient,
            replyTo: data.replyTo || 'support@mhentuniverse.com',
            subject: mailSubject,
            html: content
        });

        return { success: true, message: 'Đã gửi vé E-Ticket thành công từ noreply@mhentuniverse.com!' };
    } catch (error) {
        console.error('Lỗi khi gửi email vé E-Ticket:', error);
        throw new functions.https.HttpsError('internal', error.message || 'Lỗi gửi email qua máy chủ.');
    }
});

// ==========================================
// 5. ENDPOINT HTTP GỬI EMAIL CHÍNH THỨC (CORS ĐẦY ĐỦ)
// ==========================================
exports.sendEmailHttp = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ status: 'error', message: 'Phương thức không được hỗ trợ' });
        return;
    }

    try {
        let payload = req.body;
        if (typeof payload === 'string') {
            try { payload = JSON.parse(payload); } catch (e) { }
        }

        const { emails, email, to, targetEmail, subject, body, html, htmlBody, senderName, replyTo } = payload || {};
        const recipients = emails || (email || to || targetEmail ? [email || to || targetEmail] : []);

        if (!recipients || recipients.length === 0) {
            res.status(400).json({ status: 'error', message: 'Thiếu email người nhận.' });
            return;
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

        res.status(200).json({ status: 'success', message: 'Đã gửi thư thành công từ noreply@mhentuniverse.com!' });
    } catch (error) {
        console.error('Lỗi gửi mail HTTP:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});