import { walk } from "@std/fs";
import { extractYaml } from "@std/front-matter";
import { render } from "@deno/gfm";
import { Database } from "@db/sqlite";
import "npm:prismjs@1.29.0/components/prism-typescript.js";
import "npm:prismjs@1.29.0/components/prism-csharp.js";
import "npm:prismjs@1.29.0/components/prism-fsharp.js";
import "npm:prismjs@1.29.0/components/prism-powershell.js";

type Attrs = { title: string; tags?: string[]; date: string; "disable-math"?: boolean };

const files = walk("contents", { exts: [".md"] });

const recordsToInsert = await Promise.all(
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
        original: body,
        compiled: render(body, { allowMath: !attrs["disable-math"] }),
      };

      return record;
    });
  }),
);

const tagRecordsToInsert = recordsToInsert.map((record) => {
  return record.tags.map((tag) => {
    return { tag, path: record.path };
  });
}).flat();

const db = new Database("db/db.sqlite");

db.exec(
  "CREATE TABLE IF NOT EXISTS records (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, path TEXT, tags TEXT, date DATETIME, original TEXT, compiled TEXT)",
);
db.exec("CREATE UNIQUE INDEX IF NOT EXISTS records_path ON records (path)");
db.exec("CREATE UNIQUE INDEX IF NOT EXISTS records_title ON records (title)");
db.exec("CREATE TABLE IF NOT EXISTS tags (id INTEGER PRIMARY KEY AUTOINCREMENT, tag TEXT, path TEXT)");

const statement1 = db.prepare(
  "INSERT INTO records (title, path, tags, date, original, compiled) VALUES (@title, @path, @tags, @date, @original, @compiled)",
);
const statement2 = db.prepare("INSERT INTO tags (tag, path) VALUES (@tag, @path)");

db.transaction(() => {
  recordsToInsert.forEach((record) => {
    statement1.run(record.title, record.path, JSON.stringify(record.tags), record.date.toISOString(), record.original, record.compiled);
  });
  tagRecordsToInsert.forEach((record) => {
    statement2.run(record.tag, record.path);
  });
})();

db.close();

// await Deno.writeTextFile("static/gfm.css", CSS + KATEX_CSS);
