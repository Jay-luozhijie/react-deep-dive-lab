import { useState, useEffect, useLayoutEffect } from "react"

export default function EffectTiming() {
  const [count, setCount] = useState(0)

  console.log("render")

  useEffect(() => {
    console.log("effect")
  })

  useLayoutEffect(() => {
    console.log("layout effect")
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Effect Timing
          </h1>
          <p className="text-sm text-gray-600">
            Understanding useEffect vs useLayoutEffect execution order
          </p>
        </div>

        {/* Explanation */}
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6 text-left">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            📋 Execution Order
          </h3>
          <div className="text-xs text-blue-800 space-y-2">
            <p className="font-semibold">Open console to see the order:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li><strong>render</strong> - Component renders</li>
              <li><strong>layout effect</strong> - useLayoutEffect runs (before paint)</li>
              <li><strong>effect</strong> - useEffect runs (after paint)</li>
            </ol>
          </div>
        </div>

        {/* Counter */}
        <div className="bg-white border border-gray-200 rounded p-4 mb-6 text-left">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Experiment
          </h3>
          <button 
            onClick={() => setCount(c => c + 1)}
            className="w-full px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 text-lg font-bold rounded text-left"
          >
            Count: {count}
          </button>
          <p className="mt-3 text-xs text-gray-600">
            Click the button and check the console for execution order
          </p>
        </div>

        {/* Key Differences */}
        <div className="bg-white border border-gray-200 rounded p-4 text-left">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Key Differences
          </h3>
          <div className="space-y-3 text-xs text-gray-700">
            <div>
              <p className="font-semibold text-purple-800">useLayoutEffect</p>
              <p>Runs synchronously <strong>before</strong> browser paint. Use for DOM measurements.</p>
            </div>
            <div>
              <p className="font-semibold text-green-800">useEffect</p>
              <p>Runs asynchronously <strong>after</strong> browser paint. Use for most side effects.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
