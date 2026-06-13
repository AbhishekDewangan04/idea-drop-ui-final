import { queryOptions } from "@tanstack/react-query";
import { fetchIdea, fetchIdeas } from "./backend";

export const ideaQueryOptions = (ideaId: string) => {
  return queryOptions({
    queryKey: ["idea", ideaId],
    queryFn: () => fetchIdea(ideaId),
  });
};

export const ideasQueryOption = (limit?: number) => {
  const lim = limit ? limit : 0;
  return queryOptions({
    queryKey: ["ideas", {limit: lim}],
    queryFn: () => fetchIdeas(lim),
  });
};