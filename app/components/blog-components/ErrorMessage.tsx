// components/ErrorMessage.tsx
interface ErrorMessageProps {
  error: string | null;
  onRetry: () => void;
}

export default function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  if (!error) return null;
  return (
    <div className="bg-red-50 border-l-4 border-red-600 text-red-700 p-4 rounded-lg mb-6" role="alert">
      <p className="font-bold">Erro</p>
      <p>{error}</p>
      <button
        onClick={onRetry}
        className="mt-2 px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Tentar novamente
      </button>
    </div>
  );
}