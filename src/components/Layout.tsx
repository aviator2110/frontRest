import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Restaurant Panel</p>
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
