import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiLink } from "../../data";

type MenuItem = {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    isAvailable: boolean;
    createdAt: string;
};

const categories = [
    "Appetizer",
    "MainCourse",
    "Dessert",
    "Drink",
    "Alcohol",
];

export function AdminMenuPage() {
    const navigate = useNavigate();
    const [items, setItems] = useState<MenuItem[]>([]);

    useEffect(() => {
        const fetchMenu = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`${apiLink}/Products`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("role");
                    navigate("/login");
                    return;
                }

                if (!response.ok) {
                    throw new Error("Failed to fetch menu");
                }

                const data = await response.json();
                setItems(data.data);

            } catch (error) {
                console.error(error);
            }
        };

        fetchMenu();
    }, []);

    const grouped = categories.reduce((acc, category) => {
        acc[category] = items.filter((item) => item.category === category);
        return acc;
    }, {} as Record<string, MenuItem[]>);

    return (
        <div>
            <h2>Menu</h2>

            <button
                className="ghost-button"
                onClick={() => navigate("create")}
            >
                Create Menu Item
            </button>

            {categories.map((category) => (
                <section key={category}>
                    <h3>{category}</h3>

                    <div className="table-grid expanded">
                        {grouped[category]?.map((item) => (
                            <article
                                key={item.id}
                                className={`table-card sketch-card ${
                                    item.isAvailable ? "menu-available" : "menu-unavailable"
                                }`}
                            >
                                <h1>{item.name}</h1>

                                <p>{item.description}</p>

                                <p><strong>{item.price} ₼</strong></p>

                                <p>
                                    {item.isAvailable ? "Available" : "Unavailable"}
                                </p>

                                <button
                                    className="ghost-button"
                                    onClick={() => navigate(`edit/${item.id}`)}
                                >
                                    Edit
                                </button>
                            </article>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}