import React from "react";
import { motion } from "framer-motion";
import { FaSearch, FaThLarge, FaList, FaSort, FaPalette } from "react-icons/fa";
import Tooltip from "./Tooltip";

const SearchAndFilters = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  currentStyle,
  setCurrentStyle,
  viewMode,
  setViewMode,
  SORT_OPTIONS,
  STYLE_OPTIONS,
  VIEW_MODES,
  buttonVariants,
  commonButtonStyles,
}) => {
  const [styleMenuOpen, setStyleMenuOpen] = React.useState(false);

  return (
    <div className="mb-6 flex flex-wrap items-center gap-4">
      {/* Search Input */}
      <div className="flex-1 min-w-[200px]">
        <Tooltip text="Search projects by name, category, or technology">
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-[var(--border-color)] bg-[var(--background-paper)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] focus:border-transparent shadow-md hover:shadow-lg transition-all duration-300"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]" />
          </div>
        </Tooltip>
      </div>

      {/* Sort By Dropdown */}
      <Tooltip text="Sort projects by different criteria">
        <motion.div
          className="relative"
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className={`appearance-none bg-[var(--background-paper)] border border-[var(--border-color)] text-[var(--text-primary)] py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] focus:border-transparent ${commonButtonStyles}`}
          >
            <option value={SORT_OPTIONS.NEWEST}>Newest</option>
            <option value={SORT_OPTIONS.OLDEST}>Oldest</option>
            <option value={SORT_OPTIONS.NAME_ASC}>Name (A-Z)</option>
            <option value={SORT_OPTIONS.NAME_DESC}>Name (Z-A)</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--text-secondary)]">
            <FaSort className="fill-current h-4 w-4" />
          </div>
        </motion.div>
      </Tooltip>

      {/* Style Preview Button */}
      <Tooltip text="Change the visual style of project cards">
        <motion.div
          className="relative"
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          <button
            type="button"
            onClick={() => setStyleMenuOpen(v => !v)}
            className={`px-4 py-2 rounded-md bg-[var(--background-paper)] text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--background-elevated)] ${commonButtonStyles}`}
          >
            <FaPalette className="h-4 w-4 inline-block mr-2" />
            <span>Style: {currentStyle}</span>
          </button>
          <div
            className={`absolute right-0 mt-2 w-48 bg-[var(--background-paper)] rounded-md shadow-lg border border-[var(--border-color)] z-[999] transform transition-all duration-300 origin-top-right ${
              styleMenuOpen ? "" : "hidden"
            }`}
            onMouseLeave={() => setStyleMenuOpen(false)}
          >
            {Object.values(STYLE_OPTIONS).map(style => (
              <motion.button
                key={style}
                onClick={() => {
                  setCurrentStyle(style);
                  setStyleMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-[var(--background-elevated)] ${
                  currentStyle === style
                    ? "bg-[var(--primary-main)] text-white"
                    : "text-[var(--text-primary)]"
                } ${commonButtonStyles}`}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </Tooltip>

      {/* View Mode Buttons */}
      <Tooltip text="Change the number of cards per row">
        <motion.div
          className="flex rounded-md shadow-sm"
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          <button
            type="button"
            onClick={() => setViewMode(VIEW_MODES.GRID_1)}
            className={`px-4 py-2 rounded-l-md border border-[var(--border-color)] ${
              viewMode === VIEW_MODES.GRID_1
                ? "bg-[var(--primary-main)] text-white border-[var(--primary-main)]"
                : "bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
            } focus:z-10 focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] focus:border-transparent transition-colors duration-200 ${commonButtonStyles}`}
            aria-label="1 card per row"
          >
            <FaThLarge className="transform rotate-45" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode(VIEW_MODES.GRID_2)}
            className={`px-4 py-2 border-t border-b border-[var(--border-color)] ${
              viewMode === VIEW_MODES.GRID_2
                ? "bg-[var(--primary-main)] text-white border-[var(--primary-main)]"
                : "bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
            } focus:z-10 focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] focus:border-transparent transition-colors duration-200 ${commonButtonStyles}`}
            aria-label="2 cards per row"
          >
            <div className="flex gap-1">
              <FaThLarge className="transform rotate-45" />
              <FaThLarge className="transform rotate-45" />
            </div>
          </button>
          <button
            type="button"
            onClick={() => setViewMode(VIEW_MODES.GRID_3)}
            className={`px-4 py-2 border-t border-b border-[var(--border-color)] ${
              viewMode === VIEW_MODES.GRID_3
                ? "bg-[var(--primary-main)] text-white border-[var(--primary-main)]"
                : "bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
            } focus:z-10 focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] focus:border-transparent transition-colors duration-200 ${commonButtonStyles}`}
            aria-label="3 cards per row"
          >
            <div className="flex gap-1">
              <FaThLarge className="transform rotate-45" />
              <FaThLarge className="transform rotate-45" />
              <FaThLarge className="transform rotate-45" />
            </div>
          </button>
          <button
            type="button"
            onClick={() => setViewMode(VIEW_MODES.LIST)}
            className={`px-4 py-2 rounded-r-md border border-[var(--border-color)] ${
              viewMode === VIEW_MODES.LIST
                ? "bg-[var(--primary-main)] text-white border-[var(--primary-main)]"
                : "bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)]"
            } focus:z-10 focus:outline-none focus:ring-2 focus:ring-[var(--primary-main)] focus:border-transparent transition-colors duration-200 ${commonButtonStyles}`}
            aria-label="List view"
          >
            <FaList />
          </button>
        </motion.div>
      </Tooltip>
    </div>
  );
};

export default SearchAndFilters;
