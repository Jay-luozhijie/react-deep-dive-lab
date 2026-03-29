import { useRef } from 'react'

export default function HeavyList() {
    console.log('HeavyList render')
    const items = Array.from({ length: 100000 }, (_, i) => `Item ${i + 1}`)
    const renderCount = useRef(0)
    renderCount.current += 1
    return (
        <div className="bg-white border border-gray-200 rounded p-3 min-w-[200px]">
            <h2 className="text-xs font-medium text-gray-600 mb-1">Heavy List</h2>
            <p className="text-2xl font-bold text-gray-900 mb-2">{renderCount.current}</p>
            <ul className="max-h-32 overflow-y-auto text-xs">
                {items.map((item) => (
                    <li key={item} className="py-0.5 border-b border-gray-100">
                        {item} + renderCount: {renderCount.current}
                    </li>
                ))}
            </ul>
        </div>
    )
}