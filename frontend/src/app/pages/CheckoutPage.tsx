import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../../api/axios";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { ArrowLeft, CreditCard, Building2, Smartphone, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

export function CheckoutPage() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [sepayData, setSepayData] = useState<any>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const savedBooking = localStorage.getItem("booking");
    if (!savedBooking) {
      navigate("/storage");
      return;
    }
    const parsedBooking = JSON.parse(savedBooking);
    setBooking(parsedBooking);
    
    // Auto-fill address if transport address was provided
    if (parsedBooking.transportAddress) {
      setFormData(prev => ({ ...prev, address: parsedBooking.transportAddress }));
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error("Vui lòng điền đầy đủ thông tin cá nhân");
      return;
    }

    setIsProcessing(true);

    try {
      const payload = {
        storage_id: booking.storage.id,
        location_id: booking.location.id,
        service_type: booking.serviceType || 'package',
        duration_id: booking.duration?.id || 'duration-1',
        protection_plan_id: booking.protectionPlan?.id || 'protection-basic',
        additional_services: booking.additionalServices || [],
        total_price: booking.pricing.totalPrice,
        payment_method: paymentMethod
      };

      const response = await api.post("/orders/checkout", payload);

      if (response.data.checkout_url) {
        // Stripe Redirect
        window.location.href = response.data.checkout_url;
      } else if (response.data.qr_url) {
        // SePay QR Mode
        setSepayData(response.data);
        setIsQRModalOpen(true);
        setIsProcessing(false);
      } else {
        toast.success("Đã đặt kho thành công!");
        localStorage.removeItem("booking");
        navigate("/dashboard");
      }
    } catch (error) {
      setIsProcessing(false);
      toast.error("Có lỗi xảy ra khi thanh toán");
      console.error(error);
    }
  };

  const handleBack = () => {
    navigate("/services");
  };

  if (!booking) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl mb-4 text-foreground">
            Thanh toán
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hoàn tất thông tin để xác nhận đặt kho
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card className="p-6">
                <h2 className="mb-6 text-foreground">Thông tin cá nhân</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Họ và tên *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Nguyễn Văn A"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="example@email.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Số điện thoại *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="0901234567"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Địa chỉ</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Nguyễn Huệ, Q.1, TP.HCM"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="mb-6 text-foreground">Phương thức thanh toán</h2>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                  <div className={`flex items-center space-x-3 rounded-xl border p-4 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-primary/50'}`}>
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-semibold">Thẻ quốc tế (Stripe)</div>
                        <div className="text-xs text-muted-foreground">Visa, Mastercard, JCB...</div>
                      </div>
                    </Label>
                  </div>

                  <div className={`flex items-center space-x-3 rounded-xl border p-4 cursor-pointer transition-all ${paymentMethod === 'sepay' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-primary/50'}`}>
                    <RadioGroupItem value="sepay" id="sepay" />
                    <Label htmlFor="sepay" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Building2 className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-semibold">Chuyển khoản Ngân hàng (SePay)</div>
                        <div className="text-xs text-muted-foreground">Quét mã VietQR, xác nhận tự động</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                <div className="mt-6 pt-6 border-t">
                  {paymentMethod === 'card' ? (
                    <div className="flex items-center gap-4 grayscale opacity-60">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="text-xs text-muted-foreground">Đối tác thanh toán:</div>
                      <div className="font-bold text-blue-600">SePay</div>
                    </div>
                  )}
                </div>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleBack}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Quay lại
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>Đang xử lý...</>
                  ) : (
                    <>
                      Xác nhận thanh toán
                      <CheckCircle className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="mb-6 text-foreground">Tóm tắt đơn hàng</h2>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Khu vực</div>
                  <div className="text-foreground">{booking.location?.name}</div>
                  <div className="text-sm text-muted-foreground">{booking.location?.address}</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Kho đã chọn</div>
                  <div className="text-foreground">{booking.storage.name}</div>
                  <div className="text-sm text-muted-foreground">{booking.storage.dimension}</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Thời gian thuê</div>
                  <div className="text-foreground">{booking.duration?.label}</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Gói bảo vệ</div>
                  <div className="text-foreground">{booking.protectionPlan?.name}</div>
                </div>

                {booking.additionalServices && booking.additionalServices.length > 0 && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Dịch vụ bổ sung</div>
                    <ul className="space-y-1">
                      {booking.additionalServices.map((service: any) => (
                        <li key={service.id} className="text-sm text-foreground">
                          • {service.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Phí lưu trữ</span>
                    <span className="text-foreground">
                      {booking.pricing?.storagePrice.toLocaleString("vi-VN")}đ
                    </span>
                  </div>

                  {booking.pricing?.protectionPrice > 0 && (
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Gói bảo vệ</span>
                      <span className="text-foreground">
                        {booking.pricing.protectionPrice.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  )}

                  {booking.pricing?.servicesPrice > 0 && (
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Dịch vụ bổ sung</span>
                      <span className="text-foreground">
                        {booking.pricing.servicesPrice.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between mb-4">
                    <span className="text-foreground">Tổng cộng</span>
                    <span className="text-2xl text-primary">
                      {booking.pricing?.totalPrice.toLocaleString("vi-VN")}đ
                    </span>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <div className="text-sm text-green-800">
                        <p className="font-medium mb-1">Bảo mật an toàn</p>
                        <p>Thông tin thanh toán được mã hóa SSL 256-bit</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />

      {/* SePay QR Modal */}
      <Dialog open={isQRModalOpen} onOpenChange={setIsQRModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Quét mã VietQR để thanh toán</DialogTitle>
            <DialogDescription className="text-center">
              Vui lòng sử dụng ứng dụng Ngân hàng để quét mã dưới đây
            </DialogDescription>
          </DialogHeader>
          
          {sepayData && (
            <div className="space-y-6 py-4">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="bg-white p-2 rounded-xl shadow-md border-4 border-primary/10">
                  <img src={sepayData.qr_url} alt="VietQR" className="w-64 h-64 object-contain" />
                </div>
                <div className="text-center bg-blue-50 p-4 rounded-lg w-full">
                  <p className="text-sm text-muted-foreground mb-1">Số tiền thanh toán</p>
                  <p className="text-2xl font-bold text-primary">{sepayData.amount.toLocaleString("vi-VN")}đ</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm border-b pb-2">
                  <span className="text-muted-foreground">Ngân hàng</span>
                  <span className="font-semibold">{sepayData.bank_name}</span>
                </div>
                <div className="flex justify-between text-sm border-b pb-2">
                  <span className="text-muted-foreground">Số tài khoản</span>
                  <span className="font-semibold">{sepayData.account_no}</span>
                </div>
                <div className="flex justify-between text-sm border-b pb-2">
                  <span className="text-muted-foreground">Chủ tài khoản</span>
                  <span className="font-semibold uppercase">{sepayData.account_name}</span>
                </div>
                <div className="flex justify-between text-sm border-b pb-2">
                  <span className="text-muted-foreground">Nội dung chuyển khoản</span>
                  <span className="font-bold text-red-600">{sepayData.description}</span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex gap-3">
                <Smartphone className="h-5 w-5 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-800 italic">
                  Hệ thống sẽ tự động xác nhận đơn hàng sau khi nhận được tiền (thường mất 1-2 phút). Vui lòng không tắt cửa sổ này.
                </p>
              </div>

              <Button 
                className="w-full" 
                onClick={() => {
                  setIsQRModalOpen(false);
                  navigate("/dashboard");
                }}
              >
                Tôi đã chuyển khoản
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
