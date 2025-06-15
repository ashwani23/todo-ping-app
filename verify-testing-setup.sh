#!/bin/bash

echo "🔧 Verifying Todo App Testing Setup..."
echo "=================================="

# Check if package.json has correct scripts
echo "📋 Checking package.json scripts..."
if grep -q "\"test\": \"jest\"" package.json; then
    echo "✅ Jest test script found"
else
    echo "❌ Jest test script missing"
fi

if grep -q "\"test:e2e\": \"cypress open\"" package.json; then
    echo "✅ Cypress E2E script found"
else
    echo "❌ Cypress E2E script missing"
fi

# Check if config files exist
echo ""
echo "⚙️  Checking configuration files..."
config_files=("jest.config.js" "babel.config.json" "cypress.config.ts")
for file in "${config_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done

# Check if test directories exist
echo ""
echo "📁 Checking test directories..."
test_dirs=("src/__tests__" "src/components/__tests__" "src/composables/__tests__" "cypress/e2e" "cypress/support")
for dir in "${test_dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo "✅ $dir exists"
    else
        echo "❌ $dir missing"
    fi
done

# Check if sample test files exist
echo ""
echo "🧪 Checking sample test files..."
test_files=("src/components/__tests__/TodoForm.test.ts" "src/composables/__tests__/useTodos.test.ts" "cypress/e2e/todo-app.cy.ts")
for file in "${test_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done

echo ""
echo "🎯 Next Steps:"
echo "1. Run 'npm install' to install dependencies"
echo "2. Run 'npm run test' to execute Jest unit tests"
echo "3. Run 'npm run dev' to start the dev server"
echo "4. Run 'npm run test:e2e' to open Cypress (after dev server is running)"
echo ""
echo "✨ Setup verification complete!"
