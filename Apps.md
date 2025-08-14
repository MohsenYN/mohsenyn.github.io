---
layout: list
title: Apps
permalink: /apps/
---

<section class="apps-container">
  <h1>Our Tools</h1>
  <div class="app-cards">
    <a href="https://www.beangpt.ca" class="app-card bean-gpt" target="_blank" rel="noopener noreferrer">
      <div class="icon"></div>
      <div class="label">BeanGPT</div>
    </a>
    <a href="https://github.com/MohsenYN/AllInOne" class="app-card all-in-one" target="_blank" rel="noopener noreferrer">
      <div class="icon"></div>
      <div class="label">AllInOne Pre-processing</div>
    </a>
  </div>
</section>

<style>
  .apps-container {
    text-align: center;
    padding: 4rem 1rem;
    font-family: Arial, sans-serif;
  }
  .apps-container h1 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    color: #333;
  }
  .app-cards {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 2rem;
  }
  .app-card {
    width: 200px;
    height: 200px;
    border-radius: 1rem;
    color: white;
    text-decoration: none;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .app-card .icon {
    width: 80px;
    height: 80px;
    margin-bottom: 1rem;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
  }
  .app-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
  .bean-gpt {
    background: linear-gradient(135deg, #8e44ad, #c0392b);
  }
  .bean-gpt .icon {
    background-image: url('https://via.placeholder.com/80?text=GPT');
  }
  .all-in-one {
    background: linear-gradient(135deg, #16a085, #27ae60);
  }
  .all-in-one .icon {
    background-image: url('https://via.placeholder.com/80?text=AIO');
  }
  .label {
    font-size: 1.25rem;
    font-weight: bold;
  }
  @media (max-width: 600px) {
    .app-cards {
      flex-direction: column;
      gap: 1.5rem;
    }
  }
</style>
