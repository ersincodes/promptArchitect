import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorScreenProps {
  error: string | null;
  onRetry: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
      <h2 className="text-2xl font-bold text-white mb-2">
        Architecture Failed
      </h2>
      <p className="text-slate-400 mb-8">
        {error || "Unknown error occurred."}
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors">
        Try Again
      </button>
    </div>
  );
};
