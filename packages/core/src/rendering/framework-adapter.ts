export type FrameworkAdapterCapabilities = Readonly<{
  supportsServerRendering: boolean;
  supportsDeferredRendering: boolean;
  supportsStaticRendering: boolean;
  supportsVisibility: boolean;
  supportsIdleScheduling: boolean;
}>;

export const DEFAULT_FRAMEWORK_ADAPTER_CAPABILITIES: FrameworkAdapterCapabilities =
  Object.freeze({
    supportsServerRendering: true,
    supportsDeferredRendering: false,
    supportsStaticRendering: true,
    supportsVisibility: false,
    supportsIdleScheduling: false,
  });
