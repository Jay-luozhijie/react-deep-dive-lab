import { useState } from 'react'

export default function AsyncBatching() {
  const [count, setCount] = useState(0)

  const handleClick = async () => {
    setCount(c => c + 1)
    setCount(c => c + 1)

    await new Promise(r => setTimeout(r, 2000))

    setCount(count - 1)
  }

  console.log("render:", count)

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Async Batching
          </h1>
          <p className="text-sm text-gray-600">
            Mixing functional updates with async and stale closures
          </p>
        </div>

        {/* Counter Display */}
        <div className="bg-white border border-gray-200 rounded p-6 mb-8">
          <p className="text-xs text-gray-500 mb-1">Count</p>
          <div className="text-6xl font-bold text-gray-900">
            {count}
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6 text-left">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            📋 What Happens
          </h3>
          <div className="text-xs text-blue-800 space-y-2">
            <p className="font-semibold">Click the button and observe:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li><code>setCount(c =&gt; c + 1)</code> × 2 → Count increases by 2</li>
              <li>Wait 2 seconds...</li>
              <li><code>setCount(count - 1)</code> → Uses stale closure value!</li>
            </ol>
          </div>
        </div>

        {/* Experiment */}
        <div className="bg-white border border-gray-200 rounded p-4 mb-6 text-left">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Experiment
          </h3>
          <button 
            onClick={handleClick}
            className="w-full px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 text-lg font-bold rounded text-left"
          >
            Click Me
          </button>
          <p className="mt-3 text-xs text-gray-600">
            Check console for render logs
          </p>
        </div>

        {/* Visual Explanation */}
        <div className="bg-white border border-gray-200 rounded p-4 text-left">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Step-by-Step Breakdown
          </h3>
          <div className="space-y-3 text-xs">
            <div className="bg-gray-50 p-3 rounded">
              <p className="font-semibold text-gray-900 mb-2">Initial: count = 0</p>
              <div className="space-y-1 text-gray-700 font-mono text-xs">
                <div>1. setCount(c =&gt; c + 1) → Queue: 0 + 1 = 1</div>
                <div>2. setCount(c =&gt; c + 1) → Queue: 1 + 1 = 2</div>
                <div className="text-purple-700">→ Batched: count becomes 2</div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded">
              <p className="font-semibold text-gray-900 mb-2">After 2 seconds:</p>
              <div className="space-y-1 text-gray-700 font-mono text-xs">
                <div className="text-red-600">3. setCount(count - 1) → Uses old count (0)</div>
                <div className="text-red-600">→ Sets count to 0 - 1 = -1</div>
              </div>
            </div>

            <p className="text-gray-600 italic mt-3">
              The async operation captures <code>count</code> from the render when it was called (0), 
              not the updated value (2)!
            </p>
          </div>
        </div>

        {/* Solution */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded p-4 text-left">
          <h3 className="text-sm font-semibold text-green-900 mb-2">
            ✅ Fix: Use Functional Update
          </h3>
          <div className="text-xs text-green-800 space-y-2">
            <p>Replace <code>setCount(count - 1)</code> with:</p>
            <code className="block bg-green-100 p-2 rounded">setCount(c =&gt; c - 1)</code>
            <p className="italic">This reads the latest value from React's queue!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
