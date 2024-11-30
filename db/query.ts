import { walk } from "@std/fs";
import { extractYaml } from "@std/front-matter";
import { render } from "@deno/gfm";

type Attrs = { title: string; tags?: string[]; date: string; "disable-math"?: boolean };

const files = walk("contents", { exts: [".md"] });

const records = await Promise.all(
  await Array.fromAsync(files).then((files) => {
    return files.map(async (file) => {
      const tags = file.path.split("/").slice(1, -1);
      const { attrs, body } = extractYaml(await Deno.readTextFile(file.path)) as { attrs: Attrs; body: string };

      if (attrs.tags) tags.push(...attrs.tags);

      const record = {
        title: attrs.title,
        path: file.path,
        tags,
        date: new Date(attrs.date),
        compiled: render(body, { allowMath: !attrs["disable-math"] }),
      };

      return record;
    });
  }),
);

const tagKeyedRecords = new Map();

for (const record of records) {
  for (const tag of record.tags) {
    if (!tagKeyedRecords.has(tag)) tagKeyedRecords.set(tag, []);
    tagKeyedRecords.get(tag)!.push(record);
  }
}

const db = {
  titleKeyed: new Map(records.map((record) => [record.title, record])),
  tagKeyed: tagKeyedRecords,
  noKeyed: records,
};

export const loadRecords = (page = 1, perPage = 10) => db.noKeyed.slice((page - 1) * perPage, page * perPage);

export const count = () => db.noKeyed.length;

export const loadSingleRecord = (title: string) => db.titleKeyed.get(title);

export const loadRecordsByTag = (tag: string): ReturnType<typeof loadRecords> => db.tagKeyed.get(tag);

export const loadTags = () => Array.from(db.tagKeyed.keys());
