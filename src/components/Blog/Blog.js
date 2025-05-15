import  { useState } from 'react';
import { motion } from 'framer-motion';

const Blog = () => {
	const [selectedArticle, setSelectedArticle] = useState(null);
	const [showModal, setShowModal] = useState(false);

	const blogPosts = [
		{
			id: 1,
			title: "The Future of Web Development: Trends to Watch in 2024",
			excerpt: "Explore the latest trends in web development, from AI integration to WebAssembly and beyond.",
			content: "The web development landscape is evolving at an unprecedented pace. In 2024, we're seeing several key trends that are reshaping how we build and deploy web applications. Artificial Intelligence is becoming increasingly integrated into development workflows, with tools like GitHub Copilot and automated testing solutions. WebAssembly continues to gain traction, enabling near-native performance in the browser. The rise of edge computing is changing how we think about application architecture, while new frameworks and tools are emerging to simplify the development process. This article explores these trends in detail and provides insights into how they might shape the future of web development.",
			image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3",
			date: "March 15, 2024",
			category: "Web Development",
			readTime: "5 min read"
		},
		{
			id: 2,
			title: "Mastering React Hooks: A Comprehensive Guide",
			excerpt: "Learn how to effectively use React Hooks to build more maintainable and efficient applications.",
			content: "React Hooks have revolutionized how we write React components. This comprehensive guide covers everything from basic hooks like useState and useEffect to advanced patterns and custom hooks. We'll explore common pitfalls, best practices, and real-world examples of how to leverage hooks effectively. You'll learn how to manage complex state, handle side effects, and create reusable logic across your application. Whether you're new to hooks or looking to deepen your understanding, this guide provides the knowledge you need to write better React code.",
			image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3",
			date: "March 12, 2024",
			category: "React",
			readTime: "8 min read"
		},
		{
			id: 3,
			title: "The Rise of AI in Web Development",
			excerpt: "Discover how artificial intelligence is transforming the way we build and maintain websites.",
			content: "Artificial Intelligence is no longer just a buzzword in web development. From automated testing to code generation, AI tools are becoming essential parts of the development workflow. This article explores how AI is being used to improve code quality, enhance user experience, and streamline development processes. We'll look at practical examples of AI integration in web applications and discuss the future implications for developers and businesses alike.",
			image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3",
			date: "March 10, 2024",
			category: "AI & Web",
			readTime: "6 min read"
		},
		{
			id: 4,
			title: "Building Scalable Applications with Node.js",
			excerpt: "Best practices and patterns for creating scalable Node.js applications that can handle millions of users.",
			content: "Building scalable applications requires careful consideration of architecture, performance, and resource management. This article dives deep into the best practices for creating Node.js applications that can scale to meet growing demands. We'll cover topics like load balancing, caching strategies, database optimization, and microservices architecture. You'll learn practical techniques for improving performance and reliability in your Node.js applications.",
			image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3",
			date: "March 8, 2024",
			category: "Backend",
			readTime: "7 min read"
		},
		{
			id: 5,
			title: "Modern CSS Techniques Every Developer Should Know",
			excerpt: "Explore advanced CSS features and techniques that can enhance your web development workflow.",
			content: "CSS has evolved significantly in recent years, introducing powerful features that make styling more efficient and maintainable. This article covers modern CSS techniques including Grid and Flexbox layouts, CSS Variables, Custom Properties, and advanced animations. We'll also explore how to use these features effectively in real-world projects and discuss browser compatibility considerations.",
			image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-4.0.3",
			date: "March 6, 2024",
			category: "CSS",
			readTime: "6 min read"
		},
		{
			id: 6,
			title: "TypeScript Best Practices for Large-Scale Applications",
			excerpt: "Learn how to effectively use TypeScript in large-scale applications to improve code quality and maintainability.",
			content: "TypeScript has become an essential tool for building large-scale applications. This article covers best practices for using TypeScript effectively, including type definitions, interfaces, generics, and advanced type features. We'll discuss how to structure TypeScript projects, handle type safety, and integrate with popular frameworks and libraries.",
			image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3",
			date: "March 4, 2024",
			category: "TypeScript",
			readTime: "8 min read"
		},
		{
			id: 7,
			title: "The Evolution of Frontend Architecture",
			excerpt: "Understanding the changing landscape of frontend architecture and its impact on modern web development.",
			content: "Frontend architecture has undergone significant changes in recent years. This article explores the evolution of frontend architecture, from traditional monolithic applications to modern micro-frontends. We'll discuss the benefits and challenges of different architectural approaches and provide guidance on choosing the right architecture for your project.",
			image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3",
			date: "March 2, 2024",
			category: "Architecture",
			readTime: "7 min read"
		},
		{
			id: 8,
			title: "Optimizing Web Performance in 2024",
			excerpt: "Essential techniques and tools for improving web performance and user experience.",
			content: "Web performance optimization is crucial for providing a good user experience. This article covers modern techniques for improving website performance, including code splitting, lazy loading, image optimization, and caching strategies. We'll also discuss tools and metrics for measuring and monitoring performance.",
			image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3",
			date: "February 29, 2024",
			category: "Performance",
			readTime: "6 min read"
		},
		{
			id: 9,
			title: "Building Accessible Web Applications",
			excerpt: "Learn how to create web applications that are accessible to all users, regardless of their abilities.",
			content: "Web accessibility is not just a legal requirement but a moral obligation. This article provides a comprehensive guide to building accessible web applications, covering topics like semantic HTML, ARIA attributes, keyboard navigation, and screen reader compatibility. We'll also discuss testing tools and techniques for ensuring accessibility.",
			image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3",
			date: "February 27, 2024",
			category: "Accessibility",
			readTime: "7 min read"
		},
		{
			id: 10,
			title: "The Future of State Management in React",
			excerpt: "Exploring new approaches to state management in React applications.",
			content: "State management in React continues to evolve with new solutions and patterns emerging. This article explores the current state of state management in React, including Context API, Redux Toolkit, Zustand, and other modern solutions. We'll compare different approaches and provide guidance on choosing the right solution for your project.",
			image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3",
			date: "February 25, 2024",
			category: "React",
			readTime: "8 min read"
		},
		{
			id: 11,
			title: "Serverless Architecture: Benefits and Challenges",
			excerpt: "Understanding the advantages and potential pitfalls of serverless architecture.",
			content: "Serverless architecture has gained popularity for its scalability and cost-effectiveness. This article explores the benefits and challenges of serverless architecture, including cold starts, vendor lock-in, and debugging difficulties. We'll also discuss best practices for implementing serverless solutions and real-world use cases.",
			image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3",
			date: "February 23, 2024",
			category: "Cloud",
			readTime: "6 min read"
		},
		{
			id: 12,
			title: "Modern Testing Strategies for Web Applications",
			excerpt: "Comprehensive guide to testing modern web applications effectively.",
			content: "Testing is crucial for maintaining code quality and preventing bugs. This article covers modern testing strategies for web applications, including unit testing, integration testing, end-to-end testing, and visual regression testing. We'll discuss popular testing tools and frameworks and provide practical examples of implementing different types of tests.",
			image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3",
			date: "February 21, 2024",
			category: "Testing",
			readTime: "7 min read"
		},
		{
			id: 13,
			title: "GraphQL vs REST: Making the Right Choice",
			excerpt: "Comparing GraphQL and REST APIs to help you choose the right approach for your project.",
			content: "The choice between GraphQL and REST can significantly impact your application's architecture and performance. This article provides a detailed comparison of both approaches, discussing their strengths, weaknesses, and use cases. We'll also cover implementation considerations and migration strategies.",
			image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3",
			date: "February 19, 2024",
			category: "API",
			readTime: "8 min read"
		},
		{
			id: 14,
			title: "Building Progressive Web Apps in 2024",
			excerpt: "Guide to creating modern Progressive Web Apps with the latest features and best practices.",
			content: "Progressive Web Apps (PWAs) continue to evolve with new features and capabilities. This article covers the latest developments in PWA development, including service workers, offline functionality, and app-like experiences. We'll discuss implementation strategies and tools for building effective PWAs.",
			image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3",
			date: "February 17, 2024",
			category: "PWA",
			readTime: "7 min read"
		},
		{
			id: 15,
			title: "The Impact of Web Components on Modern Development",
			excerpt: "Understanding how Web Components are changing the way we build web applications.",
			content: "Web Components provide a standardized way to create reusable custom elements. This article explores how Web Components are being used in modern web development, their benefits, and implementation challenges. We'll discuss integration with popular frameworks and real-world use cases.",
			image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3",
			date: "February 15, 2024",
			category: "Web Components",
			readTime: "6 min read"
		},
		{
			id: 16,
			title: "Security Best Practices for Web Applications",
			excerpt: "Essential security practices every web developer should implement.",
			content: "Web security is more important than ever. This article covers essential security practices for web applications, including authentication, authorization, data encryption, and protection against common vulnerabilities. We'll discuss implementation strategies and tools for maintaining secure applications.",
			image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3",
			date: "February 13, 2024",
			category: "Security",
			readTime: "8 min read"
		},
		{
			id: 17,
			title: "The Future of CSS: New Features and Possibilities",
			excerpt: "Exploring upcoming CSS features and their potential impact on web development.",
			content: "CSS continues to evolve with new features and capabilities. This article explores upcoming CSS features, including container queries, cascade layers, and new color spaces. We'll discuss how these features might change the way we write CSS and their potential impact on web development.",
			image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-4.0.3",
			date: "February 11, 2024",
			category: "CSS",
			readTime: "7 min read"
		},
		{
			id: 18,
			title: "Building Real-time Applications with WebSocket",
			excerpt: "Guide to implementing real-time features in web applications using WebSocket.",
			content: "Real-time functionality is becoming increasingly important in web applications. This article covers implementing real-time features using WebSocket, including connection management, error handling, and scaling considerations. We'll discuss practical examples and best practices for building real-time applications.",
			image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3",
			date: "February 9, 2024",
			category: "Real-time",
			readTime: "6 min read"
		},
		{
			id: 19,
			title: "Optimizing Images for the Web",
			excerpt: "Best practices for optimizing images to improve web performance.",
			content: "Image optimization is crucial for web performance. This article covers best practices for optimizing images, including format selection, compression techniques, and responsive images. We'll discuss tools and strategies for implementing effective image optimization in your projects.",
			image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3",
			date: "February 7, 2024",
			category: "Performance",
			readTime: "7 min read"
		},
		{
			id: 20,
			title: "The Rise of Edge Computing in Web Development",
			excerpt: "Understanding how edge computing is changing web development and deployment strategies.",
			content: "Edge computing is transforming how we deploy and serve web applications. This article explores the impact of edge computing on web development, including performance benefits, deployment strategies, and implementation considerations. We'll discuss real-world examples and future trends in edge computing.",
			image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3",
			date: "February 5, 2024",
			category: "Cloud",
			readTime: "8 min read"
		}
	];

	const handleReadMore = (article) => {
		setSelectedArticle(article);
		setShowModal(true);
	};

	const closeModal = () => {
		setShowModal(false);
		setSelectedArticle(null);
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
					{blogPosts.map((post) => (
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
								<p className="text-gray-600 mb-4">
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

			{/* Article Modal */}
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
