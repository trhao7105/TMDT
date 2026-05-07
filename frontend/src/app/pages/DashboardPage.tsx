import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import api from "../../api/axios";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Package,
  Calendar,
  CreditCard,
  Clock,
  MapPin,
  QrCode,
  FileText,
  Plus,
  AlertTriangle,
} from "lucide-react";

function getRemainingTime(endTime: string | null): {
  label: string;
  daysLeft: number;
  percent: number;
  urgent: boolean;
  warning: boolean;
} | null {
  if (!endTime) return null;
  const now = new Date();
  const end = new Date(endTime);
  const diffMs = end.getTime() - now.getTime();
  if (diffMs <= 0) return { label: "Đã hết hạn", daysLeft: 0, percent: 100, urgent: true, warning: false };
  const daysLeft = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const label = daysLeft > 0 ? `${daysLeft} ngày ${hoursLeft} giờ` : `${hoursLeft} giờ`;
  // percent elapsed (capped 0-100)
  return {
    label,
    daysLeft,
    percent: Math.min(100, Math.max(0, 100 - (diffMs / (30 * 24 * 60 * 60 * 1000)) * 100)),
    urgent: daysLeft <= 3,
    warning: daysLeft > 3 && daysLeft <= 7,
  };
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const name = localStorage.getItem("userName") || "Khách hàng";
    const email = localStorage.getItem("userEmail") || "";
    setUserName(name || email.split("@")[0]);

    const fetchBookings = async () => {
      try {
        const response = await api.get('/orders/my-orders');
        setUserBookings(response.data);
      } catch (error) {
        console.error("Failed to fetch user bookings", error);
      }
    };
    
    fetchBookings();
  }, [navigate]);

  const activeBookings = userBookings.filter((b) => b.status === "confirmed");
  const totalSpent = userBookings.reduce((sum, b) => sum + (b.finalTotal || 0), 0);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed": return { text: "Đang hoạt động", className: "bg-green-500" };
      case "expired":   return { text: "Đã hết hạn",     className: "bg-gray-400" };
      case "cancelled": return { text: "Đã huỷ",         className: "bg-red-400" };
      default:          return { text: "Đang xử lý",     className: "bg-yellow-500" };
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl mb-2 text-foreground">
            Xin chào, {userName}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Quản lý các kho của bạn và theo dõi đơn hàng
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Kho đang thuê</p>
                <p className="text-3xl text-foreground">{activeBookings.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tổng đơn hàng</p>
                <p className="text-3xl text-foreground">{userBookings.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tổng chi tiêu</p>
                <p className="text-3xl text-foreground">
                  {(totalSpent / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">Kho đang thuê</TabsTrigger>
            <TabsTrigger value="history">Lịch sử đơn hàng</TabsTrigger>
            <TabsTrigger value="payment">Thanh toán</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {activeBookings.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-foreground">Chưa có kho nào</h3>
                <p className="text-muted-foreground mb-6">
                  Bắt đầu đặt kho ngay để lưu trữ tài sản của bạn
                </p>
                <Button asChild>
                  <Link to="/storage">
                    <Plus className="mr-2 h-5 w-5" />
                    Đặt kho ngay
                  </Link>
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeBookings.map((booking) => {
                  const remaining = getRemainingTime(booking.endTime);
                  return (
                  <Card key={booking.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="mb-1 text-foreground">{booking.storage.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Mã: {booking.id}
                        </p>
                      </div>
                      <Badge className="bg-green-500">Đang hoạt động</Badge>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-3 text-sm">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Kích thước: {booking.storage.dimension}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Thời hạn: {booking.duration?.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Gói bảo vệ: {booking.protectionPlan?.name}
                        </span>
                      </div>
                    </div>

                    {/* Remaining time section */}
                    {remaining && (
                      <div className={`rounded-lg p-3 mb-4 ${
                        remaining.urgent
                          ? "bg-red-50 border border-red-200"
                          : remaining.warning
                          ? "bg-yellow-50 border border-yellow-200"
                          : "bg-green-50 border border-green-200"
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {remaining.urgent && (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                            <span className={`text-sm font-semibold ${
                              remaining.urgent ? "text-red-600"
                              : remaining.warning ? "text-yellow-700"
                              : "text-green-700"
                            }`}>
                              ⏳ Còn lại: {remaining.label}
                            </span>
                          </div>
                          {booking.endTime && (
                            <span className="text-xs text-muted-foreground">
                              HH: {new Date(booking.endTime).toLocaleDateString("vi-VN")}
                            </span>
                          )}
                        </div>
                        {/* Progress bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              remaining.urgent ? "bg-red-500"
                              : remaining.warning ? "bg-yellow-400"
                              : "bg-green-500"
                            }`}
                            style={{ width: `${remaining.percent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Tổng thanh toán</span>
                        <span className="text-xl text-primary">
                          {booking.finalTotal?.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    </div>
                  </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {userBookings.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-foreground">Chưa có lịch sử</h3>
                <p className="text-muted-foreground">
                  Các đơn hàng của bạn sẽ hiển thị ở đây
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {userBookings.map((booking) => (
                  <Card key={booking.id} className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-foreground">{booking.storage.name}</h3>
                          <Badge className={getStatusLabel(booking.status).className}>
                            {getStatusLabel(booking.status).text}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>Mã đơn: {booking.id}</p>
                          <p>Kích thước: {booking.storage.dimension}</p>
                          <p>Thời gian: {booking.duration?.label}</p>
                          <p>Gói bảo vệ: {booking.protectionPlan?.name}</p>
                          {booking.additionalServices && booking.additionalServices.length > 0 && (
                            <p>
                              Dịch vụ: {booking.additionalServices.map((s: any) => s.name).join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl text-primary mb-1">
                          {booking.finalTotal?.toLocaleString("vi-VN")}đ
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {booking.paymentMethod === "card"
                            ? "Thẻ"
                            : booking.paymentMethod === "bank"
                            ? "Chuyển khoản"
                            : "Ví điện tử"}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="payment" className="space-y-6">
            <Card className="p-12 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <CreditCard className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-foreground">Phương thức thanh toán</h3>
              <p className="text-muted-foreground">
                Quản lý các phương thức thanh toán của bạn
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
