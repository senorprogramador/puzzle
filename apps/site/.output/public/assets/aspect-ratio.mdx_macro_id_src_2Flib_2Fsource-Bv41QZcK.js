import{t as e}from"./jsx-runtime-LKYXHABd.js";var t=e(),n={title:`Aspect Ratio`,description:`Maintain consistent proportions for images, videos, and other content.`},r={contents:[{heading:void 0,content:`The AspectRatio component maintains a consistent width-to-height proportion for its content.`},{heading:void 0,content:`It uses the native CSS aspect-ratio property, making it suitable for responsive media containers, image galleries, video embeds, and other layouts where predictable proportions are important.`},{heading:`basic-usage`,content:`By default, AspectRatio uses a square (1:1) ratio.`},{heading:`basic-usage`,content:`1:1`},{heading:`aspect-ratios`,content:"Use the `ratio` prop to define the desired width-to-height proportion."},{heading:`aspect-ratios`,content:"The ratio is expressed as a number. For example, `16 / 9` represents a widescreen aspect ratio, while `4 / 3` represents a traditional display ratio."},{heading:`aspect-ratios`,content:`16:9`},{heading:`aspect-ratios`,content:`4:3`},{heading:`aspect-ratios`,content:`21:9`},{heading:`aspect-ratios`,content:`The aspect ratio is maintained automatically as the container width changes.`},{heading:`images`,content:`AspectRatio is particularly useful for responsive images.`},{heading:`images`,content:"Combine it with `object-fit: cover` to fill the container while preserving the image's proportions."},{heading:`images`,content:`Landscape image · 16:9`},{heading:`images`,content:`For square images, such as avatars or product thumbnails, use the default ratio.`},{heading:`images`,content:`P`},{heading:`video-embeds`,content:`Use AspectRatio to maintain the correct proportions of embedded videos.`},{heading:`video-embeds`,content:`For example, a 16:9 container is suitable for most YouTube and other widescreen video embeds.`},{heading:`custom-elements`,content:"Use the `as` prop to change the underlying HTML element."},{heading:`custom-elements`,content:`All native properties supported by the selected element are forwarded to the root element.`},{heading:`custom-elements`,content:`Custom section element`},{heading:`styling`,content:"AspectRatio supports both `className` and `style`."},{heading:`styling`,content:"Custom styles are merged with the component's internal styles. The `ratio` prop takes precedence over `style.aspectRatio`."},{heading:`styling`,content:`Custom styling`},{heading:`props`,content:"| Prop    | Type     | Default | Description                                              |\n| ------- | -------- | ------- | -------------------------------------------------------- |\n| `ratio` | `number` | `1`     | Width-to-height ratio. Must be a positive finite number. |",table:`table-0`},{heading:`props`,content:'| Prop | Type          | Default | Description                                 |\n| ---- | ------------- | ------- | ------------------------------------------- |\n| `as` | `ElementType` | `"div"` | HTML element or component used as the root. |',table:`table-0`},{heading:`props`,content:"| Prop        | Type     | Default | Description                 |\n| ----------- | -------- | ------- | --------------------------- |\n| `className` | `string` | —       | Additional CSS class names. |",table:`table-0`},{heading:`props`,content:"| Prop    | Type            | Default | Description               |\n| ------- | --------------- | ------- | ------------------------- |\n| `style` | `CSSProperties` | —       | Additional inline styles. |",table:`table-0`},{heading:`props`,content:"| Prop       | Type        | Default | Description                                          |\n| ---------- | ----------- | ------- | ---------------------------------------------------- |\n| `children` | `ReactNode` | —       | Content displayed inside the aspect ratio container. |",table:`table-0`},{heading:`props`,content:`All other native props supported by the selected root element are forwarded.`},{heading:`typescript-types`,content:"The component also exports `AspectRatioProps` for use in custom components and wrappers."},{heading:`behavior`,content:"The default ratio is `1`, producing a square container."},{heading:`behavior`,content:"The `ratio` prop accepts any positive finite number."},{heading:`behavior`,content:"Invalid ratios, including zero, negative values, `NaN`, and infinity, throw a `RangeError`."},{heading:`behavior`,content:`The component uses the native CSS aspect-ratio property.`},{heading:`behavior`,content:`The container fills the available width of its parent.`},{heading:`behavior`,content:`Direct children are positioned to fill the container.`},{heading:`behavior`,content:`Custom styles and classes are supported.`},{heading:`behavior`,content:`The component does not require JavaScript layout calculations or browser observers.`},{heading:`accessibility`,content:`AspectRatio is a layout primitive and does not introduce additional ARIA roles or keyboard interactions.`},{heading:`accessibility`,content:`The underlying HTML element determines its semantics.`},{heading:`accessibility`,content:`When displaying images:`},{heading:`accessibility`,content:"Always provide meaningful `alt` text for informative images."},{heading:`accessibility`,content:"Use an empty `alt` attribute for purely decorative images."},{heading:`accessibility`,content:`Avoid using CSS backgrounds for images that convey meaningful information.`},{heading:`accessibility`,content:`When embedding videos or iframes, provide an accessible title and ensure that the embedded content remains usable with a keyboard.`}],headings:[{id:`import`,content:`Import`},{id:`basic-usage`,content:`Basic usage`},{id:`aspect-ratios`,content:`Aspect ratios`},{id:`images`,content:`Images`},{id:`video-embeds`,content:`Video embeds`},{id:`custom-elements`,content:`Custom elements`},{id:`styling`,content:`Styling`},{id:`api`,content:`API`},{id:`props`,content:`Props`},{id:`typescript-types`,content:`TypeScript types`},{id:`behavior`,content:`Behavior`},{id:`accessibility`,content:`Accessibility`}]},i=[{depth:2,url:`#import`,title:(0,t.jsx)(t.Fragment,{children:`Import`})},{depth:2,url:`#basic-usage`,title:(0,t.jsx)(t.Fragment,{children:`Basic usage`})},{depth:2,url:`#aspect-ratios`,title:(0,t.jsx)(t.Fragment,{children:`Aspect ratios`})},{depth:2,url:`#images`,title:(0,t.jsx)(t.Fragment,{children:`Images`})},{depth:2,url:`#video-embeds`,title:(0,t.jsx)(t.Fragment,{children:`Video embeds`})},{depth:2,url:`#custom-elements`,title:(0,t.jsx)(t.Fragment,{children:`Custom elements`})},{depth:2,url:`#styling`,title:(0,t.jsx)(t.Fragment,{children:`Styling`})},{depth:2,url:`#api`,title:(0,t.jsx)(t.Fragment,{children:`API`})},{depth:3,url:`#props`,title:(0,t.jsx)(t.Fragment,{children:`Props`})},{depth:3,url:`#typescript-types`,title:(0,t.jsx)(t.Fragment,{children:`TypeScript types`})},{depth:2,url:`#behavior`,title:(0,t.jsx)(t.Fragment,{children:`Behavior`})},{depth:2,url:`#accessibility`,title:(0,t.jsx)(t.Fragment,{children:`Accessibility`})}];function a(e){let n={code:`code`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,span:`span`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...e.components},{AspectRatio:r,Preview:i,Stack:a}=n;return r||s(`AspectRatio`,!0),i||s(`Preview`,!0),a||s(`Stack`,!0),(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.p,{children:`The AspectRatio component maintains a consistent width-to-height proportion for its content.`}),`
`,(0,t.jsx)(n.p,{children:`It uses the native CSS aspect-ratio property, making it suitable for responsive media containers, image galleries, video embeds, and other layouts where predictable proportions are important.`}),`
`,(0,t.jsx)(n.h2,{id:`import`,children:`Import`}),`
`,(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(n.pre,{className:`shiki shiki-themes github-light github-dark`,style:{"--shiki-light":`#24292e`,"--shiki-dark":`#e1e4e8`,"--shiki-light-bg":`#fff`,"--shiki-dark-bg":`#24292e`},tabIndex:`0`,icon:`<svg viewBox="0 0 24 24"><path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z" fill="currentColor" /></svg>`,children:(0,t.jsx)(n.code,{children:(0,t.jsxs)(n.span,{className:`line`,children:[(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:`import`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:` { AspectRatio } `}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:`from`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#032F62`,"--shiki-dark":`#9ECBFF`},children:` "@puzzle-ui/ui"`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`;`})]})})})}),`
`,(0,t.jsx)(n.h2,{id:`basic-usage`,children:`Basic usage`}),`
`,(0,t.jsx)(n.p,{children:`By default, AspectRatio uses a square (1:1) ratio.`}),`
`,(0,t.jsx)(i,{height:320,align:`center`,justify:`center`,code:`<AspectRatio>
<div
  style={{
    background: "var(--puzzle-color-primary)",
    display: "grid",
    placeItems: "center",
    color: "white",
  }}
>
  1:1
</div>
</AspectRatio>
`,children:(0,t.jsx)(`div`,{style:{width:`100%`,maxWidth:`240px`},children:(0,t.jsx)(r,{children:(0,t.jsx)(`div`,{style:{background:`var(--puzzle-color-primary)`,display:`grid`,placeItems:`center`,color:`white`,fontWeight:600},children:(0,t.jsx)(n.p,{children:`1:1`})})})})}),`
`,(0,t.jsx)(n.h2,{id:`aspect-ratios`,children:`Aspect ratios`}),`
`,(0,t.jsxs)(n.p,{children:[`Use the `,(0,t.jsx)(n.code,{children:`ratio`}),` prop to define the desired width-to-height proportion.`]}),`
`,(0,t.jsxs)(n.p,{children:[`The ratio is expressed as a number. For example, `,(0,t.jsx)(n.code,{children:`16 / 9`}),` represents a widescreen aspect ratio, while `,(0,t.jsx)(n.code,{children:`4 / 3`}),` represents a traditional display ratio.`]}),`
`,(0,t.jsx)(i,{height:520,code:`<Stack gap="lg" style={{ width: "100%", maxWidth: "240px" }}>
<AspectRatio ratio={16 / 9}>
  <div style={{ background: "var(--puzzle-color-primary)", display: "grid", placeItems: "center", color: "white" }}>
    16:9
  </div>
</AspectRatio>

<AspectRatio ratio={4 / 3}>
<div
  style={{
    background: "var(--puzzle-color-secondary)",
    display: "grid",
    placeItems: "center",
    color: "white",
  }}
>
  4:3
</div>
</AspectRatio>

<AspectRatio ratio={21 / 9}>
  <div style={{ background: "var(--puzzle-color-accent)", display: "grid", placeItems: "center", color: "white" }}>
    21:9
  </div>
</AspectRatio>
</Stack>
`,children:(0,t.jsxs)(a,{gap:`lg`,style:{width:`100%`,maxWidth:`240px`},children:[(0,t.jsx)(r,{ratio:16/9,children:(0,t.jsx)(`div`,{style:{background:`var(--puzzle-color-primary)`,display:`grid`,placeItems:`center`,color:`white`},children:(0,t.jsx)(n.p,{children:`16:9`})})}),(0,t.jsx)(r,{ratio:4/3,children:(0,t.jsx)(`div`,{style:{background:`var(--puzzle-color-secondary)`,display:`grid`,placeItems:`center`,color:`white`},children:(0,t.jsx)(n.p,{children:`4:3`})})}),(0,t.jsx)(r,{ratio:21/9,children:(0,t.jsx)(`div`,{style:{background:`var(--puzzle-color-accent)`,display:`grid`,placeItems:`center`,color:`white`},children:(0,t.jsx)(n.p,{children:`21:9`})})})]})}),`
`,(0,t.jsx)(n.p,{children:`The aspect ratio is maintained automatically as the container width changes.`}),`
`,(0,t.jsx)(n.h2,{id:`images`,children:`Images`}),`
`,(0,t.jsx)(n.p,{children:`AspectRatio is particularly useful for responsive images.`}),`
`,(0,t.jsxs)(n.p,{children:[`Combine it with `,(0,t.jsx)(n.code,{children:`object-fit: cover`}),` to fill the container while preserving the image's proportions.`]}),`
`,(0,t.jsx)(i,{height:360,code:`<AspectRatio ratio={16 / 9}>
<img
  src="/images/landscape.jpg"
  alt="Landscape"
  style={{ objectFit: "cover" }}
/>
</AspectRatio>
`,children:(0,t.jsx)(`div`,{style:{width:`100%`},children:(0,t.jsx)(r,{ratio:16/9,children:(0,t.jsx)(`div`,{style:{background:`linear-gradient(135deg, #527b66, #b9c8a1)`,display:`grid`,placeItems:`center`,color:`white`,fontSize:`1.25rem`},children:(0,t.jsx)(n.p,{children:`Landscape image · 16:9`})})})})}),`
`,(0,t.jsx)(n.p,{children:`For square images, such as avatars or product thumbnails, use the default ratio.`}),`
`,(0,t.jsx)(i,{height:280,align:`center`,justify:`center`,code:`<AspectRatio>
<img
  src="/images/avatar.jpg"
  alt="Profile"
  style={{
    objectFit: "cover",
    borderRadius: "50%",
  }}
/>
</AspectRatio>
`,children:(0,t.jsx)(`div`,{style:{width:`160px`},children:(0,t.jsx)(r,{children:(0,t.jsx)(`div`,{style:{background:`var(--puzzle-color-secondary)`,display:`grid`,placeItems:`center`,borderRadius:`50%`,color:`white`,fontSize:`2rem`},children:(0,t.jsx)(n.p,{children:`P`})})})})}),`
`,(0,t.jsx)(n.h2,{id:`video-embeds`,children:`Video embeds`}),`
`,(0,t.jsx)(n.p,{children:`Use AspectRatio to maintain the correct proportions of embedded videos.`}),`
`,(0,t.jsx)(n.p,{children:`For example, a 16:9 container is suitable for most YouTube and other widescreen video embeds.`}),`
`,(0,t.jsx)(i,{height:584,code:`<AspectRatio ratio={16 / 9}>
  <iframe
      width="100%"
      height="100%"
      src="https://www.youtube.com/embed/yXxj7-DqLXw?si=RFXlnCoVs7Zc04Mr"
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
  />
</AspectRatio>
`,children:(0,t.jsx)(`div`,{style:{width:`100%`},children:(0,t.jsx)(r,{ratio:16/9,children:(0,t.jsx)(`iframe`,{width:`100%`,height:`100%`,src:`https://www.youtube.com/embed/yXxj7-DqLXw?si=RFXlnCoVs7Zc04Mr`,title:`YouTube video player`,frameBorder:`0`,allow:`accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share`,referrerPolicy:`strict-origin-when-cross-origin`,allowFullScreen:!0})})})}),`
`,(0,t.jsx)(n.h2,{id:`custom-elements`,children:`Custom elements`}),`
`,(0,t.jsxs)(n.p,{children:[`Use the `,(0,t.jsx)(n.code,{children:`as`}),` prop to change the underlying HTML element.`]}),`
`,(0,t.jsx)(n.p,{children:`All native properties supported by the selected element are forwarded to the root element.`}),`
`,(0,t.jsx)(i,{height:240,align:`center`,justify:`center`,code:`<AspectRatio
as="section"
ratio={4 / 3}
className="media-section"
aria-label="Media section"
>
<div>
  Content
</div>
</AspectRatio>
`,children:(0,t.jsx)(`div`,{style:{width:`100%`,maxWidth:`280px`},children:(0,t.jsx)(r,{as:`section`,ratio:4/3,"aria-label":`Media section`,children:(0,t.jsx)(`div`,{style:{background:`var(--puzzle-color-surface)`,border:`1px solid var(--puzzle-color-border)`,display:`grid`,placeItems:`center`},children:(0,t.jsx)(n.p,{children:`Custom section element`})})})})}),`
`,(0,t.jsx)(n.h2,{id:`styling`,children:`Styling`}),`
`,(0,t.jsxs)(n.p,{children:[`AspectRatio supports both `,(0,t.jsx)(n.code,{children:`className`}),` and `,(0,t.jsx)(n.code,{children:`style`}),`.`]}),`
`,(0,t.jsxs)(n.p,{children:[`Custom styles are merged with the component's internal styles. The `,(0,t.jsx)(n.code,{children:`ratio`}),` prop takes precedence over `,(0,t.jsx)(n.code,{children:`style.aspectRatio`}),`.`]}),`
`,(0,t.jsx)(i,{height:280,align:`center`,justify:`center`,code:`<AspectRatio
ratio={4 / 3}
style={{
  maxWidth: "320px",
  borderRadius: "var(--puzzle-radius-lg)",
  overflow: "hidden",
}}
>
<div
  style={{
    background: "var(--puzzle-color-primary)",
    display: "grid",
    placeItems: "center",
    color: "white",
  }}
>
  Custom styling
</div>
</AspectRatio>
`,children:(0,t.jsx)(`div`,{style:{width:`100%`,maxWidth:`320px`},children:(0,t.jsx)(r,{ratio:4/3,style:{borderRadius:`var(--puzzle-radius-lg)`,overflow:`hidden`},children:(0,t.jsx)(`div`,{style:{background:`var(--puzzle-color-primary)`,display:`grid`,placeItems:`center`,color:`white`},children:(0,t.jsx)(n.p,{children:`Custom styling`})})})})}),`
`,(0,t.jsx)(n.h2,{id:`api`,children:`API`}),`
`,(0,t.jsx)(n.h3,{id:`props`,children:`Props`}),`
`,(0,t.jsxs)(n.table,{children:[(0,t.jsx)(n.thead,{children:(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.th,{children:`Prop`}),(0,t.jsx)(n.th,{children:`Type`}),(0,t.jsx)(n.th,{children:`Default`}),(0,t.jsx)(n.th,{children:`Description`})]})}),(0,t.jsxs)(n.tbody,{children:[(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:`ratio`})}),(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:`number`})}),(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:`1`})}),(0,t.jsx)(n.td,{children:`Width-to-height ratio. Must be a positive finite number.`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:`as`})}),(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:`ElementType`})}),(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:`"div"`})}),(0,t.jsx)(n.td,{children:`HTML element or component used as the root.`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:`className`})}),(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:`string`})}),(0,t.jsx)(n.td,{children:`—`}),(0,t.jsx)(n.td,{children:`Additional CSS class names.`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:`style`})}),(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:`CSSProperties`})}),(0,t.jsx)(n.td,{children:`—`}),(0,t.jsx)(n.td,{children:`Additional inline styles.`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:`children`})}),(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:`ReactNode`})}),(0,t.jsx)(n.td,{children:`—`}),(0,t.jsx)(n.td,{children:`Content displayed inside the aspect ratio container.`})]})]})]}),`
`,(0,t.jsx)(n.p,{children:`All other native props supported by the selected root element are forwarded.`}),`
`,(0,t.jsx)(n.h3,{id:`typescript-types`,children:`TypeScript types`}),`
`,(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(n.pre,{className:`shiki shiki-themes github-light github-dark`,style:{"--shiki-light":`#24292e`,"--shiki-dark":`#e1e4e8`,"--shiki-light-bg":`#fff`,"--shiki-dark-bg":`#24292e`},tabIndex:`0`,icon:`<svg viewBox="0 0 24 24"><path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z" fill="currentColor" /></svg>`,children:(0,t.jsxs)(n.code,{children:[(0,t.jsxs)(n.span,{className:`line`,children:[(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:`type`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#6F42C1`,"--shiki-dark":`#B392F0`},children:` AspectRatioProps`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`<`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#6F42C1`,"--shiki-dark":`#B392F0`},children:`C`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:` extends`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#6F42C1`,"--shiki-dark":`#B392F0`},children:` ElementType`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:` =`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#032F62`,"--shiki-dark":`#9ECBFF`},children:` "div"`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`> `}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:`=`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#6F42C1`,"--shiki-dark":`#B392F0`},children:` AspectRatioOwnProps`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`<`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#6F42C1`,"--shiki-dark":`#B392F0`},children:`C`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`> `}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:`&`})]}),`
`,(0,t.jsxs)(n.span,{className:`line`,children:[(0,t.jsx)(n.span,{style:{"--shiki-light":`#6F42C1`,"--shiki-dark":`#B392F0`},children:`  Omit`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`<`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#6F42C1`,"--shiki-dark":`#B392F0`},children:`ComponentPropsWithRef`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`<`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#6F42C1`,"--shiki-dark":`#B392F0`},children:`C`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`>, `}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:`keyof`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#6F42C1`,"--shiki-dark":`#B392F0`},children:` AspectRatioOwnProps`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`<`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#6F42C1`,"--shiki-dark":`#B392F0`},children:`C`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`> `}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:`|`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#032F62`,"--shiki-dark":`#9ECBFF`},children:` "as"`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`>;`})]})]})})}),`
`,(0,t.jsxs)(n.p,{children:[`The component also exports `,(0,t.jsx)(n.code,{children:`AspectRatioProps`}),` for use in custom components and wrappers.`]}),`
`,(0,t.jsx)(n.h2,{id:`behavior`,children:`Behavior`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsxs)(n.li,{children:[`The default ratio is `,(0,t.jsx)(n.code,{children:`1`}),`, producing a square container.`]}),`
`,(0,t.jsxs)(n.li,{children:[`The `,(0,t.jsx)(n.code,{children:`ratio`}),` prop accepts any positive finite number.`]}),`
`,(0,t.jsxs)(n.li,{children:[`Invalid ratios, including zero, negative values, `,(0,t.jsx)(n.code,{children:`NaN`}),`, and infinity, throw a `,(0,t.jsx)(n.code,{children:`RangeError`}),`.`]}),`
`,(0,t.jsx)(n.li,{children:`The component uses the native CSS aspect-ratio property.`}),`
`,(0,t.jsx)(n.li,{children:`The container fills the available width of its parent.`}),`
`,(0,t.jsx)(n.li,{children:`Direct children are positioned to fill the container.`}),`
`,(0,t.jsx)(n.li,{children:`Custom styles and classes are supported.`}),`
`,(0,t.jsx)(n.li,{children:`The component does not require JavaScript layout calculations or browser observers.`}),`
`]}),`
`,(0,t.jsx)(n.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,t.jsx)(n.p,{children:`AspectRatio is a layout primitive and does not introduce additional ARIA roles or keyboard interactions.`}),`
`,(0,t.jsx)(n.p,{children:`The underlying HTML element determines its semantics.`}),`
`,(0,t.jsx)(n.p,{children:`When displaying images:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsxs)(n.li,{children:[`Always provide meaningful `,(0,t.jsx)(n.code,{children:`alt`}),` text for informative images.`]}),`
`,(0,t.jsxs)(n.li,{children:[`Use an empty `,(0,t.jsx)(n.code,{children:`alt`}),` attribute for purely decorative images.`]}),`
`,(0,t.jsx)(n.li,{children:`Avoid using CSS backgrounds for images that convey meaningful information.`}),`
`]}),`
`,(0,t.jsx)(n.p,{children:`When embedding videos or iframes, provide an accessible title and ensure that the embedded content remains usable with a keyboard.`})]})}function o(e={}){let{wrapper:n}=e.components||{};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(a,{...e})}):a(e)}function s(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{o as default,n as frontmatter,r as structuredData,i as toc};