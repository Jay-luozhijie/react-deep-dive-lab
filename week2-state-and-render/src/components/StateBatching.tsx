import { useState } from 'react'

function StateBatching() {
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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            State Batching
          </h1>
          <p className="text-sm text-gray-600">
            How React batches state updates
          </p>
        </div>

        {/* Counter Display */}
        <div className="bg-white border border-gray-200 rounded p-6 mb-8">
          <p className="text-xs text-gray-500 mb-1">Count</p>
          <div className="text-6xl font-bold text-gray-900">
            {count}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {/* Stale Value */}
          <div className="bg-white border border-gray-200 rounded p-4">
            <button
              onClick={handleClickWithSetValue}
              className="w-full px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 text-sm rounded mb-3"
            >
              <code>setCount(count + 1) × 2</code>
            </button>
            <p className="text-xs text-gray-600">
              Both calls read the same stale snapshot — count goes up by <strong>1</strong>
            </p>
          </div>

          {/* Functional Update */}
          <div className="bg-white border border-gray-200 rounded p-4">
            <button
              onClick={handleClickWithFunction}
              className="w-full px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 text-sm rounded mb-3"
            >
              <code>setCount(prev =&gt; prev + 1) × 2</code>
            </button>
            <p className="text-xs text-gray-600">
              Updaters chain on the latest value — count goes up by <strong>2</strong>
            </p>
          </div>

          {/* Async Function */}
          <div className="bg-white border border-gray-200 rounded p-4">
            <button
              onClick={handleClickWithAsyncFunction}
              className="w-full px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm rounded mb-3"
            >
              <code>setCount(count + 1) → await → setCount(count + 1)</code>
            </button>
            <p className="text-xs text-gray-600">
              Async function reads the stale snapshot — count goes up by <strong>1</strong> (after 1s delay)
            </p>
          </div>

          {/* Reset Button */}
          <div className="pt-2">
            <button
              onClick={() => setCount(0)}
              className="w-full px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm rounded"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StateBatching
