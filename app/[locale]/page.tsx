import EmblaCarousel from '../components/Carousel/EmblaCarousel';
import { EmblaOptionsType } from 'embla-carousel';
import FeaturedCategory from '../components/FeaturedCategory';
import { SearchProductRes } from '../common/interfaces/search-product.interface';
import { Category } from '../common/enums/category.enum';

export default async function Home() {
  const category1: SearchProductRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?page=1&limit=4&category=${Category.FURNITURE_HANDLES}`,
    { cache: 'force-cache' }
  ).then((res) => res.json());
  return (
    <div>
      <EmblaCarousel />
      <FeaturedCategory products={category1.products} category={Category.FURNITURE_HANDLES} />
    </div>
  );
}
