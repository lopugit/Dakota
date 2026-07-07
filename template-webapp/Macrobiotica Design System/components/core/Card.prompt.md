The standard content surface: card background, 1px hairline border, 14px radius, low shadow.

```jsx
<Card>
  <h3>Your balance</h3>
  <BalanceMeter value={0.2} />
</Card>
<Card raised padding={24}>Featured</Card>
```

- `raised`: stronger shadow · `flat`: no shadow (nesting)
- `padding`: default 20
