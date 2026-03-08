import { prisma } from "@/lib/prisma";
import { ProductForm } from "./ProductForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
    });

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/admin/products" className="p-2 rounded-full hover:bg-white transition-colors border shadow-sm bg-romaya-gray-50 text-romaya-gray-500">
                    <ChevronLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-display font-bold text-romaya-gray-900">Add New Product</h1>
                    <p className="text-romaya-gray-500">Create a new product for your storefront.</p>
                </div>
            </div>

            <ProductForm categories={categories} />
        </div>
    );
}
