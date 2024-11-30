import type { FreshContext, PageProps } from "fresh";
import { State } from "../utils.ts";

export default function App({ Component, state: { headList } }: FreshContext<State> & PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {headList ?? <title>OALY2000</title>}
        <link rel="stylesheet" href="/styles.css" />
        <link rel="stylesheet" href="/gfm.css" />
      </head>
      <body className="min-h-screen overflow-x-hidden bg-base-300 flex flex-col">
        <Component />
      </body>
    </html>
  );
}
