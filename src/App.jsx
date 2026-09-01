import React, { useState, useMemo } from "react";

/* ============ Design tokens ============ */
const T = {
  bg: "#14181C",
  panel: "#1B2126",
  panel2: "#20272E",
  text: "#EDEFF2",
  dim: "#9AA5AD",
  border: "#2C343B",
  orange: "#FF8A1E",
  orangeDim: "#B84E14",
  ice: "#4FA8D8",
};

const LOGO_URI = "data:image/jpeg;base64,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";
/* ============ Icons (inline SVG, per category) ============ */
const Icon = ({ name, color = T.ice, size = 34 }) => {
  const common = { width: size, height: size, viewBox: "0 0 48 48", fill: "none", stroke: color, strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "track":
      return (
        <svg {...common}>
          <rect x="6" y="16" width="36" height="16" rx="8" />
          <circle cx="14" cy="24" r="2.2" fill={color} stroke="none" />
          <circle cx="24" cy="24" r="2.2" fill={color} stroke="none" />
          <circle cx="34" cy="24" r="2.2" fill={color} stroke="none" />
        </svg>
      );
    case "belt":
      return (
        <svg {...common}>
          <circle cx="16" cy="24" r="8" />
          <circle cx="34" cy="16" r="5" />
          <path d="M20 18 L30 12 M20 30 L30 20" />
        </svg>
      );
    case "ski":
      return (
        <svg {...common}>
          <path d="M8 32 Q10 14 20 12 L38 12 Q40 12 40 16 L40 30 Q40 32 38 32 Z" />
          <path d="M14 32 L14 38 M32 32 L32 38" />
        </svg>
      );
    case "filter":
      return (
        <svg {...common}>
          <path d="M24 6 L24 20 M17 13 L24 20 L31 13" />
          <rect x="14" y="20" width="20" height="18" rx="2" />
          <path d="M18 26 L30 26 M18 31 L30 31" />
        </svg>
      );
    case "helmet":
      return (
        <svg {...common}>
          <path d="M8 30 Q8 10 24 10 Q40 10 40 30 L40 32 L8 32 Z" />
          <path d="M8 30 L4 30 M40 30 L44 30" />
          <path d="M16 32 Q16 24 24 24 Q32 24 32 32" />
        </svg>
      );
    case "jacket":
      return (
        <svg {...common}>
          <path d="M16 8 L12 12 L12 38 L36 38 L36 12 L32 8 L24 12 Z" />
          <path d="M24 12 L24 38 M12 18 L6 22 L6 30 M36 18 L42 22 L42 30" />
        </svg>
      );
    case "glove":
      return (
        <svg {...common}>
          <path d="M18 40 L18 20 Q18 16 21 16 Q24 16 24 20 L24 12 Q24 9 27 9 Q30 9 30 12 L30 20 Q30 16 33 16 Q36 16 36 20 L36 32 Q36 40 28 40 Z" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M24 6 L38 12 L38 22 Q38 34 24 42 Q10 34 10 22 L10 12 Z" />
          <path d="M18 24 L22 28 L30 18" />
        </svg>
      );
    case "boot":
      return (
        <svg {...common}>
          <path d="M18 8 L18 26 L10 30 Q6 32 6 36 L6 38 L38 38 L38 32 Q38 28 33 26 L26 22 L26 8 Z" />
          <path d="M18 14 L26 14 M18 19 L26 19" />
        </svg>
      );
    case "cog":
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="7" />
          <path d="M24 10 L24 15 M24 33 L24 38 M10 24 L15 24 M33 24 L38 24 M14 14 L17.5 17.5 M30.5 30.5 L34 34 M34 14 L30.5 17.5 M17.5 30.5 L14 34" />
        </svg>
      );
    default:
      return null;
  }
};

/* ============ Catalog data ============ */
const PRODUCTS = [
  { id: 1, name: "Линза 509 Kingpin с подогревом: Clear", category: "Линзы и визоры", brand: "509", price: 19000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-e/12243868214.jpg", description: "Цвет: Clear (с подогревом). Характеристики без упаковки: Вес 75г, размер 180x90x15 мм. Подогрев." },
  { id: 2, name: "Линза 509 Sinister X5 Tear Off: Yellow Tint", category: "Линзы и визоры", brand: "509", price: 10000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-i/12243872970.jpg", description: "Цвет: Yellow Tint. Характеристики без упаковки: Вес 50г, размер 185x95x10 мм. Поддержка Tear-off." },
  { id: 3, name: "Линза 509 Sinister X5 Tear Off: Chrome Mirror/Yellow Tint", category: "Линзы и визоры", brand: "509", price: 10000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-d/12243873973.jpg", description: "Цвет: Chrome Mirror/Yellow Tint. Характеристики без упаковки: Вес 50г, размер 185x95x10 мм. С поддержкой Tear-off." },
  { id: 4, name: "Линза 509 Sinister X6 ignite: Photochromatic Clear to Blue", category: "Линзы и визоры", brand: "509", price: 15200, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-s/12243872584.jpg", description: "Цвет: Photochromatic Clear to Blue. Характеристики без упаковки: Вес 80г, размер 190x100x15 мм. С подогревом." },
  { id: 5, name: "Линза 509 Kingpin с подогревом: Yellow HCS Tint", category: "Линзы и визоры", brand: "509", price: 19000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-k/12243870344.jpg", description: "Цвет: Yellow HCS (с подогревом). Характеристики без упаковки: Вес 75г, размер 180x90x15 мм. Технология HCS." },
  { id: 6, name: "Линза FXR Maverick Dual с подогр.: Blue", category: "Линзы и визоры", brand: "FXR", price: 20000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-q/12243869486.jpg", description: "Цвет: Blue. Характеристики без упаковки: Вес 90г, размер 195x100x15 мм. С подогревом." },
  { id: 7, name: "Линза 509 Kingpin, Взрослые: Orange Tint", category: "Линзы и визоры", brand: "509", price: 10000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-e/12243867782.jpg", description: "Цвет: Orange Tint. Характеристики без упаковки: Вес 60г, размер 180x90x10 мм. Контрастная линза." },
  { id: 8, name: "Линза 509 Sinister X5 Взрослые: фотохром, Clear to Blue", category: "Линзы и визоры", brand: "509", price: 10000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-9/12243872457.jpg", description: "Цвет: Clear to Blue. Характеристики без упаковки: Вес 55г, размер 185x95x10 мм. Фотохромная линза." },
  { id: 9, name: "Линза 509 Revolver Trail Взрослые: Yellow Tint", category: "Линзы и визоры", brand: "509", price: 10000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-n/12243872795.jpg", description: "Цвет: Yellow Tint. Характеристики без упаковки: Вес 50г, размер 180x90x10 мм. Трейловая линза." },
  { id: 10, name: "Линза 509 Sinister X5 Взрослые: Orange Mirror/Yellow Tint", category: "Линзы и визоры", brand: "509", price: 10000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-q/12243869018.jpg", description: "Цвет: Orange Mirror/Yellow Tint. Характеристики без упаковки: Вес 50г, размер 185x95x10 мм. Зеркальная." },
  { id: 11, name: "Линза 509 Revolver Trail Взрослые: Photochromatic Clear to Blue", category: "Линзы и визоры", brand: "509", price: 10000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-v/12243870823.jpg", description: "Цвет: Photochromatic Clear to Blue. Характеристики без упаковки: Вес 55г, размер 180x90x10 мм. Фотохром." },
  { id: 12, name: "Линза 509 Sinister X5 Взрослые: Blue Mirror/Orange Tint", category: "Линзы и визоры", brand: "509", price: 10000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-w/12243870140.jpg", description: "Цвет: Blue Mirror/Orange Tint. Характеристики без упаковки: Вес 50г, размер 185x95x10 мм. Антибликовая." },
  { id: 13, name: "Линза 509 Kingpin, Взрослые: Yellow Tint", category: "Линзы и визоры", brand: "509", price: 10000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-o/12243872436.jpg", description: "Цвет: Yellow Tint. Характеристики без упаковки: Вес 60г, размер 180x90x10 мм. Универсальная сменная линза." },
  { id: 14, name: "Леггинсы EVS Tug 3/4 Impact утепленнные (Black L)", category: "Защита тела", brand: "EVS", price: 16538, icon: "shield", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-r/6495907983.jpg", description: "Высококачественный мотоштаны от бренда EVS, модель Леггинсы  Tug 3/4 Impact утепленнные (Black L). Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: L. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 15, name: "Шорты защитные EVS Tug Усиленнные (Black M)", category: "Защита тела", brand: "EVS", price: 15000, icon: "shield", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-e/12496490942.jpg", description: "Высококачественный мотозащита от бренда EVS, модель Шорты защитные  Tug  Усиленнные (Black M). Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: M. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 16, name: "Шорты защитные EVS Tug Усиленнные (Black S)", category: "Защита тела", brand: "EVS", price: 15000, icon: "shield", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-e/12496490942.jpg", description: "Высококачественный мотозащита от бренда EVS, модель Шорты защитные  Tug  Усиленнные (Black S). Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: S. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 17, name: "Леггинсы EVS Tug 3/4 Impact (Black L)", category: "Защита тела", brand: "EVS", price: 25000, icon: "shield", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-h/7768672901.jpg", description: "Высококачественный мотоштаны от бренда EVS, модель Леггинсы  Tug 3/4 Impact (Black L). Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: L. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 18, name: "Ботинки FXR Octane, с утеплителем, подростки унисекс (Black/Orange/Char, 2/33)", category: "Обувь", brand: "FXR", price: 20000, icon: "boot", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-r/12534417819.jpg", description: "Высококачественный мотоботы от бренда FXR, модель Ботинки  Octane. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 19, name: "Перчатки FXR COLD CROSS ,без утеплителя (Black Red M)", category: "Перчатки", brand: "FXR", price: 20000, icon: "glove", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-n/12496496063.jpg", description: "Высококачественный мотоперчатки от бренда FXR, модель Перчатки  COLD CROSS. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: M. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 20, name: "Куртка FXR Force Dual Laminate. (Asphalt XL)", category: "Куртки", brand: "FXR", price: 50000, icon: "jacket", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-t/12496493693.jpg", description: "Высококачественный мотокуртки от бренда FXR, модель Куртка  Force Dual Laminate. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: XL. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 21, name: "Шлем 509 Delta V Carbon Commander Helmet (Black/Gold .LG)", category: "Шлемы", brand: "509", price: 300000, icon: "helmet", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-n/12534235583.jpg", description: "Высококачественный шлемы для мототехники от бренда 509, модель Шлем  Delta V Carbon Commander Helmet (Black/Gold. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 22, name: "Шорты защитные EVS Tug Усиленнные (Black L)", category: "Защита тела", brand: "EVS", price: 15000, icon: "shield", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-e/12496490942.jpg", description: "Высококачественный мотозащита от бренда EVS, модель Шорты защитные  Tug  Усиленнные (Black L). Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: L. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 23, name: "Шорты защитные EVS Tug Усиленнные (Black XL)", category: "Защита тела", brand: "EVS", price: 15000, icon: "shield", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-e/12496490942.jpg", description: "Высококачественный мотозащита от бренда EVS, модель Шорты защитные  Tug  Усиленнные (Black XL). Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: XL. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 24, name: "Сумка Ogio Head для шлема (Stealth)", category: "Шлемы", brand: "OGIO", price: 35000, icon: "helmet", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-o/12534115776.jpg", description: "Высококачественный шлемы для мототехники от бренда Другое, модель Сумка Ogio Head для шлема (Stealth). Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 25, name: "Перчатки FXR boost без утеплителя (Hi-Vis,S)", category: "Перчатки", brand: "FXR", price: 20000, icon: "glove", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-j/12496501459.jpg", description: "Высококачественный мотоперчатки от бренда FXR, модель Перчатки  boost без утеплителя (Hi-Vis. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: S. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 26, name: "Куртка FXR RRX с утеплителем (Black/Red, L)", category: "Куртки", brand: "FXR", price: 58692, icon: "jacket", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-l/12530763957.jpg", description: "Высококачественный мотокуртки от бренда FXR, модель Куртка  RRX с утеплителем (Black/Red. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: L. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 27, name: "Шлем FXR Blade 2.0 Carbon Race Div, взрослые ( hi-Vis/Navy/Blue ,S)", category: "Шлемы", brand: "FXR", price: 75000, icon: "helmet", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-x/12533663589.jpg", description: "Высококачественный шлемы для мототехники от бренда FXR, модель Шлем  Blade 2. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: S. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 28, name: "Шлем 509 Atmosphere Helmet буз подогрева (Flamin Hot, XL)", category: "Шлемы", brand: "509", price: 75000, icon: "helmet", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-4/12533131408.jpg", description: "Высококачественный шлемы для мототехники от бренда 509, модель Шлем  Atmosphere Helmet буз подогрева (Flamin Hot. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: XL. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 29, name: "Защита тела (M) SIXS KIT PRO TS10 с протектором", category: "Защита тела", brand: "SIXS", price: 50000, icon: "shield", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-w/12496499636.jpg", description: "Высококачественный мотозащита от бренда SIXS, модель Защита тела (M)  KIT PRO TS10 с протектором. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 30, name: "Шорты защитные EVS Tug Impact (Black XXL)", category: "Защита тела", brand: "EVS", price: 15000, icon: "shield", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-r/6495907983.jpg", description: "Высококачественный мотозащита от бренда EVS, модель Шорты защитные  Tug  Impact (Black XXL). Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: XXL. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 31, name: "Ботинки FXR Boost, дети, унисекс (Black /Fuchsia , 34)", category: "Обувь", brand: "FXR", price: 20000, icon: "boot", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-j/12532804543.jpg", description: "Высококачественный мотоботы от бренда FXR, модель Ботинки  Boost. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 32, name: "Перчатки FXR BLACK OPS ,без утеплителя (Black XL)", category: "Перчатки", brand: "FXR", price: 20000, icon: "glove", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-5/8526613325.jpg", description: "Высококачественный мотоперчатки от бренда FXR, модель Перчатки  BLACK OPS. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: XL. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 33, name: "Ботинки FXR Octane, дети, унисекс (Black /Fuchsia ,4/35)", category: "Обувь", brand: "FXR", price: 20000, icon: "boot", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-l/12532610109.jpg", description: "Высококачественный ботинки от бренда FXR, модель Ботинки Octane. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 34, name: "Леггинсы защитн. SIXS KIT PRO PNX Black XL с протектором", category: "Защита тела", brand: "SIXS", price: 25000, icon: "shield", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-x/12496499529.jpg", description: "Высококачественный мотоштаны от бренда SIXS, модель Леггинсы защитн. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 35, name: "Куртка FXR Cold Cross RR с утеплителем (Black/Orange/Purple, L)", category: "Куртки", brand: "FXR", price: 80000, icon: "jacket", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-c/12496493856.jpg", description: "Высококачественный мотокуртки от бренда FXR, модель Куртка  Cold Cross RR с утеплителем (Black/Orange/Purple. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: L. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 36, name: "Жилет защитный EVS Sport (BLACK/2XL)", category: "Защита тела", brand: "EVS", price: 50000, icon: "shield", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-8/12536071388.jpg", description: "Высококачественный мотозащита от бренда EVS, модель Жилет защитный  Sport (BLACK/2XL). Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 37, name: "Защита тела SIXS KIT PRO TS10 с протектором (Black, XL)", category: "Защита тела", brand: "SIXS", price: 50000, icon: "shield", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-w/12496499636.jpg", description: "Высококачественный мотозащита от бренда SIXS, модель Защита тела  KIT PRO TS10 с протектором (Black. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: XL. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 38, name: "Джерси защитная EVS Ballistic G7 , (Black, XX LARGE)", category: "Одежда", brand: "EVS", price: 50000, icon: "jacket", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-t/12535986377.jpg", description: "Высококачественный мотозащита от бренда EVS, модель Джерси защитная  Ballistic G7. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 39, name: "Защита спины SIXS KIT PRO с протектором(BlackYellov, OS)", category: "Защита тела", brand: "SIXS", price: 20000, icon: "shield", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-r/12496501683.jpg", description: "Высококачественный мотозащита от бренда SIXS, модель Защита спины KIT PRO с протектором (BlackYellow). Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 40, name: "Ботинки FXR Octane, дети, унисекс (Black /Hi Vis /Char , 3/34)", category: "Обувь", brand: "FXR", price: 20000, icon: "boot", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-g/7857117376.jpg", description: "Высококачественный мотоботы от бренда FXR, модель Ботинки  Octane. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 41, name: "Леггинсы EVS Tug 3/4 Impact утепленнные (Black M)", category: "Защита тела", brand: "EVS", price: 25000, icon: "shield", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-h/7768672901.jpg", description: "Высококачественный мотоштаны от бренда EVS, модель Леггинсы  Tug 3/4 Impact утепленнные (Black M). Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: M. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 42, name: "Жилет защитный EVS Roost F2 (Black, X-Large)", category: "Защита тела", brand: "EVS", price: 50000, icon: "shield", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-t/12496495205.jpg", description: "Высококачественный мотозащита от бренда EVS, модель Жилет защитный  Roost F2 (Black. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 43, name: "Леггинсы EVS Tug 3/4 Impact (Black M)", category: "Защита тела", brand: "EVS", price: 25000, icon: "shield", tag: "В наличии", image: "https://ir.ozone.ru/s3/multimedia-tmp-d/item-pic-beec448fb0faaf9eaa134447489ac47f.jpg", description: "Высококачественный мотоштаны от бренда EVS, модель Леггинсы  Tug 3/4 Impact (Black M). Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: M. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 44, name: "Перчатки FXR Cold Cross Mechanics (Black, 2XL)", category: "Перчатки", brand: "FXR", price: 20000, icon: "glove", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-j/12496496347.jpg", description: "Высококачественный мотоперчатки от бренда FXR, модель Перчатки  Cold Cross  Mechanics (Black. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 45, name: "Леггинсы защитн. SIXS KIT PRO PNX Black L с протектором", category: "Защита тела", brand: "SIXS", price: 25000, icon: "shield", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-c/7400300124.jpg", description: "Высококачественный мотоштаны от бренда SIXS, модель Леггинсы защитн. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 46, name: "Шлем 509 Delta V Carbon подогревом(Racing Red ,MD)", category: "Шлемы", brand: "509", price: 200000, icon: "helmet", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-q/7190737946.jpg", description: "Высококачественный шлемы для мототехники от бренда 509, модель Шлем  Delta V Carbon подогревом(Racing Red. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 47, name: "Шлем FXR Clutch Evo LE (Magma L)", category: "Шлемы", brand: "FXR", price: 75000, icon: "helmet", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-z/12531046463.jpg", description: "Высококачественный шлемы для мототехники от бренда FXR, модель Шлем  Clutch Evo LE (Magma L). Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: L. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 48, name: "Детская Куртка FXR Helium с утеплителем. (Black/Raspberry Fade /Hi-Vis 16)", category: "Куртки", brand: "FXR", price: 80000, icon: "jacket", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-6/12530938830.jpg", description: "Высококачественный мотокуртки от бренда FXR, модель Детская Куртка  Helium  с утеплителем. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 49, name: "Куртка FXR RRX с утеплителем (Black/Red, 2XL)", category: "Куртки", brand: "FXR", price: 80000, icon: "jacket", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-l/12530763957.jpg", description: "Высококачественный мотокуртки от бренда FXR, модель Куртка  RRX с утеплителем (Black/Red. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 50, name: "Фара для Ski Doo Gen4", category: "Запчасти", brand: "Ski-Doo BRP", price: 110000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-s/7338882340.jpg", description: "<p>Фара для снегохода Ski Doo Gen4 – надежное освещение для сложных условий!</p><p>Эта оригинальная фара разработана специально для моделей Ski Doo Gen4, обеспечивает мощный поток света даже в условиях низкой видимости. Прочный корпус выдерживает экстремальные температуры и механические нагрузки, гарантируя длительный срок эксплуатации. Легкая конструкция идеально интегрируется в шасси техники, не требует дополнительных доработок.</p><p>Специальное покрытие защитит устройство от загрязнений и влаги, сохранив высокие оптические свойства. Компактная форма позволяет легко поместить деталь в стандартную упаковку, удобную для хранения и перевозки. Выбирайте проверенный комплектующий для максимальной безопасности на трассе!</p>" },
  { id: 51, name: "Сумка на сиденье Linq для Ski Doo gen4", category: "Сумки и аксессуары", brand: "Ski-Doo BRP", price: 30000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-g/12572077300.jpg", description: "<p>Прочная сумка на сиденье Linq для Ski Doo Gen4</p><p>Эргономическая конструкция обеспечивает надёжное крепление к сидению снегохода, гарантируя защиту ваших вещей даже на высоких скоростях. Прочный полиэстер выдерживает нагрузки и неблагоприятные условия эксплуатации.</p><p>Компактная форма позволяет легко поместить необходимые предметы (ключи, документы, перчатки) в зоне быстрого доступа. Легкая конструкция не создаёт дискомфорта при длительной поездке.</p><p>Отличный выбор для любителей активного отдыха!</p>" },
  { id: 52, name: "Куртка Klim BlackHawk Parka MD Orange", category: "Куртки", brand: "Klim", price: 95000, icon: "jacket", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-m/12572411782.jpg", description: "<p>Мужская куртка Klim BlackHawk Parka MD Orange сочетает современный дизайн и надежную защиту. Модель оснащена капюшоном для дополнительного комфорта в холодную погоду, а регулировка по низу рукавов обеспечивает плотное прилегание и минимизирует проникновение холода. Передняя молния позволяет быстро одеваться и снимать куртку, сохраняя при этом герметичность шва.</p><p>Яркий оранжевый цвет делает вещь заметной в любой обстановке, добавляя образу энергии и уверенности.</p><p>Просторный крой и продуманная конструкция обеспечивают свободу движений, идеально подходя для активного отдыха или повседневного использования. Эта куртка станет универсальным выбором для тех, кто ценит сочетание функциональности и стиля.</p>" },
  { id: 53, name: "Бипер лавинный BCA Tracker S", category: "Снаряжение для туризма", brand: "BCA", price: 90000, icon: "shield", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-f/12572605995.jpg", description: "<p>Лавинный бипер BCA Tracker S – ваш надёжный помощник в экстремальных условиях!</p><p>Устройство быстро определяет сигнальные импульсы даже в сложных ситуациях, обеспечивая высокую точность локации. Компактный корпус легко помещается в рюкзак, а продуманная эргономика позволяет работать без потери времени. Автономная работа устройства гарантирует готовность к использованию в любых условиях.</p><p>Интуитивный интерфейс минимизирует риск ошибок во время спасения. Долговечный аккумулятор дарит уверенность в каждом путешествии.</p><p>BCA Tracker S сочетает современные технологии и практичность, становясь незаменимым элементом оснащения горнолыжников и снежных трассировщиков.</p>" },
  { id: 54, name: "Эмблема 509 Chrome 509", category: "Аксессуары", brand: "509", price: 4500, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-9/12576227877.jpg", description: "Эмблема 509 Chrome<br/><br/>Оригинальная хромированная эмблема от бренда 509 для кастомизации вашей экипировки. Идеально подходит для шлема, снегоходного комбинезона, шапки или футболки.<br/><br/>Особенности:<ul><li>Стиль: Эффектное и долговечное хромированное покрытие.</li><li>Универсальность: Легко крепится на ткань и жесткие поверхности.</li></ul>Характеристики:<ul><li>Бренд / Модель: 509 / Chrome 509</li><li>Артикул: 509-EMB-CHR</li><li>Вес: 0,05 кг</li><li>Габариты упаковки (Д×Ш×В): 15 × 12,5 × 0,5 см</li><li>Объем: 0,00009 м³</li></ul>" },
  { id: 55, name: "Визор FXR Clutch X С подогр. (Smoke,OS)", category: "Линзы и визоры", brand: "FXR", price: 30000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-a/12638565190.jpg", description: "<p>FXR Clutch X – стильный аксессуар с технологиями будущего!</p><p>Элегантный визор FXR сочетает современный дизайн и инновационные решения. Благодаря системе подогрева обеспечивается комфорт даже в прохладное время года, а мягкий свет от встроенных диодов создаст незабываемую атмосферу вечернего образа. Компактная конструкция легко помещается в сумочку, сохраняя порядок и практичность.</p><p>Подходит как девушкам, так и юношам благодаря универсальному оформлению. Выбирайте FXR Clutch X – воплощение моды и технологии в одном изделии.идеально дополняет повседневный гардероб или становится хитовым акцентом на мероприятии.*</p>" },
  { id: 56, name: "Пила складная Silky Gomboy 300mm", category: "Инструменты", brand: "Silky", price: 16000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-b/7596438131.jpg", description: "Silky Gomboy 300 - это прочная многоцелевая складная пила. Отлично пилит в поперечном и продольном направлении, а также по диагонали. Идеально подходит как для обрезки, так и для резки сухой, твердой древесины.<br/><br/>Лезвие пилы имеет конусную форму, которая позволяет свести к минимуму трение при пилении, а также сделать зуб пилы без разводки, за счет этого обеспечивается более тонкий распил и возможность прилагать меньше усилий при пилении.<br/><br/>Резиновая ручка Gomboy обеспечивает безопасный и удобный захват. Лезвие легко и надежно фиксируется в двух положениях пиления. В сложенном состоянии зубцы Gomboy полностью скрыты в ручке.<br/><br/>Технические характеристик:<br/><br/>• Страна бренда: Япония;<br/><br/>• Длина полотна: 300 мм;<br/><br/>• Толщина полотна: 1,3 мм;<br/><br/>• Длина в сложенном состоянии: 335 х 65 х 20 мм;<br/><br/>• Длина в рабочем состоянии: 620 х 80 х 20 мм;<br/><br/>• Шаг зубьев: 6 зубьев на 30 мм полотна пилы;<br/><br/>• Вес: 370 г.<br/><br/>Silky предлагает разные конфигурации зубьев — от очень мелких до очень крупных. Информация о конфигурации указана на лезвии рядом с длиной.<br/><br/>- Крупный и очень крупный шаг (4–8 зубьев на 30 мм):<br/><br/>Агрессивный, быстрый рез. Подходит для свежей, сырой древесины с высокой влажностью. Extra Large — для тяжёлых задач: валка, толстые ветки. В сухой древесине может вызывать вибрации и плохо цепляться.<br/><br/>- Средний шаг (10 зубьев на 30 мм):<br/><br/>Универсальный вариант. Эффективен как на сухой, так и на свежей древесине.<br/><br/>- Мелкий и очень мелкий шаг (13–32 зуба на 30 мм):<br/><br/>Предназначен для сухой твёрдой древесины, например дуба или яблони. Extra Fine (26–32 зуба) — выбор столяров, мебельщиков, мастеров инструментов. В сырой древесине быстро забиваются опилками." },
  { id: 57, name: "Пила складная Silky Gomboy 240mm", category: "Инструменты", brand: "Silky", price: 15000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-v/7596347755.jpg", description: "Silky Gomboy 240 - это прочная многоцелевая складная пила. Отлично пилит в поперечном и продольном направлении, а также по диагонали. Идеально подходит как для обрезки, так и для резки сухой, твердой древесины.<br/><br/>Лезвие пилы имеет конусную форму, которая позволяет свести к минимуму трение при пилении, а также сделать зуб пилы без разводки, за счет этого обеспечивается более тонкий распил и возможность прилагать меньше усилий при пилении.<br/><br/>Легкая и прочная стальная рукоять пилы с прорезиненной противоскользящей поверхностью, имеет фиксатор лезвия в двух рабочих положениях.<br/><br/>Полотно пилы имеет зонную закалку, закалена только зона зубьев для более долгого срока службы и поддержания остроты, само полотно не закалено, обеспечивая при этом гибкость, но не хрупкость.<br/><br/>Технические характеристики:<br/><br/>• Страна бренда: Япония;<br/><br/>• Длина полотна: 240 мм;<br/><br/>• Толщина полотна: 1,3 мм;<br/><br/>• Длина в сложенном состоянии: 270 х 60 х 20 мм;<br/><br/>• Длина в рабочем состоянии: 505 х 60 х 20 мм;<br/><br/>• Шаг зубьев: 10 зубьев на 30 мм полотна пилы;<br/><br/>• Материал рукояти пилы: прорезиненная;<br/><br/>• Вес: 265 г.<br/><br/>Silky предлагает разные конфигурации зубьев — от очень мелких до очень крупных. Информация о конфигурации указана на лезвии рядом с длиной.<br/><br/>- Крупный и очень крупный шаг (4–8 зубьев на 30 мм):<br/><br/>Агрессивный, быстрый рез. Подходит для свежей, сырой древесины с высокой влажностью. Extra Large — для тяжёлых задач: валка, толстые ветки. В сухой древесине может вызывать вибрации и плохо цепляться.<br/><br/>- Средний шаг (10 зубьев на 30 мм):<br/><br/>Универсальный вариант. Эффективен как на сухой, так и на свежей древесине.<br/><br/>- Мелкий и очень мелкий шаг (13–32 зуба на 30 мм):<br/><br/>Предназначен для сухой твёрдой древесины, например дуба или яблони. Extra Fine (26–32 зуба) — выбор столяров, мебельщиков, мастеров инструментов. В сырой древесине быстро забиваются опилками." },
  { id: 58, name: "Сумка органайзер Ogio MX 450", category: "Сумки и аксессуары", brand: "OGIO", price: 20000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-7/6338597899.jpg", description: "Поясная сумка OGIO MX 450 Tool Pack предназначена для перевозки инструментов и мелкого ремонтного снаряжения во время поездок на мотоцикле, квадроцикле или эндуро. Модель помогает держать основные инструменты под рукой и быть готовым к мелкому ремонту в дороге.<br/><br/>Откидной передний органайзер позволяет удобно разместить инструмент. Боковой карман с водостойкой молнией подходит для мелких предметов, а расширяемый держатель с фиксирующей стяжкой можно использовать для бутылки. Отдельное отделение предусмотрено для запасной камеры.<br/><br/>Мягкие накладки в зоне бедер повышают комфорт при длительном ношении. Регулируемый мягкий пояс помогает настроить посадку и надежно зафиксировать сумку во время движения.<br/><br/>Характеристики:<br/><br/>• Назначение — поясная сумка для инструментов; • Модель — MX 450 Tool Pack; • Объем — 10 л; • Размер — 10 × 66 × 15 см; • Вес — 0,6 кг; • Материал — 840 dobby poly и 420D dobby poly; • Основное отделение — для инструментов и ремонтного снаряжения; • Передний органайзер — откидной, для инструментов; • Боковой карман — с водостойкой молнией; • Держатель — расширяемый, для бутылки; • Отделение — для запасной камеры; • Крепления — внешние D-кольца для T-образных ключей; • Комфорт — мягкие накладки в зоне бедер; • Пояс — регулируемый, с мягкими накладками; • Рекомендованное использование — мотоспорт и offroad-поездки." },
  { id: 59, name: "Бейсболка 509 Evo Hat (Midnight Grey)", category: "Головные уборы", brand: "509", price: 15000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-6/13953136362.jpg", description: "509 — головной убор из коллекции бренда." },
  { id: 60, name: "Бейсболка FXR Race Div (Char/Circuit, Plus)", category: "Головные уборы", brand: "FXR", price: 15000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-u/13953136782.jpg", description: "FXR — головной убор из коллекции бренда." },
  { id: 61, name: "Бейсболка 509 Five O Nine (Gray, OS)", category: "Головные уборы", brand: "509", price: 15000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-r/13953136887.jpg", description: "509 — головной убор из коллекции бренда." },
  { id: 62, name: "Бейсболка FXR UPF PRO Series", category: "Головные уборы", brand: "FXR", price: 15000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-j/13953137059.jpg", description: "FXR — головной убор из коллекции бренда." },
  { id: 63, name: "Бейсболка 509 Curved Brim CVT (Shadow Vis,", category: "Головные уборы", brand: "509", price: 15000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-v/13953137179.jpg", description: "509 — головной убор из коллекции бренда." },
  { id: 64, name: "Лонгслив FXR ProFlex UPF (Purple Camo/Black, S)", category: "Одежда", brand: "FXR", price: 17000, icon: "jacket", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-m/14178277750.jpg", description: "<p>Лонгслив FXR ProFlex UPF – стильное решение для активных женщин</p><p>- Защита от ультрафиолета благодаря технологии UPF обеспечивает комфорт даже на солнце</p><p>- Камуфляжный принт добавляет яркости образу и подходит к любому гардеробу</p><p>- Эластичная ткань ProFlex гарантирует свободу движений без потери формы</p><p>- Минималистичный логотип бренда FXR на груди подчеркивает качество и узнаваемость</p><p>- Универсальный крой позволяет носить как повседневную одежду или базовый слой для тренировок</p>" },
  { id: 65, name: "Ремень быстросьемный 509 sinister X6 (Black)", category: "Запчасти", brand: "509", price: 6000, icon: "belt", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-8/14178562316.jpg", description: "Короткий ремешок для крепления на шлем 509 Altitude 2.0 предназначен для крепления шлема.Сделанный из высококачественных материалов, короткий ремешок обеспечивает комфортное и надежное прилегание к шлему.Его регулируемый дизайн позволяет легко настроить его по нужному размеру, обеспечивая идеальную посадку на голову.В то же время, этот ремешок обеспечивает оптимальную вентиляцию и не оказывает давления на голову, что делает его идеальным вариантом для длительных поездок и активного использования." },
  { id: 66, name: "Крепления панелей верхнее Spi Ski-Doo", category: "Запчасти", brand: "SPI", price: 3000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-0/14426716536.jpg", description: "SPI — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 67, name: "Шаровая опора нижняя Polaris", category: "Запчасти", brand: "Polaris", price: 12500, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-a/6376113502.jpg", description: "Polaris — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 68, name: "Ремкомплект выпускных клапанов Sledex Polaris 800 15-20", category: "Запчасти", brand: "Sledex", price: 9750, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-k/7342036616.jpg", description: "Sledex — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 69, name: "Крышка маслобака Sledex Ski-Doo Gen4", category: "Запчасти", brand: "Sledex", price: 3500, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-2/6374949758.jpg", description: "Sledex — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 70, name: "Ремкомплект стартера SPI Starte S/M Ski-Doo", category: "Запчасти", brand: "SPI", price: 4700, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-d/9000296689.jpg", description: "SPI — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 71, name: "Лепестковый клапан Ski-Doo Spi", category: "Запчасти", brand: "SPI", price: 10950, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-w/9100927832.jpg", description: "SPI — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 72, name: "Подшипник КПП Polaris Следекс", category: "Запчасти", brand: "Sledex", price: 1250, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-5/6787217525.jpg", description: "Sledex — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 73, name: "Прокладка стальная на выпуск Ski-Doo G4", category: "Запчасти", brand: "Ski-Doo", price: 2500, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-d/7281187033.jpg", description: "Ski-Doo — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 74, name: "Рулевой наконечник Polaris", category: "Запчасти", brand: "Polaris", price: 9000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-0/14426480628.jpg", description: "Polaris — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 75, name: "Крышка топливного бака Ski-Doo/Arctic Cat", category: "Запчасти", brand: "Ski-Doo", price: 5000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-h/6837600797.jpg", description: "Ski-Doo — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 76, name: "Рукоятка Grip Ski-Doo", category: "Запчасти", brand: "Ski-Doo", price: 12750, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-n/14426438891.jpg", description: "Ski-Doo — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 77, name: "Сальники ролика гусеницы Ski-Doo", category: "Запчасти", brand: "Ski-Doo", price: 1575, icon: "track", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-9/14483979729.jpg", description: "Ski-Doo — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 78, name: "Крепление правое для пластика BRP", category: "Запчасти", brand: "BRP", price: 3750, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-5/14426331809.jpg", description: "BRP — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 79, name: "Склиз Ski-Doo Gen4", category: "Запчасти", brand: "Ski-Doo", price: 5625, icon: "track", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-2/14426294438.jpg", description: "Ski-Doo — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 80, name: "Вал ролика ведущего вариатора Sledex Ski-Doo", category: "Запчасти", brand: "Sledex", price: 4000, icon: "belt", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-r/7733789271.jpg", description: "Sledex — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 81, name: "Колодки тормозные Sledex Arctic Cat 600/800", category: "Запчасти", brand: "Sledex", price: 8000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-6/12785950554.jpg", description: "Sledex — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 82, name: "Защита шланга от перегиба Sledex Polaris", category: "Запчасти", brand: "Sledex", price: 1250, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-q/14426091134.jpg", description: "Sledex — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 83, name: "Тормозная ручка парковочная Ski-Doo Spi", category: "Запчасти", brand: "SPI", price: 5250, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-y/8039874382.jpg", description: "SPI — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 84, name: "Кнопка выключения двигателя Ski-Doo", category: "Запчасти", brand: "Ski-Doo", price: 9375, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-3/6374947635.jpg", description: "Ski-Doo — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 85, name: "Шестерня ведущая для коробки ременной TKI Polaris (27T)", category: "Запчасти", brand: "Polaris", price: 25000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-7/14425970443.jpg", description: "Polaris — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 86, name: "Блокировка T-Motion BRP Ski-Doo Summit Gen4", category: "Запчасти", brand: "BRP", price: 4000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-2/14425901606.jpg", description: "BRP — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 87, name: "Крепление пластика Sledex Ski-Doo", category: "Запчасти", brand: "Sledex", price: 2500, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-c/7281182460.jpg", description: "Sledex — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 88, name: "Пружина вариатора ведущего Ski-Doo Summit", category: "Запчасти", brand: "Ski-Doo", price: 9375, icon: "belt", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-s/14425849684.jpg", description: "Ski-Doo — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 89, name: "Ремкомплект выпускных клапанов Sledex Polaris 850 19-20", category: "Запчасти", brand: "Sledex", price: 10000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-5/8034822257.jpg", description: "Sledex — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 90, name: "Консоль Ski-Doo Эксперт, Крышка под кнопки Ski-Doo Эксперт", category: "Запчасти", brand: "Ski-Doo", price: 7825, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-4/14483291980.jpg", description: "Ski-Doo — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 91, name: "Рукоятка Grip Ski-Doo ODI Ruffian 8, оранж.", category: "Запчасти", brand: "ODI", price: 7825, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-5/14425698425.jpg", description: "ODI — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 92, name: "Обогрев курка газа Sledex", category: "Запчасти", brand: "Sledex", price: 6000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-z/14425655579.jpg", description: "Sledex — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 93, name: "Втулка вариатора Ski-Doo Следекс", category: "Запчасти", brand: "Sledex", price: 4375, icon: "belt", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-w/7733868260.jpg", description: "Sledex — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 94, name: "Ремкомплект вариатора Ski-Doo 850 Следекс", category: "Запчасти", brand: "Sledex", price: 48450, icon: "belt", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-m/14425636270.jpg", description: "Sledex — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 95, name: "Крышка топливного/масляного бака Ski-Doo Sledex", category: "Запчасти", brand: "Sledex", price: 3000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1/6837601141.jpg", description: "Sledex — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 96, name: "Датчик стоп-сигнала SPI Ski-Doo", category: "Запчасти", brand: "SPI", price: 4700, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-k/14483338688.jpg", description: "SPI — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 97, name: "Ремкомплект главного тормозного цилиндра Ski-Doo G4", category: "Запчасти", brand: "Ski-Doo", price: 7000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-m/6512488462.jpg", description: "Ski-Doo — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 98, name: "Комплект проводов для розеток Ski-Doo", category: "Запчасти", brand: "Ski-Doo", price: 4500, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-u/14425500270.jpg", description: "Ski-Doo — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
];

const CATEGORY_ORDER = [
  "Запчасти", "Линзы и визоры", "Маски и очки", "Шлемы", "Куртки", "Одежда",
  "Перчатки", "Обувь", "Защита тела", "Головные уборы", "Сумки и аксессуары",
  "Снаряжение для туризма", "Инструменты", "Аксессуары",
];
const CATEGORIES = CATEGORY_ORDER.filter((c) => PRODUCTS.some((p) => p.category === c));

const rub = (n) => n.toLocaleString("ru-RU") + " " + "\u20BD";

/* ============ Product photo placeholder (collage-style, until real photos are added) ============ */
const PhotoPlaceholder = ({ icon, color }) => (
  <div
    style={{
      height: "100%",
      width: "100%",
      backgroundImage: `repeating-linear-gradient(90deg, ${T.panel2} 0 40px, ${T.panel} 40px 80px)`,
      backgroundSize: "120px 100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Icon name={icon} color={color} size={36} />
  </div>
);

/* ============ Product image with fallback if the source fails to load ============ */
/* object-fit: contain + white background — вся фотография видна целиком, без обрезки; если пропорции не совпадают, по бокам/сверху добавляются белые поля */
const ProductImage = ({ src, alt, icon, color }) => {
  const [broken, setBroken] = useState(false);
  if (!src || broken) return <PhotoPlaceholder icon={icon} color={color} />;
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setBroken(true)}
      style={{ width: "100%", height: "100%", objectFit: "contain", background: "#FFFFFF" }}
    />
  );
};

/* ============ Main component ============ */
export default function Shop() {
  const [page, setPage] = useState("shop"); // shop | school
  const [detailId, setDetailId] = useState(null);
  const [catFilter, setCatFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState({}); // id -> qty
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState("cart"); // cart | form | done
  const [flash, setFlash] = useState(null);

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (catFilter !== "all" && p.category !== catFilter) return false;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase()) && !p.brand.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [catFilter, query]);

  const cartItems = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ ...PRODUCTS.find((p) => p.id === Number(id)), qty }));
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.qty * i.price, 0);

  const addToCart = (id) => {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
    setFlash(id);
    setTimeout(() => setFlash(null), 500);
  };
  const setQty = (id, qty) => setCart((c) => ({ ...c, [id]: Math.max(0, qty) }));

  return (
    <div style={{ background: T.bg, color: T.text, minHeight: "100vh", fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        .st-btn { cursor:pointer; border:none; font-family:'IBM Plex Sans',sans-serif; transition: background .15s ease, transform .1s ease; }
        .st-btn:active { transform: scale(0.97); }
        .st-card { transition: border-color .15s ease; }
        .st-card:hover { border-color: ${T.orange} !important; }
        .st-input { font-family:'IBM Plex Sans',sans-serif; }
        .st-input:focus { outline: 2px solid ${T.ice}; outline-offset: 1px; }
        .st-chip { cursor:pointer; transition: background .15s ease, color .15s ease; }
        .st-navlink { cursor:pointer; transition: color .15s ease; }
        @keyframes treadslide { from { background-position: 0 0; } to { background-position: 120px 0; } }
        .st-photo-strip { animation: treadslide 6s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .st-photo-strip { animation: none; } }
        @media (max-width: 820px) {
          .st-layout { grid-template-columns: 1fr !important; }
          .st-sidebar { position: static !important; order: 2; }
        }
      `}</style>

      {/* ===== Header ===== */}
      <header style={{ position: "sticky", top: 0, zIndex: 20, background: T.bg, borderBottom: `1px solid ${T.border}`, padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img src={LOGO_URI} alt="SnegoRider" style={{ height: 60, width: 60, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
          <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 34, letterSpacing: 0.3, lineHeight: 1 }}>
            Snego<span style={{ color: T.orange, fontStyle: "italic" }}>Rider</span>
          </div>
        </div>

        <nav style={{ display: "flex", gap: 24, fontSize: 15 }}>
          <span
            className="st-navlink"
            onClick={() => setPage("shop")}
            style={{ color: page === "shop" ? T.text : T.dim, fontWeight: page === "shop" ? 600 : 400, borderBottom: page === "shop" ? `2px solid ${T.orange}` : "2px solid transparent", paddingBottom: 4 }}
          >
            Магазин
          </span>
          <span
            className="st-navlink"
            onClick={() => setPage("school")}
            style={{ color: page === "school" ? T.text : T.dim, fontWeight: page === "school" ? 600 : 400, borderBottom: page === "school" ? `2px solid ${T.orange}` : "2px solid transparent", paddingBottom: 4 }}
          >
            Снегоходная школа
          </span>
        </nav>

        {page === "shop" && (
          <div style={{ flex: 1, minWidth: 200, maxWidth: 420 }}>
            <input
              className="st-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по названию или бренду"
              style={{ width: "100%", background: T.panel2, border: `1px solid ${T.border}`, color: T.text, padding: "9px 12px", fontSize: 14 }}
            />
          </div>
        )}

        <button
          className="st-btn"
          onClick={() => { setCartOpen(true); setCheckoutStep("cart"); }}
          style={{ background: T.panel2, border: `1px solid ${T.border}`, color: T.text, padding: "9px 16px", display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}
        >
          Корзина
          <span style={{ background: cartCount ? T.orange : T.border, color: cartCount ? T.bg : T.dim, borderRadius: 3, padding: "1px 7px", fontSize: 12, fontWeight: 600 }}>
            {cartCount}
          </span>
        </button>
      </header>

      {page === "shop" ? (
        <>
          {/* ===== Hero ===== */}
          <section
            className="st-photo-strip"
            style={{
              padding: "56px 24px",
              borderBottom: `1px solid ${T.border}`,
              backgroundImage: `repeating-linear-gradient(90deg, ${T.panel2} 0 40px, ${T.panel} 40px 80px)`,
              backgroundSize: "120px 100%",
            }}
          >
            <div style={{ maxWidth: 640 }}>
              <div style={{ color: T.orange, fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Запчасти и экипировка для снегоходов и мотоциклов</div>
              <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.1, margin: "0 0 16px", fontWeight: 700 }}>
                Готовь технику и себя к трассе — не выходя из дома
              </h1>
              <p style={{ color: T.dim, fontSize: 15, lineHeight: 1.6, maxWidth: 480, margin: "0 0 20px" }}>
                Гусеницы, ремни, линзы и защита — рядом со шлемами, куртками и перчатками. Всё, что нужно для сезона, в одном каталоге.
              </p>
            </div>
          </section>

          {/* ===== Layout: sidebar + grid ===== */}
          <div className="st-layout" style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 28, padding: "32px 24px", maxWidth: 1180, margin: "0 auto" }}>
            {/* Sidebar */}
            <aside className="st-sidebar" style={{ position: "sticky", top: 76, alignSelf: "start" }}>
              <div>
                <div style={{ fontSize: 12, color: T.dim, fontWeight: 600, marginBottom: 10 }}>Раздел</div>
                {["all", ...CATEGORIES].map((id) => {
                  const label = id === "all" ? "Все товары" : id;
                  const active = catFilter === id;
                  return (
                    <div
                      key={id}
                      className="st-chip"
                      onClick={() => setCatFilter(id)}
                      style={{
                        padding: "7px 10px",
                        fontSize: 14,
                        marginBottom: 3,
                        background: active ? T.panel2 : "transparent",
                        color: active ? T.text : T.dim,
                        borderLeft: `2px solid ${active ? T.orange : "transparent"}`,
                      }}
                    >
                      {label}
                    </div>
                  );
                })}
              </div>
            </aside>

            {/* Product grid */}
            <div>
              <div style={{ color: T.dim, fontSize: 13, marginBottom: 14 }}>{filtered.length} товаров</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 16 }}>
                {filtered.map((p) => (
                  <div key={p.id} className="st-card" style={{ border: `1px solid ${T.border}`, background: T.panel, display: "flex", flexDirection: "column" }}>
                    <div
                      onClick={() => setDetailId(p.id)}
                      style={{ height: 200, borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}
                    >
                      <ProductImage src={p.image} alt={p.name} icon={p.icon} color={T.ice} />
                    </div>
                    <div style={{ padding: 14, display: "flex", flexDirection: "column", flex: 1 }}>
                      <div style={{ fontSize: 11, color: T.dim, marginBottom: 4 }}>{p.brand} · {p.tag}</div>
                      <div
                        onClick={() => setDetailId(p.id)}
                        style={{ fontSize: 14.5, lineHeight: 1.35, marginBottom: 12, flex: 1, cursor: "pointer" }}
                      >
                        {p.name}
                      </div>
                      <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 17, fontWeight: 600, marginBottom: 10 }}>{rub(p.price)}</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          className="st-btn"
                          onClick={() => setDetailId(p.id)}
                          style={{
                            background: "transparent",
                            border: `1px solid ${T.border}`,
                            color: T.text,
                            padding: "7px 10px",
                            fontSize: 13,
                            fontWeight: 500,
                            flex: 1,
                          }}
                        >
                          Подробнее
                        </button>
                        <button
                          className="st-btn"
                          onClick={() => addToCart(p.id)}
                          style={{
                            background: flash === p.id ? T.ice : T.orange,
                            color: T.bg,
                            padding: "7px 12px",
                            fontSize: 13,
                            fontWeight: 600,
                            flex: 1,
                          }}
                        >
                          {flash === p.id ? "Добавлено" : "В корзину"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ===== Snowmobile school page ===== */
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "56px 24px" }}>
          <div style={{ color: T.orange, fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Снегоходная школа SnegoRider</div>
          <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "clamp(26px, 4vw, 38px)", lineHeight: 1.15, margin: "0 0 24px", fontWeight: 700 }}>
            О нас
          </h1>
          <div style={{ border: `1px dashed ${T.border}`, background: T.panel, padding: 28, color: T.dim, fontSize: 15, lineHeight: 1.6 }}>
            Здесь скоро появится информация о снегоходной школе — программы обучения, инструкторы и маршруты.
          </div>
        </div>
      )}

      {/* ===== Footer ===== */}
      <footer style={{ borderTop: `1px solid ${T.border}`, padding: "28px 24px", color: T.dim, fontSize: 13, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src={LOGO_URI} alt="SnegoRider" style={{ height: 22, width: 22, borderRadius: "50%", objectFit: "cover" }} />
          © SnegoRider — запчасти и экипировка для снегоходов и мотоциклов
        </div>
        <div>Доставка по России · Самовывоз со склада</div>
      </footer>

      {/* ===== Product detail modal ===== */}
      {detailId !== null && (() => {
        const p = PRODUCTS.find((x) => x.id === detailId);
        if (!p) return null;
        return (
          <>
            <div onClick={() => setDetailId(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 40 }} />
            <div
              style={{
                position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                width: "min(720px, 92vw)", maxHeight: "88vh", overflowY: "auto",
                background: T.panel, border: `1px solid ${T.border}`, zIndex: 41,
              }}
            >
              <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px 14px 0" }}>
                <button className="st-btn" onClick={() => setDetailId(null)} style={{ background: "transparent", color: T.dim, fontSize: 20, padding: 4 }}>{"\u2715"}</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: 0, padding: "0 24px 28px" }}>
                <div style={{ height: 340, marginBottom: 20, border: `1px solid ${T.border}` }}>
                  <ProductImage src={p.image} alt={p.name} icon={p.icon} color={T.ice} />
                </div>
                <div style={{ fontSize: 12, color: T.dim, marginBottom: 6 }}>{p.brand} · {p.category} · {p.tag}</div>
                <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 24, fontWeight: 600, margin: "0 0 14px", lineHeight: 1.25 }}>{p.name}</h2>
                <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 26, fontWeight: 700, marginBottom: 18 }}>{rub(p.price)}</div>
                <p style={{ color: T.dim, fontSize: 14.5, lineHeight: 1.6, marginBottom: 22 }}>{p.description}</p>
                <button
                  className="st-btn"
                  onClick={() => { addToCart(p.id); }}
                  style={{ background: flash === p.id ? T.ice : T.orange, color: T.bg, padding: "12px 20px", fontWeight: 600, fontSize: 14 }}
                >
                  {flash === p.id ? "Добавлено" : "В корзину"}
                </button>
              </div>
            </div>
          </>
        );
      })()}

      {/* ===== Cart drawer ===== */}
      {cartOpen && (
        <>
          <div onClick={() => setCartOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 30 }} />
          <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(400px, 100vw)", background: T.panel, borderLeft: `1px solid ${T.border}`, zIndex: 31, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: 18, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600 }}>
                {checkoutStep === "cart" && "Корзина"}
                {checkoutStep === "form" && "Оформление заказа"}
                {checkoutStep === "done" && "Заказ принят"}
              </div>
              <button className="st-btn" onClick={() => setCartOpen(false)} style={{ background: "transparent", color: T.dim, fontSize: 20, padding: 4 }}>{"\u2715"}</button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: 18 }}>
              {checkoutStep === "cart" && (
                cartItems.length === 0 ? (
                  <div style={{ color: T.dim, fontSize: 14 }}>Корзина пуста. Добавьте товары из каталога.</div>
                ) : (
                  cartItems.map((it) => (
                    <div key={it.id} style={{ display: "flex", gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${T.border}` }}>
                      <div style={{ width: 52, height: 52, flexShrink: 0, overflow: "hidden" }}>
                        <ProductImage src={it.image} alt={it.name} icon={it.icon} color={T.ice} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13.5, marginBottom: 6 }}>{it.name}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <button className="st-btn" onClick={() => setQty(it.id, it.qty - 1)} style={{ background: T.panel2, color: T.text, width: 24, height: 24, fontSize: 14 }}>{"\u2212"}</button>
                          <span style={{ fontSize: 13, minWidth: 16, textAlign: "center" }}>{it.qty}</span>
                          <button className="st-btn" onClick={() => setQty(it.id, it.qty + 1)} style={{ background: T.panel2, color: T.text, width: 24, height: 24, fontSize: 14 }}>+</button>
                          <span style={{ marginLeft: "auto", fontSize: 13.5, fontWeight: 600 }}>{rub(it.price * it.qty)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )
              )}

              {checkoutStep === "form" && (
                <form
                  onSubmit={(e) => { e.preventDefault(); setCheckoutStep("done"); }}
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  <label style={{ fontSize: 12, color: T.dim }}>Имя
                    <input required className="st-input" style={{ width: "100%", marginTop: 4, background: T.panel2, border: `1px solid ${T.border}`, color: T.text, padding: "9px 10px" }} />
                  </label>
                  <label style={{ fontSize: 12, color: T.dim }}>Телефон
                    <input required className="st-input" style={{ width: "100%", marginTop: 4, background: T.panel2, border: `1px solid ${T.border}`, color: T.text, padding: "9px 10px" }} />
                  </label>
                  <label style={{ fontSize: 12, color: T.dim }}>Адрес доставки или самовывоз
                    <input required className="st-input" style={{ width: "100%", marginTop: 4, background: T.panel2, border: `1px solid ${T.border}`, color: T.text, padding: "9px 10px" }} />
                  </label>
                  <div style={{ fontSize: 12, color: T.dim, marginTop: 6, lineHeight: 1.5 }}>
                    Оплата картой после подтверждения заказа менеджером.
                  </div>
                  <button type="submit" className="st-btn" style={{ background: T.orange, color: T.bg, padding: "11px", fontWeight: 600, fontSize: 14, marginTop: 6 }}>
                    Подтвердить заказ
                  </button>
                </form>
              )}

              {checkoutStep === "done" && (
                <div style={{ textAlign: "center", padding: "30px 0" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>{"\u2713"}</div>
                  <div style={{ fontSize: 15, marginBottom: 8 }}>Спасибо за заказ!</div>
                  <div style={{ color: T.dim, fontSize: 13, lineHeight: 1.5 }}>Мы свяжемся с вами в течение часа для подтверждения и оплаты.</div>
                </div>
              )}
            </div>

            {checkoutStep === "cart" && cartItems.length > 0 && (
              <div style={{ padding: 18, borderTop: `1px solid ${T.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 15 }}>
                  <span style={{ color: T.dim }}>Итого</span>
                  <span style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 600 }}>{rub(cartTotal)}</span>
                </div>
                <button className="st-btn" onClick={() => setCheckoutStep("form")} style={{ width: "100%", background: T.orange, color: T.bg, padding: "12px", fontWeight: 600, fontSize: 14 }}>
                  Оформить заказ
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
