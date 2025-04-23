document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const githubBtn = document.getElementById('github-btn');
  const helpBtn = document.getElementById('help-btn');
  const helpOverlay = document.getElementById('help-overlay');
  const closeHelpBtn = document.getElementById('close-help');
  
  // GitHub button click handler
  githubBtn.addEventListener('click', function() {
    // This will be updated with the actual GitHub repo URL
    browser.tabs.create({ url: "https://github.com/siam404/Fistome.git" });
  });
  
  // Help button click handler
  helpBtn.addEventListener('click', function() {
    // Show help overlay with animation
    helpOverlay.style.display = 'block';
    // Force reflow to ensure transition works
    void helpOverlay.offsetWidth;
    helpOverlay.classList.add('active');
  });
  
  // Close help button click handler
  closeHelpBtn.addEventListener('click', function() {
    // Hide help overlay with animation
    helpOverlay.classList.remove('active');
    // Wait for transition to complete before hiding
    setTimeout(() => {
      helpOverlay.style.display = 'none';
    }, 300);
  });
  
  // Add button hover sound effects
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    // Add hover effect
    button.addEventListener('mouseenter', function() {
      // Add subtle transform effect
      this.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease';
    });
  });
  
  // Add version info
  const versionElement = document.querySelector('.version span');
  browser.runtime.getManifest().then(manifest => {
    versionElement.textContent = `v${manifest.version}`;
  }).catch(() => {
    // If we can't get the version from the manifest, use the hardcoded one
    versionElement.textContent = 'v1.0';
  });
}); 
