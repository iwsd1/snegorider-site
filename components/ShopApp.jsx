"use client";
import React, { useState, useMemo, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  T, PRODUCTS, CATEGORY_ORDER, CATEGORIES, BRANDS, SIDEBAR_BRANDS,
  SIZE_TOKENS, STANDARD_SIZES, extractSize, baseProductName,
  buildCatalogItems, CATALOG_ITEMS, findCatalogItemByUrlId, urlForItem, parseRoute,
  BRAND_LOGOS, rub, PhotoPlaceholder, ProductImage,
} from "../lib/products";

const LOGO_URI = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/7QB8UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAGAcAigAWkZCTUQyMzAwMDk2ZDAxMDAwMGQzMTgwMDAwMTQyMDAwMDA2NDI1MDAwMGZhNWQwMDAwNzk2NTAwMDBhYzc3MDAwMGMxN2YwMDAwOWI4NzAwMDA2ZjlhMDAwMAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCADIAMgDASIAAhEBAxEB/8QAHgABAAICAwEBAQAAAAAAAAAAAAcIBgkCBAUBAwr/xABCEAABAwQBAwIDBQQFCwUAAAABAAIDBAUGEQcIEiETMQlBYRQiMlGxFRZxchcZQlKRIygzU1diZoGFk5WhssLD0//EABsBAQACAwEBAAAAAAAAAAAAAAAFBgIDBAEH/8QALBEAAgICAQMDAgUFAAAAAAAAAAECEQMhBAUSQQYiMVFhExQWcYEjJDJikf/aAAwDAQACEQMRAD8A1VIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiADyr39MHwl885osFuynMrvDgOOV8TKmkhdB9puFTE4ba/0ttbE1wIIL3d3z7de9EW+63c8U8zN64ek6jw3jfk+o415QtttgprlTs7ftLnRRem7z/pPQkIa71oT3M2Afm1wES8wfB3wLGeKcqumI5rkFXltlt8tcynuL6Z8ExZG6T0nMZG1zC8NIae7wTvyAtUb6aVkDJnRvEL3FrJC09riNbAPsSNjf8AEKXrxfuY+Acyzvjd99vlhvdzqRb79QUdW8vuDh3Bgc8feka9sp7SD95snzBWxvqZ6OYMC+HBiGFW+1xVOX2m52yodIIwZZLlWztgnaHDzovnaz6tiZ/dCA1Gus9ey1R3N1FUNtskzqdlYYnCF8rQHOYH60XAOaSN7AcD811NLbl1ecJUGO4T02dK2DUNLcLtVXdtzq3PYdlkLHNqKuYAfhe6WoeT+URAHgLC+vvLsM4Hy68YfTdNlq/deqtZt9JlM1tbRQz1j4C4yU8jIAC6IvaT2u33MPsAgNYIG1znp5KaQxyxuieNEte0g+RseD9FtR6WemXjro44Ij6guc6OC45FUwR1Vos1VEJDR+o3ugjjid4dVSDTtuH+TH5Friqw9cnUnjnVdFxffLXa4I8+NJWRXuG200gbC19Tqio+5w3NIxgcS9vgmUaA8taBUkDazPijBrPnuRy0N9y234bb4YHTvr7g0vDtOA7GNGu553vRI8ArYzaemrEui/gzHaG947Zc36guTp4bLbLfe6MVtNbzM5jZGthcO0tha8d7vd73Bu+zahjq+6T8Os/XRauOcBp3W2zXSkprlc6KEkx28uMjpxHsktaY2NeGk6aZABoaA4ubkWLjZMkp9iim3LTpLbe01/1M6eNBzzQgo91tKvrfjR1Lf0OcaVGJ26+TcoVEVBcSI6O4zwQU0E7z3a7BI7Z32nQ350VAPUR06XXgG+UMNRXRXizXJjpKG5Qs7BJ267mubs9rh3NPgkEOBB9wLpdUXGF65Zhw7jLErcygtNG9tfXXKaIilt8DGmGGMH+08gvIY3yQ0b0CSod6lrDYHs4v4Dw6qkuV3t1WI56iaT1DA6bTdPO/Djt0hYNBjQ0L5H6e69zc2fDPNyXkWTvlKDjH2Y1fbNyilT0tNbu1Wi+dV6Xx8eLJHHhUXHtSkm/dJ1cUnd+d+K/crY7jOFvEcOb/ALxW99RLdP2Y2xsJdVD7hd6hA9h4+Y8+PPyXWuHDmdWrHnX2txC9Ulna3udWzUEjI2t/vEkeB9T4VoeaOnqw2TnLiPD8Aa603iSBklbWQ/eexkMgcKxwOx6mmSuPjRLWhSBeuS86h6yGYBab7JkOLVTYX3O1XCnjkjpoHQ907S4MBGmnY8+7w079lYP1PkyY4ZeJUlKE8rU7i1jjKqVJre6be/JFLosIylDPaalGC7dpyau9tPWrSNd7WOe7taCT+QC5SU8sIHqRuZv27mkbVy+mbgaa3dWGWyQDtx7D6yoi9Rzd+oZO5sMYP5hpLj/J9ViHVLydyJQ3OrxjMsRtlooqurbc6DviExMTJH9vbIHuad+zx9daGwp3F6gx8nqC4HGipe2Mm3JJ1LdKNW2lTf0TRHS6U8PEfKzNr3OK9trX1d63orE2NzgSASB5OvOlx1pbF6LlDLeO+l6kzOvttj/eW91lO2z2OltLYYfSleAyERR6c5zo2vf77ALR/GKOpDgLK+SL9i9xxbjqSPNa6wy3XIcexyL7QaYMlDGyljRvbu8NIAJLmkfeIJPN071HLm8v8tPCopylBSU+63BXLXbF147lavXlXt5fSFxsH40cltKMmnGqUnS3b39tOtne6f8Aoan5Y6Ucl5BGMXq9X+olmix4WiujHqPicyPToSw9wLzL3dxadMHadnzE9q6F+eLrkVPZBxjf6KuqY3SQm4UxpoH9v9n1n6jDj8g5w38ldIZFQ41xJxf001F/yHDcrq6aO6skw+hqXVwE7O+KOQsd3tc9z5XyRdmiGNJezwTPnQF0N5RwBl2W5XyRchfb4ZnUtjm+3vnaynd4mqHMdsMllDY2+7iGtcN+Tu6lbNMXI/GOU8R5ZWYxmNkqsfvtIGmWjrGgODSNtc0gkOaR7OaSD+axjS/oB61MzxTLOPc54vtd6xVnI9ZYXObHkJ7IaCkkf2STSVHpuZC4M9RzGuLXEgED2K0sdSVwwJ2awWrjswVlktdLHTPusNGKZtbOGgSPaPxOYHA9r3/edsn20gIlREQBEXat9vNwkcwT08BA3uolEYP/ADKAtF8MeqwodV9itmc22guNBeaOqtlGLlG18UdXIwemfPjucGvjb9ZRryVZng34TXIFBzr+9mSX2iwPGrbdn1tHBjVwklrnMEpcyKKQNb6Te3TS8ku1/Z8+KGYz09ZdkMNPWWO5YpUTEh7I25ha4J2kHweySoa5p/8AVXHpMm6+8kwKLF6O6VVZQNj9L9pW242yevfHrQaamGR0pP8AvA95/vICx/I/DWJ87/FCxm4UMlLXw4Vj8F1yVkBD2iuiqJG0cMpGwJNuicWnz2RaKmHgHny09THL3NOPukhuNhwu92xlqjJ93xd5M417j7TA4j5fdb+a1z8I9HHU5xflEt9xu73LA71cYH09bWyWytqAWP8ALmy9lPL3/eAPcGuIOiDvys66fejfqO6Zc4rMqwXLMVfWVNK+kqqa60N4ENUxx7h3tfRN+81wDmu2NEedgkECznB9Lcc85y6h+oemtM+Q1lnfU4dh9oDml8zaJgE3p9xAAlma0A7Gu6TZ8qm2bZt1EZF1AcXcd9UFTNb8QvuR2+tdbqukomUMrGzgaZNC0j7vqdjh37AeO73BMh8P9KnWxwViWQx8b5ljzqS7zOqamgZVNkkdUEadLGKuna2OQjWzsA6G99o1D2ZfD/6v+Wbwa/OqOuu1Q0ucyqvOQw1gYXa2GtZI8tHgfhaB4H0QGyzLbByLl/WjYKx2P0D+IcYsEjKutvTW9jq2cucX0rSCXSMbHE0uGmtaZAXbIBpBfuoHjrn34k3GtM/GrDbLHjuQS0NPkVPtrrs5rCaT1mnTfFS1vYff7+isgu/Tt15ZHxo7AarPrfWY0KUU72Or2wVU0QAHovnfA2Z40NHbtEbBJHhV/wD6prqLp5WzRWazulaQ4OjvsAcDve9kjygL85Jx7U1fV/mvUNyk2ax8Z8XWz7HjzK/wauZsXdNVRsJ8tD5ZAw+73ujA2WFVF6aM7h5V5F5n59ymoZHXzzOHol3c6howwyduvfQjjjjafn6bl7HJXSV10cyYVQ4tml9ivlipHNcygqb7Sgvc38LpXMAMxHuDI5x359/KjjH/AIWXU5bhXUNHT26z0lwj+z1hbkMbYp4vftkbGSXN+hBUF1vps+rcDJwoZOzvq39rTa/laJPpvMjwOVHkSj3dt0vvTp/wT7/S7j/P+H1dr435JgxzIJgAySSnH2uMfNoikLT58DvZsj5FV36XOBLxgnVVdqXKpKerrrFbpLgypjm9QTPmIYyUb+9vtfIT3DYI8/X2qT4OPPYqnAXHD4PTc0tnN2m0fPu3UGxr6gfRezV/Cl6mqy8SXibLLDNdmN+ytrX3+p9d8Qb2jT/S2GlvjRO/zCqHG9HT6fxuTweDyKxZotbinJN/7Km1Vqn8XryT+X1BHlZcXI5OK542npumv2d07p35Mp6crhT8nco8qckMgfPWsqhZLRLUMLadtNG3wGP87LnNYXgDwCPfuXg5ZnmG9H1pvE32xmYct30uqK2eU7kfI4lwMvk+jA0/hj33O0P4t7WGfDG6q+N6Gvo8ZzKwWimrwDURUN3maHEDQPmAadrx3DR+q8a2/Bo5vvlVPU3jJ8RoZHuL3SVFfUzyyOJ8k9sJ2fqStcfRbyc3JLPm/tmoJQWm1BJKMn4je2l8vb2jN+olHjxWLH/V9z7n4cnbaX18W/j4Mswzj/NpumOEYbc6Vub5nKLzc75NVGL0zUH1HvY9gJ7gwMjAHttxHsqes46zDLeoGycd5zf6i5Vpr2U8lRPcXVbBC7T3uieXH8TB4Hg70CAfCu9bPhK8102MNxt3NtBR2EEn9mUprHQDfkjt+6NEknXtsrGXfBlzfH7tDUR8sY3QOhc2WCpENRFMxwOw5oHsQR4Id8vkpjpfQeX0+fKnLLBvI5OLUPdFvS3fxFUu1KvucHN6pg5UcMVCVQSTXdp186r5b8/JKlzzTFr1cKuyYpW41XZ5jgfBb7ZdZTGKSXtDCBod3humkxgn5bGytefJXKPMvHvIOY26+5FcbJf7o+m/aYoagR97IXerTCJ7PLGNJDmhhH187U+Zh8P/AA/F7lVVWU9TuMx3IyukqJIrbUVkxlLtuLiyQuLt7389rFncdcDYvndsyLJOo6XP62gqaeplt1Rg9xkZWNic0iGWSSZpLC1nb4PsVh6e9LroGWUoZO9SVXJe5P5aUr/xbt1V3TtnvVetPqmNRlDtafh6a+6+q0rssL0B8K3XB81t/Uhz9kv7Nqbuw0WNMyWpdJcbjPLF2CpJkJcGiBrwzfktJee1gBdcDqG60LfwVxdU5vcKq20z7lb3vxjGKhsgudynd2+lNK09vpRNPeXgBw7e0iTZDTSbOPiK8VVFuoLy6z3bPuWrM2u/Y+X3WzR0tDROqJC4OZQmre3cbOyNpdsgRgknyDr35A5FyXlLKq7JctvdZf75WO7p62tk73u/Jo+TWj2DWgNA8ABXsrB+F8zW+ZFXXmruF0qqiW8VRrK/uld21MxcXd7xvTjtxI37bXie6IgCIiAJ7IiAA6X0PLSCDoj2I8L4iA9yhzvJLY0No7/dKVo9hBWysA/wcveoueOS7br7HyFlVJr29C91TP0kWCogJWoerHmu3EGn5czdmvbeQ1Tv1kK9qn64ufaYAM5dy12v9Zc3v/8AdtQeiAn6Pr66hIvw8s5Gf5qhrv1auwz4hPUTH7crXw/zGI/qxV5RAWOj+Ix1HRfh5Uux/mgpnfrEuwz4k/UnH7cpV5/moaM/rCq0ogLON+Jh1LNGv6Uas/xtlCf/AKV9/rMepb/ahVf+Lof/AMVWJEBON764eeL/ADGWo5RyCnlJ2X26p+x7/wCz2hdeDrV56p/w8v5kf57zM/8AVxULIgJ0PXRz+YjH/S3lWj8xcHb/AMfdeBcerDmq6uJquWs1kJ/4gqm/o8KKkQGVXzljNsmhdDeMwv12icdllddJ5gT+enPKxeSV8ry573Pcfm47K4ogCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCKWOqDh6i4R5ar8btlVNVWwwQ1dK6p0ZWskaT2uIABIII3obGlE6AIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAs78RIf5wf/R6P/wCarEiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiID//Z";

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

export default function ShopApp() {
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
