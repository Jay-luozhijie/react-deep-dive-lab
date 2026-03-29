import { memo, useRef } from 'react'
function MemoChild({ label }: { label?: string }) {
    console.log('MemoChild render')
    const count = useRef(0)
    count.current += 1
    
    return (
        <div className="bg-white border border-gray-200 rounded p-3 min-w-[200px]">
            <h2 className="text-xs font-medium text-gray-600 mb-1">Memo Child</h2>
            <p className="text-2xl font-bold text-gray-900">{count.current}</p>
            {label && <p className="text-xs text-gray-500 mt-1">Label: {label}</p>}
        </div>
    )
}

export default memo(MemoChild)