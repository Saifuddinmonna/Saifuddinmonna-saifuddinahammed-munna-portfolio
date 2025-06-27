import React, { useEffect, useState } from "react";

/**
 * Performance Optimizer Component
 * Manages loading priorities and resource optimization
 */
const PerformanceOptimizer = () => {
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [loadingStrategy, setLoadingStrategy] = useState("normal");

  useEffect(() => {
    // Detect device capabilities
    const detectDeviceCapabilities = () => {
      // Check for low-end devices
      const memory = navigator.deviceMemory || 4; // Default to 4GB if not available
      const cores = navigator.hardwareConcurrency || 4; // Default to 4 cores

      if (memory < 4 || cores < 4) {
        setIsLowEndDevice(true);
        setLoadingStrategy("conservative");
      }

      // Check connection speed
      if ("connection" in navigator) {
        const connection = navigator.connection;
        if (
          connection.effectiveType === "slow-2g" ||
          connection.effectiveType === "2g" ||
          connection.effectiveType === "3g"
        ) {
          setIsSlowConnection(true);
          setLoadingStrategy("minimal");
        }
      }

      // Check for mobile devices
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      if (isMobile && isLowEndDevice) {
        setLoadingStrategy("mobile-optimized");
      }
    };

    detectDeviceCapabilities();

    // Apply performance optimizations based on strategy
    const applyOptimizations = () => {
      switch (loadingStrategy) {
        case "minimal":
          // Disable animations for slow connections
          document.documentElement.style.setProperty("--animation-duration", "0s");
          document.documentElement.style.setProperty("--transition-duration", "0s");
          break;
        case "conservative":
          // Reduce animation complexity
          document.documentElement.style.setProperty("--animation-duration", "0.3s");
          document.documentElement.style.setProperty("--transition-duration", "0.2s");
          break;
        case "mobile-optimized":
          // Optimize for mobile devices
          document.documentElement.style.setProperty("--animation-duration", "0.4s");
          document.documentElement.style.setProperty("--transition-duration", "0.3s");
          break;
        default:
          // Normal performance
          document.documentElement.style.setProperty("--animation-duration", "0.6s");
          document.documentElement.style.setProperty("--transition-duration", "0.3s");
      }
    };

    applyOptimizations();

    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload hero image
      const heroImage = new Image();
      heroImage.src = "/images/profile1.png";

      // Preload critical CSS
      const criticalCSS = document.createElement("link");
      criticalCSS.rel = "preload";
      criticalCSS.as = "style";
      criticalCSS.href = "/static/css/main.css";
      document.head.appendChild(criticalCSS);
    };

    // Only preload on fast connections
    if (!isSlowConnection) {
      preloadCriticalResources();
    }

    // Monitor performance
    const monitorPerformance = () => {
      if ("performance" in window) {
        window.addEventListener("load", () => {
          const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
          console.log(`Page load time: ${loadTime}ms`);

          // Adjust strategy based on load time
          if (loadTime > 5000) {
            setLoadingStrategy("conservative");
          }
        });
      }
    };

    monitorPerformance();
  }, [isLowEndDevice, loadingStrategy]);

  // Expose loading strategy to other components
  useEffect(() => {
    window.loadingStrategy = loadingStrategy;
    window.isLowEndDevice = isLowEndDevice;
    window.isSlowConnection = isSlowConnection;
  }, [loadingStrategy, isLowEndDevice, isSlowConnection]);

  return null; // This component doesn't render anything
};

export default PerformanceOptimizer;
