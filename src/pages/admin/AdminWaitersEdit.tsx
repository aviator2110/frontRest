import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Modal } from "../../components/Modal";

export function AdminWaitersEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const showModal = (message: string) => {
        setModalMessage(message);
        setModalOpen(true);
    };

    useEffect(() => {
        const fetchWaiter = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`http://localhost:5113/api/waiters/${id}`, {
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
                    throw new Error("Failed to fetch waiter");
                }

                const data = await response.json();

                setFirstName(data.data.firstName);
                setLastName(data.data.lastName);
                setIsActive(data.data.isActive);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchWaiter();
    }, [id]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:5113/api/waiters/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: id,
                    updateRequest: {
                        firstName,
                        lastName,
                        isActive,
                    },
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update waiter");
            }

            showModal("Updated successfully");
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdatePin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (pin.length !== 4) {
            showModal("PIN must be 4 digits")
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:5113/api/waiters/${id}/pin`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: id,
                    newPin: pin,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update PIN");
            }

            showModal("PIN updated successfully");
            setPin("");
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="form-container">
            <h2>Edit Waiter</h2>

            <form className="form" onSubmit={handleUpdate}>
                <div className="form-group">
                    <label>First Name</label>
                    <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Last Name</label>
                    <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
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

            <hr style={{ margin: "24px 0" }} />

            <h3>Update PIN</h3>

            <form className="form" onSubmit={handleUpdatePin}>
                <div className="form-group">
                    <label>New PIN</label>
                    <input
                        type="password"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="4-digit PIN"
                        maxLength={4}
                    />
                </div>

                <button className="primary-button" type="submit">
                    Update PIN
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