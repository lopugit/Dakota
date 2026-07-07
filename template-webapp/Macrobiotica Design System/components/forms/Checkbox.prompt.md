Checkbox with label and optional description line.

```jsx
<Checkbox label="Chewed well" checked={done} onChange={e => setDone(e.target.checked)} />
<Checkbox label="Sea vegetables" description="Kombu, wakame, nori" />
```

- `label` / `description`
- Native input props (`checked`, `onChange`, `disabled`, …)
