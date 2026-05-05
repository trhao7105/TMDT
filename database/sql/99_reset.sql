-- file này để xóa toàn bộ dữ liệu trong các bảng, giúp reset database về trạng thái ban đầu
-- lưu ý: thứ tự xóa phải tuân theo thứ tự khóa ngoại để tránh lỗi  
BEGIN;

-- =========================================================
-- 99_reset.sql
-- Reset all iLocker database tables
-- Drop child tables first, then parent tables
-- =========================================================

DROP TABLE IF EXISTS payment_webhooks CASCADE;
DROP TABLE IF EXISTS unit_access_logs CASCADE;
DROP TABLE IF EXISTS access_credentials CASCADE;

DROP TABLE IF EXISTS support_messages CASCADE;
DROP TABLE IF EXISTS support_tickets CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;

DROP TABLE IF EXISTS rentals CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_addons CASCADE;
DROP TABLE IF EXISTS rental_order_items CASCADE;
DROP TABLE IF EXISTS rental_orders CASCADE;

DROP TABLE IF EXISTS storage_units CASCADE;
DROP TABLE IF EXISTS storage_sizes CASCADE;

DROP TABLE IF EXISTS duration_options CASCADE;
DROP TABLE IF EXISTS protection_plans CASCADE;
DROP TABLE IF EXISTS addon_services CASCADE;

DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS service_types CASCADE;

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

COMMIT;
