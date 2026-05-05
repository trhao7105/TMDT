# iLocker Database - Neon PostgreSQL

Repo này chứa toàn bộ mã nguồn cơ sở dữ liệu cho hệ thống **iLocker**.  
Cơ sở dữ liệu được triển khai trên **Neon PostgreSQL** và được quản lý bằng các file SQL riêng biệt theo kiến trúc modular.

## 📋 Tổng Quan

Hệ thống iLocker là nền tảng quản lý dịch vụ lưu trữ thông minh, hỗ trợ các nghiệp vụ chính:

- 👥 Quản lý người dùng, phân quyền và vai trò
- 📦 Quản lý loại dịch vụ lưu trữ (Full-service, Smart locker)
- 🏢 Quản lý địa điểm, kích thước lưu trữ và storage unit
- 🛒 Quản lý đơn thuê, chi tiết đơn thuê và dịch vụ bổ sung
- 💳 Quản lý thanh toán và webhook từ cổng thanh toán
- 🔑 Quản lý phiên thuê thực tế (rental sessions)
- 🔐 Quản lý QR, OTP, PIN truy cập
- 📊 Quản lý lịch sử truy cập tủ/kho
- 🎟️ Quản lý ticket hỗ trợ, tin nhắn hỗ trợ, thông báo
- 📝 Quản lý audit log cho mục đích kiểm toán

---

## 1. Công Nghệ Sử Dụng

| Công Nghệ | Mục Đích |
|-----------|---------|
| **PostgreSQL** | Hệ quản trị cơ sở dữ liệu mã nguồn mở, mạnh mẽ |
| **Neon** | Dịch vụ PostgreSQL serverless trên cloud |
| **Node.js** | Runtime để chạy các script tự động hóa |
| **pg** | Driver kết nối PostgreSQL từ Node.js |
| **dotenv** | Quản lý biến môi trường từ file `.env` |
| **VSCode** | Editor để chỉnh sửa code SQL và JavaScript |

---

## 2. Cấu Trúc Thư Mục

```text
ilocker-db/
├── sql/                          # Các file SQL database
│   ├── 01_schema.sql            # Schema, bảng, index (chạy đầu tiên)
│   ├── 02_seed.sql              # Dữ liệu mẫu demo
│   ├── 03_functions.sql         # Stored procedures & functions
│   ├── 04_triggers.sql          # Triggers cho business logic
│   └── 99_reset.sql             # Reset database (xóa tất cả dữ liệu)
├── scripts/                       # Node.js scripts
│   ├── test-connection.js       # Kiểm tra kết nối database
│   └── run-sql.js               # Chạy file SQL bất kỳ
├── .env                          # Biến môi trường (không commit)
├── .env.example                  # Template .env
├── .gitignore                    # Git ignore rules
├── package.json                  # Project metadata & npm scripts
├── package-lock.json            # Lock file cho dependencies
└── README.md                     # Tài liệu này
```

---

## 3. Yêu Cầu Hệ Thống

- **Node.js**: v14+ (khuyến nghị v16+)
- **npm**: v6+
- **PostgreSQL**: v12+ (hoặc Neon cloud)
- **Internet**: Để kết nối Neon cloud

---

## 4. Cài Đặt & Cấu Hình

### 4.1 Clone Repository
```bash
git clone <repository-url>
cd ilocker-db
```

### 4.2 Cài Đặt Dependencies
```bash
npm install
```

### 4.3 Tạo File `.env`

Sao chép từ `.env.example` và điền thông tin kết nối database:

```bash
cp .env.example .env
```

Chỉnh sửa `.env`:
```env
# Neon PostgreSQL connection string
# Format: postgresql://user:password@host/database
DATABASE_URL=postgresql://user:password@ep-xxxx.neon.tech/ilocker?sslmode=require

# Hoặc sử dụng PostgreSQL local (nếu có)
# DATABASE_URL=postgresql://postgres:password@localhost:5432/ilocker
```

**Cách lấy DATABASE_URL từ Neon:**
1. Đăng nhập vào Neon Console (https://console.neon.tech)
2. Chọn project → Copy "Connection string"
3. Paste vào `.env`

### 4.4 Kiểm Tra Kết Nối
```bash
npm run db:test
```

Nếu thành công, sẽ hiển thị phiên bản PostgreSQL.

---

## 5. Chạy Database Setup

### Option A: Setup Hoàn Chỉnh (Khuyến Nghị)
Chạy tất cả scripts theo thứ tự đúng:
```bash
npm run db:setup
```

Điều này tương đương với:
```bash
npm run db:schema    # Tạo schema, bảng, index
npm run db:functions # Tạo stored procedures
npm run db:triggers  # Tạo triggers
npm run db:seed      # Insert dữ liệu mẫu
```

### Option B: Chạy Riêng Lẻ
```bash
# Tạo schema
npm run db:schema

# Tạo functions & procedures
npm run db:functions

# Tạo triggers
npm run db:triggers

# Insert dữ liệu mẫu
npm run db:seed
```

### Option C: Reset Database (Xóa Tất Cả)
```bash
npm run db:reset
```

⚠️ **Cảnh báo**: Lệnh này sẽ xóa tất cả bảng và dữ liệu!

---

## 6. Chi Tiết Các File SQL

### 6.1 `01_schema.sql` - Schema & Bảng

Tạo 21 bảng chính:

| Bảng | Mô Tả |
|------|-------|
| **roles** | Các vai trò (customer, staff, admin) |
| **users** | Thông tin người dùng |
| **service_types** | Loại dịch vụ (Full-service, Smart locker) |
| **locations** | Địa điểm lưu trữ (quận, thành phố) |
| **storage_sizes** | Kích thước lưu trữ (XXS, XS, S, M, L, XL, XXL) |
| **storage_units** | Từng đơn vị lưu trữ cụ thể |
| **duration_options** | Các gói thời hạn thuê (1 ngày, 3 tháng, 12 tháng) |
| **protection_plans** | Gói bảo vệ (Basic, Standard, Premium) |
| **addon_services** | Dịch vụ bổ sung (Đóng gói, Vận chuyển, Kiểm kê) |
| **rental_orders** | Đơn thuê (master order) |
| **rental_order_items** | Chi tiết đơn thuê (items trong order) |
| **order_addons** | Dịch vụ bổ sung trong đơn |
| **payments** | Thanh toán (MoMo, VNPay, etc.) |
| **payment_webhooks** | Webhook từ cổng thanh toán |
| **rentals** | Phiên thuê thực tế (session) |
| **access_credentials** | QR, OTP, PIN truy cập |
| **unit_access_logs** | Lịch sử mở tủ/kho |
| **support_tickets** | Ticket hỗ trợ khách hàng |
| **support_messages** | Tin nhắn trong ticket |
| **notifications** | Thông báo cho người dùng |
| **audit_logs** | Log kiểm toán hoạt động |

Các bảng có quan hệ khóa ngoại chặt chẽ để đảm bảo tính toàn vẹn dữ liệu.

**Indexes được tạo:**
- Các chỉ mục cho foreign keys (tốc độ JOIN)
- Index trạng thái: `status`, `order_status`, `rental_status`, `payment_status`
- Index thời gian: `created_at`, `event_time`
- Index tìm kiếm: `user_id`, `order_id`, `location_id`, `unit_id`

### 6.2 `02_seed.sql` - Dữ Liệu Mẫu

Cung cấp dữ liệu demo để test:
- 10 người dùng (customer, staff, admin)
- 3 loại dịch vụ
- 5 địa điểm lưu trữ
- 9 kích thước lưu trữ
- 10 đơn vị lưu trữ
- 5 gói thời hạn
- 5 gói bảo vệ
- 5 dịch vụ bổ sung
- 6 đơn thuê mẫu (với các trạng thái khác nhau)
- Thanh toán và rental sessions liên quan

### 6.3 `03_functions.sql` - Stored Procedures & Functions

#### Procedures (CRUD):
1. **sp_create_storage_unit()** - Tạo unit mới
   - Validate location, size, unit_code, IoT device_id
   - Check duplicate unit_code
   - Validate temperature, humidity range

2. **sp_update_storage_unit()** - Cập nhật unit
   - Validate tất cả field
   - Check constraint, duplicate

3. **sp_delete_storage_unit()** - Xóa unit
   - Check unit không còn rental hoặc access log

#### Query Functions:
4. **fn_find_storage_units()** - Tìm units
   - Filter by location, status
   - Join 4 bảng (units, locations, sizes, service_types)
   - ORDER BY location, unit_code

5. **fn_revenue_by_service_type()** - Revenue report
   - SUM(payment amount) GROUP BY service_type
   - Filter by date range
   - HAVING minimum revenue
   - Tính average payment

#### Calculation Functions:
6. **fn_calculate_order_total()** - Tính tổng đơn
   - Sum storage_fee + protection_fee từ items
   - Sum addon fees
   - Subtract discount
   - Validate order exists

7. **fn_get_user_total_spending()** - Tổng chi tiêu user
   - Sum tất cả payments của user
   - Chỉ tính paid orders

8. **fn_estimate_addon_total()** - Ước tính chi phí addon
   - Hỗ trợ 3 loại pricing: `fixed`, `per_box`, `per_km`
   - Tính extra fee nếu vượt threshold

### 6.4 `04_triggers.sql` - Business Logic Triggers

#### Trigger 1: Auto `updated_at`
- Tự động cập nhật `updated_at` khi UPDATE
- Áp dụng cho: users, rental_orders, support_tickets

#### Trigger 2: Recalculate Order Total
- Tự động cập nhật `rental_orders.total_amount`
- Khi INSERT/UPDATE/DELETE `rental_order_items`
- Khi INSERT/UPDATE/DELETE `order_addons`
- Khi UPDATE `discount_amount`

#### Trigger 3: Validate Rental
- Validate rental trước khi INSERT/UPDATE
- Check order status phải là 'paid', 'active', hoặc 'completed'
- Check item_id phải thuộc order_id
- Check unit_id phải match với item
- Check user_id phải match
- Check không có 2 rental active/overdue cùng unit

#### Trigger 4: Refresh Unit Status
- Auto update `storage_units.status`
- Nếu có rental active/overdue → `occupied`
- Nếu không có → `available`
- Deactivate credentials khi rental completed/cancelled

#### Trigger 5: Validate Access Credential
- Active credential chỉ thuộc rental active/overdue
- Validate trước INSERT/UPDATE

---

## 7. Sơ Đồ Quan Hệ Bảng

### Entity Relationships:
```
roles
  ↓
users
  ├→ rental_orders → rental_order_items → storage_units → storage_sizes → service_types
  │                                         ↓
  │                                    access_credentials
  │                                         ↓
  │                                    unit_access_logs
  ├→ rentals → access_credentials
  ├→ support_tickets → support_messages
  └→ notifications

rental_orders
  ├→ order_addons
  ├→ payments → payment_webhooks
  └→ rental_order_items → protection_plans
                        → duration_options
                        → storage_sizes
                        → addon_services
```

---

## 8. Npm Scripts

| Script | Mục Đích |
|--------|---------|
| `npm run db:test` | Kiểm tra kết nối database |
| `npm run db:schema` | Tạo schema và bảng |
| `npm run db:functions` | Tạo stored procedures |
| `npm run db:triggers` | Tạo triggers |
| `npm run db:seed` | Insert dữ liệu mẫu |
| `npm run db:reset` | Xóa tất cả dữ liệu |
| `npm run db:setup` | Chạy tất cả (schema → functions → triggers → seed) |

---

## 9. Quy Trình Khởi Tạo Database

```mermaid
graph LR
    A["1. Setup<br/>npm run db:setup"] --> B["✓ Schema<br/>21 bảng"]
    B --> C["✓ Functions<br/>CRUD & Queries"]
    C --> D["✓ Triggers<br/>Business Logic"]
    D --> E["✓ Seed Data<br/>Test Data"]
    E --> F["Ready! 🚀"]
    
    style A fill:#4CAF50,color:#fff
    style F fill:#2196F3,color:#fff
```

---

## 10. Ví Dụ Sử Dụng

### Kiểm tra kết nối:
```bash
npm run db:test
# Output: Connected to Neon PostgreSQL successfully.
```

### Reset database (⚠️ Cẩn thận!):
```bash
npm run db:reset
npm run db:setup  # Khôi phục lại
```

### Chạy file SQL tùy chỉnh:
```bash
node scripts/run-sql.js sql/custom-query.sql
```

---

## 11. Cấu Trúc Naming Convention

Dự án tuân theo naming convention:
- **Bảng**: lowercase, snake_case (ví dụ: `rental_orders`)
- **Column**: lowercase, snake_case (ví dụ: `order_id`)
- **Primary Key**: `{table}_id` (ví dụ: `order_id`)
- **Foreign Key**: `{table}_id` (ví dụ: `user_id`)
- **Function**: `fn_` prefix (ví dụ: `fn_calculate_order_total()`)
- **Procedure**: `sp_` prefix (ví dụ: `sp_create_storage_unit()`)
- **Trigger**: `trg_` prefix (ví dụ: `trg_users_set_updated_at`)
- **Index**: `idx_` prefix (ví dụ: `idx_users_role_id`)

---

## 12. Status & Enum Values

### Order Status:
- `pending` - Chờ thanh toán
- `paid` - Đã thanh toán
- `active` - Đang hoạt động
- `completed` - Hoàn thành
- `cancelled` - Đã hủy

### Rental Status:
- `reserved` - Đã đặt trước
- `active` - Đang sử dụng
- `overdue` - Quá hạn
- `completed` - Hoàn thành
- `cancelled` - Đã hủy

### Payment Status:
- `pending` - Chờ xác nhận
- `success` - Thành công
- `failed` - Thất bại
- `cancelled` - Đã hủy

### Unit Status:
- `available` - Sẵn sàng
- `reserved` - Đã đặt
- `occupied` - Đang sử dụng
- `maintenance` - Bảo trì
- `inactive` - Không hoạt động

### User Status:
- `active` - Hoạt động
- `inactive` - Không hoạt động
- `suspended` - Bị khóa
- `deleted` - Đã xóa

---

## 13. Troubleshooting

### Lỗi: "Missing DATABASE_URL in .env"
**Giải pháp:**
```bash
cp .env.example .env
# Chỉnh sửa .env với DATABASE_URL đúng
```

### Lỗi: "Failed to connect to database"
- Kiểm tra DATABASE_URL có đúng không
- Kiểm tra internet kết nối (nếu Neon cloud)
- Kiểm tra firewall/network rules
- Thử: `npm run db:test`

### Lỗi: "relation already exists"
- File SQL được chạy nhiều lần
- Sử dụng `IF NOT EXISTS` (tất cả CREATE statements)
- Hoặc `npm run db:reset && npm run db:setup`

### Lỗi: "foreign key violation"
- Chạy seed.sql trước schema
- Hoặc đơn hàng sai
- Sử dụng `npm run db:setup` (tự động order đúng)

---

## 14. Hỗ Trợ & Đóng Góp

- 📧 Email: support@ilocker.dev
- 🐛 Báo cáo bug: Tạo issue trên GitHub
- 💡 Gợi ý: Discussions hoặc pull request

---

## 15. License

MIT License - Tự do sử dụng cho mục đích thương mại và cá nhân.

---

**Cập nhật lần cuối:** May 2026

