---
title: 写TS不需要吊炸天的类型体操, 有基础的逻辑就够了
date: 2023-02-14
tags:
    - TypeScript
---

昨日一群友发出问题如下

```ts
type ABC = { a: number; b: number; c: number; }
// 上述类型应当至少有一个字段必须
```
我们来分析问题，先看现有条件, 现有索引集 $I = \{ a, b, c \}$

而我们要得到的类型应当是
```ts
type Result = 
    | { a: number; b?: number; c?: number }
    | { a?: number; b: number; c?: number }
    | { a?: number; b?: number; c: number }
```
这实质上就是一个含有三个元素的新集合, 可以看到这三个元素与索引集 $I$ 有着明显的映射关系, 分别将其记为 $A_a, A_b, A_c$

那么我们就可以得到一个索引族 $\mathscr{A}=\{~A_i~|~i\in I~\}$, 将索引族中的集合合并, 就是我们需要的答案

于是我们现在需要做的就是写出 $A_i$ 的通项公式, 显然, 这公式中包含两个变量, 对象类型 $T$ 和索引类型 $K$ , 每一项又由两部分组成: 一个字段必选, 其他所有字段可选, 我们将其表示为 $k$ 和 $K-\{k\}$, 那么情况就很明了了, 我们很轻易就写出了如下类型

```ts
type Item<T, k extends keyof T> = {
    [key in Exclude<keyof T, k>]?: T[key]; // K\{k}
} & {
    [key in k]: T[key]; // {k}
};

// 再下一步就是进行映射获取索引族并进行合并了

type IndexedResult<T> = {
    [k in keyof T]: Item<T, k>; // 映射
};

type Result<T> = IndexedResult<T>[keyof T] // 因为值的类型本身就是Union, 此处直接就合并了
```

当然, 也可以一个类型写完, 得用点奇技淫巧, 还是一介老师贴了代码了我才知道这个写法

```ts
type Result2<T> = keyof T extends (infer K extends keyof T)
    ? K extends K
        ? Pick<T, K> & Partial<Pick<T, Exclude<keyof T, K>>>
        : never
    : never
```