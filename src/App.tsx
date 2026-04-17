import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AdminPage } from "./pages/admin/AdminPage";
import { BarPage } from "./pages/BarPage";
import { HallPage } from "./pages/hall/HallPage";
import { KitchenPage } from "./pages/KitchenPage";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminTablesPage } from "./pages/admin/AdminTablesPage";
import { AdminWaitersPage } from "./pages/admin/AdminWaitersPage";
import { AdminTableCreate } from "./pages/admin/AdminTableCreate";
import { AdminTableEdit } from "./pages/admin/AdminTableEdit";
import { AdminWaitersEdit } from "./pages/admin/AdminWaitersEdit";
import { AdminWaitersCreate } from "./pages/admin/AdminWaitersCreate";
import { AdminMenuPage } from "./pages/admin/AdminMenuPage";
import { AdminMenuCreate } from "./pages/admin/AdminMenuCreate";
import { AdminMenuEdit } from "./pages/admin/AdminMenuEdit";
import {HallTable} from "./pages/hall/HallTable";
import {HallOrder} from "./pages/hall/HallOrder";
import {HallAddItem} from "./pages/hall/HallAddItem";

function App() {
  return (
      <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<AppFrame />}>

              <Route element={<ProtectedRoute allowedRoles={["Waiter"]} />}>
                  <Route path="/hall" element={<HallPage />} />
                  <Route path="/hall/table/:id" element={<HallTable />} />
                  <Route path="/hall/order/:id" element={<HallOrder />} />
                  <Route path="/hall/order/:id/add-item" element={<HallAddItem />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={["Cook"]} />}>
                  <Route path="/kitchen" element={<KitchenPage />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={["Bartender"]} />}>
                  <Route path="/bar" element={<BarPage />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
                  <Route path="/admin" element={<AdminPage />}>

                      <Route path="tables" element={<AdminTablesPage />} />
                      <Route path="tables/create" element={<AdminTableCreate />} />
                      <Route path="tables/edit/:id" element={<AdminTableEdit />} />

                      <Route path="waiters" element={<AdminWaitersPage />} />
                      <Route path="waiters/create" element={<AdminWaitersCreate />} />
                      <Route path="waiters/edit/:id" element={<AdminWaitersEdit />} />

                      <Route path="menu" element={<AdminMenuPage />} />
                      <Route path="menu/create" element={<AdminMenuCreate />} />
                      <Route path="menu/edit/:id" element={<AdminMenuEdit />} />

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
