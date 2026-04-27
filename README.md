# Dự án Thương Mại Điện Tử (TMDT)

Dự án này là một hệ thống thương mại điện tử bao gồm hai phần chính: 
- **Frontend**: Xây dựng bằng ReactJS, Vite và TailwindCSS.
- **Backend**: Xây dựng bằng Python (FastAPI).

---

## 🛠️ Yêu cầu môi trường (Prerequisites)

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt các công cụ sau:
- [Node.js](https://nodejs.org/en/) (phiên bản 18.x trở lên) và `npm` (dành cho Frontend).
- [Python](https://www.python.org/downloads/) (phiên bản 3.9 trở lên) (dành cho Backend).
- [Git](https://git-scm.com/) để clone dự án.

---

## 🚀 Hướng dẫn cài đặt và khởi chạy (Getting Started)

### 1. Clone dự án

Đầu tiên, tải dự án về máy tính của bạn:

```bash
git clone <địa-chỉ-chứa-git-của-bạn>
cd TMDT
```

### 2. Khởi chạy Frontend (React + Vite)

Frontend được đặt trong thư mục `frontend/ux-ui`. Để chạy Frontend, bạn mở một terminal và thực hiện các lệnh sau:

```bash
# Di chuyển vào thư mục frontend
cd frontend/ux-ui

# Cài đặt các gói phụ thuộc (dependencies)
npm install

# Khởi chạy server phát triển (Development Server)
npm run dev
```

Sau khi quá trình khởi chạy hoàn tất, hãy truy cập vào đường dẫn được cung cấp ở terminal (thường là `http://localhost:5173/`) để xem giao diện web.

### 3. Khởi chạy Backend (Python)

Backend được đặt trong thư mục `backend`. Bạn cần tạo môi trường ảo (virtual environment) và cài đặt các thư viện cần thiết trước khi chạy. Mở một terminal mới (kiểu chia đôi màn hình hoặc mở cửa sổ mới song song với frontend) và thực hiện:

```bash
# Di chuyển vào thư mục backend
cd backend

# Thiết lập môi trường ảo (Virtual Environment)
python -m venv venv

# Kích hoạt môi trường ảo:
# Dành cho Windows:
venv\Scripts\activate
# Dành cho macOS/Linux:
source venv/bin/activate

# Cài đặt các thư viện phụ thuộc
pip install -r requirements.txt

# Khởi chạy server backend (FastAPI)
uvicorn app.main:app --reload
```

---

## 📂 Cấu trúc dự án

```text
TMDT/
├── backend/               # Code Backend (FastAPI - Python)
│   ├── app/               # Thư mục chứa logic chính (main.py, models, routers, v.v.)
│   ├── .env               # File chứa biến môi trường (không push lên Git)
│   ├── venv/              # Môi trường ảo (không push lên Git)
│   └── requirements.txt   # File cấu hình chứa danh sách thư viện Python
└── frontend/ux-ui/        # Code Frontend (ReactJS + Vite + Tailwind)
    ├── src/               # Thư mục chứa code của các component, views, v.v.
    ├── package.json       # File cấu hình thư viện Node.js
    └── vite.config.js     # Cấu hình Vite
```
