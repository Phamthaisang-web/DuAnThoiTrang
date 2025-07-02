import "@ant-design/v5-patch-for-react-19";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router";
import DefaultLayout from "./layouts/DefaultLayout";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import NoPage from "./pages/NoPage";
import EmptyLayout from "./layouts/EmptyLayout";
import UserPage from "./pages/UserPage";

import BrandPage from "./pages/BrandPage";

import CategoryPage from "./pages/CategoryPage";

import OrdersPage from "./pages/OrdersPage";

import PaymentsPage from "./pages/PaymentsPage";

import ProductsPage from "./pages/ProductsPage";
import OrderDetail from "./pages/OrderDetail";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Login thi su dung Emptylayout */}
          <Route path="/login" element={<EmptyLayout />}>
            <Route index element={<LoginPage />} />
          </Route>

          {/* Mac dinh cac trang khac su dung DefaultLayout */}
          <Route path="/" element={<DefaultLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="users" element={<UserPage />} />

            <Route path="brands" element={<BrandPage />} />

            <Route path="categories" element={<CategoryPage />} />

            <Route path="orders">
              <Route index element={<OrdersPage />} /> {/* /orders */}
              <Route path=":id" element={<OrderDetail />} /> {/* /orders/:id */}
            </Route>

            <Route path="payments" element={<PaymentsPage />} />

            <Route path="products" element={<ProductsPage />} />
          </Route>
          {/* Login thi su dung Emptylayout */}
          <Route path="/login" element={<EmptyLayout />}>
            <Route index element={<LoginPage />} />
          </Route>
          {/* 404 Not Found */}
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
