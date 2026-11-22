// #region Actions

export type {
  ButtonVariant,
  ButtonSize,
} from "./components/actions/button/button.types";
export { Button, type ButtonProps } from "./components/actions/button";

export {
  ButtonGroup,
  type ButtonGroupProps,
} from "./components/actions/button-group";

export {
  ToggleGroup,
  type ToggleGroupProps,
  type ToggleGroupSingleProps,
  type ToggleGroupMultipleProps,
  type ToggleGroupItemProps,
  type ToggleGroupSize,
  type ToggleGroupOrientation,
} from "./components/actions/toggle-group";

// #endregion Actions

// #region Data Display
export {
  CaseStudyCard,
  CompanyInfo,
  ContactDetails,
  BusinessImageView,
  LogoCollection,
  MetricList,
  ProfileCard,
  ServiceCard,
  SocialLinks,
  type BusinessContactItem,
  type BusinessImage,
  type BusinessImageViewProps,
  type BusinessLogoItem,
  type BusinessMetricItem,
  type BusinessSocialLink,
  type CaseStudyCardProps,
  type CompanyInfoProps,
  type LogoCollectionProps,
  type ProfileCardProps,
  type ServiceCardProps,
} from "./components/business";

export {
  Alert,
  type AlertProps,
  type AlertSeverity,
  type AlertVariant,
} from "./components/data-display/alert";

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
  type AnchorOffset,
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

export {
  EmptyState,
  EmptyStateHeader,
  EmptyStateMedia,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateContent,
  type EmptyStateProps,
  type EmptyStateSize,
  type EmptyStateVariant,
  type EmptyStateMediaProps,
  type EmptyStateMediaVariant,
} from "./components/data-display/empty-state";

export {
  DataTable,
  type DataTableCellValue,
  type DataTableColumnSize,
  type DataTableProps,
  type DataTableSortDirection,
  type DataTableSortState,
} from "./components/data-display/data-table";

export {
  Image,
  type ImageProps,
  type ImageSource,
  type ImageSourceData,
  type ImageSourceSet,
  type ImageFit,
  type ImageRadius,
  type ImagePlaceholder,
} from "./components/data-display/image";

export {
  ImageBox,
  type ImageBoxImage,
  type ImageBoxProps,
} from "./components/data-display/image-box";

export {
  MediaFrame,
  type MediaFrameProps,
  type MediaFrameType,
} from "./components/data-display/media-frame";

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
  Rating,
  type RatingProps,
  type RatingSize,
} from "./components/data-display/rating";

export {
  Skeleton,
  type SkeletonProps,
  type SkeletonRadius,
} from "./components/data-display/skeleton";

// #endregion Data Display

// #region Editors

export {
  JsonEditor,
  type JsonEditorError,
  type JsonEditorProps,
  type JsonEditorResult,
  type JsonValue,
} from "./components/editors/json-editor";

export {
  TextEditor,
  type TextEditorProps,
} from "./components/editors/text-editor";
export { useTextEditor } from "./components/editors/text-editor";
export type {
  TextEditorHandle,
  TextEditorCommands,
} from "./components/editors/text-editor/editor";
export {
  TextEditorToolbar,
  type TextEditorToolbarProps,
} from "./components/editors/text-editor/text-editor-toolbar";
export {
  TextRenderer,
  type TextRendererProps,
} from "./components/editors/text-editor/text-renderer";
export {
  MAX_TEXT_LIST_INDENT,
  createTextDocument,
  normalizeTextDocument,
  normalizeTextSelection,
  validateTextDocument,
  setBlockType,
  insertHorizontalRule,
  clearFormatting,
  deleteTextAtSelection,
  getTextStatistics,
  getSlashCommandAtSelection,
  findTextInDocument,
  replaceAllText,
  applyListType,
  setListType,
  removeList,
  setListAttributes,
  setListChecked,
  setListInteractive,
  setListIndent,
  setBlockIndent,
  toggleListItemChecked,
  splitListItemAtSelection,
  mergeListItemBackward,
  applyMarkdownShortcut,
  getListType,
  getListSelectionState,
} from "./components/editors/text-editor/text-document";
export {
  parseHtmlToDocument,
  parseMarkdownToDocument,
  serializeTextDocumentToHtml,
  serializeTextDocumentToMarkdown,
} from "./components/editors/text-editor/text-parser";
export type {
  TextMark,
  TextLink,
  TextInline,
  TextBlockType,
  TextAlign,
  TextListType,
  TextListIcon,
  TextListAttributes,
  TextHeadingLevel,
  TextBlock,
  TextDocument,
  TextPoint,
  TextSelection,
  TextTransaction,
  TextDocumentValidationIssue,
  TextDocumentValidationResult,
  TextListSelectionState,
  TextDocumentStatistics,
  TextSearchOptions,
  TextSearchMatch,
  TextSlashCommandMatch,
  TextEditorShortcutCommand,
  TextEditorShortcutModifier,
  TextEditorShortcut,
  TextBlockVariant,
} from "./components/editors/text-editor/text-editor.types";

// #endregion Editors

// #region Forms

export {
  Autocomplete,
  type AutocompleteProps,
  type AutocompleteSingleProps,
  type AutocompleteMultipleProps,
  type AutocompleteOption,
  type AutocompleteValue,
  type AutocompleteSize,
  type AutocompleteInputChangeReason,
  type AutocompleteOptionRenderState,
} from "./components/forms/autocomplete";

export {
  Checkbox,
  type CheckboxProps,
  type CheckboxSize,
} from "./components/forms/checkbox";

export {
  ColorPicker,
  type ColorPickerProps,
  type ColorPickerFormat,
  type ColorPickerSwatch,
} from "./components/forms/color-picker";

export {
  DatePicker,
  type DatePickerProps,
  type DatePickerSize,
} from "./components/forms/date-picker";

export {
  DateRangePicker,
  type DateRange,
  type DateRangeDayState,
  type DateRangePickerProps,
  type DateRangePickerSize,
} from "./components/forms/date-range-picker";

export {
  FieldArray,
  RepeaterField,
  type FieldArrayItemContext,
  type FieldArrayProps,
} from "./components/forms/field-array";

export {
  FileUpload,
  type FileUploadProps,
  type FileUploadItem,
  type FileUploadStatus,
  type FileUploadRejection,
  type FileUploadRejectionCode,
  type FileUploadUploadContext,
  type FileUploadUploadHandler,
} from "./components/forms/file-upload";

export {
  ImageCropper,
  type ImageCrop,
  type ImageCropAspectRatio,
  type ImageCropAspectRatioPreset,
  type ImageCropperProps,
} from "./components/forms/image-cropper";

export {
  ImageHotspotEditor,
  type ImageHotspot,
  type ImageHotspotEditorProps,
  type ImageHotspotEditorValue,
  type ImageHotspotData,
  type NormalizedImagePoint,
  type NormalizedImageRect,
} from "./components/forms/image-hotspot-editor";

export {
  ImageUpload,
  type ImageUploadContext,
  type ImageUploadHandler,
  type ImageUploadProps,
  type ImageUploadResult,
  type ImageUploadStatus,
} from "./components/forms/image-upload";

export type {
  ImageOutputFormat,
  ImageProcessingResult,
  ImageVariantProfile,
} from "@puzzle-ui/media/browser";

export {
  VideoUpload,
  type VideoUploadContext,
  type VideoUploadHandler,
  type VideoUploadProps,
  type VideoUploadServerStatus,
  type VideoUploadSession,
  type VideoUploadStatus,
} from "./components/forms/video-upload";

export type {
  CreateVideoPosterOptions,
  VideoMetadata,
  VideoPosterResult,
} from "@puzzle-ui/media/browser";

export { FormField, type FormFieldProps } from "./components/forms/form-field";

export {
  InputGroup,
  type InputGroupProps,
  type InputGroupAddonProps,
  type InputGroupAddonAlign,
} from "./components/forms/input-group";

export {
  NumberInput,
  type NumberInputProps,
  TextAreaInput,
  type TextAreaInputProps,
  TextInput,
  type TextInputProps,
  type TextInputType,
} from "./components/forms/input";

export { Label, type LabelProps } from "./components/forms/label";

export {
  RadioGroup,
  Radio,
  type RadioGroupProps,
  type RadioProps,
  type RadioGroupOrientation,
  type RadioGroupSize,
} from "./components/forms/radio-group";

export {
  Select,
  type SelectOption,
  type SelectProps,
  type SelectSingleProps,
  type SelectMultipleProps,
  type SelectSize,
} from "./components/forms/select";

export {
  Slider,
  type SliderProps,
  type SliderMark,
  type SliderSize,
} from "./components/forms/slider";

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

export {
  TimePicker,
  type TimePickerProps,
  type TimePickerSize,
} from "./components/forms/time-picker";

export {
  TokenInput,
  type TokenInputProps,
  type TokenInputMode,
  type TokenInputSize,
} from "./components/forms/token-input";

// #endregion Forms

// #region Layout

export {
  AppBar,
  type AppBarProps,
  type AppBarNavigationItem,
} from "./components/layout/app-bar";

export {
  AspectRatio,
  type AspectRatioProps,
} from "./components/layout/aspect-ratio";

export {
  Background,
  type BackgroundProps,
  type BackgroundPattern,
  type BackgroundFade,
  type BackgroundMeshColors,
} from "./components/layout/background";

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

export {
  CollapsableSidebar,
  type CollapsableSidebarProps,
  type CollapsableSidebarItem,
  type CollapsableSidebarGroup,
  type CollapsableSidebarEntry,
  type CollapsableSidebarExpansion,
  type SidebarItemBase,
  type WithLink,
  type WithClickHandler,
} from "./components/layout/collapsable-sidebar";

export { Container, type ContainerProps } from "./components/layout/container";

export {
  Grid,
  GridItem,
  type GridProps,
  type GridItemProps,
  type GridGap,
  type GridAlignment,
  type GridTracks,
  type GridSpan,
  type GridLine,
  type GridAutoFlow,
} from "./components/layout/grid";

export {
  PageLayout,
  type PageLayoutProps,
  type SidebarPlacement,
} from "./components/layout/page-layout";

export {
  ResizablePanels,
  ResizablePanel,
  ResizableHandle,
  type ResizablePanelsProps,
  type ResizablePanelProps,
  type ResizableHandleProps,
  type ResizablePanelsOrientation,
} from "./components/layout/resizable-panels";

export {
  ScrollArea,
  type ScrollAreaProps,
  type ScrollAreaOrientation,
} from "./components/layout/scroll-area";

export { Section } from "./components/layout/section";
export type {
  SectionTheme,
  SectionProps,
} from "./components/layout/section/types";
export {
  SectionHeader,
  type SectionHeaderAlignment,
  type SectionHeaderProps,
} from "./components/layout/section-header";
export {
  SectionStack,
  type SectionStackProps,
} from "./components/layout/section-stack";

export {
  Separator,
  type SeparatorProps,
  type SeparatorOrientation,
} from "./components/layout/separator";

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
  type AccordionItemId,
  type AccordionValue,
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

export { Link, type LinkProps } from "./components/navigation/link";

export {
  Pagination,
  type PaginationProps,
} from "./components/navigation/pagination";

export {
  Tabs,
  TabsTab,
  type TabsProps,
  type TabsTabProps,
  type TabsPosition,
} from "./components/navigation/tabs";

export {
  TreeView,
  type TreeViewProps,
  type TreeViewItem,
  type TreeViewItemState,
  type TreeViewSelectionMode,
  type TreeViewSize,
} from "./components/navigation/tree-view";

export {
  SortableTree,
  type SortableTreeProps,
  type SortableTreeItem,
  type SortableTreeItemState,
  type SortableTreeMove,
  type SortableTreeDropPosition,
  type SortableTreeSelectionMode,
  type SortableTreeSize,
} from "./components/navigation/sortable-tree";

// #endregion Navigation

// #region Overlays

export { Backdrop, type BackdropProps } from "./components/overlays/backdrop";

export {
  Command,
  CommandDialog,
  type CommandItem,
  type CommandProps,
  type CommandDialogProps,
} from "./components/overlays/command";

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "./components/overlays/context-menu";

export type {
  ContextMenuProps,
  ContextMenuTriggerProps,
  ContextMenuContentProps,
  ContextMenuItemProps,
  ContextMenuGroupProps,
  ContextMenuLabelProps,
  ContextMenuSeparatorProps,
  ContextMenuCheckboxItemProps,
  ContextMenuRadioGroupProps,
  ContextMenuRadioItemProps,
  ContextMenuSubProps,
  ContextMenuSubTriggerProps,
  ContextMenuSubContentProps,
  ContextMenuItemVariant,
  ContextMenuCheckedState,
} from "./components/overlays/context-menu";

export { Dialog, type DialogProps } from "./components/overlays/dialog";

export { Drawer, type DrawerProps } from "./components/overlays/drawer";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "./components/overlays/dropdown-menu";

export type {
  DropdownMenuProps,
  DropdownMenuTriggerProps,
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuGroupProps,
  DropdownMenuLabelProps,
  DropdownMenuSeparatorProps,
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuPosition,
  DropdownMenuAlignment,
  DropdownMenuItemVariant,
  DropdownMenuCheckedState,
} from "./components/overlays/dropdown-menu";

export {
  Notification,
  NotificationViewport,
  type NotificationProps,
  type NotificationViewportProps,
  type NotificationItem,
  NotificationProvider,
  useNotification,
  type NotificationSeverity,
  type NotificationPosition,
  type NotificationAction,
  type NotificationOptions,
  type NotificationInput,
  type NotificationProviderProps,
} from "./components/overlays/notification";

export {
  Popout,
  type PopoutProps,
  type PopoutPosition,
  type PopoutAlignment,
  type PopoutAction,
  type PopoutTriggerProps,
} from "./components/overlays/popout";

export { Portal, type PortalProps } from "./components/overlays/portal";
export { Popover, type PopoverProps } from "./components/overlays/popover";
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
  PreviewProvider,
  type PreviewProps,
  type PreviewProviderProps,
  type PreviewDevice,
  type PreviewAlign,
  type PreviewJustify,
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

export {
  FoldBoundary,
  FoldProvider,
  type FoldBoundaryProps,
  type FoldProviderProps,
  type FoldProviderVisibilityOptions,
} from "./components/utilities/rendering/fold";

export {
  DeferredBoundary,
  type DeferredActivationStrategy,
  type DeferredBoundaryProps,
  type DeferredComponentLoader,
  type DeferredComponentModule,
  type DeferredErrorFallback,
} from "./components/utilities/rendering/deferred";

export {
  SsrBoundary,
  type SsrBoundaryProps,
} from "./components/utilities/rendering/ssr";

export {
  StaticBoundary,
  type StaticBoundaryProps,
} from "./components/utilities/rendering/static";

// #endregion Utilities
