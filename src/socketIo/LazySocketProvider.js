import React, { useState, useEffect, lazy, Suspense } from "react";

// Lazy load SocketProvider
const SocketProvider = lazy(() => import("./SocketProvider"));

const LazySocketProvider = ({ children }) => {
  const [shouldLoad, setShouldLoad] = useState(false);

  // Load SocketProvider after initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 3000); // Load after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!shouldLoad) {
    return <>{children}</>;
  }

  return (
    <Suspense fallback={<>{children}</>}>
      <SocketProvider>{children}</SocketProvider>
    </Suspense>
  );
};

export default LazySocketProvider;
