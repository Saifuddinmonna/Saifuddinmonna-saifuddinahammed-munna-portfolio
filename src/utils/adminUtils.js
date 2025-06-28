import { useAuth } from "../auth/context/AuthContext";

/**
 * Custom hook to check if current user is an admin
 * @returns {boolean} true if user is admin
 */
export const useIsAdmin = () => {
  const { dbUser } = useAuth();
  return dbUser && dbUser.role === "admin" && dbUser.isAdmin === true;
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
  return dbUser && dbUser.role === "admin" && dbUser.isAdmin === true;
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
