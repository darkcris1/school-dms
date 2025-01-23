import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
    createBrowserRouter,
    Navigate,
    RouterProvider,
} from "react-router-dom";
import App from "./App.tsx";
import Login from "./pages/Login.tsx";
import FileManager from "./pages/dashboard/FileManager.tsx";
import DashboardLayout from "./pages/dashboard/layout.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "./components/ui/toast.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import '@/commons/utils/axios.util.ts'
import { isLoggedIn } from "./commons/services/auth.service.ts";

// Create a client
const queryClient = new QueryClient();

// Authentication Guard Component
const AuthGuard = ({ children }: { children: JSX.Element }) => {
    return isLoggedIn() ? children : <Navigate to="/login" replace />;
};
const AlreadyLoggedIn = ({ children }: { children: JSX.Element }) => {
    return isLoggedIn() ? <Navigate to="/dashboard" replace /> : children;
};

// Define the routes using createBrowserRouter
const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true, // This makes it the default route for "/"
                element: <Navigate to="/login" replace />, // Redirect to the login page
            },
            {
                path: "login",
                element: <AlreadyLoggedIn><Login /></AlreadyLoggedIn> ,
            },
            {
                path: "dashboard",
                element: <AuthGuard><DashboardLayout /></AuthGuard> ,
                children: [
                    {
                        path: "",
                        element: <FileManager />,
                    },
                ],
            },
        ],
    },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ToastProvider>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
            <Toaster />
        </ToastProvider>
    </StrictMode>
);
