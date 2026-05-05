BEGIN;

-- =========================================================
-- 03_functions.sql
-- Procedures and functions for iLocker database
-- PostgreSQL / Neon
-- =========================================================

-- =========================================================
-- 1. CRUD PROCEDURES FOR storage_units
-- This table is chosen because it is a core entity of iLocker.
-- =========================================================

CREATE OR REPLACE PROCEDURE sp_create_storage_unit(
    IN p_location_id BIGINT,
    IN p_size_id BIGINT,
    IN p_unit_code VARCHAR,
    IN p_iot_device_id VARCHAR,
    IN p_status VARCHAR DEFAULT 'available',
    IN p_current_temperature NUMERIC DEFAULT NULL,
    IN p_current_humidity NUMERIC DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_location_exists INT;
    v_size_exists INT;
    v_duplicate_unit INT;
    v_duplicate_iot INT;
BEGIN
    IF p_location_id IS NULL THEN
        RAISE EXCEPTION 'location_id không được để trống';
    END IF;

    IF p_size_id IS NULL THEN
        RAISE EXCEPTION 'size_id không được để trống';
    END IF;

    IF p_unit_code IS NULL OR LENGTH(TRIM(p_unit_code)) = 0 THEN
        RAISE EXCEPTION 'unit_code không được để trống';
    END IF;

    IF p_status NOT IN ('available', 'reserved', 'occupied', 'maintenance', 'inactive') THEN
        RAISE EXCEPTION 'Trạng thái storage unit không hợp lệ: %', p_status;
    END IF;

    IF p_current_temperature IS NOT NULL
       AND (p_current_temperature < -20 OR p_current_temperature > 80) THEN
        RAISE EXCEPTION 'Nhiệt độ phải nằm trong khoảng -20 đến 80 độ C';
    END IF;

    IF p_current_humidity IS NOT NULL
       AND (p_current_humidity < 0 OR p_current_humidity > 100) THEN
        RAISE EXCEPTION 'Độ ẩm phải nằm trong khoảng 0 đến 100 phần trăm';
    END IF;

    SELECT COUNT(*)
    INTO v_location_exists
    FROM locations
    WHERE location_id = p_location_id;

    IF v_location_exists = 0 THEN
        RAISE EXCEPTION 'location_id % không tồn tại', p_location_id;
    END IF;

    SELECT COUNT(*)
    INTO v_size_exists
    FROM storage_sizes
    WHERE size_id = p_size_id;

    IF v_size_exists = 0 THEN
        RAISE EXCEPTION 'size_id % không tồn tại', p_size_id;
    END IF;

    SELECT COUNT(*)
    INTO v_duplicate_unit
    FROM storage_units
    WHERE location_id = p_location_id
      AND unit_code = TRIM(p_unit_code);

    IF v_duplicate_unit > 0 THEN
        RAISE EXCEPTION 'unit_code % đã tồn tại tại location_id %', p_unit_code, p_location_id;
    END IF;

    IF p_iot_device_id IS NOT NULL AND LENGTH(TRIM(p_iot_device_id)) > 0 THEN
        SELECT COUNT(*)
        INTO v_duplicate_iot
        FROM storage_units
        WHERE iot_device_id = TRIM(p_iot_device_id);

        IF v_duplicate_iot > 0 THEN
            RAISE EXCEPTION 'iot_device_id % đã tồn tại', p_iot_device_id;
        END IF;
    END IF;

    INSERT INTO storage_units (
        location_id,
        size_id,
        unit_code,
        iot_device_id,
        status,
        current_temperature,
        current_humidity
    )
    VALUES (
        p_location_id,
        p_size_id,
        TRIM(p_unit_code),
        NULLIF(TRIM(COALESCE(p_iot_device_id, '')), ''),
        p_status,
        p_current_temperature,
        p_current_humidity
    );
END;
$$;


CREATE OR REPLACE PROCEDURE sp_update_storage_unit(
    IN p_unit_id BIGINT,
    IN p_location_id BIGINT,
    IN p_size_id BIGINT,
    IN p_unit_code VARCHAR,
    IN p_iot_device_id VARCHAR,
    IN p_status VARCHAR,
    IN p_current_temperature NUMERIC DEFAULT NULL,
    IN p_current_humidity NUMERIC DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_unit_exists INT;
    v_location_exists INT;
    v_size_exists INT;
    v_duplicate_unit INT;
    v_duplicate_iot INT;
BEGIN
    IF p_unit_id IS NULL THEN
        RAISE EXCEPTION 'unit_id không được để trống';
    END IF;

    SELECT COUNT(*)
    INTO v_unit_exists
    FROM storage_units
    WHERE unit_id = p_unit_id;

    IF v_unit_exists = 0 THEN
        RAISE EXCEPTION 'storage unit có unit_id % không tồn tại', p_unit_id;
    END IF;

    IF p_location_id IS NULL THEN
        RAISE EXCEPTION 'location_id không được để trống';
    END IF;

    IF p_size_id IS NULL THEN
        RAISE EXCEPTION 'size_id không được để trống';
    END IF;

    IF p_unit_code IS NULL OR LENGTH(TRIM(p_unit_code)) = 0 THEN
        RAISE EXCEPTION 'unit_code không được để trống';
    END IF;

    IF p_status NOT IN ('available', 'reserved', 'occupied', 'maintenance', 'inactive') THEN
        RAISE EXCEPTION 'Trạng thái storage unit không hợp lệ: %', p_status;
    END IF;

    IF p_current_temperature IS NOT NULL
       AND (p_current_temperature < -20 OR p_current_temperature > 80) THEN
        RAISE EXCEPTION 'Nhiệt độ phải nằm trong khoảng -20 đến 80 độ C';
    END IF;

    IF p_current_humidity IS NOT NULL
       AND (p_current_humidity < 0 OR p_current_humidity > 100) THEN
        RAISE EXCEPTION 'Độ ẩm phải nằm trong khoảng 0 đến 100 phần trăm';
    END IF;

    SELECT COUNT(*)
    INTO v_location_exists
    FROM locations
    WHERE location_id = p_location_id;

    IF v_location_exists = 0 THEN
        RAISE EXCEPTION 'location_id % không tồn tại', p_location_id;
    END IF;

    SELECT COUNT(*)
    INTO v_size_exists
    FROM storage_sizes
    WHERE size_id = p_size_id;

    IF v_size_exists = 0 THEN
        RAISE EXCEPTION 'size_id % không tồn tại', p_size_id;
    END IF;

    SELECT COUNT(*)
    INTO v_duplicate_unit
    FROM storage_units
    WHERE location_id = p_location_id
      AND unit_code = TRIM(p_unit_code)
      AND unit_id <> p_unit_id;

    IF v_duplicate_unit > 0 THEN
        RAISE EXCEPTION 'unit_code % đã tồn tại tại location_id %', p_unit_code, p_location_id;
    END IF;

    IF p_iot_device_id IS NOT NULL AND LENGTH(TRIM(p_iot_device_id)) > 0 THEN
        SELECT COUNT(*)
        INTO v_duplicate_iot
        FROM storage_units
        WHERE iot_device_id = TRIM(p_iot_device_id)
          AND unit_id <> p_unit_id;

        IF v_duplicate_iot > 0 THEN
            RAISE EXCEPTION 'iot_device_id % đã tồn tại', p_iot_device_id;
        END IF;
    END IF;

    UPDATE storage_units
    SET
        location_id = p_location_id,
        size_id = p_size_id,
        unit_code = TRIM(p_unit_code),
        iot_device_id = NULLIF(TRIM(COALESCE(p_iot_device_id, '')), ''),
        status = p_status,
        current_temperature = p_current_temperature,
        current_humidity = p_current_humidity
    WHERE unit_id = p_unit_id;
END;
$$;


CREATE OR REPLACE PROCEDURE sp_delete_storage_unit(
    IN p_unit_id BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_unit_exists INT;
    v_order_item_count INT;
    v_rental_count INT;
    v_access_log_count INT;
BEGIN
    IF p_unit_id IS NULL THEN
        RAISE EXCEPTION 'unit_id không được để trống';
    END IF;

    SELECT COUNT(*)
    INTO v_unit_exists
    FROM storage_units
    WHERE unit_id = p_unit_id;

    IF v_unit_exists = 0 THEN
        RAISE EXCEPTION 'storage unit có unit_id % không tồn tại', p_unit_id;
    END IF;

    SELECT COUNT(*)
    INTO v_order_item_count
    FROM rental_order_items
    WHERE unit_id = p_unit_id;

    SELECT COUNT(*)
    INTO v_rental_count
    FROM rentals
    WHERE unit_id = p_unit_id;

    SELECT COUNT(*)
    INTO v_access_log_count
    FROM unit_access_logs
    WHERE unit_id = p_unit_id;

    IF v_order_item_count > 0 OR v_rental_count > 0 OR v_access_log_count > 0 THEN
        RAISE EXCEPTION
            'Không thể xóa storage unit % vì đã phát sinh đơn thuê/rental/access log. Hãy chuyển status sang inactive hoặc maintenance.',
            p_unit_id;
    END IF;

    DELETE FROM storage_units
    WHERE unit_id = p_unit_id;
END;
$$;


-- =========================================================
-- 2. QUERY FUNCTION 1
-- List storage units with WHERE and ORDER BY.
-- Join from 4 tables: storage_units, locations, storage_sizes, service_types.
-- =========================================================

CREATE OR REPLACE FUNCTION fn_find_storage_units(
    p_location_id BIGINT DEFAULT NULL,
    p_status VARCHAR DEFAULT NULL
)
RETURNS TABLE (
    unit_id BIGINT,
    unit_code VARCHAR,
    unit_status VARCHAR,
    location_name VARCHAR,
    city VARCHAR,
    service_name VARCHAR,
    size_code VARCHAR,
    size_name VARCHAR,
    volume_m3 NUMERIC,
    base_price NUMERIC,
    current_temperature NUMERIC,
    current_humidity NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_status IS NOT NULL
       AND p_status NOT IN ('available', 'reserved', 'occupied', 'maintenance', 'inactive') THEN
        RAISE EXCEPTION 'Trạng thái storage unit không hợp lệ: %', p_status;
    END IF;

    RETURN QUERY
    SELECT
        su.unit_id,
        su.unit_code,
        su.status AS unit_status,
        l.location_name,
        l.city,
        st.service_name,
        ss.size_code,
        ss.size_name,
        ss.volume_m3,
        ss.base_price,
        su.current_temperature,
        su.current_humidity
    FROM storage_units su
    JOIN locations l
        ON su.location_id = l.location_id
    JOIN storage_sizes ss
        ON su.size_id = ss.size_id
    JOIN service_types st
        ON ss.service_type_id = st.service_type_id
    WHERE
        (p_location_id IS NULL OR su.location_id = p_location_id)
        AND (p_status IS NULL OR su.status = p_status)
    ORDER BY
        l.location_name ASC,
        ss.volume_m3 ASC,
        su.unit_code ASC;
END;
$$;


-- =========================================================
-- 3. QUERY FUNCTION 2
-- Revenue summary by service type.
-- Has JOIN, WHERE, GROUP BY, HAVING, ORDER BY, aggregate functions.
-- =========================================================

CREATE OR REPLACE FUNCTION fn_revenue_by_service_type(
    p_from_date TIMESTAMPTZ,
    p_to_date TIMESTAMPTZ,
    p_min_revenue NUMERIC DEFAULT 0
)
RETURNS TABLE (
    service_type_id BIGINT,
    service_code VARCHAR,
    service_name VARCHAR,
    successful_payment_count BIGINT,
    total_revenue NUMERIC,
    average_payment NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_from_date IS NULL THEN
        RAISE EXCEPTION 'p_from_date không được để trống';
    END IF;

    IF p_to_date IS NULL THEN
        RAISE EXCEPTION 'p_to_date không được để trống';
    END IF;

    IF p_to_date <= p_from_date THEN
        RAISE EXCEPTION 'p_to_date phải lớn hơn p_from_date';
    END IF;

    IF p_min_revenue IS NULL OR p_min_revenue < 0 THEN
        RAISE EXCEPTION 'p_min_revenue phải lớn hơn hoặc bằng 0';
    END IF;

    RETURN QUERY
    SELECT
        st.service_type_id,
        st.service_code,
        st.service_name,
        COUNT(p.payment_id) AS successful_payment_count,
        COALESCE(SUM(p.amount), 0) AS total_revenue,
        COALESCE(AVG(p.amount), 0) AS average_payment
    FROM service_types st
    JOIN rental_orders ro
        ON ro.service_type_id = st.service_type_id
    JOIN payments p
        ON p.order_id = ro.order_id
    WHERE
        p.payment_status = 'success'
        AND p.paid_at >= p_from_date
        AND p.paid_at < p_to_date
    GROUP BY
        st.service_type_id,
        st.service_code,
        st.service_name
    HAVING
        COALESCE(SUM(p.amount), 0) >= p_min_revenue
    ORDER BY
        total_revenue DESC,
        st.service_name ASC;
END;
$$;


-- =========================================================
-- 4. CALCULATION FUNCTION 1
-- Calculate total amount of an order using explicit CURSOR and LOOP.
-- Formula:
-- total = sum(item storage/protection fees) + sum(addon fees) - discount
-- =========================================================

CREATE OR REPLACE FUNCTION fn_calculate_order_total(
    p_order_id BIGINT
)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
    v_order_exists INT;
    v_discount NUMERIC := 0;
    v_total NUMERIC := 0;

    v_item_storage_fee NUMERIC;
    v_item_protection_fee NUMERIC;

    v_addon_total_price NUMERIC;

    cur_items CURSOR FOR
        SELECT storage_fee, protection_fee
        FROM rental_order_items
        WHERE order_id = p_order_id;

    cur_addons CURSOR FOR
        SELECT total_price
        FROM order_addons
        WHERE order_id = p_order_id;
BEGIN
    IF p_order_id IS NULL THEN
        RAISE EXCEPTION 'order_id không được để trống';
    END IF;

    SELECT COUNT(*)
    INTO v_order_exists
    FROM rental_orders
    WHERE order_id = p_order_id;

    IF v_order_exists = 0 THEN
        RAISE EXCEPTION 'rental_order có order_id % không tồn tại', p_order_id;
    END IF;

    SELECT discount_amount
    INTO v_discount
    FROM rental_orders
    WHERE order_id = p_order_id;

    OPEN cur_items;
    LOOP
        FETCH cur_items INTO v_item_storage_fee, v_item_protection_fee;
        EXIT WHEN NOT FOUND;

        v_total := v_total
            + COALESCE(v_item_storage_fee, 0)
            + COALESCE(v_item_protection_fee, 0);
    END LOOP;
    CLOSE cur_items;

    OPEN cur_addons;
    LOOP
        FETCH cur_addons INTO v_addon_total_price;
        EXIT WHEN NOT FOUND;

        v_total := v_total + COALESCE(v_addon_total_price, 0);
    END LOOP;
    CLOSE cur_addons;

    v_total := v_total - COALESCE(v_discount, 0);

    IF v_total < 0 THEN
        v_total := 0;
    END IF;

    RETURN v_total;
END;
$$;


-- =========================================================
-- 5. CALCULATION FUNCTION 2
-- Calculate total successful spending of a user using CURSOR and LOOP.
-- =========================================================

CREATE OR REPLACE FUNCTION fn_get_user_total_spending(
    p_user_id BIGINT
)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
    v_user_exists INT;
    v_total NUMERIC := 0;
    v_payment_amount NUMERIC;

    cur_success_payments CURSOR FOR
        SELECT p.amount
        FROM payments p
        JOIN rental_orders ro
            ON p.order_id = ro.order_id
        WHERE ro.user_id = p_user_id
          AND p.payment_status = 'success';
BEGIN
    IF p_user_id IS NULL THEN
        RAISE EXCEPTION 'user_id không được để trống';
    END IF;

    SELECT COUNT(*)
    INTO v_user_exists
    FROM users
    WHERE user_id = p_user_id;

    IF v_user_exists = 0 THEN
        RAISE EXCEPTION 'user_id % không tồn tại', p_user_id;
    END IF;

    OPEN cur_success_payments;
    LOOP
        FETCH cur_success_payments INTO v_payment_amount;
        EXIT WHEN NOT FOUND;

        IF v_payment_amount IS NOT NULL THEN
            v_total := v_total + v_payment_amount;
        END IF;
    END LOOP;
    CLOSE cur_success_payments;

    RETURN v_total;
END;
$$;


-- =========================================================
-- 6. HELPER FUNCTION
-- Estimate addon total price based on addon pricing policy.
-- Useful for application and demo.
-- =========================================================

CREATE OR REPLACE FUNCTION fn_estimate_addon_total(
    p_addon_id BIGINT,
    p_quantity INT DEFAULT 1,
    p_distance_km NUMERIC DEFAULT 0,
    p_box_count INT DEFAULT 0
)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
    v_pricing_type VARCHAR;
    v_base_price NUMERIC;
    v_extra_price NUMERIC;
    v_free_threshold INT;
    v_total NUMERIC := 0;
    v_extra_distance NUMERIC := 0;
BEGIN
    IF p_addon_id IS NULL THEN
        RAISE EXCEPTION 'addon_id không được để trống';
    END IF;

    IF p_quantity IS NULL OR p_quantity <= 0 THEN
        RAISE EXCEPTION 'quantity phải lớn hơn 0';
    END IF;

    IF p_distance_km IS NULL OR p_distance_km < 0 THEN
        RAISE EXCEPTION 'distance_km phải lớn hơn hoặc bằng 0';
    END IF;

    IF p_box_count IS NULL OR p_box_count < 0 THEN
        RAISE EXCEPTION 'box_count phải lớn hơn hoặc bằng 0';
    END IF;

    SELECT pricing_type, base_price, extra_price, free_threshold
    INTO v_pricing_type, v_base_price, v_extra_price, v_free_threshold
    FROM addon_services
    WHERE addon_id = p_addon_id
      AND status = 'active';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'addon_id % không tồn tại hoặc không active', p_addon_id;
    END IF;

    IF v_pricing_type = 'fixed' THEN
        v_total := v_base_price * p_quantity;

    ELSIF v_pricing_type = 'per_box' THEN
        v_total := v_extra_price * p_box_count;

    ELSIF v_pricing_type = 'per_km' THEN
        v_extra_distance := GREATEST(p_distance_km - v_free_threshold, 0);
        v_total := v_base_price + v_extra_distance * v_extra_price;

    ELSIF v_pricing_type = 'mixed' THEN
        v_extra_distance := GREATEST(p_distance_km - v_free_threshold, 0);
        v_total := v_base_price + v_extra_distance * v_extra_price + p_box_count * v_extra_price;

    ELSE
        RAISE EXCEPTION 'pricing_type không hợp lệ: %', v_pricing_type;
    END IF;

    RETURN v_total;
END;
$$;

COMMIT;