# Overlay guidelines

Puzzle provides several overlay components. Choose the component based on
interaction semantics rather than visual appearance.

## Dialog

Use Dialog for modal interactions that require the user's attention or input.

Examples:

- Confirmation
- Forms
- Multi-step workflows
- Important information requiring a response

Dialogs should have:

- An accessible title
- A meaningful description when useful
- A visible close affordance when dismissal is allowed
- Focus contained while open
- Focus restored when closed

## Drawer

Use Drawer for modal panels attached to a viewport edge.

Examples:

- Mobile navigation
- Settings panels
- Filters
- Secondary workflows

Drawers must have an accessible name through `aria-label` or `aria-labelledby`.

## Popover

Use Popover for interactive non-modal content anchored to a trigger.

Examples:

- Date selection
- Contextual forms
- Actions
- Additional information containing controls

Do not use Popover for modal workflows.

## Popout

Popout is a low-level floating positioning primitive.

Use it when implementing a component that needs:

- Anchored positioning
- Collision detection
- Custom trigger behavior
- Custom content behavior

Prefer higher-level components when their semantics fit.

## Tooltip

Use Tooltip only for short, supplementary, non-interactive information.

Do not place buttons, links, inputs, or other interactive elements inside a Tooltip.

Use Popover for interactive content.

## Accessibility checklist

Every overlay should be tested for:

- Keyboard operation
- Escape handling
- Focus restoration
- Screen reader naming
- Nested overlay behavior
- Pointer and touch interactions
- Reduced motion
- High contrast
- Scroll and resize behavior
- Trigger removal while open
