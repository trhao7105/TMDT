import { useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Package, Check, ArrowRight, Truck, Lock, Clock } from "lucide-react";

interface StorageSize {
  id: string;
  name: string;
  dimension: string;
  description: string;
  price: number;
  features: string[];
  popular?: boolean;
}

export function StorageSelectionPage() {
  const navigate = useNavigate();
  const [serviceType, setServiceType] = useState<"package" | "self">("package");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const packageStorages: StorageSize[] = [
    {
      id: "pkg-xxs",
      name: "XXS",
      dimension: "2m³",
      description: "Phù hợp cho đồ cá nhân, hồ sơ, quần áo theo mùa",
      price: 495000,
      features: [
        "Đóng gói & vận chuyển chuyên nghiệp",
        "Lưu trữ trong kho hiện đại",
        "Giao trả hàng hóa theo nhu cầu",
        "Kiểm soát nhiệt độ & độ ẩm",
      ],
    },
    {
      id: "pkg-xs",
      name: "XS",
      dimension: "3m³",
      description: "Tủ quần áo, hộp đựng đồ, dụng cụ thể thao",
      price: 695000,
      features: [
        "Đóng gói & vận chuyển chuyên nghiệp",
        "Lưu trữ trong kho hiện đại",
        "Giao trả hàng hóa theo nhu cầu",
        "Kiểm soát nhiệt độ & độ ẩm",
      ],
    },
    {
      id: "pkg-s",
      name: "S",
      dimension: "5m³",
      description: "Đồ đạc phòng ngủ, xe đạp, đồ dùng văn phòng",
      price: 1195000,
      popular: true,
      features: [
        "Đóng gói & vận chuyển chuyên nghiệp",
        "Lưu trữ trong kho hiện đại",
        "Giao trả hàng hóa theo nhu cầu",
        "Kiểm soát nhiệt độ & độ ẩm",
      ],
    },
    {
      id: "pkg-m",
      name: "M",
      dimension: "8m³",
      description: "Nội thất phòng 1-2 người, hàng kinh doanh",
      price: 1845000,
      features: [
        "Đóng gói & vận chuyển chuyên nghiệp",
        "Lưu trữ trong kho hiện đại",
        "Giao trả hàng hóa theo nhu cầu",
        "Kiểm soát nhiệt độ & độ ẩm",
      ],
    },
    {
      id: "pkg-l",
      name: "L",
      dimension: "12m³",
      description: "Nội thất căn hộ, hàng hóa kinh doanh",
      price: 2495000,
      features: [
        "Đóng gói & vận chuyển chuyên nghiệp",
        "Lưu trữ trong kho hiện đại",
        "Giao trả hàng hóa theo nhu cầu",
        "Kiểm soát nhiệt độ & độ ẩm",
      ],
    },
    {
      id: "pkg-xl",
      name: "XL",
      dimension: "18m³",
      description: "Toàn bộ nội thất nhà, kho hàng doanh nghiệp",
      price: 3495000,
      features: [
        "Đóng gói & vận chuyển chuyên nghiệp",
        "Lưu trữ trong kho hiện đại",
        "Giao trả hàng hóa theo nhu cầu",
        "Kiểm soát nhiệt độ & độ ẩm",
      ],
    },
    {
      id: "pkg-xxl",
      name: "XXL",
      dimension: "25m³",
      description: "Kho hàng lớn, toàn bộ tài sản gia đình",
      price: 5195000,
      features: [
        "Đóng gói & vận chuyển chuyên nghiệp",
        "Lưu trữ trong kho hiện đại",
        "Giao trả hàng hóa theo nhu cầu",
        "Kiểm soát nhiệt độ & độ ẩm",
      ],
    },
  ];

  const selfStorages: StorageSize[] = [
    {
      id: "self-1",
      name: "6 thùng",
      dimension: "1m³",
      description: "Tài liệu, sách vở, đồ dùng cá nhân nhỏ gọn",
      price: 395000,
      features: [
        "Truy cập vào kho 24/7",
        "Tủ đựng đồ riêng biệt",
        "Được bảo vệ chuyên nghiệp",
        "Hàng hóa khách tự mang đến",
      ],
    },
    {
      id: "self-2",
      name: "12 thùng",
      dimension: "2m³",
      description: "Quần áo, giày dép, đồ dùng sinh hoạt",
      price: 795000,
      popular: true,
      features: [
        "Truy cập vào kho 24/7",
        "Tủ đựng đồ riêng biệt",
        "Được bảo vệ chuyên nghiệp",
        "Hàng hóa khách tự mang đến",
      ],
    },
    {
      id: "self-3",
      name: "18 thùng",
      dimension: "3m³",
      description: "Đồ đạc phòng ngủ, thiết bị điện tử",
      price: 1195000,
      features: [
        "Truy cập vào kho 24/7",
        "Tủ đựng đồ riêng biệt",
        "Được bảo vệ chuyên nghiệp",
        "Hàng hóa khách tự mang đến",
      ],
    },
    {
      id: "self-4",
      name: "8-10 box",
      dimension: "4m³",
      description: "Nội thất, thiết bị văn phòng, hàng kinh doanh",
      price: 1445000,
      features: [
        "Truy cập vào kho 24/7",
        "Tủ đựng đồ riêng biệt",
        "Được bảo vệ chuyên nghiệp",
        "Hàng hóa khách tự mang đến",
      ],
    },
    {
      id: "self-5",
      name: "Xe và 2 box",
      dimension: "5m³",
      description: "Xe máy, xe đạp kèm đồ dùng cá nhân",
      price: 2495000,
      features: [
        "Truy cập vào kho 24/7",
        "Tủ đựng đồ riêng biệt",
        "Được bảo vệ chuyên nghiệp",
        "Hàng hóa khách tự mang đến",
      ],
    },
    {
      id: "self-6",
      name: "Nội thất nhỏ",
      dimension: "6m³",
      description: "Nội thất phòng khách, bàn ghế, tủ kệ",
      price: 2695000,
      features: [
        "Truy cập vào kho 24/7",
        "Tủ đựng đồ riêng biệt",
        "Được bảo vệ chuyên nghiệp",
        "Hàng hóa khách tự mang đến",
      ],
    },
    {
      id: "self-7",
      name: "Đồ studio",
      dimension: "9m³",
      description: "Toàn bộ nội thất studio, phòng làm việc",
      price: 3195000,
      features: [
        "Truy cập vào kho 24/7",
        "Tủ đựng đồ riêng biệt",
        "Được bảo vệ chuyên nghiệp",
        "Hàng hóa khách tự mang đến",
      ],
    },
  ];

  const handleContinue = () => {
    if (selectedSize) {
      const storages = serviceType === "package" ? packageStorages : selfStorages;
      const selectedStorage = storages.find((s) => s.id === selectedSize);
      if (selectedStorage) {
        localStorage.setItem(
          "booking",
          JSON.stringify({
            serviceType,
            storage: selectedStorage,
          })
        );
        navigate("/services");
      }
    }
  };

  const currentStorages = serviceType === "package" ? packageStorages : selfStorages;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl mb-4 text-foreground">
            Chọn loại dịch vụ phù hợp
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ILocker cung cấp hai hình thức lưu trữ linh hoạt cho mọi nhu cầu của bạn
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <Tabs value={serviceType} onValueChange={(v) => {
            setServiceType(v as "package" | "self");
            setSelectedSize(null);
          }}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="package">Thuê kho lưu trữ trọn gói</TabsTrigger>
              <TabsTrigger value="self">Thuê kho tự quản</TabsTrigger>
            </TabsList>

            <TabsContent value="package" className="mt-8">
              <Card className="p-6 mb-8 bg-blue-50 border-primary/20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-start gap-3">
                    <Truck className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="mb-1 text-foreground">Đóng gói & vận chuyển</h3>
                      <p className="text-sm text-muted-foreground">
                        Dịch vụ chuyên nghiệp đến tận nơi
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Lock className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="mb-1 text-foreground">Lưu trữ an toàn</h3>
                      <p className="text-sm text-muted-foreground">
                        Trong hệ thống kho hiện đại
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="mb-1 text-foreground">Giao trả linh hoạt</h3>
                      <p className="text-sm text-muted-foreground">
                        Theo nhu cầu của bạn
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="self" className="mt-8">
              <Card className="p-6 mb-8 bg-green-50 border-green-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-start gap-3">
                    <Clock className="h-6 w-6 text-green-600 shrink-0 mt-1" />
                    <div>
                      <h3 className="mb-1 text-foreground">Truy cập 24/7</h3>
                      <p className="text-sm text-muted-foreground">
                        Vào kho bất cứ lúc nào
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Lock className="h-6 w-6 text-green-600 shrink-0 mt-1" />
                    <div>
                      <h3 className="mb-1 text-foreground">Tủ riêng biệt</h3>
                      <p className="text-sm text-muted-foreground">
                        Được bảo vệ chuyên nghiệp
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Truck className="h-6 w-6 text-green-600 shrink-0 mt-1" />
                    <div>
                      <h3 className="mb-1 text-foreground">Chủ động hoàn toàn</h3>
                      <p className="text-sm text-muted-foreground">
                        Tự mang đồ đến và lấy ra
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {currentStorages.map((storage) => (
            <Card
              key={storage.id}
              className={`relative p-6 cursor-pointer transition-all hover:shadow-lg ${
                selectedSize === storage.id
                  ? "border-2 border-primary shadow-lg"
                  : "border hover:border-primary/50"
              }`}
              onClick={() => setSelectedSize(storage.id)}
            >
              {storage.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                  Phổ biến nhất
                </Badge>
              )}

              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-3">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-1 text-xl text-foreground">{storage.name}</h3>
                <div className="text-2xl text-primary mb-1">{storage.dimension}</div>
              </div>

              <p className="text-sm text-muted-foreground text-center mb-4 min-h-[40px]">
                {storage.description}
              </p>

              <div className="space-y-2 mb-4">
                {storage.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 text-center">
                <div className="text-xs text-muted-foreground mb-1">Từ</div>
                <div className="text-2xl text-foreground mb-1">
                  {storage.price.toLocaleString("vi-VN")}đ
                </div>
                <div className="text-sm text-muted-foreground">
                  cho ≤ 1 tháng
                </div>
              </div>

              {selectedSize === storage.id && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="max-w-4xl mx-auto mb-8">
          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <p className="text-sm text-foreground">
              <strong>Lưu ý:</strong> Giá trên là giá cơ bản cho thời gian lưu trữ ≤ 1 tháng.
              Giá sẽ được tính toán chi tiết ở bước tiếp theo dựa trên thời gian thuê, gói bảo vệ và các dịch vụ bổ sung bạn chọn.
            </p>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedSize}
            className="text-base h-12 px-8"
          >
            Tiếp tục chọn thời gian & dịch vụ
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
