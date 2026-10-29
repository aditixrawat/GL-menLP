/* Men Landing v8 – behaviour (vanilla JS, no dependencies) */
(function () {
  const $ = id => document.getElementById(id);
  const EMPTY = () => ({ cats: [], occs: [], sizes: [], prices: [], colls: [] });
  const S = { occ: "work", look: 0, f: EMPTY(), dd: null, sort: "best", more: false, sheet: null, picks: {}, bag: 0, joined: false };
  const W = () => document.documentElement.clientWidth;
  const bp = () => (W() >= 1100 ? "xl" : W() >= 760 ? "wide" : "sm");
  let toastT;

  const SEEN = new Set(COMMUNITY.map(c => c[1]));
  /* decision info for proof cards: verified FACTS first, then what the catalogue itself guarantees */
  function proof(p) {
    const f = FACTS[p.id] || {}, sizes = SZ[p.sz];
    const top = f.rating ? `<span class="pc-r">★ ${f.rating}${f.reviews ? ` <i>(${f.reviews} reviews)</i>` : ""}</span>` : "";
    const facts = [f.fit || (p.sz === "shoe" ? "Wider last, usual size" : ""), f.mat, sizes[0] + "–" + sizes[sizes.length - 1]].filter(Boolean).join(" · ");
    return `${top}<span class="pc-m">${facts}</span>`;
  }
  const card = (p, extra, rich) => `<div class="pc"><div class="pc-img"><img src="${p.img}" alt="${p.name}" loading="lazy">${extra || ""}${rich && SEEN.has(p.id) ? `<button class="pc-seen" data-a="jump" data-v="fit">On real people</button>` : ""}<button class="pc-add" data-a="open" data-v="${p.id}" aria-label="Add to bag">+</button></div><div class="pc-t"><small>${p.line}</small><span>${p.name}</span><b>${p.price}</b>${rich ? proof(p) : ""}</div></div>`;
  const hdrH = () => document.querySelector(".hdr").offsetHeight;
  const go = id => { const el = $(id); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - hdrH() + 1, behavior: "smooth" }); };
  const count = patch => P.filter(p => GROUPS.every(([k]) => !(patch[k] || []).length || HIT[k](p, patch[k]))).length;
  const from = list => list.length ? "from " + fmt(Math.min(...list.map(p => p.pr))).replace(".00", "") : "";

  /* recently viewed, per browser; page works the same if storage is blocked */
  const RK = "gl-men-recent";
  let recent = [];
  try { recent = JSON.parse(localStorage.getItem(RK) || "[]").filter(id => BY[id]); } catch (e) {}
  function remember(id) {
    recent = [id, ...recent.filter(x => x !== id)].slice(0, 8);
    try { localStorage.setItem(RK, JSON.stringify(recent)); } catch (e) {}
    renderRecent();
  }
  function renderRecent() {
    $("recent").hidden = !recent.length;
    $("recentRail").innerHTML = recent.map(id => card(BY[id], "", true)).join("");
  }
  function route(v) {
    if (v === "new") return toShop({}, "new");
    if (v === "best" || v === "all") return toShop({}, "best");
    toShop({ cats: ROUTE[v] });
  }
  function toShop(patch, sort) {
    S.f = Object.assign(EMPTY(), patch); S.more = false; S.dd = null;
    if (sort) S.sort = sort; $("sort").value = S.sort; renderShop(); setTimeout(() => go("shop"), 20);
  }
  function flash(msg, n) {
    S.bag += n || 1; S.sheet = null; S.picks = {}; renderSheet();
    const b = $("bagN"); b.hidden = false; b.textContent = S.bag;
    const t = $("toast"); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => (t.hidden = true), 2400);
  }

  /* hero slideshow: 6s per slide, pauses on hover/focus, off for reduced motion */
  const H = { i: 0, paused: matchMedia("(prefers-reduced-motion: reduce)").matches, hover: false, t: null };
  function renderHero() {
    $("heroSlides").innerHTML = HERO.map(([k, t, d, img, ctas]) => `<div class="hs" role="group" aria-roledescription="slide"><img src="${img}" alt=""><div class="shade" style="background:linear-gradient(0deg,rgba(0,0,0,.68) 0%,rgba(0,0,0,0) 62%)"></div><div class="hero-txt"><span class="chip chip-white">${k}</span><p class="hero-h">${t}</p><p>${d}</p><div class="row">${ctas.map(([l, a, v], j) => `<button class="btn ${j ? "btn-ghost" : "btn-white"}" data-a="${a}" data-v="${v}">${l}</button>`).join("")}</div></div></div>`).join("");
    $("heroDots").innerHTML = HERO.map(([k], i) => `<button class="hd" data-a="herodot" data-v="${i}" aria-label="Slide ${i + 1}: ${k}"><i></i></button>`).join("");
    heroShow();
  }
  function heroShow() {
    const run = H.paused || H.hover ? "paused" : "running";
    document.querySelectorAll(".hs").forEach((el, i) => {
      const on = i === H.i; el.classList.toggle("on", on); el.setAttribute("aria-hidden", !on); el.setAttribute("aria-label", i + 1 + " of " + HERO.length);
      el.querySelectorAll("button").forEach(b => (b.tabIndex = on ? 0 : -1));
    });
    document.querySelectorAll(".hd").forEach((el, i) => { el.classList.toggle("on", i === H.i); el.innerHTML = `<i style="animation-play-state:${run}"></i>`; });
    $("heroPP").textContent = H.paused ? "▶" : "❚❚"; $("heroPP").setAttribute("aria-label", H.paused ? "Play slideshow" : "Pause slideshow");
  }
  function heroTo(i) { H.i = (i + HERO.length) % HERO.length; heroShow(); heroTimer(); }
  function heroTimer() { clearTimeout(H.t); if (!H.paused && !H.hover) H.t = setTimeout(() => heroTo(H.i + 1), 6000); }
  const heroHold = on => { H.hover = on; document.querySelectorAll(".hd i").forEach(el => (el.style.animationPlayState = H.paused || on ? "paused" : "running")); if (on) clearTimeout(H.t); else heroTo(H.i); };
  $("hero").addEventListener("mouseenter", () => heroHold(true)); $("hero").addEventListener("mouseleave", () => heroHold(false));
  $("hero").addEventListener("focusin", () => heroHold(true)); $("hero").addEventListener("focusout", () => heroHold(false));
  let hx = null;
  $("hero").addEventListener("touchstart", e => (hx = e.touches[0].clientX), { passive: true });
  $("hero").addEventListener("touchend", e => { if (hx === null) return; const dx = e.changedTouches[0].clientX - hx; hx = null; if (Math.abs(dx) > 40) heroTo(H.i + (dx < 0 ? 1 : -1)); });

  /* occasion */
  function renderOcc() {
    $("occTabs").innerHTML = OCC.map(([k, t]) => `<button class="tab${S.occ === k ? " on" : ""}" data-a="occ" data-v="${k}">${t}</button>`).join("");
    const [k, t, note, tip] = OCC.find(o => o[0] === S.occ), ids = EDITS[k];
    $("occPanel").innerHTML = `<div class="occ"><div class="occ-img"><img src="${OCC_IMG[k]}" alt="${t}"><div class="occ-cap"><b>${t}</b><span>${note}</span></div></div><div class="occ-r"><div class="occ-prods">${ids.map(id => card(BY[id])).join("")}</div><div class="tip"><b>How to wear it</b><span>${tip}</span></div><button class="btn btn-dark" data-a="occshop" data-v="${k}">See all ${ids.length} for ${t} →</button></div></div>`;
  }

  /* static sections */
  function renderStatic() {
    $("cats").innerHTML = CATS.map(([k, t, img]) => { const list = ROUTE[k] ? P.filter(p => ROUTE[k].includes(p.cat)) : P.filter(p => p.tag === k); return `<button class="cat" data-a="cat" data-v="${k}"><img src="${img}" alt="${t}" loading="lazy"><div class="cat-cap"><b>${t}</b><span>${list.length} styles · ${from(list)}</span></div></button>`; }).join("");
    $("bands").innerHTML = PRICES.map(([t, fn]) => { const list = P.filter(fn), fw = list.filter(p => FOOTWEAR.includes(p.cat)).length, ap = list.length - fw; return `<button class="band" data-a="price" data-v="${t}"><b>${t}</b><span>${[fw && fw + " footwear", ap && ap + " apparel"].filter(Boolean).join(" · ")}</span><i>${list.length} styles →</i></button>`; }).join("");
    $("combos").innerHTML = BUDGET.map(([t, f], i) => [t, f, i, count(f)]).filter(c => c[3]).map(([t, , i, n]) => `<button class="combo" data-a="combo" data-v="${i}">${t}<small>${n}</small></button>`).join("");
    $("bestRail").innerHTML = P.filter(p => p.tag === "best").map(p => card(p, "", true)).join("");
    $("tryBox").innerHTML = STORES.length
      ? `<div class="head"><h2>See it. Try it. Find your fit.</h2><span class="sub">Rather shop in person? Walk into a Gully Labs store, try your size and feel the material before you pay.</span></div><div class="stores">${STORES.map(([city, addr, hrs, url]) => `<div class="store"><small>Gully Labs store</small><b>${city}</b>${addr ? `<span>${addr}</span>` : ""}${hrs ? `<small>${hrs}</small>` : ""}<a class="ulink" href="${url}" target="_blank" rel="noopener">Get directions</a></div>`).join("")}</div><div class="try-alt"><b>Ordering online instead?</b><span>Pay on delivery and swap or return within 30 days.</span><button class="ulink" data-a="openchart">Check your size</button></div>`
      : `<div class="head"><h2>Rather try it on first?</h2><span class="sub">Do the try-on at home. If it isn't right, it goes back.</span></div><ol class="steps"><li><b>Pick your usual size</b><span>Built on a wider last. Unsure? Match your foot length on the size chart.</span></li><li><b>Pay when it arrives</b><span>Choose cash on delivery at checkout. Dispatched within 24 hours.</span></li><li><b>Try it at home</b><span>Wear it indoors, with the clothes you'd actually pair it with.</span></li><li><b>Not right? Swap or return</b><span>Easy returns and exchanges within 30 days.</span></li></ol><div class="row"><button class="btn btn-dark" data-a="openchart">Check your size</button><button class="btn btn-outline" data-a="cat" data-v="best">Start with a bestseller</button></div>`;
    $("dropItems").innerHTML = ["bitter", "filter"].map(id => card(BY[id])).join("");
    $("lookRail").innerHTML = LOOKS.map(([title, rows], i) => `<article class="look"><div class="look-img"><img src="${LOOK_IMG[i]}" alt="${title}" loading="lazy"><span class="chip">${rows.length} pieces</span></div><b>${title}</b><div>${rows.map(([id, role]) => `<div class="look-row"><div class="th"><img src="${BY[id].img}" alt="${BY[id].name}" loading="lazy"></div><div><small>${role}</small><span>${BY[id].name}</span></div><button class="sm" data-a="open" data-v="${id}">Add</button></div>`).join("")}</div><button class="btn btn-dark" data-a="lookadd" data-v="${i}">Add the full look</button></article>`).join("");
    $("comm").innerHTML = COMMUNITY.map(([img, id]) => `<div class="cm"><img src="${img}" alt="Worn by the community" loading="lazy"><button class="cm-b" data-a="open" data-v="${id}"><img src="${BY[id].img}" alt=""><span><span>${BY[id].name}</span><b>${BY[id].price}</b></span><i>+</i></button></div>`).join("");
    $("colls").innerHTML = COLLS.map(([t, story, img, isNew]) => `<button class="coll" data-a="coll" data-v="${t}"><div class="coll-img"><img src="${img}" alt="${t}" loading="lazy">${isNew ? '<span class="chip">New</span>' : ""}</div><div class="coll-t"><div><b>${t}</b><small>${P.filter(p => p.coll === t).length} styles</small></div><span>${story}</span></div></button>`).join("");
  }

  /* looks rail */
  function setLook(i, scroll) {
    S.look = Math.max(0, Math.min(LOOKS.length - 1, i));
    if (scroll) { const el = $("lookRail"), c = el.children[S.look]; el.scrollTo({ left: c.offsetLeft - el.firstElementChild.offsetLeft, behavior: "smooth" }); }
    $("lookDots").innerHTML = LOOKS.map(([t], j) => `<button class="dot${j === S.look ? " on" : ""}" data-a="lookdot" data-v="${j}" aria-label="${t}"></button>`).join("");
    $("lookPrev").classList.toggle("dim", S.look === 0); $("lookNext").classList.toggle("dim", S.look === LOOKS.length - 1);
  }

  /* shop grid */
  function banners() {
    const x = bp() === "xl", wide = bp() !== "sm";
    const u = s => `url("${s}")`, lk = LOOKS[0];
    const photo = (k, t, d, cta, bg, go, extra) => ({ cls: "bn-photo", k, t, d, cta, bg: u(bg), shade: "linear-gradient(0deg,rgba(0,0,0,.7) 0%,rgba(0,0,0,.05) 60%)", go, ...extra });
    const prod = (k, t, d, cta, pic, go) => ({ cls: "bn-plain", k, t, d, cta, bg: "#f4f4f4", pic: u(pic), go, size: x ? "22px" : wide ? "20px" : "17px" });
    return [
      photo("New drop", "The Kaapi Issue", "Two pairs, with coffee beans printed on the sockliner.", "Shop Kaapi", AS + "gl-kaapi-look-01.jpg?v=10865441980311467331789554981", () => toShop({ colls: ["Kaapi"] })),
      photo("Shop the look", lk[0], lk[1].length + " pieces, add them together or one at a time.", "See the look", LOOK_IMG[0], () => go("looks"), { thumbs: lk[1].map(([id]) => u(BY[id].img)) }),
      { cls: "bn-plain", k: "Under ₹2,000", t: "Gully 17 jerseys, ₹1,990.", d: "Polo or crew neck, in green, blue and beige.", cta: "Shop under ₹2,000", bg: "#f7f4ec", size: x ? "24px" : wide ? "22px" : "18px", go: () => toShop({ prices: ["Under ₹2,000"] }) },
      prod("Just in", "Megh, Rekhe and Kharif.", "Three new Gully Number 001 colourways.", "Shop new drops", CDN + "86A0794.jpg?v=1787403675&width=900", () => toShop({}, "new")),
      prod("Hidden gems", "Baaz Taal Blue.", "One of the pairs people find last and wear most.", "Shop Baaz", CDN + "TB1.webp?v=1789621134&width=900", () => toShop({ colls: ["Baaz"] })),
      photo("Fit", "Take your usual size.", "Built on a wider last. 30-day exchange if it isn't right.", "Size chart", AS + "gl-kaapi-campaign-back-tab.jpg?v=28665856757239752161789553589", () => openChart())
    ];
  }
  let BN = [];
  const match = (p, skip) => GROUPS.every(([k]) => k === skip || !S.f[k].length || HIT[k](p, S.f[k]));
  function renderShop() {
    let list = P.filter(p => match(p));
    const by = t => (a, b) => ((b.tag === t) - (a.tag === t)) || a.rank - b.rank;
    if (S.sort === "best") list = [...list].sort(by("best"));
    if (S.sort === "new") list = [...list].sort(by("new"));
    if (S.sort === "low") list = [...list].sort((a, b) => a.pr - b.pr);
    if (S.sort === "high") list = [...list].sort((a, b) => b.pr - a.pr);
    if (S.sort === "best" && S.f.occs.length === 1) { const e = EDITS[S.f.occs[0]]; list = [...list].sort((a, b) => e.indexOf(a.id) - e.indexOf(b.id)); }
    const b = bp(), per = b === "xl" ? 12 : b === "wide" ? 9 : 8;
    const slots = b === "xl" ? [4, 10, 17, 23, 30, 36] : b === "wide" ? [3, 8, 14, 19, 25, 30] : [2, 7, 12, 17, 22, 27];
    BN = banners(); const cells = []; let bi = 0;
    list.forEach((p, i) => {
      if (slots.includes(i) && bi < BN.length) { cells.push({ banner: bi }); bi++; }
      cells.push({ p });
    });
    const shown = S.more ? cells : cells.slice(0, per), shownN = shown.filter(c => c.p).length;
    $("grid").innerHTML = shown.map(c => {
      if (c.p) { const p = c.p; return card(p, p.tag ? `<span class="pc-tag${p.tag === "new" ? " new" : ""}">${p.tag === "new" ? "New" : "Bestseller"}</span>` : ""); }
      const n = BN[c.banner];
      return `<button class="bn ${n.cls}" data-a="banner" data-v="${c.banner}" style="background-color:${n.bg};${n.bg.startsWith("url") ? `background-image:${n.bg};` : ""}"><div class="shade" style="background:${n.shade || "none"}"></div><span class="chip">${n.k}</span>${n.pic ? `<div class="bn-pic" style="background-image:${n.pic}"></div>` : ""}<div class="bn-b">${n.stars ? '<span class="stars">★★★★★</span>' : ""}<span class="bn-t" style="font-size:${n.size || (b === "xl" ? "28px" : b === "wide" ? "24px" : "20px")}">${n.t}</span><span class="bn-d">${n.d}</span>${n.thumbs ? `<div class="bn-th">${n.thumbs.map(t => `<i style="background-image:${t}"></i>`).join("")}</div>` : ""}<span class="bn-cta">${n.cta}<span>→</span></span></div></button>`;
    }).join("");
    $("resultCount").textContent = list.length + (list.length === 1 ? " style" : " styles");
    $("empty").hidden = list.length > 0;
    $("more").hidden = S.more || shownN >= list.length; $("shownLine").textContent = "Showing " + shownN + " of " + list.length;
    const active = GROUPS.reduce((a, [k]) => a + S.f[k].length, 0);
    $("pills").innerHTML = GROUPS.map(([k, t]) => { const n = S.f[k].length; return `<button class="pill${n ? " has" : ""}${S.dd === k ? " open" : ""}" data-a="dd" data-v="${k}">${n ? t + " · " + n : t}<small>${S.dd === k ? "▲" : "▼"}</small></button>`; }).join("") + (active ? `<button class="linkbtn" data-a="clearall">Clear all</button>` : "");
    const chips = GROUPS.flatMap(([k]) => S.f[k].map(v => [k, v]));
    $("chips").hidden = !chips.length;
    $("chips").innerHTML = chips.map(([k, v]) => `<button class="fchip" data-a="tog" data-k="${k}" data-v="${v}">${LABEL[k](v)} <span aria-label="Remove">×</span></button>`).join("");
    const tray = $("tray"); tray.hidden = !S.dd;
    if (S.dd) {
      const k = S.dd, opts = k === "cats" ? Object.keys(CAT_L) : k === "occs" ? OCC.map(o => o[0]) : k === "sizes" ? [...SZ.shoe, ...SZ.app] : k === "prices" ? PRICES.map(x => x[0]) : COLL_F.filter(c => P.some(p => p.coll === c));
      tray.innerHTML = `<div class="tray-in"><div class="opts">${opts.map(v => { const on = S.f[k].includes(v), n = P.filter(p => match(p, k) && HIT[k](p, [v])).length; return `<button class="opt${on ? " on" : ""}" style="opacity:${n || on ? 1 : .35}" data-a="tog" data-k="${k}" data-v="${v}">${LABEL[k](v)}<small>${n}</small></button>`; }).join("")}</div><div class="tray-f"><button class="linkbtn" data-a="trayclear">Clear ${GROUPS.find(g => g[0] === k)[1].toLowerCase()}</button><button class="btn btn-dark" data-a="closetray">Show ${list.length} ${list.length === 1 ? "style" : "styles"}</button></div></div>`;
    }
  }

  /* size sheet */
  function renderSheet() {
    const wrap = $("sheetWrap"); wrap.hidden = !S.sheet; if (!S.sheet) return;
    const items = S.sheet.ids.map(id => BY[id]), look = S.sheet.look, all = items.every(p => S.picks[p.id]);
    $("sheet").innerHTML = `<div class="sh-h"><b>${look ? look + ": pick your sizes" : "Select size"}</b><button class="x" data-a="closesheet" aria-label="Close">×</button></div>${items.map(p => `<div class="sh-it"><div class="sh-p"><i style="background-image:url('${p.img}')"></i><div><b>${p.name}</b><span>${look ? p.line : p.line + " · " + p.price}</span></div></div><div class="sizes">${SZ[p.sz].map(z => `<button class="sz${S.picks[p.id] === z ? " on" : ""}" data-a="size" data-id="${p.id}" data-v="${z}">${z}</button>`).join("")}</div></div>`).join("")}<div class="sh-n"><span>Take your usual size. Built on a wider last.</span><button data-a="openchart">Size chart</button></div><button class="sh-add${all ? "" : " off"}" data-a="sheetadd">${all ? (items.length > 1 ? "Add " + items.length + " pieces to bag" : "Add to bag · " + S.picks[items[0].id]) : (items.length > 1 ? "Pick a size for each piece" : "Select a size")}</button>`;
  }
  function openChart() {
    $("chart").innerHTML = `<div class="sh-h"><b>Size chart</b><button class="x" data-a="closechart" aria-label="Close">×</button></div><div class="cr h"><span>UK</span><span>EU</span><span>Foot length</span></div>${CHART.map(r => `<div class="cr"><b>${r[0]}</b><span>${r[1]}</span><span>${r[2]}</span></div>`).join("")}`;
    $("chartWrap").hidden = false;
  }

  /* events */
  document.addEventListener("click", e => {
    const el = e.target.closest("[data-a]"); if (!el) return;
    const a = el.dataset.a, v = el.dataset.v;
    if ((a === "closesheet" || a === "closechart") && el.classList.contains("overlay") && e.target !== el) return;
    switch (a) {
      case "herodot": heroTo(+v); break;
      case "heropp": H.paused = !H.paused; heroTo(H.i); break;
      case "occ": S.occ = v; renderOcc(); break;
      case "occshop": toShop({ occs: [v] }); break;
      case "cat": route(v); break;
      case "price": toShop({ prices: [v] }); break;
      case "combo": toShop(BUDGET[+v][1]); break;
      case "jump": go(v); break;
      case "clearrecent": recent = []; try { localStorage.removeItem(RK); } catch (e) {} renderRecent(); break;
      case "coll": toShop({ colls: [v] }); break;
      case "open": S.sheet = { ids: [v], look: null }; S.picks = {}; renderSheet(); remember(v); break;
      case "lookadd": S.sheet = { ids: LOOKS[+v][1].map(r => r[0]), look: LOOKS[+v][0] }; S.picks = {}; renderSheet(); break;
      case "lookprev": setLook(S.look - 1, true); break;
      case "looknext": setLook(S.look + 1, true); break;
      case "lookdot": setLook(+v, true); break;
      case "railprev": case "railnext": { const r = $("colls"); r.scrollBy({ left: (a === "railprev" ? -1 : 1) * r.clientWidth * .8, behavior: "smooth" }); break; }
      case "dd": S.dd = S.dd === v ? null : v; renderShop(); break;
      case "tog": { const c = S.f[el.dataset.k]; S.f[el.dataset.k] = c.includes(v) ? c.filter(x => x !== v) : [...c, v]; S.more = false; renderShop(); break; }
      case "trayclear": S.f[S.dd] = []; renderShop(); break;
      case "closetray": S.dd = null; renderShop(); break;
      case "clearall": S.f = EMPTY(); S.more = false; renderShop(); break;
      case "more": S.more = true; renderShop(); break;
      case "banner": BN[+v].go(); break;
      case "size": S.picks[el.dataset.id] = v; renderSheet(); break;
      case "sheetadd": { const items = S.sheet.ids.map(id => BY[id]); if (items.every(p => S.picks[p.id])) flash(items.length > 1 ? S.sheet.look + " added, " + items.length + " pieces" : items[0].name + " · " + S.picks[items[0].id] + " added", items.length); break; }
      case "closesheet": S.sheet = null; S.picks = {}; renderSheet(); break;
      case "openchart": openChart(); break;
      case "closechart": $("chartWrap").hidden = true; break;
    }
  });
  $("sheet").addEventListener("click", e => { if (!e.target.closest("[data-a]")) e.stopPropagation(); });
  $("sort").addEventListener("change", e => { S.sort = e.target.value; S.more = false; renderShop(); });
  $("join").addEventListener("click", () => { if ($("email").value.trim()) { $("signup").hidden = true; $("joined").hidden = false; } });
  $("lookRail").addEventListener("scroll", e => {
    const el = e.currentTarget, c = el.firstElementChild, gap = W() >= 760 ? 20 : 12;
    const i = Math.max(0, Math.min(LOOKS.length - 1, Math.round(el.scrollLeft / (c.getBoundingClientRect().width + gap))));
    if (i !== S.look) setLook(i, false);
  });
  let lastBp = bp();
  window.addEventListener("resize", () => { if (bp() !== lastBp) { lastBp = bp(); renderShop(); } });

  renderHero(); heroTimer(); renderStatic(); renderRecent(); renderOcc(); setLook(0, false); renderShop();
})();
