# Unit Testing Setup for Thirukkural Practice App

## Overview
Vitest and React Testing Library have been configured for component and hook testing. All tests are currently passing.

## Testing Stack
- **Test Runner**: Vitest 4.0.6
- **DOM Testing**: React Testing Library with jsdom
- **User Interactions**: @testing-library/user-event
- **UI Visualization**: @vitest/ui (optional)

## Test Organization

Tests are located in `src/__tests__/` mirroring the production structure:

```
src/
├── __tests__/
│   ├── components/
│   │   ├── practice/
│   │   │   ├── NavigationControls.test.tsx
│   │   │   └── ScholarSelector.test.tsx
│   │   └── TimerDisplay.test.tsx
│   └── hooks/
│       └── useTimer.test.ts
├── components/        (production code)
├── hooks/             (production code)
└── types/             (production code)
```

### Why This Structure?
- ✅ Tests separated from production code
- ✅ Easy to exclude from build/distribution
- ✅ Mirrors directory structure for maintainability
- ✅ Clear visual separation of test vs source
- ✅ Follows industry best practices

## Test Files (23 tests - all passing)

1. **`src/__tests__/components/practice/NavigationControls.test.tsx`** (6 tests)
   - Rendering buttons and labels
   - Click handlers (previous, next, show answer)
   - Badge display
   - Disabled state behavior

2. **`src/__tests__/components/practice/ScholarSelector.test.tsx`** (5 tests)
   - Rendering all scholar options
   - Toggle functionality
   - Multiple selections
   - Full-width responsive layout

3. **`src/__tests__/components/TimerDisplay.test.tsx`** (6 tests)
   - Time formatting (MM:SS)
   - Progress indicator (conic-gradient)
   - Button interactions
   - State labels (Start, Again, etc.)

4. **`src/__tests__/hooks/useTimer.test.ts`** (6 tests)
   - Initialization
   - Start/pause/resume functionality
   - Reset behavior
   - Count increment
   - Hook API completeness

## Configuration Files

- **`vitest.config.ts`**: Main Vitest configuration with jsdom environment, glob patterns, and path aliases
- **`src/test/setup.ts`**: Test environment setup (DOM cleanup, matchMedia mock)

## NPM Scripts

```bash
# Run tests in watch mode (default)
npm test

# Run tests once
npm test -- --run

# Run tests with UI dashboard
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## Test Examples

### Component Test
```typescript
it('toggles meaning selection when clicked', async () => {
  const user = userEvent.setup();
  const mockToggle = vi.fn();
  
  render(
    <ScholarSelector selectedMeanings={new Set()} onMeaningToggle={mockToggle} />
  );
  
  const buttons = screen.getAllByRole('button');
  await user.click(buttons[0]);
  
  expect(mockToggle).toHaveBeenCalledOnce();
});
```

### Hook Test
```typescript
it('increments count when incrementCount is called', () => {
  const { result } = renderHook(() => useTimer({ initialTime: 120, isLive: false }));
  
  act(() => {
    result.current.incrementCount();
  });
  
  expect(result.current.count).toBe(1);
});
```

## Next Steps

To expand testing to more components:

1. **QuestionView.tsx** - Test question display and answer logic
2. **KuralDisplay.tsx** - Test Tamil text rendering and layout
3. **GroupSelector.tsx** - Test group filtering
4. **TopicSelector.tsx** - Test topic selection
5. **useNavigation.ts** - Test navigation state machine
6. **Data utilities** - Test parsing and filtering logic

## Coverage Goals

Current test coverage focuses on user interactions and core state management. Future expansion should include:
- Data transformation functions (parseSource, filtering)
- Navigation logic and history management
- Integration tests for complete user flows
- Tamil text tokenization and matching
- Score calculation formulas

## Running Tests

```bash
# Development with watch mode
npm test

# CI/CD pipeline
npm test -- --run

# View results with dashboard
npm run test:ui

# Generate HTML coverage
npm run test:coverage
```

All tests use real-world scenarios matching the app's use cases.
