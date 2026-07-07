Pill-shaped button for actions; primary is a quiet neutral fill (`--primary-fill`) with a 1px super-pastel spectrum ring and a very dim glow — one primary per view.

```jsx
<Button onClick={save}>Log a meal</Button>
<Button variant="secondary" size="sm">Cancel</Button>
<Button variant="ghost">Skip for now</Button>
```

- `variant`: `primary` (default) | `secondary` (outlined) | `ghost` | `danger`
- `size`: `sm` (32px) | `md` (40px) | `lg` (48px)
- Accepts all native button props. Pair with `<Icon name="plus" size={16} />` inside for icon + label.
