
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, lazy, Suspense } from "react";

import { Icon } from "@puzzle/icons";
const MaterialSymbolsIconPage = lazy(() => import("@puzzle/icons/sets/material-symbols.page").then(module => ({ default: module.MaterialSymbolsIconPage })));
const MaterialSymbolsLightIconPage = lazy(() => import("@puzzle/icons/sets/material-symbols-light.page").then(module => ({ default: module.MaterialSymbolsLightIconPage })));
const IcIconPage = lazy(() => import("@puzzle/icons/sets/ic.page").then(module => ({ default: module.IcIconPage })));
const MdiIconPage = lazy(() => import("@puzzle/icons/sets/mdi.page").then(module => ({ default: module.MdiIconPage })));
const MdiLightIconPage = lazy(() => import("@puzzle/icons/sets/mdi-light.page").then(module => ({ default: module.MdiLightIconPage })));
const LineMdIconPage = lazy(() => import("@puzzle/icons/sets/line-md.page").then(module => ({ default: module.LineMdIconPage })));
const SolarIconPage = lazy(() => import("@puzzle/icons/sets/solar.page").then(module => ({ default: module.SolarIconPage })));
const TablerIconPage = lazy(() => import("@puzzle/icons/sets/tabler.page").then(module => ({ default: module.TablerIconPage })));
const IconmindIconPage = lazy(() => import("@puzzle/icons/sets/iconmind.page").then(module => ({ default: module.IconmindIconPage })));
const IconovenIconPage = lazy(() => import("@puzzle/icons/sets/iconoven.page").then(module => ({ default: module.IconovenIconPage })));
const BoxiconsIconPage = lazy(() => import("@puzzle/icons/sets/boxicons.page").then(module => ({ default: module.BoxiconsIconPage })));
const MingcuteIconPage = lazy(() => import("@puzzle/icons/sets/mingcute.page").then(module => ({ default: module.MingcuteIconPage })));
const KeylineIconsIconPage = lazy(() => import("@puzzle/icons/sets/keyline-icons.page").then(module => ({ default: module.KeylineIconsIconPage })));
const RiIconPage = lazy(() => import("@puzzle/icons/sets/ri.page").then(module => ({ default: module.RiIconPage })));
const MynauiIconPage = lazy(() => import("@puzzle/icons/sets/mynaui.page").then(module => ({ default: module.MynauiIconPage })));
const AndrsrxnIconPage = lazy(() => import("@puzzle/icons/sets/andrsrxn.page").then(module => ({ default: module.AndrsrxnIconPage })));
const GriddyIconsIconPage = lazy(() => import("@puzzle/icons/sets/griddy-icons.page").then(module => ({ default: module.GriddyIconsIconPage })));
const IconamoonIconPage = lazy(() => import("@puzzle/icons/sets/iconamoon.page").then(module => ({ default: module.IconamoonIconPage })));
const IconoirIconPage = lazy(() => import("@puzzle/icons/sets/iconoir.page").then(module => ({ default: module.IconoirIconPage })));
const LucideIconPage = lazy(() => import("@puzzle/icons/sets/lucide.page").then(module => ({ default: module.LucideIconPage })));
const LucideExtendedIconPage = lazy(() => import("@puzzle/icons/sets/lucide-extended.page").then(module => ({ default: module.LucideExtendedIconPage })));
const LucideLabIconPage = lazy(() => import("@puzzle/icons/sets/lucide-lab.page").then(module => ({ default: module.LucideLabIconPage })));
const UilIconPage = lazy(() => import("@puzzle/icons/sets/uil.page").then(module => ({ default: module.UilIconPage })));
const TdesignIconPage = lazy(() => import("@puzzle/icons/sets/tdesign.page").then(module => ({ default: module.TdesignIconPage })));
const SiIconPage = lazy(() => import("@puzzle/icons/sets/si.page").then(module => ({ default: module.SiIconPage })));
const MajesticonsIconPage = lazy(() => import("@puzzle/icons/sets/majesticons.page").then(module => ({ default: module.MajesticonsIconPage })));
const GgIconPage = lazy(() => import("@puzzle/icons/sets/gg.page").then(module => ({ default: module.GgIconPage })));
const FlowbiteIconPage = lazy(() => import("@puzzle/icons/sets/flowbite.page").then(module => ({ default: module.FlowbiteIconPage })));
const VadivamIconPage = lazy(() => import("@puzzle/icons/sets/vadivam.page").then(module => ({ default: module.VadivamIconPage })));
const BasilIconPage = lazy(() => import("@puzzle/icons/sets/basil.page").then(module => ({ default: module.BasilIconPage })));
const PixelarticonsIconPage = lazy(() => import("@puzzle/icons/sets/pixelarticons.page").then(module => ({ default: module.PixelarticonsIconPage })));
const PixelIconPage = lazy(() => import("@puzzle/icons/sets/pixel.page").then(module => ({ default: module.PixelIconPage })));
const AkarIconsIconPage = lazy(() => import("@puzzle/icons/sets/akar-icons.page").then(module => ({ default: module.AkarIconsIconPage })));
const CiIconPage = lazy(() => import("@puzzle/icons/sets/ci.page").then(module => ({ default: module.CiIconPage })));
const ProiconsIconPage = lazy(() => import("@puzzle/icons/sets/proicons.page").then(module => ({ default: module.ProiconsIconPage })));
const TypcnIconPage = lazy(() => import("@puzzle/icons/sets/typcn.page").then(module => ({ default: module.TypcnIconPage })));
const MeteorIconsIconPage = lazy(() => import("@puzzle/icons/sets/meteor-icons.page").then(module => ({ default: module.MeteorIconsIconPage })));
const PrimeIconPage = lazy(() => import("@puzzle/icons/sets/prime.page").then(module => ({ default: module.PrimeIconPage })));
const CircumIconPage = lazy(() => import("@puzzle/icons/sets/circum.page").then(module => ({ default: module.CircumIconPage })));
const FeIconPage = lazy(() => import("@puzzle/icons/sets/fe.page").then(module => ({ default: module.FeIconPage })));
const EosIconsIconPage = lazy(() => import("@puzzle/icons/sets/eos-icons.page").then(module => ({ default: module.EosIconsIconPage })));
const BitcoinIconsIconPage = lazy(() => import("@puzzle/icons/sets/bitcoin-icons.page").then(module => ({ default: module.BitcoinIconsIconPage })));
const HumbleiconsIconPage = lazy(() => import("@puzzle/icons/sets/humbleicons.page").then(module => ({ default: module.HumbleiconsIconPage })));
const UimIconPage = lazy(() => import("@puzzle/icons/sets/uim.page").then(module => ({ default: module.UimIconPage })));
const UitIconPage = lazy(() => import("@puzzle/icons/sets/uit.page").then(module => ({ default: module.UitIconPage })));
const UisIconPage = lazy(() => import("@puzzle/icons/sets/uis.page").then(module => ({ default: module.UisIconPage })));
const GridiconsIconPage = lazy(() => import("@puzzle/icons/sets/gridicons.page").then(module => ({ default: module.GridiconsIconPage })));
const MiIconPage = lazy(() => import("@puzzle/icons/sets/mi.page").then(module => ({ default: module.MiIconPage })));
const CuidaIconPage = lazy(() => import("@puzzle/icons/sets/cuida.page").then(module => ({ default: module.CuidaIconPage })));
const WeuiIconPage = lazy(() => import("@puzzle/icons/sets/weui.page").then(module => ({ default: module.WeuiIconPage })));
const DuoIconsIconPage = lazy(() => import("@puzzle/icons/sets/duo-icons.page").then(module => ({ default: module.DuoIconsIconPage })));
const SvgSpinnersIconPage = lazy(() => import("@puzzle/icons/sets/svg-spinners.page").then(module => ({ default: module.SvgSpinnersIconPage })));
const ReiconIconPage = lazy(() => import("@puzzle/icons/sets/reicon.page").then(module => ({ default: module.ReiconIconPage })));
const HugeiconsIconPage = lazy(() => import("@puzzle/icons/sets/hugeicons.page").then(module => ({ default: module.HugeiconsIconPage })));
const LetsIconsIconPage = lazy(() => import("@puzzle/icons/sets/lets-icons.page").then(module => ({ default: module.LetsIconsIconPage })));
const StreamlineUltimateIconPage = lazy(() => import("@puzzle/icons/sets/streamline-ultimate.page").then(module => ({ default: module.StreamlineUltimateIconPage })));
const StreamlinePlumpIconPage = lazy(() => import("@puzzle/icons/sets/streamline-plump.page").then(module => ({ default: module.StreamlinePlumpIconPage })));
const StreamlineSharpIconPage = lazy(() => import("@puzzle/icons/sets/streamline-sharp.page").then(module => ({ default: module.StreamlineSharpIconPage })));
const MageIconPage = lazy(() => import("@puzzle/icons/sets/mage.page").then(module => ({ default: module.MageIconPage })));
const StashIconPage = lazy(() => import("@puzzle/icons/sets/stash.page").then(module => ({ default: module.StashIconPage })));
const LineiconsIconPage = lazy(() => import("@puzzle/icons/sets/lineicons.page").then(module => ({ default: module.LineiconsIconPage })));
const WordpressIconPage = lazy(() => import("@puzzle/icons/sets/wordpress.page").then(module => ({ default: module.WordpressIconPage })));
const MatitaIconPage = lazy(() => import("@puzzle/icons/sets/matita.page").then(module => ({ default: module.MatitaIconPage })));
const IconParkOutlineIconPage = lazy(() => import("@puzzle/icons/sets/icon-park-outline.page").then(module => ({ default: module.IconParkOutlineIconPage })));
const IconParkSolidIconPage = lazy(() => import("@puzzle/icons/sets/icon-park-solid.page").then(module => ({ default: module.IconParkSolidIconPage })));
const IconParkTwotoneIconPage = lazy(() => import("@puzzle/icons/sets/icon-park-twotone.page").then(module => ({ default: module.IconParkTwotoneIconPage })));
const JamIconPage = lazy(() => import("@puzzle/icons/sets/jam.page").then(module => ({ default: module.JamIconPage })));
const StreamlineCyberIconPage = lazy(() => import("@puzzle/icons/sets/streamline-cyber.page").then(module => ({ default: module.StreamlineCyberIconPage })));
const GuidanceIconPage = lazy(() => import("@puzzle/icons/sets/guidance.page").then(module => ({ default: module.GuidanceIconPage })));
const CarbonIconPage = lazy(() => import("@puzzle/icons/sets/carbon.page").then(module => ({ default: module.CarbonIconPage })));
const IonIconPage = lazy(() => import("@puzzle/icons/sets/ion.page").then(module => ({ default: module.IonIconPage })));
const FamiconsIconPage = lazy(() => import("@puzzle/icons/sets/famicons.page").then(module => ({ default: module.FamiconsIconPage })));
const AntDesignIconPage = lazy(() => import("@puzzle/icons/sets/ant-design.page").then(module => ({ default: module.AntDesignIconPage })));
const LsiconIconPage = lazy(() => import("@puzzle/icons/sets/lsicon.page").then(module => ({ default: module.LsiconIconPage })));
const GravityUiIconPage = lazy(() => import("@puzzle/icons/sets/gravity-ui.page").then(module => ({ default: module.GravityUiIconPage })));
const CilIconPage = lazy(() => import("@puzzle/icons/sets/cil.page").then(module => ({ default: module.CilIconPage })));
const AtIconsIconPage = lazy(() => import("@puzzle/icons/sets/at-icons.page").then(module => ({ default: module.AtIconsIconPage })));
const EpIconPage = lazy(() => import("@puzzle/icons/sets/ep.page").then(module => ({ default: module.EpIconPage })));
const CharmIconPage = lazy(() => import("@puzzle/icons/sets/charm.page").then(module => ({ default: module.CharmIconPage })));
const QuillIconPage = lazy(() => import("@puzzle/icons/sets/quill.page").then(module => ({ default: module.QuillIconPage })));
const BytesizeIconPage = lazy(() => import("@puzzle/icons/sets/bytesize.page").then(module => ({ default: module.BytesizeIconPage })));
const BiIconPage = lazy(() => import("@puzzle/icons/sets/bi.page").then(module => ({ default: module.BiIconPage })));
const StreamlinePixelIconPage = lazy(() => import("@puzzle/icons/sets/streamline-pixel.page").then(module => ({ default: module.StreamlinePixelIconPage })));
const StreamlineBlockIconPage = lazy(() => import("@puzzle/icons/sets/streamline-block.page").then(module => ({ default: module.StreamlineBlockIconPage })));
const RivetIconsIconPage = lazy(() => import("@puzzle/icons/sets/rivet-icons.page").then(module => ({ default: module.RivetIconsIconPage })));
const NimbusIconPage = lazy(() => import("@puzzle/icons/sets/nimbus.page").then(module => ({ default: module.NimbusIconPage })));
const FormkitIconPage = lazy(() => import("@puzzle/icons/sets/formkit.page").then(module => ({ default: module.FormkitIconPage })));
const FluentIconPage = lazy(() => import("@puzzle/icons/sets/fluent.page").then(module => ({ default: module.FluentIconPage })));
const PhIconPage = lazy(() => import("@puzzle/icons/sets/ph.page").then(module => ({ default: module.PhIconPage })));
const EnergyIconsIconPage = lazy(() => import("@puzzle/icons/sets/energy-icons.page").then(module => ({ default: module.EnergyIconsIconPage })));
const GlyphsIconPage = lazy(() => import("@puzzle/icons/sets/glyphs.page").then(module => ({ default: module.GlyphsIconPage })));
const GlyphsPolyIconPage = lazy(() => import("@puzzle/icons/sets/glyphs-poly.page").then(module => ({ default: module.GlyphsPolyIconPage })));
const TeenyiconsIconPage = lazy(() => import("@puzzle/icons/sets/teenyicons.page").then(module => ({ default: module.TeenyiconsIconPage })));
const ClarityIconPage = lazy(() => import("@puzzle/icons/sets/clarity.page").then(module => ({ default: module.ClarityIconPage })));
const StreamlineFreehandIconPage = lazy(() => import("@puzzle/icons/sets/streamline-freehand.page").then(module => ({ default: module.StreamlineFreehandIconPage })));
const IxIconPage = lazy(() => import("@puzzle/icons/sets/ix.page").then(module => ({ default: module.IxIconPage })));
const OcticonIconPage = lazy(() => import("@puzzle/icons/sets/octicon.page").then(module => ({ default: module.OcticonIconPage })));
const MemoryIconPage = lazy(() => import("@puzzle/icons/sets/memory.page").then(module => ({ default: module.MemoryIconPage })));
const SystemUiconsIconPage = lazy(() => import("@puzzle/icons/sets/system-uicons.page").then(module => ({ default: module.SystemUiconsIconPage })));
const RadixIconsIconPage = lazy(() => import("@puzzle/icons/sets/radix-icons.page").then(module => ({ default: module.RadixIconsIconPage })));
const ZondiconsIconPage = lazy(() => import("@puzzle/icons/sets/zondicons.page").then(module => ({ default: module.ZondiconsIconPage })));
const UiwIconPage = lazy(() => import("@puzzle/icons/sets/uiw.page").then(module => ({ default: module.UiwIconPage })));
const CodexIconPage = lazy(() => import("@puzzle/icons/sets/codex.page").then(module => ({ default: module.CodexIconPage })));
const EiIconPage = lazy(() => import("@puzzle/icons/sets/ei.page").then(module => ({ default: module.EiIconPage })));
const HeroiconsIconPage = lazy(() => import("@puzzle/icons/sets/heroicons.page").then(module => ({ default: module.HeroiconsIconPage })));
const SidekickiconsIconPage = lazy(() => import("@puzzle/icons/sets/sidekickicons.page").then(module => ({ default: module.SidekickiconsIconPage })));
const GardenIconPage = lazy(() => import("@puzzle/icons/sets/garden.page").then(module => ({ default: module.GardenIconPage })));
const PepiconsPopIconPage = lazy(() => import("@puzzle/icons/sets/pepicons-pop.page").then(module => ({ default: module.PepiconsPopIconPage })));
const PepiconsPrintIconPage = lazy(() => import("@puzzle/icons/sets/pepicons-print.page").then(module => ({ default: module.PepiconsPrintIconPage })));
const PepiconsPencilIconPage = lazy(() => import("@puzzle/icons/sets/pepicons-pencil.page").then(module => ({ default: module.PepiconsPencilIconPage })));
const F7IconPage = lazy(() => import("@puzzle/icons/sets/f7.page").then(module => ({ default: module.F7IconPage })));
const PajamasIconPage = lazy(() => import("@puzzle/icons/sets/pajamas.page").then(module => ({ default: module.PajamasIconPage })));
const StreamlineIconPage = lazy(() => import("@puzzle/icons/sets/streamline.page").then(module => ({ default: module.StreamlineIconPage })));
const StreamlineFlexIconPage = lazy(() => import("@puzzle/icons/sets/streamline-flex.page").then(module => ({ default: module.StreamlineFlexIconPage })));
const Fa7SolidIconPage = lazy(() => import("@puzzle/icons/sets/fa7-solid.page").then(module => ({ default: module.Fa7SolidIconPage })));
const Fa7RegularIconPage = lazy(() => import("@puzzle/icons/sets/fa7-regular.page").then(module => ({ default: module.Fa7RegularIconPage })));
const PiconIconPage = lazy(() => import("@puzzle/icons/sets/picon.page").then(module => ({ default: module.PiconIconPage })));
const OouiIconPage = lazy(() => import("@puzzle/icons/sets/ooui.page").then(module => ({ default: module.OouiIconPage })));
const OuiIconPage = lazy(() => import("@puzzle/icons/sets/oui.page").then(module => ({ default: module.OuiIconPage })));
const NrkIconPage = lazy(() => import("@puzzle/icons/sets/nrk.page").then(module => ({ default: module.NrkIconPage })));
const DinkieIconsIconPage = lazy(() => import("@puzzle/icons/sets/dinkie-icons.page").then(module => ({ default: module.DinkieIconsIconPage })));
const QlementineIconsIconPage = lazy(() => import("@puzzle/icons/sets/qlementine-icons.page").then(module => ({ default: module.QlementineIconsIconPage })));
const StreamlineUltimateColorIconPage = lazy(() => import("@puzzle/icons/sets/streamline-ultimate-color.page").then(module => ({ default: module.StreamlineUltimateColorIconPage })));
const StreamlinePlumpColorIconPage = lazy(() => import("@puzzle/icons/sets/streamline-plump-color.page").then(module => ({ default: module.StreamlinePlumpColorIconPage })));
const StreamlineFreehandColorIconPage = lazy(() => import("@puzzle/icons/sets/streamline-freehand-color.page").then(module => ({ default: module.StreamlineFreehandColorIconPage })));
const StreamlineKameleonColorIconPage = lazy(() => import("@puzzle/icons/sets/streamline-kameleon-color.page").then(module => ({ default: module.StreamlineKameleonColorIconPage })));
const StreamlineStickiesColorIconPage = lazy(() => import("@puzzle/icons/sets/streamline-stickies-color.page").then(module => ({ default: module.StreamlineStickiesColorIconPage })));
const FluentColorIconPage = lazy(() => import("@puzzle/icons/sets/fluent-color.page").then(module => ({ default: module.FluentColorIconPage })));
const StreamlineColorIconPage = lazy(() => import("@puzzle/icons/sets/streamline-color.page").then(module => ({ default: module.StreamlineColorIconPage })));
const StreamlineFlexColorIconPage = lazy(() => import("@puzzle/icons/sets/streamline-flex-color.page").then(module => ({ default: module.StreamlineFlexColorIconPage })));
const StreamlineSharpColorIconPage = lazy(() => import("@puzzle/icons/sets/streamline-sharp-color.page").then(module => ({ default: module.StreamlineSharpColorIconPage })));
const StreamlineCyberColorIconPage = lazy(() => import("@puzzle/icons/sets/streamline-cyber-color.page").then(module => ({ default: module.StreamlineCyberColorIconPage })));
const IconParkIconPage = lazy(() => import("@puzzle/icons/sets/icon-park.page").then(module => ({ default: module.IconParkIconPage })));
const MarketeqIconPage = lazy(() => import("@puzzle/icons/sets/marketeq.page").then(module => ({ default: module.MarketeqIconPage })));
const VscodeIconsIconPage = lazy(() => import("@puzzle/icons/sets/vscode-icons.page").then(module => ({ default: module.VscodeIconsIconPage })));
const CodiconIconPage = lazy(() => import("@puzzle/icons/sets/codicon.page").then(module => ({ default: module.CodiconIconPage })));
const MaterialIconThemeIconPage = lazy(() => import("@puzzle/icons/sets/material-icon-theme.page").then(module => ({ default: module.MaterialIconThemeIconPage })));
const FileIconsIconPage = lazy(() => import("@puzzle/icons/sets/file-icons.page").then(module => ({ default: module.FileIconsIconPage })));
const DeviconIconPage = lazy(() => import("@puzzle/icons/sets/devicon.page").then(module => ({ default: module.DeviconIconPage })));
const DeviconPlainIconPage = lazy(() => import("@puzzle/icons/sets/devicon-plain.page").then(module => ({ default: module.DeviconPlainIconPage })));
const CatppuccinIconPage = lazy(() => import("@puzzle/icons/sets/catppuccin.page").then(module => ({ default: module.CatppuccinIconPage })));
const SkillIconsIconPage = lazy(() => import("@puzzle/icons/sets/skill-icons.page").then(module => ({ default: module.SkillIconsIconPage })));
const GcpIconPage = lazy(() => import("@puzzle/icons/sets/gcp.page").then(module => ({ default: module.GcpIconPage })));
const K8sIconPage = lazy(() => import("@puzzle/icons/sets/k8s.page").then(module => ({ default: module.K8sIconPage })));
const UnjsIconPage = lazy(() => import("@puzzle/icons/sets/unjs.page").then(module => ({ default: module.UnjsIconPage })));
const SimpleIconsIconPage = lazy(() => import("@puzzle/icons/sets/simple-icons.page").then(module => ({ default: module.SimpleIconsIconPage })));
const LogosIconPage = lazy(() => import("@puzzle/icons/sets/logos.page").then(module => ({ default: module.LogosIconPage })));
const StreamlineLogosIconPage = lazy(() => import("@puzzle/icons/sets/streamline-logos.page").then(module => ({ default: module.StreamlineLogosIconPage })));
const CibIconPage = lazy(() => import("@puzzle/icons/sets/cib.page").then(module => ({ default: module.CibIconPage })));
const Fa7BrandsIconPage = lazy(() => import("@puzzle/icons/sets/fa7-brands.page").then(module => ({ default: module.Fa7BrandsIconPage })));
const BxlIconPage = lazy(() => import("@puzzle/icons/sets/bxl.page").then(module => ({ default: module.BxlIconPage })));
const NoniconsIconPage = lazy(() => import("@puzzle/icons/sets/nonicons.page").then(module => ({ default: module.NoniconsIconPage })));
const ArcticonsIconPage = lazy(() => import("@puzzle/icons/sets/arcticons.page").then(module => ({ default: module.ArcticonsIconPage })));
const ThesvgIconPage = lazy(() => import("@puzzle/icons/sets/thesvg.page").then(module => ({ default: module.ThesvgIconPage })));
const ThesvgColorIconPage = lazy(() => import("@puzzle/icons/sets/thesvg-color.page").then(module => ({ default: module.ThesvgColorIconPage })));
const SelfhstIconPage = lazy(() => import("@puzzle/icons/sets/selfhst.page").then(module => ({ default: module.SelfhstIconPage })));
const CbiIconPage = lazy(() => import("@puzzle/icons/sets/cbi.page").then(module => ({ default: module.CbiIconPage })));
const BrandicoIconPage = lazy(() => import("@puzzle/icons/sets/brandico.page").then(module => ({ default: module.BrandicoIconPage })));
const EntypoSocialIconPage = lazy(() => import("@puzzle/icons/sets/entypo-social.page").then(module => ({ default: module.EntypoSocialIconPage })));
const TokenIconPage = lazy(() => import("@puzzle/icons/sets/token.page").then(module => ({ default: module.TokenIconPage })));
const TokenBrandedIconPage = lazy(() => import("@puzzle/icons/sets/token-branded.page").then(module => ({ default: module.TokenBrandedIconPage })));
const CryptocurrencyIconPage = lazy(() => import("@puzzle/icons/sets/cryptocurrency.page").then(module => ({ default: module.CryptocurrencyIconPage })));
const CryptocurrencyColorIconPage = lazy(() => import("@puzzle/icons/sets/cryptocurrency-color.page").then(module => ({ default: module.CryptocurrencyColorIconPage })));
const OpenmojiIconPage = lazy(() => import("@puzzle/icons/sets/openmoji.page").then(module => ({ default: module.OpenmojiIconPage })));
const TwemojiIconPage = lazy(() => import("@puzzle/icons/sets/twemoji.page").then(module => ({ default: module.TwemojiIconPage })));
const NotoIconPage = lazy(() => import("@puzzle/icons/sets/noto.page").then(module => ({ default: module.NotoIconPage })));
const FluentEmojiFlatIconPage = lazy(() => import("@puzzle/icons/sets/fluent-emoji-flat.page").then(module => ({ default: module.FluentEmojiFlatIconPage })));
const FluentEmojiHighContrastIconPage = lazy(() => import("@puzzle/icons/sets/fluent-emoji-high-contrast.page").then(module => ({ default: module.FluentEmojiHighContrastIconPage })));
const NotoV1IconPage = lazy(() => import("@puzzle/icons/sets/noto-v1.page").then(module => ({ default: module.NotoV1IconPage })));
const EmojioneIconPage = lazy(() => import("@puzzle/icons/sets/emojione.page").then(module => ({ default: module.EmojioneIconPage })));
const EmojioneMonotoneIconPage = lazy(() => import("@puzzle/icons/sets/emojione-monotone.page").then(module => ({ default: module.EmojioneMonotoneIconPage })));
const EmojioneV1IconPage = lazy(() => import("@puzzle/icons/sets/emojione-v1.page").then(module => ({ default: module.EmojioneV1IconPage })));
const FxemojiIconPage = lazy(() => import("@puzzle/icons/sets/fxemoji.page").then(module => ({ default: module.FxemojiIconPage })));
const StreamlineEmojisIconPage = lazy(() => import("@puzzle/icons/sets/streamline-emojis.page").then(module => ({ default: module.StreamlineEmojisIconPage })));
const CircleFlagsIconPage = lazy(() => import("@puzzle/icons/sets/circle-flags.page").then(module => ({ default: module.CircleFlagsIconPage })));
const FlagIconPage = lazy(() => import("@puzzle/icons/sets/flag.page").then(module => ({ default: module.FlagIconPage })));
const FlagpackIconPage = lazy(() => import("@puzzle/icons/sets/flagpack.page").then(module => ({ default: module.FlagpackIconPage })));
const CifIconPage = lazy(() => import("@puzzle/icons/sets/cif.page").then(module => ({ default: module.CifIconPage })));
const PinheadIconPage = lazy(() => import("@puzzle/icons/sets/pinhead.page").then(module => ({ default: module.PinheadIconPage })));
const RoentgenIconPage = lazy(() => import("@puzzle/icons/sets/roentgen.page").then(module => ({ default: module.RoentgenIconPage })));
const MakiIconPage = lazy(() => import("@puzzle/icons/sets/maki.page").then(module => ({ default: module.MakiIconPage })));
const TemakiIconPage = lazy(() => import("@puzzle/icons/sets/temaki.page").then(module => ({ default: module.TemakiIconPage })));
const GisIconPage = lazy(() => import("@puzzle/icons/sets/gis.page").then(module => ({ default: module.GisIconPage })));
const MapIconPage = lazy(() => import("@puzzle/icons/sets/map.page").then(module => ({ default: module.MapIconPage })));
const GeoIconPage = lazy(() => import("@puzzle/icons/sets/geo.page").then(module => ({ default: module.GeoIconPage })));
const OsmicIconPage = lazy(() => import("@puzzle/icons/sets/osmic.page").then(module => ({ default: module.OsmicIconPage })));
const GameIconsIconPage = lazy(() => import("@puzzle/icons/sets/game-icons.page").then(module => ({ default: module.GameIconsIconPage })));
const FadIconPage = lazy(() => import("@puzzle/icons/sets/fad.page").then(module => ({ default: module.FadIconPage })));
const AcademiconsIconPage = lazy(() => import("@puzzle/icons/sets/academicons.page").then(module => ({ default: module.AcademiconsIconPage })));
const WiIconPage = lazy(() => import("@puzzle/icons/sets/wi.page").then(module => ({ default: module.WiIconPage })));
const MeteoconsIconPage = lazy(() => import("@puzzle/icons/sets/meteocons.page").then(module => ({ default: module.MeteoconsIconPage })));
const HealthiconsIconPage = lazy(() => import("@puzzle/icons/sets/healthicons.page").then(module => ({ default: module.HealthiconsIconPage })));
const MedicalIconIconPage = lazy(() => import("@puzzle/icons/sets/medical-icon.page").then(module => ({ default: module.MedicalIconIconPage })));
const CovidIconPage = lazy(() => import("@puzzle/icons/sets/covid.page").then(module => ({ default: module.CovidIconPage })));
const GinetexIconPage = lazy(() => import("@puzzle/icons/sets/ginetex.page").then(module => ({ default: module.GinetexIconPage })));
const LaIconPage = lazy(() => import("@puzzle/icons/sets/la.page").then(module => ({ default: module.LaIconPage })));
const EvaIconPage = lazy(() => import("@puzzle/icons/sets/eva.page").then(module => ({ default: module.EvaIconPage })));
const DashiconsIconPage = lazy(() => import("@puzzle/icons/sets/dashicons.page").then(module => ({ default: module.DashiconsIconPage })));
const FlatColorIconsIconPage = lazy(() => import("@puzzle/icons/sets/flat-color-icons.page").then(module => ({ default: module.FlatColorIconsIconPage })));
const EntypoIconPage = lazy(() => import("@puzzle/icons/sets/entypo.page").then(module => ({ default: module.EntypoIconPage })));
const FoundationIconPage = lazy(() => import("@puzzle/icons/sets/foundation.page").then(module => ({ default: module.FoundationIconPage })));
const RaphaelIconPage = lazy(() => import("@puzzle/icons/sets/raphael.page").then(module => ({ default: module.RaphaelIconPage })));
const Icons8IconPage = lazy(() => import("@puzzle/icons/sets/icons8.page").then(module => ({ default: module.Icons8IconPage })));
const IwwaIconPage = lazy(() => import("@puzzle/icons/sets/iwwa.page").then(module => ({ default: module.IwwaIconPage })));
const GalaIconPage = lazy(() => import("@puzzle/icons/sets/gala.page").then(module => ({ default: module.GalaIconPage })));
const HeroiconsOutlineIconPage = lazy(() => import("@puzzle/icons/sets/heroicons-outline.page").then(module => ({ default: module.HeroiconsOutlineIconPage })));
const HeroiconsSolidIconPage = lazy(() => import("@puzzle/icons/sets/heroicons-solid.page").then(module => ({ default: module.HeroiconsSolidIconPage })));
const BxIconPage = lazy(() => import("@puzzle/icons/sets/bx.page").then(module => ({ default: module.BxIconPage })));
const BxsIconPage = lazy(() => import("@puzzle/icons/sets/bxs.page").then(module => ({ default: module.BxsIconPage })));
const Fa6SolidIconPage = lazy(() => import("@puzzle/icons/sets/fa6-solid.page").then(module => ({ default: module.Fa6SolidIconPage })));
const Fa6RegularIconPage = lazy(() => import("@puzzle/icons/sets/fa6-regular.page").then(module => ({ default: module.Fa6RegularIconPage })));
const Fa6BrandsIconPage = lazy(() => import("@puzzle/icons/sets/fa6-brands.page").then(module => ({ default: module.Fa6BrandsIconPage })));
const FaSolidIconPage = lazy(() => import("@puzzle/icons/sets/fa-solid.page").then(module => ({ default: module.FaSolidIconPage })));
const FaRegularIconPage = lazy(() => import("@puzzle/icons/sets/fa-regular.page").then(module => ({ default: module.FaRegularIconPage })));
const FaBrandsIconPage = lazy(() => import("@puzzle/icons/sets/fa-brands.page").then(module => ({ default: module.FaBrandsIconPage })));
const FaIconPage = lazy(() => import("@puzzle/icons/sets/fa.page").then(module => ({ default: module.FaIconPage })));
const FluentMdl2IconPage = lazy(() => import("@puzzle/icons/sets/fluent-mdl2.page").then(module => ({ default: module.FluentMdl2IconPage })));
const FontistoIconPage = lazy(() => import("@puzzle/icons/sets/fontisto.page").then(module => ({ default: module.FontistoIconPage })));
const IcomoonFreeIconPage = lazy(() => import("@puzzle/icons/sets/icomoon-free.page").then(module => ({ default: module.IcomoonFreeIconPage })));
const SubwayIconPage = lazy(() => import("@puzzle/icons/sets/subway.page").then(module => ({ default: module.SubwayIconPage })));
const OiIconPage = lazy(() => import("@puzzle/icons/sets/oi.page").then(module => ({ default: module.OiIconPage })));
const WpfIconPage = lazy(() => import("@puzzle/icons/sets/wpf.page").then(module => ({ default: module.WpfIconPage })));
const SimpleLineIconsIconPage = lazy(() => import("@puzzle/icons/sets/simple-line-icons.page").then(module => ({ default: module.SimpleLineIconsIconPage })));
const EtIconPage = lazy(() => import("@puzzle/icons/sets/et.page").then(module => ({ default: module.EtIconPage })));
const ElIconPage = lazy(() => import("@puzzle/icons/sets/el.page").then(module => ({ default: module.ElIconPage })));
const VaadinIconPage = lazy(() => import("@puzzle/icons/sets/vaadin.page").then(module => ({ default: module.VaadinIconPage })));
const GrommetIconsIconPage = lazy(() => import("@puzzle/icons/sets/grommet-icons.page").then(module => ({ default: module.GrommetIconsIconPage })));
const WhhIconPage = lazy(() => import("@puzzle/icons/sets/whh.page").then(module => ({ default: module.WhhIconPage })));
const SiGlyphIconPage = lazy(() => import("@puzzle/icons/sets/si-glyph.page").then(module => ({ default: module.SiGlyphIconPage })));
const ZmdiIconPage = lazy(() => import("@puzzle/icons/sets/zmdi.page").then(module => ({ default: module.ZmdiIconPage })));
const LsIconPage = lazy(() => import("@puzzle/icons/sets/ls.page").then(module => ({ default: module.LsIconPage })));
const BpmnIconPage = lazy(() => import("@puzzle/icons/sets/bpmn.page").then(module => ({ default: module.BpmnIconPage })));
const FlatUiIconPage = lazy(() => import("@puzzle/icons/sets/flat-ui.page").then(module => ({ default: module.FlatUiIconPage })));
const VsIconPage = lazy(() => import("@puzzle/icons/sets/vs.page").then(module => ({ default: module.VsIconPage })));
const TopcoatIconPage = lazy(() => import("@puzzle/icons/sets/topcoat.page").then(module => ({ default: module.TopcoatIconPage })));
const IlIconPage = lazy(() => import("@puzzle/icons/sets/il.page").then(module => ({ default: module.IlIconPage })));
const WebsymbolIconPage = lazy(() => import("@puzzle/icons/sets/websymbol.page").then(module => ({ default: module.WebsymbolIconPage })));
const FontelicoIconPage = lazy(() => import("@puzzle/icons/sets/fontelico.page").then(module => ({ default: module.FontelicoIconPage })));
const PsIconPage = lazy(() => import("@puzzle/icons/sets/ps.page").then(module => ({ default: module.PsIconPage })));
const FeatherIconPage = lazy(() => import("@puzzle/icons/sets/feather.page").then(module => ({ default: module.FeatherIconPage })));
const MonoIconsIconPage = lazy(() => import("@puzzle/icons/sets/mono-icons.page").then(module => ({ default: module.MonoIconsIconPage })));
const PepiconsIconPage = lazy(() => import("@puzzle/icons/sets/pepicons.page").then(module => ({ default: module.PepiconsIconPage })));
const FluentEmojiIconPage = lazy(() => import("@puzzle/icons/sets/fluent-emoji.page").then(module => ({ default: module.FluentEmojiIconPage })));

const meta = {
  title: "Icons",
  component: Icon,
  tags: ["autodocs"],
  args: {
    size: 42,
    color: "#302f41",
  },
  argTypes: {
    size: { control: { type: "range", min: 32, max: 100, step: 1 } },
    color: { control: { type: "color" } },
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "fa7-solid:puzzle-piece",
    size: 42,
    color: "#302f41",
  },
    render: (args) => <Icon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "fa7-solid:puzzle-piece",
    size: 42,
    color: "#302f41",
  },
  render: (args) => {
    const [filter, setFilter] = useState("");
    return (
      <div style={{ width: "600px", maxWidth: "80vw", padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <input
          type="text"
          placeholder="Search icons..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ marginBottom: "16px", padding: "8px", fontSize: "16px" }}
        />
                <Suspense fallback={<div>Loading Material symbols icon...</div>}>
          <MaterialSymbolsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Material symbols light icon...</div>}>
          <MaterialSymbolsLightIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Ic icon...</div>}>
          <IcIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Mdi icon...</div>}>
          <MdiIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Mdi light icon...</div>}>
          <MdiLightIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Line md icon...</div>}>
          <LineMdIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Solar icon...</div>}>
          <SolarIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Tabler icon...</div>}>
          <TablerIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Iconmind icon...</div>}>
          <IconmindIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Iconoven icon...</div>}>
          <IconovenIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Boxicons icon...</div>}>
          <BoxiconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Mingcute icon...</div>}>
          <MingcuteIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Keyline icons icon...</div>}>
          <KeylineIconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Ri icon...</div>}>
          <RiIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Mynaui icon...</div>}>
          <MynauiIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Andrsrxn icon...</div>}>
          <AndrsrxnIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Griddy icons icon...</div>}>
          <GriddyIconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Iconamoon icon...</div>}>
          <IconamoonIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Iconoir icon...</div>}>
          <IconoirIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Lucide icon...</div>}>
          <LucideIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Lucide extended icon...</div>}>
          <LucideExtendedIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Lucide lab icon...</div>}>
          <LucideLabIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Uil icon...</div>}>
          <UilIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Tdesign icon...</div>}>
          <TdesignIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Si icon...</div>}>
          <SiIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Majesticons icon...</div>}>
          <MajesticonsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Gg icon...</div>}>
          <GgIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Flowbite icon...</div>}>
          <FlowbiteIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Vadivam icon...</div>}>
          <VadivamIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Basil icon...</div>}>
          <BasilIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Pixelarticons icon...</div>}>
          <PixelarticonsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Pixel icon...</div>}>
          <PixelIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Akar icons icon...</div>}>
          <AkarIconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Ci icon...</div>}>
          <CiIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Proicons icon...</div>}>
          <ProiconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Typcn icon...</div>}>
          <TypcnIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Meteor icons icon...</div>}>
          <MeteorIconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Prime icon...</div>}>
          <PrimeIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Circum icon...</div>}>
          <CircumIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Fe icon...</div>}>
          <FeIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Eos icons icon...</div>}>
          <EosIconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Bitcoin icons icon...</div>}>
          <BitcoinIconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Humbleicons icon...</div>}>
          <HumbleiconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Uim icon...</div>}>
          <UimIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Uit icon...</div>}>
          <UitIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Uis icon...</div>}>
          <UisIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Gridicons icon...</div>}>
          <GridiconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Mi icon...</div>}>
          <MiIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Cuida icon...</div>}>
          <CuidaIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Weui icon...</div>}>
          <WeuiIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Duo icons icon...</div>}>
          <DuoIconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Svg spinners icon...</div>}>
          <SvgSpinnersIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Reicon icon...</div>}>
          <ReiconIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Hugeicons icon...</div>}>
          <HugeiconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Lets icons icon...</div>}>
          <LetsIconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Streamline ultimate icon...</div>}>
          <StreamlineUltimateIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Streamline plump icon...</div>}>
          <StreamlinePlumpIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Streamline sharp icon...</div>}>
          <StreamlineSharpIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Mage icon...</div>}>
          <MageIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Stash icon...</div>}>
          <StashIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Lineicons icon...</div>}>
          <LineiconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Wordpress icon...</div>}>
          <WordpressIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Matita icon...</div>}>
          <MatitaIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Icon park outline icon...</div>}>
          <IconParkOutlineIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Icon park solid icon...</div>}>
          <IconParkSolidIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Icon park twotone icon...</div>}>
          <IconParkTwotoneIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Jam icon...</div>}>
          <JamIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Streamline cyber icon...</div>}>
          <StreamlineCyberIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Guidance icon...</div>}>
          <GuidanceIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Carbon icon...</div>}>
          <CarbonIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Ion icon...</div>}>
          <IonIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Famicons icon...</div>}>
          <FamiconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Ant design icon...</div>}>
          <AntDesignIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Lsicon icon...</div>}>
          <LsiconIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Gravity ui icon...</div>}>
          <GravityUiIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Cil icon...</div>}>
          <CilIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading At icons icon...</div>}>
          <AtIconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Ep icon...</div>}>
          <EpIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Charm icon...</div>}>
          <CharmIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Quill icon...</div>}>
          <QuillIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Bytesize icon...</div>}>
          <BytesizeIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Bi icon...</div>}>
          <BiIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Streamline pixel icon...</div>}>
          <StreamlinePixelIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Streamline block icon...</div>}>
          <StreamlineBlockIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Rivet icons icon...</div>}>
          <RivetIconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Nimbus icon...</div>}>
          <NimbusIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Formkit icon...</div>}>
          <FormkitIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Fluent icon...</div>}>
          <FluentIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Ph icon...</div>}>
          <PhIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Energy icons icon...</div>}>
          <EnergyIconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Glyphs icon...</div>}>
          <GlyphsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Glyphs poly icon...</div>}>
          <GlyphsPolyIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Teenyicons icon...</div>}>
          <TeenyiconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Clarity icon...</div>}>
          <ClarityIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Streamline freehand icon...</div>}>
          <StreamlineFreehandIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Ix icon...</div>}>
          <IxIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Octicon icon...</div>}>
          <OcticonIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Memory icon...</div>}>
          <MemoryIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading System uicons icon...</div>}>
          <SystemUiconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Radix icons icon...</div>}>
          <RadixIconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Zondicons icon...</div>}>
          <ZondiconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Uiw icon...</div>}>
          <UiwIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Codex icon...</div>}>
          <CodexIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Ei icon...</div>}>
          <EiIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Heroicons icon...</div>}>
          <HeroiconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Sidekickicons icon...</div>}>
          <SidekickiconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Garden icon...</div>}>
          <GardenIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Pepicons pop icon...</div>}>
          <PepiconsPopIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Pepicons print icon...</div>}>
          <PepiconsPrintIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Pepicons pencil icon...</div>}>
          <PepiconsPencilIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading F7icon...</div>}>
          <F7IconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Pajamas icon...</div>}>
          <PajamasIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Streamline icon...</div>}>
          <StreamlineIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Streamline flex icon...</div>}>
          <StreamlineFlexIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Fa7solid icon...</div>}>
          <Fa7SolidIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Fa7regular icon...</div>}>
          <Fa7RegularIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Picon icon...</div>}>
          <PiconIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Ooui icon...</div>}>
          <OouiIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Oui icon...</div>}>
          <OuiIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Nrk icon...</div>}>
          <NrkIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Dinkie icons icon...</div>}>
          <DinkieIconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Qlementine icons icon...</div>}>
          <QlementineIconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Streamline ultimate color icon...</div>}>
          <StreamlineUltimateColorIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Streamline plump color icon...</div>}>
          <StreamlinePlumpColorIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Streamline freehand color icon...</div>}>
          <StreamlineFreehandColorIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Streamline kameleon color icon...</div>}>
          <StreamlineKameleonColorIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Streamline stickies color icon...</div>}>
          <StreamlineStickiesColorIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Fluent color icon...</div>}>
          <FluentColorIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Streamline color icon...</div>}>
          <StreamlineColorIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Streamline flex color icon...</div>}>
          <StreamlineFlexColorIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Streamline sharp color icon...</div>}>
          <StreamlineSharpColorIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Streamline cyber color icon...</div>}>
          <StreamlineCyberColorIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Icon park icon...</div>}>
          <IconParkIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Marketeq icon...</div>}>
          <MarketeqIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Vscode icons icon...</div>}>
          <VscodeIconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Codicon icon...</div>}>
          <CodiconIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Material icon theme icon...</div>}>
          <MaterialIconThemeIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading File icons icon...</div>}>
          <FileIconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Devicon icon...</div>}>
          <DeviconIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Devicon plain icon...</div>}>
          <DeviconPlainIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Catppuccin icon...</div>}>
          <CatppuccinIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Skill icons icon...</div>}>
          <SkillIconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Gcp icon...</div>}>
          <GcpIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading K8s icon...</div>}>
          <K8sIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Unjs icon...</div>}>
          <UnjsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Simple icons icon...</div>}>
          <SimpleIconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Logos icon...</div>}>
          <LogosIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Streamline logos icon...</div>}>
          <StreamlineLogosIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Cib icon...</div>}>
          <CibIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Fa7brands icon...</div>}>
          <Fa7BrandsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Bxl icon...</div>}>
          <BxlIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Nonicons icon...</div>}>
          <NoniconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Arcticons icon...</div>}>
          <ArcticonsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Thesvg icon...</div>}>
          <ThesvgIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Thesvg color icon...</div>}>
          <ThesvgColorIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Selfhst icon...</div>}>
          <SelfhstIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Cbi icon...</div>}>
          <CbiIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Brandico icon...</div>}>
          <BrandicoIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Entypo social icon...</div>}>
          <EntypoSocialIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Token icon...</div>}>
          <TokenIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Token branded icon...</div>}>
          <TokenBrandedIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Cryptocurrency icon...</div>}>
          <CryptocurrencyIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Cryptocurrency color icon...</div>}>
          <CryptocurrencyColorIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Openmoji icon...</div>}>
          <OpenmojiIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Twemoji icon...</div>}>
          <TwemojiIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Noto icon...</div>}>
          <NotoIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Fluent emoji flat icon...</div>}>
          <FluentEmojiFlatIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Fluent emoji high contrast icon...</div>}>
          <FluentEmojiHighContrastIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Noto v1icon...</div>}>
          <NotoV1IconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Emojione icon...</div>}>
          <EmojioneIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Emojione monotone icon...</div>}>
          <EmojioneMonotoneIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Emojione v1icon...</div>}>
          <EmojioneV1IconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Fxemoji icon...</div>}>
          <FxemojiIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Streamline emojis icon...</div>}>
          <StreamlineEmojisIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Circle flags icon...</div>}>
          <CircleFlagsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Flag icon...</div>}>
          <FlagIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Flagpack icon...</div>}>
          <FlagpackIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Cif icon...</div>}>
          <CifIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Pinhead icon...</div>}>
          <PinheadIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Roentgen icon...</div>}>
          <RoentgenIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Maki icon...</div>}>
          <MakiIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Temaki icon...</div>}>
          <TemakiIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Gis icon...</div>}>
          <GisIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Map icon...</div>}>
          <MapIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Geo icon...</div>}>
          <GeoIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Osmic icon...</div>}>
          <OsmicIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Game icons icon...</div>}>
          <GameIconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Fad icon...</div>}>
          <FadIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Academicons icon...</div>}>
          <AcademiconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Wi icon...</div>}>
          <WiIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Meteocons icon...</div>}>
          <MeteoconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Healthicons icon...</div>}>
          <HealthiconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Medical icon icon...</div>}>
          <MedicalIconIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Covid icon...</div>}>
          <CovidIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Ginetex icon...</div>}>
          <GinetexIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading La icon...</div>}>
          <LaIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Eva icon...</div>}>
          <EvaIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Dashicons icon...</div>}>
          <DashiconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Flat color icons icon...</div>}>
          <FlatColorIconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Entypo icon...</div>}>
          <EntypoIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Foundation icon...</div>}>
          <FoundationIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Raphael icon...</div>}>
          <RaphaelIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Icons8icon...</div>}>
          <Icons8IconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Iwwa icon...</div>}>
          <IwwaIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Gala icon...</div>}>
          <GalaIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Heroicons outline icon...</div>}>
          <HeroiconsOutlineIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Heroicons solid icon...</div>}>
          <HeroiconsSolidIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Bx icon...</div>}>
          <BxIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Bxs icon...</div>}>
          <BxsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Fa6solid icon...</div>}>
          <Fa6SolidIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Fa6regular icon...</div>}>
          <Fa6RegularIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Fa6brands icon...</div>}>
          <Fa6BrandsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Fa solid icon...</div>}>
          <FaSolidIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Fa regular icon...</div>}>
          <FaRegularIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Fa brands icon...</div>}>
          <FaBrandsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Fa icon...</div>}>
          <FaIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Fluent mdl2icon...</div>}>
          <FluentMdl2IconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Fontisto icon...</div>}>
          <FontistoIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Icomoon free icon...</div>}>
          <IcomoonFreeIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Subway icon...</div>}>
          <SubwayIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Oi icon...</div>}>
          <OiIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Wpf icon...</div>}>
          <WpfIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Simple line icons icon...</div>}>
          <SimpleLineIconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Et icon...</div>}>
          <EtIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading El icon...</div>}>
          <ElIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Vaadin icon...</div>}>
          <VaadinIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Grommet icons icon...</div>}>
          <GrommetIconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Whh icon...</div>}>
          <WhhIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Si glyph icon...</div>}>
          <SiGlyphIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Zmdi icon...</div>}>
          <ZmdiIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Ls icon...</div>}>
          <LsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Bpmn icon...</div>}>
          <BpmnIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Flat ui icon...</div>}>
          <FlatUiIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Vs icon...</div>}>
          <VsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Topcoat icon...</div>}>
          <TopcoatIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Il icon...</div>}>
          <IlIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Websymbol icon...</div>}>
          <WebsymbolIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Fontelico icon...</div>}>
          <FontelicoIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Ps icon...</div>}>
          <PsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Feather icon...</div>}>
          <FeatherIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Mono icons icon...</div>}>
          <MonoIconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Pepicons icon...</div>}>
          <PepiconsIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
        <Suspense fallback={<div>Loading Fluent emoji icon...</div>}>
          <FluentEmojiIconPage filter={filter} size={args.size} color={args.color} />
        </Suspense>
      </div>
    );
  },
}
