import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { roleLabels, routeByRole, type Role } from "../data";

export function LoginPage() {
  const [role, setRole] = useState<Role>("hall");
  const navigate = useNavigate();

  return (
    <main className="app-shell auth-shell">
      <section className="auth-card">
        <div className="auth-badge">Restaurant OS</div>
        <h1>Авторизация персонала</h1>
        <p className="auth-text">
          Вход в единую систему ресторана для зала, кухни, бара и администратора.
        </p>

        <form
          className="auth-form"
          onSubmit={(event) => {
            event.preventDefault();
            navigate(routeByRole[role]);
          }}
        >
          <label className="field">
            <span>Логин</span>
            <input type="text" placeholder="Введите логин" defaultValue="manager" />
          </label>

          <label className="field">
            <span>Пароль</span>
            <input type="password" placeholder="Введите пароль" defaultValue="123456" />
          </label>

          <button className="primary-button" type="submit">
            Войти в систему
          </button>
        </form>
      </section>
    </main>
  );
}
