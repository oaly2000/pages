import { addHeads, define } from "../../utils.ts";
import { loadSingleRecord } from "../../db/query.ts";
import { page } from "fresh";

export const handler = define.handlers({
  GET(ctx) {
    const title = ctx.params.title!;
    const record = loadSingleRecord(title);

    addHeads(ctx, [
      <title>{record.title}</title>,
    ]);

    return page(record);
  },
});

export default define.page<typeof handler>(function ({ data }) {
  return (
    <div class="card bg-base-100" key={data.title}>
      <div className="card-body">
        <h2 class="card-title text-2xl border-b-[1px] border-accent text-accent py-2 items-baseline justify-between">
          <a href={`/contents/${data.title}`}>{data.title}</a>
          <span class="text-sm">{data.date}</span>
        </h2>
        <div class="markdown-body pt-2 !bg-[unset] !text-[color:unset]" dangerouslySetInnerHTML={{ __html: data.compiled }} />
      </div>
    </div>
  );
});