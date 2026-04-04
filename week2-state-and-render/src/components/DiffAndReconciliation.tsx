import { useState } from 'react'

interface ItemType {
    name: string
    id: number
}

function Item({ item }: { item: ItemType }) {
    const [count, setCount] = useState(0)

    return (    
        <button 
            onClick={() => setCount(count + 1)}
            className="w-full px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 text-sm rounded text-left"
        >
            {item.name} - Count: {count}
        </button>
    )
}

function A() {
    const [count, setCount] = useState(0)
    return (
        <button 
            onClick={() => setCount(c => c + 1)}
            className="px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 text-sm rounded"
        >
            Component A - Count: {count}
        </button>
    )
}

function B() {
    const [count, setCount] = useState(0)
    return (
        <button 
            onClick={() => setCount(c => c + 1)}
            className="px-4 py-2 bg-pink-100 hover:bg-pink-200 text-pink-800 text-sm rounded"
        >
            Component B - Count: {count}
        </button>
    )
}


export default function DiffAndReconciliation() {
    // TODO: Add your state here
    const [list, setList] = useState<ItemType[]>([
        { id: 1, name: "A" },
        { id: 2, name: "B" },
        { id: 3, name: "C" }
    ])

    const [show, setShow] = useState(true)

    const reverseList = () => {
        setList(prev => [...prev].reverse())
    }

    const [key, setKey] = useState(0)

    const toggleKey = () => {
        setKey(prev => prev === 1 ? 0 : 1)
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                        Diff and Reconciliation
                    </h1>
                    <p className="text-sm text-gray-600">
                        Understanding React's key prop and reconciliation
                    </p>
                </div>

                {/* Experiment 1: List with proper keys */}
                <div className="bg-white border border-gray-200 rounded p-4 mb-6 text-left">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        ✅ With Proper Keys (key=&#123;item.id&#125;)
                    </h3>
                    <div className="space-y-2 mb-3">
                        {list.map(item => (
                            <Item key={item.id} item={item} />
                        ))}
                    </div>
                    <p className="text-xs text-gray-600 italic">
                        State follows the item when list reorders
                    </p>
                </div>

                {/* Experiment 2: List with index keys */}
                <div className="bg-white border border-gray-200 rounded p-4 mb-6 text-left">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        ⚠️ With Index Keys (key=&#123;index&#125;)
                    </h3>
                    <div className="space-y-2 mb-3">
                        {list.map((item, index) => (
                            <Item key={index} item={item} />
                        ))}
                    </div>
                    <p className="text-xs text-gray-600 italic">
                        State stays at position, not with the item
                    </p>
                </div>

                <button
                    onClick={reverseList}
                    className="w-full px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm rounded mb-6 text-left"
                >
                    Reverse List
                </button>

                {/* Experiment 3: Component switching */}
                <div className="bg-white border border-gray-200 rounded p-4 text-left">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        Component Type Switch
                    </h3>
                    <div className="mb-3">
                        {show ? <A /> : <B />}
                    </div>
                    <button 
                        onClick={() => setShow(prev => !prev)}
                        className="w-full px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 text-sm rounded text-left"
                    >
                        Toggle A/B
                    </button>
                    <p className="mt-3 text-xs text-gray-600 italic">
                        Different component types reset state
                    </p>

                    <div className="mt-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">
                            Key Prop Switch
                        </h3>
                        <div className="mb-3">
                            <A key={key} />
                            <button 
                                onClick={toggleKey}
                                className="w-full px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 text-sm rounded text-left"
                            >
                                Toggle Key
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
