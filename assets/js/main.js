// Main JavaScript for BusinessToolsInsider

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }
    
    // Hero search functionality
    const heroSearch = document.getElementById('hero-search');
    const heroSearchBtn = heroSearch?.nextElementSibling;
    
    if (heroSearch && heroSearchBtn) {
        heroSearchBtn.addEventListener('click', function() {
            const query = heroSearch.value.trim();
            if (query) {
                window.location.href = `/search/?q=${encodeURIComponent(query)}`;
            }
        });
        
        heroSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = heroSearch.value.trim();
                if (query) {
                    window.location.href = `/search/?q=${encodeURIComponent(query)}`;
                }
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add reading progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        z-index: 9999;
        transition: width 0.1s;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = progress + '%';
    });
    
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Analytics event tracking
    function trackEvent(category, action, label) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }
    }
    
    // Track affiliate link clicks
    document.querySelectorAll('a[rel="nofollow"]').forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('Affiliate', 'Click', this.href);
        });
    });
    
    // Track category clicks
    document.querySelectorAll('.category-card a, .best-of-card a').forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('Navigation', 'Category Click', this.textContent);
        });
    });
});

// Search functionality
function initializeSearch() {
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = this.querySelector('input[type="search"]').value;
            performSearch(query);
        });
    }
}

function performSearch(query) {
    // Simple client-side search implementation
    // In production, this would connect to a search service
    const results = [];
    const posts = window.searchData || [];
    
    posts.forEach(post => {
        if (post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.content.toLowerCase().includes(query.toLowerCase()) ||
            post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))) {
            results.push(post);
        }
    });
    
    displaySearchResults(results, query);
}

function displaySearchResults(results, query) {
    const resultsContainer = document.querySelector('.search-results');
    if (!resultsContainer) return;
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <h3>No results found for "${query}"</h3>
                <p>Try different keywords or browse our categories.</p>
            </div>
        `;
        return;
    }
    
    const resultsHTML = results.map(result => `
        <article class="search-result">
            <h3><a href="${result.url}">${result.title}</a></h3>
            <p>${result.excerpt}</p>
            <div class="result-meta">
                <span class="category">${result.category}</span>
                <span class="date">${result.date}</span>
            </div>
        </article>
    `).join('');
    
    resultsContainer.innerHTML = `
        <div class="results-header">
            <h2>${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"</h2>
        </div>
        <div class="results-list">
            ${resultsHTML}
        </div>
    `;
}