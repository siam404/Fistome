// Main JavaScript for icon editing functionality
document.addEventListener('DOMContentLoaded', function() {
  const editToggle = document.getElementById('edit-toggle');
  const addIconBtn = document.getElementById('add-icon');
  const modal = document.getElementById('icon-modal');
  const modalTitle = document.getElementById('modal-title');
  const closeIconModal = document.getElementById('close-icon-modal');
  const closeThemeModal = document.getElementById('close-theme-modal');
  const iconForm = document.getElementById('icon-form');
  const notification = document.getElementById('notification');
  const notificationMessage = document.getElementById('notification-message');
  const rowSelect = document.getElementById('icon-row');
  const themeToggle = document.getElementById('theme-toggle');
  const themeModal = document.getElementById('theme-modal');
  const themeGrid = document.querySelector('.theme-grid');
  const dateTimeElement = document.getElementById('date-time');
  const greetingElement = document.getElementById('greeting');
  const searchForm = document.getElementById('search-form');
  const searchEngineToggle = document.getElementById('search-engine-toggle');
  const searchEngineDropdown = document.getElementById('search-engine-dropdown');
  const searchEngineOptions = document.querySelectorAll('.search-engine-option');
  const currentSearchEngineIcon = document.getElementById('current-search-engine-icon');
  
  // Initialize search engine data
  let currentSearchEngine = {
    name: 'google',
    action: 'https://www.google.com/search',
    paramName: 'q'
  };
  
  // Background image variable
  let customBackgroundImage = null;
  
  // Update greeting based on time of day
  function updateGreeting() {
    // Always set the greeting to "Welcome!" regardless of time
    let greeting = 'Welcome!';
    
    // Update the greeting element
    greetingElement.textContent = greeting;
  }
  
  // Initial greeting update
  updateGreeting();
  
  // Update date and time with smooth animation
  function updateDateTime() {
    const now = new Date();
    
    // Get the date part with weekday, month, and day
    const dateOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric'
    };
    const datePart = now.toLocaleDateString(undefined, dateOptions);
    
    // Get the time part
    const timeOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    const timePart = now.toLocaleTimeString(undefined, timeOptions);
    
    // Update with animation
    const datetimeContainer = document.querySelector('.datetime-container');
    
    // Apply fade-out animation
    datetimeContainer.style.opacity = '0.2';
    
    // Update text after a small delay for animation
    setTimeout(() => {
      // Combine with "at" between date and time
      dateTimeElement.textContent = `${datePart} at ${timePart}`;
      
      // Apply fade-in animation
      datetimeContainer.style.opacity = '1';
    }, 300);
  }
  
  // Initial date/time update
  updateDateTime();
  
  // Update date/time every minute
  setInterval(updateDateTime, 60000);
  
  // Define available themes
  const themes = [
    { 
      id: 'dark', 
      name: 'Dark', 
      colors: ['#282828', '#3a3a3a', '#f5c78c'],
    },
    { 
      id: '8888', 
      name: '8888', 
      colors: ['#1e1e2e', '#313244', '#f38ba8'],
    },
    { 
      id: '80s-after-dark', 
      name: '80s After Dark', 
      colors: ['#181818', '#ff7edb', '#ff9de6'],
    },
    { 
      id: '9009', 
      name: '9009', 
      colors: ['#c0c0c0', '#333333', '#056652'],
    },
    { 
      id: 'aether', 
      name: 'Aether', 
      colors: ['#101010', '#ff2e97', '#c932ff'],
    },
    { 
      id: 'aurora', 
      name: 'Aurora', 
      colors: ['#01161F', '#3CEADC', '#1998b2'],
    },
    { 
      id: 'beach', 
      name: 'Beach', 
      colors: ['#FFD79B', '#FF9A3C', '#604830'],
    },
    { 
      id: 'blueberry-dark', 
      name: 'Blueberry Dark', 
      colors: ['#212B42', '#6377BD', '#9FAED6'],
    },
    { 
      id: 'light', 
      name: 'Light', 
      colors: ['#e0e0e0', '#333333', '#d0d0d0'],
    },
    // Additional themes
    {
      id: 'dracula',
      name: 'Dracula',
      colors: ['#282a36', '#ff79c6', '#8be9fd'],
    },
    {
      id: 'nord',
      name: 'Nord',
      colors: ['#2e3440', '#88c0d0', '#5e81ac'],
    },
    {
      id: 'solarized-dark',
      name: 'Solarized Dark',
      colors: ['#002b36', '#859900', '#268bd2'],
    },
    {
      id: 'solarized-light',
      name: 'Solarized Light',
      colors: ['#fdf6e3', '#cb4b16', '#268bd2'],
    },
    {
      id: 'gruvbox',
      name: 'Gruvbox',
      colors: ['#282828', '#cc241d', '#98971a'],
    },
    {
      id: 'monokai',
      name: 'Monokai',
      colors: ['#272822', '#f92672', '#a6e22e'],
    },
    {
      id: 'tokyo-night',
      name: 'Tokyo Night',
      colors: ['#1a1b26', '#7aa2f7', '#bb9af7'],
    },
    {
      id: 'github-dark',
      name: 'GitHub Dark',
      colors: ['#0d1117', '#58a6ff', '#f0883e'],
    },
    {
      id: 'material',
      name: 'Material',
      colors: ['#263238', '#89DDFF', '#f07178'],
    },
    {
      id: 'synthwave',
      name: 'Synthwave',
      colors: ['#241b2f', '#ff7edb', '#36f9f6'],
    },
    {
      id: 'green-mint',
      name: 'Green Mint',
      colors: ['#0b2027', '#40798c', '#70a9a1'],
    }
  ];
  
  // EXPLICITLY force the add icon button to be hidden initially
  addIconBtn.style.display = 'none';
  addIconBtn.style.opacity = '0';
  addIconBtn.style.transform = 'translateX(60px)';
  themeToggle.style.display = 'none';
  themeToggle.style.opacity = '0';
  themeToggle.style.transform = 'translateX(120px)';
  
  // Maximum icons per row
  const MAX_ICONS_PER_ROW = 8;
  
  let editMode = false;
  let currentIcon = null;
  let currentTheme = 'dark'; // Default theme
  
  // Create theme options in the theme grid
  function createThemeOptions() {
    // Clear existing options
    themeGrid.innerHTML = '';
    
    // First, create the background image option at the top
    createBackgroundImageOption();
    
    // Create a container for the color themes
    const colorThemesContainer = document.createElement('div');
    colorThemesContainer.className = 'color-themes-container';
    
    // Add section title for color themes
    const colorThemesTitle = document.createElement('div');
    colorThemesTitle.className = 'section-title';
    colorThemesTitle.textContent = 'Color Themes';
    colorThemesContainer.appendChild(colorThemesTitle);
    
    // Add container to the theme grid
    themeGrid.appendChild(colorThemesContainer);
    
    // Then add all theme options to the color themes container
    themes.forEach(theme => {
      const themeOption = document.createElement('div');
      themeOption.className = 'theme-option';
      themeOption.dataset.themeId = theme.id;
      
      if (theme.id === currentTheme) {
        themeOption.classList.add('active');
      }
      
      const colorPreview = document.createElement('div');
      colorPreview.className = 'theme-color-preview';
      
      // Create three color circles
      theme.colors.forEach(color => {
        const colorCircle = document.createElement('div');
        colorCircle.className = 'color-circle';
        colorCircle.style.backgroundColor = color;
        colorPreview.appendChild(colorCircle);
      });
      
      const nameDiv = document.createElement('div');
      nameDiv.className = 'theme-name';
      nameDiv.textContent = theme.name;
      
      themeOption.appendChild(colorPreview);
      themeOption.appendChild(nameDiv);
      
      // Add click event to select theme
      themeOption.addEventListener('click', () => {
        // Only apply theme if no background image is active
        if (!customBackgroundImage) {
          applyTheme(theme.id);
          // Update active class
          document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('active');
          });
          themeOption.classList.add('active');
        }
      });
      
      colorThemesContainer.appendChild(themeOption);
    });
  }
  
  // Create the background image option at the top of the theme grid
  function createBackgroundImageOption() {
    // Check if the background image container already exists
    const existingBgContainer = themeGrid.querySelector('.bg-image-container');
    if (existingBgContainer) {
      existingBgContainer.remove();
    }
    
    // Create the background image container
    const bgImageContainer = document.createElement('div');
    bgImageContainer.className = 'bg-image-container';
    
    // Add section title
    const sectionTitle = document.createElement('div');
    sectionTitle.className = 'section-title';
    sectionTitle.textContent = 'Custom Background Image';
    bgImageContainer.appendChild(sectionTitle);
    
    // Create custom file input
    const customFileInput = document.createElement('div');
    customFileInput.className = 'custom-file-input';
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'bg-image-upload';
    fileInput.accept = 'image/*';
    
    const fileInputLabel = document.createElement('label');
    fileInputLabel.className = 'file-input-label';
    fileInputLabel.textContent = 'Choose Image';
    fileInputLabel.setAttribute('for', 'bg-image-upload');
    
    customFileInput.appendChild(fileInput);
    customFileInput.appendChild(fileInputLabel);
    
    // Add file input event listener
    fileInput.addEventListener('change', function(e) {
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
          applyBackgroundImage(e.target.result);
        };
        reader.readAsDataURL(this.files[0]);
      }
    });
    
    // Create buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'bg-image-buttons';
    
    // Create remove button for background image
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'bg-image-btn remove';
    removeButton.textContent = 'Remove Background';
    removeButton.addEventListener('click', function() {
      removeBackgroundImage();
    });
    
    // Add elements to container
    buttonsContainer.appendChild(removeButton);
    
    // Add all elements to the background image container
    bgImageContainer.appendChild(customFileInput);
    bgImageContainer.appendChild(buttonsContainer);
    
    // Insert at the beginning of the theme grid
    themeGrid.insertBefore(bgImageContainer, themeGrid.firstChild);
  }
  
  // Apply a background image
  function applyBackgroundImage(imageData) {
    // Save the background image to local storage
    browser.storage.local.set({ backgroundImage: imageData });
    
    // Apply the background image
    document.body.style.backgroundImage = `url(${imageData})`;
    document.body.classList.add('has-bg-image');
    customBackgroundImage = imageData;
    
    // Automatically set to dark theme when background image is applied
    if (currentTheme !== 'dark') {
      currentTheme = 'dark';
      // Remove all theme classes
      document.body.classList.forEach(className => {
        if (className.startsWith('theme-')) {
          document.body.classList.remove(className);
        }
      });
      // Add dark theme class
      document.body.classList.add('theme-dark');
      // Save theme preference
      browser.storage.local.set({ theme: 'dark' });
    }
    
    // Show notification about background image only, not theme
    showNotification('Custom background applied.', 'info');
  }
  
  // Remove the background image
  function removeBackgroundImage() {
    // Remove from local storage
    browser.storage.local.remove('backgroundImage');
    
    // Remove from the page
    document.body.style.backgroundImage = '';
    document.body.classList.remove('has-bg-image');
    customBackgroundImage = null;
    
    // Show notification about background removal and current theme
    showNotification(`Background image removed. Using ${themes.find(t => t.id === currentTheme).name} theme.`, 'info');
    
    // Refresh theme options to enable color themes
    createThemeOptions();
  }
  
  // Apply a theme
  function applyTheme(themeId) {
    // First get the modal content element
    const modalContent = document.querySelector('.theme-modal-content');
    
    // Add the fadeout animation class
    modalContent.classList.add('theme-modal-fadeout');
    
    // After animation completes, close modal and apply theme
    setTimeout(() => {
      // Remove all theme classes
      document.body.classList.forEach(className => {
        if (className.startsWith('theme-')) {
          document.body.classList.remove(className);
        }
      });
      
      // Add the new theme class
      document.body.classList.add(`theme-${themeId}`);
      currentTheme = themeId;
      
      // Keep background image if it exists
      if (customBackgroundImage) {
        document.body.classList.add('has-bg-image');
      }
      
      // Save theme preference
      browser.storage.local.set({ theme: themeId });
      
      // Only show theme notification if no background image is active
      if (!customBackgroundImage) {
        showNotification(`Applied ${themes.find(t => t.id === themeId).name} theme.`, 'info');
      }
      
      // Close the modal and reset the animation
      themeModal.style.display = 'none';
      modalContent.classList.remove('theme-modal-fadeout');
    }, 300); // Match animation duration
  }
  
  // Function to show notification
  function showNotification(message, type = 'success') {
    // Clear any existing timeout to avoid conflicts
    if (window.notificationTimeout) {
      clearTimeout(window.notificationTimeout);
      
      // If a notification is currently visible, hide it first
      if (notification.classList.contains('show')) {
        notification.classList.remove('show');
        notification.classList.add('hide');
        
        // Wait for the hide animation to finish before showing the new one
        setTimeout(() => {
          displayNotification();
        }, 300);
        return;
      }
    }
    
    // Function to display the notification
    function displayNotification() {
      notificationMessage.textContent = message;
      notification.className = 'notification';
      notification.classList.add(type);
      
      // Force a reflow to ensure CSS transitions work properly
      void notification.offsetWidth;
      
      // Show the notification
      notification.classList.add('show');
      notification.classList.remove('hide');
      
      // Set timeout to hide the notification
      window.notificationTimeout = setTimeout(() => {
        // Add the hide class to trigger the exit animation
        notification.classList.remove('show');
        notification.classList.add('hide');
        
        // Clear the timeout reference
        window.notificationTimeout = null;
      }, 3000);
    }
    
    // Display the notification immediately if no previous one is visible
    displayNotification();
  }
  
  // Load saved data from browser storage
  function loadSavedData() {
    browser.storage.local.get(['icons', 'theme', 'backgroundImage']).then((result) => {
      // Load background image if one exists
      if (result.backgroundImage) {
        customBackgroundImage = result.backgroundImage;
        document.body.style.backgroundImage = `url(${result.backgroundImage})`;
        document.body.classList.add('has-bg-image');
      }
      
      // Apply saved theme (but don't show notification during initial load)
      if (result.theme) {
        currentTheme = result.theme;
        
        // Apply theme silently without notification
        document.body.classList.forEach(className => {
          if (className.startsWith('theme-')) {
            document.body.classList.remove(className);
          }
        });
        
        document.body.classList.add(`theme-${currentTheme}`);
        
        // Ensure background image class stays applied if needed
        if (customBackgroundImage) {
          document.body.classList.add('has-bg-image');
        }
      } else {
        // Default to dark theme (silently)
        currentTheme = 'dark';
        document.body.classList.add(`theme-dark`);
      }
      
      // Load saved icons if they exist
      if (result.icons) {
        try {
          const savedIcons = JSON.parse(result.icons);
          
          // Clear current icons
          document.querySelector('.icon-links').innerHTML = '';
          document.querySelector('.icon-links-middle').innerHTML = '';
          document.querySelector('.icon-links1').innerHTML = '';
          
          // Add saved icons
          savedIcons.forEach(icon => {
            const container = document.querySelector('.' + icon.row);
            if (container) {
              const newIcon = createIconElement(icon.url, icon.title, icon.imgSrc);
              container.appendChild(newIcon);
            }
          });
        } catch (e) {
          console.error('Error loading saved icons:', e);
        }
      }
      
      // Ensure all icons have data-href attributes set
      document.querySelectorAll('.icon-container').forEach(icon => {
        if (!icon.hasAttribute('data-href')) {
          icon.setAttribute('data-href', icon.getAttribute('href'));
        }
      });
      
      // Update available sections
      updateSectionOptions();
      centerIconsInRows();
    });
  }
  
  // Save data to browser storage
  function saveData() {
    const icons = [];
    
    // Collect all icons data
    document.querySelectorAll('.icon-container').forEach(icon => {
      let row = 'icon-links';
      if (icon.parentElement.classList.contains('icon-links-middle')) {
        row = 'icon-links-middle';
      } else if (icon.parentElement.classList.contains('icon-links1')) {
        row = 'icon-links1';
      }
      
      icons.push({
        url: icon.getAttribute('data-href'),
        title: icon.getAttribute('title') || '',
        imgSrc: icon.querySelector('img').src,
        row: row
      });
    });
    
    // Save to browser storage
    browser.storage.local.set({
      icons: JSON.stringify(icons)
    });
  }
  
  // Function to create an icon element
  function createIconElement(url, title, imgSrc) {
    const newIcon = document.createElement('a');
    
    // Always store the real URL
    newIcon.setAttribute('data-href', url);
    
    // Apply appropriate href based on mode
    newIcon.href = editMode ? '' : url;
    newIcon.title = title;
    newIcon.target = '_self';
    newIcon.classList.add('icon-container');
    
    // Prevent default behavior for links in edit mode
    if (editMode) {
      newIcon.addEventListener('click', function(e) {
        e.preventDefault();
      });
    }
    
    const img = document.createElement('img');
    img.alt = title || url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    img.src = imgSrc;
    
    // Create edit menu
    const editMenu = document.createElement('div');
    editMenu.classList.add('icon-edit-menu');
    editMenu.innerHTML = `
      <button class="remove-icon">Remove</button>
      <button class="edit-icon">Edit</button>
    `;
    
    newIcon.appendChild(img);
    newIcon.appendChild(editMenu);
    
    return newIcon;
  }
  
  // Function to update available section options based on row capacity
  function updateSectionOptions() {
    const topRowCount = document.querySelectorAll('.icon-links > .icon-container').length;
    const middleRowCount = document.querySelectorAll('.icon-links-middle > .icon-container').length;
    const bottomRowCount = document.querySelectorAll('.icon-links1 > .icon-container').length;
    
    // Get all options in the select
    const options = rowSelect.querySelectorAll('option');
    
    // Reset all options
    options.forEach(option => {
      option.disabled = false;
      option.classList.remove('disabled');
    });
    
    // Disable options for full rows
    if (topRowCount >= MAX_ICONS_PER_ROW) {
      rowSelect.querySelector('option[value="icon-links"]').disabled = true;
      rowSelect.querySelector('option[value="icon-links"]').classList.add('disabled');
    }
    
    if (middleRowCount >= MAX_ICONS_PER_ROW) {
      rowSelect.querySelector('option[value="icon-links-middle"]').disabled = true;
      rowSelect.querySelector('option[value="icon-links-middle"]').classList.add('disabled');
    }
    
    if (bottomRowCount >= MAX_ICONS_PER_ROW) {
      rowSelect.querySelector('option[value="icon-links1"]').disabled = true;
      rowSelect.querySelector('option[value="icon-links1"]').classList.add('disabled');
    }
    
    // If the currently selected option is disabled, select the first enabled option
    if (rowSelect.selectedOptions[0] && rowSelect.selectedOptions[0].disabled) {
      for (let i = 0; i < options.length; i++) {
        if (!options[i].disabled) {
          rowSelect.value = options[i].value;
          break;
        }
      }
    }
  }
  
  // Function to center icons in rows
  function centerIconsInRows() {
    ['icon-links', 'icon-links-middle', 'icon-links1'].forEach(rowClass => {
      const row = document.querySelector('.' + rowClass);
      if (row) {
        // Make sure the row is centered without changing individual icon margins
        row.style.justifyContent = 'center';
      }
    });
  }
  
  // Load saved icons on initial load
  loadSavedData();
  
  // Toggle edit mode
  editToggle.addEventListener('click', function() {
    editMode = !editMode;
    document.body.classList.toggle('edit-mode', editMode);
    
    // The display property will be controlled by CSS now
    // but we still need to ensure it's initially set correctly
    if (editMode) {
      // Show buttons immediately to start the transition
      addIconBtn.style.display = 'flex';
      themeToggle.style.display = 'flex';
      
      // Force a reflow to ensure transition starts correctly
      void addIconBtn.offsetWidth;
      void themeToggle.offsetWidth;
      
      // Set opacity to trigger animation
      addIconBtn.style.opacity = '1';
      themeToggle.style.opacity = '1';
      
      // Reset transform to trigger slide animation
      addIconBtn.style.transform = 'translateX(0)';
      themeToggle.style.transform = 'translateX(0)';
      
      showNotification('Edit mode activated. Click on icons to edit or remove them.');
    } else {
      // Start hiding animation - make sure we have transitions
      addIconBtn.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      themeToggle.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      
      // Set opacity and transform to trigger animation
      addIconBtn.style.opacity = '0';
      themeToggle.style.opacity = '0';
      addIconBtn.style.transform = 'translateX(60px)';
      themeToggle.style.transform = 'translateX(120px)';
      
      // Use a delay to hide the buttons after animation completes
      setTimeout(() => {
        if (!editMode) {
          addIconBtn.style.display = 'none';
          themeToggle.style.display = 'none';
        }
      }, 300); // Match transition duration
      
      // Save changes when exiting edit mode
      saveData();
      showNotification('Changes saved successfully.', 'info');
    }
    
    // Disable/Enable link navigation based on edit mode
    document.querySelectorAll('.icon-container').forEach(icon => {
      if (editMode) {
        // Store the real href and disable links in edit mode
        if (!icon.hasAttribute('data-href')) {
          icon.setAttribute('data-href', icon.getAttribute('href'));
        }
        icon.removeAttribute('href'); // Remove href completely instead of setting to '#'
        
        // Add click handler to prevent default behavior
        icon.addEventListener('click', function(e) {
          if (editMode) e.preventDefault();
        });
      } else {
        // Restore the real href when leaving edit mode
        const realHref = icon.getAttribute('data-href');
        if (realHref) {
          icon.setAttribute('href', realHref);
        }
      }
    });
  });
  
  // Prevent link navigation when clicking on edit options
  document.body.addEventListener('click', function(event) {
    if (editMode && (event.target.closest('.icon-edit-menu') || event.target.closest('.icon-container'))) {
      event.preventDefault();
    }
  }, true); // Use capture phase to catch event before it reaches the link
  
  // Close icon modal when clicking the X
  closeIconModal.addEventListener('click', function() {
    modal.style.display = 'none';
  });
  
  // Close theme modal when clicking the X
  closeThemeModal.addEventListener('click', function() {
    themeModal.style.display = 'none';
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    } else if (event.target === themeModal) {
      themeModal.style.display = 'none';
    }
  });
  
  // Add new icon
  addIconBtn.addEventListener('click', function() {
    currentIcon = null;
    modalTitle.textContent = 'Add New Shortcuts';
    document.getElementById('icon-title').value = '';
    document.getElementById('icon-url').value = '';
    document.getElementById('icon-upload').value = '';
    
    // Update available sections
    updateSectionOptions();
    
    // Default to the first available section for new icons
    const availableOption = rowSelect.querySelector('option:not([disabled])');
    if (availableOption) {
      rowSelect.value = availableOption.value;
    } else {
      showNotification('All sections are full! Remove some icons first.', 'error');
      return;
    }
    
    modal.style.display = 'block';
  });
  
  // Delete icon
  document.body.addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-icon') && editMode) {
      event.preventDefault();
      event.stopPropagation();
      const iconContainer = event.target.closest('.icon-container');
      if (iconContainer) {
        const iconName = iconContainer.getAttribute('title') || '';
        iconContainer.remove();
        showNotification(`Removed ${iconName ? `"${iconName}"` : ""} icon.`);
        
        // Update available sections after removal
        updateSectionOptions();
        centerIconsInRows();
        saveData();
      }
    }
  });
  
  // Edit icon
  document.body.addEventListener('click', function(event) {
    if (event.target.classList.contains('edit-icon') && editMode) {
      event.preventDefault();
      event.stopPropagation();
      currentIcon = event.target.closest('.icon-container');
      if (currentIcon) {
        modalTitle.textContent = 'Edit Icon';
        document.getElementById('icon-title').value = currentIcon.getAttribute('title') || '';
        document.getElementById('icon-url').value = currentIcon.getAttribute('data-href') || currentIcon.getAttribute('href');
        
        // Determine which section it's in
        let sectionValue = 'icon-links';
        if (currentIcon.parentElement.classList.contains('icon-links-middle')) {
          sectionValue = 'icon-links-middle';
        } else if (currentIcon.parentElement.classList.contains('icon-links1')) {
          sectionValue = 'icon-links1';
        }
        
        // Update available sections before setting value
        updateSectionOptions();
        document.getElementById('icon-row').value = sectionValue;
        
        modal.style.display = 'block';
      }
    }
  });
  
  // Save icon changes
  iconForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const title = document.getElementById('icon-title').value || '';
    const url = document.getElementById('icon-url').value;
    const row = document.getElementById('icon-row').value;
    const rowContainer = document.querySelector('.' + row);
    const hasNewImage = document.getElementById('icon-upload').files.length > 0;
    
    // Check if the target row is full (only for new icons)
    if (!currentIcon) {
      const targetRowCount = rowContainer.querySelectorAll('.icon-container').length;
      if (targetRowCount >= MAX_ICONS_PER_ROW) {
        showNotification('This section is already full! Choose another section.', 'error');
        updateSectionOptions(); // Re-check available options
        return;
      }
    }
    
    // Handle icon creation/update
    if (currentIcon) {
      // Store the original row
      const originalRow = currentIcon.parentElement;
      
      // Always store the real URL in data-href
      currentIcon.setAttribute('data-href', url);
      
      // Apply href based on current mode
      if (editMode) {
        currentIcon.removeAttribute('href'); // Remove href completely
      } else {
        currentIcon.setAttribute('href', url);
      }
      
      currentIcon.setAttribute('title', title);
      
      // Move to selected row if needed and if not full
      if (!currentIcon.parentElement.classList.contains(row)) {
        const targetRowCount = rowContainer.querySelectorAll('.icon-container').length;
        if (targetRowCount >= MAX_ICONS_PER_ROW) {
          showNotification('Cannot move icon - target section is full!', 'error');
          rowSelect.value = originalRow.classList[0]; // Reset to original value
          return;
        }
        
        currentIcon.remove();
        rowContainer.appendChild(currentIcon);
      }
      
      // Update image if a new one was provided
      if (hasNewImage) {
        const file = document.getElementById('icon-upload').files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
          currentIcon.querySelector('img').src = e.target.result;
          currentIcon.querySelector('img').alt = title || url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
          saveData();
        };
        reader.readAsDataURL(file);
      } else {
        saveData();
      }
      
      showNotification(`Updated ${title ? `"${title}"` : ""} icon.`);
    } else {
      // Create new icon
      const newIcon = document.createElement('a');
      
      // Always store the real URL
      newIcon.setAttribute('data-href', url);
      
      // Apply appropriate href based on mode
      newIcon.href = editMode ? '' : url;
      newIcon.title = title;
      newIcon.target = '_self';
      newIcon.classList.add('icon-container');
      
      const img = document.createElement('img');
      img.alt = title || url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      
      // Create edit menu
      const editMenu = document.createElement('div');
      editMenu.classList.add('icon-edit-menu');
      editMenu.innerHTML = `
        <button class="remove-icon">Remove</button>
        <button class="edit-icon">Edit</button>
      `;
      
      // Set image source based on file upload
      if (hasNewImage) {
        const file = document.getElementById('icon-upload').files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
          img.src = e.target.result;
          
          // Complete setup after image loads
          newIcon.appendChild(img);
          newIcon.appendChild(editMenu);
          rowContainer.appendChild(newIcon);
          
          showNotification(`Added new ${title ? `"${title}"` : ""} icon.`);
          
          // Update available sections after addition
          updateSectionOptions();
          centerIconsInRows();
          saveData();
        };
        reader.readAsDataURL(file);
      } else {
        // Default icon if no image provided
        img.src = 'icons/github.png';
        
        // Complete setup immediately
        newIcon.appendChild(img);
        newIcon.appendChild(editMenu);
        rowContainer.appendChild(newIcon);
        
        showNotification(`Added new ${title ? `"${title}"` : ""} icon.`);
        
        // Update available sections after addition
        updateSectionOptions();
        centerIconsInRows();
        saveData();
      }
    }
    
    // Close the modal
    modal.style.display = 'none';
  });

  // Add keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    // Only allow keyboard shortcuts when not in an input field
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }
    
    // Shift + / to show keyboard shortcuts (? key)
    if (e.shiftKey && e.key === '?') {
      showKeyboardShortcutsHelp();
      e.preventDefault();
    }
    
    // E to toggle edit mode
    if (e.key === 'e') {
      toggleEditMode();
      e.preventDefault();
    }
    
    // T to toggle theme modal
    if (e.key === 't') {
      themeModal.style.display = 'block';
      e.preventDefault();
    }
    
    // S to focus search box
    if (e.key === 's' || e.key === '/') {
      document.getElementById('search-input').focus();
      e.preventDefault();
    }
    
    // Escape key to close modals
    if (e.key === 'Escape') {
      modal.style.display = 'none';
      themeModal.style.display = 'none';
      searchEngineDropdown.classList.remove('show');
      document.getElementById('keyboard-shortcuts-modal').style.display = 'none';
    }
  });

  // Show keyboard shortcuts help modal
  function showKeyboardShortcutsHelp() {
    // Check if the modal already exists
    let shortcutsModal = document.getElementById('keyboard-shortcuts-modal');
    
    if (!shortcutsModal) {
      // Create the modal
      shortcutsModal = document.createElement('div');
      shortcutsModal.id = 'keyboard-shortcuts-modal';
      shortcutsModal.className = 'modal';
      
      // Create modal content
      const modalContent = document.createElement('div');
      modalContent.className = 'modal-content';
      
      // Create close button
      const closeButton = document.createElement('span');
      closeButton.className = 'close-modal';
      closeButton.textContent = '×';
      closeButton.addEventListener('click', function() {
        shortcutsModal.style.display = 'none';
      });
      
      // Create title
      const title = document.createElement('h2');
      title.textContent = 'Keyboard Shortcuts';
      
      // Create shortcuts table
      const shortcutsTable = document.createElement('table');
      shortcutsTable.className = 'shortcuts-table';
      
      // Define shortcuts
      const shortcuts = [
        { key: 'e', description: 'Toggle edit mode' },
        { key: 't', description: 'Open theme selector' },
        { key: 's or /', description: 'Focus search box' },
        { key: 'Shift + ?', description: 'Show this help' },
        { key: 'Esc', description: 'Close any open modal' }
      ];
      
      // Create table rows
      shortcuts.forEach(shortcut => {
        const row = document.createElement('tr');
        
        const keyCell = document.createElement('td');
        keyCell.className = 'key-cell';
        keyCell.textContent = shortcut.key;
        
        const descCell = document.createElement('td');
        descCell.textContent = shortcut.description;
        
        row.appendChild(keyCell);
        row.appendChild(descCell);
        shortcutsTable.appendChild(row);
      });
      
      // Assemble modal
      modalContent.appendChild(closeButton);
      modalContent.appendChild(title);
      modalContent.appendChild(shortcutsTable);
      shortcutsModal.appendChild(modalContent);
      document.body.appendChild(shortcutsModal);
      
      // Add event listener to close when clicking outside
      shortcutsModal.addEventListener('click', function(e) {
        if (e.target === shortcutsModal) {
          shortcutsModal.style.display = 'none';
        }
      });
    }
    
    // Show the modal
    shortcutsModal.style.display = 'block';
  }
  
  // Function to toggle edit mode
  function toggleEditMode() {
    editToggle.click();
  }

  // Theme selector button click event
  themeToggle.addEventListener('click', function() {
    createThemeOptions(); // Refresh theme options
    themeModal.style.display = 'block';
  });

  // Load saved search engine on page load
  loadSearchEnginePreference();
  
  // Load saved search engine preference
  function loadSearchEnginePreference() {
    const savedEngine = localStorage.getItem('searchEngine');
    if (savedEngine) {
      const engineData = JSON.parse(savedEngine);
      currentSearchEngine = engineData;
      updateSearchFormAction();
      
      // Update the icon
      const engineOption = document.querySelector(`.search-engine-option[data-engine="${engineData.name}"]`);
      if (engineOption) {
        const icon = engineOption.querySelector('img').src;
        currentSearchEngineIcon.src = icon;
        currentSearchEngineIcon.alt = engineData.name;
        
        // Hide the current engine in the dropdown
        engineOption.style.display = 'none';
      }
    }
  }
  
  // Update the form action and parameter name
  function updateSearchFormAction() {
    searchForm.action = currentSearchEngine.action;
    const searchInput = document.getElementById('search-input');
    searchInput.name = currentSearchEngine.paramName;
  }
  
  // Toggle search engine dropdown
  searchEngineToggle.addEventListener('click', function(event) {
    // Before showing dropdown, hide the currently selected engine and show others
    document.querySelectorAll('.search-engine-option').forEach(option => {
      if (option.dataset.engine === currentSearchEngine.name) {
        option.style.display = 'none';
      } else {
        option.style.display = 'flex';
      }
    });
    
    searchEngineDropdown.classList.toggle('show');
    event.stopPropagation();
  });
  
  // Close the dropdown when clicking elsewhere
  document.addEventListener('click', function() {
    searchEngineDropdown.classList.remove('show');
  });
  
  // Prevent dropdown from closing when clicking inside it
  searchEngineDropdown.addEventListener('click', function(event) {
    event.stopPropagation();
  });
  
  // Handle search engine selection
  searchEngineOptions.forEach(option => {
    option.addEventListener('click', function() {
      const engine = this.dataset.engine;
      const action = this.dataset.action;
      const paramName = this.dataset.param;
      const icon = this.querySelector('img').src;
      
      // Show the previously selected engine
      document.querySelectorAll('.search-engine-option').forEach(opt => {
        if (opt.dataset.engine === currentSearchEngine.name) {
          opt.style.display = 'flex';
        }
      });
      
      // Update current engine
      currentSearchEngine = {
        name: engine,
        action: action,
        paramName: paramName
      };
      
      // Hide this engine
      this.style.display = 'none';
      
      // Update form action
      updateSearchFormAction();
      
      // Update the icon
      currentSearchEngineIcon.src = icon;
      currentSearchEngineIcon.alt = engine;
      
      // Save preference
      localStorage.setItem('searchEngine', JSON.stringify(currentSearchEngine));
      
      // Close dropdown
      searchEngineDropdown.classList.remove('show');
      
      // Show notification
      showNotification(`Search engine changed to ${engine}`, 'info');
    });
  });
}); 