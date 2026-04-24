import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageIntro } from "../../components/PageIntro";
import { apiLink } from "../../data";

type Table = {
    id: string;
    number: number;
    isActive: boolean;
};

type Order = {
    id: string;
    tableNumber: number;
    waiterName: string;
};

export function HallPage() {
    const navigate = useNavigate();

    const [tables, setTables] = useState<Table[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");

            try {
                const [tablesRes, ordersRes] = await Promise.all([
                    fetch(`${apiLink}/tables/active`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${apiLink}/orders/active`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                if (tablesRes.status === 401 || ordersRes.status === 401) {
                    localStorage.clear();
                    window.location.href = "/login";
                    return;
                }

                const tablesData = await tablesRes.json();
                const ordersData = await ordersRes.json();

                setTables(tablesData.data);
                setOrders(ordersData.data);

            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const getOrderForTable = (tableNumber: number) => {
        return orders.find((order) => order.tableNumber === tableNumber);
    };

    return (
        <section className="role-page">
            <PageIntro title="Hall" />

            <section className="sketch-panel hall-panel">
                <div className="sketch-block">
                    <div className="table-grid expanded">

                        {tables.map((table) => {
                            const order = getOrderForTable(table.number);

                            return (
                                <article
                                    key={table.id}
                                    className={`table-card sketch-card clickable ${
                                        order ? "table-busy" : "table-free"
                                    }`}
                                    onClick={() => navigate(`/hall/table/${table.id}`)}
                                >
                                    <h3>Table {table.number}</h3>

                                    {order ? (
                                        <p>Waiter: {order.waiterName}</p>
                                    ) : (
                                        <p>Free</p>
                                    )}
                                </article>
                            );
                        })}

                    </div>
                </div>
            </section>
        </section>
    );
}