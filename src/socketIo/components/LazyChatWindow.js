import React, { lazy, Suspense } from "react";

// Lazy load ChatWindow
const ChatWindow = lazy(() => import("./ChatWindow"));

const LazyChatWindow = ({ isChatOpen, onCloseChat }) => {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <ChatWindow isChatOpen={isChatOpen} onCloseChat={onCloseChat} />
    </Suspense>
  );
};

export default LazyChatWindow;
