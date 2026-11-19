/* STAIRLINE concept site — vanilla JS, no build step */
(() => {
  "use strict";
  document.documentElement.classList.add("js");
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const yen = (n) => "¥" + n.toLocaleString("ja-JP");

  /* ================= DATA ================= */
  const COLORS = {
    obsidian: { name: "Obsidian", upper: "#1d1f22", cage: "#3d4044", mid: "#2b2d30", sole: "#111213", lace: "#0d0e0f", accent: "#f1efea" },
    concrete: { name: "Concrete", upper: "#8c8a86", cage: "#55534f", mid: "#d9d5cd", sole: "#2a2c2f", lace: "#f1efea", accent: "#2f6bff" },
    brick:    { name: "Brick",    upper: "#7a3a29", cage: "#4a2118", mid: "#ebe4d8", sole: "#2a2c2f", lace: "#f1efea", accent: "#f1efea" },
    signal:   { name: "Signal",   upper: "#efede8", cage: "#2f6bff", mid: "#f1efea", sole: "#25282c", lace: "#2f6bff", accent: "#2f6bff" },
    sky:      { name: "Sky",      upper: "#2f6bff", cage: "#1a3f9c", mid: "#f1efea", sole: "#1c1e21", lace: "#f1efea", accent: "#f1efea" },
    chalk:    { name: "Chalk",    upper: "#e3e0d9", cage: "#b9b5ad", mid: "#f6f4ef", sole: "#9a978f", lace: "#e3e0d9", accent: "#0c0d0e" },
  };
  const MODELS = [
    { id: "rise",   name: "Rise",   use: "Urban / Stair", jp: "階段と街路のハイブリッド。段鼻をつかむグリップ。", weight: 285, drop: 8, stack: "32 / 24", cushion: 3, price: 26400, mTop: 148, badge: "New",  colors: ["obsidian", "concrete", "brick", "signal"], sold: [24.0, 29.5] },
    { id: "strata",   name: "Strata",   use: "Daily road",    jp: "毎日のロードランに。軽く、反発は素直。",         weight: 248, drop: 6, stack: "30 / 24", cushion: 3, price: 22000, mTop: 152, badge: "",     colors: ["sky", "obsidian", "chalk"],                sold: [27.0] },
    { id: "meridian", name: "Meridian", use: "Long run",      jp: "ハーフ以上の距離を支える最大クッション。",       weight: 268, drop: 6, stack: "40 / 34", cushion: 5, price: 29700, mTop: 134, badge: "",     colors: ["chalk", "signal", "obsidian"],             sold: [25.5, 30.0] },
    { id: "null",     name: "Null",     use: "Everyday",      jp: "履いていることを忘れる、最小構成の一足。",       weight: 210, drop: 4, stack: "22 / 18", cushion: 2, price: 18700, mTop: 162, badge: "",     colors: ["concrete", "brick", "obsidian"],            sold: [] },
  ];
  const SIZES = Array.from({ length: 13 }, (_, i) => 24 + i * 0.5);

  /* ================= SHOE SVG ================= */
  let uid = 0;
  function shoeSVG(model, colorKey, opts = {}) {
    const c = COLORS[colorKey];
    const m = model.mTop;
    const id = "s" + (uid++);
    const dy = m - 150;
    const midH = 196 - m;
    const r = Math.max(7, Math.min(15, midH / 2 - 7));
    const cy = (m + 196) / 2 + 1;
    let hexes = "";
    for (let x = 64, i = 0; x < 540; x += r * 2.15, i++) {
      const rr = i % 2 ? r * 0.82 : r;
      const pts = Array.from({ length: 6 }, (_, k) => {
        const a = Math.PI / 3 * k;
        return (x + rr * Math.cos(a)).toFixed(1) + "," + (cy + rr * Math.sin(a)).toFixed(1);
      }).join(" ");
      hexes += `<polygon points="${pts}" fill="${c.sole}" fill-opacity=".85" stroke="${c.cage}" stroke-width="1.5"/>`;
    }
    let lugs = "";
    for (let x = 52; x < 560; x += 22) lugs += `<rect x="${x}" y="222" width="12" height="6" rx="1" fill="${c.sole}"/>`;
    const eyelets = [[250, 76], [282, 86], [314, 95], [346, 103], [378, 110], [410, 116]];
    const laceZ = eyelets.map(([x, y], i) => `${i ? "L" : "M"}${x + (i % 2 ? 10 : -6)} ${y - (i % 2 ? 8 : 2)}`).join(" ");
    return `<svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="STAIRLINE ${model.name} ${c.name}" ${opts.cls ? `class="${opts.cls}"` : ""}>
  <defs>
    <pattern id="${id}m" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r=".9" fill="#000" fill-opacity=".28"/></pattern>
    <linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient>
  </defs>
  <g transform="translate(0,${dy})">
    <path d="M34 150 C26 118 34 88 62 72 C80 62 100 60 116 68 C132 78 152 84 170 78 L206 46 C216 38 230 40 236 50 L252 74 C310 98 400 116 470 126 C530 134 572 142 588 160 L586 166 L34 152 Z" fill="${c.upper}"/>
    <path d="M34 150 C26 118 34 88 62 72 C80 62 100 60 116 68 C132 78 152 84 170 78 L206 46 C216 38 230 40 236 50 L252 74 C310 98 400 116 470 126 C530 134 572 142 588 160 L586 166 L34 152 Z" fill="url(#${id}m)"/>
    <path d="M34 150 C26 118 34 88 62 72 C80 62 100 60 116 68 C132 78 152 84 170 78 L206 46 C216 38 230 40 236 50 L252 74 C310 98 400 116 470 126 C530 134 572 142 588 160 L586 166 L34 152 Z" fill="url(#${id}g)"/>
    <path d="M62 72 C80 62 100 60 116 68 C132 78 152 84 170 78" fill="none" stroke="${c.cage}" stroke-width="5" stroke-linecap="round"/>
    <g fill="none" stroke="${c.cage}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">
      <path d="M40 150 C38 122 48 98 72 84 L104 112 L98 150"/>
      <path d="M136 150 L174 106 L238 94 L268 150"/>
      <path d="M238 94 L302 106 L328 150"/>
      <path d="M302 106 L364 118 L392 150"/>
      <path d="M364 118 L430 126 L452 150"/>
      <path d="M468 152 L500 134 L588 162"/>
    </g>
    <rect x="22" y="64" width="16" height="34" rx="4" transform="rotate(-14 30 80)" fill="${c.accent}"/>
    <path d="M206 46 L236 50" stroke="${c.accent}" stroke-width="5" stroke-linecap="round"/>
    <path d="${laceZ}" fill="none" stroke="${c.lace}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    ${eyelets.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="${c.cage}" stroke="${c.accent}" stroke-opacity=".6"/>`).join("")}
    <text x="250" y="138" font-family="IBM Plex Mono, monospace" font-size="8" letter-spacing="2" fill="${c.accent}" fill-opacity=".75" transform="rotate(-6 250 138)">URBAN ENGINEERING</text>
  </g>
  <path d="M30 ${m} L548 ${m + 2} Q592 ${m + 12} 590 196 L30 196 Q22 ${(m + 196) / 2} 30 ${m} Z" fill="${c.mid}"/>
  ${hexes}
  <path d="M30 196 L590 196 Q588 220 552 224 L58 224 Q30 222 30 196 Z" fill="${c.sole}"/>
  ${lugs}
  <text x="60" y="${m + 12}" font-family="Archivo, sans-serif" font-weight="700" font-size="7" letter-spacing="1.5" fill="${c.sole}" fill-opacity=".7">STAIRLINE®</text>
</svg>`;
  }

  /* ================= LINEUP ================= */
  const grid = $("#lineup-grid");
  grid.innerHTML = MODELS.map((m, i) => `
    <article class="card reveal">
      <div class="card-top mono"><span>0${i + 1} / ${m.use}</span>${m.badge ? `<span class="badge">${m.badge}</span>` : ""}</div>
      <div class="card-shoe">${shoeSVG(m, m.colors[0])}</div>
      <div>
        <h3>${m.name}</h3>
        <p>${m.jp}</p>
        <div class="card-foot" style="margin-top:16px">
          <span class="card-price">${yen(m.price)}</span>
          <span class="card-dots">${m.colors.map((k) => `<span style="background:${COLORS[k].upper}" title="${COLORS[k].name}"></span>`).join("")}</span>
        </div>
      </div>
      <a href="#configure" class="card-link" data-model="${m.id}" aria-label="${m.name} をカスタマイズ"></a>
    </article>`).join("");
  $$(".card-link").forEach((a) => a.addEventListener("click", () => selectModel(a.dataset.model)));

  /* ================= COMPARE TABLE ================= */
  $("#spec-table tbody").innerHTML = MODELS.map((m) => `
    <tr><th scope="row">${m.name}</th><td>${m.use}</td><td>${m.weight} g</td><td>${m.drop} mm</td><td>${m.stack} mm</td>
    <td><span class="meter" aria-label="クッション ${m.cushion}/5">${[1, 2, 3, 4, 5].map((n) => `<i class="${n <= m.cushion ? "on" : ""}"></i>`).join("")}</span></td>
    <td>${yen(m.price)}</td></tr>`).join("");

  /* ================= CONFIGURATOR ================= */
  const state = { model: MODELS[0], color: MODELS[0].colors[0], size: null };
  const elModels = $("#cfg-models"), elColors = $("#cfg-colors"), elSizes = $("#cfg-sizes"), elShoe = $("#cfg-shoe");

  elModels.innerHTML = MODELS.map((m) => `<button type="button" data-id="${m.id}" aria-pressed="false">${m.name}</button>`).join("");
  elModels.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) selectModel(b.dataset.id); });

  function selectModel(id) {
    const m = MODELS.find((x) => x.id === id);
    if (!m) return;
    state.model = m;
    if (!m.colors.includes(state.color)) state.color = m.colors[0];
    if (state.size && m.sold.includes(state.size)) state.size = null;
    renderCfg(true);
  }
  function renderCfg(animate) {
    const { model: m, color } = state;
    $$("button", elModels).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.id === m.id)));
    elColors.innerHTML = m.colors.map((k) => {
      const c = COLORS[k];
      return `<button type="button" class="swatch" data-k="${k}" aria-pressed="${k === color}" aria-label="${c.name}" title="${c.name}" style="--a:${c.upper};--b:${c.mid}"></button>`;
    }).join("");
    elSizes.innerHTML = SIZES.map((s) => {
      const sold = m.sold.includes(s);
      return `<button type="button" data-s="${s}" aria-pressed="${state.size === s}" ${sold ? "disabled aria-label=\"" + s.toFixed(1) + " 在庫なし\"" : ""}>${s.toFixed(1)}</button>`;
    }).join("");
    elShoe.innerHTML = shoeSVG(m, color);
    if (animate && !reduced) { elShoe.classList.remove("swap"); void elShoe.offsetWidth; elShoe.classList.add("swap"); }
    $("#cfg-model-tag").textContent = m.name;
    $("#cfg-color-name").textContent = COLORS[color].name;
    $("#cfg-name").textContent = `STAIRLINE ${m.name.toUpperCase()}`;
    $("#cfg-meta").textContent = `${m.use} · ${m.weight} g · ${m.drop} mm drop`;
    $("#cfg-price").textContent = yen(m.price);
    const hint = $("#size-hint");
    hint.classList.remove("warn");
    hint.textContent = state.size ? `${state.size.toFixed(1)} cm を選択中` : (m.sold.length ? `取り消し線のサイズは在庫切れです` : "サイズを選んでください");
  }
  elColors.addEventListener("click", (e) => { const b = e.target.closest(".swatch"); if (!b) return; state.color = b.dataset.k; renderCfg(true); });
  elSizes.addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b || b.disabled) return; state.size = parseFloat(b.dataset.s); renderCfg(false); });

  $("#cfg-form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!state.size) {
      const hint = $("#size-hint");
      hint.textContent = "先にサイズを選んでください";
      hint.classList.add("warn");
      elSizes.animate?.([{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }], { duration: 300 });
      return;
    }
    addToCart(state.model.id, state.color, state.size);
  });

  /* ================= CART ================= */
  const store = {
    get() { try { return JSON.parse(localStorage.getItem("stairline-cart") || "[]"); } catch { return []; } },
    set(v) { try { localStorage.setItem("stairline-cart", JSON.stringify(v)); } catch { /* storage unavailable */ } },
  };
  let cart = store.get().filter((l) => MODELS.some((m) => m.id === l.id) && COLORS[l.color]);
  const drawer = $("#drawer"), scrim = $("#scrim");

  function addToCart(id, color, size) {
    const key = `${id}|${color}|${size}`;
    const ex = cart.find((l) => l.key === key);
    ex ? ex.qty++ : cart.push({ key, id, color, size, qty: 1 });
    saveCart();
    const m = MODELS.find((x) => x.id === id);
    toast(`${m.name} / ${COLORS[color].name} / ${size.toFixed(1)}cm を追加しました`);
    const cc = $("#cart-count");
    cc.classList.add("bump"); setTimeout(() => cc.classList.remove("bump"), 400);
    openDrawer();
  }
  function saveCart() { store.set(cart); renderCart(); }
  function renderCart() {
    const count = cart.reduce((a, l) => a + l.qty, 0);
    const sub = cart.reduce((a, l) => a + l.qty * MODELS.find((m) => m.id === l.id).price, 0);
    $("#cart-count").textContent = count;
    $("#cart-subtotal").textContent = yen(sub);
    $("#checkout-btn").disabled = !count;
    const goal = 50000;
    $("#ship-fill").style.width = Math.min(100, (sub / goal) * 100) + "%";
    $("#ship-msg").textContent = !count ? "送料無料 · 30日間返品OK" : sub >= goal ? "ギフトラッピング無料の対象です" : `あと ${yen(goal - sub)} でギフトラッピング無料`;
    const box = $("#cart-items");
    if (!count) { box.innerHTML = `<p class="empty">カートは空です。<br>まずは一足、選んでみてください。</p>`; return; }
    box.innerHTML = cart.map((l) => {
      const m = MODELS.find((x) => x.id === l.id);
      return `<div class="line-item" data-key="${l.key}">
        <div class="thumb">${shoeSVG(m, l.color)}</div>
        <div><h4>STAIRLINE ${m.name.toUpperCase()}</h4><p class="mono" style="margin:2px 0 0">${COLORS[l.color].name} · ${l.size.toFixed(1)} cm</p>
          <div class="qty"><button type="button" data-act="dec" aria-label="数量を減らす">−</button><span>${l.qty}</span><button type="button" data-act="inc" aria-label="数量を増やす">+</button></div></div>
        <div class="li-price">${yen(m.price * l.qty)}<button type="button" class="li-remove" data-act="rm">削除</button></div>
      </div>`;
    }).join("");
  }
  $("#cart-items").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-act]"); if (!b) return;
    const key = b.closest(".line-item").dataset.key;
    const l = cart.find((x) => x.key === key);
    if (b.dataset.act === "inc") l.qty++;
    if (b.dataset.act === "dec") l.qty--;
    if (b.dataset.act === "rm" || l.qty < 1) cart = cart.filter((x) => x.key !== key);
    saveCart();
  });
  let lastFocus = null;
  function openDrawer() {
    lastFocus = document.activeElement;
    scrim.hidden = false; drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false");
    setTimeout(() => $("#cart-close").focus(), 50);
  }
  function closeDrawer() {
    drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); scrim.hidden = true;
    lastFocus?.focus?.();
  }
  $("#cart-open").addEventListener("click", openDrawer);
  $("#cart-close").addEventListener("click", closeDrawer);
  scrim.addEventListener("click", closeDrawer);
  $("#checkout-btn").addEventListener("click", () => {
    const sub = $("#cart-subtotal").textContent;
    openModal("Checkout", `<p>これはコンセプトサイトのため、実際の決済は行われません。</p><p>小計 <strong>${sub}</strong>（税込・送料無料）</p><button class="btn btn-solid btn-block" id="demo-clear" type="button">カートを空にして閉じる</button>`);
    $("#demo-clear").addEventListener("click", () => { cart = []; saveCart(); closeModal(); closeDrawer(); toast("ご注文ありがとうございました（デモ）"); });
  });

  /* ================= MODAL ================= */
  const modal = $("#modal");
  function openModal(title, html) {
    $("#modal-title").textContent = title; $("#modal-body").innerHTML = html;
    modal.hidden = false; setTimeout(() => $("#modal-close").focus(), 30);
  }
  function closeModal() { modal.hidden = true; }
  $("#modal-close").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!modal.hidden) closeModal(); else if (drawer.classList.contains("open")) closeDrawer();
  });
  $("#size-guide-btn").addEventListener("click", () => {
    const rows = SIZES.filter((_, i) => i % 1 === 0).map((s) => {
      const us = String(s - 18);
      const eu = Math.round(s * 1.5 + 2);
      return `<tr><td>${s.toFixed(1)}</td><td>${us}</td><td>${eu}</td></tr>`;
    }).join("");
    openModal("Size guide", `<p>かかとを壁につけ、最も長い指先までを測ってください。HEX LATTICE はつま先に余裕を持たせた設計のため、普段のサイズで選ぶのがおすすめです。</p><table><thead><tr><th>JP (cm)</th><th>US M</th><th>EU</th></tr></thead><tbody>${rows}</tbody></table>`);
  });

  /* ================= TOAST ================= */
  let tt;
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 2600); }

  /* ================= NEWSLETTER ================= */
  $("#join-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = $("#email").value.trim(), msg = $("#join-msg");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { msg.textContent = "メールアドレスの形式を確認してください（例: you@example.com）"; msg.className = "form-msg err"; return; }
    msg.textContent = `${v} を登録しました（デモのため実際の送信は行われません）`; msg.className = "form-msg ok";
    e.target.reset();
  });

  /* ================= NAV ================= */
  const nav = $("#nav"), menuBtn = $("#menu-btn"), links = $(".nav-links");
  menuBtn.addEventListener("click", () => { const o = links.classList.toggle("open"); menuBtn.setAttribute("aria-expanded", String(o)); });
  links.addEventListener("click", (e) => { if (e.target.closest("a")) { links.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); } });

  /* ================= SCROLL FX ================= */
  const bar = $("#progress-bar"), heroImg = $("#hero-media img");
  const mText = $("#manifesto-text");
  const HI = new Set(["forward.", "concrete,", "iconic"]);
  mText.innerHTML = mText.textContent.split(" ").map((w) => `<span class="w${HI.has(w.toLowerCase()) ? " hi" : ""}">${w}</span>`).join(" ");
  const words = $$(".w", mText);
  function onScroll() {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    nav.classList.toggle("is-scrolled", y > 20);
    if (!reduced && y < innerHeight * 1.2) heroImg.style.transform = `scale(1.06) translateY(${y * 0.06}px)`;
    const r = mText.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35)));
    const n = Math.round(p * words.length);
    words.forEach((w, i) => w.classList.toggle("on", i < n));
  }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();

  // reveal — only for elements starting below the fold; everything stays visible at rest
  const revealEls = $$(".reveal, .tech-pillars article, .stats li, .story, .lab-media img");
  const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.remove("pre"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px" });
  if (!reduced) revealEls.forEach((el, i) => {
    if (el.getBoundingClientRect().top > innerHeight) { el.classList.add("reveal", "pre"); el.style.transitionDelay = (i % 4) * 70 + "ms"; io.observe(el); }
  });

  // counters
  const cio = new IntersectionObserver((es) => es.forEach((en) => {
    if (!en.isIntersecting) return;
    cio.unobserve(en.target);
    const el = en.target, end = +el.dataset.count, suf = el.dataset.suffix || "";
    if (reduced) return;
    const t0 = performance.now();
    const step = (t) => { const k = Math.min(1, (t - t0) / 1400); const e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(end * e).toLocaleString("en-US") + suf; if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: 0.6 });
  $$("[data-count]").forEach((el) => { el.textContent = (+el.dataset.count).toLocaleString("en-US") + (el.dataset.suffix || ""); cio.observe(el); });

  // magnetic buttons
  if (!reduced && matchMedia("(pointer: fine)").matches) {
    $$(".magnetic").forEach((b) => {
      b.addEventListener("pointermove", (e) => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`; });
      b.addEventListener("pointerleave", () => { b.style.transform = ""; });
    });
  }

  /* ================= HEX LATTICE SIM ================= */
  const cv = $("#hex-canvas"), ctx = cv.getContext("2d");
  const loadIn = $("#load");
  let W = 0, H = 0, DPR = 1, cells = [], R = 20;
  const pointer = { x: 0, y: 0, active: false };
  let load = 1;

  function inFoot(x, y) {
    // footprint: forefoot ellipse + heel ellipse joined by a waist (toe → right)
    const nx = x / W, ny = y / H;
    const e = (cx, cy, rx, ry) => ((nx - cx) / rx) ** 2 + ((ny - cy) / ry) ** 2 <= 1;
    return e(0.66, 0.5, 0.26, 0.36) || e(0.26, 0.52, 0.16, 0.28) || (nx > 0.26 && nx < 0.66 && Math.abs(ny - 0.52) < 0.22);
  }
  function build() {
    const rect = cv.getBoundingClientRect();
    DPR = Math.min(2, devicePixelRatio || 1);
    W = rect.width; H = rect.height;
    cv.width = W * DPR; cv.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    R = Math.max(12, Math.min(26, W / 44));
    const hw = Math.sqrt(3) * R;
    cells = [];
    for (let row = -1, y = 0; y < H + R; row++, y = row * R * 1.5) {
      for (let x = (row % 2 ? hw / 2 : 0) - hw; x < W + hw; x += hw) {
        cells.push({ x, y, foot: inFoot(x, y), v: 0, vel: 0 });
      }
    }
  }
  function hexPath(x, y, r) {
    ctx.beginPath();
    for (let k = 0; k < 6; k++) { const a = Math.PI / 3 * k + Math.PI / 6; const px = x + r * Math.cos(a), py = y + r * Math.sin(a); k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.closePath();
  }
  function setLoad(v) {
    load = v; loadIn.value = v;
    loadIn.style.setProperty("--p", ((v - 0.5) / 2.5) * 100 + "%");
    $("#hud-load").textContent = v.toFixed(1) + "×";
    $("#hud-comp").textContent = (2.8 * Math.pow(v, 0.78)).toFixed(1) + " mm";
    $("#hud-ret").textContent = Math.round(74 - (v - 0.5) * 2.4) + "%";
    $$(".tech-modes .chip").forEach((c) => { const on = Math.abs(+c.dataset.load - v) < 0.05; c.classList.toggle("is-active", on); c.setAttribute("aria-selected", String(on)); });
  }
  loadIn.addEventListener("input", () => setLoad(+loadIn.value));
  $$(".tech-modes .chip").forEach((c) => c.addEventListener("click", () => setLoad(+c.dataset.load)));
  cv.addEventListener("pointermove", (e) => { const r = cv.getBoundingClientRect(); pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; pointer.active = true; });
  cv.addEventListener("pointerleave", () => { pointer.active = false; });

  let visible = true, drawn = false;
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; }, { rootMargin: "100px" }).observe(cv);

  function frame(t) {
    requestAnimationFrame(frame);
    if ((!visible && drawn) || !W) return;
    drawn = true;
    // impact point: pointer, or an automatic heel→toe gait cycle
    let ix, iy, strength;
    if (pointer.active) { ix = pointer.x; iy = pointer.y; strength = 1; }
    else {
      const cyc = reduced ? 0.35 : ((t / 1600) % 1);
      const k = Math.min(1, cyc / 0.75);
      ix = W * (0.2 + 0.62 * k); iy = H * (0.54 - 0.05 * Math.sin(k * Math.PI));
      strength = cyc < 0.75 ? Math.sin(Math.min(1, cyc / 0.12) * Math.PI / 2) : Math.max(0, 1 - (cyc - 0.75) / 0.1);
    }
    const spread = R * (3.2 + load * 1.2);
    ctx.clearRect(0, 0, W, H);
    for (const c of cells) {
      const d = Math.hypot(c.x - ix, c.y - iy);
      const target = c.foot ? Math.min(1, strength * (load / 2.2) * Math.exp(-(d * d) / (2 * spread * spread))) * 1.25 : 0;
      // spring: compress fast, rebound with slight overshoot
      c.vel += (target - c.v) * 0.22; c.vel *= 0.68; c.v += c.vel;
      const v = Math.max(-0.15, Math.min(1, c.v));
      if (c.foot) {
        const r = R * (0.9 - v * 0.38);
        hexPath(c.x, c.y, r);
        ctx.fillStyle = v > 0.02 ? `rgba(47,107,255,${0.12 + v * 0.75})` : "rgba(241,239,234,0.05)";
        ctx.fill();
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = v > 0.02 ? `rgba(160,190,255,${0.4 + v * 0.6})` : "rgba(241,239,234,0.28)";
        ctx.stroke();
        if (v < -0.04) { hexPath(c.x, c.y, R * 0.95); ctx.strokeStyle = `rgba(241,239,234,${-v * 2})`; ctx.stroke(); }
      } else {
        hexPath(c.x, c.y, R * 0.9);
        ctx.strokeStyle = "rgba(241,239,234,0.045)"; ctx.lineWidth = 1; ctx.stroke();
      }
    }
    // impact crosshair
    if (strength > 0.05) {
      ctx.strokeStyle = `rgba(241,239,234,${0.5 * strength})`; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(ix, iy, spread * 0.55, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ix - 8, iy); ctx.lineTo(ix + 8, iy); ctx.moveTo(ix, iy - 8); ctx.lineTo(ix, iy + 8); ctx.stroke();
    }
    ctx.fillStyle = "rgba(241,239,234,0.45)"; ctx.font = "11px 'IBM Plex Mono', monospace";
    ctx.fillText("HEEL", W * 0.12, H - 16); ctx.fillText("TOE →", W * 0.84, H - 16);
  }
  addEventListener("resize", () => { clearTimeout(build._t); build._t = setTimeout(build, 120); });

  /* ================= INIT ================= */
  renderCfg(false);
  renderCart();
  setLoad(1);
  build();
  requestAnimationFrame(frame);
})();
