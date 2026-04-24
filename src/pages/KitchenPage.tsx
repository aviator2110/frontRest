import { PageIntro } from "../components/PageIntro";
import { useEffect, useRef, useState } from "react";
import { apiLink } from "../data";

type OrderItemStatus = "Pending" | "Preparing" | "Ready" | "Served" | "Cancelled";

type OrderItem = {
    id: string;
    orderId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    status: OrderItemStatus;
    menuCategory: string;
};

type OrderResponse = {
    success: boolean;
    message: string;
    data: {
        tableNumber: number;
    };
    errors: string[] | null;
};

type OrderItemsResponse = {
    success: boolean;
    message: string;
    data: OrderItem[];
    errors: string[] | null;
};

type OrderMap = Record<string, number>;

export function KitchenPage() {
    const [items, setItems] = useState<OrderItem[]>([]);
    const [orders, setOrders] = useState<OrderMap>({});
    const [loading, setLoading] = useState<boolean>(true);

    const prevIds = useRef<Set<string>>(new Set());

    const token: string | null = localStorage.getItem("token");

    const fetchData = async (): Promise<void> => {
        try {
            const res: Response = await fetch(`${apiLink}/OrderItems/pending`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data: OrderItemsResponse = await res.json();

            const filtered: OrderItem[] = data.data.filter(
                (i: OrderItem) =>
                    i.menuCategory === "Appetizer" ||
                    i.menuCategory === "MainCourse" ||
                    i.menuCategory === "Dessert"
            );

            const newIds: Set<string> = new Set(filtered.map((i: OrderItem) => i.id));

            const hasNew: boolean = filtered.some(
                (i: OrderItem) => !prevIds.current.has(i.id)
            );

            if (hasNew && prevIds.current.size > 0) {
                const audio: HTMLAudioElement = new Audio("/notification.mp3");
                audio.play().catch(() => {});
            }

            prevIds.current = newIds;

            setItems(filtered);

            const uniqueOrderIds: string[] = [
                ...new Set(filtered.map((i: OrderItem) => i.orderId)),
            ];

            const orderMap: OrderMap = {};

            await Promise.all(
                uniqueOrderIds.map(async (orderId: string): Promise<void> => {
                    const res: Response = await fetch(
                        `${apiLink}/Orders/${orderId}`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );

                    const data: OrderResponse = await res.json();
                    orderMap[orderId] = data.data.tableNumber;
                })
            );

            setOrders(orderMap);
        } catch (e: unknown) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect((): (() => void) => {
        fetchData();
        const interval: number = window.setInterval(fetchData, 4000);
        return () => window.clearInterval(interval);
    }, []);

    const updateStatus = async (
        itemId: string,
        status: OrderItemStatus
    ): Promise<void> => {
        try {
            await fetch(`${apiLink}/OrderItems/${itemId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: itemId,
                    status: status,
                }),
            });

            fetchData();
        } catch (e: unknown) {
            console.error(e);
        }
    };

    const getStatusColor = (status: OrderItemStatus): string => {
        switch (status) {
            case "Pending":
                return "#facc15";
            case "Preparing":
                return "#60a5fa";
            case "Ready":
                return "#4ade80";
            default:
                return "#e5e7eb";
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <section className="role-page">
            <PageIntro title="Kitchen" />

            <section className="sketch-panel hall-panel">
                <div className="sketch-block">

                    {items.length === 0 && <p>No orders in queue</p>}

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr 1fr 1fr 2fr",
                        fontWeight: "bold",
                        padding: "10px 0",
                        borderBottom: "2px solid #ccc"
                    }}>
                        <span>Dish</span>
                        <span>Qty</span>
                        <span>Total</span>
                        <span>Table</span>
                        <span>Status / Actions</span>
                    </div>

                    {items.map((item: OrderItem) => (
                        <div
                            key={item.id}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "2fr 1fr 1fr 1fr 2fr",
                                alignItems: "center",
                                padding: "12px 0",
                                borderBottom: "1px solid #eee"
                            }}
                        >
                            <span><b>{item.productName}</b></span>
                            <span>x{item.quantity}</span>
                            <span>{item.totalPrice} ₼</span>
                            <span>{orders[item.orderId]}</span>

                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <span style={{
                                    padding: "4px 10px",
                                    borderRadius: "999px",
                                    background: getStatusColor(item.status),
                                    fontSize: "12px"
                                }}>
                                    {item.status}
                                </span>

                                {item.status === "Pending" && (
                                    <button
                                        className="primary-button"
                                        onClick={() => updateStatus(item.id, "Preparing")}
                                    >
                                        Start
                                    </button>
                                )}

                                {item.status === "Preparing" && (
                                    <button
                                        className="primary-button"
                                        onClick={() => updateStatus(item.id, "Ready")}
                                    >
                                        Ready
                                    </button>
                                )}

                                <button
                                    className="ghost-button"
                                    onClick={() => updateStatus(item.id, "Cancelled")}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ))}

                </div>
            </section>
        </section>
    );
}