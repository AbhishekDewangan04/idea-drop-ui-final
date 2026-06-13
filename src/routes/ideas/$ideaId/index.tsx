import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ideaQueryOptions } from "@/api/queryOptions";
import { deleteIdea } from "@/api/backend";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/ideas/$ideaId/")({
  loader: async ({ params, context: { queryClient } }) => {
    return await queryClient.ensureQueryData(ideaQueryOptions(params.ideaId));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { ideaId } = Route.useParams();
  const { data: idea } = useSuspenseQuery(ideaQueryOptions(ideaId));
  const { user } = useAuth();
 
  //mutation
  const { mutateAsync: deleteMutate, isPending } = useMutation({
    mutationFn: deleteIdea,
  });

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure, You want to delete this idea?"
    );
    if (!confirmDelete) return;
    try {
      await deleteMutate(ideaId);
      await queryClient.invalidateQueries({ queryKey: ["ideas"] });
      navigate({ to: "/ideas" });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "With Unknown Error";
      alert("Unable to delete idea " + message);
    }
  };
  return (
    <div className="p-4">
      <Link
        className="text-blue-400 hover:text-blue-600 transition hover:underline"
        to="/ideas"
      >
        ← Back to Ideas
      </Link>
      <h2 className="text-2xl font-bold mt-2">{idea.title}</h2>
      <p className="mt-2">{idea.description}</p>

      {user && user.id === idea?.user && (
        <>
          {/* Edit Link */}
          <Link
            className="px-4 py-2 mr-2 bg-yellow-500 rounded text-white text-sm font-medium hover:bg-yellow-600 transition"
            to="/ideas/$ideaId/edit"
            params={{ ideaId }}
          >
            Edit
          </Link>
          {/* Delete button */}
          <button
            disabled={isPending}
            onClick={handleDelete}
            className="bg-red-600 text-white rounded px-4 py-2 text-sm font-medium mt-2 hover:bg-red-700 transition cursor-pointer disabled:opacity-50 disabled:bg-red-700 disabled:cursor-not-allowed"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </>
      )}
    </div>
  );
}
