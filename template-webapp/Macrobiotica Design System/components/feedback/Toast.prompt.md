Quiet confirmation card with a colored tone dot — no icons, no noise. Position it fixed bottom-center yourself.

```jsx
{toast && (
  <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 200 }}>
    <Toast tone="success" title="Dinner logged" description="Your balance moved gently yang." onDismiss={() => setToast(false)} />
  </div>
)}
```

- `tone`: `neutral` | `success` | `warning` | `danger` | `info`
- `title` / `description` / `onDismiss`
