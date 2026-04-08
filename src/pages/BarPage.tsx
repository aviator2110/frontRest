import { PageIntro } from "../components/PageIntro";
import { barOrders } from "../data";

export function BarPage() {
  return (
    <section className="role-page">
      <PageIntro title="БАР" subtitle="Очередь напитков и точка выдачи" />

      <section className="sketch-panel">
        <div className="stack-list">
          {barOrders.map((drink) => (
            <article key={drink.id} className="line-card sketch-line">
              <div className="line-card-row">
                <strong>{drink.id}</strong>
                <span className="priority">{drink.station}</span>
              </div>
              <p>{drink.note}</p>
              <small>{drink.pickup}</small>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
