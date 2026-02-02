---
layout: default
title: Dry Bean Variety Catalogue
permalink: /seed-catalogue/
---

<!--
  Full hard-coded Dry Bean Variety Catalogue page.
  Paste as seed-catalogue.md into your Jekyll repo.
  Uses Plotly (CDN) for interactive charts and localStorage for images/edits.
-->

<style>
:root{
  --green:#0b4b2f;
  --green-2:#165b3c;
  --muted:#6b7a73;
  --card:#ffffff;
  --bg:#f5f8f6;
}
body { background:var(--bg); font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; color:#0e2b22;}
.uog-catalog { max-width:1180px; margin:28px auto; padding:22px; }
.h-title { font-size:2.6rem; color:var(--green); margin:8px 0 12px; font-weight:800; letter-spacing:-1px; }
.controls { display:flex; gap:12px; align-items:center; flex-wrap:wrap; margin-bottom:18px; }
.controls .left { flex:1; display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
.controls .right { display:flex; gap:8px; align-items:center; }

.input, select { padding:10px 12px; border-radius:10px; border:1px solid #dbe7e0; min-width:160px; background:#fff; }
.btn { padding:10px 14px; border-radius:10px; border:none; background:var(--green); color:#fff; cursor:pointer; box-shadow:0 6px 14px rgba(11,75,47,0.12); }
.btn.secondary { background:#2f6b54; }
.small { padding:8px 10px; font-size:0.95rem; }

.catalog-grid {
  display:grid;
  grid-template-columns: repeat(auto-fit, minmax(260px,1fr));
  gap:16px;
  margin-top:8px;
}

.card {
  background:var(--card);
  border-radius:12px;
  box-shadow: 0 6px 20px rgba(4,22,18,0.06);
  overflow:hidden;
  display:flex;
  flex-direction:column;
}
.card-media { height:150px; background:linear-gradient(180deg,#f6faf8,#eef6f0); display:flex; align-items:center; justify-content:center; }
.card-media img { max-height:140px; max-width:100%; object-fit:contain; }
.card-body { padding:12px 14px; display:flex; flex-direction:column; gap:8px; }
.card-body h3 { margin:0; font-size:1.05rem; color:var(--green-2); }
.meta { font-size:0.88rem; color:var(--muted); display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
.badge { background:#eef6f1; color:var(--green); padding:6px 10px; border-radius:999px; font-weight:700; font-size:0.82rem; }

.compare-panel {
  margin-top:20px;
  background:#fff;
  padding:14px;
  border-radius:12px;
  box-shadow:0 6px 20px rgba(4,22,18,0.04);
}
.compare-head { display:flex; align-items:center; justify-content:space-between; gap:12px; }
.compare-list { display:flex; gap:8px; flex-wrap:wrap; margin-top:10px; min-height:62px; align-items:center; }

.plot-area { margin-top:12px; display:grid; grid-template-columns:1fr 1fr; gap:12px; }
#plot,#radar { height:420px; background:#fff; border-radius:10px; padding:6px; }

.controls-footer { display:flex; gap:8px; margin-top:8px; align-items:center; }

.note { color:var(--muted); font-size:0.92rem; margin-top:12px; }

.empty { color:#6b7a73; font-style:italic; padding:18px; border:2px dashed #dbe7e0; border-radius:10px; background:#fbfefb; }

@media (max-width:900px){
  .plot-area { grid-template-columns:1fr; }
}
</style>

<div class="uog-catalog">
  <div class="header">
    <div class="h-title">UofG — Dry Bean Variety Catalogue</div>
    <div class="note">Browse varieties, compare inside a market class, run statistical tests, export results and download JSON.</div>
  </div>

  <div class="controls">
    <div class="left">
      <input id="search" class="input" placeholder="Search by variety or market class..." />
      <select id="classFilter" class="input"><option value="">All Market Classes</option></select>
      <select id="yearFilter" class="input"><option value="">All Years</option></select>
      <button id="clearFilters" class="btn small">Clear</button>
    </div>

    <div class="right">
      <button id="exportCsv" class="btn secondary small">Export CSV</button>
      <button id="downloadJson" class="btn small">Download JSON</button>
    </div>
  </div>

  <div class="compare-panel" aria-live="polite">
    <div class="compare-head">
      <div style="font-weight:700">Compare selection <small style="font-weight:400; color:#6b7a73; margin-left:8px;">check varieties to add</small></div>
      <div style="display:flex; gap:8px; align-items:center;">
        <select id="metricSelect" class="input small">
          <option value="direct_harvest_suitability">Direct harvest suitability</option>
          <option value="yield_lbs_per_acre">Yield (lbs/acre)</option>
          <option value="yield_kg_ha">Yield (kg/ha)</option>
          <option value="maturity_days">Maturity (days)</option>
          <option value="hundred_sd_weight_g">100 Sd Weight (g)</option>
        </select>
        <button id="btnPlot" class="btn small">Plot</button>
        <button id="btnBox" class="btn secondary small">Boxplot</button>
        <button id="btnStats" class="btn small">Run stats</button>
      </div>
    </div>

    <div id="compareList" class="compare-list"><div class="empty">No varieties selected — check cards to add.</div></div>

    <div class="controls-footer">
      <div class="note">Tip: click a card to view full profile and upload a photo.</div>
      <div style="flex:1"></div>
      <div id="statsSummary" style="font-size:0.95rem;color:var(--muted)"></div>
    </div>

    <div class="plot-area" aria-hidden="false">
      <div id="plot"></div>
      <div id="radar"></div>
    </div>
  </div>

  <div id="catalog" class="catalog-grid" aria-live="polite"></div>
</div>

<!-- Plotly -->
<script src="https://cdn.plot.ly/plotly-2.26.0.min.js"></script>

<script>
/* =============================
   HARD-CODED DATA (from your table)
   Keys used:
   name, market_class, year, cmv_r1, cmv_r15, anth_r17, anth_r23, anth_r73,
   common_blight, yield_lbs_per_acre, maturity_days, hundred_sd_weight_g,
   direct_harvest_suitability, opcc_data_year, yield_kg_ha, image
   ============================= */

const VARIETIES = [
  {"name":"OAC Thunder","market_class":"White Navy","year":1977,"cmv_r1":"R","cmv_r15":"R","anth_r17":"S","anth_r23":"S","anth_r73":"S","common_blight":"S","yield_lbs_per_acre":3015.50,"maturity_days":93.74,"hundred_sd_weight_g":22.72,"direct_harvest_suitability":2.65,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"Ex Rico 23","market_class":"White Navy","year":1980,"cmv_r1":"R","cmv_r15":"R","anth_r17":"R","anth_r23":"S","anth_r73":"N/A","common_blight":"N/A","yield_lbs_per_acre":2634.00,"maturity_days":99.00,"hundred_sd_weight_g":19.80,"direct_harvest_suitability":null,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Seaforth","market_class":"White Navy","year":1983,"cmv_r1":"R","cmv_r15":"R","anth_r17":"R","anth_r23":"R","anth_r73":"N/A","common_blight":"N/A","yield_lbs_per_acre":2027.00,"maturity_days":90.00,"hundred_sd_weight_g":20.10,"direct_harvest_suitability":null,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Rico","market_class":"White Navy","year":1983,"cmv_r1":"R","cmv_r15":"R","anth_r17":"R","anth_r23":"R","anth_r73":"N/A","common_blight":"N/A","yield_lbs_per_acre":2483.00,"maturity_days":100.00,"hundred_sd_weight_g":20.20,"direct_harvest_suitability":null,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Gryphon","market_class":"White Navy","year":1988,"cmv_r1":"R","cmv_r15":"R","anth_r17":"R","anth_r23":"R","anth_r73":"S","common_blight":"N/A","yield_lbs_per_acre":3254.00,"maturity_days":96.00,"hundred_sd_weight_g":20.40,"direct_harvest_suitability":4.00,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Cygnus","market_class":"White Navy","year":1988,"cmv_r1":"","cmv_r15":"","anth_r17":"","anth_r23":"","anth_r73":"","common_blight":"","yield_lbs_per_acre":null,"maturity_days":null,"hundred_sd_weight_g":null,"direct_harvest_suitability":null,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Sprint","market_class":"White Navy","year":1988,"cmv_r1":"","cmv_r15":"","anth_r17":"","anth_r23":"","anth_r73":"","common_blight":"","yield_lbs_per_acre":null,"maturity_days":null,"hundred_sd_weight_g":null,"direct_harvest_suitability":null,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Laser","market_class":"White Navy","year":1991,"cmv_r1":"","cmv_r15":"","anth_r17":"","anth_r23":"","anth_r73":"","common_blight":"","yield_lbs_per_acre":null,"maturity_days":null,"hundred_sd_weight_g":null,"direct_harvest_suitability":null,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Speedvale","market_class":"White Navy","year":1991,"cmv_r1":"","cmv_r15":"","anth_r17":"","anth_r23":"","anth_r73":"","common_blight":"","yield_lbs_per_acre":null,"maturity_days":null,"hundred_sd_weight_g":null,"direct_harvest_suitability":null,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Tomahawk","market_class":"Pinto","year":1993,"cmv_r1":"","cmv_r15":"","anth_r17":"","anth_r23":"","anth_r73":"","common_blight":"","yield_lbs_per_acre":null,"maturity_days":null,"hundred_sd_weight_g":null,"direct_harvest_suitability":null,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Silvercreek","market_class":"White Navy","year":1998,"cmv_r1":"R","cmv_r15":"R","anth_r17":"R","anth_r23":"R","anth_r73":"S","common_blight":"N/A","yield_lbs_per_acre":3172.50,"maturity_days":95.00,"hundred_sd_weight_g":21.43,"direct_harvest_suitability":3.75,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Rex","market_class":"White Navy","year":2002,"cmv_r1":"R","cmv_r15":"R","anth_r17":"S","anth_r23":"S","anth_r73":"S","common_blight":"R","yield_lbs_per_acre":3191.00,"maturity_days":98.33,"hundred_sd_weight_g":21.54,"direct_harvest_suitability":2.68,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Rex (alt)","market_class":"White Navy","year":2002,"cmv_r1":"R","cmv_r15":"R","anth_r17":"S","anth_r23":"S","anth_r73":"S","common_blight":"R","yield_lbs_per_acre":2712.22,"maturity_days":97.00,"hundred_sd_weight_g":21.00,"direct_harvest_suitability":null,"opcc_data_year":"1996-2004","yield_kg_ha":3040,"image":""},
  {"name":"OAC Redstar","market_class":"Dark Red Kidney","year":2008,"cmv_r1":"R","cmv_r15":"R","anth_r17":"R","anth_r23":"S","anth_r73":"N/A","common_blight":"N/A","yield_lbs_per_acre":2398.00,"maturity_days":97.00,"hundred_sd_weight_g":59.25,"direct_harvest_suitability":null,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Lyrik","market_class":"Light Red Kidney","year":2008,"cmv_r1":"R","cmv_r15":"R","anth_r17":"R","anth_r23":"S","anth_r73":"N/A","common_blight":"N/A","yield_lbs_per_acre":2304.17,"maturity_days":89.57,"hundred_sd_weight_g":66.83,"direct_harvest_suitability":null,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"Lightning","market_class":"White Navy","year":2008,"cmv_r1":"R","cmv_r15":"R","anth_r17":"S","anth_r23":"S","anth_r73":"S","common_blight":"S","yield_lbs_per_acre":2844.86,"maturity_days":93.86,"hundred_sd_weight_g":21.95,"direct_harvest_suitability":2.15,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Dublin","market_class":"White Navy","year":2009,"cmv_r1":"R","cmv_r15":"S","anth_r17":"S","anth_r23":"S","anth_r73":"S","common_blight":"S","yield_lbs_per_acre":2965.00,"maturity_days":96.75,"hundred_sd_weight_g":21.30,"direct_harvest_suitability":3.12,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Inferno","market_class":"Light Red Kidney","year":2011,"cmv_r1":"R","cmv_r15":"S","anth_r17":"R","anth_r23":"S","anth_r73":"R","common_blight":"N/A","yield_lbs_per_acre":2549.67,"maturity_days":99.83,"hundred_sd_weight_g":65.00,"direct_harvest_suitability":3.36,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"Dynasty","market_class":"Dark Red Kidney","year":2012,"cmv_r1":"R","cmv_r15":"S","anth_r17":"R","anth_r23":"S","anth_r73":"R","common_blight":"N/A","yield_lbs_per_acre":2398.64,"maturity_days":94.25,"hundred_sd_weight_g":64.64,"direct_harvest_suitability":2.90,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"Yeti","market_class":"White Kidney","year":2013,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"S","anth_r73":"R","common_blight":"N/A","yield_lbs_per_acre":2161.50,"maturity_days":95.50,"hundred_sd_weight_g":58.50,"direct_harvest_suitability":2.78,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"Mist","market_class":"White Navy","year":2013,"cmv_r1":"R","cmv_r15":"R","anth_r17":"S","anth_r23":"S","anth_r73":"S","common_blight":"R","yield_lbs_per_acre":3162.78,"maturity_days":97.22,"hundred_sd_weight_g":23.20,"direct_harvest_suitability":1.86,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"Bolt","market_class":"White Navy","year":2013,"cmv_r1":"R","cmv_r15":"R","anth_r17":"S","anth_r23":"S","anth_r73":"R","common_blight":"S","yield_lbs_per_acre":2777.00,"maturity_days":91.70,"hundred_sd_weight_g":24.49,"direct_harvest_suitability":1.68,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"Fathom","market_class":"White Navy","year":2014,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"R","yield_lbs_per_acre":2762.20,"maturity_days":97.40,"hundred_sd_weight_g":23.33,"direct_harvest_suitability":2.28,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Rosito","market_class":"Small Red","year":2017,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"S","yield_lbs_per_acre":3326.83,"maturity_days":96.17,"hundred_sd_weight_g":24.07,"direct_harvest_suitability":1.97,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Vortex","market_class":"Black","year":2019,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"R","yield_lbs_per_acre":3669.20,"maturity_days":97.00,"hundred_sd_weight_g":23.86,"direct_harvest_suitability":2.28,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Racer","market_class":"Cranberry","year":2019,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"N/A","common_blight":"N/A","yield_lbs_per_acre":2002.67,"maturity_days":85.67,"hundred_sd_weight_g":65.00,"direct_harvest_suitability":2.83,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Plasma","market_class":"White Navy","year":2019,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"R","yield_lbs_per_acre":3541.00,"maturity_days":94.00,"hundred_sd_weight_g":22.33,"direct_harvest_suitability":2.40,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Jewel","market_class":"Light Red Kidney","year":2019,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"N/A","yield_lbs_per_acre":2161.67,"maturity_days":93.33,"hundred_sd_weight_g":64.33,"direct_harvest_suitability":2.60,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Candycane","market_class":"Cranberry","year":2019,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"N/A","yield_lbs_per_acre":2348.00,"maturity_days":90.67,"hundred_sd_weight_g":67.33,"direct_harvest_suitability":2.27,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"Rogue","market_class":"White Navy","year":2020,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"R","yield_lbs_per_acre":3250.25,"maturity_days":97.00,"hundred_sd_weight_g":20.43,"direct_harvest_suitability":3.28,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Snowshoe","market_class":"White Kidney","year":2020,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"N/A","yield_lbs_per_acre":2357.00,"maturity_days":92.00,"hundred_sd_weight_g":62.67,"direct_harvest_suitability":2.90,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Navabi","market_class":"Cranberry","year":2020,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"N/A","yield_lbs_per_acre":2225.67,"maturity_days":83.25,"hundred_sd_weight_g":61.25,"direct_harvest_suitability":2.33,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Jasper","market_class":"Dark Red Kidney","year":2020,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"N/A","yield_lbs_per_acre":1859.50,"maturity_days":90.50,"hundred_sd_weight_g":64.00,"direct_harvest_suitability":2.70,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Firestripe","market_class":"Cranberry","year":2020,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"N/A","yield_lbs_per_acre":2212.50,"maturity_days":89.00,"hundred_sd_weight_g":68.50,"direct_harvest_suitability":2.20,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"Gallantry","market_class":"Dark Red Kidney","year":2020,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"N/A","yield_lbs_per_acre":2303.25,"maturity_days":88.25,"hundred_sd_weight_g":58.00,"direct_harvest_suitability":2.53,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Marker","market_class":"White Navy","year":2021,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"N/A","common_blight":"N/A","yield_lbs_per_acre":3384.00,"maturity_days":93.00,"hundred_sd_weight_g":21.70,"direct_harvest_suitability":2.20,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Iceberg","market_class":"White Kidney","year":2021,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"N/A","yield_lbs_per_acre":2160.00,"maturity_days":94.00,"hundred_sd_weight_g":56.00,"direct_harvest_suitability":2.90,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Fusion","market_class":"White Navy","year":2021,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"S","yield_lbs_per_acre":2962.00,"maturity_days":90.00,"hundred_sd_weight_g":20.00,"direct_harvest_suitability":1.90,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Firebrand","market_class":"Light Red Kidney","year":2021,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"N/A","yield_lbs_per_acre":2518.33,"maturity_days":91.00,"hundred_sd_weight_g":55.33,"direct_harvest_suitability":2.80,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Equinox","market_class":"White Navy","year":2021,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"N/A","yield_lbs_per_acre":3711.00,"maturity_days":97.00,"hundred_sd_weight_g":25.80,"direct_harvest_suitability":1.80,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Charm","market_class":"White Navy","year":2021,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"R","yield_lbs_per_acre":3271.00,"maturity_days":93.67,"hundred_sd_weight_g":23.00,"direct_harvest_suitability":2.05,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Award","market_class":"White Navy","year":2021,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"N/A","yield_lbs_per_acre":3703.00,"maturity_days":97.00,"hundred_sd_weight_g":23.10,"direct_harvest_suitability":2.40,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Seal","market_class":"White Navy","year":2022,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"N/A","common_blight":"N/A","yield_lbs_per_acre":2936.00,"maturity_days":98.00,"hundred_sd_weight_g":23.70,"direct_harvest_suitability":2.70,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Souper","market_class":"White Navy","year":2022,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"MR","yield_lbs_per_acre":3355.49,"maturity_days":102.60,"hundred_sd_weight_g":22.10,"direct_harvest_suitability":2.80,"opcc_data_year":"2020","yield_kg_ha":3761,"image":""},
  {"name":"Stavros","market_class":"Cranberry","year":2022,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"MR","yield_lbs_per_acre":2349.11,"maturity_days":85.1,"hundred_sd_weight_g":51.7,"direct_harvest_suitability":1.8,"opcc_data_year":"2020","yield_kg_ha":2633,"image":""},
  {"name":"OAC Sunrise","market_class":"Kintoki","year":2022,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"S","yield_lbs_per_acre":2618.99,"maturity_days":95.00,"hundred_sd_weight_g":60.60,"direct_harvest_suitability":3.40,"opcc_data_year":"2018+2019","yield_kg_ha":2935.5,"image":""},
  {"name":"OAC Blaze","market_class":"Non-darkening Pinto","year":2022,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"N/A","yield_lbs_per_acre":2383.63,"maturity_days":87.55,"hundred_sd_weight_g":39.38,"direct_harvest_suitability":2.60,"opcc_data_year":"2018+2020","yield_kg_ha":2671.695,"image":""},
  {"name":"XPT One","market_class":"Non-darkening Pinto","year":2022,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"N/A","yield_lbs_per_acre":2495.34,"maturity_days":88.07,"hundred_sd_weight_g":40.17,"direct_harvest_suitability":2.12,"opcc_data_year":"2018+2020","yield_kg_ha":2796.903333,"image":""},
  {"name":"OAC Paint","market_class":"Non-darkening Pinto","year":2022,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"S","yield_lbs_per_acre":2744.75,"maturity_days":97.08,"hundred_sd_weight_g":37.05,"direct_harvest_suitability":3.11,"opcc_data_year":"2018+2020","yield_kg_ha":3076.456667,"image":""},
  {"name":"Umbra","market_class":"Black","year":2023,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"S","yield_lbs_per_acre":3710.00,"maturity_days":98.00,"hundred_sd_weight_g":23.50,"direct_harvest_suitability":1.90,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"Steam","market_class":"White Navy","year":2023,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"S","yield_lbs_per_acre":3533.00,"maturity_days":97.00,"hundred_sd_weight_g":22.20,"direct_harvest_suitability":1.90,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Volterra","market_class":"Cranberry","year":2023,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"N/A","yield_lbs_per_acre":2754.00,"maturity_days":86.00,"hundred_sd_weight_g":66.00,"direct_harvest_suitability":2.00,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Resilient","market_class":"White Navy","year":2023,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"S","yield_lbs_per_acre":3469.00,"maturity_days":97.00,"hundred_sd_weight_g":18.90,"direct_harvest_suitability":2.00,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Bechamel","market_class":"White Navy","year":2023,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"R","yield_lbs_per_acre":3430.00,"maturity_days":97.00,"hundred_sd_weight_g":20.90,"direct_harvest_suitability":2.50,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Agate","market_class":"Cranberry","year":2023,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"N/A","yield_lbs_per_acre":2757.00,"maturity_days":85.00,"hundred_sd_weight_g":61.00,"direct_harvest_suitability":2.30,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"Blast","market_class":"White Navy","year":2023,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"S","yield_lbs_per_acre":3446.00,"maturity_days":95.00,"hundred_sd_weight_g":21.70,"direct_harvest_suitability":2.00,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"Bannock","market_class":"Black","year":2023,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"S","yield_lbs_per_acre":3785.00,"maturity_days":98.00,"hundred_sd_weight_g":23.50,"direct_harvest_suitability":1.60,"opcc_data_year":"","yield_kg_ha":null,"image":""},
  {"name":"OAC Tong","market_class":"Dark Red Kidney","year":2023,"cmv_r1":"R","cmv_r15":"S","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"S","yield_lbs_per_acre":1840.30,"maturity_days":89.40,"hundred_sd_weight_g":72.90,"direct_harvest_suitability":2.90,"opcc_data_year":"2022","yield_kg_ha":2062.7,"image":""},
  {"name":"Eternal","market_class":"Non-darkening Pinto","year":2023,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"S","yield_lbs_per_acre":1984.03,"maturity_days":89.90,"hundred_sd_weight_g":36.40,"direct_harvest_suitability":3.30,"opcc_data_year":"2021+2020","yield_kg_ha":2223.8,"image":""},
  {"name":"OAC Endeavour","market_class":"Dark Red Kidney","year":2023,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"S","yield_lbs_per_acre":1911.23,"maturity_days":92.00,"hundred_sd_weight_g":73.60,"direct_harvest_suitability":2.90,"opcc_data_year":"2022","yield_kg_ha":2142.2,"image":""},
  {"name":"OAC Märzen","market_class":"Light Red Kidney","year":2023,"cmv_r1":"R","cmv_r15":"S","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"S","yield_lbs_per_acre":1900.79,"maturity_days":92.00,"hundred_sd_weight_g":68.40,"direct_harvest_suitability":4.40,"opcc_data_year":"2022","yield_kg_ha":2130.5,"image":""},
  {"name":"OAC Toast","market_class":"Pinto","year":2023,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"MS","yield_lbs_per_acre":3742.96,"maturity_days":89.90,"hundred_sd_weight_g":42.00,"direct_harvest_suitability":3.1,"opcc_data_year":"2023","yield_kg_ha":4195.3,"image":""},
  {"name":"OAC Clever","market_class":"White Navy","year":2024,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"MR","yield_lbs_per_acre":3253.96,"maturity_days":91.10,"hundred_sd_weight_g":19.80,"direct_harvest_suitability":2.10,"opcc_data_year":"2023","yield_kg_ha":3647.2,"image":""},
  {"name":"OAC Storm","market_class":"White Navy","year":2024,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"MR","yield_lbs_per_acre":3005.75,"maturity_days":89.30,"hundred_sd_weight_g":19.50,"direct_harvest_suitability":1.80,"opcc_data_year":"2024","yield_kg_ha":3369,"image":""},
  {"name":"OAC Spades","market_class":"Black","year":2024,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"MR","yield_lbs_per_acre":3376.18,"maturity_days":92.30,"hundred_sd_weight_g":24.30,"direct_harvest_suitability":1.50,"opcc_data_year":"2024","yield_kg_ha":3784.2,"image":""},
  {"name":"OAC Rev","market_class":"Dark Red Kidney","year":2024,"cmv_r1":"R","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"S","yield_lbs_per_acre":2974.61,"maturity_days":98.10,"hundred_sd_weight_g":69.80,"direct_harvest_suitability":3.50,"opcc_data_year":"2023","yield_kg_ha":3334.1,"image":""},
  {"name":"Sundust","market_class":"Otebo","year":2025,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"N/A","yield_lbs_per_acre":1954.92,"maturity_days":95.25,"hundred_sd_weight_g":27.64,"direct_harvest_suitability":3.83,"opcc_data_year":"2023","yield_kg_ha":2191.18,"image":""},
  {"name":"Stardust","market_class":"Otebo","year":2025,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"N/A","yield_lbs_per_acre":2616.56,"maturity_days":101.75,"hundred_sd_weight_g":28.98,"direct_harvest_suitability":3.25,"opcc_data_year":"2023","yield_kg_ha":2932.77,"image":""},
  {"name":"OAC Glacier","market_class":"Otebo","year":2025,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"N/A","yield_lbs_per_acre":2335.84,"maturity_days":101.50,"hundred_sd_weight_g":27.03,"direct_harvest_suitability":2.63,"opcc_data_year":"2023","yield_kg_ha":2618.13,"image":""},
  {"name":"Yolk","market_class":"Yellow","year":2025,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"N/A","yield_lbs_per_acre":3276.46,"maturity_days":107.67,"hundred_sd_weight_g":61.46,"direct_harvest_suitability":3.79,"opcc_data_year":"2023","yield_kg_ha":3672.43,"image":""},
  {"name":"Yak","market_class":"Yellow","year":2025,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"N/A","yield_lbs_per_acre":2792.34,"maturity_days":102.42,"hundred_sd_weight_g":57.59,"direct_harvest_suitability":3.13,"opcc_data_year":"2023","yield_kg_ha":3129.8,"image":""},
  {"name":"Wake","market_class":"White Navy","year":2025,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"N/A","yield_lbs_per_acre":3088.81,"maturity_days":88.50,"hundred_sd_weight_g":22.30,"direct_harvest_suitability":2.80,"opcc_data_year":"2024","yield_kg_ha":3462.1,"image":""},
  {"name":"OAC Copperhead","market_class":"Light Red Kidney","year":2025,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"N/A","yield_lbs_per_acre":2359.99,"maturity_days":89.60,"hundred_sd_weight_g":49.40,"direct_harvest_suitability":4.10,"opcc_data_year":"2024","yield_kg_ha":2645.2,"image":""}
];

/* =============
   state
   ============= */
let varieties = VARIETIES.map(v => ({ ...v, slug: slugify(v.name) }));
let compareSelection = new Set();

/* =============
   helpers
   ============= */
function slugify(s){ return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }
function fmt(n, digits=2){ return (n===null||n===undefined||isNaN(n))? '—' : Number(n).toFixed(digits); }

/* =============
   localStorage helpers for images
   ============= */
function getImageForVariety(v){
  // user image in localStorage
  const b64 = localStorage.getItem('uog_img_'+v.slug);
  if(b64) return b64;
  if(v.image && v.image.trim()) return v.image;
  return 'https://via.placeholder.com/640x360?text=No+photo';
}

/* =============
   DOM refs
   ============= */
const catalogEl = document.getElementById('catalog');
const searchEl = document.getElementById('search');
const classFilterEl = document.getElementById('classFilter');
const yearFilterEl = document.getElementById('yearFilter');
const clearBtn = document.getElementById('clearFilters');
const compareListEl = document.getElementById('compareList');
const metricSelect = document.getElementById('metricSelect');
const plotEl = document.getElementById('plot');
const radarEl = document.getElementById('radar');
const btnPlot = document.getElementById('btnPlot');
const btnBox = document.getElementById('btnBox');
const btnStats = document.getElementById('btnStats');
const exportCsvBtn = document.getElementById('exportCsv');
const downloadJsonBtn = document.getElementById('downloadJson');
const statsSummaryEl = document.getElementById('statsSummary');

/* =============
   populate filters
   ============= */
function populateFilters(){
  const classes = Array.from(new Set(varieties.map(v=>v.market_class).filter(Boolean))).sort();
  classFilterEl.innerHTML = `<option value="">All Market Classes</option>` + classes.map(c=>`<option value="${c}">${c}</option>`).join('');
  const years = Array.from(new Set(varieties.map(v=>v.year).filter(Boolean))).sort((a,b)=>b-a);
  yearFilterEl.innerHTML = `<option value="">All Years</option>` + years.map(y=>`<option value="${y}">${y}</option>`).join('');
}
populateFilters();

/* =============
   render catalog
   ============= */
function renderCatalog(){
  const q = (searchEl.value||'').toLowerCase();
  const cls = classFilterEl.value;
  const yr = yearFilterEl.value;
  catalogEl.innerHTML = '';

  const filtered = varieties.filter(v=>{
    if(cls && v.market_class !== cls) return false;
    if(yr && String(v.year) !== String(yr)) return false;
    if(q && !(v.name.toLowerCase().includes(q) || (v.market_class||'').toLowerCase().includes(q))) return false;
    return true;
  });

  if(filtered.length === 0){
    catalogEl.innerHTML = `<div class="empty">No varieties match filters.</div>`;
    return;
  }

  filtered.forEach(v=>{
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-media" role="img" aria-label="${v.name}">
        <img src="${getImageForVariety(v)}" alt="${v.name} photo" onerror="this.src='https://via.placeholder.com/640x360?text=No+photo'"/>
      </div>
      <div class="card-body">
        <h3>${v.name}</h3>
        <div class="meta">
          <span class="badge">${v.market_class||'—'}</span>
          <span>Year: ${v.year || '—'}</span>
          <span>Maturity: ${fmt(v.maturity_days,1)} d</span>
          <span>Yield: ${v.yield_lbs_per_acre ? fmt(v.yield_lbs_per_acre,0) + ' lb/ac' : '—'}</span>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
          <label style="font-size:0.9rem"><input type="checkbox" data-slug="${v.slug}" class="compareCheckbox" ${compareSelection.has(v.slug)?'checked':''}/> Compare</label>
          <div style="display:flex; gap:8px;">
            <button class="btn small" data-slug="${v.slug}" onclick="openModal('${v.slug}')">View / Photo</button>
            <button class="btn secondary small" onclick="downloadVarietyJSON('${v.slug}')">JSON</button>
          </div>
        </div>
      </div>
    `;
    catalogEl.appendChild(card);
  });

  // attach listeners to checkboxes
  document.querySelectorAll('.compareCheckbox').forEach(cb=>{
    cb.onchange = (e)=>{
      const slug = e.target.dataset.slug;
      if(e.target.checked) compareSelection.add(slug);
      else compareSelection.delete(slug);
      renderCompareList();
    }
  });
}
renderCatalog();

/* =============
   compare list UI
   ============= */
function renderCompareList(){
  compareListEl.innerHTML = '';
  if(compareSelection.size === 0){
    compareListEl.innerHTML = '<div class="empty">No varieties selected — check cards to add.</div>';
    statsSummaryEl.textContent = '';
    Plotly.purge(plotEl);
    Plotly.purge(radarEl);
    return;
  }
  Array.from(compareSelection).forEach(slug=>{
    const v = varieties.find(x=>x.slug===slug);
    if(!v) return;
    const el = document.createElement('div');
    el.style.padding='8px 10px';
    el.style.border='1px solid #e6efe9';
    el.style.borderRadius='8px';
    el.style.background='#fff';
    el.innerHTML = `<strong>${v.name}</strong><div style="font-size:0.85rem;color:var(--muted)">${v.market_class||''} • ${v.year||''}</div>
      <div style="margin-top:6px"><button class="btn small" data-slug="${slug}" onclick="removeFromCompare('${slug}')">Remove</button></div>`;
    compareListEl.appendChild(el);
  });
}

/* remove */
function removeFromCompare(slug){
  compareSelection.delete(slug);
  document.querySelectorAll(`input.compareCheckbox[data-slug="${slug}"]`).forEach(i=>i.checked=false);
  renderCompareList();
}

/* =============
   Plotting functions
   ============= */
function getSelectedVarieties(){
  return Array.from(compareSelection).map(s => varieties.find(v=>v.slug===s)).filter(Boolean);
}

function numericValue(v, key){
  const val = v[key];
  if(val === null || val === undefined || val === '' || isNaN(Number(val))) return null;
  return Number(val);
}

function plotScatter(){
  const metric = metricSelect.value;
  const sel = getSelectedVarieties();
  if(sel.length === 0){ alert('Select at least one variety to plot.'); return; }

  const traces = sel.map(v=>{
    const x = numericValue(v, metric);
    return {
      x: [x],
      y: [v.name],
      mode: 'markers+text',
      marker:{size:16},
      text: [v.name],
      orientation: 'h',
      name: v.name,
      hovertemplate:`<b>${v.name}</b><br>${labelForMetric(metric)}: %{x}<extra></extra>`
    };
  });
  const layout = {
    title: labelForMetric(metric) + ' — selected varieties',
    margin:{l:180,t:40,r:20,b:40},
    xaxis:{title: labelForMetric(metric)}
  };
  Plotly.newPlot(plotEl, traces, layout, {responsive:true});
}

function plotBox(){
  const metric = metricSelect.value;
  const sel = getSelectedVarieties();
  if(sel.length === 0){ alert('Select at least one variety to plot.'); return; }
  const groups = sel.map(v => numericValue(v, metric)).filter(v => v !== null);
  if(groups.length === 0){ alert('No numeric data for selected metric.'); return; }
  // Build a single box chart grouping by variety
  const traces = sel.map(v=>{
    const val = numericValue(v, metric);
    return {
      y: [val],
      type: 'box',
      name: v.name,
      boxpoints: 'all'
    };
  });
  const layout = { title: 'Boxplot — '+labelForMetric(metric), margin:{t:40} };
  Plotly.newPlot(plotEl, traces, layout, {responsive:true});
}

/* radar: normalized */
function plotRadar(){
  const sel = getSelectedVarieties();
  if(sel.length === 0){ Plotly.purge(radarEl); return; }
  const metrics = ['yield_lbs_per_acre','maturity_days','hundred_sd_weight_g','direct_harvest_suitability'];
  // compute min/max across selected for normalization
  const arrays = metrics.map(m=>sel.map(v=>numericValue(v,m) || 0));
  const mins = arrays.map(arr=>Math.min(...arr));
  const maxs = arrays.map(arr=>Math.max(...arr));
  const traces = sel.map(v=>{
    const r = metrics.map((m,i)=>{
      const val = numericValue(v,m);
      if(val===null) return 0;
      return (maxs[i] === mins[i]) ? 0.5 : (val - mins[i]) / (maxs[i] - mins[i]);
    });
    return { type:'scatterpolar', r: r.concat([r[0]]), theta: metrics.map(labelForMetric).concat([labelForMetric(metrics[0])]), fill:'toself', name: v.name };
  });
  const layout = { polar:{ radialaxis:{ visible:true, range:[0,1]} }, title:'Profile (normalized)' };
  Plotly.newPlot(radarEl, traces, layout, {responsive:true});
}

function labelForMetric(k){
  const map = {
    'yield_lbs_per_acre':'Yield (lbs/acre)',
    'yield_kg_ha':'Yield (kg/ha)',
    'maturity_days':'Maturity (days)',
    'hundred_sd_weight_g':'100 Sd Weight (g)',
    'direct_harvest_suitability':'Direct Harvest Suitability'
  };
  return map[k] || k;
}

/* =============
   STATISTICS: permutation ANOVA-like test
   - works for 2+ groups
   - returns observed F and p-value (permutation)
   ============= */
function computeGroupStats(metric){
  const sel = getSelectedVarieties();
  if(sel.length < 2) { alert('Select at least two varieties for stats.'); return null; }
  const groups = sel.map(v => {
    const val = numericValue(v, metric);
    return {name:v.name, value: val};
  }).filter(g=> g.value !== null);

  if(groups.length < 2) { alert('Selected varieties do not have numeric values for this metric.'); return null; }

  // For each variety treat single value as group numeric. For small-sample, permutation test instead of parametric.
  // Build arrays
  const values = groups.map(g=>g.value);
  const labels = groups.map(g=>g.name);
  // compute between-group variance (since each group has n=1, F is not meaningful in theory; we do pairwise permutations / difference-of-means)
  // We'll implement permutation test on range of means: observed stat = variance of group means
  const observedMeans = values; // one value per group
  const overallMean = observedMeans.reduce((a,b)=>a+b,0)/observedMeans.length;
  const ssBetween = observedMeans.reduce((s,m)=> s + Math.pow(m - overallMean,2), 0) / observedMeans.length;

  // permutation test: shuffle values across 'groups' many times to build null distribution
  const permutations = 3000;
  let moreExtreme = 0;
  for(let i=0;i<permutations;i++){
    // shuffle values
    const shuffled = shuffleArray(values.slice());
    const shMean = shuffled.reduce((a,b)=>a+b,0)/shuffled.length;
    const ssSh = shuffled.reduce((s,m)=> s + Math.pow(m - shMean,2), 0) / shuffled.length;
    if(ssSh >= ssBetween) moreExtreme++;
  }
  const p = (moreExtreme+1)/(permutations+1);

  // Return summary table: means, min, max
  const summary = groups.map(g => ({name:g.name, value:g.value}));
  return { metric: metric, obsStat: ssBetween, pValue: p, summary: summary };
}

function shuffleArray(a){
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()* (i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* =============
   export / download
   ============= */
function exportSelectedCSV(){
  const sel = getSelectedVarieties();
  if(sel.length===0){ alert('Select varieties to export'); return; }
  const keys = ['name','market_class','year','yield_lbs_per_acre','yield_kg_ha','maturity_days','hundred_sd_weight_g','direct_harvest_suitability'];
  const rows = sel.map(r => keys.map(k=> JSON.stringify(r[k]!==undefined && r[k]!==null ? r[k] : '') ).join(','));
  const csv = [ keys.join(','), ...rows ].join('\n');
  const blob = new Blob([csv], {type:'text/csv'}); const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download='varieties-export.csv'; document.body.append(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

function downloadSelectedJSON(){
  const sel = getSelectedVarieties();
  if(sel.length===0){ alert('Select varieties to download'); return; }
  const blob = new Blob([JSON.stringify(sel, null, 2)], {type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download='varieties.json'; document.body.append(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

function downloadVarietyJSON(slug){
  const v = varieties.find(x=>x.slug===slug);
  if(!v) return;
  const blob = new Blob([JSON.stringify(v,null,2)], {type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download=(v.slug||'variety')+'.json'; document.body.append(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

/* =============
   Modal: view & upload photo
   ============= */
function openModal(slug){
  const v = varieties.find(x=>x.slug===slug);
  if(!v) return;
  // create simple modal
  const modal = document.createElement('div');
  modal.style.position='fixed'; modal.style.inset='0'; modal.style.background='rgba(6,8,10,0.5)';
  modal.style.display='flex'; modal.style.alignItems='center'; modal.style.justifyContent='center'; modal.style.zIndex=9999;
  const inner = document.createElement('div'); inner.style.background='#fff'; inner.style.padding='18px'; inner.style.borderRadius='10px'; inner.style.maxWidth='900px'; inner.style.width='94%'; inner.style.maxHeight='86vh'; inner.style.overflow='auto';
  inner.innerHTML = `
    <div style="display:flex; gap:14px; align-items:flex-start; flex-wrap:wrap;">
      <div style="flex:0 0 320px;">
        <img id="modalImg" src="${getImageForVariety(v)}" alt="${v.name}" style="width:100%; border-radius:8px; border:1px solid #eee"/>
        <div style="margin-top:10px; display:flex; gap:8px;">
          <label class="btn small" style="cursor:pointer;">Upload photo <input id="fileInput" type="file" accept="image/*" style="display:none"/></label>
          <button class="btn secondary small" id="clearImage">Clear</button>
        </div>
      </div>
      <div style="flex:1; min-width:260px;">
        <h2 style="margin-top:0">${v.name}</h2>
        <p><strong>Market class:</strong> ${v.market_class || '—'}</p>
        <p><strong>Year:</strong> ${v.year || '—'}</p>
        <p><strong>Yield (lbs/acre):</strong> ${v.yield_lbs_per_acre ? fmt(v.yield_lbs_per_acre,1) : '—'}</p>
        <p><strong>Maturity (days):</strong> ${v.maturity_days ? fmt(v.maturity_days,1) : '—'}</p>
        <div style="margin-top:12px; display:flex; gap:8px;">
          <button class="btn" id="saveClose">Close</button>
        </div>
      </div>
    </div>
  `;
  modal.appendChild(inner);
  document.body.appendChild(modal);

  const fileInput = inner.querySelector('#fileInput');
  fileInput.onchange = (e)=>{
    const f = e.target.files[0]; if(!f) return;
    const reader = new FileReader();
    reader.onload = (ev)=>{
      const b64 = ev.target.result;
      localStorage.setItem('uog_img_'+v.slug, b64);
      inner.querySelector('#modalImg').src = b64;
      renderCatalog();
    };
    reader.readAsDataURL(f);
  };
  inner.querySelector('#clearImage').onclick = ()=>{
    localStorage.removeItem('uog_img_'+v.slug);
    inner.querySelector('#modalImg').src = getImageForVariety(v);
    renderCatalog();
  };
  inner.querySelector('#saveClose').onclick = ()=> { document.body.removeChild(modal); };
  modal.onclick = (e)=>{ if(e.target===modal) document.body.removeChild(modal); };
}

/* =============
   wire up controls
   ============= */
searchEl.oninput = renderCatalog;
classFilterEl.onchange = renderCatalog;

// add year filter to DOM dynamically (years element created earlier)
(function addYearFilter(){
  const yr = document.createElement('select'); yr.id='yearFilter'; yr.className='input';
  document.querySelector('.controls .left').insertBefore(yr, document.querySelector('.controls .left').children[3]);
  // populate
  const years = Array.from(new Set(varieties.map(v=>v.year).filter(Boolean))).sort((a,b)=>b-a);
  yr.innerHTML = `<option value="">All Years</option>` + years.map(y=>`<option value="${y}">${y}</option>`).join('');
  yr.onchange = renderCatalog;
})();

clearBtn.onclick = ()=>{
  searchEl.value=''; classFilterEl.value=''; document.getElementById('yearFilter').value=''; renderCatalog();
};

btnPlot.onclick = ()=>{
  plotScatter(); plotRadar();
};
btnBox.onclick = ()=>{ plotBox(); };
btnStats.onclick = ()=>{
  const metric = metricSelect.value;
  const res = computeGroupStats(metric);
  if(res){
    statsSummaryEl.textContent = `obsStat=${res.obsStat.toFixed(3)}, permutation p≈${res.pValue.toFixed(4)} (metric: ${labelForMetric(metric)})`;
  }
};

exportCsvBtn.onclick = exportSelectedCSV;
downloadJsonBtn.onclick = downloadSelectedJSON;

/* initial render of compare list and catalog */
renderCompareList();
renderCatalog();

</script>
