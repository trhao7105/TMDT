import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  Clock,
  Truck,
  Package as PackageIcon,
  Box,
  Info,
} from "lucide-react";

interface DurationOption {
  id: string;
  label: string;
  value: number;
  multiplier: number;
  popular?: boolean;
}

interface ProtectionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

interface AdditionalService {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  unit: string;
  requiresInput?: boolean;
  inputLabel?: string;
  inputUnit?: string;
}

export function ServicesPage() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [selectedDuration, setSelectedDuration] = useState<string>("duration-1");
  const [selectedProtection, setSelectedProtection] = useState<string>("protection-basic");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [serviceInputs, setServiceInputs] = useState<Record<string, number>>({
    "service-transport": 0,
    "service-packing": 0,
  });

  useEffect(() => {
    const savedBooking = localStorage.getItem("booking");
    if (!savedBooking) {
      navigate("/storage");
      return;
    }
    setBooking(JSON.parse(savedBooking));
  }, [navigate]);

  const durationOptions: DurationOption[] = [
    { id: "duration-0", label: "≤ 1 tháng", value: 1, multiplier: 1.0 },
    { id: "duration-1", label: "1 tháng", value: 1, multiplier: 1.2, popular: true },
    { id: "duration-2", label: "2 tháng", value: 2, multiplier: 2.0 },
    { id: "duration-3", label: "3 tháng", value: 3, multiplier: 2.9 },
    { id: "duration-6", label: "6 tháng", value: 6, multiplier: 5.5 },
    { id: "duration-12", label: "1+ năm", value: 12, multiplier: 10.0 },
  ];

  const protectionPlans: ProtectionPlan[] = [
    {
      id: "protection-basic",
      name: "Basic",
      price: 0,
      features: [
        "Bảo hiểm cơ bản",
        "Bồi thường tối đa 1 triệu",
        "Camera giám sát 24/7",
      ],
    },
    {
      id: "protection-silver",
      name: "Silver",
      price: 50000,
      popular: true,
      features: [
        "Bảo hiểm nâng cao",
        "Bồi thường tối đa 5 triệu",
        "Camera + cảm biến chuyển động",
        "Hỗ trợ khẩn cấp 24/7",
      ],
    },
    {
      id: "protection-gold",
      name: "Gold",
      price: 100000,
      features: [
        "Bảo hiểm toàn diện",
        "Bồi thường tối đa 10 triệu",
        "Camera + cảm biến + báo động",
        "Hỗ trợ ưu tiên",
        "Kiểm tra định kỳ",
      ],
    },
    {
      id: "protection-plus",
      name: "Plus",
      price: 200000,
      features: [
        "Bảo hiểm cao cấp",
        "Bồi thường tối đa 20 triệu",
        "Hệ thống bảo mật đa lớp",
        "Hỗ trợ VIP 24/7",
        "Kiểm tra hàng tuần",
        "Chống cháy nổ",
      ],
    },
  ];

  const additionalServices: AdditionalService[] = [
    {
      id: "service-transport",
      name: "Vận chuyển",
      description: "Dịch vụ vận chuyển tận nơi",
      basePrice: 500000,
      unit: "chuyến",
      requiresInput: true,
      inputLabel: "Khoảng cách (km)",
      inputUnit: "10.000đ/km",
    },
    {
      id: "service-loading",
      name: "Bốc xếp",
      description: "Hỗ trợ bốc xếp hàng hóa",
      basePrice: 100000,
      unit: "chuyến",
    },
    {
      id: "service-packing",
      name: "Đóng gói",
      description: "Miễn phí <10 thùng, sau đó 5.000đ/thùng",
      basePrice: 5000,
      unit: "thùng",
      requiresInput: true,
      inputLabel: "Số thùng cần đóng",
      inputUnit: "thùng",
    },
  ];

  const calculatePrice = () => {
    if (!booking) return { storagePrice: 0, protectionPrice: 0, servicesPrice: 0, totalPrice: 0 };

    const selectedDurationObj = durationOptions.find((d) => d.id === selectedDuration);
    const selectedProtectionObj = protectionPlans.find((p) => p.id === selectedProtection);

    const storagePrice = Math.round(
      booking.storage.price * (selectedDurationObj?.multiplier || 1)
    );

    const protectionPrice = (selectedProtectionObj?.price || 0) * (selectedDurationObj?.value || 1);

    let servicesPrice = 0;
    selectedServices.forEach((serviceId) => {
      const service = additionalServices.find((s) => s.id === serviceId);
      if (service) {
        if (serviceId === "service-transport") {
          const km = serviceInputs[serviceId] || 0;
          servicesPrice += service.basePrice + km * 10000;
        } else if (serviceId === "service-packing") {
          const boxes = serviceInputs[serviceId] || 0;
          if (boxes > 10) {
            servicesPrice += (boxes - 10) * service.basePrice;
          }
        } else {
          servicesPrice += service.basePrice;
        }
      }
    });

    const totalPrice = storagePrice + protectionPrice + servicesPrice;

    return { storagePrice, protectionPrice, servicesPrice, totalPrice };
  };

  const pricing = calculatePrice();

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleServiceInputChange = (serviceId: string, value: number) => {
    setServiceInputs((prev) => ({ ...prev, [serviceId]: value }));
  };

  const handleContinue = () => {
    if (booking) {
      const selectedDurationObj = durationOptions.find((d) => d.id === selectedDuration);
      const selectedProtectionObj = protectionPlans.find((p) => p.id === selectedProtection);
      const selectedServicesList = selectedServices.map((id) => {
        const service = additionalServices.find((s) => s.id === id);
        return {
          ...service,
          input: serviceInputs[id],
        };
      });

      localStorage.setItem(
        "booking",
        JSON.stringify({
          ...booking,
          duration: selectedDurationObj,
          protectionPlan: selectedProtectionObj,
          additionalServices: selectedServicesList,
          pricing,
        })
      );
      navigate("/checkout");
    }
  };

  if (!booking) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl mb-4 text-foreground">
            Chọn thời gian & dịch vụ
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tùy chỉnh gói dịch vụ phù hợp với nhu cầu của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="h-5 w-5 text-primary" />
                <h2 className="text-foreground">Thời gian thuê</h2>
              </div>
              <RadioGroup value={selectedDuration} onValueChange={setSelectedDuration}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {durationOptions.map((duration) => (
                    <div
                      key={duration.id}
                      className={`relative flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                        selectedDuration === duration.id
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedDuration(duration.id)}
                    >
                      <RadioGroupItem value={duration.id} id={duration.id} />
                      <Label htmlFor={duration.id} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-foreground">{duration.label}</div>
                            <div className="text-sm text-muted-foreground">
                              Hệ số: {duration.multiplier}x
                            </div>
                          </div>
                          {duration.popular && (
                            <Badge variant="secondary" className="ml-2">
                              Phổ biến
                            </Badge>
                          )}
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="text-foreground">Gói bảo vệ</h2>
              </div>
              <RadioGroup value={selectedProtection} onValueChange={setSelectedProtection}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {protectionPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative rounded-lg border p-4 cursor-pointer transition-colors ${
                        selectedProtection === plan.id
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedProtection(plan.id)}
                    >
                      {plan.popular && (
                        <Badge className="absolute -top-2 -right-2 bg-primary">Đề xuất</Badge>
                      )}
                      <div className="flex items-start space-x-3 mb-3">
                        <RadioGroupItem value={plan.id} id={plan.id} />
                        <div className="flex-1">
                          <Label htmlFor={plan.id} className="cursor-pointer">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-foreground">{plan.name}</span>
                              <span className="text-primary">
                                {plan.price === 0
                                  ? "Miễn phí"
                                  : `${plan.price.toLocaleString("vi-VN")}đ/tháng`}
                              </span>
                            </div>
                          </Label>
                          <ul className="space-y-1 mt-2">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="text-xs text-muted-foreground flex items-start gap-1">
                                <span className="text-primary">•</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Truck className="h-5 w-5 text-primary" />
                <h2 className="text-foreground">Dịch vụ bổ sung</h2>
              </div>
              <div className="space-y-4">
                {additionalServices.map((service) => (
                  <div
                    key={service.id}
                    className={`rounded-lg border p-4 transition-colors ${
                      selectedServices.includes(service.id)
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id={service.id}
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={() => handleServiceToggle(service.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor={service.id} className="cursor-pointer">
                          <div className="flex items-start justify-between mb-1">
                            <div>
                              <div className="text-foreground">{service.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {service.description}
                              </div>
                            </div>
                            <div className="text-primary text-sm whitespace-nowrap ml-4">
                              {service.basePrice.toLocaleString("vi-VN")}đ/{service.unit}
                              {service.inputUnit && (
                                <div className="text-xs text-muted-foreground">
                                  + {service.inputUnit}
                                </div>
                              )}
                            </div>
                          </div>
                        </Label>
                        {service.requiresInput && selectedServices.includes(service.id) && (
                          <div className="mt-3">
                            <Label htmlFor={`${service.id}-input`} className="text-sm">
                              {service.inputLabel}
                            </Label>
                            <Input
                              id={`${service.id}-input`}
                              type="number"
                              min="0"
                              value={serviceInputs[service.id] || 0}
                              onChange={(e) =>
                                handleServiceInputChange(
                                  service.id,
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="mt-1"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="mb-6 text-foreground">Tóm tắt giá</h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                  <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div className="text-xs text-muted-foreground">
                    Giá được tính dựa trên hệ số thời gian và các dịch vụ bạn chọn
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-2">Kho đã chọn</div>
                  <div className="text-foreground">{booking.storage.name}</div>
                  <div className="text-sm text-muted-foreground">{booking.storage.dimension}</div>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phí lưu trữ</span>
                    <span className="text-foreground">
                      {pricing.storagePrice.toLocaleString("vi-VN")}đ
                    </span>
                  </div>

                  {pricing.protectionPrice > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Gói bảo vệ</span>
                      <span className="text-foreground">
                        {pricing.protectionPrice.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  )}

                  {pricing.servicesPrice > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Dịch vụ bổ sung</span>
                      <span className="text-foreground">
                        {pricing.servicesPrice.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-foreground">Tổng cộng</span>
                    <span className="text-2xl text-primary">
                      {pricing.totalPrice.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    Đã bao gồm thuế VAT
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button onClick={handleContinue} className="w-full" size="lg">
                  Tiếp tục thanh toán
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/storage")}
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Quay lại
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
