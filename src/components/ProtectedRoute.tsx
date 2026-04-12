import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute({ allowedRoles }: { allowedRoles?: string[] }) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && (!role || !allowedRoles.includes(role))) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}