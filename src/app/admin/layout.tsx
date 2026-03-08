import { AdminSidebar } from "./components/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-romaya-gray-50">
            <AdminSidebar />
            <main className="flex-1 overflow-x-hidden pt-8 px-8 pb-12">
                {children}
            </main>
        </div>
    );
}
