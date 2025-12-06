---
title: 测试 Markdown 语法
slug: 0-test-md-grammar
created-time: 2025-12-05
---

# 测试 Markdown 语法

这是一个全面的测试，用于演示各种 markdown 元素以及它们如何与我们的 CSS 样式渲染。

## 文本格式

这里有不同的文本格式选项：

**粗体文本** 和 *斜体文本* 以及 ***粗斜体文本***。

~~删除线文本~~ 和 `行内代码`。

## 列表

### 无序列表

- 第一项
- 第二项
  - 嵌套项 1
  - 嵌套项 2
    - 深度嵌套项
- 第三项

### 有序列表

1. 第一项有序内容
2. 第二项有序内容
   1. 嵌套有序项
   2. 另一个嵌套项
3. 第三项有序内容

## 代码块

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
  return `Welcome to Mian's blog`;
}

const message = greet("Visitor");
console.log(message);
```

```python
def calculate_fibonacci(n):
    """计算第 n 个斐波那契数。"""
    if n <= 1:
        return n
    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

# 示例用法
for i in range(10):
    print(f"F({i}) = {calculate_fibonacci(i)}")
```

## 引用块

> 这是一个引用块。
>
> 可以跨越多行。
>
> > 还可以有嵌套的引用块。

## 表格

| 姓名 | 年龄 | 职业 |
|------|-----|------|
| Alice | 28 | 开发者 |
| Bob | 32 | 设计师 |
| Carol | 24 | 作家 |

| 功能 | 状态 | 优先级 |
|---------|--------|----------|
| 响应式设计 | ✅ 完成 | 高 |
| 暗黑模式 | 🔄 进行中 | 中 |
| 搜索功能 | ❌ 未开始 | 低 |

## 链接和图片

[外部链接](https://example.com)

[内部链接](/)

![图片替代文本](https://via.placeholder.com/300x200/90EE90/228B22?text=占位符)

## 水平分割线

---

## 提示框/注意事项

> **注意：** 这是用于附加信息的提示框。
>
> 可以包含多个段落和格式化文本。

> **警告：** 这是用于重要通知的警告框。

> **提示：** 这是包含有用建议的提示框。

## 数学公式（如果支持）

行内公式：$E = mc^2$

块级公式：
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

## 任务/清单

- [x] 已完成任务
- [ ] 未完成任务
- [ ] 另一个未完成的任务，包含更多文本

## 嵌入内容

<iframe src="https://example.com" width="100%" height="300"></iframe>

## 总结

这个全面的 markdown 测试涵盖：
- 基本文本格式
- 列表（有序和无序）
- 代码块及语法高亮
- 引用块
- 表格
- 链接和图片
- 水平分割线
- 提示框
- 任务/清单
- 以及更多！

所有元素的样式应该使用我们的全局 CSS 变量和设计系统保持一致。