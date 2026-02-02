---
layout: default
title: Seed Catalogue
permalink: /seed-catalogue/
---

<h1>University of Guelph Bean Varieties Catalog</h1>

<p style="font-size: 1.1rem; margin-bottom: 2rem;">
Browse and compare dry bean varieties developed by the University of Guelph breeding program.
</p>

<div id="controls" style="margin: 2rem 0; padding: 1.2rem; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.08);">
    <label for="market-class-select" style="font-weight: bold; margin-right: 1rem;">Select Market Class:</label>
    <select id="market-class-select" style="padding: 0.7rem 1.2rem; border-radius: 6px; border: 1px solid #ccc; font-size: 1rem;">
        <option value="">-- All Market Classes --</option>
        <option value="White Navy">White Navy</option>
        <option value="Pinto">Pinto</option>
        <option value="Non-darkening Pinto">Non-darkening Pinto</option>
        <option value="Black">Black</option>
        <option value="Cranberry">Cranberry</option>
        <option value="Dark Red Kidney">Dark Red Kidney</option>
        <option value="Light Red Kidney">Light Red Kidney</option>
        <option value="White Kidney">White Kidney</option>
        <option value="Small Red">Small Red</option>
        <option value="Otebo">Otebo</option>
        <option value="Yellow">Yellow</option>
        <option value="Kintoki">Kintoki</option>
    </select>

    <button id="show-comparison" style="padding: 0.7rem 1.4rem; background: #c8102e; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; margin-left: 1rem;">
        Show Comparison & Charts
    </button>
</div>

<div id="varieties-container"></div>

<div id="comparison-section" style="display: none; margin-top: 3rem;">
    <h2>Comparison Table</h2>
    <div style="overflow-x: auto;">
        <table id="comparison-table" style="width: 100%; border-collapse: collapse; margin: 1.5rem 0; background: white; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
            <thead>
                <tr style="background: #34495e; color: white;">
                    <th style="padding: 0.9rem; border: 1px solid #ddd; text-align: left;">Name</th>
                    <th style="padding: 0.9rem; border: 1px solid #ddd; text-align: left;">Year</th>
                    <th style="padding: 0.9rem; border: 1px solid #ddd; text-align: left;">CMV R1</th>
                    <th style="padding: 0.9rem; border: 1px solid #ddd; text-align: left;">CMV R15</th>
                    <th style="padding: 0.9rem; border: 1px solid #ddd; text-align: left;">Anth R17</th>
                    <th style="padding: 0.9rem; border: 1px solid #ddd; text-align: left;">Anth R23</th>
                    <th style="padding: 0.9rem; border: 1px solid #ddd; text-align: left;">Anth R73</th>
                    <th style="padding: 0.9rem; border: 1px solid #ddd; text-align: left;">Common Blight</th>
                    <th style="padding: 0.9rem; border: 1px solid #ddd; text-align: left;">Yield (lbs/acre)</th>
                    <th style="padding: 0.9rem; border: 1px solid #ddd; text-align: left;">Maturity (days)</th>
                    <th style="padding: 0.9rem; border: 1px solid #ddd; text-align: left;">100 Seed Wt (g)</th>
                    <th style="padding: 0.9rem; border: 1px solid #ddd; text-align: left;">Direct Harvest</th>
                    <th style="padding: 0.9rem; border: 1px solid #ddd; text-align: left;">OPCC Year</th>
                    <th style="padding: 0.9rem; border: 1px solid #ddd; text-align: left;">Yield (kg/ha)</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>

    <div class="chart-container" style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin: 3rem auto; max-width: 1100px;">
        <div class="chart-title" style="text-align: center; font-size: 1.35rem; margin-bottom: 1.2rem; color: #2c3e50;">
            Yield Comparison (lbs/acre) — Bar Chart
        </div>
        <canvas id="bar-chart-yield" height="420"></canvas>
    </div>

    <div class="chart-container" style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin: 3rem auto; max-width: 1100px;">
        <div class="chart-title" style="text-align: center; font-size: 1.35rem; margin-bottom: 1.2rem; color: #2c3e50;">
            Yield vs Maturity — Scatter Plot
        </div>
        <canvas id="scatter-chart" height="420"></canvas>
    </div>
</div>

<style>
    .variety-card {
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 1.6rem;
        margin: 1.8rem 0;
        box-shadow: 0 3px 12px rgba(0,0,0,0.07);
        display: flex;
        flex-wrap: wrap;
        gap: 1.8rem;
    }

    .variety-card h3 {
        width: 100%;
        margin: 0 0 1.2rem 0;
        color: #c8102e;
        font-size: 1.5rem;
    }

    .image-placeholder {
        width: 240px;
        height: 240px;
        background: #f8fafc;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        color: #6b7280;
        font-style: italic;
        text-align: center;
        padding: 1.2rem;
        box-sizing: border-box;
        font-size: 0.95rem;
    }

    .variety-details dl {
        flex: 1;
        display: grid;
        grid-template-columns: 180px 1fr;
        gap: 0.7rem 1.2rem;
        margin: 0;
        min-width: 320px;
    }

    .variety-details dt {
        font-weight: 600;
        color: #374151;
    }

    .variety-details dd {
        margin: 0;
        color: #4b5563;
    }
</style>

<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js"></script>

<script>
// ────────────────────────────────────────────────────────────────────────────────
// DATA (all varieties from your excel)
// ────────────────────────────────────────────────────────────────────────────────
const varieties = [
    { Name: "OAC Thunder", MarketClass: "White Navy", Year: "1977", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "S", AnthracnoseR23: "S", AnthracnoseR73: "S", CommonBlight: "S", Yieldlbsacre: 3015.5, Maturitydays: 93.73684210526316, "100SdWeightg": 22.721052631578946, DirectHarvestSuitability: 2.6470588235294112, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "Ex Rico 23", MarketClass: "White Navy", Year: "1980", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "R", AnthracnoseR23: "S", AnthracnoseR73: "N/A", CommonBlight: "N/A", Yieldlbsacre: 2634, Maturitydays: 99, "100SdWeightg": 19.8, DirectHarvestSuitability: "--", OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Seaforth", MarketClass: "White Navy", Year: "1983", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "R", AnthracnoseR23: "R", AnthracnoseR73: "N/A", CommonBlight: "N/A", Yieldlbsacre: 2027, Maturitydays: 90, "100SdWeightg": 20.1, DirectHarvestSuitability: "--", OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Rico", MarketClass: "White Navy", Year: "1983", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "R", AnthracnoseR23: "R", AnthracnoseR73: "N/A", CommonBlight: "N/A", Yieldlbsacre: 2483, Maturitydays: 100, "100SdWeightg": 20.2, DirectHarvestSuitability: "--", OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Gryphon", MarketClass: "White Navy", Year: "1988", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "R", AnthracnoseR23: "R", AnthracnoseR73: "S", CommonBlight: "N/A", Yieldlbsacre: 3254, Maturitydays: 96, "100SdWeightg": 20.4, DirectHarvestSuitability: 4, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Cygnus", MarketClass: "White Navy", Year: "1988", CommonMosaicVirusR1: "", CommonMosaicVirusR15: "", AnthracnoseR17: "", AnthracnoseR23: "", AnthracnoseR73: "", CommonBlight: "", Yieldlbsacre: "", Maturitydays: "", "100SdWeightg": "", DirectHarvestSuitability: "", OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Sprint", MarketClass: "White Navy", Year: "1988", CommonMosaicVirusR1: "", CommonMosaicVirusR15: "", AnthracnoseR17: "", AnthracnoseR23: "", AnthracnoseR73: "", CommonBlight: "", Yieldlbsacre: "", Maturitydays: "", "100SdWeightg": "", DirectHarvestSuitability: "", OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Laser", MarketClass: "White Navy", Year: "1991", CommonMosaicVirusR1: "", CommonMosaicVirusR15: "", AnthracnoseR17: "", AnthracnoseR23: "", AnthracnoseR73: "", CommonBlight: "", Yieldlbsacre: "", Maturitydays: "", "100SdWeightg": "", DirectHarvestSuitability: "", OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Speedvale", MarketClass: "White Navy", Year: "1991", CommonMosaicVirusR1: "", CommonMosaicVirusR15: "", AnthracnoseR17: "", AnthracnoseR23: "", AnthracnoseR73: "", CommonBlight: "", Yieldlbsacre: "", Maturitydays: "", "100SdWeightg": "", DirectHarvestSuitability: "", OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Tomahawk", MarketClass: "Pinto", Year: "1993", CommonMosaicVirusR1: "", CommonMosaicVirusR15: "", AnthracnoseR17: "", AnthracnoseR23: "", AnthracnoseR73: "", CommonBlight: "", Yieldlbsacre: "", Maturitydays: "", "100SdWeightg": "", DirectHarvestSuitability: "", OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Silvercreek", MarketClass: "White Navy", Year: "1998", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "R", AnthracnoseR23: "R", AnthracnoseR73: "S", CommonBlight: "N/A", Yieldlbsacre: 3172.5, Maturitydays: 95, "100SdWeightg": 21.425, DirectHarvestSuitability: 3.75, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Rex", MarketClass: "White Navy", Year: "2002", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "S", AnthracnoseR23: "S", AnthracnoseR73: "S", CommonBlight: "R", Yieldlbsacre: 3191, Maturitydays: 98.33333333333333, "100SdWeightg": 21.536363636363635, DirectHarvestSuitability: 2.677777777777778, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Rex", MarketClass: "White Navy", Year: "2002", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "S", AnthracnoseR23: "S", AnthracnoseR73: "S", CommonBlight: "R", Yieldlbsacre: 2712.22416, Maturitydays: 97, "100SdWeightg": 21, DirectHarvestSuitability: "", OPCCdatayear: "1996-2004", Yieldkgha: 3040 },
    { Name: "OAC Redstar", MarketClass: "Dark Red Kidney", Year: "2008", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "R", AnthracnoseR23: "S", AnthracnoseR73: "N/A", CommonBlight: "N/A", Yieldlbsacre: 2398, Maturitydays: 97, "100SdWeightg": 59.25, DirectHarvestSuitability: "--", OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Lyrik", MarketClass: "Light Red Kidney", Year: "2008", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "R", AnthracnoseR23: "S", AnthracnoseR73: "N/A", CommonBlight: "N/A", Yieldlbsacre: 2304.1666666666665, Maturitydays: 89.57142857142857, "100SdWeightg": 66.83333333333333, DirectHarvestSuitability: "--", OPCCdatayear: "", Yieldkgha: "" },
    { Name: "Lightning", MarketClass: "White Navy", Year: "2008", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "S", AnthracnoseR23: "S", AnthracnoseR73: "S", CommonBlight: "S", Yieldlbsacre: 2844.8571428571427, Maturitydays: 93.85714285714286, "100SdWeightg": 21.950000000000003, DirectHarvestSuitability: 2.15, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Dublin", MarketClass: "White Navy", Year: "2009", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "S", AnthracnoseR17: "S", AnthracnoseR23: "S", AnthracnoseR73: "S", CommonBlight: "S", Yieldlbsacre: 2965, Maturitydays: 96.75, "100SdWeightg": 21.299999999999997, DirectHarvestSuitability: 3.1166666666666667, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Inferno", MarketClass: "Light Red Kidney", Year: "2011", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "S", AnthracnoseR17: "R", AnthracnoseR23: "S", AnthracnoseR73: "R", CommonBlight: "N/A", Yieldlbsacre: 2549.6666666666665, Maturitydays: 99.83333333333333, "100SdWeightg": 65, DirectHarvestSuitability: 3.3600000000000003, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "Dynasty", MarketClass: "Dark Red Kidney", Year: "2012", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "S", AnthracnoseR17: "R", AnthracnoseR23: "S", AnthracnoseR73: "R", CommonBlight: "N/A", Yieldlbsacre: 2398.6363636363635, Maturitydays: 94.25, "100SdWeightg": 64.63636363636364, DirectHarvestSuitability: 2.9, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "Yeti", MarketClass: "White Kidney", Year: "2013", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "N/A", AnthracnoseR23: "S", AnthracnoseR73: "R", CommonBlight: "N/A", Yieldlbsacre: 2161.5, Maturitydays: 95.5, "100SdWeightg": 58.5, DirectHarvestSuitability: 2.7800000000000002, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "Mist", MarketClass: "White Navy", Year: "2013", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "S", AnthracnoseR23: "S", AnthracnoseR73: "S", CommonBlight: "R", Yieldlbsacre: 3162.777777777778, Maturitydays: 97.22222222222223, "100SdWeightg": 23.2, DirectHarvestSuitability: 1.8571428571428574, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "Bolt", MarketClass: "White Navy", Year: "2013", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "S", AnthracnoseR23: "S", AnthracnoseR73: "R", CommonBlight: "S", Yieldlbsacre: 2777, Maturitydays: 91.7, "100SdWeightg": 24.490000000000002, DirectHarvestSuitability: 1.6800000000000002, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "Fathom", MarketClass: "White Navy", Year: "2014", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "R", CommonBlight: "R", Yieldlbsacre: 2762.2, Maturitydays: 97.4, "100SdWeightg": 23.325, DirectHarvestSuitability: 2.275, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Rosito", MarketClass: "Small Red", Year: "2017", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "S", CommonBlight: "S", Yieldlbsacre: 3326.8333333333335, Maturitydays: 96.16666666666667, "100SdWeightg": 24.066666666666666, DirectHarvestSuitability: 1.9666666666666668, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Vortex", MarketClass: "Black", Year: "2019", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "S", CommonBlight: "R", Yieldlbsacre: 3669.2, Maturitydays: 97, "100SdWeightg": 23.86, DirectHarvestSuitability: 2.28, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Racer", MarketClass: "Cranberry", Year: "2019", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "N/A", CommonBlight: "N/A", Yieldlbsacre: 2002.6666666666667, Maturitydays: 85.66666666666667, "100SdWeightg": 65, DirectHarvestSuitability: 2.8333333333333335, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Plasma", MarketClass: "White Navy", Year: "2019", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "R", CommonBlight: "R", Yieldlbsacre: 3541, Maturitydays: 94, "100SdWeightg": 22.333333333333332, DirectHarvestSuitability: 2.4, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Jewel", MarketClass: "Light Red Kidney", Year: "2019", CommonMosaicVirusR1: "N/A", CommonMosaicVirusR15: "N/A", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "R", CommonBlight: "N/A", Yieldlbsacre: 2161.6666666666665, Maturitydays: 93.33333333333333, "100SdWeightg": 64.33333333333333, DirectHarvestSuitability: 2.6, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Candycane", MarketClass: "Cranberry", Year: "2019", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "R", CommonBlight: "N/A", Yieldlbsacre: 2348, Maturitydays: 90.66666666666667, "100SdWeightg": 67.33333333333333, DirectHarvestSuitability: 2.2666666666666666, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "Rogue", MarketClass: "White Navy", Year: "2020", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "R", CommonBlight: "R", Yieldlbsacre: 3250.25, Maturitydays: 97, "100SdWeightg": 20.425000000000004, DirectHarvestSuitability: 3.2750000000000004, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Snowshoe", MarketClass: "White Kidney", Year: "2020", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "R", CommonBlight: "N/A", Yieldlbsacre: 2357, Maturitydays: 92, "100SdWeightg": 62.666666666666664, DirectHarvestSuitability: 2.9, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Navabi", MarketClass: "Cranberry", Year: "2020", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "R", CommonBlight: "N/A", Yieldlbsacre: 2225.6666666666665, Maturitydays: 83.25, "100SdWeightg": 61.25, DirectHarvestSuitability: 2.325, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Jasper", MarketClass: "Dark Red Kidney", Year: "2020", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "R", CommonBlight: "N/A", Yieldlbsacre: 1859.5, Maturitydays: 90.5, "100SdWeightg": 64, DirectHarvestSuitability: 2.7, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Firestripe", MarketClass: "Cranberry", Year: "2020", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "R", CommonBlight: "N/A", Yieldlbsacre: 2212.5, Maturitydays: 89, "100SdWeightg": 68.5, DirectHarvestSuitability: 2.2, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "Gallantry", MarketClass: "Dark Red Kidney", Year: "2020", CommonMosaicVirusR1: "N/A", CommonMosaicVirusR15: "N/A", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "R", CommonBlight: "N/A", Yieldlbsacre: 2303.25, Maturitydays: 88.25, "100SdWeightg": 58, DirectHarvestSuitability: 2.525, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Marker", MarketClass: "White Navy", Year: "2021", CommonMosaicVirusR1: "N/A", CommonMosaicVirusR15: "N/A", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "N/A", CommonBlight: "N/A", Yieldlbsacre: 3384, Maturitydays: 93, "100SdWeightg": 21.7, DirectHarvestSuitability: 2.2, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Iceberg", MarketClass: "White Kidney", Year: "2021", CommonMosaicVirusR1: "N/A", CommonMosaicVirusR15: "N/A", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "R", CommonBlight: "N/A", Yieldlbsacre: 2160, Maturitydays: 94, "100SdWeightg": 56, DirectHarvestSuitability: 2.9, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Fusion", MarketClass: "White Navy", Year: "2021", CommonMosaicVirusR1: "N/A", CommonMosaicVirusR15: "N/A", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "R", CommonBlight: "S", Yieldlbsacre: 2962, Maturitydays: 90, "100SdWeightg": 20, DirectHarvestSuitability: 1.9, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Firebrand", MarketClass: "Light Red Kidney", Year: "2021", CommonMosaicVirusR1: "N/A", CommonMosaicVirusR15: "N/A", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "R", CommonBlight: "N/A", Yieldlbsacre: 2518.3333333333335, Maturitydays: 91, "100SdWeightg": 55.333333333333336, DirectHarvestSuitability: 2.7999999999999994, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Equinox", MarketClass: "White Navy", Year: "2021", CommonMosaicVirusR1: "N/A", CommonMosaicVirusR15: "N/A", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "S", CommonBlight: "N/A", Yieldlbsacre: 3711, Maturitydays: 97, "100SdWeightg": 25.8, DirectHarvestSuitability: 1.8, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Charm", MarketClass: "White Navy", Year: "2021", CommonMosaicVirusR1: "N/A", CommonMosaicVirusR15: "N/A", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "R", CommonBlight: "R", Yieldlbsacre: 3271, Maturitydays: 93.66666666666667, "100SdWeightg": 23, DirectHarvestSuitability: 2.05, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Award", MarketClass: "White Navy", Year: "2021", CommonMosaicVirusR1: "N/A", CommonMosaicVirusR15: "N/A", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "S", CommonBlight: "N/A", Yieldlbsacre: 3703, Maturitydays: 97, "100SdWeightg": 23.1, DirectHarvestSuitability: 2.4, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Seal", MarketClass: "White Navy", Year: "2022", CommonMosaicVirusR1: "N/A", CommonMosaicVirusR15: "N/A", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "N/A", CommonBlight: "N/A", Yieldlbsacre: 2936, Maturitydays: 98, "100SdWeightg": 23.7, DirectHarvestSuitability: 2.7, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Souper", MarketClass: "White Navy", Year: "2022", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "S", CommonBlight: "MR", Yieldlbsacre: 3355.485219, Maturitydays: 102.6, "100SdWeightg": 22.1, DirectHarvestSuitability: 2.8, OPCCdatayear: "2020", Yieldkgha: 3761 },
    { Name: "Stavros", MarketClass: "Cranberry", Year: "2022", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "R", CommonBlight: "MR", Yieldlbsacre: 2349.107307, Maturitydays: 85.1, "100SdWeightg": 51.7, DirectHarvestSuitability: 1.8, OPCCdatayear: "2020", Yieldkgha: 2633 },
    { Name: "OAC Sunrise", MarketClass: "Kintoki", Year: "2022", CommonMosaicVirusR1: "N/A", CommonMosaicVirusR15: "N/A", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "R", CommonBlight: "S", Yieldlbsacre: 2618.9914545, Maturitydays: 95, "100SdWeightg": 60.6, DirectHarvestSuitability: 3.4, OPCCdatayear: "2018+2019", Yieldkgha: 2935.5 },
    { Name: "OAC Blaze", MarketClass: "Non-darkening Pinto", Year: "2022", CommonMosaicVirusR1: "N/A", CommonMosaicVirusR15: "N/A", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "S", CommonBlight: "N/A", Yieldlbsacre: 2383.6301734050003, Maturitydays: 87.545, "100SdWeightg": 39.37804878048781, DirectHarvestSuitability: 2.5966666666666662, OPCCdatayear: "2018+2020", Yieldkgha: 2671.695 },
    { Name: "XPT One", MarketClass: "Non-darkening Pinto", Year: "2022", CommonMosaicVirusR1: "N/A", CommonMosaicVirusR15: "N/A", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "S", CommonBlight: "N/A", Yieldlbsacre: 2495.33841903, Maturitydays: 88.06666666666666, "100SdWeightg": 40.16682926829268, DirectHarvestSuitability: 2.115, OPCCdatayear: "2018+2020", Yieldkgha: 2796.903333333333 },
    { Name: "OAC Paint", MarketClass: "Non-darkening Pinto", Year: "2022", CommonMosaicVirusR1: "N/A", CommonMosaicVirusR15: "N/A", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "S", CommonBlight: "S", Yieldlbsacre: 2744.7500324100006, Maturitydays: 97.08333333333333, "100SdWeightg": 37.04823170731708, DirectHarvestSuitability: 3.111666666666667, OPCCdatayear: "2018+2020", Yieldkgha: 3076.456666666667 },
    { Name: "Umbra", MarketClass: "Black", Year: "2023", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "S", CommonBlight: "S", Yieldlbsacre: 3710, Maturitydays: 98, "100SdWeightg": 23.5, DirectHarvestSuitability: 1.9, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "Steam", MarketClass: "White Navy", Year: "2023", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "S", CommonBlight: "S", Yieldlbsacre: 3533, Maturitydays: 97, "100SdWeightg": 22.2, DirectHarvestSuitability: 1.9, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Volterra", MarketClass: "Cranberry", Year: "2023", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "R", CommonBlight: "N/A", Yieldlbsacre: 2754, Maturitydays: 86, "100SdWeightg": 66, DirectHarvestSuitability: 2, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Resilient", MarketClass: "White Navy", Year: "2023", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "R", CommonBlight: "S", Yieldlbsacre: 3469, Maturitydays: 97, "100SdWeightg": 18.9, DirectHarvestSuitability: 2, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Bechamel", MarketClass: "White Navy", Year: "2023", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "R", CommonBlight: "R", Yieldlbsacre: 3430, Maturitydays: 97, "100SdWeightg": 20.9, DirectHarvestSuitability: 2.5, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Agate", MarketClass: "Cranberry", Year: "2023", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "R", CommonBlight: "N/A", Yieldlbsacre: 2757, Maturitydays: 85, "100SdWeightg": 61, DirectHarvestSuitability: 2.3, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "Blast", MarketClass: "White Navy", Year: "2023", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "R", CommonBlight: "S", Yieldlbsacre: 3446, Maturitydays: 95, "100SdWeightg": 21.7, DirectHarvestSuitability: 2, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "Bannock", MarketClass: "Black", Year: "2023", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "S", CommonBlight: "S", Yieldlbsacre: 3785, Maturitydays: 98, "100SdWeightg": 23.5, DirectHarvestSuitability: 1.6, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Tong", MarketClass: "Dark Red Kidney", Year: "2023", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "S", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "R", CommonBlight: "S", Yieldlbsacre: 1840.2976233, Maturitydays: 89.4, "100SdWeightg": 72.9, DirectHarvestSuitability: 2.9, OPCCdatayear: "2022", Yieldkgha: 2062.7 },
    { Name: "Eternal", MarketClass: "Non-darkening Pinto", Year: "2023", CommonMosaicVirusR1: "N/A", CommonMosaicVirusR15: "N/A", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "S", CommonBlight: "S", Yieldlbsacre: 1984.0276602000004, Maturitydays: 89.9, "100SdWeightg": 36.4, DirectHarvestSuitability: 3.3, OPCCdatayear: "2021+2020", Yieldkgha: 2223.8 },
    { Name: "OAC Endeavour", MarketClass: "Dark Red Kidney", Year: "2023", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "R", CommonBlight: "S", Yieldlbsacre: 1911.2258537999999, Maturitydays: 92, "100SdWeightg": 73.6, DirectHarvestSuitability: 2.9, OPCCdatayear: "2022", Yieldkgha: 2142.2 },
    { Name: "OAC Märzen", MarketClass: "Light Red Kidney", Year: "2023", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "S", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "R", CommonBlight: "S", Yieldlbsacre: 1900.7873595, Maturitydays: 92, "100SdWeightg": 68.4, DirectHarvestSuitability: 4.4, OPCCdatayear: "2022", Yieldkgha: 2130.5 },
    { Name: "OAC Toast", MarketClass: "Pinto", Year: "2023", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "S", CommonBlight: "MS", Yieldlbsacre: 3742.9585587000006, Maturitydays: 89.9, "100SdWeightg": 42, DirectHarvestSuitability: 3.1, OPCCdatayear: "2023", Yieldkgha: 4195.3 },
    { Name: "OAC Clever", MarketClass: "White Navy", Year: "2024", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "R", CommonBlight: "MR", Yieldlbsacre: 3253.9552488, Maturitydays: 91.1, "100SdWeightg": 19.8, DirectHarvestSuitability: 2.1, OPCCdatayear: "2023", Yieldkgha: 3647.2 },
    { Name: "OAC Storm", MarketClass: "White Navy", Year: "2024", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "R", CommonBlight: "MR", Yieldlbsacre: 3005.751051, Maturitydays: 89.3, "100SdWeightg": 19.5, DirectHarvestSuitability: 1.8, OPCCdatayear: "2024", Yieldkgha: 3369 },
    { Name: "OAC Spades", MarketClass: "Black", Year: "2024", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "R", CommonBlight: "MR", Yieldlbsacre: 3376.1837718, Maturitydays: 92.3, "100SdWeightg": 24.3, DirectHarvestSuitability: 1.5, OPCCdatayear: "2024", Yieldkgha: 3784.2 },
    { Name: "OAC Rev", MarketClass: "Dark Red Kidney", Year: "2024", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "N/A", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "R", CommonBlight: "S", Yieldlbsacre: 2974.6140039, Maturitydays: 98.1, "100SdWeightg": 69.8, DirectHarvestSuitability: 3.5, OPCCdatayear: "2023", Yieldkgha: 3334.1 },
    { Name: "Sundust", MarketClass: "Otebo", Year: "2025", CommonMosaicVirusR1: "N/A", CommonMosaicVirusR15: "N/A", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "S", CommonBlight: "N/A", Yieldlbsacre: 1954.9247812199999, Maturitydays: 95.25, "100SdWeightg": 27.64, DirectHarvestSuitability: 3.83, OPCCdatayear: "2023", Yieldkgha: 2191.18 },
    { Name: "Stardust", MarketClass: "Otebo", Year: "2025", CommonMosaicVirusR1: "N/A", CommonMosaicVirusR15: "N/A", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "S", CommonBlight: "N/A", Yieldlbsacre: 2616.5558058300003, Maturitydays: 101.75, "100SdWeightg": 28.98, DirectHarvestSuitability: 3.25, OPCCdatayear: "2023", Yieldkgha: 2932.77 },
    { Name: "OAC Glacier", MarketClass: "Otebo", Year: "2025", CommonMosaicVirusR1: "N/A", CommonMosaicVirusR15: "N/A", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "S", CommonBlight: "N/A", Yieldlbsacre: 2335.84060527, Maturitydays: 101.5, "100SdWeightg": 27.03, DirectHarvestSuitability: 2.63, OPCCdatayear: "2023", Yieldkgha: 2618.13 },
    { Name: "Yolk", MarketClass: "Yellow", Year: "2025", CommonMosaicVirusR1: "N/A", CommonMosaicVirusR15: "N/A", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "R", CommonBlight: "N/A", Yieldlbsacre: 3276.46492497, Maturitydays: 107.67, "100SdWeightg": 61.46, DirectHarvestSuitability: 3.79, OPCCdatayear: "2023", Yieldkgha: 3672.43 },
    { Name: "Yak", MarketClass: "Yellow", Year: "2025", CommonMosaicVirusR1: "N/A", CommonMosaicVirusR15: "N/A", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "S", CommonBlight: "N/A", Yieldlbsacre: 2792.3418342000004, Maturitydays: 102.42, "100SdWeightg": 57.59, DirectHarvestSuitability: 3.13, OPCCdatayear: "2023", Yieldkgha: 3129.8 },
    { Name: "Wake", MarketClass: "White Navy", Year: "2025", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "S", CommonBlight: "N/A", Yieldlbsacre: 3088.8129159, Maturitydays: 88.5, "100SdWeightg": 22.3, DirectHarvestSuitability: 2.8, OPCCdatayear: "2024", Yieldkgha: 3462.1 },
    { Name: "OAC Copperhead", MarketClass: "Light Red Kidney", Year: "2025", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "R", CommonBlight: "N/A", Yieldlbsacre: 2359.9918908, Maturitydays: 89.6, "100SdWeightg": 49.4, DirectHarvestSuitability: 4.1, OPCCdatayear: "2024", Yieldkgha: 2645.2 }
];

let barChart = null;
let scatterChart = null;

const marketSelect = document.getElementById('market-class-select');
const showBtn = document.getElementById('show-comparison');

showBtn.addEventListener('click', updateDisplay);
marketSelect.addEventListener('change', updateDisplay);

function updateDisplay() {
    const selected = marketSelect.value;
    const filtered = selected ? varieties.filter(v => v.MarketClass === selected) : varieties;

    renderVarieties(filtered, selected || "All Market Classes");

    document.getElementById('comparison-section').style.display = filtered.length > 0 ? 'block' : 'none';

    if (filtered.length > 0) {
        renderComparisonTable(filtered);
        renderYieldBarChart(filtered);
        renderScatterPlot(filtered);
    }
}

function renderVarieties(filtered, title) {
    const container = document.getElementById('varieties-container');
    container.innerHTML = `<h2 style="margin-top: 2.5rem;">${title}</h2>`;

    filtered.forEach(v => {
        const card = document.createElement('div');
        card.className = 'variety-card';

        card.innerHTML = `
            <h3>${v.Name} (${v.Year})</h3>
            <div class="image-placeholder">Bean variety: ${v.Name}<br>(replace with actual photo)</div>
            <div class="variety-details">
                <dl>
                    <dt>Market Class</dt><dd>${v.MarketClass}</dd>
                    <dt>CMV R1</dt><dd>${v.CommonMosaicVirusR1 || '–'}</dd>
                    <dt>CMV R15</dt><dd>${v.CommonMosaicVirusR15 || '–'}</dd>
                    <dt>Anthracnose R17</dt><dd>${v.AnthracnoseR17 || '–'}</dd>
                    <dt>Anthracnose R23</dt><dd>${v.AnthracnoseR23 || '–'}</dd>
                    <dt>Anthracnose R73</dt><dd>${v.AnthracnoseR73 || '–'}</dd>
                    <dt>Common Blight</dt><dd>${v.CommonBlight || '–'}</dd>
                    <dt>Yield (lbs/acre)</dt><dd>${v.Yieldlbsacre ? Number(v.Yieldlbsacre).toFixed(1) : '–'}</dd>
                    <dt>Maturity (days)</dt><dd>${v.Maturitydays ? Number(v.Maturitydays).toFixed(1) : '–'}</dd>
                    <dt>100 Seed Weight (g)</dt><dd>${v['100SdWeightg'] ? Number(v['100SdWeightg']).toFixed(1) : '–'}</dd>
                    <dt>Direct Harvest Suitability</dt><dd>${v.DirectHarvestSuitability || '–'}</dd>
                    <dt>OPCC data year</dt><dd>${v.OPCCdatayear || '–'}</dd>
                    <dt>Yield (kg/ha)</dt><dd>${v.Yieldkgha || '–'}</dd>
                </dl>
            </div>
        `;

        container.appendChild(card);
    });
}

function renderComparisonTable(filtered) {
    const tbody = document.getElementById('comparison-table').querySelector('tbody');
    tbody.innerHTML = '';

    filtered.forEach(v => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${v.Name}</td>
            <td>${v.Year}</td>
            <td>${v.CommonMosaicVirusR1 || '–'}</td>
            <td>${v.CommonMosaicVirusR15 || '–'}</td>
            <td>${v.AnthracnoseR17 || '–'}</td>
            <td>${v.AnthracnoseR23 || '–'}</td>
            <td>${v.AnthracnoseR73 || '–'}</td>
            <td>${v.CommonBlight || '–'}</td>
            <td>${v.Yieldlbsacre ? Number(v.Yieldlbsacre).toFixed(1) : '–'}</td>
            <td>${v.Maturitydays ? Number(v.Maturitydays).toFixed(1) : '–'}</td>
            <td>${v['100SdWeightg'] ? Number(v['100SdWeightg']).toFixed(1) : '–'}</td>
            <td>${v.DirectHarvestSuitability || '–'}</td>
            <td>${v.OPCCdatayear || '–'}</td>
            <td>${v.Yieldkgha || '–'}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderYieldBarChart(filtered) {
    const ctx = document.getElementById('bar-chart-yield').getContext('2d');
    if (barChart) barChart.destroy();

    const sorted = [...filtered].sort((a,b) => (b.Yieldlbsacre || 0) - (a.Yieldlbsacre || 0));

    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sorted.map(v => v.Name),
            datasets: [{
                label: 'Yield (lbs/acre)',
                data: sorted.map(v => v.Yieldlbsacre || 0),
                backgroundColor: 'rgba(200, 16, 46, 0.68)',
                borderColor: '#c8102e',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Yield (lbs/acre)' } },
                x: { ticks: { autoSkip: false, maxRotation: 50, minRotation: 45 } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

function renderScatterPlot(filtered) {
    const ctx = document.getElementById('scatter-chart').getContext('2d');
    if (scatterChart) scatterChart.destroy();

    const validData = filtered
        .filter(v => !isNaN(parseFloat(v.Yieldlbsacre)) && !isNaN(parseFloat(v.Maturitydays)))
        .map(v => ({
            x: parseFloat(v.Maturitydays),
            y: parseFloat(v.Yieldlbsacre),
            name: v.Name
        }));

    scatterChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Varieties',
                data: validData,
                backgroundColor: 'rgba(70, 130, 180, 0.75)',
                borderColor: 'rgba(70, 130, 180, 1)',
                pointRadius: 7,
                pointHoverRadius: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: 'Maturity (days)' } },
                y: { title: { display: true, text: 'Yield (lbs/acre)' }, beginAtZero: true }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.raw.name}: ${ctx.parsed.y.toFixed(1)} lbs/acre @ ${ctx.parsed.x.toFixed(1)} days`
                    }
                }
            }
        }
    });
}

// Load all varieties on page open
updateDisplay();
</script>
