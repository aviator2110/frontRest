import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AdminPage } from "./pages/AdminPage";
import { BarPage } from "./pages/BarPage";
import { HallPage } from "./pages/HallPage";
import { KitchenPage } from "./pages/KitchenPage";
import { LoginPage } from "./pages/LoginPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<AppFrame />}>
        <Route path="/hall" element={<HallPage />} />
        <Route path="/kitchen" element={<KitchenPage />} />
        <Route path="/bar" element={<BarPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function AppFrame() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default App;
