'use client';

export default function ErrorMessage({ error }) {
  if (!error) return null;

  return (
    <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded text-red-600 text-sm">
      {error}
    </div>
  );
}
