import GithubSection from "../components/GithubSection";

export default function ContributionsPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto max-w-[1200px] px-6 pt-8">
        <a
          href="/"
          className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
        >
          ← Back to portfolio
        </a>
      </div>
      <GithubSection fullPage />
    </main>
  );
}
