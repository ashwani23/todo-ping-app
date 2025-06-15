# Todo App

A Vue.js 3 todo application with priority management, featuring comprehensive testing with Jest and Cypress.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Testing

### Unit & Component Tests (Jest)
```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### End-to-End Tests (Cypress)
```bash
# Open Cypress interactive mode
npm run test:e2e

# Run E2E tests headlessly
npm run test:e2e:headless

# Open component testing
npm run test:component

# Run component tests headlessly  
npm run test:component:headless
```

## Features

- Add/edit/remove todos with priority levels (Critical, Moderate, Optional)
- Auto-sort by priority
- Local storage persistence
- Responsive design
- Comprehensive test coverage
- Accessibility support

## Tech Stack

- **Vue.js 3** with Composition API
- **TypeScript** for type safety
- **Vite** for fast development
- **Tailwind CSS** for styling
- **SCSS** for custom styles
- **Jest + Vue Test Utils** for unit testing
- **Cypress** for E2E testing

## Project Structure

```
src/
├── components/
│   ├── __tests__/           # Component unit tests
│   ├── TodoForm.vue
│   ├── TodoItem.vue
│   └── TodoList.vue
├── composables/
│   ├── __tests__/           # Composable unit tests
│   ├── useTodos.ts
│   └── useLocalStorage.ts
├── styles/
│   ├── main.scss
│   └── variables.scss
├── types/
│   └── todo.ts
├── App.vue
├── main.ts
└── test-setup.ts
cypress/
├── e2e/                     # E2E tests
├── support/                 # Cypress support files
└── fixtures/                # Test data
```

## Testing Strategy

### Unit Tests
- Component behavior testing
- Composable logic testing
- User interaction testing
- Error handling testing

### E2E Tests
- Complete user workflows
- Cross-browser compatibility
- Local storage persistence
- Accessibility testing

## Development Workflow

1. **Development**: `npm run dev`
2. **Unit Testing**: `npm run test:watch` (during development)
3. **E2E Testing**: `npm run test:e2e` (for full workflows)
4. **Build**: `npm run build`
5. **Coverage**: `npm run test:coverage` (before deployment)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ support required
- No Internet Explorer support
