import { Link } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  Shield,
  Clock,
  MapPin,
  CreditCard,
  Package,
  Thermometer,
  ArrowRight,
  Check,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function HomePage() {
  const features = [
    {
      icon: Shield,
      title: "Bảo mật 24/7",
      description: "Hệ thống camera và bảo vệ túc trực suốt ngày đêm",
    },
    {
      icon: Clock,
      title: "Truy cập linh hoạt",
      description: "Mở cửa 24/7, bạn có thể đến lấy đồ bất cứ lúc nào",
    },
    {
      icon: Thermometer,
      title: "Kiểm soát nhiệt độ",
      description: "Môi trường được điều hòa, phù hợp cho mọi loại hàng hóa",
    },
    {
      icon: CreditCard,
      title: "Thanh toán dễ dàng",
      description: "Nhiều hình thức thanh toán, linh hoạt và an toàn",
    },
    {
      icon: Package,
      title: "Đa dạng kích thước",
      description: "Từ tủ nhỏ đến phòng lớn, đáp ứng mọi nhu cầu",
    },
    {
      icon: MapPin,
      title: "Vị trí thuận lợi",
      description: "Nhiều chi nhánh trên toàn thành phố",
    },
  ];

  const sizes = [
    {
      name: "XXS - Mini",
      dimension: "2m³",
      description: "Phù hợp cho đồ cá nhân, hồ sơ",
      price: "495.000đ",
      period: "/tháng",
    },
    {
      name: "XS - Nhỏ",
      dimension: "3m³",
      description: "Tủ quần áo, hộp đựng đồ",
      price: "695.000đ",
      period: "/tháng",
    },
    {
      name: "S - Vừa",
      dimension: "5m³",
      description: "Đồ đạc phòng ngủ, xe đạp",
      price: "1.195.000đ",
      period: "/tháng",
    },
    {
      name: "M - Lớn",
      dimension: "8m³",
      description: "Nội thất 1-2 người",
      price: "1.845.000đ",
      period: "/tháng",
    },
  ];

  const testimonials = [
    {
      name: "Nguyễn Minh Anh",
      role: "Doanh nhân",
      content:
        "ILocker giúp tôi lưu trữ hàng hóa kinh doanh rất tiện lợi. An toàn và giá cả hợp lý!",
      rating: 5,
    },
    {
      name: "Trần Văn Long",
      role: "Du học sinh",
      content:
        "Khi đi du học, tôi cần một nơi an toàn để gửi đồ. ILocker là lựa chọn tuyệt vời!",
      rating: 5,
    },
    {
      name: "Lê Thị Hương",
      role: "Chủ shop online",
      content:
        "Đa dạng kích thước, bảo mật tốt, hỗ trợ nhiệt tình. Rất hài lòng với dịch vụ!",
      rating: 5,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 text-foreground">
                Giải pháp lưu trữ
                <span className="text-primary block mt-2">thông minh & an toàn</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Không gian linh hoạt, bảo mật 24/7, truy cập mọi lúc.
                ILocker - nơi an toàn cho mọi tài sản của bạn.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="text-base h-12 px-8">
                  <Link to="/storage">
                    Đặt kho ngay
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-base h-12 px-8">
                  <Link to="/services">Xem dịch vụ</Link>
                </Button>
              </div>
              <div className="flex items-center gap-8 mt-8">
                <div>
                  <div className="text-3xl text-primary mb-1">15+</div>
                  <div className="text-sm text-muted-foreground">Chi nhánh</div>
                </div>
                <div>
                  <div className="text-3xl text-primary mb-1">5000+</div>
                  <div className="text-sm text-muted-foreground">Khách hàng</div>
                </div>
                <div>
                  <div className="text-3xl text-primary mb-1">99.9%</div>
                  <div className="text-sm text-muted-foreground">Hài lòng</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1771530789155-b1f03fbf82b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzdG9yYWdlJTIwd2FyZWhvdXNlJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc2Njc2NTk4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Modern Storage"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-foreground">
              Tại sao chọn ILocker?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Chúng tôi cam kết mang đến dịch vụ lưu trữ tốt nhất với những tính năng vượt trội
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Storage Sizes Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-foreground">
              Kích thước phù hợp cho mọi nhu cầu
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Từ tủ nhỏ đến phòng lớn, chúng tôi có giải pháp hoàn hảo cho bạn
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sizes.map((size, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all hover:scale-105">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Package className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-2 text-foreground">{size.name}</h3>
                  <div className="text-2xl text-primary mb-2">{size.dimension}</div>
                  <p className="text-sm text-muted-foreground mb-4 min-h-[40px]">
                    {size.description}
                  </p>
                  <div className="text-xl text-foreground mb-1">
                    {size.price}
                    <span className="text-sm text-muted-foreground">{size.period}</span>
                  </div>
                  <Button className="w-full mt-4" variant="outline" asChild>
                    <Link to="/storage">Chọn kích thước</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-foreground">
              Quy trình đặt kho đơn giản
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Chỉ với 4 bước đơn giản, bạn đã có thể sở hữu không gian lưu trữ của riêng mình
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Chọn kích thước",
                description: "Lựa chọn kích thước phù hợp với nhu cầu của bạn",
              },
              {
                step: "02",
                title: "Chọn dịch vụ",
                description: "Thêm các dịch vụ bổ sung nếu cần thiết",
              },
              {
                step: "03",
                title: "Thanh toán",
                description: "Thanh toán online nhanh chóng và bảo mật",
              },
              {
                step: "04",
                title: "Sử dụng ngay",
                description: "Nhận mã truy cập và bắt đầu sử dụng",
              },
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-primary/20">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/20" />
                  </div>
                )}
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white text-xl mb-4 z-10">
                  {item.step}
                </div>
                <h3 className="mb-2 text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-foreground">
              Khách hàng nói gì về chúng tôi
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hàng nghìn khách hàng đã tin tưởng và hài lòng với dịch vụ của ILocker
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <div key={i} className="text-yellow-400">★</div>
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl mb-4">
            Sẵn sàng bắt đầu?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Đặt kho ngay hôm nay và nhận ưu đãi đặc biệt cho khách hàng mới
          </p>
          <Button size="lg" variant="secondary" asChild className="text-base h-12 px-8">
            <Link to="/storage">
              Đặt kho ngay
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}