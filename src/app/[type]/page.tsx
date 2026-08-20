interface PageProps {
  params: Promise<{ type: string }>;
}

export default async function AnimeTypePage({ params }: PageProps) {
  const { type } = await params;
  return (
    <div className="min-h-screen p-6 text-center text-xl font-bold capitalize">
      {type} page
    </div>
  );
}
