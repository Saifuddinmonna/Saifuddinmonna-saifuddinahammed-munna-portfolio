import React, { useState, useEffect, lazy, Suspense } from "react";

// Lazy load ChatWindow
const ChatWindow = lazy(() => import("./ChatWindow"));

const LazyChatWindow = ({ isChatOpen, onCloseChat }) => {
  const [shouldLoad, setShouldLoad] = useState(false);

  // Load chat window after initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 5000); // Load after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!shouldLoad) {
    return null;
  }

  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <ChatWindow isChatOpen={isChatOpen} onCloseChat={onCloseChat} />
    </Suspense>
  );
};

export default LazyChatWindow;
