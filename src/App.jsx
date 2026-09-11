import React, { useState, useMemo, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

/* ============ Design tokens ============ */
const T = {
  bg: "#121316",
  panel: "#191B1F",
  panel2: "#20232A",
  text: "#F2F3F5",
  dim: "#8B93A1",
  border: "#2A2E35",
  orange: "#FF6A00",
  orangeDim: "#B84E14",
  ice: "#3FA9E0",
};

const LOGO_URI = "data:image/jpeg;base64,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";

/* ============ Supabase (личный кабинет: регистрация, вход, история заказов) ============ */
/* Вставьте сюда Project URL и anon public key из Project Settings → API в Supabase */
const SUPABASE_URL = "https://gfamwjotufuqhusivqrg.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_6tAfH3KajcHU8FATqswLZQ_3-tWPb8T";
const supabaseEnabled = SUPABASE_URL && SUPABASE_URL !== "ВАШ_SUPABASE_URL_СЮДА";
const supabase = supabaseEnabled ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

/* ============ Email-уведомления о заказах (через EmailJS) ============ */
/* Вставьте сюда Service ID, Template ID и Public Key из личного кабинета emailjs.com */
const EMAILJS_SERVICE_ID = "EmailJS";
const EMAILJS_TEMPLATE_ID = "template_quluckh";
const EMAILJS_PUBLIC_KEY = "-2EWu_Q4uV8Yri0Ax";

async function sendOrderByEmail(order) {
  if (!EMAILJS_SERVICE_ID || EMAILJS_SERVICE_ID === "ВАШ_SERVICE_ID_СЮДА") return;
  const itemsText = order.items
    .map((it) => `${it.name} × ${it.qty} = ${(it.price * it.qty).toLocaleString("ru-RU")} ₽`)
    .join("\n");

  try {
    await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          from_name: order.name,
          phone: order.phone,
          address: order.address,
          items: itemsText,
          total: order.total.toLocaleString("ru-RU") + " ₽",
        },
      }),
    });
  } catch (e) {
    console.error("Не удалось отправить заказ на почту", e);
  }
}

/* ============ Telegram-уведомления о заказах ============ */
/* Вставьте сюда токен и chat_id, которые получили от @BotFather и через getUpdates */
const TELEGRAM_BOT_TOKEN = "8874868661:AAHmmn_Z34zyqswuqAkEw_P7mmOFgN0UU0Q";
const TELEGRAM_CHAT_ID = "1169645005";

async function sendOrderToTelegram(order) {
  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN === "ВАШ_ТОКЕН_СЮДА") return;
  const itemsText = order.items
    .map((it) => `- ${it.name} × ${it.qty} = ${(it.price * it.qty).toLocaleString("ru-RU")} ₽`)
    .join("\n");
  const text =
    `Новый заказ на SnegoRider\n\n` +
    `Имя: ${order.name}\n` +
    `Телефон: ${order.phone}\n` +
    `Адрес/самовывоз: ${order.address}\n\n` +
    `Товары:\n${itemsText}\n\n` +
    `Итого: ${order.total.toLocaleString("ru-RU")} ₽`;

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
    });
  } catch (e) {
    console.error("Не удалось отправить заказ в Telegram", e);
  }
}
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
  { id: 6, name: "Линза FXR Maverick Dual с подогр.: Blue (223156-4000-00)", category: "Линзы и визоры", brand: "FXR", price: 9975, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-q/12243869486.jpg", description: "Цвет: Blue. Характеристики без упаковки: Вес 90г, размер 195x100x15 мм. С подогревом." },
  { id: 7, name: "Линза 509 Kingpin, Взрослые: Orange Tint", category: "Линзы и визоры", brand: "509", price: 10000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-e/12243867782.jpg", description: "Цвет: Orange Tint. Характеристики без упаковки: Вес 60г, размер 180x90x10 мм. Контрастная линза." },
  { id: 8, name: "Линза 509 Sinister X5 Взрослые: фотохром, Clear to Blue", category: "Линзы и визоры", brand: "509", price: 10000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-9/12243872457.jpg", description: "Цвет: Clear to Blue. Характеристики без упаковки: Вес 55г, размер 185x95x10 мм. Фотохромная линза." },
  { id: 9, name: "Линза 509 Revolver Trail Взрослые: Yellow Tint", category: "Линзы и визоры", brand: "509", price: 10000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-n/12243872795.jpg", description: "Цвет: Yellow Tint. Характеристики без упаковки: Вес 50г, размер 180x90x10 мм. Трейловая линза." },
  { id: 10, name: "Линза 509 Sinister X5 Взрослые: Orange Mirror/Yellow Tint", category: "Линзы и визоры", brand: "509", price: 10000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-q/12243869018.jpg", description: "Цвет: Orange Mirror/Yellow Tint. Характеристики без упаковки: Вес 50г, размер 185x95x10 мм. Зеркальная." },
  { id: 11, name: "Линза 509 Revolver Trail Взрослые: Photochromatic Clear to Blue", category: "Линзы и визоры", brand: "509", price: 10000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-v/12243870823.jpg", description: "Цвет: Photochromatic Clear to Blue. Характеристики без упаковки: Вес 55г, размер 180x90x10 мм. Фотохром." },
  { id: 12, name: "Линза 509 Sinister X5 Взрослые: Blue Mirror/Orange Tint", category: "Линзы и визоры", brand: "509", price: 10000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-w/12243870140.jpg", description: "Цвет: Blue Mirror/Orange Tint. Характеристики без упаковки: Вес 50г, размер 185x95x10 мм. Антибликовая." },
  { id: 13, name: "Линза 509 Kingpin, Взрослые: Yellow Tint", category: "Линзы и визоры", brand: "509", price: 10000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-o/12243872436.jpg", description: "Цвет: Yellow Tint. Характеристики без упаковки: Вес 60г, размер 180x90x10 мм. Универсальная сменная линза." },
  { id: 14, name: "Леггинсы EVS Tug 3/4 Impact утепленнные (Black L) (TUGBOTWIMP3/4-BK-L)", category: "Защита тела", brand: "EVS", price: 11025, icon: "shield", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-r/6495907983.jpg", description: "Высококачественный мотоштаны от бренда EVS, модель Леггинсы  Tug 3/4 Impact утепленнные (Black L). Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: L. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 15, name: "Шорты защитные EVS Tug Усиленнные (Black M) (TUGBOTPAD-BK-M)", category: "Защита тела", brand: "EVS", price: 4935, icon: "shield", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-e/12496490942.jpg", description: "Высококачественный мотозащита от бренда EVS, модель Шорты защитные  Tug  Усиленнные (Black M). Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: M. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 16, name: "Шорты защитные EVS Tug Усиленнные (Black S) (TUGBOTPAD-BK-S)", category: "Защита тела", brand: "EVS", price: 4935, icon: "shield", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-e/12496490942.jpg", description: "Высококачественный мотозащита от бренда EVS, модель Шорты защитные  Tug  Усиленнные (Black S). Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: S. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 17, name: "Леггинсы EVS Tug 3/4 Impact (Black L) (TUGBOTIMP3/4-BK-L)", category: "Защита тела", brand: "EVS", price: 8925, icon: "shield", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-h/7768672901.jpg", description: "Высококачественный мотоштаны от бренда EVS, модель Леггинсы  Tug 3/4 Impact (Black L). Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: L. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 18, name: "Ботинки FXR Octane, с утеплителем, подростки унисекс (Black/Orange/Char, 2/33) (190717-1030-33)", category: "Обувь", brand: "FXR", price: 7770, icon: "boot", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-r/12534417819.jpg", description: "Высококачественный мотоботы от бренда FXR, модель Ботинки  Octane. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 19, name: "Перчатки FXR COLD CROSS ,без утеплителя (Black Red M) (230811-2010-10)", category: "Перчатки", brand: "FXR", price: 8610, icon: "glove", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-n/12496496063.jpg", description: "Высококачественный мотоперчатки от бренда FXR, модель Перчатки  COLD CROSS. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: M. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 20, name: "Куртка FXR Force Dual Laminate. (Asphalt XL) (232047-0800-16)", category: "Куртки", brand: "FXR", price: 21525, icon: "jacket", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-t/12496493693.jpg", description: "Высококачественный мотокуртки от бренда FXR, модель Куртка  Force Dual Laminate. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: XL. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 21, name: "Шлем 509 Delta V Carbon Commander Helmet (Black/Gold .LG) (F01015700-140-003)", category: "Шлемы", brand: "509", price: 175875, icon: "helmet", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-n/12534235583.jpg", description: "Высококачественный шлемы для мототехники от бренда 509, модель Шлем  Delta V Carbon Commander Helmet (Black/Gold. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 22, name: "Шорты защитные EVS Tug Усиленнные (Black L) (TUGBOTPAD-BK-L)", category: "Защита тела", brand: "EVS", price: 4935, icon: "shield", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-e/12496490942.jpg", description: "Высококачественный мотозащита от бренда EVS, модель Шорты защитные  Tug  Усиленнные (Black L). Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: L. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 23, name: "Шорты защитные EVS Tug Усиленнные (Black XL) (TUGBOTPAD-BK-XL)", category: "Защита тела", brand: "EVS", price: 4935, icon: "shield", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-e/12496490942.jpg", description: "Высококачественный мотозащита от бренда EVS, модель Шорты защитные  Tug  Усиленнные (Black XL). Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: XL. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 24, name: "Сумка Ogio Head для шлема (Stealth) (121009_36)", category: "Шлемы", brand: "OGIO", price: 13650, icon: "helmet", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-o/12534115776.jpg", description: "Высококачественный шлемы для мототехники от бренда Другое, модель Сумка Ogio Head для шлема (Stealth). Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 25, name: "Перчатки FXR boost без утеплителя (Hi-Vis,S) (210809-6500-07)", category: "Перчатки", brand: "FXR", price: 7508, icon: "glove", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-j/12496501459.jpg", description: "Высококачественный мотоперчатки от бренда FXR, модель Перчатки  boost без утеплителя (Hi-Vis. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: S. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 26, name: "Куртка FXR RRX с утеплителем (Black/Red, L) (250037-1020)", category: "Куртки", brand: "FXR", price: 39795, icon: "jacket", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-l/12530763957.jpg", description: "Высококачественный мотокуртки от бренда FXR, модель Куртка  RRX с утеплителем (Black/Red. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: L. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 27, name: "Шлем FXR Blade 2.0 Carbon Race Div, взрослые ( hi-Vis/Navy/Blue ,S) (170603-6545-07)", category: "Шлемы", brand: "FXR", price: 35070, icon: "helmet", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-x/12533663589.jpg", description: "Высококачественный шлемы для мототехники от бренда FXR, модель Шлем  Blade 2. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: S. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 28, name: "Шлем 509 Atmosphere Helmet буз подогрева (Flamin Hot, XL) (F01021500-150-101)", category: "Шлемы", brand: "509", price: 27510, icon: "helmet", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-4/12533131408.jpg", description: "Высококачественный шлемы для мототехники от бренда 509, модель Шлем  Atmosphere Helmet буз подогрева (Flamin Hot. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: XL. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 29, name: "Защита тела (M) SIXS KIT PRO TS10 с протектором (PKTS10-MABFI)", category: "Защита тела", brand: "SIXS", price: 22575, icon: "shield", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-w/12496499636.jpg", description: "Высококачественный мотозащита от бренда SIXS, модель Защита тела (M)  KIT PRO TS10 с протектором. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 30, name: "Шорты защитные EVS Tug Impact (Black XXL) (TUGBOTIMP-BK-XXL)", category: "Защита тела", brand: "EVS", price: 5565, icon: "shield", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-r/6495907983.jpg", description: "Высококачественный мотозащита от бренда EVS, модель Шорты защитные  Tug  Impact (Black XXL). Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: XXL. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 31, name: "Ботинки FXR Boost, дети, унисекс (Black /Fuchsia , 34) (220740-1090)", category: "Обувь", brand: "FXR", price: 8925, icon: "boot", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-j/12532804543.jpg", description: "Высококачественный мотоботы от бренда FXR, модель Ботинки  Boost. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 32, name: "Перчатки FXR BLACK OPS ,без утеплителя (Black XL) (230820-1000-16)", category: "Перчатки", brand: "FXR", price: 7035, icon: "glove", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-5/8526613325.jpg", description: "Высококачественный мотоперчатки от бренда FXR, модель Перчатки  BLACK OPS. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: XL. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 33, name: "Ботинки FXR Octane, дети, унисекс (Black /Fuchsia ,4/35) (190717-1065-34)", category: "Обувь", brand: "FXR", price: 7770, icon: "boot", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-l/12532610109.jpg", description: "Высококачественный ботинки от бренда FXR, модель Ботинки Octane. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 34, name: "Леггинсы защитн. SIXS KIT PRO PNX Black XL с протектором (P0KPNXLXNEFI)", category: "Защита тела", brand: "SIXS", price: 8295, icon: "shield", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-x/12496499529.jpg", description: "Высококачественный мотоштаны от бренда SIXS, модель Леггинсы защитн. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 35, name: "Куртка FXR Cold Cross RR с утеплителем (Black/Orange/Purple, L) (250032-3080-16)", category: "Куртки", brand: "FXR", price: 31710, icon: "jacket", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-c/12496493856.jpg", description: "Высококачественный мотокуртки от бренда FXR, модель Куртка  Cold Cross RR с утеплителем (Black/Orange/Purple. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: L. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 36, name: "Жилет защитный EVS Sport (BLACK/2XL) (SSV19-BK-XXL)", category: "Защита тела", brand: "EVS", price: 24360, icon: "shield", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-8/12536071388.jpg", description: "Высококачественный мотозащита от бренда EVS, модель Жилет защитный  Sport (BLACK/2XL). Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 37, name: "Защита тела SIXS KIT PRO TS10 с протектором (Black, XL) (PKTS10LXABFI)", category: "Защита тела", brand: "SIXS", price: 23940, icon: "shield", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-w/12496499636.jpg", description: "Высококачественный мотозащита от бренда SIXS, модель Защита тела  KIT PRO TS10 с протектором (Black. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: XL. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 38, name: "Джерси защитная EVS Ballistic G7 , (Black, XX LARGE) (G7-BK-XXL)", category: "Одежда", brand: "EVS", price: 32235, icon: "jacket", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-t/12535986377.jpg", description: "Высококачественный мотозащита от бренда EVS, модель Джерси защитная  Ballistic G7. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 39, name: "Защита спины SIXS KIT PRO с протектором(BlackYellov, OS) (K0BABOXLNEFI)", category: "Защита тела", brand: "SIXS", price: 7245, icon: "shield", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-r/12496501683.jpg", description: "Высококачественный мотозащита от бренда SIXS, модель Защита спины KIT PRO с протектором (BlackYellow). Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 40, name: "Ботинки FXR Octane, дети, унисекс (Black /Hi Vis /Char , 3/34)", category: "Обувь", brand: "FXR", price: 20000, icon: "boot", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-g/7857117376.jpg", description: "Высококачественный мотоботы от бренда FXR, модель Ботинки  Octane. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 41, name: "Леггинсы EVS Tug 3/4 Impact утепленнные (Black M) (TUGBOTWIMP3/4-BK-S)", category: "Защита тела", brand: "EVS", price: 11025, icon: "shield", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-h/7768672901.jpg", description: "Высококачественный мотоштаны от бренда EVS, модель Леггинсы  Tug 3/4 Impact утепленнные (Black M). Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: M. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 42, name: "Жилет защитный EVS Roost F2 (Black, X-Large) (F2-BK-XL)", category: "Защита тела", brand: "EVS", price: 21210, icon: "shield", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-t/12496495205.jpg", description: "Высококачественный мотозащита от бренда EVS, модель Жилет защитный  Roost F2 (Black. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 43, name: "Леггинсы EVS Tug 3/4 Impact (Black M) (TUGBOTIMP3/4-BK-M)", category: "Защита тела", brand: "EVS", price: 8925, icon: "shield", tag: "В наличии", image: "https://ir.ozone.ru/s3/multimedia-tmp-d/item-pic-beec448fb0faaf9eaa134447489ac47f.jpg", description: "Высококачественный мотоштаны от бренда EVS, модель Леггинсы  Tug 3/4 Impact (Black M). Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: M. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 44, name: "Перчатки FXR Cold Cross Mechanics (Black, 2XL) (200815-1000-19)", category: "Перчатки", brand: "FXR", price: 6615, icon: "glove", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-j/12496496347.jpg", description: "Высококачественный мотоперчатки от бренда FXR, модель Перчатки  Cold Cross  Mechanics (Black. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 45, name: "Леггинсы защитн. SIXS KIT PRO PNX Black L с протектором (P0KPNX-LNEFI)", category: "Защита тела", brand: "SIXS", price: 8295, icon: "shield", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-c/7400300124.jpg", description: "Высококачественный мотоштаны от бренда SIXS, модель Леггинсы защитн. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 46, name: "Шлем 509 Delta V Carbon подогревом(Racing Red ,MD) (F01016200-130-101)", category: "Шлемы", brand: "509", price: 97125, icon: "helmet", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-q/7190737946.jpg", description: "Высококачественный шлемы для мототехники от бренда 509, модель Шлем  Delta V Carbon подогревом(Racing Red. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 47, name: "Шлем FXR Clutch Evo LE (Magma L) (220614-1022-13)", category: "Шлемы", brand: "FXR", price: 31185, icon: "helmet", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-z/12531046463.jpg", description: "Высококачественный шлемы для мототехники от бренда FXR, модель Шлем  Clutch Evo LE (Magma L). Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: L. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 48, name: "Детская Куртка FXR Helium с утеплителем. (Black/Raspberry Fade /Hi-Vis 16) (230403-1028-16)", category: "Куртки", brand: "FXR", price: 28140, icon: "jacket", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-6/12530938830.jpg", description: "Высококачественный мотокуртки от бренда FXR, модель Детская Куртка  Helium  с утеплителем. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 49, name: "Куртка FXR RRX с утеплителем (Black/Red, 2XL) (250037-1020-1)", category: "Куртки", brand: "FXR", price: 39795, icon: "jacket", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-l/12530763957.jpg", description: "Высококачественный мотокуртки от бренда FXR, модель Куртка  RRX с утеплителем (Black/Red. Разработан для обеспечения максимальной защиты и комфорта во время эксплуатации. Размер: Универсальный. Идеальный выбор для профессионалов и любителей, ценящих надежность и современные защитные технологии." },
  { id: 50, name: "Фара для Ski Doo Gen4 (517305752)", category: "Электрика и датчики", brand: "Ski-Doo BRP", price: 50400, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-s/7338882340.jpg", description: "<p>Фара для снегохода Ski Doo Gen4 – надежное освещение для сложных условий!</p><p>Эта оригинальная фара разработана специально для моделей Ski Doo Gen4, обеспечивает мощный поток света даже в условиях низкой видимости. Прочный корпус выдерживает экстремальные температуры и механические нагрузки, гарантируя длительный срок эксплуатации. Легкая конструкция идеально интегрируется в шасси техники, не требует дополнительных доработок.</p><p>Специальное покрытие защитит устройство от загрязнений и влаги, сохранив высокие оптические свойства. Компактная форма позволяет легко поместить деталь в стандартную упаковку, удобную для хранения и перевозки. Выбирайте проверенный комплектующий для максимальной безопасности на трассе!</p>" },
  { id: 51, name: "Сумка на сиденье Linq для Ski Doo gen4 (860201355)", category: "Сумки и аксессуары", brand: "Ski-Doo BRP", price: 12736, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-g/12572077300.jpg", description: "<p>Прочная сумка на сиденье Linq для Ski Doo Gen4</p><p>Эргономическая конструкция обеспечивает надёжное крепление к сидению снегохода, гарантируя защиту ваших вещей даже на высоких скоростях. Прочный полиэстер выдерживает нагрузки и неблагоприятные условия эксплуатации.</p><p>Компактная форма позволяет легко поместить необходимые предметы (ключи, документы, перчатки) в зоне быстрого доступа. Легкая конструкция не создаёт дискомфорта при длительной поездке.</p><p>Отличный выбор для любителей активного отдыха!</p>" },
  { id: 52, name: "Куртка Klim BlackHawk Parka MD Orange", category: "Куртки", brand: "Klim", price: 95000, icon: "jacket", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-m/12572411782.jpg", description: "<p>Мужская куртка Klim BlackHawk Parka MD Orange сочетает современный дизайн и надежную защиту. Модель оснащена капюшоном для дополнительного комфорта в холодную погоду, а регулировка по низу рукавов обеспечивает плотное прилегание и минимизирует проникновение холода. Передняя молния позволяет быстро одеваться и снимать куртку, сохраняя при этом герметичность шва.</p><p>Яркий оранжевый цвет делает вещь заметной в любой обстановке, добавляя образу энергии и уверенности.</p><p>Просторный крой и продуманная конструкция обеспечивают свободу движений, идеально подходя для активного отдыха или повседневного использования. Эта куртка станет универсальным выбором для тех, кто ценит сочетание функциональности и стиля.</p>" },
  { id: 53, name: "Бипер лавинный BCA Tracker S (23H2000.1.1.1SIZ)", category: "Снаряжение для туризма", brand: "BCA", price: 46725, icon: "shield", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-f/12572605995.jpg", description: "<p>Лавинный бипер BCA Tracker S – ваш надёжный помощник в экстремальных условиях!</p><p>Устройство быстро определяет сигнальные импульсы даже в сложных ситуациях, обеспечивая высокую точность локации. Компактный корпус легко помещается в рюкзак, а продуманная эргономика позволяет работать без потери времени. Автономная работа устройства гарантирует готовность к использованию в любых условиях.</p><p>Интуитивный интерфейс минимизирует риск ошибок во время спасения. Долговечный аккумулятор дарит уверенность в каждом путешествии.</p><p>BCA Tracker S сочетает современные технологии и практичность, становясь незаменимым элементом оснащения горнолыжников и снежных трассировщиков.</p>" },
  { id: 54, name: "Эмблема 509 Chrome 509 (509-EMB-CHR)", category: "Аксессуары", brand: "509", price: 3990, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-9/12576227877.jpg", description: "Эмблема 509 Chrome<br/><br/>Оригинальная хромированная эмблема от бренда 509 для кастомизации вашей экипировки. Идеально подходит для шлема, снегоходного комбинезона, шапки или футболки.<br/><br/>Особенности:<ul><li>Стиль: Эффектное и долговечное хромированное покрытие.</li><li>Универсальность: Легко крепится на ткань и жесткие поверхности.</li></ul>Характеристики:<ul><li>Бренд / Модель: 509 / Chrome 509</li><li>Артикул: 509-EMB-CHR</li><li>Вес: 0,05 кг</li><li>Габариты упаковки (Д×Ш×В): 15 × 12,5 × 0,5 см</li><li>Объем: 0,00009 м³</li></ul>" },
  { id: 55, name: "Визор FXR Clutch X С подогр. (Smoke,OS) (231740-0500-00)", category: "Линзы и визоры", brand: "FXR", price: 18900, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-a/12638565190.jpg", description: "<p>FXR Clutch X – стильный аксессуар с технологиями будущего!</p><p>Элегантный визор FXR сочетает современный дизайн и инновационные решения. Благодаря системе подогрева обеспечивается комфорт даже в прохладное время года, а мягкий свет от встроенных диодов создаст незабываемую атмосферу вечернего образа. Компактная конструкция легко помещается в сумочку, сохраняя порядок и практичность.</p><p>Подходит как девушкам, так и юношам благодаря универсальному оформлению. Выбирайте FXR Clutch X – воплощение моды и технологии в одном изделии.идеально дополняет повседневный гардероб или становится хитовым акцентом на мероприятии.*</p>" },
  { id: 56, name: "Пила складная Silky Gomboy 300mm (SIL294-30)", category: "Инструменты", brand: "Silky", price: 7455, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-b/7596438131.jpg", description: "Silky Gomboy 300 - это прочная многоцелевая складная пила. Отлично пилит в поперечном и продольном направлении, а также по диагонали. Идеально подходит как для обрезки, так и для резки сухой, твердой древесины.<br/><br/>Лезвие пилы имеет конусную форму, которая позволяет свести к минимуму трение при пилении, а также сделать зуб пилы без разводки, за счет этого обеспечивается более тонкий распил и возможность прилагать меньше усилий при пилении.<br/><br/>Резиновая ручка Gomboy обеспечивает безопасный и удобный захват. Лезвие легко и надежно фиксируется в двух положениях пиления. В сложенном состоянии зубцы Gomboy полностью скрыты в ручке.<br/><br/>Технические характеристик:<br/><br/>• Страна бренда: Япония;<br/><br/>• Длина полотна: 300 мм;<br/><br/>• Толщина полотна: 1,3 мм;<br/><br/>• Длина в сложенном состоянии: 335 х 65 х 20 мм;<br/><br/>• Длина в рабочем состоянии: 620 х 80 х 20 мм;<br/><br/>• Шаг зубьев: 6 зубьев на 30 мм полотна пилы;<br/><br/>• Вес: 370 г.<br/><br/>Silky предлагает разные конфигурации зубьев — от очень мелких до очень крупных. Информация о конфигурации указана на лезвии рядом с длиной.<br/><br/>- Крупный и очень крупный шаг (4–8 зубьев на 30 мм):<br/><br/>Агрессивный, быстрый рез. Подходит для свежей, сырой древесины с высокой влажностью. Extra Large — для тяжёлых задач: валка, толстые ветки. В сухой древесине может вызывать вибрации и плохо цепляться.<br/><br/>- Средний шаг (10 зубьев на 30 мм):<br/><br/>Универсальный вариант. Эффективен как на сухой, так и на свежей древесине.<br/><br/>- Мелкий и очень мелкий шаг (13–32 зуба на 30 мм):<br/><br/>Предназначен для сухой твёрдой древесины, например дуба или яблони. Extra Fine (26–32 зуба) — выбор столяров, мебельщиков, мастеров инструментов. В сырой древесине быстро забиваются опилками." },
  { id: 57, name: "Пила складная Silky Gomboy 240mm (SIL121-24)", category: "Инструменты", brand: "Silky", price: 6300, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-v/7596347755.jpg", description: "Silky Gomboy 240 - это прочная многоцелевая складная пила. Отлично пилит в поперечном и продольном направлении, а также по диагонали. Идеально подходит как для обрезки, так и для резки сухой, твердой древесины.<br/><br/>Лезвие пилы имеет конусную форму, которая позволяет свести к минимуму трение при пилении, а также сделать зуб пилы без разводки, за счет этого обеспечивается более тонкий распил и возможность прилагать меньше усилий при пилении.<br/><br/>Легкая и прочная стальная рукоять пилы с прорезиненной противоскользящей поверхностью, имеет фиксатор лезвия в двух рабочих положениях.<br/><br/>Полотно пилы имеет зонную закалку, закалена только зона зубьев для более долгого срока службы и поддержания остроты, само полотно не закалено, обеспечивая при этом гибкость, но не хрупкость.<br/><br/>Технические характеристики:<br/><br/>• Страна бренда: Япония;<br/><br/>• Длина полотна: 240 мм;<br/><br/>• Толщина полотна: 1,3 мм;<br/><br/>• Длина в сложенном состоянии: 270 х 60 х 20 мм;<br/><br/>• Длина в рабочем состоянии: 505 х 60 х 20 мм;<br/><br/>• Шаг зубьев: 10 зубьев на 30 мм полотна пилы;<br/><br/>• Материал рукояти пилы: прорезиненная;<br/><br/>• Вес: 265 г.<br/><br/>Silky предлагает разные конфигурации зубьев — от очень мелких до очень крупных. Информация о конфигурации указана на лезвии рядом с длиной.<br/><br/>- Крупный и очень крупный шаг (4–8 зубьев на 30 мм):<br/><br/>Агрессивный, быстрый рез. Подходит для свежей, сырой древесины с высокой влажностью. Extra Large — для тяжёлых задач: валка, толстые ветки. В сухой древесине может вызывать вибрации и плохо цепляться.<br/><br/>- Средний шаг (10 зубьев на 30 мм):<br/><br/>Универсальный вариант. Эффективен как на сухой, так и на свежей древесине.<br/><br/>- Мелкий и очень мелкий шаг (13–32 зуба на 30 мм):<br/><br/>Предназначен для сухой твёрдой древесины, например дуба или яблони. Extra Fine (26–32 зуба) — выбор столяров, мебельщиков, мастеров инструментов. В сырой древесине быстро забиваются опилками." },
  { id: 58, name: "Сумка органайзер Ogio MX 450 (713102_36)", category: "Сумки и аксессуары", brand: "OGIO", price: 11025, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-7/6338597899.jpg", description: "Поясная сумка OGIO MX 450 Tool Pack предназначена для перевозки инструментов и мелкого ремонтного снаряжения во время поездок на мотоцикле, квадроцикле или эндуро. Модель помогает держать основные инструменты под рукой и быть готовым к мелкому ремонту в дороге.<br/><br/>Откидной передний органайзер позволяет удобно разместить инструмент. Боковой карман с водостойкой молнией подходит для мелких предметов, а расширяемый держатель с фиксирующей стяжкой можно использовать для бутылки. Отдельное отделение предусмотрено для запасной камеры.<br/><br/>Мягкие накладки в зоне бедер повышают комфорт при длительном ношении. Регулируемый мягкий пояс помогает настроить посадку и надежно зафиксировать сумку во время движения.<br/><br/>Характеристики:<br/><br/>• Назначение — поясная сумка для инструментов; • Модель — MX 450 Tool Pack; • Объем — 10 л; • Размер — 10 × 66 × 15 см; • Вес — 0,6 кг; • Материал — 840 dobby poly и 420D dobby poly; • Основное отделение — для инструментов и ремонтного снаряжения; • Передний органайзер — откидной, для инструментов; • Боковой карман — с водостойкой молнией; • Держатель — расширяемый, для бутылки; • Отделение — для запасной камеры; • Крепления — внешние D-кольца для T-образных ключей; • Комфорт — мягкие накладки в зоне бедер; • Пояс — регулируемый, с мягкими накладками; • Рекомендованное использование — мотоспорт и offroad-поездки." },
  { id: 59, name: "Бейсболка 509 Evo Hat (Midnight Grey)", category: "Головные уборы", brand: "509", price: 15000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-6/13953136362.jpg", description: "509 — головной убор из коллекции бренда." },
  { id: 60, name: "Бейсболка FXR Race Div (Char/Circuit, Plus) (251642-0895-02)", category: "Головные уборы", brand: "FXR", price: 4305, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-u/13953136782.jpg", description: "FXR — головной убор из коллекции бренда." },
  { id: 61, name: "Бейсболка 509 Five O Nine (Gray, OS) (F09009800-000-601)", category: "Головные уборы", brand: "509", price: 5460, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-r/13953136887.jpg", description: "509 — головной убор из коллекции бренда." },
  { id: 62, name: "Бейсболка FXR UPF PRO Series (231912-0508-00)", category: "Головные уборы", brand: "FXR", price: 4410, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-j/13953137059.jpg", description: "FXR — головной убор из коллекции бренда." },
  { id: 63, name: "Бейсболка 509 Curved Brim CVT (Shadow Vis,", category: "Головные уборы", brand: "509", price: 15000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-v/13953137179.jpg", description: "509 — головной убор из коллекции бренда." },
  { id: 64, name: "Лонгслив FXR ProFlex UPF (Purple Camo/Black, S) (243522-8110-07)", category: "Одежда", brand: "FXR", price: 8505, icon: "jacket", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-m/14178277750.jpg", description: "<p>Лонгслив FXR ProFlex UPF – стильное решение для активных женщин</p><p>- Защита от ультрафиолета благодаря технологии UPF обеспечивает комфорт даже на солнце</p><p>- Камуфляжный принт добавляет яркости образу и подходит к любому гардеробу</p><p>- Эластичная ткань ProFlex гарантирует свободу движений без потери формы</p><p>- Минималистичный логотип бренда FXR на груди подчеркивает качество и узнаваемость</p><p>- Универсальный крой позволяет носить как повседневную одежду или базовый слой для тренировок</p>" },
  { id: 65, name: "Ремень быстросьемный 509 sinister X6 (Black) (F02004500-000-000)", category: "Тросы и органы управления", brand: "509", price: 1785, icon: "belt", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-8/14178562316.jpg", description: "Короткий ремешок для крепления на шлем 509 Altitude 2.0 предназначен для крепления шлема.Сделанный из высококачественных материалов, короткий ремешок обеспечивает комфортное и надежное прилегание к шлему.Его регулируемый дизайн позволяет легко настроить его по нужному размеру, обеспечивая идеальную посадку на голову.В то же время, этот ремешок обеспечивает оптимальную вентиляцию и не оказывает давления на голову, что делает его идеальным вариантом для длительных поездок и активного использования." },
  { id: 66, name: "Крепления панелей верхнее Spi Ski-Doo (SM-12598)", category: "Кузов и крепления", brand: "SPI", price: 1260, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-0/14426716536.jpg", description: "SPI — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 67, name: "Шаровая опора нижняя Polaris (SM-08503)", category: "Подвеска и рулевое", brand: "Polaris", price: 5250, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-a/6376113502.jpg", description: "Polaris — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 68, name: "Ремкомплект выпускных клапанов Sledex Polaris 800 15-20 (SM-07305)", category: "Двигатель", brand: "Sledex", price: 4095, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-k/7342036616.jpg", description: "Sledex — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 69, name: "Крышка маслобака Sledex Ski-Doo Gen4 (SM-07407)", category: "Кузов и крепления", brand: "Sledex", price: 1470, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-2/6374949758.jpg", description: "Sledex — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 70, name: "Ремкомплект стартера SPI Starte S/M Ski-Doo (12-3210)", category: "Двигатель", brand: "SPI", price: 1974, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-d/9000296689.jpg", description: "SPI — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 71, name: "Лепестковый клапан Ski-Doo Spi (59-90154)", category: "Двигатель", brand: "SPI", price: 4599, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-w/9100927832.jpg", description: "SPI — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 72, name: "Подшипник КПП Polaris Следекс", category: "Вариатор и трансмиссия", brand: "Sledex", price: 1250, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-5/6787217525.jpg", description: "Sledex — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 73, name: "Прокладка стальная на выпуск Ski-Doo G4 (420430486)", category: "Двигатель", brand: "Ski-Doo", price: 1050, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-d/7281187033.jpg", description: "Ski-Doo — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 74, name: "Рулевой наконечник Polaris (SM-08407)", category: "Подвеска и рулевое", brand: "Polaris", price: 3780, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-0/14426480628.jpg", description: "Polaris — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 75, name: "Крышка топливного бака Ski-Doo/Arctic Cat (SM-07093)", category: "Топливная система", brand: "Ski-Doo", price: 2100, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-h/6837600797.jpg", description: "Ski-Doo — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 76, name: "Рукоятка Grip Ski-Doo (506152560)", category: "Тросы и органы управления", brand: "Ski-Doo", price: 5355, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-n/14426438891.jpg", description: "Ski-Doo — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 77, name: "Сальники ролика гусеницы Ski-Doo (503190434)", category: "Двигатель", brand: "Ski-Doo", price: 662, icon: "track", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-9/14483979729.jpg", description: "Ski-Doo — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 78, name: "Крепление правое для пластика BRP", category: "Кузов и крепления", brand: "BRP", price: 3750, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-5/14426331809.jpg", description: "BRP — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 79, name: "Склиз Ski-Doo Gen4", category: "Кузов и крепления", brand: "Ski-Doo", price: 5625, icon: "track", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-2/14426294438.jpg", description: "Ski-Doo — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 80, name: "Вал ролика ведущего вариатора Sledex Ski-Doo (SM-03273D)", category: "Вариатор и трансмиссия", brand: "Sledex", price: 1680, icon: "belt", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-r/7733789271.jpg", description: "Sledex — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 81, name: "Колодки тормозные Sledex Arctic Cat 600/800 (SM-05306F)", category: "Тормозная система", brand: "Sledex", price: 3360, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-6/12785950554.jpg", description: "Sledex — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 82, name: "Защита шланга от перегиба Sledex Polaris (UP-07160)", category: "Подвеска и рулевое", brand: "Sledex", price: 525, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-q/14426091134.jpg", description: "Sledex — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 83, name: "Тормозная ручка парковочная Ski-Doo Spi (sm-08586-B)", category: "Тормозная система", brand: "SPI", price: 2205, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-y/8039874382.jpg", description: "SPI — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 84, name: "Кнопка выключения двигателя Ski-Doo (01-120-18)", category: "Электрика и датчики", brand: "Ski-Doo", price: 3938, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-3/6374947635.jpg", description: "Ski-Doo — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 85, name: "Шестерня ведущая для коробки ременной TKI Polaris (27T) (TKI-BDPG.27)", category: "Вариатор и трансмиссия", brand: "Polaris", price: 10500, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-7/14425970443.jpg", description: "Polaris — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 86, name: "Блокировка T-Motion BRP Ski-Doo Summit Gen4 (TMOTION-G4)", category: "Электрика и датчики", brand: "BRP", price: 1680, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-2/14425901606.jpg", description: "BRP — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 87, name: "Крепление пластика Sledex Ski-Doo (SM-12507)", category: "Кузов и крепления", brand: "Sledex", price: 1050, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-c/7281182460.jpg", description: "Sledex — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 88, name: "Пружина вариатора ведущего Ski-Doo Summit", category: "Вариатор и трансмиссия", brand: "Ski-Doo", price: 9375, icon: "belt", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-s/14425849684.jpg", description: "Ski-Doo — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 89, name: "Ремкомплект выпускных клапанов Sledex Polaris 850 19-20 (SM-07306)", category: "Двигатель", brand: "Sledex", price: 4200, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-5/8034822257.jpg", description: "Sledex — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 90, name: "Консоль Ski-Doo Эксперт, Крышка под кнопки Ski-Doo Эксперт", category: "Электрика и датчики", brand: "Ski-Doo", price: 7825, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-4/14483291980.jpg", description: "Ski-Doo — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 91, name: "Рукоятка Grip Ski-Doo ODI Ruffian 8, оранж. (965)", category: "Тросы и органы управления", brand: "ODI", price: 3286, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-5/14425698425.jpg", description: "ODI — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 92, name: "Обогрев курка газа Sledex (12-166-02)", category: "Аксессуары", brand: "Sledex", price: 2520, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-z/14425655579.jpg", description: "Sledex — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 93, name: "Втулка вариатора Ski-Doo Следекс", category: "Вариатор и трансмиссия", brand: "Sledex", price: 4375, icon: "belt", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-w/7733868260.jpg", description: "Sledex — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 94, name: "Ремкомплект вариатора Ski-Doo 850 Следекс (sm-03274)", category: "Вариатор и трансмиссия", brand: "Sledex", price: 20349, icon: "belt", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-m/14425636270.jpg", description: "Sledex — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 95, name: "Крышка топливного/масляного бака Ski-Doo Sledex", category: "Топливная система", brand: "Sledex", price: 3000, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1/6837601141.jpg", description: "Sledex — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 96, name: "Датчик стоп-сигнала SPI Ski-Doo (01-111-02)", category: "Электрика и датчики", brand: "SPI", price: 1974, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-k/14483338688.jpg", description: "SPI — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 97, name: "Ремкомплект главного тормозного цилиндра Ski-Doo G4 (SM-05404)", category: "Двигатель", brand: "Ski-Doo", price: 4095, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-m/6512488462.jpg", description: "Ski-Doo — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 98, name: "Комплект проводов для розеток Ski-Doo", category: "Электрика и датчики", brand: "Ski-Doo", price: 4500, icon: "cog", tag: "В наличии", image: "https://cdn1.ozone.ru/s3/multimedia-1-u/14425500270.jpg", description: "Ski-Doo — оригинальная запчасть для снегохода или мотоцикла, подходит для планового обслуживания и ремонта." },
  { id: 99, name: "Ботинки Klim Adrenaline Pro S GTX BOA с утеплителем Black, 11", category: "Обувь", brand: "Klim", price: 124600, icon: "boot", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/3/1/0/3107-002-000_e2c84d5372d35e1aa7392458691396d0.png", description: "Klim — товар из ассортимента SnegoRider." },
  { id: 100, name: "Скребки наста универсальные Sledex для Ski-Doo", category: "Инструменты", brand: "Sledex", price: 14700, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-12355_0b1c826bad95bd6e6dc68c06c5450209.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 101, name: "Статор Sledex для Ski-Doo (заменяет SU-01365)", category: "Двигатель", brand: "Sledex", price: 92394, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/U/0/SU-01373_8e3455b78e7ed7c11f60420a20ef570d.png", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 102, name: "Кнопка аварийной остановки двигателя в сборе с чекой Sledex для Polaris", category: "Электрика и датчики", brand: "Sledex", price: 7001, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-01564_38802ec96744f1f1e450c9259e6e928a.JPG", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 103, name: "Адаптер прикуривателя с разъемом RCA Sledex", category: "Кузов и крепления", brand: "Sledex", price: 1327, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-01200_3cb61dc19f49bce52a1a9d35c39659e3.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 104, name: "Аккумулятор 509 сменный Ignite S1 7.4 V 2600 mah Black", category: "Аксессуары", brand: "509", price: 13844, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/2/F02012100-001_557f1fe766ae9e07f17a309f62c35c99.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 105, name: "Аккумуляторный блок 509 S1 Black", category: "Аксессуары", brand: "509", price: 45030, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/2/F02011300-001_0e73f6fb403b8d0c4d341b4460e8a3e1.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 106, name: "Аккумуляторный блок 509 Black", category: "Аксессуары", brand: "509", price: 31170, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/5/0/9/509-GOG-BAT_230433b1b0137f2a3770a86950751d70.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 107, name: "Аутригер 509 Aviator 2.0 Black", category: "Подвеска и рулевое", brand: "509", price: 2932, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/2/F02008400-000_1153b52bb2588038621e90069793df17.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 108, name: "Балаклава 509 FZN Merino Black, One Size", category: "Одежда", brand: "509", price: 13844, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/1/0/F10000800-001_6b4d42e42b04f93adc3d7d20be5c6999.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 109, name: "Балаклава 509 с подогревом Black, One Size", category: "Электрика и датчики", brand: "509", price: 34634, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/1/0/F10000900-001_580dceba5bc73cf75381019f996c25ca.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 110, name: "Балаклава FXR Cold-Stop Anti-Fog Black/Hi Vis, S", category: "Одежда", brand: "FXR", price: 14038, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/2/1/221658-1065_92d57793d3b6768bd74369be0b29ad8b.png", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 111, name: "Балаклава Tobe Mid Magnet/High-vis, One Size", category: "Одежда", brand: "Tobe", price: 9296, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/5/0/250226-005_63721ae05c703f21c4652f8e4b9b810b.png", description: "Tobe — товар из ассортимента SnegoRider." },
  { id: 112, name: "Баллон для лавинных рюкзаков BCA Float 2.0 Speed", category: "Сумки и аксессуары", brand: "BCA", price: 81042, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/3/B/23B0011.1.1.1SIZ_206f1e6fddfb05916152ec0e1ef1da03.png", description: "BCA — товар из ассортимента SnegoRider." },
  { id: 113, name: "Бампер передний Sledex для Polaris 600/800", category: "Кузов и крепления", brand: "Sledex", price: 10858, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-12694_20b891f43cbe37d9bf94c3e02151ac85.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 114, name: "Барабан ручного стартера Sledex для Polaris", category: "Двигатель", brand: "Sledex", price: 6245, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-11021_32c40137534079dd33920f045b6a015f.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 115, name: "Бафф EVS Red, One Size", category: "Одежда", brand: "EVS", price: 3874, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/G/A/T/GAT20-RD_1a5bb1eeec1d238a4c4bea484682265a.jpg", description: "EVS — товар из ассортимента SnegoRider." },
  { id: 116, name: "Бафф SIXS TBX MERINOS WOOL Wool Black, One Size", category: "Одежда", brand: "SIXS", price: 6090, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/T/B/X/TBXM-NE_5373c987c2d0e10149bdf6833615966d.jpg", description: "SIXS — товар из ассортимента SnegoRider." },
  { id: 117, name: "Ботинки 509 Raid Double Boa с утеплителем Black Gum, 10", category: "Обувь", brand: "509", price: 116410, icon: "boot", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/6/F06000101-910_0437040dacc8f7becaaca54fedccea62.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 118, name: "Ботинки 509 Raid Double Boa с утеплителем Black Ops, 10", category: "Обувь", brand: "509", price: 121260, icon: "boot", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/6/F06000101-051_18ef0db84c19af227863ed82b664c929.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 119, name: "Ботинки 509 Raid Double Boa с утеплителем Black Ops, 11", category: "Обувь", brand: "509", price: 121260, icon: "boot", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/6/F06000101-051_18ef0db84c19af227863ed82b664c929.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 120, name: "Ботинки 509 Raid Double Boa с утеплителем Black Ops, 12", category: "Обувь", brand: "509", price: 121260, icon: "boot", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/6/F06000101-051_18ef0db84c19af227863ed82b664c929.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 121, name: "Ботинки 509 Raid Double Boa с утеплителем Emerald, 9", category: "Обувь", brand: "509", price: 121260, icon: "boot", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/6/F06001300-301_116321e725817de142db96b48e355bec.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 122, name: "Ботинки 509 Raid Double Boa с утеплителем Sharkskin, 10", category: "Обувь", brand: "509", price: 145512, icon: "boot", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/6/F06000101-204_44bedba2f23a8f5d46c13e235316b1c2.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 123, name: "Ботинки 509 Raid Double Boa с утеплителем Sharkskin, 11", category: "Обувь", brand: "509", price: 145512, icon: "boot", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/6/F06000101-204_44bedba2f23a8f5d46c13e235316b1c2.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 124, name: "Ботинки 509 Raid Double Boa с утеплителем Sharkskin, 8", category: "Обувь", brand: "509", price: 145512, icon: "boot", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/6/F06000101-204_44bedba2f23a8f5d46c13e235316b1c2.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 125, name: "Ботинки 509 Raid Single Boa с утеплителем Black Ops, 11", category: "Обувь", brand: "509", price: 116405, icon: "boot", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/6/F06000900-051_dd25ea71cdc0f46702c23088f2ca875f.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 126, name: "Ботинки 509 Raid Single Boa с утеплителем Black Ops, 9", category: "Обувь", brand: "509", price: 116405, icon: "boot", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/6/F06000900-051_dd25ea71cdc0f46702c23088f2ca875f.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 127, name: "Ботинки 509 Slipper с подогревом Black, 9", category: "Обувь", brand: "509", price: 45030, icon: "boot", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/6/F06001100-001_4f01b95c498d74221f35e1f2ffa2c2b6.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 128, name: "Ботинки FXR Backshift BOA с утеплителем Black, 10/12", category: "Обувь", brand: "FXR", price: 120890, icon: "boot", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/1/0/210703-1000_8d6c8619ec79a52235b0e1fd1de3ea69.jpg", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 129, name: "Ботинки FXR Backshift BOA с утеплителем Black, 12", category: "Обувь", brand: "FXR", price: 120890, icon: "boot", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/1/0/210703-1000_8d6c8619ec79a52235b0e1fd1de3ea69.jpg", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 130, name: "Ботинки FXR Elevation Dual BOA с утеплителем Black, 10/12", category: "Обувь", brand: "FXR", price: 133672, icon: "boot", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/2/0/220725-1000_4f0b72e33a6ec390cc654601084b8563.png", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 131, name: "Ботинки FXR Helium BOA с утеплителем Black/Hi Vis, 11", category: "Обувь", brand: "FXR", price: 148289, icon: "boot", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/1/0/210705-1065_7b079ebcc9c2937c4fc426d1ef4c5c7e.jpg", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 132, name: "Ботинки FXR Helium Dual BOA с утеплителем Black, 10/12", category: "Обувь", brand: "FXR", price: 168871, icon: "boot", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/1/0/210704-1000_ade297bb93aae1040949031659f46420.jpg", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 133, name: "Ботинки FXR Helium Dual BOA с утеплителем Black, 11", category: "Обувь", brand: "FXR", price: 168871, icon: "boot", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/1/0/210704-1000_ade297bb93aae1040949031659f46420.jpg", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 134, name: "Ботинки FXR Helium Dual BOA с утеплителем Black, 13", category: "Обувь", brand: "FXR", price: 168871, icon: "boot", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/1/0/210704-1000_ade297bb93aae1040949031659f46420.jpg", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 135, name: "Ботинки FXR X-Cross Pro BOA с утеплителем Black Ops, 13", category: "Обувь", brand: "FXR", price: 102960, icon: "boot", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/2/0/220707-1010_5832c584abe0a8ecf5e2fe87ec54ade8.png", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 136, name: "Ботинки FXR X-Cross Pro-Ice с утеплителем Black, 11", category: "Обувь", brand: "FXR", price: 68770, icon: "boot", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/2/0/220709-1000_b9215078c3b7b728b117a13fd1a22947.png", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 137, name: "Ботинки FXR X-Plore Short с утеплителем Black Ops, 8/10", category: "Обувь", brand: "FXR", price: 82224, icon: "boot", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/2/0/220730-1010_55f863fe0e7feadead61922cf9dff278.png", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 138, name: "Ботинки FXR X-Plore Short с утеплителем Black Ops, 9/11", category: "Обувь", brand: "FXR", price: 82224, icon: "boot", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/2/0/220730-1010_55f863fe0e7feadead61922cf9dff278.png", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 139, name: "Ботинки FXR X-Plore Short с утеплителем Black/White, 7/9", category: "Обувь", brand: "FXR", price: 65779, icon: "boot", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/2/0/220730-1001_9365c669cfe304539611369d0eb71c00.png", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 140, name: "Детские ботинки Jethwear Kids Pink, 24/25", category: "Обувь", brand: "Jethwear", price: 8924, icon: "boot", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/J/1/9/J19950-301_4c9dca731387a19e255f9e42907d6871.jpg", description: "Jethwear — товар из ассортимента SnegoRider." },
  { id: 141, name: "Ботинки Tobe Necto с утеплителем Jet Black, 12", category: "Обувь", brand: "Tobe", price: 76006, icon: "boot", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/7/0/0/700324-001_c157f40ef1f5383455fc40c0bd4401bf.jpg", description: "Tobe — товар из ассортимента SnegoRider." },
  { id: 142, name: "Ботинки Tobe Nimbus с утеплителем Jet Black, 10,5", category: "Обувь", brand: "Tobe", price: 110728, icon: "boot", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/7/0/0/700126-001_655c5bb8b7b00364295932bb0de153f0.png", description: "Tobe — товар из ассортимента SnegoRider." },
  { id: 143, name: "Ботинки Tobe Nimbus с утеплителем Jet Black, 13", category: "Обувь", brand: "Tobe", price: 110728, icon: "boot", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/7/0/0/700126-001_655c5bb8b7b00364295932bb0de153f0.png", description: "Tobe — товар из ассортимента SnegoRider." },
  { id: 144, name: "Ботинки Tobe Necto с утеплителем Jet Black, 13", category: "Обувь", brand: "Tobe", price: 76006, icon: "boot", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/7/0/0/700324-001_c157f40ef1f5383455fc40c0bd4401bf.jpg", description: "Tobe — товар из ассортимента SnegoRider." },
  { id: 145, name: "Брызговик универсальный Sledex", category: "Кузов и крепления", brand: "Sledex", price: 7860, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-12701_62eb4aa1e8cbf573c1e91c43483d359b.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 146, name: "Визор 509 Delta R3L Carbon Clear, One Size", category: "Маски и очки", brand: "509", price: 41564, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/1/F01014100-999_22bce646419597a8a7f023d1cae43afd.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 147, name: "Винты для шлема FXR Helium Black, One Size", category: "Шлемы", brand: "FXR", price: 4334, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/1/9/1/191706-0000_91d6a98aaf083ed0cf51d0e1aa7ee949.jpg", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 148, name: "Крепление рулевой колонки Sledex для Polaris, Ski-Doo", category: "Подвеска и рулевое", brand: "Sledex", price: 11767, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-08760_8000d95f07175ef5e54dee8bdb461e8b.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 149, name: "Втулка вариатора Sledex для Ski-Doo", category: "Вариатор и трансмиссия", brand: "Sledex", price: 2396, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-03267_e6fc2cc90ce1424773bc3766700ba9b1.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 150, name: "Втулка вариатора Sledex для Polaris", category: "Вариатор и трансмиссия", brand: "Sledex", price: 2938, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-03115_7e99fab9b007385a9f22e8466d032f0d.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 151, name: "Втулка шпинделя лыжи Sledex для Polaris 550/600/800/850", category: "Подвеска и рулевое", brand: "Sledex", price: 1795, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-08612A_52cb78a4eebe4191ed41fe780d381038.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 152, name: "Втулки нижнего А-образного рычага Sledex для Polaris 600/800/850 '19-'21", category: "Подвеска и рулевое", brand: "Sledex", price: 14606, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-08618_820f0cd1fbaf101fbcb762073034743c.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 153, name: "Втулки шпинделя лыжи Sledex для Polaris 550/600/800/850", category: "Подвеска и рулевое", brand: "Sledex", price: 8215, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-08612_5ca1c429b030b32bfc8cf8bbd9fa1526.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 154, name: "Датчик детонации Sledex для Ski-Doo/Polaris", category: "Электрика и датчики", brand: "Sledex", price: 11638, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-01284_d6ac3f5b44668d385445154d756c7f80.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 155, name: "Датчик стоп-сигнала Sledex для Arctic Cat/Ski-Doo (заменяет SM-01028)", category: "Электрика и датчики", brand: "Sledex", price: 11662, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-01575_8c2381417306c164ad9d9138b7e8d407.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 156, name: "Датчик температурный Sledex для Ski-Doo", category: "Электрика и датчики", brand: "Sledex", price: 4950, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-01258_29fddb3148d1a903d6ae900b1f9ea857.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 157, name: "Датчик температуры выхлопных газов Sledex для Ski-Doo", category: "Электрика и датчики", brand: "Sledex", price: 44574, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-01289_2f25942c592162a6a47d34e1a18b0349.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 158, name: "Датчик температуры выхлопных газов Sledex для Ski-Doo", category: "Электрика и датчики", brand: "Sledex", price: 22922, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-01267_f7ed588172aed874a62bf84d6c29166c.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 159, name: "Датчик температуры и давления воздуха Sledex для Ski-Doo/Polaris", category: "Электрика и датчики", brand: "Sledex", price: 7795, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-01270_eea6ba5b5b5200a6cff5db034439a7cd.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 160, name: "Демпфер лыжи Sledex для Ski-Doo (заменяет SM-08300)", category: "Подвеска и рулевое", brand: "Sledex", price: 1969, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-08302_5bcc2519be3cf19fb891387e2e4ccf91.JPG", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 161, name: "Держатели скребков наста Sledex", category: "Инструменты", brand: "Sledex", price: 1862, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-12015_fb12530be5d0aea8bc5adc978ecd36db.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 162, name: "Детские ботинки 509 Rocco Snow с утеплителем Black, 13C", category: "Обувь", brand: "509", price: 28663, icon: "boot", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/6/F06001000-001_da174723ea846fa8bf90699546806b3b.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 163, name: "Джерси защитная EVS Ballistic Pro Black, 3XL", category: "Защита тела", brand: "EVS", price: 68574, icon: "shield", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/B/A/L/BALLISTICP-BK_15ab9cc428d7f44bb84e6574d2816843.jpg", description: "EVS — товар из ассортимента SnegoRider." },
  { id: 164, name: "Жилет защитный 509 R-Mor Black, MD", category: "Защита тела", brand: "509", price: 37642, icon: "shield", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/1/2/F12000200-001_dbf4fddd8b29b3e1e801b5f320a32456.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 165, name: "Жилет защитный 509 R-Mor Black, SM", category: "Защита тела", brand: "509", price: 37642, icon: "shield", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/1/2/F12000200-001_dbf4fddd8b29b3e1e801b5f320a32456.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 166, name: "Жилет защитный 509 R-Mor Gray, 2X", category: "Защита тела", brand: "509", price: 43918, icon: "shield", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/1/2/F12000700-601_6b30d7fd918aaeb6696fe18d9d0fb3e7.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 167, name: "Жилет лавинный без баллона BCA FLOAT MTNPRO 2.0 Black/Neon Yellow, XL-2XL", category: "Снаряжение для туризма", brand: "BCA", price: 251280, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/3/D/23D7000-1-2_fa492498ecba59b572017c0ed3ea2129.jpg", description: "BCA — товар из ассортимента SnegoRider." },
  { id: 168, name: "Заклепки для ручки лыжи, комплект Sledex для Ski-Doo", category: "Подвеска и рулевое", brand: "Sledex", price: 2936, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-08352_3be9aaa4f1a31fa96a2e22afce9dfee4.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 169, name: "Замок зажигания Sledex для Polaris", category: "Двигатель", brand: "Sledex", price: 8538, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-01546_3f942613cb6cccad0af7c3297f692c32.png", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 170, name: "Крепление пластика Sledex для Ski-Doo", category: "Кузов и крепления", brand: "Sledex", price: 2066, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-12589L_47afdf13c348ea446b91cc3ab5d4f77e.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 171, name: "Крепление пластика Sledex для Ski-Doo", category: "Кузов и крепления", brand: "Sledex", price: 2086, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-12589R_be4fd5bd2f74950bca42017bed6d6a46.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 172, name: "Защита бачка ГТЦ Sledex для Ski-Doo (заменяет SM-05450)", category: "Защита тела", brand: "Sledex", price: 10193, icon: "shield", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-05450BK_b022387bfd35c2683ed5b2f035792b80.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 173, name: "Защита колена 509 R-Mor Black, 2X - 3X", category: "Защита тела", brand: "509", price: 22086, icon: "shield", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/1/2/F12000400-001_01a440fbf1dd307a6262573f15a492fa.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 174, name: "Защита колена 509 R-Mor Black, SM - MD", category: "Защита тела", brand: "509", price: 22086, icon: "shield", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/1/2/F12000400-001_01a440fbf1dd307a6262573f15a492fa.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 175, name: "Защита колена EVS Option Black, Adult", category: "Защита тела", brand: "EVS", price: 9110, icon: "shield", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/O/P/T/OPTK16-BK_bf7428038faf1481e93cd68d9ac2087e.jpg", description: "EVS — товар из ассортимента SnegoRider." },
  { id: 176, name: "Детская защита колена и голени EVS TP199 Black/Hi-Viz Yellow, Youth", category: "Защита тела", brand: "EVS", price: 36860, icon: "shield", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/T/P/1/TP199K-BK-Y_a551e5635ffb52ad5596d87fb3428b95.png", description: "EVS — товар из ассортимента SnegoRider." },
  { id: 177, name: "Защита колена и голени EVS TP199 Black / Hi-Viz Yellow, S-M", category: "Защита тела", brand: "EVS", price: 36860, icon: "shield", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/T/P/1/TP199K-BK_efda3b379e6f55cde546def8ea876e6f.png", description: "EVS — товар из ассортимента SnegoRider." },
  { id: 178, name: "Защита локтя EVS TP199 Black, S-M", category: "Защита тела", brand: "EVS", price: 21676, icon: "shield", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/T/P/1/TP199E-BK_93e9313a2673677eded8ca9ef93142a5.png", description: "EVS — товар из ассортимента SnegoRider." },
  { id: 179, name: "Защита носа 509 Kingpin Black", category: "Маски и очки", brand: "509", price: 1712, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/5/0/9/509-KINGOG-17-NM_a1dee50c211092f4320391e522254c77.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 180, name: "Изолятор подогрева ручек, комплект 2шт. Sledex", category: "Электрика и датчики", brand: "Sledex", price: 1355, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-12484_0ff8d2b54d147c428da015515d6dd0bc.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 181, name: "Инструмент для монтажа топливных коннекторов Sledex", category: "Инструменты", brand: "Sledex", price: 2426, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/U/P/1/UP-12600-1_f14cb9d4ba8a47763758307f0e5bf389.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 182, name: "Катушка зажигания Sledex для Polaris 850", category: "Двигатель", brand: "Sledex", price: 9588, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-01197_c26229a2f87ba9ea3571d5a1b14b30ff.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 183, name: "Катушка зажигания Sledex для Ski-Doo 600/850", category: "Двигатель", brand: "Sledex", price: 23198, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-01195_8a4bbb3ba8e1f5d91545b868d254c940.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 184, name: "Крепление пластика Sledex (10 шт)", category: "Кузов и крепления", brand: "Sledex", price: 920, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/U/P/1/UP-12040_28f5308bb4a6dfb647bb571e92f196a1.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 185, name: "Ключ для замены ремня вариатора Sledex для Polaris", category: "Инструменты", brand: "Sledex", price: 727, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-12322_4da6fb42b0a449f7c6e33d3779e2c0d3.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 186, name: "Ключ для замены ремня вариатора Sledex для Ski-Doo", category: "Инструменты", brand: "Sledex", price: 1459, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-12574_5b50c9d5872af8a8da9bfdda2b0ef12f.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 187, name: "Ключ свечной Sledex", category: "Инструменты", brand: "Sledex", price: 1505, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/1/2/1/12-121-01_ed627d10bc7837d81c7be47acdc7b333.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 188, name: "Ключ свечной Sledex для Ski-Doo", category: "Инструменты", brand: "Sledex", price: 9616, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-12661_0b47c2ba0387c2f35e9aaa36ae39b6fc.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 189, name: "Кнопка аварийной остановки двигателя Sledex для Polaris 850", category: "Электрика и датчики", brand: "Sledex", price: 9962, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-01581_0439952deac69b4a2a46419dfc3abdcb.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 190, name: "Кнопка реверса Sledex для Polaris", category: "Электрика и датчики", brand: "Sledex", price: 2640, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-01563_4c776fff004c09c42d0dd5f6c5c8065e.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 191, name: "Колесико для сумки Ogio Rig 9800 Pro Black/Red", category: "Сумки и аксессуары", brand: "Ogio", price: 8148, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/8/0/1/801003_998_b73a97a6cde18cfa759c2843ed2facf1.jpg", description: "Ogio — товар из ассортимента SnegoRider." },
  { id: 192, name: "Колесико для сумки Ogio Rig 9800 Pro Silver/Black", category: "Сумки и аксессуары", brand: "Ogio", price: 8148, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/8/0/1/801003_999_b95f6be226bc666c22ea55cad11207e9.jpg", description: "Ogio — товар из ассортимента SnegoRider." },
  { id: 193, name: "Колодки тормозные усиленные Sledex для Polaris", category: "Тормозная система", brand: "Sledex", price: 3784, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/0/5/1/05-152-56F_eb97f83a7def98126ec49e9acf4c576d.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 194, name: "Колодки тормозные усиленные Sledex для Ski-Doo", category: "Тормозная система", brand: "Sledex", price: 4867, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/0/5/2/05-252F_a4d77a7e34ca4ffda73594bd4421a627.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 195, name: "Колодки тормозные Sledex для Polaris", category: "Тормозная система", brand: "Sledex", price: 7314, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-05305F_db79a21c7fa0224ac619e0238fada8b9.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 196, name: "Кольцо уплотнительное масляного бака Sledex для Ski-Doo/Polaris/Arctic Cat", category: "Двигатель", brand: "Sledex", price: 1686, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-07165_107d8866112682bb3fbc068396034ee9.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 197, name: "Прокладка выхлопной системы Sledex для Polaris", category: "Двигатель", brand: "Sledex", price: 2378, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-02037_5bc2402ba655e20d21ff27853f29ed7f.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 198, name: "Кольцо уплотняющее Sledex для Polaris", category: "Двигатель", brand: "Sledex", price: 299, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-12810-1_ab7b41e8156882c58ddffdaaa4464497.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 199, name: "Комбинезон FXR Helium Lite без утеплителя Black/Flame, XL", category: "Комбинезоны", brand: "FXR", price: 210744, icon: "jacket", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/5/2/252810-1025_c71a1e7b57129d847f1a6c210a0abfea.png", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 200, name: "Комбинезон FXR Maverick Lite без утеплителя Black Ops, M", category: "Комбинезоны", brand: "FXR", price: 229194, icon: "jacket", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/3/2/232818-1010_ebc6fe74e613c2b0fa11c1955484f274.jpg", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 201, name: "Комбинезон FXR Vertical MTX Lite без утеплителя Black/Asphalt/Kash, 2XL", category: "Комбинезоны", brand: "FXR", price: 222770, icon: "jacket", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/6/2/262850-1062_8b861919672b412355b006e93349a56e.png", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 202, name: "Комбинезон Tobe Vivid V3 No Zip без утеплителя Dark Forest, XL", category: "Комбинезоны", brand: "Tobe", price: 268510, icon: "jacket", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/9/0/0/900324-004_c539dec8544f112e5ffe02b03abb175e.jpg", description: "Tobe — товар из ассортимента SnegoRider." },
  { id: 203, name: "Комбинезон Tobe Vivid V3 No Zip без утеплителя Phantom, L", category: "Комбинезоны", brand: "Tobe", price: 268510, icon: "jacket", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/9/0/0/900324-001_90b9b313e6a0fc3020773621405c9fcb.jpg", description: "Tobe — товар из ассортимента SnegoRider." },
  { id: 204, name: "Комплект роликов ведущего вариатора Sledex для Polaris (3 шт)", category: "Вариатор и трансмиссия", brand: "Sledex", price: 8848, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-03088B_2c32ded6d88b6c710a9e7919c15125ca.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 205, name: "Комплект подключения обогрева визора шлема Sledex", category: "Электрика и датчики", brand: "Sledex", price: 2844, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-01228_a6c6b6e06420a9972004bf74fb22a6f3.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 206, name: "Комплект аутригеров 509 Sinister X7 Black", category: "Подвеска и рулевое", brand: "509", price: 2932, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/2/F02014600-001_63922aa954e408b1c6bb4704f91e3533.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 207, name: "Комплект вентилятора и сетки 509 S1 Black", category: "Маски и очки", brand: "509", price: 2760, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/2/F02014700-000-001_053dd4d551cb00d29fd6428866a40286.png", description: "509 — товар из ассортимента SnegoRider." },
  { id: 208, name: "Втулки А-образного верхнего рычага Sledex для Ski-Doo", category: "Подвеска и рулевое", brand: "Sledex", price: 6308, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-08606_945ea960f06c0045e31b33e3e8b1484f.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 209, name: "Комплект подключения обогрева визора шлема Sledex", category: "Электрика и датчики", brand: "Sledex", price: 3676, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-01206_bde93dc97dcd969407c1d58dda1bc33c.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 210, name: "Комплект подключения обогрева визора шлема Sledex для Ski-Doo", category: "Электрика и датчики", brand: "Sledex", price: 6238, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-01604_7f62237e9b4b7acc051b15b06bbbdbdc.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 211, name: "Комплект подключения обогрева визора шлема Sledex", category: "Электрика и датчики", brand: "Sledex", price: 5822, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-01612_1144b11d28d0062da5efe225b98ea5ab.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 212, name: "Комплект подключения обогрева визора шлема Sledex", category: "Электрика и датчики", brand: "Sledex", price: 9361, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-01616_4bed97ca2e0e87772b45febe46530404.png", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 213, name: "Комплект подшипников ведущего вала Sledex для Ski-Doo 600/850/900", category: "Вариатор и трансмиссия", brand: "Sledex", price: 6437, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-03211_1a76424f6e145ca9e4cb1dd017b253c2.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 214, name: "Комплект прокладок выхлопного клапана Sledex для Ski-Doo", category: "Двигатель", brand: "Sledex", price: 2660, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-09537E_d65c9d23d2b2fac37a4851c6dccd7488.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 215, name: "Комплект прокладок верхний Sledex", category: "Двигатель", brand: "Sledex", price: 16200, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-09539T_34e961f2e7896de03cf1ee434910637a.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 216, name: "Комплект прокладок полный Sledex для Polaris 850", category: "Двигатель", brand: "Sledex", price: 21148, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-09539F_8f95ede424d2575107af39d7488802bc.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 217, name: "Комплект прокладок верхний Sledex для Ski-Doo", category: "Двигатель", brand: "Sledex", price: 18420, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-09537T_98be2720294404cef0b897ffb0e8fd16.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 218, name: "Комплект прокладок полный Sledex для Ski-Doo 800R P-TEK", category: "Двигатель", brand: "Sledex", price: 17802, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/0/9/7/09-711302_d61ebaf5508510c11ed9de378c6e7a56.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 219, name: "Комплект сальников коленвала Sledex для Polaris 850", category: "Двигатель", brand: "Sledex", price: 5805, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-09420_48a95074bc7e900a65346ddc3da79e44.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 220, name: "Комплект усиления направляющих Sledex для Ski-Doo", category: "Кузов и крепления", brand: "Sledex", price: 11168, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-12637_d8a5794c4581ab2510ec815a313a30b8.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 221, name: "Гель для стирки белья SIXS 100ML", category: "Аксессуары", brand: "SIXS", price: 601, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/1/1/R/11-RESOLVWEARSIXS-10_1a08cafc15293c0bcef902fb06cd4983.jpg", description: "SIXS — товар из ассортимента SnegoRider." },
  { id: 222, name: "Концевик курка дросселя  Sledex для Polaris", category: "Электрика и датчики", brand: "Sledex", price: 8198, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-01587_6116cf42485e60fd5745571b60fc68a4.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 223, name: "Комплект втулок ведущего вариатора Sledex для Ski-Doo", category: "Вариатор и трансмиссия", brand: "Sledex", price: 17062, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-03272_63c12378cbde20ca0faf43e94c52e9cb.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 224, name: "Корпус аккумулятора для очков 509 S1 Black", category: "Маски и очки", brand: "509", price: 25450, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/2/F02011300-PACK-ONLY_1d496d5ac5b93ed7b75c2f82ec7265c9.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 225, name: "Кофта FXR Helium Ride без утеплителя Slate/Grey, L", category: "Куртки", brand: "FXR", price: 29810, icon: "jacket", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/2/0/220912-5705_a12c4e91a62f88da23b5efb01e5180ea.jpg", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 226, name: "Кофта FXR Maverick без утеплителя Black/Electric Pink, S", category: "Куртки", brand: "FXR", price: 17572, icon: "jacket", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/2/1/221005-1094_71788237dfa8c0a9fed07157cd6df4ba.jpg", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 227, name: "Крепление рулевой колонки Sledex для Ski-Doo (заменяет SM-08758)", category: "Подвеска и рулевое", brand: "Sledex", price: 10888, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-08757_777e51a4b7cbcbbe73ac01deae3e7521.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 228, name: "Крепление пластика Sledex для Polaris", category: "Кузов и крепления", brand: "Sledex", price: 900, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-12433_3690e76ba28a413dc746ef33f6f1b924.JPG", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 229, name: "Крышка топливного бака Sledex для Ski-Doo/Yamaha/Arctic Cat", category: "Кузов и крепления", brand: "Sledex", price: 3346, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-07093_a3c1f0374995357183fa778e4012b37c.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 230, name: "Крышка масляного бака Sledex для Polaris, Ski-Doo, Arctic Cat, Yamaha", category: "Кузов и крепления", brand: "Sledex", price: 2904, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-07094_4bcea7821eaed202f88408365267c449.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 231, name: "Крышка топливного/масляного бака Sledex для Ski-Doo", category: "Кузов и крепления", brand: "Sledex", price: 1626, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/0/7/2/07-288-01_1edfbf2cc3bae9a348020599aeba63dd.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 232, name: "Курок газа с подогревом Sledex для Polaris", category: "Тросы и органы управления", brand: "Sledex", price: 12158, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-08559_27e3b4fb71869d332eb519c9290c1d0b.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 233, name: "Курок газа с подогревом Sledex для Ski-Doo", category: "Тросы и органы управления", brand: "Sledex", price: 8589, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-08553_4c63b28127bccc44986b630fa751a639.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 234, name: "Курок газа с подогревом Sledex для Ski-Doo", category: "Тросы и органы управления", brand: "Sledex", price: 10878, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-08558_c77f5e310548037b2c79cba11c8895ec.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 235, name: "Курок газа Sledex для Polaris", category: "Тросы и органы управления", brand: "Sledex", price: 1639, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-08149_adf4c5caab0e12cb63b03d2714ca36d6.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 236, name: "Курок газа с подогревом Sledex для Polaris 850 '19-'21", category: "Тросы и органы управления", brand: "Sledex", price: 11436, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-08557_c4a8d6edb54c94e59a4e600ec56b0471.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 237, name: "Курок газа с подогревом Sledex для Polaris (заменяет SM-08550)", category: "Тросы и органы управления", brand: "Sledex", price: 7629, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-08554_428041b2a19b697b8c1948273ced7352.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 238, name: "Термоштаны 3/4 SIXS PNCW CU Black/Red, M-L", category: "Одежда", brand: "SIXS", price: 13508, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/X/C/C/XCCU-NE_3bc675c20116d6776248cd7d2a4ba058.jpg", description: "SIXS — товар из ассортимента SnegoRider." },
  { id: 239, name: "Линза 509 Sinister X6 без подогрева Photochromatic Clear to Blue", category: "Маски и очки", brand: "509", price: 15916, icon: "shield", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/2/F02001200-801_ebee681d3f2b73aab6c6846df225b732.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 240, name: "Линза 509 Aviator 2.0 S1 Flow с подогревом Поляризация;Фотохром, Clear Tint", category: "Маски и очки", brand: "509", price: 39830, icon: "shield", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/2/F02007700-601_53cb0edd431bb4cca8af0bc02747231a.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 241, name: "Линза 509 Aviator 2.0 S1 Flow с подогревом Поляризация;Фотохром, Photochromatic Clear to Blue Tint", category: "Маски и очки", brand: "509", price: 39830, icon: "shield", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/2/F02007700-204_7e9ff1bb55a1e1082a5296a972718e48.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 242, name: "Линза 509 Revolver без подогрева Gold Mirror/Yellow Tint", category: "Маски и очки", brand: "509", price: 22740, icon: "shield", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/5/0/9/509-REVLEN-17-GD_ba09c3fe82ef7212144bc849492d7da8.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 243, name: "Линза 509 Sinister X5 Tear Off без подогрева Chrome Mirror/Yellow Tint", category: "Маски и очки", brand: "509", price: 9604, icon: "shield", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/5/0/9/509-X5LEN-13-TCY_2e28029097af0409c44b4daa4185e63f.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 244, name: "Линза 509 Sinister X5 без подогрева Blue Mirror/Orange Tint", category: "Маски и очки", brand: "509", price: 15916, icon: "shield", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/5/0/9/509-X5LEN-13-BO_1675e09394629339f2061fac74847dda.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 245, name: "Линза 509 Sinister X7 Fuzion Flow без подогрева Clear Tint", category: "Маски и очки", brand: "509", price: 21120, icon: "shield", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/2/F02013900-999_a1165ed6f89b112caf278f8b861b02a1.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 246, name: "Лопата BCA Dozer 1T Blue, OS", category: "Инструменты", brand: "BCA", price: 16924, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/3/F/23F6000-1-1_01720fb574e9558b9a7b1cca2b7a8163.jpg", description: "BCA — товар из ассортимента SnegoRider." },
  { id: 247, name: "Лопата BCA Dozer 2T Grey, OS", category: "Инструменты", brand: "BCA", price: 20830, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/3/F/23F6002-1-1_e5152e59b9ee0c03c51537296ddc1205.jpg", description: "BCA — товар из ассортимента SnegoRider." },
  { id: 248, name: "Лопата BCA DOZER 2T-S Black/Orange, OS", category: "Инструменты", brand: "BCA", price: 31246, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/3/G/23G6006-1-1_7c865f2c9f2d2b110a0fdf657f24ff45.jpg", description: "BCA — товар из ассортимента SnegoRider." },
  { id: 249, name: "Лопата Sledex One Size", category: "Инструменты", brand: "Sledex", price: 7606, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/N/W/SNW-SHVL-SLDX-513_fcf6d77a336e58960ac51a0c1eb957b6.png", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 250, name: "Лопата Sledex One Size", category: "Инструменты", brand: "Sledex", price: 7600, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/H/2/6/H26231S-004-516_44c8c464361d054b09a29b436043c9dd.png", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 251, name: "Лопата с пилой Sledex One Size", category: "Инструменты", brand: "Sledex", price: 9900, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/N/W/SNW-SHVL-SLDX-515_6b035dc05522fce38e7f578996c3dff3.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 252, name: "Наконечник рулевой Sledex для Ski-Doo", category: "Подвеска и рулевое", brand: "Sledex", price: 5130, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-08406_becaf4d6e6f6f77559293f6883bcff45.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 253, name: "Наконечник рулевой (левая резьба) Sledex для Polaris", category: "Подвеска и рулевое", brand: "Sledex", price: 4944, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-08408_4c83cf394d7b758090d2c3449605c5e2.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 254, name: "Натяжитель приводной цепи Sledex для Polaris", category: "Вариатор и трансмиссия", brand: "Sledex", price: 13164, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-03358_604bd6625eeaf81b35fc0ad7abe5522f.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 255, name: "Натяжитель цепи Sledex для Ski-Doo", category: "Вариатор и трансмиссия", brand: "Sledex", price: 7478, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-03363_bcd09f574f742a12247bb7c6ca545b81.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 256, name: "Подшипник шатуна игольчатый, нижний, Sledex для Polaris", category: "Вариатор и трансмиссия", brand: "Sledex", price: 3044, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-09500_daa641e8e698f3abb0d22cdc3e545fab.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 257, name: "Подшипник шатуна игольчатый, верхний Sledex для Ski-Doo", category: "Вариатор и трансмиссия", brand: "Sledex", price: 1634, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-09501-1_e45344b646362aa4d83c3a5504d9ebb9.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 258, name: "Носки FXR Clutch Performance Crew  (1 Pack) Black, One Size", category: "Одежда", brand: "FXR", price: 5800, icon: "jacket", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/1/1/211660-1000_333350a695c1c19c5f91223821b2f5fb.jpg", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 259, name: "Носки Jethwear Pow Black, M (39-41)", category: "Одежда", brand: "Jethwear", price: 4214, icon: "jacket", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/J/2/1/J2190-001_4ac2d9c3d826af6bce1b9938842b4a36.jpg", description: "Jethwear — товар из ассортимента SnegoRider." },
  { id: 260, name: "Носки SIXS Logo Black Carbon/Black, 36-39", category: "Одежда", brand: "SIXS", price: 3098, icon: "jacket", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/H/L/SHLG-NENE_ee9a28e7635cc67480ee782a58662a26.png", description: "SIXS — товар из ассортимента SnegoRider." },
  { id: 261, name: "Носки SIXS Logo Black/Blue, 44-47", category: "Одежда", brand: "SIXS", price: 3098, icon: "jacket", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/H/L/SHLG-NEBL_ed286bff8fa15e5551292a771f75e53f.jpg", description: "SIXS — товар из ассортимента SnegoRider." },
  { id: 262, name: "Носки SIXS Logo Black/Red, 36-39", category: "Одежда", brand: "SIXS", price: 3098, icon: "jacket", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/H/L/SHLG-NERO_2a9827c9d754596d5ee2a9dde345591b.jpg", description: "SIXS — товар из ассортимента SnegoRider." },
  { id: 263, name: "Носки SIXS Long2 Black Carbon, 36-39", category: "Одежда", brand: "SIXS", price: 3228, icon: "jacket", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/L/O/N/LON2-NE_88fa3be1a0485a754c5e48d1f299ae91.jpg", description: "SIXS — товар из ассортимента SnegoRider." },
  { id: 264, name: "Носки SIXS Merinos Socks Black/Blue Line, 40-43", category: "Одежда", brand: "SIXS", price: 4812, icon: "jacket", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/M/E/S/MESO-NELI_186cc103ceccd89a6df4e68f00c38205.jpg", description: "SIXS — товар из ассортимента SnegoRider." },
  { id: 265, name: "Носки SIXS MOT2 MERINOS Black/Grey, 40-43", category: "Одежда", brand: "SIXS", price: 5946, icon: "jacket", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/M/2/M/M2ME-NEGR_9fcd92292512c0f5dc94f4a8289e7cc9.jpg", description: "SIXS — товар из ассортимента SnegoRider." },
  { id: 266, name: "Носки SIXS Speed2 Black/Red, 40-43", category: "Одежда", brand: "SIXS", price: 5154, icon: "jacket", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/P/E/SPE2-NERO_23e9cde917520f167bce50b04a2d172a.jpg", description: "SIXS — товар из ассортимента SnegoRider." },
  { id: 267, name: "Носки SIXS Speed2 YELLOW/BLACK, 40-43", category: "Одежда", brand: "SIXS", price: 5154, icon: "jacket", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/P/E/SPE2-GINE_ef1761b1125cf9e871a167f48c4c6c75.jpg", description: "SIXS — товар из ассортимента SnegoRider." },
  { id: 268, name: "Носки SIXS Speed2 YELLOW/BLACK, 36-39", category: "Одежда", brand: "SIXS", price: 4124, icon: "jacket", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/P/E/SPE2-GINE_ef1761b1125cf9e871a167f48c4c6c75.jpg", description: "SIXS — товар из ассортимента SnegoRider." },
  { id: 269, name: "Отсекатель FXR Legion Black, One Size", category: "Аксессуары", brand: "FXR", price: 7660, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/1/1/211760-1000-00_bd9385127463e171a6c9c1265fd4bd2c.jpg", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 270, name: "Отсекатель FXR Universal Black, One Size", category: "Аксессуары", brand: "FXR", price: 7538, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/1/9/1/191700-1000_aef3f4535bdb1e7ec32db0e2257bb706.jpg", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 271, name: "Отсекатель FXR Clutch Black, One Size", category: "Аксессуары", brand: "FXR", price: 7060, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/0/1/201739-1000_812ab82b543f642f54a75c9c2ada89ad.jpg", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 272, name: "Очки 509 Aviator 2.0 S1 с подогревом Поляризация;Фотохром, Orange Pop", category: "Маски и очки", brand: "509", price: 118490, icon: "shield", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/2/F02010300-401_c16f39ec2e0f08993fd7437f092efe4a.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 273, name: "Очки 509 Aviator 2.0 S1 с подогревом Поляризация;Фотохром, Sharkskin", category: "Маски и очки", brand: "509", price: 118490, icon: "shield", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/2/F02010300-204_f364d6b517bde151b00756ba267b0db6.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 274, name: "Очки 509 Sinister X7 без подогрева Shifter Yellow", category: "Маски и очки", brand: "509", price: 38598, icon: "shield", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/2/F02012500-005_0163fdd23b835a0a27735645a2d6c525.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 275, name: "Очки 509 Sinister XL7 S1 с подогревом Поляризационная, Black Ops", category: "Маски и очки", brand: "509", price: 121608, icon: "shield", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/2/F02012900-051_0d4b897d08f0bfdab4119afc002d2e3e.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 276, name: "Очки FXR Pilot без подогрева Red", category: "Маски и очки", brand: "FXR", price: 39836, icon: "shield", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/4/3/243104-2000_bc5a27bc7e78dece8a8d5f457163523d.jpg", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 277, name: "Пальто FXR Warm-Up с утеплителем Black/Fuchsia, XL", category: "Куртки", brand: "FXR", price: 94872, icon: "jacket", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/3/0/230230-1090_c92b7b2b919ab86d002f7544c754535f.jpg", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 278, name: "Пальто FXR Warm-Up с утеплителем Black, M", category: "Куртки", brand: "FXR", price: 113846, icon: "jacket", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/5/0/250033-1000_f497409d5fa7dba053014e7bb0a4048f.png", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 279, name: "Пальто FXR Warm-Up с утеплителем Black, XL", category: "Куртки", brand: "FXR", price: 113846, icon: "jacket", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/5/0/250033-1000_f497409d5fa7dba053014e7bb0a4048f.png", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 280, name: "Перчатки FXR Fuel с утеплителем Black Ops, S", category: "Перчатки", brand: "FXR", price: 32030, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/2/0/220810-1010_d3e4f1653a2860a1c006852fbfb17a8e.jpg", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 281, name: "Перчатки Jethwear Empire Black/Pink, S", category: "Перчатки", brand: "Jethwear", price: 18296, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/J/2/2/J22142-340_1e8abe31b104a3f98efc05ee1a65d17f.jpg", description: "Jethwear — товар из ассортимента SnegoRider." },
  { id: 282, name: "Перчатки Jethwear Empire Black/Pink, XS", category: "Перчатки", brand: "Jethwear", price: 18296, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/J/2/2/J22142-340_1e8abe31b104a3f98efc05ee1a65d17f.jpg", description: "Jethwear — товар из ассортимента SnegoRider." },
  { id: 283, name: "Перчатки Klim Inversion GTX без утеплителя Asphalt/Black, MD", category: "Перчатки", brand: "Klim", price: 32492, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/3/1/5/3159-000-603_188697af12ec10d173ebb685484a2664.png", description: "Klim — товар из ассортимента SnegoRider." },
  { id: 284, name: "Перчатки 509 Backcountry с утеплителем Black Ops (2022), SM", category: "Перчатки", brand: "509", price: 25092, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/7/F07000101-003_abc3f204e5b41a508e84c0bfb45801b0.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 285, name: "Перчатки 509 Free Range с утеплителем Maroon/Teal, SM", category: "Перчатки", brand: "509", price: 39680, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/7/F07001000-102_5ae815e88fb07139e648197ce4cc6d80.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 286, name: "Перчатки 509 Free Range с утеплителем Racing Red, MD", category: "Перчатки", brand: "509", price: 35712, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/7/F07001000-101_7a2872095ac4941188e69b5ef43d6351.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 287, name: "Перчатки 509 Free Range с утеплителем Racing Red, SM", category: "Перчатки", brand: "509", price: 35712, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/7/F07001000-101_7a2872095ac4941188e69b5ef43d6351.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 288, name: "Перчатки 509 Freeride с утеплителем Black Ops (2022), XS", category: "Перчатки", brand: "509", price: 22820, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/7/F07000201-002_2e2fd4a08e11d7962449fe35a7c0182a.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 289, name: "Перчатки 509 Freeride с утеплителем Racing Red (2023), XL", category: "Перчатки", brand: "509", price: 28526, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/7/F07000202-102_b1fed4ee40eae14b466479aa9991d684.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 290, name: "Перчатки 509 Range с утеплителем Black Ops, XL", category: "Перчатки", brand: "509", price: 41814, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/7/F07000600-051_bd291d06353cdf3351d59c7d872dcadd.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 291, name: "Перчатки 509 Stoke с утеплителем Red, LG", category: "Перчатки", brand: "509", price: 25188, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/7/F07001100-101_272c4156dbc9516a2d39e121ab901492.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 292, name: "Перчатки 509 Stoke с утеплителем Red, XL", category: "Перчатки", brand: "509", price: 25188, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/7/F07001100-101_272c4156dbc9516a2d39e121ab901492.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 293, name: "Перчатки FXR Attack с утеплителем Black, XL", category: "Перчатки", brand: "FXR", price: 27644, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/3/0/230803-1000_78cfc1d78eabead8a486c3f35e741a81.jpg", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 294, name: "Перчатки FXR Cold Cross Neoprene с утеплителем Black Ops, XL", category: "Перчатки", brand: "FXR", price: 17150, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/2/0/220822-1010_586786f2d6bed6fefef756cae0e4b62b.jpg", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 295, name: "Перчатки FXR Transfer E-Tech Gauntlet с подогревом Black, S", category: "Перчатки", brand: "FXR", price: 85662, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/2/0/220806-1000_b50f805a8dfb066bf1a23fbf28fe68ed.jpg", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 296, name: "Перчатки защитные SHOWA Temres 282 Blue, 3L", category: "Перчатки", brand: "SHOWA", price: 6320, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/H/O/SHOWA282_694f5503c002bc46570c4feb6f306d13.jpg", description: "SHOWA — товар из ассортимента SnegoRider." },
  { id: 297, name: "Перчатки защитные SHOWA Temres 282 Blue, L", category: "Перчатки", brand: "SHOWA", price: 6320, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/H/O/SHOWA282_694f5503c002bc46570c4feb6f306d13.jpg", description: "SHOWA — товар из ассортимента SnegoRider." },
  { id: 298, name: "Перчатки защитные SHOWA Temres 282 Blue, LL", category: "Перчатки", brand: "SHOWA", price: 6320, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/H/O/SHOWA282_694f5503c002bc46570c4feb6f306d13.jpg", description: "SHOWA — товар из ассортимента SnegoRider." },
  { id: 299, name: "Перчатки защитные SHOWA Temres 282 Blue, M", category: "Перчатки", brand: "SHOWA", price: 6320, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/H/O/SHOWA282_694f5503c002bc46570c4feb6f306d13.jpg", description: "SHOWA — товар из ассортимента SnegoRider." },
  { id: 300, name: "Перчатки SIXS GLX MERINOS WOOL Wool Black, L/XL", category: "Перчатки", brand: "SIXS", price: 9020, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/G/L/X/GLXM-NE_66f1fcf70dc463afc47f05b30d3d6226.jpg", description: "SIXS — товар из ассортимента SnegoRider." },
  { id: 301, name: "Перчатки Tobe Capto Gauntlet V3 с утеплителем Jet Black, M", category: "Перчатки", brand: "Tobe", price: 38574, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/8/0/0/800422-001_e7cfaf8437e57b419247e11d32040fcf.jpg", description: "Tobe — товар из ассортимента SnegoRider." },
  { id: 302, name: "Перчатки Tobe Huron с утеплителем Jet Black, M", category: "Перчатки", brand: "Tobe", price: 40844, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/8/0/0/800522-001_01764fa84f7e01669873a0dae87e9812.jpg", description: "Tobe — товар из ассортимента SnegoRider." },
  { id: 303, name: "Перчатки Tobe Capto Light V2 без утеплителя Jet Black, M", category: "Перчатки", brand: "Tobe", price: 14064, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/8/0/0/800122-001_a99abbd0e08a06e6cf6c489069f15c6e.jpg", description: "Tobe — товар из ассортимента SnegoRider." },
  { id: 304, name: "Перчатки Tobe Capto Light V2 без утеплителя Jet Black, 2XL", category: "Перчатки", brand: "Tobe", price: 14064, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/8/0/0/800122-001_a99abbd0e08a06e6cf6c489069f15c6e.jpg", description: "Tobe — товар из ассортимента SnegoRider." },
  { id: 305, name: "Перчатки Tobe Capto Mid V2 с утеплителем Jet Black, L", category: "Перчатки", brand: "Tobe", price: 24900, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/8/0/0/800223-001_9ea1b38c616889881ce92c82a0f8d97b.jpg", description: "Tobe — товар из ассортимента SnegoRider." },
  { id: 306, name: "Перчатки Tobe Capto Mid V2 с утеплителем Jet Black, XL", category: "Перчатки", brand: "Tobe", price: 24900, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/8/0/0/800223-001_9ea1b38c616889881ce92c82a0f8d97b.jpg", description: "Tobe — товар из ассортимента SnegoRider." },
  { id: 307, name: "Перчатки Tobe Capto Mid V2 с утеплителем Jet Black, 2XL", category: "Перчатки", brand: "Tobe", price: 24900, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/8/0/0/800223-001_9ea1b38c616889881ce92c82a0f8d97b.jpg", description: "Tobe — товар из ассортимента SnegoRider." },
  { id: 308, name: "Перчатки Tobe Capto Mid V2 с утеплителем Jet Black, M", category: "Перчатки", brand: "Tobe", price: 24900, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/8/0/0/800223-001_9ea1b38c616889881ce92c82a0f8d97b.jpg", description: "Tobe — товар из ассортимента SnegoRider." },
  { id: 309, name: "Перчатки Tobe Capto Mid V2 с утеплителем Jet Black, S", category: "Перчатки", brand: "Tobe", price: 19920, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/8/0/0/800223-001_9ea1b38c616889881ce92c82a0f8d97b.jpg", description: "Tobe — товар из ассортимента SnegoRider." },
  { id: 310, name: "Перчатки Tobe Capto Undercuff V3 с утеплителем Jet Black, L", category: "Перчатки", brand: "Tobe", price: 30166, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/8/0/0/800322-001_72093eac39f89e91ea05c767808c616d.jpg", description: "Tobe — товар из ассортимента SnegoRider." },
  { id: 311, name: "Перчатки Tobe Capto Undercuff V3 с утеплителем Jet Black, 2XS", category: "Перчатки", brand: "Tobe", price: 24132, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/8/0/0/800322-001_72093eac39f89e91ea05c767808c616d.jpg", description: "Tobe — товар из ассортимента SnegoRider." },
  { id: 312, name: "Перчатки Tobe Heim Gauntlet с утеплителем Jet Black, XL", category: "Перчатки", brand: "Tobe", price: 40844, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/8/0/0/800623-001_0192f4936479efa1de6fc731cc73be6b.jpg", description: "Tobe — товар из ассортимента SnegoRider." },
  { id: 313, name: "Перчатки защитные SHOWA Thermal 406 Orange, L", category: "Перчатки", brand: "SHOWA", price: 3054, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/H/O/SHOWA406_a0ff646fd6f859049b00a059f415d841.jpg", description: "SHOWA — товар из ассортимента SnegoRider." },
  { id: 314, name: "Перчатки защитные SHOWA Thermal 406 Orange, XL", category: "Перчатки", brand: "SHOWA", price: 3054, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/H/O/SHOWA406_a0ff646fd6f859049b00a059f415d841.jpg", description: "SHOWA — товар из ассортимента SnegoRider." },
  { id: 315, name: "Пила складная Silky POCKETBOY 170mm 170mm", category: "Инструменты", brand: "Silky", price: 9010, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/I/L/SIL342-18_4a77134b4cdca56a8dbdda328fd7506b.png", description: "Silky — товар из ассортимента SnegoRider." },
  { id: 316, name: "Нагревательные элементы подогрева J-образных ручек Sledex", category: "Электрика и датчики", brand: "Sledex", price: 7030, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-12460_2bbfb9ed5594576362a8c4e2a72bbad6.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 317, name: "Бампер задний Sledex для Ski-Doo 380/500/550/600/700", category: "Кузов и крепления", brand: "Sledex", price: 15335, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-12467_8e2c9a9769124119bebcda8373fc7269.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 318, name: "Нагревательный элемент курка газа SM-08551 Sledex для Arctic Cat и Yamaha", category: "Электрика и датчики", brand: "Sledex", price: 4458, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-08551A_96771ceb1eabe4f2517debb7a4b0f497.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 319, name: "Подстежка комбинезона FXR 120 г с утеплителем Black, L", category: "Куртки", brand: "FXR", price: 59642, icon: "jacket", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/1/8/2/182813-1000_eb4f768555afce66bcf37968b76bb209.jpg", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 320, name: "Подстежка комбинезона FXR 120 г с утеплителем Black, M", category: "Куртки", brand: "FXR", price: 59642, icon: "jacket", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/1/8/2/182813-1000_eb4f768555afce66bcf37968b76bb209.jpg", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 321, name: "Подстежка комбинезона FXR 120 г с утеплителем Black, XL", category: "Куртки", brand: "FXR", price: 59642, icon: "jacket", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/1/8/2/182813-1000_eb4f768555afce66bcf37968b76bb209.jpg", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 322, name: "Подстежка комбинезона FXR F.A.S.T. 210г с утеплителем Black, 2", category: "Куртки", brand: "FXR", price: 44180, icon: "jacket", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/2/2/222931-1000_f1acc20f8fbcc4f47dc0f68065fde3da.jpg", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 323, name: "Подстежка комбинезона FXR F.A.S.T. 210г с утеплителем Black, M", category: "Куртки", brand: "FXR", price: 55224, icon: "jacket", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/2/2/222845-1000_42de55c8b3dcf6d3542ae8770abb971a.jpg", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 324, name: "Опора (подушка) двигателя Sledex для Ski-Doo", category: "Двигатель", brand: "Sledex", price: 4883, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-09556_231d1017584af7b06a000414e4bc064b.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 325, name: "Полукомбинезон Jethwear с утеплителем Tiedye, S", category: "Комбинезоны", brand: "Jethwear", price: 66180, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/J/2/1/J2123-211_43a7f20c16d44ece389e1fd99269e032.jpg", description: "Jethwear — товар из ассортимента SnegoRider." },
  { id: 326, name: "Комплект проводов разветвления Sledex для Ski-Doo", category: "Электрика и датчики", brand: "Sledex", price: 9086, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-01602_87d31ce70a879f2f0595c265fd8981a7.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 327, name: "Провод с разъемами RCA Sledex", category: "Электрика и датчики", brand: "Sledex", price: 1353, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-01207_fd77d3710ae627b1c4eab7fe29c0d147.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 328, name: "Прокладка выпускного коллектора Sledex для Polaris", category: "Двигатель", brand: "Sledex", price: 1808, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-02055_22c41daeb2abcb2b6911f0ebcc4e7e14.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 329, name: "Прокладка выхлопной системы Sledex для Ski-Doo", category: "Двигатель", brand: "Sledex", price: 3293, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-02061_e9b974c84e1861ab3dd57678e0cc0877.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 330, name: "Прокладка выхлопной системы Sledex для Polaris", category: "Двигатель", brand: "Sledex", price: 2550, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-02060_63017857e5b6ebf001fc8d902fc66d6d.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 331, name: "Прокладка коробки передач Sledex для Polaris", category: "Вариатор и трансмиссия", brand: "Sledex", price: 3176, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-03128_a81785f99b50e9c417fadb215dfff2e9.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 332, name: "Проставка руля 3\" универсальная Sledex", category: "Аксессуары", brand: "Sledex", price: 20824, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-08264-3_b258c9d3637a1322046c370b165a0326.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 333, name: "Пружина выхлопной системы Sledex для Polaris (10 шт)", category: "Тросы и органы управления", brand: "Sledex", price: 3914, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-02101_1e5374b973f06300aaf089831a8ab579.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 334, name: "Пружина выхлопной системы Sledex для Polaris (10 шт)", category: "Тросы и органы управления", brand: "Sledex", price: 2342, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-02012_e707331902b129eefe80695a10e04bd1.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 335, name: "Пружина задней подвески левая Sledex для Polaris 550/600/800/850", category: "Подвеска и рулевое", brand: "Sledex", price: 7540, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-04359L_e11920278d2428725eda70f91cd15677.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 336, name: "Пружина задней подвески левая Sledex для Ski-Doo", category: "Подвеска и рулевое", brand: "Sledex", price: 6682, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-04351L_48e08d6c2bd596726710a5407557709d.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 337, name: "Пружина задней подвески левая усиленная Sledex для Ski-Doo", category: "Подвеска и рулевое", brand: "Sledex", price: 5382, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-04351L-1_1dc1b6e75b3941e17963bc16f2a55c5a.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 338, name: "Пружина задней подвески правая усиленная Sledex для Ski-Doo", category: "Подвеска и рулевое", brand: "Sledex", price: 5332, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-04351R-1_44fd40a22769078546350ce622d30803.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 339, name: "Пружина задней подвески правая Sledex для Polaris 550/600/800/850", category: "Подвеска и рулевое", brand: "Sledex", price: 7464, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-04359R_7cf3b324c3b5dab3c92d2a2a9d950ab2.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 340, name: "Разветвитель RCA Sledex", category: "Кузов и крепления", brand: "Sledex", price: 884, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/U/P/0/UP-01058_83bcebc77a126ad626b1430abd86f338.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 341, name: "Разветвитель проводки Sledex для Ski-Doo REV Gen4", category: "Электрика и датчики", brand: "Sledex", price: 7626, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-01606_6a9ae2a6ac1bbdf4e6544e1b80a78286.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 342, name: "Резервуар Ogio 3L Blue", category: "Сумки и аксессуары", brand: "Ogio", price: 8068, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/1/2/2/122107_113_6d8a9034b1fac68067e51d8b2eda059d.jpg", description: "Ogio — товар из ассортимента SnegoRider." },
  { id: 343, name: "Ремкомплект вариатора Sledex; Polaris", category: "Вариатор и трансмиссия", brand: "Sledex", price: 21204, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-03087K2_4c0dd9789d6136323889b475ddd0d191.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 344, name: "Ремкомплект главного тормозного цилиндра Sledex для Arctic Cat", category: "Тормозная система", brand: "Sledex", price: 3620, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-05405_fc4bdafbc07b95d54170d0772928631f.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 345, name: "Ремкомплект роликов ведущего вариатора Sledex для Ski-Doo 600/850/900 (3 шт)", category: "Вариатор и трансмиссия", brand: "Sledex", price: 16398, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-03283_8fd3e3899eef72efd8a640f40a4d859c.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 346, name: "Ремень вариатора BRP для Ski-Doo/Can-am Ryker", category: "Вариатор и трансмиссия", brand: "BRP", price: 65396, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/4/1/7/417300571_a596cf1041b764337312a798063d8dde.png", description: "BRP — товар из ассортимента SnegoRider." },
  { id: 347, name: "Ремкомплект вариатора (широкие ролики) Sledex для Polaris", category: "Вариатор и трансмиссия", brand: "Sledex", price: 15444, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-03088_d996e25a3b281b0a9339c9c4b05fa614.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 348, name: "Ремкомплект главного тормозного цилиндра Sledex для Polaris", category: "Тормозная система", brand: "Sledex", price: 6238, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-05411_62cf7e35d87d0d6b8f23df6f4d60863d.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 349, name: "Ремкомплект опоры лыжи Sledex для Ski-Doo", category: "Подвеска и рулевое", brand: "Sledex", price: 7644, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-08351_e5e08257659ddce84241c2271f44dcc7.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 350, name: "Ремкомплект ручного стартера Sledex для Polaris", category: "Двигатель", brand: "Sledex", price: 2094, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-11022_56b7db97c400fc0b3390e04cfde8fe3d.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 351, name: "Ремкомплект ручного стартера Sledex для Polaris", category: "Двигатель", brand: "Sledex", price: 2827, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-11034_7586928301a2e9925836bbd227fb610a.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 352, name: "Ремкомплект ручного стартера Sledex для Ski-Doo", category: "Двигатель", brand: "Sledex", price: 6661, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-11031D_0d9f82be6ce5a2878852596a8d724df5.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 353, name: "Ремкомплект ручного стартера Sledex для Arctic Cat", category: "Двигатель", brand: "Sledex", price: 1895, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-11015_df72652f69a04a80955b90db56efff3b.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 354, name: "Ремкомплект помпы охлаждения Sledex для Polaris 600-800", category: "Двигатель", brand: "Sledex", price: 5988, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/1/0/7/10-721310_e9a3e3f0b2ebc484a36f63387526c0a4.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 355, name: "Комплект роликов ведомого вариатора Sledex для Polaris/Arctic Cat (2 шт)", category: "Вариатор и трансмиссия", brand: "Sledex", price: 6007, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-03106_61536077a9a25337bd01071963449485.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 356, name: "Комплект роликов ведомого вариатора Sledex для Ski-Doo (2 шт)", category: "Вариатор и трансмиссия", brand: "Sledex", price: 6053, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-03114_a1b5a7615386358e1750adf09fe77945.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 357, name: "Ролик ведущего вариатора Sledex для Ski-Doo (3 шт)", category: "Вариатор и трансмиссия", brand: "Sledex", price: 9676, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-03272B_7d4aa3e15697cec8bcf6b3bd31003858.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 358, name: "Рукавицы FXR Excursion с утеплителем Black, M", category: "Перчатки", brand: "FXR", price: 27866, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/2/0/220821-1000_a44ccbcc571bef17d1fdcc491ff2fa87.jpg", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 359, name: "Рукоятка тормоза Sledex для Polaris, Arctic Cat (заменяет SM-08151-A)", category: "Тросы и органы управления", brand: "Sledex", price: 15836, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-08584-A_aa68721d18f20f1ee46bfd50fbc94f6f.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 360, name: "Рукоятка тормоза, комплект Sledex для Polaris", category: "Тросы и органы управления", brand: "Sledex", price: 21082, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-08860_3cc17d3b619fa7ab25fcde3ccba6c975.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 361, name: "Рукоятка ручного стартера Sledex для Polaris", category: "Двигатель", brand: "Sledex", price: 1401, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-11009_b0a5cdb90b2e273db6bdb9deef977bd1.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 362, name: "Сумка 509 Revel на колесиках Heather Gray", category: "Сумки и аксессуары", brand: "509", price: 86610, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/1/1/F11000200-601_cc242a85071fd3b9b1befd8097732ae1.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 363, name: "Рюкзак BCA Stash 12 Black", category: "Сумки и аксессуары", brand: "BCA", price: 25720, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/3/K/23K0700-1-1-1_42fa40606513fb6a807e1499cb3b38d8.jpg", description: "BCA — товар из ассортимента SnegoRider." },
  { id: 364, name: "Рюкзак лавинный электрический BCA Float-E2 Turbo 25 Black, L/XL", category: "Сумки и аксессуары", brand: "BCA", price: 432606, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/3/G/23G0009-1-1-L-XL_49dae92ff8866743a1fdee09f9985f5a.jpg", description: "BCA — товар из ассортимента SnegoRider." },
  { id: 365, name: "Сальник коробки передач верхний Sledex для Ski-Doo", category: "Вариатор и трансмиссия", brand: "Sledex", price: 843, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-03351_ea1941f1e5b15739e8982054b26d51a0.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 366, name: "Комплект сальников коленвала Sledex для Polaris 600", category: "Двигатель", brand: "Sledex", price: 4813, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/0/9/5/09-55225_029e3a9db502e3af64cde8f5fb7533ae.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 367, name: "Сальник коробки передач Sledex для Ski-Doo 600/850/900", category: "Вариатор и трансмиссия", brand: "Sledex", price: 1313, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-03229_6ae7631970d7c9a1343377e7f12f7f66.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 368, name: "Склиз Garland 24 профиль для Polaris Длина: 1880 мм, цвет: черный", category: "Кузов и крепления", brand: "Garland", price: 9044, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/4/7/24-7400-0-01-01_698bf49201b738c79beaa40c2a6870d2.jpg", description: "Garland — товар из ассортимента SnegoRider." },
  { id: 369, name: "Склиз Garland 26 профиль для Ski-Doo Длина: 1651 мм, цвет: графитовый", category: "Кузов и крепления", brand: "Garland", price: 9528, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/6/6/26-6500-1-01-12_b4533864877b67d800b594781d210cc9.jpg", description: "Garland — товар из ассортимента SnegoRider." },
  { id: 370, name: "Скребки наста универсальные Sledex", category: "Инструменты", brand: "Sledex", price: 9150, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-12489_3fd342036e24a44f939ffb3e6ba108e5.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 371, name: "Скребок наста левый Sledex для Polaris и Arctic Cat", category: "Инструменты", brand: "Sledex", price: 2776, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-12599L_af09580f52bb60c001cbd8a3c1f68442.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 372, name: "Спрей водоотталкивающий Klim ReviveX Black", category: "Аксессуары", brand: "Klim", price: 8124, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/5/0/5/5053-003-000_7c61d8c400b6abf3bcc5420d483c2535.jpg", description: "Klim — товар из ассортимента SnegoRider." },
  { id: 373, name: "Стабилизатор быстросъемный Sledex для Ski-Doo", category: "Тросы и органы управления", brand: "Sledex", price: 7512, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-08451_8981d89fe73aeaacecee9cbab14d42c7.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 374, name: "Стартер ручной в сборе Sledex для Polaris", category: "Двигатель", brand: "Sledex", price: 48514, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-11037_e9bfc36a0b101b5789cc33007c691bf0.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 375, name: "Стельки Klim Gel-Stable Asphalt - Hi-Vis, 12", category: "Обувь", brand: "Klim", price: 5484, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/3/3/9/3398-000-605_210a5e2ea1bde4bde6c0d2ac70a65034.jpg", description: "Klim — товар из ассортимента SnegoRider." },
  { id: 376, name: "Стельки Klim Gel-Stable Asphalt - Hi-Vis, 13", category: "Обувь", brand: "Klim", price: 5484, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/3/3/9/3398-000-605_210a5e2ea1bde4bde6c0d2ac70a65034.jpg", description: "Klim — товар из ассортимента SnegoRider." },
  { id: 377, name: "Стельки Klim Gel-Stable Asphalt - Hi-Vis, 9", category: "Обувь", brand: "Klim", price: 5484, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/3/3/9/3398-000-605_210a5e2ea1bde4bde6c0d2ac70a65034.jpg", description: "Klim — товар из ассортимента SnegoRider." },
  { id: 378, name: "Стоп-сигнал Sledex для Ski-Doo", category: "Электрика и датчики", brand: "Sledex", price: 10444, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-01502_823a4411ed59181cb975bbf7ca64f35f.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 379, name: "Горная стропа на руль снегохода универсальная (7/8) Sledex", category: "Аксессуары", brand: "Sledex", price: 4964, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-08196_38f7693d62a3448269f5db6c869998ca.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 380, name: "Сумка Ogio Rig 9800 на колесиках Black", category: "Сумки и аксессуары", brand: "Ogio", price: 85586, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/1/2/1/121001_03_f882c370efb79ba552393de1f54bd35a.jpg", description: "Ogio — товар из ассортимента SnegoRider." },
  { id: 381, name: "Сумка с подогревом на руль Sledex для Ski-Doo", category: "Электрика и датчики", brand: "Sledex", price: 13850, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-12690-1_e956caa80728b9e1003baab0cd003709.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 382, name: "Съемник вариатора Sledex для Polaris", category: "Инструменты", brand: "Sledex", price: 7863, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-12305_e5c4c11ca3f44fcee7d3ed152da368f7.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 383, name: "Съемник вариатора Sledex для Polaris", category: "Инструменты", brand: "Sledex", price: 11126, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-12809_4c6170cd0399cc4052b81fdae08a0831.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 384, name: "Съемник пружин выхлопной системы Sledex", category: "Инструменты", brand: "Sledex", price: 2442, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-12206_645234fef47a68eff78f4384d2ef5a5a.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 385, name: "Съёмник пружинный Sledex", category: "Инструменты", brand: "Sledex", price: 6760, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/U/C/1/UC-12043_421528a559bbcc5c20b31341bb8db7c4.png", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 386, name: "Термоштаны 509 FZN Merino Black, LG", category: "Одежда", brand: "509", price: 27604, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/5/F05000400-001_e88a0aba0815ef78cd286dee9c855120.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 387, name: "Термокофта SIXS TS13W CU Black/Red, 3XL-4XL", category: "Одежда", brand: "SIXS", price: 23682, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/1/3/C/13CU-NE_84fccde6fa7d1d99a628368cf2a19332.jpg", description: "SIXS — товар из ассортимента SnegoRider." },
  { id: 388, name: "Термокофта SIXS TS2W CU Black/Red, M-L", category: "Одежда", brand: "SIXS", price: 20610, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/W/C/2WCU-NE_638c93dc624abed5cbe09f2e3ab46dd8.jpg", description: "SIXS — товар из ассортимента SnegoRider." },
  { id: 389, name: "Термокофта SIXS TS2W CU Black/Red, XL-2XL", category: "Одежда", brand: "SIXS", price: 20610, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/W/C/2WCU-NE_638c93dc624abed5cbe09f2e3ab46dd8.jpg", description: "SIXS — товар из ассортимента SnegoRider." },
  { id: 390, name: "Термокофта SIXS TS3W CU Black/Red, M/L", category: "Одежда", brand: "SIXS", price: 22272, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/3/W/C/3WCU-NE_24a9450fd722771695aed76b6742fcc6.jpg", description: "SIXS — товар из ассортимента SnegoRider." },
  { id: 391, name: "Термокофта SIXS TS3W CU Black/Red, XL/2XL", category: "Одежда", brand: "SIXS", price: 22272, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/3/W/C/3WCU-NE_24a9450fd722771695aed76b6742fcc6.jpg", description: "SIXS — товар из ассортимента SnegoRider." },
  { id: 392, name: "Термокофта Tobe Vidi Glacier Blossom, M", category: "Одежда", brand: "Tobe", price: 15732, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/4/1/0/410323-006_bf04b93de4aa5f354729847af83186b2.jpg", description: "Tobe — товар из ассортимента SnegoRider." },
  { id: 393, name: "Термоштаны FXR Elevation Tech с утеплителем Black Ops, S", category: "Одежда", brand: "FXR", price: 17812, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/1/1/211131-1010_2e812be47f5099f02aa58dcb9cc71f19.jpg", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 394, name: "Термоштаны FXR Pyro Thermal Black, XL", category: "Одежда", brand: "FXR", price: 10602, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/4/1/241309-1000_703c6acb89788296034b8d5af2b659d1.jpg", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 395, name: "Детские леггинсы SIXS K PNX 4-season Black Carbon, 8Y", category: "Защита тела", brand: "SIXS", price: 6094, icon: "shield", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/7/K/P/7-KPNX-10_c1fcd77d4758f1b6ade42ca39bee5287.jpg", description: "SIXS — товар из ассортимента SnegoRider." },
  { id: 396, name: "Леггинсы SIXS PNX 4-season DARK RED, S", category: "Защита тела", brand: "SIXS", price: 9622, icon: "shield", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/1/P/N/1-PNX-08_8a86c58d72e362f4d35cf76eb282a1a7.jpg", description: "SIXS — товар из ассортимента SnegoRider." },
  { id: 397, name: "Термоштаны SIXS PNXW CU Black/Red, 3XL-4XL", category: "Одежда", brand: "SIXS", price: 14184, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/X/W/C/XWCU-NE_25eeb39e3b0ff5480e933f22ebc33696.jpg", description: "SIXS — товар из ассортимента SnegoRider." },
  { id: 398, name: "Термоштаны SIXS PNXW CU Black/Red, M-L", category: "Одежда", brand: "SIXS", price: 18288, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/X/W/C/XWCU-NE_25eeb39e3b0ff5480e933f22ebc33696.jpg", description: "SIXS — товар из ассортимента SnegoRider." },
  { id: 399, name: "Термоштаны Tobe Vidi Jet Black, S", category: "Одежда", brand: "Tobe", price: 13312, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/4/1/0/410423-001_ec918a742c494a8024302163086e709b.jpg", description: "Tobe — товар из ассортимента SnegoRider." },
  { id: 400, name: "Толстовка 509 Legacy Blue Pop Corn, XS", category: "Одежда", brand: "509", price: 20512, icon: "jacket", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/9/F09014700-202_97bbf80619e7a904e0588eacaab14bfe.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 401, name: "Толстовка FXR Altitude Tech Zip-Up Black Ops, 2XL", category: "Одежда", brand: "FXR", price: 31344, icon: "jacket", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/4/1/241138-1010_a291cc98629756bceb102a523948f090.jpg", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 402, name: "Топливные коннекторы Sledex", category: "Топливная система", brand: "Sledex", price: 2088, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/U/P/1/UP-12600_be7e448aa690eb36d1c63675636d2ea8.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 403, name: "Рукоятка тормоза Sledex для Ski-Doo", category: "Тросы и органы управления", brand: "Sledex", price: 6928, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-08586-A_50a63f01261773e48ae52bd0c6e546c0.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 404, name: "Рукоятка с комплектом стояночного тормоза Sledex для Ski-Doo", category: "Тросы и органы управления", brand: "Sledex", price: 9771, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-08586_caa2eddb558117cc5a1481801edfda70.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 405, name: "Рукоятка тормоза с подогревом, комплект Sledex для Ski-Doo", category: "Тросы и органы управления", brand: "Sledex", price: 30430, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-08582_0b52300f8a368f3426f40ee48f68b5ac.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 406, name: "Трос выпускного клапана Sledex для Ski-Doo", category: "Тросы и органы управления", brand: "Sledex", price: 9324, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-05280_2e063a053bf06eb29e1ff5c56bf96b5f.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 407, name: "Трос ручного стартера Sledex для Polaris", category: "Двигатель", brand: "Sledex", price: 1061, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-11033B_f6bd9e311a83cfd3df31652e6c86a838.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 408, name: "Трос выхлопного клапана Sledex для Polaris 800", category: "Тросы и органы управления", brand: "Sledex", price: 9480, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-05296_0c2d7e0ec18446018d918596d970d12a.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 409, name: "Трос выхлопного клапана Sledex для Polaris", category: "Тросы и органы управления", brand: "Sledex", price: 11588, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-05185_8cb33a033f07896ae1ee3a38d0d2519c.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 410, name: "Трос газа Sledex для Ski-Doo", category: "Тросы и органы управления", brand: "Sledex", price: 4208, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-05274_1559c92efeb726a84327132cd75f3726.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 411, name: "Трос газа Sledex для Ski-Doo", category: "Тросы и органы управления", brand: "Sledex", price: 2148, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-05230_c32cfbe1e5d6dde9bad8a0c594b7b506.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 412, name: "Трос газа Sledex для Polaris", category: "Тросы и органы управления", brand: "Sledex", price: 3444, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-05186_df5fcf377d8e45ee20656491e40af4ab.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 413, name: "Трос газа Sledex для Polaris 850", category: "Тросы и органы управления", brand: "Sledex", price: 3960, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-05284_85e60dfc40c4baae11871a4cce72e3e4.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 414, name: "Трос газа Sledex для Polaris", category: "Тросы и органы управления", brand: "Sledex", price: 2902, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-05258_07053e4398bb3d84c93e87a70d822f9f.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 415, name: "Трос ручного стартера Sledex для Polaris", category: "Двигатель", brand: "Sledex", price: 10900, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-11033B-1_c966296d01b0a9089ebe9f207351f8be.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 416, name: "Трос ручного стартера Sledex для Ski-Doo", category: "Двигатель", brand: "Sledex", price: 1265, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-11031C_8c3af60d4d831d271bf67eb053ecae4b.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 417, name: "Тросик BOA 150 см Артикул: B1532", category: "Тросы и органы управления", brand: "BOA", price: 1663, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/B/1/5/B1532_2e958848d93c8e8ff027f0c2c6b0327c.jpg", description: "BOA — товар из ассортимента SnegoRider." },
  { id: 418, name: "Тросик BOA 90 см Артикул: B1526", category: "Тросы и органы управления", brand: "BOA", price: 1663, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/B/1/5/B1526_8cb31bcef5987a87f10f9403dcb86ac6.jpg", description: "BOA — товар из ассортимента SnegoRider." },
  { id: 419, name: "Тросик BOA FXR BOA SS2 Black, 80 cm, Артикул: 230752-1000-08", category: "Тросы и органы управления", brand: "FXR", price: 2642, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/3/0/230752-1000_ac2caa337d6ce663844f86ed7cc7328b.jpg", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 420, name: "Устройство зарядное 509 Black", category: "Аксессуары", brand: "509", price: 6914, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/2/F02005200-000-000_aae67169b47faf1cd574af33acdfc3bf.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 421, name: "Ушки дыхательной маски шлема FXR Helium Black, One Size", category: "Шлемы", brand: "FXR", price: 3314, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/1/9/1/191708-0000_33545afbf28fe27dab184c2401fdb97d.jpg", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 422, name: "Крепление пластика Sledex для Arctic Cat/Yamaha/Polaris (заменяет SM-12632)", category: "Кузов и крепления", brand: "Sledex", price: 2257, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-12630_30488d7a7b5b7f1e8c79f55d6ddb5904.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 423, name: "Крепление пластика Sledex для Polaris", category: "Кузов и крепления", brand: "Sledex", price: 2847, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-12556_314963cffbb00e9c498fee01bda13273.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 424, name: "Фильтр заборный топливного насоса Sledex для Polaris", category: "Топливная система", brand: "Sledex", price: 7314, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-07362_c3795bced06185b4c878e39059bce6cc.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 425, name: "Фильтр топливный Sledex для Ski-Doo", category: "Топливная система", brand: "Sledex", price: 2229, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-07355_5d923b37454e1c0002b67c556c2c5892.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 426, name: "Фильтр топливный Sledex для Ski-Doo", category: "Топливная система", brand: "Sledex", price: 5038, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-07349_1f9a336f2e16c632f1ca5816d9609c17.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 427, name: "Стоп-сигнал Sledex для Polaris", category: "Электрика и датчики", brand: "Sledex", price: 8258, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-01252_6ae80f59ebbdc5055892e3e85ff14c65.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 428, name: "Футболка Klim K Corp Black - Yellow, SM", category: "Одежда", brand: "Klim", price: 9480, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/3/7/7/3778-000-120-000_99201ab6ba86370363b3820dfdf51f26.png", description: "Klim — товар из ассортимента SnegoRider." },
  { id: 429, name: "Футляр для очков 509 Hard Black", category: "Маски и очки", brand: "509", price: 9450, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/2/F02010600-001_d2be6d45c7af9bc2953d394444e329c9.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 430, name: "Электронная чека безопасности Sledex для Ski-Doo 600/800/850", category: "Электрика и датчики", brand: "Sledex", price: 10110, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-01576_c5aa4df6bd6048eb923997c574646855.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 431, name: "Кнопка аварийной остановки двигателя Sledex для Polaris", category: "Электрика и датчики", brand: "Sledex", price: 12282, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-01586_7c4e6b55c4ca2e61c4db6ef5b84d787c.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 432, name: "Шапка 509 Sledhart Black Gum, One Size", category: "Головные уборы", brand: "509", price: 7182, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/9/F09012900-000-910_b36c323e169e93d40f9f691fbe7ee7b8.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 433, name: "Шапка SIXS BEANIE Black, One Size", category: "Головные уборы", brand: "SIXS", price: 5026, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/B/E/A/BEANIE-BL_0814a11d0469d093d92a830269c77fd4.jpg", description: "SIXS — товар из ассортимента SnegoRider." },
  { id: 434, name: "Опора шаровая Sledex для Ski-Doo", category: "Подвеска и рулевое", brand: "Sledex", price: 5240, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-08507_631426bb019d83922e6b9827de6a42d3.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 435, name: "Опора шаровая верхнего рычага Sledex для Polaris", category: "Подвеска и рулевое", brand: "Sledex", price: 4471, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-08502_e47e9e1cf679fa790411b2c344e22e4d.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 436, name: "Опора шаровая Sledex для Ski-Doo", category: "Подвеска и рулевое", brand: "Sledex", price: 5260, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-08506_809219e2788d99845aa400095baaa028.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 437, name: "Опора шаровая верхнего рычага Sledex для Ski-Doo", category: "Подвеска и рулевое", brand: "Sledex", price: 4619, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-08500_a23e18f91f3a65b58184535a022a2962.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 438, name: "Самовсасывающий шланг для перекачки топлива/жидкости Sledex", category: "Инструменты", brand: "Sledex", price: 3258, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/U/P/0/UP-07000_0cfc086ba5cee8d28ddd86ac1399e5cc.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 439, name: "Шлем 509 Delta R3L Carbon с подогревом Vermillion Ops, XS", category: "Шлемы", brand: "509", price: 128618, icon: "helmet", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/1/F01005101-102_c9ce92d372cd40acd9d4a7476731e8e5.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 440, name: "Шлем 509 Delta R3L Carbon с подогревом Vermillion Ops, SM", category: "Шлемы", brand: "509", price: 160772, icon: "helmet", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/1/F01005101-102_c9ce92d372cd40acd9d4a7476731e8e5.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 441, name: "Шлем 509 Tactical 2.0 Sharkskin, XL", category: "Шлемы", brand: "509", price: 59222, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/1/F01012200-204_913b9c68a211b055bf8257aba9028ee7.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 442, name: "Шлем Tobe T7 без подогрева Tekno, XL", category: "Электрика и датчики", brand: "Tobe", price: 116480, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/6/0/0/600724-503_e850b55452d8e8fd163092acc3b138a7.png", description: "Tobe — товар из ассортимента SnegoRider." },
  { id: 443, name: "Шлем Tobe T9 Carbon без подогрева Ade, L", category: "Электрика и датчики", brand: "Tobe", price: 192492, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/6/0/0/600924-502_649c4854630f3ec0183a695a0e2002bc.png", description: "Tobe — товар из ассортимента SnegoRider." },
  { id: 444, name: "Шнур чеки безопасности Sledex для Ski-Doo", category: "Электрика и датчики", brand: "Sledex", price: 8560, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-01577_203f864fb0a5254604e44a3adaacb0a2.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 445, name: "Шорты женские Jethwear Cruiser с утеплителем Black, S", category: "Одежда", brand: "Jethwear", price: 11184, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/J/2/1/J2152-001_e7a70218af88386dc13f7508f604c002.jpg", description: "Jethwear — товар из ассортимента SnegoRider." },
  { id: 446, name: "Шорты Jethwear Cruiser с утеплителем Black, S", category: "Одежда", brand: "Jethwear", price: 16776, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/J/2/1/J2151-001_dee2d6dc1cdc709d76bddb6c063db89d.jpg", description: "Jethwear — товар из ассортимента SnegoRider." },
  { id: 447, name: "Шорты защитные 509 R-Mor Black, 2X", category: "Защита тела", brand: "509", price: 27704, icon: "shield", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/1/2/F12000300-001_7a211f56c1462447692183927c8fd381.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 448, name: "Шорты защитные 509 R-Mor Black, XL", category: "Защита тела", brand: "509", price: 27704, icon: "shield", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/1/2/F12000300-001_7a211f56c1462447692183927c8fd381.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 449, name: "Щуп лавинный BCA STEALTH Carbon Black, 300cm", category: "Снаряжение для туризма", brand: "BCA", price: 29944, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/3/H/23H5120.1.1.1SIZ_d8ea9645a723e517269f257f7daa04c6.png", description: "BCA — товар из ассортимента SnegoRider." },
  { id: 450, name: "Нагревательные элементы подогрева прямых ручек Sledex", category: "Электрика и датчики", brand: "Sledex", price: 5750, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/1/SM-12474_30efd8d3498f1213203166a7e5a666bf.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 451, name: "Ботинки FXR Helium Dual BOA с утеплителем, (Black 8/10)", category: "Обувь", brand: "FXR", price: 168871, icon: "boot", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/1/0/210704-1000_ade297bb93aae1040949031659f46420.jpg", description: "FXR — товар из ассортимента SnegoRider." },
  { id: 452, name: "Втулки А-образного нижнего рычага Sledex для Polaris", category: "Подвеска и рулевое", brand: "Sledex", price: 10552, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-08610_a7e952a938dca85e3ca3975477dd475b.JPG", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 453, name: "Втулки шпинделя лыжи Sledex для Polaris 550/600/800/850", category: "Подвеска и рулевое", brand: "Sledex", price: 8215, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-08612_5ca1c429b030b32bfc8cf8bbd9fa1526.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 454, name: "Коньки лыж Sledex для Lynx.Ski-Doo", category: "Подвеска и рулевое", brand: "Sledex", price: 20012, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/no_img.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 455, name: "Курок газа с подогревом Sledex Polaris 850 19-21 26г", category: "Тросы и органы управления", brand: "Sledex", price: 11436, icon: "cog", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/S/M/0/SM-08557_c4a8d6edb54c94e59a4e600ec56b0471.jpg", description: "Sledex — товар из ассортимента SnegoRider." },
  { id: 456, name: "Перчатки 509 Backcountry c утеплителем (Black Ops (2022) 2XL)", category: "Перчатки", brand: "509", price: 25092, icon: "glove", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/F/0/7/F07000101-003_abc3f204e5b41a508e84c0bfb45801b0.jpg", description: "509 — товар из ассортимента SnegoRider." },
  { id: 457, name: "Шорты Jethwear Cruiser с утеплителем (Black XL)", category: "Одежда", brand: "Jethwear", price: 16776, icon: "jacket", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/J/2/1/J2151-001_dee2d6dc1cdc709d76bddb6c063db89d.jpg", description: "Jethwear — товар из ассортимента SnegoRider." },
  { id: 458, name: "Шорты Jethwear Cruiser с утеплителем (Black XXL)", category: "Одежда", brand: "Jethwear", price: 16776, icon: "jacket", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/J/2/1/J2151-001_dee2d6dc1cdc709d76bddb6c063db89d.jpg", description: "Jethwear — товар из ассортимента SnegoRider." },
  { id: 459, name: "Щуп Лавинный BCA Stealth (Orange/Blue, 330cm)", category: "Снаряжение для туризма", brand: "BCA", price: 34256, icon: "shield", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/3/H/23H5000-1-1-1_144874750e62da60339e42ee2e7ffdbd.jpg", description: "BCA — товар из ассортимента SnegoRider." },
  { id: 460, name: "Щуп Лавинный BCA Stealth 270 (Orange/Blue)", category: "Снаряжение для туризма", brand: "BCA", price: 34256, icon: "shield", tag: "В наличии", image: "https://b2b.topsports.ru/img/original/2/3/H/23H5000-1-1-1_144874750e62da60339e42ee2e7ffdbd.jpg", description: "BCA — товар из ассортимента SnegoRider." },
];

const CATEGORY_ORDER = [
  "Двигатель", "Вариатор и трансмиссия", "Подвеска и рулевое", "Тормозная система", "Топливная система",
  "Электрика и датчики", "Тросы и органы управления", "Кузов и крепления", "Запчасти",
  "Линзы и визоры", "Маски и очки", "Шлемы", "Комбинезоны", "Куртки", "Одежда",
  "Перчатки", "Обувь", "Защита тела", "Головные уборы", "Сумки и аксессуары",
  "Снаряжение для туризма", "Инструменты", "Аксессуары",
];
const CATEGORIES = CATEGORY_ORDER.filter((c) => PRODUCTS.some((p) => p.category === c));
const BRANDS = [...new Set(PRODUCTS.map((p) => p.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b));
/* Эти бренды скрыты из бокового фильтра по просьбе — сами товары остаются в каталоге и доступны через раздел/поиск */
const HIDDEN_FROM_BRAND_FILTER = ["ODI", "OGIO", "Ski-Doo BRP"];
const SIDEBAR_BRANDS = BRANDS.filter((b) => !HIDDEN_FROM_BRAND_FILTER.includes(b));

/* ============ Объединение вариантов размера в одну карточку + удаление дублей ============ */
const SIZE_TOKENS = ["XXXL", "XXL", "XL", "L", "M", "S"];
const STANDARD_SIZES = ["S", "M", "L", "XL"];

function extractSize(name) {
  const parens = [...name.matchAll(/\(([^()]*)\)/g)];
  for (const m of parens) {
    const tokens = m[1].split(/[\s,/]+/).map((t) => t.trim()).filter(Boolean);
    for (const t of tokens) {
      const tu = t.toUpperCase();
      if (SIZE_TOKENS.includes(tu)) return tu;
    }
  }
  // Числовые размеры без скобок в конце названия, например "..., 11" или "..., 10/12"
  const numMatch = name.match(/,\s*(\d{1,2}(?:\/\d{1,2})?)\s*$/);
  if (numMatch) return numMatch[1];
  return null;
}
function baseProductName(name) {
  let n = name.replace(/\s*\([^()]*\)/g, "");
  n = n.replace(/,\s*\d{1,2}(?:\/\d{1,2})?\s*$/, "");
  return n.trim();
}

function buildCatalogItems(products) {
  // 1. Убираем товары-дубликаты с одинаковым названием — оставляем тот, что добавлен позже (больше id)
  const byName = new Map();
  for (const p of products) {
    const existing = byName.get(p.name);
    if (!existing || p.id > existing.id) byName.set(p.name, p);
  }
  const deduped = [...byName.values()];

  // 2. Группируем по (базовое название без размера, бренд) — если найдено 2+ размеров, объединяем в одну карточку
  const groups = new Map();
  const standalone = [];
  for (const p of deduped) {
    const size = extractSize(p.name);
    if (size) {
      const key = baseProductName(p.name) + "||" + p.brand;
      if (!groups.has(key)) groups.set(key, { key, base: baseProductName(p.name), brand: p.brand, bySize: new Map() });
      const g = groups.get(key);
      const existing = g.bySize.get(size);
      if (!existing || p.id > existing.id) g.bySize.set(size, p);
    } else {
      standalone.push(p);
    }
  }

  const merged = [];
  for (const g of groups.values()) {
    const entries = [...g.bySize.entries()];
    if (entries.length >= 2) {
      const withImage = entries.find(([, p]) => p.image) || entries[0];
      const rep = withImage[1];
      merged.push({
        isGroup: true,
        key: g.key,
        name: g.base,
        brand: g.brand,
        category: rep.category,
        icon: rep.icon,
        tag: rep.tag,
        image: rep.image,
        description: rep.description,
        price: Math.min(...entries.map(([, p]) => p.price)),
        sizes: entries.map(([size, p]) => ({ size, id: p.id, price: p.price, image: p.image, tag: p.tag })),
      });
    } else {
      standalone.push(entries[0][1]);
    }
  }

  return [...merged, ...standalone];
}

const CATALOG_ITEMS = buildCatalogItems(PRODUCTS);

/* ============ URL-адреса для товаров/категорий/брендов (для SEO) ============ */
function findCatalogItemByUrlId(idStr) {
  const decoded = decodeURIComponent(idStr);
  const asNum = Number(decoded);
  if (!Number.isNaN(asNum)) {
    const found = CATALOG_ITEMS.find((p) => !p.isGroup && p.id === asNum);
    if (found) return found;
  }
  return CATALOG_ITEMS.find((p) => p.isGroup && p.key === decoded) || null;
}
function urlForItem(item) {
  return item.isGroup ? `/product/${encodeURIComponent(item.key)}` : `/product/${item.id}`;
}
function parseRoute(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return { page: "home" };
  if (parts[0] === "product" && parts[1]) {
    const item = findCatalogItemByUrlId(parts[1]);
    return { page: "home", detailItem: item || null };
  }
  if (parts[0] === "catalog") {
    if (parts[1] === "category" && parts[2]) {
      return { page: "catalog", catalogViewMode: "category", catalogSelected: decodeURIComponent(parts[2]) };
    }
    if (parts[1] === "brand" && parts[2]) {
      return { page: "catalog", catalogViewMode: "brand", catalogSelected: decodeURIComponent(parts[2]) };
    }
    return { page: "catalog" };
  }
  if (parts[0] === "school") return { page: "school" };
  if (parts[0] === "account") return { page: "account" };
  if (parts[0] === "requisites") return { page: "requisites" };
  if (parts[0] === "offer") return { page: "offer" };
  if (parts[0] === "privacy") return { page: "privacy" };
  return { page: "home" };
}


/* Логотипы для строки брендов на главной — только реальные бренды с загруженными логотипами, единый размер */
const BRAND_LOGOS = {
  "509": "data:image/png;base64,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",
  "BRP": "data:image/png;base64,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",
  "Polaris": "data:image/png;base64,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",
  "FXR": "data:image/png;base64,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QQEeeOCBQa64/xad3NxcWJYFn8836J59Ph++/fZbVFZWOlOVoRZLInXVXm14OzqEBQp2g8Xe4PnyGV1ZYLAJiGN976qxKxvfGWOAEQRoYLyTW1q9kpFoJSnS2kpKSvDjjz+GPG78+PGoqKhwfbVF/q3rOnbt2oU5c+bANE3P+w4EAli8eDEyMzPR0dEx6Hnk3z09PcN+Jq++kxU1r18UcAXMEpKgTb4NLGEsEEanEwha/yIlA2AZYLEJAzoqKSkJGRkZg5IdGe8SEhKiBvfUqVM4duwYsrKyPOe8QgisW7cON954o+c6r3Ttd955JwKBgPOmotvea9M08e6776KiogIzZswYtMYsP6enpw/7ubz6Tt7fuHHjXMusf7I/4WCaJnw+37CSsZEeI68ra+rXg/7sf6NjOOvI1+PvdCjAf+ZSv5OlACspwEoKsJICrKQAKynASgqwAqykACspwEoKsJICrKQAKynACrCSAqykACspwEoKsJICrKQAKynACrCSAqykACspwEoKsJICrKQAK8BKCrCSAqykACspwEoKsJICrAArKcBKCrDS9aj/B4f9sJuEfYz9AAAAAElFTkSuQmCC",
  "EVS": "data:image/png;base64,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",
  "Klim": "data:image/png;base64,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",
  "Sledex": "data:image/webp;base64,UklGRlIzAABXRUJQVlA4IEYzAAAwHAOdASqxBrEGPmEwmEikIyKhINR4KIAMCWlu/Ax9TA/8s9oT2+T8XvJ9oVM9n0/jPyR/Lzt2uW+7v4uZndzD/eftY+aH7O+zD7mfcQ/Rj+6/1PsNeZT9g/1S95f0u/6j1Bf6r/WOtR9Aj9lvS5/ZL4X/25/Zj2gv//rK/2z/G/5zwjfs/+S/u/VB+Xv1D9qfmWwH2k/yz7f/zP8H+0vzN/qO9v5ZahH4j/MPpl+oJ7e4IxO8E/EA/m/9h4q78L/xvYA8pr+//9P+W/zvqn+mP/P/pvgN/nP9s/X720vXX+y//691D9Sf/+CSTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJ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48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHjx48ePHj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",
  "SIXS": "data:image/webp;base64,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",
  "Tobe": "data:image/jpeg;base64,/9j/7AARRHVja3kAAQAEAAAAPAAA/+EDemh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjkzNzJmY2UxLTljZjYtMmE0MC05ZWY0LWY2MmRjMTlhOTJlYSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3QkZENUVERUY1OEUxMUU3QjEyM0ZBODhCM0NDOUJCMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3QkZENUVEREY1OEUxMUU3QjEyM0ZBODhCM0NDOUJCMyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ZTQ3MjcyYzktZDkzNi04MDRiLTg2NGItMWQzNTY3ZDYwMTdhIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjkzNzJmY2UxLTljZjYtMmE0MC05ZWY0LWY2MmRjMTlhOTJlYSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFj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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/9k=",
  "Ski-Doo": "data:image/webp;base64,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",
};

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
const ProductImage = ({ src, alt, icon, color, zoom }) => {
  const [broken, setBroken] = useState(false);
  if (!src || broken) return <PhotoPlaceholder icon={icon} color={color} />;
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setBroken(true)}
      className={zoom ? "st-card-img" : undefined}
      style={{ width: "100%", height: "100%", objectFit: "contain", background: "#FFFFFF" }}
    />
  );
};

/* ============ Main component ============ */
export default function Shop() {
  const [page, setPage] = useState("home"); // home | catalog | school
  const [detailItem, setDetailItem] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [catalogSelected, setCatalogSelected] = useState(null); // выбранная категория или бренд внутри "Каталог"
  const [catalogViewMode, setCatalogViewMode] = useState("category"); // category | brand
  const [catFilter, setCatFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState({}); // id -> qty
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState("cart"); // cart | form | done
  const [flash, setFlash] = useState(null);
  const [orderForm, setOrderForm] = useState({ name: "", phone: "", address: "" });

  /* ===== Личный кабинет (Supabase auth) ===== */
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // login | signup
  const [authForm, setAuthForm] = useState({ email: "", password: "", name: "", phone: "" });
  const [authError, setAuthError] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [myOrders, setMyOrders] = useState([]);

  useEffect(() => {
    if (!supabaseEnabled) return;
    supabase.auth.getSession().then(({ data }) => setUser(data.session ? data.session.user : null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session ? session.user : null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabaseEnabled || !user) { setMyOrders([]); return; }
    supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => { if (!error && data) setMyOrders(data); });
  }, [user, page]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success") {
      setCartOpen(true);
      setCheckoutStep("paid");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (detailItem && detailItem.isGroup) {
      setSelectedSize(detailItem.sizes[0].size);
    } else {
      setSelectedSize(null);
    }
  }, [detailItem]);

  /* ============ Синхронизация с адресной строкой (для SEO) ============ */
  const applyRoute = (route) => {
    setPage(route.page);
    if ("catalogSelected" in route) setCatalogSelected(route.catalogSelected);
    if ("catalogViewMode" in route) setCatalogViewMode(route.catalogViewMode);
    if (route.catalogViewMode === "category" && route.catalogSelected) { setCatFilter(route.catalogSelected); setBrandFilter("all"); }
    if (route.catalogViewMode === "brand" && route.catalogSelected) { setBrandFilter(route.catalogSelected); setCatFilter("all"); }
    if ("detailItem" in route) setDetailItem(route.detailItem);
  };

  useEffect(() => {
    applyRoute(parseRoute(window.location.pathname));
    const onPopState = () => applyRoute(parseRoute(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const goTo = (path, updater) => {
    window.history.pushState({}, "", path);
    updater();
  };

  const closeDetail = () => {
    let path = "/";
    if (page === "catalog") {
      if (catalogSelected) {
        path = catalogViewMode === "category"
          ? `/catalog/category/${encodeURIComponent(catalogSelected)}`
          : `/catalog/brand/${encodeURIComponent(catalogSelected)}`;
      } else {
        path = "/catalog";
      }
    }
    goTo(path, () => setDetailItem(null));
  };

  useEffect(() => {
    const setMeta = (attr, key, content) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    const setJsonLd = (data) => {
      let el = document.getElementById("jsonld-product");
      if (data) {
        if (!el) {
          el = document.createElement("script");
          el.type = "application/ld+json";
          el.id = "jsonld-product";
          document.head.appendChild(el);
        }
        el.textContent = JSON.stringify(data);
      } else if (el) {
        el.remove();
      }
    };

    const origin = window.location.origin;
    const path = window.location.pathname;
    const url = origin + path;

    let title = "SnegoRider — запчасти и экипировка для снегоходов и мотоциклов";
    let description = "Интернет-магазин запчастей и экипировки для снегоходов и мотоциклов: шлемы, куртки, перчатки, защита, запчасти для двигателя, подвески, вариатора. Доставка по России.";
    let jsonLd = null;

    if (detailItem) {
      title = `${detailItem.name} купить — ${detailItem.brand} | SnegoRider`;
      description = `${detailItem.name} — ${detailItem.brand}, ${detailItem.category.toLowerCase()}. Цена ${rub(detailItem.price)}. Доставка по России.`;
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: detailItem.name,
        image: detailItem.image ? [detailItem.image] : undefined,
        description: detailItem.description,
        brand: { "@type": "Brand", name: detailItem.brand },
        offers: {
          "@type": "Offer",
          url,
          priceCurrency: "RUB",
          price: detailItem.price,
          availability: "https://schema.org/InStock",
        },
      };
    } else if (page === "catalog" && catalogSelected) {
      title = `${catalogSelected} — купить в интернет-магазине SnegoRider`;
      description = `${catalogSelected}: широкий выбор, доступные цены, доставка по России. Интернет-магазин SnegoRider.`;
    } else if (page === "catalog") {
      title = "Каталог товаров — SnegoRider";
      description = "Полный каталог запчастей и экипировки для снегоходов и мотоциклов в интернет-магазине SnegoRider.";
    }

    document.title = title;
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    if (detailItem && detailItem.image) setMeta("property", "og:image", detailItem.image);
    const canonical = document.getElementById("canonical-link");
    if (canonical) canonical.setAttribute("href", url);
    setJsonLd(jsonLd);
  }, [detailItem, page, catalogSelected]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    if (!supabaseEnabled) { setAuthError("Личный кабинет ещё не подключён."); return; }
    const { email, password, name, phone } = authForm;
    const result =
      authMode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password, options: { data: { full_name: name, phone } } });
    if (result.error) {
      setAuthError(result.error.message);
    } else {
      setAuthOpen(false);
      setAuthForm({ email: "", password: "", name: "", phone: "" });
    }
  };

  const handleLogout = async () => {
    if (supabaseEnabled) await supabase.auth.signOut();
    setUser(null);
    setPage("home");
  };

  const handleSaveName = async () => {
    if (!supabaseEnabled || !user) return;
    const { data, error } = await supabase.auth.updateUser({ data: { full_name: nameInput } });
    if (!error && data && data.user) setUser(data.user);
    setEditingName(false);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file || !supabaseEnabled || !user) return;
    setAvatarUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (uploadError) { alert("Не удалось загрузить фото: " + uploadError.message); return; }
      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
      const cacheBustedUrl = pub.publicUrl + "?t=" + Date.now();
      const { data, error } = await supabase.auth.updateUser({ data: { avatar_url: cacheBustedUrl } });
      if (!error && data && data.user) setUser(data.user);
    } finally {
      setAvatarUploading(false);
    }
  };

  const filtered = useMemo(() => {
    return CATALOG_ITEMS.filter((p) => {
      if (catFilter !== "all" && p.category !== catFilter) return false;
      if (brandFilter !== "all" && p.brand !== brandFilter) return false;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase()) && !p.brand.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [catFilter, brandFilter, query]);

  /* Бренды, у которых реально есть товары в выбранном разделе (чтобы в фильтре не было брендов без товаров) */
  const brandsForSidebar = useMemo(() => {
    if (catFilter === "all") return SIDEBAR_BRANDS;
    return SIDEBAR_BRANDS.filter((b) => PRODUCTS.some((p) => p.category === catFilter && p.brand === b));
  }, [catFilter]);

  /* Разделы, в которых реально есть товары выбранного бренда */
  const categoriesForSidebar = useMemo(() => {
    if (brandFilter === "all") return CATEGORIES;
    return CATEGORIES.filter((c) => PRODUCTS.some((p) => p.brand === brandFilter && p.category === c));
  }, [brandFilter]);

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
        .st-btn { cursor:pointer; border:none; font-family:'IBM Plex Sans',sans-serif; transition: background .15s ease, transform .1s ease, border-color .15s ease, color .15s ease; }
        .st-btn:active { transform: scale(0.97); }
        .st-btn:focus-visible { outline: 2px solid ${T.orange}; outline-offset: 2px; }
        .st-card { transition: border-color .18s ease, transform .18s ease, box-shadow .18s ease; }
        .st-card:hover { border-color: ${T.orange} !important; transform: translateY(-2px); box-shadow: 0 10px 24px rgba(0,0,0,0.35); }
        .st-card:hover .st-card-img { transform: scale(1.05); }
        .st-card-img { transition: transform .35s ease; }
        .st-input { font-family:'IBM Plex Sans',sans-serif; }
        .st-input:focus { outline: 2px solid ${T.orange}; outline-offset: 1px; }
        .st-chip { cursor:pointer; transition: background .15s ease, color .15s ease, border-color .15s ease; }
        .st-navlink { cursor:pointer; transition: color .15s ease; }
        .st-navlink:hover { color: ${T.orange}; }
        @keyframes treadslide { from { background-position: 0 0; } to { background-position: 120px 0; } }
        .st-photo-strip { animation: treadslide 6s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .st-photo-strip { animation: none; } .st-card:hover { transform: none; } .st-card:hover .st-card-img { transform: none; } }
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
            onClick={() => goTo("/", () => setPage("home"))}
            style={{ color: page === "home" ? T.text : T.dim, fontWeight: page === "home" ? 600 : 400, borderBottom: page === "home" ? `2px solid ${T.orange}` : "2px solid transparent", paddingBottom: 4 }}
          >
            Магазин
          </span>
          <span
            className="st-navlink"
            onClick={() => goTo("/catalog", () => { setPage("catalog"); setCatalogSelected(null); })}
            style={{ color: page === "catalog" ? T.text : T.dim, fontWeight: page === "catalog" ? 600 : 400, borderBottom: page === "catalog" ? `2px solid ${T.orange}` : "2px solid transparent", paddingBottom: 4 }}
          >
            Каталог
          </span>
          <span
            className="st-navlink"
            onClick={() => goTo("/school", () => setPage("school"))}
            style={{ color: page === "school" ? T.text : T.dim, fontWeight: page === "school" ? 600 : 400, borderBottom: page === "school" ? `2px solid ${T.orange}` : "2px solid transparent", paddingBottom: 4 }}
          >
            Снегоходная школа
          </span>
        </nav>

        {(page === "home" || page === "catalog") && (
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

        {user ? (
          <button
            className="st-btn"
            onClick={() => goTo("/account", () => setPage("account"))}
            style={{ background: "transparent", border: `1px solid ${T.border}`, color: T.text, padding: "6px 16px 6px 6px", fontSize: 14, display: "flex", alignItems: "center", gap: 10 }}
          >
            <span
              style={{
                width: 30, height: 30, borderRadius: "50%", background: T.orange, color: T.bg,
                display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
                fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 14, flexShrink: 0,
              }}
            >
              {user.user_metadata && user.user_metadata.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                ((user.user_metadata && user.user_metadata.full_name) || user.email).charAt(0).toUpperCase()
              )}
            </span>
            {(user.user_metadata && user.user_metadata.full_name) || user.email}
          </button>
        ) : (
          <button
            className="st-btn"
            onClick={() => { setAuthOpen(true); setAuthMode("login"); setAuthError(""); }}
            style={{ background: "transparent", border: `1px solid ${T.border}`, color: T.text, padding: "9px 16px", fontSize: 14 }}
          >
            Войти
          </button>
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
      <div
        style={{
          height: 4,
          background: `linear-gradient(90deg, ${T.orange} 0%, ${T.orange} 60%, ${T.orangeDim} 100%)`,
        }}
      />

      {page === "home" && (
        <>
          {/* ===== Brand strip (banner replaced) ===== */}
          <section
            className="st-photo-strip"
            style={{
              padding: "32px 24px",
              borderBottom: `1px solid ${T.border}`,
              backgroundImage: `repeating-linear-gradient(90deg, ${T.panel2} 0 40px, ${T.panel} 40px 80px)`,
              backgroundSize: "120px 100%",
            }}
          >
            <div style={{ maxWidth: 1180, margin: "0 auto" }}>
              <div style={{ fontSize: 12, color: T.dim, fontWeight: 600, marginBottom: 14, textTransform: "uppercase", letterSpacing: 0.5 }}>Бренды в наличии</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
                {Object.keys(BRAND_LOGOS).map((b) => (
                  <div
                    key={b}
                    className="st-chip"
                    onClick={() => { setBrandFilter(b); setCatFilter("all"); }}
                    style={{
                      border: `2px solid ${brandFilter === b ? T.orange : "transparent"}`,
                      background: "#FFFFFF",
                      borderRadius: 14,
                      width: 120,
                      height: 90,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 6,
                      overflow: "hidden",
                    }}
                  >
                    <img src={BRAND_LOGOS[b]} alt={b} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ===== Catalog: sidebar + grid, directly below brands ===== */}
          <div className="st-layout" style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 28, padding: "32px 24px", maxWidth: 1180, margin: "0 auto" }}>
            {/* Sidebar */}
            <aside className="st-sidebar" style={{ position: "sticky", top: 76, alignSelf: "start" }}>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, color: T.dim, fontWeight: 600, marginBottom: 10 }}>Раздел</div>
                {["all", ...categoriesForSidebar].map((id) => {
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
              <div>
                <div style={{ fontSize: 12, color: T.dim, fontWeight: 600, marginBottom: 10 }}>Бренд</div>
                {["all", ...brandsForSidebar].map((id) => {
                  const label = id === "all" ? "Все бренды" : id;
                  const active = brandFilter === id;
                  return (
                    <div
                      key={id}
                      className="st-chip"
                      onClick={() => setBrandFilter(id)}
                      style={{
                        padding: "7px 10px",
                        fontSize: 14,
                        marginBottom: 3,
                        background: active ? T.panel2 : "transparent",
                        color: active ? T.text : T.dim,
                        borderLeft: `2px solid ${active ? T.ice : "transparent"}`,
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
                  <div key={p.isGroup ? p.key : p.id} className="st-card" style={{ border: `1px solid ${T.border}`, background: T.panel, display: "flex", flexDirection: "column" }}>
                    <div
                      onClick={() => goTo(urlForItem(p), () => setDetailItem(p))}
                      style={{ height: 200, borderBottom: `1px solid ${T.border}`, cursor: "pointer", overflow: "hidden" }}
                    >
                      <ProductImage src={p.image} alt={p.name} icon={p.icon} color={T.ice} zoom />
                    </div>
                    <div style={{ padding: 14, display: "flex", flexDirection: "column", flex: 1 }}>
                      <div style={{ fontSize: 11, color: T.dim, marginBottom: 4 }}>{p.brand} · {p.tag}</div>
                      <div
                        onClick={() => goTo(urlForItem(p), () => setDetailItem(p))}
                        style={{ fontSize: 14.5, lineHeight: 1.35, marginBottom: 12, flex: 1, cursor: "pointer" }}
                      >
                        {p.name}
                      </div>
                      <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 17, fontWeight: 600, marginBottom: 10 }}>
                        {p.isGroup ? "от " : ""}{rub(p.price)}
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          className="st-btn"
                          onClick={() => goTo(urlForItem(p), () => setDetailItem(p))}
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
                          onClick={() => (p.isGroup ? goTo(urlForItem(p), () => setDetailItem(p)) : addToCart(p.id))}
                          style={{
                            background: !p.isGroup && flash === p.id ? T.ice : T.orange,
                            color: T.bg,
                            padding: "7px 12px",
                            fontSize: 13,
                            fontWeight: 600,
                            flex: 1,
                          }}
                        >
                          {p.isGroup ? "Выбрать размер" : flash === p.id ? "Добавлено" : "В корзину"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {page === "catalog" && (
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "40px 24px" }}>
          {catalogSelected === null ? (
            <>
              <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 700, margin: "0 0 20px" }}>
                Каталог
              </h1>
              <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
                <button
                  className="st-btn"
                  onClick={() => setCatalogViewMode("category")}
                  style={{
                    background: catalogViewMode === "category" ? T.orange : "transparent",
                    color: catalogViewMode === "category" ? T.bg : T.text,
                    border: `1px solid ${catalogViewMode === "category" ? T.orange : T.border}`,
                    padding: "8px 18px", fontSize: 14, fontWeight: 600,
                  }}
                >
                  По категориям
                </button>
                <button
                  className="st-btn"
                  onClick={() => setCatalogViewMode("brand")}
                  style={{
                    background: catalogViewMode === "brand" ? T.orange : "transparent",
                    color: catalogViewMode === "brand" ? T.bg : T.text,
                    border: `1px solid ${catalogViewMode === "brand" ? T.orange : T.border}`,
                    padding: "8px 18px", fontSize: 14, fontWeight: 600,
                  }}
                >
                  По брендам
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 18 }}>
                {(catalogViewMode === "category" ? CATEGORIES : SIDEBAR_BRANDS).map((entry) => {
                  const items = catalogViewMode === "category"
                    ? CATALOG_ITEMS.filter((p) => p.category === entry)
                    : CATALOG_ITEMS.filter((p) => p.brand === entry);
                  const sample = items.find((p) => p.image) || items[0];
                  return (
                    <div
                      key={entry}
                      className="st-card"
                      onClick={() => {
                        const path = catalogViewMode === "category"
                          ? `/catalog/category/${encodeURIComponent(entry)}`
                          : `/catalog/brand/${encodeURIComponent(entry)}`;
                        goTo(path, () => {
                          setCatalogSelected(entry);
                          if (catalogViewMode === "category") { setCatFilter(entry); setBrandFilter("all"); }
                          else { setBrandFilter(entry); setCatFilter("all"); }
                        });
                      }}
                      style={{ border: `1px solid ${T.border}`, background: T.panel, cursor: "pointer", overflow: "hidden" }}
                    >
                      <div style={{ height: 3, background: T.orange }} />
                      <div style={{ height: 150 }}>
                        <ProductImage src={sample && sample.image} alt={entry} icon={sample ? sample.icon : "cog"} color={T.ice} zoom />
                      </div>
                      <div style={{ padding: 14 }}>
                        <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{entry}</div>
                        <div style={{ color: T.dim, fontSize: 13 }}>{items.length} товаров</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div
                className="st-navlink"
                onClick={() => goTo("/catalog", () => { setCatalogSelected(null); setCatFilter("all"); setBrandFilter("all"); })}
                style={{ color: T.dim, fontSize: 14, marginBottom: 20, display: "inline-block" }}
              >
                {"\u2190"} {catalogViewMode === "category" ? "Все категории" : "Все бренды"}
              </div>
              <div className="st-layout" style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 28 }}>
                <aside className="st-sidebar" style={{ position: "sticky", top: 76, alignSelf: "start" }}>
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 12, color: T.dim, fontWeight: 600, marginBottom: 10 }}>Раздел</div>
                    {["all", ...categoriesForSidebar].map((id) => {
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
                  <div>
                    <div style={{ fontSize: 12, color: T.dim, fontWeight: 600, marginBottom: 10 }}>Бренд</div>
                    {["all", ...brandsForSidebar].map((id) => {
                      const label = id === "all" ? "Все бренды" : id;
                      const active = brandFilter === id;
                      return (
                        <div
                          key={id}
                          className="st-chip"
                          onClick={() => setBrandFilter(id)}
                          style={{
                            padding: "7px 10px",
                            fontSize: 14,
                            marginBottom: 3,
                            background: active ? T.panel2 : "transparent",
                            color: active ? T.text : T.dim,
                            borderLeft: `2px solid ${active ? T.ice : "transparent"}`,
                          }}
                        >
                          {label}
                        </div>
                      );
                    })}
                  </div>
                </aside>

                <div>
                  <div style={{ color: T.dim, fontSize: 13, marginBottom: 14 }}>{filtered.length} товаров</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 16 }}>
                    {filtered.map((p) => (
                      <div key={p.isGroup ? p.key : p.id} className="st-card" style={{ border: `1px solid ${T.border}`, background: T.panel, display: "flex", flexDirection: "column" }}>
                        <div
                          onClick={() => goTo(urlForItem(p), () => setDetailItem(p))}
                          style={{ height: 200, borderBottom: `1px solid ${T.border}`, cursor: "pointer", overflow: "hidden" }}
                        >
                          <ProductImage src={p.image} alt={p.name} icon={p.icon} color={T.ice} zoom />
                        </div>
                        <div style={{ padding: 14, display: "flex", flexDirection: "column", flex: 1 }}>
                          <div style={{ fontSize: 11, color: T.dim, marginBottom: 4 }}>{p.brand} · {p.tag}</div>
                          <div
                            onClick={() => goTo(urlForItem(p), () => setDetailItem(p))}
                            style={{ fontSize: 14.5, lineHeight: 1.35, marginBottom: 12, flex: 1, cursor: "pointer" }}
                          >
                            {p.name}
                          </div>
                          <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 17, fontWeight: 600, marginBottom: 10 }}>
                            {p.isGroup ? "от " : ""}{rub(p.price)}
                          </div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button
                              className="st-btn"
                              onClick={() => goTo(urlForItem(p), () => setDetailItem(p))}
                              style={{ background: "transparent", border: `1px solid ${T.border}`, color: T.text, padding: "7px 10px", fontSize: 13, fontWeight: 500, flex: 1 }}
                            >
                              Подробнее
                            </button>
                            <button
                              className="st-btn"
                              onClick={() => (p.isGroup ? goTo(urlForItem(p), () => setDetailItem(p)) : addToCart(p.id))}
                              style={{ background: !p.isGroup && flash === p.id ? T.ice : T.orange, color: T.bg, padding: "7px 12px", fontSize: 13, fontWeight: 600, flex: 1 }}
                            >
                              {p.isGroup ? "Выбрать размер" : flash === p.id ? "Добавлено" : "В корзину"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {page === "school" && (
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

      {page === "requisites" && (
        /* ===== Реквизиты (обязательная страница для приёма онлайн-оплаты) ===== */
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "56px 24px" }}>
          <div style={{ color: T.orange, fontSize: 13, fontWeight: 600, marginBottom: 10 }}>SnegoRider</div>
          <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "clamp(24px, 3vw, 32px)", lineHeight: 1.15, margin: "0 0 24px", fontWeight: 700 }}>
            Реквизиты
          </h1>
          <div style={{ border: `1px solid ${T.border}`, background: T.panel, padding: 28, display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: T.dim, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Индивидуальный предприниматель</div>
              <div style={{ fontSize: 16 }}>Мурашко Сергей Викторович</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: T.dim, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>ИНН</div>
              <div style={{ fontSize: 16 }}>190304921123</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: T.dim, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>ОГРНИП</div>
              <div style={{ fontSize: 16 }}>317190100016499</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: T.dim, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Телефон</div>
              <div style={{ fontSize: 16 }}>+7 950 960-38-73</div>
              <div style={{ fontSize: 14, color: T.dim, marginTop: 4 }}>+7 950 960-39-35 (доп. номер)</div>
            </div>
          </div>
        </div>
      )}

      {page === "offer" && (
        /* ===== Публичная оферта (обязательный документ для приёма онлайн-оплаты) ===== */
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "56px 24px" }}>
          <div style={{ color: T.orange, fontSize: 13, fontWeight: 600, marginBottom: 10 }}>SnegoRider</div>
          <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "clamp(24px, 3vw, 32px)", lineHeight: 1.15, margin: "0 0 24px", fontWeight: 700 }}>
            Публичная оферта
          </h1>
          <div style={{ color: T.dim, fontSize: 14.5, lineHeight: 1.75, display: "flex", flexDirection: "column", gap: 18 }}>
            <p>
              Настоящий документ является публичной офертой ИП Мурашко Сергея Викторовича (ИНН 190304921123, ОГРНИП 317190100016499),
              далее — «Продавец», адресованной любому дееспособному физическому лицу, далее — «Покупатель», о продаже товаров
              дистанционным способом через интернет-магазин SnegoRider.
            </p>

            <div>
              <div style={{ color: T.text, fontWeight: 600, marginBottom: 6 }}>1. Общие положения</div>
              <p>
                1.1. Оформление заказа на сайте означает полное и безоговорочное принятие Покупателем условий настоящей оферты.<br />
                1.2. Продавец оставляет за собой право вносить изменения в настоящую оферту, в связи с чем Покупателю
                рекомендуется знакомиться с её актуальной редакцией перед каждым заказом.
              </p>
            </div>

            <div>
              <div style={{ color: T.text, fontWeight: 600, marginBottom: 6 }}>2. Цена и оплата товара</div>
              <p>
                2.1. Цены на товары указаны на сайте в российских рублях и включают все применимые налоги.<br />
                2.2. Оплата производится банковской картой онлайн через платёжный сервис ЮKassa либо иным способом,
                указанным на сайте на момент оформления заказа.<br />
                2.3. Обязательство Покупателя по оплате считается исполненным с момента поступления денежных средств
                на расчётный счёт Продавца.
              </p>
            </div>

            <div>
              <div style={{ color: T.text, fontWeight: 600, marginBottom: 6 }}>3. Доставка</div>
              <p>
                3.1. Доставка осуществляется по территории России способом, согласованным с Покупателем при оформлении заказа
                (курьерская служба, транспортная компания или самовывоз со склада).<br />
                3.2. Сроки и стоимость доставки зависят от региона и способа доставки и уточняются менеджером после оформления заказа.<br />
                3.3. Риск случайной гибели или повреждения товара переходит к Покупателю с момента передачи товара перевозчику
                или Покупателю лично при самовывозе.
              </p>
            </div>

            <div>
              <div style={{ color: T.text, fontWeight: 600, marginBottom: 6 }}>4. Возврат и обмен</div>
              <p>
                4.1. Покупатель вправе отказаться от товара в любое время до его передачи, а после передачи — в течение 7 дней,
                за исключением товаров надлежащего качества, имеющих индивидуально-определённые свойства.<br />
                4.2. Возврат товара надлежащего качества возможен при сохранении его товарного вида, потребительских свойств,
                а также документа, подтверждающего покупку.<br />
                4.3. Возврат денежных средств осуществляется тем же способом, которым была произведена оплата, в срок
                не более 10 рабочих дней с момента получения возвращённого товара.
              </p>
            </div>

            <div>
              <div style={{ color: T.text, fontWeight: 600, marginBottom: 6 }}>5. Ответственность сторон</div>
              <p>
                5.1. Продавец не несёт ответственности за ущерб, причинённый Покупателю вследствие ненадлежащего использования
                товаров, приобретённых на сайте.<br />
                5.2. Продавец не несёт ответственности за задержку доставки, произошедшую по вине транспортных компаний.
              </p>
            </div>

            <div>
              <div style={{ color: T.text, fontWeight: 600, marginBottom: 6 }}>6. Контакты</div>
              <p>
                По всем вопросам, связанным с заказом, оплатой, доставкой и возвратом, Покупатель может обратиться
                по телефону +7 950 960-38-73 или +7 950 960-39-35. Реквизиты Продавца указаны на{" "}
                <span className="st-navlink" onClick={() => goTo("/requisites", () => setPage("requisites"))} style={{ color: T.orange, textDecoration: "underline" }}>
                  странице «Реквизиты»
                </span>.
              </p>
            </div>
          </div>
        </div>
      )}

      {page === "privacy" && (
        /* ===== Политика конфиденциальности ===== */
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "56px 24px" }}>
          <div style={{ color: T.orange, fontSize: 13, fontWeight: 600, marginBottom: 10 }}>SnegoRider</div>
          <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "clamp(24px, 3vw, 32px)", lineHeight: 1.15, margin: "0 0 24px", fontWeight: 700 }}>
            Политика конфиденциальности
          </h1>
          <div style={{ color: T.dim, fontSize: 14.5, lineHeight: 1.75, display: "flex", flexDirection: "column", gap: 18 }}>
            <p>
              Настоящая Политика определяет порядок обработки персональных данных пользователей сайта SnegoRider
              Индивидуальным предпринимателем Мурашко Сергеем Викторовичем (ИНН 190304921123, ОГРНИП 317190100016499),
              далее — «Оператор».
            </p>

            <div>
              <div style={{ color: T.text, fontWeight: 600, marginBottom: 6 }}>1. Какие данные собираются</div>
              <p>
                1.1. При оформлении заказа: имя, номер телефона, адрес доставки или пункт самовывоза.<br />
                1.2. При регистрации личного кабинета: адрес электронной почты, пароль (хранится в зашифрованном виде),
                а также указанные при регистрации имя и телефон.<br />
                1.3. Автоматически: технические данные о посещении сайта (тип браузера, IP-адрес) для целей
                обеспечения работы сайта.
              </p>
            </div>

            <div>
              <div style={{ color: T.text, fontWeight: 600, marginBottom: 6 }}>2. Цели обработки данных</div>
              <p>
                2.1. Оформление и доставка заказов, связь с Покупателем по вопросам заказа.<br />
                2.2. Предоставление доступа к личному кабинету и истории заказов.<br />
                2.3. Информирование о статусе заказа и оплаты.
              </p>
            </div>

            <div>
              <div style={{ color: T.text, fontWeight: 600, marginBottom: 6 }}>3. Хранение и передача данных третьим лицам</div>
              <p>
                3.1. Данные хранятся на серверах сервисов Supabase (личный кабинет и история заказов) и передаются
                платёжному сервису ЮKassa исключительно в объёме, необходимом для обработки оплаты.<br />
                3.2. Оператор не передаёт персональные данные третьим лицам, за исключением случаев, прямо предусмотренных
                законодательством РФ, либо необходимых для исполнения заказа (служба доставки).<br />
                3.3. Оператор принимает разумные технические и организационные меры для защиты персональных данных
                от несанкционированного доступа.
              </p>
            </div>

            <div>
              <div style={{ color: T.text, fontWeight: 600, marginBottom: 6 }}>4. Права пользователя</div>
              <p>
                4.1. Пользователь вправе в любой момент запросить удаление своих персональных данных, обратившись
                по контактам, указанным на странице «Реквизиты».<br />
                4.2. Пользователь вправе отозвать согласие на обработку персональных данных, направив соответствующее
                обращение Оператору.
              </p>
            </div>

            <div>
              <div style={{ color: T.text, fontWeight: 600, marginBottom: 6 }}>5. Согласие на обработку данных</div>
              <p>
                Оформляя заказ или регистрируясь на сайте, пользователь подтверждает своё согласие на обработку
                персональных данных на условиях настоящей Политики.
              </p>
            </div>

            <div>
              <div style={{ color: T.text, fontWeight: 600, marginBottom: 6 }}>6. Контакты</div>
              <p>
                По вопросам обработки персональных данных обращайтесь по телефону +7 950 960-38-73. Реквизиты Оператора
                указаны на{" "}
                <span className="st-navlink" onClick={() => goTo("/requisites", () => setPage("requisites"))} style={{ color: T.orange, textDecoration: "underline" }}>
                  странице «Реквизиты»
                </span>.
              </p>
            </div>
          </div>
        </div>
      )}

      {page === "account" && (
        /* ===== Личный кабинет ===== */
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "56px 24px" }}>
          {!user ? (
            <div style={{ color: T.dim, fontSize: 15 }}>
              Чтобы посмотреть личный кабинет, сначала войдите —{" "}
              <span className="st-navlink" onClick={() => setAuthOpen(true)} style={{ color: T.orange, textDecoration: "underline" }}>
                нажмите здесь
              </span>.
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <label
                    style={{
                      width: 54, height: 54, borderRadius: "50%", background: T.orange, color: T.bg,
                      display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
                      fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 22, flexShrink: 0,
                      cursor: "pointer", position: "relative",
                    }}
                    title="Изменить аватар"
                  >
                    {avatarUploading ? (
                      <span style={{ fontSize: 11 }}>...</span>
                    ) : user.user_metadata && user.user_metadata.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      ((user.user_metadata && user.user_metadata.full_name) || user.email).charAt(0).toUpperCase()
                    )}
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: "none" }} />
                  </label>
                  <div>
                    <div style={{ color: T.orange, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Личный кабинет</div>
                    <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 700, margin: 0 }}>
                      {(user.user_metadata && user.user_metadata.full_name) || "Без имени"}
                    </h1>
                  </div>
                </div>
                <button className="st-btn" onClick={handleLogout} style={{ background: "transparent", border: `1px solid ${T.border}`, color: T.text, padding: "9px 16px", fontSize: 14 }}>
                  Выйти
                </button>
              </div>

              <div style={{ border: `1px solid ${T.border}`, background: T.panel, padding: 20, marginBottom: 28, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: T.dim, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Имя</div>
                  {editingName ? (
                    <div style={{ display: "flex", gap: 6 }}>
                      <input
                        className="st-input"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        style={{ flex: 1, background: T.panel2, border: `1px solid ${T.border}`, color: T.text, padding: "6px 8px", fontSize: 14 }}
                      />
                      <button className="st-btn" onClick={handleSaveName} style={{ background: T.orange, color: T.bg, padding: "6px 10px", fontSize: 13, fontWeight: 600 }}>
                        ОК
                      </button>
                    </div>
                  ) : (
                    <div style={{ fontSize: 14.5, display: "flex", alignItems: "center", gap: 8 }}>
                      {(user.user_metadata && user.user_metadata.full_name) || "—"}
                      <span
                        className="st-navlink"
                        onClick={() => { setNameInput((user.user_metadata && user.user_metadata.full_name) || ""); setEditingName(true); }}
                        style={{ color: T.orange, fontSize: 12, textDecoration: "underline" }}
                      >
                        изменить
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 11, color: T.dim, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Телефон</div>
                  <div style={{ fontSize: 14.5 }}>{(user.user_metadata && user.user_metadata.phone) || "—"}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: T.dim, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Email</div>
                  <div style={{ fontSize: 14.5 }}>{user.email}</div>
                </div>
              </div>

              <div style={{ fontSize: 14, color: T.dim, marginBottom: 14 }}>Мои заказы</div>
              {myOrders.length === 0 ? (
                <div style={{ border: `1px dashed ${T.border}`, background: T.panel, padding: 24, color: T.dim, fontSize: 14 }}>
                  Пока нет заказов — оформите первый в каталоге.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {myOrders.map((o) => (
                    <div key={o.id} style={{ border: `1px solid ${T.border}`, background: T.panel, padding: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: T.dim, marginBottom: 8 }}>
                        <span>{new Date(o.created_at).toLocaleString("ru-RU")}</span>
                        <span style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 600, color: T.text }}>{rub(o.total)}</span>
                      </div>
                      <div style={{ fontSize: 13.5, color: T.text, lineHeight: 1.6 }}>
                        {(o.items || []).map((it, idx) => (
                          <div key={idx}>{it.name} × {it.qty}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ===== Footer ===== */}
      <footer style={{ borderTop: `1px solid ${T.border}`, padding: "28px 24px", color: T.dim, fontSize: 13, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src={LOGO_URI} alt="SnegoRider" style={{ height: 22, width: 22, borderRadius: "50%", objectFit: "cover" }} />
          © SnegoRider — запчасти и экипировка для снегоходов и мотоциклов
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span>Доставка по России · Самовывоз со склада</span>
          <span className="st-navlink" onClick={() => goTo("/requisites", () => setPage("requisites"))} style={{ textDecoration: "underline" }}>
            Реквизиты
          </span>
          <span className="st-navlink" onClick={() => goTo("/offer", () => setPage("offer"))} style={{ textDecoration: "underline" }}>
            Публичная оферта
          </span>
          <span className="st-navlink" onClick={() => goTo("/privacy", () => setPage("privacy"))} style={{ textDecoration: "underline" }}>
            Политика конфиденциальности
          </span>
        </div>
      </footer>

      {/* ===== Auth modal (вход / регистрация) ===== */}
      {authOpen && (
        <>
          <div onClick={() => setAuthOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 42 }} />
          <div
            style={{
              position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              width: "min(380px, 92vw)", background: T.panel, border: `1px solid ${T.border}`, zIndex: 43, padding: 24,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600 }}>
                {authMode === "login" ? "Вход" : "Регистрация"}
              </div>
              <button className="st-btn" onClick={() => setAuthOpen(false)} style={{ background: "transparent", color: T.dim, fontSize: 20, padding: 4 }}>{"\u2715"}</button>
            </div>

            <form onSubmit={handleAuthSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {authMode === "signup" && (
                <>
                  <label style={{ fontSize: 12, color: T.dim }}>Имя
                    <input
                      required
                      className="st-input"
                      value={authForm.name}
                      onChange={(e) => setAuthForm((f) => ({ ...f, name: e.target.value }))}
                      style={{ width: "100%", marginTop: 4, background: T.panel2, border: `1px solid ${T.border}`, color: T.text, padding: "9px 10px" }}
                    />
                  </label>
                  <label style={{ fontSize: 12, color: T.dim }}>Телефон
                    <input
                      required
                      className="st-input"
                      value={authForm.phone}
                      onChange={(e) => setAuthForm((f) => ({ ...f, phone: e.target.value }))}
                      style={{ width: "100%", marginTop: 4, background: T.panel2, border: `1px solid ${T.border}`, color: T.text, padding: "9px 10px" }}
                    />
                  </label>
                </>
              )}
              <label style={{ fontSize: 12, color: T.dim }}>Email
                <input
                  required
                  type="email"
                  className="st-input"
                  value={authForm.email}
                  onChange={(e) => setAuthForm((f) => ({ ...f, email: e.target.value }))}
                  style={{ width: "100%", marginTop: 4, background: T.panel2, border: `1px solid ${T.border}`, color: T.text, padding: "9px 10px" }}
                />
              </label>
              <label style={{ fontSize: 12, color: T.dim }}>Пароль
                <input
                  required
                  type="password"
                  minLength={6}
                  className="st-input"
                  value={authForm.password}
                  onChange={(e) => setAuthForm((f) => ({ ...f, password: e.target.value }))}
                  style={{ width: "100%", marginTop: 4, background: T.panel2, border: `1px solid ${T.border}`, color: T.text, padding: "9px 10px" }}
                />
              </label>

              {authError && <div style={{ color: T.orange, fontSize: 13 }}>{authError}</div>}

              <button type="submit" className="st-btn" style={{ background: T.orange, color: T.bg, padding: "11px", fontWeight: 600, fontSize: 14, marginTop: 4 }}>
                {authMode === "login" ? "Войти" : "Зарегистрироваться"}
              </button>
            </form>

            <div style={{ marginTop: 14, fontSize: 13, color: T.dim, textAlign: "center" }}>
              {authMode === "login" ? (
                <>Нет аккаунта?{" "}
                  <span className="st-navlink" onClick={() => { setAuthMode("signup"); setAuthError(""); }} style={{ color: T.orange, textDecoration: "underline" }}>
                    Зарегистрироваться
                  </span>
                </>
              ) : (
                <>Уже есть аккаунт?{" "}
                  <span className="st-navlink" onClick={() => { setAuthMode("login"); setAuthError(""); }} style={{ color: T.orange, textDecoration: "underline" }}>
                    Войти
                  </span>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* ===== Product detail modal ===== */}
      {detailItem !== null && (() => {
        const p = detailItem;
        const activeVariant = p.isGroup ? p.sizes.find((s) => s.size === selectedSize) : null;
        const displayImage = p.isGroup ? (activeVariant ? activeVariant.image : p.image) : p.image;
        const displayPrice = p.isGroup ? (activeVariant ? activeVariant.price : p.price) : p.price;
        const cartTargetId = p.isGroup ? (activeVariant ? activeVariant.id : null) : p.id;
        const hasLetterSizes = p.isGroup && p.sizes.some((s) => STANDARD_SIZES.includes(s.size));
        const sizesToShow = p.isGroup
          ? Array.from(new Set([...(hasLetterSizes ? STANDARD_SIZES : []), ...p.sizes.map((s) => s.size)])).sort(
              (a, b) => {
                const na = parseFloat(a), nb = parseFloat(b);
                const aNum = !isNaN(na), bNum = !isNaN(nb);
                if (aNum && bNum) return na - nb;
                if (aNum !== bNum) return aNum ? -1 : 1;
                return SIZE_TOKENS.indexOf(b) - SIZE_TOKENS.indexOf(a);
              }
            )
          : [];
        return (
          <>
            <div onClick={closeDetail} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 40 }} />
            <div
              style={{
                position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                width: "min(720px, 92vw)", maxHeight: "88vh", overflowY: "auto",
                background: T.panel, border: `1px solid ${T.border}`, zIndex: 41,
              }}
            >
              <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px 14px 0" }}>
                <button className="st-btn" onClick={closeDetail} style={{ background: "transparent", color: T.dim, fontSize: 20, padding: 4 }}>{"\u2715"}</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: 0, padding: "0 24px 28px" }}>
                <div style={{ height: 340, marginBottom: 20, border: `1px solid ${T.border}` }}>
                  <ProductImage src={displayImage} alt={p.name} icon={p.icon} color={T.ice} />
                </div>
                <div style={{ fontSize: 12, color: T.dim, marginBottom: 6 }}>{p.brand} · {p.category} · {p.tag}</div>
                <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 24, fontWeight: 600, margin: "0 0 14px", lineHeight: 1.25 }}>{p.name}</h2>
                <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 26, fontWeight: 700, marginBottom: 18 }}>{rub(displayPrice)}</div>

                {p.isGroup && (
                  <div style={{ marginBottom: 22 }}>
                    <div style={{ fontSize: 12, color: T.dim, marginBottom: 8 }}>Размер</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {sizesToShow.map((size) => {
                        const variant = p.sizes.find((s) => s.size === size);
                        const available = Boolean(variant);
                        const active = selectedSize === size;
                        return (
                          <button
                            key={size}
                            disabled={!available}
                            onClick={() => available && setSelectedSize(size)}
                            className="st-btn"
                            style={{
                              width: 46, height: 40,
                              background: active ? T.orange : "transparent",
                              color: !available ? T.border : active ? T.bg : T.text,
                              border: `1px solid ${active ? T.orange : T.border}`,
                              fontSize: 13, fontWeight: 600,
                              cursor: available ? "pointer" : "not-allowed",
                              opacity: available ? 1 : 0.4,
                            }}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                    {!activeVariant && (
                      <div style={{ color: T.dim, fontSize: 12.5, marginTop: 8 }}>Выберите размер, чтобы добавить в корзину.</div>
                    )}
                  </div>
                )}

                <p style={{ color: T.dim, fontSize: 14.5, lineHeight: 1.6, marginBottom: 22 }}>{p.description}</p>
                <button
                  className="st-btn"
                  disabled={p.isGroup && !cartTargetId}
                  onClick={() => { if (cartTargetId) addToCart(cartTargetId); }}
                  style={{
                    background: cartTargetId && flash === cartTargetId ? T.ice : T.orange,
                    color: T.bg, padding: "12px 20px", fontWeight: 600, fontSize: 14,
                    opacity: p.isGroup && !cartTargetId ? 0.5 : 1,
                    cursor: p.isGroup && !cartTargetId ? "not-allowed" : "pointer",
                  }}
                >
                  {cartTargetId && flash === cartTargetId ? "Добавлено" : "В корзину"}
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
                {checkoutStep === "paid" && "Оплата прошла"}
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
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const orderData = {
                      name: orderForm.name,
                      phone: orderForm.phone,
                      address: orderForm.address,
                      items: cartItems,
                      total: cartTotal,
                    };
                    sendOrderByEmail(orderData);
                    sendOrderToTelegram(orderData);
                    if (supabaseEnabled && user) {
                      supabase.from("orders").insert({
                        user_id: user.id,
                        name: orderData.name,
                        phone: orderData.phone,
                        address: orderData.address,
                        items: orderData.items.map((it) => ({ name: it.name, qty: it.qty, price: it.price })),
                        total: orderData.total,
                      });
                    }
                    setCart({});

                    // Пытаемся создать платёж в ЮKassa. Если она ещё не настроена
                    // (нет переменных окружения на Vercel) — просто показываем "Спасибо за заказ".
                    try {
                      const resp = await fetch("/api/create-payment", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          amount: orderData.total,
                          description: `Заказ SnegoRider — ${orderData.items.length} товар(ов)`,
                          returnUrl: window.location.origin + window.location.pathname + "?payment=success",
                        }),
                      });
                      const data = await resp.json();
                      if (resp.ok && data.confirmationUrl) {
                        window.location.href = data.confirmationUrl;
                        return;
                      }
                    } catch (err) {
                      console.error("Оплата пока недоступна", err);
                    }
                    setCheckoutStep("done");
                  }}
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  <label style={{ fontSize: 12, color: T.dim }}>Имя
                    <input
                      required
                      className="st-input"
                      value={orderForm.name}
                      onChange={(e) => setOrderForm((f) => ({ ...f, name: e.target.value }))}
                      style={{ width: "100%", marginTop: 4, background: T.panel2, border: `1px solid ${T.border}`, color: T.text, padding: "9px 10px" }}
                    />
                  </label>
                  <label style={{ fontSize: 12, color: T.dim }}>Телефон
                    <input
                      required
                      className="st-input"
                      value={orderForm.phone}
                      onChange={(e) => setOrderForm((f) => ({ ...f, phone: e.target.value }))}
                      style={{ width: "100%", marginTop: 4, background: T.panel2, border: `1px solid ${T.border}`, color: T.text, padding: "9px 10px" }}
                    />
                  </label>
                  <label style={{ fontSize: 12, color: T.dim }}>Адрес доставки или самовывоз
                    <input
                      required
                      className="st-input"
                      value={orderForm.address}
                      onChange={(e) => setOrderForm((f) => ({ ...f, address: e.target.value }))}
                      style={{ width: "100%", marginTop: 4, background: T.panel2, border: `1px solid ${T.border}`, color: T.text, padding: "9px 10px" }}
                    />
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

              {checkoutStep === "paid" && (
                <div style={{ textAlign: "center", padding: "30px 0" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>{"\u2713"}</div>
                  <div style={{ fontSize: 15, marginBottom: 8 }}>Оплата прошла успешно!</div>
                  <div style={{ color: T.dim, fontSize: 13, lineHeight: 1.5 }}>Спасибо за заказ — мы уже начали его собирать.</div>
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
