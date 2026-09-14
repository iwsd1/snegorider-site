import ShopApp from "../../../components/ShopApp";
import { findCatalogItemByUrlId, rub } from "../../../lib/products";

function extractArticle(name) {
  const m = name.match(/\(([A-Za-z0-9._/-]{4,})\)\s*$/);
  return m ? m[1] : null;
}

export async function generateMetadata({ params }) {
  const item = findCatalogItemByUrlId(params.id);
  if (!item) {
    return { title: "Товар не найден" };
  }
  const title = `${item.name} купить — ${item.brand}`;
  const description = `${item.name} — ${item.brand}, ${item.category.toLowerCase()}. Цена ${rub(item.price)}. Доставка по России.`;

  const article = !item.isGroup ? extractArticle(item.name) : null;
  const keywordParts = [item.name, item.brand, item.category, "SnegoRider", "купить", "цена"];
  if (article) keywordParts.push(article);

  return {
    title,
    description,
    keywords: keywordParts.join(", "),
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
