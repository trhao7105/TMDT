import { Link, useLocation } from "react-router";
import { Button } from "./ui/button";
import { Lock, Menu, User } from "lucide-react";
import { useState } from "react";
import { NotificationsDropdown } from "./NotificationsDropdown";

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-primary">ILocker</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm transition-colors hover:text-primary ${
              location.pathname === "/" ? "text-primary" : "text-foreground"
            }`}
          >
            Trang chủ
          </Link>
          <Link
            to="/storage"
            className={`text-sm transition-colors hover:text-primary ${
              location.pathname === "/storage" ? "text-primary" : "text-foreground"
            }`}
          >
            Chọn kho
          </Link>
          <Link
            to="/services"
            className={`text-sm transition-colors hover:text-primary ${
              location.pathname === "/services" ? "text-primary" : "text-foreground"
            }`}
          >
            Dịch vụ
          </Link>
          <Link
            to="/support"
            className={`text-sm transition-colors hover:text-primary ${
              location.pathname === "/support" ? "text-primary" : "text-foreground"
            }`}
          >
            Hỗ trợ
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <NotificationsDropdown />
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  localStorage.removeItem("isLoggedIn");
                  window.location.href = "/";
                }}
              >
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="hidden md:flex">
                <Link to="/login">Đăng nhập</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Đăng ký</Link>
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="container mx-auto flex flex-col gap-4 p-4">
            <Link
              to="/"
              className="text-sm text-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              to="/storage"
              className="text-sm text-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Chọn kho
            </Link>
            <Link
              to="/services"
              className="text-sm text-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dịch vụ
            </Link>
            <Link
              to="/support"
              className="text-sm text-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Hỗ trợ
            </Link>
            {!isLoggedIn && (
              <Link
                to="/login"
                className="text-sm text-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Đăng nhập
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
