import Card from './Card';
import { TMDBMovie } from '@/types';

interface ResultsProps {
  results: TMDBMovie[];
  currentPage?: number;
  totalPages?: number;
  genre?: string;
}

export default function Results({ results = [] }: ResultsProps) {
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-16 glass-panel rounded-2xl border border-white/5 my-4">
        <p className="text-zinc-400 text-sm">No items found in this section.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 py-4">
      {results.map((result) => (
        <Card key={result.id} result={result} />
      ))}
    </div>
  );
}
