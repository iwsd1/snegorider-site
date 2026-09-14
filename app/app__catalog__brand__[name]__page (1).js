import ShopApp from "../../../../components/ShopApp";

export async function generateMetadata({ params }) {
  const name = decodeURIComponent(params.name);
  return {
    title: `${name} — каталог товаров бренда`,
    description: `Товары бренда ${name}: широкий выбор, доступные цены, доставка по России. Интернет-магазин SnegoRider.`,
  };
}

export default function BrandPage() {
  return <ShopApp />;
}
