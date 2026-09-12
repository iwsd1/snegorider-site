import ShopApp from "../../../../components/ShopApp";

export async function generateMetadata({ params }) {
  const name = decodeURIComponent(params.name);
  return {
    title: `${name} — купить`,
    description: `${name}: широкий выбор, доступные цены, доставка по России. Интернет-магазин SnegoRider.`,
  };
}

export default function CategoryPage() {
  return <ShopApp />;
}
