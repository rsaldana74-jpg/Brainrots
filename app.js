const app = document.getElementById("app");

/* =========================
   🔥 PASTE YOUR FULL LIST HERE
   ========================= */

const BRAINROT_MASTER_RAW = `
Skibidi Toilet
Strawberry Elephant
Meowl
Headless Horseman
Svinina Bombardino
Furiflura
Tim Cheese
Lirili Larila
Noobini Pizzanini
`;

/* =========================
   CLEAN LIST (DO NOT TOUCH)
   ========================= */

const BRAINROT_MASTER = Array.from(
  new Set(
    BRAINROT_MASTER_RAW
      .split("\n")
      .map(x => x.trim())
      .filter(Boolean)
      .map(x => x.replace(/,$/, ""))
      .map(x => x.replace(/^"+|"+$/g, ""))
  )
);

/* =========================
   UI
   ========================= */

app.innerHTML = `
  <h1 style="text-align:center;font-size:50px;">Brainrots</h1>

  <div style="text-align:center;margin-bottom:20px;">
    <input id="search" placeholder="Search..."
      style="padding:10px;font-size:18px;width:300px;">
  </div>

  <div id="list" style="max-width:600px;margin:auto;"></div>
`;

const list = document.getElementById("list");
const search = document.getElementById("search");

/* =========================
   RENDER
   ========================= */

function render(filter=""){
  list.innerHTML = "";

  BRAINROT_MASTER
    .filter(x => x.toLowerCase().includes(filter.toLowerCase()))
    .slice(0, 200)
    .forEach(name => {
      const div = document.createElement("div");
      div.style = "border:2px solid white;padding:10px;margin:6px;cursor:pointer;";
      div.textContent = name;
      list.appendChild(div);
    });
}

search.addEventListener("input", () => {
  render(search.value);
});

render();