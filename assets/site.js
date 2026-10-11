// Ссылка на оплату годовой подписки из Lemon Squeezy:
// Store → Products → Premium → Share → «Checkout link».
// Пока здесь заглушка, кнопки оплаты неактивны.
const CHECKOUT_URL = "https://STORE.lemonsqueezy.com/buy/VARIANT-ID";

(function () {
  const ready = !CHECKOUT_URL.includes("STORE.") && !CHECKOUT_URL.includes("VARIANT-ID");

  // Приложение открывает лендинг как …/?u=<id аккаунта в Supabase>.
  // id уходит в оплату как custom data — по нему вебхук откроет Premium
  // именно этому аккаунту. Принимаем только UUID: в ссылку больше ничего
  // не подставляем.
  const params = new URLSearchParams(location.search);
  const rawID = (params.get("u") || "").trim().toLowerCase();
  const userID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(rawID) ? rawID : "";

  function checkoutURL() {
    const url = new URL(CHECKOUT_URL);
    if (userID) url.searchParams.set("checkout[custom][user_id]", userID);
    url.searchParams.set("checkout[custom][source]", userID ? "app" : "web");
    return url.toString();
  }

  document.querySelectorAll("[data-checkout]").forEach((el) => {
    if (ready) {
      el.href = checkoutURL();
    } else {
      el.removeAttribute("href");
      el.setAttribute("aria-disabled", "true");
      el.title = "Checkout is not connected yet";
    }
  });

  // Пришёл не из приложения — подскажем, как привязать покупку потом.
  if (!userID) {
    document.querySelectorAll("[data-from-web]").forEach((el) => (el.hidden = false));
  }

  const reveal = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    reveal.forEach((el) => io.observe(el));
  } else {
    reveal.forEach((el) => el.classList.add("in"));
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
