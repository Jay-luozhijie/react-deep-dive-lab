import { useRef, useState } from 'react'

export default function TextInputPanel() {
    console.log('TextInputPanel render')
    const renderCount = useRef(0)
    renderCount.current += 1
    const [textInput, setTextInput] = useState('')
    return (
        <div className="bg-white border border-gray-200 rounded p-3 min-w-[200px]">
            <h2 className="text-xs font-medium text-gray-600 mb-1">Text Input Panel</h2>
            <p className="text-2xl font-bold text-gray-900 mb-2">{renderCount.current}</p>
            <input
                type="text"
                placeholder="Type..."
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
            />
        </div>
    )
}