import { PageIntro } from "../../components/PageIntro";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

type OrderItem = {
    id: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    status: string;
};

type Order = {
    id: string;
    tableNumber: number;
    waiterName: string;
    status: string;
    startedAt: string;
    totalAmount: number;
    items: OrderItem[];
};

export function HallOrder() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchOrder = async () => {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`http://localhost:5113/api/Orders/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            setOrder(data.data);

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const getOrderStatus = (order: Order) => {
        if (order.items.length === 0) return "Created";

        const statuses = order.items.map(i => i.status);

        if (statuses.every(s => s === "Cancelled")) return "Cancelled";
        if (statuses.every(s => s === "Served")) return "Served";
        if (statuses.some(s => s === "Preparing")) return "InProgress";
        if (statuses.some(s => s === "Ready")) return "Ready";

        return "Created";
    };

    const updateOrderStatus = async (status: string) => {
        const token = localStorage.getItem("token");

        try {
            await fetch(`http://localhost:5113/api/Orders/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: id,
                    updateStatusRequest: {
                        status: status,
                    },
                }),
            });
        } catch (e) {
            console.error(e);
        }
    };

    const handleServe = async (itemId: string) => {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(
                `http://localhost:5113/api/OrderItems/${itemId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        id: itemId,
                        status: "Served",
                    }),
                }
            );

            if (!res.ok) {
                alert("Ошибка");
                return;
            }

            await fetchOrder();

            const updatedOrderRes = await fetch(`http://localhost:5113/api/Orders/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const updatedData = await updatedOrderRes.json();

            const newStatus = getOrderStatus(updatedData.data);
            await updateOrderStatus(newStatus);

            fetchOrder();

        } catch (e) {
            console.error(e);
        }
    };

    const handleCancelOrder = async () => {
        await updateOrderStatus("Cancelled");
        fetchOrder();
    };

    const handleCompleteOrder = async () => {
        await updateOrderStatus("Completed");
        fetchOrder();
    };

    if (loading) return <div>Loading...</div>;
    if (!order) return <div>Order not found</div>;

    const computedStatus = getOrderStatus(order);

    return (
        <section className="role-page">
            <PageIntro title="Order details" />

            <section className="sketch-panel hall-panel">
                <div className="sketch-block">

                    <button
                        className="ghost-button"
                        onClick={() => navigate("/hall")}
                    >
                        ← Back
                    </button>

                    <div style={{ marginTop: "20px" }}>
                        <p><b>Table:</b> {order.tableNumber}</p>
                        <p><b>Waiter:</b> {order.waiterName}</p>
                        <p><b>Status:</b> {computedStatus}</p>
                        <p><b>Started:</b> {new Date(order.startedAt).toLocaleString()}</p>
                    </div>

                    <div style={{ marginTop: "20px" }}>
                        <h3>Items</h3>

                        {order.items.length === 0 && <p>No items yet</p>}

                        {order.items.map(item => (
                            <div key={item.id} style={{ marginBottom: "10px" }}>
                                <p><b>{item.productName}</b></p>
                                <p>Qty: {item.quantity}</p>
                                <p>Price: {item.unitPrice}</p>
                                <p>Total: {item.totalPrice}</p>
                                <p>Status: {item.status}</p>

                                {item.status === "Ready" && (
                                    <button
                                        className="primary-button"
                                        onClick={() => handleServe(item.id)}
                                    >
                                        Mark as Served
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: "20px" }}>
                        <h3>Total: {order.totalAmount}</h3>
                    </div>

                    <div style={{ marginTop: "20px" }}>
                        <button
                            className="primary-button"
                            onClick={() => navigate(`/hall/order/${order.id}/add-item`)}
                        >
                            Add item
                        </button>

                        <button
                            className="ghost-button"
                            onClick={handleCancelOrder}
                            style={{ marginLeft: "10px" }}
                        >
                            Cancel order
                        </button>

                        {computedStatus === "Served" && (
                            <button
                                className="primary-button"
                                onClick={handleCompleteOrder}
                                style={{ marginLeft: "10px" }}
                            >
                                Complete order
                            </button>
                        )}
                    </div>

                </div>
            </section>
        </section>
    );
}