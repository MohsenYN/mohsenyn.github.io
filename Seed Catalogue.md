---
layout: default
title: Dry Bean Variety Catalogue
permalink: /seed-catalogue/
---

<style>
body { font-family: system-ui; background:#f6f8f7; }
.uog { max-width:1200px; margin:auto; padding:20px; }
h1 { color:#0b4b2f; }

.filters { display:flex; gap:10px; flex-wrap:wrap; }
input, select { padding:8px; border-radius:6px; border:1px solid #ccc; }

.grid {
 display:grid;
 grid-template-columns: repeat(auto-fit,minmax(260px,1fr));
 gap:16px;
 margin-top:20px;
}

.card {
 background:white;
 border-radius:10px;
 box-shadow:0 4px 12px rgba(0,0,0,0.08);
 overflow:hidden;
}

.card img {
 width:100%;
 height:150px;
 object-fit:contain;
 background:#eee;
}

.card-body { padding:12px; }
.badge { background:#e6f2ec; padding:4px 8px; border-radius:20px; font-size:0.8rem; }

.compare { margin-top:30px; background:white; padding:15px; border-radius:10px; }

#plot, #radar { height:400px; margin-top:20px; }
</style>

<div class="uog">
<h1>Dry Bean Variety Catalogue</h1>

<div class="filters">
  <input id="search" placeholder="Search name">
  <select id="classFilter"><option value="">All classes</option></select>
  <button onclick="render()">Clear</button>
</div>

<div class="grid" id="catalog"></div>

<div class="compare">
<h3>Compare selected varieties</h3>
<button onclick="plot()">Plot</button>
<select id="x"></select>
<select id="y"></select>
<div id="plot"></div>
<div id="radar"></div>
</div>
</div>

<script src="https://cdn.plot.ly/plotly-2.26.0.min.js"></script>

<script>
// =========================
// HARD-CODED DATA
// =========================
const varieties = [
 {name:"OAC Thunder", class:"White Navy", year:1977, yield:3015, maturity:94, weight:22.7, dhs:2.6},
 {name:"OAC Gryphon", class:"White Navy", year:1988, yield:3254, maturity:96, weight:20.4, dhs:4.0},
 {name:"OAC Rex", class:"White Navy", year:2002, yield:3191, maturity:98, weight:21.5, dhs:2.7},
 {name:"Lightning", class:"White Navy", year:2008, yield:2845, maturity:94, weight:22.0, dhs:2.1},
 {name:"Mist", class:"White Navy", year:2013, yield:3163, maturity:97, weight:23.2, dhs:1.9},
 {name:"OAC Vortex", class:"Black", year:2019, yield:3669, maturity:97, weight:23.9, dhs:2.3},
 {name:"OAC Racer", class:"Cranberry", year:2019, yield:2003, maturity:86, weight:65.0, dhs:2.8},
 {name:"OAC Plasma", class:"White Navy", year:2019, yield:3541, maturity:94, weight:22.3, dhs:2.4},
 {name:"OAC Souper", class:"White Navy", year:2022, yield:3355, maturity:103, weight:22.1, dhs:2.8},
 {name:"Umbra", class:"Black", year:2023, yield:3710, maturity:98, weight:23.5, dhs:1.9},
 {name:"Blast", class:"White Navy", year:2023, yield:3446, maturity:95, weight:21.7, dhs:2.0},
 {name:"Bannock", class:"Black", year:2023, yield:3785, maturity:98, weight:23.5, dhs:1.6},
 {name:"OAC Toast", class:"Pinto", year:2023, yield:3743, maturity:90, weight:42.0, dhs:3.1},
 {name:"OAC Clever", class:"White Navy", year:2024, yield:3254, maturity:91, weight:19.8, dhs:2.1},
 {name:"Wake", class:"White Navy", year:2025, yield:3089, maturity:89, weight:22.3, dhs:2.8}
];

let selected = new Set();

// =========================
// INIT
// =========================
function initFilters(){
 const classes=[...new Set(varieties.map(v=>v.class))];
 const sel=document.getElementById("classFilter");
 classes.forEach(c=>{
   const o=document.createElement("option");
   o.value=c; o.textContent=c;
   sel.appendChild(o);
 });
}

function initAxes(){
 const x=document.getElementById("x");
 const y=document.getElementById("y");
 ["yield","maturity","weight","dhs"].forEach(f=>{
   x.innerHTML+=`<option value="${f}">${f}</option>`;
   y.innerHTML+=`<option value="${f}">${f}</option>`;
 });
 x.value="maturity";
 y.value="yield";
}

// =========================
// RENDER
// =========================
function render(){
 const q=document.getElementById("search").value.toLowerCase();
 const cls=document.getElementById("classFilter").value;
 const box=document.getElementById("catalog");
 box.innerHTML="";

 varieties.filter(v=>{
   return (!cls||v.class===cls) &&
          (!q||v.name.toLowerCase().includes(q));
 }).forEach(v=>{
   const slug=v.name.toLowerCase().replace(/[^a-z0-9]+/g,"-");
   const card=document.createElement("div");
   card.className="card";
   card.innerHTML=`
   <img src="/assets/images/varieties/${slug}.jpg"
        onerror="this.src='https://via.placeholder.com/400x200?text=No+image'">
   <div class="card-body">
     <h3>${v.name}</h3>
     <span class="badge">${v.class}</span>
     <p>Year: ${v.year}</p>
     <p>Yield: ${v.yield}</p>
     <label>
       <input type="checkbox" onchange="toggle('${v.name}')">
       Compare
     </label>
   </div>`;
   box.appendChild(card);
 });
}

// =========================
// SELECT
// =========================
function toggle(name){
 if(selected.has(name)) selected.delete(name);
 else selected.add(name);
}

// =========================
// PLOT
// =========================
function plot(){
 const xs=document.getElementById("x").value;
 const ys=document.getElementById("y").value;
 const sel=varieties.filter(v=>selected.has(v.name));
 if(sel.length===0){ alert("Select varieties"); return; }

 Plotly.newPlot("plot",[{
   x:sel.map(v=>v[xs]),
   y:sel.map(v=>v[ys]),
   text:sel.map(v=>v.name),
   mode:"markers+text"
 }],{
   title:`${ys} vs ${xs}`
 });

 const metrics=["yield","maturity","weight","dhs"];
 Plotly.newPlot("radar",
 sel.map(v=>({
   type:"scatterpolar",
   r:metrics.map(m=>v[m]),
   theta:metrics,
   fill:"toself",
   name:v.name
 })),
 {title:"Profile comparison"});
}

// =========================
// START
// =========================
initFilters();
initAxes();
render();
</script>
