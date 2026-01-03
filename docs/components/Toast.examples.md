# Toast Notification Examples

## Basic Usage

```tsx
import { toast } from '@/stores/toastStore';

// Success toast
toast.success('Design saved successfully!');

// Error toast
toast.error('Failed to save design');

// Warning toast
toast.warning('Unsaved changes will be lost');

// Info toast
toast.info('New features available');
```

## With Action Button

```tsx
toast.success('Design saved', {
  action: {
    label: 'View',
    onClick: () => navigate('/designs'),
  },
});
```

## Custom Duration

```tsx
toast.info('Auto-dismiss in 3 seconds', {
  duration: 3000,
});
```

## Persistent Toast

```tsx
toast.error('Critical error occurred', {
  duration: 0, // No auto-dismiss
});
```

