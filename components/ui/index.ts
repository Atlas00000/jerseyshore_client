/**
 * UI Components Index
 * Central export for all UI primitives
 */

// Button
export {
  Button,
  PrimaryButton,
  SecondaryButton,
  GhostButton,
} from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';

// Card
export {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  StandardCard,
  ElevatedCard,
  GlassCard,
} from './Card';
export type {
  CardProps,
  CardVariant,
  CardHeaderProps,
  CardBodyProps,
  CardFooterProps,
} from './Card';

// Input
export { Input } from './Input';
export type { InputProps } from './Input';

// Textarea
export { Textarea } from './Textarea';
export type { TextareaProps } from './Textarea';

// Select
export { Select } from './Select';
export type { SelectProps, SelectOption } from './Select';

// Panel
export {
  Panel,
  PanelHeader,
  PanelBody,
  PanelFooter,
  SidebarPanel,
  FloatingPanel,
  ModalPanel,
} from './Panel';
export type {
  PanelProps,
  PanelVariant,
  PanelHeaderProps,
  PanelBodyProps,
  PanelFooterProps,
} from './Panel';

// Badge
export {
  Badge,
  PrimaryBadge,
  SuccessBadge,
  WarningBadge,
  ErrorBadge,
  InfoBadge,
} from './Badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from './Badge';

// Loading
export {
  Spinner,
  Skeleton,
  ProgressBar,
  LoadingOverlay,
} from './Loading';
export type {
  SpinnerProps,
  SpinnerSize,
  SkeletonProps,
  ProgressBarProps,
  LoadingOverlayProps,
} from './Loading';

// AnimatedContainer
export {
  AnimatedContainer,
  FadeInContainer,
  SlideUpContainer,
  ScaleInContainer,
} from './AnimatedContainer';
export type { AnimatedContainerProps } from './AnimatedContainer';

// Toast
export { ToastItem, ToastContainer } from './Toast';
export type { Toast, ToastType } from './Toast';

// Tooltip
export { Tooltip } from './Tooltip';

// ConfirmationDialog
export { ConfirmationDialog } from './ConfirmationDialog';

// ProgressIndicator
export { ProgressIndicator } from './ProgressIndicator';

// BottomSheet
export { BottomSheet } from './BottomSheet';

// MobileOptimizedPanel
export { MobileOptimizedPanel } from './MobileOptimizedPanel';

// ResponsiveGrid
export { ResponsiveGrid } from './ResponsiveGrid';

