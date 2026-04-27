# iClocker Frontend (React + Vite)

Dự án frontend cho hệ thống Thương mại điện tử cung cấp giải pháp kho trữ thông minh **iClocker**.
Hệ thống giao diện được xây dựng bằng **React**, build process đóng gói bằng **Vite**, và styled hoàn toàn bằng **TailwindCSS**.

## 🚀 Hướng Dẫn Cài Đặt và Khởi Chạy

Bạn cần có **Node.js** (>= 18.x) trong máy tính. Hãy bắt đầu từ thư mục `frontend/ux-ui/`:

### Cài đặt tất cả phụ thuộc (Dependencies)
```bash
npm install
```

### Chạy Sever Frontend (Môi trường Dev)
```bash
npm run dev
```

Sau khi Terminal báo thành công, bạn mở **http://localhost:5173/** trên trình duyệt! Code của bạn sẽ được thiết lập cơ chế HMR (Hot Module Replacement) - tức là nếu bạn thay đổi file `.jsx` thì Web sẽ tự load lại mà không cần F5.

## 📂 Kiến Trúc Mã Nguồn Cơ Bản
Dự án được phân bổ chủ yếu trong thư mục `src`:
- `src/App.jsx`: Cốt lõi của mọi luồng điều hướng (Sử dụng `react-router-dom`).
- `src/index.css`: Căn chỉnh Typography (Family font, Weight), color scheme (Dark mode/Light mode variables của Material), và reset CSS.
- `src/pages/`: Danh sách các Trang (Pages/Views):
  - `Home.jsx`
  - `Services.jsx`
  - `Order.jsx` (Xử lý State Size tủ Lockers và Total Price).
  - `Support.jsx` (Giao diện FAQs & Contact).
  - `Login.jsx` & `Signup.jsx` (Điều hướng Auth).
