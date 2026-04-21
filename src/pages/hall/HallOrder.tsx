import { PageIntro } from "../../components/PageIntro";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Modal } from "../../components/Modal";

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
};

export function HallOrder() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [order, setOrder] = useState<Order | null>(null);
    const [items, setItems] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const showModal = (message: string) => {
        setModalMessage(message);
        setModalOpen(true);
    };

    const token = localStorage.getItem("token");

    const fetchData = async () => {
        try {
            const orderRes = await fetch(`http://localhost:5113/api/Orders/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const orderData = await orderRes.json();
            setOrder(orderData.data);

            const itemsRes = await fetch(`http://localhost:5113/api/OrderItems/order/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const itemsData = await itemsRes.json();
            setItems(itemsData.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const computeStatusFromItems = (list: OrderItem[]) => {
        if (list.length === 0) return "Created";
        const statuses = list.map(i => i.status);
        if (statuses.every(s => s === "Served" || s === "Cancelled")) return "Served";
        return "InProgress";
    };

    const getOrderStatus = () => computeStatusFromItems(items);

    const updateOrderStatus = async (status: string) => {
        try {
            await fetch(`http://localhost:5113/api/Orders/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: id,
                    updateStatusRequest: { status },
                }),
            });
        } catch (e) {
            console.error(e);
        }
    };

    const recalcAndUpdateStatus = async () => {
        try {
            const res = await fetch(`http://localhost:5113/api/OrderItems/order/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            const freshItems: OrderItem[] = data.data || [];
            const newStatus = computeStatusFromItems(freshItems);
            await updateOrderStatus(newStatus);
        } catch (e) {
            console.error(e);
        }
    };

    const handleServe = async (itemId: string) => {
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
                showModal("Error");
                return;
            }

            await fetchData();
            await recalcAndUpdateStatus();
            await fetchData();
        } catch (e) {
            console.error(e);
        }
    };

    const handleCancelItem = async (itemId: string) => {
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
                        status: "Cancelled",
                    }),
                }
            );

            if (!res.ok) {
                showModal("Error while canceling order");
                return;
            }

            await fetchData();
            await recalcAndUpdateStatus();
            await fetchData();
        } catch (e) {
            console.error(e);
        }
    };

    const handleCancelOrder = async () => {
        try {
            const res = await fetch(`http://localhost:5113/api/OrderItems/order/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            const orderItems: OrderItem[] = data.data || [];

            for (const item of orderItems) {
                if (item.status !== "Served" && item.status !== "Cancelled") {
                    await fetch(`http://localhost:5113/api/OrderItems/${item.id}/status`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            id: item.id,
                            status: "Cancelled",
                        }),
                    });
                }
            }

            await updateOrderStatus("Cancelled");
            navigate("/hall");
        } catch (e) {
            console.error(e);
        }
    };

    const handleCompleteOrder = async () => {
        await updateOrderStatus("Completed");
        navigate("/hall");
    };

    if (loading) return <div>Loading...</div>;
    if (!order) return <div>Order not found</div>;

    const computedStatus = getOrderStatus();

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
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "2fr 1fr 1fr 1fr 2fr",
                            fontWeight: "bold"
                        }}>
                            <span>Name</span>
                            <span>Qty</span>
                            <span>Price</span>
                            <span>Total</span>
                            <span>Status</span>
                        </div>

                        {items.length === 0 && <p>No items yet</p>}

                        {items.map(item => (
                            <div
                                key={item.id}
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "2fr 1fr 1fr 1fr 2fr",
                                    gap: "10px",
                                    padding: "8px 0",
                                    borderBottom: "1px solid #ccc",
                                    alignItems: "center"
                                }}
                            >
                                <span>{item.productName}</span>
                                <span>x{item.quantity}</span>
                                <span>{item.unitPrice} ₼</span>
                                <span>{item.totalPrice} ₼</span>

                                <div style={{ display: "flex", gap: "5px" }}>
                                    <span>{item.status}</span>

                                    {item.status === "Ready" && (
                                        <button
                                            className="primary-button"
                                            onClick={() => handleServe(item.id)}
                                        >
                                            Serve
                                        </button>
                                    )}

                                    {item.status !== "Served" && item.status !== "Cancelled" && (
                                        <button
                                            className="ghost-button"
                                            onClick={() => handleCancelItem(item.id)}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: "20px" }}>
                        <h3>Total: {order.totalAmount} ₼</h3>
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
            <Modal
                isOpen={modalOpen}
                message={modalMessage}
                onClose={() => setModalOpen(false)}
            />
        </section>
    );
}