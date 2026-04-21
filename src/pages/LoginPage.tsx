import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../components/Modal";

type Role = "Admin" | "Bartender" | "Waiter" | "Cook";

const routeByRole: Record<Role, string> = {
    Admin: "/admin",
    Waiter: "/hall",
    Bartender: "/bar",
    Cook: "/kitchen",
};

export function LoginPage() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const navigate = useNavigate();

    const showModal = (message: string) => {
        setModalMessage(message);
        setModalOpen(true);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role") as Role;

        if (token && role) {
            navigate(routeByRole[role]);
        }
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:5113/api/Auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    login,
                    password,
                }),
            });

            if (!response.ok) {
                throw new Error("Invalid credentials");
            }

            const data = await response.json();

            localStorage.setItem("token", data.data.token);
            localStorage.setItem("role", data.data.role);

            const userRole: Role = data.data.role;

            navigate(routeByRole[userRole]);

        } catch (error) {
            console.error(error);
            showModal("Login Error");
        }
    };

    return (
        <main className="app-shell auth-shell">
            <section className="auth-card">
                <div className="auth-badge">Restaurant OS</div>
                <h1>Authorization</h1>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <label className="field">
                        <span>Login</span>
                        <input
                            type="text"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            placeholder="Input login"
                        />
                    </label>

                    <label className="field">
                        <span>Password</span>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Input password"
                        />
                    </label>

                    <button className="primary-button" type="submit">
                        Sign in
                    </button>
                </form>
            </section>
            <Modal
                isOpen={modalOpen}
                message={modalMessage}
                onClose={() => setModalOpen(false)}
            />
        </main>
  );
}
