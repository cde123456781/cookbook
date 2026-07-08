"use client";

import type { FullRecipeDetails } from "~/app/types/recipe";

export default function RecipeDisplay(props: {
  recipe: FullRecipeDetails | undefined
}) {

    const recipe = props.recipe;

    if (!recipe) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <p className="text-gray-500">
                    Recipe could not be found
                </p>
            </div>
        );

    }


  return (
    <main className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Hero */}
      <section className="card bg-base-200 shadow-xl overflow-hidden">
        {recipe.recipeImage && (
          <figure>
            <img
              src={recipe.recipeImage.url}
              alt={recipe.title}
              width={1200}
              height={600}
              className="w-full h-96 object-cover"
            />
          </figure>
        )}

        <div className="card-body">
          <div className="flex justify-between gap-4 items-start">
            <h1 className="card-title text-4xl">
              {recipe.title}
            </h1>

            <span
              className={`badge ${
                recipe.isPublic
                  ? "badge-success"
                  : "badge-warning"
              }`}
            >
              {recipe.isPublic ? "Public" : "Private"}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {recipe.categories.map(({ category }) => (
              <span
                key={category.id}
                className="badge badge-primary"
              >
                {category.name}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <div className="stat bg-base-100 rounded-box">
              <div className="stat-title">Duration</div>
              <div className="stat-value text-xl">
                {recipe.duration}
              </div>
            </div>

            <div className="stat bg-base-100 rounded-box">
              <div className="stat-title">Steps</div>
              <div className="stat-value text-xl">
                {recipe.steps.length}
              </div>
            </div>

            <div className="stat bg-base-100 rounded-box">
              <div className="stat-title">Created</div>
              <div className="stat-value text-xl">
                {recipe.createdAt.toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="card bg-base-200 p-6 shadow">
        <h2 className="text-2xl font-bold mb-3">
          Description
        </h2>

        <p className="opacity-80">
          {recipe.description ?? "No description provided."}
        </p>
      </section>

      {/* Steps */}
      <section>
        <h2 className="text-3xl font-bold mb-4">
          Instructions
        </h2>

        <div className="space-y-6">
          {recipe.steps
            .sort((a, b) => a.stepNumber - b.stepNumber)
            .map((step) => (
              <article
                key={step.id}
                className="card bg-base-200 shadow"
              >
                <div className="card-body">
                  <h3 className="card-title">
                    <span className="badge badge-primary">
                      {step.stepNumber}
                    </span>
                    Step {step.stepNumber}
                  </h3>

                  <p>{step.stepDescription}</p>

                  {step.stepImage && (
                    <img
                      src={step.stepImage.url}
                      alt={`Step ${step.stepNumber}`}
                      width={700}
                      height={400}
                      className="rounded-box mt-4 max-h-96 object-cover"
                    />
                  )}
                </div>
              </article>
            ))}
        </div>
      </section>

      {/* Notes */}
      {recipe.notes.length > 0 && (
        <section className="card bg-base-200 p-6 shadow">
          <h2 className="text-3xl font-bold mb-4">
            Notes
          </h2>

          <div className="space-y-3">
            {recipe.notes.map((note) => (
              <div
                key={note.id}
                className="alert"
              >
                {note.note}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Metadata */}
      <section className="text-sm opacity-60">
        <p>Recipe ID: {recipe.id}</p>
        <p>Author ID: {recipe.authorId}</p>

        {recipe.updatedAt && (
          <p>
            Updated:{" "}
            {recipe.updatedAt.toLocaleDateString()}
          </p>
        )}
      </section>
    </main>
  );
}