# Pricing Table

A component for displaying a pricing table with multiple plans.

## Props

| Prop  | Type  | Default | Description                       |
|-------|-------|---------|-----------------------------------|
| plans | array | []      | An array of plans to display in the table |

### Plan Object

| Prop        | Type     | Default | Description                                 |
|-------------|----------|---------|---------------------------------------------|
| name        | string   |         | The name of the plan                         |
| price       | string   |         | The price of the plan, formatted as a string |
| buttonText  | string   |         | The text to display on the plan's button     |
| buttonClick | function |         | The click handler for the plan's button      |

## Example

```html
<uix-pricing-table
  :plans="[
    {
      name: 'Basic',
      price: '$10/month',
      buttonText: 'Sign Up',
      buttonClick: () => { alert('Sign up for Basic plan'); }
    },
    {
      name: 'Pro',
      price: '$20/month',
      buttonText: 'Sign Up',
      buttonClick: () => { alert('Sign up for Pro plan'); }
    }
  ]"
></uix-pricing-table>
```

The pricing table component displays the plans in a grid layout. On small screens it shows one plan per row, on medium screens it shows two plans per row, and on large screens it shows three plans per row.

Each plan is displayed in a card with the plan name, price, and a sign up button. The button click handler is called when the button is clicked.