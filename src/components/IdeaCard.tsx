import type { Idea } from "@/types";
import { Link } from "@tanstack/react-router";
import clsx from "clsx";

const IdeaCard = ({idea, button=true}: {idea: Idea, button?: boolean}) => {

    const linkClasses = clsx({
        "bg-blue-500 px-4 py-2 text-center text-white mt-4 block rounded hover:bg-blue-700 transition": button,
        "text-blue-400 hover:underline hover:text-blue-500 mt-2": !button
    })
  return (
    <div
      className="border p-4 border-gray-300 bg-white rounded shadow flex flex-col justify-between"
    >
      <div>
        <h2 className="text-lg font-semibold">{idea.title}</h2>
        <p className="mt-2 text-gray-700">{idea.summary}</p>
      </div>
      <Link
        to="/ideas/$ideaId"
        params={{ ideaId: idea.id.toString() }}
        className={linkClasses}
      >
        {button ? 'View Details' : 'Read More'}
      </Link>
    </div>
  );
};

export default IdeaCard;
