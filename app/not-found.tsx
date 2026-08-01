import Link from 'next/link';

export default function RootNotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-blanco px-6 text-center">
      <h1 className="font-display text-4xl font-black uppercase tracking-[1px] text-negro">
        404 — Page not found
      </h1>
      <p className="mt-4 max-w-md text-gris-med">
        The page you are looking for does not exist.
      </p>
      <div className="mt-8">
        <Link
          href="/"
          className="btn-p"
        >
          Back to home
        </Link>
      </div>
    </section>
  );
}
