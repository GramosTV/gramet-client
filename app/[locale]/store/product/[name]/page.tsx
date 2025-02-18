import Link from 'next/link';
import Head from 'next/head';
import Product from '@/app/components/Product';
import { Product as ProductType } from '@/app/common/interfaces/product.interface';
import { Metadata, ResolvingMetadata } from 'next';
import { useTranslations } from 'next-intl';
import { getLocale } from 'next-intl/server';
type Props = {
  params: Promise<{ name: string }>;
};
export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { name } = await params;
  const product: ProductType = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/by-name/${name}`, {
    cache: 'force-cache',
  }).then((res) => res.json());
  const title = `${product.name} - ${product.brand}`;
  const description = `Buy ${product.name} from ${product.brand}. Price: ${product.price.toFixed(
    2
  )} zł. Available in various colors: ${product.colors.map((color) => color.name).join(', ')}.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

const ProductPage = async ({
  params,
}: Readonly<{
  params: Promise<{ name: string }>;
}>) => {
  const locale = await getLocale();
  const { name } = await params;
  const product: ProductType = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/by-name/${name}`, {
    cache: 'force-cache',
  }).then((res) => res.json());

  return (
    <div className="mx-auto min-h-[calc(100vh-var(--header-height))]  flex justify-center items-start">
      <div className="container max-w-[1200px] pt-8">
        <div className="breadcrumbs text-sm mb-3">
          <ul>
            <li>
              <Link href="/store" className="text-xl font-[700]">
                Store
              </Link>
            </li>
            <li className="text-xl font-[600]">
              <Link href={`/store/?category=${product.category}`}>{product.category}</Link>
            </li>
            <li className="text-xl">{locale === 'pl' ? product.name : product.enName}</li>
          </ul>
        </div>
        <Product product={product} />
      </div>
    </div>
  );
};

export default ProductPage;
