/* Men Landing v9 – behaviour (vanilla JS, no dependencies) */
(function () {
  const $ = id => document.getElementById(id);
  const EMPTY = () => ({ cats: [], occs: [], sizes: [], prices: [], colls: [] });
  const S = { occ: "work", look: 0, f: EMPTY(), max: null, dd: null, sort: "best", more: false, sheet: null, picks: {}, bag: 0 };
  const W = () => document.documentElement.clientWidth;
  const bp = () => (W() >= 1100 ? "xl" : W() >= 760 ? "wide" : "sm");
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rs = n => "₹" + n.toLocaleString("en-IN");
  const pad = n => String(n).padStart(2, "0");
  let toastT;

  const SEEN = new Set(COMMUNITY.map(c => c[1]));
  /* decision info for proof cards: verified FACTS first, then what the catalogue itself guarantees */
  function proof(p) {
    const f = FACTS[p.id] || {}, sizes = SZ[p.sz];
    const top = f.rating ? `<span class="pc-r">★ ${f.rating}${f.reviews ? ` <i>(${f.reviews} reviews)</i>` : ""}</span>` : "";
    const facts = [f.fit || (p.sz === "shoe" ? "Wider last, usual size" : ""), f.mat, sizes[0] + "–" + sizes[sizes.length - 1]].filter(Boolean).join(" · ");
    return `${top}<span class="pc-m">${facts}</span>`;
  }
  const tag = p => p.tag ? `<span class="stamp${p.tag === "new" ? " blue" : ""}">${p.tag === "new" ? "New" : "Bestseller"}</span>` : "";
  /* rich cards (bestsellers, recently viewed) carry proof and a full-width size button; the rest keep the corner + */
  const card = (p, rich, no) => `<div class="pc"><div class="pc-img"><img src="${p.img}" alt="${p.name}" loading="lazy">${no ? `<span class="pc-no">No. ${pad(no)}</span>` : ""}${tag(p)}${rich && SEEN.has(p.id) ? `<button class="pc-seen" data-a="jump" data-v="comm">On real people</button>` : ""}${rich ? "" : `<button class="pc-add" data-a="open" data-v="${p.id}" aria-label="Add ${p.name} to bag">+</button>`}</div><div class="pc-t"><small>${p.line}</small><span>${p.name}</span><b>${p.price}</b>${rich ? proof(p) : ""}</div>${rich ? `<button class="pc-cta" data-a="open" data-v="${p.id}">Select size</button>` : ""}</div>`;
  const hdrH = () => document.querySelector(".hdr").offsetHeight;
  const go = id => { const el = $(id); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - hdrH() + 1, behavior: calm ? "auto" : "smooth" }); };
  const count = patch => P.filter(p => GROUPS.every(([k]) => !(patch[k] || []).length || HIT[k](p, patch[k]))).length;
  const from = list => list.length ? "From " + rs(Math.min(...list.map(p => p.pr))) : "";

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
    $("recentRail").innerHTML = recent.map(id => card(BY[id], true)).join("");
  }
  function route(v) {
    if (v === "new") return toShop({}, "new");
    if (v === "best" || v === "all") return toShop({}, "best");
    toShop({ cats: ROUTE[v] });
  }
  function toShop(patch, sort, max) {
    S.f = Object.assign(EMPTY(), patch); S.max = max || null; S.more = false; S.dd = null;
    if (sort) S.sort = sort; $("sort").value = S.sort; renderShop(); setTimeout(() => go("shop"), 20);
  }
  function flash(msg, n) {
    S.bag += n || 1; S.sheet = null; S.picks = {}; renderSheet();
    const b = $("bagN"); b.hidden = false; b.textContent = S.bag;
    const t = $("toast"); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => (t.hidden = true), 2400);
  }

  /* hero slideshow: 6s per slide, pauses on hover/focus, off for reduced motion */
  const H = { i: 0, paused: calm, hover: false, t: null };
  function renderHero() {
    $("heroSlides").innerHTML = HERO.map(([k, t, d, img, ctas], i) => `<div class="hs" role="group" aria-roledescription="slide"><img src="${img}" alt="" ${i ? 'loading="lazy"' : ""}><div class="shade"></div><div class="hero-txt"><span class="lbl">${k}</span><p class="hero-h">${t}</p><p class="hero-d">${d}</p><div class="row">${ctas.map(([l, a, v], j) => `<button class="btn ${j ? "btn-ghost" : "btn-cream"}" data-a="${a}" data-v="${v}">${l}${j ? "" : " →"}</button>`).join("")}</div></div></div>`).join("");
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

  /* budget slider */
  function renderBudget() {
    const max = +$("budR").value, list = P.filter(p => p.pr <= max), fw = list.filter(p => FOOTWEAR.includes(p.cat)).length;
    $("budN").textContent = rs(max);
    $("budR").style.setProperty("--pct", ((max - 1990) / 4000) * 100 + "%");
    $("budLine").innerHTML = `<b>${list.length} styles</b> · ${fw} footwear · ${list.length - fw} apparel`;
    $("budGo").textContent = `Show ${list.length} styles →`;
    const peek = [...list].sort((a, b) => b.pr - a.pr || a.rank - b.rank).slice(0, 6);
    $("budPeek").innerHTML = peek.map(p => `<button class="peek" data-a="open" data-v="${p.id}"><img src="${p.img}" alt="${p.name}" loading="lazy"><span>${p.name}</span><b>${rs(p.pr)}</b></button>`).join("");
  }

  /* fitting room: usual size + how sneakers feel, with foot length as a fallback */
  const FIT = CHART.map(([uk, eu, cm]) => ({ uk, eu, cm: parseFloat(cm) }));
  const FEEL = [["snug", "Tight on the sides"], ["right", "Just right"], ["loose", "A bit loose"]];
  const FIT_NOTE = {
    snug: "Good news: take your usual size. Our pairs are built on a wider last, so you get the room most sneakers don't give you.",
    right: "Take your usual size. Our wider last fits the same, with a little more room across the toes.",
    loose: "Stay with your usual size, but our wider last may feel roomier than you're used to. Measure your foot below, or try a pair in store first."
  };
  const F = { size: "UK8", feel: "right", cm: null };
  function renderFit() {
    const hit = FIT.find(r => r.uk === F.size), over = F.cm !== null && F.cm > FIT[FIT.length - 1].cm;
    $("frSize").innerHTML = FIT.map(r => `<button class="fr-o${r.uk === F.size ? " on" : ""}" data-a="frsize" data-v="${r.uk}" aria-pressed="${r.uk === F.size}">${r.uk}</button>`).join("");
    $("frFeel").innerHTML = FEEL.map(([k, t]) => `<button class="fr-o wide${k === F.feel ? " on" : ""}" data-a="frfeel" data-v="${k}" aria-pressed="${k === F.feel}">${t}</button>`).join("");
    $("boxN").textContent = hit.uk; $("boxEu").textContent = hit.eu; $("boxCm").textContent = hit.cm.toFixed(1) + " cm";
    $("boxNote").textContent = over ? "Our largest size is UK12, for feet up to 29.5 cm. Try a pair in store before you order."
      : F.cm !== null ? "Matched to your " + F.cm.toFixed(1) + " cm foot. Our pairs are built on a wider last, so this is the size to order."
      : FIT_NOTE[F.feel];
    $("fitGo").textContent = "Show pairs in " + hit.uk + " →"; $("fitGo").dataset.v = hit.uk;
  }
  function measure() {
    const v = +$("fitR").value;
    $("fitR").style.setProperty("--pct", ((v - 25) / 4.8) * 100 + "%");
    $("fitCm").textContent = v.toFixed(1) + " cm";
    F.cm = v; F.size = (FIT.find(r => v <= r.cm) || FIT[FIT.length - 1]).uk; renderFit();
  }

  /* occasion */
  function renderOcc() {
    $("occTabs").innerHTML = OCC.map(([k, t]) => `<button class="tab${S.occ === k ? " on" : ""}" data-a="occ" data-v="${k}">${t}</button>`).join("");
    const [k, t, note, tip] = OCC.find(o => o[0] === S.occ), ids = EDITS[k];
    $("occPanel").innerHTML = `<div class="occ"><div class="occ-img"><img src="${OCC_IMG[k]}" alt="${t}"><div class="occ-cap"><span class="lbl">${ids.length} pieces</span><b>${t}.</b><span>${note}</span></div></div><div class="occ-r"><div class="occ-prods">${ids.map(id => card(BY[id])).join("")}</div><div class="tip"><span class="lbl">How to wear it</span><span>${tip}</span></div><button class="btn" data-a="occshop" data-v="${k}">See all ${ids.length} for ${t} →</button></div></div>`;
  }

  /* static sections */
  function renderStatic() {
    $("laneList").innerHTML = LANES.map(([no, t, d, to]) => `<button class="lane rv" data-a="jump" data-v="${to}"><span class="lane-no">${no}</span><span class="lane-t">${t}</span><span class="lane-d">${d}</span><span class="lane-go" aria-hidden="true">→</span></button>`).join("");
    $("cats").innerHTML = CATS.map(([k, t, img], i) => { const list = ROUTE[k] ? P.filter(p => ROUTE[k].includes(p.cat)) : P.filter(p => p.tag === k); return `<button class="cat rv" data-a="cat" data-v="${k}"><span class="tape" aria-hidden="true"></span><div class="cat-img"><img src="${img}" alt="${t}" loading="lazy"></div><div class="cat-cap"><span class="lbl">No. ${pad(i + 1)} · ${list.length} styles</span><b>${t}</b><span class="lbl">${from(list)}</span></div></button>`; }).join("");
    $("combos").innerHTML = BUDGET.map(([t, f], i) => [t, f, i, count(f)]).filter(c => c[3]).map(([t, , i, n]) => `<button class="combo" data-a="combo" data-v="${i}">${t}<small>${n}</small></button>`).join("");
    $("bestRail").innerHTML = P.filter(p => p.tag === "best").map((p, i) => card(p, true, i + 1)).join("");
    $("tryBox").innerHTML = `<div class="file-tab">File · GL/Stores</div><div class="file-body"><div class="rec"><div class="rec-h"><b>Store record</b><span class="stamp blue big">Try in store</span></div>
      <dl class="rec-rows"><div><dt>Stores</dt><dd>${STORES.length}</dd></div><div><dt>Cities</dt><dd>${STORES.map(s => s[0]).join(", ")}</dd></div><div><dt>Try on</dt><dd>Before you pay</dd></div><div><dt>Ordering online?</dt><dd>Cash on delivery, 30 day swap</dd></div></dl></div>
      <div class="stores">${STORES.map(([city, addr, hrs, url], i) => `<div class="store"><span class="lbl">Store ${pad(i + 1)}</span><b>${city}</b>${addr ? `<span>${addr}</span>` : ""}${hrs ? `<span class="lbl">${hrs}</span>` : ""}<a class="btn btn-line" href="${url}" target="_blank" rel="noopener">Get directions →</a></div>`).join("")}</div></div>`;
    $("dropItems").innerHTML = ["bitter", "filter"].map(id => card(BY[id])).join("");
    $("lookRail").innerHTML = LOOKS.map(([title, rows], i) => `<article class="look"><div class="look-img"><img src="${LOOK_IMG[i]}" alt="${title}" loading="lazy"><span class="lbl tagline">Look ${pad(i + 1)} · ${rows.length} pieces</span></div><b>${title}.</b><div>${rows.map(([id, role]) => `<div class="look-row"><div class="th"><img src="${BY[id].img}" alt="${BY[id].name}" loading="lazy"></div><div><small class="lbl">${role}</small><span>${BY[id].name}</span></div><button class="sm" data-a="open" data-v="${id}">Add</button></div>`).join("")}</div><button class="btn" data-a="lookadd" data-v="${i}">Add the full look →</button></article>`).join("");
    $("comm").innerHTML = COMMUNITY.map(([img, id], i) => `<div class="cm"><span class="tape" aria-hidden="true"></span><div class="cm-img"><img src="${img}" alt="Worn by the community" loading="lazy"></div><button class="cm-b" data-a="open" data-v="${id}"><span class="lbl">Exhibit ${pad(i + 1)}</span><span>${BY[id].name}</span><b>${BY[id].price}</b></button></div>`).join("");
    $("colls").innerHTML = COLLS.map(([t, story, img, isNew]) => `<button class="coll" data-a="coll" data-v="${t}"><div class="coll-img"><img src="${img}" alt="${t}" loading="lazy">${isNew ? '<span class="stamp blue">New</span>' : ""}</div><div class="coll-t"><div><b>${t}</b><small class="lbl">${P.filter(p => p.coll === t).length} styles</small></div><span>${story}</span></div></button>`).join("");
    const all = P.length;
    $("dockLine").textContent = all + " styles · " + from(P);
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
    const u = s => `url("${s}")`, lk = LOOKS[0];
    const photo = (k, t, d, cta, bg, go, extra) => ({ cls: "bn-photo", k, t, d, cta, bg: u(bg), go, ...extra });
    const prod = (k, t, d, cta, pic, go) => ({ cls: "bn-plain", k, t, d, cta, pic: u(pic), go });
    return [
      photo("New drop", "The Kaapi Issue.", "Two pairs, with coffee beans printed on the sockliner.", "Shop Kaapi", AS + "gl-kaapi-look-01.jpg?v=10865441980311467331789554981", () => toShop({ colls: ["Kaapi"] })),
      photo("Shop the look", lk[0] + ".", lk[1].length + " pieces, add them together or one at a time.", "See the look", LOOK_IMG[0], () => go("looks"), { thumbs: lk[1].map(([id]) => u(BY[id].img)) }),
      { cls: "bn-blue", k: "Under ₹2,000", t: "Gully 17 jerseys, ₹1,990.", d: "Polo or crew neck, in green, blue and beige.", cta: "Shop under ₹2,000", go: () => toShop({ prices: ["Under ₹2,000"] }) },
      prod("Just in", "Megh, Rekhe and Kharif.", "Three new Gully Number 001 colourways.", "Shop new drops", CDN + "86A0794.jpg?v=1787403675&width=900", () => toShop({}, "new")),
      { cls: "bn-blue", k: "Try in store", t: "New Delhi. Bengaluru.", d: "Walk in, find your size and pay at the counter.", cta: "Find a store", go: () => go("try") },
      photo("Fit", "Take your usual size.", "Built on a wider last. 30-day exchange if it isn't right.", "Fitting room", AS + "gl-kaapi-campaign-back-tab.jpg?v=28665856757239752161789553589", () => go("fitting"))
    ];
  }
  let BN = [];
  const match = (p, skip) => (S.max === null || p.pr <= S.max) && GROUPS.every(([k]) => k === skip || !S.f[k].length || HIT[k](p, S.f[k]));
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
      if (c.p) return card(c.p);
      const n = BN[c.banner];
      return `<button class="bn ${n.cls}" data-a="banner" data-v="${c.banner}"${n.bg ? ` style="background-image:${n.bg}"` : ""}><span class="lbl bn-k">${n.k}</span>${n.pic ? `<div class="bn-pic" style="background-image:${n.pic}"></div>` : ""}<div class="bn-b"><span class="bn-t">${n.t}</span><span class="bn-d">${n.d}</span>${n.thumbs ? `<div class="bn-th">${n.thumbs.map(t => `<i style="background-image:${t}"></i>`).join("")}</div>` : ""}<span class="bn-cta">${n.cta} →</span></div></button>`;
    }).join("");
    $("resultCount").textContent = list.length + (list.length === 1 ? " style" : " styles");
    $("empty").hidden = list.length > 0;
    $("more").hidden = S.more || shownN >= list.length; $("shownLine").textContent = "Showing " + shownN + " of " + list.length;
    const active = GROUPS.reduce((a, [k]) => a + S.f[k].length, 0) + (S.max !== null);
    $("pills").innerHTML = GROUPS.map(([k, t]) => { const n = S.f[k].length; return `<button class="pill${n ? " has" : ""}${S.dd === k ? " open" : ""}" data-a="dd" data-v="${k}">${n ? t + " · " + n : t}<small>${S.dd === k ? "▲" : "▼"}</small></button>`; }).join("") + (active ? `<button class="linkbtn" data-a="clearall">Clear all</button>` : "");
    const chips = GROUPS.flatMap(([k]) => S.f[k].map(v => [k, v]));
    $("chips").hidden = !active;
    $("chips").innerHTML = (S.max !== null ? `<button class="fchip" data-a="clearmax">Up to ${rs(S.max)} <span aria-label="Remove">×</span></button>` : "") + chips.map(([k, v]) => `<button class="fchip" data-a="tog" data-k="${k}" data-v="${v}">${LABEL[k](v)} <span aria-label="Remove">×</span></button>`).join("");
    const tray = $("tray"); tray.hidden = !S.dd;
    if (S.dd) {
      const k = S.dd, opts = k === "cats" ? Object.keys(CAT_L) : k === "occs" ? OCC.map(o => o[0]) : k === "sizes" ? [...SZ.shoe, ...SZ.app] : k === "prices" ? PRICES.map(x => x[0]) : COLL_F.filter(c => P.some(p => p.coll === c));
      tray.innerHTML = `<div class="tray-in"><div class="opts">${opts.map(v => { const on = S.f[k].includes(v), n = P.filter(p => match(p, k) && HIT[k](p, [v])).length; return `<button class="opt${on ? " on" : ""}" style="opacity:${n || on ? 1 : .35}" data-a="tog" data-k="${k}" data-v="${v}">${LABEL[k](v)}<small>${n}</small></button>`; }).join("")}</div><div class="tray-f"><button class="linkbtn" data-a="trayclear">Clear ${GROUPS.find(g => g[0] === k)[1].toLowerCase()}</button><button class="btn" data-a="closetray">Show ${list.length} ${list.length === 1 ? "style" : "styles"}</button></div></div>`;
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
      case "budgo": toShop({}, "high", +$("budR").value); break;
      case "fitgo": toShop({ cats: FOOTWEAR, sizes: [v] }); break;
      case "frsize": F.size = v; F.cm = null; renderFit(); break;
      case "frfeel": F.feel = v; renderFit(); break;
      case "clearmax": S.max = null; renderShop(); break;
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
      case "clearall": S.f = EMPTY(); S.max = null; S.more = false; renderShop(); break;
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
  $("budR").addEventListener("input", renderBudget);
  $("fitR").addEventListener("input", measure);
  $("fitR").style.setProperty("--pct", "29%");
  $("join").addEventListener("click", () => { if ($("email").value.trim()) { $("signup").hidden = true; $("joined").hidden = false; } });
  $("lookRail").addEventListener("scroll", e => {
    const el = e.currentTarget, c = el.firstElementChild, gap = W() >= 760 ? 20 : 12;
    const i = Math.max(0, Math.min(LOOKS.length - 1, Math.round(el.scrollLeft / (c.getBoundingClientRect().width + gap))));
    if (i !== S.look) setLook(i, false);
  });
  let lastBp = bp();
  window.addEventListener("resize", () => { if (bp() !== lastBp) { lastBp = bp(); renderShop(); } });

  renderHero(); heroTimer(); renderStatic(); renderRecent(); renderBudget(); renderFit(); renderOcc(); setLook(0, false); renderShop();

  /* "made by hand" banner: scroll progress drives three stages through CSS variables */
  const mk = $("made"), pin = mk.querySelector(".mk-pin");
  if (calm) mk.classList.add("mk-static");
  else {
    const seg = (p, a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)));
    const out = t => 1 - Math.pow(1 - t, 3);
    const slam = t => t === 0 ? 0 : t === 1 ? 1 : 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2);
    let ticking = false;
    const draw = () => {
      ticking = false;
      const r = mk.getBoundingClientRect(), run = r.height - pin.offsetHeight;
      const p = Math.min(1, Math.max(0, -r.top / run));
      const v = { a: out(seg(p, 0, .32)), b: seg(p, .34, .66), c: out(seg(p, .68, .86)), s: slam(seg(p, .82, .94)), z: seg(p, 0, 1) };
      [0, 1, 2].forEach(i => (v["f" + i] = out(seg(p, .42 + i * .07, .5 + i * .07))));
      for (const k in v) pin.style.setProperty("--" + k, v[k].toFixed(4));
    };
    const ask = () => { if (!ticking) { ticking = true; requestAnimationFrame(draw); } };
    window.addEventListener("scroll", ask, { passive: true }); window.addEventListener("resize", ask); draw();
  }

  /* scroll reveals and the sticky shop bar */
  if ("IntersectionObserver" in window) {
    if (!calm) {
      document.documentElement.classList.add("anim");
      const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px" });
      document.querySelectorAll(".rv").forEach(el => io.observe(el));
    }
    const seen = { hero: true, shop: false, made: false };
    const dock = $("dock"), btn = dock.querySelector("button");
    const sync = () => { const on = !seen.hero && !seen.shop && !seen.made; dock.classList.toggle("on", on); dock.setAttribute("aria-hidden", !on); btn.tabIndex = on ? 0 : -1; };
    new IntersectionObserver(es => es.forEach(en => { seen[en.target.id] = en.isIntersecting; sync(); })).observe($("hero"));
    const watch = new IntersectionObserver(es => es.forEach(en => { seen[en.target.id] = en.isIntersecting; sync(); }));
    watch.observe($("shop")); watch.observe($("made"));
  }
})();
