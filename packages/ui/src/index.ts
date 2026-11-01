// #region Actions

export type {
  ButtonVariant,
  ButtonSize,
} from "./components/actions/button/button.types";
export { Button, type ButtonProps } from "./components/actions/button";

// #endregion Actions

// #region Data Display
export {
  ButtonGroup,
  type ButtonGroupProps,
} from "./components/actions/button-group";

export {
  Avatar,
  type AvatarProps,
  type AvatarShape,
} from "./components/data-display/avatar";
export {
  Badge,
  type BadgeProps,
  type BadgeColor,
  type AnchorOrigin,
  type AnchorOverlap,
} from "./components/data-display/badge";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
  CardMedia,
  type CardVariant,
  type CardSize,
  type CardOrientation,
  type CardPartProps,
  type CardProps,
} from "./components/data-display/card";

export { Paper, type PaperProps } from "./components/data-display/paper";

export type { ProgressProps } from "./components/data-display/progress/types";

export {
  CircularProgress,
  type CircularProgressProps,
  type CircularProgressSize,
} from "./components/data-display/progress/circular-progress";

export {
  LinearProgress,
  type LinearProgressProps,
} from "./components/data-display/progress/linear-progress";

export {
  Skeleton,
  type SkeletonProps,
  type SkeletonRadius,
} from "./components/data-display/skeleton";

// #endregion Data Display

// #region Editors

export {
  TextEditor,
  type TextEditorProps,
} from "./components/editors/text-editor";
export {
  TextEditorToolbar,
  type TextEditorToolbarProps,
} from "./components/editors/text-editor/text-editor-toolbar";
export {
  TextRenderer,
  type TextRendererProps,
} from "./components/editors/text-editor/text-renderer";
export type {
  TextMark,
  TextInline,
  TextBlockType,
  TextAlign,
  TextListType,
  TextBlock,
  TextDocument,
  TextPoint,
  TextSelection,
  TextBlockVariant,
} from "./components/editors/text-editor/text-editor.types";

// #endregion Editors

// #region Forms

export {
  Checkbox,
  type CheckboxProps,
  type CheckboxSize,
} from "./components/forms/checkbox";

export {
  NumberInput,
  type NumberInputProps,
  TextAreaInput,
  type TextAreaInputProps,
  TextInput,
  type TextInputProps,
} from "./components/forms/input";

export { Label, type LabelProps } from "./components/forms/label";

export {
  Select,
  type SelectOption,
  type SelectProps,
  type SelectSingleProps,
  type SelectMultipleProps,
  type SelectSize,
} from "./components/forms/select";

export {
  Stepper,
  type StepperProps,
  type StepperStepProps,
  type StepperOrientation,
} from "./components/forms/stepper";

export {
  Switch,
  type SwitchProps,
  type SwitchSize,
} from "./components/forms/switch";

// #endregion Forms

// #region Layout

export {
  AppBar,
  type AppBarProps,
  type AppBarNavigationItem,
} from "./components/layout/app-bar";

export {
  BottomNavigation,
  type BottomNavigationProps,
  BottomNavigationItem,
  type BottomNavigationItemProps,
} from "./components/layout/bottom-navigation";

export {
  Breadcrumbs,
  type BreadcrumbsProps,
  type BreadcrumbItem,
} from "./components/layout/breadcrumbs";

export { Container, type ContainerProps } from "./components/layout/container";

export {
  PageLayout,
  type PageLayoutProps,
  type SidebarPlacement,
} from "./components/layout/page-layout";

export { Section } from "./components/layout/section";
export type {
  SectionTheme,
  SectionProps,
} from "./components/layout/section/types";
export {
  SectionStack,
  type SectionStackProps,
} from "./components/layout/section-stack";

export { Sidebar, type SidebarProps } from "./components/layout/sidebar";

export {
  Stack,
  type StackProps,
  type ResponsiveDirection,
  type StackMainAlignment,
  type StackCrossAlignment,
} from "./components/layout/stack";

// #endregion Layout

// #region Navigation

export {
  Accordion,
  type AccordionProps,
  type AccordionItemData,
  type AccordionType,
} from "./components/navigation/accordion";

export {
  Carousel,
  type CarouselProps,
  type CarouselAlignment,
  type CarouselButtonAlignment,
  type CarouselPagerAlignment,
  type CarouselAlignmentConfig,
  type PagerAlignmentConfig,
} from "./components/navigation/carousel";
export {
  CarouselController,
  useCarouselContext,
  type CarouselControllerProps,
  type CarouselContextValue,
} from "./components/navigation/carousel/controller";

export {
  Tabs,
  TabsTab,
  type TabsProps,
  type TabsTabProps,
  type TabsPosition,
} from "./components/navigation/tabs";

// #endregion Navigation

// #region Overlays

export { Backdrop, type BackdropProps } from "./components/overlays/backdrop";

export { Dialog, type DialogProps } from "./components/overlays/dialog";

export { Drawer, type DrawerProps } from "./components/overlays/drawer";

export {
  Popout,
  type PopoutProps,
  type PopoutPosition,
  type PopoutAlignment,
  type PopoutAction,
  type PopoutTriggerProps,
} from "./components/overlays/popout";

export { Portal, type PortalProps } from "./components/overlays/portal";
export {
  PortalTarget,
  type PortalTargetProps,
} from "./components/overlays/portal/target";

export {
  Tooltip,
  type TooltipProps,
  type TooltipContentProps,
  type TooltipArrowSide,
} from "./components/overlays/tooltip";

// #endregion Overlays

// #region Typography

export {
  Text,
  type TextProps,
  type TextType,
} from "./components/typography/text";

export {
  Heading,
  type HeadingProps,
  type HeadingLevel,
} from "./components/typography/heading";

// #endregion Typography

// #region Utilities

export {
  Preview,
  type PreviewProps,
  type PreviewDevice,
} from "./components/utilities/preview";

export {
  ScrollLock,
  type ScrollLockProps,
} from "./components/utilities/scroll-lock";

export {
  Transition,
  type TransitionProps,
  type TransitionPhase,
  type TransitionTemplate,
} from "./components/utilities/transition";

// #endregion Utilities
