import { useCallback, useRef, useState } from 'react'
import './App.css'
import CounterPanel from './components/CounterPanel'
import NormalChild from './components/NormalChild'
import MemoChild from './components/MemoChild'
import TextInputPanel from './components/TextInputPanel'
import HeavyList from './components/HeavyList'
console.log('hello')
function App() {
  const [showHeavyList, setShowHeavyList] = useState(false)
  const [dynamicProps, setDynamicProps] = useState(false)
  const [parentCount, setParentCount] = useState(0)
  const [showNormalChild, setShowNormalChild] = useState(true)
  const [showMemoChild, setShowMemoChild] = useState(true)
  const [showCounterPanel, setShowCounterPanel] = useState(true)
  const [showTextInput, setShowTextInput] = useState(true)
  const [toggle, setToggle] = useState(false) // Used to trigger re-render for dynamic props

  const parentRenderCount = useRef(0)
  parentRenderCount.current += 1

  const resetExperiment = useCallback(() => {
    parentRenderCount.current = 0
    setParentCount(0)
    setShowHeavyList(false)
    setDynamicProps(false)
    setShowNormalChild(true)
    setShowMemoChild(true)
    setShowCounterPanel(true)
    setShowTextInput(true)
    setToggle(prev => !prev) // Trigger re-render for any components relying on this toggle
  }, [])

  const toggleHeavyList = useCallback(() => {
    setShowHeavyList(prev => !prev)
  }, [])

  const toggleDynamicProps = useCallback(() => {
    setDynamicProps(prev => !prev)
  }, [])

  const toggleNormalChild = useCallback(() => {
    setShowNormalChild(prev => !prev)
  }, [])

  const toggleMemoChild = useCallback(() => {
    setShowMemoChild(prev => !prev)
  }, [])

  const toggleCounterPanel = useCallback(() => {
    setShowCounterPanel(prev => !prev)
  }, [])

  const toggleTextInput = useCallback(() => {
    setShowTextInput(prev => !prev)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-gray-900">React Render Explorer</h1>
        </div>

        {/* Top Row: Parent Counters and Controls */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          {/* Parent Render Count (useRef) */}
          <div className="bg-white border border-gray-200 rounded p-3">
            <h2 className="text-xs font-medium text-gray-600 mb-1">Parent Render Count (useRef)</h2>
            <p className="text-2xl font-bold text-gray-900">{parentRenderCount.current}</p>
          </div>

          {/* Parent State Count */}
          <div className="bg-white border border-gray-200 rounded p-3">
            <h2 className="text-xs font-medium text-gray-600 mb-1">Parent State Count</h2>
            <p className="text-2xl font-bold text-gray-900">{parentCount}</p>
          </div>

          {/* Controls */}
          <div className="bg-white border border-gray-200 rounded p-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setParentCount(prev => prev + 1)}
                className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                Update Parent
              </button>
              <button
                onClick={resetExperiment}
                className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded hover:bg-gray-800"
              >
                Reset
              </button>
              <button
                onClick={toggleCounterPanel}
                className={`px-3 py-1.5 text-sm rounded ${
                  showCounterPanel
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Counter Panel
              </button>
              <button
                onClick={toggleNormalChild}
                className={`px-3 py-1.5 text-sm rounded ${
                  showNormalChild
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Normal Child
              </button>
              <button
                onClick={toggleMemoChild}
                className={`px-3 py-1.5 text-sm rounded ${
                  showMemoChild
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Memo Child
              </button>
              <button
                onClick={toggleTextInput}
                className={`px-3 py-1.5 text-sm rounded ${
                  showTextInput
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Text Input
              </button>
              <button
                onClick={toggleHeavyList}
                className={`px-3 py-1.5 text-sm rounded ${
                  showHeavyList
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Heavy List
              </button>
              <button
                onClick={toggleDynamicProps}
                className={`px-3 py-1.5 text-sm rounded ${
                  dynamicProps
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Dynamic Props
              </button>
            </div>
          </div>
        </div>

        {/* All Components Row */}
        <div className="flex gap-3 flex-wrap">
          {showCounterPanel && <CounterPanel />}
          {showNormalChild && <NormalChild />}
          {showTextInput && <TextInputPanel />}
          {showHeavyList && <HeavyList />}
          {showMemoChild && <MemoChild label={dynamicProps ? String(parentCount) : 'normal-static'} />}
        </div>
      </div>
    </div>
  )
}

export default App
