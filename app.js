/* Brainrots app (GitHub Pages friendly)
   - localStorage persistence
   - page router with back stack
   - You can choose brainrot anytime (dropdown + custom)
   - Need brainrots: ONLY "Gotten" (no sold/stolen)
   - Sold empty state: None... + sad face
   - Stolen forces amount = 0
*/

const APP = document.getElementById("app");
const LS_KEY = "brainrots_app_v2";

const PAGES = {
  HOME: "home",
  PROFILE: "profile",
  PRODUCTS: "products",
  NEW_PRODUCT: "new_product",
  DETAIL: "detail",
};

/** Put your brainrot names here (you can keep adding later).
    The app will let you type custom too. */
const BRAINROT_MASTER = [
  "Skibidi Toilet",
  "Strawberry Elephant",
  "Meowl",
  "Headless Horseman",
  "La Vacca Saturno Saturnita",
  "Los Tralaleritos",
  "Las Tralaleritas",
  "Job Job Job Sahur",
  "GOAT",
  "Graipuss Medussi",
  "To to to Sahur",
  "Chicleteira Bicicleteira",
  "Chicleteirina Bicicleteirina",
  "La Grande Combinasion",
  "Nuclearo Dinossauro",
  "Money Money Puggy",
  "Tang Tang Keletang",
  "Ketupat Kepat",
  "Tictac Sahur",
  "Ketchuru and Musturu",
  "Lavadorito Spinito",
  "Garama and Madundung",
  "Ventoliero Pavonero",
  "Burguro and Fryuro",
  "Capitano Moby",
  "Cerberus",
  "Dragon Cannelloni",
  "Karkerkar Kurkur",
  "Los Matteos",
  "Bisonte Giuppitere",
  "Trenostruzzo Turbo 4000",
  "Jackorilla",
  "Sammyni Spyderini",
  "Torrtuginni Dragonfrutini",
  "Dul Dul Dul",
  "Chachechi",
  "Blackhole Goat",
  "Agarrini la Palini",
  "Los Spyderinis",
  "Fragola La La La",
  "Extinct Tralalero",
  "La Cucaracha",
  "Vulturino Skeletono",
  "Zombie Tralala",
  "Los Tortus",
  "Boatito Auratito",
  "Guerriro Digitale",
  "Yess my examine",
  "La Karkerkar Combinasion",
  "La Vacca Prese Presente",
  "Reindeer Tralala",
  "Extinct Matteo",
  "Rocco Disco",
  "Pumpkini Spyderini",
  "Frankentteo",
  "Los Trios",
  "Karker Sahur",
  "Las Vaquitas Saturnitas",
  "Los Karkeritos",
  "Santteo",
  "Fishboard",
  "La Vacca Jacko Linterino",
  "Triplito Tralaleritos",
  "Trickolino",
  "Giftini Spyderini",
  "Perrito Burrito",
  "1x1x1x1",
  "Love Love Love Sahur",
  "Los Cucarachas",
  "Please my Present",
  "Cuadramat and Pakrahmatmamat",
  "Bunnyman",
  "Coffin Tung Tung Tung Sahur",
  "Tung Tung Tung Sahur",
  "Los Jobcitos",
  "Nooo My Hotspot",
  "Noo my examine",
  "Telemorte",
  "La Sahur Combinasion",
  "List List List Sahur",
  "Pirulitoita Bicicleteira",
  "Pot Hotspot",
  "25",
  "Santa Hotspot",
  "Horegini Boom",
  "Quesadilla Crocodila",
  "Bunito Bunito Spinito",
  "Pot Pumpkin",
  "Cupid Cupid Sahur",
  "Naughty Naughty",
  "Ho Ho Ho Sahur",
  "Mi Gatito",
  "Quesadillo Vampiro",
  "Brunito Marsito",
  "Cupid Hotspot",
  "Burrito Bandito",
  "Chill Puppy",
  "Los Quesadillas",
  "Noo my Candy",
  "Arcadopus",
  "Los Nooo My Hotspotsitos",
  "Rang Ring Bus",
  "Noo my Present",
  "Guest 666",
  "Los Chicleteiras",
  "Los Mi Gatitos",
  "67",
  "Donkeyturbo Express",
  "Los Burritos",
  "Los 25",
  "Mariachi Corazoni",
  "Swag Soda",
  "Noo my Heart",
  "Chimnino",
  "Los Combinasionas",
  "Chicleteira Noelteira",
  "Fishino Clownino",
  "Tacorita Bicicleta",
  "Los Sweethearts",
  "Spinny Hammy",
  "Las Sis",
  "DJ Panda",
  "Chicleteira Cupideira",
  "Los Planitos",
  "Los Hotspotsitos",
  "Los Spooky Combinasionas",
  "Los Jolly Combinasionas",
  "Los Mobilis",
  "Celularcini Viciosini",
  "Los 67",
  "Los Candies",
  "La Extinct Grande",
  "Los Bros",
  "Bacuru and Egguru",
  "La Spooky Grande",
  "Chipso and Queso",
  "Chillin Chili",
  "Money Money Reindeer",
  "Mieteteira Bicicleteira",
  "Tuff Toucan",
  "Tralaledon",
  "Gobblino Uniciclino",
  "Esok Sekolah",
  "Los Puggies",
  "W or L",
  "La Jolly Grande",
  "Los Primos",
  "Eviledon",
  "Los Tacoritas",
  "Lovin Rose",
  "La Taco Combinasion",
  "Orcaledon",
  "Swaggy Bros",
  "La Romantic Grande",
  "Tirilikalika Tirilikalako",
  "Jolly Jolly Sahur",
  "Rosetti Tualetti",
  "Spaghetti Tualetti",
  "Festive 67",
  "Los Spaghettis",
  "Sammyni Fattini",
  "Ginger Gerat",
  "La Ginger Sekolah",
  "Love Love Bear",
  "Spooky and Pumpky",
  "La Food Combinasion",
  "Fragrama and Chocrama",
  "Signore Carapace",
  "La Casa Boo",
  "Los Sekolahs",
  "La Secret Combinasion",
  "Los Amigos",
  "Reinito Sleighito",
  "Ketupat Bros",
  "Cooki and Milki",
  "Rosey and Teddy",
  "Popcuru and Fizzuru",
  "Celestial Pegasus",
  "La Supreme Combinasion",
  "Dragon Gingerini",
  "Hydra Dragon Cannelloni",
  "Cocofanto Elefanto",
  "Girafa Celestre",
  "Tralalero Tralala",
  "Odin Din Din Dun",
  "Tralalita Tralala",
  "Trenostruzzo Turbo 3000",
  "Trippi Troppi Troppa Trippa",
  "Ballerino Lololo",
  "Pakrahmatmamat",
  "Piccione Macchina",
  "Tractoro Dinosauro",
  "Cacasito Satalito",
  "Aquanaut",
  "Tartaruga Cisterna",
  "Gattatino Nyanino",
  "Chihuanini Taconini",
  "Matteo",
  "Los Crocodillitos",
  "Tigroligre Frutonni",
  "Money Money Man",
  "Alessio",
  "Tipi Topi Taco",
  "Unclito Samito",
  "Tukanno Bananno",
  "Extinct Ballerina",
  "Vampira Cappuccina",
  "Espresso Signora",
  "Orcalero Orcala",
  "Jacko Jack Jack",
  "Urubini Flamenguini",
  "Capi Taco",
  "Los Chihuaninis",
  "Gattito Tacoto",
  "Las Capuchinas",
  "Bulbito Bandito Traktorito",
  "Los Tungtungtungcitos",
  "Ballerina Peppermintina",
  "Brr es Teh Patipum",
  "Pakrahmatmatina",
  "Los Bombinitos",
  "Los Orcalitos",
  "Orcalita Orcala",
  "Corn Corn Corn Sahur",
  "Mummy Ambalabu",
  "Snailenzo",
  "Squalanana",
  "Dug dug dug",
  "Ginger Globo",
  "Yeti Claus",
  "Crabbo Limonetta",
  "Granchiello Spiritell",
  "Tootini Shrimpini",
  "Los Tipi Tacos",
  "Frio Ninja",
  "Buho de Noelo",
  "Piccionetta Machina",
  "Boba Panda",
  "Mastodontico Telepiedone",
  "Los Gattitos",
  "Bambu Bambu Sahur",
  "Chrismasmamat",
  "Anpali Babel",
  "Luv Luv Luv",
  "Cappuccino Clownino",
  "Bombardini Tortinii",
  "Brasilini Berimbini",
  "Belula Beluga",
  "Krupuk Pagi Pagi",
  "Skull Skull Skull",
  "Cocoa Assassino",
  "Tentacolo Tecnico",
  "Ginger Cisterna",
  "Pandanini Frostini",
  "Dolphini Jetskini",
  "Pop Pop Sahur",
  "Noo La Polizia",
  "Karkerheart Luvkur",
  "Frigo Camelo",
  "Orangutini Ananassini",
  "Rhino Toasterino",
  "Bombardiro Crocodilo",
  "Bombombini Gusini",
  "Cavallo Virtuoso",
  "Gorillo Watermelondrillo",
  "Lerulerulerule",
  "Te Te Te Sahur",
  "Tracoducotulu Delapeladustuz",
  "Cachorrito Melonito",
  "Toiletto Focaccino",
  "Brutto Gialutto",
  "Spioniro Golubiro",
  "Zibra Zubra Zibralini",
  "Tigrilini Watermelini",
  "Avocadorilla",
  "Gorillo Subwoofero",
  "Stoppo Luminino",
  "Tob Tobi Tobi",
  "Ganganzelli Trulala",
  "Rhino Helicopterino",
  "Magi Ribbitini",
  "Jingle Jingle Sahur",
  "Los Noobinis",
  "Spongini Quackini",
  "Carloo",
  "Carrotini Brainini",
  "Centrucci Nuclucci",
  "Jacko Spaventosa",
  "Bananito Bandito",
  "Tree Tree Tree Sahur",
  "Chimpanzini Bananini",
  "Ballerina Cappuccina",
  "Chef Crabracadabra",
  "Lionel Cactuseli",
  "Glorbo Fruttodrillo",
  "Quivioli Ameleonni",
  "Blueberrinni Octopusini",
  "Pipi Potato",
  "Strawberrelli Flamingelli",
  "Pandaccini Bananini",
  "Sigma Boy",
  "Clickerino Crabo",
  "Caramello Filtrello",
  "Cocosini Mama",
  "Quackula",
  "Pi Pi Watermelon",
  "Chocco Bunny",
  "Puffaball",
  "Sigma Girl",
  "Sealo Regalo",
  "Buho de Fuego",
  "Cappuccino Assassino",
  "Brr Brr Patapim",
  "Avocadini Antilopini",
  "Trulimero Trulicina",
  "Bambini Crostini",
  "Bananita Dolphinita",
  "Perochello Lemonchello",
  "Brri Brri Bicus Dicus Bombicus",
  "Avocadini Guffo",
  "Salamino Penguino",
  "Wombo Rollo",
  "Bandito Axolito",
  "Malame Amarele",
  "Ti Ti Ti Sahur",
  "Mangolini Parrocini",
  "Frogato Pirato",
  "Doi Doi Do",
  "Penguin Tree",
  "Penguino Cocosino",
  "Mummio Rappitto",
  "Trippi Troppi",
  "Gangster Footera",
  "Bandito Bobritto",
  "Boneca Ambalabu",
  "Cacto Hipopotamo",
  "Ta Ta Ta Ta Sahur",
  "Tric Trac Baraboom",
  "Cupcake Koala",
  "Frogo Elfo",
  "Pipi Avocado",
  "Pinealotto Fruttarino",
  "Pipi Corni",
  "Tartaragno",
  "Racconi Jandelini",
  "Noobini Santanini",
  "Pipi Kiwi",
  "Svinina Bombardino",
  "Furiflura",
  "Tim Cheese",
  "Lirili Larila",
  "Noobini Pizzanini"
];

function seed(){
  return {
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
        topProductIds: [],
        reviews: [],
      }
    ],
    brainrots: [
      // Your required Need item:
      {
        id: "nuclearo",
        name: "Nuclearo Dinossauro",
        baseRate: 150_000_000,
        mutation: "Rainbow",
        trait: "Doesn't matter",
        amount: 0,
        isNeed: true,
        flags: { sold:false, stolen:false },
        imageDataUrl: null,
        price: null,
        moneyGroup: null
      }
    ],
  };
}

function loadState(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    if(!raw) return seed();
    const parsed = JSON.parse(raw);
    if(!parsed || !Array.isArray(parsed.brainrots)) return seed();
    return parsed;
  }catch{
    return seed();
  }
}
function saveState(){ localStorage.setItem(LS_KEY, JSON.stringify(state)); }
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
  current = prev || { page: PAGES.HOME, params: {} };
  render();
}

function profile(){
  return state.profiles.find(p => p.id === state.activeProfileId) || state.profiles[0];
}
function brainrotById(id){ return state.brainrots.find(b => b.id === id); }

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

function idNew(prefix="b_"){
  return prefix + Math.random().toString(16).slice(2) + "_" + Date.now().toString(16);
}

function readAsDataURL(file){
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsText(file);
  });
}
function readImgAsDataURL(file){
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

/* ---------- RENDER ---------- */

function render(){
  APP.innerHTML = "";
  if(current.page === PAGES.HOME) renderHome();
  if(current.page === PAGES.DETAIL) renderDetail(current.params.id);
  if(current.page === PAGES.PROFILE) renderProfile();
  if(current.page === PAGES.PRODUCTS) renderProducts();
  if(current.page === PAGES.NEW_PRODUCT) renderNewProduct();
}

/* ---------- HOME ---------- */

function renderHome(){
  const top = el("div", { class:"topbar" });

  const sellersPill = el("div", { class:"pill" });
  sellersPill.innerHTML = `
    <span style="text-decoration:underline;text-underline-offset:5px;">Sellers</span>
    <select id="sellerSelect">
      <option value="all">All</option>
      <option value="rafael">RafaelSales</option>
    </select>
  `;
  top.appendChild(sellersPill);

  const profPill = el("div", { class:"pill" });
  const p = profile();
  profPill.innerHTML = `
    <select id="profSelect">
      ${state.profiles.map(x => `<option value="${x.id}" ${x.id===p.id?"selected":""}>${x.name}</option>`).join("")}
    </select>
    <span style="font-weight:1000;">▼</span>
  `;
  profPill.addEventListener("click", (e) => {
    if(e.target && e.target.tagName !== "SELECT"){
      go(PAGES.PROFILE);
    }
  });
  top.appendChild(profPill);

  APP.appendChild(top);
  APP.appendChild(el("div", { class:"title" }, "Brainrots.."));

  const board = el("div", { class:"board" });
  board.appendChild(makeColumn("Need/Dont Have", "need"));
  board.appendChild(makeColumn("Have", "have"));
  board.appendChild(makeColumn("Bought", "bought"));
  board.appendChild(makeColumn("Sold", "sold"));
  APP.appendChild(board);

  const profSelect = document.getElementById("profSelect");
  profSelect.addEventListener("change", () => {
    state.activeProfileId = profSelect.value;
    saveState();
    render();
  });

  // Lists
  const need = state.brainrots.filter(b => b.isNeed);
  const have = state.brainrots.filter(b => !b.isNeed && b.amount > 0 && !b.flags?.stolen);
  const bought = state.brainrots.filter(b => !b.isNeed && b.price != null);
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
    const it = el("div", { class:"item" }, `( ${b.name} )`);
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

/* ---------- DETAIL ---------- */

function renderDetail(id){
  const b = brainrotById(id);
  if(!b){ back(); return; }

  const topRow = el("div", { class:"backRow" });
  topRow.appendChild(el("button", { class:"xBtn", onclick: () => back() }, "X"));
  APP.appendChild(topRow);

  const page = el("div", { class:"page" });
  const detail = el("div", { class:"detailCard" });

  const grid = el("div", { class:"detailGrid" });

  const left = el("div", {});
  const right = el("div", {});

  if(b.isNeed){
    // Need: only "Gotten"
    left.appendChild(el("div", { class:"infoLines" }, `
      <div>(Brainrot Name) ${b.name}</div>
      <div>$/s: ${money(b.baseRate)}</div>
      <div>Mutation: ${b.mutation}</div>
      <div>Trait: ${b.trait}</div>
    `));

    left.appendChild(el("div", { style:"height:16px" }));

    const gotten = el("button", { class:"gottenBtn" }, "Gotten");
    gotten.addEventListener("click", () => {
      b.isNeed = false;
      b.amount = 1;
      b.flags = { sold:false, stolen:false };
      saveState();
      back();
    });

    left.appendChild(gotten);
  } else {
    // Not Need: sold/stolen + qty
    const tagRow = el("div", { class:"tagRow" });

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
        b.amount = 0; // stolen forces 0
      }
      saveState();
      render();
    });

    tagRow.appendChild(soldBtn);
    tagRow.appendChild(stolenBtn);
    left.appendChild(tagRow);

    left.appendChild(el("div", { style:"height:16px" }));

    const qty = el("div", { class:"qtyBox" });
    const up = el("button", {}, "▲");
    const mid = el("div", { class:"qty" }, `${b.amount}`);
    const down = el("button", {}, "▼");

    up.addEventListener("click", () => { b.amount += 1; saveState(); render(); });
    down.addEventListener("click", () => { b.amount = Math.max(0, b.amount-1); saveState(); render(); });

    qty.appendChild(up); qty.appendChild(mid); qty.appendChild(down);
    left.appendChild(qty);

    left.appendChild(el("div", { style:"height:16px" }));
    left.appendChild(el("div", { class:"infoLines" }, `
      <div>(Brainrot Name) ${b.name}</div>
      <div>$/s: ${money(b.baseRate || 0)}</div>
      <div>Cost: ${b.price != null ? `$${b.price}` : "(Cost)"}</div>
      <div>Mutation: ${b.mutation || "(none)"}</div>
    `));
  }

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
    b.imageDataUrl = await readImgAsDataURL(file);
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
  page.appendChild(detail);
  APP.appendChild(page);
}

/* ---------- PROFILE ---------- */

function renderProfile(){
  const page = el("div", { class:"page" });

  const backRow = el("div", { class:"backRow" });
  backRow.appendChild(el("button", { class:"backBtn", onclick: () => back() }, "←"));
  page.appendChild(backRow);

  const top = el("div", { class:"profileTop" });

  top.appendChild(el("div", { class:"avatarBig" }, "(photo)"));

  const p = profile();
  const header = el("div", { class:"headerPill" });
  header.innerHTML = `
    <div class="name">${p.name} ⭐⭐⭐⭐⭐</div>
    <div class="sub">${p.email}</div>
    <div class="link" id="toProductsLink">To Products</div>
  `;
  top.appendChild(header);

  const shops = el("div", { class:"shopBox" });
  shops.innerHTML = `
    <h3>Shops Used</h3>
    ${p.shops.map(s => `<div><b>${s.name}</b> <span style="color:#6aa8ff;text-decoration:underline;">(link)</span></div>`).join("")}
  `;
  top.appendChild(shops);

  page.appendChild(top);

  const row = el("div", { class:"sectionRow" });

  // Top Products
  const leftPanel = el("div", {});
  leftPanel.appendChild(el("div", { class:"sectionTitle" }, "Top Products"));

  const prodPanel = el("div", { class:"productPanel" });

  if(p.topProductIds.length === 0){
    const empty = el("div", { style:"display:flex;align-items:center;gap:18px;flex:1;justify-content:center;" });
    empty.innerHTML = `
      <div style="font-weight:1000;font-size:36px;text-decoration:underline;text-underline-offset:6px;">No Others...</div>
      <div class="sad"><div class="mouth"></div></div>
    `;
    prodPanel.appendChild(empty);
  } else {
    const first = brainrotById(p.topProductIds[0]);
    if(first) prodPanel.appendChild(productCard(first));
  }

  const addBtn = el("button", { class:"addGreen" }, "Add...");
  addBtn.addEventListener("click", () => go(PAGES.NEW_PRODUCT, { linkToTop:true }));
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

  const del = el("button", { class:"deleteRed" }, "Delete Account");
  del.addEventListener("click", () => alert("Demo safety: Delete is disabled."));
  rightPanel.appendChild(del);

  row.appendChild(rightPanel);
  page.appendChild(row);
  APP.appendChild(page);

  document.getElementById("toProductsLink").addEventListener("click", () => go(PAGES.PRODUCTS));
}

/* ---------- TO PRODUCTS ---------- */

function renderProducts(){
  const page = el("div", { class:"page" });

  const topRow = el("div", { class:"backRow", style:"justify-content:flex-end" });
  topRow.appendChild(el("button", { class:"xBtn", onclick: () => back() }, "X"));
  page.appendChild(topRow);

  const p = profile();
  const row = el("div", { style:"display:flex;align-items:flex-start;gap:18px;flex-wrap:wrap;" });

  p.topProductIds.forEach(id => {
    const b = brainrotById(id);
    if(b) row.appendChild(productCard(b));
  });

  const empty = el("div", { style:"flex:1;min-width:260px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding-top:40px;" });
  empty.innerHTML = `<div style="font-size:64px;font-weight:1000;">No more...</div>`;
  const add = el("button", { class:"addGreen", style:"font-size:54px;padding:18px 34px;" }, "Add...");
  add.addEventListener("click", () => go(PAGES.NEW_PRODUCT, { linkToTop:true }));
  empty.appendChild(add);

  row.appendChild(empty);
  page.appendChild(row);
  APP.appendChild(page);
}

function productCard(b){
  const pc = el("div", { class:"productCard" });

  const img = el("div", { class:"img" }, b.imageDataUrl ? "" : "(image)");
  if(b.imageDataUrl){
    img.textContent = "";
    img.style.backgroundImage = `url("${b.imageDataUrl}")`;
    img.style.backgroundSize = "cover";
    img.style.backgroundPosition = "center";
  }

  const txt = el("div", { class:"txt" });
  txt.innerHTML = `
    <div class="n">${b.name}</div>
    <div class="q">${b.amount > 0 ? `${b.amount} Quantity` : `Infinite Quantity`}</div>
    <div class="p">${b.price != null ? `$${b.price}` : `$2.5`}</div>
  `;

  pc.appendChild(img);
  pc.appendChild(txt);
  pc.addEventListener("click", () => go(PAGES.DETAIL, { id: b.id }));
  return pc;
}

/* ---------- NEW PRODUCT ---------- */

function renderNewProduct(){
  const page = el("div", { class:"page" });

  const backRow = el("div", { class:"backRow" });
  backRow.appendChild(el("button", { class:"backBtn", onclick: () => back() }, "←"));
  page.appendChild(backRow);

  const card = el("div", { class:"card" });
  card.appendChild(el("div", { class:"formTitle" }, "New Product"));

  const grid = el("div", { class:"formGrid" });

  // LEFT (qty + yes/no)
  let qtyVal = 1;
  let yesNo = true;

  const left = el("div", { class:"fieldBlock" });
  const qty = el("div", { class:"qtyBox" });
  const up = el("button", {}, "▲");
  const mid = el("div", { class:"qty" }, `${qtyVal}`);
  const down = el("button", {}, "▼");
  up.addEventListener("click", () => { qtyVal += 1; mid.textContent = `${qtyVal}`; });
  down.addEventListener("click", () => { qtyVal = Math.max(0, qtyVal-1); mid.textContent = `${qtyVal}`; });
  qty.appendChild(up); qty.appendChild(mid); qty.appendChild(down);
  left.appendChild(qty);
  left.appendChild(el("div", { class:"smallHelp" }, "Quantity"));

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

  // MIDDLE (brainrot picker + group + mutation)
  const midCol = el("div", { class:"fieldBlock" });

  // Brainrot picker: datalist = you can choose OR type
  const nameLabel = el("div", { class:"label" }, "Brainrot Name");
  const nameInputWrap = el("div", { class:"inputPill" });
  nameInputWrap.innerHTML = `
    <input id="brName" list="brainrotList" placeholder="Choose or type…" />
    <datalist id="brainrotList">
      ${BRAINROT_MASTER.map(n => `<option value="${n}"></option>`).join("")}
    </datalist>
  `;

  const groupLabel = el("div", { class:"label" }, "Money Group");
  const groupPill = el("div", { class:"selectPill" });
  groupPill.innerHTML = `
    <select id="brGroup">
      <option value="None">None</option>
      <option value="Money Group">Money Group</option>
    </select>
  `;

  const mutLabel = el("div", { class:"label" }, "Mutation");
  const mutPill = el("div", { class:"selectPill" });
  mutPill.innerHTML = `
    <select id="brMut">
      <option value="None">None</option>
      <option value="Rainbow">Rainbow</option>
    </select>
  `;

  midCol.appendChild(nameLabel);
  midCol.appendChild(nameInputWrap);
  midCol.appendChild(groupLabel);
  midCol.appendChild(groupPill);
  midCol.appendChild(mutLabel);
  midCol.appendChild(mutPill);

  // RIGHT (image + price)
  const right = el("div", { class:"fieldBlock" });

  const pic = el("div", { class:"picBox" });
  const picArea = el("div", { class:"pic" }, "Picture of Brainrot");
  const insert = el("button", { class:"insert" }, "Insert");
  const fileInput = el("input", { type:"file", accept:"image/*", class:"hidden" });

  let imgData = null;
  insert.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", async () => {
    const f = fileInput.files?.[0];
    if(!f) return;
    imgData = await readImgAsDataURL(f);
    picArea.textContent = "";
    picArea.style.backgroundImage = `url("${imgData}")`;
    picArea.style.backgroundSize = "cover";
    picArea.style.backgroundPosition = "center";
  });

  pic.appendChild(picArea);
  pic.appendChild(insert);
  right.appendChild(pic);
  right.appendChild(fileInput);

  right.appendChild(el("div", { class:"label" }, "Price"));
  const pricePill = el("div", { class:"inputPill" });
  pricePill.innerHTML = `<input id="brPrice" type="number" placeholder="(Typebox)" min="0" step="0.01" />`;
  right.appendChild(pricePill);

  // build form
  grid.appendChild(left);
  grid.appendChild(midCol);
  grid.appendChild(right);
  card.appendChild(grid);

  const create = el("button", { class:"addGreen createBtn" }, "Create");
  create.addEventListener("click", () => {
    const name = document.getElementById("brName").value.trim();
    if(!name){ alert("Pick or type a brainrot name."); return; }

    const groupSel = document.getElementById("brGroup").value;
    const mutSel = document.getElementById("brMut").value;
    const priceVal = Number(document.getElementById("brPrice").value);

    // Create new brainrot entry (non-Need)
    const b = {
      id: idNew(),
      name,
      baseRate: name === "Nuclearo Dinossauro" ? 150_000_000 : 0, // you can fill later
      mutation: mutSel === "None" ? null : mutSel,
      trait: "Doesn't matter",
      amount: qtyVal,
      isNeed: false,
      flags: { sold:false, stolen:false },
      imageDataUrl: imgData,
      price: Number.isFinite(priceVal) ? priceVal : null,
      moneyGroup: groupSel === "None" ? null : groupSel
    };

    state.brainrots.push(b);

    // link to RafaelSales top products automatically
    const p = profile();
    p.topProductIds.unshift(b.id);

    saveState();
    back(); // return to previous page (your rule)
  });

  card.appendChild(create);
  page.appendChild(card);
  APP.appendChild(page);
}

/* ---------- INIT ---------- */
render();