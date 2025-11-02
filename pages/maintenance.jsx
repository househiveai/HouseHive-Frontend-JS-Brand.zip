export default function Maintenance() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-yellow-400 mb-6">
          Maintenance Tracker
        </h1>
        <p className="text-zinc-400 mb-8">
          Track, assign, and update all property maintenance requests in one place.
        </p>

        {/* Active Requests Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-10">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4">
            Active Requests
          </h2>
          <ul className="space-y-4">
            <li className="border border-zinc-800 rounded-xl p-4 flex justify-between items-center hover:bg-zinc-800 transition">
              <div>
                <h3 className="font-semibold">Leaking faucet in Unit 203</h3>
                <p className="text-zinc-500 text-sm">Reported 2 days ago</p>
              </div>
              <span className="bg-yellow-500 text-black px-3 py-1 rounded text-sm font-semibold">
                In Progress
              </span>
            </li>
            <li className="border border-zinc-800 rounded-xl p-4 flex justify-between items-center hover:bg-zinc-800 transition">
              <div>
                <h3 className="font-semibold">AC not cooling - Unit 104</h3>
                <p className="text-zinc-500 text-sm">Reported 1 week ago</p>
              </div>
              <span className="bg-green-500 text-black px-3 py-1 rounded text-sm font-semibold">
                Completed
              </span>
            </li>
          </ul>
        </div>

        {/* Add Maintenance Task */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4">
            Add Maintenance Request
          </h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Task title"
              className="w-full bg-zinc-800 p-3 rounded-xl border border-zinc-700 text-white focus:outline-none focus:border-yellow-400"
            />
            <textarea
              placeholder="Describe the issue..."
              rows="4"
              className="w-full bg-zinc-800 p-3 rounded-xl border border-zinc-700 text-white focus:outline-none focus:border-yellow-400"
            ></textarea>
            <button
              type="button"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-xl"
            >
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
