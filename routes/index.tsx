import { Partial } from "fresh/runtime";
import { count, loadRecords } from "../neon/query.ts";
import { default as Content } from "./contents/[title].tsx";
import { FreshContext } from "fresh";

export default async function Home({ req }: FreshContext) {
  const query = new URL(req.url).searchParams;
  const page = query.get("page") ? Number(query.get("page")) : 1;
  const perPage = query.get("perPage") ? Number(query.get("perPage")) : 2;
  const isFreshPartial = query.get("fresh-partial");
  const contents = await (isFreshPartial ? loadRecords(page, perPage) : loadRecords(1, page * perPage));
  const hasNextPage = await count() > page * perPage;

  return (
    <div>
      <section>
        <h2 class="border-b-2 border-t-2 py-3 font-bold text-2xl text-center">虽然没什么鸟用但还是写了的小作文</h2>
        <div f-client-nav class="px-4 py-10">
          <div f-client-nav={false} class="flex flex-col gap-10">
            <Partial name="contents" mode="append">
              {contents.map((content) => (
                // @ts-expect-error:
                <Content key={content.title} data={content} />
              ))}
            </Partial>
          </div>
          <Partial name="load-more" mode="replace">
            {hasNextPage && (
              <form>
                <input type="hidden" name="page" value={page + 1} />
                <input type="hidden" name="perPage" value={perPage} />
                <button type="submit" class="btn btn-link">加载更多</button>
              </form>
            )}
          </Partial>
        </div>
      </section>
    </div>
  );
}
