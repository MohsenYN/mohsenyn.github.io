---
layout: list
permalink: /Resource/
---

<header class="page-header">
  <h1 style="font-size: 2.5rem; margin: 0 auto 1rem; font-weight: 700; letter-spacing: 1px; text-align: center; width: 100%; display: block;">Resources</h1>
  <p>Explore our latest dry bean varieties and connect with distributors for licensing and inquiries.</p>
</header>

<div class="resource-container">
  <section class="new-varieties">
    <h2>New Dry Bean Varieties</h2>
    <p>We're excited to announce the upcoming release of dry bean varieties developed through advanced computational breeding at the University of Guelph.</p>
    
    <div class="variety-categories">
      <button class="category-btn active" data-category="navy">Navy Beans</button>
      <button class="category-btn" data-category="cranberry">Cranberry Beans</button>
      <button class="category-btn" data-category="kidney">Kidney Beans</button>
      <button class="category-btn" data-category="other">Other Beans</button>
    </div>

    <div class="variety-grid">
      <!-- Navy Beans -->
      <div class="variety-box navy">
        <img src="/assets/Lines/Bechamel.jpg" alt="OAC Bechamel" class="variety-img">
        <h3>OAC Bechamel</h3>
        <ul>
          <li>Full Maturity</li>
          <li>Excellent Yield</li>
          <li>Anthracnose race 73 resistant</li>
          <li>Excellent Upright Plant Architecture for Direct Combining</li>
        </ul>
      </div>
      
      <div class="variety-box navy">
        <img src="/assets/Lines/Resilient.jpg" alt="OAC Resilient" class="variety-img">
        <h3>OAC Resilient</h3>
        <ul>
          <li>Full Maturity</li>
          <li>Excellent Yield</li>
          <li>Anthracnose race 73 resistant</li>
          <li>Very Good Upright Plant Architecture for Direct Combining</li>
        </ul>
      </div>

      <!-- Cranberry Beans -->
      <div class="variety-box cranberry">
        <img src="/assets/Lines/NDC-1.jpg" alt="OAC 22-NDC1" class="variety-img">
        <h3>OAC 22-NDC1</h3>
        <ul>
          <li>The First Non-Darkening Cranberry Bean</li>
          <li>Mid Maturity</li>
          <li>Good Yield</li>
          <li>Anthracnose race 73 resistant</li>
        </ul>
      </div>

      <!-- Kidney Beans -->
      <div class="variety-box kidney">
        <img src="/assets/Lines/Firebrand.jpg" alt="OAC Firebrand" class="variety-img">
        <h3>OAC Firebrand</h3>
        <ul>
          <li>Light Red</li>
          <li>Full Maturity</li>
          <li>Excellent Yield</li>
          <li>Anthracnose race 73 resistant</li>
        </ul>
      </div>

      <!-- Other Beans -->
      <div class="variety-box other">
        <img src="/assets/Lines/o18hr0037.jpg" alt="O18HR003y" class="variety-img">
        <h3>O18HR003y</h3>
        <ul>
          <li>Full Maturity</li>
          <li>Excellent Yield</li>
          <li>Anthracnose race 73 resistant</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="crop-comparison">
    <h2>Compare Dry Bean Varieties</h2>
    <div class="comparison-tool">
      <h3 class="formInfo">Select a Crop</h3>
      <div class="buttons form">
        <button id="whiteBean" class="gradientBtn">White Bean</button>
        <button id="minor" class="gradientBtn">Coloured Bean Minor</button>
        <button id="major" class="gradientBtn">Coloured Bean Major</button>
      </div>
      
      <div id="beanSelection" class="selectors" style="display:none;">
        <h4>Select varieties to compare</h4>
        <form id="beanForm"></form>
      </div>
      
      <div id="dataSelection" class="selectors" style="display:none;">
        <h4>Select data to compare</h4>
        <form id="dataForm">
          <ul>
            <li><label><input type="checkbox" value="description"><span class="checkmark"></span> Description</label></li>
            <li><label><input type="checkbox" value="diseaseRatings"><span class="checkmark"></span> Disease Ratings</label></li>
            <li><label><input type="checkbox" value="performance"><span class="checkmark"></span> Performance Metrics</label></li>
          </ul>
          <div class="form-buttons">
            <button id="goBack" class="gradientBtn">Go Back</button>
            <button id="submitBtnData" class="gradientBtn">Submit</button>
          </div>
        </form>
      </div>
      
      <div id="error" style="display:none;">
        <p>Error. Please ensure you have selected at least two beans and at least one response to compare.</p>
        <button id="closeError" class="gradientBtn">Try Again</button>
      </div>
      
      <div id="results" style="display:none;"></div>
    </div>
  </section>

  <section class="distributors">
    <h2>Dry Bean Variety Distributors</h2>
    <div class="distributor-grid">
      <!-- Your distributor items here -->
    </div>
  </section>
</div>

<style>
  /* Your existing CSS styles */
  .error-message {
    color: #d9534f;
    padding: 10px;
    background: #f8d7da;
    border-radius: 4px;
  }
  
  .form-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  
  #results table {
    width: 100%;
    margin-bottom: 20px;
    border-collapse: collapse;
  }
  
  #results th, #results td {
    padding: 8px;
    border: 1px solid #ddd;
    text-align: left;
  }
  
  #results th {
    background-color: #9b1d64;
    color: white;
  }
  
  #results tr:nth-child(even) {
    background-color: #f2f2f2;
  }
</style>

<script>
// Bean Data Class
class Bean {
  constructor(name, marketClass, year, commonMosaicVirus, anthracnose, commonBlight, yieldB, maturity, oneHundredSdWeight, directHarvestSuitability) {
    this.name = name;
    this.marketClass = marketClass;
    this.year = year || "--";
    this.commonMosaicVirus = commonMosaicVirus || ["--", "--"];
    this.anthracnose = anthracnose || ["--", "--", "--"];
    this.commonBlight = commonBlight || "--";
    this.yieldB = yieldB || "--";
    this.maturity = maturity || "--";
    this.oneHundredSdWeight = oneHundredSdWeight || "--";
    this.directHarvestSuitability = directHarvestSuitability || "--";
  }
}

// Comparison Tool Data
let allBeans = [];
let currentCategory = '';

// DOM Elements
const elements = {
  whiteBeanBtn: document.getElementById('whiteBean'),
  minorBtn: document.getElementById('minor'),
  majorBtn: document.getElementById('major'),
  beanForm: document.getElementById('beanForm'),
  dataForm: document.getElementById('dataForm'),
  errorDiv: document.getElementById('error'),
  resultsDiv: document.getElementById('results'),
  goBackBtn: document.getElementById('goBack'),
  submitBtn: document.getElementById('submitBtnData'),
  closeErrorBtn: document.getElementById('closeError'),
  beanSelection: document.getElementById('beanSelection'),
  dataSelection: document.getElementById('dataSelection')
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
  // Initialize category filtering
  setupCategoryFilter();
  
  // Initialize comparison tool
  try {
    await loadBeanData();
    setupComparisonTool();
  } catch (error) {
    console.error('Initialization error:', error);
    showMessage('Failed to initialize comparison tool. Please try again later.', 'error');
  }
});

// Category Filter Functionality
function setupCategoryFilter() {
  const categoryButtons = document.querySelectorAll('.category-btn');
  const varietyBoxes = document.querySelectorAll('.variety-box');
  
  categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Update active button
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Filter varieties
      const category = this.dataset.category;
      varietyBoxes.forEach(box => {
        box.style.display = box.classList.contains(category) ? 'block' : 'none';
      });
    });
  });
}

// Load Bean Data from JSON
async function loadBeanData() {
  try {
    const response = await fetch('/assets/data/beans.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jsonData = await response.json();
    allBeans = jsonData.map(item => new Bean(
      item.name,
      item.marketClass,
      item.year,
      item.commonMosaicVirus,
      item.anthracnose,
      item.commonBlight,
      item.yield,
      item.maturity,
      item.seedWeight,
      item.harvestSuitability
    ));
  } catch (error) {
    console.error('Error loading bean data:', error);
    throw error;
  }
}

// Setup Comparison Tool
function setupComparisonTool() {
  // Event listeners for crop type selection
  elements.whiteBeanBtn.addEventListener('click', () => showBeanSelection('whiteNavy'));
  elements.minorBtn.addEventListener('click', () => showBeanSelection('minorClass'));
  elements.majorBtn.addEventListener('click', () => showBeanSelection('majorClass'));
  
  // Form submission
  elements.submitBtn.addEventListener('click', handleFormSubmission);
  
  // Navigation buttons
  elements.goBackBtn.addEventListener('click', resetComparisonTool);
  elements.closeErrorBtn.addEventListener('click', resetComparisonTool);
}

// Show bean selection form
function showBeanSelection(category) {
  currentCategory = category;
  const beans = getBeansByCategory(category);
  
  if (beans.length === 0) {
    showMessage('No varieties available for this category.', 'error');
    return;
  }
  
  // Build form
  let html = '<ul>';
  beans.forEach(bean => {
    html += `
      <li>
        <label>
          <input type="checkbox" value="${bean.name}">
          <span class="checkmark"></span>
          ${bean.name}${category === 'whiteNavy' ? '' : ` (${bean.marketClass})`}
        </label>
      </li>
    `;
  });
  html += '</ul>';
  html += `<button id="selectAll" class="gradientBtn">Select All</button>`;
  
  elements.beanForm.innerHTML = html;
  
  // Show appropriate sections
  document.querySelectorAll('.form, .formInfo').forEach(el => el.style.display = 'none');
  elements.beanSelection.style.display = 'block';
  elements.dataSelection.style.display = 'none';
  elements.errorDiv.style.display = 'none';
  
  // Select all button
  document.getElementById('selectAll')?.addEventListener('click', function() {
    const checkboxes = elements.beanForm.querySelectorAll('input[type="checkbox"]');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    checkboxes.forEach(cb => cb.checked = !allChecked);
    this.textContent = allChecked ? 'Select All' : 'Deselect All';
  });
}

// Handle form submission
function handleFormSubmission() {
  try {
    const selectedBeans = Array.from(elements.beanForm.querySelectorAll('input[type="checkbox"]:checked'))
      .map(cb => cb.value);
    
    const selectedData = Array.from(elements.dataForm.querySelectorAll('input[type="checkbox"]:checked'))
      .map(cb => cb.value);
    
    if (selectedBeans.length < 2 || selectedData.length < 1) {
      showError();
      return;
    }
    
    const beans = selectedBeans.map(name => allBeans.find(bean => bean.name === name)).filter(Boolean);
    displayResults(beans, selectedData);
    
  } catch (error) {
    console.error('Form submission error:', error);
    showError();
  }
}

// Display comparison results
function displayResults(beans, parameters) {
  let html = '';
  
  if (parameters.includes('description')) {
    html += `
      <table>
        <thead>
          <tr><th colspan="3">Variety Description</th></tr>
          <tr>
            <th>Variety</th>
            <th>Market Class</th>
            <th>Year of Registration</th>
          </tr>
        </thead>
        <tbody>
          ${beans.map(bean => `
            <tr>
              <td>${bean.name}</td>
              <td>${bean.marketClass}</td>
              <td>${bean.year}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
  
  // Add similar tables for diseaseRatings and performance
  
  html += `
    <div class="result-actions">
      <button id="exportCSV" class="gradientBtn">Export as CSV</button>
      <button id="newComparison" class="gradientBtn">Start New Comparison</button>
    </div>
  `;
  
  elements.resultsDiv.innerHTML = html;
  elements.resultsDiv.style.display = 'block';
  
  // Hide other sections
  elements.beanSelection.style.display = 'none';
  elements.dataSelection.style.display = 'none';
  
  // Add event listeners for new buttons
  document.getElementById('exportCSV')?.addEventListener('click', exportToCSV);
  document.getElementById('newComparison')?.addEventListener('click', resetComparisonTool);
}

// Helper functions
function getBeansByCategory(category) {
  return allBeans.filter(bean => {
    if (category === 'whiteNavy') return bean.marketClass === 'White Navy';
    if (category === 'minorClass') return !['White Navy', 'Light Red Kidney', 'Dark Red Kidney', 'White Kidney', 'Cranberry'].includes(bean.marketClass);
    if (category === 'majorClass') return ['Light Red Kidney', 'Dark Red Kidney', 'White Kidney', 'Cranberry'].includes(bean.marketClass);
    return false;
  });
}

function showError() {
  elements.errorDiv.style.display = 'block';
  elements.resultsDiv.style.display = 'none';
}

function resetComparisonTool() {
  // Reset form selections
  elements.beanForm.innerHTML = '';
  elements.dataForm.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
  
  // Show initial state
  elements.errorDiv.style.display = 'none';
  elements.resultsDiv.style.display = 'none';
  elements.beanSelection.style.display = 'none';
  elements.dataSelection.style.display = 'none';
  document.querySelectorAll('.form, .formInfo').forEach(el => el.style.display = 'block');
}

function showMessage(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  document.querySelector('.comparison-tool').prepend(alertDiv);
  setTimeout(() => alertDiv.remove(), 5000);
}

function exportToCSV() {
  // Implement CSV export functionality
  console.log('Export to CSV');
}
</script>
