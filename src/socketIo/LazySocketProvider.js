import React, { lazy, Suspense } from "react";

// Lazy load SocketProvider
const SocketProvider = lazy(() => import("./SocketProvider"));

const LazySocketProvider = ({ children }) => {
  return (
    <Suspense fallback={<>{children}</>}>
      <SocketProvider>{children}</SocketProvider>
    </Suspense>
  );
};

export default LazySocketProvider;
