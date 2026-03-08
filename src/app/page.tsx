import Link from "next/link";
import { ArrowRight, Star, Truck, ShieldCheck, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

// Note: Server Components can't use framer-motion directly, so we'll wrap animations in a client component or use pure CSS.
// For this landing page, we'll build the static frame and we can add a client component wrapper for animations later if needed.

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ─── HERO SECTION ────────────────────────────────────────────────────── */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-romaya-gray-900">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
            alt="Fashion Hero"
            className="w-full h-full object-cover object-top opacity-60"
          />
        </div>

        <div className="container-max relative z-20 px-4 text-center md:text-left pt-20">
          <span className="inline-block py-1 px-3 rounded-full bg-romaya-red/20 text-romaya-red-light border border-romaya-red/30 text-sm font-semibold tracking-wider mb-6 backdrop-blur-md">
            NEW COLLECTION 2026
          </span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6 max-w-4xl">
            For All Your <br />
            <span className="text-romaya-red">Glamorous</span> Needs
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed md:ml-0 mx-auto">
            Discover premium fashion designed to make you stand out. Uncompromising quality meets bold, modern aesthetics.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <Link href="/shop">
              <Button size="lg" className="w-full sm:w-auto bg-romaya-red hover:bg-romaya-red-dark text-white rounded-full px-8 py-6 text-lg tracking-wide shadow-lg shadow-romaya-red/30 transition-all hover:scale-105">
                Shop the Collection
              </Button>
            </Link>
            <Link href="/categories">
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 py-6 text-lg border-white text-white hover:bg-white/10 hover:text-white backdrop-blur-sm transition-all">
                View Lookbook
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FEATURES BAR ────────────────────────────────────────────────────── */}
      <section className="bg-romaya-red py-8 border-y border-romaya-red-dark">
        <div className="container-max px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-white text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <Truck className="h-6 w-6 opacity-80" />
              <h3 className="font-semibold text-sm tracking-wide">ISLAND-WIDE DELIVERY</h3>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <ShieldCheck className="h-6 w-6 opacity-80" />
              <h3 className="font-semibold text-sm tracking-wide">PREMIUM QUALITY</h3>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <RefreshCcw className="h-6 w-6 opacity-80" />
              <h3 className="font-semibold text-sm tracking-wide">EASY EXCHANGES</h3>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <Star className="h-6 w-6 opacity-80" />
              <h3 className="font-semibold text-sm tracking-wide">TOP RATED</h3>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SHOP BY CATEGORY ──────────────────────────────────────────────── */}
      <section className="section-padding bg-romaya-gray-50">
        <div className="container-max">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-display text-4xl font-bold text-romaya-black mb-4">Shop by Category</h2>
              <p className="text-romaya-gray-600 max-w-2xl">Curated collections for every occasion. Find your perfect fit effortlessly.</p>
            </div>
            <Link href="/categories" className="hidden md:flex items-center text-romaya-red font-semibold hover:text-romaya-red-dark transition-colors group">
              View All <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Category Cards (Hardcoded for landing page demo, ideally fetched from DB) */}
            {[
              { title: "Dresses", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1983&auto=format&fit=crop", count: 120 },
              { title: "Tops & Blouses", image: "https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?q=80&w=1972&auto=format&fit=crop", count: 85 },
              { title: "Outerwear", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1935&auto=format&fit=crop", count: 42 },
            ].map((cat) => (
              <Link href={`/categories/${cat.title.toLowerCase().replace(/\s+/g, '-')}`} key={cat.title} className="group relative h-96 rounded-2xl overflow-hidden block">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
                <img src={cat.image} alt={cat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-3xl font-display font-bold text-white mb-2">{cat.title}</h3>
                  <p className="text-romaya-gray-200 text-sm font-medium tracking-wide border-b border-romaya-red pb-1 inline-block">
                    {cat.count} Products
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link href="/categories" className="inline-flex items-center text-romaya-red font-semibold hover:text-romaya-red-dark transition-colors">
              View All Categories <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─────────────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-romaya-black mb-4">Trending Now</h2>
            <div className="w-24 h-1 bg-romaya-red mx-auto rounded-full mb-6" />
            <p className="text-romaya-gray-600 max-w-2xl mx-auto">The most loved pieces by our community this week.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Hardcoded placeholders for the moment */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="product-card group cursor-pointer">
                <div className="relative aspect-[3/4] bg-romaya-gray-100 overflow-hidden">
                  <img src={`https://source.unsplash.com/random/400x600/?fashion,clothing&sig=${i}`} alt={`Product ${i}`} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-black text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">New</span>
                  </div>
                  <div className="product-overlay flex items-center justify-center gap-4 bg-black/40 backdrop-blur-[2px]">
                    <Button variant="secondary" className="rounded-full bg-white text-black hover:bg-romaya-red hover:text-white transition-colors">
                      Quick Add
                    </Button>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-romaya-gray-900 mb-1 line-clamp-1">Glamour Silk Dress {i}</h3>
                  <p className="text-romaya-gray-500 text-sm mb-3">ROMAYA Exclusive</p>
                  <p className="font-semibold text-lg text-romaya-red">Rs. {5000 + i * 1500}.00</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/shop">
              <Button size="lg" className="bg-romaya-black hover:bg-romaya-gray-800 text-white rounded-full px-10 py-6 text-lg tracking-wide transition-all">
                Discover All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ────────────────────────────────────────────────────── */}
      <section className="relative py-24 bg-romaya-gray-900 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-romaya-gradient mix-blend-multiply" />
          <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop" alt="Newsletter Background" className="w-full h-full object-cover" />
        </div>

        <div className="container-max relative z-10 px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">Join the ROMAYA Club</h2>
          <p className="text-romaya-gray-300 max-w-2xl mx-auto mb-10 text-lg">
            Subscribe to receive updates, access to exclusive deals, and more. Become part of our glamorous journey.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-romaya-red"
              required
            />
            <Button type="submit" size="lg" className="bg-romaya-red hover:bg-romaya-red-dark text-white rounded-full px-8 py-4">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
