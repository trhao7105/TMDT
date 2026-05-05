BEGIN;

-- =========================================================
-- 04_triggers.sql
-- Triggers for iLocker database
-- PostgreSQL / Neon
-- =========================================================

-- =========================================================
-- Drop old triggers if re-running this file
-- =========================================================

DROP TRIGGER IF EXISTS trg_users_set_updated_at ON users;
DROP TRIGGER IF EXISTS trg_rental_orders_set_updated_at ON rental_orders;
DROP TRIGGER IF EXISTS trg_support_tickets_set_updated_at ON support_tickets;

DROP TRIGGER IF EXISTS trg_recalculate_order_total_after_item_change ON rental_order_items;
DROP TRIGGER IF EXISTS trg_recalculate_order_total_after_addon_change ON order_addons;
DROP TRIGGER IF EXISTS trg_recalculate_order_total_after_discount_change ON rental_orders;

DROP TRIGGER IF EXISTS trg_validate_rental_before_save ON rentals;
DROP TRIGGER IF EXISTS trg_after_rental_change ON rentals;

DROP TRIGGER IF EXISTS trg_validate_access_credential_before_save ON access_credentials;

-- =========================================================
-- 1. updated_at trigger function
-- =========================================================

CREATE OR REPLACE FUNCTION fn_trg_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION fn_trg_set_updated_at();

CREATE TRIGGER trg_rental_orders_set_updated_at
BEFORE UPDATE ON rental_orders
FOR EACH ROW
EXECUTE FUNCTION fn_trg_set_updated_at();

CREATE TRIGGER trg_support_tickets_set_updated_at
BEFORE UPDATE ON support_tickets
FOR EACH ROW
EXECUTE FUNCTION fn_trg_set_updated_at();


-- =========================================================
-- 2. Recalculate rental_orders total amount
-- Derived attributes:
-- rental_orders.storage_fee
-- rental_orders.protection_fee
-- rental_orders.addon_fee
-- rental_orders.total_amount
-- =========================================================

CREATE OR REPLACE FUNCTION fn_trg_recalculate_order_total()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_order_id BIGINT;
    v_storage_fee NUMERIC := 0;
    v_protection_fee NUMERIC := 0;
    v_addon_fee NUMERIC := 0;
    v_discount_amount NUMERIC := 0;
    v_total_amount NUMERIC := 0;
BEGIN
    IF TG_TABLE_NAME = 'rental_order_items' THEN
        v_order_id := COALESCE(NEW.order_id, OLD.order_id);
    ELSIF TG_TABLE_NAME = 'order_addons' THEN
        v_order_id := COALESCE(NEW.order_id, OLD.order_id);
    ELSIF TG_TABLE_NAME = 'rental_orders' THEN
        v_order_id := NEW.order_id;
    ELSE
        RAISE EXCEPTION 'Trigger không hỗ trợ bảng %', TG_TABLE_NAME;
    END IF;

    SELECT
        COALESCE(SUM(storage_fee), 0),
        COALESCE(SUM(protection_fee), 0)
    INTO
        v_storage_fee,
        v_protection_fee
    FROM rental_order_items
    WHERE order_id = v_order_id;

    SELECT
        COALESCE(SUM(total_price), 0)
    INTO
        v_addon_fee
    FROM order_addons
    WHERE order_id = v_order_id;

    SELECT
        COALESCE(discount_amount, 0)
    INTO
        v_discount_amount
    FROM rental_orders
    WHERE order_id = v_order_id;

    v_total_amount := v_storage_fee + v_protection_fee + v_addon_fee - v_discount_amount;

    IF v_total_amount < 0 THEN
        v_total_amount := 0;
    END IF;

    UPDATE rental_orders
    SET
        storage_fee = v_storage_fee,
        protection_fee = v_protection_fee,
        addon_fee = v_addon_fee,
        total_amount = v_total_amount
    WHERE order_id = v_order_id;

    RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER trg_recalculate_order_total_after_item_change
AFTER INSERT OR UPDATE OR DELETE ON rental_order_items
FOR EACH ROW
EXECUTE FUNCTION fn_trg_recalculate_order_total();

CREATE TRIGGER trg_recalculate_order_total_after_addon_change
AFTER INSERT OR UPDATE OR DELETE ON order_addons
FOR EACH ROW
EXECUTE FUNCTION fn_trg_recalculate_order_total();

CREATE TRIGGER trg_recalculate_order_total_after_discount_change
AFTER UPDATE OF discount_amount ON rental_orders
FOR EACH ROW
EXECUTE FUNCTION fn_trg_recalculate_order_total();


-- =========================================================
-- 3. Validate rental before INSERT/UPDATE
-- Business rules:
-- - Rental must belong to a valid paid/active/completed order.
-- - Rental.item_id must match order_id and unit_id.
-- - Rental.user_id must match rental_orders.user_id.
-- - A storage unit cannot have two active/overdue rentals with overlapping time.
-- =========================================================

CREATE OR REPLACE FUNCTION fn_trg_validate_rental_before_save()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_order_status VARCHAR;
    v_order_user_id BIGINT;
    v_item_order_id BIGINT;
    v_item_unit_id BIGINT;
    v_overlap_count INT;
BEGIN
    SELECT order_status, user_id
    INTO v_order_status, v_order_user_id
    FROM rental_orders
    WHERE order_id = NEW.order_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Không thể tạo rental vì order_id % không tồn tại', NEW.order_id;
    END IF;

    IF v_order_status NOT IN ('paid', 'active', 'completed') THEN
        RAISE EXCEPTION
            'Không thể tạo rental cho order_id % vì trạng thái đơn hiện tại là %. Đơn cần paid/active/completed.',
            NEW.order_id,
            v_order_status;
    END IF;

    SELECT order_id, unit_id
    INTO v_item_order_id, v_item_unit_id
    FROM rental_order_items
    WHERE item_id = NEW.item_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Không thể tạo rental vì item_id % không tồn tại', NEW.item_id;
    END IF;

    IF v_item_order_id <> NEW.order_id THEN
        RAISE EXCEPTION
            'Rental không hợp lệ: item_id % thuộc order_id %, không thuộc order_id %',
            NEW.item_id,
            v_item_order_id,
            NEW.order_id;
    END IF;

    IF v_item_unit_id <> NEW.unit_id THEN
        RAISE EXCEPTION
            'Rental không hợp lệ: item_id % dùng unit_id %, không phải unit_id %',
            NEW.item_id,
            v_item_unit_id,
            NEW.unit_id;
    END IF;

    IF v_order_user_id <> NEW.user_id THEN
        RAISE EXCEPTION
            'Rental không hợp lệ: order_id % thuộc user_id %, không phải user_id %',
            NEW.order_id,
            v_order_user_id,
            NEW.user_id;
    END IF;

    IF NEW.rental_status IN ('active', 'overdue') THEN
        SELECT COUNT(*)
        INTO v_overlap_count
        FROM rentals r
        WHERE r.unit_id = NEW.unit_id
          AND r.rental_id <> COALESCE(NEW.rental_id, -1)
          AND r.rental_status IN ('active', 'overdue')
          AND tstzrange(
                r.actual_start_time,
                COALESCE(r.actual_end_time, r.expected_end_time),
                '[)'
              )
              &&
              tstzrange(
                NEW.actual_start_time,
                COALESCE(NEW.actual_end_time, NEW.expected_end_time),
                '[)'
              );

        IF v_overlap_count > 0 THEN
            RAISE EXCEPTION
                'Storage unit % đang có rental active/overdue trùng thời gian. Không thể tạo/cập nhật rental mới.',
                NEW.unit_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_rental_before_save
BEFORE INSERT OR UPDATE ON rentals
FOR EACH ROW
EXECUTE FUNCTION fn_trg_validate_rental_before_save();


-- =========================================================
-- 4. Refresh storage unit status after rental changes
-- If a unit has active/overdue rental -> occupied.
-- If no active/overdue rental and current status is occupied -> available.
-- Also deactivate credentials when rental is completed/cancelled.
-- =========================================================

CREATE OR REPLACE FUNCTION fn_refresh_storage_unit_status(
    p_unit_id BIGINT
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_active_count INT;
    v_current_status VARCHAR;
BEGIN
    IF p_unit_id IS NULL THEN
        RETURN;
    END IF;

    SELECT COUNT(*)
    INTO v_active_count
    FROM rentals
    WHERE unit_id = p_unit_id
      AND rental_status IN ('active', 'overdue');

    SELECT status
    INTO v_current_status
    FROM storage_units
    WHERE unit_id = p_unit_id;

    IF NOT FOUND THEN
        RETURN;
    END IF;

    IF v_current_status IN ('maintenance', 'inactive') THEN
        RETURN;
    END IF;

    IF v_active_count > 0 THEN
        UPDATE storage_units
        SET status = 'occupied'
        WHERE unit_id = p_unit_id;
    ELSE
        IF v_current_status = 'occupied' THEN
            UPDATE storage_units
            SET status = 'available'
            WHERE unit_id = p_unit_id;
        END IF;
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION fn_trg_after_rental_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM fn_refresh_storage_unit_status(NEW.unit_id);
        RETURN NEW;
    END IF;

    IF TG_OP = 'UPDATE' THEN
        IF NEW.rental_status IN ('completed', 'cancelled') THEN
            UPDATE access_credentials
            SET is_active = FALSE
            WHERE rental_id = NEW.rental_id;
        END IF;

        PERFORM fn_refresh_storage_unit_status(OLD.unit_id);

        IF NEW.unit_id <> OLD.unit_id THEN
            PERFORM fn_refresh_storage_unit_status(NEW.unit_id);
        END IF;

        RETURN NEW;
    END IF;

    IF TG_OP = 'DELETE' THEN
        PERFORM fn_refresh_storage_unit_status(OLD.unit_id);
        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$;

CREATE TRIGGER trg_after_rental_change
AFTER INSERT OR UPDATE OR DELETE ON rentals
FOR EACH ROW
EXECUTE FUNCTION fn_trg_after_rental_change();


-- =========================================================
-- 5. Validate access credential
-- Active QR/OTP/PIN can only belong to active/overdue rental.
-- =========================================================

CREATE OR REPLACE FUNCTION fn_trg_validate_access_credential_before_save()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_rental_status VARCHAR;
BEGIN
    SELECT rental_status
    INTO v_rental_status
    FROM rentals
    WHERE rental_id = NEW.rental_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Không thể tạo credential vì rental_id % không tồn tại', NEW.rental_id;
    END IF;

    IF NEW.is_active = TRUE AND v_rental_status NOT IN ('active', 'overdue') THEN
        RAISE EXCEPTION
            'Không thể active credential cho rental_id % vì rental_status hiện tại là %',
            NEW.rental_id,
            v_rental_status;
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_access_credential_before_save
BEFORE INSERT OR UPDATE ON access_credentials
FOR EACH ROW
EXECUTE FUNCTION fn_trg_validate_access_credential_before_save();

COMMIT;