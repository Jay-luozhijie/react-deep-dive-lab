# Week 3: Mini useState Implementation

This project contains 4 progressive versions building toward a real useState implementation.

---

## Table of Contents

- [Mini useState Version 1](#mini-usestate-version-1-global-state--immediate-re-renders) - Global State & Immediate Re-renders
- [Mini useState Version 2](#mini-usestate-version-2-multiple-hooks-with-index-tracking) - Multiple Hooks with Index Tracking
- [Mini useState Version 3](#mini-usestate-version-3-update-queue--batching) - Update Queue & Batching
- [Mini useState Version 4](#mini-usestate-version-4-browser-integration--virtual-dom) - Browser Integration & Virtual DOM

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