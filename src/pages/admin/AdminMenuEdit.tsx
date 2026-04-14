import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const categories = [
    "Appetizer",
    "MainCourse",
    "Dessert",
    "Drink",
    "Alcohol",
];

export function AdminMenuEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState(categories[0]);
    const [isAvailable, setIsAvailable] = useState(true);

    const [loading, setLoading] = useState(true);

    // 🔹 загрузка данных
    useEffect(() => {
        const fetchItem = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(
                    `http://localhost:5113/api/products/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("role");
                    navigate("/login");
                    return;
                }

                if (!response.ok) {
                    throw new Error("Failed to fetch product");
                }

                const data = await response.json();

                const item = data.data;

                setName(item.name);
                setDescription(item.description);
                setPrice(String(item.price));
                setCategory(item.category);
                setIsAvailable(item.isAvailable);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchItem();
    }, [id]);

    // 🔹 отправка
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                `http://localhost:5113/api/products/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        id: id,
                        updateRequest: {
                            name,
                            description,
                            price: Number(price),
                            category,
                            isAvailable,
                        },
                    }),
                }
            );

            if (response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                navigate("/login");
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to update product");
            }

            navigate("/admin/menu");

        } catch (error) {
            console.error(error);
            alert("Error updating product");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="form-container">
            <h2>Edit Menu Item</h2>

            <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>

                {/* 🔥 SELECT категории */}
                <div className="form-group">
                    <label>Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-checkbox">
                    <label>
                        <input
                            type="checkbox"
                            checked={isAvailable}
                            onChange={(e) => setIsAvailable(e.target.checked)}
                        />
                        Available
                    </label>
                </div>

                <button className="primary-button" type="submit">
                    Save Changes
                </button>
            </form>
        </div>
    );
}