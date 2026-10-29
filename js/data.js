/* Product + content data for Men Landing v8 */
const CDN = "https://gullylabs.com/cdn/shop/files/", AS = "https://gullylabs.com/cdn/shop/t/100/assets/";
const SZ = { shoe: ["UK6","UK7","UK8","UK9","UK10","UK11","UK12"], app: ["XS","S","M","L","XL"] };
const RAW = [
  ["faris","Baaz Faris Black","Gully Number 001","sneakers","Baaz",4290,"farizbArtboard2_b0544d4f-f302-48e1-adb0-ec74f4ce78f8.webp?v=1785930065","shoe","best"],
  ["leila","Baaz Leila Navy","Gully Number 001","sneakers","Baaz",4290,"BL1.webp?v=1789622916","shoe","best"],
  ["bitter","Kaapi Bitter Black","Gully Number 001","sneakers","Kaapi",4490,"86A5765.jpg?v=1789477164","shoe","new"],
  ["filter","Kaapi Filter Brown","Gully Number 001","sneakers","Kaapi",4490,"86A5767.jpg?v=1789477242","shoe","new"],
  ["parni","Baaz Parni White","Gully Number 001","sneakers","Baaz",4290,"9_d8a5680a-337d-466c-be65-9c49ed8101f7.jpg?v=1780319857","shoe","best"],
  ["noor","Baaz Noor Yellow","Gully Number 001","sneakers","Baaz",4290,"dd.jpg?v=1785998010","shoe",""],
  ["kopal","Baaz Kopal Green","Gully Number 001","sneakers","Baaz",4490,"kopalmw.webp?v=1785930014","shoe",""],
  ["barfi","Barfi Burgundy","Gully Number 001","sneakers","Classics",5990,"barfiMW.webp?v=1785930319","shoe","best"],
  ["falak","Baaz Falak Blue","Gully Number 001","sneakers","Baaz",4290,"DSC09951_85a9ab7e-d672-4973-866c-e7a4e758c5af.webp?v=1789621459","shoe",""],
  ["calico","Dvaita Calico White","Gully Number 001","sneakers","Dvaita",5990,"DSC09865_ec6f692e-8cfc-4299-9a8d-effb8de4b797.jpg?v=1780482933","shoe",""],
  ["turf","1928 Turf Olive","Gully Number 002","sneakers","GL002 Sprinter",5990,"DSC04076_c8fd47c6-32c0-4340-92ed-179908182a46.jpg?v=1780385557","shoe",""],
  ["aangan","Aangan Blue","Gully Number 002","sneakers","GL002 Sprinter",5990,"056A9970_4b46b5fc-85be-4efc-9e25-89567dc85451.jpg?v=1763978444","shoe",""],
  ["aandhi","Aandhi Kobicha","Gully Labs X Raga","sneakers","Collabs",5990,"DSC08304_a39268ef-de55-4793-801d-6d6634d28192.jpg?v=1780383187","shoe","best"],
  ["buransh","Buransh Red","Gully Labs X Aryan Katoch","sneakers","Collabs",5990,"DSC09462_cd1918e6-7042-4115-8df3-27d10c51a217.jpg?v=1780481699","shoe",""],
  ["sal","Sal Brown","Gully Number 004","slides","GL004 and GL005",3790,"1_cd47a9c3-7ba4-4029-8e4a-3ee77c982c03.jpg?v=1780057167","shoe","best"],
  ["suva","Suva Green","Gully Number 004","slides","GL004 and GL005",3790,"GL_April0045-2.jpg?v=1776690007","shoe",""],
  ["khakhi","Khakhi Beige","Gully Number 004","slides","GL004 and GL005",3790,"GLApril0049-2.jpg?v=1776688447","shoe",""],
  ["koyar","Koyar Black","Gully Number 004","slides","GL004 and GL005",3790,"GLApril0057-2.jpg?v=1776689172","shoe",""],
  ["tezz","Tezz Green Jersey","Gully Number 17","jerseys","Gully Number 17",1990,"DSF0084.jpg?v=1785920172","app",""],
  ["udaan","Udaan Blue Jersey (Polo Neck)","Gully Number 17","jerseys","Gully Number 17",1990,"DSF0040.jpg?v=1785920172","app",""],
  ["josh","Josh Black Trousers","Gully Number 17","trousers","Gully Number 17",2990,"086A0114.jpg?v=1782370079","app","new"],
  ["shk-olive","Toggle Shacket, Olive Green","Kara","shackets","Kara",3775,"86A0294.jpg?v=1787302605","app","new"],
  ["shk-navy","Toggle Shacket, Navy","Kara","shackets","Kara",3775,"86A9918.jpg?v=1787302985","app","new"],
  ["pin-olive","Pintuck Pant, Olive Green","Kara","trousers","Kara",2995,"86A0234.jpg?v=1787305620","app","new"],
  ["pleat","Pleat Trouser, Dark Brown","Kara","trousers","Kara",3290,"86A0285.jpg?v=1787306904","app",""],
  ["gati","Gati Beige Jersey (Polo Neck)","Gully Number 17","jerseys","Gully Number 17",1990,"DSF0379-1.jpg?v=1785920172","app",""],
  ["gati-crew","Gati Beige Jersey (Crew Neck)","Gully Number 17","jerseys","Gully Number 17",1990,"DSF0021.jpg?v=1785920172","app",""],
  ["udaan-crew","Udaan Blue Jersey (Crew Neck)","Gully Number 17","jerseys","Gully Number 17",1990,"DSF0211.jpg?v=1785920172","app",""],
  ["gl002-gati","Gati Beige","Gully Number 002","sneakers","GL002 Sprinter",4490,"gati_beige.png?v=1782307140","shoe",""],
  ["gl002-udaan","Udaan Blue","Gully Number 002","sneakers","GL002 Sprinter",4490,"Asset_1.png?v=1782306840","shoe",""]
];
const fmt = n => "₹" + n.toLocaleString("en-IN") + ".00";
const P = RAW.map(([id, name, line, cat, coll, pr, f, sz, tag], rank) => ({ id, name, line, cat, coll, pr, rank, tag, price: fmt(pr), img: CDN + f + "&width=800", sz }));
const BY = Object.fromEntries(P.map(p => [p.id, p]));
/* hero slides: [kicker, headline, line, image, [label, action, value] x2] */
const HERO = [
  ["Men", "Pairs first. The rest of the outfit, too.", "Hand-lasted sneakers and slides, and the jerseys, shackets and trousers cut to go with them.", CDN + "Baaz1962.jpg?v=1782819489&width=2200", [["Shop footwear", "cat", "footwear"], ["Shop apparel", "cat", "apparel"]]],
  ["New drop", "The Kaapi Issue.", "Two pairs, with coffee beans printed on the sockliner.", AS + "gl-kaapi-look-01.jpg?v=10865441980311467331789554981", [["Shop Kaapi", "coll", "Kaapi"], ["All new drops", "cat", "new"]]],
  ["Under ₹2,000", "Good style. Your price.", "Gully 17 jerseys at ₹1,990, and every style sorted by budget.", CDN + "DSF0009_copy.jpg?v=1782125658&width=2200", [["Shop under ₹2,000", "price", "Under ₹2,000"], ["Shop by price", "jump", "budget"]]],
  ["Try in store", "Try it on in New Delhi and Bengaluru.", "Walk in, find your size and feel the material before you pay.", CDN + "DSC04076_c8fd47c6-32c0-4340-92ed-179908182a46.jpg?v=1780385557&width=2200", [["Find a store", "jump", "try"], ["Size chart", "openchart", ""]]],
  ["New: Kara", "The rest of the outfit.", "Shackets, pintuck pants and pleat trousers, cut to go with the pairs.", CDN + "86A0294.jpg?v=1787302605&width=2200", [["Shop Kara", "coll", "Kara"], ["Shop apparel", "cat", "apparel"]]]
];
const OCC = [
  ["work","Workdays","Clean pairs that go with trousers and a shirt.","White, black or navy leather. Keep the rest simple."],
  ["evening","Evenings out","Darker tones and suede for dinner or drinks.","Black or brown suede with a navy layer."],
  ["weekend","Weekends","Easy pairs and slides for days with no plans.","Slides or relaxed suede with olive and loose trousers."],
  ["travel","Travel","Comfortable pairs that go with everything in the bag.","Pick one neutral pair that works with every outfit you pack."],
  ["game","Game day","Jerseys and slides for playing or watching.","Gully 17 jersey, black trousers, slides."],
  ["standout","Stand out","The pairs people ask about.","Let the shoe be the only colour. Keep everything else black or white."],
  ["simple","Keep it simple","Whites, beiges and browns that go with anything.","A good first Gully Labs pair."]
];
const OCC_IMG = {work:CDN+"86A9918.jpg?v=1787302985&width=1600",evening:AS+"gl-kaapi-table-v2.webp?v=52711285050787428081789553613",weekend:CDN+"DSF2580_copy.jpg?v=1782819490&width=1600",travel:CDN+"DSC04076_c8fd47c6-32c0-4340-92ed-179908182a46.jpg?v=1780385557&width=1600",game:CDN+"DSF0717_copy_1.jpg?v=1782125670&width=1600",standout:CDN+"COLLECTION_WISE_LOOKBOOK-28_1.jpg?v=1778586311&width=1600",simple:CDN+"DSF0009_copy.jpg?v=1782125658&width=1600"};
const LOOK_IMG = [CDN+"DSF0009_copy.jpg?v=1782125658&width=1200", CDN+"DSF0024_copy_24c0e8b7-7822-4945-a9bb-dfd1543247a6.jpg?v=1782126652&width=1200"];
const EDITS = {work:["parni","faris","leila","calico","shk-navy","pleat","josh"],evening:["bitter","leila","barfi","faris","shk-navy","pleat"],weekend:["sal","filter","khakhi","suva","koyar","shk-olive","pin-olive"],travel:["turf","gl002-gati","filter","aangan","parni","josh","sal"],game:["tezz","udaan-crew","udaan","gati","josh","sal","gl002-udaan"],standout:["buransh","noor","kopal","falak","aandhi","gl002-udaan","udaan-crew"],simple:["parni","calico","filter","gl002-gati","khakhi","gati-crew","pleat"]};
const OCC_L = Object.fromEntries(OCC.map(o => [o[0], o[1]]));
const CAT_L = { sneakers: "Sneakers", slides: "Slides", jerseys: "Jerseys", trousers: "Trousers", shackets: "Shackets" };
const APPAREL = ["jerseys", "trousers", "shackets"], FOOTWEAR = ["sneakers", "slides"];
const CATS = [["sneakers","Sneakers",CDN+"DSC04076_c8fd47c6-32c0-4340-92ed-179908182a46.jpg?v=1780385557&width=900"],["slides","Slides",CDN+"DSF2580_copy.jpg?v=1782819490&width=900"],["jerseys","Jerseys",CDN+"DSF0009_copy.jpg?v=1782125658&width=900"],["bottoms","Trousers and shackets",CDN+"86A0294.jpg?v=1787302605&width=900"],["new","New drops",CDN+"86A0794.jpg?v=1787403675&width=900"],["best","Bestsellers",CDN+"Baaz1962.jpg?v=1782819489&width=900"]];
/* route key -> category filter */
const ROUTE = { sneakers: ["sneakers"], slides: ["slides"], jerseys: ["jerseys"], bottoms: ["trousers", "shackets"], apparel: APPAREL, footwear: FOOTWEAR };
const COLLS = [
  ["Kaapi","The current drop. Coffee culture, cut and stitched.",AS+"gl-kaapi-look-01.jpg?v=10865441980311467331789554981",true],
  ["Baaz","The original. The pair that started it.",CDN+"Baaz1962.jpg?v=1782819489&width=900",false],
  ["GL002 Sprinter","Retro sport, made for every day.",CDN+"DSC04076_c8fd47c6-32c0-4340-92ed-179908182a46.jpg?v=1780385557&width=900",false],
  ["GL004 and GL005","The newest silhouettes.",CDN+"FINAL_SHOTS-19_1.jpg?v=1778666419&width=900",false],
  ["Kara","Shackets and trousers, cut to go with the pairs.",CDN+"86A9918.jpg?v=1787302985&width=900",false],
  ["Collabs","Worked on with artists and brands we admire.",CDN+"COLLECTION_WISE_LOOKBOOK-28_1.jpg?v=1778586311&width=900",false]
];
const LOOKS = [
  ["Beige on beige",[["gati-crew","Jersey"],["josh","Trousers"],["gl002-gati","Pair"]]],
  ["Udaan blue",[["udaan-crew","Jersey"],["gl002-udaan","Pair"]]]
];
const COMMUNITY = [
  [CDN+"DSF0024_copy_24c0e8b7-7822-4945-a9bb-dfd1543247a6.jpg?v=1782126652&width=900","udaan-crew"],
  [AS+"gl-kaapi-look-01.jpg?v=10865441980311467331789554981","bitter"],
  [CDN+"DSC04076_c8fd47c6-32c0-4340-92ed-179908182a46.jpg?v=1780385557&width=900","turf"],
  [CDN+"DSF0009_copy.jpg?v=1782125658&width=900","gati-crew"],
  [CDN+"DSF2580_copy.jpg?v=1782819490&width=900","sal"],
  [CDN+"DSF0717_copy_1.jpg?v=1782125670&width=900","udaan"],
  [CDN+"COLLECTION_WISE_LOOKBOOK-28_1.jpg?v=1778586311&width=900","aandhi"]
];
const PRICES = [["Under ₹2,000", p => p.pr < 2000],["₹2,000 to ₹3,999", p => p.pr >= 2000 && p.pr < 4000],["₹4,000 to ₹4,999", p => p.pr >= 4000 && p.pr < 5000],["₹5,000 and over", p => p.pr >= 5000]];
/* budget × category routes; any combo with 0 matching styles is hidden */
const BUDGET = [
  ["Jerseys under ₹2,000", { cats: ["jerseys"], prices: ["Under ₹2,000"] }],
  ["Trousers under ₹3,500", { cats: ["trousers"], prices: ["₹2,000 to ₹3,999"] }],
  ["Slides under ₹4,000", { cats: ["slides"], prices: ["₹2,000 to ₹3,999"] }],
  ["Sneakers under ₹5,000", { cats: ["sneakers"], prices: ["₹4,000 to ₹4,999"] }]
];
/* Verified product facts only. Add { fit, mat, rating, reviews } per id from the PDP / review platform; cards show whatever is filled in. */
const FACTS = {};
/* Physical stores: [city, address, hours, mapsUrl]. Leave address/hours "" until confirmed; empty fields are not shown. */
const STORES = [
  ["New Delhi", "", "", "https://www.google.com/maps/search/?api=1&query=Gully+Labs+store+New+Delhi"],
  ["Bengaluru", "", "", "https://www.google.com/maps/search/?api=1&query=Gully+Labs+store+Bengaluru"]
];
const PR_F = Object.fromEntries(PRICES);
const COLL_F = ["Baaz","Kaapi","GL002 Sprinter","GL004 and GL005","Dvaita","Classics","Collabs","Kara","Gully Number 17"];
const GROUPS = [["cats","Category"],["occs","Occasion"],["sizes","Size"],["prices","Price"],["colls","Collection"]];
const HIT = { cats:(p,v)=>v.includes(p.cat), occs:(p,v)=>v.some(x=>EDITS[x].includes(p.id)), sizes:(p,v)=>SZ[p.sz].some(z=>v.includes(z)), prices:(p,v)=>v.some(t=>PR_F[t](p)), colls:(p,v)=>v.includes(p.coll) };
const LABEL = { cats:v=>CAT_L[v], occs:v=>OCC_L[v], sizes:v=>v, prices:v=>v, colls:v=>v };
const CHART = [["UK6","39","25.2 cm"],["UK7","40","25.9 cm"],["UK8","41","26.6 cm"],["UK9","42","27.3 cm"],["UK10","43","28.0 cm"],["UK11","44","28.8 cm"],["UK12","45","29.5 cm"]];
