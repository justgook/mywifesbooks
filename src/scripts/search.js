class Search {
  constructor() {
    this.desktopSearch = document.getElementById('search-input');
    this.mobileSearch = document.getElementById('search-input-mobile');
    this.resultsContainer = document.getElementById('search-results');
    this.booksData = null;
    this.debounceTimeout = null;
    this.init();
  }

  async init() {
    this.setupEventListeners();
    await this.loadBooksData();
  }

  async loadBooksData() {
    try {
      const response = await fetch('/data/books.json');
      if (!response.ok) throw new Error('Failed to load books data');
      this.booksData = await response.json();
    } catch (error) {
      console.error('Error loading books data:', error);
      this.showError('Failed to load search data. Please try again later.');
    }
  }

  setupEventListeners() {
    [this.desktopSearch, this.mobileSearch].forEach(input => {
      if (input) {
        input.addEventListener('input', () => this.handleSearch());
        input.addEventListener('focus', () => {
          if (this.booksData && this.activeInput.value.trim()) {
            this.resultsContainer.classList.add('show');
            this.handleSearch();
          }
        });
      }
    });

    document.addEventListener('click', (e) => {
      if (!this.resultsContainer.contains(e.target) && 
          e.target !== this.desktopSearch && 
          e.target !== this.mobileSearch) {
        this.hideResults();
      }
    });
  }

  get activeInput() {
    return document.activeElement === this.desktopSearch ? this.desktopSearch : this.mobileSearch;
  }

  handleSearch() {
    clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(() => {
      const query = this.activeInput.value.trim().toLowerCase();
      if (!query) {
        this.hideResults();
        return;
      }
      
      const results = this.searchBooks(query);
      this.displayResults(results);
    }, 300);
  }

  searchBooks(query) {
    if (!this.booksData) return [];
    return this.booksData.filter(book => {
      const title = book?.title?.toLowerCase() || '';
      const author = book?.author?.toLowerCase() || '';
      const series = book?.series?.toLowerCase() || '';
      return title.includes(query) || author.includes(query) || series.includes(query);
    });
  }

  highlightMatch(text, query) {
    if (!text || !query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-700">$1</mark>');
  }

  displayResults(results) {
    this.resultsContainer.innerHTML = '';
    const query = this.activeInput.value.trim();
    
    if (results.length === 1) {
      window.location.href = `/books/${results[0].slug}`;
      return;
    }

    if (results.length > 0) {
      results.forEach(result => {
        const item = document.createElement('a');
        item.href = `/books/${result.slug}`;
        item.className = 'block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600';
        
        const title = document.createElement('div');
        title.className = 'font-medium dark:text-gray-100';
        title.innerHTML = this.highlightMatch(
          (result.title || '').replace(/"/g, '').trim(),
          query
        );
        
        const author = document.createElement('div');
        author.className = 'text-sm text-gray-500 dark:text-gray-400';
        author.innerHTML = this.highlightMatch(
          (result.author || 'Unknown Author').replace(/"/g, '').trim(),
          query
        );
        
        item.appendChild(title);
        item.appendChild(author);
        
        if (result.series) {
          const series = document.createElement('div');
          series.className = 'text-xs text-blue-600 dark:text-blue-400 mt-1';
          series.innerHTML = `Цикл: ${this.highlightMatch(
            result.series.replace(/"/g, '').trim(),
            query
          )}`;
          item.appendChild(series);
        }
        
        this.resultsContainer.appendChild(item);
      });
      this.resultsContainer.classList.add('show');
    } else {
      this.showNoResults();
    }
  }

  showNoResults() {
    const noResults = document.createElement('div');
    noResults.className = 'px-4 py-2 text-gray-500 dark:text-gray-400';
    noResults.textContent = 'No books found';
    this.resultsContainer.innerHTML = '';
    this.resultsContainer.appendChild(noResults);
    this.resultsContainer.classList.add('show');
  }

  showError(message) {
    const error = document.createElement('div');
    error.className = 'px-4 py-2 text-red-500 dark:text-red-400';
    error.textContent = message;
    this.resultsContainer.innerHTML = '';
    this.resultsContainer.appendChild(error);
    this.resultsContainer.classList.add('show');
  }

  hideResults() {
    this.resultsContainer.classList.remove('show');
  }
}

export default Search;
