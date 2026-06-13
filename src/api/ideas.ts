import type { Idea } from "@/types";
import api from "@/lib/axios";

export const fetchIdea = async (ideaId: string): Promise<Idea> => {
  // const res = await fetch(`/api/ideas/${ideaId}`);
  // if (!res.ok) throw new Error("Failed to fetch idea!");

  // return await res.json();
  const res = await api.get(`/ideas/${ideaId}`);
  return res.data;
};

export const fetchIdeas = async (
  limit?: number
): Promise<Idea[]> => {

  const res = await api.get(
    "/ideas",
    {
      params: limit
        ? { _limit: limit }
        : {},
    }
  );

  console.log("API RESPONSE:", res.data);

  return Array.isArray(res.data)
    ? res.data
    : [];
};

export const createIdea = async (newIdea: {
  title: string;
  summary: string;
  description: string;
  tags: string[];
}): Promise<Idea> => {
  const res = await api.post("/ideas", {
    ...newIdea,
    createdAt: new Date().toISOString(),
  });
  return res.data;
};

export const deleteIdea = async (ideaId: string) => {
  await api.delete(`/ideas/${ideaId}`);
};

export const updateIdea = async (
  ideaId: string,
  updatedIdea: {
    title: string;
    summary: string;
    description: string;
    tags: string[];
    createdAt: string;
  }
): Promise<Idea> => {
  const res = await api.put(`/ideas/${ideaId}`, {
    ...updatedIdea,
    updatedAt: new Date().toISOString(),
  });
  return res.data;
};
