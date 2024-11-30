import { createDefine, FreshContext } from "fresh";
import { JSX } from "preact/jsx-runtime";

export interface State {
  headList?: JSX.Element[];
}

export const define = createDefine<State>();

export const addHeads = (ctx: FreshContext<State>, heads: JSX.Element[]) => {
  if (ctx.state.headList) {
    ctx.state.headList.push(...heads);
  } else ctx.state.headList = heads;
};
