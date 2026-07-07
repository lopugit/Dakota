Lucide icon at the brand's 1.75px stroke; loads the icon set once from CDN.

```jsx
<Icon name="wheat" />
<Icon name="book-open" size={20} color="var(--text-muted)" />
```

- `name`: any Lucide name (kebab-case)
- `size` (18) / `strokeWidth` (1.75) / `color` (currentColor)
- Decorative by default (`aria-hidden`); label the parent control instead.
