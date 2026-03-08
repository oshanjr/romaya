import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Package, ShoppingBag, Users, DollarSign, ArrowUpRight, FileText, Briefcase } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
    // Parallel data fetching for dashboard stats
    const [
        totalProducts,
        totalOrders,
        totalUsers,
        recentOrders
    ] = await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.user.count({ where: { role: "USER" } }),
        prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true, email: true } } }
        })
    ]);

    // Aggregate total revenue (sum of all order totals except Cancelled/Refunded)
    const revenueAggregation = await prisma.order.aggregate({
        _sum: { total: true },
        where: {
            status: { notIn: ["CANCELLED", "REFUNDED"] }
        }
    });

    const totalRevenue = revenueAggregation._sum.total || 0;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-display font-bold text-romaya-gray-900">Dashboard</h1>
                <p className="text-romaya-gray-500 mt-1">Overview of your store's performance.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-romaya-gray-500">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-romaya-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-romaya-gray-900">{formatPrice(Number(totalRevenue))}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-romaya-gray-500">Orders</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-romaya-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-romaya-gray-900">+{totalOrders}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            +180 since last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-romaya-gray-500">Products</CardTitle>
                        <Package className="h-4 w-4 text-romaya-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-romaya-gray-900">{totalProducts}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {totalProducts > 0 ? "Active in store" : "Start adding products"}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-romaya-gray-500">Customers</CardTitle>
                        <Users className="h-4 w-4 text-romaya-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-romaya-gray-900">+{totalUsers}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Registered accounts
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentOrders.length === 0 ? (
                            <div className="text-center py-10 text-romaya-gray-400">
                                <p>No orders yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {recentOrders.map((order) => (
                                    <div key={order.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-romaya-gray-100 flex items-center justify-center text-romaya-gray-500 font-bold">
                                                {order.firstName[0]}{order.lastName[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium leading-none">{order.firstName} {order.lastName}</p>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {order.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-sm font-medium">{formatPrice(Number(order.total))}</p>
                                                <div className={`text-xs mt-1 font-semibold
                          ${order.status === 'DELIVERED' ? 'text-green-600' :
                                                        order.status === 'CANCELLED' ? 'text-red-600' : 'text-orange-500'}`}
                                                >
                                                    {order.status}
                                                </div>
                                            </div>
                                            <Link href={`/admin/orders/${order.id}`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <ArrowUpRight className="h-4 w-4 text-romaya-gray-400 group-hover:text-romaya-gray-900" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Link href="/admin/products/new" className="block">
                            <Button className="w-full justify-start bg-romaya-red hover:bg-romaya-red-dark text-white">
                                <Package className="mr-2 h-4 w-4" /> Add New Product
                            </Button>
                        </Link>
                        <Link href="/admin/cms/pages/new" className="block">
                            <Button variant="outline" className="w-full justify-start">
                                <FileText className="mr-2 h-4 w-4" /> Create CMS Page
                            </Button>
                        </Link>
                        <Link href="/admin/careers/new" className="block">
                            <Button variant="outline" className="w-full justify-start">
                                <Briefcase className="mr-2 h-4 w-4" /> Post a Job
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

