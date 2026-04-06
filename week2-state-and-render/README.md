# Week 2: State and Render

This week focuses on React's state management flow:  
**State → Snapshot → Update Queue → Render → Diff → Commit**

## Phase 1: State Snapshots and Closures

### Key Concepts

After each React render, a **snapshot** of state values is stored in the fiber. When you reference a state variable in your code, you're reading the value from that specific render's snapshot.

### Example: setTimeout Captures a Snapshot

```javascript
setTimeout(() => {
  console.log(count)  // Logs the value from when setTimeout was called
}, 2000)
```

Even if `count` changes before the timeout fires, the console will log the **old value** because the closure captured the state snapshot from that render.

### Direct Value Updates (Stale Snapshots)

```javascript
setCount(count + 1)
await wait(2000)
setCount(count - 1)
```

**Problem**: Both `setCount` calls use the same `count` snapshot. The second call doesn't see the first update.  
**Result**: `count - 1` operates on the original value, not the updated one.

### Functional Updates (Latest Value)

```javascript
setCount(c => c + 1)
await wait(2000)
setCount(c => c - 1)
```

**Solution**: Functional updates receive the **latest state** from React's update queue.  
**Result**: The second update correctly operates on the new value from the first update.

---

## Phase 2: Update Queue

React batches state updates by adding them to an **update queue** stored in the fiber.

### Fiber Structure

```
fiber {
  memoizedState → hook1 → hook2 → hook3
}
```

`fiber.memoizedState` is a **pointer** to the first hook in a linked list.

### Hook Structure

```
Hook {
  memoizedState   // The actual state value
  next            // Pointer to next hook
  baseState       // Base state for updates
  queue           // Update queue (for useState)
}
```

---

## Phase 3: Hooks Mechanism

### How Hooks Are Stored

All hooks (`useState`, `useEffect`, `useMemo`, etc.) are stored in a **single linked list** per component fiber. Each hook has the same basic structure, but different hook types use different properties (e.g., `queue` for `useState`).

The hook **type** is determined by which function calls it (`useState` vs `useEffect`), not by the data structure itself.

### Rules of Hooks

Hooks **must** be called in the same order on every render because React relies on call order to match each hook to its stored state.

### ❌ Conditional Hooks Are Forbidden

```javascript
useState("name")
useState("age")
if (show) {
  useState("address")  // ❌ WRONG: Conditional hook call
}
useState("gender")
```

**When `show = true`:**  
Linked list: `name → age → address → gender` (4 hooks)

**When `show = false`:**  
React expects 4 hooks but only finds 3.  
Hook positions get mismatched → **Error**: "Rendered fewer hooks than expected"

### Why It Breaks

React assigns hook values **by position** in the linked list:
- 1st call gets 1st value
- 2nd call gets 2nd value
- 3rd call gets 3rd value...

If you skip a hook, all subsequent hooks get the **wrong values**.

---

## Phase 4: Diff and Reconciliation

React determines whether to **reuse** or **recreate** a component by checking:
1. **Component type** (same type = reuse)
2. **Key prop** (helps identify which specific instance)

### Experiment 1: List Reordering with Keys

#### Setup
```javascript
const [list, setList] = useState([
  { id: 1, name: "A" },
  { id: 2, name: "B" },
  { id: 3, name: "C" }
])
```

Each `Item` component has its own `count` state.

#### Case 1: Proper Keys (`key={item.id}`)

```jsx
{list.map(item => (
  <Item key={item.id} item={item} />
))}
```

**Before reverse:**
```
A - Count: 1
B - Count: 2
C - Count: 3
```

**After reverse:**
```
C - Count: 3  ← State follows the item!
B - Count: 2
A - Count: 1
```

**Why**: React uses the `id` to identify each component instance. When item `id: 1` moves, its state moves with it.

#### Case 2: Index Keys (`key={index}`)

```jsx
{list.map((item, index) => (
  <Item key={index} item={item} />
))}
```

**Before reverse:**
```
A - Count: 1
B - Count: 2
C - Count: 3
```

**After reverse:**
```
C - Count: 1  ← State stays at position!
B - Count: 2
A - Count: 3
```

**Why**: React identifies components by position (index 0, 1, 2). When the list reverses:
- Position 0 still has count `1`, but now shows "C"
- Position 1 still has count `2`, but now shows "B"
- Position 2 still has count `3`, but now shows "A"

The **state stays with the position**, not the data.

---

### Experiment 2: Component Type Switching

```jsx
{show ? <A /> : <B />}
```

**Question**: Will state be preserved when toggling?  
**Answer**: **No**

**Why**: React sees the component **type changed** (A → B), so it:
1. **Unmounts** component A (destroys its state)
2. **Mounts** component B (creates new state)

Even if both have the same key, different types always cause unmount/remount.

---

### Experiment 3: Changing Keys on Same Type

```jsx
<A key={key} />  // key toggles between 0 and 1
```

**Question**: Will state be preserved when the key changes?  
**Answer**: **No**

**Why**: When the key changes, React sees it as a **different instance**:
1. Looks for `key=1` in the old fiber → not found
2. **Unmounts** the old instance with `key=0`
3. **Mounts** a new instance with `key=1`

Even though the component type is the same, a **key change forces a fresh mount**.

---

## Summary

| Scenario | State Preserved? | Reason |
|----------|-----------------|--------|
| Same type + same key + reorder | ✅ Yes | Key identifies the instance |
| Same type + index key + reorder | ❌ Partial | State stuck at position |
| Different type | ❌ No | Type change = unmount/mount |
| Same type + key change | ❌ No | Key change = new instance |

---

## Components

- **StateBatching**: Demonstrates stale snapshots vs functional updates
- **StateSnapshotClosure**: Shows how closures capture state snapshots
- **HooksMechanism**: Demonstrates Rules of Hooks violations
- **DiffAndReconciliation**: Key prop behavior and reconciliation logic