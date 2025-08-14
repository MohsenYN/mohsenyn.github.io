---
layout: list
title: BeanGPT
permalink: /beangpt/
---

<div id="embed-container">
  <iframe 
    id="beangpt-frame" 
    src="https://www.beangpt.ca" 
    allowfullscreen 
    title="BeanGPT Embedded Site">
  </iframe>
</div>

<div id="fallback">
  <p>Sorry, BeanGPT cannot be displayed here. Please open it directly:</p>
  <a href="https://www.beangpt.ca" target="_blank" rel="noopener noreferrer">
    Go to BeanGPT
  </a>
</div>

<script>
  const iframe = document.getElementById('beangpt-frame');

  iframe.addEventListener('error', showFallback);

  setTimeout(() => {
    try {
      if (!iframe.contentWindow || iframe.contentWindow.length === 0) {
        showFallback();
      }
    } catch (e) {
      showFallback();
    }
  }, 2000);

  function showFallback() {
    document.getElementById('embed-container').style.display = 'none';
    document.getElementById('fallback').style.display = 'flex';
  }
</script>

<style>
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden;
  }

  /* Full screen iframe container */
  #embed-container {
    width: 100vw;
    height: 100vh;
    background: #000;
  }

  #beangpt-frame {
    width: 1920px; /* Force desktop width */
    height: 1080px;
    border: none;
    transform: scale(calc(100vw / 1920));
    transform-origin: top left;
  }

  /* Fallback message style */
  #fallback {
    display: none;
    height: 100vh;
    width: 100vw;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-family: Arial, sans-serif;
    padding: 2rem;
    background-color: #fff;
    color: #333;
  }

  #fallback a {
    color: #6b3e8e;
    text-decoration: none;
    font-weight: 500;
  }
</style>
