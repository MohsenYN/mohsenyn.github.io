---
layout: default
title: Seed Catalogue
permalink: /seed-catalogue/
---

<h1>University of Guelph Bean Varieties Catalog</h1>

<p>Browse and compare dry bean varieties developed by the University of Guelph breeding program.</p>

<div id="controls">
    <label for="market-class-select"><strong>Select Market Class:</strong></label>
    <select id="market-class-select">
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

    <button id="show-comparison">Show Comparison & Charts</button>
</div>

<div id="varieties-container"></div>

<div id="comparison-section" style="display: none;">
    <h2>Comparison Table</h2>
    <table id="comparison-table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Year</th>
                <th>CMV R1</th>
                <th>CMV R15</th>
                <th>Anth R17</th>
                <th>Anth R23</th>
                <th>Anth R73</th>
                <th>Common Blight</th>
                <th>Yield (lbs/acre)</th>
                <th>Maturity (days)</th>
                <th>100 Seed Wt (g)</th>
                <th>Direct Harvest</th>
                <th>OPCC Year</th>
                <th>Yield (kg/ha)</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>

    <div class="chart-container">
        <div class="chart-title">Yield Comparison (lbs/acre) — Bar Chart</div>
        <canvas id="bar-chart-yield" height="400"></canvas>
    </div>

    <div class="chart-container">
        <div class="chart-title">Yield vs Maturity — Scatter Plot</div>
        <canvas id="scatter-chart" height="400"></canvas>
    </div>
</div>

<style>
    body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        background-color: #f8f9fa;
        color: #333;
    }
    h1, h2, h3 {
        color: #2c3e50;
    }
    #controls {
        margin: 2rem 0;
        padding: 1rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    select, button {
        padding: 0.6rem 1.2rem;
        margin-right: 1rem;
        border-radius: 6px;
        border: 1px solid #ccc;
        font-size: 1rem;
    }
    button {
        background: #c8102e;          /* Guelph red */
        color: white;
        border: none;
        cursor: pointer;
    }
    button:hover {
        background: #a00d24;
    }
    .variety-card {
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 1.5rem;
        margin: 1.5rem 0;
        box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        display: flex;
        flex-wrap: wrap;
        gap: 1.5rem;
    }
    .variety-card h3 {
        width: 100%;
        margin: 0 0 1rem 0;
        color: #c8102e;
    }
    .image-placeholder {
        width: 220px;
        height: 220px;
        background: #f0f4f8;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        color: #666;
        font-style: italic;
        text-align: center;
        padding: 1rem;
        box-sizing: border-box;
    }
    .variety-details dl {
        display: grid;
        grid-template-columns: 180px 1fr;
        gap: 0.6rem 1rem;
        margin: 0;
    }
    .variety-details dt {
        font-weight: bold;
        color: #444;
    }
    #comparison-table {
        width: 100%;
        border-collapse: collapse;
        margin: 2rem 0;
        background: white;
        box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    }
    #comparison-table th, #comparison-table td {
        border: 1px solid #ddd;
        padding: 0.8rem 1rem;
        text-align: left;
    }
    #comparison-table th {
        background: #34495e;
        color: white;
    }
    #comparison-table tr:nth-child(even) {
        background: #f9fcff;
    }
    .chart-container {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        margin: 2.5rem auto;
        max-width: 1100px;
    }
    .chart-title {
        text-align: center;
        font-size: 1.3rem;
        margin-bottom: 1rem;
        color: #2c3e50;
    }
</style>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<script>
// ────────────────────────────────────────────────────────────────────────────────
// DATA ────────────────────────────────────────────────────────────────────────────
const varieties = [
    { Name: "OAC Thunder", MarketClass: "White Navy", Year: "1977", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "S", AnthracnoseR23: "S", AnthracnoseR73: "S", CommonBlight: "S", Yieldlbsacre: 3015.5, Maturitydays: 93.7, "100SdWeightg": 22.7, DirectHarvestSuitability: 2.65, OPCCdatayear: "", Yieldkgha: "" },
    { Name: "Ex Rico 23", MarketClass: "White Navy", Year: "1980", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "R", AnthracnoseR23: "S", AnthracnoseR73: "N/A", CommonBlight: "N/A", Yieldlbsacre: 2634, Maturitydays: 99, "100SdWeightg": 19.8, DirectHarvestSuitability: "--", OPCCdatayear: "", Yieldkgha: "" },
    { Name: "OAC Seaforth", MarketClass: "White Navy", Year: "1983", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "R", AnthracnoseR23: "R", AnthracnoseR73: "N/A", CommonBlight: "N/A", Yieldlbsacre: 2027, Maturitydays: 90, "100SdWeightg": 20.1, DirectHarvestSuitability: "--", OPCCdatayear: "", Yieldkgha: "" },
    // ... paste ALL the other variety objects here (I shortened it for readability)
    // Make sure you copy the complete array from your previous version
    { Name: "OAC Copperhead", MarketClass: "Light Red Kidney", Year: "2025", CommonMosaicVirusR1: "R", CommonMosaicVirusR15: "R", AnthracnoseR17: "N/A", AnthracnoseR23: "N/A", AnthracnoseR73: "R", CommonBlight: "N/A", Yieldlbsacre: 2359.99, Maturitydays: 89.6, "100SdWeightg": 49.4, DirectHarvestSuitability: 4.1, OPCCdatayear: "2024", Yieldkgha: 2645.2 }
];

// ────────────────────────────────────────────────────────────────────────────────
// VARIABLES & EVENT LISTENERS
// ────────────────────────────────────────────────────────────────────────────────
let barChart = null;
let scatterChart = null;

const marketSelect   = document.getElementById("market-class-select");
const showBtn        = document.getElementById("show-comparison");

showBtn.addEventListener("click", updateDisplay);
marketSelect.addEventListener("change", updateDisplay);

// Run once on load
updateDisplay();

// ────────────────────────────────────────────────────────────────────────────────
// FUNCTIONS
// ────────────────────────────────────────────────────────────────────────────────
function updateDisplay() {
    const selected = marketSelect.value;
    const filtered = selected ? varieties.filter(v => v.MarketClass === selected) : varieties;

    renderVarieties(filtered, selected || "All Market Classes");

    if (filtered.length > 0) {
        document.getElementById("comparison-section").style.display = "block";
        renderComparisonTable(filtered);
        renderYieldBarChart(filtered);
        renderScatterPlot(filtered);
    } else {
        document.getElementById("comparison-section").style.display = "none";
    }
}

function renderVarieties(filtered, title) {
    const container = document.getElementById("varieties-container");
    container.innerHTML = "";

    if (!filtered.length) return;

    const section = document.createElement("div");
    section.innerHTML = `<h2>${title}</h2>`;

    filtered.forEach(v => {
        const card = document.createElement("div");
        card.className = "variety-card";

        card.innerHTML = `
            <h3>${v.Name} (${v.Year})</h3>
            <div class="image-placeholder">Image: ${v.Name}<br>(replace later with real photo)</div>
            <div class="variety-details">
                <dl>
                    <dt>Market Class</dt>      <dd>${v.MarketClass}</dd>
                    <dt>CMV R1</dt>             <dd>${v.CommonMosaicVirusR1 || "–"}</dd>
                    <dt>CMV R15</dt>            <dd>${v.CommonMosaicVirusR15 || "–"}</dd>
                    <dt>Anthracnose R17</dt>    <dd>${v.AnthracnoseR17 || "–"}</dd>
                    <dt>Anthracnose R23</dt>    <dd>${v.AnthracnoseR23 || "–"}</dd>
                    <dt>Anthracnose R73</dt>    <dd>${v.AnthracnoseR73 || "–"}</dd>
                    <dt>Common Blight</dt>      <dd>${v.CommonBlight || "–"}</dd>
                    <dt>Yield (lbs/acre)</dt>   <dd>${v.Yieldlbsacre ? v.Yieldlbsacre.toFixed(1) : "–"}</dd>
                    <dt>Maturity (days)</dt>    <dd>${v.Maturitydays ? v.Maturitydays.toFixed(1) : "–"}</dd>
                    <dt>100 Seed Weight (g)</dt><dd>${v["100SdWeightg"] ? v["100SdWeightg"].toFixed(1) : "–"}</dd>
                    <dt>Direct Harvest</dt>     <dd>${v.DirectHarvestSuitability || "–"}</dd>
                    <dt>OPCC Year</dt>          <dd>${v.OPCCdatayear || "–"}</dd>
                    <dt>Yield (kg/ha)</dt>      <dd>${v.Yieldkgha || "–"}</dd>
                </dl>
            </div>
        `;

        section.appendChild(card);
    });

    container.appendChild(section);
}

function renderComparisonTable(filtered) {
    const tbody = document.getElementById("comparison-table").querySelector("tbody");
    tbody.innerHTML = "";

    filtered.forEach(v => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${v.Name}</td>
            <td>${v.Year}</td>
            <td>${v.CommonMosaicVirusR1 || "–"}</td>
            <td>${v.CommonMosaicVirusR15 || "–"}</td>
            <td>${v.AnthracnoseR17 || "–"}</td>
            <td>${v.AnthracnoseR23 || "–"}</td>
            <td>${v.AnthracnoseR73 || "–"}</td>
            <td>${v.CommonBlight || "–"}</td>
            <td>${v.Yieldlbsacre ? v.Yieldlbsacre.toFixed(1) : "–"}</td>
            <td>${v.Maturitydays ? v.Maturitydays.toFixed(1) : "–"}</td>
            <td>${v["100SdWeightg"] ? v["100SdWeightg"].toFixed(1) : "–"}</td>
            <td>${v.DirectHarvestSuitability || "–"}</td>
            <td>${v.OPCCdatayear || "–"}</td>
            <td>${v.Yieldkgha || "–"}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderYieldBarChart(filtered) {
    const ctx = document.getElementById("bar-chart-yield").getContext("2d");
    if (barChart) barChart.destroy();

    const sorted = [...filtered].sort((a,b) => (b.Yieldlbsacre || 0) - (a.Yieldlbsacre || 0));

    barChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: sorted.map(v => v.Name),
            datasets: [{
                label: "Yield (lbs/acre)",
                data: sorted.map(v => v.Yieldlbsacre || 0),
                backgroundColor: "rgba(200, 16, 46, 0.65)",   // Guelph red
                borderColor: "rgba(200, 16, 46, 0.9)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, title: { display: true, text: "Yield (lbs/acre)" } },
                x: { ticks: { autoSkip: false, maxRotation: 45, minRotation: 45 } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

function renderScatterPlot(filtered) {
    const ctx = document.getElementById("scatter-chart").getContext("2d");
    if (scatterChart) scatterChart.destroy();

    const data = filtered
        .filter(v => !isNaN(parseFloat(v.Yieldlbsacre)) && !isNaN(parseFloat(v.Maturitydays)))
        .map(v => ({
            x: parseFloat(v.Maturitydays),
            y: parseFloat(v.Yieldlbsacre),
            name: v.Name
        }));

    scatterChart = new Chart(ctx, {
        type: "scatter",
        data: {
            datasets: [{
                label: "Varieties",
                data: data,
                backgroundColor: "rgba(70, 130, 180, 0.7)",
                borderColor: "rgba(70, 130, 180, 1)",
                pointRadius: 6,
                pointHoverRadius: 9
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: "Maturity (days)" } },
                y: { title: { display: true, text: "Yield (lbs/acre)" }, beginAtZero: true }
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
</script>
