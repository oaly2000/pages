import { define } from "../../utils.ts";
import { loadRecordsByTag } from "../../db/query.ts";

export default define.page(function ({ params }) {
  const tag = params.tag!;
  const records = loadRecordsByTag(tag);

  return (
    <div className="flex flex-col gap-5">
      <h2 class="border-b-2 border-t-2 py-3 font-bold text-2xl text-center">标签: {tag}</h2>

      <nav className="flex flex-wrap gap-2 p-4">
        {records.map((record) => <a class="badge badge-ghost badge-lg" href={`/contents/${record.title}`}>{record.title}</a>)}
      </nav>
    </div>
  );
});
