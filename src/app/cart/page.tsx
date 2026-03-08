import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image"; // Note: For external images, next.config.js needs updating or we just use regular <img> for this prototype.
// Actually, let's just use regular <img> to avoid next.config domain issues with unknown supabase urls.

export const dynamic = "force-dynamic";

export default async function CartPage() {
    const session = await auth();

    // If user is not logged in, show empty state or redirect to login
    if (!session?.user) {
        return (
            <div className="container-max section-padding text-center min-h-[60vh] flex flex-col items-center justify-center">
                <ShoppingBag className="h-16 w-16 text-romaya-gray-300 mb-6" />
                <h1 className="font-display text-3xl font-bold text-romaya-gray-900 mb-4">Your Cart is Empty</h1>
                <p className="text-romaya-gray-500 mb-8">Please sign in to view and manage your shopping cart.</p>
                <Link href="/login?callbackUrl=/cart">
                    <Button size="lg" className="bg-romaya-red hover:bg-romaya-red-dark text-white rounded-full px-8">
                        Sign In to Continue
                    </Button>
                </Link>
            </div>
        );
    }

    // Fetch Cart Items
    const cartItems = await prisma.cartItem.findMany({
        where: { userId: session.user.id },
        include: {
            product: {
                include: {
                    images: { take: 1, orderBy: { position: "asc" } }
                }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    const subtotal = cartItems.reduce((acc, item) => {
        return acc + (Number(item.product.price) * item.quantity);
    }, 0);

    return (
        <div className="container-max section-padding">
            <h1 className="font-display text-4xl font-bold text-romaya-gray-900 mb-10">Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-20 bg-romaya-gray-50 rounded-2xl border border-dashed border-romaya-gray-200">
                    <ShoppingBag className="h-12 w-12 text-romaya-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-romaya-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-romaya-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                    <Link href="/shop">
                        <Button className="bg-romaya-black hover:bg-romaya-gray-800 text-white rounded-full px-8">
                            Continue Shopping
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Cart Items List */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b text-sm font-semibold text-romaya-gray-500 uppercase tracking-wider">
                            <div className="col-span-6">Product</div>
                            <div className="col-span-2 text-center">Price</div>
                            <div className="col-span-2 text-center">Quantity</div>
                            <div className="col-span-2 text-right">Total</div>
                        </div>

                        {cartItems.map((item) => (
                            <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-6 border-b">
                                <div className="col-span-1 md:col-span-6 flex items-center gap-6">
                                    <div className="w-24 h-32 shrink-0 bg-romaya-gray-100 rounded-md overflow-hidden border">
                                        {item.product.images[0] ? (
                                            <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-romaya-gray-900 hover:text-romaya-red transition-colors line-clamp-2">
                                            <Link href={`/shop/${item.product.slug}`}>{item.product.name}</Link>
                                        </h3>
                                        <div className="text-sm text-romaya-gray-500 mt-1 space-y-1">
                                            {item.size && <p>Size: {item.size}</p>}
                                            {item.color && <p>Color: {item.color}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-1 md:col-span-2 text-center font-medium hidden md:block">
                                    {formatPrice(Number(item.product.price))}
                                </div>

                                <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-center">
                                    <span className="md:hidden text-sm text-gray-500">Qty:</span>
                                    <div className="flex items-center border rounded-md">
                                        <button className="px-3 py-1 text-gray-500 hover:bg-gray-100">-</button>
                                        <span className="px-2 font-medium text-sm">{item.quantity}</span>
                                        <button className="px-3 py-1 text-gray-500 hover:bg-gray-100">+</button>
                                    </div>
                                </div>

                                <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end">
                                    <div className="font-bold text-romaya-red">
                                        {formatPrice(Number(item.product.price) * item.quantity)}
                                    </div>
                                    <button className="text-gray-400 hover:text-red-500 transition-colors p-2">
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-4">
                        <div className="bg-romaya-gray-50 rounded-2xl p-8 border border-romaya-gray-100 sticky top-24">
                            <h2 className="font-display font-bold text-2xl mb-6 border-b pb-4">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-romaya-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-romaya-gray-900">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-romaya-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-sm">Calculated at checkout</span>
                                </div>
                                <div className="flex justify-between text-romaya-gray-600">
                                    <span>Tax</span>
                                    <span className="text-sm">Included</span>
                                </div>
                            </div>

                            <div className="border-t border-romaya-gray-200 pt-4 mb-8">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-lg">Total</span>
                                    <span className="font-bold text-2xl text-romaya-red">{formatPrice(subtotal)}</span>
                                </div>
                            </div>

                            <Link href="/checkout" className="block w-full">
                                <Button size="lg" className="w-full bg-romaya-black hover:bg-romaya-gray-800 text-white rounded-full py-6 text-lg group">
                                    Proceed to Checkout
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>

                            <div className="mt-6 text-center text-xs text-romaya-gray-500 uppercase tracking-wider">
                                Secure checkout provided by PayHere
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
