import { useState } from 'react'

export default function HooksMechanism() {
    const [show, setShow] = useState(true)
    const [state1, setState1] = useState("Name")
    const [state2, setState2] = useState("Gender")
    
    // ⚠️ INTENTIONAL ERROR: Conditional hook call
    if(show){
        const [state3, setState3] = useState("Age")
    }

    const [state4, setState4] = useState("Address")

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                        Hooks Mechanism
                    </h1>
                    <p className="text-sm text-gray-600">
                        Understanding React's hook linked list
                    </p>
                </div>

                {/* Explanation */}
                <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6 text-left">
                    <h3 className="text-sm font-semibold text-blue-900 mb-2">
                        ⚠️ Rules of Hooks Violation
                    </h3>
                    <div className="text-xs text-blue-800 space-y-2">
                        <p>
                            This component <strong>intentionally violates</strong> React's Rules of Hooks 
                            to demonstrate why conditional hooks are forbidden.
                        </p>
                        <p className="font-semibold">Why it breaks:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>React stores hooks in a <strong>linked list</strong></li>
                            <li>Each render, React walks through the list in <strong>order</strong></li>
                            <li>Hooks rely on <strong>call order</strong> to match state to the right hook</li>
                            <li>Conditional hooks change the order → values get <strong>mismatched</strong></li>
                        </ul>
                    </div>
                </div>

                {/* Visual Explanation */}
                <div className="bg-white border border-gray-200 rounded p-4 mb-6 text-left">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        How it breaks (linked list order)
                    </h3>
                    <div className="space-y-3 text-xs">
                        <div>
                            <p className="font-semibold text-gray-700 mb-1">When show = true:</p>
                            <div className="bg-gray-50 p-2 rounded text-xs text-gray-700 space-y-0.5 font-mono">
                                <div>Hook 0: useState(true) → show</div>
                                <div>Hook 1: useState("Name") → state1</div>
                                <div>Hook 2: useState("Gender") → state2</div>
                                <div>Hook 3: useState("Age") → state3 ✓</div>
                                <div>Hook 4: useState("Address") → state4</div>
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700 mb-1">When show = false (Hook 3 skipped):</p>
                            <div className="bg-gray-50 p-2 rounded text-xs text-gray-700 space-y-0.5 font-mono">
                                <div>Hook 0: useState(true) → show</div>
                                <div>Hook 1: useState("Name") → state1</div>
                                <div>Hook 2: useState("Gender") → state2</div>
                                <div className="text-red-600">Hook 3: ❌ MISSING</div>
                                <div className="text-red-600">Hook 4: useState("Address") → wrong value!</div>
                            </div>
                        </div>
                        <p className="text-gray-600 italic">
                            React expects 5 hooks but only finds 4 → <strong>Error!</strong> 
                            Hook 4 tries to read the wrong position in the linked list.
                        </p>
                    </div>
                </div>

                {/* Experiment */}
                <div className="bg-white border border-gray-200 rounded p-4 text-left">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        Experiment: Toggle to trigger error
                    </h3>
                    <button
                        onClick={() => setShow(prev => !prev)}
                        className="w-full px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 text-sm rounded mb-3 text-left"
                    >
                        Toggle Show (Current: {show ? "True" : "False"})
                    </button>
                    <div className="space-y-1 text-xs text-gray-700">
                        <p>State 1 (Name): {state1}</p>
                        <p>State 2 (Gender): {state2}</p>
                        <p className="text-gray-400">State 3 (Age): Conditionally rendered</p>
                        <p>State 4 (Address): {state4}</p>
                    </div>
                    <p className="mt-3 text-xs text-red-600">
                        Click toggle to see: "Rendered fewer hooks than expected"
                    </p>
                </div>

            </div>
        </div>
    )
}