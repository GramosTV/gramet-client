import Link from 'next/link';
import Head from 'next/head';
import Product from '@/app/components/Product';
import { Product as ProductType } from '@/app/common';

const ProductPage = async ({
  params,
}: Readonly<{
  params: Promise<{ name: string }>;
}>) => {
  await new Promise((_, reject) => setTimeout(() => reject(new Error('An error occurred after 5 seconds')), 5000));

  const { name } = await params;
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/by-name/${name}`, {cache: 'force-cache'})
  const product: ProductType = await data.json()
  return (
    <>
    <Head>
      <title>{product.name} - {product.brand}</title>
      <meta name="description" content={`Buy ${product.name} from ${product.brand}. Price: ${product.price.toFixed(2)} zł. Available in various colors: ${product.colors.map(color => color.name).join(', ')}.`} />
      <meta property="og:title" content={`${product.name} - ${product.brand}`} />
      <meta property="og:description" content={`Buy ${product.name} from ${product.brand}. Price: ${product.price.toFixed(2)} zł. Available in various colors: ${product.colors.map(color => color.name).join(', ')}.`} />
      <meta property="og:image" content={`product:image/png;base64,${product.images[0]}`} />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
    <div className="mx-auto min-h-[calc(100vh-var(--header-height))] bg-gray-100 flex justify-center items-start">
      <div className="container max-w-[1100px] pt-8">
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
            <li className="text-xl">{product.name}</li>
          </ul>
        </div>
        <Product product={product}/>
      </div>
    </div>
    </>
  );
};

export default ProductPage;
