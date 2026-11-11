import{t as e}from"./jsx-runtime-LKYXHABd.js";var t=e(),n={title:`Heroes`,description:`Responsive hero sections and layouts for websites, applications and landing pages.`},r={contents:[{heading:`heroes`,content:`Heroes are introductory sections that establish the visual identity of a page.`},{heading:`heroes`,content:`Puzzle Pieces provides a flexible Hero component and a collection of specialized presets. All presets share the same underlying implementation, making them easy to customize without maintaining separate layouts.`},{heading:`installation`,content:`Import the Hero components from Puzzle Pieces:`},{heading:`components`,content:`| Component | Description            |
| --------- | ---------------------- |
| Hero      | Generic hero component |`,table:`table-0`},{heading:`components`,content:`| Component | Description                 |
| --------- | --------------------------- |
| SplitHero | Text and media side by side |`,table:`table-0`},{heading:`components`,content:`| Component    | Description           |
| ------------ | --------------------- |
| CenteredHero | Centered introduction |`,table:`table-0`},{heading:`components`,content:`| Component      | Description                |
| -------------- | -------------------------- |
| FullScreenHero | Full viewport introduction |`,table:`table-0`},{heading:`components`,content:`| Component | Description      |
| --------- | ---------------- |
| VideoHero | Background video |`,table:`table-0`},{heading:`components`,content:`| Component | Description                   |
| --------- | ----------------------------- |
| ImageHero | Background image with overlay |`,table:`table-0`},{heading:`components`,content:`| Component   | Description          |
| ----------- | -------------------- |
| MinimalHero | Minimal introduction |`,table:`table-0`},{heading:`components`,content:`| Component     | Description      |
| ------------- | ---------------- |
| EditorialHero | Editorial layout |`,table:`table-0`},{heading:`components`,content:`| Component  | Description                     |
| ---------- | ------------------------------- |
| AgencyHero | Agency and consultancy websites |`,table:`table-0`},{heading:`components`,content:`| Component   | Description           |
| ----------- | --------------------- |
| ProductHero | Product introductions |`,table:`table-0`},{heading:`components`,content:`| Component | Description           |
| --------- | --------------------- |
| SaaSHero  | SaaS product websites |`,table:`table-0`},{heading:`components`,content:`| Component | Description                   |
| --------- | ----------------------------- |
| StoreHero | Online stores and collections |`,table:`table-0`},{heading:`components`,content:`| Component      | Description                 |
| -------------- | --------------------------- |
| RestaurantHero | Restaurants and hospitality |`,table:`table-0`},{heading:`components`,content:`| Component         | Description                      |
| ----------------- | -------------------------------- |
| AccommodationHero | Hotels and holiday accommodation |`,table:`table-0`},{heading:`components`,content:`| Component     | Description         |
| ------------- | ------------------- |
| PrintShopHero | Printing businesses |`,table:`table-0`},{heading:`components`,content:`| Component            | Description             |
| -------------------- | ----------------------- |
| DashboardWelcomeHero | Dashboard introductions |`,table:`table-0`},{heading:`components`,content:`| Component | Description                   |
| --------- | ----------------------------- |
| AppHero   | Web application introductions |`,table:`table-0`},{heading:`components`,content:`| Component    | Description            |
| ------------ | ---------------------- |
| CampaignHero | Campaign landing pages |`,table:`table-0`},{heading:`components`,content:`| Component      | Description      |
| -------------- | ---------------- |
| ComingSoonHero | Pre-launch pages |`,table:`table-0`},{heading:`components`,content:`| Component  | Description              |
| ---------- | ------------------------ |
| SearchHero | Search-oriented websites |`,table:`table-0`},{heading:`basic-usage`,content:`Use Hero for complete control over the layout and content.`},{heading:`layouts`,content:`The Hero component supports four layout configurations.`},{heading:`split`,content:`Text and media are displayed in separate columns.`},{heading:`centered`,content:`Content is centered horizontally.`},{heading:`full-width`,content:`The inner container uses the full available width.`},{heading:`asymmetric`,content:`The media and content columns use different proportions.`},{heading:`media-positioning`,content:`Control where media is displayed using mediaPosition.`},{heading:`media-positioning`,content:`| Value | Description          |
| ----- | -------------------- |
| left  | Media before content |`,table:`table-1`},{heading:`media-positioning`,content:`| Value | Description         |
| ----- | ------------------- |
| right | Media after content |`,table:`table-1`},{heading:`media-positioning`,content:`| Value      | Description          |
| ---------- | -------------------- |
| background | Media behind content |`,table:`table-1`},{heading:`media-positioning`,content:`Background media can also be supplied directly.`},{heading:`height`,content:`Control the minimum height of the hero.`},{heading:`height`,content:`| Value | Description                   |
| ----- | ----------------------------- |
| auto  | Content determines the height |`,table:`table-2`},{heading:`height`,content:`| Value | Description                |
| ----- | -------------------------- |
| large | Large introductory section |`,table:`table-2`},{heading:`height`,content:`| Value    | Description                    |
| -------- | ------------------------------ |
| viewport | Minimum height of the viewport |`,table:`table-2`},{heading:`themes`,content:`Hero supports four theme configurations.`},{heading:`themes`,content:`| Value | Description               |
| ----- | ------------------------- |
| light | Standard light appearance |`,table:`table-3`},{heading:`themes`,content:`| Value | Description     |
| ----- | --------------- |
| dark  | Dark appearance |`,table:`table-3`},{heading:`themes`,content:`| Value    | Description                    |
| -------- | ------------------------------ |
| contrast | Contrasting surface appearance |`,table:`table-3`},{heading:`themes`,content:`| Value | Description              |
| ----- | ------------------------ |
| brand | Primary brand appearance |`,table:`table-3`},{heading:`themes`,content:`Hero consumes semantic Puzzle Theme tokens for its background, foreground, typography and spacing.`},{heading:`overlays`,content:`Overlays improve text readability when using background media.`},{heading:`overlays`,content:`| Value | Description |
| ----- | ----------- |
| none  | No overlay  |`,table:`table-4`},{heading:`overlays`,content:`| Value  | Description    |
| ------ | -------------- |
| subtle | Subtle overlay |`,table:`table-4`},{heading:`overlays`,content:`| Value  | Description    |
| ------ | -------------- |
| strong | Strong overlay |`,table:`table-4`},{heading:`overlays`,content:`| Value    | Description          |
| -------- | -------------------- |
| gradient | Directional gradient |`,table:`table-4`},{heading:`content`,content:`Hero supports several content slots.`},{heading:`eyebrow`,content:`A short introductory label above the heading.`},{heading:`description`,content:`Additional introductory text.`},{heading:`actions`,content:`Use existing Puzzle UI components for buttons and other actions.`},{heading:`search`,content:`The search slot can contain any existing Puzzle form components.`},{heading:`meta`,content:`Use meta for supplementary information such as availability, opening hours or product details.`},{heading:`children`,content:`Additional content can be placed between the description and the action slots.`},{heading:`children`,content:`Additional content goes here.`},{heading:`responsive-behavior`,content:`Hero automatically adapts its layout to smaller screens.`},{heading:`responsive-behavior`,content:`Split layouts become single-column layouts.`},{heading:`responsive-behavior`,content:`Asymmetric layouts become single-column layouts.`},{heading:`responsive-behavior`,content:`Media can move before content on mobile.`},{heading:`responsive-behavior`,content:`Typography uses responsive sizing.`},{heading:`responsive-behavior`,content:`Horizontal and vertical spacing adapt to available screen space.`},{heading:`responsive-behavior`,content:`Use reverseOnMobile to control the order of content and media.`},{heading:`responsive-behavior`,content:`Disable reversal when the content should remain before the media.`},{heading:`specialized-presets`,content:`Presets provide sensible defaults for common website types.`},{heading:`specialized-presets`,content:`All presets inherit the properties of Hero and can be customized.`},{heading:`videohero`,content:`Background videos are muted, loop automatically and respect the user's reduced-motion preference.`},{heading:`comingsoonhero`,content:`Notify me`},{heading:`customization`,content:`All presets inherit the full Hero API.`},{heading:`customization`,content:`For example, an AccommodationHero can use a split layout instead of its default background layout.`},{heading:`css-customization`,content:`Hero uses regular CSS and semantic Puzzle Theme tokens.`},{heading:`css-customization`,content:"The root element has the `puzzle-hero` class."},{heading:`css-customization`,content:`You can customize its appearance through CSS variables.`},{heading:`css-customization`,content:`You can also target individual elements using their class names.`},{heading:`css-customization`,content:`| Class       | Element      |
| ----------- | ------------ |
| puzzle-hero | Root element |`,table:`table-5`},{heading:`css-customization`,content:`| Class                | Element          |
| -------------------- | ---------------- |
| puzzle-hero\\_\\_inner | Layout container |`,table:`table-5`},{heading:`css-customization`,content:`| Class                  | Element           |
| ---------------------- | ----------------- |
| puzzle-hero\\_\\_content | Content container |`,table:`table-5`},{heading:`css-customization`,content:`| Class                | Element      |
| -------------------- | ------------ |
| puzzle-hero\\_\\_title | Main heading |`,table:`table-5`},{heading:`css-customization`,content:`| Class                      | Element     |
| -------------------------- | ----------- |
| puzzle-hero\\_\\_description | Description |`,table:`table-5`},{heading:`css-customization`,content:`| Class                  | Element |
| ---------------------- | ------- |
| puzzle-hero\\_\\_eyebrow | Eyebrow |`,table:`table-5`},{heading:`css-customization`,content:`| Class                | Element         |
| -------------------- | --------------- |
| puzzle-hero\\_\\_media | Media container |`,table:`table-5`},{heading:`css-customization`,content:`| Class                     | Element              |
| ------------------------- | -------------------- |
| puzzle-hero\\_\\_background | Background container |`,table:`table-5`},{heading:`css-customization`,content:`| Class                  | Element            |
| ---------------------- | ------------------ |
| puzzle-hero\\_\\_overlay | Background overlay |`,table:`table-5`},{heading:`css-customization`,content:`| Class                  | Element          |
| ---------------------- | ---------------- |
| puzzle-hero\\_\\_actions | Action container |`,table:`table-5`},{heading:`css-customization`,content:`| Class                 | Element          |
| --------------------- | ---------------- |
| puzzle-hero\\_\\_search | Search container |`,table:`table-5`},{heading:`css-customization`,content:`| Class               | Element                   |
| ------------------- | ------------------------- |
| puzzle-hero\\_\\_meta | Supplementary information |`,table:`table-5`},{heading:`accessibility`,content:`Hero is designed to work with assistive technologies.`},{heading:`accessibility`,content:`Uses semantic section elements by default.`},{heading:`accessibility`,content:`Supports custom semantic elements through the as property.`},{heading:`accessibility`,content:`Supports configurable heading levels through titleAs.`},{heading:`accessibility`,content:`Supports accessible labels.`},{heading:`accessibility`,content:`Decorative background images have empty alternative text.`},{heading:`accessibility`,content:`Background videos are hidden from assistive technology.`},{heading:`accessibility`,content:`Background videos respect prefers-reduced-motion.`},{heading:`accessibility`,content:`Interactive content remains accessible through its original Puzzle components.`},{heading:`accessibility`,content:`Always provide meaningful alternative text for informative images.`},{heading:`accessibility`,content:`Use one primary heading per page where appropriate.`},{heading:`hero-properties`,content:`| Property | Type        | Default |
| -------- | ----------- | ------- |
| as       | ElementType | section |`,table:`table-6`},{heading:`hero-properties`,content:`| Property | Type        | Default |
| -------- | ----------- | ------- |
| titleAs  | ElementType | h1      |`,table:`table-6`},{heading:`hero-properties`,content:`| Property | Type   | Default |
| -------- | ------ | ------- |
| id       | string | -       |`,table:`table-6`},{heading:`hero-properties`,content:`| Property | Type   | Default |
| -------- | ------ | ------- |
| testId   | string | -       |`,table:`table-6`},{heading:`hero-properties`,content:`| Property  | Type   | Default |
| --------- | ------ | ------- |
| className | string | -       |`,table:`table-6`},{heading:`hero-properties`,content:`| Property         | Type   | Default |
| ---------------- | ------ | ------- |
| contentClassName | string | -       |`,table:`table-6`},{heading:`hero-properties`,content:`| Property       | Type   | Default |
| -------------- | ------ | ------- |
| mediaClassName | string | -       |`,table:`table-6`},{heading:`hero-properties`,content:`| Property | Type          | Default |
| -------- | ------------- | ------- |
| style    | CSSProperties | -       |`,table:`table-6`},{heading:`hero-properties`,content:`| Property | Type       | Default |
| -------- | ---------- | ------- |
| layout   | HeroLayout | split   |`,table:`table-6`},{heading:`hero-properties`,content:`| Property      | Type              | Default |
| ------------- | ----------------- | ------- |
| mediaPosition | HeroMediaPosition | right   |`,table:`table-6`},{heading:`hero-properties`,content:`| Property  | Type          | Default |
| --------- | ------------- | ------- |
| alignment | HeroAlignment | start   |`,table:`table-6`},{heading:`hero-properties`,content:`| Property | Type       | Default |
| -------- | ---------- | ------- |
| height   | HeroHeight | auto    |`,table:`table-6`},{heading:`hero-properties`,content:`| Property | Type      | Default |
| -------- | --------- | ------- |
| theme    | HeroTheme | light   |`,table:`table-6`},{heading:`hero-properties`,content:`| Property | Type        | Default |
| -------- | ----------- | ------- |
| overlay  | HeroOverlay | none    |`,table:`table-6`},{heading:`hero-properties`,content:`| Property     | Type             | Default |
| ------------ | ---------------- | ------- |
| contentWidth | HeroContentWidth | normal  |`,table:`table-6`},{heading:`hero-properties`,content:`| Property        | Type    | Default |
| --------------- | ------- | ------- |
| reverseOnMobile | boolean | true    |`,table:`table-6`},{heading:`hero-properties`,content:`| Property | Type      | Default |
| -------- | --------- | ------- |
| eyebrow  | ReactNode | -       |`,table:`table-6`},{heading:`hero-properties`,content:`| Property | Type      | Default |
| -------- | --------- | ------- |
| title    | ReactNode | -       |`,table:`table-6`},{heading:`hero-properties`,content:`| Property    | Type      | Default |
| ----------- | --------- | ------- |
| description | ReactNode | -       |`,table:`table-6`},{heading:`hero-properties`,content:`| Property | Type      | Default |
| -------- | --------- | ------- |
| media    | ReactNode | -       |`,table:`table-6`},{heading:`hero-properties`,content:`| Property        | Type   | Default |
| --------------- | ------ | ------- |
| backgroundImage | string | -       |`,table:`table-6`},{heading:`hero-properties`,content:`| Property        | Type            | Default |
| --------------- | --------------- | ------- |
| backgroundVideo | HeroVideoSource | -       |`,table:`table-6`},{heading:`hero-properties`,content:`| Property | Type      | Default |
| -------- | --------- | ------- |
| actions  | ReactNode | -       |`,table:`table-6`},{heading:`hero-properties`,content:`| Property | Type      | Default |
| -------- | --------- | ------- |
| search   | ReactNode | -       |`,table:`table-6`},{heading:`hero-properties`,content:`| Property | Type      | Default |
| -------- | --------- | ------- |
| meta     | ReactNode | -       |`,table:`table-6`},{heading:`hero-properties`,content:`| Property | Type      | Default |
| -------- | --------- | ------- |
| children | ReactNode | -       |`,table:`table-6`},{heading:`hero-properties`,content:`| Property | Type     | Default |
| -------- | -------- | ------- |
| role     | AriaRole | -       |`,table:`table-6`},{heading:`hero-properties`,content:`| Property  | Type   | Default |
| --------- | ------ | ------- |
| ariaLabel | string | -       |`,table:`table-6`},{heading:`hero-properties`,content:`| Property       | Type   | Default |
| -------------- | ------ | ------- |
| ariaLabelledBy | string | -       |`,table:`table-6`}],headings:[{id:`heroes`,content:`Heroes`},{id:`installation`,content:`Installation`},{id:`components`,content:`Components`},{id:`basic-usage`,content:`Basic usage`},{id:`layouts`,content:`Layouts`},{id:`split`,content:`Split`},{id:`centered`,content:`Centered`},{id:`full-width`,content:`Full width`},{id:`asymmetric`,content:`Asymmetric`},{id:`media-positioning`,content:`Media positioning`},{id:`height`,content:`Height`},{id:`themes`,content:`Themes`},{id:`overlays`,content:`Overlays`},{id:`content`,content:`Content`},{id:`eyebrow`,content:`Eyebrow`},{id:`description`,content:`Description`},{id:`actions`,content:`Actions`},{id:`search`,content:`Search`},{id:`meta`,content:`Meta`},{id:`children`,content:`Children`},{id:`responsive-behavior`,content:`Responsive behavior`},{id:`specialized-presets`,content:`Specialized presets`},{id:`splithero`,content:`SplitHero`},{id:`centeredhero`,content:`CenteredHero`},{id:`fullscreenhero`,content:`FullScreenHero`},{id:`videohero`,content:`VideoHero`},{id:`imagehero`,content:`ImageHero`},{id:`minimalhero`,content:`MinimalHero`},{id:`editorialhero`,content:`EditorialHero`},{id:`agencyhero`,content:`AgencyHero`},{id:`producthero`,content:`ProductHero`},{id:`saashero`,content:`SaaSHero`},{id:`storehero`,content:`StoreHero`},{id:`restauranthero`,content:`RestaurantHero`},{id:`accommodationhero`,content:`AccommodationHero`},{id:`printshophero`,content:`PrintShopHero`},{id:`dashboardwelcomehero`,content:`DashboardWelcomeHero`},{id:`apphero`,content:`AppHero`},{id:`campaignhero`,content:`CampaignHero`},{id:`comingsoonhero`,content:`ComingSoonHero`},{id:`searchhero`,content:`SearchHero`},{id:`customization`,content:`Customization`},{id:`css-customization`,content:`CSS customization`},{id:`accessibility`,content:`Accessibility`},{id:`api-reference`,content:`API reference`},{id:`hero-properties`,content:`Hero properties`},{id:`herolayout`,content:`HeroLayout`},{id:`heromediaposition`,content:`HeroMediaPosition`},{id:`heroalignment`,content:`HeroAlignment`},{id:`heroheight`,content:`HeroHeight`},{id:`herotheme`,content:`HeroTheme`},{id:`herooverlay`,content:`HeroOverlay`},{id:`herocontentwidth`,content:`HeroContentWidth`},{id:`herovideosource`,content:`HeroVideoSource`}]},i=[{depth:1,url:`#heroes`,title:(0,t.jsx)(t.Fragment,{children:`Heroes`})},{depth:2,url:`#installation`,title:(0,t.jsx)(t.Fragment,{children:`Installation`})},{depth:2,url:`#components`,title:(0,t.jsx)(t.Fragment,{children:`Components`})},{depth:2,url:`#basic-usage`,title:(0,t.jsx)(t.Fragment,{children:`Basic usage`})},{depth:2,url:`#layouts`,title:(0,t.jsx)(t.Fragment,{children:`Layouts`})},{depth:3,url:`#split`,title:(0,t.jsx)(t.Fragment,{children:`Split`})},{depth:3,url:`#centered`,title:(0,t.jsx)(t.Fragment,{children:`Centered`})},{depth:3,url:`#full-width`,title:(0,t.jsx)(t.Fragment,{children:`Full width`})},{depth:3,url:`#asymmetric`,title:(0,t.jsx)(t.Fragment,{children:`Asymmetric`})},{depth:2,url:`#media-positioning`,title:(0,t.jsx)(t.Fragment,{children:`Media positioning`})},{depth:2,url:`#height`,title:(0,t.jsx)(t.Fragment,{children:`Height`})},{depth:2,url:`#themes`,title:(0,t.jsx)(t.Fragment,{children:`Themes`})},{depth:2,url:`#overlays`,title:(0,t.jsx)(t.Fragment,{children:`Overlays`})},{depth:2,url:`#content`,title:(0,t.jsx)(t.Fragment,{children:`Content`})},{depth:3,url:`#eyebrow`,title:(0,t.jsx)(t.Fragment,{children:`Eyebrow`})},{depth:3,url:`#description`,title:(0,t.jsx)(t.Fragment,{children:`Description`})},{depth:3,url:`#actions`,title:(0,t.jsx)(t.Fragment,{children:`Actions`})},{depth:3,url:`#search`,title:(0,t.jsx)(t.Fragment,{children:`Search`})},{depth:3,url:`#meta`,title:(0,t.jsx)(t.Fragment,{children:`Meta`})},{depth:3,url:`#children`,title:(0,t.jsx)(t.Fragment,{children:`Children`})},{depth:2,url:`#responsive-behavior`,title:(0,t.jsx)(t.Fragment,{children:`Responsive behavior`})},{depth:2,url:`#specialized-presets`,title:(0,t.jsx)(t.Fragment,{children:`Specialized presets`})},{depth:3,url:`#splithero`,title:(0,t.jsx)(t.Fragment,{children:`SplitHero`})},{depth:3,url:`#centeredhero`,title:(0,t.jsx)(t.Fragment,{children:`CenteredHero`})},{depth:3,url:`#fullscreenhero`,title:(0,t.jsx)(t.Fragment,{children:`FullScreenHero`})},{depth:3,url:`#videohero`,title:(0,t.jsx)(t.Fragment,{children:`VideoHero`})},{depth:3,url:`#imagehero`,title:(0,t.jsx)(t.Fragment,{children:`ImageHero`})},{depth:3,url:`#minimalhero`,title:(0,t.jsx)(t.Fragment,{children:`MinimalHero`})},{depth:3,url:`#editorialhero`,title:(0,t.jsx)(t.Fragment,{children:`EditorialHero`})},{depth:3,url:`#agencyhero`,title:(0,t.jsx)(t.Fragment,{children:`AgencyHero`})},{depth:3,url:`#producthero`,title:(0,t.jsx)(t.Fragment,{children:`ProductHero`})},{depth:3,url:`#saashero`,title:(0,t.jsx)(t.Fragment,{children:`SaaSHero`})},{depth:3,url:`#storehero`,title:(0,t.jsx)(t.Fragment,{children:`StoreHero`})},{depth:3,url:`#restauranthero`,title:(0,t.jsx)(t.Fragment,{children:`RestaurantHero`})},{depth:3,url:`#accommodationhero`,title:(0,t.jsx)(t.Fragment,{children:`AccommodationHero`})},{depth:3,url:`#printshophero`,title:(0,t.jsx)(t.Fragment,{children:`PrintShopHero`})},{depth:3,url:`#dashboardwelcomehero`,title:(0,t.jsx)(t.Fragment,{children:`DashboardWelcomeHero`})},{depth:3,url:`#apphero`,title:(0,t.jsx)(t.Fragment,{children:`AppHero`})},{depth:3,url:`#campaignhero`,title:(0,t.jsx)(t.Fragment,{children:`CampaignHero`})},{depth:3,url:`#comingsoonhero`,title:(0,t.jsx)(t.Fragment,{children:`ComingSoonHero`})},{depth:3,url:`#searchhero`,title:(0,t.jsx)(t.Fragment,{children:`SearchHero`})},{depth:2,url:`#customization`,title:(0,t.jsx)(t.Fragment,{children:`Customization`})},{depth:3,url:`#css-customization`,title:(0,t.jsx)(t.Fragment,{children:`CSS customization`})},{depth:2,url:`#accessibility`,title:(0,t.jsx)(t.Fragment,{children:`Accessibility`})},{depth:2,url:`#api-reference`,title:(0,t.jsx)(t.Fragment,{children:`API reference`})},{depth:3,url:`#hero-properties`,title:(0,t.jsx)(t.Fragment,{children:`Hero properties`})},{depth:3,url:`#herolayout`,title:(0,t.jsx)(t.Fragment,{children:`HeroLayout`})},{depth:3,url:`#heromediaposition`,title:(0,t.jsx)(t.Fragment,{children:`HeroMediaPosition`})},{depth:3,url:`#heroalignment`,title:(0,t.jsx)(t.Fragment,{children:`HeroAlignment`})},{depth:3,url:`#heroheight`,title:(0,t.jsx)(t.Fragment,{children:`HeroHeight`})},{depth:3,url:`#herotheme`,title:(0,t.jsx)(t.Fragment,{children:`HeroTheme`})},{depth:3,url:`#herooverlay`,title:(0,t.jsx)(t.Fragment,{children:`HeroOverlay`})},{depth:3,url:`#herocontentwidth`,title:(0,t.jsx)(t.Fragment,{children:`HeroContentWidth`})},{depth:3,url:`#herovideosource`,title:(0,t.jsx)(t.Fragment,{children:`HeroVideoSource`})}];function a(e){let n={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,img:`img`,li:`li`,p:`p`,pre:`pre`,span:`span`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...e.components},{AccommodationHero:r,AgencyHero:i,AppHero:a,Button:o,CampaignHero:c,CenteredHero:l,ComingSoonHero:u,DashboardWelcomeHero:d,EditorialHero:f,FullScreenHero:p,Hero:m,ImageHero:h,MinimalHero:g,Preview:_,PrintShopHero:v,ProductHero:y,RestaurantHero:b,SaaSHero:x,SearchHero:S,SplitHero:C,StoreHero:w,TextInput:T,VideoHero:E}=n;return r||s(`AccommodationHero`,!0),i||s(`AgencyHero`,!0),a||s(`AppHero`,!0),o||s(`Button`,!0),c||s(`CampaignHero`,!0),l||s(`CenteredHero`,!0),u||s(`ComingSoonHero`,!0),d||s(`DashboardWelcomeHero`,!0),f||s(`EditorialHero`,!0),p||s(`FullScreenHero`,!0),m||s(`Hero`,!0),h||s(`ImageHero`,!0),g||s(`MinimalHero`,!0),_||s(`Preview`,!0),v||s(`PrintShopHero`,!0),y||s(`ProductHero`,!0),b||s(`RestaurantHero`,!0),x||s(`SaaSHero`,!0),S||s(`SearchHero`,!0),C||s(`SplitHero`,!0),w||s(`StoreHero`,!0),T||s(`TextInput`,!0),E||s(`VideoHero`,!0),(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{id:`heroes`,children:`Heroes`}),`
`,(0,t.jsx)(n.p,{children:`Heroes are introductory sections that establish the visual identity of a page.`}),`
`,(0,t.jsx)(n.p,{children:`Puzzle Pieces provides a flexible Hero component and a collection of specialized presets. All presets share the same underlying implementation, making them easy to customize without maintaining separate layouts.`}),`
`,(0,t.jsx)(n.h2,{id:`installation`,children:`Installation`}),`
`,(0,t.jsx)(n.p,{children:`Import the Hero components from Puzzle Pieces:`}),`
`,(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(n.pre,{className:`shiki shiki-themes github-light github-dark`,style:{"--shiki-light":`#24292e`,"--shiki-dark":`#e1e4e8`,"--shiki-light-bg":`#fff`,"--shiki-dark-bg":`#24292e`},tabIndex:`0`,icon:`<svg viewBox="0 0 24 24"><path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z" fill="currentColor" /></svg>`,children:(0,t.jsxs)(n.code,{children:[(0,t.jsxs)(n.span,{className:`line`,children:[(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:`import`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:` {`})]}),`
`,(0,t.jsx)(n.span,{className:`line`,children:(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`  Hero,`})}),`
`,(0,t.jsx)(n.span,{className:`line`,children:(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`  SplitHero,`})}),`
`,(0,t.jsx)(n.span,{className:`line`,children:(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`  CenteredHero,`})}),`
`,(0,t.jsx)(n.span,{className:`line`,children:(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`  FullScreenHero,`})}),`
`,(0,t.jsx)(n.span,{className:`line`,children:(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`  ImageHero,`})}),`
`,(0,t.jsx)(n.span,{className:`line`,children:(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`  VideoHero,`})}),`
`,(0,t.jsxs)(n.span,{className:`line`,children:[(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`} `}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:`from`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#032F62`,"--shiki-dark":`#9ECBFF`},children:` "@puzzle-ui/pieces"`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`;`})]})]})})}),`
`,(0,t.jsx)(n.h2,{id:`components`,children:`Components`}),`
`,(0,t.jsxs)(n.table,{children:[(0,t.jsx)(n.thead,{children:(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.th,{children:`Component`}),(0,t.jsx)(n.th,{children:`Description`})]})}),(0,t.jsxs)(n.tbody,{children:[(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`Hero`}),(0,t.jsx)(n.td,{children:`Generic hero component`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`SplitHero`}),(0,t.jsx)(n.td,{children:`Text and media side by side`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`CenteredHero`}),(0,t.jsx)(n.td,{children:`Centered introduction`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`FullScreenHero`}),(0,t.jsx)(n.td,{children:`Full viewport introduction`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`VideoHero`}),(0,t.jsx)(n.td,{children:`Background video`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`ImageHero`}),(0,t.jsx)(n.td,{children:`Background image with overlay`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`MinimalHero`}),(0,t.jsx)(n.td,{children:`Minimal introduction`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`EditorialHero`}),(0,t.jsx)(n.td,{children:`Editorial layout`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`AgencyHero`}),(0,t.jsx)(n.td,{children:`Agency and consultancy websites`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`ProductHero`}),(0,t.jsx)(n.td,{children:`Product introductions`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`SaaSHero`}),(0,t.jsx)(n.td,{children:`SaaS product websites`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`StoreHero`}),(0,t.jsx)(n.td,{children:`Online stores and collections`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`RestaurantHero`}),(0,t.jsx)(n.td,{children:`Restaurants and hospitality`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`AccommodationHero`}),(0,t.jsx)(n.td,{children:`Hotels and holiday accommodation`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`PrintShopHero`}),(0,t.jsx)(n.td,{children:`Printing businesses`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`DashboardWelcomeHero`}),(0,t.jsx)(n.td,{children:`Dashboard introductions`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`AppHero`}),(0,t.jsx)(n.td,{children:`Web application introductions`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`CampaignHero`}),(0,t.jsx)(n.td,{children:`Campaign landing pages`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`ComingSoonHero`}),(0,t.jsx)(n.td,{children:`Pre-launch pages`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`SearchHero`}),(0,t.jsx)(n.td,{children:`Search-oriented websites`})]})]})]}),`
`,(0,t.jsx)(n.h2,{id:`basic-usage`,children:`Basic usage`}),`
`,(0,t.jsx)(n.p,{children:`Use Hero for complete control over the layout and content.`}),`
`,(0,t.jsx)(_,{code:`<Hero
  eyebrow="Welcome to Puzzle"
  title="Build better digital experiences."
  description="Create beautiful and responsive interfaces with reusable components."
  actions={<Button>Get started</Button>}
/>
`,children:(0,t.jsx)(m,{eyebrow:`Welcome to Puzzle`,title:`Build better digital experiences.`,description:`Create beautiful and responsive interfaces with reusable components.`,actions:(0,t.jsx)(o,{children:`Get started`})})}),`
`,(0,t.jsx)(n.h2,{id:`layouts`,children:`Layouts`}),`
`,(0,t.jsx)(n.p,{children:`The Hero component supports four layout configurations.`}),`
`,(0,t.jsx)(n.h3,{id:`split`,children:`Split`}),`
`,(0,t.jsx)(n.p,{children:`Text and media are displayed in separate columns.`}),`
`,(0,t.jsx)(_,{code:`<Hero
layout="split"
title="A better way to work."
description="Bring everything together in one place."
media={<img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format" alt="Product preview" />}
/>
`,children:(0,t.jsx)(m,{layout:`split`,title:`A better way to work.`,description:`Bring everything together in one place.`,media:(0,t.jsx)(n.img,{src:`https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format`,alt:`Product preview`})})}),`
`,(0,t.jsx)(n.h3,{id:`centered`,children:`Centered`}),`
`,(0,t.jsx)(n.p,{children:`Content is centered horizontally.`}),`
`,(0,t.jsx)(_,{code:`<Hero
layout="centered"
alignment="center"
title="Discover something new."
description="Explore everything we have to offer."
/>
`,children:(0,t.jsx)(m,{layout:`centered`,alignment:`center`,title:`Discover something new.`,description:`Explore everything we have to offer.`})}),`
`,(0,t.jsx)(n.h3,{id:`full-width`,children:`Full width`}),`
`,(0,t.jsx)(n.p,{children:`The inner container uses the full available width.`}),`
`,(0,t.jsx)(_,{code:`<Hero
layout="full-width"
title="Make an impression."
mediaPosition="background"
/>
`,children:(0,t.jsx)(m,{layout:`full-width`,title:`Make an impression.`,mediaPosition:`background`})}),`
`,(0,t.jsx)(n.h3,{id:`asymmetric`,children:`Asymmetric`}),`
`,(0,t.jsx)(n.p,{children:`The media and content columns use different proportions.`}),`
`,(0,t.jsx)(_,{code:`<Hero
layout="asymmetric"
title="Designed for ambitious teams."
media={<img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format" alt="Team collaborating" />}
/>
`,children:(0,t.jsx)(m,{layout:`asymmetric`,title:`Designed for ambitious teams.`,media:(0,t.jsx)(n.img,{src:`https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format`,alt:`Team collaborating`})})}),`
`,(0,t.jsx)(n.h2,{id:`media-positioning`,children:`Media positioning`}),`
`,(0,t.jsx)(n.p,{children:`Control where media is displayed using mediaPosition.`}),`
`,(0,t.jsxs)(n.table,{children:[(0,t.jsx)(n.thead,{children:(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.th,{children:`Value`}),(0,t.jsx)(n.th,{children:`Description`})]})}),(0,t.jsxs)(n.tbody,{children:[(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`left`}),(0,t.jsx)(n.td,{children:`Media before content`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`right`}),(0,t.jsx)(n.td,{children:`Media after content`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`background`}),(0,t.jsx)(n.td,{children:`Media behind content`})]})]})]}),`
`,(0,t.jsx)(_,{code:`<Hero
layout="split"
mediaPosition="left"
title="Media on the left."
media={<img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format" alt="Example" />}
/>
`,children:(0,t.jsx)(m,{layout:`split`,mediaPosition:`left`,title:`Media on the left.`,media:(0,t.jsx)(n.img,{src:`https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format`,alt:`Example`})})}),`
`,(0,t.jsx)(n.p,{children:`Background media can also be supplied directly.`}),`
`,(0,t.jsx)(_,{code:`<Hero
mediaPosition="background"
backgroundImage="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format"
title="Explore the world."
overlay="gradient"
/>
`,children:(0,t.jsx)(m,{mediaPosition:`background`,backgroundImage:`https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format`,title:`Explore the world.`,overlay:`gradient`})}),`
`,(0,t.jsx)(n.h2,{id:`height`,children:`Height`}),`
`,(0,t.jsx)(n.p,{children:`Control the minimum height of the hero.`}),`
`,(0,t.jsxs)(n.table,{children:[(0,t.jsx)(n.thead,{children:(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.th,{children:`Value`}),(0,t.jsx)(n.th,{children:`Description`})]})}),(0,t.jsxs)(n.tbody,{children:[(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`auto`}),(0,t.jsx)(n.td,{children:`Content determines the height`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`large`}),(0,t.jsx)(n.td,{children:`Large introductory section`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`viewport`}),(0,t.jsx)(n.td,{children:`Minimum height of the viewport`})]})]})]}),`
`,(0,t.jsx)(_,{code:`<Hero height="viewport" title="Welcome." />
`,children:(0,t.jsx)(m,{height:`viewport`,title:`Welcome.`})}),`
`,(0,t.jsx)(n.h2,{id:`themes`,children:`Themes`}),`
`,(0,t.jsx)(n.p,{children:`Hero supports four theme configurations.`}),`
`,(0,t.jsxs)(n.table,{children:[(0,t.jsx)(n.thead,{children:(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.th,{children:`Value`}),(0,t.jsx)(n.th,{children:`Description`})]})}),(0,t.jsxs)(n.tbody,{children:[(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`light`}),(0,t.jsx)(n.td,{children:`Standard light appearance`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`dark`}),(0,t.jsx)(n.td,{children:`Dark appearance`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`contrast`}),(0,t.jsx)(n.td,{children:`Contrasting surface appearance`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`brand`}),(0,t.jsx)(n.td,{children:`Primary brand appearance`})]})]})]}),`
`,(0,t.jsx)(_,{code:`<Hero theme="brand" title="Your brand, your experience." />
`,children:(0,t.jsx)(m,{theme:`brand`,title:`Your brand, your experience.`})}),`
`,(0,t.jsx)(n.p,{children:`Hero consumes semantic Puzzle Theme tokens for its background, foreground, typography and spacing.`}),`
`,(0,t.jsx)(n.h2,{id:`overlays`,children:`Overlays`}),`
`,(0,t.jsx)(n.p,{children:`Overlays improve text readability when using background media.`}),`
`,(0,t.jsxs)(n.table,{children:[(0,t.jsx)(n.thead,{children:(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.th,{children:`Value`}),(0,t.jsx)(n.th,{children:`Description`})]})}),(0,t.jsxs)(n.tbody,{children:[(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`none`}),(0,t.jsx)(n.td,{children:`No overlay`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`subtle`}),(0,t.jsx)(n.td,{children:`Subtle overlay`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`strong`}),(0,t.jsx)(n.td,{children:`Strong overlay`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`gradient`}),(0,t.jsx)(n.td,{children:`Directional gradient`})]})]})]}),`
`,(0,t.jsx)(_,{code:`<Hero
backgroundImage="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format"
overlay="gradient"
theme="dark"
title="Discover new places."
/>
`,children:(0,t.jsx)(m,{backgroundImage:`https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format`,overlay:`gradient`,theme:`dark`,title:`Discover new places.`})}),`
`,(0,t.jsx)(n.h2,{id:`content`,children:`Content`}),`
`,(0,t.jsx)(n.p,{children:`Hero supports several content slots.`}),`
`,(0,t.jsx)(n.h3,{id:`eyebrow`,children:`Eyebrow`}),`
`,(0,t.jsx)(n.p,{children:`A short introductory label above the heading.`}),`
`,(0,t.jsx)(_,{code:`<Hero eyebrow="Digital experiences" title="Build something remarkable." />
`,children:(0,t.jsx)(m,{eyebrow:`Digital experiences`,title:`Build something remarkable.`})}),`
`,(0,t.jsx)(n.h3,{id:`description`,children:`Description`}),`
`,(0,t.jsx)(n.p,{children:`Additional introductory text.`}),`
`,(0,t.jsx)(_,{code:`<Hero
title="Everything in one place."
description="A flexible platform for modern teams."
/>
`,children:(0,t.jsx)(m,{title:`Everything in one place.`,description:`A flexible platform for modern teams.`})}),`
`,(0,t.jsx)(n.h3,{id:`actions`,children:`Actions`}),`
`,(0,t.jsx)(n.p,{children:`Use existing Puzzle UI components for buttons and other actions.`}),`
`,(0,t.jsx)(_,{code:`<Hero
title="Get started."
actions={
  <>
    <Button>Get started</Button>
    <Button variant="secondary">Learn more</Button>
  </>
}
/>
`,children:(0,t.jsx)(m,{title:`Get started.`,actions:(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(o,{children:`Get started`}),(0,t.jsx)(o,{variant:`secondary`,children:`Learn more`})]})})}),`
`,(0,t.jsx)(n.h3,{id:`search`,children:`Search`}),`
`,(0,t.jsx)(n.p,{children:`The search slot can contain any existing Puzzle form components.`}),`
`,(0,t.jsx)(_,{code:`<Hero
layout="centered"
title="Find your next destination."
search={<TextInput type="search" aria-label="Search destinations" placeholder="Search destinations" />}
/>
`,children:(0,t.jsx)(m,{layout:`centered`,title:`Find your next destination.`,search:(0,t.jsx)(T,{type:`search`,"aria-label":`Search destinations`,placeholder:`Search destinations`})})}),`
`,(0,t.jsx)(n.h3,{id:`meta`,children:`Meta`}),`
`,(0,t.jsx)(n.p,{children:`Use meta for supplementary information such as availability, opening hours or product details.`}),`
`,(0,t.jsx)(_,{code:`<Hero
title="Stay somewhere special."
meta={
  <>
    <span>3 apartments</span>
    <span>Up to 9 guests</span>
  </>
}
/>
`,children:(0,t.jsx)(m,{title:`Stay somewhere special.`,meta:(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.span,{children:`3 apartments`}),(0,t.jsx)(n.span,{children:`Up to 9 guests`})]})})}),`
`,(0,t.jsx)(n.h3,{id:`children`,children:`Children`}),`
`,(0,t.jsx)(n.p,{children:`Additional content can be placed between the description and the action slots.`}),`
`,(0,t.jsx)(_,{code:`<Hero title="Welcome">
<p>Additional content goes here.</p>
</Hero>
`,children:(0,t.jsx)(m,{title:`Welcome`,children:(0,t.jsx)(`p`,{children:`Additional content goes here.`})})}),`
`,(0,t.jsx)(n.h2,{id:`responsive-behavior`,children:`Responsive behavior`}),`
`,(0,t.jsx)(n.p,{children:`Hero automatically adapts its layout to smaller screens.`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`Split layouts become single-column layouts.`}),`
`,(0,t.jsx)(n.li,{children:`Asymmetric layouts become single-column layouts.`}),`
`,(0,t.jsx)(n.li,{children:`Media can move before content on mobile.`}),`
`,(0,t.jsx)(n.li,{children:`Typography uses responsive sizing.`}),`
`,(0,t.jsx)(n.li,{children:`Horizontal and vertical spacing adapt to available screen space.`}),`
`]}),`
`,(0,t.jsx)(n.p,{children:`Use reverseOnMobile to control the order of content and media.`}),`
`,(0,t.jsx)(_,{code:`<Hero
layout="split"
reverseOnMobile
title="Mobile-first experiences."
media={<img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format" alt="Example" />}
/>
`,children:(0,t.jsx)(m,{layout:`split`,reverseOnMobile:!0,title:`Mobile-first experiences.`,media:(0,t.jsx)(n.img,{src:`https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format`,alt:`Example`})})}),`
`,(0,t.jsx)(n.p,{children:`Disable reversal when the content should remain before the media.`}),`
`,(0,t.jsx)(_,{code:`<Hero
layout="split"
reverseOnMobile={false}
title="Content first."
media={<img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format" alt="Example" />}
/>
`,children:(0,t.jsx)(m,{layout:`split`,reverseOnMobile:!1,title:`Content first.`,media:(0,t.jsx)(n.img,{src:`https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format`,alt:`Example`})})}),`
`,(0,t.jsx)(n.h2,{id:`specialized-presets`,children:`Specialized presets`}),`
`,(0,t.jsx)(n.p,{children:`Presets provide sensible defaults for common website types.`}),`
`,(0,t.jsx)(n.p,{children:`All presets inherit the properties of Hero and can be customized.`}),`
`,(0,t.jsx)(n.h3,{id:`splithero`,children:`SplitHero`}),`
`,(0,t.jsx)(_,{code:`<SplitHero
eyebrow="Our services"
title="Solutions built around your needs."
media={<img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format" alt="Services" />}
actions={<Button>Explore services</Button>}
/>
`,children:(0,t.jsx)(C,{eyebrow:`Our services`,title:`Solutions built around your needs.`,media:(0,t.jsx)(n.img,{src:`https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format`,alt:`Services`}),actions:(0,t.jsx)(o,{children:`Explore services`})})}),`
`,(0,t.jsx)(n.h3,{id:`centeredhero`,children:`CenteredHero`}),`
`,(0,t.jsx)(_,{code:`<CenteredHero
title="Welcome to our platform."
description="Everything you need to get started."
actions={<Button>Get started</Button>}
/>
`,children:(0,t.jsx)(l,{title:`Welcome to our platform.`,description:`Everything you need to get started.`,actions:(0,t.jsx)(o,{children:`Get started`})})}),`
`,(0,t.jsx)(n.h3,{id:`fullscreenhero`,children:`FullScreenHero`}),`
`,(0,t.jsx)(_,{code:`<FullScreenHero
backgroundImage="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format"
title="Experience something different."
actions={<Button>Discover more</Button>}
/>
`,children:(0,t.jsx)(p,{backgroundImage:`https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format`,title:`Experience something different.`,actions:(0,t.jsx)(o,{children:`Discover more`})})}),`
`,(0,t.jsx)(n.h3,{id:`videohero`,children:`VideoHero`}),`
`,(0,t.jsx)(_,{code:`<VideoHero
backgroundVideo={{
  src: "/videos/intro.mp4",
  type: "video/mp4",
  poster: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format",
}}
title="A world of possibilities."
/>
`,children:(0,t.jsx)(E,{backgroundVideo:{src:`/videos/intro.mp4`,type:`video/mp4`,poster:`https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format`},title:`A world of possibilities.`})}),`
`,(0,t.jsx)(n.p,{children:`Background videos are muted, loop automatically and respect the user's reduced-motion preference.`}),`
`,(0,t.jsx)(n.h3,{id:`imagehero`,children:`ImageHero`}),`
`,(0,t.jsx)(_,{code:`<ImageHero
backgroundImage="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format"
title="Find your inspiration."
overlay="gradient"
/>
`,children:(0,t.jsx)(h,{backgroundImage:`https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format`,title:`Find your inspiration.`,overlay:`gradient`})}),`
`,(0,t.jsx)(n.h3,{id:`minimalhero`,children:`MinimalHero`}),`
`,(0,t.jsx)(_,{code:`<MinimalHero
eyebrow="About us"
title="A simpler approach."
description="Discover our philosophy."
/>
`,children:(0,t.jsx)(g,{eyebrow:`About us`,title:`A simpler approach.`,description:`Discover our philosophy.`})}),`
`,(0,t.jsx)(n.h3,{id:`editorialhero`,children:`EditorialHero`}),`
`,(0,t.jsx)(_,{code:`<EditorialHero
eyebrow="Travel journal"
title="The beauty of slowing down."
media={<img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format" alt="Landscape" />}
/>
`,children:(0,t.jsx)(f,{eyebrow:`Travel journal`,title:`The beauty of slowing down.`,media:(0,t.jsx)(n.img,{src:`https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format`,alt:`Landscape`})})}),`
`,(0,t.jsx)(n.h3,{id:`agencyhero`,children:`AgencyHero`}),`
`,(0,t.jsx)(_,{code:`<AgencyHero
eyebrow="Digital agency"
title="We build products that move businesses forward."
description="Engineering, design and strategy."
media={<img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format" alt="Agency workspace" />}
actions={<Button>Start a project</Button>}
/>
`,children:(0,t.jsx)(i,{eyebrow:`Digital agency`,title:`We build products that move businesses forward.`,description:`Engineering, design and strategy.`,media:(0,t.jsx)(n.img,{src:`https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format`,alt:`Agency workspace`}),actions:(0,t.jsx)(o,{children:`Start a project`})})}),`
`,(0,t.jsx)(n.h3,{id:`producthero`,children:`ProductHero`}),`
`,(0,t.jsx)(_,{code:`<ProductHero
eyebrow="Introducing"
title="Meet your new favorite product."
media={<img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format" alt="Product" />}
actions={<Button>Explore product</Button>}
/>
`,children:(0,t.jsx)(y,{eyebrow:`Introducing`,title:`Meet your new favorite product.`,media:(0,t.jsx)(n.img,{src:`https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format`,alt:`Product`}),actions:(0,t.jsx)(o,{children:`Explore product`})})}),`
`,(0,t.jsx)(n.h3,{id:`saashero`,children:`SaaSHero`}),`
`,(0,t.jsx)(_,{code:`<SaaSHero
eyebrow="Project management"
title="Work smarter together."
description="Everything your team needs in one place."
media={<img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format" alt="Dashboard preview" />}
actions={<Button>Start free trial</Button>}
/>
`,children:(0,t.jsx)(x,{eyebrow:`Project management`,title:`Work smarter together.`,description:`Everything your team needs in one place.`,media:(0,t.jsx)(n.img,{src:`https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format`,alt:`Dashboard preview`}),actions:(0,t.jsx)(o,{children:`Start free trial`})})}),`
`,(0,t.jsx)(n.h3,{id:`storehero`,children:`StoreHero`}),`
`,(0,t.jsx)(_,{code:`<StoreHero
eyebrow="New collection"
title="Discover the latest collection."
media={<img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format" alt="Collection" />}
actions={<Button>Shop now</Button>}
/>
`,children:(0,t.jsx)(w,{eyebrow:`New collection`,title:`Discover the latest collection.`,media:(0,t.jsx)(n.img,{src:`https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format`,alt:`Collection`}),actions:(0,t.jsx)(o,{children:`Shop now`})})}),`
`,(0,t.jsx)(n.h3,{id:`restauranthero`,children:`RestaurantHero`}),`
`,(0,t.jsx)(_,{code:`<RestaurantHero
eyebrow="Restaurant"
title="Good food. Great company."
description="Seasonal ingredients and memorable evenings."
backgroundImage="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format"
actions={<Button>Reserve a table</Button>}
/>
`,children:(0,t.jsx)(b,{eyebrow:`Restaurant`,title:`Good food. Great company.`,description:`Seasonal ingredients and memorable evenings.`,backgroundImage:`https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format`,actions:(0,t.jsx)(o,{children:`Reserve a table`})})}),`
`,(0,t.jsx)(n.h3,{id:`accommodationhero`,children:`AccommodationHero`}),`
`,(0,t.jsx)(_,{code:`<AccommodationHero
eyebrow="Boutique accommodation"
title="Find your place in the world."
description="Discover beautiful places to stay."
backgroundImage="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format"
actions={<Button>Explore apartments</Button>}
/>
`,children:(0,t.jsx)(r,{eyebrow:`Boutique accommodation`,title:`Find your place in the world.`,description:`Discover beautiful places to stay.`,backgroundImage:`https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format`,actions:(0,t.jsx)(o,{children:`Explore apartments`})})}),`
`,(0,t.jsx)(n.h3,{id:`printshophero`,children:`PrintShopHero`}),`
`,(0,t.jsx)(_,{code:`<PrintShopHero
eyebrow="Professional printing"
title="Bring your ideas to life."
media={<img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format" alt="Printed materials" />}
actions={<Button>Explore products</Button>}
/>
`,children:(0,t.jsx)(v,{eyebrow:`Professional printing`,title:`Bring your ideas to life.`,media:(0,t.jsx)(n.img,{src:`https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format`,alt:`Printed materials`}),actions:(0,t.jsx)(o,{children:`Explore products`})})}),`
`,(0,t.jsx)(n.h3,{id:`dashboardwelcomehero`,children:`DashboardWelcomeHero`}),`
`,(0,t.jsx)(_,{code:`<DashboardWelcomeHero
eyebrow="Dashboard"
title="Good morning."
description="Here is an overview of your workspace."
actions={<Button>Create project</Button>}
/>
`,children:(0,t.jsx)(d,{eyebrow:`Dashboard`,title:`Good morning.`,description:`Here is an overview of your workspace.`,actions:(0,t.jsx)(o,{children:`Create project`})})}),`
`,(0,t.jsx)(n.h3,{id:`apphero`,children:`AppHero`}),`
`,(0,t.jsx)(_,{code:`<AppHero
eyebrow="Your workspace"
title="Everything you need to get things done."
media={<img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format" alt="Application preview" />}
actions={<Button>Open application</Button>}
/>
`,children:(0,t.jsx)(a,{eyebrow:`Your workspace`,title:`Everything you need to get things done.`,media:(0,t.jsx)(n.img,{src:`https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format`,alt:`Application preview`}),actions:(0,t.jsx)(o,{children:`Open application`})})}),`
`,(0,t.jsx)(n.h3,{id:`campaignhero`,children:`CampaignHero`}),`
`,(0,t.jsx)(_,{code:`<CampaignHero
eyebrow="Limited offer"
title="Something special is waiting for you."
backgroundImage="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format"
actions={<Button>Discover offer</Button>}
/>
`,children:(0,t.jsx)(c,{eyebrow:`Limited offer`,title:`Something special is waiting for you.`,backgroundImage:`https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format`,actions:(0,t.jsx)(o,{children:`Discover offer`})})}),`
`,(0,t.jsx)(n.h3,{id:`comingsoonhero`,children:`ComingSoonHero`}),`
`,(0,t.jsx)(_,{code:`<ComingSoonHero
eyebrow="Coming soon"
title="Something exciting is on its way."
description="Be the first to know when we launch."
>
<TextInput type="email" aria-label="Email address" placeholder="you@example.com" />
<Button>Notify me</Button>
</ComingSoonHero>
`,children:(0,t.jsxs)(u,{eyebrow:`Coming soon`,title:`Something exciting is on its way.`,description:`Be the first to know when we launch.`,children:[(0,t.jsx)(T,{type:`email`,"aria-label":`Email address`,placeholder:`you@example.com`}),(0,t.jsx)(o,{children:`Notify me`})]})}),`
`,(0,t.jsx)(n.h3,{id:`searchhero`,children:`SearchHero`}),`
`,(0,t.jsx)(_,{code:`<SearchHero
eyebrow="Discover"
title="Find exactly what you are looking for."
search={<TextInput type="search" aria-label="Search" placeholder="Search" />}
/>
`,children:(0,t.jsx)(S,{eyebrow:`Discover`,title:`Find exactly what you are looking for.`,search:(0,t.jsx)(T,{type:`search`,"aria-label":`Search`,placeholder:`Search`})})}),`
`,(0,t.jsx)(n.h2,{id:`customization`,children:`Customization`}),`
`,(0,t.jsx)(n.p,{children:`All presets inherit the full Hero API.`}),`
`,(0,t.jsx)(n.p,{children:`For example, an AccommodationHero can use a split layout instead of its default background layout.`}),`
`,(0,t.jsx)(_,{code:`<AccommodationHero
layout="split"
mediaPosition="right"
height="large"
theme="light"
overlay="none"
title="A different kind of stay."
media={<img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format" alt="Apartment" />}
/>
`,children:(0,t.jsx)(r,{layout:`split`,mediaPosition:`right`,height:`large`,theme:`light`,overlay:`none`,title:`A different kind of stay.`,media:(0,t.jsx)(n.img,{src:`https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=1024&h=1024&fit=crop&auto=format`,alt:`Apartment`})})}),`
`,(0,t.jsx)(n.h3,{id:`css-customization`,children:`CSS customization`}),`
`,(0,t.jsx)(n.p,{children:`Hero uses regular CSS and semantic Puzzle Theme tokens.`}),`
`,(0,t.jsxs)(n.p,{children:[`The root element has the `,(0,t.jsx)(n.code,{children:`puzzle-hero`}),` class.`]}),`
`,(0,t.jsx)(n.p,{children:`You can customize its appearance through CSS variables.`}),`
`,(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(n.pre,{className:`shiki shiki-themes github-light github-dark`,style:{"--shiki-light":`#24292e`,"--shiki-dark":`#e1e4e8`,"--shiki-light-bg":`#fff`,"--shiki-dark-bg":`#24292e`},tabIndex:`0`,icon:`<svg viewBox="0 0 24 24"><path d="M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z" fill="currentColor" /></svg>`,children:(0,t.jsxs)(n.code,{children:[(0,t.jsxs)(n.span,{className:`line`,children:[(0,t.jsx)(n.span,{style:{"--shiki-light":`#6F42C1`,"--shiki-dark":`#B392F0`},children:`.custom-hero`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:` {`})]}),`
`,(0,t.jsxs)(n.span,{className:`line`,children:[(0,t.jsx)(n.span,{style:{"--shiki-light":`#E36209`,"--shiki-dark":`#FFAB70`},children:`  --puzzle-hero-padding-inline`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`: `}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#005CC5`,"--shiki-dark":`#79B8FF`},children:`var`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`(`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#E36209`,"--shiki-dark":`#FFAB70`},children:`--puzzle-space-8`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`);`})]}),`
`,(0,t.jsxs)(n.span,{className:`line`,children:[(0,t.jsx)(n.span,{style:{"--shiki-light":`#E36209`,"--shiki-dark":`#FFAB70`},children:`  --puzzle-hero-padding-block`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`: `}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#005CC5`,"--shiki-dark":`#79B8FF`},children:`var`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`(`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#E36209`,"--shiki-dark":`#FFAB70`},children:`--puzzle-space-16`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`);`})]}),`
`,(0,t.jsxs)(n.span,{className:`line`,children:[(0,t.jsx)(n.span,{style:{"--shiki-light":`#E36209`,"--shiki-dark":`#FFAB70`},children:`  --puzzle-hero-gap`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`: `}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#005CC5`,"--shiki-dark":`#79B8FF`},children:`var`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`(`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#E36209`,"--shiki-dark":`#FFAB70`},children:`--puzzle-space-10`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`);`})]}),`
`,(0,t.jsxs)(n.span,{className:`line`,children:[(0,t.jsx)(n.span,{style:{"--shiki-light":`#E36209`,"--shiki-dark":`#FFAB70`},children:`  --puzzle-hero-background`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`: `}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#005CC5`,"--shiki-dark":`#79B8FF`},children:`var`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`(`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#E36209`,"--shiki-dark":`#FFAB70`},children:`--puzzle-color-surface`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`);`})]}),`
`,(0,t.jsxs)(n.span,{className:`line`,children:[(0,t.jsx)(n.span,{style:{"--shiki-light":`#E36209`,"--shiki-dark":`#FFAB70`},children:`  --puzzle-hero-foreground`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`: `}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#005CC5`,"--shiki-dark":`#79B8FF`},children:`var`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`(`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#E36209`,"--shiki-dark":`#FFAB70`},children:`--puzzle-color-text`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`);`})]}),`
`,(0,t.jsx)(n.span,{className:`line`,children:(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`}`})})]})})}),`
`,(0,t.jsx)(n.p,{children:`You can also target individual elements using their class names.`}),`
`,(0,t.jsxs)(n.table,{children:[(0,t.jsx)(n.thead,{children:(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.th,{children:`Class`}),(0,t.jsx)(n.th,{children:`Element`})]})}),(0,t.jsxs)(n.tbody,{children:[(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`puzzle-hero`}),(0,t.jsx)(n.td,{children:`Root element`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`puzzle-hero__inner`}),(0,t.jsx)(n.td,{children:`Layout container`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`puzzle-hero__content`}),(0,t.jsx)(n.td,{children:`Content container`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`puzzle-hero__title`}),(0,t.jsx)(n.td,{children:`Main heading`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`puzzle-hero__description`}),(0,t.jsx)(n.td,{children:`Description`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`puzzle-hero__eyebrow`}),(0,t.jsx)(n.td,{children:`Eyebrow`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`puzzle-hero__media`}),(0,t.jsx)(n.td,{children:`Media container`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`puzzle-hero__background`}),(0,t.jsx)(n.td,{children:`Background container`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`puzzle-hero__overlay`}),(0,t.jsx)(n.td,{children:`Background overlay`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`puzzle-hero__actions`}),(0,t.jsx)(n.td,{children:`Action container`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`puzzle-hero__search`}),(0,t.jsx)(n.td,{children:`Search container`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`puzzle-hero__meta`}),(0,t.jsx)(n.td,{children:`Supplementary information`})]})]})]}),`
`,(0,t.jsx)(n.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,t.jsx)(n.p,{children:`Hero is designed to work with assistive technologies.`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`Uses semantic section elements by default.`}),`
`,(0,t.jsx)(n.li,{children:`Supports custom semantic elements through the as property.`}),`
`,(0,t.jsx)(n.li,{children:`Supports configurable heading levels through titleAs.`}),`
`,(0,t.jsx)(n.li,{children:`Supports accessible labels.`}),`
`,(0,t.jsx)(n.li,{children:`Decorative background images have empty alternative text.`}),`
`,(0,t.jsx)(n.li,{children:`Background videos are hidden from assistive technology.`}),`
`,(0,t.jsx)(n.li,{children:`Background videos respect prefers-reduced-motion.`}),`
`,(0,t.jsx)(n.li,{children:`Interactive content remains accessible through its original Puzzle components.`}),`
`]}),`
`,(0,t.jsx)(n.p,{children:`Always provide meaningful alternative text for informative images.`}),`
`,(0,t.jsx)(n.p,{children:`Use one primary heading per page where appropriate.`}),`
`,(0,t.jsx)(n.h2,{id:`api-reference`,children:`API reference`}),`
`,(0,t.jsx)(n.h3,{id:`hero-properties`,children:`Hero properties`}),`
`,(0,t.jsxs)(n.table,{children:[(0,t.jsx)(n.thead,{children:(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.th,{children:`Property`}),(0,t.jsx)(n.th,{children:`Type`}),(0,t.jsx)(n.th,{children:`Default`})]})}),(0,t.jsxs)(n.tbody,{children:[(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`as`}),(0,t.jsx)(n.td,{children:`ElementType`}),(0,t.jsx)(n.td,{children:`section`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`titleAs`}),(0,t.jsx)(n.td,{children:`ElementType`}),(0,t.jsx)(n.td,{children:`h1`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`id`}),(0,t.jsx)(n.td,{children:`string`}),(0,t.jsx)(n.td,{children:`-`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`testId`}),(0,t.jsx)(n.td,{children:`string`}),(0,t.jsx)(n.td,{children:`-`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`className`}),(0,t.jsx)(n.td,{children:`string`}),(0,t.jsx)(n.td,{children:`-`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`contentClassName`}),(0,t.jsx)(n.td,{children:`string`}),(0,t.jsx)(n.td,{children:`-`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`mediaClassName`}),(0,t.jsx)(n.td,{children:`string`}),(0,t.jsx)(n.td,{children:`-`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`style`}),(0,t.jsx)(n.td,{children:`CSSProperties`}),(0,t.jsx)(n.td,{children:`-`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`layout`}),(0,t.jsx)(n.td,{children:`HeroLayout`}),(0,t.jsx)(n.td,{children:`split`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`mediaPosition`}),(0,t.jsx)(n.td,{children:`HeroMediaPosition`}),(0,t.jsx)(n.td,{children:`right`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`alignment`}),(0,t.jsx)(n.td,{children:`HeroAlignment`}),(0,t.jsx)(n.td,{children:`start`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`height`}),(0,t.jsx)(n.td,{children:`HeroHeight`}),(0,t.jsx)(n.td,{children:`auto`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`theme`}),(0,t.jsx)(n.td,{children:`HeroTheme`}),(0,t.jsx)(n.td,{children:`light`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`overlay`}),(0,t.jsx)(n.td,{children:`HeroOverlay`}),(0,t.jsx)(n.td,{children:`none`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`contentWidth`}),(0,t.jsx)(n.td,{children:`HeroContentWidth`}),(0,t.jsx)(n.td,{children:`normal`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`reverseOnMobile`}),(0,t.jsx)(n.td,{children:`boolean`}),(0,t.jsx)(n.td,{children:`true`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`eyebrow`}),(0,t.jsx)(n.td,{children:`ReactNode`}),(0,t.jsx)(n.td,{children:`-`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`title`}),(0,t.jsx)(n.td,{children:`ReactNode`}),(0,t.jsx)(n.td,{children:`-`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`description`}),(0,t.jsx)(n.td,{children:`ReactNode`}),(0,t.jsx)(n.td,{children:`-`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`media`}),(0,t.jsx)(n.td,{children:`ReactNode`}),(0,t.jsx)(n.td,{children:`-`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`backgroundImage`}),(0,t.jsx)(n.td,{children:`string`}),(0,t.jsx)(n.td,{children:`-`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`backgroundVideo`}),(0,t.jsx)(n.td,{children:`HeroVideoSource`}),(0,t.jsx)(n.td,{children:`-`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`actions`}),(0,t.jsx)(n.td,{children:`ReactNode`}),(0,t.jsx)(n.td,{children:`-`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`search`}),(0,t.jsx)(n.td,{children:`ReactNode`}),(0,t.jsx)(n.td,{children:`-`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`meta`}),(0,t.jsx)(n.td,{children:`ReactNode`}),(0,t.jsx)(n.td,{children:`-`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`children`}),(0,t.jsx)(n.td,{children:`ReactNode`}),(0,t.jsx)(n.td,{children:`-`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`role`}),(0,t.jsx)(n.td,{children:`AriaRole`}),(0,t.jsx)(n.td,{children:`-`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`ariaLabel`}),(0,t.jsx)(n.td,{children:`string`}),(0,t.jsx)(n.td,{children:`-`})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:`ariaLabelledBy`}),(0,t.jsx)(n.td,{children:`string`}),(0,t.jsx)(n.td,{children:`-`})]})]})]}),`
`,(0,t.jsx)(n.h3,{id:`herolayout`,children:`HeroLayout`}),`
`,(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(n.pre,{className:`shiki shiki-themes github-light github-dark`,style:{"--shiki-light":`#24292e`,"--shiki-dark":`#e1e4e8`,"--shiki-light-bg":`#fff`,"--shiki-dark-bg":`#24292e`},tabIndex:`0`,icon:`<svg viewBox="0 0 24 24"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="currentColor" /></svg>`,children:(0,t.jsx)(n.code,{children:(0,t.jsxs)(n.span,{className:`line`,children:[(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:`type`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#6F42C1`,"--shiki-dark":`#B392F0`},children:` HeroLayout`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:` =`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#032F62`,"--shiki-dark":`#9ECBFF`},children:` "centered"`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:` |`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#032F62`,"--shiki-dark":`#9ECBFF`},children:` "split"`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:` |`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#032F62`,"--shiki-dark":`#9ECBFF`},children:` "full-width"`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:` |`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#032F62`,"--shiki-dark":`#9ECBFF`},children:` "asymmetric"`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`;`})]})})})}),`
`,(0,t.jsx)(n.h3,{id:`heromediaposition`,children:`HeroMediaPosition`}),`
`,(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(n.pre,{className:`shiki shiki-themes github-light github-dark`,style:{"--shiki-light":`#24292e`,"--shiki-dark":`#e1e4e8`,"--shiki-light-bg":`#fff`,"--shiki-dark-bg":`#24292e`},tabIndex:`0`,icon:`<svg viewBox="0 0 24 24"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="currentColor" /></svg>`,children:(0,t.jsx)(n.code,{children:(0,t.jsxs)(n.span,{className:`line`,children:[(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:`type`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#6F42C1`,"--shiki-dark":`#B392F0`},children:` HeroMediaPosition`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:` =`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#032F62`,"--shiki-dark":`#9ECBFF`},children:` "left"`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:` |`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#032F62`,"--shiki-dark":`#9ECBFF`},children:` "right"`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:` |`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#032F62`,"--shiki-dark":`#9ECBFF`},children:` "background"`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`;`})]})})})}),`
`,(0,t.jsx)(n.h3,{id:`heroalignment`,children:`HeroAlignment`}),`
`,(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(n.pre,{className:`shiki shiki-themes github-light github-dark`,style:{"--shiki-light":`#24292e`,"--shiki-dark":`#e1e4e8`,"--shiki-light-bg":`#fff`,"--shiki-dark-bg":`#24292e`},tabIndex:`0`,icon:`<svg viewBox="0 0 24 24"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="currentColor" /></svg>`,children:(0,t.jsx)(n.code,{children:(0,t.jsxs)(n.span,{className:`line`,children:[(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:`type`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#6F42C1`,"--shiki-dark":`#B392F0`},children:` HeroAlignment`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:` =`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#032F62`,"--shiki-dark":`#9ECBFF`},children:` "start"`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:` |`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#032F62`,"--shiki-dark":`#9ECBFF`},children:` "center"`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:` |`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#032F62`,"--shiki-dark":`#9ECBFF`},children:` "end"`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`;`})]})})})}),`
`,(0,t.jsx)(n.h3,{id:`heroheight`,children:`HeroHeight`}),`
`,(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(n.pre,{className:`shiki shiki-themes github-light github-dark`,style:{"--shiki-light":`#24292e`,"--shiki-dark":`#e1e4e8`,"--shiki-light-bg":`#fff`,"--shiki-dark-bg":`#24292e`},tabIndex:`0`,icon:`<svg viewBox="0 0 24 24"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="currentColor" /></svg>`,children:(0,t.jsx)(n.code,{children:(0,t.jsxs)(n.span,{className:`line`,children:[(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:`type`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#6F42C1`,"--shiki-dark":`#B392F0`},children:` HeroHeight`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:` =`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#032F62`,"--shiki-dark":`#9ECBFF`},children:` "auto"`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:` |`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#032F62`,"--shiki-dark":`#9ECBFF`},children:` "large"`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:` |`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#032F62`,"--shiki-dark":`#9ECBFF`},children:` "viewport"`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`;`})]})})})}),`
`,(0,t.jsx)(n.h3,{id:`herotheme`,children:`HeroTheme`}),`
`,(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(n.pre,{className:`shiki shiki-themes github-light github-dark`,style:{"--shiki-light":`#24292e`,"--shiki-dark":`#e1e4e8`,"--shiki-light-bg":`#fff`,"--shiki-dark-bg":`#24292e`},tabIndex:`0`,icon:`<svg viewBox="0 0 24 24"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="currentColor" /></svg>`,children:(0,t.jsx)(n.code,{children:(0,t.jsxs)(n.span,{className:`line`,children:[(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:`type`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#6F42C1`,"--shiki-dark":`#B392F0`},children:` HeroTheme`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:` =`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#032F62`,"--shiki-dark":`#9ECBFF`},children:` "light"`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:` |`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#032F62`,"--shiki-dark":`#9ECBFF`},children:` "dark"`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:` |`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#032F62`,"--shiki-dark":`#9ECBFF`},children:` "contrast"`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:` |`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#032F62`,"--shiki-dark":`#9ECBFF`},children:` "brand"`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`;`})]})})})}),`
`,(0,t.jsx)(n.h3,{id:`herooverlay`,children:`HeroOverlay`}),`
`,(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(n.pre,{className:`shiki shiki-themes github-light github-dark`,style:{"--shiki-light":`#24292e`,"--shiki-dark":`#e1e4e8`,"--shiki-light-bg":`#fff`,"--shiki-dark-bg":`#24292e`},tabIndex:`0`,icon:`<svg viewBox="0 0 24 24"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="currentColor" /></svg>`,children:(0,t.jsx)(n.code,{children:(0,t.jsxs)(n.span,{className:`line`,children:[(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:`type`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#6F42C1`,"--shiki-dark":`#B392F0`},children:` HeroOverlay`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:` =`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#032F62`,"--shiki-dark":`#9ECBFF`},children:` "none"`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:` |`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#032F62`,"--shiki-dark":`#9ECBFF`},children:` "subtle"`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:` |`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#032F62`,"--shiki-dark":`#9ECBFF`},children:` "strong"`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:` |`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#032F62`,"--shiki-dark":`#9ECBFF`},children:` "gradient"`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`;`})]})})})}),`
`,(0,t.jsx)(n.h3,{id:`herocontentwidth`,children:`HeroContentWidth`}),`
`,(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(n.pre,{className:`shiki shiki-themes github-light github-dark`,style:{"--shiki-light":`#24292e`,"--shiki-dark":`#e1e4e8`,"--shiki-light-bg":`#fff`,"--shiki-dark-bg":`#24292e`},tabIndex:`0`,icon:`<svg viewBox="0 0 24 24"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="currentColor" /></svg>`,children:(0,t.jsx)(n.code,{children:(0,t.jsxs)(n.span,{className:`line`,children:[(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:`type`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#6F42C1`,"--shiki-dark":`#B392F0`},children:` HeroContentWidth`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:` =`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#032F62`,"--shiki-dark":`#9ECBFF`},children:` "narrow"`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:` |`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#032F62`,"--shiki-dark":`#9ECBFF`},children:` "normal"`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:` |`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#032F62`,"--shiki-dark":`#9ECBFF`},children:` "wide"`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:` |`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#032F62`,"--shiki-dark":`#9ECBFF`},children:` "full"`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`;`})]})})})}),`
`,(0,t.jsx)(n.h3,{id:`herovideosource`,children:`HeroVideoSource`}),`
`,(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(n.pre,{className:`shiki shiki-themes github-light github-dark`,style:{"--shiki-light":`#24292e`,"--shiki-dark":`#e1e4e8`,"--shiki-light-bg":`#fff`,"--shiki-dark-bg":`#24292e`},tabIndex:`0`,icon:`<svg viewBox="0 0 24 24"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="currentColor" /></svg>`,children:(0,t.jsxs)(n.code,{children:[(0,t.jsxs)(n.span,{className:`line`,children:[(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:`type`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#6F42C1`,"--shiki-dark":`#B392F0`},children:` HeroVideoSource`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:` =`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:` {`})]}),`
`,(0,t.jsxs)(n.span,{className:`line`,children:[(0,t.jsx)(n.span,{style:{"--shiki-light":`#E36209`,"--shiki-dark":`#FFAB70`},children:`  src`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:`:`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#005CC5`,"--shiki-dark":`#79B8FF`},children:` string`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`;`})]}),`
`,(0,t.jsxs)(n.span,{className:`line`,children:[(0,t.jsx)(n.span,{style:{"--shiki-light":`#E36209`,"--shiki-dark":`#FFAB70`},children:`  type`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:`?:`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#005CC5`,"--shiki-dark":`#79B8FF`},children:` string`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`;`})]}),`
`,(0,t.jsxs)(n.span,{className:`line`,children:[(0,t.jsx)(n.span,{style:{"--shiki-light":`#E36209`,"--shiki-dark":`#FFAB70`},children:`  poster`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#D73A49`,"--shiki-dark":`#F97583`},children:`?:`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#005CC5`,"--shiki-dark":`#79B8FF`},children:` string`}),(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`;`})]}),`
`,(0,t.jsx)(n.span,{className:`line`,children:(0,t.jsx)(n.span,{style:{"--shiki-light":`#24292E`,"--shiki-dark":`#E1E4E8`},children:`};`})})]})})})]})}function o(e={}){let{wrapper:n}=e.components||{};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(a,{...e})}):a(e)}function s(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{o as default,n as frontmatter,r as structuredData,i as toc};