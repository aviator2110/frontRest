import { PageIntro } from "../components/PageIntro";
import { tables } from "../data";

export function HallPage() {
  return (
    <section className="role-page">
      <PageIntro title="ЗАЛ"/>

      <section className="sketch-panel hall-panel">
        <div className="sketch-block">
          <div className="table-grid expanded">
            {tables.map((table) => (
              <article key={table.id} className="table-card sketch-card">
                <h3>Стол {table.id}</h3>
                <p>{table.status}</p>
                <span>
                  {table.guests} гостя • {table.waiter}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
