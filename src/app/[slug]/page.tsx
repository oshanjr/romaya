import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const page = await prisma.dynamicPage.findUnique({
        where: { slug: params.slug },
    });

    if (!page || !page.isPublished) {
        return { title: "Page Not Found | ROMAYA" };
    }

    return {
        title: page.metaTitle || page.title,
        description: page.metaDesc || "ROMAYA - For all your glamorous needs",
    };
}

export default async function CMSPage({
    params,
}: {
    params: { slug: string };
}) {
    const page = await prisma.dynamicPage.findUnique({
        where: { slug: params.slug },
    });

    if (!page || !page.isPublished) {
        notFound();
    }

    return (
        <div className="container-max section-padding min-h-[60vh]">
            <div className="max-w-3xl mx-auto">
                <h1 className="font-display text-4xl md:text-5xl font-bold text-romaya-gray-900 mb-8 border-b pb-6">
                    {page.title}
                </h1>
                <div
                    className="prose prose-lg prose-red max-w-none text-romaya-gray-700
                     prose-headings:font-display prose-headings:text-romaya-gray-900 
                     prose-a:text-romaya-red hover:prose-a:text-romaya-red-dark"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                />
            </div>
        </div>
    );
}
