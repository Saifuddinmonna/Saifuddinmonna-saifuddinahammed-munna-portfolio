import { useAuth } from "../auth/context/AuthContext";
import { useState, useEffect, useMemo } from "react";

/**
 * Custom hook to check if current user is an admin (async version)
 * @returns {Object} { isAdmin: boolean, loading: boolean }
 */
export const useIsAdmin = () => {
  const { dbUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!dbUser || !dbUser.data) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Check for admin status with multiple conditions
      const adminStatus =
        (dbUser.data?.role === "admin" && dbUser.data?.isAdmin === true) ||
        dbUser.data?.role === "admin" ||
        (dbUser.data?.email && dbUser.data?.email.includes("admin")) ||
        (dbUser.data?.name && dbUser.data?.name.toLowerCase().includes("admin"));

      setIsAdmin(adminStatus);
      setLoading(false);
    };

    checkAdminStatus();
  }, [dbUser]);

  return { isAdmin, loading };
};

/**
 * Simple hook to check if current user is an admin (synchronous fallback)
 * @returns {boolean} true if user is admin
 */
export const useIsAdminSync = () => {
  const { dbUser } = useAuth();

  return useMemo(() => {
    // Return false immediately if no dbUser or dbUser.data
    if (!dbUser || !dbUser.data) {
      return false;
    }

    // Check for admin status with multiple conditions
    const isAdmin =
      (dbUser.data?.role === "admin" && dbUser.data?.isAdmin === true) ||
      dbUser.data?.role === "admin" ||
      (dbUser.data?.email && dbUser.data?.email.includes("admin")) ||
      (dbUser.data?.name && dbUser.data?.name.toLowerCase().includes("admin"));

    return isAdmin;
  }, [dbUser]);
};

/**
 * Custom hook to check if current user is the author of a specific post
 * @param {Object} post - The post object containing author information
 * @returns {boolean} true if user is the author of the post
 */
export const useIsAuthor = post => {
  const { user } = useAuth();
  return user && post?.author?.email === user.email;
};

/**
 * Custom hook to check if current user can edit a specific post
 * @param {Object} post - The post object containing author information
 * @returns {boolean} true if user can edit (admin OR author)
 */
export const useCanEdit = post => {
  const isAdmin = useIsAdmin();
  const isAuthor = useIsAuthor(post);
  return isAdmin || isAuthor;
};

/**
 * Custom hook to check if current user can delete a specific post
 * @param {Object} post - The post object containing author information
 * @returns {boolean} true if user can delete (admin OR author)
 */
export const useCanDelete = post => {
  const isAdmin = useIsAdmin();
  const isAuthor = useIsAuthor(post);
  return isAdmin || isAuthor;
};

/**
 * Utility function to check if user is admin (for non-hook contexts)
 * @param {Object} dbUser - The database user object
 * @returns {boolean} true if user is admin
 */
export const checkIsAdmin = dbUser => {
  return dbUser && dbUser.data && dbUser.data.role === "admin" && dbUser.data.isAdmin === true;
};

/**
 * Utility function to check if user is author (for non-hook contexts)
 * @param {Object} user - The current user object
 * @param {Object} post - The post object containing author information
 * @returns {boolean} true if user is the author of the post
 */
export const checkIsAuthor = (user, post) => {
  return user && post?.author?.email === user.email;
};

/**
 * Utility function to check if user can edit (for non-hook contexts)
 * @param {Object} user - The current user object
 * @param {Object} dbUser - The database user object
 * @param {Object} post - The post object containing author information
 * @returns {boolean} true if user can edit (admin OR author)
 */
export const checkCanEdit = (user, dbUser, post) => {
  const isAdmin = checkIsAdmin(dbUser);
  const isAuthor = checkIsAuthor(user, post);
  return isAdmin || isAuthor;
};

/**
 * Utility function to check if user can delete (for non-hook contexts)
 * @param {Object} user - The current user object
 * @param {Object} dbUser - The database user object
 * @param {Object} post - The post object containing author information
 * @returns {boolean} true if user can delete (admin OR author)
 */
export const checkCanDelete = (user, dbUser, post) => {
  const isAdmin = checkIsAdmin(dbUser);
  const isAuthor = checkIsAuthor(user, post);
  return isAdmin || isAuthor;
};

/**
 * Async function to check if user is admin (for better performance)
 * @param {Object} dbUser - The database user object
 * @returns {Promise<boolean>} true if user is admin
 */
export const checkIsAdminAsync = async dbUser => {
  if (!dbUser || !dbUser.data) return false;

  // Check for admin status with multiple conditions
  const isAdmin =
    (dbUser.data?.role === "admin" && dbUser.data?.isAdmin === true) ||
    dbUser.data?.role === "admin" ||
    (dbUser.data?.email && dbUser.data?.email.includes("admin")) ||
    (dbUser.data?.name && dbUser.data?.name.toLowerCase().includes("admin"));

  return isAdmin;
};
