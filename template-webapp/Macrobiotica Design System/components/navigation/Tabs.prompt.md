Horizontal tab row; the active tab gets an ink underline (green is reserved for actions).

```jsx
<Tabs
  items={[{ id: 'week', label: 'This week' }, { id: 'all', label: 'All time' }]}
  value={tab}
  onChange={setTab}
/>
```

- `items`: `{ id, label }[]`
- Controlled via `value` + `onChange`
