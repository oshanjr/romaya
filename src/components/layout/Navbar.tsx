import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { UserNav } from "./UserNav";
import { ShoppingCart, Heart, Search, Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export async function Navbar() {
    const session = await auth();

    // Fetch active navigation links, ordered by position
    const navLinks = await prisma.navigationLink.findMany({
        where: { isActive: true },
        orderBy: { position: "asc" },
    });

    // Calculate cart items logic would go here
    const cartCount = session?.user
        ? await prisma.cartItem.count({ where: { userId: session.user.id } })
        : 0;

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="container-max flex h-16 items-center justify-between px-4">
                {/* Mobile Menu */}
                <div className="flex items-center md:hidden">
                    <Sheet>
                        <SheetTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "mr-2")}>
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle Menu</span>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                            <nav className="flex flex-col gap-4 mt-8">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.id}
                                        href={link.href}
                                        target={link.openInNew ? "_blank" : "_self"}
                                        className="block px-2 py-1 text-lg font-medium transition-colors hover:text-romaya-red"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                    {/* Mobile Logo */}
                    <Link href="/" className="font-display font-bold text-xl tracking-tight text-romaya-red">
                        ROMAYA
                    </Link>
                </div>

                {/* Desktop Logo */}
                <div className="hidden md:flex flex-1">
                    <Link href="/" className="font-display font-bold text-2xl tracking-tight text-romaya-red transition-transform hover:scale-105">
                        ROMAYA
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6 flex-2 justify-center">
                    {navLinks.map((link) => (
                        <Link
                            key={link.id}
                            href={link.href}
                            target={link.openInNew ? "_blank" : "_self"}
                            className="text-sm font-medium transition-colors hover:text-romaya-red"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Utilities & Auth */}
                <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
                    <Button variant="ghost" size="icon" aria-label="Search" className="hidden sm:inline-flex hover:text-romaya-red">
                        <Search className="h-5 w-5" />
                    </Button>

                    {session?.user && (
                        <Link href="/account?tab=wishlist">
                            <Button variant="ghost" size="icon" aria-label="Wishlist" className="hover:text-romaya-red">
                                <Heart className="h-5 w-5" />
                            </Button>
                        </Link>
                    )}

                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative hover:text-romaya-red" aria-label="Cart">
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-romaya-red text-[10px] font-bold text-white">
                                    {cartCount}
                                </span>
                            )}
                        </Button>
                    </Link>

                    {session?.user ? (
                        <UserNav user={session.user} />
                    ) : (
                        <div className="hidden sm:flex items-center gap-2">
                            <Link href="/login">
                                <Button variant="ghost" className="font-medium">Sign In</Button>
                            </Link>
                            <Link href="/register">
                                <Button className="bg-romaya-red hover:bg-romaya-red-dark text-white rounded-full px-6">
                                    Join
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
