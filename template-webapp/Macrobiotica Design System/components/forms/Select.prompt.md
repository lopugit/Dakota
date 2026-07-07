Styled native select — chevron affordance, same field chrome as Input.

```jsx
<Select label="Meal" value={meal} onChange={e => setMeal(e.target.value)}>
  <option>Breakfast</option>
  <option>Lunch</option>
  <option>Dinner</option>
</Select>
```

- `label` / `hint` / `error`
- Children are native `<option>`s
