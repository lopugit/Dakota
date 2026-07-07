Selectable filter chip; active state inverts to ink. Use in rows for category filters.

```jsx
<Tag active={cat === 'grains'} onClick={() => setCat('grains')}>Grains</Tag>
<Tag onRemove={() => remove(id)}>Miso</Tag>
```

- `active`: selected → ink background
- `onRemove`: shows a small ×
