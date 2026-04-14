import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function AdminTableEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [number, setNumber] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTable = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`http://localhost:5113/api/tables/${id}`, {
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
                    throw new Error("Failed to fetch table");
                }

                const data = await response.json();

                setNumber(String(data.data.number));
                setIsActive(data.data.isActive);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchTable();
    }, [id]);

    // 🔹 отправка
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:5113/api/tables/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    updateRequest: {
                        number: Number(number),
                        isActive,
                    },
                    id: id,
                }),
            });

            const text = await response.text();
            console.log("STATUS:", response.status);
            console.log("RESPONSE:", text);

            if (response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                navigate("/login");
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to update table");
            }

            // 👉 назад к списку
            navigate("/admin/tables");

        } catch (error) {
            console.error(error);
            alert("Error updating table");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="form-container">
            <h2>Edit Table #{id}</h2>

            <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Table Number</label>
                    <input
                        type="number"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        required
                    />
                </div>

                <div className="form-checkbox">
                    <label>
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                        />
                        Active
                    </label>
                </div>

                <button className="primary-button" type="submit">
                    Save Changes
                </button>
            </form>
        </div>
    );
}