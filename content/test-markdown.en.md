---
title: Testing Markdown Grammar
slug: 0-test-md-grammar
created-time: 2025-12-05
---

# Testing Markdown Grammar

This is a comprehensive test to demonstrate various markdown elements and how they render with our CSS styling.

## Text Formatting

Here are different text formatting options:

**Bold text** and *italic text* and ***bold italic text***.

~~Strikethrough text~~ and `inline code`.

## Lists

### Unordered List

- First item
- Second item
  - Nested item 1
  - Nested item 2
    - Deeply nested item
- Third item

### Ordered List

1. First ordered item
2. Second ordered item
   1. Nested ordered item
   2. Another nested item
3. Third ordered item

## Code Blocks

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
    """Calculate the nth Fibonacci number."""
    if n <= 1:
        return n
    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

# Example usage
for i in range(10):
    print(f"F({i}) = {calculate_fibonacci(i)}")
```

## Blockquotes

> This is a blockquote.
>
> It can span multiple lines.
>
> > And it can have nested blockquotes.

## Tables

| Name | Age | Occupation |
|------|-----|------------|
| Alice | 28 | Developer |
| Bob | 32 | Designer |
| Carol | 24 | Writer |

| Feature | Status | Priority |
|---------|--------|----------|
| Responsive Design | ✅ Done | High |
| Dark Mode | 🔄 In Progress | Medium |
| Search Functionality | ❌ Not Started | Low |

## Links and Images

[External Link](https://example.com)

[Internal Link](/)

![Image Alt Text](https://via.placeholder.com/300x200/90EE90/228B22?text=Placeholder)

## Horizontal Rule

---

## Admonitions/Callouts

> **Note:** This is a note box for additional information.
>
> It can contain multiple paragraphs and formatted text.

> **Warning:** This is a warning box for important notices.

> **Tip:** This is a tip box with helpful suggestions.

## Math (if supported)

Inline equation: $E = mc^2$

Block equation:
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

## Tasks/CHECKLISTS

- [x] Completed task
- [ ] Incomplete task
- [ ] Another incomplete task with more text

## Embedded Content

<iframe src="https://example.com" width="100%" height="300"></iframe>

## Summary

This comprehensive markdown test covers:
- Basic text formatting
- Lists (ordered and unordered)
- Code blocks with syntax highlighting
- Blockquotes
- Tables
- Links and images
- Horizontal rules
- Admonitions
- Tasks/checklists
- And more!

The styling should be consistent across all elements using our global CSS variables and design system.