import type { ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
          <p className="eyebrow">Панель ресторана</p>
          <h1>Управление сменой</h1>
          <p className="topbar-note">Активный раздел: {resolveSectionName(location.pathname)}</p>
        </div>

        <div className="topbar-actions">
          <nav className="role-switcher" aria-label="Навигация по ролям">
            {navItems.map((item) => (
              <NavLink
                key={item.role}
                to={item.to}
                className={({ isActive }) => (isActive ? "role-chip active" : "role-chip")}
              >
                {roleLabels[item.role]}
              </NavLink>
            ))}
          </nav>

          <button className="ghost-button" type="button" onClick={() => navigate("/login")}>
            Выйти
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
