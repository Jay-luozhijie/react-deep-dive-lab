import { memo, useRef, useState } from 'react'
function MemoChild({ label }: { label?: string }) {
    console.log('MemoChild render')
    const count = useRef(0)
    count.current += 1
    const [internalState, setInternalState] = useState(0)
    
    return (
        <div className="bg-white border border-gray-200 rounded p-3 min-w-[200px]">
            <h2 className="text-xs font-medium text-gray-600 mb-1">Memo Child</h2>
            <p className="text-2xl font-bold text-gray-900">{count.current}</p>
            {label && <p className="text-xs text-gray-500 mt-1">Label: {label}</p>}
            <div className="mt-2">
                <p className="text-sm text-gray-700">Internal State: {internalState}</p>
                <button
                    onClick={() => setInternalState(prev => prev + 1)}
                    className="mt-1 w-full px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                    Update Internal State
                </button>
            </div>
        </div>
    )
}

export default memo(MemoChild)