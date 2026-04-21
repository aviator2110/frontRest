import { PageIntro } from "../../components/PageIntro";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Modal } from "../../components/Modal";

type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
};

export function HallAddItem() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const showModal = (message: string) => {
        setModalMessage(message);
        setModalOpen(true);
    };

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("http://localhost:5113/api/Products/available", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await res.json();
                setProducts(data.data);

            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const grouped = products.reduce((acc: Record<string, Product[]>, product) => {
        if (!acc[product.category]) {
            acc[product.category] = [];
        }
        acc[product.category].push(product);
        return acc;
    }, {});

    const changeQuantity = (productId: string, delta: number) => {
        setQuantities(prev => {
            const current = prev[productId] || 0;
            const next = Math.max(0, current + delta);

            return {
                ...prev,
                [productId]: next,
            };
        });
    };

    const handleAddToOrder = async (product: Product) => {
        const quantity = quantities[product.id] || 0;

        if (quantity <= 0) return;

        try {
            const res = await fetch(`http://localhost:5113/api/OrderItems`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    request: {
                        productId: product.id,
                        orderId: id,
                        quantity: quantity,
                        unitPrice: product.price,
                    },
                }),
            });

            if (!res.ok) {
                showModal("Error while adding product");
                return;
            }

            setQuantities(prev => ({
                ...prev,
                [product.id]: 0,
            }));

        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <section className="role-page">
            <PageIntro title="Add order item" />

            <section className="sketch-panel hall-panel">
                <div className="sketch-block">

                    <button
                        className="ghost-button"
                        onClick={() => navigate(-1)}
                    >
                        ← Back
                    </button>

                    {Object.entries(grouped).map(([category, items]) => (
                        <div key={category} style={{ marginTop: "20px" }}>
                            <h3>{category}</h3>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                                    gap: "15px",
                                    marginTop: "10px"
                                }}
                            >
                                {items.map(product => {
                                    const qty = quantities[product.id] || 0;

                                    return (
                                        <div
                                            key={product.id}
                                            style={{
                                                border: "1px solid #ccc",
                                                borderRadius: "12px",
                                                padding: "10px",
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                                aspectRatio: "1 / 1"
                                            }}
                                        >
                                            <div>
                                                <p><b>{product.name}</b></p>
                                                <p style={{ fontSize: "12px" }}>
                                                    {product.description}
                                                </p>
                                                <p><b>{product.price} ₼</b></p>
                                            </div>

                                            <div>
                                                <div style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    gap: "10px",
                                                    marginBottom: "8px"
                                                }}>
                                                    <button onClick={() => changeQuantity(product.id, -1)}>-</button>
                                                    <span>{qty}</span>
                                                    <button onClick={() => changeQuantity(product.id, 1)}>+</button>
                                                </div>

                                                <button
                                                    className="primary-button"
                                                    disabled={qty === 0}
                                                    onClick={() => handleAddToOrder(product)}
                                                    style={{ width: "100%" }}
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

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