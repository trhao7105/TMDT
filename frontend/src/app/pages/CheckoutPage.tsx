import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { ArrowLeft, CreditCard, Building2, Smartphone, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export function CheckoutPage() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  });

  useEffect(() => {
    const savedBooking = localStorage.getItem("booking");
    if (!savedBooking) {
      navigate("/storage");
      return;
    }
    setBooking(JSON.parse(savedBooking));
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

    if (paymentMethod === "card" && (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvv)) {
      toast.error("Vui lòng điền đầy đủ thông tin thẻ");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const bookingId = "BK" + Date.now();
      const completedBooking = {
        ...booking,
        id: bookingId,
        customerInfo: formData,
        paymentMethod,
        status: "confirmed",
        createdAt: new Date().toISOString(),
        finalTotal: booking.pricing.totalPrice,
      };

      const existingBookings = JSON.parse(localStorage.getItem("userBookings") || "[]");
      existingBookings.push(completedBooking);
      localStorage.setItem("userBookings", JSON.stringify(existingBookings));

      localStorage.removeItem("booking");

      setIsProcessing(false);
      toast.success("Đặt kho thành công!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    }, 2000);
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
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:border-primary transition-colors">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <div>
                          <div>Thẻ tín dụng / Thẻ ghi nợ</div>
                          <div className="text-sm text-muted-foreground">Visa, Mastercard, JCB</div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:border-primary transition-colors">
                      <RadioGroupItem value="bank" id="bank" />
                      <Label htmlFor="bank" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Building2 className="h-5 w-5 text-primary" />
                        <div>
                          <div>Chuyển khoản ngân hàng</div>
                          <div className="text-sm text-muted-foreground">Chuyển khoản qua Internet Banking</div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:border-primary transition-colors">
                      <RadioGroupItem value="momo" id="momo" />
                      <Label htmlFor="momo" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Smartphone className="h-5 w-5 text-primary" />
                        <div>
                          <div>Ví điện tử</div>
                          <div className="text-sm text-muted-foreground">MoMo, ZaloPay, VNPay</div>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>

                {paymentMethod === "card" && (
                  <div className="mt-6 space-y-4 pt-6 border-t">
                    <div>
                      <Label htmlFor="cardNumber">Số thẻ *</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required={paymentMethod === "card"}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cardExpiry">Ngày hết hạn *</Label>
                        <Input
                          id="cardExpiry"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          maxLength={5}
                          required={paymentMethod === "card"}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardCvv">CVV *</Label>
                        <Input
                          id="cardCvv"
                          name="cardCvv"
                          type="password"
                          value={formData.cardCvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          maxLength={3}
                          required={paymentMethod === "card"}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "bank" && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-foreground mb-2">Thông tin chuyển khoản:</p>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Ngân hàng: <span className="text-foreground">Vietcombank</span></p>
                      <p>Số tài khoản: <span className="text-foreground">1234567890</span></p>
                      <p>Chủ tài khoản: <span className="text-foreground">CÔNG TY ILOCKER</span></p>
                      <p>Nội dung: <span className="text-foreground">THANHTOAN [Mã đơn hàng]</span></p>
                    </div>
                  </div>
                )}

                {paymentMethod === "momo" && (
                  <div className="mt-6 p-4 bg-pink-50 rounded-lg border border-pink-200">
                    <p className="text-sm text-foreground">
                      Bạn sẽ được chuyển đến trang thanh toán ví điện tử sau khi xác nhận đơn hàng.
                    </p>
                  </div>
                )}
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
    </div>
  );
}
