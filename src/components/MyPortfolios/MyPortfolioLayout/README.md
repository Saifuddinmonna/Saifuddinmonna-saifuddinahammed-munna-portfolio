# PortfolioLayout Component Structure

This directory contains the refactored PortfolioLayout component, broken down into smaller, more manageable pieces.

## 📁 Directory Structure

```
MyPortfolioLayout/
├── components/
│   ├── index.js                 # Component exports
│   ├── Tooltip.js               # Tooltip component
│   ├── LoadingSkeleton.js       # Loading skeleton component
│   ├── PortfolioCard.js         # Individual portfolio card
│   ├── PortfolioOverview.js     # Project overview component
│   ├── CategorySidebar.js       # Category sidebar component
│   └── SearchAndFilters.js      # Search and filter controls
├── utils/
│   ├── index.js                 # Utility exports
│   ├── constants.js             # All constants and configurations
│   └── styleUtils.js            # Style-related utility functions
├── PortfolioLayout.js           # Main component (now much smaller!)
├── Portfolio.css                # Styles
└── README.md                    # This file
```

## 🧩 Components

### Main Components

- **PortfolioLayout.js** - Main container component (now ~150 lines vs 800+ lines)
- **CategorySidebar.js** - Left sidebar with category filters
- **SearchAndFilters.js** - Search bar and filter controls
- **PortfolioCard.js** - Individual project card component
- **LoadingSkeleton.js** - Loading state component

### Utility Components

- **Tooltip.js** - Reusable tooltip component
- **PortfolioOverview.js** - Project overview display

## 🛠️ Utilities

### Constants (`utils/constants.js`)

- Animation variants
- Style options
- View modes
- Sort options
- Common button styles
- Font styles

### Style Utils (`utils/styleUtils.js`)

- `getStyleClasses()` - Returns style classes based on selected theme

## 📦 Benefits of This Structure

1. **Maintainability** - Each component has a single responsibility
2. **Reusability** - Components can be easily reused elsewhere
3. **Testability** - Smaller components are easier to test
4. **Readability** - Code is much easier to understand and navigate
5. **Performance** - Better code splitting and lazy loading potential

## 🔧 Usage

```jsx
import PortfolioLayout from "./MyPortfolioLayout/PortfolioLayout";

// Use the main component
<PortfolioLayout />;
```

## 🎨 Customization

To customize styles or add new features:

1. Modify constants in `utils/constants.js`
2. Add new style variants in `utils/styleUtils.js`
3. Create new components in `components/` directory
4. Update exports in respective `index.js` files
