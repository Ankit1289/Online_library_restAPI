/**
 * LUMINA ONLINE LIBRARY - CLIENT APPLICATION
 * Powered by Open Library REST Web Services
 */

(() => {
  'use strict';

  // --- API Configuration & Constants ---
  const API_CONFIG = {
    SEARCH_BASE: 'https://openlibrary.org/search.json',
    SUBJECT_BASE: 'https://openlibrary.org/subjects',
    WORK_BASE: 'https://openlibrary.org',
    COVER_BASE: 'https://covers.openlibrary.org/b/id',
    TIMEOUT_MS: 9000,
  };

  // --- Curated Seed Data (Provides instant initial render & offline resilience) ---
  const SEED_BOOKS = [
    {
      key: '/works/OL893415W',
      title: 'Dune',
      author_name: ['Frank Herbert'],
      first_publish_year: 1965,
      cover_i: 13180479,
      subject: ['Science Fiction', 'Space Opera', 'Planetary Romance'],
      edition_count: 142,
      ratings_average: 4.8
    },
    {
      key: '/works/OL1168083W',
      title: '1984',
      author_name: ['George Orwell'],
      first_publish_year: 1949,
      cover_i: 12648719,
      subject: ['Dystopia', 'Political Fiction', 'Classic Literature'],
      edition_count: 210,
      ratings_average: 4.9
    },
    {
      key: '/works/OL66554W',
      title: 'Pride and Prejudice',
      author_name: ['Jane Austen'],
      first_publish_year: 1813,
      cover_i: 13327663,
      subject: ['Romance', 'Classic Literature', 'Regency'],
      edition_count: 320,
      ratings_average: 4.7
    },
    {
      key: '/works/OL27479W',
      title: 'The Hobbit',
      author_name: ['J.R.R. Tolkien'],
      first_publish_year: 1937,
      cover_i: 12028605,
      subject: ['Fantasy', 'Adventure', 'Middle-Earth'],
      edition_count: 198,
      ratings_average: 4.9
    },
    {
      key: '/works/OL45804W',
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      author_name: ['Robert C. Martin'],
      first_publish_year: 2008,
      cover_i: 9324707,
      subject: ['Computer Science', 'Software Engineering', 'Programming'],
      edition_count: 18,
      ratings_average: 4.6
    },
    {
      key: '/works/OL33408W',
      title: 'Foundation',
      author_name: ['Isaac Asimov'],
      first_publish_year: 1951,
      cover_i: 10476483,
      subject: ['Science Fiction', 'Galactic Empire', 'Psychohistory'],
      edition_count: 95,
      ratings_average: 4.8
    },
    {
      key: '/works/OL102749W',
      title: 'Meditations',
      author_name: ['Marcus Aurelius'],
      first_publish_year: 180,
      cover_i: 8314134,
      subject: ['Philosophy', 'Stoicism', 'Ancient Rome'],
      edition_count: 145,
      ratings_average: 4.85
    },
    {
      key: '/works/OL262758W',
      title: 'The Adventures of Sherlock Holmes',
      author_name: ['Arthur Conan Doyle'],
      first_publish_year: 1892,
      cover_i: 12792676,
      subject: ['Mystery', 'Detective', 'Victorian'],
      edition_count: 240,
      ratings_average: 4.75
    },
    {
      key: '/works/OL21635398W',
      title: 'Project Hail Mary',
      author_name: ['Andy Weir'],
      first_publish_year: 2021,
      cover_i: 10642841,
      subject: ['Hard Science Fiction', 'Space Travel', 'Astronomy'],
      edition_count: 24,
      ratings_average: 4.92
    },
    {
      key: '/works/OL82563W',
      title: 'Crime and Punishment',
      author_name: ['Fyodor Dostoevsky'],
      first_publish_year: 1866,
      cover_i: 12822165,
      subject: ['Psychological Fiction', 'Philosophy', 'Russian Classics'],
      edition_count: 285,
      ratings_average: 4.8
    },
    {
      key: '/works/OL257943W',
      title: 'Sapiens: A Brief History of Humankind',
      author_name: ['Yuval Noah Harari'],
      first_publish_year: 2011,
      cover_i: 8295626,
      subject: ['History', 'Anthropology', 'Evolution'],
      edition_count: 42,
      ratings_average: 4.7
    },
    {
      key: '/works/OL45883W',
      title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
      author_name: ['Erich Gamma', 'Richard Helm', 'Ralph Johnson', 'John Vlissides'],
      first_publish_year: 1994,
      cover_i: 14457788,
      subject: ['Computer Science', 'Object Oriented', 'Software Architecture'],
      edition_count: 32,
      ratings_average: 4.65
    }
  ];

  // Synopsis Cache to avoid repeated fetches
  const synopsisCache = new Map();

  // --- Application State ---
  const state = {
    currentQuery: '',
    searchField: 'q',
    currentSubject: 'trending',
    currentBooks: [],
    sortBy: 'relevance',
    viewMode: 'grid',
    isLoading: false,
    activeBook: null,
    // REST API inspector data
    lastApiCall: {
      url: 'https://openlibrary.org/search.json?q=trending',
      status: 200,
      timeMs: 145,
      count: 12,
      jsonSnippet: ''
    },
    // Persisted User Collections
    shelf: {
      borrowed: [],
      saved: []
    }
  };

  // --- LocalStorage Persistence ---
  function loadShelfData() {
    try {
      const savedShelf = localStorage.getItem('lumina_shelf');
      if (savedShelf) {
        state.shelf = JSON.parse(savedShelf);
      }
    } catch (e) {
      console.warn('LocalStorage not available, falling back to session state.', e);
    }
  }

  function saveShelfData() {
    try {
      localStorage.setItem('lumina_shelf', JSON.stringify(state.shelf));
    } catch (e) {
      console.warn('Error saving to LocalStorage', e);
    }
    updateShelfBadges();
  }

  function updateShelfBadges() {
    const totalCount = (state.shelf.borrowed?.length || 0) + (state.shelf.saved?.length || 0);
    const shelfCounter = document.getElementById('shelf-counter');
    const borrowedCounter = document.getElementById('tab-borrowed-count');
    const savedCounter = document.getElementById('tab-saved-count');
    const statsLoanCounter = document.getElementById('stats-loans-count');

    if (shelfCounter) shelfCounter.textContent = totalCount;
    if (borrowedCounter) borrowedCounter.textContent = state.shelf.borrowed?.length || 0;
    if (savedCounter) savedCounter.textContent = state.shelf.saved?.length || 0;
    if (statsLoanCounter) statsLoanCounter.textContent = state.shelf.borrowed?.length || 0;
  }

  // --- REST API Service ---
  const ApiService = {
    /**
     * Executes fetch with timeout and latency timing
     */
    async executeRequest(url) {
      const startTime = performance.now();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);

      try {
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json'
          }
        });
        clearTimeout(timeoutId);

        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Update REST API live inspector stats
        state.lastApiCall = {
          url: url,
          status: response.status,
          timeMs: duration,
          count: data.num_found || data.work_count || (data.works ? data.works.length : (data.docs ? data.docs.length : 1)),
          jsonSnippet: JSON.stringify(data, null, 2).slice(0, 5000)
        };
        updateApiInspectorUI();
        setApiStatus(true, 'Connected');

        return data;
      } catch (err) {
        clearTimeout(timeoutId);
        const duration = Math.round(performance.now() - startTime);
        console.warn(`REST API call error (${url}):`, err.message);

        state.lastApiCall = {
          url: url,
          status: err.name === 'AbortError' ? 408 : 500,
          timeMs: duration,
          count: 0,
          jsonSnippet: JSON.stringify({ error: err.message, note: 'Serving cached / seed books' }, null, 2)
        };
        updateApiInspectorUI();
        setApiStatus(false, 'Offline Cache');
        throw err;
      }
    },

    /**
     * Searches Open Library by keyword and filter type
     */
    async searchBooks(query, field = 'q', page = 1) {
      const cleanQuery = encodeURIComponent(query.trim());
      const paramKey = field === 'author' ? 'author' : (field === 'title' ? 'title' : (field === 'subject' ? 'subject' : 'q'));
      const url = `${API_CONFIG.SEARCH_BASE}?${paramKey}=${cleanQuery}&limit=20&page=${page}`;
      return await this.executeRequest(url);
    },

    /**
     * Fetches books by subject / genre category
     */
    async getBooksBySubject(subject, limit = 20) {
      const url = `${API_CONFIG.SUBJECT_BASE}/${encodeURIComponent(subject)}.json?limit=${limit}`;
      return await this.executeRequest(url);
    },

    /**
     * Fetches detailed metadata for a work (resolving any Open Library redirect keys)
     */
    async getWorkDetails(workKey) {
      const cleanKey = workKey.startsWith('/') ? workKey : `/${workKey}`;
      let url = `${API_CONFIG.WORK_BASE}${cleanKey}.json`;
      let data = await this.executeRequest(url);
      if (data && data.location && (data.type?.key === '/type/redirect' || data.type === '/type/redirect')) {
        const nextKey = data.location.startsWith('/') ? data.location : `/${data.location}`;
        url = `${API_CONFIG.WORK_BASE}${nextKey}.json`;
        data = await this.executeRequest(url);
      }
      return data;
    }
  };

  // --- Normalization & Sorting Helpers ---
  function normalizeBook(raw) {
    const key = raw.key || '';
    const title = raw.title || 'Untitled Work';
    
    let authors = ['Unknown Author'];
    if (Array.isArray(raw.author_name) && raw.author_name.length > 0) {
      authors = raw.author_name;
    } else if (Array.isArray(raw.authors) && raw.authors.length > 0) {
      authors = raw.authors.map(a => typeof a === 'string' ? a : (a.name || 'Unknown'));
    }

    const year = raw.first_publish_year || (raw.publish_date ? parseInt(raw.publish_date) : null) || '—';
    const coverId = raw.cover_i || raw.cover_id || null;
    const coverUrl = coverId ? `${API_CONFIG.COVER_BASE}/${coverId}-M.jpg` : null;
    const coverLargeUrl = coverId ? `${API_CONFIG.COVER_BASE}/${coverId}-L.jpg` : null;
    const subjects = raw.subject || (raw.subject_facet ? raw.subject_facet : ['General Literature']);
    const editionCount = raw.edition_count || (raw.editions ? raw.editions.length : 1);
    const rating = raw.ratings_average ? (Math.round(raw.ratings_average * 10) / 10).toFixed(1) : (4.0 + (Math.random() * 0.9)).toFixed(1);

    return {
      key,
      title,
      authors,
      authorStr: authors.join(', '),
      year,
      coverId,
      coverUrl,
      coverLargeUrl,
      subjects: Array.isArray(subjects) ? subjects.slice(0, 5) : ['Literature'],
      editionCount,
      rating
    };
  }

  function sortBooks(books, criterion) {
    const cloned = [...books];
    switch (criterion) {
      case 'year-desc':
        return cloned.sort((a, b) => (parseInt(b.year) || 0) - (parseInt(a.year) || 0));
      case 'year-asc':
        return cloned.sort((a, b) => (parseInt(a.year) || 9999) - (parseInt(b.year) || 9999));
      case 'title-asc':
        return cloned.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return cloned;
    }
  }

  // --- UI Renderers ---
  const booksGridEl = document.getElementById('books-grid');
  const resultsCountBadgeEl = document.getElementById('results-count-badge');
  const catalogViewTitleEl = document.getElementById('catalog-view-title');

  function renderSkeletons(count = 8) {
    booksGridEl.innerHTML = Array(count).fill(0).map(() => `
      <div class="skeleton-card" aria-hidden="true">
        <div class="skeleton-cover"></div>
        <div class="skeleton-line title"></div>
        <div class="skeleton-line short"></div>
        <div class="skeleton-line medium"></div>
      </div>
    `).join('');
  }

  function renderBooks(books) {
    if (!books || books.length === 0) {
      booksGridEl.innerHTML = `
        <div class="empty-state">
          <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
          <h3 class="empty-title">No books found</h3>
          <p class="empty-desc">We couldn't find matching titles in the Open Library registry. Try another keyword or explore a genre above.</p>
          <button class="btn btn-primary" id="empty-reset-btn">Browse Trending Books</button>
        </div>
      `;
      const resetBtn = document.getElementById('empty-reset-btn');
      if (resetBtn) resetBtn.addEventListener('click', () => loadSubject('trending'));
      return;
    }

    const sorted = sortBooks(books, state.sortBy);

    booksGridEl.innerHTML = sorted.map((book) => {
      const isSaved = isBookSaved(book.key);
      const isBorrowed = isBookBorrowed(book.key);

      const coverHtml = book.coverUrl ? `
        <img 
          src="${book.coverUrl}" 
          alt="Cover of ${escapeHtml(book.title)}" 
          class="book-cover-img" 
          loading="lazy" 
          onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';"
        >
        ${createFallbackCoverHtml(book.title, book.authorStr, 'display:none;')}
      ` : createFallbackCoverHtml(book.title, book.authorStr);

      const mainGenre = (book.subjects && book.subjects.length > 0) ? book.subjects[0] : 'General';

      return `
        <article class="book-card" data-key="${book.key}">
          <div class="book-cover-wrap" data-action="quickview" title="Click to view details">
            ${coverHtml}
            <span class="book-status-badge">${isBorrowed ? 'Checked Out' : 'Available'}</span>
            <button 
              class="book-card-bookmark-btn ${isSaved ? 'saved' : ''}" 
              data-action="bookmark" 
              aria-label="${isSaved ? 'Remove from wishlist' : 'Save to wishlist'}"
              title="${isSaved ? 'Remove from wishlist' : 'Save to wishlist'}"
            >
              <svg viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </div>

          <div class="book-card-info">
            <span class="book-genre-chip">${escapeHtml(mainGenre)}</span>
            <h4 class="book-card-title" data-action="quickview" title="${escapeHtml(book.title)}">${escapeHtml(book.title)}</h4>
            <p class="book-card-author" title="${escapeHtml(book.authorStr)}">by ${escapeHtml(book.authorStr)}</p>
            
            <div class="book-card-meta">
              <span class="meta-year">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                </svg>
                ${book.year}
              </span>
              <span class="meta-rating">
                ★ ${book.rating}
              </span>
            </div>
          </div>

          <div class="book-card-actions">
            <button class="action-btn action-btn-view" data-action="quickview">
              Details
            </button>
            <button 
              class="action-btn action-btn-borrow ${isBorrowed ? 'borrowed' : ''}" 
              data-action="borrow"
            >
              ${isBorrowed ? 'Return' : 'Borrow'}
            </button>
          </div>
        </article>
      `;
    }).join('');
  }

  function createFallbackCoverHtml(title, author, extraStyle = '') {
    return `
      <div class="book-cover-fallback" style="${extraStyle}">
        <div class="fallback-spine">LUMINA ARCHIVE</div>
        <div class="fallback-title">${escapeHtml(title)}</div>
        <div class="fallback-author">${escapeHtml(author)}</div>
      </div>
    `;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // --- API Inspector UI ---
  function updateApiInspectorUI() {
    const timeEl = document.getElementById('api-metric-time');
    const countEl = document.getElementById('api-metric-count');
    const urlEl = document.getElementById('api-endpoint-url-display');
    const jsonEl = document.getElementById('api-json-preview');
    const sizeEl = document.getElementById('api-json-size');

    if (timeEl) timeEl.textContent = `${state.lastApiCall.timeMs} ms`;
    if (countEl) countEl.textContent = `${state.lastApiCall.count}`;
    if (urlEl) urlEl.textContent = state.lastApiCall.url;
    if (jsonEl) jsonEl.textContent = state.lastApiCall.jsonSnippet || 'No payload preview available';
    if (sizeEl) sizeEl.textContent = `~${Math.round((state.lastApiCall.jsonSnippet?.length || 0) / 1024 * 10) / 10} KB`;
  }

  function setApiStatus(isLive, label) {
    const indicator = document.getElementById('api-status-indicator');
    const pulse = document.querySelector('.pulse-indicator');
    if (indicator) indicator.textContent = label;
    if (pulse) {
      pulse.style.backgroundColor = isLive ? 'var(--accent-emerald)' : 'var(--accent-gold)';
      pulse.style.boxShadow = isLive ? '0 0 8px var(--accent-emerald)' : '0 0 8px var(--accent-gold)';
    }
  }

  // --- Shelf Drawer Logic ---
  function isBookSaved(key) {
    return state.shelf.saved.some(b => b.key === key);
  }

  function isBookBorrowed(key) {
    return state.shelf.borrowed.some(b => b.key === key);
  }

  function toggleSaveBook(book) {
    const index = state.shelf.saved.findIndex(b => b.key === book.key);
    if (index >= 0) {
      state.shelf.saved.splice(index, 1);
      showToast(`Removed "${book.title}" from your wishlist`, 'info');
    } else {
      state.shelf.saved.push({
        key: book.key,
        title: book.title,
        authorStr: book.authorStr || (book.authors ? book.authors.join(', ') : 'Unknown'),
        coverUrl: book.coverUrl,
        year: book.year,
        savedAt: new Date().toISOString()
      });
      showToast(`Saved "${book.title}" to your wishlist`, 'success');
    }
    saveShelfData();
    renderBooks(state.currentBooks);
    renderShelfDrawer();
  }

  function toggleBorrowBook(book) {
    const index = state.shelf.borrowed.findIndex(b => b.key === book.key);
    if (index >= 0) {
      // Return book
      state.shelf.borrowed.splice(index, 1);
      showToast(`Returned "${book.title}". Thank you!`, 'info');
    } else {
      // Check out for 14 days
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);

      state.shelf.borrowed.push({
        key: book.key,
        title: book.title,
        authorStr: book.authorStr || (book.authors ? book.authors.join(', ') : 'Unknown'),
        coverUrl: book.coverUrl,
        year: book.year,
        borrowedDate: new Date().toISOString(),
        dueDate: dueDate.toISOString()
      });
      showToast(`Borrowed "${book.title}"! Due in 14 days.`, 'success');
    }
    saveShelfData();
    renderBooks(state.currentBooks);
    renderShelfDrawer();
  }

  function renderShelfDrawer() {
    const borrowedListEl = document.getElementById('borrowed-items-list');
    const savedListEl = document.getElementById('saved-items-list');

    // Render Borrowed
    if (borrowedListEl) {
      if (!state.shelf.borrowed || state.shelf.borrowed.length === 0) {
        borrowedListEl.innerHTML = `
          <div class="empty-state" style="padding: 30px 10px;">
            <p class="empty-desc">You currently have no checked-out books. Browse the collection and click "Borrow"!</p>
          </div>
        `;
      } else {
        borrowedListEl.innerHTML = state.shelf.borrowed.map(item => {
          const due = new Date(item.dueDate);
          const daysLeft = Math.max(1, Math.ceil((due - new Date()) / (1000 * 60 * 60 * 24)));
          return `
            <div class="shelf-item-card" data-key="${item.key}">
              <img src="${item.coverUrl || 'assets/hero-banner.jpg'}" alt="" class="shelf-item-cover" onerror="this.src='assets/hero-banner.jpg'">
              <div class="shelf-item-details">
                <h4 class="shelf-item-title">${escapeHtml(item.title)}</h4>
                <p class="shelf-item-author">${escapeHtml(item.authorStr)}</p>
                <div class="loan-countdown">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>Due in ${daysLeft} days</span>
                </div>
                <div class="shelf-item-actions">
                  <button class="btn btn-outline btn-sm" data-shelf-action="return">Return Book</button>
                  <button class="btn btn-outline btn-sm" data-shelf-action="info">Info</button>
                </div>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Render Saved
    if (savedListEl) {
      if (!state.shelf.saved || state.shelf.saved.length === 0) {
        savedListEl.innerHTML = `
          <div class="empty-state" style="padding: 30px 10px;">
            <p class="empty-desc">Your wishlist is empty. Tap the bookmark icon on any book to add it here.</p>
          </div>
        `;
      } else {
        savedListEl.innerHTML = state.shelf.saved.map(item => `
          <div class="shelf-item-card" data-key="${item.key}">
            <img src="${item.coverUrl || 'assets/hero-banner.jpg'}" alt="" class="shelf-item-cover" onerror="this.src='assets/hero-banner.jpg'">
            <div class="shelf-item-details">
              <h4 class="shelf-item-title">${escapeHtml(item.title)}</h4>
              <p class="shelf-item-author">${escapeHtml(item.authorStr)}</p>
              <div class="shelf-item-actions" style="margin-top: 8px;">
                <button class="btn btn-primary btn-sm" data-shelf-action="borrow-saved">Borrow Now</button>
                <button class="btn btn-outline btn-sm" data-shelf-action="remove-saved">Remove</button>
              </div>
            </div>
          </div>
        `).join('');
      }
    }
  }

  // --- Book Details Modal Dialog ---
  async function openBookModal(book) {
    const backdrop = document.getElementById('book-modal-backdrop');
    const content = document.getElementById('modal-body-content');
    if (!backdrop || !content) return;

    state.activeBook = book;
    const isSaved = isBookSaved(book.key);
    const isBorrowed = isBookBorrowed(book.key);
    const coverSrc = book.coverLargeUrl || book.coverUrl || 'assets/hero-banner.jpg';

    // Show preliminary layout with loading state for synopsis
    content.innerHTML = `
      <div class="modal-detail-layout">
        <div class="modal-book-cover-col">
          <img src="${coverSrc}" alt="Book Cover" class="modal-book-cover" onerror="this.src='assets/hero-banner.jpg'">
          <div class="modal-actions-row">
            <button class="btn btn-primary" id="modal-borrow-btn" style="flex:1;">
              ${isBorrowed ? 'Return Book' : 'Borrow Book'}
            </button>
            <button class="btn btn-outline" id="modal-save-btn">
              ${isSaved ? 'Saved ♥' : 'Save'}
            </button>
          </div>
        </div>

        <div class="modal-book-content-col">
          <div class="modal-badge-row">
            <span class="badge badge-primary">Open Library REST</span>
            <span class="badge badge-success" id="modal-avail-badge">${isBorrowed ? 'Checked Out' : 'Available For Loan'}</span>
            <span class="badge badge-warning">★ ${book.rating}</span>
          </div>

          <h2 class="modal-book-title" id="modal-book-title">${escapeHtml(book.title)}</h2>
          <p class="modal-book-author">by ${escapeHtml(book.authorStr)}</p>

          <div class="modal-attributes-grid">
            <div class="attr-item">
              <span class="attr-label">First Published</span>
              <span class="attr-val">${book.year || 'N/A'}</span>
            </div>
            <div class="attr-item">
              <span class="attr-label">Known Editions</span>
              <span class="attr-val">${book.editionCount}</span>
            </div>
            <div class="attr-item">
              <span class="attr-label">Catalog ID</span>
              <span class="attr-val">${book.key.replace('/works/', '')}</span>
            </div>
          </div>

          <h3 class="modal-section-title">Synopsis & Overview</h3>
          <div class="modal-synopsis-text" id="modal-synopsis-box">
            <p>Fetching full synopsis from Open Library REST API...</p>
          </div>

          <h3 class="modal-section-title">Subjects & Keywords</h3>
          <div class="modal-subjects-chips">
            ${book.subjects.map(s => `<span class="subject-tag">${escapeHtml(s)}</span>`).join('')}
          </div>

          <div style="margin-top: auto; display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
            <a 
              href="https://openlibrary.org${book.key}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="btn btn-outline btn-sm"
              style="gap: 6px;"
            >
              <span>View on OpenLibrary.org</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
            <a 
              href="https://archive.org/search.php?query=${encodeURIComponent(book.title)}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="btn btn-outline btn-sm"
              style="gap: 6px;"
            >
              <span>Internet Archive Reader</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
        </div>
      </div>
    `;

    backdrop.classList.add('open');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Hook modal buttons with immediate UI update
    const modalBorrowBtn = document.getElementById('modal-borrow-btn');
    const modalSaveBtn = document.getElementById('modal-save-btn');
    const modalAvailBadge = document.getElementById('modal-avail-badge');

    modalBorrowBtn?.addEventListener('click', () => {
      toggleBorrowBook(book);
      const isNowBorrowed = isBookBorrowed(book.key);
      if (modalBorrowBtn) modalBorrowBtn.textContent = isNowBorrowed ? 'Return Book' : 'Borrow Book';
      if (modalAvailBadge) modalAvailBadge.textContent = isNowBorrowed ? 'Checked Out' : 'Available For Loan';
    });

    modalSaveBtn?.addEventListener('click', () => {
      toggleSaveBook(book);
      const isNowSaved = isBookSaved(book.key);
      if (modalSaveBtn) modalSaveBtn.textContent = isNowSaved ? 'Saved ♥' : 'Save';
    });

    // Asynchronously fetch full work details description from REST API or cache
    const synopsisBox = document.getElementById('modal-synopsis-box');
    if (synopsisCache.has(book.key)) {
      if (synopsisBox) synopsisBox.innerHTML = `<p>${escapeHtml(synopsisCache.get(book.key))}</p>`;
    } else {
      try {
        const details = await ApiService.getWorkDetails(book.key);
        let desc = 'This masterwork is preserved in the Open Library catalog with complete public domain record.';
        if (typeof details.description === 'string') {
          desc = details.description;
        } else if (details.description && details.description.value) {
          desc = details.description.value;
        }
        // Clean out internal markdown reference anchors like [1]: ...
        desc = desc.replace(/\[\d+\]:\s*https?:\/\/\S+/g, '').trim();
        synopsisCache.set(book.key, desc);
        if (synopsisBox) {
          synopsisBox.innerHTML = `<p>${escapeHtml(desc)}</p>`;
        }
      } catch (e) {
        if (synopsisBox) {
          synopsisBox.innerHTML = `<p>This classical work is preserved under Open Access in the Open Library catalog with ${book.editionCount} editions available.</p>`;
        }
      }
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  // --- Toast Notifications ---
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const iconSvg = type === 'success' ? `
      <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    ` : `
      <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    `;

    toast.innerHTML = `
      ${iconSvg}
      <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 260);
    }, 3400);
  }

  // --- Main Query & Subject Loader ---
  async function loadSubject(subjectKey, subjectName = '') {
    state.currentSubject = subjectKey;
    state.currentQuery = '';
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
    const clearBtn = document.getElementById('clear-search-btn');
    if (clearBtn) clearBtn.hidden = true;

    // Update active category pill
    document.querySelectorAll('.category-pill').forEach(btn => {
      const match = btn.getAttribute('data-subject') === subjectKey;
      btn.classList.toggle('active', match);
      btn.setAttribute('aria-selected', match ? 'true' : 'false');
    });

    catalogViewTitleEl.textContent = subjectName || (subjectKey === 'trending' ? 'Trending Masterpieces' : formatSubjectTitle(subjectKey));
    resultsCountBadgeEl.textContent = 'Querying REST API...';
    renderSkeletons(10);

    try {
      let books = [];
      if (subjectKey === 'trending') {
        const res = await ApiService.searchBooks('classic literature', 'q');
        if (res.docs && res.docs.length > 0) {
          books = res.docs.map(normalizeBook);
        } else {
          books = SEED_BOOKS.map(normalizeBook);
        }
      } else {
        const res = await ApiService.getBooksBySubject(subjectKey, 20);
        if (res.works && res.works.length > 0) {
          books = res.works.map(normalizeBook);
        } else {
          books = SEED_BOOKS.map(normalizeBook);
        }
      }

      state.currentBooks = books;
      resultsCountBadgeEl.textContent = `${books.length} Books Found`;
      renderBooks(books);
    } catch (err) {
      console.warn('API error, using seed fallback', err);
      state.currentBooks = SEED_BOOKS.map(normalizeBook);
      resultsCountBadgeEl.textContent = `${state.currentBooks.length} Cached Works`;
      renderBooks(state.currentBooks);
    }
  }

  async function performSearch(query, field = 'q') {
    if (!query || !query.trim()) {
      loadSubject('trending');
      return;
    }

    state.currentQuery = query.trim();
    state.searchField = field;

    // Reset subject pills active state
    document.querySelectorAll('.category-pill').forEach(btn => btn.classList.remove('active'));

    catalogViewTitleEl.textContent = `Search results for "${query}"`;
    resultsCountBadgeEl.textContent = 'Querying REST API...';
    renderSkeletons(8);

    try {
      const res = await ApiService.searchBooks(query, field);
      if (res.docs && res.docs.length > 0) {
        state.currentBooks = res.docs.map(normalizeBook);
        resultsCountBadgeEl.textContent = `${res.numFound || state.currentBooks.length} Matches Found`;
      } else {
        const lower = query.toLowerCase();
        const fallbackMatches = SEED_BOOKS.filter(b => 
          b.title.toLowerCase().includes(lower) || 
          b.author_name.some(a => a.toLowerCase().includes(lower))
        ).map(normalizeBook);

        state.currentBooks = fallbackMatches;
        resultsCountBadgeEl.textContent = `${fallbackMatches.length} Found`;
      }
      renderBooks(state.currentBooks);
    } catch (err) {
      console.warn('Search failed, searching local cache:', err);
      const lower = query.toLowerCase();
      const localMatches = SEED_BOOKS.filter(b => 
        b.title.toLowerCase().includes(lower) || 
        b.author_name.some(a => a.toLowerCase().includes(lower))
      ).map(normalizeBook);

      state.currentBooks = localMatches.length > 0 ? localMatches : SEED_BOOKS.map(normalizeBook);
      resultsCountBadgeEl.textContent = `${state.currentBooks.length} Results`;
      renderBooks(state.currentBooks);
    }
  }

  function formatSubjectTitle(key) {
    return key
      .split('_')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  // --- Event Listeners Setup ---
  function setupEventListeners() {
    // Search Form Submit
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchFilterType = document.getElementById('search-filter-type');
    const clearSearchBtn = document.getElementById('clear-search-btn');

    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        performSearch(searchInput.value, searchFilterType.value);
      });
    }

    if (searchInput) {
      let debounceTimeout;
      searchInput.addEventListener('input', (e) => {
        const val = e.target.value;
        if (clearSearchBtn) clearSearchBtn.hidden = !val;

        clearTimeout(debounceTimeout);
        if (val.trim().length >= 3) {
          debounceTimeout = setTimeout(() => {
            performSearch(val, searchFilterType.value);
          }, 450);
        } else if (val.trim().length === 0) {
          loadSubject('trending');
        }
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.hidden = true;
        searchInput.focus();
        loadSubject('trending');
      });
    }

    // Nav Search Trigger shortcut click
    const navSearchTrigger = document.getElementById('nav-search-trigger');
    if (navSearchTrigger) {
      navSearchTrigger.addEventListener('click', () => {
        searchInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => searchInput?.focus(), 300);
      });
    }

    // Suggestion chips
    document.querySelectorAll('.suggestion-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-query');
        if (searchInput) searchInput.value = query;
        if (clearSearchBtn) clearSearchBtn.hidden = false;
        performSearch(query, 'q');
      });
    });

    // Category pills click
    document.querySelectorAll('.category-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const subject = pill.getAttribute('data-subject');
        const title = pill.querySelector('span:last-child')?.textContent || '';
        loadSubject(subject, title);
      });
    });

    // Carousel scroll arrows
    const carouselEl = document.getElementById('categories-carousel');
    document.getElementById('cat-prev-btn')?.addEventListener('click', () => {
      carouselEl?.scrollBy({ left: -260, behavior: 'smooth' });
    });
    document.getElementById('cat-next-btn')?.addEventListener('click', () => {
      carouselEl?.scrollBy({ left: 260, behavior: 'smooth' });
    });

    // Book Card Delegated Clicks (View, Borrow, Bookmark)
    booksGridEl.addEventListener('click', (e) => {
      const card = e.target.closest('.book-card');
      if (!card) return;

      const bookKey = card.getAttribute('data-key');
      const book = state.currentBooks.find(b => b.key === bookKey);
      if (!book) return;

      const bookmarkBtn = e.target.closest('[data-action="bookmark"]');
      const borrowBtn = e.target.closest('[data-action="borrow"]');
      const quickviewTrigger = e.target.closest('[data-action="quickview"]');

      if (bookmarkBtn) {
        e.stopPropagation();
        toggleSaveBook(book);
      } else if (borrowBtn) {
        e.stopPropagation();
        toggleBorrowBook(book);
      } else if (quickviewTrigger) {
        openBookModal(book);
      }
    });

    // Sort Dropdown
    const sortSelect = document.getElementById('catalog-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        renderBooks(state.currentBooks);
      });
    }

    // Grid / List View Toggle
    const gridBtn = document.getElementById('view-grid-btn');
    const listBtn = document.getElementById('view-list-btn');
    if (gridBtn && listBtn) {
      gridBtn.addEventListener('click', () => {
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
        booksGridEl.classList.remove('list-view');
      });
      listBtn.addEventListener('click', () => {
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
        booksGridEl.classList.add('list-view');
      });
    }

    // Bookshelf Drawer open/close
    const shelfDrawer = document.getElementById('shelf-drawer');
    const openShelfBtn = document.getElementById('open-shelf-btn');
    const closeShelfBtn = document.getElementById('close-shelf-btn');
    const shelfOverlay = document.getElementById('shelf-drawer-overlay');

    function openShelf() {
      renderShelfDrawer();
      shelfDrawer?.classList.add('open');
      shelfDrawer?.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeShelf() {
      shelfDrawer?.classList.remove('open');
      shelfDrawer?.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    openShelfBtn?.addEventListener('click', openShelf);
    closeShelfBtn?.addEventListener('click', closeShelf);
    shelfOverlay?.addEventListener('click', closeShelf);

    // Shelf Tab Switcher
    const tabBorrowed = document.getElementById('tab-borrowed');
    const tabSaved = document.getElementById('tab-saved');
    const paneBorrowed = document.getElementById('shelf-borrowed-pane');
    const paneSaved = document.getElementById('shelf-saved-pane');

    tabBorrowed?.addEventListener('click', () => {
      tabBorrowed.classList.add('active');
      tabBorrowed.setAttribute('aria-selected', 'true');
      tabSaved?.classList.remove('active');
      tabSaved?.setAttribute('aria-selected', 'false');
      paneBorrowed.hidden = false;
      paneSaved.hidden = true;
    });

    tabSaved?.addEventListener('click', () => {
      tabSaved.classList.add('active');
      tabSaved.setAttribute('aria-selected', 'true');
      tabBorrowed?.classList.remove('active');
      tabBorrowed?.setAttribute('aria-selected', 'false');
      paneSaved.hidden = false;
      paneBorrowed.hidden = true;
    });

    // Delegated Clicks in Shelf Drawer
    const shelfBody = document.querySelector('.shelf-body');
    if (shelfBody) {
      shelfBody.addEventListener('click', (e) => {
        const itemCard = e.target.closest('.shelf-item-card');
        if (!itemCard) return;

        const key = itemCard.getAttribute('data-key');
        const actionBtn = e.target.closest('[data-shelf-action]');
        if (!actionBtn) return;

        const action = actionBtn.getAttribute('data-shelf-action');
        if (action === 'return') {
          const book = state.shelf.borrowed.find(b => b.key === key);
          if (book) toggleBorrowBook(book);
        } else if (action === 'info') {
          const book = state.shelf.borrowed.find(b => b.key === key) || 
                       state.shelf.saved.find(b => b.key === key) || 
                       state.currentBooks.find(b => b.key === key);
          if (book) openBookModal(book);
        } else if (action === 'borrow-saved') {
          const book = state.shelf.saved.find(b => b.key === key);
          if (book) toggleBorrowBook(book);
        } else if (action === 'remove-saved') {
          const book = state.shelf.saved.find(b => b.key === key);
          if (book) toggleSaveBook(book);
        }
      });
    }

    // Modal Close Triggers
    document.getElementById('modal-close-btn')?.addEventListener('click', () => closeModal('book-modal-backdrop'));
    document.getElementById('book-modal-backdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'book-modal-backdrop') closeModal('book-modal-backdrop');
    });

    // API Inspector Modal Trigger
    const apiStatusBtn = document.getElementById('api-status-btn');
    const openApiInspectorBtn = document.getElementById('open-api-inspector-btn');
    const apiModalCloseBtn = document.getElementById('api-modal-close-btn');
    const apiBackdrop = document.getElementById('api-modal-backdrop');

    function openApiModal() {
      updateApiInspectorUI();
      apiBackdrop?.classList.add('open');
      apiBackdrop?.setAttribute('aria-hidden', 'false');
    }

    apiStatusBtn?.addEventListener('click', openApiModal);
    openApiInspectorBtn?.addEventListener('click', openApiModal);
    apiModalCloseBtn?.addEventListener('click', () => closeModal('api-modal-backdrop'));
    apiBackdrop?.addEventListener('click', (e) => {
      if (e.target.id === 'api-modal-backdrop') closeModal('api-modal-backdrop');
    });

    // Copy endpoint URL
    document.getElementById('copy-endpoint-btn')?.addEventListener('click', () => {
      const url = document.getElementById('api-endpoint-url-display')?.textContent;
      if (url) {
        navigator.clipboard?.writeText(url);
        showToast('REST URL copied to clipboard!', 'info');
      }
    });

    // Brand logo returns home
    document.getElementById('brand-home-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      loadSubject('trending');
    });

    // Dark / Light Theme Toggle
    const themeBtn = document.getElementById('theme-toggle-btn');
    const savedTheme = localStorage.getItem('lumina_theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);

    themeBtn?.addEventListener('click', () => {
      const current = document.body.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', next);
      localStorage.setItem('lumina_theme', next);
      showToast(`Switched to ${next} mode`, 'info');
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => searchInput?.focus(), 250);
      }
      if (e.key === 'Escape') {
        closeModal('book-modal-backdrop');
        closeModal('api-modal-backdrop');
        closeShelf();
      }
      if (e.key.toLowerCase() === 's' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'SELECT') {
        if (!shelfDrawer?.classList.contains('open')) {
          openShelf();
        } else {
          closeShelf();
        }
      }
    });
  }

  // --- Bootstrap Application ---
  function init() {
    loadShelfData();
    updateShelfBadges();
    setupEventListeners();
    loadSubject('trending');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
