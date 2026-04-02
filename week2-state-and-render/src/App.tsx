import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const handleClickWithSetValue = () => {
    setCount(count + 1)
    setCount(count + 1)
  }

  const handleClickWithFunction = () => {
    setCount((prev) => prev + 1)
    setCount((prev) => prev + 1)
  }

  const handleClickWithAsyncFunction = async () => {
    setCount(count + 1)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setCount(count + 1)
  }

  return (
    <div id="experiment">
      <h1>State Batching</h1>
      <div className="counter">{count}</div>
      <div className="actions">
        <div className="action-row">
          <button className="btn btn-stale" onClick={handleClickWithSetValue}>
            setCount(count + 1) × 2
          </button>
          <span className="desc">Both calls read the same stale snapshot — count goes up by 1</span>
        </div>
        <div className="action-row">
          <button className="btn btn-functional" onClick={handleClickWithFunction}>
            setCount(prev + 1) × 2
          </button>
          <span className="desc">Updaters chain on the latest value — count goes up by 2</span>
        </div>
        <div className="action-row">
          <button className="btn btn-async" onClick={handleClickWithAsyncFunction}>
            setCount(count + 1) → await → setCount(count + 1)
          </button>
          <span className="desc">Async function reads the stale snapshot — count goes up by 1</span>
        </div>
        <div className="action-row">
          <button className="btn btn-reset" onClick={() => setCount(0)}>Reset</button>
        </div>
      </div>
    </div>
  )
}

export default App
