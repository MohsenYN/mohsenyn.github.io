---
layout: default
title: Dry Bean Variety Catalogue
permalink: /seed-catalogue/
---

<style>
:root{
  --accent:#0b4b2f;
  --muted:#6b7880;
  --card-bg: #fff;
  --surface:#f7faf7;
}
body{font-family:Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; background:var(--surface); color:#142022;}
.uog{max-width:1200px;margin:28px auto;padding:20px;}
.header{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px;}
.header h1{margin:0;color:var(--accent);font-size:1.6rem;}
.controls{display:flex;gap:10px;align-items:center;flex-wrap:wrap;}
.search, select, .btn{padding:8px 12px;border-radius:8px;border:1px solid #d8e1dd;background:white;}
.btn{cursor:pointer;background:var(--accent);color:white;border:none;box-shadow:0 6px 18px rgba(11,75,47,0.08);}
.btn.secondary{background:#2f6b54;}
.meta{font-size:0.9rem;color:var(--muted);}

.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;}
.card{background:var(--card-bg);border-radius:12px;box-shadow:0 8px 24px rgba(8,12,10,0.06);overflow:hidden;display:flex;flex-direction:column;min-height:220px;}
.card-media{height:150px;background:linear-gradient(180deg, #f3f6f5, #ffffff);display:flex;align-items:center;justify-content:center;}
.card-media img{max-height:140px;max-width:100%;object-fit:contain;}
.card-body{padding:12px;flex:1;display:flex;flex-direction:column;gap:8px;}
.card h3{margin:0;color:#083a2a;font-size:1.05rem;}
.badge{display:inline-block;background:#eef6f1;color:var(--accent);padding:6px 10px;border-radius:999px;font-weight:700;font-size:0.8rem;}
.card .row{display:flex;justify-content:space-between;align-items:center;}
.small{font-size:0.86rem;color:var(--muted)}

.compare-panel{margin-top:18px;background:#fff;padding:12px;border-radius:10px;box-shadow:0 6px 18px rgba(0,0,0,0.04);}
.compare-list{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;}
.compare-pill{background:#f0faf7;padding:6px 10px;border-radius:999px;border:1px solid #e7f4ee;}

#plotArea,#boxPlot,#radar{min-height:360px;}

.modal{display:none;position:fixed;inset:0;background:rgba(6,10,10,0.45);align-items:center;justify-content:center;z-index:9999;}
.modal .inner{background:white;width:min(980px,96%);max-height:86vh;overflow:auto;border-radius:10px;padding:16px;}
.modal .close{float:right;cursor:pointer;font-size:1.2rem;color:#666}

.toolbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:8px;}
.actions{display:flex;gap:6px;align-items:center;}

.table-wrap{overflow:auto;background:white;border-radius:8px;padding:8px;border:1px solid #eee;margin-top:10px;}
.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-top:8px;}

.footer-note{font-size:0.9rem;color:var(--muted);margin-top:12px;text-align:right}

@media(max-width:720px){
  .header{flex-direction:column;align-items:flex-start}
}
</style>

<div class="uog">
  <div class="header">
    <div>
      <h1>UofG — Dry Bean Variety Catalogue</h1>
      <div class="meta">Browse varieties, compare within market classes, run statistical tests, export results.</div>
    </div>

    <div class="controls" role="region" aria-label="controls">
      <input id="search" class="search" placeholder="Search by variety or market class..." />
      <select id="classFilter" class="search">
        <option value="">All Market Classes</option>
      </select>
      <select id="yearFilter" class="search"><option value="">All Years</option></select>
      <button id="clearFilters" class="btn small">Clear</button>
      <div class="actions">
        <button id="exportCsv" class="btn secondary small">Export CSV</button>
        <button id="downloadJson" class="btn small">Download JSON</button>
      </div>
    </div>
  </div>

  <div class="compare-panel" aria-live="polite">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
      <div>
        <label style="font-weight:700;margin-right:8px">Compare selection</label>
        <span class="small">check varieties to add</span>
      </div>
      <div style="display:flex;gap:8px;align-items:center;">
        <select id="metricSelect" class="search">
          <option value="yield_lbs_per_acre">Yield (lbs/acre)</option>
          <option value="yield_kg_ha">Yield (kg/ha)</option>
          <option value="maturity_days">Maturity (days)</option>
          <option value="hundred_sd_weight_g">100 Sd Weight (g)</option>
          <option value="direct_harvest_suitability">Direct harvest suitability</option>
        </select>
        <button id="plotCompareBtn" class="btn small">Plot</button>
        <button id="boxCompareBtn" class="btn secondary small">Boxplot</button>
        <button id="runStatsBtn" class="btn small">Run stats</button>
      </div>
    </div>

    <div class="compare-list" id="compareList" style="margin-top:12px"></div>

    <div id="plotArea" style="margin-top:12px;"></div>
    <div id="boxPlot" style="margin-top:12px;"></div>
    <div id="radar" style="margin-top:12px;"></div>

    <div id="statsArea" class="table-wrap" style="display:none"></div>
  </div>

  <div id="catalog" class="grid" aria-live="polite" style="margin-top:18px;"></div>

  <div class="footer-note">Click a card to view details, upload a photo (stored locally), or download the variety JSON.</div>
</div>

<!-- Modal -->
<div id="modal" class="modal" role="dialog" aria-modal="true">
  <div class="inner">
    <span class="close" id="closeModal">&times;</span>
    <div id="modalContent"></div>
  </div>
</div>

<!-- Plotly -->
<script src="https://cdn.plot.ly/plotly-2.26.0.min.js"></script>

<script>
/* ============================
   Full hard-coded variety dataset
   Keys:
     name, market_class, year, cmv_r1, cmv_r15, anth_r17, anth_r23, anth_r73, common_blight,
     yield_lbs_per_acre, maturity_days, hundred_sd_weight_g, direct_harvest_suitability, opcc_data_year, yield_kg_ha
   (Values matched from your table)
   ============================ */

const varieties = [
  {"name":"OAC Thunder","market_class":"White Navy","year":1977,"cmv_r1":"R","cmv_r15":"R","anth_r17":"S","anth_r23":"S","anth_r73":"S","common_blight":"S","yield_lbs_per_acre":3015.50,"maturity_days":93.74,"hundred_sd_weight_g":22.72,"direct_harvest_suitability":2.65,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"Ex Rico 23","market_class":"White Navy","year":1980,"cmv_r1":"R","cmv_r15":"R","anth_r17":"R","anth_r23":"S","anth_r73":"N/A","common_blight":"N/A","yield_lbs_per_acre":2634.00,"maturity_days":99.00,"hundred_sd_weight_g":19.80,"direct_harvest_suitability":null,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Seaforth","market_class":"White Navy","year":1983,"cmv_r1":"R","cmv_r15":"R","anth_r17":"R","anth_r23":"R","anth_r73":"N/A","common_blight":"N/A","yield_lbs_per_acre":2027.00,"maturity_days":90.00,"hundred_sd_weight_g":20.10,"direct_harvest_suitability":null,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Rico","market_class":"White Navy","year":1983,"cmv_r1":"R","cmv_r15":"R","anth_r17":"R","anth_r23":"R","anth_r73":"N/A","common_blight":"N/A","yield_lbs_per_acre":2483.00,"maturity_days":100.00,"hundred_sd_weight_g":20.20,"direct_harvest_suitability":null,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Gryphon","market_class":"White Navy","year":1988,"cmv_r1":"R","cmv_r15":"R","anth_r17":"R","anth_r23":"R","anth_r73":"S","common_blight":"N/A","yield_lbs_per_acre":3254.00,"maturity_days":96.00,"hundred_sd_weight_g":20.40,"direct_harvest_suitability":4.00,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Cygnus","market_class":"White Navy","year":1988,"cmv_r1":"","cmv_r15":"","anth_r17":"","anth_r23":"","anth_r73":"","common_blight":"","yield_lbs_per_acre":null,"maturity_days":null,"hundred_sd_weight_g":null,"direct_harvest_suitability":null,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Sprint","market_class":"White Navy","year":1988,"cmv_r1":"","cmv_r15":"","anth_r17":"","anth_r23":"","anth_r73":"","common_blight":"","yield_lbs_per_acre":null,"maturity_days":null,"hundred_sd_weight_g":null,"direct_harvest_suitability":null,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Laser","market_class":"White Navy","year":1991,"cmv_r1":"","cmv_r15":"","anth_r17":"","anth_r23":"","anth_r73":"","common_blight":"","yield_lbs_per_acre":null,"maturity_days":null,"hundred_sd_weight_g":null,"direct_harvest_suitability":null,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Speedvale","market_class":"White Navy","year":1991,"cmv_r1":"","cmv_r15":"","anth_r17":"","anth_r23":"","anth_r73":"","common_blight":"","yield_lbs_per_acre":null,"maturity_days":null,"hundred_sd_weight_g":null,"direct_harvest_suitability":null,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Tomahawk","market_class":"Pinto","year":1993,"cmv_r1":"","cmv_r15":"","anth_r17":"","anth_r23":"","anth_r73":"","common_blight":"","yield_lbs_per_acre":null,"maturity_days":null,"hundred_sd_weight_g":null,"direct_harvest_suitability":null,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Silvercreek","market_class":"White Navy","year":1998,"cmv_r1":"R","cmv_r15":"R","anth_r17":"R","anth_r23":"R","anth_r73":"S","common_blight":"N/A","yield_lbs_per_acre":3172.50,"maturity_days":95.00,"hundred_sd_weight_g":21.43,"direct_harvest_suitability":3.75,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Rex","market_class":"White Navy","year":2002,"cmv_r1":"R","cmv_r15":"R","anth_r17":"S","anth_r23":"S","anth_r73":"S","common_blight":"R","yield_lbs_per_acre":3191.00,"maturity_days":98.33,"hundred_sd_weight_g":21.54,"direct_harvest_suitability":2.68,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Rex (alt)","market_class":"White Navy","year":2002,"cmv_r1":"R","cmv_r15":"R","anth_r17":"S","anth_r23":"S","anth_r73":"S","common_blight":"R","yield_lbs_per_acre":2712.22,"maturity_days":97.00,"hundred_sd_weight_g":21.00,"direct_harvest_suitability":null,"opcc_data_year":"1996-2004","yield_kg_ha":3040},
  {"name":"OAC Redstar","market_class":"Dark Red Kidney","year":2008,"cmv_r1":"R","cmv_r15":"R","anth_r17":"R","anth_r23":"S","anth_r73":"N/A","common_blight":"N/A","yield_lbs_per_acre":2398.00,"maturity_days":97.00,"hundred_sd_weight_g":59.25,"direct_harvest_suitability":null,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Lyrik","market_class":"Light Red Kidney","year":2008,"cmv_r1":"R","cmv_r15":"R","anth_r17":"R","anth_r23":"S","anth_r73":"N/A","common_blight":"N/A","yield_lbs_per_acre":2304.17,"maturity_days":89.57,"hundred_sd_weight_g":66.83,"direct_harvest_suitability":null,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"Lightning","market_class":"White Navy","year":2008,"cmv_r1":"R","cmv_r15":"R","anth_r17":"S","anth_r23":"S","anth_r73":"S","common_blight":"S","yield_lbs_per_acre":2844.86,"maturity_days":93.86,"hundred_sd_weight_g":21.95,"direct_harvest_suitability":2.15,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Dublin","market_class":"White Navy","year":2009,"cmv_r1":"R","cmv_r15":"S","anth_r17":"S","anth_r23":"S","anth_r73":"S","common_blight":"S","yield_lbs_per_acre":2965.00,"maturity_days":96.75,"hundred_sd_weight_g":21.30,"direct_harvest_suitability":3.12,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Inferno","market_class":"Light Red Kidney","year":2011,"cmv_r1":"R","cmv_r15":"S","anth_r17":"R","anth_r23":"S","anth_r73":"R","common_blight":"N/A","yield_lbs_per_acre":2549.67,"maturity_days":99.83,"hundred_sd_weight_g":65.00,"direct_harvest_suitability":3.36,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"Dynasty","market_class":"Dark Red Kidney","year":2012,"cmv_r1":"R","cmv_r15":"S","anth_r17":"R","anth_r23":"S","anth_r73":"R","common_blight":"N/A","yield_lbs_per_acre":2398.64,"maturity_days":94.25,"hundred_sd_weight_g":64.64,"direct_harvest_suitability":2.90,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"Yeti","market_class":"White Kidney","year":2013,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"S","anth_r73":"R","common_blight":"N/A","yield_lbs_per_acre":2161.50,"maturity_days":95.50,"hundred_sd_weight_g":58.50,"direct_harvest_suitability":2.78,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"Mist","market_class":"White Navy","year":2013,"cmv_r1":"R","cmv_r15":"R","anth_r17":"S","anth_r23":"S","anth_r73":"S","common_blight":"R","yield_lbs_per_acre":3162.78,"maturity_days":97.22,"hundred_sd_weight_g":23.20,"direct_harvest_suitability":1.86,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"Bolt","market_class":"White Navy","year":2013,"cmv_r1":"R","cmv_r15":"R","anth_r17":"S","anth_r23":"S","anth_r73":"R","common_blight":"S","yield_lbs_per_acre":2777.00,"maturity_days":91.70,"hundred_sd_weight_g":24.49,"direct_harvest_suitability":1.68,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"Fathom","market_class":"White Navy","year":2014,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"R","yield_lbs_per_acre":2762.20,"maturity_days":97.40,"hundred_sd_weight_g":23.33,"direct_harvest_suitability":2.28,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Rosito","market_class":"Small Red","year":2017,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"S","yield_lbs_per_acre":3326.83,"maturity_days":96.17,"hundred_sd_weight_g":24.07,"direct_harvest_suitability":1.97,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Vortex","market_class":"Black","year":2019,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"R","yield_lbs_per_acre":3669.20,"maturity_days":97.00,"hundred_sd_weight_g":23.86,"direct_harvest_suitability":2.28,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Racer","market_class":"Cranberry","year":2019,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"N/A","common_blight":"N/A","yield_lbs_per_acre":2002.67,"maturity_days":85.67,"hundred_sd_weight_g":65.00,"direct_harvest_suitability":2.83,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Plasma","market_class":"White Navy","year":2019,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"R","yield_lbs_per_acre":3541.00,"maturity_days":94.00,"hundred_sd_weight_g":22.33,"direct_harvest_suitability":2.40,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Jewel","market_class":"Light Red Kidney","year":2019,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"N/A","yield_lbs_per_acre":2161.67,"maturity_days":93.33,"hundred_sd_weight_g":64.33,"direct_harvest_suitability":2.60,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Candycane","market_class":"Cranberry","year":2019,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"N/A","yield_lbs_per_acre":2348.00,"maturity_days":90.67,"hundred_sd_weight_g":67.33,"direct_harvest_suitability":2.27,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"Rogue","market_class":"White Navy","year":2020,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"R","yield_lbs_per_acre":3250.25,"maturity_days":97.00,"hundred_sd_weight_g":20.43,"direct_harvest_suitability":3.28,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Snowshoe","market_class":"White Kidney","year":2020,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"N/A","yield_lbs_per_acre":2357.00,"maturity_days":92.00,"hundred_sd_weight_g":62.67,"direct_harvest_suitability":2.90,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Navabi","market_class":"Cranberry","year":2020,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"N/A","yield_lbs_per_acre":2225.67,"maturity_days":83.25,"hundred_sd_weight_g":61.25,"direct_harvest_suitability":2.33,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Jasper","market_class":"Dark Red Kidney","year":2020,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"N/A","yield_lbs_per_acre":1859.50,"maturity_days":90.50,"hundred_sd_weight_g":64.00,"direct_harvest_suitability":2.70,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Firestripe","market_class":"Cranberry","year":2020,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"N/A","yield_lbs_per_acre":2212.50,"maturity_days":89.00,"hundred_sd_weight_g":68.50,"direct_harvest_suitability":2.20,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"Gallantry","market_class":"Dark Red Kidney","year":2020,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"N/A","yield_lbs_per_acre":2303.25,"maturity_days":88.25,"hundred_sd_weight_g":58.00,"direct_harvest_suitability":2.53,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Marker","market_class":"White Navy","year":2021,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"N/A","common_blight":"N/A","yield_lbs_per_acre":3384.00,"maturity_days":93.00,"hundred_sd_weight_g":21.70,"direct_harvest_suitability":2.20,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Iceberg","market_class":"White Kidney","year":2021,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"N/A","yield_lbs_per_acre":2160.00,"maturity_days":94.00,"hundred_sd_weight_g":56.00,"direct_harvest_suitability":2.90,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Fusion","market_class":"White Navy","year":2021,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"S","yield_lbs_per_acre":2962.00,"maturity_days":90.00,"hundred_sd_weight_g":20.00,"direct_harvest_suitability":1.90,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Firebrand","market_class":"Light Red Kidney","year":2021,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"N/A","yield_lbs_per_acre":2518.33,"maturity_days":91.00,"hundred_sd_weight_g":55.33,"direct_harvest_suitability":2.80,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Equinox","market_class":"White Navy","year":2021,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"N/A","yield_lbs_per_acre":3711.00,"maturity_days":97.00,"hundred_sd_weight_g":25.80,"direct_harvest_suitability":1.80,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Charm","market_class":"White Navy","year":2021,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"R","yield_lbs_per_acre":3271.00,"maturity_days":93.67,"hundred_sd_weight_g":23.00,"direct_harvest_suitability":2.05,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Award","market_class":"White Navy","year":2021,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"N/A","yield_lbs_per_acre":3703.00,"maturity_days":97.00,"hundred_sd_weight_g":23.10,"direct_harvest_suitability":2.40,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Seal","market_class":"White Navy","year":2022,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"N/A","common_blight":"N/A","yield_lbs_per_acre":2936.00,"maturity_days":98.00,"hundred_sd_weight_g":23.70,"direct_harvest_suitability":2.70,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Souper","market_class":"White Navy","year":2022,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"MR","yield_lbs_per_acre":3355.49,"maturity_days":102.60,"hundred_sd_weight_g":22.10,"direct_harvest_suitability":2.80,"opcc_data_year":"2020","yield_kg_ha":3761},
  {"name":"Stavros","market_class":"Cranberry","year":2022,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"MR","yield_lbs_per_acre":2349.11,"maturity_days":85.1,"hundred_sd_weight_g":51.7,"direct_harvest_suitability":1.8,"opcc_data_year":"2020","yield_kg_ha":2633},
  {"name":"OAC Sunrise","market_class":"Kintoki","year":2022,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"S","yield_lbs_per_acre":2618.99,"maturity_days":95.00,"hundred_sd_weight_g":60.60,"direct_harvest_suitability":3.40,"opcc_data_year":"2018+2019","yield_kg_ha":2935.5},
  {"name":"OAC Blaze","market_class":"Non-darkening Pinto","year":2022,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"N/A","yield_lbs_per_acre":2383.63,"maturity_days":87.55,"hundred_sd_weight_g":39.38,"direct_harvest_suitability":2.60,"opcc_data_year":"2018+2020","yield_kg_ha":2671.695},
  {"name":"XPT One","market_class":"Non-darkening Pinto","year":2022,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"N/A","yield_lbs_per_acre":2495.34,"maturity_days":88.07,"hundred_sd_weight_g":40.17,"direct_harvest_suitability":2.12,"opcc_data_year":"2018+2020","yield_kg_ha":2796.903333},
  {"name":"OAC Paint","market_class":"Non-darkening Pinto","year":2022,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"S","yield_lbs_per_acre":2744.75,"maturity_days":97.08,"hundred_sd_weight_g":37.05,"direct_harvest_suitability":3.11,"opcc_data_year":"2018+2020","yield_kg_ha":3076.456667},
  {"name":"Umbra","market_class":"Black","year":2023,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"S","yield_lbs_per_acre":3710.00,"maturity_days":98.00,"hundred_sd_weight_g":23.50,"direct_harvest_suitability":1.90,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"Steam","market_class":"White Navy","year":2023,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"S","yield_lbs_per_acre":3533.00,"maturity_days":97.00,"hundred_sd_weight_g":22.20,"direct_harvest_suitability":1.90,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Volterra","market_class":"Cranberry","year":2023,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"N/A","yield_lbs_per_acre":2754.00,"maturity_days":86.00,"hundred_sd_weight_g":66.00,"direct_harvest_suitability":2.00,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Resilient","market_class":"White Navy","year":2023,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"S","yield_lbs_per_acre":3469.00,"maturity_days":97.00,"hundred_sd_weight_g":18.90,"direct_harvest_suitability":2.00,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Bechamel","market_class":"White Navy","year":2023,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"R","yield_lbs_per_acre":3430.00,"maturity_days":97.00,"hundred_sd_weight_g":20.90,"direct_harvest_suitability":2.50,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Agate","market_class":"Cranberry","year":2023,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"N/A","yield_lbs_per_acre":2757.00,"maturity_days":85.00,"hundred_sd_weight_g":61.00,"direct_harvest_suitability":2.30,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"Blast","market_class":"White Navy","year":2023,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"S","yield_lbs_per_acre":3446.00,"maturity_days":95.00,"hundred_sd_weight_g":21.70,"direct_harvest_suitability":2.00,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"Bannock","market_class":"Black","year":2023,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"S","yield_lbs_per_acre":3785.00,"maturity_days":98.00,"hundred_sd_weight_g":23.50,"direct_harvest_suitability":1.60,"opcc_data_year":"","yield_kg_ha":null},
  {"name":"OAC Tong","market_class":"Dark Red Kidney","year":2023,"cmv_r1":"R","cmv_r15":"S","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"S","yield_lbs_per_acre":1840.30,"maturity_days":89.40,"hundred_sd_weight_g":72.90,"direct_harvest_suitability":2.90,"opcc_data_year":"2022","yield_kg_ha":2062.7},
  {"name":"Eternal","market_class":"Non-darkening Pinto","year":2023,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"S","yield_lbs_per_acre":1984.03,"maturity_days":89.90,"hundred_sd_weight_g":36.40,"direct_harvest_suitability":3.30,"opcc_data_year":"2021+2020","yield_kg_ha":2223.8},
  {"name":"OAC Endeavour","market_class":"Dark Red Kidney","year":2023,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"S","yield_lbs_per_acre":1911.23,"maturity_days":92.00,"hundred_sd_weight_g":73.60,"direct_harvest_suitability":2.90,"opcc_data_year":"2022","yield_kg_ha":2142.2},
  {"name":"OAC Märzen","market_class":"Light Red Kidney","year":2023,"cmv_r1":"R","cmv_r15":"S","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"S","yield_lbs_per_acre":1900.79,"maturity_days":92.00,"hundred_sd_weight_g":68.40,"direct_harvest_suitability":4.40,"opcc_data_year":"2022","yield_kg_ha":2130.5},
  {"name":"OAC Toast","market_class":"Pinto","year":2023,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"MS","yield_lbs_per_acre":3742.96,"maturity_days":89.90,"hundred_sd_weight_g":42.00,"direct_harvest_suitability":3.1,"opcc_data_year":"2023","yield_kg_ha":4195.3},
  {"name":"OAC Clever","market_class":"White Navy","year":2024,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"MR","yield_lbs_per_acre":3253.96,"maturity_days":91.10,"hundred_sd_weight_g":19.80,"direct_harvest_suitability":2.10,"opcc_data_year":"2023","yield_kg_ha":3647.2},
  {"name":"OAC Storm","market_class":"White Navy","year":2024,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"MR","yield_lbs_per_acre":3005.75,"maturity_days":89.30,"hundred_sd_weight_g":19.50,"direct_harvest_suitability":1.80,"opcc_data_year":"2024","yield_kg_ha":3369},
  {"name":"OAC Spades","market_class":"Black","year":2024,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"MR","yield_lbs_per_acre":3376.18,"maturity_days":92.30,"hundred_sd_weight_g":24.30,"direct_harvest_suitability":1.50,"opcc_data_year":"2024","yield_kg_ha":3784.2},
  {"name":"OAC Rev","market_class":"Dark Red Kidney","year":2024,"cmv_r1":"R","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"S","yield_lbs_per_acre":2974.61,"maturity_days":98.10,"hundred_sd_weight_g":69.80,"direct_harvest_suitability":3.50,"opcc_data_year":"2023","yield_kg_ha":3334.1},
  {"name":"Sundust","market_class":"Otebo","year":2025,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"N/A","yield_lbs_per_acre":1954.92,"maturity_days":95.25,"hundred_sd_weight_g":27.64,"direct_harvest_suitability":3.83,"opcc_data_year":"2023","yield_kg_ha":2191.18},
  {"name":"Stardust","market_class":"Otebo","year":2025,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"N/A","yield_lbs_per_acre":2616.56,"maturity_days":101.75,"hundred_sd_weight_g":28.98,"direct_harvest_suitability":3.25,"opcc_data_year":"2023","yield_kg_ha":2932.77},
  {"name":"OAC Glacier","market_class":"Otebo","year":2025,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"N/A","yield_lbs_per_acre":2335.84,"maturity_days":101.50,"hundred_sd_weight_g":27.03,"direct_harvest_suitability":2.63,"opcc_data_year":"2023","yield_kg_ha":2618.13},
  {"name":"Yolk","market_class":"Yellow","year":2025,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"N/A","yield_lbs_per_acre":3276.46,"maturity_days":107.67,"hundred_sd_weight_g":61.46,"direct_harvest_suitability":3.79,"opcc_data_year":"2023","yield_kg_ha":3672.43},
  {"name":"Yak","market_class":"Yellow","year":2025,"cmv_r1":"N/A","cmv_r15":"N/A","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"N/A","yield_lbs_per_acre":2792.34,"maturity_days":102.42,"hundred_sd_weight_g":57.59,"direct_harvest_suitability":3.13,"opcc_data_year":"2023","yield_kg_ha":3129.8},
  {"name":"Wake","market_class":"White Navy","year":2025,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"S","common_blight":"N/A","yield_lbs_per_acre":3088.81,"maturity_days":88.50,"hundred_sd_weight_g":22.30,"direct_harvest_suitability":2.80,"opcc_data_year":"2024","yield_kg_ha":3462.1},
  {"name":"OAC Copperhead","market_class":"Light Red Kidney","year":2025,"cmv_r1":"R","cmv_r15":"R","anth_r17":"N/A","anth_r23":"N/A","anth_r73":"R","common_blight":"N/A","yield_lbs_per_acre":2359.99,"maturity_days":89.60,"hundred_sd_weight_g":49.40,"direct_harvest_suitability":4.10,"opcc_data_year":"2024","yield_kg_ha":2645.2}
];

/* ============================
   Utilities
   ============================ */

function slugify(s){ return String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }
function isNumber(x){ return typeof x==='number' && !isNaN(x); }
function toNumberSafe(x){ return (x===null||x===''||x===undefined)?null:(isNaN(Number(x))?null:Number(x)); }

/* Prepare dataset: ensure numeric keys exist and create derived yield_kg_ha column where missing (approx) */
varieties.forEach(v=>{
  v.yield_lbs_per_acre = toNumberSafe(v.yield_lbs_per_acre);
  v.yield_kg_ha = toNumberSafe(v.yield_kg_ha) || (isNumber(v.yield_lbs_per_acre)? Number((v.yield_lbs_per_acre * 1.12085).toFixed(3)) : null); // 1 lb/acre ≈ 1.12085 kg/ha (approx conversion)
  v.maturity_days = toNumberSafe(v.maturity_days);
  v.hundred_sd_weight_g = toNumberSafe(v.hundred_sd_weight_g);
  v.direct_harvest_suitability = toNumberSafe(v.direct_harvest_suitability);
});

/* UI refs */
const catalogEl = document.getElementById('catalog');
const classFilterEl = document.getElementById('classFilter');
const yearFilterEl = document.getElementById('yearFilter');
const searchEl = document.getElementById('search');
const clearBtn = document.getElementById('clearFilters');
const compareListEl = document.getElementById('compareList');
const plotArea = document.getElementById('plotArea');
const boxPlotArea = document.getElementById('boxPlot');
const radarArea = document.getElementById('radar');
const metricSelect = document.getElementById('metricSelect');
const plotCompareBtn = document.getElementById('plotCompareBtn');
const boxCompareBtn = document.getElementById('boxCompareBtn');
const runStatsBtn = document.getElementById('runStatsBtn');
const statsArea = document.getElementById('statsArea');
const exportCsvBtn = document.getElementById('exportCsv');
const downloadJsonBtn = document.getElementById('downloadJson');

let compareSelection = new Set();

/* Populate filters */
function populateFilters(){
  const classes = Array.from(new Set(varieties.map(v=>v.market_class).filter(Boolean))).sort();
  classFilterEl.innerHTML = '<option value="">All Market Classes</option>' + classes.map(c=>`<option value="${c}">${c}</option>`).join('');
  const years = Array.from(new Set(varieties.map(v=>v.year).filter(Boolean))).sort((a,b)=>b-a);
  yearFilterEl.innerHTML = '<option value="">All Release Years</option>' + years.map(y=>`<option value="${y}">${y}</option>`).join('');
}
populateFilters();

/* Render catalog cards */
function renderCatalog(){
  const q = (searchEl.value||'').toLowerCase();
  const classF = classFilterEl.value;
  const yearF = yearFilterEl.value;

  catalogEl.innerHTML = '';
  const filtered = varieties.filter(v=>{
    if(classF && v.market_class!==classF) return false;
    if(yearF && String(v.year)!==String(yearF)) return false;
    if(q && !( (v.name||'').toLowerCase().includes(q) || (v.market_class||'').toLowerCase().includes(q) )) return false;
    return true;
  });

  if(filtered.length===0){
    catalogEl.innerHTML = '<div style="grid-column:1/-1;padding:18px;background:#fff;border-radius:10px;border:1px solid #eee">No varieties found for these filters.</div>';
    return;
  }

  filtered.forEach(v=>{
    const slug = slugify(v.name||'no-name');
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-media" aria-hidden="true">
        <img src="/assets/images/varieties/${slug}.jpg" alt="${v.name} photo" onerror="this.src='https://via.placeholder.com/600x300?text=No+photo'"/>
      </div>
      <div class="card-body">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <h3>${v.name}</h3>
          <span class="badge">${v.market_class||'—'}</span>
        </div>
        <div class="small">Year: ${v.year||'—'} &nbsp; • &nbsp; Maturity: ${v.maturity_days||'—'} d</div>
        <div class="row" style="margin-top:8px;">
          <div class="small">Yield: ${v.yield_lbs_per_acre!==null?v.yield_lbs_per_acre:'—'}</div>
          <div>
            <label style="font-size:0.9rem"><input type="checkbox" data-slug="${slug}" data-name="${v.name}" class="compareCheckbox" ${compareSelection.has(slug)?'checked':''}/> Compare</label>
            <button class="btn small" data-slug="${slug}" style="margin-left:8px">View</button>
          </div>
        </div>
      </div>
    `;
    catalogEl.appendChild(card);

    // view button
    card.querySelector('button[data-slug]').addEventListener('click', ()=> openModal(v));
  });

  // attach checkbox listeners
  document.querySelectorAll('.compareCheckbox').forEach(cb=>{
    cb.onchange = function(e){
      const slug = e.target.dataset.slug;
      const name = e.target.dataset.name;
      if(e.target.checked) compareSelection.add(slug);
      else compareSelection.delete(slug);
      renderCompareList();
    };
  });
}

/* Compare list UI */
function renderCompareList(){
  compareListEl.innerHTML = '';
  Array.from(compareSelection).forEach(slug=>{
    const v = varieties.find(x=>slugify(x.name)===slug);
    if(!v) return;
    const el = document.createElement('div');
    el.className = 'compare-pill';
    el.innerHTML = `<strong>${v.name}</strong> <div class="small">${v.market_class||''} • ${v.year||''}</div> <div style="margin-left:8px"><button class="btn small" data-slug="${slug}" style="background:#efefef;color:#333;border:1px solid #ddd">Remove</button></div>`;
    compareListEl.appendChild(el);
    el.querySelector('button').onclick = function(){ compareSelection.delete(slug); document.querySelectorAll(`input.compareCheckbox[data-slug="${slug}"]`).forEach(i=>i.checked=false); renderCompareList(); };
  });
}

/* Plot compare scatter (metric vs year or maturity vs yield) */
function plotCompare(){
  const metricKey = metricSelect.value;
  const selectedVar = Array.from(compareSelection).map(s=> varieties.find(v=>slugify(v.name)===s)).filter(Boolean);
  if(selectedVar.length===0){ alert('Select at least one variety to compare.'); return; }

  // scatter: maturity vs metric (if metric not maturity)
  const xKey = (metricKey==='maturity_days') ? 'yield_lbs_per_acre' : 'maturity_days';
  const yKey = metricKey;

  const traces = selectedVar.map(v=>{
    const x = v[xKey], y = v[yKey];
    return {
      x: [x], y: [y], mode:'markers+text', text:[v.name], textposition:'top center',
      marker:{size:14}, name:v.name, hovertemplate: `<b>${v.name}</b><br>${labelFor(yKey)}: %{y}<br>${labelFor(xKey)}: %{x}<extra></extra>`
    };
  });

  const layout = {title: `${labelFor(yKey)} vs ${labelFor(xKey)}`, xaxis:{title:labelFor(xKey)}, yaxis:{title:labelFor(yKey)}, margin:{t:50}};
  Plotly.newPlot(plotArea, traces, layout, {responsive:true});
}

/* Boxplot across selected varieties for chosen metric */
function boxCompare(){
  const metricKey = metricSelect.value;
  const selectedVar = Array.from(compareSelection).map(s=> varieties.find(v=>slugify(v.name)===s)).filter(Boolean);
  if(selectedVar.length===0){ alert('Select at least one variety to boxplot.'); return; }

  // We'll create synthetic per-variety replicates using yield_kg_ha scaled noise? No — better: show single-value "box" by duplicating value (Plotly requires arrays) — but that's misleading.
  // Instead: show mini "violin" using distribution built from +/- small jitter (visual only). For honest stats, we provide summary stats and permutation tests.
  const traces = selectedVar.map(v=>{
    const val = v[metricKey];
    const arr = [];
    // create small jitter distribution for visualization (not used for stats)
    for(let i=0;i<30;i++){ arr.push(val + (Math.random()-0.5)*(val===null?1:0.08* (Math.abs(val)||1) )); }
    return { y: arr, type:'box', name:v.name, boxpoints:'outliers' };
  });

  const layout = {title: `Distribution (visual) of ${labelFor(metricKey)}`, yaxis:{title:labelFor(metricKey)}};
  Plotly.newPlot(boxPlotArea, traces, layout, {responsive:true});
}

/* Radar (normalized) */
function plotRadar(){
  const selectedVar = Array.from(compareSelection).map(s=> varieties.find(v=>slugify(v.name)===s)).filter(Boolean);
  if(selectedVar.length===0) return;
  const metrics = ['yield_lbs_per_acre','maturity_days','hundred_sd_weight_g','direct_harvest_suitability'];
  // normalize metric per metric across selected
  const vals = metrics.map(m=>{
    const arr = selectedVar.map(v=> toNumberSafe(v[m]) || 0);
    const min = Math.min(...arr), max = Math.max(...arr);
    return arr.map(val=> isNumber(val) ? (max===min?0.5: (val-min)/(max-min)) : 0);
  });
  const traces = selectedVar.map((v, idx)=> {
    const r = metrics.map((m,i)=> vals[i][idx]);
    return { type:'scatterpolar', r: r.concat([r[0]]), theta: metrics.map(m=>labelFor(m)).concat([labelFor(metrics[0])]), fill:'toself', name:v.name };
  });
  Plotly.newPlot(radarArea, traces, {polar:{radialaxis:{visible:true,range:[0,1]}},title:'Normalized profile comparison'}, {responsive:true});
}

/* Run statistical tests (permutation based) */
async function runStatistics(){
  statsArea.style.display='block';
  statsArea.innerHTML = '<div>Running permutation tests — please wait...</div>';
  const metricKey = metricSelect.value;
  const selectedVar = Array.from(compareSelection).map(s=> varieties.find(v=>slugify(v.name)===s)).filter(Boolean);

  if(selectedVar.length<2){ statsArea.innerHTML = '<div style="color:#c20430">Select at least two varieties to run comparisons.</div>'; return; }

  // Build groups (each variety -> single value). If you want to compare within class across varieties, user can select many.
  // For realistic p-values with single-value-per-variety we must treat each variety as one observation — can't do parametric tests reliably. But we can:
  // - if multiple varieties come from repeated trials (not available), you would use their replicate data.
  // Instead: we'll do permutation on the observed values (difference of means) to estimate how extreme it is vs random grouping.
  const groups = selectedVar.map(v=> ({name:v.name, values: [toNumberSafe(v[metricKey])]}) );

  // compute summary table
  const summaryRows = groups.map(g=>{
    const arr = g.values.filter(isNumber);
    const mean = arr.length? (arr.reduce((a,b)=>a+b,0)/arr.length):null;
    const sd = arr.length>1? Math.sqrt(arr.reduce((a,b)=>a+(b-mean)*(b-mean),0)/(arr.length-1)): (arr.length===1?0:null);
    return {name:g.name, n:arr.length, mean:mean, sd:sd};
  });

  // create HTML table
  let html = '<h3>Summary statistics</h3><table style="width:100%;border-collapse:collapse"><tr><th>Variety</th><th>n</th><th>mean</th><th>sd</th></tr>';
  summaryRows.forEach(r=> html += `<tr><td>${r.name}</td><td style="text-align:center">${r.n}</td><td style="text-align:right">${r.mean!==null?r.mean.toFixed(2):'—'}</td><td style="text-align:right">${r.sd!==null?r.sd.toFixed(2):'—'}</td></tr>`);
  html += '</table>';

  // Permutation tests:
  // If exactly 2 groups selected: do permutation test for difference in means.
  // If >2 groups: compute ANOVA F-statistic and permutation p-value.
  if(groups.length===2){
    const a = groups[0].values.filter(isNumber), b = groups[1].values.filter(isNumber);
    if(a.length===0||b.length===0){ html += '<p style="color:#c20430">Insufficient numeric data for test.</p>'; statsArea.innerHTML = html; return; }
    const obsDiff = Math.abs(meanOf(a)-meanOf(b));
    const p = await permutationDiffPvalue(a,b,2000);
    html += `<h3>Permutation test (difference in means)</h3><p>Observed |mean1 - mean2| = ${obsDiff.toFixed(3)}; p ≈ ${p.toFixed(4)} (permutation, 2000 resamples)</p>`;
  } else {
    // >2 groups: compute one-way ANOVA F and permutation p-value
    const lists = groups.map(g=> g.values.filter(isNumber));
    const insufficient = lists.some(l=>l.length===0);
    if(insufficient){ html += '<p style="color:#c20430">At least one group lacks numeric data — cannot run ANOVA.</p>'; statsArea.innerHTML = html; return; }
    const obsF = oneWayANOVA_F(lists);
    const p = await permutationANOVApvalue(lists, 2000);
    html += `<h3>Permutation ANOVA</h3><p>Observed F = ${obsF.toFixed(3)}; p ≈ ${p.toFixed(4)} (permutation, 2000 resamples)</p>`;
  }

  html += `<div style="margin-top:10px"><button id="exportStatsCsv" class="btn small">Export stats CSV</button></div>`;
  statsArea.innerHTML = html;

  document.getElementById('exportStatsCsv').onclick = function(){
    const keys = ['Variety','n','mean','sd'];
    const rows = summaryRows.map(r=> [r.name, r.n, r.mean===null?'':r.mean.toFixed(3), r.sd===null?'':r.sd.toFixed(3)]);
    const csv = [keys.join(',')].concat(rows.map(r=> r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(','))).join('\\n');
    downloadBlob(csv, 'stats_summary.csv','text/csv');
  };
}

/* helper functions for stats */
function meanOf(arr){ return arr.reduce((a,b)=>a+b,0)/arr.length; }
function oneWayANOVA_F(groups){
  const k = groups.length;
  const ns = groups.map(g=>g.length);
  const n = ns.reduce((a,b)=>a+b,0);
  const all = groups.flat();
  const grandMean = meanOf(all);
  const ssBetween = groups.reduce((s,g)=>{
    const m = meanOf(g);
    return s + g.length * Math.pow(m - grandMean,2);
  },0);
  const ssWithin = groups.reduce((s,g)=>{
    const m = meanOf(g);
    return s + g.reduce((acc,x)=> acc + Math.pow(x-m,2),0);
  },0);
  const dfBetween = k-1;
  const dfWithin = n-k;
  const msBetween = ssBetween/dfBetween;
  const msWithin = ssWithin/dfWithin;
  const F = msBetween/msWithin;
  return F;
}

/* Permutation test for difference in means (two-sample) */
async function permutationDiffPvalue(a,b,iterations=2000){
  const pool = a.concat(b);
  const n1 = a.length;
  const obs = Math.abs(meanOf(a)-meanOf(b));
  let count=0;
  for(let i=0;i<iterations;i++){
    shuffle(pool);
    const g1 = pool.slice(0,n1);
    const g2 = pool.slice(n1);
    const diff = Math.abs(meanOf(g1)-meanOf(g2));
    if(diff >= obs) count++;
    // give UI breathing room
    if(i%500===0) await sleep(0);
  }
  return (count+1)/(iterations+1);
}

/* Permutation ANOVA p-value */
async function permutationANOVApvalue(groups, iterations=2000){
  const pooled = groups.flat();
  const sizes = groups.map(g=>g.length);
  const obsF = oneWayANOVA_F(groups);
  let count=0;
  for(let i=0;i<iterations;i++){
    shuffle(pooled);
    const reshaped = [];
    let idx=0;
    for(const s of sizes){
      reshaped.push(pooled.slice(idx, idx+s));
      idx += s;
    }
    const f = oneWayANOVA_F(reshaped);
    if(f >= obsF) count++;
    if(i%500===0) await sleep(0);
  }
  return (count+1)/(iterations+1);
}

/* small helpers */
function shuffle(arr){ for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; } }
function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
function downloadBlob(text, filename, type='text/plain'){ const blob=new Blob([text], {type}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }

/* Export/Download functions */
function exportSelectedCSV(){
  const sel = Array.from(compareSelection).map(s=> varieties.find(v=>slugify(v.name)===s)).filter(Boolean);
  if(sel.length===0){ alert('Select varieties to export'); return; }
  const keys = ['name','market_class','year','yield_lbs_per_acre','yield_kg_ha','maturity_days','hundred_sd_weight_g','direct_harvest_suitability','opcc_data_year'];
  const header = keys.join(',');
  const rows = sel.map(r=> keys.map(k=> `"${String(r[k]||'').replace(/"/g,'""')}"`).join(','));
  const csv = [header].concat(rows).join('\\n');
  downloadBlob(csv,'variety-comparison.csv','text/csv');
}
function downloadSelectedJSON(){
  const sel = Array.from(compareSelection).map(s=> varieties.find(v=>slugify(v.name)===s)).filter(Boolean);
  if(sel.length===0){ alert('Select varieties to download'); return; }
  downloadBlob(JSON.stringify(sel,null,2),'variety-comparison.json','application/json');
}

/* label helper */
function labelFor(k){
  const map = {
    'yield_lbs_per_acre':'Yield (lbs/acre)',
    'yield_kg_ha':'Yield (kg/ha)',
    'maturity_days':'Maturity (days)',
    'hundred_sd_weight_g':'100 Sd Weight (g)',
    'direct_harvest_suitability':'Direct harvest suitability'
  };
  return map[k]||k;
}

/* Modal for view/edit & upload local image */
function openModal(v){
  const modal = document.getElementById('modal');
  const content = document.getElementById('modalContent');
  const slug = slugify(v.name);
  content.innerHTML = `
    <h2>${v.name} <small style="color:var(--muted);font-weight:600"> — ${v.market_class || ''} (${v.year||''})</small></h2>
    <div style="display:flex;gap:12px;flex-wrap:wrap;">
      <div style="flex:0 0 280px;">
        <img id="modalImage" src="/assets/images/varieties/${slug}.jpg" alt="${v.name}" style="width:100%;border-radius:8px;border:1px solid #eee" onerror="this.src='https://via.placeholder.com/600x300?text=No+photo'"/>
        <div style="margin-top:8px;">
          <label class="btn small" style="display:inline-block;cursor:pointer;color:white">
            Upload photo <input id="fileInput" type="file" accept="image/*" style="display:none" />
          </label>
          <button id="clearImage" class="btn secondary small">Clear</button>
          <button id="downloadVariety" class="btn small" style="margin-left:8px">Download JSON</button>
        </div>
      </div>
      <div style="flex:1">
        <table style="width:100%">
          <tr><td><strong>Yield (lbs/acre)</strong></td><td>${v.yield_lbs_per_acre!==null?v.yield_lbs_per_acre:'—'}</td></tr>
          <tr><td><strong>Yield (kg/ha)</strong></td><td>${v.yield_kg_ha!==null?v.yield_kg_ha:'—'}</td></tr>
          <tr><td><strong>Maturity (days)</strong></td><td>${v.maturity_days!==null?v.maturity_days:'—'}</td></tr>
          <tr><td><strong>100 Sd Wt (g)</strong></td><td>${v.hundred_sd_weight_g!==null?v.hundred_sd_weight_g:'—'}</td></tr>
          <tr><td><strong>Direct harvest</strong></td><td>${v.direct_harvest_suitability!==null?v.direct_harvest_suitability:'—'}</td></tr>
          <tr><td><strong>Disease notes</strong></td><td>CMV R1: ${v.cmv_r1||'—'}, R15: ${v.cmv_r15||'—'}<br>Anthracnose R17/23/73: ${v.anth_r17||v.anth_r17||'—'}/${v.anth_r23||'—'}/${v.anth_r73||'—'}<br>Common Blight: ${v.common_blight||'—'}</td></tr>
        </table>
      </div>
    </div>
    <div style="margin-top:12px; text-align:right;"><button id="closeBtn" class="btn secondary small">Close</button></div>
  `;
  // local file upload storing in localStorage (base64)
  const fileInput = content.querySelector('#fileInput');
  fileInput.onchange = function(e){
    const f = e.target.files[0];
    if(!f) return;
    const reader = new FileReader();
    reader.onload = function(ev){
      const base64 = ev.target.result;
      localStorage.setItem('img_' + slug, base64);
      document.getElementById('modalImage').src = base64;
      // update thumbnails in catalog by forcing reload
      renderCatalog();
    };
    reader.readAsDataURL(f);
  };
  content.querySelector('#clearImage').onclick = function(){
    localStorage.removeItem('img_' + slug);
    document.getElementById('modalImage').src = '/assets/images/varieties/' + slug + '.jpg';
    renderCatalog();
  };
  content.querySelector('#downloadVariety').onclick = function(){
    downloadBlob(JSON.stringify(v,null,2), slug + '.json', 'application/json');
  };
  content.querySelector('#closeBtn').onclick = closeModal;
  document.getElementById('closeModal').onclick = closeModal;

  // if localStorage image exists, show it
  const base64 = localStorage.getItem('img_' + slug);
  if(base64) document.getElementById('modalImage').src = base64;

  modal.style.display = 'flex';
}
function closeModal(){ document.getElementById('modal').style.display='none'; }

/* Attach events */
searchEl.oninput = renderCatalog;
classFilterEl.onchange = renderCatalog;
yearFilterEl.onchange = renderCatalog;
clearBtn.onclick = function(){ searchEl.value=''; classFilterEl.value=''; yearFilterEl.value=''; renderCatalog(); };
plotCompareBtn.onclick = function(){ plotCompare(); plotRadar(); };
boxCompareBtn.onclick = boxCompare;
runStatsBtn.onclick = runStatistics;
exportCsvBtn.onclick = exportSelectedCSV;
downloadJsonBtn.onclick = downloadSelectedJSON;

/* initial render */
(function init(){
  renderCatalog();
  // populate year filter (unique sorted)
  const years = Array.from(new Set(varieties.map(v=>v.year).filter(Boolean))).sort((a,b)=>b-a);
  const ysel = document.getElementById('yearFilter');
  ysel.innerHTML = '<option value="">All Years</option>' + years.map(y=>`<option value="${y}">${y}</option>`).join('');
})();

</script>
