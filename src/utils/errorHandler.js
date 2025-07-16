// Global error handler for chunk loading and other errors
export const setupGlobalErrorHandling = () => {
  // Handle chunk loading errors
  window.addEventListener("error", event => {
    if (event.error && event.error.message && event.error.message.includes("Loading chunk")) {
      console.error("Chunk loading error detected:", event.error);

      // Clear cache and reload
      if ("caches" in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
          });
        });
      }

      // Show user-friendly message
      const errorMessage = document.createElement("div");
      errorMessage.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #ef4444;
        color: white;
        padding: 1rem;
        text-align: center;
        z-index: 9999;
        font-family: system-ui, -apple-system, sans-serif;
      `;
      errorMessage.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto;">
          <strong>Page Loading Error</strong><br>
          The page failed to load properly. Reloading in 3 seconds...
          <button onclick="window.location.reload()" style="margin-left: 1rem; padding: 0.5rem 1rem; background: white; color: #ef4444; border: none; border-radius: 4px; cursor: pointer;">
            Reload Now
          </button>
        </div>
      `;
      document.body.appendChild(errorMessage);

      // Auto-reload after 3 seconds
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  });

  // Handle unhandled promise rejections
  window.addEventListener("unhandledrejection", event => {
    console.error("Unhandled promise rejection:", event.reason);

    // If it's a chunk loading error
    if (event.reason && event.reason.message && event.reason.message.includes("Loading chunk")) {
      event.preventDefault(); // Prevent default error handling

      // Clear cache and reload
      if ("caches" in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
          });
        });
      }

      window.location.reload();
    }
  });

  // Handle network errors
  window.addEventListener("offline", () => {
    console.log("Network is offline");
  });

  window.addEventListener("online", () => {
    console.log("Network is back online");
    // Optionally reload the page when network comes back
    // window.location.reload();
  });
};

// Function to clear all caches
export const clearAllCaches = async () => {
  if ("caches" in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
  }

  // Clear localStorage if needed
  // localStorage.clear();

  // Clear sessionStorage if needed
  // sessionStorage.clear();
};

// Function to handle service worker updates
export const handleServiceWorkerUpdate = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      console.log("Service worker updated, reloading page...");
      window.location.reload();
    });
  }
};

// Initialize error handling
export const initializeErrorHandling = () => {
  setupGlobalErrorHandling();
  handleServiceWorkerUpdate();

  // Handle service worker registration errors
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("message", event => {
      if (event.data && event.data.type === "SKIP_WAITING") {
        window.location.reload();
      }
    });
  }
};
