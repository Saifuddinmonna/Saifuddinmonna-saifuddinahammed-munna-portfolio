import { useState, useMemo } from 'react'; // Added useMemo for optimization
import { motion } from 'framer-motion';
import blogPostsData from '../../data/blogData.json';

const ARTICLES_PER_PAGE = 10;

const Blog = () => {
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // Memoize calculations for current articles and total pages
    const { currentArticles, totalPages } = useMemo(() => {
        const indexOfLastArticle = currentPage * ARTICLES_PER_PAGE;
        const indexOfFirstArticle = indexOfLastArticle - ARTICLES_PER_PAGE;
        const articles = blogPostsData.slice(indexOfFirstArticle, indexOfLastArticle);
        const pages = Math.ceil(blogPostsData.length / ARTICLES_PER_PAGE);
        return { currentArticles: articles, totalPages: pages };
    }, [currentPage]); // Recalculate only when currentPage changes

    const handleReadMore = (article) => {
        setSelectedArticle(article);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedArticle(null);
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Function to generate page numbers for pagination control
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5; // Max page numbers to show directly (e.g., 1 2 3 ... 7 8)
        const halfPagesToShow = Math.floor(maxPagesToShow / 2);

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Always show first page
            pageNumbers.push(1);
            if (currentPage > halfPagesToShow + 1) {
                pageNumbers.push('...'); // Ellipsis if current page is far from start
            }

            let startPage = Math.max(2, currentPage - halfPagesToShow + (currentPage > totalPages - halfPagesToShow ? totalPages - maxPagesToShow +1 : 1 ));
            let endPage = Math.min(totalPages - 1, currentPage + halfPagesToShow - (currentPage < halfPagesToShow +1 ? maxPagesToShow - totalPages : 1));
            
            // Adjust start and end if near beginning or end
            if (currentPage <= halfPagesToShow) {
                endPage = Math.min(totalPages -1, maxPagesToShow -1);
            }
            if (currentPage > totalPages - halfPagesToShow) {
                startPage = Math.max(2, totalPages - maxPagesToShow +2)
            }


            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            if (currentPage < totalPages - halfPagesToShow) {
                pageNumbers.push('...'); // Ellipsis if current page is far from end
            }
            // Always show last page
            pageNumbers.push(totalPages);
        }
        return pageNumbers;
    };


    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
                        <span className="block">Web Development</span>
                        <span className="block text-blue-600">Blog & Insights</span>
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        Stay updated with the latest trends, tips, and insights in web development
                    </p>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
                    {currentArticles.map((post) => ( // Map over currentArticles for the current page
                        <motion.article
                            key={post.id}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                            whileHover={{ y: -5 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="relative h-48">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                        {post.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                    <span>{post.date}</span>
                                    <span className="mx-2">•</span>
                                    <span>{post.readTime}</span>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                    {post.title}
                                </h2>
                                <p className="text-gray-600 mb-4 line-clamp-3"> {/* Added line-clamp for consistent excerpt height */}
                                    {post.excerpt}
                                </p>
                                <button
                                    onClick={() => handleReadMore(post)}
                                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                                >
                                    Read More
                                    <svg
                                        className="ml-2 w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </motion.article>
                    ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="mt-12 flex justify-center items-center space-x-2 sm:space-x-4">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="px-3 py-2 sm:px-4 sm:py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                        >
                            Previous
                        </button>

                        {getPageNumbers().map((page, index) =>
                            typeof page === 'number' ? (
                                <button
                                    key={index}
                                    onClick={() => handlePageClick(page)}
                                    className={`px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md text-sm sm:text-base ${
                                        currentPage === page
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {page}
                                </button>
                            ) : (
                                <span key={index} className="px-1 sm:px-2 py-2 text-gray-500 text-sm sm:text-base">
                                    {page}
                                </span>
                            )
                        )}

                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 sm:px-4 sm:py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                        >
                            Next
                        </button>
                    </div>
                )}


                {/* Newsletter Section */}
                <div className="mt-16 bg-blue-600 rounded-2xl p-8 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Subscribe to Our Newsletter
                    </h2>
                    <p className="text-blue-100 mb-6">
                        Get the latest articles and insights delivered straight to your inbox
                    </p>
                    <div className="max-w-md mx-auto flex gap-4">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                        <button className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>

            {/* Article Modal (remains the same) */}
            {showModal && selectedArticle && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="relative">
                            <img
                                src={selectedArticle.image}
                                alt={selectedArticle.title}
                                className="w-full h-64 object-cover rounded-t-xl"
                            />
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center text-sm text-gray-500 mb-4">
                                <span>{selectedArticle.date}</span>
                                <span className="mx-2">•</span>
                                <span>{selectedArticle.readTime}</span>
                                <span className="mx-2">•</span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    {selectedArticle.category}
                                </span>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                {selectedArticle.title}
                            </h2>
                            <div className="prose max-w-none">
                                <p className="text-gray-600 whitespace-pre-line">
                                    {selectedArticle.content}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Blog;
