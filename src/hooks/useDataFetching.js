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

        // Simplified data extraction logic
        let processedData = result;

        // Handle nested data structures consistently
        if (result && typeof result === "object") {
          // If result has a data property, extract it
          if ("data" in result) {
            processedData = result.data;
            console.log(`📦 [${queryKey.join("-")}] Extracted from result.data:`, processedData);

            // If the extracted data also has a data property (double nesting)
            if (processedData && typeof processedData === "object" && "data" in processedData) {
              processedData = processedData.data;
              console.log(
                `📦 [${queryKey.join("-")}] Further extracted from nested data:`,
                processedData
              );
            }
          }
          // If result has a works property (specific to MyProjectWorks)
          else if ("works" in result && Array.isArray(result.works)) {
            processedData = result.works;
            console.log(`📦 [${queryKey.join("-")}] Extracted from result.works:`, processedData);
          }
          // If result has a projects property
          else if ("projects" in result && Array.isArray(result.projects)) {
            processedData = result.projects;
            console.log(
              `📦 [${queryKey.join("-")}] Extracted from result.projects:`,
              processedData
            );
          }
        }

        // Final validation and logging
        if (Array.isArray(processedData)) {
          console.log(
            `📊 [${queryKey.join("-")}] Final array data (${processedData.length} items):`,
            processedData
          );
        } else if (processedData && typeof processedData === "object") {
          console.log(`📊 [${queryKey.join("-")}] Final object data:`, processedData);
        } else {
          console.log(`📊 [${queryKey.join("-")}] Final data:`, processedData);
        }

        return processedData;
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
