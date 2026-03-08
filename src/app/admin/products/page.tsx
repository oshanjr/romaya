import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Tag, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            category: true,
            images: {
                orderBy: { position: "asc" },
                take: 1,
            },
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold text-romaya-gray-900">Products</h1>
                    <p className="text-romaya-gray-500 mt-1">Manage your storefront inventory.</p>
                </div>
                <Link href="/admin/products/new">
                    <Button className="bg-romaya-red hover:bg-romaya-red-dark text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-romaya-gray-50 text-romaya-gray-500 font-medium uppercase text-xs border-b">
                            <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-romaya-gray-500">
                                        No products found. Start by adding a new product.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-lg bg-romaya-gray-100 flex items-center justify-center overflow-hidden shrink-0 border">
                                                    {product.images[0] ? (
                                                        <img
                                                            src={product.images[0].url}
                                                            alt={product.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <ImageIcon className="h-5 w-5 text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-romaya-gray-900">{product.name}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-romaya-gray-500 line-clamp-1 max-w-[200px]">
                                                            SKU: {product.sku || "N/A"}
                                                        </span>
                                                        {product.category && (
                                                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                                                {product.category.name}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={product.isActive ? "default" : "secondary"} className={product.isActive ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}>
                                                {product.isActive ? "Active" : "Draft"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {formatPrice(Number(product.price))}
                                        </td>
                                        <td className="px-6 py-4 text-romaya-gray-600">
                                            {product.stock > 10 ? (
                                                <span>{product.stock} in stock</span>
                                            ) : product.stock > 0 ? (
                                                <span className="text-orange-500 font-medium">Low stock ({product.stock})</span>
                                            ) : (
                                                <span className="text-red-500 font-medium">Out of stock</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/admin/products/${product.id}/edit`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-romaya-gray-500 hover:text-romaya-gray-900">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
