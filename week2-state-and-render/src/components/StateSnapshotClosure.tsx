import { useState } from 'react'

export default function StateSnapshotClosure() {
    const [count, setCount] = useState(0)

    const increaseCount = () => {
        setCount(prev => prev + 1)
    }

    const showConsoleWithTimeout = () => {
        console.log(`📸 Snapshot: ${count}`)
        setTimeout(() => {
            console.log(`⏰ Logged: ${count}`)
        }, 4000)
    }

    const setCountWithClosure = async () => {
        setCount(count + 1)
        await new Promise(resolve => setTimeout(resolve, 2000))
        setCount(count - 1)
    }

    const setCountWithFunctionalUpdate = async () => {
        setCount(prev => prev + 1)
        await new Promise(resolve => setTimeout(resolve, 2000))
        setCount(prev => prev - 1)
    }

    const resetCount = () => {
        setCount(0)
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                        State Snapshots & Closures
                    </h1>
                    <p className="text-sm text-gray-600">
                        How React captures state values
                    </p>
                </div>

                {/* Counter */}
                <div className="bg-white border border-gray-200 rounded p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="text-4xl font-bold text-gray-900">{count}</div>
                        <div className="flex gap-2">
                            <button
                                onClick={increaseCount}
                                className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-800 text-sm rounded"
                            >
                                +1
                            </button>
                            <button
                                onClick={resetCount}
                                className="px-3 py-1.5 border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm rounded"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Experiments */}
                <div className="space-y-3">
                    {/* Experiment 1 */}
                    <div className="bg-white border border-gray-200 rounded p-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">
                            1. Console Snapshot
                        </h3>
                        <p className="text-xs text-gray-600 mb-3">
                            Click button, then increase count. Console logs the old value.
                        </p>
                        <button
                            onClick={showConsoleWithTimeout}
                            className="w-full px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm rounded mb-2 text-left"
                        >
                            <code>setTimeout(() =&gt; console.log(count), 4000)</code>
                        </button>
                        <p className="text-xs text-gray-500">
                            Closure captures <code>count</code> at creation time.
                        </p>
                    </div>

                    {/* Experiment 2 */}
                    <div className="bg-white border border-gray-200 rounded p-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">
                            2. Stale Closure
                        </h3>
                        <p className="text-xs text-gray-600 mb-3">
                            Both updates use the same snapshot. Result: count - 1.
                        </p>
                        <button
                            onClick={setCountWithClosure}
                            className="w-full px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 text-sm rounded mb-2 text-left"
                        >
                            <code>setCount(count + 1) → wait → setCount(count - 1)</code>
                        </button>
                        <p className="text-xs text-gray-500">
                            If count=5: first sets to 6, second sets to 4 (both use 5).
                        </p>
                    </div>

                    {/* Experiment 3 */}
                    <div className="bg-white border border-gray-200 rounded p-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">
                            3. Functional Update
                        </h3>
                        <p className="text-xs text-gray-600 mb-3">
                            Uses latest value each time. Returns to original count.
                        </p>
                        <button
                            onClick={setCountWithFunctionalUpdate}
                            className="w-full px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 text-sm rounded mb-2 text-left"
                        >
                            <code>setCount(prev =&gt; prev + 1) → wait → setCount(prev =&gt; prev - 1)</code>
                        </button>
                        <p className="text-xs text-gray-500">
                            Correct: uses actual current value, not snapshot.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}