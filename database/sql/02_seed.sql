BEGIN;

-- =========================================================
-- 02_seed.sql
-- Seed sample data for iLocker database
-- =========================================================

-- =========================================================
-- 1. roles
-- =========================================================
INSERT INTO roles (role_id, role_name, description)
VALUES
    (1, 'customer', 'Khách hàng sử dụng dịch vụ lưu trữ'),
    (2, 'staff', 'Nhân viên hỗ trợ và vận hành kho/tủ'),
    (3, 'admin', 'Quản trị viên hệ thống')
ON CONFLICT (role_id) DO NOTHING;

-- =========================================================
-- 2. users
-- password_hash dùng dữ liệu demo, không phải hash thật
-- =========================================================
INSERT INTO users (
    user_id, role_id, full_name, email, phone, password_hash, status
)
VALUES
    (1, 1, 'Nguyễn Văn An', 'an.customer@example.com', '0901000001', 'demo_hash_001', 'active'),
    (2, 1, 'Trần Thị Bình', 'binh.customer@example.com', '0901000002', 'demo_hash_002', 'active'),
    (3, 1, 'Lê Minh Cường', 'cuong.customer@example.com', '0901000003', 'demo_hash_003', 'active'),
    (4, 1, 'Phạm Gia Hân', 'han.customer@example.com', '0901000004', 'demo_hash_004', 'active'),
    (5, 1, 'Võ Nhật Nam', 'nam.customer@example.com', '0901000005', 'demo_hash_005', 'active'),
    (6, 2, 'Đỗ Hoàng Long', 'long.staff@example.com', '0902000001', 'demo_hash_006', 'active'),
    (7, 2, 'Mai Thu Trang', 'trang.staff@example.com', '0902000002', 'demo_hash_007', 'active'),
    (8, 2, 'Ngô Quốc Việt', 'viet.staff@example.com', '0902000003', 'demo_hash_008', 'active'),
    (9, 3, 'Admin iLocker', 'admin@example.com', '0903000001', 'demo_hash_009', 'active'),
    (10, 3, 'System Manager', 'manager@example.com', '0903000002', 'demo_hash_010', 'active')
ON CONFLICT (user_id) DO NOTHING;

-- =========================================================
-- 3. service_types
-- =========================================================
INSERT INTO service_types (
    service_type_id, service_code, service_name, description, status
)
VALUES
    (1, 'FULL_SERVICE', 'Thuê kho lưu trữ trọn gói', 'iLocker hỗ trợ đóng gói, vận chuyển và lưu trữ tại kho trung tâm', 'active'),
    (2, 'SELF_STORAGE', 'Thuê kho tự quản', 'Khách hàng tự quản lý không gian lưu trữ và có thể truy cập theo quy định', 'active'),
    (3, 'SMART_LOCKER', 'Tủ khóa thông minh', 'Khách hàng thuê ngăn tủ thông minh và mở bằng QR/OTP/PIN', 'active')
ON CONFLICT (service_type_id) DO NOTHING;

-- =========================================================
-- 4. locations
-- =========================================================
INSERT INTO locations (
    location_id, location_name, address, district, city,
    latitude, longitude, open_time, close_time, is_24_7, status
)
VALUES
    (1, 'iLocker Quận 1', '12 Nguyễn Huệ, Phường Bến Nghé', 'Quận 1', 'TP.HCM', 10.7731000, 106.7042000, '07:00', '22:00', FALSE, 'active'),
    (2, 'iLocker Quận 7', '45 Nguyễn Thị Thập, Phường Tân Phú', 'Quận 7', 'TP.HCM', 10.7299000, 106.7217000, '06:00', '23:00', FALSE, 'active'),
    (3, 'Kho trung tâm Thủ Đức', '99 Võ Văn Ngân, Phường Linh Chiểu', 'Thủ Đức', 'TP.HCM', 10.8499000, 106.7719000, NULL, NULL, TRUE, 'active'),
    (4, 'iLocker Bình Thạnh', '22 Xô Viết Nghệ Tĩnh, Phường 21', 'Bình Thạnh', 'TP.HCM', 10.8044000, 106.7078000, '07:00', '21:00', FALSE, 'active'),
    (5, 'iLocker Tân Bình', '18 Cộng Hòa, Phường 4', 'Tân Bình', 'TP.HCM', 10.8015000, 106.6520000, '07:00', '22:00', FALSE, 'active')
ON CONFLICT (location_id) DO NOTHING;

-- =========================================================
-- 5. storage_sizes
-- =========================================================
INSERT INTO storage_sizes (
    size_id, service_type_id, size_code, size_name, volume_m3,
    width_cm, height_cm, depth_cm, base_price, description, status
)
VALUES
    (1, 1, 'XXS', 'Full-service XXS', 2.00, 100, 100, 200, 495000, 'Không gian nhỏ cho đồ cá nhân', 'active'),
    (2, 1, 'S', 'Full-service S', 5.00, 150, 150, 220, 1195000, 'Phù hợp đồ ký túc xá hoặc phòng nhỏ', 'active'),
    (3, 1, 'M', 'Full-service M', 10.00, 200, 200, 250, 2195000, 'Phù hợp nhiều thùng đồ và nội thất nhỏ', 'active'),
    (4, 2, '1M3', 'Self-storage 1m3', 1.00, 100, 100, 100, 395000, 'Kho tự quản 1 mét khối', 'active'),
    (5, 2, '3M3', 'Self-storage 3m3', 3.00, 150, 150, 150, 995000, 'Kho tự quản 3 mét khối', 'active'),
    (6, 2, '6M3', 'Self-storage 6m3', 6.00, 200, 200, 150, 1895000, 'Kho tự quản 6 mét khối', 'active'),
    (7, 3, 'LOCKER_S', 'Smart Locker Small', 0.20, 40, 40, 50, 30000, 'Ngăn tủ nhỏ theo ngày', 'active'),
    (8, 3, 'LOCKER_M', 'Smart Locker Medium', 0.50, 60, 60, 70, 50000, 'Ngăn tủ trung bình theo ngày', 'active'),
    (9, 3, 'LOCKER_L', 'Smart Locker Large', 0.90, 80, 80, 90, 80000, 'Ngăn tủ lớn theo ngày', 'active')
ON CONFLICT (size_id) DO NOTHING;

-- =========================================================
-- 6. storage_units
-- =========================================================
INSERT INTO storage_units (
    unit_id, location_id, size_id, unit_code, iot_device_id,
    status, current_temperature, current_humidity
)
VALUES
    (1, 1, 7, 'Q1-LK-S-001', 'IOT-Q1-001', 'available', 27.50, 60.00),
    (2, 1, 8, 'Q1-LK-M-001', 'IOT-Q1-002', 'reserved', 27.20, 59.00),
    (3, 2, 9, 'Q7-LK-L-001', 'IOT-Q7-001', 'occupied', 28.00, 62.00),
    (4, 2, 4, 'Q7-SS-1M3-001', 'IOT-Q7-002', 'available', 28.10, 61.00),
    (5, 2, 5, 'Q7-SS-3M3-001', 'IOT-Q7-003', 'occupied', 28.30, 63.00),
    (6, 3, 1, 'TD-FS-XXS-001', 'IOT-TD-001', 'available', 26.00, 58.00),
    (7, 3, 2, 'TD-FS-S-001', 'IOT-TD-002', 'reserved', 26.20, 57.00),
    (8, 3, 3, 'TD-FS-M-001', 'IOT-TD-003', 'occupied', 26.40, 56.00),
    (9, 4, 8, 'BT-LK-M-001', 'IOT-BT-001', 'maintenance', 29.00, 65.00),
    (10, 5, 7, 'TB-LK-S-001', 'IOT-TB-001', 'available', 28.50, 64.00)
ON CONFLICT (unit_id) DO NOTHING;

-- =========================================================
-- 7. duration_options
-- =========================================================
INSERT INTO duration_options (
    duration_id, duration_name, duration_months, multiplier, description, status
)
VALUES
    (1, '1 ngày', 0.03, 1.00, 'Gói thuê theo ngày, dùng cho smart locker', 'active'),
    (2, '1 tháng', 1.00, 1.00, 'Gói thuê tiêu chuẩn 1 tháng', 'active'),
    (3, '3 tháng', 3.00, 2.85, 'Gói thuê 3 tháng có ưu đãi', 'active'),
    (4, '6 tháng', 6.00, 5.40, 'Gói thuê 6 tháng có ưu đãi', 'active'),
    (5, '12 tháng', 12.00, 10.20, 'Gói thuê 12 tháng tiết kiệm nhất', 'active')
ON CONFLICT (duration_id) DO NOTHING;

-- =========================================================
-- 8. protection_plans
-- =========================================================
INSERT INTO protection_plans (
    protection_plan_id, plan_name, monthly_price, coverage_description, status
)
VALUES
    (1, 'Basic', 0, 'Bảo vệ cơ bản, không thu thêm phí', 'active'),
    (2, 'Silver', 49000, 'Gói bảo vệ mở rộng cho tài sản giá trị thấp', 'active'),
    (3, 'Gold', 99000, 'Gói bảo vệ phổ biến cho tài sản trung bình', 'active'),
    (4, 'Platinum', 199000, 'Gói bảo vệ cao cấp cho tài sản giá trị cao', 'active'),
    (5, 'Business', 299000, 'Gói bảo vệ dành cho khách hàng doanh nghiệp', 'active')
ON CONFLICT (protection_plan_id) DO NOTHING;

-- =========================================================
-- 9. addon_services
-- =========================================================
INSERT INTO addon_services (
    addon_id, addon_code, addon_name, pricing_type, base_price,
    extra_price, free_threshold, unit_name, description, status
)
VALUES
    (1, 'PACKING', 'Đóng gói vật dụng', 'per_box', 0, 25000, 0, 'box', 'Tính phí theo số thùng đóng gói', 'active'),
    (2, 'TRANSPORT', 'Vận chuyển tận nơi', 'per_km', 50000, 12000, 5, 'km', 'Miễn phí 5km đầu, tính thêm theo km', 'active'),
    (3, 'PICKUP', 'Nhận đồ tại nhà', 'fixed', 80000, 0, 0, 'trip', 'Phí nhận đồ tại nhà theo lượt', 'active'),
    (4, 'DELIVERY', 'Giao trả đồ tận nơi', 'fixed', 80000, 0, 0, 'trip', 'Phí giao trả đồ theo lượt', 'active'),
    (5, 'INSPECTION', 'Kiểm kê tài sản', 'fixed', 50000, 0, 0, 'time', 'Dịch vụ kiểm kê và ghi nhận tài sản', 'active')
ON CONFLICT (addon_id) DO NOTHING;

-- =========================================================
-- 10. rental_orders
-- =========================================================
INSERT INTO rental_orders (
    order_id, user_id, service_type_id, location_id, order_code,
    order_status, storage_fee, protection_fee, addon_fee,
    discount_amount, total_amount, created_at, updated_at
)
VALUES
    (1, 1, 3, 1, 'ORD-2026-0001', 'paid', 50000, 0, 50000, 0, 100000, '2026-05-01 08:00:00+07', '2026-05-01 08:10:00+07'),
    (2, 2, 2, 2, 'ORD-2026-0002', 'active', 2835750, 297000, 125000, 100000, 3157750, '2026-05-01 09:00:00+07', '2026-05-01 09:30:00+07'),
    (3, 3, 1, 3, 'ORD-2026-0003', 'active', 6127650, 597000, 180000, 200000, 6704650, '2026-05-02 10:00:00+07', '2026-05-02 10:30:00+07'),
    (4, 4, 3, 5, 'ORD-2026-0004', 'pending_payment', 30000, 0, 0, 0, 30000, '2026-05-02 11:00:00+07', '2026-05-02 11:00:00+07'),
    (5, 5, 2, 2, 'ORD-2026-0005', 'completed', 995000, 49000, 80000, 0, 1124000, '2026-04-01 08:00:00+07', '2026-05-01 08:00:00+07'),
    (6, 1, 1, 3, 'ORD-2026-0006', 'cancelled', 1195000, 0, 0, 0, 1195000, '2026-04-25 14:00:00+07', '2026-04-25 15:00:00+07')
ON CONFLICT (order_id) DO NOTHING;

-- =========================================================
-- 11. rental_order_items
-- =========================================================
INSERT INTO rental_order_items (
    item_id, order_id, unit_id, size_id, duration_id, protection_plan_id,
    start_time, end_time, base_price, duration_multiplier,
    storage_fee, protection_fee, item_status
)
VALUES
    (1, 1, 2, 8, 1, 1, '2026-05-01 08:30:00+07', '2026-05-02 08:30:00+07', 50000, 1.00, 50000, 0, 'reserved'),
    (2, 2, 5, 5, 3, 3, '2026-05-01 10:00:00+07', '2026-08-01 10:00:00+07', 995000, 2.85, 2835750, 297000, 'active'),
    (3, 3, 8, 3, 3, 4, '2026-05-02 11:00:00+07', '2026-08-02 11:00:00+07', 2195000, 2.85, 6255750, 597000, 'active'),
    (4, 4, 10, 7, 1, 1, '2026-05-03 09:00:00+07', '2026-05-04 09:00:00+07', 30000, 1.00, 30000, 0, 'pending'),
    (5, 5, 4, 4, 2, 2, '2026-04-01 09:00:00+07', '2026-05-01 09:00:00+07', 395000, 1.00, 395000, 49000, 'completed'),
    (6, 6, 7, 2, 2, 1, '2026-04-26 09:00:00+07', '2026-05-26 09:00:00+07', 1195000, 1.00, 1195000, 0, 'cancelled')
ON CONFLICT (item_id) DO NOTHING;

-- =========================================================
-- 12. order_addons
-- =========================================================
INSERT INTO order_addons (
    order_addon_id, order_id, addon_id, quantity,
    distance_km, box_count, unit_price, total_price
)
VALUES
    (1, 1, 5, 1, 0, 0, 50000, 50000),
    (2, 2, 1, 5, 0, 5, 25000, 125000),
    (3, 3, 2, 1, 12, 0, 134000, 134000),
    (4, 3, 3, 1, 0, 0, 80000, 80000),
    (5, 5, 4, 1, 0, 0, 80000, 80000),
    (6, 6, 5, 1, 0, 0, 50000, 50000)
ON CONFLICT (order_addon_id) DO NOTHING;

-- =========================================================
-- 13. payments
-- =========================================================
INSERT INTO payments (
    payment_id, order_id, payment_method, payment_provider,
    amount, currency, payment_status, provider_transaction_id,
    paid_at, created_at
)
VALUES
    (1, 1, 'momo', 'MoMo', 100000, 'VND', 'success', 'MOMO-0001', '2026-05-01 08:10:00+07', '2026-05-01 08:05:00+07'),
    (2, 2, 'vnpay', 'VNPay', 3157750, 'VND', 'success', 'VNPAY-0002', '2026-05-01 09:30:00+07', '2026-05-01 09:20:00+07'),
    (3, 3, 'bank_transfer', 'Banking', 6704650, 'VND', 'success', 'BANK-0003', '2026-05-02 10:30:00+07', '2026-05-02 10:15:00+07'),
    (4, 4, 'card', 'Stripe', 30000, 'VND', 'pending', 'CARD-0004', NULL, '2026-05-02 11:05:00+07'),
    (5, 5, 'cash', 'Cashier', 1124000, 'VND', 'success', 'CASH-0005', '2026-04-01 08:30:00+07', '2026-04-01 08:20:00+07'),
    (6, 6, 'vnpay', 'VNPay', 1195000, 'VND', 'cancelled', 'VNPAY-0006', NULL, '2026-04-25 14:10:00+07')
ON CONFLICT (payment_id) DO NOTHING;

-- =========================================================
-- 14. payment_webhooks
-- =========================================================
INSERT INTO payment_webhooks (
    webhook_id, payment_id, provider_name, event_type,
    raw_payload, received_at, processed_status
)
VALUES
    (1, 1, 'MoMo', 'payment_success', '{"transactionId":"MOMO-0001","status":"success","amount":100000}', '2026-05-01 08:10:05+07', 'processed'),
    (2, 2, 'VNPay', 'payment_success', '{"transactionId":"VNPAY-0002","status":"success","amount":3157750}', '2026-05-01 09:30:05+07', 'processed'),
    (3, 3, 'Banking', 'payment_success', '{"transactionId":"BANK-0003","status":"success","amount":6704650}', '2026-05-02 10:30:05+07', 'processed'),
    (4, 4, 'Stripe', 'payment_pending', '{"transactionId":"CARD-0004","status":"pending","amount":30000}', '2026-05-02 11:05:05+07', 'pending'),
    (5, 5, 'Cashier', 'payment_success', '{"transactionId":"CASH-0005","status":"success","amount":1124000}', '2026-04-01 08:30:05+07', 'processed'),
    (6, 6, 'VNPay', 'payment_cancelled', '{"transactionId":"VNPAY-0006","status":"cancelled","amount":1195000}', '2026-04-25 14:20:00+07', 'processed')
ON CONFLICT (webhook_id) DO NOTHING;

-- =========================================================
-- 15. rentals
-- chỉ tạo rental cho các item đã paid/active/completed
-- =========================================================
INSERT INTO rentals (
    rental_id, order_id, item_id, user_id, unit_id, rental_code,
    actual_start_time, expected_end_time, actual_end_time,
    rental_status, created_at
)
VALUES
    (1, 1, 1, 1, 2, 'RNT-2026-0001', '2026-05-01 08:30:00+07', '2026-05-02 08:30:00+07', NULL, 'active', '2026-05-01 08:30:00+07'),
    (2, 2, 2, 2, 5, 'RNT-2026-0002', '2026-05-01 10:00:00+07', '2026-08-01 10:00:00+07', NULL, 'active', '2026-05-01 10:00:00+07'),
    (3, 3, 3, 3, 8, 'RNT-2026-0003', '2026-05-02 11:00:00+07', '2026-08-02 11:00:00+07', NULL, 'active', '2026-05-02 11:00:00+07'),
    (4, 5, 5, 5, 4, 'RNT-2026-0004', '2026-04-01 09:00:00+07', '2026-05-01 09:00:00+07', '2026-05-01 08:50:00+07', 'completed', '2026-04-01 09:00:00+07')
ON CONFLICT (rental_id) DO NOTHING;

-- =========================================================
-- 16. access_credentials
-- =========================================================
INSERT INTO access_credentials (
    credential_id, rental_id, credential_type, credential_value,
    expired_at, is_active, created_at
)
VALUES
    (1, 1, 'QR', 'QR-RNT-0001-ACTIVE', '2026-05-02 08:30:00+07', TRUE, '2026-05-01 08:30:00+07'),
    (2, 1, 'OTP', 'OTP-100001', '2026-05-01 09:30:00+07', FALSE, '2026-05-01 08:30:00+07'),
    (3, 2, 'PIN', 'PIN-200002', '2026-08-01 10:00:00+07', TRUE, '2026-05-01 10:00:00+07'),
    (4, 3, 'QR', 'QR-RNT-0003-ACTIVE', '2026-08-02 11:00:00+07', TRUE, '2026-05-02 11:00:00+07'),
    (5, 4, 'QR', 'QR-RNT-0004-EXPIRED', '2026-05-01 09:00:00+07', FALSE, '2026-04-01 09:00:00+07')
ON CONFLICT (credential_id) DO NOTHING;

-- =========================================================
-- 17. unit_access_logs
-- =========================================================
INSERT INTO unit_access_logs (
    access_log_id, rental_id, unit_id, user_id,
    action_type, action_result, event_time, note
)
VALUES
    (1, 1, 2, 1, 'unlock', 'success', '2026-05-01 08:35:00+07', 'Khách mở tủ bằng QR'),
    (2, 1, 2, 1, 'lock', 'success', '2026-05-01 08:40:00+07', 'Khách khóa tủ sau khi gửi đồ'),
    (3, 2, 5, 2, 'check_in', 'success', '2026-05-01 10:10:00+07', 'Khách check-in kho tự quản'),
    (4, 3, 8, 3, 'check_in', 'success', '2026-05-02 11:15:00+07', 'Nhân viên ghi nhận nhập kho full-service'),
    (5, 4, 4, 5, 'check_out', 'success', '2026-05-01 08:50:00+07', 'Khách trả kho đúng hạn'),
    (6, 2, 5, 2, 'unlock', 'failed', '2026-05-03 09:00:00+07', 'Nhập sai PIN')
ON CONFLICT (access_log_id) DO NOTHING;

-- =========================================================
-- 18. support_tickets
-- =========================================================
INSERT INTO support_tickets (
    ticket_id, user_id, order_id, rental_id, assigned_staff_id,
    subject, category, priority, ticket_status, created_at, updated_at
)
VALUES
    (1, 1, 1, 1, 6, 'Không mở được tủ bằng QR', 'access', 'high', 'in_progress', '2026-05-01 09:00:00+07', '2026-05-01 09:10:00+07'),
    (2, 2, 2, 2, 7, 'Cần đổi thời gian thuê kho', 'rental', 'normal', 'assigned', '2026-05-02 08:00:00+07', '2026-05-02 08:05:00+07'),
    (3, 3, 3, 3, 6, 'Yêu cầu kiểm kê tài sản', 'inventory', 'normal', 'open', '2026-05-02 12:00:00+07', '2026-05-02 12:00:00+07'),
    (4, 4, 4, NULL, NULL, 'Thanh toán chưa cập nhật trạng thái', 'payment', 'urgent', 'open', '2026-05-02 11:20:00+07', '2026-05-02 11:20:00+07'),
    (5, 5, 5, 4, 8, 'Cần xuất hóa đơn dịch vụ', 'billing', 'low', 'resolved', '2026-05-01 10:00:00+07', '2026-05-01 11:00:00+07')
ON CONFLICT (ticket_id) DO NOTHING;

-- =========================================================
-- 19. support_messages
-- =========================================================
INSERT INTO support_messages (
    message_id, ticket_id, sender_id, message_content, created_at
)
VALUES
    (1, 1, 1, 'Tôi quét QR nhưng tủ không mở được.', '2026-05-01 09:00:00+07'),
    (2, 1, 6, 'Anh/chị vui lòng thử OTP mới được gửi trong thông báo.', '2026-05-01 09:10:00+07'),
    (3, 2, 2, 'Tôi muốn gia hạn thêm 1 tháng cho kho tự quản.', '2026-05-02 08:00:00+07'),
    (4, 3, 3, 'Tôi cần nhân viên kiểm kê lại số lượng thùng hàng.', '2026-05-02 12:00:00+07'),
    (5, 5, 8, 'Hóa đơn đã được ghi nhận và sẽ gửi qua email.', '2026-05-01 11:00:00+07')
ON CONFLICT (message_id) DO NOTHING;

-- =========================================================
-- 20. notifications
-- =========================================================
INSERT INTO notifications (
    notification_id, user_id, order_id, rental_id,
    notification_type, title, content, is_read, created_at
)
VALUES
    (1, 1, 1, 1, 'payment_success', 'Thanh toán thành công', 'Đơn ORD-2026-0001 đã thanh toán thành công.', TRUE, '2026-05-01 08:10:00+07'),
    (2, 1, 1, 1, 'credential_created', 'Mã truy cập đã được tạo', 'Bạn có thể mở tủ bằng QR hoặc OTP.', FALSE, '2026-05-01 08:30:00+07'),
    (3, 2, 2, 2, 'rental_started', 'Phiên thuê đã bắt đầu', 'Kho tự quản của bạn đã được kích hoạt.', TRUE, '2026-05-01 10:00:00+07'),
    (4, 4, 4, NULL, 'payment_failed', 'Thanh toán chưa hoàn tất', 'Vui lòng hoàn tất thanh toán để nhận mã truy cập.', FALSE, '2026-05-02 11:10:00+07'),
    (5, 5, 5, 4, 'rental_expiring', 'Phiên thuê sắp kết thúc', 'Phiên thuê của bạn sẽ kết thúc vào hôm nay.', TRUE, '2026-05-01 08:00:00+07'),
    (6, 5, 5, 4, 'ticket_replied', 'Ticket đã được phản hồi', 'Nhân viên đã phản hồi yêu cầu xuất hóa đơn.', FALSE, '2026-05-01 11:00:00+07')
ON CONFLICT (notification_id) DO NOTHING;

-- =========================================================
-- 21. audit_logs
-- =========================================================
INSERT INTO audit_logs (
    audit_id, actor_id, action, entity_name, entity_id, ip_address, created_at
)
VALUES
    (1, 9, 'CREATE_ROLE', 'roles', 1, '127.0.0.1', '2026-05-01 07:00:00+07'),
    (2, 6, 'UPDATE_UNIT_STATUS', 'storage_units', 2, '192.168.1.10', '2026-05-01 08:30:00+07'),
    (3, 7, 'ASSIGN_TICKET', 'support_tickets', 2, '192.168.1.11', '2026-05-02 08:05:00+07'),
    (4, 9, 'CREATE_SERVICE_TYPE', 'service_types', 1, '127.0.0.1', '2026-05-01 07:10:00+07'),
    (5, 8, 'RESOLVE_TICKET', 'support_tickets', 5, '192.168.1.12', '2026-05-01 11:00:00+07'),
    (6, 10, 'REVIEW_PAYMENT_WEBHOOK', 'payment_webhooks', 4, '127.0.0.1', '2026-05-02 11:30:00+07')
ON CONFLICT (audit_id) DO NOTHING;

-- =========================================================
-- Reset identity sequences after explicit IDs
-- =========================================================
SELECT setval(pg_get_serial_sequence('roles', 'role_id'), COALESCE((SELECT MAX(role_id) FROM roles), 1), TRUE);
SELECT setval(pg_get_serial_sequence('users', 'user_id'), COALESCE((SELECT MAX(user_id) FROM users), 1), TRUE);
SELECT setval(pg_get_serial_sequence('service_types', 'service_type_id'), COALESCE((SELECT MAX(service_type_id) FROM service_types), 1), TRUE);
SELECT setval(pg_get_serial_sequence('locations', 'location_id'), COALESCE((SELECT MAX(location_id) FROM locations), 1), TRUE);
SELECT setval(pg_get_serial_sequence('storage_sizes', 'size_id'), COALESCE((SELECT MAX(size_id) FROM storage_sizes), 1), TRUE);
SELECT setval(pg_get_serial_sequence('storage_units', 'unit_id'), COALESCE((SELECT MAX(unit_id) FROM storage_units), 1), TRUE);
SELECT setval(pg_get_serial_sequence('duration_options', 'duration_id'), COALESCE((SELECT MAX(duration_id) FROM duration_options), 1), TRUE);
SELECT setval(pg_get_serial_sequence('protection_plans', 'protection_plan_id'), COALESCE((SELECT MAX(protection_plan_id) FROM protection_plans), 1), TRUE);
SELECT setval(pg_get_serial_sequence('addon_services', 'addon_id'), COALESCE((SELECT MAX(addon_id) FROM addon_services), 1), TRUE);
SELECT setval(pg_get_serial_sequence('rental_orders', 'order_id'), COALESCE((SELECT MAX(order_id) FROM rental_orders), 1), TRUE);
SELECT setval(pg_get_serial_sequence('rental_order_items', 'item_id'), COALESCE((SELECT MAX(item_id) FROM rental_order_items), 1), TRUE);
SELECT setval(pg_get_serial_sequence('order_addons', 'order_addon_id'), COALESCE((SELECT MAX(order_addon_id) FROM order_addons), 1), TRUE);
SELECT setval(pg_get_serial_sequence('payments', 'payment_id'), COALESCE((SELECT MAX(payment_id) FROM payments), 1), TRUE);
SELECT setval(pg_get_serial_sequence('payment_webhooks', 'webhook_id'), COALESCE((SELECT MAX(webhook_id) FROM payment_webhooks), 1), TRUE);
SELECT setval(pg_get_serial_sequence('rentals', 'rental_id'), COALESCE((SELECT MAX(rental_id) FROM rentals), 1), TRUE);
SELECT setval(pg_get_serial_sequence('access_credentials', 'credential_id'), COALESCE((SELECT MAX(credential_id) FROM access_credentials), 1), TRUE);
SELECT setval(pg_get_serial_sequence('unit_access_logs', 'access_log_id'), COALESCE((SELECT MAX(access_log_id) FROM unit_access_logs), 1), TRUE);
SELECT setval(pg_get_serial_sequence('support_tickets', 'ticket_id'), COALESCE((SELECT MAX(ticket_id) FROM support_tickets), 1), TRUE);
SELECT setval(pg_get_serial_sequence('support_messages', 'message_id'), COALESCE((SELECT MAX(message_id) FROM support_messages), 1), TRUE);
SELECT setval(pg_get_serial_sequence('notifications', 'notification_id'), COALESCE((SELECT MAX(notification_id) FROM notifications), 1), TRUE);
SELECT setval(pg_get_serial_sequence('audit_logs', 'audit_id'), COALESCE((SELECT MAX(audit_id) FROM audit_logs), 1), TRUE);

COMMIT;