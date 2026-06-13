import { createFileRoute } from "@tanstack/react-router";
import { Lightbulb } from "lucide-react";
import { ideasQueryOption } from "@/api/queryOptions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import IdeaCard from "@/components/IdeaCard";

export const Route = createFileRoute("/")({
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(ideasQueryOption(3));
  },
  component: App,
});

function App() {
  const { data: ideas } = useSuspenseQuery(ideasQueryOption(3));

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between gap-10 ">
        <section className="flex flex-col gap-4">
          <Lightbulb className="text-yellow-500 w-20 h-20 hover:text-yellow-400 transition" />
          <h1 className="text-4xl font-bold text-gray-800">Welcome to IdeaDrop</h1>
          <p className="text-gray-700 max-w-xs">
            Share, explore, and build on the best startup ideas and side hustles
          </p>
        </section>

        <section className="flex-1" >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Latest Ideas</h2>
          <ul className="space-y-4">
            {ideas.map((idea) => (
              <IdeaCard idea={idea} key={idea._id} button={false}/>
            ))}
          </ul>
          <Link to="/ideas" className="bg-blue-500 text-white block rounded text-center mt-4 px-4 py-1 hover:bg-blue-600 hover:scale-102 active:scale-101 transition">View All Ideas</Link>
        </section>
      </div>
    </>
  );
}
