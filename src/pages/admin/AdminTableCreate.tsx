import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../components/Modal";

export function AdminTableCreate() {
    const [number, setNumber] = useState("");
    const [isActive, setIsActive] = useState(true);
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const showModal = (message: string) => {
        setModalMessage(message);
        setModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:5113/api/tables", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    "createRequest":{
                        number: Number(number),
                        isActive
                    }
                }),
            });

            if (response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                navigate("/login");
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to create table");
            }

            navigate("/admin/tables");

        } catch (error) {
            console.error(error);
            showModal("Error creating table");
        }
    };

    return (
        <div className="form-container">
            <h2>Create Table</h2>

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
                    Create
                </button>
            </form>
            <Modal
                isOpen={modalOpen}
                message={modalMessage}
                onClose={() => setModalOpen(false)}
            />
        </div>
    );
}