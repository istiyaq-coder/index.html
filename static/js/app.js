\
document.addEventListener("DOMContentLoaded", () => {
  // Search functionality
  const open = document.getElementById("openSearch");
  const openMobile = document.getElementById("openSearchMobile");
  const drawer = document.getElementById("searchDrawer");
  const closeBtn = document.getElementById("closeSearch");
  const input = document.getElementById("searchInput");
  const results = document.getElementById("searchResults");
  
  function showSearch() { 
    drawer.classList.remove("hidden"); 
    input.focus();
    // Close mobile menu if open
    const mobileMenu = document.getElementById("mobileMenu");
    if(mobileMenu && !mobileMenu.classList.contains("hidden")) {
      mobileMenu.classList.add("hidden");
    }
  }
  function hideSearch() { drawer.classList.add("hidden"); }
  
  if(open) open.addEventListener("click", showSearch);
  if(openMobile) openMobile.addEventListener("click", showSearch);
  if(closeBtn) closeBtn.addEventListener("click", hideSearch);
  if(drawer) drawer.addEventListener("click", (e)=>{ if(e.target===drawer) hideSearch(); });
  
  // Enhanced search with click-to-navigate and loading states
  let searchTimeout;
  if(input){
    input.addEventListener("input", async (e) => {
      const q = e.target.value.trim();
      
      // Clear previous timeout
      clearTimeout(searchTimeout);
      
      if(!q){ 
        results.innerHTML = ""; 
        return; 
      }
      
      // Show loading state immediately for fast typers
      results.innerHTML = `
        <div class="flex items-center justify-center p-6">
          <div class="animate-spin rounded-full h-6 w-6 border-2 border-indigo-600 border-t-transparent"></div>
          <span class="ml-2 text-sm text-slate-600">Searching...</span>
        </div>
      `;
      
      // Debounce search to avoid too many requests
      searchTimeout = setTimeout(async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
          
          const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (!res.ok) {
            throw new Error(`Search failed: ${res.status}`);
          }
          
          const data = await res.json();
          
          if(data.length === 0) {
            results.innerHTML = `
              <div class="text-center p-6 text-slate-500">
                <div class="text-sm">No results found for "${q}"</div>
                <div class="text-xs mt-1">Try different keywords or check spelling</div>
              </div>
            `;
            return;
          }
          
          results.innerHTML = data.map(item => {
            let detailUrl = '#';
            if(item.kind === 'product') detailUrl = `/procurement?q=${encodeURIComponent(item.name)}`;
            else if(item.kind === 'service') detailUrl = `/services?q=${encodeURIComponent(item.name)}`;
            else if(item.kind === 'rental') detailUrl = `/rentals?q=${encodeURIComponent(item.name)}`;
            
            return `
              <a href="${detailUrl}" class="block p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="text-xs text-slate-500 uppercase">${item.category || item.kind || ""}</div>
                    <div class="font-semibold mt-1">${item.name}</div>
                    <div class="text-sm text-slate-600 mt-1">${item.description || ""}</div>
                    ${item.vendor_name ? `<div class="text-xs text-indigo-600 mt-2">${item.vendor_name}</div>` : ''}
                  </div>
                  <div class="ml-3 text-right">
                    <div class="font-bold text-indigo-600">₹${parseFloat(item.price).toFixed(0)}</div>
                    ${item.kind === 'rental' ? '<div class="text-xs text-slate-500">/day</div>' : ''}
                  </div>
                </div>
              </a>
            `;
          }).join("");
          
        } catch (error) {
          if (error.name === 'AbortError') {
            results.innerHTML = '<div class="p-3 text-amber-600 text-sm">Search timed out. Please try again.</div>';
          } else {
            results.innerHTML = `
              <div class="p-3 text-red-600 text-sm">
                <div class="font-medium">Search error</div>
                <div class="text-xs mt-1">Please check your connection and try again</div>
              </div>
            `;
          }
          console.error('Search error:', error);
        }
      }, 300); // 300ms debounce
    });
  }
  
  // Mobile menu functionality
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  
  if(mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if(!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add("hidden");
      }
    });
    
    // Close mobile menu when clicking on links
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }
  
  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // ESC to close modals
    if(e.key === "Escape") {
      hideSearch();
      if(mobileMenu && !mobileMenu.classList.contains("hidden")) {
        mobileMenu.classList.add("hidden");
      }
    }
    
    // Ctrl/Cmd + K to open search
    if((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      showSearch();
    }
  });
});
