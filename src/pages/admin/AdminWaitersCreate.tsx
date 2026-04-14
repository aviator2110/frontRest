import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function AdminWaitersCreate() {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [pin, setPin] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!/^\d{4}$/.test(pin)) {
            alert("PIN must be exactly 4 digits");
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:5113/api/waiters", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    createRequest: {
                        firstName,
                        lastName,
                        pin,
                    },
                }),
            });

            if (response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                navigate("/login");
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to create waiter");
            }

            navigate("/admin/waiters");

        } catch (error) {
            console.error(error);
            alert("Error creating waiter");
        }
    };

    return (
        <div className="form-container">
            <h2>Create Waiter</h2>

            <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>First Name</label>
                    <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Last Name</label>
                    <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>PIN (4 digits)</label>
                    <input
                        type="password"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        maxLength={4}
                        placeholder="1234"
                        required
                    />
                </div>

                <button className="primary-button" type="submit">
                    Create
                </button>
            </form>
        </div>
    );
}