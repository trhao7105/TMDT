# Kiến Trúc Hệ Thống - Dự án TMDT

Dựa trên việc phân tích cấu trúc thư mục và các tệp cấu hình, dưới đây là kiến trúc hệ thống của dự án **TMDT**.

## 1. Tổng quan Kiến trúc
Hệ thống được thiết kế theo mô hình **Client-Server** tách biệt, sử dụng các công nghệ hiện đại để đảm bảo hiệu năng và khả năng mở rộng.

```mermaid
graph TD
    User((Người dùng)) -->|Truy cập| Frontend[Frontend - React SPA]
    Frontend -->|Gọi API - Axios| Backend[Backend - FastAPI]
    Backend -->|ORM - SQLAlchemy| DB[(Database - PostgreSQL)]
    Backend -->|Xác thực| JWT[JWT Authentication]
```

---

## 2. Các thành phần chi tiết

### A. Frontend (Client Side)
Được đặt trong thư mục `/frontend`.
- **Công nghệ chính**: 
    - **Framework**: [React](https://react.dev/) (v18+) khởi tạo bằng **Vite**.
    - **Ngôn ngữ**: TypeScript.
    - **Styling**: [Tailwind CSS](https://tailwindcss.com/) kết hợp với **Radix UI** (Shadcn UI) mang lại giao diện hiện đại, responsive.
    - **Quản lý Routing**: `react-router`.
    - **Giao tiếp API**: `axios`.
- **Đặc điểm**: Ứng dụng trang đơn (SPA), tải nhanh và trải nghiệm mượt mà.

### B. Backend (Server Side)
Được đặt trong thư mục `/backend`.
- **Công nghệ chính**:
    - **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python).
    - **Server**: Uvicorn (ASGI).
    - **ORM**: SQLAlchemy (để tương tác với Database dưới dạng Object).
    - **Migration**: Alembic (quản lý phiên bản cấu trúc database).
    - **Validation**: Pydantic (định nghĩa schemas cho dữ liệu vào/ra).
- **Cấu trúc thư mục `app/`**:
    - `main.py`: Điểm khởi chạy ứng dụng.
    - `routers/`: Chứa các định nghĩa API endpoints.
    - `models/`: Định nghĩa cấu trúc các bảng trong database.
    - `schemas/`: Định nghĩa dữ liệu truyền tải (DTO).
    - `services/`: Chứa logic nghiệp vụ xử lý dữ liệu.

### C. Database (Data Layer)
- **Hệ quản trị**: **PostgreSQL**.
- **Quản lý**: Các script khởi tạo và cấu trúc được lưu trong thư mục `/database`.
- **Kết nối**: Backend kết nối tới DB thông qua biến môi trường định nghĩa trong tệp `.env`.

---

## 3. Luồng hoạt động chính (Workflow)

1.  **Giao diện**: Người dùng tương tác với giao diện React.
2.  **Yêu cầu**: Frontend gửi yêu cầu HTTP (GET, POST, PUT, DELETE) kèm theo Token JWT (nếu đã đăng nhập) tới Backend.
3.  **Xử lý**: Backend nhận yêu cầu, kiểm tra xác thực, sau đó gọi các Service để xử lý nghiệp vụ.
4.  **Dữ liệu**: Service tương tác với Database thông qua SQLAlchemy Models để truy vấn hoặc cập nhật dữ liệu.
5.  **Phản hồi**: Backend trả về dữ liệu dưới dạng JSON cho Frontend để hiển thị cho người dùng.

## 4. Công nghệ bổ trợ
- **Xác thực**: Sử dụng **JWT** (JSON Web Token) để bảo mật các API.
- **Môi trường**: Sử dụng tệp `.env` để quản lý các cấu hình nhạy cảm (DB URL, Secret Key).
- **Icons**: Sử dụng `Lucide React` và `MUI Icons`.
