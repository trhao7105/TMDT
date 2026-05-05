# iClocker Backend API (FastAPI + PostgreSQL)

Hệ thống Backend cho giải pháp kho trữ thông minh **iClocker**, được xây dựng bằng **Python FastAPI**, kết nối cơ sở dữ liệu **PostgreSQL** (Neon Cloud) thông qua **SQLAlchemy ORM**.

---

## 🛠️ Yêu Cầu Hệ Thống

- **Python** 3.9 trở lên
- **pip** (trình quản lý gói Python)
- Kết nối tới database **PostgreSQL** (Neon Cloud hoặc local)

---

## 🚀 Hướng Dẫn Cài Đặt và Khởi Chạy

Thực hiện tất cả lệnh bên dưới từ thư mục `backend/`.

### Bước 1: Tạo và kích hoạt môi trường ảo

```bash
# Tạo môi trường ảo
python -m venv venv

# Kích hoạt (Windows)
venv\Scripts\activate

# Kích hoạt (macOS / Linux)
source venv/bin/activate
```

### Bước 2: Cài đặt thư viện

```bash
pip install -r requirements.txt
```

### Bước 3: Cấu hình biến môi trường

Tạo file `.env` trong thư mục `backend/` với nội dung sau:

```env
# Chuỗi kết nối PostgreSQL (Neon Cloud hoặc local)
DATABASE_URL=postgresql://user:password@host:port/dbname

# Khóa bí mật dùng để ký JWT (nên đặt chuỗi ngẫu nhiên dài >= 32 ký tự)
SECRET_KEY=your_very_long_random_secret_key_here

# Thuật toán mã hóa JWT
ALGORITHM=HS256

# Thời gian hết hạn token (phút)
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Cấu hình gửi email xác thực (SMTP)
MAIL_USERNAME=your_email@example.com
MAIL_PASSWORD=your_email_password
MAIL_FROM=your_email@example.com
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
```

> **Lưu ý:** File `.env` đã được thêm vào `.gitignore` và **không được commit** lên Git.

### Bước 4: Khởi chạy server

```bash
uvicorn app.main:app --reload
```

Server sẽ khởi động tại **`http://127.0.0.1:8000`**.

- **Swagger UI (API Docs):** http://127.0.0.1:8000/docs
- **ReDoc:** http://127.0.0.1:8000/redoc

---

## 📂 Cấu Trúc Thư Mục

```text
backend/
├── app/
│   ├── main.py           # Khởi tạo FastAPI app, CORS, đăng ký routers
│   ├── database.py       # Cấu hình SQLAlchemy engine và session
│   ├── models/
│   │   └── all_models.py # Toàn bộ SQLAlchemy models (mapping bảng DB)
│   ├── routers/
│   │   ├── auth.py       # API xác thực: đăng ký, đăng nhập, verify email
│   │   ├── services.py   # API dữ liệu: danh sách kho, gói thời gian, bảo vệ
│   │   └── orders.py     # API đơn hàng: checkout, xem lịch sử đơn
│   ├── schemas/
│   │   └── user.py       # Pydantic schemas cho request/response
│   └── services/
│       ├── security.py   # Logic JWT, băm mật khẩu, tạo token
│       └── email.py      # Logic gửi email xác thực
├── .env                  # Biến môi trường (KHÔNG commit lên Git)
├── .gitignore
├── requirements.txt      # Danh sách thư viện Python
└── README.md
```

---

## 🔌 Danh Sách API Endpoints

### Authentication — `/api/auth`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `POST` | `/api/auth/signup` | Đăng ký tài khoản mới (gửi email xác thực) |
| `POST` | `/api/auth/login` | Đăng nhập, nhận JWT access token |
| `GET`  | `/api/auth/verify-email?token=...` | Kích hoạt tài khoản qua link email |

### Services — `/api/services`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/services/sizes` | Lấy danh sách kích thước kho (Full-service & Self-storage) |
| `GET` | `/api/services/options` | Lấy danh sách gói thời hạn, gói bảo vệ, dịch vụ bổ sung |

### Orders — `/api/orders` *(Yêu cầu đăng nhập)*

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `POST` | `/api/orders/checkout` | Tạo đơn hàng mới sau khi hoàn tất thanh toán |
| `GET`  | `/api/orders/my-orders` | Lấy danh sách đơn hàng của người dùng hiện tại |

---

## 🗃️ Quy Trình Xác Thực (Auth Flow)

```
Đăng ký (/signup)
    → Tạo user với status = 'inactive'
    → Gửi email chứa link xác thực

Click link email (/verify-email?token=...)
    → Xác thực token
    → Cập nhật status = 'active'
    → Redirect về trang Login

Đăng nhập (/login)
    → Kiểm tra email + mật khẩu
    → Kiểm tra status = 'active'
    → Trả về JWT Bearer Token

Gọi API bảo vệ (Authorization: Bearer <token>)
    → Middleware giải mã JWT
    → Xác định người dùng hiện tại
```

---

## 🛠️ Công Nghệ Sử Dụng

| Thư viện | Phiên bản | Mục đích |
|----------|-----------|----------|
| **fastapi** | Latest | Framework web async hiệu năng cao |
| **uvicorn** | Latest | ASGI server chạy ứng dụng FastAPI |
| **sqlalchemy** | Latest | ORM mapping Python ↔ PostgreSQL |
| **psycopg2-binary** | Latest | Driver kết nối PostgreSQL |
| **python-dotenv** | Latest | Đọc biến môi trường từ file `.env` |
| **pyjwt** | Latest | Tạo và xác thực JSON Web Tokens |
| **passlib** + **bcrypt** | Latest | Băm và xác minh mật khẩu an toàn |
| **python-multipart** | Latest | Xử lý form data |
| **email-validator** | Latest | Validate định dạng email |

---

## ⚠️ Lưu Ý Quan Trọng

- **CORS** được cấu hình cho phép origin `http://localhost:5173` (Frontend Vite dev server). Khi deploy production, cần cập nhật lại danh sách origin cho phù hợp.
- Giá trị `SECRET_KEY` trong `.env` phải đủ dài và ngẫu nhiên. **Không dùng giá trị mặc định** trong môi trường production.
- Đơn hàng chỉ được hiển thị trong Dashboard khi có đầy đủ thông tin chi tiết (items). Các đơn không hợp lệ sẽ tự động bị bỏ qua.
