import React, { useState } from "react";
import { useBlogPagination } from "../../hooks/useBlogPagination";
import BlogPagination from "../ui/BlogPagination";

// Test component to verify pagination functionality
const BlogPaginationTest = () => {
  const [testContent, setTestContent] = useState(`
    <h1>Test Blog Post</h1>
    <p>This is a test blog post with multiple paragraphs to test the pagination functionality. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

    <h2>Section 1</h2>
    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>

    <p>Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>

    <h2>Section 2</h2>
    <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullamco laboriosam.</p>

    <p>Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.</p>

    <h2>Section 3</h2>
    <p>Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.</p>

    <p>Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</p>

    <h2>Section 4</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>

    <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>

    <h2>Section 5</h2>
    <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>

    <p>Ut enim ad minima veniam, quis nostrum exercitationem ullamco laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>

    <h2>Conclusion</h2>
    <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.</p>
  `);

  const {
    currentPage,
    totalPages,
    currentPageContent,
    currentPageWordCount,
    readingProgress,
    currentPageReadTime,
    isLoading: paginationLoading,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    hasNextPage,
    hasPreviousPage,
    wordCounts,
  } = useBlogPagination(testContent, 200, 100); // 200 words per page for testing

  return (
    <div className="min-h-screen bg-[var(--background-default)] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-8">Blog Pagination Test</h1>

        {/* Test Controls */}
        <div className="bg-[var(--background-paper)] rounded-lg p-6 mb-8 border border-[var(--border-main)]">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Test Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Words per page:
              </label>
              <select
                className="w-full p-2 border border-[var(--border-main)] rounded-lg bg-[var(--background-default)] text-[var(--text-primary)]"
                onChange={e => {
                  const newContent = testContent;
                  setTestContent(newContent);
                }}
              >
                <option value="200">200 words</option>
                <option value="300">300 words</option>
                <option value="500">500 words</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Test Content:
              </label>
              <button
                className="w-full p-2 bg-[var(--primary-main)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors"
                onClick={() =>
                  setTestContent(
                    testContent + " <p>Additional content added for testing pagination.</p>"
                  )
                }
              >
                Add More Content
              </button>
            </div>
          </div>
        </div>

        {/* Pagination Stats */}
        <div className="bg-[var(--background-paper)] rounded-lg p-6 mb-8 border border-[var(--border-main)]">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            Pagination Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-[var(--primary-main)]">{totalPages}</div>
              <div className="text-sm text-[var(--text-secondary)]">Total Pages</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--primary-main)]">
                {currentPageWordCount}
              </div>
              <div className="text-sm text-[var(--text-secondary)]">Current Page Words</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--primary-main)]">
                {readingProgress}%
              </div>
              <div className="text-sm text-[var(--text-secondary)]">Reading Progress</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--primary-main)]">
                {currentPageReadTime}
              </div>
              <div className="text-sm text-[var(--text-secondary)]">Min Read Time</div>
            </div>
          </div>

          {/* Word counts per page */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              Word Counts per Page:
            </h3>
            <div className="flex flex-wrap gap-2">
              {wordCounts.map((count, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm ${
                    index + 1 === currentPage
                      ? "bg-[var(--primary-main)] text-white"
                      : "bg-[var(--background-default)] text-[var(--text-secondary)]"
                  }`}
                >
                  Page {index + 1}: {count} words
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination Component */}
        {totalPages > 1 && (
          <div className="mb-8">
            <BlogPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              onNextPage={goToNextPage}
              onPreviousPage={goToPreviousPage}
              onFirstPage={goToFirstPage}
              onLastPage={goToLastPage}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              isLoading={paginationLoading}
              currentPageWordCount={currentPageWordCount}
              currentPageReadTime={currentPageReadTime}
              readingProgress={readingProgress}
            />
          </div>
        )}

        {/* Content Display */}
        <div className="bg-[var(--background-paper)] rounded-lg p-8 border border-[var(--border-main)]">
          <div className="prose prose-lg max-w-none text-[var(--text-primary)]">
            {paginationLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--primary-main)]"></div>
                <span className="ml-3 text-[var(--text-secondary)]">Loading page content...</span>
              </div>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: currentPageContent }} />
            )}
          </div>
        </div>

        {/* Bottom Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <BlogPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              onNextPage={goToNextPage}
              onPreviousPage={goToPreviousPage}
              onFirstPage={goToFirstPage}
              onLastPage={goToLastPage}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              isLoading={paginationLoading}
              currentPageWordCount={currentPageWordCount}
              currentPageReadTime={currentPageReadTime}
              readingProgress={readingProgress}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPaginationTest;
