---
title: My Opinion on Choosing Desktop Tech Stacks
slug: wip
created-time: 2026-04-06
tags: ["dev"]
---
# My Opinion on Choosing Desktop Tech Stacks

> [!NOTE]
> The author has never developed any desktop software.
> This article was written with AI's assistance.

In 2024, I investigated desktop software tech stacks and documented my findings in Notion. I accidentally deleted that article, so these opinions are reconstructed from memory.

1. If you don't know where to start, always consider `Electron` first. That's because HTML/CSS/JavaScript offers the fastest way to build an app without any other alternatives. Many developers have biases against it—-they overlook the importance of rapid development and the ecosystem while overemphasizing performance. However, the web browser is powerful enough to handle most business logic. Many claim that Microsoft employs many professional programmers to maintain Visual Studio Code, which is built on top of various optimizations (often called "black magic"). However, you'll rarely build a complex application like VSCode. By the way, you should not use any alternatives like `Tauri` regardless of the advantages they claim over `Electron`. As I've said, the ecosystem is one of the most valuable aspects of `Electron`.

2. If performance is indeed a core concern for your product, `Qt` would be a good choice. `Qt` has demonstrated itself through many successful cases, like WPS Office and KDE Plasma. And of course, for performance non-sensitive parts, use `CEF` to embed web apps.

3. Flutter is also a worthy choice to consider in 2026 for developers who want to develop a resource-friendly application with an acceptable development rate.
