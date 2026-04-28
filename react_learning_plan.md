# Frontend Learning Plan — Week 1 to Week 12

## 📑 Table of Contents

- [Current Status](#current-status)
- [The Big Picture](#the-big-picture)
- [Week 1 — React Render Mechanism](#week-1--react-render-mechanism)
- [Week 2 — State, Snapshots, and Reconciliation](#week-2--state-snapshots-and-reconciliation)
- [Week 3 — Hooks Mechanism + Mini React](#week-3--hooks-mechanism--mini-react)
- [Week 4 — Effects and Render Timing](#week-4--effects-and-render-timing)
- [Week 5 — Scheduler + Performance](#week-5--scheduler--performance)
- [Week 6 — State Architecture + Design Principles](#week-6--state-architecture--design-principles)
- [Week 7 — Mini React Complete](#week-7--mini-react-complete)
- [Week 8 — TypeScript Fundamentals](#week-8--typescript-fundamentals)
- [Week 9 — Redux Pattern + Zustand](#week-9--redux-pattern--zustand)
- [Week 10-11 — Next.js](#week-10-11--nextjs)
- [Week 12 — Full Stack Project](#week-12--full-stack-project)

---

## Current Status

```
✅ useState mechanism          hooks linked list, queue, batching, closure
✅ useReducer                  same as useState with reducer function
✅ fiber structure             memoizedState, hook linked list per fiber
✅ reconciliation              key vs index, type change,  state drift
✅ mini React runtime          createElement, renderToDom, multi-component, key
✅ React 4-layer architecture  react / reconciler / renderer separation
✅ dispatcher pattern          dynamic dispatch, why it exists
✅ scheduler concept           microtask, batching boundary
```

---

## The Big Picture

```
Week 1-3     React fundamentals — render mechanism, state, hooks, mini React
Week 4-7     React deep — effects, performance, architecture, full mini React
Week 8       TypeScript — enough to write real code without any everywhere
Week 9       Redux pattern + Zustand — read any codebase, use modern tools
Week 10-11   Next.js — SSR, App Router, server components
Week 12      Full stack project — deploy something real
```

---

## Week 1 — React Render Mechanism

### What you are learning

React renders are function executions, not DOM updates. Every render produces a snapshot of state that is frozen for that render.

```
render ≠ DOM update
render = function execution
state  = snapshot, not a live variable
```

### Key concepts

**Render vs re-render vs unmount**
```
render     component function executes and returns JSX
re-render  component updates while staying mounted — state preserved
unmount    component removed from tree — state destroyed
```

**useRef vs useState**
```
useRef     changes do not trigger re-render — good for tracking
useState   changes trigger re-render — updates UI
```

After clicking Reset in CounterPanel, the ref value becomes 0 but the display still shows the old count until the next re-render is triggered by a state change. This demonstrates that ref mutations are invisible to React.

**Component lifecycle**

Components unmount when:
- conditional rendering removes them: `{show && <Component />}`
- the key prop changes: React unmounts old instance, mounts new one
- position in component tree changes
- parent component unmounts

### Project: React Render Explorer

Components built:
- `CounterPanel` — tests render scope, only this child renders when its internal state updates
- `NormalChild` — re-renders every time parent updates, not memoized
- `MemoChild` — only re-renders when props change or internal state changes
- `TextInputPanel` — every keystroke triggers immediate re-render
- `HeavyList` — 100,000 items, demonstrates performance impact of heavy renders

### Week 1 completion checklist
- [ ] Understand render is a function call not a DOM update
- [ ] Know the difference between render, re-render, and unmount
- [ ] Understand useRef vs useState — when each causes a re-render
- [ ] Built Render Explorer with all five component types
- [ ] Observed that MemoChild unmount/remount resets all internal state

---

**Navigation:** [↑ Back to Top](#-table-of-contents) | [Next: Week 2 →](#week-2--state-snapshots-and-reconciliation)

---

## Week 2 — State, Snapshots, and Reconciliation

### What you are learning

State is a snapshot frozen at render time. Updates go into a queue on the fiber. React's reconciler uses type + key to decide whether to reuse or recreate components.

### Key concepts

**State as snapshot**
```javascript
// closure captures the snapshot from this render
setTimeout(() => {
  console.log(count)  // logs value from when setTimeout was called
}, 2000)
// even if count changes before timeout fires, old value is logged
```

**Direct value updates vs functional updates**
```javascript
// stale snapshot problem
setCount(count + 1)  // both calls use same snapshot
setCount(count - 1)  // second call does not see first update

// functional update — always gets latest value from queue
setCount(c => c + 1)
setCount(c => c - 1)  // correctly operates on updated value
```

**Fiber structure**
```
fiber {
  memoizedState → hook1 → hook2 → hook3
}

Hook {
  memoizedState   the actual state value
  next            pointer to next hook
  baseState       base state for updates
  queue           update queue for useState
}
```

**Reconciliation — key and type**

| Scenario | State preserved? | Reason |
|---|---|---|
| Same type + same key + reorder | Yes | key identifies the instance |
| Same type + index key + reorder | Partial | state stuck at position |
| Different type | No | type change = unmount/mount |
| Same type + key change | No | key change = new instance |

**State update flow**
```
1. setState — adds operation to Hook.queue.pending
2. scheduleUpdateOnFiber — tells React this fiber needs re-render
3. React schedules the update, may combine with others
4. render starts from root fiber
5. React checks each component — if no queue, skip render
6. components with queued updates re-render
```

### Experiments built
- `StateBatching` — stale snapshots vs functional updates
- `StateSnapshotClosure` — how closures capture state snapshots
- `HooksMechanism` — rules of hooks violations
- `DiffAndReconciliation` — key prop behaviour and reconciliation

### Week 2 completion checklist
- [ ] Understand state is a snapshot, not a live variable
- [ ] Know why functional updates avoid stale snapshot problems
- [ ] Understand fiber.memoizedState as a linked list of hooks
- [ ] Know type + key determines component identity
- [ ] Observed state drift with key=index vs key=id
- [ ] Understand component type change always causes unmount/remount

---

**Navigation:** [↑ Back to Top](#-table-of-contents) | [← Week 1](#week-1--react-render-mechanism) | [Next: Week 3 →](#week-3--hooks-mechanism--mini-react)

---

## Week 3 — Hooks Mechanism + Mini React

### What you are learning

Hooks are stored as a linked list per fiber. Hook order must be stable across renders. Built a complete mini React runtime that runs in the browser.

### Key concepts

**Hooks as linked list**
```
fiber.memoizedState → [hook0] → [hook1] → [hook2] → null
                       count     name      flag
```

React matches hooks by position, not by name. This is why conditional hooks break — skipping one shifts all subsequent hooks to wrong positions.

**Why conditional hooks are forbidden**
```javascript
// first render (show = true): hooks = [hook0, hook1, hook2, hook3]
// second render (show = false): hooks = [hook0, hook2, hook3]
// hook2 now reads from hook1's slot — wrong value
useState("name")
useState("age")
if (show) {
  useState("address")  // skipping this shifts everything below
}
useState("gender")     // reads "address" slot on second render
```

**scheduleRender with microtask batching**
```javascript
function scheduleRender() {
  if (!isRendering) {
    isRendering = true
    Promise.resolve().then(() => {
      queue.forEach(fn => fn())  // process all queued updates
      queue = []
      render()
      isRendering = false
    })
  }
}
```

`Promise.resolve().then()` creates a microtask that executes after all synchronous code finishes. Multiple setState calls before the microtask runs all get batched into one render.

### Mini useState versions built

**Version 1** — global state, immediate re-render
**Version 2** — hooks array with index tracking, demonstrates why conditional hooks break
**Version 3** — update queue with Promise.resolve batching
**Version 4** — browser integration with createElement and renderToDom
**Version 5** — multiple components with componentHooksMap and renderPath

### Mini React Runtime (Version 5 final)

**Component ID strategy**
```javascript
// with key — state follows the key across reorders
id = `${componentName}_key:${key}`

// without key — state follows position in tree
id = `${componentName}_pos:${renderPath.join('.')}`
```

**renderPath** tracks custom component hierarchy only — not native DOM elements. This keeps IDs stable and lean.

**currentComponent flow**
```
renderToDom encounters a function type
  → set currentComponent = id     ← BEFORE calling component function
  → set currentHook = 0
  → call component function
      → useState reads currentComponent   ← correct id already set
  → restore previous currentComponent
```

**setState closure**
```javascript
function useState(initialValue) {
  const id = currentComponent    // captured at call time
  const hookIndex = currentHook  // captured at call time

  const setState = newValue => {
    // uses closed-over id and hookIndex
    // currentComponent may be different when setState is called later
    queue.push(() => {
      hooks[hookIndex] = typeof newValue === 'function'
        ? newValue(hooks[hookIndex])
        : newValue
    })
    scheduleRender()
  }
}
```

`id` and `hookIndex` are captured immediately when useState runs. When setState is called later (on button click), these values are correct regardless of what currentComponent is at that point.

### React 4-layer architecture understood

```
layer 2    react package
           createElement, hook forwarding via dispatcher, dev warnings
           intentionally thin — 3kb gzipped

layer 3    reconciler (inside react-dom)
           fiber tree, scheduler, diff/reconcile, commit
           platform independent — the brain of React

layer 4    renderer (react-dom for web, react-native for mobile)
           translates PLACEMENT/UPDATE/DELETION tags into real DOM calls
           your renderToDom is a custom renderer

dispatcher pattern
           useState in layer 2 is 4 lines — just reads current dispatcher
           reconciler sets dispatcher before calling your component
           different dispatchers for mount/update/dev/server/outside-render
```

### Week 3 completion checklist
- [ ] Understand hooks are a linked list stored per fiber
- [ ] Know why hook order must be stable across renders
- [ ] Built mini useState with queue, batching, closure
- [ ] Built mini React runtime running in the browser
- [ ] Implemented multi-component support with componentHooksMap
- [ ] Implemented key mechanism — state follows key not position
- [ ] Understand React 4-layer architecture
- [ ] Understand why dispatcher is dynamic, not hardcoded

---

**Navigation:** [↑ Back to Top](#-table-of-contents) | [← Week 2](#week-2--state-snapshots-and-reconciliation) | [Next: Week 4 →](#week-4--effects-and-render-timing)

---

## Week 4 — Effects and Render Timing

### What you are learning

The complete chain from setState to useEffect cleanup, and where each hook fits in that chain.

```
setState
  → update queued on fiber
  → scheduler batches
  → render phase: run component functions
  → reconciliation: diff old vs new fiber tree
  → commit phase: patch real DOM
  → useLayoutEffect runs (sync, before paint)
  → browser paints
  → useEffect runs (async, after paint)
```

### Hooks this week

**useEffect**
- runs after browser paint
- deps array controls when it runs
- cleanup runs before next effect or on unmount
- use for: data fetching, subscriptions, timers

**useRef**
- stores a value that persists across renders
- changing `.current` does NOT trigger re-render
- this is the only difference from useState
- use for: DOM references, storing previous values, timers

```javascript
// useState vs useRef — the core difference
const [count, setCount] = useState(0)
// setCount(1) → triggers re-render

const ref = useRef(0)
// ref.current = 1 → nothing happens, no re-render
```

### Experiments

**Experiment 1: basic order**
```javascript
function App() {
  const [count, setCount] = useState(0)

  console.log('1. render', count)

  useLayoutEffect(() => {
    console.log('2. layoutEffect', count)
    return () => console.log('2. layoutEffect cleanup', count)
  })

  useEffect(() => {
    console.log('3. effect', count)
    return () => console.log('3. effect cleanup', count)
  })

  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

First load output:
```
1. render 0
2. layoutEffect 0
3. effect 0
```

After click:
```
1. render 1
2. layoutEffect cleanup 0   ← old count, previous render's closure
2. layoutEffect 1
3. effect cleanup 0         ← same, old count
3. effect 1
```

Key insight: cleanup always receives the value from the previous render because it is that render's closure.

**Experiment 2: deps array**
```javascript
useEffect(() => { console.log('no deps: every render') })
useEffect(() => { console.log('empty deps: mount only') }, [])
useEffect(() => { console.log('count changed', count) }, [count])
useEffect(() => { console.log('name changed', name) }, [name])
```

**Experiment 3: unmount cleanup**
```javascript
function Child() {
  useEffect(() => {
    console.log('mounted')
    return () => console.log('unmounted')
  }, [])
  return <div>Child</div>
}

function App() {
  const [show, setShow] = useState(true)
  return (
    <div>
      <button onClick={() => setShow(s => !s)}>toggle</button>
      {show && <Child />}
    </div>
  )
}
```

**Experiment 4: useLayoutEffect vs useEffect**
```javascript
useLayoutEffect(() => {
  // DOM updated, browser has NOT painted yet
  // read DOM dimensions here — accurate, no flicker
  console.log('width:', ref.current.offsetWidth)
})

useEffect(() => {
  // browser already painted
  // modifying DOM here causes visible flicker
  console.log('width:', ref.current.offsetWidth)
})
```

Rule: use `useEffect` for almost everything. Use `useLayoutEffect` only when you need to read or modify DOM before the user sees it.

**Experiment 5: useRef in practice**
```javascript
function Timer() {
  const [count, setCount] = useState(0)
  const timerRef = useRef(null)

  const start = () => {
    timerRef.current = setInterval(() => {
      setCount(c => c + 1)
    }, 1000)
  }

  const stop = () => {
    clearInterval(timerRef.current)  // ref persists across renders
  }

  useEffect(() => {
    return () => clearInterval(timerRef.current)  // cleanup on unmount
  }, [])

  return (
    <div>
      <p>{count}</p>
      <button onClick={start}>start</button>
      <button onClick={stop}>stop</button>
    </div>
  )
}
```

### Week 4 completion checklist
- [ ] Can explain why cleanup receives old state value
- [ ] Know the difference between empty deps `[]` and no deps
- [ ] Know when `useLayoutEffect` is needed over `useEffect`
- [ ] Can describe the full setState → DOM → effect chain in order
- [ ] Understand why useRef does not trigger re-renders

---

**Navigation:** [↑ Back to Top](#-table-of-contents) | [← Week 3](#week-3--hooks-mechanism--mini-react) | [Next: Week 5 →](#week-5--scheduler--performance)

---

## Week 5 — Scheduler + Performance

### What you are learning

How React decides when to render, and how to skip renders that are not needed.

Order matters: understand scheduler first, then memo. You need to know when renders happen before you can understand what memo is skipping.

### Hooks this week

**useMemo**
- caches the result of a computation
- only recomputes when deps change
- use for: expensive calculations, stable object references

**useCallback**
- caches a function reference
- exactly `useMemo(() => fn, deps)`
- use for: passing stable callbacks to memoized children

```javascript
// useMemo and useCallback are the same thing
const value = useMemo(() => expensiveCalc(x), [x])
const fn    = useMemo(() => () => doSomething(x), [x])
const fn    = useCallback(() => doSomething(x), [x])  // same as above
```

### Experiments

**Experiment 1: batching boundaries**
```javascript
function App() {
  const [a, setA] = useState(0)
  const [b, setB] = useState(0)
  console.log('render', a, b)

  return (
    <div>
      <button onClick={() => { setA(a + 1); setB(b + 1) }}>
        same handler — how many renders?
      </button>
      <button onClick={() => {
        setTimeout(() => { setA(a + 1); setB(b + 1) }, 0)
      }}>
        setTimeout — how many renders?
      </button>
      <button onClick={() => {
        Promise.resolve().then(() => { setA(a + 1); setB(b + 1) })
      }}>
        Promise — how many renders?
      </button>
      <button onClick={() => {
        flushSync(() => setA(a + 1))
        flushSync(() => setB(b + 1))
      }}>
        flushSync — how many renders?
      </button>
    </div>
  )
}
```

React 18 answers:
```
same handler  → 1 render   auto batch
setTimeout    → 1 render   React 18 auto batch (React 17 was 2)
Promise       → 1 render   React 18 auto batch (React 17 was 2)
flushSync     → 2 renders  forces immediate render, bypasses batch
```

**Experiment 2: setState is not immediate**
```javascript
<button onClick={() => {
  console.log('before setState, count =', count)
  setCount(c => c + 1)
  console.log('after setState, count =', count)  // still old value
}}>
```

Output:
```
before setState, count = 0
after setState, count = 0    ← setState did not update immediately
render 1                     ← render happens after sync code
```

**Experiment 3: wasted renders without memo**
```javascript
function Child({ name }) {
  console.log('Child render:', name)
  return <div>{name}</div>
}

function App() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>count: {count}</button>
      <Child name="fixed" />  {/* props never change but still renders */}
    </div>
  )
}
```

**Experiment 4: memo skips wasted renders**
```javascript
const Child = React.memo(function Child({ name }) {
  console.log('Child render:', name)
  return <div>{name}</div>
})
// now Child only renders when name actually changes
```

**Experiment 5: memo fails with inline functions**
```javascript
function App() {
  const [count, setCount] = useState(0)
  const handleClick = () => console.log('clicked')  // new reference every render

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <MemoChild onClick={handleClick} />  {/* memo is useless — props always change */}
    </div>
  )
}
```

Fix with useCallback:
```javascript
const handleClick = useCallback(() => {
  console.log('clicked')
}, [])  // stable reference — memo works now
```

**Experiment 6: useMemo for expensive calculations**
```javascript
const filtered = useMemo(
  () => items.filter(i => i.startsWith(filter)),
  [filter]  // only recomputes when filter changes, not on every render
)
```

### Week 5 completion checklist
- [ ] Know React 18 batching behaviour for all four cases
- [ ] Can explain why count is stale immediately after setCount
- [ ] Know the three ways memo can fail: inline fn, inline obj, inline array
- [ ] Know when to use useCallback vs useMemo
- [ ] Can answer: when should you NOT add memo?

---

**Navigation:** [↑ Back to Top](#-table-of-contents) | [← Week 4](#week-4--effects-and-render-timing) | [Next: Week 6 →](#week-6--state-architecture--design-principles)

---

## Week 6 — State Architecture + Design Principles

### What you are learning

Where state should live, how data should flow, and why React is designed the way it is.

This week is learned by building wrong first, then fixing it. Do not start with the correct answer — start with the naive approach and feel the pain.

### Hooks this week

**useContext**
- reads a value from a Provider anywhere in the tree
- avoids prop drilling through many layers
- every consumer re-renders when context value changes
- this is why context is not a performance tool

```javascript
const ThemeContext = createContext('light')

function App() {
  const [theme, setTheme] = useState('light')
  return (
    <ThemeContext.Provider value={theme}>
      <DeepChild />  {/* can read theme without props */}
    </ThemeContext.Provider>
  )
}

function DeepChild() {
  const theme = useContext(ThemeContext)  // reads directly
  return <div className={theme}>hello</div>
}
```

### State architecture rules

**Rule 1: state lives in the lowest common ancestor**
```
if component A and B both need the same state
→ put the state in their closest shared parent
→ pass down via props
```

**Rule 2: co-locate state with the component that uses it**
```
if only one component needs the state
→ put it in that component
→ do not lift it unnecessarily
→ lifting causes more re-renders
```

**Rule 3: context is for convenience, not performance**
```
context solves:   prop drilling (passing through many layers)
context does not: prevent re-renders
                  every consumer re-renders when value changes
                  use memo + context together for performance
```

**Rule 4: derive instead of duplicate**
```javascript
// bad — two pieces of state that must stay in sync
const [items, setItems] = useState([...])
const [count, setCount] = useState(0)  // must remember to update both

// good — derive count from items
const [items, setItems] = useState([...])
const count = items.length  // always correct, no sync needed
```

### Project: todo app (architecture focus)

Do NOT start coding immediately. Answer these questions first:

```
what are all the pieces of state?
where does each piece live?
which components read each piece?
which components update each piece?
what are the data flow paths?
```

Minimum features:
- add todo
- toggle complete
- filter by all / active / completed
- delete todo

The UI does not matter. No styling. The goal is making correct state decisions.

### Design principles to understand this week

Every React behaviour traces back to one of these:

```
UI = f(state)
  render is a pure function of state
  same state always gives same output
  → you cannot mutate state directly

render and commit are separate phases
  calculate what changed first (render)
  then apply to DOM in one pass (commit)
  → render can be paused, commit cannot

hooks rely on call order
  no hook names, just position in linked list
  → no hooks in conditions or loops

identity = type + key
  React tracks which instance owns which state
  → wrong key = state drift, key change = full remount

React controls render timing
  you request updates, React decides when to apply
  → setState is async, batching is free

renderer is pluggable
  reconciler knows nothing about DOM specifically
  → same React for web, native, canvas
```

### Week 6 completion checklist
- [ ] Can answer "where does this state live and why" for any tree
- [ ] Built todo app with deliberate state design
- [ ] Understand why context causes re-renders
- [ ] Can explain all six design principles from memory
- [ ] Know when to lift state vs when to use context

---

**Navigation:** [↑ Back to Top](#-table-of-contents) | [← Week 5](#week-5--scheduler--performance) | [Next: Week 7 →](#week-7--mini-react-complete)

---

## Week 7 — Mini React Complete

### What you are building

Your existing mini React from Week 6 of the React deep learning:

```javascript
// current — naive
root.innerHTML = ''
root.appendChild(renderToDom(vdom))
```

Gets replaced with:

```javascript
// week 4 — proper
reconcile(currentFiber, newVdom)  // diff and patch only what changed
commitEffects()                    // run effects at correct time
```

### Features your mini React will support

```
✅ createElement              already built
✅ useState                   already built
✅ multi-component + key      already built
✅ useRef                     add this week — useState without re-render
✅ useEffect with deps        add this week — timing and cleanup
✅ useMemo                    add this week — cache with deps comparison
✅ useCallback                add this week — useMemo returning a function
✅ useContext                 add this week — global context map
✅ fiber tree with links      add this week — parent/child/sibling
✅ real diff algorithm        add this week — replace innerHTML
✅ React.memo equivalent      add this week — skip render by props
```

### Features NOT in scope

```
❌ concurrent mode     requires priority lanes
❌ Suspense            depends on concurrent mode
❌ server rendering    completely different architecture
❌ error boundaries    out of scope for this implementation
```

### Implementation order

```
step 1    fiber tree
          replace vdom plain objects with fiber nodes
          add parent, child, sibling, alternate, flags, hooks fields

step 2    real diff
          replace root.innerHTML = '' with reconcile function
          tag fibers: PLACEMENT / UPDATE / DELETION
          only touch DOM nodes that actually changed

step 3    useRef
          hook node that stores { current: value }
          no queue, no scheduleRender call

step 4    useEffect with deps
          store { cleanup, deps } in hook node
          run after DOM update
          compare deps with previous to decide whether to run

step 5    useMemo and useCallback
          store { value, deps } in hook node
          recompute only when deps change
          useCallback is useMemo returning the function itself

step 6    useContext
          does NOT use hook linked list for storage
          reads from a global context Map
          Provider component writes into that Map before rendering children

step 7    React.memo equivalent
          wrap component function
          compare prev and next props shallowly
          skip calling the function if props unchanged
```

### Verification

Your mini React is complete when it passes these tests:

```
state drift experiment      reverse a list without key — state drifts
                            add key — state follows the item

batching experiment         two setStates in one handler — one render
                            two setStates in setTimeout — one render

useEffect timing            console logs appear in correct order
                            cleanup runs before next effect

useEffect deps              empty deps runs once on mount
                            value deps runs only when value changes

useMemo                     computation skipped when deps unchanged
                            computation runs when deps change

useCallback                 same function reference across renders
                            memo child does not re-render unnecessarily

useContext                  deep child reads context without props
                            all consumers re-render when value changes

memo equivalent             child skips render when props unchanged
                            child renders when props change
```

### Week 7 completion checklist
- [ ] Fiber tree implemented with parent / child / sibling / alternate links
- [ ] Real diff implemented — no more innerHTML reset
- [ ] useRef implemented — no re-render on mutation
- [ ] useEffect has working deps array and cleanup
- [ ] useMemo and useCallback implemented
- [ ] useContext reads from global context map
- [ ] memo equivalent implemented
- [ ] All verification tests pass

---

**Navigation:** [↑ Back to Top](#-table-of-contents) | [← Week 6](#week-6--state-architecture--design-principles) | [Next: Week 8 →](#week-8--typescript-fundamentals)

---

## Week 8 — TypeScript Fundamentals

### What you are learning

Enough TypeScript to write real React code without using `any` everywhere and to read real codebases confidently.

### Core concepts

**Basic types**
```typescript
const name: string = 'Alice'
const count: number = 0
const active: boolean = true
const items: string[] = ['a', 'b', 'c']
```

**Interfaces and types**
```typescript
interface User {
  id: number
  name: string
  email: string
  role?: string  // optional
}

type Status = 'loading' | 'success' | 'error'  // union type
```

**Generics**
```typescript
function useState<T>(initial: T): [T, (value: T) => void]

// the T is whatever type you pass in
const [count, setCount] = useState<number>(0)
const [name, setName] = useState<string>('Alice')
```

**React + TypeScript**
```typescript
interface Props {
  label: string
  count: number
  onClick: () => void
  children?: React.ReactNode
}

function Counter({ label, count, onClick }: Props) {
  return (
    <div>
      <span>{label}: {count}</span>
      <button onClick={onClick}>+1</button>
    </div>
  )
}
```

**Discriminated unions — the most useful pattern**
```typescript
type Result =
  | { status: 'loading' }
  | { status: 'success', data: User[] }
  | { status: 'error', message: string }

// TypeScript knows exactly what is available in each branch
if (result.status === 'success') {
  console.log(result.data)    // TypeScript knows data exists here
  console.log(result.message) // TypeScript error — message not on success
}
```

**Utility types**
```typescript
Partial<User>          // all fields optional
Required<User>         // all fields required
Pick<User, 'id'|'name'>  // only id and name
Omit<User, 'email'>    // everything except email
ReturnType<typeof fn>  // type of what fn returns
```

### Project: add TypeScript to your todo app from Week 6

Type everything:
- props interfaces for every component
- state shape as an interface
- union types for status values
- generic hooks

### Week 8 completion checklist
- [ ] Can write interfaces and type aliases
- [ ] Understand generics well enough to read library types
- [ ] Know discriminated unions and why they are useful
- [ ] Have typed the Week 6 todo app completely
- [ ] Can read TypeScript errors and understand what they mean
- [ ] Zero `any` types in your code

---

**Navigation:** [↑ Back to Top](#-table-of-contents) | [← Week 7](#week-7--mini-react-complete) | [Next: Week 9 →](#week-9--redux-pattern--zustand)

---

## Week 9 — Redux Pattern + Zustand

### What you are learning

Redux teaches the pattern. Zustand is what you will use in real projects. Learn Redux to understand the pattern, use Zustand for everything new.

### The Redux pattern (first half of week)

Three concepts:

```
store      single source of truth for all app state
action     plain object describing what happened
           { type: 'INCREMENT', payload: 1 }
reducer    pure function: (state, action) → newState
           same as useReducer but for global state
```

```javascript
// reducer — pure function, no side effects
function counterReducer(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT': return state + 1
    case 'DECREMENT': return state - 1
    case 'RESET':     return 0
    default:          return state
  }
}

// dispatch sends actions
dispatch({ type: 'INCREMENT' })
```

Why Redux uses this pattern:
```
predictable    same action always produces same state change
debuggable     every state change is an action you can log
time travel    record actions, replay them, step backwards
```

Use Redux Toolkit in any real Redux project — it removes 80% of the boilerplate.

### Zustand (second half of week)

Same pattern, much simpler API. This is what you will actually use.

```javascript
import { create } from 'zustand'

const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 })
}))

// in any component — no Provider needed
function Counter() {
  const { count, increment } = useCounterStore()
  return <button onClick={increment}>{count}</button>
}
```

When to use Zustand vs useState vs useContext:

```
useState      local component state, not shared
useContext    shared state, changes infrequently
              theme, current user, language
Zustand       shared state, changes frequently
              cart, notifications, UI state across many components
              anything that causes context performance problems
```

### Project: add Zustand to your todo app

Replace local state with a Zustand store. Add a feature that needs global state — for example a notification system that shows when a todo is completed.

### Week 9 completion checklist
- [ ] Understand store / action / reducer pattern
- [ ] Can read a Redux codebase and understand what is happening
- [ ] Have built something with Zustand
- [ ] Know when to reach for Zustand vs useState vs useContext
- [ ] Know Redux Toolkit exists and reduces Redux boilerplate

---

**Navigation:** [↑ Back to Top](#-table-of-contents) | [← Week 8](#week-8--typescript-fundamentals) | [Next: Week 10-11 →](#week-10-11--nextjs)

---

## Week 10-11 — Next.js

### What you are learning

How to build a complete web application with routing, server-side rendering, and data fetching. This is where frontend and backend thinking begin to connect.

### Week 10: fundamentals

**App Router structure**
```
app/
  layout.tsx         root layout, wraps every page
  page.tsx           home page /
  about/
    page.tsx         /about
  users/
    page.tsx         /users
    [id]/
      page.tsx       /users/123
```

**Server vs client components**
```typescript
// server component (default) — runs on server
// can fetch data directly, cannot use useState or useEffect
async function UserList() {
  const users = await fetch('https://api.example.com/users')
  const data = await users.json()
  return <ul>{data.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}

// client component — runs in browser
// can use useState, useEffect, event handlers
'use client'
function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

**Data fetching patterns**
```typescript
// SSR — fetches on every request
async function Page() {
  const data = await fetchData()  // runs on server
  return <Component data={data} />
}

// SSG — fetches once at build time
export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }]
}
```

### Week 11: data fetching + API routes

**API routes**
```typescript
// app/api/users/route.ts
export async function GET() {
  const users = await db.query('SELECT * FROM users')
  return Response.json(users)
}

export async function POST(request: Request) {
  const body = await request.json()
  const user = await db.create(body)
  return Response.json(user, { status: 201 })
}
```

This is your first real backend code. API routes run on the server, can connect to databases, and are never exposed to the browser.

**Understanding SSR vs SSG vs ISR**
```
SSR    render on every request
       always fresh data
       slower — server work per request
       use for: user-specific pages, real-time data

SSG    render once at build time
       fastest — just static files
       stale until next build
       use for: blog posts, marketing pages, docs

ISR    regenerate in background after set time
       fast like SSG, fresher than SSG
       use for: product pages, news, anything that changes occasionally
```

### Project: add AI feature to your Next.js app

Build a GitHub repository explorer with one AI feature:

```
search GitHub users via GitHub API
show their repositories
filter by language, sort by stars

AI feature: when you click a repo
  send the README to Claude or OpenAI API
  stream back a one-paragraph plain English summary
  user sees the summary without reading the README
```

This teaches you:
- how to call an LLM API from Next.js
- streaming responses to the browser
- keeping API keys secure on the server side
- the complete flow of a real AI feature

### Week 10-11 completion checklist
- [ ] Understand the difference between server and client components
- [ ] Know when to use SSR vs SSG vs ISR
- [ ] Have built API routes that run server-side logic
- [ ] Understand how API routes connect to a database or external API
- [ ] Have added at least one AI feature
- [ ] Know how to keep API keys secure

---

**Navigation:** [↑ Back to Top](#-table-of-contents) | [← Week 9](#week-9--redux-pattern--zustand) | [Next: Week 12 →](#week-12--full-stack-project)

---

## Week 12 — Full Stack Project

### What this week is

Not a learning week. A consolidation week. You are proving that everything from Weeks 4-11 works together in something real.

### What you build

A complete web application:

```
frontend     Next.js + TypeScript + Zustand
data         GitHub API (no backend needed yet)
AI feature   LLM summarisation or search
deployment   live on the internet via Vercel
```

### Rules for this week

```
no tutorials          design state yourself before coding
every useState        ask: should this be state or derived value?
every useEffect       ask: what does this sync, what does cleanup do?
every Zustand store   ask: why can't this be local state?
end of week           open React DevTools Profiler
                      find one unnecessary render
                      fix it
```

### What you will encounter that prepares you for backend

```
problem 1    API returns more data than you need
             you learn to shape data at the boundary
             this is exactly what a backend does for clients

problem 2    loading, error, and empty states
             every UI state must be handled explicitly
             backend has the same problem with every response

problem 3    API rate limits
             you think about caching for the first time
             this is why backends cache data

problem 4    you want a feature the public API does not support
             you hit the wall of needing your own backend
             this is the natural entry point to Python learning
```

Problem 4 is the most important. By end of Week 12 you will have a specific, concrete reason to want a backend — not because someone told you to, but because your project needs it.

### Deployment

```
1. push code to GitHub
2. connect repo to Vercel (vercel.com)
3. Vercel builds and deploys automatically
4. live URL in about 2 minutes
```

### Week 12 completion checklist
- [ ] Project is deployed and accessible via a public URL
- [ ] Can explain every useState decision — why that component, why that shape
- [ ] Can explain every useEffect — what it syncs, what cleanup does
- [ ] Found and fixed at least one wasted render using DevTools Profiler
- [ ] Can describe the full data flow of the app in two sentences
- [ ] Hit at least one limitation of using only a public API

---

**Navigation:** [↑ Back to Top](#-table-of-contents) | [← Week 10-11](#week-10-11--nextjs)

---

## Summary

| Week | Focus | Done when |
|---|---|---|
| 1 | React render mechanism | understand render ≠ DOM update, build Render Explorer |
| 2 | State snapshots and reconciliation | know state is frozen per render, key + type determines identity |
| 3 | Hooks mechanism + mini React | build complete mini React with useState, key support, batching |
| 4 | useEffect, useRef, render → commit chain | can trace setState to effect cleanup in order |
| 5 | useMemo, useCallback, memo, scheduler | can explain why memo fails with inline functions |
| 6 | useContext, state architecture, design principles | can answer where state lives and why for any tree |
| 7 | mini React complete | all Week 4 + 5 experiments pass against your implementation |
| 8 | TypeScript fundamentals | zero any types, can read library type definitions |
| 9 | Redux pattern + Zustand | can read any Redux codebase, use Zustand for new projects |
| 10-11 | Next.js App Router + data fetching | understand SSR vs SSG, server vs client components |
| 12 | full stack project deployed | live URL, every hook decision explainable |

---

## What Comes After

```
month 4-5    Python + FastAPI + Auth + PostgreSQL
month 6      Async + Redis + Message Queues + Testing
month 7      Docker + AWS deployment
month 8      Terraform + Kubernetes basics
month 9      AI application layer — LangChain, RAG, vector search

Side project  Personal AI secretary (build progressively)
  end week 12  prototype: Next.js + OpenAI + basic storage
  end month 5  proper database, auth, search
  end month 8  semantic search with pgvector
               voice input via Whisper API
               find anything with a rough description
```

---

**Navigation:** [↑ Back to Top](#-table-of-contents)
