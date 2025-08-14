---
layout: list
title: BeanGPT
permalink: /beangpt/
---

<div id="embed-container" style="width:100%; height:100vh;">
  <iframe 
    id="beangpt-frame" 
    src="https://www.beangpt.ca" 
    style="width:100%; height:100%; border:none;" 
    allowfullscreen 
    title="BeanGPT Embedded Site">
  </iframe>
</div>

<div id="fallback" style="display:none; text-align:center; font-family:Arial, sans-serif; padding:2rem;">
  <p>Sorry, BeanGPT cannot be displayed here. Please open it directly:</p>
  <a href="https://www.beangpt.ca" 
     target="_blank" 
     rel="noopener noreferrer" 
     style="color:#6b3e8e; text-decoration:none; font-weight:500;">
     Go to BeanGPT
  </a>
</div>

<script>
  // Detect iframe load failure
  const iframe = document.getElementById('beangpt-frame');
  iframe.addEventListener('error', showFallback);
  
  // If the site uses X-Frame-Options and blocks embedding,
  // this will still be triggered after a delay
  setTimeout(() => {
    if (!iframe.contentWindow || iframe.contentWindow.length === 0) {
      showFallback();
    }
  }, 2000);

  function showFallback() {
    document.getElementById('embed-container').style.display = 'none';
    document.getElementById('fallback').style.display = 'block';
  }
</script>

<style>
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden;
  }
</style>
