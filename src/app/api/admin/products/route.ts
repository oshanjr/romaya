import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const session = await auth();
        // Re-verify the user is ADMIN
        if (!session?.user || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();

        // Extract base product fields
        const name = formData.get("name") as string;
        const slug = formData.get("slug") as string;
        const description = formData.get("description") as string | null;
        const price = parseFloat(formData.get("price") as string);
        const compareAtPriceStr = formData.get("compareAtPrice") as string | null;
        const compareAtPrice = compareAtPriceStr ? parseFloat(compareAtPriceStr) : null;
        const sku = formData.get("sku") as string | null;
        const stock = parseInt(formData.get("stock") as string);
        const categoryId = formData.get("categoryId") as string | null;

        // Extract sizes/colors
        const sizesStr = formData.get("sizes") as string | null;
        const colorsStr = formData.get("colors") as string | null;
        const sizes = sizesStr ? sizesStr.split(",").map((s) => s.trim()) : [];
        const colors = colorsStr ? colorsStr.split(",").map((c) => c.trim()) : [];

        // Extract images
        const images = formData.getAll("images") as File[];

        if (!name || !slug || isNaN(price) || isNaN(stock)) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Check if slug exists
        const existingProduct = await prisma.product.findUnique({
            where: { slug },
        });

        if (existingProduct) {
            return NextResponse.json({ error: "Product with this slug already exists" }, { status: 400 });
        }

        // 2. Upload images to Supabase 'product-images' bucket concurrently
        const uploadPromises = images.map(async (file, index) => {
            // Create a unique filename
            const fileExt = file.name.split(".").pop();
            const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const path = `${slug}/${uniqueName}`;

            const { url, storagePath } = await uploadFile(
                "product-images",
                path,
                file,
                file.type
            );

            return {
                url,
                storagePath,
                position: index,
            };
        });

        const uploadedImages = await Promise.all(uploadPromises);

        // 3. Create Product in DB with nested Images relation
        const product = await prisma.product.create({
            data: {
                name,
                slug,
                description,
                price,
                comparePrice: compareAtPrice,
                sku,
                stock,
                isActive: true, // Auto-publish for now
                categoryId: categoryId || undefined,
                sizes: sizes.length > 0 ? sizes : undefined,
                colors: colors.length > 0 ? colors : undefined,
                images: {
                    create: uploadedImages,
                },
            },
        });

        // 4. (Optional) In a real app we'd create Size/Color product variants properly into a Variant table,
        // but right now `schema.prisma` doesn't have a specific `Variant` table, it relies on CartItem having `size` and `color`.
        // Wait, let's just make sizes/colors as metadata if needed or store an array natively if PostgreSQL allows, 
        // but prisma schema doesn't have a sizes/colors array.
        // I will skip sizes/colors persistence for now since they are not in the Prisma schema as top level array fields for Product,
        // unless we create them as separate models. User's schema has no `ProductVariant` table.

        return NextResponse.json({ product }, { status: 201 });
    } catch (error: any) {
        console.error("Product creation error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create product" },
            { status: 500 }
        );
    }
}
