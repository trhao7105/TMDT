from typing import Optional
import datetime
import decimal

from sqlalchemy import BigInteger, Boolean, CheckConstraint, DateTime, ForeignKeyConstraint, Identity, Index, Integer, Numeric, PrimaryKeyConstraint, String, Text, Time, UniqueConstraint, text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

from ..database import Base


class AddonServices(Base):
    __tablename__ = 'addon_services'
    __table_args__ = (
        CheckConstraint('base_price >= 0::numeric AND extra_price >= 0::numeric', name='chk_addon_services_prices'),
        CheckConstraint('free_threshold >= 0', name='chk_addon_services_free_threshold'),
        CheckConstraint("pricing_type::text = ANY (ARRAY['fixed'::character varying, 'per_km'::character varying, 'per_box'::character varying, 'mixed'::character varying]::text[])", name='chk_addon_services_pricing_type'),
        CheckConstraint("status::text = ANY (ARRAY['active'::character varying, 'inactive'::character varying]::text[])", name='chk_addon_services_status'),
        PrimaryKeyConstraint('addon_id', name='addon_services_pkey'),
        UniqueConstraint('addon_code', name='addon_services_addon_code_key')
    )

    addon_id: Mapped[int] = mapped_column(BigInteger, Identity(start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1), primary_key=True)
    addon_code: Mapped[str] = mapped_column(String(50), nullable=False)
    addon_name: Mapped[str] = mapped_column(String(150), nullable=False)
    pricing_type: Mapped[str] = mapped_column(String(50), nullable=False)
    base_price: Mapped[decimal.Decimal] = mapped_column(Numeric(15, 2), nullable=False, server_default=text('0'))
    extra_price: Mapped[decimal.Decimal] = mapped_column(Numeric(15, 2), nullable=False, server_default=text('0'))
    free_threshold: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text('0'))
    status: Mapped[str] = mapped_column(String(30), nullable=False, server_default=text("'active'::character varying"))
    unit_name: Mapped[Optional[str]] = mapped_column(String(50))
    description: Mapped[Optional[str]] = mapped_column(Text)

    order_addons: Mapped[list['OrderAddons']] = relationship('OrderAddons', back_populates='addon')


class DurationOptions(Base):
    __tablename__ = 'duration_options'
    __table_args__ = (
        CheckConstraint('duration_months > 0::numeric', name='chk_duration_options_months'),
        CheckConstraint('multiplier > 0::numeric', name='chk_duration_options_multiplier'),
        CheckConstraint("status::text = ANY (ARRAY['active'::character varying, 'inactive'::character varying]::text[])", name='chk_duration_options_status'),
        PrimaryKeyConstraint('duration_id', name='duration_options_pkey'),
        UniqueConstraint('duration_name', name='duration_options_duration_name_key')
    )

    duration_id: Mapped[int] = mapped_column(BigInteger, Identity(start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1), primary_key=True)
    duration_name: Mapped[str] = mapped_column(String(100), nullable=False)
    duration_months: Mapped[decimal.Decimal] = mapped_column(Numeric(8, 2), nullable=False)
    multiplier: Mapped[decimal.Decimal] = mapped_column(Numeric(8, 2), nullable=False)
    status: Mapped[str] = mapped_column(String(30), nullable=False, server_default=text("'active'::character varying"))
    description: Mapped[Optional[str]] = mapped_column(Text)

    rental_order_items: Mapped[list['RentalOrderItems']] = relationship('RentalOrderItems', back_populates='duration')


class Locations(Base):
    __tablename__ = 'locations'
    __table_args__ = (
        CheckConstraint('is_24_7 = true OR open_time IS NULL OR close_time IS NULL OR open_time < close_time', name='chk_locations_open_close_time'),
        CheckConstraint("latitude IS NULL OR latitude >= '-90'::integer::numeric AND latitude <= 90::numeric", name='chk_locations_latitude'),
        CheckConstraint("longitude IS NULL OR longitude >= '-180'::integer::numeric AND longitude <= 180::numeric", name='chk_locations_longitude'),
        CheckConstraint("status::text = ANY (ARRAY['active'::character varying, 'inactive'::character varying, 'maintenance'::character varying]::text[])", name='chk_locations_status'),
        PrimaryKeyConstraint('location_id', name='locations_pkey')
    )

    location_id: Mapped[int] = mapped_column(BigInteger, Identity(start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1), primary_key=True)
    location_name: Mapped[str] = mapped_column(String(150), nullable=False)
    address: Mapped[str] = mapped_column(Text, nullable=False)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    is_24_7: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('false'))
    status: Mapped[str] = mapped_column(String(30), nullable=False, server_default=text("'active'::character varying"))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    district: Mapped[Optional[str]] = mapped_column(String(100))
    latitude: Mapped[Optional[decimal.Decimal]] = mapped_column(Numeric(10, 7))
    longitude: Mapped[Optional[decimal.Decimal]] = mapped_column(Numeric(10, 7))
    open_time: Mapped[Optional[datetime.time]] = mapped_column(Time)
    close_time: Mapped[Optional[datetime.time]] = mapped_column(Time)

    rental_orders: Mapped[list['RentalOrders']] = relationship('RentalOrders', back_populates='location')
    storage_units: Mapped[list['StorageUnits']] = relationship('StorageUnits', back_populates='location')


class ProtectionPlans(Base):
    __tablename__ = 'protection_plans'
    __table_args__ = (
        CheckConstraint('monthly_price >= 0::numeric', name='chk_protection_plans_monthly_price'),
        CheckConstraint("status::text = ANY (ARRAY['active'::character varying, 'inactive'::character varying]::text[])", name='chk_protection_plans_status'),
        PrimaryKeyConstraint('protection_plan_id', name='protection_plans_pkey'),
        UniqueConstraint('plan_name', name='protection_plans_plan_name_key')
    )

    protection_plan_id: Mapped[int] = mapped_column(BigInteger, Identity(start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1), primary_key=True)
    plan_name: Mapped[str] = mapped_column(String(100), nullable=False)
    monthly_price: Mapped[decimal.Decimal] = mapped_column(Numeric(15, 2), nullable=False, server_default=text('0'))
    status: Mapped[str] = mapped_column(String(30), nullable=False, server_default=text("'active'::character varying"))
    coverage_description: Mapped[Optional[str]] = mapped_column(Text)

    rental_order_items: Mapped[list['RentalOrderItems']] = relationship('RentalOrderItems', back_populates='protection_plan')


class Roles(Base):
    __tablename__ = 'roles'
    __table_args__ = (
        PrimaryKeyConstraint('role_id', name='roles_pkey'),
        UniqueConstraint('role_name', name='roles_role_name_key')
    )

    role_id: Mapped[int] = mapped_column(BigInteger, Identity(start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1), primary_key=True)
    role_name: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)

    users: Mapped[list['Users']] = relationship('Users', back_populates='role')


class ServiceTypes(Base):
    __tablename__ = 'service_types'
    __table_args__ = (
        CheckConstraint("service_code::text = ANY (ARRAY['FULL_SERVICE'::character varying, 'SELF_STORAGE'::character varying, 'SMART_LOCKER'::character varying]::text[])", name='chk_service_types_code'),
        CheckConstraint("status::text = ANY (ARRAY['active'::character varying, 'inactive'::character varying]::text[])", name='chk_service_types_status'),
        PrimaryKeyConstraint('service_type_id', name='service_types_pkey'),
        UniqueConstraint('service_code', name='service_types_service_code_key')
    )

    service_type_id: Mapped[int] = mapped_column(BigInteger, Identity(start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1), primary_key=True)
    service_code: Mapped[str] = mapped_column(String(50), nullable=False)
    service_name: Mapped[str] = mapped_column(String(150), nullable=False)
    status: Mapped[str] = mapped_column(String(30), nullable=False, server_default=text("'active'::character varying"))
    description: Mapped[Optional[str]] = mapped_column(Text)

    storage_sizes: Mapped[list['StorageSizes']] = relationship('StorageSizes', back_populates='service_type')
    rental_orders: Mapped[list['RentalOrders']] = relationship('RentalOrders', back_populates='service_type')


class StorageSizes(Base):
    __tablename__ = 'storage_sizes'
    __table_args__ = (
        CheckConstraint('base_price >= 0::numeric', name='chk_storage_sizes_base_price'),
        CheckConstraint("status::text = ANY (ARRAY['active'::character varying, 'inactive'::character varying]::text[])", name='chk_storage_sizes_status'),
        CheckConstraint('volume_m3 > 0::numeric', name='chk_storage_sizes_volume'),
        CheckConstraint('width_cm IS NULL OR width_cm > 0::numeric) AND (height_cm IS NULL OR height_cm > 0::numeric) AND (depth_cm IS NULL OR depth_cm > 0::numeric', name='chk_storage_sizes_dimensions'),
        ForeignKeyConstraint(['service_type_id'], ['service_types.service_type_id'], ondelete='RESTRICT', onupdate='CASCADE', name='fk_storage_sizes_service_types'),
        PrimaryKeyConstraint('size_id', name='storage_sizes_pkey'),
        UniqueConstraint('service_type_id', 'size_code', name='uq_storage_sizes_service_size_code'),
        Index('idx_storage_sizes_service_type_id', 'service_type_id')
    )

    size_id: Mapped[int] = mapped_column(BigInteger, Identity(start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1), primary_key=True)
    service_type_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    size_code: Mapped[str] = mapped_column(String(50), nullable=False)
    size_name: Mapped[str] = mapped_column(String(150), nullable=False)
    volume_m3: Mapped[decimal.Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    base_price: Mapped[decimal.Decimal] = mapped_column(Numeric(15, 2), nullable=False)
    status: Mapped[str] = mapped_column(String(30), nullable=False, server_default=text("'active'::character varying"))
    width_cm: Mapped[Optional[decimal.Decimal]] = mapped_column(Numeric(10, 2))
    height_cm: Mapped[Optional[decimal.Decimal]] = mapped_column(Numeric(10, 2))
    depth_cm: Mapped[Optional[decimal.Decimal]] = mapped_column(Numeric(10, 2))
    description: Mapped[Optional[str]] = mapped_column(Text)

    service_type: Mapped['ServiceTypes'] = relationship('ServiceTypes', back_populates='storage_sizes')
    storage_units: Mapped[list['StorageUnits']] = relationship('StorageUnits', back_populates='size')
    rental_order_items: Mapped[list['RentalOrderItems']] = relationship('RentalOrderItems', back_populates='size')


class Users(Base):
    __tablename__ = 'users'
    __table_args__ = (
        CheckConstraint("email::text ~* '^[A-Z0-9._%%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$'::text", name='chk_users_email_format'),
        CheckConstraint("phone IS NULL OR phone::text ~ '^\\+?[0-9]{9,15}$'::text", name='chk_users_phone_format'),
        CheckConstraint("status::text = ANY (ARRAY['active'::character varying, 'inactive'::character varying, 'locked'::character varying, 'deleted'::character varying]::text[])", name='chk_users_status'),
        ForeignKeyConstraint(['role_id'], ['roles.role_id'], ondelete='RESTRICT', onupdate='CASCADE', name='fk_users_roles'),
        PrimaryKeyConstraint('user_id', name='users_pkey'),
        UniqueConstraint('email', name='users_email_key'),
        UniqueConstraint('phone', name='users_phone_key'),
        Index('idx_users_role_id', 'role_id')
    )

    user_id: Mapped[int] = mapped_column(BigInteger, Identity(start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1), primary_key=True)
    role_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    full_name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(150), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(30), nullable=False, server_default=text("'active'::character varying"))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    phone: Mapped[Optional[str]] = mapped_column(String(20))

    role: Mapped['Roles'] = relationship('Roles', back_populates='users')
    audit_logs: Mapped[list['AuditLogs']] = relationship('AuditLogs', back_populates='actor')
    rental_orders: Mapped[list['RentalOrders']] = relationship('RentalOrders', back_populates='user')
    rentals: Mapped[list['Rentals']] = relationship('Rentals', back_populates='user')
    notifications: Mapped[list['Notifications']] = relationship('Notifications', back_populates='user')
    support_tickets_assigned_staff: Mapped[list['SupportTickets']] = relationship('SupportTickets', foreign_keys='[SupportTickets.assigned_staff_id]', back_populates='assigned_staff')
    support_tickets_user: Mapped[list['SupportTickets']] = relationship('SupportTickets', foreign_keys='[SupportTickets.user_id]', back_populates='user')
    unit_access_logs: Mapped[list['UnitAccessLogs']] = relationship('UnitAccessLogs', back_populates='user')
    support_messages: Mapped[list['SupportMessages']] = relationship('SupportMessages', back_populates='sender')


class AuditLogs(Base):
    __tablename__ = 'audit_logs'
    __table_args__ = (
        ForeignKeyConstraint(['actor_id'], ['users.user_id'], ondelete='RESTRICT', onupdate='CASCADE', name='fk_audit_logs_actor'),
        PrimaryKeyConstraint('audit_id', name='audit_logs_pkey'),
        Index('idx_audit_logs_actor_id', 'actor_id'),
        Index('idx_audit_logs_entity', 'entity_name', 'entity_id')
    )

    audit_id: Mapped[int] = mapped_column(BigInteger, Identity(start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1), primary_key=True)
    actor_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    action: Mapped[str] = mapped_column(String(100), nullable=False)
    entity_name: Mapped[str] = mapped_column(String(100), nullable=False)
    entity_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    ip_address: Mapped[Optional[str]] = mapped_column(String(60))

    actor: Mapped['Users'] = relationship('Users', back_populates='audit_logs')


class RentalOrders(Base):
    __tablename__ = 'rental_orders'
    __table_args__ = (
        CheckConstraint("order_status::text = ANY (ARRAY['pending_payment'::character varying, 'paid'::character varying, 'active'::character varying, 'completed'::character varying, 'cancelled'::character varying, 'failed'::character varying]::text[])", name='chk_rental_orders_status'),
        CheckConstraint('storage_fee >= 0::numeric AND protection_fee >= 0::numeric AND addon_fee >= 0::numeric AND discount_amount >= 0::numeric AND total_amount >= 0::numeric', name='chk_rental_orders_amounts'),
        ForeignKeyConstraint(['location_id'], ['locations.location_id'], ondelete='RESTRICT', onupdate='CASCADE', name='fk_rental_orders_locations'),
        ForeignKeyConstraint(['service_type_id'], ['service_types.service_type_id'], ondelete='RESTRICT', onupdate='CASCADE', name='fk_rental_orders_service_types'),
        ForeignKeyConstraint(['user_id'], ['users.user_id'], ondelete='RESTRICT', onupdate='CASCADE', name='fk_rental_orders_users'),
        PrimaryKeyConstraint('order_id', name='rental_orders_pkey'),
        UniqueConstraint('order_code', name='rental_orders_order_code_key'),
        Index('idx_rental_orders_created_at', 'created_at'),
        Index('idx_rental_orders_status', 'order_status'),
        Index('idx_rental_orders_user_id', 'user_id')
    )

    order_id: Mapped[int] = mapped_column(BigInteger, Identity(start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1), primary_key=True)
    user_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    service_type_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    location_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    order_code: Mapped[str] = mapped_column(String(80), nullable=False)
    order_status: Mapped[str] = mapped_column(String(50), nullable=False, server_default=text("'pending_payment'::character varying"))
    storage_fee: Mapped[decimal.Decimal] = mapped_column(Numeric(15, 2), nullable=False, server_default=text('0'))
    protection_fee: Mapped[decimal.Decimal] = mapped_column(Numeric(15, 2), nullable=False, server_default=text('0'))
    addon_fee: Mapped[decimal.Decimal] = mapped_column(Numeric(15, 2), nullable=False, server_default=text('0'))
    discount_amount: Mapped[decimal.Decimal] = mapped_column(Numeric(15, 2), nullable=False, server_default=text('0'))
    total_amount: Mapped[decimal.Decimal] = mapped_column(Numeric(15, 2), nullable=False, server_default=text('0'))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))

    location: Mapped['Locations'] = relationship('Locations', back_populates='rental_orders')
    service_type: Mapped['ServiceTypes'] = relationship('ServiceTypes', back_populates='rental_orders')
    user: Mapped['Users'] = relationship('Users', back_populates='rental_orders')
    order_addons: Mapped[list['OrderAddons']] = relationship('OrderAddons', back_populates='order')
    payments: Mapped[list['Payments']] = relationship('Payments', back_populates='order')
    rental_order_items: Mapped[list['RentalOrderItems']] = relationship('RentalOrderItems', back_populates='order')
    rentals: Mapped[list['Rentals']] = relationship('Rentals', back_populates='order')
    notifications: Mapped[list['Notifications']] = relationship('Notifications', back_populates='order')
    support_tickets: Mapped[list['SupportTickets']] = relationship('SupportTickets', back_populates='order')


class StorageUnits(Base):
    __tablename__ = 'storage_units'
    __table_args__ = (
        CheckConstraint('current_humidity IS NULL OR current_humidity >= 0::numeric AND current_humidity <= 100::numeric', name='chk_storage_units_humidity'),
        CheckConstraint("current_temperature IS NULL OR current_temperature >= '-20'::integer::numeric AND current_temperature <= 80::numeric", name='chk_storage_units_temperature'),
        CheckConstraint("status::text = ANY (ARRAY['available'::character varying, 'reserved'::character varying, 'occupied'::character varying, 'maintenance'::character varying, 'inactive'::character varying]::text[])", name='chk_storage_units_status'),
        ForeignKeyConstraint(['location_id'], ['locations.location_id'], ondelete='RESTRICT', onupdate='CASCADE', name='fk_storage_units_locations'),
        ForeignKeyConstraint(['size_id'], ['storage_sizes.size_id'], ondelete='RESTRICT', onupdate='CASCADE', name='fk_storage_units_storage_sizes'),
        PrimaryKeyConstraint('unit_id', name='storage_units_pkey'),
        UniqueConstraint('iot_device_id', name='storage_units_iot_device_id_key'),
        UniqueConstraint('location_id', 'unit_code', name='uq_storage_units_location_unit_code'),
        Index('idx_storage_units_location_id', 'location_id'),
        Index('idx_storage_units_size_id', 'size_id'),
        Index('idx_storage_units_status', 'status')
    )

    unit_id: Mapped[int] = mapped_column(BigInteger, Identity(start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1), primary_key=True)
    location_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    size_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    unit_code: Mapped[str] = mapped_column(String(80), nullable=False)
    status: Mapped[str] = mapped_column(String(30), nullable=False, server_default=text("'available'::character varying"))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    iot_device_id: Mapped[Optional[str]] = mapped_column(String(120))
    current_temperature: Mapped[Optional[decimal.Decimal]] = mapped_column(Numeric(5, 2))
    current_humidity: Mapped[Optional[decimal.Decimal]] = mapped_column(Numeric(5, 2))

    location: Mapped['Locations'] = relationship('Locations', back_populates='storage_units')
    size: Mapped['StorageSizes'] = relationship('StorageSizes', back_populates='storage_units')
    rental_order_items: Mapped[list['RentalOrderItems']] = relationship('RentalOrderItems', back_populates='unit')
    rentals: Mapped[list['Rentals']] = relationship('Rentals', back_populates='unit')
    unit_access_logs: Mapped[list['UnitAccessLogs']] = relationship('UnitAccessLogs', back_populates='unit')


class OrderAddons(Base):
    __tablename__ = 'order_addons'
    __table_args__ = (
        CheckConstraint('quantity > 0 AND distance_km >= 0::numeric AND box_count >= 0 AND unit_price >= 0::numeric AND total_price >= 0::numeric', name='chk_order_addons_numbers'),
        ForeignKeyConstraint(['addon_id'], ['addon_services.addon_id'], ondelete='RESTRICT', onupdate='CASCADE', name='fk_order_addons_addon_services'),
        ForeignKeyConstraint(['order_id'], ['rental_orders.order_id'], ondelete='RESTRICT', onupdate='CASCADE', name='fk_order_addons_orders'),
        PrimaryKeyConstraint('order_addon_id', name='order_addons_pkey'),
        UniqueConstraint('order_id', 'addon_id', name='uq_order_addons_order_addon'),
        Index('idx_order_addons_order_id', 'order_id')
    )

    order_addon_id: Mapped[int] = mapped_column(BigInteger, Identity(start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1), primary_key=True)
    order_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    addon_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text('1'))
    distance_km: Mapped[decimal.Decimal] = mapped_column(Numeric(10, 2), nullable=False, server_default=text('0'))
    box_count: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text('0'))
    unit_price: Mapped[decimal.Decimal] = mapped_column(Numeric(15, 2), nullable=False, server_default=text('0'))
    total_price: Mapped[decimal.Decimal] = mapped_column(Numeric(15, 2), nullable=False, server_default=text('0'))

    addon: Mapped['AddonServices'] = relationship('AddonServices', back_populates='order_addons')
    order: Mapped['RentalOrders'] = relationship('RentalOrders', back_populates='order_addons')


class Payments(Base):
    __tablename__ = 'payments'
    __table_args__ = (
        CheckConstraint('amount >= 0::numeric', name='chk_payments_amount'),
        CheckConstraint("currency::text = ANY (ARRAY['VND'::character varying, 'USD'::character varying]::text[])", name='chk_payments_currency'),
        CheckConstraint("payment_method::text = ANY (ARRAY['cash'::character varying, 'bank_transfer'::character varying, 'card'::character varying, 'momo'::character varying, 'vnpay'::character varying, 'zalopay'::character varying]::text[])", name='chk_payments_method'),
        CheckConstraint("payment_status::text = ANY (ARRAY['pending'::character varying, 'success'::character varying, 'failed'::character varying, 'cancelled'::character varying, 'refunded'::character varying]::text[])", name='chk_payments_status'),
        ForeignKeyConstraint(['order_id'], ['rental_orders.order_id'], ondelete='RESTRICT', onupdate='CASCADE', name='fk_payments_orders'),
        PrimaryKeyConstraint('payment_id', name='payments_pkey'),
        UniqueConstraint('payment_provider', 'provider_transaction_id', name='uq_payments_provider_transaction'),
        Index('idx_payments_order_id', 'order_id'),
        Index('idx_payments_status', 'payment_status')
    )

    payment_id: Mapped[int] = mapped_column(BigInteger, Identity(start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1), primary_key=True)
    order_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    payment_method: Mapped[str] = mapped_column(String(50), nullable=False)
    payment_provider: Mapped[str] = mapped_column(String(80), nullable=False)
    amount: Mapped[decimal.Decimal] = mapped_column(Numeric(15, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(10), nullable=False, server_default=text("'VND'::character varying"))
    payment_status: Mapped[str] = mapped_column(String(50), nullable=False, server_default=text("'pending'::character varying"))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    provider_transaction_id: Mapped[Optional[str]] = mapped_column(String(150))
    paid_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))

    order: Mapped['RentalOrders'] = relationship('RentalOrders', back_populates='payments')
    payment_webhooks: Mapped[list['PaymentWebhooks']] = relationship('PaymentWebhooks', back_populates='payment')


class RentalOrderItems(Base):
    __tablename__ = 'rental_order_items'
    __table_args__ = (
        CheckConstraint('base_price >= 0::numeric AND duration_multiplier > 0::numeric AND storage_fee >= 0::numeric AND protection_fee >= 0::numeric', name='chk_rental_order_items_price'),
        CheckConstraint('end_time > start_time', name='chk_rental_order_items_time'),
        CheckConstraint("item_status::text = ANY (ARRAY['pending'::character varying, 'reserved'::character varying, 'active'::character varying, 'completed'::character varying, 'cancelled'::character varying]::text[])", name='chk_rental_order_items_status'),
        ForeignKeyConstraint(['duration_id'], ['duration_options.duration_id'], ondelete='RESTRICT', onupdate='CASCADE', name='fk_rental_order_items_durations'),
        ForeignKeyConstraint(['order_id'], ['rental_orders.order_id'], ondelete='RESTRICT', onupdate='CASCADE', name='fk_rental_order_items_orders'),
        ForeignKeyConstraint(['protection_plan_id'], ['protection_plans.protection_plan_id'], ondelete='RESTRICT', onupdate='CASCADE', name='fk_rental_order_items_protection_plans'),
        ForeignKeyConstraint(['size_id'], ['storage_sizes.size_id'], ondelete='RESTRICT', onupdate='CASCADE', name='fk_rental_order_items_sizes'),
        ForeignKeyConstraint(['unit_id'], ['storage_units.unit_id'], ondelete='RESTRICT', onupdate='CASCADE', name='fk_rental_order_items_units'),
        PrimaryKeyConstraint('item_id', name='rental_order_items_pkey'),
        UniqueConstraint('order_id', 'unit_id', name='uq_rental_order_items_order_unit'),
        Index('idx_rental_order_items_order_id', 'order_id'),
        Index('idx_rental_order_items_unit_id', 'unit_id')
    )

    item_id: Mapped[int] = mapped_column(BigInteger, Identity(start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1), primary_key=True)
    order_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    unit_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    size_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    duration_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    protection_plan_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    start_time: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False)
    end_time: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False)
    base_price: Mapped[decimal.Decimal] = mapped_column(Numeric(15, 2), nullable=False)
    duration_multiplier: Mapped[decimal.Decimal] = mapped_column(Numeric(8, 2), nullable=False)
    storage_fee: Mapped[decimal.Decimal] = mapped_column(Numeric(15, 2), nullable=False, server_default=text('0'))
    protection_fee: Mapped[decimal.Decimal] = mapped_column(Numeric(15, 2), nullable=False, server_default=text('0'))
    item_status: Mapped[str] = mapped_column(String(50), nullable=False, server_default=text("'pending'::character varying"))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))

    duration: Mapped['DurationOptions'] = relationship('DurationOptions', back_populates='rental_order_items')
    order: Mapped['RentalOrders'] = relationship('RentalOrders', back_populates='rental_order_items')
    protection_plan: Mapped['ProtectionPlans'] = relationship('ProtectionPlans', back_populates='rental_order_items')
    size: Mapped['StorageSizes'] = relationship('StorageSizes', back_populates='rental_order_items')
    unit: Mapped['StorageUnits'] = relationship('StorageUnits', back_populates='rental_order_items')
    rentals: Mapped['Rentals'] = relationship('Rentals', uselist=False, back_populates='item')


class PaymentWebhooks(Base):
    __tablename__ = 'payment_webhooks'
    __table_args__ = (
        CheckConstraint("processed_status::text = ANY (ARRAY['pending'::character varying, 'processed'::character varying, 'failed'::character varying, 'ignored'::character varying]::text[])", name='chk_payment_webhooks_processed_status'),
        ForeignKeyConstraint(['payment_id'], ['payments.payment_id'], ondelete='RESTRICT', onupdate='CASCADE', name='fk_payment_webhooks_payments'),
        PrimaryKeyConstraint('webhook_id', name='payment_webhooks_pkey'),
        Index('idx_payment_webhooks_payment_id', 'payment_id')
    )

    webhook_id: Mapped[int] = mapped_column(BigInteger, Identity(start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1), primary_key=True)
    payment_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    provider_name: Mapped[str] = mapped_column(String(80), nullable=False)
    event_type: Mapped[str] = mapped_column(String(100), nullable=False)
    raw_payload: Mapped[dict] = mapped_column(JSONB, nullable=False)
    received_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    processed_status: Mapped[str] = mapped_column(String(50), nullable=False, server_default=text("'pending'::character varying"))

    payment: Mapped['Payments'] = relationship('Payments', back_populates='payment_webhooks')


class Rentals(Base):
    __tablename__ = 'rentals'
    __table_args__ = (
        CheckConstraint('expected_end_time > actual_start_time AND (actual_end_time IS NULL OR actual_end_time >= actual_start_time)', name='chk_rentals_time'),
        CheckConstraint("rental_status::text = ANY (ARRAY['active'::character varying, 'overdue'::character varying, 'completed'::character varying, 'cancelled'::character varying]::text[])", name='chk_rentals_status'),
        ForeignKeyConstraint(['item_id'], ['rental_order_items.item_id'], ondelete='RESTRICT', onupdate='CASCADE', name='fk_rentals_items'),
        ForeignKeyConstraint(['order_id'], ['rental_orders.order_id'], ondelete='RESTRICT', onupdate='CASCADE', name='fk_rentals_orders'),
        ForeignKeyConstraint(['unit_id'], ['storage_units.unit_id'], ondelete='RESTRICT', onupdate='CASCADE', name='fk_rentals_units'),
        ForeignKeyConstraint(['user_id'], ['users.user_id'], ondelete='RESTRICT', onupdate='CASCADE', name='fk_rentals_users'),
        PrimaryKeyConstraint('rental_id', name='rentals_pkey'),
        UniqueConstraint('item_id', name='rentals_item_id_key'),
        UniqueConstraint('rental_code', name='rentals_rental_code_key'),
        Index('idx_rentals_order_id', 'order_id'),
        Index('idx_rentals_status', 'rental_status'),
        Index('idx_rentals_unit_id', 'unit_id'),
        Index('idx_rentals_user_id', 'user_id')
    )

    rental_id: Mapped[int] = mapped_column(BigInteger, Identity(start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1), primary_key=True)
    order_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    item_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    user_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    unit_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    rental_code: Mapped[str] = mapped_column(String(80), nullable=False)
    actual_start_time: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False)
    expected_end_time: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False)
    rental_status: Mapped[str] = mapped_column(String(50), nullable=False, server_default=text("'active'::character varying"))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    actual_end_time: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))

    item: Mapped['RentalOrderItems'] = relationship('RentalOrderItems', back_populates='rentals')
    order: Mapped['RentalOrders'] = relationship('RentalOrders', back_populates='rentals')
    unit: Mapped['StorageUnits'] = relationship('StorageUnits', back_populates='rentals')
    user: Mapped['Users'] = relationship('Users', back_populates='rentals')
    access_credentials: Mapped[list['AccessCredentials']] = relationship('AccessCredentials', back_populates='rental')
    notifications: Mapped[list['Notifications']] = relationship('Notifications', back_populates='rental')
    support_tickets: Mapped[list['SupportTickets']] = relationship('SupportTickets', back_populates='rental')
    unit_access_logs: Mapped[list['UnitAccessLogs']] = relationship('UnitAccessLogs', back_populates='rental')


class AccessCredentials(Base):
    __tablename__ = 'access_credentials'
    __table_args__ = (
        CheckConstraint("credential_type::text = ANY (ARRAY['QR'::character varying, 'OTP'::character varying, 'PIN'::character varying]::text[])", name='chk_access_credentials_type'),
        CheckConstraint('expired_at > created_at', name='chk_access_credentials_expired_at'),
        ForeignKeyConstraint(['rental_id'], ['rentals.rental_id'], ondelete='RESTRICT', onupdate='CASCADE', name='fk_access_credentials_rentals'),
        PrimaryKeyConstraint('credential_id', name='access_credentials_pkey'),
        UniqueConstraint('credential_value', name='access_credentials_credential_value_key'),
        Index('idx_access_credentials_rental_id', 'rental_id')
    )

    credential_id: Mapped[int] = mapped_column(BigInteger, Identity(start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1), primary_key=True)
    rental_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    credential_type: Mapped[str] = mapped_column(String(30), nullable=False)
    credential_value: Mapped[str] = mapped_column(String(255), nullable=False)
    expired_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('true'))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))

    rental: Mapped['Rentals'] = relationship('Rentals', back_populates='access_credentials')


class Notifications(Base):
    __tablename__ = 'notifications'
    __table_args__ = (
        CheckConstraint("notification_type::text = ANY (ARRAY['payment_success'::character varying, 'payment_failed'::character varying, 'rental_started'::character varying, 'rental_expiring'::character varying, 'rental_overdue'::character varying, 'credential_created'::character varying, 'ticket_replied'::character varying, 'system'::character varying]::text[])", name='chk_notifications_type'),
        ForeignKeyConstraint(['order_id'], ['rental_orders.order_id'], ondelete='SET NULL', onupdate='CASCADE', name='fk_notifications_orders'),
        ForeignKeyConstraint(['rental_id'], ['rentals.rental_id'], ondelete='SET NULL', onupdate='CASCADE', name='fk_notifications_rentals'),
        ForeignKeyConstraint(['user_id'], ['users.user_id'], ondelete='RESTRICT', onupdate='CASCADE', name='fk_notifications_users'),
        PrimaryKeyConstraint('notification_id', name='notifications_pkey'),
        Index('idx_notifications_is_read', 'is_read'),
        Index('idx_notifications_user_id', 'user_id')
    )

    notification_id: Mapped[int] = mapped_column(BigInteger, Identity(start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1), primary_key=True)
    user_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    notification_type: Mapped[str] = mapped_column(String(80), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('false'))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    order_id: Mapped[Optional[int]] = mapped_column(BigInteger)
    rental_id: Mapped[Optional[int]] = mapped_column(BigInteger)

    order: Mapped[Optional['RentalOrders']] = relationship('RentalOrders', back_populates='notifications')
    rental: Mapped[Optional['Rentals']] = relationship('Rentals', back_populates='notifications')
    user: Mapped['Users'] = relationship('Users', back_populates='notifications')


class SupportTickets(Base):
    __tablename__ = 'support_tickets'
    __table_args__ = (
        CheckConstraint("priority::text = ANY (ARRAY['low'::character varying, 'normal'::character varying, 'high'::character varying, 'urgent'::character varying]::text[])", name='chk_support_tickets_priority'),
        CheckConstraint("ticket_status::text = ANY (ARRAY['open'::character varying, 'assigned'::character varying, 'in_progress'::character varying, 'resolved'::character varying, 'closed'::character varying, 'cancelled'::character varying]::text[])", name='chk_support_tickets_status'),
        ForeignKeyConstraint(['assigned_staff_id'], ['users.user_id'], ondelete='SET NULL', onupdate='CASCADE', name='fk_support_tickets_assigned_staff'),
        ForeignKeyConstraint(['order_id'], ['rental_orders.order_id'], ondelete='SET NULL', onupdate='CASCADE', name='fk_support_tickets_orders'),
        ForeignKeyConstraint(['rental_id'], ['rentals.rental_id'], ondelete='SET NULL', onupdate='CASCADE', name='fk_support_tickets_rentals'),
        ForeignKeyConstraint(['user_id'], ['users.user_id'], ondelete='RESTRICT', onupdate='CASCADE', name='fk_support_tickets_users'),
        PrimaryKeyConstraint('ticket_id', name='support_tickets_pkey'),
        Index('idx_support_tickets_assigned_staff_id', 'assigned_staff_id'),
        Index('idx_support_tickets_status', 'ticket_status'),
        Index('idx_support_tickets_user_id', 'user_id')
    )

    ticket_id: Mapped[int] = mapped_column(BigInteger, Identity(start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1), primary_key=True)
    user_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    subject: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[str] = mapped_column(String(80), nullable=False)
    priority: Mapped[str] = mapped_column(String(30), nullable=False, server_default=text("'normal'::character varying"))
    ticket_status: Mapped[str] = mapped_column(String(50), nullable=False, server_default=text("'open'::character varying"))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    order_id: Mapped[Optional[int]] = mapped_column(BigInteger)
    rental_id: Mapped[Optional[int]] = mapped_column(BigInteger)
    assigned_staff_id: Mapped[Optional[int]] = mapped_column(BigInteger)

    assigned_staff: Mapped[Optional['Users']] = relationship('Users', foreign_keys=[assigned_staff_id], back_populates='support_tickets_assigned_staff')
    order: Mapped[Optional['RentalOrders']] = relationship('RentalOrders', back_populates='support_tickets')
    rental: Mapped[Optional['Rentals']] = relationship('Rentals', back_populates='support_tickets')
    user: Mapped['Users'] = relationship('Users', foreign_keys=[user_id], back_populates='support_tickets_user')
    support_messages: Mapped[list['SupportMessages']] = relationship('SupportMessages', back_populates='ticket')


class UnitAccessLogs(Base):
    __tablename__ = 'unit_access_logs'
    __table_args__ = (
        CheckConstraint("action_result::text = ANY (ARRAY['success'::character varying, 'failed'::character varying]::text[])", name='chk_unit_access_logs_action_result'),
        CheckConstraint("action_type::text = ANY (ARRAY['unlock'::character varying, 'lock'::character varying, 'check_in'::character varying, 'check_out'::character varying]::text[])", name='chk_unit_access_logs_action_type'),
        ForeignKeyConstraint(['rental_id'], ['rentals.rental_id'], ondelete='RESTRICT', onupdate='CASCADE', name='fk_unit_access_logs_rentals'),
        ForeignKeyConstraint(['unit_id'], ['storage_units.unit_id'], ondelete='RESTRICT', onupdate='CASCADE', name='fk_unit_access_logs_units'),
        ForeignKeyConstraint(['user_id'], ['users.user_id'], ondelete='RESTRICT', onupdate='CASCADE', name='fk_unit_access_logs_users'),
        PrimaryKeyConstraint('access_log_id', name='unit_access_logs_pkey'),
        Index('idx_unit_access_logs_event_time', 'event_time'),
        Index('idx_unit_access_logs_rental_id', 'rental_id'),
        Index('idx_unit_access_logs_unit_id', 'unit_id'),
        Index('idx_unit_access_logs_user_id', 'user_id')
    )

    access_log_id: Mapped[int] = mapped_column(BigInteger, Identity(start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1), primary_key=True)
    rental_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    unit_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    user_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    action_type: Mapped[str] = mapped_column(String(50), nullable=False)
    action_result: Mapped[str] = mapped_column(String(50), nullable=False)
    event_time: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    note: Mapped[Optional[str]] = mapped_column(Text)

    rental: Mapped['Rentals'] = relationship('Rentals', back_populates='unit_access_logs')
    unit: Mapped['StorageUnits'] = relationship('StorageUnits', back_populates='unit_access_logs')
    user: Mapped['Users'] = relationship('Users', back_populates='unit_access_logs')


class SupportMessages(Base):
    __tablename__ = 'support_messages'
    __table_args__ = (
        ForeignKeyConstraint(['sender_id'], ['users.user_id'], ondelete='RESTRICT', onupdate='CASCADE', name='fk_support_messages_senders'),
        ForeignKeyConstraint(['ticket_id'], ['support_tickets.ticket_id'], ondelete='RESTRICT', onupdate='CASCADE', name='fk_support_messages_tickets'),
        PrimaryKeyConstraint('message_id', name='support_messages_pkey'),
        Index('idx_support_messages_ticket_id', 'ticket_id')
    )

    message_id: Mapped[int] = mapped_column(BigInteger, Identity(start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1), primary_key=True)
    ticket_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    sender_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    message_content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))

    sender: Mapped['Users'] = relationship('Users', back_populates='support_messages')
    ticket: Mapped['SupportTickets'] = relationship('SupportTickets', back_populates='support_messages')
