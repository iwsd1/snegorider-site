// Серверный маршрут: создаёт платёж в ЮKassa и возвращает ссылку на оплату.
// Секретный ключ читается из переменных окружения Vercel (Settings → Environment Variables),
// поэтому он никогда не попадает в код на GitHub и не виден в браузере.

export async function POST(request) {
  const shopId = process.env.YOOKASSA_SHOP_ID;
  const secretKey = process.env.YOOKASSA_SECRET_KEY;

  if (!shopId || !secretKey) {
    return Response.json({ error: "ЮKassa ещё не настроена (нет переменных окружения)" }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  const { amount, description, returnUrl } = body;

  if (!amount || !returnUrl) {
    return Response.json({ error: "Не хватает amount или returnUrl" }, { status: 400 });
  }

  const idempotenceKey = Date.now().toString(36) + Math.random().toString(36).slice(2);

  try {
    const response = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotence-Key": idempotenceKey,
        Authorization: "Basic " + Buffer.from(`${shopId}:${secretKey}`).toString("base64"),
      },
      body: JSON.stringify({
        amount: { value: Number(amount).toFixed(2), currency: "RUB" },
        confirmation: { type: "redirect", return_url: returnUrl },
        capture: true,
        description: description || "Заказ на SnegoRider",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json({ error: data.description || "Ошибка ЮKassa" }, { status: response.status });
    }

    return Response.json({
      paymentId: data.id,
      confirmationUrl: data.confirmation && data.confirmation.confirmation_url,
    });
  } catch (e) {
    return Response.json({ error: "Не удалось создать платёж", details: String(e) }, { status: 500 });
  }
}
