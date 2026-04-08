import { PageIntro } from "../components/PageIntro";
import { kitchenOrders } from "../data";

export function KitchenPage() {
  return (
    <section className="role-page">
      <PageIntro title="КУХНЯ" subtitle="Лента заказов и приоритеты" />

      <section className="sketch-panel">
        <div className="stack-list">
          {kitchenOrders.map((order) => (
            <article key={order.id} className="line-card sketch-line">
              <div className="line-card-row">
                <strong>{order.id}</strong>
                <span className={order.priority === "high" ? "priority high" : "priority"}>
                  {order.priority === "high" ? "Срочно" : order.eta}
                </span>
              </div>
              <p>{order.details}</p>
              <small>
                {order.table} • Готовность через {order.eta}
              </small>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
