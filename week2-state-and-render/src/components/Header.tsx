import { Link } from 'react-router-dom'

function Header() {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-4">
          <Link
            to="/"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded"
          >
            Home
          </Link>
          <Link
            to="/state-batching"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded"
          >
            State Batching
          </Link>
          <Link
            to="/state-snapshot-closure"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded"
          >
            State Snapshot & Closure
          </Link>
          <Link
            to="/hooks-mechanism"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded"
          >
            Hooks Mechanism
          </Link>
          <Link
            to="/diff-and-reconciliation"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded"
          >
            Diff & Reconciliation
          </Link>
          <Link
            to="/effect-timing"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded"
          >
            Effect Timing
          </Link>
          <Link
            to="/async-batching"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded"
          >
            Async Batching
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Header
