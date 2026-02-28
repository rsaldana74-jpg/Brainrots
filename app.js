/* Brainrots app (GitHub Pages friendly)
   - localStorage persistence
   - simple page router with back stack
   - matches your rules:
     * Need brainrots show "Gotten" only (no sold/stolen)
     * Nuclearo Dinossauro is preloaded in Need
     * Sold column empty state shows "None..." + sad face
     * Stolen forces amount = 0
*/

const APP = document.getElementById("app");
const LS_KEY = "brainrots_app_v1";

const PAGES = {
  HOME: "home",
  PROFILE: "profile",
  PRODUCTS: "products",
  NEW_PRODUCT: "new_product",
  DETAIL: "detail",
};

const seed = () => ({
  activeProfileId: "rafael",
  profiles: [
    {
      id: "rafael",
      name: "RafaelSales",
      email: "@rsaldana@crossdock.mx",
      rating: 5,
      shops: [
        { name: "BuyBlox", url: "#" },
        { name: "Eldorado", url: "#" },
        { name: "Ebay", url: "#" },
      ],
      topProductIds: [],   // list of brainrot ids linked as top products
      reviews: [],
    }
  ],
  brainrots: [
    // Need / Don't Have preset
    {
      id: "nuclearo",
      name: "Nuclearo Dinossauro",
      baseRate: 150_000_000, // $150M/s
      mutation: "Rainbow",
      trait: "Doesn't matter",
      amount: 0,             // amount doesn't matter for Need; kept for compatibility
      isNeed: true,          // locks the Need behavior
      flags: { sold: false, stolen: false },
      imageDataUrl: null,
      price: null,
      moneyGroup: null
    }
  ],
});

function loadState(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    if(!raw) return seed();
    const parsed = JSON.parse(raw);
    // basic sanity
    if(!parsed || !Array.isArray(parsed.brainrots)) return seed();
    return parsed;
  }catch{
    return seed();
  }
}

function saveState(){
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

let state = loadState();

// Back stack
const navStack = [];
let current = { page: PAGES.HOME, params: {} };

function go(page, params = {}){
  navStack.push(current);
  current = { page, params };
  render();
}

function back(){
  const prev = navStack.pop();
  if(prev){
    current = prev;
    render();
  }else{
    current = { page: PAGES.HOME, params: {} };
    render();
  }
}

function profile(){
  return state.profiles.find(p => p.id === state.activeProfileId) || state.profiles[0];
}

function money(n){
  if(!Number.isFinite(n)) return "";
  if(n >= 1_000_000_000) return `$${(n/1_000_000_000).toFixed(1)}B/s`;
  if(n >= 1_000_000) return `$${(n/1_000_000).toFixed(0)}M/s`;
  if(n >= 1_000) return `$${(n/1_000).toFixed(0)}K/s`;
  return `$${n}/s`;
}

function sadFaceHTML(){
  return `
    <div class="empty">
      <div class="none">None...</div>
      <div class="sad"><div class="mouth"></div></div>
    </div>
  `;
}

function el(tag, attrs = {}, html = ""){
  const e = document.createElement(tag);
  for(const [k,v] of Object.entries(attrs)){
    if(k === "class") e.className = v;
    else if(k.startsWith("on") && typeof v === "function") e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  if(html) e.innerHTML = html;
  return e;
}

function brainrotById(id){
  return state.brainrots.find(b => b.id === id);
}

/* ---------- RENDERERS ---------- */

function render(){
  APP.innerHTML = "";
  if(current.page === PAGES.HOME) renderHome();
  if(current.page === PAGES.DETAIL) renderDetail(current.params.id);
  if(current.page === PAGES.PROFILE) renderProfile();
  if(current.page === PAGES.PRODUCTS) renderProducts();
  if(current.page === PAGES.NEW_PRODUCT) renderNewProduct();
}

function renderHome(){
  const top = el("div", { class:"topbar" });

  // left sellers (filter placeholder)
  const sellersPill = el("div", { class:"pill" });
  sellersPill.innerHTML = `
    <span style="text-decoration:underline;text-underline-offset:5px;">Sellers</span>
    <select id="sellerSelect">
      <option value="all">All</option>
      <option value="rafael">RafaelSales</option>
    </select>
  `;
  top.appendChild(sellersPill);

  // right profile selector
  const profPill = el("div", { class:"pill" });
  const p = profile();
  profPill.innerHTML = `
    <select id="profSelect">
      ${state.profiles.map(x => `<option value="${x.id}" ${x.id===p.id?"selected":""}>${x.name}</option>`).join("")}
    </select>
    <span style="font-weight:1000;">▼</span>
  `;
  profPill.addEventListener("click", (e) => {
    // clicking the pill (not the dropdown itself) goes to profile page
    if(e.target && e.target.tagName !== "SELECT"){
      go(PAGES.PROFILE);
    }
  });
  top.appendChild(profPill);

  APP.appendChild(top);
  APP.appendChild(el("div", { class:"title" }, "Brainrots.."));

  const board = el("div", { class:"board" });

  const needCol = makeColumn("Need/Dont Have", "need");
  const haveCol = makeColumn("Have", "have");
  const boughtCol = makeColumn("Bought", "bought");
  const soldCol = makeColumn("Sold", "sold");

  board.appendChild(needCol);
  board.appendChild(haveCol);
  board.appendChild(boughtCol);
  board.appendChild(soldCol);

  APP.appendChild(board);

  // Apply profile selection changes
  const profSelect = document.getElementById("profSelect");
  profSelect.addEventListener("change", () => {
    state.activeProfileId = profSelect.value;
    saveState();
    render();
  });

  // Fill lists
  const need = state.brainrots.filter(b => b.isNeed);
  const have = state.brainrots.filter(b => !b.isNeed && b.amount > 0);
  const bought = state.brainrots.filter(b => !b.isNeed && b.price != null); // simple: has price = bought
  const sold = state.brainrots.filter(b => !b.isNeed && (b.flags?.sold || b.flags?.stolen));

  fillList("need", need);
  fillList("have", have);
  fillList("bought", bought);
  fillSold("sold", sold);
}

function makeColumn(title, key){
  const col = el("div", { class:"col" });
  col.appendChild(el("h2", {}, title));
  const list = el("div", { class:"list", id:`list-${key}` });
  col.appendChild(list);
  const more = el("button", { class:"more", id:`more-${key}` }, "More...");
  col.appendChild(more);
  return col;
}

function fillList(key, items){
  const list = document.getElementById(`list-${key}`);
  list.innerHTML = "";
  items.forEach(b => {
    const it = el("div", { class:"item" }, `( ${b.name} )`.replace("( ", "(").replace(" )", ")"));
    it.addEventListener("click", () => go(PAGES.DETAIL, { id: b.id }));
    list.appendChild(it);
  });
}

function fillSold(key, items){
  const list = document.getElementById(`list-${key}`);
  const more = document.getElementById(`more-${key}`);
  list.innerHTML = "";

  if(items.length === 0){
    more.classList.add("hidden");
    list.innerHTML = sadFaceHTML();
    return;
  }

  more.classList.remove("hidden");
  items.forEach(b => {
    const label = b.flags?.stolen ? `( ${b.name} ) • STOLEN` : `( ${b.name} )`;
    const it = el("div", { class:"item" }, label);
    it.addEventListener("click", () => go(PAGES.DETAIL, { id: b.id }));
    list.appendChild(it);
  });
}

/* ---------- DETAIL PAGE ---------- */

function renderDetail(id){
  const b = brainrotById(id);
  if(!b){ back(); return; }

  const topRow = el("div", { class:"backRow" });

  // Need brainrots use X to go back to Home (as you requested earlier)
  const backButton = el("button", { class: b.isNeed ? "xBtn" : "xBtn", onclick: () => back() }, "X");
  topRow.appendChild(backButton);

  APP.appendChild(topRow);

  const card = el("div", { class:"page" });
  const detail = el("div", { class:"detailCard" });

  const grid = el("div", { class:"detailGrid" });

  // left side: flags + qty
  const left = el("div", {});
  const tagRow = el("div", { class:"tagRow" });

  // Need: ONLY "Gotten" button. No Sold/Stolen.
  if(b.isNeed){
    const info = el("div", { class:"infoLines" }, `
      <div>(Brainrot Name) ${b.name}</div>
      <div>$/s: ${money(b.baseRate)}</div>
      <div>Mutation: ${b.mutation}</div>
      <div>Trait: ${b.trait}</div>
    `);

    const gotten = el("button", { class:"gottenBtn" }, "Gotten");
    gotten.addEventListener("click", () => {
      // convert from Need → Have
      b.isNeed = false;
      b.amount = 1; // simple default
      b.flags = { sold:false, stolen:false };
      saveState();
      // go back where you came from
      back();
    });

    left.appendChild(info);
    left.appendChild(el("div", { style:"height:16px" }));
    left.appendChild(gotten);
  } else {
    // Non-Need: allow Sold/Stolen + Qty
    const soldBtn = el("button", { class:"tagBtn sold" }, "Sold");
    soldBtn.addEventListener("click", () => {
      b.flags.sold = !b.flags.sold;
      if(b.flags.sold) b.flags.stolen = false;
      saveState();
      render();
    });

    const stolenBtn = el("button", { class:"tagBtn stolen" }, "Stolen");
    stolenBtn.addEventListener("click", () => {
      b.flags.stolen = !b.flags.stolen;
      if(b.flags.stolen){
        b.flags.sold = false;
        b.amount = 0; // stolen forces amount 0 (your rule)
      }
      saveState();
      render();
    });

    tagRow.appendChild(soldBtn);
    tagRow.appendChild(stolenBtn);

    const qty = el("div", { class:"qtyBox" });
    const up = el("button", {}, "▲");
    const down = el("button", {}, "▼");
    const mid = el("div", { class:"qty" }, `${b.amount}`);

    up.addEventListener("click", () => { b.amount += 1; saveState(); render(); });
    down.addEventListener("click", () => { b.amount = Math.max(0, b.amount - 1); saveState(); render(); });

    qty.appendChild(up);
    qty.appendChild(mid);
    qty.appendChild(down);

    left.appendChild(tagRow);
    left.appendChild(el("div", { style:"height:16px" }));
    left.appendChild(qty);
    left.appendChild(el("div", { style:"height:16px" }));

    const info = el("div", { class:"infoLines" }, `
      <div>(Brainrot Name) ${b.name}</div>
      <div>$/s: ${money(b.baseRate)}</div>
      <div>Cost: ${b.price != null ? `$${b.price}` : "(Cost)"}</div>
      <div>Mutation: ${b.mutation || "(none)"}</div>
    `);
    left.appendChild(info);
  }

  // right side: picture + insert
  const right = el("div", {});
  const pic = el("div", { class:"picBox" });
  const picArea = el("div", { class:"pic" }, b.imageDataUrl ? "" : "Picture Of Brainrot");
  if(b.imageDataUrl){
    picArea.style.backgroundImage = `url("${b.imageDataUrl}")`;
    picArea.style.backgroundSize = "cover";
    picArea.style.backgroundPosition = "center";
  }

  const insertBtn = el("button", { class:"insert" }, "Insert");
  const fileInput = el("input", { type:"file", accept:"image/*", class:"hidden" });

  insertBtn.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", async () => {
    const file = fileInput.files?.[0];
    if(!file) return;
    const dataUrl = await readAsDataURL(file);
    b.imageDataUrl = dataUrl;
    saveState();
    render();
  });

  pic.appendChild(picArea);
  pic.appendChild(insertBtn);
  right.appendChild(pic);
  right.appendChild(fileInput);

  grid.appendChild(left);
  grid.appendChild(right);

  detail.appendChild(grid);
  card.appendChild(detail);
  APP.appendChild(card);
}

function readAsDataURL(file){
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

/* ---------- PROFILE PAGE ---------- */

function renderProfile(){
  const page = el("div", { class:"page" });

  const backRow = el("div", { class:"backRow" });
  backRow.appendChild(el("button", { class:"backBtn", onclick: () => back() }, "←"));
  page.appendChild(backRow);

  const top = el("div", { class:"profileTop" });

  // avatar
  const av = el("div", { class:"avatarBig" });
  av.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:1000;">(photo)</div>`;
  top.appendChild(av);

  // header pill
  const p = profile();
  const header = el("div", { class:"headerPill" });
  header.innerHTML = `
    <div class="name">${p.name} ⭐⭐⭐⭐⭐</div>
    <div class="sub">${p.email}</div>
    <div class="link" id="toProductsLink">To Products</div>
  `;
  top.appendChild(header);

  // shops
  const shops = el("div", { class:"shopBox" });
  shops.innerHTML = `
    <h3>Shops Used</h3>
    ${p.shops.map(s => `<div><b>${s.name}</b> <span style="color:#6aa8ff;text-decoration:underline;">(link)</span></div>`).join("")}
  `;
  top.appendChild(shops);

  page.appendChild(top);

  // sections row
  const row = el("div", { class:"sectionRow" });

  // Top Products
  const leftPanel = el("div", {});
  leftPanel.appendChild(el("div", { class:"sectionTitle" }, "Top Products"));

  const prodPanel = el("div", { class:"productPanel" });

  // show first top product card if exists, else show empty style w/ Add
  const firstId = p.topProductIds[0];
  if(firstId){
    const b = brainrotById(firstId);
    if(b){
      const pc = productCard(b);
      prodPanel.appendChild(pc);
    }
  }else{
    const empty = el("div", { style:"display:flex;align-items:center;gap:18px;flex:1;justify-content:center;" });
    empty.innerHTML = `
      <div style="font-weight:1000;font-size:36px;text-decoration:underline;text-underline-offset:6px;">No Others...</div>
      <div class="sad"><div class="mouth"></div></div>
    `;
    prodPanel.appendChild(empty);
  }

  const addBtn = el("button", { class:"addGreen" }, "Add...");
  addBtn.addEventListener("click", () => go(PAGES.NEW_PRODUCT));
  prodPanel.appendChild(addBtn);

  leftPanel.appendChild(prodPanel);
  row.appendChild(leftPanel);

  // Reviews
  const rightPanel = el("div", {});
  rightPanel.appendChild(el("div", { class:"sectionTitle" }, "Reviews"));

  const reviewsCard = el("div", { class:"card", style:"min-height:260px;display:flex;flex-direction:column;justify-content:center;align-items:center;" });
  reviewsCard.innerHTML = `
    <div style="font-weight:1000;font-size:34px;text-decoration:underline;text-underline-offset:6px;">None...</div>
    <div style="height:16px"></div>
    <div class="sad"><div class="mouth"></div></div>
  `;
  rightPanel.appendChild(reviewsCard);

  // Delete account
  const del = el("button", { class:"deleteRed" }, "Delete Account");
  del.addEventListener("click", () => {
    alert("Delete Account is wired, but for safety this demo does NOT actually delete RafaelSales.");
  });
  rightPanel.appendChild(del);

  row.appendChild(rightPanel);

  page.appendChild(row);

  APP.appendChild(page);

  document.getElementById("toProductsLink").addEventListener("click", () => go(PAGES.PRODUCTS));
}

/* ---------- TO PRODUCTS PAGE ---------- */

function renderProducts(){
  const page = el("div", { class:"page" });

  // X to go back to profile
  const topRow = el("div", { class:"backRow", style:"justify-content:flex-end" });
  topRow.appendChild(el("button", { class:"xBtn", onclick: () => back() }, "X"));
  page.appendChild(topRow);

  // show product cards linked to profile, then "No more..." + Add...
  const p = profile();

  const row = el("div", { style:"display:flex;align-items:flex-start;gap:18px;flex-wrap:wrap;" });

  // left: existing products cards (top products list for now)
  p.topProductIds.forEach(id => {
    const b = brainrotById(id);
    if(b) row.appendChild(productCard(b));
  });

  // center: No more... + Add...
  const empty = el("div", { style:"flex:1;min-width:260px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding-top:40px;" });
  empty.innerHTML = `<div style="font-size:64px;font-weight:1000;">No more...</div>`;
  const add = el("button", { class:"addGreen", style:"font-size:54px;padding:18px 34px;" }, "Add...");
  add.addEventListener("click", () => go(PAGES.NEW_PRODUCT));
  empty.appendChild(add);

  row.appendChild(empty);

  page.appendChild(row);
  APP.appendChild(page);
}

function productCard(b){
  const pc = el("div", { class:"productCard" });
  const img = el("div", { class:"img" }, b.imageDataUrl ? "" : "");
  if(b.imageDataUrl){
    img.style.backgroundImage = `url("${b.imageDataUrl}")`;
    img.style.backgroundSize = "cover";
    img.style.backgroundPosition = "center";
  }else{
    img.textContent = "(image)";
  }

  const txt = el("div", { class:"txt" });
  txt.innerHTML = `
    <div class="n">${b.name}</div>
    <div class="q">${b.amount > 0 ? `${b.amount} Quantity` : `Unlimited Quantity`}</div>
    <div class="p">${b.price != null ? `$${b.price}` : `$2.5`}</div>
  `;
  pc.appendChild(img);
  pc.appendChild(txt);

  pc.addEventListener("click", () => go(PAGES.DETAIL, { id: b.id }));
  return pc;
}

/* ---------- NEW PRODUCT PAGE ---------- */

function renderNewProduct(){
  const page = el("div", { class:"page" });

  const backRow = el("div", { class:"backRow" });
  backRow.appendChild(el("button", { class:"backBtn", onclick: () => back() }, "←"));
  page.appendChild(backRow);

  const card = el("div", { class:"card" });
  card.style.borderRadius = "34px";

  const header = el("div", { class:"formTitle" }, "New Product");
  card.appendChild(header);

  const grid = el("div", { class:"formGrid" });

  // Left: qty + yes/no
  const left = el("div", {});
  const qty = el("div", { class:"qtyBox" });
  let qtyVal = 1;

  const up = el("button", {}, "▲");
  const mid = el("div", { class:"qty" }, `${qtyVal}`);
  const down = el("button", {}, "▼");
  up.addEventListener("click", () => { qtyVal += 1; mid.textContent = `${qtyVal}`; });
  down.addEventListener("click", () => { qtyVal = Math.max(0, qtyVal-1); mid.textContent = `${qtyVal}`; });

  qty.appendChild(up); qty.appendChild(mid); qty.appendChild(down);
  left.appendChild(qty);
  left.appendChild(el("div", { style:"font-weight:900;text-align:center;margin-top:8px;color:#000;" }, "Quantity"));

  left.appendChild(el("div", { style:"height:18px" }));

  let yesNo = true;
  const yn = el("div", { class:"yesNo" });
  const yes = el("button", {}, "Yes");
  const no = el("button", {}, "No");
  const syncYN = () => {
    yes.classList.toggle("active", yesNo);
    no.classList.toggle("active", !yesNo);
  };
  yes.addEventListener("click", () => { yesNo = true; syncYN(); });
  no.addEventListener("click", () => { yesNo = false; syncYN(); });
  syncYN();
  yn.appendChild(yes); yn.appendChild(no);
  left.appendChild(yn);

  // Middle: selects
  const midCol = el("div", { style:"display:flex;flex-direction:column;gap:16px;" });

  const namePill = el("div", { class:"selectPill" });
  namePill.innerHTML = `
    <span>Brainrot Name</span>
    <select id="npName">
      <option value="Pot Hotspot">Pot Hotspot</option>
      <option value="Nuclearo Dinossauro">Nuclearo Dinossauro</option>
      <option value="Custom">Custom</option>
    </select>
  `;
  const moneyGroup = el("div", { class:"selectPill" });
  moneyGroup.innerHTML = `
    <span>Money Group</span>
    <select id="npGroup">
      <option value="None">None</option>
      <option value="Money Group">Money Group</option>
    </select>
  `;

  const mutation = el("div", { class:"selectPill" });
  mutation.innerHTML = `
    <span>Mutation</span>
    <select id="npMut">
      <option value="None">None</option>
      <option value="Rainbow">Rainbow</option>
    </select>
  `;

  midCol.appendChild(namePill);
  midCol.appendChild(moneyGroup);
  midCol.appendChild(mutation);

  // Right: image + price
  const right = el("div", { style:"display:flex;flex-direction:column;gap:18px;align-items:flex-end;" });

  const pic = el("div", { class:"picBox" });
  const picArea = el("div", { class:"pic" }, "Picture of Brainrot");
  const insert = el("button", { class:"insert" }, "Insert");
  const fileInput = el("input", { type:"file", accept:"image/*", class:"hidden" });

  let imgData = null;
  insert.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", async () => {
    const f = fileInput.files?.[0];
    if(!f) return;
    imgData = await readAsDataURL(f);
    picArea.textContent = "";
    picArea.style.backgroundImage = `url("${imgData}")`;
    picArea.style.backgroundSize = "cover";
    picArea.style.backgroundPosition = "center";
  });

  pic.appendChild(picArea);
  pic.appendChild(insert);
  right.appendChild(pic);
  right.appendChild(fileInput);

  right.appendChild(el("div", { style:"color:#000;font-weight:1000;text-align:right;margin-top:4px;" }, "Price"));
  const pricePill = el("div", { class:"inputPill", style:"width:260px;" });
  pricePill.innerHTML = `<input id="npPrice" type="number" placeholder="(Typebox)" min="0" step="0.01" />`;
  right.appendChild(pricePill);

  // Assemble
  grid.appendChild(left);
  grid.appendChild(midCol);
  grid.appendChild(right);

  card.appendChild(grid);

  // Create on back? (simple + safe): add a button implicitly by tapping back later is confusing.
  // So we add a simple "Create" button under the form (still matches your simple UX).
  const create = el("button", { class:"addGreen", style:"margin-top:18px;" }, "Create");
  create.addEventListener("click", () => {
    const nameSel = document.getElementById("npName").value;
    const groupSel = document.getElementById("npGroup").value;
    const mutSel = document.getElementById("npMut").value;
    const priceVal = Number(document.getElementById("npPrice").value);

    const newId = "b_" + Math.random().toString(16).slice(2);

    const baseRate = nameSel === "Nuclearo Dinossauro" ? 150_000_000 : 2_500_000;

    const brainrot = {
      id: newId,
      name: nameSel === "Custom" ? "Custom Brainrot" : nameSel,
      baseRate,
      mutation: mutSel === "None" ? null : mutSel,
      trait: "Doesn't matter",
      amount: qtyVal,
      isNeed: false,
      flags: { sold:false, stolen:false },
      imageDataUrl: imgData,
      price: Number.isFinite(priceVal) ? priceVal : null,
      moneyGroup: groupSel === "None" ? null : groupSel
    };

    state.brainrots.push(brainrot);

    // link it to RafaelSales top products
    const p = profile();
    p.topProductIds.unshift(newId);

    saveState();
    back(); // returns to where you came from (your rule)
  });

  card.appendChild(create);

  page.appendChild(card);
  APP.appendChild(page);
}

/* ---------- init ---------- */
render();
