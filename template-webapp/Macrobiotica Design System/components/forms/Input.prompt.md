Single-line text field with label, hint and error slots; green focus ring.

```jsx
<Input label="Name" placeholder="e.g. Yuki" hint="Shown on shared plans" />
<Input label="Email" error="Enter a valid email" />
```

- `label` / `hint` / `error` (error replaces hint)
- Accepts all native input props (`value`, `onChange`, `type`, …)
