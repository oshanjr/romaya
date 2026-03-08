"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, UploadCloud, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
    name: z.string().min(2, "Product name is required"),
    slug: z.string().min(2, "Slug is required"),
    description: z.string().optional(),
    price: z.coerce.number().min(0, "Price must be a positive number"),
    compareAtPrice: z.coerce.number().optional(),
    sku: z.string().optional(),
    stock: z.coerce.number().min(0, "Stock cannot be negative"),
    categoryId: z.string().optional(),
    sizes: z.string().optional(), // Comma-separated string
    colors: z.string().optional(), // Comma-separated string
});

export function ProductForm({ categories }: { categories: any[] }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const form = useForm({
        // @ts-ignore
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
            price: 0,
            stock: 0,
            sizes: "",
            colors: "",
        },
    });

    // Auto-generate slug from name
    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name === "name" && value.name) {
                const generatedSlug = value.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)+/g, "");
                form.setValue("slug", generatedSlug);
            }
        });
        return () => subscription.unsubscribe();
    }, [form]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFiles = Array.from(e.target.files);
            setImages((prev) => [...prev, ...selectedFiles]);

            const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
            setImagePreviews((prev) => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => {
            const newPreviews = [...prev];
            URL.revokeObjectURL(newPreviews[index]);
            newPreviews.splice(index, 1);
            return newPreviews;
        });
    };

    async function onSubmit(values: any) {
        try {
            setIsLoading(true);

            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    formData.append(key, value.toString());
                }
            });

            images.forEach((image) => {
                formData.append("images", image);
            });

            const res = await fetch("/api/admin/products", {
                method: "POST",
                body: formData, // Sending as multipart/form-data
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to create product");
            }

            toast.success("Product created successfully!");
            router.push("/admin/products");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Main Details */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Product Name *</Label>
                                <Input id="name" {...form.register("name")} disabled={isLoading} />
                                {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug *</Label>
                                <Input id="slug" {...form.register("slug")} disabled={isLoading} />
                                {form.formState.errors.slug && <p className="text-sm text-red-500">{form.formState.errors.slug.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    rows={6}
                                    {...form.register("description")}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="categoryId">Category</Label>
                                    <select
                                        id="categoryId"
                                        className="flex h-10 w-full rounded-md border border-input bg-background justify-between px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                        {...form.register("categoryId")}
                                        disabled={isLoading}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="sku">SKU Code</Label>
                                    <Input id="sku" {...form.register("sku")} disabled={isLoading} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing & Inventory</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Regular Price (Rs.) *</Label>
                                    <Input id="price" type="number" step="0.01" {...form.register("price")} disabled={isLoading} />
                                    {form.formState.errors.price && <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="compareAtPrice">Compare at Price (Optional)</Label>
                                    <Input id="compareAtPrice" type="number" step="0.01" {...form.register("compareAtPrice")} disabled={isLoading} />
                                </div>
                            </div>
                            <div className="space-y-2 w-1/2 pr-2">
                                <Label htmlFor="stock">Inventory Stock *</Label>
                                <Input id="stock" type="number" {...form.register("stock")} disabled={isLoading} />
                                {form.formState.errors.stock && <p className="text-sm text-red-500">{form.formState.errors.stock.message}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Variants (Optional)</CardTitle>
                            <CardDescription>Enter sizes and colors comma-separated (e.g. S,M,L,XL)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="sizes">Available Sizes</Label>
                                <Input id="sizes" placeholder="S, M, L, XL" {...form.register("sizes")} disabled={isLoading} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="colors">Available Colors</Label>
                                <Input id="colors" placeholder="Red, Blue, Black" {...form.register("colors")} disabled={isLoading} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Side Panel: Images */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Images</CardTitle>
                            <CardDescription>Upload up to 5 images. The first image will be the primary featured image.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="border-2 border-dashed border-romaya-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-romaya-gray-50 transition-colors cursor-pointer relative">
                                <UploadCloud className="h-10 w-10 text-romaya-gray-400 mb-2" />
                                <p className="text-sm font-medium text-romaya-gray-900">Click to upload images</p>
                                <p className="text-xs text-romaya-gray-500 mt-1">PNG, JPG up to 5MB</p>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    disabled={isLoading}
                                />
                            </div>

                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative group aspect-square rounded-md overflow-hidden border">
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                            {index === 0 && (
                                                <div className="absolute bottom-0 left-0 right-0 bg-romaya-red text-white text-[10px] text-center py-1 font-semibold uppercase">
                                                    Primary
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Button type="submit" className="w-full bg-romaya-black hover:bg-romaya-gray-800 text-white shadow-lg" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Product
                    </Button>
                </div>

            </div>
        </form>
    );
}
