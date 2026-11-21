import { useRef, useState } from "react";
import {
  FieldArray,
  FormField,
  Stack,
  TextInput,
} from "@puzzle-ui/ui";

type LinkItem = {
  id: number;
  label: string;
  href: string;
};

const initialLinks: LinkItem[] = [
  { id: 1, label: "Home", href: "/" },
  { id: 2, label: "Documentation", href: "/docs" },
];

export const FieldArrayExample = () => {
  const [links, setLinks] = useState(initialLinks);
  const nextId = useRef(3);

  const updateLink = (
    index: number,
    property: "label" | "href",
    value: string,
  ) => {
    setLinks((current) =>
      current.map((link, linkIndex) =>
        linkIndex === index ? { ...link, [property]: value } : link,
      ),
    );
  };

  return (
    <FieldArray
      label="Navigation links"
      description="Add, edit, or reorder links."
      items={links}
      onChange={setLinks}
      createItem={() => ({
        id: nextId.current++,
        label: "",
        href: "",
      })}
      getItemKey={(link) => link.id}
      itemLabel={(link, index) => link.label || `Link ${index + 1}`}
      maxItems={5}
      reorderable
      renderItem={({ item, index }) => (
        <Stack>
          <FormField label="Label">
            <TextInput
              value={item.label}
              onChange={(event) =>
                updateLink(index, "label", event.currentTarget.value)
              }
            />
          </FormField>
          <FormField label="Destination">
            <TextInput
              value={item.href}
              onChange={(event) =>
                updateLink(index, "href", event.currentTarget.value)
              }
            />
          </FormField>
        </Stack>
      )}
    />
  );
};
