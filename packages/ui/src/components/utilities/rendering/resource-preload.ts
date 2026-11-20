import type {
  ResourceDescriptor,
  ResourcePriority,
} from "@puzzle-ui/core/rendering";

type ResourcePreloadOptions = Readonly<{
  as: "image" | "script" | "style" | "font";
  fetchPriority: "high" | "low" | "auto";
  media?: string;
  crossOrigin?: "anonymous";
}>;

const getFetchPriority = (
  priority: ResourcePriority,
): ResourcePreloadOptions["fetchPriority"] => {
  switch (priority) {
    case "critical":
    case "high":
      return "high";
    case "low":
      return "low";
    case "normal":
      return "auto";
  }
};

export const getResourcePreloadOptions = (
  resource: ResourceDescriptor,
): ResourcePreloadOptions => {
  const fetchPriority = getFetchPriority(resource.priority);

  switch (resource.type) {
    case "image":
      return { as: "image", fetchPriority };
    case "script":
      return { as: "script", fetchPriority };
    case "stylesheet":
      return {
        as: "style",
        fetchPriority,
        ...(resource.media === undefined ? {} : { media: resource.media }),
      };
    case "font":
      return { as: "font", crossOrigin: "anonymous", fetchPriority };
  }
};
