import React from "react";
import SuccessStoryCard from "./SuccessStoryCard";
import { successStories } from "./successStoriesData";

const PRIORITY_COUNT = 5;

const SuccessStories: React.FC = () => {
  return (
    <>
      <section className="pt-36 pb-20 bg-gradient-to-b from-darkblue to-gray-900 text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Success Stories
          </h1>
          <p className="text-xl text-gray-300">Study in Top UK Universities</p>
        </div>
      </section>

      <section className="w-full py-10 px-4">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-start justify-items-center">
            {successStories.map((story, index) => (
              <SuccessStoryCard
                key={story.id}
                story={story}
                priority={index < PRIORITY_COUNT}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default SuccessStories;
