# Card Component Examples

## Basic Usage

```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';

<Card variant="standard">
  <CardHeader>Title</CardHeader>
  <CardBody>Content goes here</CardBody>
  <CardFooter>Footer content</CardFooter>
</Card>
```

## Variants

```tsx
// Standard card with border
<Card variant="standard">Content</Card>

// Elevated card with shadow
<Card variant="elevated">Content</Card>

// Glass morphism effect
<Card variant="glass">Content</Card>
```

## With Hover Effect

```tsx
<Card variant="standard" hover>
  Hover over me
</Card>
```

## Simple Card

```tsx
<Card variant="standard" className="p-4">
  Simple card content
</Card>
```

