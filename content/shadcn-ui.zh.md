---
title: '再论 @shadcn/ui'
slug: shadcn-ui
created-time: 2023-06-04
updated-time: 2026-03-29
tags: ["dev", "Notion"]
---

# 再论 @shadcn/ui

这篇文章源于在前东家的一次技术分享，其实也就是稍微介绍了一下 `@shadcn/ui` 这个库，算是划水了一期。

`Tailwind CSS` 极大地提升了样式的开发效率，但它本身并不提供表单或表格这类开箱即用的高阶组件。`@radix-ui` 等 Headless 组件库则将外观的最终决定权交还给了开发者。而 `@shadcn/ui` 的巧妙之处在于，它通过一套预设集合将两者有机结合，在保持远超 `Ant Design` 定制性的同时，并未过于牺牲开发速度。

站在现在的视角回看，作者恰好在 LLM 爆发的前夜定义了这种“代码分发”的模式，在 AI 编程浪潮中吃到了一波红利，可谓生逢其时。

不过，铲子换成了挖掘机，却再无富矿可挖了，才是此时此刻开发者们正在面临的困境。

原文标题《'shadcn/ui 这个"组件库"有点意思'》,正文如下。

## 起因

偶然看到一个视频，来自 80 万+订阅的博主 developdbyed，还挺标题党，叫 *This React UI Library is GAME CHANGER!*

## 介绍

不如我直接拐到[官网](https://ui.shadcn.com/docs)来看一看。作者是这样介绍自己的产品，原文不长，扔给 AI 翻译一下：

This is **NOT** a component library.
这不是一个组件库。

It's a collection of re-usable components that you can copy and paste into your apps.
这是一系列你可以在应用中复制和粘贴的可重用组件。

**What do you mean by not a component library?**
**你说这不是一个组件库,是什么意思?**

I mean you do not install it as a dependency.
我的意思是你不需要将其作为一个依赖项来安装。

It is not available or distributed via npm.
它当前没有以 npm 包的形式发布或分发。

I have no plans to publish it as an npm package (for now).
我暂时也没有计划将其发布为一个 npm 包。

Pick the components you need.
选择你需要的组件。

**Copy and paste the code into your project and customize to your needs.**
**复制粘贴代码到你的项目中,并根据需要进行定制。**

The code is yours.
这段代码属于你。

*Use this as a reference to build your own component libraries.*
**把这个作为参考来构建你自己的组件库。**

划重点就是：
- 不是一个依赖（npm 包）
- 拷贝粘贴到项目中
- 构建自己的组件库

### 安装

官网给出的安装教程浓缩下来主要是三个步骤：

1. 项目是一个 React/NextJS 工程
2. 配置好 tailwindcss
3. `npx shadcn-ui init`

### 引入

从安装步骤不难看出，shadcn-ui 是依赖 tailwindcss。

由于不难利用 tailwindcss 构建诸如按钮，卡片一类的组件，我们直接看 Date Picker。

根据文档，`Date Picker` 是由 `Popover` 和 `Calendar` 组合而成。

```shell
pnpx shadcn-ui add popover
pnpx shadcn-ui add calendar
```

这行命令做两件事：

1. 安装相应的依赖
2. 把代码拷贝到 `components/ui` 这个目录


## 总结

我觉得这个组件库给我们两个启示。

1. 截止写作当日，项目在 GitHub 已经收获将近 20K Stars。作者给我们演示了如何整合社区的力量给我们赚星。
2. 项目本身类似于一个前端界的 500 lines 项目，可以参考他的解决方案，如何在单文件里面实现组件。