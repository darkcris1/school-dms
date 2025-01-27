import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
    return (
        <>
            <div className="min-h-screen bg-background container mx-auto">
                <Header />
                  <main className="flex-1 p-6">
                      <Outlet />
                  </main>
            </div>
        </>
    );
}
