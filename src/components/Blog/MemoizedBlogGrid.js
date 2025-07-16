import React, { memo } from "react";
import BlogGrid from "./BlogGrid";

const MemoizedBlogGrid = memo(({ blogs, handleLike, user }) => (
  <BlogGrid blogs={blogs} handleLike={handleLike} user={user} />
));

export default MemoizedBlogGrid;
