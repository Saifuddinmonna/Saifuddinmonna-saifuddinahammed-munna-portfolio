import React, { memo, useEffect } from "react";

// Test component to track re-renders
const BlogOptimizationTest = memo(({ componentName, props }) => {
  useEffect(() => {
    console.log(`🔄 [${componentName}] Re-rendered with props:`, props);
  });

  return null; // This component doesn't render anything, just tracks re-renders
});

BlogOptimizationTest.displayName = "BlogOptimizationTest";

export default BlogOptimizationTest;
