# MHEnt Universe Apps (apps.mhentuniverse.com)

Official Software Hub & Distribution Portal for **Miyazaki Haruto Entertainment Co., Ltd.**

---

## 🚀 Cấu trúc dự án
- `index.html`: Trang chủ Software Hub giới thiệu tất cả các ứng dụng.
- `horizon.html`: Trang chi tiết & tải về **AISA Horizon** (môi trường IDE).
- `orbit.html`: Trang chi tiết & tải về **AISA Orbit** (trạm điều khiển AI Agent).
- `assets/`: Chứa logo chính thức của AISA Horizon và AISA Orbit.
- `css/style.css`: Giao diện Dark Celestial / Cyberpunk tối ưu trải nghiệm người dùng.
- `js/config.js`: Nơi điều chỉnh link tải file (`downloadUrl`) và version của các app.
- `vercel.json`: Cấu hình clean URLs & routing cho subdomain `apps.mhentuniverse.com`.

---

## 📦 Cách đưa lên GitHub & Vercel (1-Click)

### 1. Khởi tạo Git & Push lên GitHub:
Tạo một repository mới trên GitHub đặt tên là `mhent-apps`, sau đó chạy các lệnh sau trong thư mục `mhent-apps`:
```bash
git init
git add .
git commit -m "feat: initial commit for apps.mhentuniverse.com"
git branch -M main
git remote add origin https://github.com/<your-username>/mhent-apps.git
git push -u origin main
```

### 2. Kết nối với Vercel:
1. Truy cập [vercel.com](https://vercel.com) $\rightarrow$ Bấm **Add New...** $\rightarrow$ **Project**.
2. Chọn repo `mhent-apps` vừa tạo và bấm **Deploy**.
3. Vào mục **Settings** $\rightarrow$ **Domains** $\rightarrow$ Thêm domain: `apps.mhentuniverse.com`.
4. Cấu hình bản ghi CNAME trên DNS nhà cung cấp domain:
   - Name: `apps`
   - Value: `cname.vercel-dns.com`

---

## 📥 Cập nhật link tải Installer:
Mở file `js/config.js` và thay thế URL của `downloadUrl` bằng đường link GitHub Release của bạn:
```javascript
horizon: {
  downloadUrl: "https://github.com/.../AISA.Horizon.Setup.exe"
},
orbit: {
  downloadUrl: "https://github.com/.../AISA.Orbit.Setup.exe"
}
```
