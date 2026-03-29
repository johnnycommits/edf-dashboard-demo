import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-edf-dark flex items-center justify-center">
      <div className="text-center space-y-6 px-8">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-3 h-10 bg-edf-orange rounded-sm" />
          <h1 className="text-4xl font-bold text-white">EDF Energy Dashboard</h1>
        </div>
        <p className="text-edf-mid-gray text-lg max-w-md mx-auto">
          Walmart natural gas usage analytics platform — enterprise demo
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link
            href="/design-system"
            className="px-6 py-3 bg-edf-navy hover:bg-edf-navy-dark text-white rounded-lg transition-colors font-medium"
          >
            View Design System
          </Link>
        </div>
        <p className="text-xs text-edf-dark-gray mt-4 font-mono">Dashboard coming soon — Wave 2</p>
      </div>
    </div>
  );
}
