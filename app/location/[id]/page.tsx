import Link from "next/link";

export default function LocationPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-edf-light-gray flex flex-col items-center justify-center gap-4">
      <p className="text-xs text-edf-mid-gray font-mono uppercase tracking-widest">Location Detail</p>
      <h1 className="text-xl font-sans font-semibold text-edf-dark">{params.id}</h1>
      <p className="text-sm text-edf-mid-gray">Coming soon — Wave 3</p>
      <Link
        href="/"
        className="mt-4 text-sm font-sans text-edf-navy hover:underline"
      >
        ← Back to Portfolio
      </Link>
    </main>
  );
}
