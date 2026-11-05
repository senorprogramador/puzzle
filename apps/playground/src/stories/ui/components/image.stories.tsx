import type { Meta, StoryObj } from "@storybook/react-vite";

import { Image, Skeleton } from "@puzzle/ui";

const meta = {
  title: "UI/Components/Image",
  component: Image,
  tags: ["autodocs"],
  argTypes: {
    src: {
      control: "text",
    },
    alt: {
      control: "text",
    },
    fit: {
      control: "select",
      options: ["contain", "cover", "fill", "none", "scale-down"],
    },
    position: {
      control: "text",
    },
    aspectRatio: {
      control: "text",
    },
    radius: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl", "full"],
    },
    fill: {
      control: "boolean",
    },
    loading: {
      control: "select",
      options: ["eager", "lazy"],
    },
    placeholder: {
      control: "select",
      options: ["empty", "blur"],
    },
  },
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Image>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default image.
 */
export const Default: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200",
    alt: "Mountain landscape with lake",
    width: 1200,
    height: 800,
  },
};

/**
 * Cropped image with a fixed aspect ratio.
 */
export const AspectRatio: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200",
    alt: "Mountain landscape",
    width: 1200,
    height: 800,
    aspectRatio: "16 / 9",
    fit: "cover",
    radius: "lg",
  },
};

/**
 * Image without cropping.
 */
export const Contain: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200",
    alt: "Mountain landscape",
    width: 1200,
    height: 800,
    aspectRatio: "16 / 9",
    fit: "contain",
    radius: "md",
  },
};

/**
 * Full-size image container.
 */
export const Fill: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200",
    alt: "Mountain landscape",
    width: 1200,
    height: 800,
    aspectRatio: "16 / 9",
    fill: true,
    fit: "cover",
    radius: "lg",
  },
};

/**
 * Custom loading placeholder.
 */
export const LoadingPlaceholder: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200",
    alt: "Mountain landscape",
    width: 1200,
    height: 800,
    aspectRatio: "16 / 9",
    loadingPlaceholder: <Skeleton width="100%" height="100%" radius="none" />,
  },
};

/**
 * Fallback image.
 */
export const Fallback: Story = {
  args: {
    src: "/images/image-that-does-not-exist.webp",
    fallbackSrc:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800",
    alt: "Fallback landscape",
    width: 800,
    height: 600,
    aspectRatio: "4 / 3",
    radius: "lg",
  },
};

/**
 * Responsive sources using picture.
 */
export const Responsive: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200",
    alt: "Responsive mountain landscape",
    width: 1200,
    height: 800,
    aspectRatio: "16 / 9",
    sources: [
      {
        srcSet:
          "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=480",
        media: "(max-width: 640px)",
      },
      {
        srcSet:
          "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800",
        media: "(max-width: 1024px)",
      },
    ],
  },
};
