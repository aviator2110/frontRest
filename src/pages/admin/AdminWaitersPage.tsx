import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiLink } from "../../data";

type Waiter = {
    id: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    createdAt: string;
};

export function AdminWaitersPage() {
    const navigate = useNavigate();
    const [waiters, setWaiters] = useState<Waiter[]>([]);

    useEffect(() => {
        const fetchWaiters = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`${apiLink}/waiters`, {
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
                    throw new Error("Failed to fetch waiters");
                }

                const data = await response.json();
                setWaiters(data.data);

            } catch (error) {
                console.error(error);
            }
        };

        fetchWaiters();
    }, []);

    return (
        <div>
            <h2>Waiters</h2>

            <button
                className="ghost-button"
                type="button"
                onClick={() => navigate("create")}
            >
                Create
            </button>

            <div className="table-grid expanded">
                {waiters.map((waiter) => (
                    <article key={waiter.id} className={`table-card sketch-card ${
                        waiter.isActive ? "waiter-active" : "waiter-inactive"
                    }`}>
                        <h1>
                            {waiter.firstName} {waiter.lastName}
                        </h1>

                        <p>
                            {waiter.isActive ? "Active" : "Inactive"}
                        </p>

                        <p>
                            Created at {new Date(waiter.createdAt).toLocaleString()}
                        </p>

                        <button
                            className="ghost-button"
                            type="button"
                            onClick={() => navigate(`edit/${waiter.id}`)}
                        >
                            Edit
                        </button>
                    </article>
                ))}
            </div>

            <Outlet />
        </div>
    );
}