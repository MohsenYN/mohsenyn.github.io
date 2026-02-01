---
layout: default
title: Bean Variety Catalog
permalink: /seed-catalog/
---

<!--
  University of Guelph Bean Variety Catalog
  - Paste this file into your Jekyll repo as seed-catalog.md
  - Uses Plotly (CDN) for interactive charts
  - Images can be added to assets/images/varieties/<slug>.jpg and the `image` field updated
-->

<style>
/* --- Layout --- */
.uog-catalog {
  max-width: 1180px;
  margin: 24px auto;
  padding: 12px;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  color: #122;
}

.header {
  display:flex;
  gap:16px;
  align-items:center;
  justify-content:space-between;
  margin-bottom:12px;
}
.header h1 { margin:0; font-size:1.4rem; color:#0b4b2f; }
.controls { display:flex; gap:8px; flex-wrap:wrap; align-items:center; }

/* Filters / Search */
.filters { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
.filters input, .filters select {
  padding:8px 10px;
  border-radius:6px;
  border:1px solid #d0d7da;
  min-width:160px;
}
.btn {
  padding:8px 12px;
  border-radius:6px;
  border: none;
  background:#0b4b2f;
  color:white;
  cursor:pointer;
}
.btn.secondary { background:#2f6b54; }
.small { padding:6px 8px; font-size:0.9rem; }

/* Catalog grid */
.catalog-grid {
  display:grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap:16px;
  margin-top:18px;
}
.card {
  background:white;
  border-radius:10px;
  box-shadow:0 6px 18px rgba(12,18,20,0.06);
  overflow:clip;
  display:flex;
  flex-direction:column;
  min-height:160px;
}
.card .card-media {
  height:140px;
  background:#f3f5f6;
  display:flex;
  align-items:center;
  justify-content:center;
  position:relative;
}
.card .card-media img { max-height:128px; max-width:100%; object-fit:contain; }
.card .card-body { padding:10px 12px; flex:1; }
.card h3 { margin:0 0 6px 0; font-size:1.05rem; color:#083a2a; }
.meta { font-size:0.9rem; color:#405057; display:flex; gap:8px; flex-wrap:wrap; }
.badge { background:#eef6f1; color:#0b4b2f; padding:4px 8px; border-radius:999px; font-weight:600; font-size:0.8rem; }

/* Compare panel */
.compare-panel {
  background:#fbfffc;
  border:1px solid #e5efe9;
  padding:12px;
  border-radius:8px;
  margin-top:18px;
}
.compare-list { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:10px; }

/* Modal */
.modal {
  display:none;
  position:fixed;
  inset:0;
  background:rgba(6,8,10,0.5);
  align-items:center;
  justify-content:center;
  z-index:9999;
}
.modal .modal-inner {
  background:white;
  max-width:900px;
  width:94%;
  max-height:86vh;
  overflow:auto;
  border-radius:10px;
  padding:14px;
}
.modal .close { float:right; cursor:pointer; font-weight:700; color:#666; }

/* Responsive */
@media (max-width:640px){
  .filters { flex-direction:column; align-items:stretch; }
  .controls { flex-direction:column; align-items:stretch; }
}
</style>

<div class="uog-catalog">
  <div class="header">
    <div>
      <h1>UofG — Dry Bean Variety Catalog</h1>
      <div style="font-size:0.95rem; color:#556">Search, filter, edit and compare varieties from the UofG breeding program.</div>
    </div>

    <div class="controls">
      <div class="filters" aria-hidden="false">
        <input id="search" placeholder="Search by variety name..." />
        <select id="classFilter"><option value="">All Market Classes</option></select>
        <select id="yearFilter"><option value="">All Release Years</option></select>
        <select id="maturityFilter"><option value="">Any maturity</option>
          <option value="--">--</option>
        </select>
        <button class="btn small" id="clearFilters">Clear</button>
      </div>
    </div>
  </div>

  <div style="display:flex; gap:12px; align-items:center; margin-bottom:8px;">
    <div style="flex:1">
      <label style="font-size:0.92rem; color:#445; display:block; margin-bottom:4px">Compare selection</label>
      <div class="compare-panel">
        <div style="display:flex; gap:8px; align-items:center; margin-bottom:8px;">
          <button id="plotCompareBtn" class="btn small">Plot comparison</button>
          <select id="xAxis" style="min-width:160px; padding:6px 8px;"></select>
          <select id="yAxis" style="min-width:160px; padding:6px 8px;"></select>
          <button id="exportCsv" class="btn secondary small">Export CSV</button>
        </div>
        <div class="compare-list" id="compareList" aria-live="polite"></div>
        <div id="plotArea" style="height:420px;"></div>
      </div>
    </div>
  </div>

  <div id="catalog" class="catalog-grid" aria-live="polite"></div>

  <div style="margin-top:14px; font-size:0.9rem; color:#667">
    Tip: click a card to view full profile and upload a photo. Use the checkboxes to add items to the comparison.
  </div>
</div>

<!-- Modal for details / edit -->
<div id="modal" class="modal" role="dialog" aria-modal="true">
  <div class="modal-inner" role="document">
    <span class="close" id="closeModal">&times;</span>
    <div id="modalContent"></div>
  </div>
</div>

<!-- Plotly CDN -->
<script src="https://cdn.plot.ly/plotly-2.26.0.min.js"></script>

<script>
/* -------------------------
   DATA: converted from user table
   Fields:
     name, market_class, year, cmv_r1, cmv_r15, anth_r17, anth_r23, anth_r73,
     common_blight, yield_lbs_per_acre, maturity_days, hundred_sd_weight_g,
     direct_harvest_suitability, opcc_data_year, yield_kg_ha, image (optional)
--------------------------*/
const rawVarieties = [
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

/* --- Utilities: create slugs --- */
function slugify(s){ return String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }

/* Merge with stored edits/images in localStorage */
const LS_KEY = 'uog_varieties_v1';
function loadState(){
  const stored = localStorage.getItem(LS_KEY);
  if(!stored) return rawVarieties.map(v => ({...v, slug:slugify(v.name)}));
  try{
    const parsed = JSON.parse(stored);
    // merge: keep original properties where missing
    const merged = rawVarieties.map(orig=>{
      const s = slugify(orig.name);
      const found = parsed.find(p => p.slug === s);
      return {...orig, slug:s, ...(found||{})};
    });
    // also include any new custom entries in parsed
    parsed.forEach(p=>{
      if(!merged.some(m=>m.slug===p.slug)) merged.push(p);
    });
    return merged;
  }catch(e){
    console.error('localStorage parse error',e);
    return rawVarieties.map(v => ({...v, slug:slugify(v.name)}));
  }
}
let varieties = loadState();

/* Save edits back to localStorage */
function saveState(){
  localStorage.setItem(LS_KEY, JSON.stringify(varieties));
}

/* DOM refs */
const catalogEl = document.getElementById('catalog');
const searchEl = document.getElementById('search');
const classFilterEl = document.getElementById('classFilter');
const yearFilterEl = document.getElementById('yearFilter');
const maturityFilterEl = document.getElementById('maturityFilter');
const clearBtn = document.getElementById('clearFilters');
const compareListEl = document.getElementById('compareList');
const plotArea = document.getElementById('plotArea');
const plotBtn = document.getElementById('plotCompareBtn');
const xAxisEl = document.getElementById('xAxis');
const yAxisEl = document.getElementById('yAxis');
const exportCsvBtn = document.getElementById('exportCsv');

/* Fill filter options */
function populateFilters(){
  const classes = Array.from(new Set(varieties.map(v=>v.market_class).filter(Boolean))).sort();
  classFilterEl.innerHTML = '<option value="">All Market Classes</option>' + classes.map(c=>`<option value="${c}">${c}</option>`).join('');
  const years = Array.from(new Set(varieties.map(v=>v.year).filter(Boolean))).sort((a,b)=>b-a);
  yearFilterEl.innerHTML = '<option value="">All Release Years</option>' + years.map(y=>`<option value="${y}">${y}</option>`).join('');
  maturityFilterEl.innerHTML = '<option value="">Any maturity</option><option value="--">--</option>';
}
populateFilters();

/* Numeric fields available for plotting */
const numericFields = [
  {key:'yield_lbs_per_acre', label:'Yield (lbs/acre)'},
  {key:'yield_kg_ha', label:'Yield (kg/ha)'},
  {key:'maturity_days', label:'Maturity (days)'},
  {key:'hundred_sd_weight_g', label:'100 Sd Weight (g)'},
  {key:'direct_harvest_suitability', label:'Direct Harvest Suitability'}
];
function populatePlotAxes(){
  xAxisEl.innerHTML = numericFields.map(n=>`<option value="${n.key}">${n.label}</option>`).join('');
  yAxisEl.innerHTML = numericFields.map(n=>`<option value="${n.key}">${n.label}</option>`).join('');
  xAxisEl.value = 'maturity_days'; yAxisEl.value = 'yield_lbs_per_acre';
}
populatePlotAxes();

/* Render card list */
let compareSelection = new Set();

function renderCatalog(){
  const q = (searchEl.value||'').toLowerCase();
  const classF = classFilterEl.value;
  const yearF = yearFilterEl.value;

  catalogEl.innerHTML = '';
  const filtered = varieties.filter(v=>{
    if(classF && v.market_class!==classF) return false;
    if(yearF && String(v.year)!==String(yearF)) return false;
    if(q && !(v.name.toLowerCase().includes(q) || (v.market_class||'').toLowerCase().includes(q))) return false;
    return true;
  });

  filtered.forEach(v=>{
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-media" aria-hidden="true">
        <img src="${getImageForVariety(v)}" alt="${v.name} photo" onerror="this.src='https://via.placeholder.com/400x200?text=No+photo'"/>
      </div>
      <div class="card-body">
        <h3>${v.name}</h3>
        <div class="meta">
          <span class="badge">${v.market_class||'—'}</span>
          <span>Year: ${v.year||'—'}</span>
          <span>Maturity: ${v.maturity_days||'—'} d</span>
          <span>Yield: ${v.yield_lbs_per_acre||'—'}</span>
        </div>
        <div style="margin-top:8px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <label style="font-size:0.85rem"><input type="checkbox" data-slug="${v.slug}" class="compareCheckbox" ${compareSelection.has(v.slug)?'checked':''}/> Compare</label>
          </div>
          <div>
            <button class="btn small" data-slug="${v.slug}" onclick="openModal(event)">View / Edit</button>
          </div>
        </div>
      </div>
    `;
    catalogEl.appendChild(card);
  });

  // attach checkbox listeners
  document.querySelectorAll('.compareCheckbox').forEach(cb=>{
    cb.onchange = function(e){
      const slug = e.target.dataset.slug;
      if(e.target.checked) compareSelection.add(slug);
      else compareSelection.delete(slug);
      renderCompareList();
    }
  });
}
renderCatalog();

/* Image handling: images stored either in data.image or in localStorage base64 */
function getImageForVariety(v){
  // priority: v.image (absolute or relative), then LS stored base64, else placeholder
  if(v.image && v.image.trim()!=='') return v.image;
  const base64 = localStorage.getItem('img_' + v.slug);
  if(base64) return base64;
  return 'https://via.placeholder.com/400x200?text=Upload+photo';
}

/* Compare list UI */
function renderCompareList(){
  compareListEl.innerHTML = '';
  Array.from(compareSelection).forEach(slug=>{
    const v = varieties.find(x=>x.slug===slug);
    if(!v) return;
    const el = document.createElement('div');
    el.style.padding = '6px 8px';
    el.style.border = '1px solid #e7eee7';
    el.style.borderRadius = '8px';
    el.style.background = '#fff';
    el.innerHTML = `<strong>${v.name}</strong> <span style="display:block; font-size:0.86rem; color:#556">${v.market_class||''} • ${v.year||''}</span>
      <div style="margin-top:6px"><button class="btn small" data-slug="${v.slug}" onclick="removeFromCompare(event)">Remove</button></div>`;
    compareListEl.appendChild(el);
  });
}
function removeFromCompare(e){
  const slug = e.target.dataset.slug;
  compareSelection.delete(slug);
  document.querySelectorAll(`input.compareCheckbox[data-slug="${slug}"]`).forEach(i=>i.checked = false);
  renderCompareList();
}

/* Plot: scatter of selected varieties */
function plotCompare(){
  const selected = Array.from(compareSelection).map(s => varieties.find(v=>v.slug===s)).filter(Boolean);
  if(selected.length===0){ alert('Select at least one variety to compare.'); return; }

  const xKey = xAxisEl.value, yKey = yAxisEl.value;
  const traces = selected.map(v=>{
    const x = Number(v[xKey]); const y = Number(v[yKey]);
    return {
      x:[isNaN(x)?null:x],
      y:[isNaN(y)?null:y],
      mode:'markers+text',
      text:[v.name],
      textposition:'top center',
      marker:{size:14},
      name: v.name,
      hovertemplate: `<b>${v.name}</b><br>${numericLabel(xKey)}: %{x}<br>${numericLabel(yKey)}: %{y}<extra></extra>`
    };
  });

  const layout = {
    title: `${numericLabel(yKey)} vs ${numericLabel(xKey)}`,
    xaxis:{title:numericLabel(xKey)},
    yaxis:{title:numericLabel(yKey)},
    margin:{t:40,l:60,r:20,b:60},
    hovermode:'closest'
  };
  Plotly.newPlot(plotArea, traces, layout, {responsive:true});
}

/* Helper to humanize numeric label */
function numericLabel(k){
  const f = numericFields.find(n=>n.key===k);
  return f ? f.label : k;
}

/* Modal: show profile & edit */
window.openModal = function(ev){
  // if called from button onclick, event target contains data-slug
  const slug = ev.target?.dataset?.slug || ev.dataset?.slug;
  if(!slug) return;
  const v = varieties.find(x=>x.slug===slug);
  const modal = document.getElementById('modal');
  const content = document.getElementById('modalContent');

  const imgSrc = getImageForVariety(v);
  content.innerHTML = `
    <h2>${v.name}</h2>
    <div style="display:flex; gap:12px; flex-wrap:wrap;">
      <div style="flex:0 0 260px;">
        <img id="modalImage" src="${imgSrc}" alt="${v.name} photo" style="width:100%; height:auto; border-radius:6px; border:1px solid #eee"/>
        <div style="margin-top:8px;">
          <label class="btn small" style="display:inline-block; cursor:pointer;">
            Upload photo <input id="fileInput" type="file" accept="image/*" style="display:none"/>
          </label>
          <button class="btn secondary small" id="clearImage">Clear</button>
        </div>
      </div>

      <div style="flex:1; min-width:260px;">
        <form id="editForm">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
            <label>Variety name<input name="name" value="${escapeHtml(v.name)}"/></label>
            <label>Market class<input name="market_class" value="${escapeHtml(v.market_class||'')}" /></label>
            <label>Year<input name="year" value="${v.year||''}" /></label>
            <label>Yield (lbs/acre)<input name="yield_lbs_per_acre" value="${v.yield_lbs_per_acre||''}" /></label>
            <label>Maturity (days)<input name="maturity_days" value="${v.maturity_days||''}" /></label>
            <label>100 Sd Wt (g)<input name="hundred_sd_weight_g" value="${v.hundred_sd_weight_g||''}" /></label>
            <label>Direct harvest suitability<input name="direct_harvest_suitability" value="${v.direct_harvest_suitability||''}" /></label>
            <label>OPCC data year<input name="opcc_data_year" value="${v.opcc_data_year||''}" /></label>
            <label>Yield (kg/ha)<input name="yield_kg_ha" value="${v.yield_kg_ha||''}" /></label>
          </div>

          <div style="margin-top:10px;">
            <label>Common mosaic virus R1 <input name="cmv_r1" value="${v.cmv_r1||''}" /></label>
            <label>Common mosaic virus R15 <input name="cmv_r15" value="${v.cmv_r15||''}" /></label>
            <label>Anthracnose R17 <input name="anth_r17" value="${v.anth_r17||''}" /></label>
            <label>Anthracnose R23 <input name="anth_r23" value="${v.anth_r23||''}" /></label>
            <label>Anthracnose R73 <input name="anth_r73" value="${v.anth_r73||''}" /></label>
            <label>Common Blight <input name="common_blight" value="${v.common_blight||''}" /></label>
            <label style="display:block; margin-top:6px;">Direct field description / notes<br/>
              <textarea name="notes" style="width:100%; min-height:90px;">${escapeHtml(v.notes||'')}</textarea>
            </label>
          </div>

          <div style="margin-top:10px; display:flex; gap:8px;">
            <button class="btn" id="saveBtn">Save</button>
            <button class="btn secondary" id="cancelBtn">Cancel</button>
            <button class="btn secondary" id="downloadJson">Download JSON</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // file upload handler
  const fileInput = document.getElementById('fileInput');
  fileInput.onchange = function(e){
    const f = e.target.files[0];
    if(!f) return;
    const reader = new FileReader();
    reader.onload = function(ev2){
      const base64 = ev2.target.result;
      // store by slug
      localStorage.setItem('img_'+v.slug, base64);
      document.getElementById('modalImage').src = base64;
      renderCatalog();
    };
    reader.readAsDataURL(f);
  };
  document.getElementById('clearImage').onclick = function(){
    localStorage.removeItem('img_'+v.slug);
    v.image = '';
    saveVarietyEdits(v.slug, v);
    document.getElementById('modalImage').src = getImageForVariety(v);
    renderCatalog();
  };

  // save / cancel
  document.getElementById('cancelBtn').onclick = function(e){ e.preventDefault(); closeModal(); };
  document.getElementById('saveBtn').onclick = function(e){
    e.preventDefault();
    const form = document.getElementById('editForm');
    const data = new FormData(form);
    const updated = {...v};
    for(const [k,val] of data.entries()){
      // numeric fields convert to number if possible
      if(['year','yield_lbs_per_acre','maturity_days','hundred_sd_weight_g','direct_harvest_suitability','yield_kg_ha'].includes(k)){
        const num = Number(val);
        updated[k] = isNaN(num) || val==='' ? (val===''?null:num) : num;
      } else {
        updated[k] = val;
      }
    }
    saveVarietyEdits(v.slug, updated);
    closeModal();
  };

  document.getElementById('downloadJson').onclick = function(e){
    e.preventDefault();
    const blob = new Blob([JSON.stringify(v, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = v.slug + '.json'; document.body.append(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };

  modal.style.display = 'flex';
};

/* Save edits on a single variety by slug */
function saveVarietyEdits(slug, updated){
  const idx = varieties.findIndex(v=>v.slug===slug);
  if(idx>=0) varieties[idx] = {...varieties[idx], ...updated};
  else varieties.push({...updated, slug});
  saveState();
  populateFilters();
  renderCatalog();
  renderCompareList();
}

/* Modal close */
document.getElementById('closeModal').onclick = closeModal;
function closeModal(){ document.getElementById('modal').style.display = 'none'; }

/* Clear filters */
clearBtn.onclick = function(){ searchEl.value=''; classFilterEl.value=''; yearFilterEl.value=''; maturityFilterEl.value=''; renderCatalog(); };

/* Wire up search/filter events */
[searchEl, classFilterEl, yearFilterEl, maturityFilterEl].forEach(el=>el.oninput = renderCatalog);

/* Plot button */
plotBtn.onclick = plotCompare;

/* Export CSV of selected */
exportCsvBtn.onclick = function(){
  const rows = Array.from(compareSelection).map(s=>varieties.find(v=>v.slug===s)).filter(Boolean);
  if(rows.length===0){ alert('Select varieties to export'); return; }
  const keys = ['name','market_class','year','yield_lbs_per_acre','yield_kg_ha','maturity_days','hundred_sd_weight_g','direct_harvest_suitability','opcc_data_year'];
  const csv = [keys.join(',')].concat(rows.map(r=>keys.map(k=>`"${String(r[k]||'').replace(/"/g,'""')}"`).join(','))).join('\\n');
  const blob = new Blob([csv], {type:'text/csv'}); const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'variety-comparison.csv'; document.body.append(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

/* Small helper to escape HTML in inputs */
function escapeHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

/* initial compare list render & attach outside clicks */
renderCompareList();
document.addEventListener('click',(e)=>{ if(e.target.id==='modal') closeModal(); });

/* initialize: ensure every variety has slug */
varieties = varieties.map(v=> ({...v, slug: slugify(v.name)}));
saveState();
renderCatalog();

/* OPTIONAL: create a second chart: radar-like spider (normalized) when plotting multiple */
function plotRadar(){
  // uses currently selected in compareSelection
  const selected = Array.from(compareSelection).map(s=>varieties.find(v=>v.slug===s)).filter(Boolean);
  if(selected.length===0){ return; }
  // choose metrics to show
  const metrics = ['yield_lbs_per_acre','maturity_days','hundred_sd_weight_g','direct_harvest_suitability'];
  // normalize each metric across selected (0..1)
  const vals = metrics.map(m=>{
    const arr = selected.map(s=> Number(s[m]||0));
    const min = Math.min(...arr); const max = Math.max(...arr);
    return arr.map(v => isNaN(v)?0: (max===min?0.5: (v-min)/(max-min)));
  });
  // build traces: one per variety
  const traces = selected.map((s, idx)=>{
    const r = metrics.map((m,i)=> vals[i][idx]);
    return {
      type:'scatterpolar',
      r: r.concat([r[0]]),
      theta: metrics.map(m=>labelForMetric(m)).concat([labelForMetric(metrics[0])]),
      fill:'toself',
      name: s.name
    };
  });
  const layout = { polar: { radialaxis: { visible: true, range: [0,1]} }, showlegend:true, title:'Profile comparison (normalized)'};
  // create a new div below plotArea
  const radarDiv = document.getElementById('radarDiv') || (function(){ const d = document.createElement('div'); d.id='radarDiv'; d.style.height='420px'; d.style.marginTop='12px'; plotArea.parentNode.appendChild(d); return d; })();
  Plotly.newPlot(radarDiv, traces, layout, {responsive:true});
}
function labelForMetric(k){
  const f = numericFields.find(n=>n.key===k); return f?f.label:k;
}

/* Add small hook: when plot created, also create the radar */
plotBtn.addEventListener('click', ()=>{ setTimeout(plotRadar, 300); });

</script>
