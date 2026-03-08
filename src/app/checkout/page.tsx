import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login?callbackUrl=/checkout");
    }

    // Fetch Cart Items
    const cartItems = await prisma.cartItem.findMany({
        where: { userId: session.user.id },
        include: { product: true },
    });

    if (cartItems.length === 0) {
        redirect("/cart");
    }

    const subtotal = cartItems.reduce((acc, item) => {
        return acc + (Number(item.product.price) * item.quantity);
    }, 0);

    // Hardcoded delivery logic for demo purposes
    const deliveryFee = 450;
    const total = subtotal + deliveryFee;

    return (
        <div className="container-max section-padding">
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Checkout Form */}
                <div className="flex-1 space-y-8">
                    <div>
                        <h1 className="font-display text-3xl font-bold text-romaya-gray-900 mb-6">Checkout</h1>
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Shipping Information</h2>

                        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">First Name</label>
                                <input type="text" className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Jane" defaultValue={session.user.name?.split(" ")[0] || ""} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Last Name</label>
                                <input type="text" className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Doe" defaultValue={session.user.name?.split(" ").slice(1).join(" ") || ""} />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium">Address Line 1</label>
                                <input type="text" className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="123 Street Name" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium">Address Line 2 (Optional)</label>
                                <input type="text" className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Apartment, suite, etc." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">City</label>
                                <input type="text" className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Colombo" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Postal Code</label>
                                <input type="text" className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="10500" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium">Phone Number</label>
                                <input type="tel" className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="+94 77 123 4567" />
                            </div>
                        </form>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Payment Method</h2>
                        <div className="p-4 border border-romaya-red bg-romaya-red/5 rounded-lg flex items-center justify-between cursor-pointer">
                            <div className="flex items-center gap-3">
                                <input type="radio" checked readOnly className="h-4 w-4 text-romaya-red focus:ring-romaya-red" />
                                <span className="font-medium text-romaya-gray-900">PayHere (Credit/Debit Card, Mobile Wallet)</span>
                            </div>
                            {/* Fake logo placeholder */}
                            <div className="text-xs font-bold text-romaya-gray-500 bg-white border px-2 py-1 rounded">PAYHERE</div>
                        </div>
                        <p className="text-sm text-romaya-gray-500 mt-3">
                            You will be redirected securely to the PayHere payment gateway to complete your purchase.
                        </p>
                    </div>

                    <Button size="lg" className="w-full bg-romaya-red hover:bg-romaya-red-dark text-white rounded-full py-6 text-lg">
                        Pay {formatPrice(total)}
                    </Button>

                </div>

                {/* Order Summary Sidebar */}
                <div className="w-full lg:w-[400px] shrink-0">
                    <div className="bg-romaya-gray-50 rounded-2xl p-6 border border-romaya-gray-100 sticky top-24">
                        <h2 className="font-semibold text-lg mb-4">Summary</h2>
                        <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-16 h-20 bg-romaya-gray-200 rounded shrink-0 flex items-center justify-center text-[10px] text-gray-500 border border-gray-300 relative">
                                        IMG
                                        <span className="absolute -top-2 -right-2 bg-romaya-gray-900 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold z-10">
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div className="flex-1 text-sm">
                                        <p className="font-medium text-romaya-gray-900 line-clamp-2">{item.product.name}</p>
                                        {item.size && <p className="text-romaya-gray-500 mt-0.5 text-xs">{item.size} / {item.color}</p>}
                                        <p className="font-semibold text-romaya-gray-900 mt-1">{formatPrice(Number(item.product.price) * item.quantity)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-romaya-gray-200 pt-4 space-y-2 text-sm">
                            <div className="flex justify-between text-romaya-gray-600">
                                <span>Subtotal</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-romaya-gray-600">
                                <span>Delivery (Standard)</span>
                                <span>{formatPrice(deliveryFee)}</span>
                            </div>
                            <div className="flex justify-between items-center font-bold text-lg pt-2 mt-2 border-t border-romaya-gray-200">
                                <span>Total</span>
                                <span className="text-romaya-red">{formatPrice(total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
