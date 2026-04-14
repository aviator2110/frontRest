import { Outlet, useNavigate } from "react-router-dom";
import { PageIntro } from "../../components/PageIntro";
import { adminMenu } from "../../data";

export function AdminPage() {
    const navigate = useNavigate();

    return (
        <section className="role-page">
            <PageIntro title="Admin Page" />

            <section className="sketch-panel admin-shell">
                <aside className="admin-sidebar sketch-sidebar">
                    {adminMenu.map((item) => (
                        <button
                            key={item}
                            type="button"
                            className="admin-link"
                            onClick={() => navigate(`/admin/${item.toLowerCase()}`)}
                        >
                            {item}
                        </button>
                    ))}
                </aside>

                <div className="admin-content">
                    <Outlet />
                </div>
            </section>
        </section>
    );
}