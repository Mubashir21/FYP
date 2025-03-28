import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <p className="mb-6">Could not find the requested resource</p>
      <Link
        href="/admin/dashboard"
        className="text-blue-500 hover:text-blue-700"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
