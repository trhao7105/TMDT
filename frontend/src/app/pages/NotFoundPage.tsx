import { Link } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Home } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="container mx-auto px-4 py-20 flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-9xl mb-4 text-primary">404</h1>
          <h2 className="text-3xl mb-4 text-foreground">Không tìm thấy trang</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
          </p>
          <Button size="lg" asChild>
            <Link to="/">
              <Home className="mr-2 h-5 w-5" />
              Về trang chủ
            </Link>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
