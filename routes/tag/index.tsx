import { loadTags } from "../../neon/query.ts";

export default async function () {
  const tags = await loadTags();

  return (
    <div className="flex flex-col gap-5">
      <h2 class="border-b-2 border-t-2 py-3 font-bold text-2xl text-center">所有标签</h2>

      <nav className="flex flex-wrap gap-2 p-4">
        {tags.map((tag) => <a class="badge badge-outline badge-lg" href={`/tag/${encodeURIComponent(tag)}`}>{tag}</a>)}
      </nav>
    </div>
  );
}
