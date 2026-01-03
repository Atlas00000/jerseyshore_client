# Button Component Examples

## Basic Usage

```tsx
import { Button } from '@/components/ui/Button';

// Primary button
<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>

// Secondary button
<Button variant="secondary" onClick={handleClick}>
  Cancel
</Button>

// Ghost button
<Button variant="ghost" onClick={handleClick}>
  Learn More
</Button>
```

## Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

## With Icons

```tsx
<Button
  variant="primary"
  icon={<SaveIcon />}
  iconPosition="left"
>
  Save
</Button>

<Button
  variant="primary"
  icon={<ArrowIcon />}
  iconPosition="right"
>
  Next
</Button>
```

## Loading State

```tsx
<Button variant="primary" loading={isLoading}>
  Submit
</Button>
```

## Full Width

```tsx
<Button variant="primary" fullWidth>
  Full Width Button
</Button>
```

## Disabled State

```tsx
<Button variant="primary" disabled>
  Disabled Button
</Button>
```

