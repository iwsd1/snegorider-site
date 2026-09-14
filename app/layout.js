export const metadata = {
  metadataBase: new URL("https://snegorider-site-pcdo.vercel.app"),
  title: {
    default: "SnegoRider — запчасти и экипировка для снегоходов и мотоциклов",
    template: "%s | SnegoRider",
  },
  description:
    "Интернет-магазин запчастей и экипировки для снегоходов и мотоциклов: шлемы, куртки, перчатки, защита, запчасти для двигателя, подвески, вариатора. Доставка по России.",
  openGraph: {
    type: "website",
    siteName: "SnegoRider",
    locale: "ru_RU",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
