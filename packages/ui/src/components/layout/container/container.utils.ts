export type ContainerWidthPreset = "container" | "content" | "prose" | "full";

const CONTAINER_PRESET_CLASSES: Record<ContainerWidthPreset, string> = {
  container: "puzzle-container--container",
  content: "puzzle-container--content",
  prose: "puzzle-container--prose",
  full: "puzzle-container--full",
};

export const getContainerPresetClass = (preset: ContainerWidthPreset): string =>
  CONTAINER_PRESET_CLASSES[preset];
