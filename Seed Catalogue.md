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

.debug {
 background:#222;
 color:#0f0;
 padding:10px;
 font-family:monospace;
 font-size:0.85rem;
 margin-top:20px;
 white-space:pre-wrap;
}
</style>

<div class="uog">
<h1>Dry Bean Variety Catalogue</h1>

<div class="filters">
  <input id="search" placeholder="Search name">
  <select id="classFilter"><option value="">All classes</option></select>
  <button onclick="render()">Clear</button>
</div>

<div id="status"></div>
<div class="grid" id="catalog"></div>

<div class="compare">
<h3>Compare selected varieties</h3>
<button onclick="plot()">Plot</button>
<select id="x"></select>
<select id="y"></select>
<div id="plot"></div>
<div id="radar"></div>
</div>

<div class="debug" id="debug"></div>
</div>

<script src="https://cdn.jsdelivr.net/npm/xlsx@0.19.3/dist/xlsx.full.min.js"></script>
<script src="https://cdn.plot.ly/plotly-2.26.0.min.js"></script>

<script>
const BASE = window.location.origin;
const EXCEL_PATH = BASE + "/assets/beans.xlsx";

let varieties = [];
let selected = new Set();

log("Trying to load: " + EXCEL_PATH);

fetch(EXCEL_PATH)
.then(r=>{
  if(!r.ok) throw new Error("HTTP " + r.status);
  return r.arrayBuffer();
})
.then(buf=>{
  const wb = XLSX.read(buf, {type:"array"});
  const sheet = wb.Sheets[wb.SheetNames[0]];
  varieties = XLSX.utils.sheet_to_json(sheet);
  log("Loaded rows: " + varieties.length);

  normalize();
  initFilters();
  initAxes();
  render();
})
.catch(err=>{
  error("FAILED TO LOAD EXCEL\n" + err.message);
});

function normalize(){
  const numeric = [
    "Yield (lbs/acre)",
    "Yield (kg/ha)",
    "Maturity (days)",
    "100 Sd Weight (g)",
    "Direct Harvest Suitability"
  ];
  varieties.forEach(v=>{
    numeric.forEach(k=>{
      if(v[k]!==undefined && v[k]!==""){
        v[k]=Number(v[k]);
      }
    });
  });
}

function initFilters(){
 const classes=[...new Set(varieties.map(v=>v["Market Class"]))];
 const sel=document.getElementById("classFilter");
 sel.innerHTML='<option value="">All classes</option>';
 classes.forEach(c=>{
   const o=document.createElement("option");
   o.value=c; o.textContent=c;
   sel.appendChild(o);
 });
}

function initAxes(){
 const cols=[
  "Yield (lbs/acre)",
  "Yield (kg/ha)",
  "Maturity (days)",
  "100 Sd Weight (g)",
  "Direct Harvest Suitability"
 ];
 const x=document.getElementById("x");
 const y=document.getElementById("y");
 cols.forEach(c=>{
   x.innerHTML+=`<option>${c}</option>`;
   y.innerHTML+=`<option>${c}</option>`;
 });
 x.value="Maturity (days)";
 y.value="Yield (lbs/acre)";
}

function render(){
 const q=document.getElementById("search").value.toLowerCase();
 const cls=document.getElementById("classFilter").value;
 const box=document.getElementById("catalog");
 box.innerHTML="";

 const filtered=varieties.filter(v=>{
   return (!cls||v["Market Class"]===cls) &&
          (!q||v["Name"].toLowerCase().includes(q));
 });

 document.getElementById("status").innerHTML =
   `<b>${filtered.length}</b> varieties shown`;

 filtered.forEach(v=>{
   const slug=v["Name"].toLowerCase().replace(/[^a-z0-9]+/g,"-");
   const card=document.createElement("div");
   card.className="card";
   card.innerHTML=`
   <img src="/assets/images/varieties/${slug}.jpg"
        onerror="this.src='https://via.placeholder.com/400x200?text=No+image'">
   <div class="card-body">
     <h3>${v["Name"]}</h3>
     <span class="badge">${v["Market Class"]}</span>
     <p>Year: ${v["Year"]}</p>
     <p>Yield: ${v["Yield (lbs/acre)"]}</p>
     <label>
       <input type="checkbox" onchange="toggle('${v["Name"]}')">
       Compare
     </label>
   </div>`;
   box.appendChild(card);
 });
}

function toggle(name){
 if(selected.has(name)) selected.delete(name);
 else selected.add(name);
}

function plot(){
 const xs=document.getElementById("x").value;
 const ys=document.getElementById("y").value;
 const sel=varieties.filter(v=>selected.has(v["Name"]));
 if(sel.length===0){ alert("Select varieties"); return; }

 Plotly.newPlot("plot",[{
   x:sel.map(v=>v[xs]),
   y:sel.map(v=>v[ys]),
   text:sel.map(v=>v["Name"]),
   mode:"markers+text"
 }],{
   title:`${ys} vs ${xs}`,
   xaxis:{title:xs},
   yaxis:{title:ys}
 });

 const metrics=[
   "Yield (lbs/acre)",
   "Maturity (days)",
   "100 Sd Weight (g)",
   "Direct Harvest Suitability"
 ];

 Plotly.newPlot("radar",
 sel.map(v=>({
   type:"scatterpolar",
   r:metrics.map(m=>v[m]),
   theta:metrics,
   fill:"toself",
   name:v["Name"]
 })),
 {title:"Profile comparison"});
}

function log(msg){
 document.getElementById("debug").textContent += msg + "\n";
}

function error(msg){
 document.getElementById("debug").textContent += "ERROR: " + msg + "\n";
 document.getElementById("status").innerHTML =
   "<b style='color:red'>FAILED TO LOAD DATA</b>";
}
</script>
