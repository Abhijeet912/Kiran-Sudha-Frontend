import {
  getFeaturedTestimonials,
  getHeroBanners,
  getSaleBanners,
  getVaultArticles,
} from "@/lib/api/content";
import { getArtForms, getBestSellers } from "@/lib/api/catalog";
import HeroCarousel from "@/components/home/HeroCarousel";
import SaleStrip from "@/components/home/SaleStrip";
import BestSellers from "@/components/home/BestSellers";
import ArtFormsGrid from "@/components/home/ArtFormsGrid";
import Testimonials from "@/components/home/Testimonials";
import VaultBanner from "@/components/home/VaultBanner";

/** Normalize Spring Page vs plain array responses. */
const asList = (data) => (Array.isArray(data) ? data : data?.content || []);

/** Fetch all homepage datasets in parallel; a failed call = empty section. */
async function getHomeData() {
  const [hero, sale, bestSellers, artForms, testimonials, vault] =
    await Promise.allSettled([
      getHeroBanners(),
      getSaleBanners(),
      getBestSellers(8),
      getArtForms(),
      getFeaturedTestimonials(),
      getVaultArticles({ size: 3 }),
    ]);

  const value = (r) => (r.status === "fulfilled" ? asList(r.value) : []);

  return {
    heroBanners: value(hero),
    saleBanners: value(sale),
    bestSellers: value(bestSellers),
    artForms: value(artForms),
    testimonials: value(testimonials),
    vaultArticles: value(vault),
  };
}

export default async function Home() {
  const data = await getHomeData();

  return (
    <main>
      <HeroCarousel banners={data.heroBanners} />
      <SaleStrip banners={data.saleBanners} />
      <BestSellers products={data.bestSellers} />
      <ArtFormsGrid artForms={data.artForms} />
      <Testimonials reviews={data.testimonials} />
      <VaultBanner articles={data.vaultArticles} />
    </main>
  );
}
