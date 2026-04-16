import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageIntro } from "../../components/PageIntro";

type Order = {
    id: string;
    tableNumber: number;
    waiterId: string;
    waiterName: string;
};

type Table = {
    id: string;
    number: number;
    isActive: boolean;
};

export function HallTable() {
    const { id } = useParams(); // tableId (GUID)
    const navigate = useNavigate();

    const [order, setOrder] = useState<Order | null>(null);
    const [table, setTable] = useState<Table | null>(null);
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");

            try {
                const tableRes = await fetch(`http://localhost:5113/api/Tables/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const tableData = await tableRes.json();
                const currentTable: Table = tableData.data;

                setTable(currentTable);

                const ordersRes = await fetch("http://localhost:5113/api/orders/active", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const ordersData = await ordersRes.json();

                const found = ordersData.data.find(
                    (o: Order) => o.tableNumber === currentTable.number
                );

                setOrder(found || null);

            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleCheckPin = async () => {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(
                `http://localhost:5113/api/waiters/by-pin/${pin}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (!res.ok) {
                alert("Invalid PIN");
                return;
            }

            const data = await res.json();
            const waiter = data.data;

            if (order) {
                if (waiter.id !== order.waiterId) {
                    alert("Этот стол обслуживает другой официант");
                    return;
                }

                navigate(`/hall/order/${order.id}`);
                return;
            }

            if (!table) {
                alert("Table not loaded");
                return;
            }

            const createRes = await fetch("http://localhost:5113/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    createRequest: {
                        tableId: table.id,
                        waiterId: waiter.id,
                    },
                    pinCode: pin,
                }),
            });

            if (!createRes.ok) {
                throw new Error("Failed to create order");
            }

            const newOrder = await createRes.json();

            navigate(`/hall/order/${newOrder.data.id}`);

        } catch (e) {
            console.error(e);
            alert("Error");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <section className="role-page">
            <PageIntro title="Table details" />

            <section className="sketch-panel hall-panel">
                <div className="sketch-block">

                    <button
                        className="ghost-button"
                        onClick={() => navigate("/hall")}
                    >
                        ← Back
                    </button>

                    {order ? (
                        <>
                            <h3>Table is busy</h3>
                            <p>Waiter: {order.waiterName}</p>

                            <div className="form-group">
                                <label>Enter PIN</label>
                                <input
                                    type="password"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    maxLength={4}
                                />
                            </div>

                            <button
                                className="primary-button"
                                onClick={handleCheckPin}
                            >
                                Enter
                            </button>
                        </>
                    ) : (
                        <>
                            <h3>Table is free</h3>

                            <div className="form-group">
                                <label>Enter PIN</label>
                                <input
                                    type="password"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    maxLength={4}
                                />
                            </div>

                            <button
                                className="primary-button"
                                onClick={handleCheckPin}
                            >
                                Start Order
                            </button>
                        </>
                    )}

                </div>
            </section>
        </section>
    );
}