---
layout: list
title: Apps
permalink: /apps/
---

<section class="apps-container">
  <div class="app-card" onclick="window.open('https://www.beangpt.ca','_blank')">
    <div class="icon" style="background-image: url('https://via.placeholder.com/100?text=GPT');"></div>
    <div class="info">
      <h2>BeanGPT</h2>
      <p>
        Your AI-powered partner for bean breeding and computational biology. 
        Trained on 300k+ peer-reviewed papers, OPCC field trial data, and multi-omics resources, BeanGPT supports 
        literature synthesis, trait exploration, field trial analysis, predictions, and breeding guidance — accelerating 
        crop improvement for Phaseolus and beyond.
      </p>
    </div>
  </div>

  <div class="app-card" onclick="window.open('https://allinone.shinyapps.io/AllInOne/','_blank')">
    <div class="icon" style="background-image: url('https://via.placeholder.com/100?text=AIO');"></div>
    <div class="info">
      <h2>AllInOne Pre-processing</h2>
      <p>
        An open-source R-Shiny package for pre-processing phenotypic datasets. 
        Offers missing data detection & imputation (MICE), visualization tools, outlier detection, correlation & 
        normalization (bestNormalize), spatial analysis (SpATS), BLUE/BLUP estimation, heritability calculation, and 
        live dataset editing — all in an interactive environment.
      </p>
    </div>
  </div>
</section>

<style>
  body {
    background: #f9f9f9;
  }

  .apps-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 2rem;
    padding: 4rem 2rem;
    font-family: Arial, sans-serif;
  }

  .app-card {
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
    padding: 1.5rem;
    border-radius: 1rem;
    background: white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .app-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  }

  .icon {
    flex-shrink: 0;
    width: 100px;
    height: 100px;
    border-radius: 0.75rem;
    background-size: cover;
    background-position: center;
  }

  .info {
    flex: 1;
  }

  .info h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    color: #333;
  }

  .info p {
    margin: 0;
    font-size: 1rem;
    color: #555;
    line-height: 1.4;
    text-align: justify;
  }
</style>
