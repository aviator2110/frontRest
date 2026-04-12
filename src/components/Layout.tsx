import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { roleLabels, type Role } from "../data";

type LayoutProps = {
  children: ReactNode;
};

const navItems: Array<{ to: string; role: Role }> = [
  { to: "/hall", role: "hall" },
  { to: "/kitchen", role: "kitchen" },
  { to: "/bar", role: "bar" },
  { to: "/admin", role: "admin" }
];

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Restaurant Panel</p>
          <p className="topbar-note">Активный раздел: {resolveSectionName(location.pathname)}</p>
        </div>

        <div className="topbar-actions">

          <button className="ghost-button" type="button" onClick={() => {
              localStorage.removeItem("token")
              localStorage.removeItem("role")
              navigate("/login")
          }}>
            Log out
          </button>
        </div>
      </header>

      {children}
    </main>
  );
}

function resolveSectionName(pathname: string) {
  const item = navItems.find((entry) => entry.to === pathname);
  return item ? roleLabels[item.role] : "Панель";
}
