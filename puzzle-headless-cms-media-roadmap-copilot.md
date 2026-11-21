# Puzzle — Headless CMS & Media Platform

## Roadmap, epics, features, actions en Copilot-implementatie-instructies

**Repo-baseline:** `main`, tree SHA `8ab5e70fa8cf7b76d1e4683e7e7ac34a02e5a51b`  
**Datum controle:** 21 november 2026

Dit document beschrijft hoe Puzzle kan doorgroeien van een UI/full-stack toolkit naar een herbruikbare basis voor een headless CMS. Het behandelt zowel de CMS-domeinlaag als de media-workflow, inclusief bestandsbeheer, image processing, crop/hotspots, video-upload en frameworkintegraties.

De voorstellen hieronder zijn aanvullingen op de huidige repository. Nieuwe packages, componenten en exports bestaan dus nog niet tenzij ze expliciet als bestaand worden aangeduid.

---

# 1. Huidige situatie: wat bestaat al?

De inventarisatie is gebaseerd op de huidige `main`-tree en de relevante package-instructies, exports en implementaties.

## 1.1 Bestaande onderdelen die we moeten hergebruiken

| Bestaand onderdeel | Huidige rol | Gevolg voor de roadmap |
| --- | --- | --- |
| `@puzzle-ui/ui` `FileUpload` | Generieke file picker/dropzone met type-, grootte- en aantalvalidatie, uploadcallback, voortgang, fouten en retry. | Niet vervangen door een tweede generieke uploader. Gebruik dit als basis of breid het gericht uit als een aantoonbaar generiek gat bestaat. |
| `Image`, `ImageBox`, `MediaFrame` | Media weergeven, afbeeldingen presenteren en media in een frame tonen. | Geen tweede generieke Image/Gallery/MediaFrame maken. |
| `TextEditor` | Seriële `TextDocument` met paragrafen, headings, list items, inline bold/italic/underline/strike en links. | Geschikt als eenvoudige teksteditor, maar nog geen volledige CMS block/rich-content editor. Breid gecontroleerd uit of maak een aparte schema-gedreven BlockEditor. |
| `Autocomplete` | Zoeken en selecteren; ondersteunt ook `multiple`, vrije invoer en selectiebeperkingen. | Geen aparte Combobox of MultiSelect toevoegen zolang deze API volstaat. |
| `DataTable` | Asynchroon items laden per range, sorteren en lokaal zoeken binnen geladen items. | Gebruiken voor content- en assetlijsten. Eventuele serverfilters, selectie en bulkacties alleen toevoegen als generieke functionaliteit en API dat rechtvaardigen. |
| `TreeView` | Bestaande boomstructuurcomponent. | Hergebruiken voor foldernavigatie en hiërarchische contentstructuren. |
| `Dialog`, `Drawer`, `Popover`, `DropdownMenu`, `Command`, `Notification` | Bestaande overlays, acties, command UI en meldingen. | Geen alternatieve overlay- of commandlaag bouwen. |
| `Sidebar`, `CollapsibleSidebar`, `PageLayout`, `ResizablePanels`, `DashboardShell`, `DashboardHeader`, `DashboardNavigation` en settings-pieces | Bestaande layout- en dashboardbouwstenen. | Een CMS-shell moet deze composities benutten in plaats van een volledig eigen layoutframework te introduceren. |
| `SettingsSection`, `SettingsGroup`, `SettingsRow`, `FormActions`, `ProfileHeader`, `SecurityMethodCard` | Bestaande settings- en profielcomposities. | Geen generiek SettingsLayout/UserProfile opnieuw bouwen. |
| `ConfirmAction`, `Feedback`, `OnboardingSection`, `Project` | Bestaande Pieces voor bevestiging, feedback, onboarding en projectpresentatie. | Alleen aanvullen wanneer een concreet CMS-use-case niet met deze componenten kan worden samengesteld. |
| `VideoSection`, `HeroVideo`, `VideoHero` en de bestaande hero-/gallery-pieces | Video en media presenteren in een website. | Deze zijn geen video-upload-, transcode- of media-managementoplossing. |

### Belangrijke huidige beperkingen

1. `FileUpload` verzorgt de generieke selectie- en uploadinteractie. Het biedt zelf geen image resize, image crop, hotspotselectie, media-assetregistratie, object storage, folderstructuur of media library.
2. `@puzzle-ui/fullstack` bevat momenteel alleen de Auth-subpaths (`auth/client`, `auth/shared`, `auth/server`, `auth/next`, `auth/tanstack`). Er is nog geen media- of CMS-API.
3. `@puzzle-ui/storage` is een database-neutraal record-/query-/migratiecontract. De `StorageAdapter` is niet bedoeld om grote binaire bestanden op te slaan.
4. De bestaande `TextEditor` is een beperkte, seriële teksteditor. Het huidige documentmodel kent geen image-, embed-, table-, reference- of geneste blocknodes.
5. `DataTable` en `Autocomplete` kunnen al veel CMS-werk doen. Bouw dus geen alternatieve tabel, combobox of multiselect zonder eerst een concreet functioneel tekort aan te tonen.

## 1.2 Wat nog ontbreekt voor een bruikbare headless CMS-basis

- Een media-domeinmodel met assets, mappen, metadata, varianten, gebruiksreferenties en verwerkingsstatus.
- Een aparte binary/object-storagecontractlaag naast de bestaande record storage.
- Een beveiligde upload lifecycle: upload intent, directe upload, afronding, servervalidatie, verwerking en publicatie van het asset.
- Browser-side image processing met instelbare maximumafmetingen en optionele responsive varianten.
- Image crop en genormaliseerde focal-point/hotspotgegevens.
- Video-upload met metadata, poster en hervatbare upload; plus een asynchrone transcodingpipeline.
- Een Media Library/File Manager met zoeken, mappen, selectie, metadata, bulkacties en asset picking.
- Een CMS-domeinlaag voor content types, dynamische velden, entries, relaties, lokalisatie, drafts, revisies en publiceren.
- Fullstack client/server/frameworkintegraties voor de CMS- en media-API's.
- Een CMS-admininterface die de bestaande UI- en Pieces-componenten composeert.

---

# 2. Aanbevolen architectuur en packagegrenzen

## 2.1 Packages

Ik adviseer twee nieuwe domeinpackages en uitbreiding van Fullstack. Daarmee blijft de verantwoordelijkheidsverdeling vergelijkbaar met de bestaande Auth/Session/Storage-opzet.

### Nieuw: `@puzzle-ui/media`

Framework- en provider-neutrale media-domeinlaag.

Verantwoordelijkheden:
- Media types en serialiseerbare contracts.
- Asset-, folder-, variant-, hotspot- en processing-jobmodellen.
- `MediaObjectStorageAdapter` voor binaire objecten.
- `MediaProcessor` / `VideoTranscoder` contracts.
- Upload- en processingstatussen, validatieregels en fouttypen.
- Provider-neutrale service orchestration en contracttests.

Voorgestelde entry points:
- `@puzzle-ui/media` — core contracts en services.
- `@puzzle-ui/media/browser` — optionele browser utilities voor image preparation en video metadata/posters.
- `@puzzle-ui/media/testing` — conformance helpers voor adapters.

**Niet hier:** React-componenten, Next/TanStack routes, databasevendorcode, S3/R2 credentials of een verplichte transcodingprovider.

### Nieuw: `@puzzle-ui/cms`

Framework-neutrale CMS-domeinlaag.

Verantwoordelijkheden:
- Content type- en field-schema's.
- Content entry lifecycle, validatie en querycontracten.
- Draft/published/archived status, revisies en publicatieplanning.
- Lokalisatie, slugregels en relationele verwijzingen.
- Authorisatie via door de applicatie aangeleverde access-policy callbacks.
- Persistente metadata via de bestaande `@puzzle-ui/storage`-contracten.
- Verwijzingen naar media via asset-ID's uit `@puzzle-ui/media`.

Voorgestelde entry points:
- `@puzzle-ui/cms` — core types, validators en services.
- `@puzzle-ui/cms/testing` — testfixtures en contract/conformance helpers.

**Niet hier:** React, routing, een eigen databaseadapter, opslag van file bytes of app-specifieke rollen/gebruikersbeheer.

### Uitbreiden: `@puzzle-ui/fullstack`

Fullstack blijft de browser/client- en Request/Response-integratielaag. Behoud alle bestaande Auth-exports exact en voeg aparte media- en CMS-subpaths toe.

Voorgestelde media-subpaths:
- `@puzzle-ui/fullstack/media/client`
- `@puzzle-ui/fullstack/media/shared`
- `@puzzle-ui/fullstack/media/server`
- `@puzzle-ui/fullstack/media/next`
- `@puzzle-ui/fullstack/media/tanstack`

Voorgestelde CMS-subpaths:
- `@puzzle-ui/fullstack/cms/client`
- `@puzzle-ui/fullstack/cms/shared`
- `@puzzle-ui/fullstack/cms/server`
- `@puzzle-ui/fullstack/cms/next`
- `@puzzle-ui/fullstack/cms/tanstack`

Client/server isolation blijft even streng als voor Auth. Geen root export introduceren tenzij de huidige package-architectuur daar bewust van afwijkt.

### Bestaand: `@puzzle-ui/storage`

Blijft verantwoordelijk voor database-records, query's, conditional writes en migraties. Gebruik deze laag voor assetmetadata, content entries en revisies. Sla geen media-binaries op in MongoDB- of D1-records.

### Bestaand: `@puzzle-ui/ui` en `@puzzle-ui/pieces`

- `ui`: generieke interactieve controls en editor primitives. `ImageUpload` en `VideoUpload` krijgen alleen client-side media APIs; de uploadtransport-/serverconfiguratie wordt geïnjecteerd of via een client callback geleverd.
- `pieces`: complete, composable CMS/media-workflows en adminpagina-onderdelen. Pieces gebruiken publieke media-types en consumer-provided data/actions, maar importeren Fullstack-servercode niet.
- Geen backend-, router- of persistencelogica in UI/Pieces.

### Voorgestelde dependency graph

```text
@puzzle-ui/cms ───────► @puzzle-ui/media ───────► @puzzle-ui/storage
      │                         ▲
      └─────────────────────────┘

@puzzle-ui/fullstack ─► @puzzle-ui/cms / @puzzle-ui/media
      │
      └───────────────────────► @puzzle-ui/ui

@puzzle-ui/ui ────────────────► @puzzle-ui/media/browser (alleen browser-safe utility subpath)
@puzzle-ui/pieces ────────────► @puzzle-ui/ui + @puzzle-ui/media (publieke types)
```

De precieze dependency edges moeten overeenkomen met de daadwerkelijke benodigde imports. Een type-only import verdient de voorkeur als runtimegedrag niet nodig is. Houd vooral `@puzzle-ui/pieces` los van `@puzzle-ui/fullstack`, zodat de presentatiebibliotheek framework- en API-onafhankelijk blijft.

## 2.2 Datastroom voor media

```text
Browser (ImageUpload / VideoUpload / MediaLibrary)
        │
        ├── 1. create upload intent (Fullstack server)
        │       ├── Auth/session + tenant + permission check
        │       ├── quota/type/size policy
        │       └── MediaObjectStorageAdapter maakt uploadtarget
        │
        ├── 2. direct upload naar object storage
        │       └── single PUT / multipart / resumable protocol
        │
        ├── 3. finalize upload (Fullstack server)
        │       ├── object bestaat + werkelijke grootte/checksum controleren
        │       ├── MIME/signature/metadata valideren
        │       └── assetmetadata opslaan via @puzzle-ui/storage
        │
        └── 4. processing queue
                ├── image variants en metadata
                ├── video poster + renditions via VideoTranscoder
                └── status ready / failed terug naar Media Library
```

De browser uploadt grote bytes rechtstreeks naar de object store via kortlevende uploadrechten. De appserver geeft geen permanent opslagcredential aan de browser en hoeft niet alle videobytes door zichzelf heen te proxy'en.

## 2.3 Datastroom voor CMS-content

```text
CMS React client (Fullstack CMS client)
        │
        ├── typed API / hooks
        │
        ▼
Fullstack CMS route handlers
        ├── Auth/session en tenant-context
        ├── permission callback
        ├── input/schema validation
        └── @puzzle-ui/cms service
                ├── @puzzle-ui/storage: content types, entries, revisions
                └── @puzzle-ui/media: asset references
```

Publieke content delivery moet gescheiden zijn van adminmutaties. Een client-side auth-state is nooit de autorisatiegrens; elke serverroute controleert gebruiker, tenant en permission opnieuw.

---

# 3. Media- en CMS-datamodel: minimale contracten

Copilot mag deze modellen verfijnen op basis van bestaande Storage-conventies, maar mag de volgende capabilities niet overslaan.

## 3.1 MediaAsset

Minimaal:
- `id`, `tenantId` / scope-key, `folderId`.
- `originalName`, veilige `displayName`, `kind` (`image`, `video`, `audio`, `document`, `other`).
- `mimeType` (server-geverifieerd), `size`, `checksum`.
- `width`, `height`, `duration`, `orientation` waar van toepassing.
- `status`: `pending-upload`, `uploaded`, `processing`, `ready`, `failed`, `deleted`.
- `altText`, `caption`, `title`, `description`, `tags`.
- `crop` / focal point en `hotspots` in genormaliseerde coördinaten.
- `variants[]` met type, dimensions, format, size, object reference en status.
- `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `deletedAt`.

Geen presigned URL, storage secret of permanente toegangstoken opslaan in dit record. Object keys zijn interne serverdata en niet de identiteit van een asset.

## 3.2 MediaFolder

Minimaal:
- `id`, `tenantId`, `parentId`, `name`, timestamps en actorvelden.
- Foldernamen zijn niet uniek over de hele store; unieke naamregels gelden binnen dezelfde parent/scope.
- Move/rename moet descendants en assetkoppelingen correct behouden.
- Verwijderen van een niet-lege folder vereist een expliciete policy: blokkeren, inhoud verplaatsen of recursief soft-delete.

## 3.3 MediaVariant

Minimaal:
- `id` / role (`original`, `mobile`, `tablet`, `desktop`, `thumbnail`, `poster`, `video-360p`, `video-720p`, `video-1080p`).
- `width`, `height`, `format`, `size`, eventueel bitrate/codecs/duration.
- status, internal object reference en creation metadata.

Gebruik configureerbare transform profiles; hardcode de namen niet als vaste technische resolutie. Profielen kunnen bijvoorbeeld standaard maximaal 480px, 1024px en 1600px breed zijn, maar afmetingen en kwaliteit moeten door de applicatie instelbaar zijn. Behoud aspect ratio en upscale nooit zonder expliciete opdracht.

## 3.4 CMS-content

Minimaal:
- `ContentTypeDefinition`: slug, naam, beschrijving, field definitions, versie en opties.
- `ContentFieldDefinition`: key, type, label, required, validation, localization, default, UI hints en relation config.
- `ContentEntry`: type, slug, locale, fields, status, revision, timestamps en actors.
- `ContentRevision`: snapshot, revision number, author, timestamp, change summary en lifecycle metadata.
- `ContentRelation`: verwijzing naar content type/entry en optioneel locale/relationship policy.

Content statuses minimaal: `draft`, `published`, `scheduled`, `archived`. Publicatie en terugzetten van oude versies moeten revision-safe zijn en concurrency/conflicts afhandelen.

---

# 4. Technische keuzes die richting geven

## 4.1 Images: client-side resize is de standaard waar dit past

Voor gewone images is client-side pre-processing goed toepasbaar. Maak een browser utility in `@puzzle-ui/media/browser` die:

- `maxWidth` en `maxHeight` accepteert.
- Aspect ratio bewaart en niet upscalet.
- Een configureerbaar outputformaat en quality ondersteunt.
- EXIF orientation correct verwerkt en privacygevoelige metadata standaard niet onbedoeld doorstuurt.
- Transparantie bewaart wanneer het outputformaat dit ondersteunt.
- Een abort signal en voortgang/processing state ondersteunt.
- In een Web Worker/OffscreenCanvas werkt waar beschikbaar en een veilige browserfallback heeft.
- Een origin/retention policy ondersteunt: originele upload behouden, alleen geoptimaliseerde versie bewaren of beide.

Naast één maximale outputafmeting moet de API optioneel meerdere named profiles ondersteunen, bijvoorbeeld `mobile`, `tablet` en `desktop`. Dit is geen reden om op elke upload automatisch drie versies te genereren: de applicatie kiest de profielen die haar contentstrategie nodig heeft.

**Belangrijk:** bewaar voor CMS-afbeeldingen bij voorkeur het origineel of een expliciet ingestelde mastervariant. Zonder master kan de gebruiker later niet betrouwbaar opnieuw croppen of hogere kwaliteit-afgeleiden maken.

## 4.2 Crop en hotspots zijn twee verschillende gegevens

- Crop bepaalt welk rechthoekig deel van de originele afbeelding in een bepaalde verhouding wordt gebruikt.
- Focal point/hotspot beschrijft een belangrijk punt of meerdere interactieve punten op de afbeelding.

Sla crop- en hotspotcoördinaten genormaliseerd op (`0..1`), niet als vaste pixels. Daarmee blijven ze bruikbaar op verschillende afgeleide formaten en schermgroottes. Definieer expliciet of coördinaten ten opzichte van het originele beeld, de crop of de uiteindelijke output gelden.

`ImageCropper` geeft een cropresultaat terug; `ImageHotspotEditor` beheert focal points/hotspots. Houd de twee APIs gescheiden, maar laat ze naast elkaar composeerbaar zijn.

## 4.3 Video: browser-side preflight, server/worker-side transcoding als betrouwbare standaard

De gewenste mobile/tablet/desktop-output voor video is in de praktijk een rendition-/adaptive-streamingprofiel, niet alleen een simpele `resize()`-operatie.

Aanbevolen standaardpipeline:
1. In de browser: type-/groottecontrole, duur/dimensies ophalen, lokale preview, posterframe en optionele eenvoudige voorbereiding.
2. Upload: origineel via multipart/resumable upload rechtstreeks naar object storage.
3. Na upload: asynchrone verwerking via een `VideoTranscoder` adapter/worker.
4. Output: configureerbare resolutie-/bitrateprofielen, poster/thumbnail en waar nodig een adaptive HLS/DASH-manifest.
5. Asset blijft `processing` totdat alle verplichte varianten klaar zijn; fouten en retry zijn zichtbaar.

Maak browser-side videotranscoding optioneel, capability-detected en nooit de enige route. WebCodecs kan video/audio encoderen in browsers en dedicated workers, maar codecbeschikbaarheid verschilt per device en het API levert zelf geen mux/demux van bestanden. `ffmpeg.wasm` kan browsertranscoding doen, maar draait zware verwerking in een worker en de multithreadvariant vereist extra cross-origin isolation/SharedArrayBuffer-configuratie. Dat is te veel om als harde CMS-eis op te leggen, zeker voor mobiele uploads.

**Besluit:** implementeer eerst stabiele resumable upload + server/worker-transcoder interface. Voeg pas daarna optionele client-transcode toe als gemeten performance en browserdekking dit rechtvaardigen.

## 4.4 Direct upload, multipart en resumability

- Kleine bestanden kunnen een eenvoudige signed PUT gebruiken.
- Grote video’s moeten multipart/chunked en hervatbaar kunnen uploaden.
- De server maakt upload-intents aan en beperkt deze tot één object/handeling, korte geldigheid, beperkte content/size en de juiste tenant.
- De client ondersteunt pauze, hervatten, retry per chunk, cancel en herstel na netwerkonderbreking.
- Gebruik een adaptercontract zodat R2/S3, tus-compatibele storage, filesystem voor tests en andere providers kunnen worden aangesloten zonder de UI of CMS-core te wijzigen.

Presigned URLs zijn bearer tokens en moeten daarom kort leven en niet in logs of blijvende records terechtkomen. Voor R2 adviseert Cloudflare multipart uploads voor grote bestanden of wanneer paralleliteit/herstel nodig is; de precieze grens blijft een provider-/configuratiedetail, geen algemene Puzzle-regel.

## 4.5 Security en tenant-isolatie

- Autoriseer altijd op de server: read, upload, complete, rename, move, update metadata, publish en delete hebben afzonderlijke permissions.
- Gebruik onvoorspelbare servergegenereerde object keys; vertrouw nooit op door de client aangeleverde paths.
- Verifieer daadwerkelijke objectgrootte, checksum, MIME/signature en toegestane bestandstypen na upload.
- Voer quota-/rate-limitchecks uit vóór het uitgeven van een upload intent.
- Controleer tenant/scope bij elk asset- en folderquery; een ID raden mag geen toegang geven.
- Gebruik korte signed-url TTL's en no-store headers voor gevoelige responses.
- Ondersteun opruimen van verlopen/onafgemaakte uploads en verweesde varianten.
- Bied optionele virus-/malware-scanning via een processor hook; claim dit niet als het niet echt wordt uitgevoerd.
- Verifieer gebruiksrechten bij verwijderen: assets die in gepubliceerde content worden gebruikt moeten niet per ongeluk onbereikbaar worden.

---

# 5. Componenten die nieuw gebouwd moeten worden

## 5.1 `@puzzle-ui/ui` — generieke editor- en media-controls

Dit zijn controls; geen CMS-pagina's en geen backend.

| Prioriteit | Component | Doel en scope |
| --- | --- | --- |
| P0 | `ImageCropper` | Crop selecteren met aspect-ratio presets, vrij croppen, zoom, pan, reset en normalized crop output. Geen opslag- of uploadlogica. |
| P0 | `ImageHotspotEditor` | Focal point en meerdere hotspotpunten/gebieden plaatsen, verplaatsen, selecteren en verwijderen. Coördinaten genormaliseerd. |
| P0 | `ImageUpload` | Gespecialiseerde image-input bovenop bestaande upload primitives en media browser utilities; max width/height, optionele responsive profiles, preview, processingstatus en consumer upload callback. |
| P0 | `VideoUpload` | Video selecteren, valideren, previewen, metadata uitlezen, poster genereren en upload callback aanroepen; toont server-processing status. Geen verplichte client-side transcoding. |
| P1 | `FieldArray` / `RepeaterField` | Herhaalbare, geneste formulieritems met add/remove/reorder, min/max en accessible labels. Generieke form control. |
| P1 | `JsonEditor` | JSON veld bewerken, formatteren, valideren en foutlocaties tonen. Geen zware code-editor dependency standaard meeleveren. |
| P1 | `DateRangePicker` | Bereikselectie voor contentfilters en publicatieplanning. Alleen bouwen als `DatePicker` niet eenvoudig via compositie het gewenste bereikgedrag dekt. |

**Niet toevoegen:** tweede FileUpload, MultiSelect, Combobox, Table, TreeView, Dialog, Notification of generieke Gallery. Gebruik bestaande exports.

## 5.2 `@puzzle-ui/pieces` — complete media- en CMS-workflows

| Prioriteit | Piece | Doel en scope |
| --- | --- | --- |
| P0 | `MediaLibrary` | De centrale File Manager: folder tree, grid/list, search, typefilters, sortering, pagination, selection, bulkactions, upload en loading/empty/error states. Data en actions via typed props/hooks; geen router/backend hardcoderen. |
| P0 | `AssetPickerDialog` | Bestaande media kiezen vanuit een contentveld; single/multiple selection, filters, upload, preview en confirm/cancel. Bouw voort op Dialog/Drawer en MediaLibrary. |
| P0 | `AssetDetailsPanel` | Metadata, alt/caption, tags, folder, afmetingen/duur, varianten, crop/focal point, hotspots en gebruiksstatus bekijken/bewerken. |
| P0 | `MediaField` | CMS-form field die bestaande asset selecteert of uploadt, previewt, crop/hotspot edit opent en een asset-ID teruggeeft. |
| P1 | `CmsShell` | CMS admin shell met navigatie, breadcrumbs, user/actions en responsive sidebar. Composeer bestaande DashboardShell/Sidebar/PageLayout; geen nieuwe shell-infrastructuur. |
| P1 | `ContentList` | Content type-gebonden lijst met filters, status, locale, search, pagination, row actions en bulk actions. Composeer DataTable; remote data wordt door caller/API geleverd. |
| P1 | `ContentEditor` | Schema-gedreven create/edit form voor een ContentEntry, met validation, unsaved-changes state en save/draft/publish actions. |
| P1 | `BlockEditor` | Pagina-/blokeditor met toegestane blocktypes, toevoegen, verwijderen, dupliceren, reorder en preview. Serialiseerbaar documentmodel; geen HTML-string als canonical source. |
| P1 | `ContentTypeBuilder` | UI voor content type en field definitions: field type, key, labels, required, localization, validation, relation, defaults en volgorde. |
| P1 | `LocalizationEditor` | Locale tabs/columns en vertaalstatus voor een content entry; werkt met expliciete locale data en ontbrekende vertalingen. |
| P1 | `RelationshipField` | Content entry selecteren via zoekbare picker met relation constraints, relation display en clear/select state. Gebruik Autocomplete/AssetPicker patterns. |
| P1 | `RevisionHistory` | Lijst met revisions, auteur/tijd, preview, restore en optionele diff view. Restore maakt een nieuwe revision; oude versies worden niet overschreven. |
| P1 | `PublishScheduler` | Draft/publish/schedule/unschedule UI, datum/tijdzone, status en bevestiging. Server is leidend voor daadwerkelijke uitvoering. |
| P2 | `AuditLogViewer` | Filterbare auditgebeurtenissen voor CMS/media mutaties; alleen wanneer de auditlogcontracten beschikbaar zijn. |
| P2 | `WebhookManagement` | Webhook endpoints, events, secret rotation status, delivery history/retry; settings UI, niet de webhook engine zelf. |
| P2 | `EditorialCalendar` | Kalender-/planningsoverzicht voor drafts, geplande publicaties en deadlines; gebruikt PublishScheduler-data en bestaande date primitives. |

## 5.3 Nieuwe non-UI capabilities (even belangrijk als de componenten)

| Package | Module/feature | Doel |
| --- | --- | --- |
| `@puzzle-ui/media` | Asset/folder/variant contracts | Media metadata en lifecycle. |
| `@puzzle-ui/media` | `MediaObjectStorageAdapter` | Signed upload, multipart/resumable, complete, abort, read, delete en object metadata. |
| `@puzzle-ui/media` | `MediaProcessor` | Image metadata/variants, thumbnail en processing pipeline. |
| `@puzzle-ui/media` | `VideoTranscoder` | Asynchrone video profiles, poster, manifest en verwerkingstatus. |
| `@puzzle-ui/media/browser` | `resizeImage` / `createImageVariants` | Client-side image resize/compress op basis van max width/height en named profiles. |
| `@puzzle-ui/media/browser` | `readVideoMetadata` / `createVideoPoster` | Browser preflight zonder volledige transcode. |
| `@puzzle-ui/cms` | Content type registry | Schema's/velden en server-side validatie. |
| `@puzzle-ui/cms` | Entry service | Create/read/update/query, locale en slug. |
| `@puzzle-ui/cms` | Revision service | Immutable revisions, restore en conflict handling. |
| `@puzzle-ui/cms` | Publishing service | Draft, publish, schedule, unpublish en archive. |
| `@puzzle-ui/cms` | Access policy contract | Resource-, action-, tenant- en field-level permissies via caller. |
| `@puzzle-ui/fullstack` | Media SDK + API handlers | Browser client, typed requests, upload queue en routes. |
| `@puzzle-ui/fullstack` | CMS SDK + API handlers | Browser client, query/mutation methods, auth-aware handlers en adapters. |

---

# 6. Epics, features en concrete actions

## EPIC 0 — Architectuur, scope en package foundation

**Doel:** nieuwe domeinen toevoegen zonder de huidige packagegrenzen te vervagen of bestaande publieke APIs te breken.

### Feature 0.1 — Architecture decision

Actions:
1. Lees root `AGENTS.md`, `.github/copilot-instructions.md`, package map, dependency map, component workflow en target package instructions.
2. Leg verantwoordelijkheden van `media`, `cms`, `fullstack`, `storage`, `ui` en `pieces` expliciet vast.
3. Definieer publieke exports en client/server boundaries voor elke nieuwe entrypoint.
4. Behoud alle bestaande Auth-subpaths ongewijzigd.
5. Maak een dependency map waarin geen cirkel ontstaat: `cms` mag `media` en `storage` gebruiken; Fullstack adapteert services; UI/Pieces bevatten geen server services.
6. Voeg nieuwe packages toe aan workspace-inventaris, package map, dependency map en root scripts waar nodig.
7. Kies een opslag-/verwerkingsadapterstrategie zonder R2/S3/FFmpeg/Sharp als verplichte core dependency.

### Feature 0.2 — Package skeletons

Actions:
1. Maak `packages/media` en `packages/cms` met manifests, tsdown builds, typechecks, tests, exports, README, `AGENTS.md` en `ai/instructions.md`.
2. Maak tests/configuratie volgens bestaande packages.
3. Houd core packages zonder React/framework- of vendorafhankelijkheid.
4. Laat de eerste package-exports uitsluitend de afgesproken subpaths blootstellen.
5. Voeg `packages/fullstack` exports toe zonder de Auth-bundles te veranderen.

**Definition of Done:** alle packages bouwen en typechecken, publieke exports zijn expliciet, dependency map klopt en er is geen client/server of package dependency cycle.

## EPIC 1 — Media domain, assetbeheer en object storage

**Doel:** een provider-neutrale basis voor assets, folders, binary objects en processing.

### Feature 1.1 — Media contracts

Actions:
1. Definieer `MediaAsset`, `MediaFolder`, `MediaVariant`, `MediaHotspot`, `MediaCrop`, `MediaProcessingJob`, upload intent/session en status enums.
2. Definieer fouttypen voor invalid file, quota, unsupported media, upload expired, checksum mismatch, processing failed, permission denied en asset conflict.
3. Definieer tijd-, actor-, tenant- en soft-delete velden.
4. Definieer metadata validityregels (dimensions, mime, size, checksum, normalized coordinates).
5. Schrijf unit tests en serialization tests voor contracts/normalizers.

### Feature 1.2 — Binary object storage contract

Actions:
1. Ontwerp `MediaObjectStorageAdapter` los van `StorageAdapter`.
2. Ondersteun single upload intent en multipart/resumable flows.
3. Ondersteun complete, abort, stat/head, signed read, delete en orphan cleanup.
4. Beschrijf expiry, idempotency en retry semantics.
5. Laat storage provider keys intern blijven.
6. Maak een in-memory testadapter en contract/conformance tests.
7. Documenteer hoe een R2/S3- of filesystemadapter kan worden geïmplementeerd zonder deze provider in core te verplichten.

### Feature 1.3 — Asset/folder services

Actions:
1. Sla assetmetadata en folders op via de bestaande `StorageAdapter`.
2. Definieer indexen voor tenant, folder, kind, status, createdAt, tags en checksum waar ondersteund.
3. Implementeer scoped list/query, pagination, sortering, rename, move, tag, soft-delete, restore en permanent-delete.
4. Implementeer folder create/rename/move/delete met cycle detection en niet-lege-folder policy.
5. Implementeer asset usage/reference registration zodat gebruikte assets niet ongemerkt worden verwijderd.
6. Implementeer cleanup van incomplete uploads en orphan variants.
7. Test tenant-isolatie, conditional updates, dubbele checksum policy en concurrency.

### Feature 1.4 — Processing pipeline contracts

Actions:
1. Definieer provider-neutrale `MediaProcessor` en `VideoTranscoder` interfaces.
2. Definieer queue/job adaptercontract met retry, backoff, idempotency, cancellation en dead-letter/failure state.
3. Definieer image profile en video rendition profile schema's.
4. Implementeer lifecycle `uploaded -> processing -> ready|failed`.
5. Laat optionele processingsteps configureerbaar zijn; geen fake-success wanneer een processor ontbreekt.
6. Test dubbele job deliveries, retries, gedeeltelijk mislukte variant sets en job-idempotency.

**Definition of Done:** media core en testadapter werken volledig zonder React, Next, TanStack, R2 of MongoDB-specifieke imports.

## EPIC 2 — Fullstack media API en veilige upload lifecycle

**Doel:** de media services veilig vanuit React-apps en frameworkroutes kunnen gebruiken.

### Feature 2.1 — Shared API contracts

Actions:
1. Definieer serialiseerbare inputs/results voor upload intent, upload progress, finalize, asset listing, folders, metadata en processing status.
2. Houd storage keys, secrets, server provider objects en permanente credentials uit shared/client types.
3. Normaliseer errors en no-store responses.

### Feature 2.2 — Server handlers

Actions:
1. Voeg `/media/server` toe met `createMediaServer` en typed route handler map.
2. Configureer object store, metadata storage, processor, queue, auth/session context, tenant resolver, permission policy, quota en file validation.
3. Maak handlers voor upload-intent, complete, abort, status, asset CRUD/metadata, folder CRUD/move en signed read.
4. Valideer elke request server-side; vertrouw niet op client type, size, tenant of object key.
5. Verifieer objectmetadata na upload en vóór `ready`.
6. Voeg idempotency en conditional writes toe bij complete/move/delete.
7. Voeg health/readiness handlers toe voor storage/queue/processor afhankelijkheden.
8. Voeg rate limit hooks en lifecycle cleanup hooks toe.

### Feature 2.3 — Browser client en upload orchestration

Actions:
1. Voeg `/media/client` toe met typed `MediaClient` en React hooks/provider indien dit overeenkomt met de bestaande Fullstack Auth-patronen.
2. Implementeer upload queue met bounded concurrency, retry, abort, cancel, pause/resume, progress en persistable resume metadata zonder secrets te bewaren.
3. Laat upload-intent en finalize altijd door de server gaan; upload de inhoud naar het door de server verstrekte target.
4. Ondersteun single PUT en multipart/resumable als adapterfeatures.
5. Gebruik idempotency keys en voorkom dubbele assets bij network retries.
6. Exporteer alleen browserveilige APIs.

### Feature 2.4 — Framework adapters

Actions:
1. Voeg `/media/next` toe volgens de bestaande Next adapterstijl.
2. Voeg `/media/tanstack` toe volgens de bestaande TanStack adapterstijl.
3. Hergebruik route maps waar mogelijk; dupliceer geen business logic.
4. Voeg export-boundary tests toe zodat servermodules niet in client bundles terechtkomen.
5. Test de request/response contracten, methodes, errors, cookies/auth context waar van toepassing en no-store headers.

**Definition of Done:** media upload en beheer functioneren via een testobjectstore en typed client, met server-side autorisatie en bewezen client/server isolatie.

## EPIC 3 — Browser image preparation, upload, crop en hotspots

**Doel:** images vóór upload optimaliseren en editorinformatie bruikbaar opslaan.

### Feature 3.1 — Browser image processing

Actions:
1. Implementeer `resizeImage` met `maxWidth`, `maxHeight`, no-upscale en aspect-ratio behoud.
2. Implementeer `createImageVariants` op basis van configureerbare named profiles.
3. Verwerk EXIF orientation correct; voorkom onbedoelde doorgifte van GPS/EXIF metadata.
4. Behoud alpha/transparantie waar het outputformaat dit ondersteunt.
5. Ondersteun configureerbare format/quality; bied een gedocumenteerde fallback bij niet-ondersteunde codecs/formats.
6. Gebruik `createImageBitmap` en OffscreenCanvas/Worker waar ondersteund; zorg voor fallback zonder browser APIs tijdens SSR/module-import.
7. Ondersteun `AbortSignal`, progress en typed errors.
8. Behoud master/original conform `retainOriginal` policy.
9. Test portrait/landscape, extreem aspect ratio, transparantie, EXIF orientation, corrupt files, abort, unsupported format, no-upscale en max dimensions.

### Feature 3.2 — ImageCropper UI

Actions:
1. Bouw `ImageCropper` als generieke UI control, zonder backend.
2. Ondersteun controlled/uncontrolled crop state, aspect-ratio presets, free crop, zoom, pan, reset en keyboard/toetsenbordbediening.
3. Retourneer normalized cropgegevens; laat export van crop Blob via een afzonderlijke browser utility gebeuren.
4. Voorkom pixelcoördinaten als persistente contractvorm.
5. Ondersteun touch/pointer, zichtbare focus, reduced motion en toegankelijk benoemde controls.
6. Test interactie, aspect ratio, keyboard, touch/browser, resize van container en crop serialisatie.

### Feature 3.3 — ImageHotspotEditor UI

Actions:
1. Bouw `ImageHotspotEditor` voor één focal point en meerdere hotspots.
2. Ondersteun toevoegen, selecteren, slepen, verwijderen en optionele labels/data.
3. Houd x/y/w/h genormaliseerd ten opzichte van de afgesproken bron/crop referentie.
4. Voeg toetsenbordbediening en alternatief formulier voor exacte posities toe.
5. Test boundaries (0/1), drag, keyboard, multi-hotspot, remove, controlled state en responsive scaling.

### Feature 3.4 — ImageUpload UI

Actions:
1. Bouw `ImageUpload` op bestaande FileUpload-principes; geen duplicaat van de generieke uploader.
2. Ondersteun maxWidth/maxHeight, quality, format, `retainOriginal`, optionele named profiles, max size en max files.
3. Toon lokale preview, oorspronkelijke en verwerkte afmetingen, bestandsgrootte/verschil en processingfouten.
4. Ondersteun crop vóór upload en terugkoppeling van crop/focal point.
5. Lever de verwerkte `File`/`Blob` en optionele varianten aan een consumer callback; upload/backend blijft via een geïnjecteerde handler.
6. Maak cancellation/retry en stale-result cleanup veilig.
7. Test geen automatische upload zonder callback, verwerking error, abort, progress, multiple files en forms/SSR.

**Definition of Done:** image processing werkt lokaal met maximumafmetingen, alle crop/hotspotcoördinaten zijn stabiel, en de UI gebruikt bestaande upload- en presentatiebouwstenen.

## EPIC 4 — Video upload, poster en responsive renditions

**Doel:** grote video's veilig uploaden en bruikbaar maken voor verschillende schermen.

### Feature 4.1 — Browser video preflight

Actions:
1. Implementeer `readVideoMetadata` voor duur, breedte, hoogte, aspect ratio en relevante codec hints waar uitleesbaar.
2. Implementeer `createVideoPoster` via een lokaal video-element/canvas met cleanup en revoke van object URLs.
3. Ondersteun `AbortSignal`, foutafhandeling voor corrupt/unsupported files en configurable max size/duration.
4. Maak geen volledige transcode verplicht in de browser.
5. Test metadata, poster, cleanup, unsupported input, browser abort en SSR isolation.

### Feature 4.2 — Video transcoder contract en renditions

Actions:
1. Definieer `VideoTranscoder` met input object, target profiles, job status, progress en output metadata.
2. Maak standaardprofielen configureerbaar (bijvoorbeeld 360p/720p/1080p) in plaats van vaste labels voor ieder apparaat.
3. Ondersteun poster/thumbnail en optioneel HLS/DASH manifest als de provider dit aanbiedt.
4. Laat verwerking asynchroon verlopen via job/queue contract.
5. Implementeer retry, idempotency, partial failure en status updates.
6. Maak de concrete FFmpeg/Cloudflare/andere provider een afzonderlijke adapter of voorbeeldimplementatie; niet in de core package.
7. Test met fake transcoder en kleine fixtures; geen grote echte transcode in standaard unit-tests.

### Feature 4.3 — VideoUpload UI

Actions:
1. Bouw `VideoUpload` op `FileUpload`-gedrag en het media-clientcontract.
2. Toon preview, poster, duration, dimensions, file size, uploadprogress en server processingstatus.
3. Ondersteun multipart/resumable upload, pause/resume, retry en cancel via geïnjecteerde client.
4. Toon afzonderlijke status voor `uploading`, `uploaded`, `processing`, `ready` en `failed`.
5. Voeg optionele client-transcode alleen toe als capability detection, policy en een fallback naar originele upload zijn geïmplementeerd.
6. Test browser states, netwerkverlies met mocked resumable adapter, retry/cancel, grote-file UX en accessibility.

**Definition of Done:** een video kan betrouwbaar hervatbaar worden geüpload, er wordt lokaal metadata/poster voorbereid en de UI toont de echte async renditionsstatus.

## EPIC 5 — Media Library / File Manager

**Doel:** een complete, herbruikbare asset library voor CMS- en reguliere applicaties.

### Feature 5.1 — MediaLibrary

Actions:
1. Bouw `MediaLibrary` in Pieces; composeer `TreeView`, `DataTable`, `Image`, `ImageBox`, `MediaFrame`, `Dialog`, `Command`, `Popover` en bestaande layoutbouwstenen.
2. Ondersteun grid/list view, folder tree, breadcrumbs, search, filters op type/status/tag, sortering en pagination.
3. Ondersteun single/multiple selection en keyboard navigation.
4. Ondersteun upload/drop, folder create/rename/move, asset rename/move, select, copy URL/reference, soft-delete en restore als de callbacks aanwezig zijn.
5. Voeg bulkactions toe met gedeeltelijke success/failure terugkoppeling.
6. Houd data access gecontroleerd via props of een expliciete client adapter; geen router, API URL of StorageAdapter import in Pieces.
7. Voeg states toe: initial loading, loading next page, empty library, empty folder, no search results, upload in progress, processing, error, permission denied.
8. Browser-test folders, grid/list, search/filter, selection, drag/drop, bulkactions, mobile/tablet layout en keyboard flow.

### Feature 5.2 — AssetPickerDialog

Actions:
1. Bouw picker bovenop MediaLibrary in Dialog/Drawer.
2. Ondersteun single/multiple mode, allowed media kinds, folder start, search/filter en upload new.
3. Ondersteun controlled value en duidelijke confirm/cancel.
4. Lever asset references/IDs terug, niet alleen URL's.
5. Test focus trap/restore, Escape, selection constraints, no results, upload path en narrow viewport.

### Feature 5.3 — AssetDetailsPanel en MediaField

Actions:
1. Bouw inspector voor bestanddetails en metadata.
2. Laat alt text, caption, title, description, tags en folder bewerken.
3. Toon dimensions/duration/file size, processing state, variants en gebruiksverwijzingen.
4. Toon ImageCropper en HotspotEditor voor images.
5. Bouw `MediaField` als form composition voor asset kiezen/uploaden/previewen/verwijderen.
6. Verifieer error, disabled, readonly, required, field validation en `aria-describedby`-relaties.
7. Test optimistic update/conflict, cancel, invalid field values en keyboard flow.

**Definition of Done:** de Media Library kan assets uploaden, vinden, selecteren, organiseren en hun metadata/bewerkingen onderhouden zonder backendlogica in Pieces.

## EPIC 6 — CMS content domain en API

**Doel:** een framework- en database-neutrale content engine onder de CMS-interface.

### Feature 6.1 — Content type/schema registry

Actions:
1. Definieer schema's voor text, textarea, rich text, number, boolean, date/datetime, slug, select, multi-select, media, relationship, repeater, blocks, JSON en locale-aware velden.
2. Definieer required, default, min/max, regex, allowed values, custom validators, field-level localization en relation constraints.
3. Valideer schema's bij registratie en versioneer schemawijzigingen.
4. Definieer migratie-/compatibiliteitsstrategie bij het wijzigen/verwijderen van velden.
5. Test valid/invalid schema's, unknown field types, required/default, nested/repeater validation en schema-version upgrades.

### Feature 6.2 — Content entry/query service

Actions:
1. Implementeer create/read/update/delete, list/query, cursor pagination, filters, sortering en search.
2. Implementeer slug normalization/uniqueness per content type en locale.
3. Implementeer relaties met server-side referential validation.
4. Implementeer media references via asset ID en usage registration.
5. Implementeer optimistic concurrency/revision checks.
6. Maak locale/fallback gedrag expliciet; vul ontbrekende content niet stilzwijgend met een willekeurige locale.
7. Test filters, pagination, locale, slug collisions, relations, orphan references, concurrency en tenant isolation.

### Feature 6.3 — Drafts, revisions en publishing

Actions:
1. Maak immutable revision snapshots of een aantoonbaar equivalent revision model.
2. Implementeer draft/save, publish, unpublish, schedule, unschedule en archive.
3. Maak public read queries alleen zichtbaar voor gepubliceerde versies; admin endpoints kunnen drafts tonen op basis van permissions.
4. Implementeer scheduled jobs via expliciete scheduler adapter of trigger; doe niet alsof `scheduledAt` vanzelf publiceert.
5. Implementeer restore-as-new-revision en conflict handling.
6. Bewaar actor, tijd, status, revision en optionele change summary.
7. Test state transitions, schedule in timezone, concurrent edits, restore, unpublish en public/private read leakage.

### Feature 6.4 — Access policy en audit

Actions:
1. Definieer `CmsAccessPolicy` callbacks voor `resource`, `action`, actor, tenant, record en optioneel field.
2. Laat de hostapp Auth/Session integreren; voeg geen ongevraagd role-managementsysteem toe.
3. Controleer permissies voor read/write/delete/publish/restore en media actions.
4. Definieer audit events voor relevante mutaties; schrijf actor, scope, resource, action, timestamp en resultaat.
5. Test deny-by-default, tenant mismatch, field restrictions, unauthenticated calls, permission escalation en audit completeness.

**Definition of Done:** CMS core kan content types en entries beheren, draft/publish/revision/locale/relations valideren en access-policy hooks afdwingen zonder React of frameworks.

## EPIC 7 — Fullstack CMS client/server en framework adapters

**Doel:** CMS-services vanuit app routes veilig aanroepen.

### Feature 7.1 — Shared/client APIs

Actions:
1. Definieer serialiseerbare CMS inputs/results en typed error contracts.
2. Maak client methods voor content types, entry query/read/save/delete, revisions, publish/schedule en locale variants.
3. Voeg optionele React provider/hooks toe volgens bestaande Fullstack Auth-patronen.
4. Cache/invalidate queries expliciet; voorkom stale admin content na save/publish.
5. Houd server managers en storage objects uit client/shared builds.

### Feature 7.2 — Server routes

Actions:
1. Implementeer configureerbare CMS server met `@puzzle-ui/cms`, storage, media references, Auth/session context en permission policy.
2. Maak route map voor content types, entries, revisions, publishing en audit queries.
3. Scheid admin mutation routes van publieke read endpoints.
4. Gebruik no-store op gevoelige responses; voorkom cache leakage tussen tenants/locales/drafts.
5. Test route contract, authorization, locale, errors, status transitions en public/admin boundaries.

### Feature 7.3 — Next.js en TanStack adapters

Actions:
1. Bouw Next route handler exports en TanStack Start dispatcher volgens huidige Fullstack Auth-patterns.
2. Gebruik `Request`/`Response` als shared contract.
3. Houd Next/TanStack dependencies optional peers.
4. Voeg adapter tests en bundling/export boundary tests toe.

**Definition of Done:** CMS client, server handlers en beide framework adapters werken zonder package-level cross-imports of client leakage.

## EPIC 8 — CMS authoring/admin Pieces en form controls

**Doel:** een beheerinterface waarmee de CMS-domein- en mediafuncties bruikbaar worden.

### Feature 8.1 — Form building blocks

Actions:
1. Implementeer `FieldArray` als generieke UI control voor herhaalbare/nested form entries.
2. Implementeer `JsonEditor` met parse/format/validation/error reporting.
3. Implementeer `DateRangePicker` alleen wanneer bestaande DatePicker-compositie onvoldoende blijkt.
4. Implementeer/verbeter `TextEditor` of maak `BlockEditor` met seriële schema nodes voor rich content, afbeeldingen, embeds, links, tabellen en references.
5. Laat field state, server validation en locale state via props/context contract bij de CMS caller komen.
6. Voeg component tests, browser interaction tests, docs en registry entries toe volgens workflow.

### Feature 8.2 — CMS shell en content list

Actions:
1. Bouw `CmsShell` op bestaande Pieces dashboard/layout components.
2. Bouw `ContentList` met DataTable voor server-side query/pagination; laat caller/server filters beheren.
3. Ondersteun status/locales, search/filter, bulk select, create, edit, duplicate en archive actions.
4. Maak empty/permission/loading/error states.
5. Controleer mobile/tablet/desktop en keyboard navigation.

### Feature 8.3 — Content editor en block editor

Actions:
1. Bouw schema-driven field renderer die bestaande UI-controls selecteert.
2. Composeer MediaField, RelationshipField, FieldArray, JsonEditor en TextEditor/BlockEditor.
3. Ondersteun required/validation errors, dirty state, autosave optioneel, unsaved-changes confirm en explicit save.
4. Scheid draft save van publish.
5. Maak block editor schema-driven en serializable; geen inline HTML als opslagcontract.
6. Test field mapping, schema upgrades, errors, nested fields, block reorder, undo/redo indien ondersteund en browser keyboard behavior.

### Feature 8.4 — ContentTypeBuilder, LocalizationEditor en RelationshipField

Actions:
1. Bouw ContentTypeBuilder voor field toevoegen/verwijderen/reorder/configure.
2. Valideer field keys, reserved names, relation targets en field type config.
3. Bouw LocalizationEditor voor ingestelde locales, missing translations en locale switching.
4. Bouw RelationshipField met server-backed search, allowed target types, single/multiple selection en relation preview.
5. Test schema validation, locale state preservation, missing values, relation permission and deleted target behavior.

### Feature 8.5 — RevisionHistory, PublishScheduler en EditorialCalendar

Actions:
1. Bouw RevisionHistory met revision list, detail preview, restore-as-new-version en diff presentation.
2. Bouw PublishScheduler met datum/tijd en expliciete timezone.
3. Toon status transitions en pending scheduled state.
4. Gebruik ConfirmAction/Notifications voor destructive/high impact actions.
5. Bouw `EditorialCalendar` pas nadat schedule- en timezone-contracten vastliggen; toon filters per status, locale en content type.
6. Test restore, publish/unpublish, schedule/cancel, stale state en timezone edges.

**Definition of Done:** CMS admin Pieces werken op basis van de Fullstack clients of caller-provided data/actions en bevatten geen app-specifieke endpoints/routes.

## EPIC 9 — Docs, AI instructions, registry, security en integration quality

**Doel:** elke feature discoverable, testbaar, veilig en adoptable maken.

### Feature 9.1 — Documentatie

Actions:
1. Voeg package README's, package docs en site docs toe voor `media`, `cms` en de nieuwe Fullstack subpaths.
2. Documenteer installatie, imports, provider/adapterconfiguratie, server/client gebruik, upload lifecycle, storage/transcoder adaptercontracten, security en framework setup.
3. Schrijf per UI/Pieces-component een eigen MDX-pagina met purpose, when to use/not use, full API, states, accessibility, responsive behavior en runnable examples.
4. Voeg doc examples en previews toe via bestaande site patterns.
5. Voeg de pagina's toe aan de juiste navigation/sidebar.
6. Verifieer elke import tegen root exports en package exports.

### Feature 9.2 — AI knowledge base en registry

Actions:
1. Update `.github/copilot-instructions.md` alleen als workflow of cross-package regels veranderen.
2. Update package `AGENTS.md` voor media/cms/fullstack/ui/pieces wanneer architectuur/conventies wijzigen.
3. Update `packages/*/ai/instructions.md` zodat AI weet welke package/subpath/component moet worden gekozen, welke niet, en welke securityregels gelden.
4. Update component-selection guidance en relevante AI component catalogs.
5. Voeg elk nieuw UI/Pieces component toe aan curated registry en genereer de registry output.
6. Run `bun run registry:generate` en `bun run registry:check`.
7. Houd exports, registry metadata, MDX, previews en AI guidance consistent.

### Feature 9.3 — Tests en release validation

Actions:
1. Unit-test core utilities, normalization, validators, services en adapter contracts.
2. Component-test props, controlled states, errors, accessibility semantics en keyboard interactions.
3. Browser-test upload queue, drag/drop, media picker, crop/hotspot, video state, responsive layouts en CMS user journeys.
4. SSR-test UI components en verify browser-only APIs niet tijdens import/render worden aangeroepen.
5. Test Fullstack client/server export isolation.
6. Test integration paths in Next.js en TanStack Start examples.
7. Test security: unauthorized, tenant mismatch, upload intent replay, expired URL, MIME spoofing, size mismatch, asset enumeration, unauthorized read, malicious file, stale revision en publish leakage.
8. Run focused package scripts, typechecks/builds, `bun run registry:check`, site build en relevante reference/e2e suites.
9. Rapporteer alle niet-uitgevoerde tests eerlijk, inclusief Docker/Playwright/provider-limieten.

---

# 7. Aanbevolen uitvoeringsvolgorde en scope

Voer dit niet als één gigantische UI-implementatie uit. De dependencies zijn belangrijk: de Media Library kan pas echt werken als assetcontracten, upload en client-API bestaan.

| Fase | Epics | Resultaat | Prioriteit |
| --- | --- | --- | --- |
| 1. Media foundation | 0, 1, 2 | Media contracts, storage port, veilige upload-API, Fullstack client en resumable uploads. | P0 |
| 2. Image workflow | 3 | Browser resize, ImageCropper, hotspots, ImageUpload. | P0 |
| 3. Media manager | 5 | MediaLibrary, AssetPickerDialog, AssetDetailsPanel, MediaField. | P0 |
| 4. CMS core | 6, 7 | Content types, entries, validation, draft/publish, revisions, locale, API. | P0/P1 |
| 5. CMS authoring | 8 | CmsShell, ContentList, ContentEditor, BlockEditor, ContentTypeBuilder. | P1 |
| 6. Video pipeline | 4 | VideoUpload, poster, async renditions, transcoder adapter. | P1 |
| 7. Editorial workflows | deel van 8, 9 | LocalizationEditor, RelationshipField, RevisionHistory, PublishScheduler. | P1 |
| 8. CMS operations | 6/8/9 aanvullingen | Audit log UI, webhook administration, operational hooks. | P2 |

### MVP dat ik als eerste zou shippen

1. `@puzzle-ui/media` + `@puzzle-ui/fullstack/media/*` — metadata, blob storage contract, direct upload, finalize, status.
2. Client image resize met `maxWidth`/`maxHeight`, original-retention en optionele `mobile/tablet/desktop` image variants.
3. `ImageCropper` + `ImageHotspotEditor` + `ImageUpload`.
4. `MediaLibrary` + `AssetPickerDialog` + `AssetDetailsPanel` + `MediaField`.
5. `@puzzle-ui/cms` + `@puzzle-ui/fullstack/cms/*` — content types, entries, localization-ready fields, draft/publish en revisions.
6. `CmsShell`, `ContentList`, `ContentEditor` en `ContentTypeBuilder`.
7. Video resumable upload, poster en server/worker transcoder zodra de image pipeline stabiel is.

Dit levert eerst een degelijk CMS met goede mediaorganisatie op. Daarna kunnen videorenditions, webhooks, auditlog en geavanceerde editorial workflows volgen.

---

# 8. Master Copilot-instructie

Onderstaande instructie is bedoeld om in Copilot Chat/Agent mode te plakken. Het doel is om de bovenstaande roadmap werkelijk uit te voeren, niet alleen code te genereren of een plan terug te geven.

## 8.1 Opdracht en werkwijze

Je werkt in de bestaande Puzzle monorepo. Implementeer de Headless CMS & Media Platform-roadmap in de volgorde uit dit document. Werk epic voor epic en feature voor feature. Rond ieder onderdeel volledig af voordat je verdergaat: implementatie, tests, documentatie, previews, exports, registry en AI-instructies waar van toepassing.

Begin niet opnieuw met een algemene repo-scan. Lees de relevante instructies en controleer de actuele code/status van ieder target package. De huidige repository kan inmiddels gewijzigd zijn ten opzichte van de baseline van dit roadmapdocument. Source, package manifests, exports, tests en actuele `AGENTS.md`-bestanden zijn leidend.

### Niet onderhandelbare regels

1. Lees `AGENTS.md`, `.github/copilot-instructions.md`, de relevante package `AGENTS.md`, package manifest, exports en relevante AI-instructies vóór wijzigingen.
2. Controleer eerst of de gewenste functionaliteit al bestaat. Bouw geen tweede `FileUpload`, `DataTable`, `TreeView`, `Autocomplete`, `Dialog`, `Image`, `MediaFrame`, `TextEditor` of `DashboardShell`.
3. Behoud bestaande publieke APIs en Auth-subpaths. Maak geen breaking change zonder noodzakelijke en expliciet gedocumenteerde reden.
4. Houd packages database-, framework- en provider-neutraal waar de architectuur dat vereist.
5. Gebruik voor binaire bestanden een object-storagecontract, niet de bestaande `StorageAdapter` recordinterface.
6. Geen object-storage secrets, signed URLs, server managers, database clients of server-only types in client/shared exports.
7. Client state is nooit autorisatie. Alle reads/writes, tenant scope, uploads en publish-acties moeten server-side opnieuw worden geautoriseerd.
8. Geen verplichte vendor dependency voor R2/S3/Cloudflare/FFmpeg/Sharp/transcoding in de domein-core. Gebruik adapters.
9. Geen placeholdercode, lege exports, fake-success, ongedocumenteerde TODO's of routes die alleen een happy-path implementeren.
10. Geen docs die API's beschrijven die niet bestaan. Controleer imports en signatures tegen echte exports en types.
11. Gebruik bestaande Puzzle Theme tokens, componenten, hooks, testsetup, doc previews en registry workflow.
12. Houd browser APIs uit SSR/module scope. Zet heavy image/video processing niet op de main UI thread.
13. Gebruik arrow functions, functionele React-components en named exports volgens de bestaande repository-conventies.
14. Houd gebruikerscontent, HTML, uploads, object keys en MIME-types untrusted tot servervalidatie is uitgevoerd.
15. Werk niet buiten scope; raak geen niet-gerelateerde componenten of werkende APIs aan.

## 8.2 Verplichte afhandeling per feature/component

Voor iedere nieuwe of substantieel gewijzigde feature:

### A. Discovery en ontwerp
- Zoek bestaande componenten, helpers, services, docs en tests op equivalent gedrag.
- Bepaal ownership: `media`, `cms`, `fullstack`, `ui` of `pieces`.
- Lees direct afhankelijke package manifests/instructions.
- Noteer de public API, props/contracts, status lifecycle, errors, SSR/client/server boundaries en acceptance criteria vóór implementatie.
- Als het voorstel een bestaande API overlapt, breid die API gericht uit in plaats van een duplicaat toe te voegen.

### B. Implementatie
- Bouw de complete functionaliteit; alleen de visuele happy path is onvoldoende.
- Voeg types, validators, service logic, CSS, exports, adapter wiring en foutafhandeling toe waar relevant.
- Ondersteun loading, empty, disabled, error, retry, cancel, readonly en permission-denied states waar toepasselijk.
- Maak state controlled/uncontrolled op een consistente manier met bestaande UI-patterns.
- Houd de API klein, composable, typed en backwards-compatible.
- Voeg geen router- of backendimplementatie toe aan UI/Pieces.

### C. Tests
- Unit tests voor pure utils, validators, transforms, normalizers en state transitions.
- Component tests voor props, composition, controlled state, validation en accessibility semantics.
- Browser tests voor keyboard, focus, pointer/touch, drag/drop, crop, responsive behavior, file APIs en network/upload flows.
- SSR tests waar het component of package in server-rendering kan voorkomen.
- Contract/integration tests voor MediaObjectStorageAdapter, MediaProcessor, VideoTranscoder, StorageAdapter en CMS services.
- Security tests voor autorisatie, tenant separation, input spoofing, upload lifecycle, replay, URL expiry, MIME/content mismatch en public-vs-draft leakage.
- Test ook failures, aborts, retries, duplicate requests, partial processing en concurrency.
- Gebruik mocks/fakes in unittests; gebruik echte providers alleen in opt-in integration tests.

### D. Documentatie en previews
- Voor iedere public UI/Pieces-component: eigen MDX-documentatie volgens de bestaande siteconventies.
- Documenteer doel, wanneer wel/niet gebruiken, import, volledige props/types, voorbeelden, variants, controlled behavior, validation, accessibility, responsive behavior, SSR/browser constraints en beperkingen.
- Voeg runnable doc examples toe en preview de belangrijkste varianten.
- Controleer mobile, tablet en desktop layouts in browser.
- Voor core/fullstack packages: README + volledige package/API docs + setupvoorbeeld + security/adapter instructies.
- Voeg navigation/sidebar verwijzingen toe als de docs een nieuwe pagina introduceren.

### E. Registry en AI-instructies
- Voor ieder nieuw UI/Pieces-component: werk curated component registry en gegenereerde output bij.
- Run `bun run registry:generate` en `bun run registry:check`.
- Update relevante component AI guidance zodat het component vindbaar is en juiste selectiecriteria heeft.
- Update package `ai/instructions.md` en `AGENTS.md` wanneer package capabilities, architecture, dependencies of security constraints veranderen.
- Update `docs/ai/reference/component-selection.md` als er een nieuw voorkeurscomponent of composition pattern bestaat.
- Update package map/dependency map bij nieuwe packages of dependency edges.
- Synchroniseer README, docs, exports, registry en AI instructions; geen afwijkende props of exportnamen.

### F. Validatie en rapportage
- Run eerst de focused package tests/typecheck/build.
- Run daarna relevante cross-package checks, site build, registry checks en Next/TanStack integration tests.
- Run browser tests wanneer UI/file APIs/interaction/responsive behavior verandert.
- Run root-wide suites als de omvang en omgeving dit toelaten.
- Vermeld commando's exact, resultaten en checks die niet konden worden uitgevoerd. Claim nooit een testresultaat dat niet echt is waargenomen.
- Ga pas door naar het volgende feature als dit onderdeel functioneel, getest, gedocumenteerd en AI-discoverable is.

## 8.3 Uitvoeringsvolgorde en concrete werkopdrachten

Voer de volgende taken achter elkaar uit in deze volgorde. Houd de afzonderlijke packagegrenzen en Definition of Done van elk epic aan.

### TASK 0 — Architecture & package foundations

- Maak `@puzzle-ui/media` en `@puzzle-ui/cms` volgens de architectuur in hoofdstuk 2.
- Voeg de Fullstack media- en CMS-subpaths toe.
- Werk workspace manifests, exports, tsdown configs, package map en dependency map bij.
- Voeg package `AGENTS.md`, README en `ai/instructions.md` toe.
- Bewijs dat er geen circular dependency of client/server leakage bestaat.
- Run package builds en typechecks.

### TASK 1 — Media domain & object storage contracts

- Implementeer MediaAsset, MediaFolder, MediaVariant, crop/hotspot, upload session en processing-job types.
- Implementeer MediaObjectStorageAdapter en MediaProcessor/VideoTranscoder contracts.
- Implementeer in-memory adapters en volledige conformance suites.
- Implementeer asset/folder services via `@puzzle-ui/storage` metadata persistence.
- Implementeer tenant scoping, folder hierarchy, soft-delete, usage tracking en cleanup.
- Voeg volledige unit/contract/security tests en package docs toe.

### TASK 2 — Fullstack media API

- Implementeer `/media/shared`, `/media/server`, `/media/client`, `/media/next`, `/media/tanstack`.
- Implementeer upload intent, direct upload target, multipart/resumable lifecycle, finalize, abort, status, asset/folder management en signed reads.
- Voeg server-side authorization, tenant resolver, quota, file signature/metadata checks, idempotency, rate limiting en no-store toe.
- Maak browser upload queue met concurrency limit, progress, pause/resume, retry en abort.
- Bewijs client/server export isolation en framework route behavior.

### TASK 3 — Browser image processing

- Implementeer `resizeImage` met configureerbare maxWidth/maxHeight.
- Implementeer multiple named profiles (`mobile`, `tablet`, `desktop`) met configureerbare afmetingen/quality/formats.
- Behoud aspect ratio en voorkom upscaling.
- Verwerk orientation, alpha, metadata/privacy en unsupported codecs.
- Gebruik workers/OffscreenCanvas waar mogelijk en fallback waar nodig.
- Implementeer abort/progress en tests voor edge cases.

### TASK 4 — UI image tools

- Implementeer `ImageCropper`, `ImageHotspotEditor` en `ImageUpload` in `@puzzle-ui/ui`.
- Reuse `FileUpload`, `Image`, `ImageBox`, `MediaFrame`, `Dialog` en bestaande design tokens.
- Houd crop/hotspot values serialiseerbaar en genormaliseerd.
- Test keyboard, pointer/touch, focus, screenreader labels, responsive canvas, abort en errors.
- Voeg docs pages, doc previews, registry entries, AI guidance en volledige package validation toe.

### TASK 5 — Video processing & UI

- Implementeer browser metadata reader en poster generation.
- Implementeer `VideoTranscoder` jobs, profile contract, status lifecycle en fake adapter.
- Implementeer `VideoUpload` met resumable upload, cancel/retry, progress en renditions status.
- Maak volledige client-transcode optioneel en capability-detected; nooit de enige uploadroute.
- Test browser, large-file state, interruption/resume, worker failure en async processing failure.
- Documenteer dat transcodingprovider en worker door de applicatie worden aangesloten.

### TASK 6 — Media Library Pieces

- Implementeer `MediaLibrary`, `AssetPickerDialog`, `AssetDetailsPanel` en `MediaField` in `@puzzle-ui/pieces`.
- Gebruik bestaande TreeView/DataTable/Autocomplete/Dialog/Drawer/MediaFrame/Image componenten.
- Implementeer folder navigation, list/grid, filters, pagination, bulk actions, metadata editing, crop/hotspots en asset references.
- Geen API routes, database of router imports in Pieces.
- Voeg component tests, browser journeys, responsive previews, docs, registry en AI guidance toe.

### TASK 7 — CMS core

- Implementeer `@puzzle-ui/cms` content type registry, field definitions, validators, entry repository/service, relation validation, locale/slug behavior, revisions, draft/publish/schedule lifecycle en access policies.
- Gebruik `@puzzle-ui/storage` voor metadata/revisions en `@puzzle-ui/media` voor asset references.
- Voorkom dat geplande publicatie alleen een timestamp is zonder scheduler executor.
- Maak public read queries strikt gescheiden van admin drafts.
- Voeg conformance, security, concurrency, migration en lifecycle tests toe.
- Documenteer schema format, service API, access policy en persistence requirements.

### TASK 8 — Fullstack CMS API

- Implementeer `/cms/shared`, `/cms/server`, `/cms/client`, `/cms/next`, `/cms/tanstack`.
- Implementeer typed content type, entry, revision, publish, schedule, locale en relationship routes/client calls.
- Voeg auth/session/tenant/policy hooks toe op elke servermutatie en private read.
- Scheid publieke published-content endpoints van admin endpoints.
- Voeg no-store/caching rules, client invalidation en export isolation tests toe.
- Documenteer Next/TanStack setup en framework-neutral server configuration.

### TASK 9 — CMS editor controls

- Implementeer `FieldArray` en `JsonEditor` in UI.
- Voeg `DateRangePicker` alleen toe als bestaande DatePicker niet toereikend is.
- Evalueer het bestaande TextEditor en bouw een schema-gedreven `BlockEditor` zonder bestaande TextEditor-functionaliteit te dupliceren.
- Voeg volledige form/accessibility/browser tests, docs, previews, registry en AI guidance toe.

### TASK 10 — CMS admin Pieces

- Implementeer `CmsShell`, `ContentList`, `ContentEditor`, `BlockEditor`, `ContentTypeBuilder`, `LocalizationEditor`, `RelationshipField`, `RevisionHistory` en `PublishScheduler`.
- Composeer bestaande dashboard/settings/UI components.
- Ondersteun filtering, pagination, locale, validation, dirty/unsaved state, save draft, publish, schedule, restore revision en relation selection.
- Geen serverroutes of database calls rechtstreeks in de Pieces.
- Voeg per component alle tests, docs, previews, registry en AI instructions toe.

### TASK 11 — Audit, webhooks en production hardening

- Implementeer audit event schema/queries en `AuditLogViewer`.
- Implementeer webhook contracts, delivery retry, signatures, event subscriptions en `WebhookManagement`.
- Voeg security review toe voor signed URL exposure, tenant isolation, file validation, role/permission bypass, public cache leakage, webhook SSRF, secret rotation en replay protection.
- Voeg operationele documentatie, observability hooks en cleanup/reconciliation jobs toe.
- Houd deze fase achter P0/P1; implementeer geen lege adminpanelen zonder bijbehorende domeinservices.

### TASK 12 — End-to-end quality gate

- Test de volledige flow: upload image -> resize -> upload -> finalize -> process -> MediaLibrary -> crop/hotspot -> MediaField -> ContentEditor -> save draft -> preview -> publish -> public read.
- Test video flow: select -> metadata/poster -> resumable upload -> server processing -> renditions -> MediaLibrary -> content field -> ready state.
- Test failures: expired upload URL, interrupted multipart, duplicate finalize, quota exceeded, invalid signature, cross-tenant asset ID, processing retry, concurrent edits, failed scheduled publish en unauthorized restore.
- Test zowel Next.js als TanStack Start examples.
- Run registry check, site build, package builds/typechecks, browser tests en relevante e2e tests.
- Werk de overview docs, package map, dependency map, AI instructions en changelog/release notes bij.

## 8.4 Acceptatiecriteria voor het totale resultaat

Het werk is pas klaar wanneer:

- Alle nieuwe packages een werkende build/typecheck/testscript hebben.
- `@puzzle-ui/fullstack` Auth APIs backward-compatible zijn gebleven.
- Media bytes nooit in de bestaande record StorageAdapter worden opgeslagen.
- Object storage- en transcoderproviders via contracts kunnen worden vervangen.
- Image upload maxWidth/maxHeight en configureerbare variants ondersteunt.
- Crop en hotspotdata genormaliseerd en serialiseerbaar zijn.
- Video upload resumable is en async processing status toont.
- Video transcoding niet afhankelijk is van browser-side ffmpeg/WebCodecs.
- MediaLibrary assets/folders kan zoeken, bekijken, organiseren en selecteren.
- CMS content types, entries, locales, relations, revisions en publish lifecycle werken.
- Elke mutation server-side wordt geautoriseerd en tenant-scoped is.
- Iedere nieuwe UI/Pieces-component eigen tests, documentatie, preview en registry metadata heeft.
- Package AI instructions en component selection guidance bijgewerkt zijn.
- Next.js en TanStack adapters hun API contracten aantoonbaar correct implementeren.
- Alle uitgevoerde en niet-uitgevoerde verificaties helder zijn gerapporteerd.

---

# 9. Referenties voor technische implementatiekeuzes

Deze externe documentatie ondersteunt de media-architectuurkeuzes; de Puzzle-contracten moeten provider-neutraal blijven.

- [MDN — WebCodecs API](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API): video/audio encode/decode in browser en Dedicated Workers; codecondersteuning varieert per device.
- [FFmpeg.wasm — overview](https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/docs/overview.md): browsertranscoding via WebAssembly en workers; bruikbaar als optionele adapter, niet als verplichte basis.
- [Cloudflare R2 — Presigned URLs](https://developers.cloudflare.com/r2/api/s3/presigned-urls/): tijdelijke, specifieke objectrechten; signed URLs zijn bearer tokens.
- [Cloudflare R2 — Upload objects](https://developers.cloudflare.com/r2/objects/upload-objects/): single PUT en multipart uploads met paralleliteit en hervatbaarheid.
- [tus — Resumable Upload Protocol](https://tus.github.io/tus/): protocol voor uploads die bij een onderbreking hervat kunnen worden.

