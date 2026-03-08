"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Package,
    Tags,
    ShoppingCart,
    Users,
    Settings,
    FileText,
    Navigation,
    Briefcase,
    LogOut,
    ChevronLeft
} from "lucide-react";

const sidebarNavItems = [
    { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    {
        title: "Platform", items: [
            { title: "Products", href: "/admin/products", icon: Package },
            { title: "Categories", href: "/admin/categories", icon: Tags },
            { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
            { title: "Customers", href: "/admin/customers", icon: Users },
        ]
    },
    {
        title: "Content (CMS)", items: [
            { title: "Dynamic Pages", href: "/admin/cms/pages", icon: FileText },
            { title: "Navigation Bar", href: "/admin/cms/navigation", icon: Navigation },
            { title: "Site Settings", href: "/admin/cms/settings", icon: Settings },
        ]
    },
    {
        title: "HR & Careers", items: [
            { title: "Job Postings", href: "/admin/careers", icon: Briefcase },
        ]
    },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex w-64 flex-col border-r bg-romaya-gray-900 text-romaya-gray-200 min-h-screen pt-4 sticky top-0 h-screen overflow-y-auto admin-sidebar px-3">
            <div className="px-4 py-4 mb-4 flex items-center gap-2 border-b border-romaya-gray-800">
                <Link href="/" className="flex items-center gap-2 text-romaya-gray-400 hover:text-white transition-colors group">
                    <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    <span className="text-sm font-medium">Back to Store</span>
                </Link>
            </div>

            <div className="px-4 pb-6">
                <h2 className="font-display font-bold text-2xl text-white tracking-tight">
                    ROMAYA<span className="text-romaya-red">.</span>
                </h2>
                <p className="text-xs text-romaya-gray-400 font-medium tracking-widest uppercase mt-1">Admin Portal</p>
            </div>

            <nav className="flex-1 space-y-8">
                {sidebarNavItems.map((section, i) => (
                    <div key={i} className="space-y-2">
                        {!section.items ? (
                            <Link
                                href={section.href as string}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    pathname === section.href ? "bg-romaya-red text-white" : "hover:bg-white/10 hover:text-white text-romaya-gray-300"
                                )}
                            >
                                <section.icon className="h-4 w-4" />
                                {section.title}
                            </Link>
                        ) : (
                            <>
                                <h3 className="px-4 text-xs font-semibold leading-relaxed tracking-wider text-romaya-gray-500 uppercase">
                                    {section.title}
                                </h3>
                                <div className="space-y-1">
                                    {section.items.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                                pathname.startsWith(item.href) && item.href !== "/admin" ? "bg-romaya-red text-white" :
                                                    pathname === item.href ? "bg-romaya-red text-white" : "hover:bg-white/10 hover:text-white text-romaya-gray-300"
                                            )}
                                        >
                                            <item.icon className="h-4 w-4" />
                                            {item.title}
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </nav>

            <div className="p-4 border-t border-romaya-gray-800 mt-auto">
                <div className="flex items-center gap-3 px-3 py-2">
                    <div className="bg-romaya-red/20 text-romaya-red-light rounded-full p-2">
                        <Settings className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">System Status</span>
                        <span className="text-xs text-green-400">All services online</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
