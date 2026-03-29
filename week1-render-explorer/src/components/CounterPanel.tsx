import { useCallback, useRef, useState } from 'react'

export default function CounterPanel() {
    console.log('CounterPanel render')
    const [countState, setCountState] = useState(0)
    const count = useRef(0)
    count.current += 1

    const localReset = useCallback(() => {
        count.current = 0
        setCountState(0)
    }, [])


    return (
        <div className="bg-white border border-gray-200 rounded p-3 min-w-[200px]">
            <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                    <h2 className="text-xs font-medium text-gray-600 mb-1">Render Counter</h2>
                    <p className="text-2xl font-bold text-gray-900">{count.current}</p>
                </div>

                <div>
                    <h2 className="text-xs font-medium text-gray-600 mb-1">State Counter</h2>
                    <p className="text-2xl font-bold text-gray-900">{countState}</p>
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => setCountState(prev => prev + 1)}
                    className="flex-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Update State
                </button>

                <button
                    onClick={localReset}
                    className="flex-1 px-3 py-1.5 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                    Reset Local
                </button>
            </div>
        </div>
    )
}