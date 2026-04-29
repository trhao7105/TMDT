# iClocker Frontend (React TSX + Vite + Tailwind v4)

Dự án frontend cho hệ thống Thương mại điện tử cung cấp giải pháp kho trữ thông minh **iClocker**.
Hệ thống giao diện được nâng cấp toàn diện bằng **React (TypeScript)**, build process siêu tốc bằng **Vite**, cùng với thư viện component **Shadcn UI**, **Radix UI** và hệ thống CSS class từ **TailwindCSS v4**.

## 🚀 Hướng Dẫn Cài Đặt và Khởi Chạy

Bạn cần có **Node.js** (>= 18.x) trong máy tính. Hãy bắt đầu từ thư mục `frontend/`:

### Cài đặt tất cả phụ thuộc (Dependencies)
```bash
npm install
```

### Chạy Server Frontend (Môi trường Dev)
```bash
npm run dev
```

Sau khi Terminal báo thành công, bạn mở **http://localhost:5173/** trên trình duyệt! Code của bạn sẽ được thiết lập cơ chế HMR (Hot Module Replacement) - tức là nếu bạn thay đổi file `.tsx` thì Web sẽ tự load lại mà không cần tải lại trang.

## 📂 Kiến Trúc Mã Nguồn Cơ Bản
Dự án được phân bổ chủ yếu trong thư mục `src`:
- `src/main.tsx` & `src/app/App.tsx`: Cốt lõi khởi chạy và bọc toàn bộ ứng dụng.
- `src/app/routes.tsx`: Bộ điều hướng định tuyến (Routing) sử dụng `react-router` v7.
- `src/api/axios.js`: Cấu hình kết nối và gửi/nhận Token với hệ thống Backend (FastAPI).
- `src/app/components/ui/`: Kho tàng các component giao diện xịn xò từ Shadcn UI và Radix.
- `src/app/pages/`: Danh sách các Trang (Pages/Views) giao diện hệ thống:
  - `HomePage.tsx`
  - `ServicesPage.tsx`
  - `StorageSelectionPage.tsx`
  - `DashboardPage.tsx`
  - `LoginPage.tsx` & `RegisterPage.tsx` (Kết nối trực tiếp với API của Backend bằng Axios).
