---
layout: list
permalink: /AI & Analysis Hub/
accent_image: /assets/img/Resources.png
---

<section class="apps-container">

  <!-- BeanGPT -->
  <div class="app-box beangpt" onclick="window.open('https://www.beangpt.ca','_blank')">
    <div class="icon" style="background-image: url('/assets/icon/beangpt-logo.png');"></div>
    <div class="info">
      <h2>BeanGPT</h2>
      <p>
        Your AI-powered partner for bean breeding and computational biology. 
        Trained on 300k+ peer-reviewed papers, OPCC field trial data, and multi-omics resources, BeanGPT supports 
        literature synthesis, trait exploration, field trial analysis, predictions, and breeding tips, accelerating 
        crop improvement for Phaseolus and beyond.
      </p>
    </div>
  </div>

  <!-- AllInOne -->
  <div class="app-box allinone" onclick="window.open('https://allinone.shinyapps.io/AllInOne/','_blank')">
    <div class="icon" style="background-image: url('/assets/icon/allinone-logo.png');"></div>
    <div class="info">
      <h2>AllInOne Pre-processing</h2>
      <p>
        An open-source R-Shiny package for pre-processing phenotypic datasets. 
        Offers missing data detection & imputation (MICE), visualization tools, outlier detection, correlation & 
        normalization (bestNormalize), spatial analysis (SpATS), BLUE/BLUP estimation, heritability calculation, and 
        live dataset editing, all in an interactive environment.
      </p>
      <div class="paper-link-container">
       <a href="https://www.sciencedirect.com/science/article/pii/S2352711023001607" class="paper-link" target="_blank" onclick="event.stopPropagation();">📄 Read the Research Paper</a>
    </div>
  </div>

<style>
  body {
    background: #f5f5f5;
    font-family: Arial, sans-serif;
  }

  .apps-container {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    padding: 3rem 1rem;
    max-width: 900px;
    margin: auto;
  }

  .app-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 2rem;
    border-radius: 1.5rem;
    color: white;
    cursor: pointer;
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .app-box:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 12px 28px rgba(0,0,0,0.25);
  }

  .beangpt {
    background: linear-gradient(135deg, #8e44ad, #c0392b);
  }

  .allinone {
    background: linear-gradient(135deg, #16a085, #27ae60);
  }

  .icon {
    width: 120px;
    height: 120px;
    border-radius: 1rem;
    background-size: cover;
    background-position: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }

  .info {
    text-align: center;
    max-width: 700px;
  }

  .info h2 {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }

  .info p {
    font-size: 1.1rem;
    line-height: 1.6;
    color: rgba(255,255,255,0.9);
  }

  .paper-link {
    display: inline-block;
    margin-top: 1rem;
    padding: 0.6rem 1.2rem;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 0.5rem;
    color: #fff;
    font-weight: bold;
    text-decoration: none;
    transition: background 0.3s, transform 0.2s;
  }

  .paper-link:hover {
    background: rgba(255,255,255,0.25);
    transform: scale(1.05);
  }

  @media (max-width: 600px) {
    .info h2 {
      font-size: 1.5rem;
    }
    .info p {
      font-size: 1rem;
    }
  }
</style>
