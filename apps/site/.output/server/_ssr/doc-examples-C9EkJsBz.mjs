import { __toESM } from "../_runtime.mjs";
import { Accordion, Autocomplete, Command, CommandDialog, CompoundDropdownMenu, DatePicker, Dialog, FileUpload, FormField, NotificationProvider, Popover, Portal, PortalTarget, ResizablePanels, Select, Slider, Stepper, Tabs, Tooltip, useNotification } from "./tooltip-BFesNCNJ.mjs";
import { Backdrop, Button, Card, Carousel, CarouselController, Drawer, ScrollLock, Stack, Transition } from "./carousel-DRWW6spl.mjs";
import { Section } from "./section-Cp-bzptr.mjs";
import { require_react } from "../_libs/react.mjs";
import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/doc-examples-C9EkJsBz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var shippingItems = [
	{
		id: "shipping",
		title: "Shipping",
		content: "Orders ship within two business days."
	},
	{
		id: "returns",
		title: "Returns",
		content: "Return unused items within 30 days."
	},
	{
		id: "support",
		title: "Support",
		content: "Contact our team for help with your order.",
		disabled: true
	}
];
var carouselItems = [
	{
		id: "design",
		title: "Design",
		description: "Start with a clear visual language."
	},
	{
		id: "build",
		title: "Build",
		description: "Compose reusable components."
	},
	{
		id: "test",
		title: "Test",
		description: "Check behavior across devices."
	},
	{
		id: "ship",
		title: "Ship",
		description: "Share your work with the world."
	}
];
var fruitOptions = [
	{
		value: "apple",
		label: "Apple"
	},
	{
		value: "pear",
		label: "Pear"
	},
	{
		value: "orange",
		label: "Orange"
	},
	{
		value: "mango",
		label: "Mango",
		disabled: true
	}
];
var ControlledTooltipExample = () => {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, {
		alignH: "center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
			open,
			onOpenChange: setOpen,
			trigger: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				children: "Focus or hover me"
			}),
			children: "Your changes are saved automatically."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			role: "status",
			children: open ? "Tooltip open" : "Tooltip closed"
		})]
	});
};
var commandItems = [
	{
		id: "new-file",
		label: "New file",
		description: "Create a file in the current project",
		group: "File",
		keywords: ["create"],
		shortcut: "⌘N"
	},
	{
		id: "open-file",
		label: "Open file",
		description: "Browse files in the current project",
		group: "File",
		keywords: ["browse"],
		shortcut: "⌘O"
	},
	{
		id: "settings",
		label: "Settings",
		description: "Configure your workspace",
		group: "Preferences",
		keywords: ["preferences"]
	},
	{
		id: "publish",
		label: "Publish project",
		group: "Project",
		disabled: true
	}
];
var CommandExample = () => {
	const [selected, setSelected] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Command, {
		commands: commandItems,
		autoFocus: false,
		onSelect: (command) => setSelected(command.label)
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		role: "status",
		children: selected ? `Selected: ${selected}` : "Choose a command"
	})] });
};
var CommandDialogExample = () => {
	const [selected, setSelected] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			onClick: () => setSelected(""),
			children: "Open the palette with ⌘K / Ctrl+K"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandDialog, {
			title: "Project commands",
			description: "Search and choose an action.",
			commands: commandItems,
			onSelect: (command) => setSelected(command.label)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			role: "status",
			children: selected ? `Selected: ${selected}` : "No command selected"
		})
	] });
};
var DropdownMenuExample = () => {
	const [showArchived, setShowArchived] = (0, import_react.useState)(false);
	const [density, setDensity] = (0, import_react.useState)("comfortable");
	const [status, setStatus] = (0, import_react.useState)("Choose an action");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CompoundDropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompoundDropdownMenu.Trigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			children: "Project options"
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CompoundDropdownMenu.Content, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompoundDropdownMenu.Label, { children: "Project" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CompoundDropdownMenu.Group, {
			"aria-label": "Project actions",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompoundDropdownMenu.Item, {
				onSelect: () => setStatus("Edit project"),
				children: "Edit project"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompoundDropdownMenu.Item, {
				onSelect: () => setStatus("Duplicate project"),
				children: "Duplicate project"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompoundDropdownMenu.Separator, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompoundDropdownMenu.CheckboxItem, {
			checked: showArchived,
			onCheckedChange: setShowArchived,
			children: "Show archived"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CompoundDropdownMenu.RadioGroup, {
			value: density,
			onValueChange: setDensity,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompoundDropdownMenu.Label, { children: "Density" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompoundDropdownMenu.RadioItem, {
					value: "comfortable",
					children: "Comfortable"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompoundDropdownMenu.RadioItem, {
					value: "compact",
					children: "Compact"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompoundDropdownMenu.Separator, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompoundDropdownMenu.Item, {
			variant: "danger",
			onSelect: () => setStatus("Delete project"),
			children: "Delete project"
		})
	] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		role: "status",
		children: [
			status,
			"; archived ",
			showArchived ? "shown" : "hidden",
			"; ",
			density,
			" density"
		]
	})] });
};
var ControlledPopoverExample = () => {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popover, {
		open,
		onOpenChange: setOpen,
		title: "Ready to continue?",
		trigger: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Review changes" }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Your changes are ready to save." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			onClick: () => setOpen(false),
			children: "Done"
		})] })
	});
};
var ControlledTabsExample = () => {
	const [activeId, setActiveId] = (0, import_react.useState)("overview");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
		activeId,
		onActivate: setActiveId,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs.Tab, {
			id: "overview",
			tab: "Overview",
			children: ["Selected tab: ", activeId]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs.Tab, {
			id: "details",
			tab: "Details",
			children: ["Selected tab: ", activeId]
		})]
	});
};
var ControlledAccordionExample = () => {
	const [value, setValue] = (0, import_react.useState)("shipping");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		variant: "outline",
		onClick: () => setValue("returns"),
		children: "Show returns"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
		items: shippingItems,
		type: "single",
		value,
		onValueChange: setValue
	})] });
};
var ControlledCarouselExample = () => {
	const [panel, setPanel] = (0, import_react.useState)(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		variant: "outline",
		onClick: () => setPanel(0),
		children: "Back to first item"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarouselController, {
		items: carouselItems,
		currentPanel: panel,
		onPanelChange: setPanel,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Carousel, {
			getItemKey: (item) => item.id,
			renderItem: (item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.description })] }),
			backButton: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				children: "Previous"
			}),
			nextButton: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				children: "Next"
			}),
			buttonAlignment: "aside",
			renderPager: (current, total) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				role: "status",
				children: [
					"Page ",
					current + 1,
					" of ",
					total
				]
			})
		})
	})] });
};
var ControlledStepperExample = () => {
	const [activeStep, setActiveStep] = (0, import_react.useState)(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stepper, {
			activeStep,
			onStepChange: setActiveStep,
			clickable: true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stepper.Step, { label: "Details" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stepper.Step, { label: "Shipping" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stepper.Step, { label: "Payment" })
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, {
			direction: "row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				disabled: activeStep === 0,
				onClick: () => setActiveStep(activeStep - 1),
				children: "Back"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				disabled: activeStep === 2,
				onClick: () => setActiveStep(activeStep + 1),
				children: "Continue"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			role: "status",
			children: [
				"Step ",
				activeStep + 1,
				" of 3"
			]
		})
	] });
};
var ControlledSliderExample = () => {
	const [volume, setVolume] = (0, import_react.useState)(40);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
		label: "Volume",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
			value: volume,
			onChange: setVolume,
			showValue: true,
			formatValue: (value) => value + "%"
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		role: "status",
		children: [
			"Selected volume: ",
			volume,
			"%"
		]
	})] });
};
var ControlledResizablePanelsExample = () => {
	const [sizes, setSizes] = (0, import_react.useState)([30, 70]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: {
			width: "100%",
			height: "12rem",
			border: "1px solid var(--puzzle-color-border)"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ResizablePanels, {
			sizes,
			onSizesChange: setSizes,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResizablePanels.Panel, {
					minSize: 20,
					style: { padding: "var(--puzzle-space-4)" },
					children: "Navigation"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResizablePanels.Handle, {
					withGrip: true,
					"aria-label": "Resize navigation"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResizablePanels.Panel, {
					minSize: 40,
					style: { padding: "var(--puzzle-space-4)" },
					children: "Content"
				})
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, {
		direction: "row",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			role: "status",
			children: ["Sizes: ", sizes.map((size) => Math.round(size) + "%").join(" / ")]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			onClick: () => setSizes([30, 70]),
			children: "Reset"
		})]
	})] });
};
var ControlledSelectExample = () => {
	const [fruit, setFruit] = (0, import_react.useState)("apple");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
		label: "Favorite fruit",
		options: fruitOptions,
		value: fruit,
		onChange: setFruit
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		role: "status",
		children: ["Selected: ", fruit ?? "none"]
	})] });
};
var ControlledDatePickerExample = () => {
	const [date, setDate] = (0, import_react.useState)(new Date(2025, 2, 15));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatePicker, {
		label: "Appointment",
		locale: "en-GB",
		value: date,
		onChange: setDate,
		clearable: true
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		role: "status",
		children: date ? `Selected: ${date.toLocaleDateString("en-GB")}` : "No date selected"
	})] });
};
var DatePickerFormExample = () => {
	const [submittedDate, setSubmittedDate] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
		onSubmit: (event) => {
			event.preventDefault();
			const data = new FormData(event.currentTarget);
			setSubmittedDate(String(data.get("appointment")));
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatePicker, {
				label: "Appointment date",
				name: "appointment",
				locale: "en-GB",
				defaultValue: new Date(2025, 2, 15),
				required: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				children: "Submit appointment"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				role: "status",
				children: submittedDate ? `Submitted: ${submittedDate}` : "Not submitted"
			})
		] })
	});
};
var FileUploadSelectionExample = () => {
	const [files, setFiles] = (0, import_react.useState)([]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUpload, {
		multiple: true,
		onChange: setFiles
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		role: "status",
		children: files.length ? `Selected: ${files.map((file) => file.name).join(", ")}` : "No files selected"
	})] });
};
var FileUploadProgressExample = () => {
	const attemptedFiles = (0, import_react.useRef)(/* @__PURE__ */ new WeakSet());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUpload, {
		multiple: true,
		description: "Local simulation: each file fails once. Retry to complete it. No files are sent.",
		onUpload: async (file, { signal, onProgress }) => {
			const firstAttempt = !attemptedFiles.current.has(file);
			attemptedFiles.current.add(file);
			for (const progress of [
				25,
				50,
				75,
				100
			]) {
				await new Promise((resolve) => setTimeout(resolve, 250));
				signal.throwIfAborted();
				onProgress(progress);
				if (firstAttempt && progress === 50) throw new Error("Simulated failure. Retry this upload.");
			}
		}
	});
};
var AutocompleteExample = () => {
	const [value, setValue] = (0, import_react.useState)();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Autocomplete, {
		label: "Fruit",
		options: fruitOptions,
		value,
		onChange: setValue
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		role: "status",
		children: ["Selected: ", value ?? "none"]
	})] });
};
var DialogExample = () => {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		onClick: () => setOpen(true),
		children: "Open dialog"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: setOpen,
		title: "Review changes",
		description: "Check your changes before continuing.",
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			onClick: () => setOpen(false),
			children: "Done"
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Your changes are ready." })
	})] });
};
var DrawerExample = () => {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		onClick: () => setOpen(true),
		children: "Open drawer"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer, {
		open,
		onOpenChange: setOpen,
		position: "right",
		"aria-label": "Filters",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Filter your results." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			onClick: () => setOpen(false),
			children: "Close filters"
		})] }) })
	})] });
};
var BackdropExample = () => {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		onClick: () => setOpen(true),
		children: "Show backdrop"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Backdrop, {
		open,
		onClose: () => setOpen(false),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			onClick: () => setOpen(false),
			children: "Close backdrop"
		})
	})] });
};
var NotificationExampleControls = () => {
	const notification = useNotification();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, {
		direction: "row",
		wrap: "wrap",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => notification.success("Changes saved"),
				children: "Show success"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => notification.error("Could not save", { duration: 0 }),
				children: "Show error"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				onClick: notification.dismissAll,
				children: "Dismiss all"
			})
		]
	});
};
var NotificationExample = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationProvider, {
	label: "Example notifications",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationExampleControls, {})
});
var TransitionExample = () => {
	const [visible, setVisible] = (0, import_react.useState)(true);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		onClick: () => setVisible((current) => !current),
		children: "Toggle content"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Transition, {
		visible,
		template: "slide-in-up",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: "Animated content" })
	})] });
};
var ScrollLockExample = () => {
	const [enabled, setEnabled] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollLock, { enabled }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			onClick: () => setEnabled((current) => !current),
			children: enabled ? "Unlock preview scrolling" : "Lock preview scrolling"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Scroll the preview, enable the lock, then try scrolling again." }),
		Array.from({ length: 10 }, (_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Example paragraph ", index + 1] }, index))
	] });
};
var PortalExample = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalTarget, {
	id: "documentation-portal-target",
	"aria-label": "Portal destination"
}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, {
	targetId: "documentation-portal-target",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: "This content is rendered inside the target." })
})] });
export { AutocompleteExample, BackdropExample, CommandDialogExample, CommandExample, ControlledAccordionExample, ControlledCarouselExample, ControlledDatePickerExample, ControlledPopoverExample, ControlledResizablePanelsExample, ControlledSelectExample, ControlledSliderExample, ControlledStepperExample, ControlledTabsExample, ControlledTooltipExample, DatePickerFormExample, DialogExample, DrawerExample, DropdownMenuExample, FileUploadProgressExample, FileUploadSelectionExample, NotificationExample, PortalExample, ScrollLockExample, TransitionExample, carouselItems, fruitOptions, shippingItems };
