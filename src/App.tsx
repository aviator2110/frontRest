import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AdminPage } from "./pages/AdminPage";
import { BarPage } from "./pages/BarPage";
import { HallPage } from "./pages/HallPage";
import { KitchenPage } from "./pages/KitchenPage";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
      <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<AppFrame />}>

              <Route element={<ProtectedRoute allowedRoles={["Waiter"]} />}>
                  <Route path="/hall" element={<HallPage />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={["Cook"]} />}>
                  <Route path="/kitchen" element={<KitchenPage />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={["Bartender"]} />}>
                  <Route path="/bar" element={<BarPage />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
                  <Route path="/admin" element={<AdminPage />}>
                      <Route path="tables" element={<div>Tables content</div>} />
                      <Route path="waiters" element={<div>Waiters content</div>} />
                      <Route path="menu" element={<div>Menu content</div>} />
                  </Route>
              </Route>

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
