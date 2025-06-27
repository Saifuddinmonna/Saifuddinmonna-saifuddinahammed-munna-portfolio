import React, { useEffect, useState } from "react";

const PerformanceMonitor = () => {
  const [loadTime, setLoadTime] = useState(0);
  const [socketLoadTime, setSocketLoadTime] = useState(0);

  useEffect(() => {
    // Measure initial page load time
    const startTime = performance.now();

    window.addEventListener("load", () => {
      const endTime = performance.now();
      const loadTimeMs = endTime - startTime;
      setLoadTime(loadTimeMs);
      console.log(`Page load time: ${loadTimeMs.toFixed(2)}ms`);
    });

    // Measure socket load time
    const socketStartTime = performance.now();
    const socketTimer = setTimeout(() => {
      const socketEndTime = performance.now();
      const socketLoadTimeMs = socketEndTime - socketStartTime;
      setSocketLoadTime(socketLoadTimeMs);
      console.log(`Socket load time: ${socketLoadTimeMs.toFixed(2)}ms`);
    }, 3000);

    return () => clearTimeout(socketTimer);
  }, []);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs z-50">
      <div>Page Load: {loadTime.toFixed(0)}ms</div>
      <div>Socket Load: {socketLoadTime.toFixed(0)}ms</div>
    </div>
  );
};

export default PerformanceMonitor;
