# React Render Explorer

A hands-on project to explore and understand React's rendering mechanism through interactive examples.

## 🚀 Getting Started

```bash
cd week1-render-explorer
npm install
npm run dev
```

## 📋 Project Structure

### App.tsx (Parent Component)

**Controller Section:**
- **Toggle Controls**: Show/hide Counter Panel, Normal Child, Memo Child, Text Input, Heavy List
- **Dynamic Props Toggle**: Controls whether MemoChild receives dynamic or static props
- **Parent State**: 
  - `parentRenderCount` (useRef): Tracks renders without triggering re-renders
  - `parentStateCount` (useState): State counter that triggers re-renders
- **Actions**: "Update Parent" button (increments state) and "Reset" button

### Child Components

#### 1. **CounterPanel**
Tests the scope of renders. When only this child updates its internal state, the parent and other siblings do **not** re-render—only CounterPanel itself renders.

**Features:**
- Render counter (useRef)
- Internal state counter (useState)
- Update State button
- Reset Local button

#### 2. **NormalChild**
Demonstrates default React behavior: re-renders **every time** the parent updates, since it's not memoized.

#### 3. **MemoChild** (React.memo)
Optimization showcase: only re-renders when:
- Props change (e.g., `label` prop updates)
- Internal state changes (e.g., "Update Internal State" button clicked)

**Does NOT re-render** when:
- Parent re-renders but props remain the same
- Dynamic Props toggle is OFF (passes static 'normal-static' string)

**Key Code:**
```jsx
{showMemoChild && <MemoChild label={dynamicProps ? String(parentCount) : 'normal-static'} />}
```

**Important:** When `showMemoChild` toggles from `true` → `false` → `true`, MemoChild is **unmounted** then **remounted** as a new component instance. All internal state is destroyed and reset.

#### 4. **TextInputPanel**
Demonstrates instantaneous updates in React. Every keystroke triggers an immediate re-render.

#### 5. **HeavyList**
Simulates heavy computational load by rendering 100000 list items. When enabled, parent updates become noticeably slower, demonstrating performance impact.

## 🔑 Key Concepts Demonstrated

### Render vs. Re-render vs. Unmount

- **Render**: Component function executes and returns JSX
- **Re-render**: Component updates while staying mounted (state preserved)
- **Unmount**: Component removed from React tree (state destroyed)

### useRef vs. useState

- **useRef**: Changes don't trigger re-renders (good for tracking)
- **useState**: Changes trigger re-renders (updates UI)

**Example:** After clicking "Reset" in CounterPanel, the ref value becomes 0, but without a state update, no re-render occurs. The display still shows the old render count until the next re-render is triggered by a state change.

### Component Lifecycle

Components unmount when:
- Conditional rendering removes them: `{show && <Component />}`
- The `key` prop changes: `<Component key={id} />` (when `id` changes, React unmounts the old component and mounts a new one)
- Position in component tree changes
- Parent component unmounts

