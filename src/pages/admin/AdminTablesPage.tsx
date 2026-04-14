import { useNavigate } from "react-router-dom";
import { Table } from "../../types/api";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

export function AdminTablesPage() {
    const navigate = useNavigate();
    const [tables, setTables] = useState<Table[]>([]);

    useEffect(() => {
        const fetchTables = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch("http://localhost:5113/api/tables", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("role");
                    navigate("/login");
                }

                if (!response.ok) {
                    throw new Error("Failed to fetch tables");
                }

                const data = await response.json();

                const tables: Table[] = data.data;
                setTables(tables);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTables();
    }, []);

    return (
        <div>
            <h2>Tables</h2>
            <button
                className="ghost-button"
                type="button"
                onClick={() => navigate(`create`)}
            >
                Create
            </button>
            <div className="table-grid expanded">
                {tables.map((table) => (
                    <article key={table.id} className="table-card sketch-card">
                        <h3>Table {table.number}</h3>
                        <p>{table.isActive ? "Active" : "Inactive"}</p>
                        <button
                            className="ghost-button"
                            type="button"
                            onClick={() => navigate(`edit/${table.id}`)}
                        >
                            Edit
                        </button>
                    </article>
                ))}
            </div>
            <Outlet />
        </div>
    );
}