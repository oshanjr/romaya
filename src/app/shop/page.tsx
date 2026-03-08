import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ShopPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    // Extract search params for filtering
    const categoryParam = searchParams.category as string;
    const searchParam = searchParams.q as string;

    // Build the Prisma "where" clause based on active filters
    const whereClause: any = {
        isActive: true,
    };

    if (categoryParam) {
        whereClause.category = {
            slug: categoryParam,
        };
    }

    if (searchParam) {
        whereClause.name = {
            contains: searchParam,
            mode: "insensitive",
        };
    }

    // Fetch categories for the sidebar filter
    const categories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
    });

    // Fetch products
    const products = await prisma.product.findMany({
        where: whereClause,
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
        <div className="container-max section-padding">
            <div className="flex flex-col md:flex-row gap-12">
                {/* Sidebar Filters */}
                <aside className="w-full md:w-64 shrink-0 space-y-8">
                    <div>
                        <h3 className="font-display font-bold text-xl mb-4 border-b border-romaya-gray-200 pb-2">
                            Categories
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/shop"
                                    className={`text-sm hover:text-romaya-red transition-colors ${!categoryParam ? "text-romaya-red font-semibold" : "text-romaya-gray-600"}`}
                                >
                                    All Products
                                </Link>
                            </li>
                            {categories.map((cat) => (
                                <li key={cat.id}>
                                    <Link
                                        href={`/shop?category=${cat.slug}`}
                                        className={`text-sm hover:text-romaya-red transition-colors ${categoryParam === cat.slug ? "text-romaya-red font-semibold" : "text-romaya-gray-600"}`}
                                    >
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Product Grid Header & List */}
                <div className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                        <h1 className="font-display text-3xl font-bold text-romaya-gray-900">
                            {categoryParam
                                ? categories.find((c) => c.slug === categoryParam)?.name || "Shop"
                                : "All Products"}
                        </h1>
                        <p className="text-sm text-romaya-gray-500">
                            Showing {products.length} {products.length === 1 ? "product" : "products"}
                        </p>
                    </div>

                    {products.length === 0 ? (
                        <div className="text-center py-20 bg-romaya-gray-50 rounded-2xl">
                            <Search className="h-10 w-10 text-romaya-gray-300 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-romaya-gray-900 mb-2">No products found</h2>
                            <p className="text-romaya-gray-500 max-w-md mx-auto mb-6">
                                We couldn't find any products matching your current filters.
                            </p>
                            <Link href="/shop">
                                <Button className="bg-romaya-red hover:bg-romaya-red-dark text-white rounded-full">
                                    Clear Filters
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((product) => (
                                <Link key={product.id} href={`/shop/${product.slug}`} className="product-card group">
                                    <div className="relative aspect-[3/4] bg-romaya-gray-100 overflow-hidden">
                                        {product.images[0] ? (
                                            <img
                                                src={product.images[0].url}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-romaya-gray-300">
                                                No image
                                            </div>
                                        )}

                                        {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                                            <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-sm">
                                                Sale
                                            </div>
                                        )}

                                        <div className="product-overlay flex items-center justify-center gap-4 bg-black/20 backdrop-blur-[2px]">
                                            <Button variant="secondary" className="rounded-full bg-white text-black hover:bg-romaya-red hover:text-white transition-colors">
                                                Quick View
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <p className="text-romaya-gray-500 text-xs font-medium uppercase tracking-wider mb-1">
                                            {product.category?.name || "Uncategorized"}
                                        </p>
                                        <h3 className="font-bold text-romaya-gray-900 mb-1 line-clamp-1 group-hover:text-romaya-red transition-colors">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-2">
                                            <p className="font-semibold text-lg text-romaya-red">
                                                {formatPrice(Number(product.price))}
                                            </p>
                                            {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                                                <p className="text-sm text-romaya-gray-400 line-through">
                                                    {formatPrice(Number(product.comparePrice))}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
