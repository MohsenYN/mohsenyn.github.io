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

#plot { height:400px; }
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
<h3>Compare selected</h3>
<button onclick="plot()">Plot</button>
<select id="x"></select>
<select id="y"></select>
<div id="plot"></div>
<div id="radar"></div>
</div>
</div>

<script src="https://cdn.jsdelivr.net/npm/xlsx@0.19.3/dist/xlsx.full.min.js"></script>
<script src="https://cdn.plot.ly/plotly-2.26.0.min.js"></script>

<script>
let varieties = [];
let selected = new Set();

fetch("/assets/beans.xlsx")
.then(r => r.arrayBuffer())
.then(data => {
  const wb = XLSX.read(data);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  varieties = XLSX.utils.sheet_to_json(sheet);
  initFilters();
  initAxes();
  render();
});

function initFilters(){
 const classes = [...new Set(varieties.map(v=>v["Market Class"]))];
 const sel = document.getElementById("classFilter");
 classes.forEach(c=>{
   const o = document.createElement("option");
   o.value=c; o.textContent=c;
   sel.appendChild(o);
 });
}

function initAxes(){
 const fields = Object.keys(varieties[0]).filter(k=>typeof varieties[0][k]=="number");
 const x = document.getElementById("x");
 const y = document.getElementById("y");
 fields.forEach(f=>{
   x.innerHTML += `<option>${f}</option>`;
   y.innerHTML += `<option>${f}</option>`;
 });
 x.value = "Maturity (days)";
 y.value = "Yield (lbs/acre)";
}

function render(){
 const q = document.getElementById("search").value.toLowerCase();
 const cls = document.getElementById("classFilter").value;
 const box = document.getElementById("catalog");
 box.innerHTML="";

 varieties.filter(v=>{
   return (!cls || v["Market Class"]==cls) &&
          (!q || v["Name"].toLowerCase().includes(q));
 }).forEach(v=>{
   const slug = v["Name"].toLowerCase().replace(/\s+/g,"-");
   const card = document.createElement("div");
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
 const xs = document.getElementById("x").value;
 const ys = document.getElementById("y").value;
 const sel = varieties.filter(v=>selected.has(v["Name"]));

 const trace = {
   x: sel.map(v=>v[xs]),
   y: sel.map(v=>v[ys]),
   text: sel.map(v=>v["Name"]),
   mode:"markers+text",
   type:"scatter"
 };

 Plotly.newPlot("plot",[trace],{
   xaxis:{title:xs},
   yaxis:{title:ys},
   title:`${ys} vs ${xs}`
 });

 // Radar
 const metrics = ["Yield (lbs/acre)","Maturity (days)","100 Sd Weight (g)"];
 const radar = sel.map(v=>({
   type:"scatterpolar",
   r: metrics.map(m=>v[m]),
   theta: metrics,
   fill:"toself",
   name:v["Name"]
 }));

 Plotly.newPlot("radar", radar, {
   polar:{radialaxis:{visible:true}},
   title:"Profile comparison"
 });
}
</script>
