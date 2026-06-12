import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "../components/Layout";
import CatalogPage from "../pages/CatalogPage";
import FoodFormPage from "../pages/FoodFormPage";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import RegisterPage from "../pages/RegisterPage";
import UsersPage from "../pages/UsersPage";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route
            path="/catalogo"
            element={
              <ProtectedRoute>
                <CatalogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/catalogo/nuevo"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <FoodFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/catalogo/editar/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <FoodFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
