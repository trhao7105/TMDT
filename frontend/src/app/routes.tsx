import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { StorageSelectionPage } from "./pages/StorageSelectionPage";
import { ServicesPage } from "./pages/ServicesPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/storage",
    Component: StorageSelectionPage,
  },
  {
    path: "/services",
    Component: ServicesPage,
  },
  {
    path: "/checkout",
    Component: CheckoutPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    path: "/dashboard",
    Component: DashboardPage,
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);
