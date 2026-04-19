import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import StateBatching from './components/StateBatching'
import Header from './components/Header'
import StateSnapshotClosure from './components/StateSnapshotClosure'
import HooksMechanism from './components/HooksMechanism'
import DiffAndReconciliation from './components/DiffAndReconciliation'
import EffectTiming from './components/EffectTiming'
import AsyncBatching from './components/AsyncBatching'

function AppRouter() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Routes */}
        <Routes>
          <Route
            path="/"
            element={
              <div className="max-w-7xl mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Week 2: State and Render</h1>
                <p className="text-gray-600 mb-6">
                  Explore React's state management and rendering behavior.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <Link
                    to="/state-batching"
                    className="block p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">State Batching</h2>
                    <p className="text-gray-600">
                      Learn how React batches state updates and the difference between direct values and updater functions.
                    </p>
                  </Link>
                  <Link
                    to="/state-snapshot-closure"
                    className="block p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">State Snapshot & Closure</h2>
                    <p className="text-gray-600">
                      Understand how closures capture state in asynchronous callbacks.
                    </p>
                  </Link>
                  <Link
                    to="/hooks-mechanism"
                    className="block p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Hooks Mechanism</h2>
                    <p className="text-gray-600">
                      Explore how React hooks work under the hood and how they manage state and effects.
                    </p>
                  </Link>
                  <Link
                    to="/diff-and-reconciliation"
                    className="block p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Diff and Reconciliation</h2>
                    <p className="text-gray-600">
                      Understand React's diffing algorithm and reconciliation process.
                    </p>
                  </Link>
                  <Link
                    to="/effect-timing"
                    className="block p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Effect Timing</h2>
                    <p className="text-gray-600">
                      Explore the execution order of useEffect vs useLayoutEffect.
                    </p>
                  </Link>
                  <Link
                    to="/async-batching"
                    className="block p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Async Batching</h2>
                    <p className="text-gray-600">
                      Mixing functional updates with async operations and stale closures.
                    </p>
                  </Link>
                </div>
              </div>
            }
          />
          <Route path="/state-batching" element={<StateBatching />} />
          <Route path="/state-snapshot-closure" element={<StateSnapshotClosure />} />
          <Route path="/hooks-mechanism" element={<HooksMechanism />} />
          <Route path="/diff-and-reconciliation" element={<DiffAndReconciliation />} />
          <Route path="/effect-timing" element={<EffectTiming />} />
          <Route path="/async-batching" element={<AsyncBatching />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default AppRouter
