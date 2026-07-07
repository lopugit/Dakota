Modal dialog with blurred scrim and display-serif title; closes on Escape / scrim click.

```jsx
<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Log dinner"
  footer={<>
    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
    <Button onClick={save}>Save</Button>
  </>}
>
  <Select label="Meal">…</Select>
</Dialog>
```

- `open` / `onClose` / `title` / `footer` / `width` (default 420)
