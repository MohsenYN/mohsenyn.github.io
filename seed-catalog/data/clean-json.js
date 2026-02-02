const fs = require("fs");

const raw = require("./uog-varieties.json");

const cleaned = raw.map((r, i) => ({
  id: i + 1,
  name: r["Name"],
  marketClass: r["Market Class"],
  yield_kg_ha: Number(r["yield_kg_ha"]) || null,
  maturity_days: Number(r["maturity_days"]) || null,
  seed_weight_g: Number(r["seed_weight_g"]) || null,
  harvestability: Number(r["Direct Harvest Suitability"]) || null,
  imageUrl: r["imageUrl"] || "",
  resistance: {
    CMV_R1: r["Common Mosaic Virus R1"],
    CMV_R15: r["Common Mosaic Virus R15"],
    Anthracnose_R17: r["Anthracnose R17"],
    Anthracnose_R23: r["Anthracnose R23"],
    Anthracnose_R73: r["Anthracnose R73"],
    CommonBlight: r["Common Blight"],
  },
}));

fs.writeFileSync(
  "uog-varieties-clean.json",
  JSON.stringify(cleaned, null, 2)
);

console.log("✅ Clean JSON written: uog-varieties-clean.json");