---
title: Hello, world
date: 2026-07-06
excerpt: An example post showing how to write articles in Markdown — with code and LaTeX math.
---

This is an example article. To write a new post, just create a Markdown file
in the `articles/` folder and add a link to it on the home page. That's it —
no build step, no configuration.

## Writing in Markdown

You can write **bold**, *italic*, and [links](https://github.com/tiruss).
Lists work too:

- First point
- Second point
- Third point

### Code blocks

```python
def hello(name):
    print(f"Hello, {name}!")

hello("world")
```

> Blockquotes are handy for highlighting a key idea.

### Math (LaTeX)

Inline math works with dollar signs, e.g. the loss $\mathcal{L} = \frac{1}{N}\sum_{i=1}^{N} (y_i - \hat{y}_i)^2$.

Display math uses double dollars:

$$
\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right) V
$$

Images, tables, and headings all render automatically. Happy writing!
