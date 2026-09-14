import ShopApp from "../../../../components/ShopApp";

export async function generateMetadata({ params }) {
  const name = decodeURIComponent(params.name);
  return {
    title: `${name} — купить`,
    description: `${name}: широкий выбор, доступные цены, доставка по России. Интернет-магазин SnegoRider.`,
    keywords: `${name}, купить ${name.toLowerCase()}, SnegoRider, снегоходы, мотоциклы`,
  };
}

export default function CategoryPage() {
  return <ShopApp />;
}
