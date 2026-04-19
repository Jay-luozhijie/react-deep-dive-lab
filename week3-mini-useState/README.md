# Week 3: Mini useState Implementation

This project contains 5 progressive versions building toward a real useState implementation.

---

## Table of Contents

- [Mini useState Version 1](#mini-usestate-version-1-global-state--immediate-re-renders) - Global State & Immediate Re-renders
- [Mini useState Version 2](#mini-usestate-version-2-multiple-hooks-with-index-tracking) - Multiple Hooks with Index Tracking
- [Mini useState Version 3](#mini-usestate-version-3-update-queue--batching) - Update Queue & Batching
- [Mini useState Version 4](#mini-usestate-version-4-browser-integration--virtual-dom) - Browser Integration & Virtual DOM
- [Mini useState Version 5](#mini-usestate-version-5-multiple-components--component-hooks-map) - Multiple Components & Component Hooks Map

---

## Mini useState

## Mini useState Version 1: Global State & Immediate Re-renders

```javascript
let state;

function useState(initialValue) {
    state = state || initialValue
    const setState = newValue => {
        console.log('setState called with', newValue)
        state = typeof newValue === 'function' ? newValue(state) : newValue
        render()
    }
    return [state, setState]
}

function App() {
    const [count, setCount] = useState(0)

    console.log('App render', count)
    return {
        onClickFunction() {
            setCount(prev => prev + 1)
        },
        onClickValue(){
            setCount(count + 1)
        }
    }
}

let app;

function render() {
    console.log('Render App Start')
    app = App()
    console.log('Render App End')
}

render()

app.onClickFunction()
app.onClickValue()
```

**How it works:**

`render()` is the entry point for the first render. In `App()`, `useState` returns an array `[state, setState]`. The state is stored globally outside, which is why it is remembered even between different function calls.

**Key Insight:** After `setState`, this version triggers `render()` immediately, which updates the state right away. That means every time there's an update, the App will be re-rendered and the `onClickValue()` function will be updated also. Thus calling `onClickValue()` twice we can see count is updated by 2 not 1 (different from real React's batching behavior).

---

## Mini useState Version 2: Multiple Hooks with Index Tracking

**How it works:**

This version adds a `hooks` array to store multiple hooks. Every time `useState` is called, the `hookIndex` is increased by 1. The `render()` function resets the `hookIndex` to 0. This is why we shouldn't have a hook in an if statement — the index will be mismatched.

**Why Conditional Hooks Break:**

React gets hook values from `hooks[index]` with `index++`. If the next hook is rendered conditionally, this will be the scenario:

**Setup**: hook1 → hook2(conditionally) → hook3

**First render:**
```javascript
useState(hook1Value)
if(...) {
    useState(hook2Value)
}
useState(hook3Value)
```

Result: `hooks = ["hook1Value", "hook2Value", "hook3Value"]`

**Second render (condition is false):**
```javascript
useState(hook1Value)
// hook2 skipped!
useState(hook3Value)
```

When accessing hook3, the hook index is still pointing to hook2. Thus calling `useState(hook3Value)` will receive the value from hook2, and all these will be messed up.

---

## Mini useState Version 3: Update Queue & Batching

**How it works:**

This version adds an update queue and batches state updates using `Promise.resolve()`:

```javascript
function scheduleRender(){
    if (!isRendering) {
        isRendering = true
        Promise.resolve().then(() => {
            queue.map(fn => fn())
            queue = []
            render()
            isRendering = false
        })
    }
}
```

**How Promise.resolve() batching works:**

`Promise.resolve().then(() => {})` creates a microtask that executes after all synchronous code finishes. Even if there's an `await` with no task later, this `Promise.resolve()` has priority.

Inside `setState`:
```javascript
const setState = newValue => {
    console.log('setState called with', newValue)
    queue.push(() => {
        console.log('Updating state at hook index', hookIndex)
        hooks[hookIndex] = typeof newValue === 'function' ? newValue(hooks[hookIndex]) : newValue
    })
    scheduleRender()
}
```

It pushes a function to the queue and calls `scheduleRender()`, which triggers the render once all sync functions are executed (when entering an `await` breakpoint).

**Why only one Promise.resolve():**

Once `isRendering` is set to true, `scheduleRender()` won't create another `Promise.resolve()`. After the queue is cleared, `isRendering` is set to false and the queue is ready for the next batch.

**Example Test:**

```javascript
app.onClickFunction()
app.onClickName()
app.onClickFunction()
app.onClickName()

await new Promise(resolve => setTimeout(resolve, 0))

app.onClickFunction()
app.onClickName()
```

The first 4 function calls execute in the same batch, while the last 2 execute in a separate batch after the `await` boundary.

---

## Mini useState Version 4: Browser Integration & Virtual DOM

**How it works:**

This version integrates with the browser using Virtual DOM (VDOM). All code runs in an HTML file within a `<script>` tag.

### Step 1: HTML Setup

Create an HTML file with a root div where our app will render:

```html
<!DOCTYPE html>
<html>
<body>
  <div id="root"></div>

  <script>
    const root = document.getElementById('root')

    root.innerHTML = '<h1>hello</h1>'
  </script>
</body>
</html>
```

All subsequent code goes inside the `<script>` tag.


### Step 2: createElement Function

This function converts UI elements into a Virtual DOM object:

```javascript
function createElement(type, props, ...children) {
  return { 
    type, 
    props: props || {},
    children: children.flat()
  }
}
```

The returned object forms a tree structure:

```javascript
{
  type: 'div',
  props: { size: 'large' },
  children: [
    {
      type: 'h1',
      props: {},
      children: [20]
    },
    {
      type: 'p',
      props: {},
      children: ['hello this is the string, the tree ends here']
    }
  ]
}
```

### Step 3: renderToDom Function

This function converts the Virtual DOM object into real DOM nodes:

```javascript
function renderToDom(vdom) {
  if (typeof vdom === 'string' || typeof vdom === 'number') {
    return document.createTextNode(vdom)
  }

  const el = document.createElement(vdom.type)

  Object.entries(vdom.props || {}).forEach(([key, value]) => {
    if (key.startsWith('on')) {
      // onclick → click
      el.addEventListener(key.slice(2).toLowerCase(), value)
    } else {
      el.setAttribute(key, value)
    }
  })

  vdom.children.forEach(child => {
    el.appendChild(renderToDom(child))
  })

  return el
}
```

**Two types of nodes:**

1. **Text nodes:** If vdom is a string or number, create a text node with `document.createTextNode(vdom)`
2. **Element nodes:** If vdom is an object:
   - Create element with `document.createElement(vdom.type)`
   - Process props: if key starts with `on`, add event listener; otherwise set attribute
   - Recursively call `renderToDom(child)` for each child and append to current element
   - Return the created element

### Step 4: Integrating useState with Render

Copy the useState implementation from Version 3, and modify the `render()` function:

```javascript
function render() {
  currentHook = 0
  const vdom = App()
  root.innerHTML = ''
  root.appendChild(renderToDom(vdom))
}
```

Every time `render()` is called, `App()` returns a new VDOM tree, which gets converted to real DOM and appended to the root.

### Step 5: The App Component

Define the App component using hooks and createElement:

```javascript
function App() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('Alice')

  return createElement('div', null,
    createElement('h1', null, `Hello ${name}, count: ${count}`),
    createElement('button', { onclick: () => setCount(c => c + 1) }, '+1'),
    createElement('button', { onclick: () => setName(n => n + '!') }, '!')
  )
}

// Start the app
render()
```

**Flow:** createElement creates the VDOM object → App returns VDOM → render() passes it to renderToDom() → real DOM is generated and appended to root → UI updates on screen.

---

## Mini useState Version 5: Multiple Components & Component Hooks Map

**How it works:**

This version adds support for multiple custom components (e.g., `Counter`). Each component needs its own hooks array, so we introduce a `componentHooksMap` to store hooks for each component instance.

**Key Changes:**

### 1. Global State Variables

```javascript
let componentHooksMap = new Map()  // component id → hooks array
let currentComponent = null        // currently rendering component id
let currentHook = 0               // current hook index within component
let renderPath = []               // track position in render tree
```

**Understanding the global variables:**

- **`currentHook`**: Hook index within the current component. Must be reset to `0` before each component renders. This is why in `renderToDom`, when `vdom.type instanceof Function`, we set `currentHook = 0` before calling the component function.

- **`currentComponent`**: The unique ID of the currently rendering component. Set in `renderToDom` before calling the component function, so `useState` knows which component's hooks to access.

- **`renderPath`**: An array like `[0, 1, 0]` tracking the **component hierarchy path**, NOT the full DOM tree path. It only includes custom components (e.g., `Counter`, `App`), not native DOM elements (e.g., `div`, `button`). This keeps the path lean and focused on components that need hooks storage.

  Example: `renderPath = [0, 1, 0]` means:
  - Index 0: First custom component child of root
  - Index 1: Second custom component child of that component
  - Index 0: First custom component child of the leaf

### 2. Component ID Strategy

Each component instance needs a unique ID to store its hooks. The ID is determined by:

- **With key prop:** `ComponentName-${key}` (state follows the key)
- **Without key:** `ComponentName-${renderPath.join('.')}` (state follows position)

### 3. Enhanced renderToDom

Add a new case for **function-type components**:

```javascript
function renderToDom(vdom, index = 0) {
  // ... handle string/number ...

  // NEW: Handle component functions (App, Counter, etc.)
  if (vdom.type instanceof Function) {
    // 1. Build unique component ID
    let id = vdom.props?.key
      ? `${vdom.type.name}-${vdom.props.key}`
      : `${vdom.type.name}-${[...renderPath, index].join('.')}`
    
    // 2. Initialize hooks array for this component
    if (!componentHooksMap.has(id)) {
      componentHooksMap.set(id, [])
    }
    
    // 3. Set context for useState calls
    currentComponent = id
    currentHook = 0
    
    // 4. Track render path
    renderPath.push(index)
    
    // 5. Call component function to get child VDOM
    const childVdom = vdom.type(vdom.props)
    
    // 6. Restore path
    renderPath.pop()
    
    // 7. Recursively render the child VDOM
    return renderToDom(childVdom)
  }

  // ... handle DOM elements ...
}
```

### 4. Updated useState

```javascript
function useState(initialValue) {
  const id = currentComponent  // Use the current component's ID
  const hooks = componentHooksMap.get(id)
  const hookIndex = currentHook
  
  hooks[hookIndex] = hooks[hookIndex] ?? initialValue
  
  const setState = newValue => {
    queue.push(() => {
      hooks[hookIndex] = typeof newValue === 'function' 
        ? newValue(hooks[hookIndex]) 
        : newValue
    })
    scheduleRender()
  }
  
  currentHook++
  return [hooks[hookIndex], setState]
}
```

### 5. Example with Multiple Components

```javascript
function Counter({ label }) {
  const [count, setCount] = useState(0)
  return createElement('div', null,
    createElement('h3', null, `${label}: ${count}`),
    createElement('button', { onclick: () => setCount(c => c + 1) }, '+1')
  )
}

function App() {
  const [name, setName] = useState('Alice')
  
  return createElement('div', null,
    createElement('h1', null, `Hello ${name}`),
    createElement(Counter, { key: 'counter1', label: 'First' }),
    createElement(Counter, { key: 'counter2', label: 'Second' }),
    createElement(Counter, { key: 'counter3', label: 'Third' })
  )
}
```

**Result:** Each `Counter` has its own independent state, stored under different IDs in `componentHooksMap`:
- `Counter-counter1`
- `Counter-counter2`
- `Counter-counter3`

**Key Insight:** The `renderPath` and component ID system allows React to distinguish between different instances of the same component, ensuring each maintains its own state.

