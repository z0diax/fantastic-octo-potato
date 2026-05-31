/* UP - Katitirok Gallery Application Logic */

// --- SEED DATA ---
const DEFAULT_PHOTOS = [
  {
    id: 'seed-batch89-beach1',
    url: 'assets/Batch 89/att.gqoFc1LH54ig3pBWizTQPrhePsl_zQ20FWctxDwL1LU.jpg',
    caption: 'A memorable beach getaway with the UP Batch 1989 sisters. Sun, sand, and smiles capturing the lifelong friendships forged during our university days.',
    category: 'batch 89',
    likes: [],
    views: 0,
    comments: [],
    approved: true,
    uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'seed-batch89-beach2',
    url: 'assets/Batch 89/att.Ja1e36PxpKWazMT3Y4QpwwygsZ7bFB0ccw_CfZOpdvY.jpg',
    caption: 'UP Batch 1989 outing: A full house of friends sharing laughter and good times by the beach, keeping the spirit of camaraderie alive.',
    category: 'batch 89',
    likes: [],
    views: 0,
    comments: [],
    approved: true,
    uploadedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'seed-batch89-beach3',
    url: 'assets/Batch 89/att.JX93g8F2JqUVRnArrk6BWy6C5netRkrYBpHbC8zt0KU.jpg',
    caption: "UP Batch '89: Posing with youthful energy and joy during our memorable summer trip. A snapshot of true friendship.",
    category: 'batch 89',
    likes: [],
    views: 0,
    comments: [],
    approved: true,
    uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'seed-batch89-sports',
    url: 'assets/Batch 89/att.ugZE2XlbKni0XGlWW74AXeK0TkHepZfC4A5ylwzfIOY.jpg',
    caption: "The UP Batch '89 baseball/softball team posing in their green and white uniforms. Sportsmanship, team spirit, and pride representing the green and gold.",
    category: 'batch 89',
    likes: [],
    views: 0,
    comments: [],
    approved: true,
    uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'seed-batch89-sisterhood',
    url: 'assets/Batch 89/att.yKt1NA99pLa_ss6AdCjbL8nccu3jjSizKtI6o3RUU0w.jpg',
    caption: "A beautiful sisterhood. UP Batch '89 alumni lining up and showing the strong bond that links them through decades of friendship.",
    category: 'batch 89',
    likes: [],
    views: 0,
    comments: [],
    approved: true,
    uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// --- FIREBASE DUAL-MODE DETECTION ---
let isFirebaseEnabled = false;
let db = null;
let storage = null;

if (typeof firebaseConfig !== 'undefined' && 
    firebaseConfig.apiKey && 
    firebaseConfig.apiKey !== "YOUR_API_KEY" &&
    firebaseConfig.projectId && 
    firebaseConfig.projectId !== "YOUR_PROJECT_ID") {
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    storage = firebase.storage();
    isFirebaseEnabled = true;
    console.log("Firebase Sync Mode Active! 🔥");
  } catch (err) {
    console.error("Firebase failed to initialize. Falling back to Local Demo Mode.", err);
  }
} else {
  console.log("Local Demo Mode Active (No Firebase config detected). 💾");
}

// --- APP STATE ---
let state = {
  photos: [],
  branding: {
    shieldText: "UP",
    titleText: "KATITIROK",
    subtitleText: "Grand Alumni Gallery",
    logoImage: null
  },
  currentCarouselIndex: 0,
  carouselTimer: null,
  activeFilter: 'all',
  adminTab: 'pending', // 'pending' or 'approved'
  isLoggedIn: false,
  selectedPhoto: null,
  editingPhotoId: null
};

// --- DOM ELEMENTS ---
const elements = {
  // Navigation
  logoBtn: document.getElementById('nav-logo'),
  homeLink: document.getElementById('nav-home-link'),
  openUploadBtn: document.getElementById('open-upload-btn'),
  
  // Views
  publicView: document.getElementById('public-view-container'),
  adminView: document.getElementById('admin-view-container'),
  
  // Carousel
  carouselTrack: document.getElementById('carousel-track'),
  carouselPrev: document.getElementById('carousel-prev'),
  carouselNext: document.getElementById('carousel-next'),
  carouselDots: document.getElementById('carousel-dots'),
  
  // Gallery
  galleryGrid: document.getElementById('gallery-grid'),
  filtersContainer: document.getElementById('gallery-filters-container'),
  
  // Lightbox Modal
  lightboxModal: document.getElementById('lightbox-modal'),
  closeLightboxBtn: document.getElementById('close-lightbox-btn'),
  lightboxImg: document.getElementById('lightbox-img'),
  lightboxCategory: document.getElementById('lightbox-category'),
  lightboxDate: document.getElementById('lightbox-date'),
  lightboxCaption: document.getElementById('lightbox-caption'),
  lightboxViews: document.getElementById('lightbox-views-count'),
  lightboxLikes: document.getElementById('lightbox-likes-count'),
  likeBtn: document.getElementById('like-btn'),
  
  // Comments elements
  lightboxCommentsList: document.getElementById('lightbox-comments-list'),
  lightboxCommentForm: document.getElementById('lightbox-comment-form'),
  commentAuthorInput: document.getElementById('comment-author-input'),
  commentTextInput: document.getElementById('comment-text-input'),
  lightboxCommentsCount: document.getElementById('lightbox-comments-count'),
  
  // Upload Modal
  uploadModal: document.getElementById('upload-modal'),
  closeUploadBtn: document.getElementById('close-upload-btn'),
  cancelUploadBtn: document.getElementById('cancel-upload-btn'),
  uploadForm: document.getElementById('upload-form'),
  fileDropzone: document.getElementById('file-dropzone'),
  fileInput: document.getElementById('upload-file-input'),
  previewImg: document.getElementById('dropzone-preview-img'),
  uploadCaption: document.getElementById('upload-caption'),
  uploadCategory: document.getElementById('upload-category'),
  customCategoryGroup: document.getElementById('custom-category-group'),
  customCategoryInput: document.getElementById('upload-custom-category'),
  
  // Edit Caption Modal
  editCaptionModal: document.getElementById('edit-caption-modal'),
  closeEditCaptionBtn: document.getElementById('close-edit-caption-btn'),
  cancelEditCaptionBtn: document.getElementById('cancel-edit-caption-btn'),
  editCaptionForm: document.getElementById('edit-caption-form'),
  editPhotoCaption: document.getElementById('edit-photo-caption'),
  
  // Admin Login
  adminLoginCard: document.getElementById('admin-login-card'),
  adminLoginForm: document.getElementById('admin-login-form'),
  adminUsername: document.getElementById('admin-username'),
  adminPassword: document.getElementById('admin-password'),
  
  // Admin Dashboard
  adminDashboard: document.getElementById('admin-dashboard-container'),
  adminLogoutBtn: document.getElementById('admin-logout-btn'),
  statTotalPhotos: document.getElementById('stat-total-photos'),
  statTotalLikes: document.getElementById('stat-total-likes'),
  statTotalViews: document.getElementById('stat-total-views'),
  tabPendingBtn: document.getElementById('tab-pending-btn'),
  tabApprovedBtn: document.getElementById('tab-approved-btn'),
  pendingCountBadge: document.getElementById('pending-count'),
  adminQueueList: document.getElementById('admin-queue-list'),
  
  // Logo Nodes
  navLogoShield: document.getElementById('nav-logo-shield'),
  navLogoTitle: document.getElementById('nav-logo-title'),
  navLogoSubtitle: document.getElementById('nav-logo-subtitle'),
  footerLogoShield: document.getElementById('footer-logo-shield'),
  footerLogoTitle: document.getElementById('footer-logo-title'),
  footerLogoSubtitle: document.getElementById('footer-logo-subtitle'),

  // Branding Customization elements
  tabSettingsBtn: document.getElementById('tab-settings-btn'),
  adminSettingsPanel: document.getElementById('admin-settings-panel'),
  brandingForm: document.getElementById('branding-settings-form'),
  settingsShieldInput: document.getElementById('settings-shield-text'),
  settingsTitleInput: document.getElementById('settings-title-text'),
  settingsSubtitleInput: document.getElementById('settings-subtitle-text'),
  settingsLogoImageInput: document.getElementById('settings-logo-image'),
  settingsLogoPreview: document.getElementById('settings-logo-preview'),
  settingsClearLogoImageBtn: document.getElementById('clear-logo-image-btn'),

  // Notifications
  toastContainer: document.getElementById('toast-container'),
  
  // Footer Links
  footerHome: document.getElementById('footer-home-btn'),
  footerUpload: document.getElementById('footer-upload-btn')
};

// --- UNIQUE CLIENT IDENTIFIER & LIKE STATE HELPERS ---
function getClientId() {
  let clientId = localStorage.getItem('up_katitirok_client_id');
  if (!clientId) {
    clientId = 'client-' + Date.now() + '-' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem('up_katitirok_client_id', clientId);
  }
  return clientId;
}

function getLikesCount(photo) {
  if (Array.isArray(photo.likes)) {
    return photo.likes.length;
  }
  return photo.likes || 0;
}

function hasUserLiked(photo) {
  const clientId = getClientId();
  if (Array.isArray(photo.likes)) {
    return photo.likes.includes(clientId);
  }
  const likeStorageKey = `liked_${photo.id}`;
  return localStorage.getItem(likeStorageKey) === 'true';
}

function updateLightboxLikes(count, animate = true) {
  const likesSpan = elements.lightboxLikes;
  if (!likesSpan) return;
  const currentCount = parseInt(likesSpan.textContent) || 0;
  
  likesSpan.textContent = count;
  
  if (animate && currentCount !== count) {
    likesSpan.classList.remove('number-pop');
    void likesSpan.offsetWidth; // Trigger reflow
    likesSpan.classList.add('number-pop');
    
    const heartIcon = document.querySelector('.lightbox-stat-item.likes i');
    if (heartIcon) {
      heartIcon.classList.remove('heart-pulse');
      void heartIcon.offsetWidth; // Trigger reflow
      heartIcon.classList.add('heart-pulse');
    }
  }
}

// --- INITIALIZATION ---
function initApp() {
  loadDatabase();
  applyBranding();
  initEventListeners();
  startCarouselAutoPlay();
  
  // Check session login state
  if (sessionStorage.getItem('admin_logged') === 'true') {
    state.isLoggedIn = true;
    showAdminDashboard();
  }
}

// --- UI SYNC ---
function syncUI() {
  renderCarousel();
  renderFilters();
  renderGallery();
  updatePendingCountBadge();
  if (state.isLoggedIn) {
    updateAdminStats();
    renderAdminQueue();
  }
}

// --- DATABASE HANDLERS (FIREBASE & LOCALSTORAGE) ---
function loadDatabase() {
  if (isFirebaseEnabled) {
    db.collection('photos').onSnapshot((snapshot) => {
      const fbPhotos = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (typeof data.likes === 'number') {
          console.log(`Converting numeric likes to array for photo: ${doc.id}`);
          const count = data.likes;
          const dummyLikes = [];
          for (let i = 0; i < count; i++) {
            dummyLikes.push(`migrated-${i}`);
          }
          db.collection('photos').doc(doc.id).update({ likes: dummyLikes }).catch(e => console.error(e));
          data.likes = dummyLikes;
        }
        if (!data.comments || !Array.isArray(data.comments)) {
          console.log(`Initializing missing comments array for photo: ${doc.id}`);
          db.collection('photos').doc(doc.id).update({ comments: [] }).catch(e => console.error(e));
          data.comments = [];
        }
        fbPhotos.push({ id: doc.id, ...data });
      });
      
      // If Firestore is empty, seed it
      if (fbPhotos.length === 0) {
        console.log("Firestore empty. Seeding DEFAULT_PHOTOS...");
        DEFAULT_PHOTOS.forEach(photo => {
          db.collection('photos').doc(photo.id).set(photo);
        });
      } else {
        // Dynamic seeding for newly added seed photos and removal of deprecated ones
        const oldSeedIds = ['seed-oblation', 'seed-reunion', 'seed-sunflowers', 'seed-celebration'];
        let needsWrite = false;
        
        oldSeedIds.forEach(id => {
          const exists = fbPhotos.some(p => p.id === id);
          if (exists) {
            console.log(`Cleaning old seed from Firestore: ${id}`);
            db.collection('photos').doc(id).delete().catch(err => console.error(err));
            needsWrite = true;
          }
        });
        
        DEFAULT_PHOTOS.forEach(photo => {
          const fbPhoto = fbPhotos.find(p => p.id === photo.id);
          if (!fbPhoto) {
            console.log(`Seeding missing photo to Firestore: ${photo.id}`);
            db.collection('photos').doc(photo.id).set(photo);
            needsWrite = true;
          }
        });
        
        if (!needsWrite) {
          state.photos = fbPhotos;
          
          // Reactive details modal updates if open
          if (state.selectedPhoto) {
            const updated = fbPhotos.find(p => p.id === state.selectedPhoto.id);
            if (updated) {
              state.selectedPhoto = updated;
              elements.lightboxViews.textContent = updated.views;
              updateLightboxLikes(getLikesCount(updated));
              renderComments(updated);
            }
          }
          
          syncUI();
        }
      }
    }, (error) => {
      console.error("Firestore onSnapshot error, falling back to local storage.", error);
      isFirebaseEnabled = false;
      loadDatabase();
    });
  } else {
    const localData = localStorage.getItem('up_katitirok_photos');
    if (localData) {
      try {
        state.photos = JSON.parse(localData);
        // Clean up old seeds locally
        const oldSeedIds = ['seed-oblation', 'seed-reunion', 'seed-sunflowers', 'seed-celebration'];
        const initialLength = state.photos.length;
        state.photos = state.photos.filter(p => !oldSeedIds.includes(p.id));
        let modified = state.photos.length !== initialLength;
        
        // Ensure comments and likes arrays exist for all photos locally
        state.photos.forEach(p => {
          if (!p.comments || !Array.isArray(p.comments)) {
            p.comments = [];
            modified = true;
          }
          if (typeof p.likes === 'number') {
            const count = p.likes;
            p.likes = [];
            for (let i = 0; i < count; i++) {
              p.likes.push(`migrated-${i}`);
            }
            modified = true;
          }
        });

        DEFAULT_PHOTOS.forEach(photo => {
          const localPhoto = state.photos.find(p => p.id === photo.id);
          if (!localPhoto) {
            state.photos.push(photo);
            modified = true;
          }
        });
        if (modified) saveDatabase();
      } catch (e) {
        console.error("Failed to parse local storage photos. Seeding instead.", e);
        state.photos = [...DEFAULT_PHOTOS];
        saveDatabase();
      }
    } else {
      state.photos = [...DEFAULT_PHOTOS];
      saveDatabase();
    }
    syncUI();
  }
}

function saveDatabase() {
  if (!isFirebaseEnabled) {
    localStorage.setItem('up_katitirok_photos', JSON.stringify(state.photos));
    updatePendingCountBadge();
  }
}

// --- EVENT LISTENERS ---
function initEventListeners() {
  // Navigation secret triple-click to open Admin View
  let logoClicks = 0;
  let logoClickTimer = null;
  
  elements.logoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    logoClicks++;
    
    clearTimeout(logoClickTimer);
    logoClickTimer = setTimeout(() => {
      logoClicks = 0;
    }, 1000); // 1-second timeout for triple click
    
    if (logoClicks === 3) {
      logoClicks = 0;
      clearTimeout(logoClickTimer);
      showAdminView();
      showToast("Accessing secret Admin Portal...", "info");
    } else {
      showHomeView();
    }
  });

  if (elements.homeLink) {
    elements.homeLink.addEventListener('click', (e) => { e.preventDefault(); showHomeView(); });
  }
  elements.footerHome.addEventListener('click', (e) => { e.preventDefault(); showHomeView(); });
  
  // Modals Toggles
  elements.openUploadBtn.addEventListener('click', () => openModal(elements.uploadModal));
  elements.footerUpload.addEventListener('click', (e) => { e.preventDefault(); openModal(elements.uploadModal); });
  
  elements.closeUploadBtn.addEventListener('click', () => closeModal(elements.uploadModal));
  elements.cancelUploadBtn.addEventListener('click', () => closeModal(elements.uploadModal));
  elements.closeLightboxBtn.addEventListener('click', () => closeModal(elements.lightboxModal));
  elements.closeEditCaptionBtn.addEventListener('click', () => closeModal(elements.editCaptionModal));
  elements.cancelEditCaptionBtn.addEventListener('click', () => closeModal(elements.editCaptionModal));
  
  // Close modals clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === elements.uploadModal) closeModal(elements.uploadModal);
    if (e.target === elements.lightboxModal) closeModal(elements.lightboxModal);
    if (e.target === elements.editCaptionModal) closeModal(elements.editCaptionModal);
  });
  
  // Carousel Buttons
  elements.carouselPrev.addEventListener('click', () => moveCarousel(-1));
  elements.carouselNext.addEventListener('click', () => moveCarousel(1));
  
  // Gallery Filters
  elements.filtersContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      state.activeFilter = e.target.getAttribute('data-filter');
      renderGallery();
    }
  });
  
  // Lightbox Interactions
  elements.likeBtn.addEventListener('click', handleLikeToggle);
  
  // Image Upload Logic (Drag and Drop / Select)
  elements.fileDropzone.addEventListener('click', () => elements.fileInput.click());
  elements.fileInput.addEventListener('change', handleFileSelect);
  
  // Custom Category Dropdown Toggler
  elements.uploadCategory.addEventListener('change', () => {
    if (elements.uploadCategory.value === 'custom-new') {
      elements.customCategoryGroup.style.display = 'flex';
      elements.customCategoryInput.required = true;
      elements.customCategoryInput.focus();
    } else {
      elements.customCategoryGroup.style.display = 'none';
      elements.customCategoryInput.required = false;
      elements.customCategoryInput.value = '';
    }
  });
  
  elements.fileDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    elements.fileDropzone.classList.add('dragover');
  });
  elements.fileDropzone.addEventListener('dragleave', () => {
    elements.fileDropzone.classList.remove('dragover');
  });
  elements.fileDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    elements.fileDropzone.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
      elements.fileInput.files = e.dataTransfer.files;
      handleFileSelect();
    }
  });
  
  elements.uploadForm.addEventListener('submit', handleUploadSubmit);
  elements.editCaptionForm.addEventListener('submit', handleEditCaptionSubmit);
  elements.lightboxCommentForm.addEventListener('submit', handleCommentSubmit);
  
  // Admin Interactions
  elements.adminLoginForm.addEventListener('submit', handleAdminLogin);
  elements.adminLogoutBtn.addEventListener('click', handleAdminLogout);
  
  elements.tabPendingBtn.addEventListener('click', () => switchAdminTab('pending'));
  elements.tabApprovedBtn.addEventListener('click', () => switchAdminTab('approved'));
  elements.tabSettingsBtn.addEventListener('click', () => switchAdminTab('settings'));
  elements.brandingForm.addEventListener('submit', handleBrandingSubmit);
  elements.settingsLogoImageInput.addEventListener('change', handleLogoFileSelect);
  elements.settingsClearLogoImageBtn.addEventListener('click', handleClearLogoImage);
}

// --- NAVIGATION VIEWS ---
function showHomeView() {
  if (elements.homeLink) elements.homeLink.classList.add('active');
  elements.publicView.style.display = 'block';
  elements.adminView.classList.remove('active');
  
  // Restart Carousel AutoPlay
  startCarouselAutoPlay();
}

function showAdminView() {
  if (elements.homeLink) elements.homeLink.classList.remove('active');
  elements.publicView.style.display = 'none';
  elements.adminView.classList.add('active');
  
  // Stop Carousel AutoPlay
  clearInterval(state.carouselTimer);
  
  if (state.isLoggedIn) {
    showAdminDashboard();
  } else {
    showAdminLogin();
  }
}

// --- DYNAMIC CATEGORY AND FILTER RENDERERS ---
function getActiveCategories() {
  const base = [];
  // Extract all unique categories from approved photos (lowercase and sanitized)
  const approvedCats = state.photos
    .filter(p => p.approved)
    .map(p => p.category.toLowerCase().trim());
  
  return Array.from(new Set([...base, ...approvedCats]));
}

function renderFilters() {
  const categories = getActiveCategories();
  let html = `<button class="filter-btn ${state.activeFilter === 'all' ? 'active' : ''}" data-filter="all">All Photos</button>`;
  
  categories.forEach(cat => {
    // Capitalize category name for display
    const label = cat.charAt(0).toUpperCase() + cat.slice(1);
    html += `<button class="filter-btn ${state.activeFilter === cat ? 'active' : ''}" data-filter="${cat}">${label}</button>`;
  });
  
  html += `<button class="filter-btn ${state.activeFilter === 'uploads' ? 'active' : ''}" data-filter="uploads">User Uploads</button>`;
  elements.filtersContainer.innerHTML = html;
}

function renderUploadCategories() {
  const categories = getActiveCategories();
  let html = '';
  
  categories.forEach(cat => {
    const label = cat.charAt(0).toUpperCase() + cat.slice(1);
    html += `<option value="${cat}">${label}</option>`;
  });
  
  html += `<option value="custom-new">Other (Create New)...</option>`;
  elements.uploadCategory.innerHTML = html;
  
  // Hide custom input group by default
  elements.customCategoryGroup.style.display = 'none';
  elements.customCategoryInput.required = false;
  elements.customCategoryInput.value = '';
}

// --- APP BRANDING SETTINGS ---
let customLogoImageBase64 = null;

function applyBrandingData(data) {
  state.branding = data;
  if (data.logoImage && elements.navLogoShield && elements.footerLogoShield) {
    const imgNav = `<img src="${data.logoImage}" alt="Logo" class="logo-shield-image">`;
    const imgFooter = `<img src="${data.logoImage}" alt="Logo" class="logo-shield-image">`;
    elements.navLogoShield.innerHTML = imgNav;
    elements.footerLogoShield.innerHTML = imgFooter;
    elements.navLogoShield.classList.add('has-image');
    elements.footerLogoShield.classList.add('has-image');
  } else {
    if (data.shieldText && elements.navLogoShield && elements.footerLogoShield) {
      elements.navLogoShield.textContent = data.shieldText;
      elements.footerLogoShield.textContent = data.shieldText;
      elements.navLogoShield.classList.remove('has-image');
      elements.footerLogoShield.classList.remove('has-image');
    }
  }
  
  if (data.titleText && elements.navLogoTitle && elements.footerLogoTitle) {
    elements.navLogoTitle.textContent = data.titleText;
    elements.footerLogoTitle.textContent = data.titleText;
  }
  if (data.subtitleText && elements.navLogoSubtitle && elements.footerLogoSubtitle) {
    elements.navLogoSubtitle.textContent = data.subtitleText;
    elements.footerLogoSubtitle.textContent = data.subtitleText;
  }
}

function applyBranding() {
  if (isFirebaseEnabled) {
    db.collection('settings').doc('branding').onSnapshot((doc) => {
      if (doc.exists) {
        applyBrandingData(doc.data());
      } else {
        const localData = localStorage.getItem('up_katitirok_branding');
        let data = {
          shieldText: "UP",
          titleText: "KATITIROK",
          subtitleText: "Grand Alumni Gallery"
        };
        if (localData) {
          try { data = JSON.parse(localData); } catch (e) {}
        }
        db.collection('settings').doc('branding').set(data);
      }
    }, (err) => {
      console.error("Firestore branding settings error, falling back to local.", err);
      applyBrandingLocal();
    });
  } else {
    applyBrandingLocal();
  }
}

function applyBrandingLocal() {
  const branding = localStorage.getItem('up_katitirok_branding');
  if (branding) {
    try {
      applyBrandingData(JSON.parse(branding));
    } catch (e) {
      console.error("Failed to parse branding settings.", e);
    }
  }
}

function loadBrandingInputs() {
  const data = state.branding;
  elements.settingsShieldInput.value = data.shieldText || "UP";
  elements.settingsTitleInput.value = data.titleText || "KATITIROK";
  elements.settingsSubtitleInput.value = data.subtitleText || "Grand Alumni Gallery";
  
  if (data.logoImage && elements.settingsLogoPreview) {
    elements.settingsLogoPreview.src = data.logoImage;
    elements.settingsLogoPreview.style.display = 'block';
  } else if (elements.settingsLogoPreview) {
    elements.settingsLogoPreview.style.display = 'none';
    elements.settingsLogoPreview.src = '';
  }
}

function handleLogoFileSelect() {
  const file = elements.settingsLogoImageInput.files[0];
  if (!file) return;
  
  if (!file.type.match('image.*')) {
    showToast("Invalid file format. Please select an image.", "error");
    elements.settingsLogoImageInput.value = '';
    return;
  }
  
  if (file.size > 25 * 1024 * 1024) {
    showToast("Logo size too large. Please select an image under 25MB.", "error");
    elements.settingsLogoImageInput.value = '';
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    // Resize logo to keep local storage lightweight (128px PNG)
    const tempImg = new Image();
    tempImg.onload = function() {
      const canvas = document.createElement('canvas');
      const size = 128;
      canvas.width = size;
      canvas.height = size;
      
      const ctx = canvas.getContext('2d');
      // Fill canvas background with solid white
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(tempImg, 0, 0, size, size);
      
      customLogoImageBase64 = canvas.toDataURL('image/png');
      
      // Update preview element in settings tab
      if (elements.settingsLogoPreview) {
        elements.settingsLogoPreview.src = customLogoImageBase64;
        elements.settingsLogoPreview.style.display = 'block';
      }
      
      showToast("New custom logo loaded.", "success");
    };
    tempImg.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function handleClearLogoImage() {
  const confirmClear = confirm("Are you sure you want to remove the custom logo image and revert to the shield initials?");
  if (!confirmClear) return;
  
  const brandingData = { ...state.branding };
  delete brandingData.logoImage;
  
  if (isFirebaseEnabled) {
    db.collection('settings').doc('branding').set(brandingData).then(() => {
      showToast("Custom logo image removed. Reverted to initials.", "info");
    }).catch(err => {
      console.error(err);
      showToast("Failed to clear logo image.", "error");
    });
  } else {
    localStorage.setItem('up_katitirok_branding', JSON.stringify(brandingData));
    state.branding = brandingData;
    applyBrandingLocal();
    showToast("Custom logo image removed. Reverted to initials.", "info");
  }
  
  // Reset input and preview
  elements.settingsLogoImageInput.value = '';
  customLogoImageBase64 = null;
  if (elements.settingsLogoPreview) {
    elements.settingsLogoPreview.style.display = 'none';
    elements.settingsLogoPreview.src = '';
  }
}

function handleBrandingSubmit(e) {
  e.preventDefault();
  
  const shieldVal = elements.settingsShieldInput.value.trim();
  const titleVal = elements.settingsTitleInput.value.trim();
  const subtitleVal = elements.settingsSubtitleInput.value.trim();
  
  if (!shieldVal || !titleVal || !subtitleVal) {
    showToast("All fields are required.", "error");
    return;
  }
  
  let currentLogoImage = state.branding.logoImage;
  if (customLogoImageBase64) {
    currentLogoImage = customLogoImageBase64;
  }
  
  const brandingData = {
    shieldText: shieldVal,
    titleText: titleVal,
    subtitleText: subtitleVal,
    logoImage: currentLogoImage
  };
  
  if (isFirebaseEnabled) {
    db.collection('settings').doc('branding').set(brandingData).then(() => {
      showToast("Branding settings saved successfully! ✨", "success");
    }).catch(err => {
      console.error(err);
      showToast("Failed to save branding settings.", "error");
    });
  } else {
    localStorage.setItem('up_katitirok_branding', JSON.stringify(brandingData));
    state.branding = brandingData;
    applyBrandingLocal();
    showToast("Branding settings saved successfully! ✨", "success");
  }
  
  elements.settingsLogoImageInput.value = '';
  customLogoImageBase64 = null;
  switchAdminTab('approved');
}

// --- MODAL UTILITIES ---
let base64ImageString = null; // Store base64 data for upload

function openModal(modal) {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Stop scrolling background
  if (modal === elements.uploadModal) {
    renderUploadCategories();
  }
}

function closeModal(modal) {
  modal.classList.remove('active');
  document.body.style.overflow = '';
  
  // Clear forms if it is the upload modal
  if (modal === elements.uploadModal) {
    elements.uploadForm.reset();
    elements.previewImg.style.display = 'none';
    elements.previewImg.src = '';
    elements.fileDropzone.querySelector('.dropzone-icon').style.display = 'block';
    elements.fileDropzone.querySelectorAll('.dropzone-text').forEach(t => t.style.display = 'block');
    elements.customCategoryGroup.style.display = 'none';
    elements.customCategoryInput.value = '';
    elements.customCategoryInput.required = false;
    base64ImageString = null;
  } else if (modal === elements.editCaptionModal) {
    elements.editCaptionForm.reset();
    state.editingPhotoId = null;
  }
}

// --- TOAST NOTIFICATIONS ---
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = 'fa-circle-info';
  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'error') icon = 'fa-triangle-exclamation';
  
  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${message}</span>
  `;
  
  elements.toastContainer.appendChild(toast);
  
  // Remove toast after animation
  setTimeout(() => {
    toast.style.transform = 'translateY(20px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// --- CAROUSEL DISPLAY CODE ---
function renderCarousel() {
  const approved = state.photos.filter(p => p.approved);
  if (approved.length === 0) {
    elements.carouselTrack.innerHTML = `<div class="empty-queue-msg" style="padding-top: 15rem;"><i class="fa-regular fa-image"></i>No carousel memories available.</div>`;
    elements.carouselDots.innerHTML = '';
    return;
  }

  // Display top 4 photos in carousel
  const carouselPhotos = approved.slice(-4).reverse();
  
  let trackHTML = '';
  let dotsHTML = '';
  
  carouselPhotos.forEach((photo, index) => {
    const isActive = index === 0 ? 'active' : '';
    const dateObj = new Date(photo.uploadedAt);
    const dateStr = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    trackHTML += `
      <div class="carousel-slide ${isActive}" data-index="${index}">
        <img src="${photo.url}" alt="Carousel Photo ${index + 1}" class="carousel-image">
        <div class="carousel-overlay"></div>
        <div class="carousel-content">
          <span class="carousel-badge">${photo.category}</span>
          <h1 class="carousel-title">UP Memories</h1>
          <p class="carousel-caption">${photo.caption}</p>
          <button class="btn btn-primary" onclick="openLightbox('${photo.id}')">
            <i class="fa-solid fa-expand"></i> View Details
          </button>
        </div>
      </div>
    `;
    
    dotsHTML += `
      <button class="carousel-dot ${isActive}" data-index="${index}" aria-label="Go to slide ${index + 1}"></button>
    `;
  });
  
  elements.carouselTrack.innerHTML = trackHTML;
  elements.carouselDots.innerHTML = dotsHTML;
  state.currentCarouselIndex = 0;
  
  // Set up dot events
  document.querySelectorAll('.carousel-dot').forEach(dot => {
    dot.addEventListener('click', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index'));
      setCarouselSlide(idx);
      startCarouselAutoPlay(); // Reset timer
    });
  });
}

function setCarouselSlide(index) {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  
  if (slides.length === 0) return;
  
  slides[state.currentCarouselIndex].classList.remove('active');
  dots[state.currentCarouselIndex].classList.remove('active');
  
  state.currentCarouselIndex = index;
  
  slides[state.currentCarouselIndex].classList.add('active');
  dots[state.currentCarouselIndex].classList.add('active');
}

function moveCarousel(direction) {
  const slidesCount = document.querySelectorAll('.carousel-slide').length;
  if (slidesCount <= 1) return;
  
  let newIndex = state.currentCarouselIndex + direction;
  if (newIndex >= slidesCount) newIndex = 0;
  if (newIndex < 0) newIndex = slidesCount - 1;
  
  setCarouselSlide(newIndex);
  startCarouselAutoPlay(); // Reset timer
}

function startCarouselAutoPlay() {
  clearInterval(state.carouselTimer);
  state.carouselTimer = setInterval(() => {
    moveCarousel(1);
  }, 5000);
}

// --- GALLERY GRID DISPLAY CODE ---
function renderGallery() {
  let filtered = state.photos.filter(p => p.approved);
  
  if (state.activeFilter !== 'all') {
    if (state.activeFilter === 'uploads') {
      // Filter for custom items that were uploaded (e.g. not pre-seeded items)
      filtered = filtered.filter(p => p.id.indexOf('seed') === -1);
    } else {
      filtered = filtered.filter(p => p.category === state.activeFilter);
    }
  }

  // Sort: most recent first
  filtered.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  
  if (filtered.length === 0) {
    elements.galleryGrid.innerHTML = `
      <div class="empty-queue-msg" style="grid-column: 1 / -1;">
        <i class="fa-regular fa-image"></i>
        <h3>No Memories Found</h3>
        <p>Be the first to upload a photo under this category!</p>
      </div>
    `;
    return;
  }
  
  let gridHTML = '';
  filtered.forEach(photo => {
    const isUserUpload = photo.id.indexOf('seed') === -1;
    const uploadBadge = isUserUpload ? `<span class="upload-badge">Contributor</span>` : '';
    
    gridHTML += `
      <div class="gallery-item" onclick="openLightbox('${photo.id}')">
        ${uploadBadge}
        <div class="gallery-img-container">
          <img src="${photo.url}" alt="Alumni Photo" class="gallery-img" loading="lazy">
          <div class="gallery-item-overlay"></div>
        </div>
        <div class="gallery-item-details">
          <p class="gallery-item-caption">${photo.caption}</p>
          <div class="gallery-item-meta">
            <span style="text-transform: capitalize; font-weight: 600; color: var(--up-gold);">${photo.category}</span>
            <div class="meta-stats">
              <span class="meta-stat views-count">
                <i class="fa-regular fa-eye"></i> ${photo.views}
              </span>
              <span class="meta-stat likes-count">
                <i class="fa-regular fa-heart"></i> ${getLikesCount(photo)}
              </span>
              <span class="meta-stat comments-count">
                <i class="fa-regular fa-comment"></i> ${(photo.comments || []).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  
  elements.galleryGrid.innerHTML = gridHTML;
}

// --- LIGHTBOX DETAILS MODAL VIEW ---
function openLightbox(photoId) {
  const photo = state.photos.find(p => p.id === photoId);
  if (!photo) return;
  
  state.selectedPhoto = photo;
  
  // Populate content
  elements.lightboxImg.src = photo.url;
  elements.lightboxImg.alt = photo.caption;
  elements.lightboxCategory.textContent = photo.category;
  
  const dateObj = new Date(photo.uploadedAt);
  elements.lightboxDate.textContent = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  elements.lightboxCaption.textContent = photo.caption;
  
  // Track Unique Views (Using sessionStorage to check uniqueness in the current browser session)
  const sessionViewKey = `viewed_${photo.id}`;
  if (!sessionStorage.getItem(sessionViewKey)) {
    if (isFirebaseEnabled) {
      db.collection('photos').doc(photo.id).update({
        views: firebase.firestore.FieldValue.increment(1)
      }).then(() => {
        sessionStorage.setItem(sessionViewKey, 'true');
      }).catch(err => console.error(err));
    } else {
      photo.views += 1;
      saveDatabase();
      sessionStorage.setItem(sessionViewKey, 'true');
      renderGallery();
      if (state.isLoggedIn) updateAdminStats();
    }
  }
  
  elements.lightboxViews.textContent = photo.views;
  updateLightboxLikes(getLikesCount(photo), false);
  
  // Render Comments
  elements.lightboxCommentForm.reset();
  renderComments(photo);
  
  // Prefill commenter name from localStorage
  const savedName = localStorage.getItem('up_gallery_author_name');
  if (savedName && elements.commentAuthorInput) {
    elements.commentAuthorInput.value = savedName;
  }
  
  // Check Likes State
  const hasLiked = hasUserLiked(photo);
  updateLikeBtnState(hasLiked);
  
  openModal(elements.lightboxModal);
}

window.openLightbox = openLightbox; // Make it global for inline onclick call

function updateLikeBtnState(hasLiked) {
  if (hasLiked) {
    elements.likeBtn.classList.add('liked');
    elements.likeBtn.innerHTML = `<i class="fa-solid fa-heart"></i>`;
  } else {
    elements.likeBtn.classList.remove('liked');
    elements.likeBtn.innerHTML = `<i class="fa-regular fa-heart"></i>`;
  }
}

function handleLikeToggle() {
  if (!state.selectedPhoto) return;
  
  const photo = state.photos.find(p => p.id === state.selectedPhoto.id);
  const clientId = getClientId();
  const liked = hasUserLiked(photo);
  const likeStorageKey = `liked_${photo.id}`;
  
  if (liked) {
    // Unlike
    if (isFirebaseEnabled) {
      db.collection('photos').doc(photo.id).update({
        likes: firebase.firestore.FieldValue.arrayRemove(clientId)
      }).then(() => {
        localStorage.removeItem(likeStorageKey);
        showToast("Memory unliked.", "info");
        updateLikeBtnState(false);
      }).catch(err => console.error(err));
    } else {
      if (Array.isArray(photo.likes)) {
        photo.likes = photo.likes.filter(id => id !== clientId);
      } else {
        photo.likes = Math.max(0, (photo.likes || 0) - 1);
      }
      localStorage.removeItem(likeStorageKey);
      showToast("Memory unliked.", "info");
      updateLikeBtnState(false);
      saveDatabase();
      updateLightboxLikes(getLikesCount(photo));
      renderGallery();
      if (state.isLoggedIn) updateAdminStats();
    }
  } else {
    // Like
    if (isFirebaseEnabled) {
      db.collection('photos').doc(photo.id).update({
        likes: firebase.firestore.FieldValue.arrayUnion(clientId)
      }).then(() => {
        localStorage.setItem(likeStorageKey, 'true');
        showToast("You liked this memory! ❤️", "success");
        updateLikeBtnState(true);
      }).catch(err => console.error(err));
    } else {
      if (!Array.isArray(photo.likes)) {
        const currentLikes = photo.likes || 0;
        photo.likes = [];
        for (let i = 0; i < currentLikes; i++) {
          photo.likes.push(`dummy-${i}`);
        }
      }
      if (!photo.likes.includes(clientId)) {
        photo.likes.push(clientId);
      }
      localStorage.setItem(likeStorageKey, 'true');
      showToast("You liked this memory! ❤️", "success");
      updateLikeBtnState(true);
      saveDatabase();
      updateLightboxLikes(getLikesCount(photo));
      renderGallery();
      if (state.isLoggedIn) updateAdminStats();
    }
  }
}

// --- COMMENTS SECTION LOGIC ---
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderComments(photo) {
  const commentsList = elements.lightboxCommentsList;
  const commentsCount = elements.lightboxCommentsCount;
  if (!commentsList || !commentsCount) return;

  const comments = photo.comments || [];
  commentsCount.textContent = comments.length;

  if (comments.length === 0) {
    commentsList.innerHTML = `<div class="empty-comments-msg" style="text-align: center; color: var(--text-muted); font-size: 0.82rem; padding: 1.5rem 0;">No comments yet. Share a memory!</div>`;
    return;
  }

  let html = '';
  comments.forEach(comment => {
    let dateStr = '';
    const dateObj = new Date(comment.timestamp);
    if (!isNaN(dateObj.getTime())) {
      dateStr = dateObj.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } else {
      dateStr = 'Recently';
    }

    let deleteBtn = '';
    if (state.isLoggedIn) {
      deleteBtn = `
        <button class="btn-delete-comment" onclick="deleteComment('${photo.id}', '${comment.id}')" title="Delete comment">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      `;
    }

    const firstChar = comment.author ? comment.author.charAt(0) : '?';

    html += `
      <div class="comment-item" data-comment-id="${comment.id}">
        <div class="comment-avatar">${escapeHtml(firstChar)}</div>
        <div class="comment-content-wrapper">
          <div class="comment-meta">
            <span class="comment-author">${escapeHtml(comment.author)}</span>
            <span class="comment-time">${dateStr}</span>
          </div>
          <div class="comment-text">${escapeHtml(comment.text)}</div>
        </div>
        ${deleteBtn}
      </div>
    `;
  });

  commentsList.innerHTML = html;
}

function handleCommentSubmit(e) {
  e.preventDefault();
  
  if (!state.selectedPhoto) return;
  
  const photo = state.photos.find(p => p.id === state.selectedPhoto.id);
  if (!photo) return;
  
  const author = elements.commentAuthorInput.value.trim();
  const text = elements.commentTextInput.value.trim();
  
  if (!author || !text) {
    showToast("Please enter your name and a comment.", "error");
    return;
  }
  
  const newComment = {
    id: 'comment-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9),
    author: author,
    text: text,
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem('up_gallery_author_name', author);
  
  if (isFirebaseEnabled) {
    db.collection('photos').doc(photo.id).update({
      comments: firebase.firestore.FieldValue.arrayUnion(newComment)
    }).then(() => {
      elements.commentTextInput.value = '';
      showToast("Comment added! ❤️", "success");
    }).catch(err => {
      console.error("Failed to add comment:", err);
      showToast("Failed to add comment. Please try again.", "error");
    });
  } else {
    if (!Array.isArray(photo.comments)) {
      photo.comments = [];
    }
    photo.comments.push(newComment);
    saveDatabase();
    
    elements.commentTextInput.value = '';
    showToast("Comment added! ❤️", "success");
    renderComments(photo);
    renderGallery();
  }
}

function deleteComment(photoId, commentId) {
  if (!state.isLoggedIn) {
    showToast("Unauthorized action.", "error");
    return;
  }
  
  const confirmDelete = confirm("Are you sure you want to delete this comment?");
  if (!confirmDelete) return;
  
  const photo = state.photos.find(p => p.id === photoId);
  if (!photo) return;
  
  const comment = photo.comments.find(c => c.id === commentId);
  if (!comment) return;
  
  if (isFirebaseEnabled) {
    db.collection('photos').doc(photoId).update({
      comments: firebase.firestore.FieldValue.arrayRemove(comment)
    }).then(() => {
      showToast("Comment deleted.", "info");
    }).catch(err => {
      console.error("Failed to delete comment:", err);
      showToast("Failed to delete comment.", "error");
    });
  } else {
    photo.comments = photo.comments.filter(c => c.id !== commentId);
    saveDatabase();
    showToast("Comment deleted.", "info");
    renderComments(photo);
    renderGallery();
  }
}
window.deleteComment = deleteComment;

// --- PHOTO UPLOADING FLOW ---
// Canvas Resizer to optimize base64 images client-side
function handleFileSelect() {
  const file = elements.fileInput.files[0];
  if (!file) return;
  
  if (!file.type.match('image.*')) {
    showToast("Invalid file format. Please select an image file.", "error");
    return;
  }
  
  if (file.size > 25 * 1024 * 1024) {
    showToast("File size too large. Please upload an image under 25MB.", "error");
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const tempImg = new Image();
    tempImg.onload = function() {
      // Resize image client-side to keep base64 local storage optimized
      const canvas = document.createElement('canvas');
      let width = tempImg.width;
      let height = tempImg.height;
      
      const max_size = 1000; // Resize target dimension
      
      if (width > max_size || height > max_size) {
        if (width > height) {
          height *= max_size / width;
          width = max_size;
        } else {
          width *= max_size / height;
          height = max_size;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(tempImg, 0, 0, width, height);
      
      // Compress quality to 70% JPEG
      base64ImageString = canvas.toDataURL('image/jpeg', 0.7);
      
      // Update Drag and Drop UI
      elements.previewImg.src = base64ImageString;
      elements.previewImg.style.display = 'block';
      elements.fileDropzone.querySelector('.dropzone-icon').style.display = 'none';
      elements.fileDropzone.querySelectorAll('.dropzone-text').forEach(t => t.style.display = 'none');
      
      showToast("Photo processed and ready for sharing.", "success");
    };
    tempImg.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function handleUploadSubmit(e) {
  e.preventDefault();
  
  if (!base64ImageString) {
    showToast("Please upload an image.", "error");
    return;
  }
  
  const captionText = elements.uploadCaption.value.trim();
  let categoryVal = elements.uploadCategory.value;
  
  if (categoryVal === 'custom-new') {
    const customVal = elements.customCategoryInput.value.trim();
    if (!customVal) {
      showToast("Please specify the custom category name.", "error");
      return;
    }
    // Sanitize: lowercase, alphanumeric + spaces only, max 30 chars
    categoryVal = customVal.toLowerCase().replace(/[^a-z0-9 ]/g, '').substring(0, 30);
    if (!categoryVal) {
      showToast("Invalid custom category name.", "error");
      return;
    }
  }
  
  if (!captionText) {
    showToast("Please write a short caption.", "error");
    return;
  }
  
  const photoId = `upload-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  function saveLocally() {
    const newPhoto = {
      id: photoId,
      url: base64ImageString,
      caption: captionText,
      category: categoryVal,
      likes: [],
      views: 0,
      approved: false,
      uploadedAt: new Date().toISOString()
    };
    
    state.photos.push(newPhoto);
    saveDatabase();
    
    closeModal(elements.uploadModal);
    showToast("Memory submitted! It will appear in the gallery once approved by the administrators.", "success");
    syncUI();
  }

  if (isFirebaseEnabled) {
    showToast("Submitting memory globally...", "info");
    
    const newPhoto = {
      id: photoId,
      url: base64ImageString, // Save base64 string directly to Firestore
      caption: captionText,
      category: categoryVal,
      likes: [],
      views: 0,
      approved: false,
      uploadedAt: new Date().toISOString()
    };
    
    db.collection('photos').doc(photoId).set(newPhoto).then(() => {
      closeModal(elements.uploadModal);
      showToast("Memory submitted! It will appear in the gallery once approved by the administrators.", "success");
    }).catch((err) => {
      console.error("Global Firestore submission failed:", err);
      showToast("Global submission failed. Saving locally instead...", "warning");
      saveLocally();
    });
  } else {
    saveLocally();
  }
}

// --- ADMIN MODERATION PANEL FLOW ---
function showAdminLogin() {
  elements.adminLoginCard.style.display = 'block';
  elements.adminDashboard.classList.remove('active');
  elements.adminLoginForm.reset();
}

function showAdminDashboard() {
  elements.adminLoginCard.style.display = 'none';
  elements.adminDashboard.classList.add('active');
  updateAdminStats();
  renderAdminQueue();
}

function handleAdminLogin(e) {
  e.preventDefault();
  
  const username = elements.adminUsername.value.trim();
  const password = elements.adminPassword.value.trim();
  
  if (username === 'admin' && password === 'admin') {
    state.isLoggedIn = true;
    sessionStorage.setItem('admin_logged', 'true');
    showAdminDashboard();
    showToast("Welcome back, Administrator.", "success");
  } else {
    showToast("Invalid credentials. Try again.", "error");
    elements.adminPassword.value = '';
  }
}

function handleAdminLogout() {
  state.isLoggedIn = false;
  sessionStorage.removeItem('admin_logged');
  showAdminLogin();
  showToast("Logged out successfully.", "info");
}

function updateAdminStats() {
  const approved = state.photos.filter(p => p.approved);
  const totalLikes = approved.reduce((sum, p) => sum + getLikesCount(p), 0);
  const totalViews = approved.reduce((sum, p) => sum + p.views, 0);
  
  elements.statTotalPhotos.textContent = approved.length;
  elements.statTotalLikes.textContent = totalLikes;
  elements.statTotalViews.textContent = totalViews;
}

function updatePendingCountBadge() {
  const pending = state.photos.filter(p => !p.approved);
  elements.pendingCountBadge.textContent = pending.length;
}

function switchAdminTab(tab) {
  state.adminTab = tab;
  
  // Reset active tabs
  elements.tabPendingBtn.classList.remove('active');
  elements.tabApprovedBtn.classList.remove('active');
  elements.tabSettingsBtn.classList.remove('active');
  
  if (tab === 'pending') {
    elements.tabPendingBtn.classList.add('active');
    elements.adminQueueList.style.display = 'grid';
    elements.adminSettingsPanel.style.display = 'none';
    renderAdminQueue();
  } else if (tab === 'approved') {
    elements.tabApprovedBtn.classList.add('active');
    elements.adminQueueList.style.display = 'grid';
    elements.adminSettingsPanel.style.display = 'none';
    renderAdminQueue();
  } else if (tab === 'settings') {
    elements.tabSettingsBtn.classList.add('active');
    elements.adminQueueList.style.display = 'none';
    elements.adminSettingsPanel.style.display = 'block';
    loadBrandingInputs();
  }
}

function renderAdminQueue() {
  let filtered = [];
  
  if (state.adminTab === 'pending') {
    filtered = state.photos.filter(p => !p.approved);
  } else {
    filtered = state.photos.filter(p => p.approved);
  }
  
  // Sort most recent uploads first
  filtered.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  
  if (filtered.length === 0) {
    const icon = state.adminTab === 'pending' ? 'fa-circle-check' : 'fa-image';
    const text = state.adminTab === 'pending' ? 'All clear! No pending photo uploads.' : 'No active memories in the gallery.';
    elements.adminQueueList.innerHTML = `
      <div class="empty-queue-msg">
        <i class="fa-solid ${icon}"></i>
        <p>${text}</p>
      </div>
    `;
    return;
  }
  
  let queueHTML = '';
  filtered.forEach(photo => {
    const dateObj = new Date(photo.uploadedAt);
    const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    let actionButtons = '';
    if (state.adminTab === 'pending') {
      actionButtons = `
        <button class="mod-btn mod-btn-approve" onclick="approvePhoto('${photo.id}')">
          <i class="fa-solid fa-check"></i> Approve
        </button>
        <button class="mod-btn mod-btn-decline" onclick="declinePhoto('${photo.id}')">
          <i class="fa-solid fa-xmark"></i> Decline
        </button>
      `;
    } else {
      actionButtons = `
        <button class="mod-btn mod-btn-decline" onclick="deletePhotoFromGallery('${photo.id}')" style="flex-grow: 1;">
          <i class="fa-solid fa-trash-can"></i> Delete from Gallery
        </button>
      `;
    }
    
    queueHTML += `
      <div class="mod-card">
        <div class="mod-img-container" onclick="openLightbox('${photo.id}')" title="Click to view details and comments">
          <img src="${photo.url}" alt="Pending image" class="mod-img">
        </div>
        <div class="mod-details">
          <div>
            <p class="mod-caption">${photo.caption}</p>
            <button class="btn-edit-caption" onclick="editCaption('${photo.id}')">
              <i class="fa-solid fa-pen-to-square"></i> Edit Caption
            </button>
            <div class="mod-meta">
              <div style="display: flex; justify-content: space-between;">
                <span>Category: <strong style="text-transform: capitalize; color: var(--up-gold);">${photo.category}</strong></span>
                <span>${dateStr}</span>
              </div>
            </div>
          </div>
          <div class="mod-actions">
            ${actionButtons}
          </div>
        </div>
      </div>
    `;
  });
  
  elements.adminQueueList.innerHTML = queueHTML;
}

// Moderation Action Callbacks (Globally mapped for inline onclick functions)
function approvePhoto(photoId) {
  const photo = state.photos.find(p => p.id === photoId);
  if (!photo) return;
  
  if (isFirebaseEnabled) {
    db.collection('photos').doc(photoId).update({
      approved: true
    }).then(() => {
      showToast("Photo approved and published to gallery!", "success");
    }).catch(err => {
      console.error(err);
      showToast("Failed to approve photo.", "error");
    });
  } else {
    photo.approved = true;
    saveDatabase();
    showToast("Photo approved and published to gallery!", "success");
    syncUI();
  }
}
window.approvePhoto = approvePhoto;

function declinePhoto(photoId) {
  const confirmDecline = confirm("Are you sure you want to decline and permanently delete this uploaded photo?");
  if (!confirmDecline) return;
  
  const photo = state.photos.find(p => p.id === photoId);
  if (!photo) return;
  
  if (isFirebaseEnabled) {
    const deleteDoc = () => db.collection('photos').doc(photoId).delete().then(() => {
      showToast("Photo submission declined.", "info");
    }).catch(err => {
      console.error(err);
      showToast("Failed to delete document.", "error");
    });
    
    if (photo.storagePath) {
      storage.ref().child(photo.storagePath).delete()
        .then(deleteDoc)
        .catch(err => {
          console.error("Storage delete failed, deleting doc anyway.", err);
          deleteDoc();
        });
    } else {
      deleteDoc();
    }
  } else {
    state.photos = state.photos.filter(p => p.id !== photoId);
    saveDatabase();
    showToast("Photo submission declined.", "info");
    syncUI();
  }
}
window.declinePhoto = declinePhoto;

function deletePhotoFromGallery(photoId) {
  const confirmDelete = confirm("Are you sure you want to delete this memory from the gallery?");
  if (!confirmDelete) return;
  
  const photo = state.photos.find(p => p.id === photoId);
  if (!photo) return;
  
  if (isFirebaseEnabled) {
    const deleteDoc = () => db.collection('photos').doc(photoId).delete().then(() => {
      showToast("Photo removed from gallery.", "info");
    }).catch(err => {
      console.error(err);
      showToast("Failed to remove from gallery.", "error");
    });
    
    if (photo.storagePath) {
      storage.ref().child(photo.storagePath).delete()
        .then(deleteDoc)
        .catch(err => {
          console.error("Storage delete failed, deleting doc anyway.", err);
          deleteDoc();
        });
    } else {
      deleteDoc();
    }
  } else {
    state.photos = state.photos.filter(p => p.id !== photoId);
    saveDatabase();
    showToast("Photo removed from gallery.", "info");
    syncUI();
  }
}
window.deletePhotoFromGallery = deletePhotoFromGallery;

function editCaption(photoId) {
  const photo = state.photos.find(p => p.id === photoId);
  if (!photo) return;
  
  state.editingPhotoId = photoId;
  elements.editPhotoCaption.value = photo.caption;
  openModal(elements.editCaptionModal);
}
window.editCaption = editCaption;

function handleEditCaptionSubmit(e) {
  e.preventDefault();
  
  if (!state.editingPhotoId) return;
  
  const trimmed = elements.editPhotoCaption.value.trim();
  if (!trimmed) {
    showToast("Caption cannot be empty.", "error");
    return;
  }
  
  if (isFirebaseEnabled) {
    db.collection('photos').doc(state.editingPhotoId).update({
      caption: trimmed
    }).then(() => {
      showToast("Caption updated successfully!", "success");
      closeModal(elements.editCaptionModal);
    }).catch(err => {
      console.error(err);
      showToast("Failed to update caption.", "error");
    });
  } else {
    const photo = state.photos.find(p => p.id === state.editingPhotoId);
    if (photo) {
      photo.caption = trimmed;
      saveDatabase();
      showToast("Caption updated successfully!", "success");
      syncUI();
    }
    closeModal(elements.editCaptionModal);
  }
}
window.handleEditCaptionSubmit = handleEditCaptionSubmit;

// --- EXECUTE ON WINDOW LOAD ---
window.addEventListener('DOMContentLoaded', initApp);
