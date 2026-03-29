import { useRef } from "react"

export default function NormalChild() {
    console.log('NormalChild render')
    const count = useRef(0)
    count.current += 1  

    return (
        <div className="bg-white border border-gray-200 rounded p-3 min-w-[200px]">
            <h2 className="text-xs font-medium text-gray-600 mb-1">Normal Child</h2>
            <p className="text-2xl font-bold text-gray-900">{count.current}</p>
        </div>
    )
}