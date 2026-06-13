import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ideasQueryOption } from "@/api/queryOptions";
import IdeaCard from "@/components/IdeaCard";

export const Route = createFileRoute("/ideas/")({
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(ideasQueryOption());
  },
  component: IdeasPage,
});

function IdeasPage() {
  const { data: ideas } = useSuspenseQuery(ideasQueryOption());
  
  return (
    <div className="p-4 ">
      <h1 className="text-2xl font-bold mb-4">Ideas</h1>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {ideas.map((idea) => (
          <IdeaCard key={idea._id} idea={idea}/>
        ))}
      </ul>
    </div>
  );
}
