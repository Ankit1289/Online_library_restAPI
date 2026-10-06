# Lumina Online Library

A modern, high-aesthetic web application for discovering, borrowing, and exploring millions of books, powered by the **Open Library REST API**. Built using clean, standards-compliant **Vanilla HTML5, CSS3, and modern JavaScript (ES6+)**.

---

## 🌟 Key Features

1. **Real-time REST API Integration**:
   - Queries Open Library's public REST web services asynchronously.
   - **Search API**: Full-text search by title, author, subject, or general keywords with automatic debouncing.
   - **Subjects/Genres API**: Quick exploration across 10 curated categories (Sci-Fi, Fantasy, Computer Science, Philosophy, History, Mystery, Classics, Art, Psychology, and Trending).
   - **Works API**: Dynamic fetching of detailed work records and synopsis descriptions with automatic redirect resolution.
   - **Covers API**: Dynamically rendered high-resolution book covers with stylized fallback hardcovers if no image exists.

2. **Interactive Live REST API Inspector**:
   - Click the **REST API** badge or **Inspect API** button in the toolbar to open the live inspector.
   - Displays real-time request metrics: HTTP Method (`GET`), Latency (ms), Records Found, Endpoint URL, and interactive formatted JSON response.
   - One-click copy for the current endpoint URL.

3. **"My Reading Shelf" Digital Loan System**:
   - **Borrowed Books**: 14-day digital loan simulator with dynamic countdown ticker ("Due in X days") and instant return button.
   - **Wishlist / Saved Books**: Bookmark favorite books with one click.
   - **LocalStorage Persistence**: Borrowed and saved books remain saved across browser reloads.

4. **Rich Visual Aesthetics**:
   - Curated modern color palette with dark slate and warm obsidian tones.
   - Glassmorphism overlays (`backdrop-filter: blur(20px)`), smooth gradients, and glowing accents.
   - Micro-animations: Book card elevation, cover zoom, pulse status indicators, and toast notifications.
   - **Dark & Light Mode**: Smooth theme toggling with persistent user preference.
   - **Responsive Design**: Optimized for mobile screens, tablets, and high-resolution desktop monitors.

---

## 🚀 How to Run Locally

You can run Lumina Online Library directly in any browser:

### Option 1: Using Python HTTP Server (Already running)
```bash
python3 -m http.server 3000
```
Then open your browser at:
```
http://localhost:3000
```

### Option 2: Using Node.js
```bash
npx serve .
```

### Option 3: Direct File Opening
Double-click `index.html` to open it directly in Safari, Chrome, Firefox, or Edge.

---

## 📁 File Structure

```
ONLINE LIBRARY/
├── index.html           # Semantic HTML5 markup, header, hero, catalog grid, modals & drawer
├── styles.css           # Vanilla CSS3 design system, variables, dark/light theme, animations
├── app.js               # REST API client, state management, search debouncer, shelf storage
├── assets/
│   └── hero-banner.jpg  # Generated high-resolution digital library lounge artwork
└── README.md            # Documentation and API references
```

---

## 🔌 REST Endpoints Utilized

| Operation | Method | REST Endpoint |
|---|---|---|
| Search Books | `GET` | `https://openlibrary.org/search.json?q={query}&limit=20` |
| Search by Field | `GET` | `https://openlibrary.org/search.json?{title|author|subject}={val}&limit=20` |
| Subject Works | `GET` | `https://openlibrary.org/subjects/{subject}.json?limit=20` |
| Work Synopsis | `GET` | `https://openlibrary.org/works/{id}.json` |
| Medium Cover | `GET` | `https://covers.openlibrary.org/b/id/{cover_id}-M.jpg` |
| Large Cover | `GET` | `https://covers.openlibrary.org/b/id/{cover_id}-L.jpg` |

---

## ⌨️ Keyboard Shortcuts

- <kbd>⌘</kbd> / <kbd>Ctrl</kbd> + <kbd>K</kbd> : Focus search input
- <kbd>S</kbd> : Open / Close "My Reading Shelf"
- <kbd>ESC</kbd> : Close open modal or drawer
