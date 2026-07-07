Toggle switch; with a label it becomes a full-width settings row (label left, switch right).

```jsx
<Switch label="Seasonal suggestions" checked={on} onChange={e => setOn(e.target.checked)} />
<Switch checked={on} onChange={...} aria-label="Enable" />  // bare control
```

- `label` / `description` — omit both for a bare switch (add `aria-label`)
