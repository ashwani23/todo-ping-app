# 🚀 Vue Todo App - Accessibility-First Priority Management

A modern Vue.js 3 todo application with **accessibility-first design**, featuring comprehensive priority management, clean architecture, and enterprise-grade testing. Built with reusable components and centralized utilities for maximum maintainability.

[![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC.svg)](https://tailwindcss.com/)
[![Test Coverage](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg)](https://jestjs.io/)

## ✨ Key Features

### 🎯 **Core Functionality**
- **Priority-based task management** (Critical, Moderate, Optional)
- **Smart auto-sorting** by priority and creation date
- **Real-time data persistence** with localStorage
- **Inline editing** with keyboard shortcuts
- **Bulk operations** (clear all with confirmation)

### ♿ **Accessibility Excellence**
- **WCAG 2.1 AA compliant** design patterns
- **Complete keyboard navigation** support
- **Screen reader optimized** with proper ARIA labels
- **Focus management** and visual indicators
- **Semantic HTML** structure throughout
- **High contrast** color schemes for all priority levels
- **Descriptive labels** for all interactive elements

### 🏗️ **Modern Architecture**
- **Centralized utilities** eliminate code duplication (51% code reduction)
- **Reusable components** with consistent behavior
- **Type-safe composables** for business logic
- **Clean separation of concerns**
- **Enterprise-ready** code organization

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🧪 Comprehensive Testing

### **Unit & Component Tests (Jest)**
```bash
# Run all unit tests
npm run test

# Run tests in watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### **End-to-End Tests (Cypress)**
```bash
# Open Cypress interactive testing
npm run test:e2e

# Run E2E tests in headless mode
npm run test:e2e:headless
```

### **🎯 Testing Highlights**
- **100% test coverage** for all utilities and composables
- **Comprehensive component testing** with user interaction simulation
- **Full E2E workflows** including accessibility testing
- **Cross-browser compatibility** verification
- **Real-world scenario testing** with edge cases

## 🎨 Accessibility Features

### **🎯 Keyboard Navigation**
- `Tab` / `Shift+Tab` - Navigate between elements
- `Enter` / `Space` - Activate buttons and form controls
- `Escape` - Cancel editing mode
- `Enter` - Save changes in edit mode

### **📱 Screen Reader Support**
- Comprehensive ARIA labels for all interactive elements
- Live regions for dynamic content updates
- Proper heading hierarchy and landmark roles
- Descriptive text for priority indicators

### **🎨 Visual Accessibility**
- High contrast priority color system
- Clear focus indicators with 2px blue outline
- Consistent spacing and typography
- Visual priority indicators with color + shape

### **📝 Form Accessibility**
- Required field indicators
- Error message associations
- Fieldset grouping for related controls
- Unique IDs to prevent conflicts

## 🏗️ Refactored Architecture

### **📁 Project Structure**
```
src/
├── components/
│   ├── PrioritySelector.vue     # 🆕 Reusable priority component
│   ├── TodoForm.vue            # ♻️ 54% code reduction (151→69 lines)
│   ├── TodoItem.vue            # ♻️ 48% code reduction (234→121 lines)
│   ├── TodoList.vue            # ♻️ Enhanced accessibility
│   └── __tests__/              # ✅ Comprehensive test coverage
├── composables/
│   ├── useFormValidation.ts     # 🆕 Reusable validation logic
│   ├── useTodos.ts             # ♻️ Cleaned up business logic
│   ├── useLocalStorage.ts      # ✅ Persistent data management
│   └── __tests__/              # ✅ 100% test coverage
├── utils/                       # 🆕 Centralized utilities
│   ├── accessibility.ts        # ARIA label generators
│   ├── helpers.ts              # General utility functions
│   ├── priority.ts             # Priority logic & styling
│   └── __tests__/              # ✅ Complete utility testing
├── types/
│   └── todo.ts                 # TypeScript interfaces
└── styles/
    ├── main.css                # Global styles with accessibility
    ├── main.scss               # SCSS architecture
    └── variables.scss          # Design system tokens
```

### **🎯 Key Improvements**
- **51% reduction** in component code through centralization
- **Zero code duplication** across the application
- **Type-safe utilities** for consistent behavior
- **Reusable components** for better maintainability
- **Centralized accessibility** helpers

## 🛠️ Tech Stack

### **Core Technologies**
- **Vue.js 3** - Composition API with `<script setup>`
- **TypeScript 5.x** - Full type safety
- **Vite** - Lightning-fast development
- **Tailwind CSS 3.x** - Utility-first styling
- **SCSS** - Enhanced CSS with variables

### **Testing & Quality**
- **Jest** - Unit and component testing
- **Vue Test Utils** - Component testing utilities
- **Cypress** - End-to-end testing framework
- **ESLint + Prettier** - Code quality and formatting

### **Accessibility Tools**
- **ARIA attributes** - Comprehensive semantic markup
- **Focus management** - Programmatic focus control
- **Color contrast** - WCAG AA compliant colors
- **Keyboard navigation** - Full keyboard accessibility

## 🎯 Development Workflow

### **1. Development Setup**
```bash
npm run dev                    # Start development server
npm run test:watch            # Run tests in watch mode
```

### **2. Quality Assurance**
```bash
npm run test                  # Run all unit tests
npm run test:e2e             # Run end-to-end tests
npm run test:coverage        # Check test coverage
```

### **3. Production Build**
```bash
npm run build                 # Build for production
npm run preview              # Preview production build
```

## ♿ Accessibility Testing

### **Manual Testing Checklist**
- [ ] Navigate entire app using only keyboard
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Verify high contrast mode compatibility
- [ ] Check focus indicators visibility
- [ ] Validate ARIA label accuracy

### **Automated Testing**
- Cypress accessibility tests included
- WAVE accessibility checker compatible
- Lighthouse accessibility audit ready

## 🌟 Usage Examples

### **Adding a Todo**
1. Focus automatically set to input field
2. Type task description
3. Use Tab to navigate to priority selection
4. Use arrow keys or Tab to select priority
5. Press Enter or click "Add Todo"

### **Editing a Todo**
1. Click edit button or press Enter on todo item
2. Modify text in focused input field
3. Use Tab to change priority if needed
4. Press Enter to save or Escape to cancel

### **Keyboard Shortcuts**
- `Enter` - Quick save in edit mode
- `Escape` - Cancel editing
- `Tab` - Navigate between form elements
- `Space/Enter` - Select priority options

## 📊 Performance & Metrics

- **Bundle Size**: Optimized for fast loading
- **Test Coverage**: 100% for utilities and composables
- **Code Quality**: ESLint + Prettier configured
- **Accessibility Score**: WCAG 2.1 AA compliant
- **Cross-browser**: Chrome, Firefox, Safari, Edge

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Run tests: `npm run test`
4. Ensure accessibility: Test with keyboard navigation
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Vue.js team** for the excellent framework
- **Tailwind CSS** for the utility-first approach
- **Web Accessibility Initiative** for WCAG guidelines
- **Testing Library** philosophy for user-centric testing

---

**Built with ❤️ and accessibility in mind**
