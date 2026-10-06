# 📚 Online Library — REST API

A modern, responsive **Online Library Management Interface** built with **HTML, CSS, and JavaScript**, powered by the **Open Library REST API**.

The application provides an interactive way to search, explore, view, borrow, and bookmark books while demonstrating real-world **REST API integration, asynchronous JavaScript, API caching, LocalStorage persistence, responsive UI design, and error handling**.

---

## ✨ Features

### 🔎 Advanced Book Search

* Search books using keywords.
* Search by:

  * Title
  * Author
  * Subject
  * All Fields
* 450ms search input debouncing.
* Popular search suggestions.
* Real-time API results.

### 📖 Book Catalog

* Responsive book grid layout.
* Compact list layout.
* Book cover images.
* Author information.
* Publication information.
* Subject/category information.
* Smooth hover and interaction animations.

### 📚 Book Details

Each book can be opened in a detailed modal containing:

* High-resolution book cover
* Book title
* Author
* Catalog/Open Library ID
* Edition information
* Publication details
* Book subjects
* Live synopsis
* API-fetched information

### 📌 Reading Shelf

The application includes a personal reading shelf with:

* Active book loans
* Saved/wishlist books
* 14-day loan tracking
* LocalStorage persistence

Your shelf remains available even after refreshing or reopening the browser.

### 🌐 REST API Inspector

A built-in API inspector displays:

* Active API endpoint
* HTTP status
* Response latency
* JSON response payload
* REST API request information

This makes the project useful for demonstrating how REST APIs work.

### 🎨 Modern UI

* Glassmorphism design
* Responsive layout
* Dark mode
* Light mode
* Gradient accents
* Backdrop blur effects
* Smooth transitions
* Micro-interactions
* Animated loading states
* Skeleton loaders
* Toast notifications

### 📱 Responsive Design

The interface is optimized for:

* 💻 Desktop
* 💻 Laptop
* 📱 Mobile
* 📟 Tablet

---

# 🛠️ Technologies Used

| Technology            | Purpose                               |
| --------------------- | ------------------------------------- |
| HTML5                 | Application structure                 |
| CSS3                  | Styling and responsive UI             |
| JavaScript            | Application logic and API integration |
| REST API              | Book data retrieval                   |
| Open Library API      | Book search and metadata              |
| LocalStorage          | Persistent user data                  |
| Fetch API             | HTTP requests                         |
| CSS Custom Properties | Theme/design system                   |

---

# 🌐 Open Library REST API

This project uses the public **Open Library API** to retrieve book information.

### Search Books

```text
GET https://openlibrary.org/search.json?q={query}
```

Example:

```text
https://openlibrary.org/search.json?q=harry+potter
```

### Browse Subjects

```text
GET https://openlibrary.org/subjects/{subject}.json
```

Example:

```text
https://openlibrary.org/subjects/science_fiction.json
```

### Get Work Details

```text
GET https://openlibrary.org/works/{id}.json
```

Example:

```text
https://openlibrary.org/works/OL45804W.json
```

### Book Cover

```text
GET https://covers.openlibrary.org/b/id/{id}-M.jpg
```

---

# 📂 Project Structure

```text
online-library/
│
├── index.html
├── styles.css
├── app.js
└── README.md
```

### `index.html`

Contains the complete semantic HTML structure, including:

* Navigation
* Search interface
* Hero section
* Category carousel
* Book catalog
* Reading shelf
* Book details modal
* REST API inspector
* Toast notifications

### `styles.css`

Contains:

* Design system
* CSS variables
* Light/dark themes
* Responsive layouts
* Glassmorphism effects
* Animations
* Card styles
* Modal styles
* Loading states

### `app.js`

Responsible for:

* REST API communication
* Search functionality
* Category browsing
* Book details
* Cover loading
* API error handling
* Debounced search
* LocalStorage
* Wishlist management
* Loan management
* Synopsis caching
* UI interactions

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/online-library.git
```

## 2. Open the Project

```bash
cd online-library
```

## 3. Run the Application

You can simply open:

```text
index.html
```

in your browser.

For the best development experience, use **VS Code + Live Server**.

### Using Live Server

1. Open the project in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html`.
4. Select **Open with Live Server**.

The application will open in your browser.

---

# 🔄 Application Flow

```text
User
  │
  ▼
Search / Select Category
  │
  ▼
JavaScript REST API Client
  │
  ▼
Open Library API
  │
  ▼
JSON Response
  │
  ▼
Data Processing
  │
  ├── Book Cards
  ├── Book Details
  ├── Covers
  └── Synopsis
  │
  ▼
User Interface
  │
  ├── Borrow
  ├── Wishlist
  └── Reading Shelf
```

---

# 🔌 REST API Architecture

```text
┌──────────────────────────┐
│       User Interface     │
│      HTML + CSS + JS     │
└────────────┬─────────────┘
             │
             │ HTTP Requests
             ▼
┌──────────────────────────┐
│    REST API Client       │
│       Fetch API          │
└────────────┬─────────────┘
             │
             │ GET
             ▼
┌──────────────────────────┐
│     Open Library API     │
│       REST Services      │
└────────────┬─────────────┘
             │
             │ JSON
             ▼
┌──────────────────────────┐
│      JavaScript          │
│   Data Processing        │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│       UI Rendering       │
└──────────────────────────┘
```

---

# ⚡ Performance Features

The application includes several performance-oriented features:

### Debounced Search

Search requests are delayed by **450ms** to prevent unnecessary API calls while the user is typing.

### Synopsis Caching

Previously loaded book synopses are stored in memory so they can be displayed immediately when the same book is opened again.

### LocalStorage

User-specific shelf information is persisted locally.

### Error Fallback

If the Open Library API becomes unavailable or the network connection is slow, the application can use fallback book data instead of displaying an empty interface.

---

# 💾 LocalStorage

The application uses browser LocalStorage to maintain:

```text
Reading Shelf
     │
     ├── Active Loans
     │
     └── Wishlist
```

This means user shelf information can survive:

* Page refresh
* Browser restart
* Temporary network failures

---

# 🎯 Main Functionalities

| Feature             | Status |
| ------------------- | ------ |
| Book Search         | ✅      |
| Author Search       | ✅      |
| Subject Search      | ✅      |
| Category Browsing   | ✅      |
| Book Details        | ✅      |
| Book Covers         | ✅      |
| Book Synopsis       | ✅      |
| Wishlist            | ✅      |
| Book Borrowing      | ✅      |
| Reading Shelf       | ✅      |
| LocalStorage        | ✅      |
| Dark Mode           | ✅      |
| Light Mode          | ✅      |
| Grid View           | ✅      |
| List View           | ✅      |
| REST API Inspector  | ✅      |
| API Error Handling  | ✅      |
| Responsive Design   | ✅      |
| Loading Skeletons   | ✅      |
| Toast Notifications | ✅      |

---

# 📸 Project Highlights

### 🏠 Modern Library Dashboard

The home page provides:

* Search
* Categories
* Library statistics
* Featured books
* API status

### 📚 Book Catalog

Users can switch between:

```text
Grid View
     ↓
Compact List View
```

### 📖 Book Details

Clicking a book opens detailed information retrieved from the REST API.

### 📌 Reading Shelf

Users can manage borrowed and saved books from their personal reading shelf.

### 🌙 Theme Support

The interface supports both:

```text
☀️ Light Mode
🌙 Dark Mode
```

---

# 🧪 Error Handling

The application handles common API problems such as:

* Network failure
* Invalid API responses
* Missing book covers
* Missing descriptions
* Missing author information
* API delays
* Empty search results

Instead of breaking the interface, the application displays fallback content or appropriate UI feedback.

---

# 🔐 Data & Privacy

This project does not require a backend database or user account.

User-specific information such as:

* Borrowed books
* Wishlist books

is stored locally in the browser using **LocalStorage**.

No sensitive personal information is transmitted to the project backend because this application does not have its own backend server.

---

# 🔮 Future Improvements

Possible future enhancements include:

* [ ] User authentication
* [ ] Backend server
* [ ] MySQL/MongoDB database
* [ ] Real user accounts
* [ ] Online book reservation
* [ ] Book return tracking
* [ ] Due-date notifications
* [ ] Admin dashboard
* [ ] Librarian dashboard
* [ ] User reviews and ratings
* [ ] Personalized recommendations
* [ ] AI-powered book recommendations
* [ ] Book borrowing history
* [ ] Email notifications
* [ ] Progressive Web App (PWA)
* [ ] Mobile application

---

# 🎓 Learning Outcomes

This project demonstrates practical understanding of:

* REST API architecture
* HTTP GET requests
* JSON data handling
* JavaScript asynchronous programming
* `async/await`
* Fetch API
* API error handling
* Debouncing
* LocalStorage
* DOM manipulation
* Responsive web design
* CSS animations
* Modern UI/UX principles
* Client-side state management

---

# 👨‍💻 Author

**Ankit Patel**

B.Tech Computer Science Engineering
Galgotias University

### Skills Demonstrated

```text
HTML5
CSS3
JavaScript
REST APIs
API Integration
Responsive Web Design
UI/UX
Git & GitHub
```

---

# ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

## 📄 License

This project is created for **educational and portfolio purposes**.

Book data and book covers are provided through the Open Library API.

---

**Built with ❤️ by Ankit Patel**
