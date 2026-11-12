import { FileUploadProgressExample, FileUploadSelectionExample } from "./doc-examples-C9EkJsBz.mjs";
import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/file-upload.mdx_macro_id_src_2Flib_2Fsource-BFOT399l.js
var import_jsx_runtime = require_jsx_runtime();
var frontmatter = {
	"title": "File Upload",
	"description": "Select, validate, and upload files with a keyboard-accessible dropzone."
};
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "File Upload supports native file selection, drag and drop, client-side validation, and optional automatic uploads. Without an `onUpload` handler, accepted files are listed as **Ready to upload**; the component does not send them anywhere."
		},
		{
			"heading": "basic-usage",
			"content": "Click the dropzone, press Enter or Space while it is focused, or drop a file onto it. Use `title`, `description`, and `browseLabel` to explain what to select."
		},
		{
			"heading": "basic-usage",
			"content": "Single-file mode is the default: a new accepted file replaces the previous selection and aborts its in-progress upload. A rejected file does not replace the current selection. Each listed file has a Remove button."
		},
		{
			"heading": "multiple-files-and-selection-changes",
			"content": "Set `multiple` to append accepted files across selections. `onChange` receives the entire accepted `File[]` whenever files are added, replaced, or removed, including `[]` after removing the last file."
		},
		{
			"heading": "multiple-files-and-selection-changes",
			"content": "The file list is managed internally; there are no controlled `value` or `defaultValue` props. Upload progress and completion do not call `onChange`."
		},
		{
			"heading": "accepted-types-and-limits",
			"content": "`accept` is an array of MIME types such as `\"application/pdf\"` or wildcards such as `\"image/*\"`. File extensions such as `\".png\"` are not supported by the component's validator. Files with an empty MIME type are rejected when an accept filter is configured."
		},
		{
			"heading": "accepted-types-and-limits",
			"content": "`maxFileSize` limits each file, `maxTotalSize` limits the combined selected size, and `maxFiles` limits the count in multiple mode. Sizes are in bytes. Files are evaluated in selection order: valid files that fit are accepted, while rejected files are reported separately."
		},
		{
			"heading": "accepted-types-and-limits",
			"content": "Rejections appear in an alert with the filename and reason. `onReject` receives the rejected files for that selection. New selections replace previous rejection messages; removing a selected file does not clear them."
		},
		{
			"heading": "accepted-types-and-limits",
			"content": "These are client-side checks for user feedback, not a security boundary. Validate file contents, types, sizes, and permissions again on your server."
		},
		{
			"heading": "automatic-uploads-progress-and-retry",
			"content": "Provide `onUpload` to start uploading each accepted file automatically. The handler receives the file and `{ signal, onProgress }`. Report progress from `0` to `100`; resolve the promise on success and reject it on failure. Error messages are displayed alongside a Retry button, which calls the handler again for that file."
		},
		{
			"heading": "automatic-uploads-progress-and-retry",
			"content": "The following local simulation intentionally fails each file's first attempt. Select a file to see progress and error feedback, then retry to complete it. **No file data is sent anywhere.**"
		},
		{
			"heading": "automatic-uploads-progress-and-retry",
			"content": "Files upload independently. Progress is clamped to `0`-`100`, and resolving the handler marks the file complete at `100`. Removing a file, replacing it in single mode, or unmounting aborts its signal; pass that signal to your network client to cancel the actual request. Late results from aborted attempts are ignored."
		},
		{
			"heading": "connect-your-upload-endpoint",
			"content": "Use your application's endpoint and handle unsuccessful HTTP responses explicitly. `fetch` does not provide upload-progress events; omit intermediate progress or use a client that supports them."
		},
		{
			"heading": "labels-and-validation-state",
			"content": "Wrap the component in `FormField` for an external label, supporting text, and validation message. Its label targets the native file input. The supplied description and error relationships are preserved alongside File Upload's own description."
		},
		{
			"heading": "labels-and-validation-state",
			"content": "`required` sets the native file input's required attribute. It does **not** validate the internally managed file list: the native input is cleared after selection so the same file can be selected again. For form submission, validate the files received by `onChange` and send them explicitly using `FormData` or your upload handler. Do not rely on `name` and native form serialization to submit the displayed file list."
		},
		{
			"heading": "disabled-state",
			"content": "`disabled` prevents file selection, dropping, removal, and retry, and removes the dropzone from keyboard navigation. It does not cancel uploads that are already running."
		},
		{
			"heading": "fileupload",
			"content": "| Prop     | Type                | Default | Description                                                     |\n| -------- | ------------------- | ------- | --------------------------------------------------------------- |\n| `accept` | `readonly string[]` | `[]`    | Accepted MIME types or MIME wildcards; empty accepts all types. |",
			"table": "table-0"
		},
		{
			"heading": "fileupload",
			"content": "| Prop       | Type      | Default | Description                                       |\n| ---------- | --------- | ------- | ------------------------------------------------- |\n| `multiple` | `boolean` | `false` | Appends files instead of replacing the selection. |",
			"table": "table-0"
		},
		{
			"heading": "fileupload",
			"content": "| Prop       | Type     | Default | Description                              |\n| ---------- | -------- | ------- | ---------------------------------------- |\n| `maxFiles` | `number` | -       | Maximum selected count in multiple mode. |",
			"table": "table-0"
		},
		{
			"heading": "fileupload",
			"content": "| Prop          | Type     | Default | Description             |\n| ------------- | -------- | ------- | ----------------------- |\n| `maxFileSize` | `number` | -       | Maximum bytes per file. |",
			"table": "table-0"
		},
		{
			"heading": "fileupload",
			"content": "| Prop           | Type     | Default | Description                      |\n| -------------- | -------- | ------- | -------------------------------- |\n| `maxTotalSize` | `number` | -       | Maximum combined selected bytes. |",
			"table": "table-0"
		},
		{
			"heading": "fileupload",
			"content": "| Prop       | Type                      | Default | Description                                                  |\n| ---------- | ------------------------- | ------- | ------------------------------------------------------------ |\n| `onChange` | `(files: File[]) => void` | -       | Full accepted list after additions, replacement, or removal. |",
			"table": "table-0"
		},
		{
			"heading": "fileupload",
			"content": "| Prop       | Type                                          | Default | Description                               |\n| ---------- | --------------------------------------------- | ------- | ----------------------------------------- |\n| `onReject` | `(rejections: FileUploadRejection[]) => void` | -       | Files rejected from the latest selection. |",
			"table": "table-0"
		},
		{
			"heading": "fileupload",
			"content": "| Prop       | Type                      | Default | Description                                               |\n| ---------- | ------------------------- | ------- | --------------------------------------------------------- |\n| `onUpload` | `FileUploadUploadHandler` | -       | Asynchronous upload handler; enables automatic uploading. |",
			"table": "table-0"
		},
		{
			"heading": "fileupload",
			"content": "| Prop    | Type     | Default             | Description                                   |\n| ------- | -------- | ------------------- | --------------------------------------------- |\n| `title` | `string` | `\"Drop files here\"` | Dropzone heading and default accessible name. |",
			"table": "table-0"
		},
		{
			"heading": "fileupload",
			"content": "| Prop          | Type     | Default                                                     | Description               |\n| ------------- | -------- | ----------------------------------------------------------- | ------------------------- |\n| `description` | `string` | `\"Drag and drop your files here or browse to select them.\"` | Supporting dropzone text. |",
			"table": "table-0"
		},
		{
			"heading": "fileupload",
			"content": "| Prop          | Type     | Default          | Description                 |\n| ------------- | -------- | ---------------- | --------------------------- |\n| `browseLabel` | `string` | `\"Browse files\"` | Visible picker action text. |",
			"table": "table-0"
		},
		{
			"heading": "fileupload",
			"content": "| Prop       | Type      | Default | Description                |\n| ---------- | --------- | ------- | -------------------------- |\n| `disabled` | `boolean` | `false` | Disables user interaction. |",
			"table": "table-0"
		},
		{
			"heading": "fileupload",
			"content": "| Prop       | Type      | Default | Description                                                  |\n| ---------- | --------- | ------- | ------------------------------------------------------------ |\n| `required` | `boolean` | `false` | Native input required attribute; see form limitations above. |",
			"table": "table-0"
		},
		{
			"heading": "fileupload",
			"content": "| Prop   | Type     | Default | Description                                             |\n| ------ | -------- | ------- | ------------------------------------------------------- |\n| `name` | `string` | -       | Native input name; does not serialize the managed list. |",
			"table": "table-0"
		},
		{
			"heading": "fileupload",
			"content": "| Prop | Type     | Default   | Description                                 |\n| ---- | -------- | --------- | ------------------------------------------- |\n| `id` | `string` | Generated | Native file input ID for label association. |",
			"table": "table-0"
		},
		{
			"heading": "fileupload",
			"content": "| Prop        | Type     | Default | Description                        |\n| ----------- | -------- | ------- | ---------------------------------- |\n| `className` | `string` | -       | Additional class on the outer div. |",
			"table": "table-0"
		},
		{
			"heading": "fileupload",
			"content": "| Prop    | Type            | Default | Description              |\n| ------- | --------------- | ------- | ------------------------ |\n| `style` | `CSSProperties` | -       | Styles on the outer div. |",
			"table": "table-0"
		},
		{
			"heading": "fileupload",
			"content": "| Prop  | Type                  | Default | Description                                 |\n| ----- | --------------------- | ------- | ------------------------------------------- |\n| `ref` | `Ref<HTMLDivElement>` | -       | Ref to the outer div, not the native input. |",
			"table": "table-0"
		},
		{
			"heading": "fileupload",
			"content": "| Prop         | Type     | Default | Description                                |\n| ------------ | -------- | ------- | ------------------------------------------ |\n| `aria-label` | `string` | `title` | Accessible name of the focusable dropzone. |",
			"table": "table-0"
		},
		{
			"heading": "fileupload",
			"content": "| Prop               | Type     | Default | Description                                                     |\n| ------------------ | -------- | ------- | --------------------------------------------------------------- |\n| `aria-describedby` | `string` | -       | External description IDs, merged with the internal description. |",
			"table": "table-0"
		},
		{
			"heading": "fileupload",
			"content": "| Prop           | Type                             | Default | Description                                                        |\n| -------------- | -------------------------------- | ------- | ------------------------------------------------------------------ |\n| `aria-invalid` | `AriaAttributes[\"aria-invalid\"]` | -       | Invalid state applied to the native input and root data attribute. |",
			"table": "table-0"
		},
		{
			"heading": "fileupload",
			"content": "Other supported div attributes are forwarded to the outer wrapper. `children` and a custom `onDrop` are not part of the API."
		},
		{
			"heading": "fileuploaduploadcontext",
			"content": "`FileUploadUploadHandler` is `(file: File, context: FileUploadUploadContext) => Promise<void>`."
		},
		{
			"heading": "fileuploaduploadcontext",
			"content": "| Property     | Type                         | Description                                                          |\n| ------------ | ---------------------------- | -------------------------------------------------------------------- |\n| `onProgress` | `(progress: number) => void` | Reports percentage progress; finite values are clamped to `0`-`100`. |",
			"table": "table-1"
		},
		{
			"heading": "fileuploaduploadcontext",
			"content": "| Property | Type          | Description                                                      |\n| -------- | ------------- | ---------------------------------------------------------------- |\n| `signal` | `AbortSignal` | Signals cancellation on removal, replacement, retry, or unmount. |",
			"table": "table-1"
		},
		{
			"heading": "fileuploadrejection",
			"content": "| Property | Type   | Description             |\n| -------- | ------ | ----------------------- |\n| `file`   | `File` | Original rejected file. |",
			"table": "table-2"
		},
		{
			"heading": "fileuploadrejection",
			"content": "| Property | Type                      | Description                        |\n| -------- | ------------------------- | ---------------------------------- |\n| `code`   | `FileUploadRejectionCode` | Machine-readable rejection reason. |",
			"table": "table-2"
		},
		{
			"heading": "fileuploadrejection",
			"content": "| Property  | Type     | Description              |\n| --------- | -------- | ------------------------ |\n| `message` | `string` | User-facing explanation. |",
			"table": "table-2"
		},
		{
			"heading": "fileuploadrejection",
			"content": "| Rejection code | Meaning                            |\n| -------------- | ---------------------------------- |\n| `\"file-type\"`  | MIME type does not match `accept`. |",
			"table": "table-3"
		},
		{
			"heading": "fileuploadrejection",
			"content": "| Rejection code     | Meaning                     |\n| ------------------ | --------------------------- |\n| `\"file-too-large\"` | File exceeds `maxFileSize`. |",
			"table": "table-3"
		},
		{
			"heading": "fileuploadrejection",
			"content": "| Rejection code      | Meaning                                      |\n| ------------------- | -------------------------------------------- |\n| `\"total-too-large\"` | Adding the file would exceed `maxTotalSize`. |",
			"table": "table-3"
		},
		{
			"heading": "fileuploadrejection",
			"content": "| Rejection code     | Meaning                                                               |\n| ------------------ | --------------------------------------------------------------------- |\n| `\"too-many-files\"` | Selection exceeds `maxFiles`, or includes extra files in single mode. |",
			"table": "table-3"
		},
		{
			"heading": "exported-item-types",
			"content": "`FileUploadItem` describes the internal list entries. It is exported for typing, but callbacks receive files or rejections, not item records."
		},
		{
			"heading": "exported-item-types",
			"content": "| Property | Type     | Description              |\n| -------- | -------- | ------------------------ |\n| `id`     | `string` | Generated item identity. |",
			"table": "table-4"
		},
		{
			"heading": "exported-item-types",
			"content": "| Property | Type   | Description    |\n| -------- | ------ | -------------- |\n| `file`   | `File` | Selected file. |",
			"table": "table-4"
		},
		{
			"heading": "exported-item-types",
			"content": "| Property | Type               | Description                                            |\n| -------- | ------------------ | ------------------------------------------------------ |\n| `status` | `FileUploadStatus` | `\"queued\"`, `\"uploading\"`, `\"complete\"`, or `\"error\"`. |",
			"table": "table-4"
		},
		{
			"heading": "exported-item-types",
			"content": "| Property   | Type     | Description          |\n| ---------- | -------- | -------------------- |\n| `progress` | `number` | Percentage progress. |",
			"table": "table-4"
		},
		{
			"heading": "exported-item-types",
			"content": "| Property | Type     | Description                      |\n| -------- | -------- | -------------------------------- |\n| `error`  | `string` | Optional upload failure message. |",
			"table": "table-4"
		},
		{
			"heading": "accessibility",
			"content": "The dropzone is keyboard focusable and uses button semantics. Enter and Space open the native picker; disabled dropzones are skipped by Tab. Removal and retry controls have filename-specific accessible names."
		},
		{
			"heading": "accessibility",
			"content": "The selected-file list announces additions and removals politely. Rejection messages use an alert, upload errors and completion use status messages, and progress bars have file-specific labels. Drag feedback is supplementary: users can always choose files with the keyboard instead."
		}
	],
	"headings": [
		{
			"id": "import",
			"content": "Import"
		},
		{
			"id": "basic-usage",
			"content": "Basic usage"
		},
		{
			"id": "multiple-files-and-selection-changes",
			"content": "Multiple files and selection changes"
		},
		{
			"id": "accepted-types-and-limits",
			"content": "Accepted types and limits"
		},
		{
			"id": "automatic-uploads-progress-and-retry",
			"content": "Automatic uploads, progress, and retry"
		},
		{
			"id": "connect-your-upload-endpoint",
			"content": "Connect your upload endpoint"
		},
		{
			"id": "labels-and-validation-state",
			"content": "Labels and validation state"
		},
		{
			"id": "disabled-state",
			"content": "Disabled state"
		},
		{
			"id": "api",
			"content": "API"
		},
		{
			"id": "fileupload",
			"content": "FileUpload"
		},
		{
			"id": "fileuploaduploadcontext",
			"content": "FileUploadUploadContext"
		},
		{
			"id": "fileuploadrejection",
			"content": "FileUploadRejection"
		},
		{
			"id": "exported-item-types",
			"content": "Exported item types"
		},
		{
			"id": "accessibility",
			"content": "Accessibility"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#import",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Import" })
	},
	{
		depth: 2,
		url: "#basic-usage",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Basic usage" })
	},
	{
		depth: 2,
		url: "#multiple-files-and-selection-changes",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Multiple files and selection changes" })
	},
	{
		depth: 2,
		url: "#accepted-types-and-limits",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Accepted types and limits" })
	},
	{
		depth: 2,
		url: "#automatic-uploads-progress-and-retry",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Automatic uploads, progress, and retry" })
	},
	{
		depth: 3,
		url: "#connect-your-upload-endpoint",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Connect your upload endpoint" })
	},
	{
		depth: 2,
		url: "#labels-and-validation-state",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Labels and validation state" })
	},
	{
		depth: 2,
		url: "#disabled-state",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Disabled state" })
	},
	{
		depth: 2,
		url: "#api",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "API" })
	},
	{
		depth: 3,
		url: "#fileupload",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "FileUpload" })
	},
	{
		depth: 3,
		url: "#fileuploaduploadcontext",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "FileUploadUploadContext" })
	},
	{
		depth: 3,
		url: "#fileuploadrejection",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "FileUploadRejection" })
	},
	{
		depth: 3,
		url: "#exported-item-types",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Exported item types" })
	},
	{
		depth: 2,
		url: "#accessibility",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Accessibility" })
	}
];
function _createMdxContent(props) {
	const _components = {
		code: "code",
		h2: "h2",
		h3: "h3",
		p: "p",
		pre: "pre",
		span: "span",
		strong: "strong",
		table: "table",
		tbody: "tbody",
		td: "td",
		th: "th",
		thead: "thead",
		tr: "tr",
		...props.components
	}, { FileUpload, FormField, Preview, Section } = _components;
	if (!FileUpload) _missingMdxReference("FileUpload", true);
	if (!FormField) _missingMdxReference("FormField", true);
	if (!Preview) _missingMdxReference("Preview", true);
	if (!Section) _missingMdxReference("Section", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"File Upload supports native file selection, drag and drop, client-side validation, and optional automatic uploads. Without an ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onUpload" }),
			" handler, accepted files are listed as ",
			(0, import_jsx_runtime.jsx)(_components.strong, { children: "Ready to upload" }),
			"; the component does not send them anywhere."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "import",
			children: "Import"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: (0, import_jsx_runtime.jsx)(_components.pre, {
			className: "shiki shiki-themes github-light github-dark",
			style: {
				"--shiki-light": "#24292e",
				"--shiki-dark": "#e1e4e8",
				"--shiki-light-bg": "#fff",
				"--shiki-dark-bg": "#24292e"
			},
			tabIndex: "0",
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime.jsx)(_components.code, { children: (0, import_jsx_runtime.jsxs)(_components.span, {
				className: "line",
				children: [
					(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#D73A49",
							"--shiki-dark": "#F97583"
						},
						children: "import"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: " { FileUpload, "
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#D73A49",
							"--shiki-dark": "#F97583"
						},
						children: "type"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: " FileUploadUploadHandler } "
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#D73A49",
							"--shiki-dark": "#F97583"
						},
						children: "from"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " \"@puzzle-ui/ui\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: ";"
					})
				]
			}) })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "basic-usage",
			children: "Basic usage"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Click the dropzone, press Enter or Space while it is focused, or drop a file onto it. Use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "title" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "description" }),
			", and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "browseLabel" }),
			" to explain what to select."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 440,
			code: `\
<FileUpload
title="Upload a document"
description="Choose a document or drop it here."
browseLabel="Choose file"
/>
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsx)(FileUpload, {
				title: "Upload a document",
				description: "Choose a document or drop it here.",
				browseLabel: "Choose file"
			}) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Single-file mode is the default: a new accepted file replaces the previous selection and aborts its in-progress upload. A rejected file does not replace the current selection. Each listed file has a Remove button." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "multiple-files-and-selection-changes",
			children: "Multiple files and selection changes"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Set ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "multiple" }),
			" to append accepted files across selections. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onChange" }),
			" receives the entire accepted ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "File[]" }),
			" whenever files are added, replaced, or removed, including ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "[]" }),
			" after removing the last file."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The file list is managed internally; there are no controlled ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "value" }),
			" or ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "defaultValue" }),
			" props. Upload progress and completion do not call ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onChange" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 560,
			code: `\
const [files, setFiles] = useState<File[]>([]);

return (

<Stack>
  <FileUpload multiple onChange={setFiles} />
  <span role="status">
    {files.length ? "Selected: " + files.map((file) => file.name).join(", ") : "No files selected"}
  </span>
</Stack>
);
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsx)(FileUploadSelectionExample, {}) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "accepted-types-and-limits",
			children: "Accepted types and limits"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "accept" }),
			" is an array of MIME types such as ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "\"application/pdf\"" }),
			" or wildcards such as ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "\"image/*\"" }),
			". File extensions such as ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "\".png\"" }),
			" are not supported by the component's validator. Files with an empty MIME type are rejected when an accept filter is configured."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "maxFileSize" }),
			" limits each file, ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "maxTotalSize" }),
			" limits the combined selected size, and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "maxFiles" }),
			" limits the count in multiple mode. Sizes are in bytes. Files are evaluated in selection order: valid files that fit are accepted, while rejected files are reported separately."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 580,
			code: `\
<FileUpload
multiple
accept={["image/*", "application/pdf"]}
maxFiles={3}
maxFileSize={2 * 1024 * 1024}
maxTotalSize={5 * 1024 * 1024}
title="Upload attachments"
description="Up to 3 images or PDFs, 2 MB per file and 5 MB total."
/>
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsx)(FileUpload, {
				multiple: true,
				accept: ["image/*", "application/pdf"],
				maxFiles: 3,
				maxFileSize: 2097152,
				maxTotalSize: 5242880,
				title: "Upload attachments",
				description: "Up to 3 images or PDFs, 2 MB per file and 5 MB total."
			}) })
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Rejections appear in an alert with the filename and reason. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onReject" }),
			" receives the rejected files for that selection. New selections replace previous rejection messages; removing a selected file does not clear them."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: (0, import_jsx_runtime.jsx)(_components.pre, {
			className: "shiki shiki-themes github-light github-dark",
			style: {
				"--shiki-light": "#24292e",
				"--shiki-dark": "#e1e4e8",
				"--shiki-light-bg": "#fff",
				"--shiki-dark-bg": "#24292e"
			},
			tabIndex: "0",
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime.jsxs)(_components.code, { children: [
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: "<"
					}), (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#005CC5",
							"--shiki-dark": "#79B8FF"
						},
						children: "FileUpload"
					})]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "  accept"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "="
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "{["
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "\"image/png\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "]}"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "  onReject"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "="
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "{("
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#E36209",
								"--shiki-dark": "#FFAB70"
							},
							children: "rejections"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ") "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "=>"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " {"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "    for"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " ("
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "const"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " { "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "file"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ", "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "code"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ", "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "message"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " } "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "of"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " rejections) {"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "      console."
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "warn"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "(file.name, code, message);"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: "    }"
					})
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: "  }}"
					})
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: "/>"
					})
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "These are client-side checks for user feedback, not a security boundary. Validate file contents, types, sizes, and permissions again on your server." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "automatic-uploads-progress-and-retry",
			children: "Automatic uploads, progress, and retry"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Provide ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onUpload" }),
			" to start uploading each accepted file automatically. The handler receives the file and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "{ signal, onProgress }" }),
			". Report progress from ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "0" }),
			" to ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "100" }),
			"; resolve the promise on success and reject it on failure. Error messages are displayed alongside a Retry button, which calls the handler again for that file."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: ["The following local simulation intentionally fails each file's first attempt. Select a file to see progress and error feedback, then retry to complete it. ", (0, import_jsx_runtime.jsx)(_components.strong, { children: "No file data is sent anywhere." })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 640,
			code: `\
const attemptedFiles = useRef(new WeakSet<File>());

return (

<FileUpload
  multiple
  description="Local simulation: each file fails once. Retry to complete it. No files are sent."
  onUpload={async (file, { signal, onProgress }) => {
    const firstAttempt = !attemptedFiles.current.has(file);
    attemptedFiles.current.add(file);

    for (const progress of [25, 50, 75, 100]) {
      await new Promise<void>((resolve) => setTimeout(resolve, 250));
      signal.throwIfAborted();
      onProgress(progress);

      if (firstAttempt && progress === 50) {
        throw new Error("Simulated failure. Retry this upload.");
      }
    }
  }}

/>
);
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsx)(FileUploadProgressExample, {}) })
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Files upload independently. Progress is clamped to ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "0" }),
			"-",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "100" }),
			", and resolving the handler marks the file complete at ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "100" }),
			". Removing a file, replacing it in single mode, or unmounting aborts its signal; pass that signal to your network client to cancel the actual request. Late results from aborted attempts are ignored."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "connect-your-upload-endpoint",
			children: "Connect your upload endpoint"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Use your application's endpoint and handle unsuccessful HTTP responses explicitly. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "fetch" }),
			" does not provide upload-progress events; omit intermediate progress or use a client that supports them."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: (0, import_jsx_runtime.jsx)(_components.pre, {
			className: "shiki shiki-themes github-light github-dark",
			style: {
				"--shiki-light": "#24292e",
				"--shiki-dark": "#e1e4e8",
				"--shiki-light-bg": "#fff",
				"--shiki-dark-bg": "#24292e"
			},
			tabIndex: "0",
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime.jsxs)(_components.code, { children: [
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "const"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " uploadFile"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: ":"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " FileUploadUploadHandler"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: " ="
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: " async"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " ("
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#E36209",
								"--shiki-dark": "#FFAB70"
							},
							children: "file"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ", { "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#E36209",
								"--shiki-dark": "#FFAB70"
							},
							children: "signal"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " }) "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "=>"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " {"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "  const"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " body"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: " ="
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: " new"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " FormData"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "();"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "  body."
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "append"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "("
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "\"file\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ", file);"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, { className: "line" }),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "  const"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " response"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: " ="
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: " await"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " fetch"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "("
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "\"/api/uploads\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ", {"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "    method: "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "\"POST\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ","
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: "    body,"
					})
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: "    signal,"
					})
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: "  });"
					})
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, { className: "line" }),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "  if"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " ("
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "!"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "response.ok) {"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "    throw"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: " new"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " Error"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "("
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "\"Upload failed (\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: " +"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " response.status "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "+"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " \"). Please retry.\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ");"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: "  }"
					})
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: "};"
					})
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, { className: "line" }),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "<"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "FileUpload"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " multiple"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " onUpload"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "="
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "{uploadFile} />;"
						})
					]
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "labels-and-validation-state",
			children: "Labels and validation state"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Wrap the component in ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "FormField" }),
			" for an external label, supporting text, and validation message. Its label targets the native file input. The supplied description and error relationships are preserved alongside File Upload's own description."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "required" }),
			" sets the native file input's required attribute. It does ",
			(0, import_jsx_runtime.jsx)(_components.strong, { children: "not" }),
			" validate the internally managed file list: the native input is cleared after selection so the same file can be selected again. For form submission, validate the files received by ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onChange" }),
			" and send them explicitly using ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "FormData" }),
			" or your upload handler. Do not rely on ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "name" }),
			" and native form serialization to submit the displayed file list."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 440,
			code: `\
<FormField
label="Supporting documents"
description="Attach at least one document before continuing."
error="A supporting document is required."
>
<FileUpload
  multiple
  aria-label="Choose supporting documents"
  description="Drop your documents here or browse."
/>
</FormField>
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsx)(FormField, {
				label: "Supporting documents",
				description: "Attach at least one document before continuing.",
				error: "A supporting document is required.",
				children: (0, import_jsx_runtime.jsx)(FileUpload, {
					multiple: true,
					"aria-label": "Choose supporting documents",
					description: "Drop your documents here or browse."
				})
			}) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "disabled-state",
			children: "Disabled state"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [(0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }), " prevents file selection, dropping, removal, and retry, and removes the dropzone from keyboard navigation. It does not cancel uploads that are already running."] }),
		"\n",
		(0, import_jsx_runtime.jsx)(Preview, {
			height: 360,
			code: `\
<FileUpload
disabled
title="Uploads unavailable"
description="You do not have permission to add files."
/>
`,
			children: (0, import_jsx_runtime.jsx)(Section, { children: (0, import_jsx_runtime.jsx)(FileUpload, {
				disabled: true,
				title: "Uploads unavailable",
				description: "You do not have permission to add files."
			}) })
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "api",
			children: "API"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "fileupload",
			children: "FileUpload"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Prop" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Type" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Default" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Description" })
		] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "accept" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "readonly string[]" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "[]" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Accepted MIME types or MIME wildcards; empty accepts all types." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "multiple" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Appends files instead of replacing the selection." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "maxFiles" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "number" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Maximum selected count in multiple mode." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "maxFileSize" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "number" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Maximum bytes per file." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "maxTotalSize" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "number" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Maximum combined selected bytes." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onChange" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(files: File[]) => void" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Full accepted list after additions, replacement, or removal." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onReject" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(rejections: FileUploadRejection[]) => void" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Files rejected from the latest selection." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onUpload" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "FileUploadUploadHandler" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Asynchronous upload handler; enables automatic uploading." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "title" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"Drop files here\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Dropzone heading and default accessible name." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "description" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"Drag and drop your files here or browse to select them.\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Supporting dropzone text." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "browseLabel" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"Browse files\"" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Visible picker action text." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "disabled" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Disables user interaction." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "required" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "boolean" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "false" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Native input required attribute; see form limitations above." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "name" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Native input name; does not serialize the managed list." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "id" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Generated" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Native file input ID for label association." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "className" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Additional class on the outer div." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "style" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "CSSProperties" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Styles on the outer div." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "ref" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "Ref<HTMLDivElement>" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Ref to the outer div, not the native input." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "aria-label" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "title" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Accessible name of the focusable dropzone." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "aria-describedby" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "External description IDs, merged with the internal description." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "aria-invalid" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "AriaAttributes[\"aria-invalid\"]" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "-" }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Invalid state applied to the native input and root data attribute." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Other supported div attributes are forwarded to the outer wrapper. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "children" }),
			" and a custom ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "onDrop" }),
			" are not part of the API."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "fileuploaduploadcontext",
			children: "FileUploadUploadContext"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "FileUploadUploadHandler" }),
			" is ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "(file: File, context: FileUploadUploadContext) => Promise<void>" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Property" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Type" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Description" })
		] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "onProgress" }) }),
			(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "(progress: number) => void" }) }),
			(0, import_jsx_runtime.jsxs)(_components.td, { children: [
				"Reports percentage progress; finite values are clamped to ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "0" }),
				"-",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "100" }),
				"."
			] })
		] }), (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "signal" }) }),
			(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "AbortSignal" }) }),
			(0, import_jsx_runtime.jsx)(_components.td, { children: "Signals cancellation on removal, replacement, retry, or unmount." })
		] })] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "fileuploadrejection",
			children: "FileUploadRejection"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Property" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Type" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Description" })
		] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "file" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "File" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Original rejected file." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "code" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "FileUploadRejectionCode" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Machine-readable rejection reason." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "message" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "User-facing explanation." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.th, { children: "Rejection code" }), (0, import_jsx_runtime.jsx)(_components.th, { children: "Meaning" })] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"file-type\"" }) }), (0, import_jsx_runtime.jsxs)(_components.td, { children: [
				"MIME type does not match ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "accept" }),
				"."
			] })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"file-too-large\"" }) }), (0, import_jsx_runtime.jsxs)(_components.td, { children: [
				"File exceeds ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "maxFileSize" }),
				"."
			] })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"total-too-large\"" }) }), (0, import_jsx_runtime.jsxs)(_components.td, { children: [
				"Adding the file would exceed ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "maxTotalSize" }),
				"."
			] })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "\"too-many-files\"" }) }), (0, import_jsx_runtime.jsxs)(_components.td, { children: [
				"Selection exceeds ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "maxFiles" }),
				", or includes extra files in single mode."
			] })] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "exported-item-types",
			children: "Exported item types"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [(0, import_jsx_runtime.jsx)(_components.code, { children: "FileUploadItem" }), " describes the internal list entries. It is exported for typing, but callbacks receive files or rejections, not item records."] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Property" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Type" }),
			(0, import_jsx_runtime.jsx)(_components.th, { children: "Description" })
		] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "id" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Generated item identity." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "file" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "File" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Selected file." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "status" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "FileUploadStatus" }) }),
				(0, import_jsx_runtime.jsxs)(_components.td, { children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "\"queued\"" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "\"uploading\"" }),
					", ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "\"complete\"" }),
					", or ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "\"error\"" }),
					"."
				] })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "progress" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "number" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Percentage progress." })
			] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "error" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: (0, import_jsx_runtime.jsx)(_components.code, { children: "string" }) }),
				(0, import_jsx_runtime.jsx)(_components.td, { children: "Optional upload failure message." })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "accessibility",
			children: "Accessibility"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The dropzone is keyboard focusable and uses button semantics. Enter and Space open the native picker; disabled dropzones are skipped by Tab. Removal and retry controls have filename-specific accessible names." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The selected-file list announces additions and removals politely. Rejection messages use an alert, upload errors and completion use status messages, and progress bars have file-specific labels. Drag feedback is supplementary: users can always choose files with the keyboard instead." })
	] });
}
function MDXContent(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? (0, import_jsx_runtime.jsx)(MDXLayout, {
		...props,
		children: (0, import_jsx_runtime.jsx)(_createMdxContent, { ...props })
	}) : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
	throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
export { MDXContent as default, frontmatter, structuredData, toc };
