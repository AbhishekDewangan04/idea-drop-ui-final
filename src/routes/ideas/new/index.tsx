import { createIdea } from "@/api/backend";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";

export const Route = createFileRoute("/ideas/new/")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createIdea,
  });

  //func
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !description.trim()) {
      alert("Please fill all form field");
      return;
    }
    try {
      await mutateAsync({
        title,
        summary,
        description,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag != ""),
      });
      await queryClient.invalidateQueries({ queryKey: ["ideas"] });
      navigate({ to: "/ideas" });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown Error occured";
      alert("Unable to post the idea " + message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
              <h1 className="font-semibold text-xl">Create New Idea</h1>
              <Link
                className="text-blue-500 hover:text-blue-600 hover:underline"
                to="/ideas"
              >
                ← Back To Ideas
              </Link>
            </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            className="block mb-1 text-gray-700 font-medium"
            htmlFor="title"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter idea title"
            className="block w-full border px-2 py-2 border-gray-300 rounded focus:outline-0 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            className="block mb-1 text-gray-700 font-medium"
            htmlFor="summary"
          >
            Summary
          </label>
          <input
            type="text"
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Enter idea summary"
            className="block w-full border px-2 py-2 border-gray-300 rounded focus:outline-0 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            className="block mb-1 text-gray-700 font-medium"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write out description of your idea"
            className="block w-full border px-2 py-2 border-gray-300 rounded focus:outline-0 focus:ring-2 focus:ring-blue-500 "
          />
        </div>
        <div>
          <label
            className="block mb-1 text-gray-700 font-medium"
            htmlFor="tags"
          >
            Tags
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter idea tags"
            className="block w-full border px-2 py-2 border-gray-300 rounded focus:outline-0 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-500 text-white px-4 py-2 w-full text-center cursor-pointer hover:bg-blue-600 font-medium rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Creating..." : "Create Idea"}
        </button>
      </form>
    </div>
  );
}
