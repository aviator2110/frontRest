import { Navigate, Outlet } from "react-router-dom";
import { isTokenExpired } from "../data";

export function ProtectedRoute({ allowedRoles }: { allowedRoles?: string[] }) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || isTokenExpired(token)) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && (!role || !allowedRoles.includes(role))) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}