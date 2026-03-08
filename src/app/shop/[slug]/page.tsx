import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Truck, RefreshCcw, ShieldCheck } from "lucide-react";
import { AddToCartForm } from "./AddToCartForm";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
    params,
}: {
    params: { slug: string };
}) {
    const product = await prisma.product.findUnique({
        where: { slug: params.slug },
        include: {
            category: true,
            images: {
                orderBy: { position: "asc" },
            },
        },
    });

    if (!product || !product.isActive) {
        notFound();
    }

    // Fallback to an empty image if none exist
    const primaryImage = product.images[0]?.url || "https://source.unsplash.com/random/800x1200/?fashion,clothing&sig=1";

    return (
        <div className="container-max section-padding">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

                {/* Product Images Gallery */}
                <div className="space-y-4">
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-romaya-gray-100 border">
                        <img
                            src={primaryImage}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {product.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.map((img) => (
                                <div key={img.id} className="aspect-[3/4] rounded-lg overflow-hidden border cursor-pointer hover:border-romaya-red transition-colors">
                                    <img src={img.url} alt={product.name} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col pt-8">
                    <div className="mb-2 text-sm text-romaya-gray-500 uppercase tracking-widest font-semibold flex items-center justify-between">
                        <span>{product.category?.name || "Apparel"}</span>
                        {product.sku && <span className="opacity-50">SKU: {product.sku}</span>}
                    </div>

                    <h1 className="font-display text-4xl lg:text-5xl font-bold text-romaya-gray-900 mb-4">
                        {product.name}
                    </h1>

                    <div className="flex items-center gap-4 mb-8">
                        <p className="font-semibold text-2xl text-romaya-red">
                            {formatPrice(Number(product.price))}
                        </p>
                        {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                            <p className="text-xl text-romaya-gray-400 line-through">
                                {formatPrice(Number(product.comparePrice))}
                            </p>
                        )}
                    </div>

                    {/* Client Component: Size, Color Selection & Add to Cart */}
                    <AddToCartForm product={product} />

                    {/* Description */}
                    <div className="my-10 prose prose-gray max-w-none text-romaya-gray-600">
                        {product.description ? (
                            <p className="whitespace-pre-line leading-relaxed">{product.description}</p>
                        ) : (
                            <p>No description provided for this product.</p>
                        )}
                    </div>

                    <div className="border-t border-romaya-gray-200 mt-auto pt-8">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-romaya-gray-600">
                            <div className="flex items-center gap-3">
                                <Truck className="h-5 w-5 shrink-0 text-romaya-gray-400" />
                                <span>Island-wide Delivery</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <RefreshCcw className="h-5 w-5 shrink-0 text-romaya-gray-400" />
                                <span>7 Days Return</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="h-5 w-5 shrink-0 text-romaya-gray-400" />
                                <span>Secure Payments</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
