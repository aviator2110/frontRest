import { Outlet, useNavigate } from "react-router-dom";

export function AdminWaitersPage() {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Waiters</h2>

            <button className="ghost-button" type="button" onClick={() => navigate("create")}>Create</button>

            <div>
                <Outlet />
            </div>
        </div>
    );
}