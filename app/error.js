"use client";

export default function Error({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-red-100 text-red-900">
      <h1 className="text-3xl font-bold mb-4">Something went wrong!</h1>
      <p className="mb-4">{error?.message || "An unexpected error occurred."}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Try again
      </button>
    </div>
  );
}
