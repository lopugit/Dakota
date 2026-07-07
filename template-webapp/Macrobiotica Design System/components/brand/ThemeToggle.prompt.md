Light/dark theme toggle (moon ↔ sun). Sets `data-theme` on `<html>`, persists to localStorage key `mb-theme`.

```jsx
<ThemeToggle />
```

Restore on page load with:

```html
<script>
  document.documentElement.setAttribute('data-theme', (function(){ try { return localStorage.getItem('mb-theme') || 'light'; } catch(e) { return 'light'; } })());
</script>
```
