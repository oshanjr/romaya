"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AddToCartFormProps {
    product: any;
}

export function AddToCartForm({ product }: AddToCartFormProps) {
    const router = useRouter();
    const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || "");
    const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || "");
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const outOfStock = product.stock <= 0;

    const handleAddToCart = async () => {
        if (product.sizes?.length > 0 && !selectedSize) {
            toast.error("Please select a size");
            return;
        }
        if (product.colors?.length > 0 && !selectedColor) {
            toast.error("Please select a color");
            return;
        }

        try {
            setIsLoading(true);
            // In a real implementation this would call /api/cart
            // For now we simulate
            await new Promise(r => setTimeout(r, 600));
            toast.success(`${product.name} added to cart`);
            router.refresh();
        } catch (err) {
            toast.error("Failed to add to cart");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
                <div className="space-y-3">
                    <label className="text-sm font-semibold uppercase tracking-wider text-romaya-gray-900">
                        Color: <span className="text-romaya-gray-500 font-normal ml-2">{selectedColor}</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {product.colors.map((color: string) => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => setSelectedColor(color)}
                                className={`py-2 px-4 rounded-full border text-sm font-medium transition-all
                  ${selectedColor === color
                                        ? "border-romaya-black bg-romaya-black text-white"
                                        : "border-romaya-gray-200 text-romaya-gray-700 hover:border-romaya-gray-400"
                                    }
                `}
                            >
                                {color}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold uppercase tracking-wider text-romaya-gray-900">
                            Size
                        </label>
                        <button className="text-xs text-romaya-gray-500 underline hover:text-romaya-red">
                            Size Guide
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {product.sizes.map((size: string) => (
                            <button
                                key={size}
                                type="button"
                                onClick={() => setSelectedSize(size)}
                                className={`flex h-12 w-12 items-center justify-center rounded-xl border font-medium transition-all
                  ${selectedSize === size
                                        ? "border-romaya-red bg-romaya-red/10 text-romaya-red"
                                        : "border-romaya-gray-200 text-romaya-gray-700 hover:border-romaya-gray-400"
                                    }
                `}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Quantity & Actions */}
            <div className="space-y-4 pt-4 border-t border-romaya-gray-100">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center border border-romaya-gray-200 rounded-full h-14 bg-white px-2">
                        <button
                            className="p-3 text-romaya-gray-500 hover:text-romaya-gray-900 disabled:opacity-50"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1 || outOfStock}
                        >
                            <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium text-lg">{quantity}</span>
                        <button
                            className="p-3 text-romaya-gray-500 hover:text-romaya-gray-900 disabled:opacity-50"
                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                            disabled={quantity >= product.stock || outOfStock}
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>

                    <Button
                        size="lg"
                        className="flex-1 h-14 rounded-full bg-romaya-red hover:bg-romaya-red-dark text-white text-lg disabled:bg-romaya-gray-300 disabled:text-romaya-gray-500"
                        disabled={outOfStock || isLoading}
                        onClick={handleAddToCart}
                    >
                        <ShoppingBag className="mr-2 h-5 w-5" />
                        {outOfStock ? "Out of Stock" : "Add to Cart"}
                    </Button>

                    <Button
                        size="lg"
                        variant="outline"
                        className="h-14 w-14 rounded-full border-romaya-gray-200 shrink-0 hover:bg-romaya-red/5 hover:border-romaya-red hover:text-romaya-red"
                        disabled={isLoading}
                    >
                        <Heart className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
