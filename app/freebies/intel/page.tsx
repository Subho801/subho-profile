import { getIntel } from "../data/getIntel";
import Link from "next/link";

export default async function IntelPage() {
  const intel = await getIntel();

  if (!intel) {
    return (
      <main className="mx-auto max-w-5xl p-10 text-white">
        Failed to load Intel giveaway.
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-10 text-white">
      <Link href="/freebies">← Back</Link>

      <h1 className="mt-6 text-4xl font-bold">
        {intel.title}
      </h1>

      <img
        src={intel.image}
        alt={intel.title}
        className="mt-8 rounded-2xl"
      />

      <p className="mt-6 text-white/70">
        {intel.description}
      </p>

      <a
        href={intel.url}
        target="_blank"
        className="mt-8 inline-block rounded-xl bg-blue-600 px-5 py-3"
      >
        Open Giveaway
      </a>
    </main>
  );
}
