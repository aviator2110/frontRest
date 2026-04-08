import { PageIntro } from "../components/PageIntro";
import { adminMenu } from "../data";

export function AdminPage() {
  return (
    <section className="role-page">
      <PageIntro title="АДМИН" subtitle="Системные разделы и быстрые показатели" />

      <section className="sketch-panel admin-shell">
        <aside className="admin-sidebar sketch-sidebar">
          {adminMenu.map((item) => (
            <button key={item} type="button" className="admin-link">
              {item}
            </button>
          ))}
        </aside>

        <div className="admin-content">
          <div className="stats-card">
            <span>Активных столов</span>
            <strong>12</strong>
          </div>
          <div className="stats-card">
            <span>Заказов в работе</span>
            <strong>18</strong>
          </div>
          <div className="stats-card">
            <span>Персонал в смене</span>
            <strong>9</strong>
          </div>
          <div className="stats-card wide">
            <span>Статус смены</span>
            <strong>В работе</strong>
          </div>
        </div>
      </section>
    </section>
  );
}
