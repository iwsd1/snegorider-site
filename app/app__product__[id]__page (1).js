import ShopApp from "../../../components/ShopApp";
import { findCatalogItemByUrlId, rub } from "../../../lib/products";

export async function generateMetadata({ params }) {
  const item = findCatalogItemByUrlId(params.id);
  if (!item) {
    return { title: "Товар не найден" };
  }
  const title = `${item.name} купить — ${item.brand}`;
  const description = `${item.name} — ${item.brand}, ${item.category.toLowerCase()}. Цена ${rub(item.price)}. Доставка по России.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: item.image ? [item.image] : [],
    },
  };
}

export default function ProductPage() {
  return <ShopApp />;
}
