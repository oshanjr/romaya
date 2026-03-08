import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";

export async function Footer() {
    // Try to fetch global settings, fallback to defaults if not present
    const settingsDesc = await prisma.siteSetting.findUnique({ where: { key: "store_description" } });
    const settingsPhone = await prisma.siteSetting.findUnique({ where: { key: "store_phone" } });
    const settingsEmail = await prisma.siteSetting.findUnique({ where: { key: "store_email" } });

    const description = settingsDesc?.value || "For all your glamorous needs. Premium quality clothing and accessories designed to make you shine, delivered right to your doorstep.";
    const phone = settingsPhone?.value || "+94 11 234 5678";
    const email = settingsEmail?.value || "hello@romaya.lk";

    return (
        <footer className="bg-romaya-gray-900 text-romaya-gray-200 pt-16 pb-8 border-t border-romaya-gray-800">
            <div className="container-max px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand & description */}
                    <div className="space-y-4">
                        <h3 className="font-display font-bold text-2xl text-white">ROMAYA</h3>
                        <p className="text-sm text-romaya-gray-400 leading-relaxed max-w-xs">
                            {description}
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="text-romaya-gray-400 hover:text-white transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-romaya-gray-400 hover:text-white transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-romaya-gray-400 hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-romaya-gray-400 hover:text-white transition-colors">
                                <Youtube className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-white font-semibold mb-4 text-lg">Quick Links</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/shop" className="hover:text-romaya-red transition-colors">Shop All</Link></li>
                            <li><Link href="/categories" className="hover:text-romaya-red transition-colors">Categories</Link></li>
                            <li><Link href="/careers" className="hover:text-romaya-red transition-colors">Careers</Link></li>
                            <li><Link href="/about-us" className="hover:text-romaya-red transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-romaya-red transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div className="space-y-4">
                        <h4 className="text-white font-semibold mb-4 text-lg">Customer Care</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/account" className="hover:text-romaya-red transition-colors">My Account</Link></li>
                            <li><Link href="/track-order" className="hover:text-romaya-red transition-colors">Track Order</Link></li>
                            <li><Link href="/return-policy" className="hover:text-romaya-red transition-colors">Returns & Exchanges</Link></li>
                            <li><Link href="/shipping-policy" className="hover:text-romaya-red transition-colors">Shipping Information</Link></li>
                            <li><Link href="/faq" className="hover:text-romaya-red transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="text-white font-semibold mb-4 text-lg">Get in Touch</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start space-x-3 text-romaya-gray-400">
                                <MapPin className="h-5 w-5 shrink-0 text-romaya-red" />
                                <span>123 Fashion Avenue,<br />Colombo 03, Sri Lanka</span>
                            </li>
                            <li className="flex items-center space-x-3 text-romaya-gray-400">
                                <Phone className="h-5 w-5 shrink-0 text-romaya-red" />
                                <span>{phone}</span>
                            </li>
                            <li className="flex items-center space-x-3 text-romaya-gray-400">
                                <Mail className="h-5 w-5 shrink-0 text-romaya-red" />
                                <span>{email}</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-romaya-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-romaya-gray-400">
                    <p>&copy; {new Date().getFullYear()} ROMAYA Core. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
