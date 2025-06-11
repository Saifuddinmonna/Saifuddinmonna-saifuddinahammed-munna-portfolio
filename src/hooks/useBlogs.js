import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogService } from "../services/blogService";

export const useBlogs = (page = 1, limit = 10, search = "", category = "") => {
  const queryClient = useQueryClient();

  // Get all blogs
  const {
    data: blogs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blogs", { page, limit, search, category }],
    queryFn: () => blogService.getBlogs({ page, limit, search, category }),
  });

  // Get single blog
  const useBlog = id => {
    return useQuery({
      queryKey: ["blog", id],
      queryFn: () => blogService.getBlogById(id),
      enabled: !!id,
    });
  };

  // Create blog mutation
  const createBlog = useMutation({
    mutationFn: blogService.createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs"]);
    },
  });

  // Update blog mutation
  const updateBlog = useMutation({
    mutationFn: ({ id, data }) => blogService.updateBlog(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs"]);
    },
  });

  // Delete blog mutation
  const deleteBlog = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs"]);
    },
  });

  // Add comment mutation
  const addComment = useMutation({
    mutationFn: ({ blogId, comment }) => blogService.addComment(blogId, comment),
    onSuccess: (_, { blogId }) => {
      queryClient.invalidateQueries(["blog", blogId]);
      queryClient.invalidateQueries(["blogs"]);
    },
  });

  // Toggle like mutation
  const toggleLike = useMutation({
    mutationFn: blogService.toggleLike,
    onSuccess: (_, blogId) => {
      queryClient.invalidateQueries(["blog", blogId]);
      queryClient.invalidateQueries(["blogs"]);
    },
  });

  return {
    blogs,
    isLoading,
    error,
    useBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    addComment,
    toggleLike,
  };
};
