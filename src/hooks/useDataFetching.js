import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

// Custom hook for better data fetching with debugging
export const useDataFetching = (queryKey, queryFn, options = {}) => {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000,
    gcTime = 10 * 60 * 1000,
    retry = 3,
    refetchOnWindowFocus = false,
    onSuccess,
    onError,
    ...restOptions
  } = options;

  return useQuery({
    queryKey,
    queryFn: async (...args) => {
      try {
        console.log(`🔄 [${queryKey.join("-")}] Fetching data...`);
        const result = await queryFn(...args);
        console.log(`✅ [${queryKey.join("-")}] Raw API response:`, result);
        // Return the full API response as-is, do not extract or modify
        return result;
      } catch (error) {
        console.error(`❌ [${queryKey.join("-")}] Error:`, error);
        throw error;
      }
    },
    enabled,
    staleTime,
    gcTime,
    retry,
    refetchOnWindowFocus,
    onSuccess: data => {
      console.log(`🎉 [${queryKey.join("-")}] Success:`, data);
      if (onSuccess) onSuccess(data);
    },
    onError: error => {
      console.error(`💥 [${queryKey.join("-")}] Failed:`, error);
      const errorMessage = error?.response?.data?.message || error?.message || "An error occurred";
      toast.error(errorMessage);
      if (onError) onError(error);
    },
    ...restOptions,
  });
};

// Specialized hooks for different data types
export const useBlogs = (params = {}) => {
  const { blogService } = require("../services/blogService");

  return useDataFetching(
    ["blogs", params.page, params.search, params.category],
    () => blogService.getAllBlogs(params),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes for blogs
      retry: 2,
    }
  );
};

export const useTestimonials = (userRole = null) => {
  const testimonialService = require("../services/testimonialService").default;

  const getTestimonials = async () => {
    if (userRole === "admin") {
      return await testimonialService.getAllTestimonials();
    } else {
      return await testimonialService.getPublicTestimonials();
    }
  };

  return useDataFetching(["testimonials", userRole], getTestimonials, {
    staleTime: 5 * 60 * 1000, // 5 minutes for testimonials
    retry: 2,
  });
};

export const useMyProjectWorks = (params = {}) => {
  const { myProjectWorksAPI } = require("../services/apiService");

  return useDataFetching(
    ["my-project-works", params.page, params.search],
    () => myProjectWorksAPI.getAllProjectWorks(params),
    {
      staleTime: 3 * 60 * 1000, // 3 minutes for projects
      retry: 2,
    }
  );
};

// Hook for debugging query state
export const useQueryDebug = queryKey => {
  const queryClient = require("@tanstack/react-query").useQueryClient();

  const getQueryData = () => {
    const data = queryClient.getQueryData(queryKey);
    console.log(`🔍 [${queryKey.join("-")}] Current query data:`, data);
    return data;
  };

  const getQueryState = () => {
    const state = queryClient.getQueryState(queryKey);
    console.log(`🔍 [${queryKey.join("-")}] Current query state:`, state);
    return state;
  };

  return { getQueryData, getQueryState };
};
