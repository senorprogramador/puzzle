import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { TextEditorHandle } from "./editor";
import { Stack } from "../stack/stack";
import { Editor } from "./editor";
import type {
  TextBlockVariant,
  TextDocument,
  TextMark,
} from "./text-editor.types";

type TextEditorContextType = Partial<TextEditorHandle> & {
  activeMarks: TextMark[];
  activeVariant: TextBlockVariant | null;
};

const TextEditorContext = createContext<TextEditorContextType | null>(null);

export const useTextEditor = () => {
  const context = useContext(TextEditorContext);
  if (!context) {
    throw new Error("useTextEditor must be used within a TextEditorProvider");
  }
  return context;
};

type TextEditorProps = {
  toolbar?: ReactNode;
  /** Controlled document. Use the same object emitted by onChange when updating it. */
  value?: TextDocument;
  /** Initial document for uncontrolled use. */
  defaultValue?: TextDocument;
  onChange?: (document: TextDocument) => void;
};

const TextEditor = ({
  toolbar,
  value,
  defaultValue,
  onChange,
}: TextEditorProps) => {
  const editorHandleRef = useRef<TextEditorHandle>(null);
  const [activeMarks, setActiveMarks] = useState<TextMark[]>([]);
  const [activeVariant, setActiveVariant] = useState<TextBlockVariant | null>(
    "body1",
  );

  return (
    <Stack direction="col" gap="md">
      <TextEditorContext.Provider
        value={{
          ...editorHandleRef.current,
          activeMarks,
          activeVariant,
        }}
      >
        {toolbar}
      </TextEditorContext.Provider>
      <Editor
        ref={editorHandleRef}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onActiveMarksChange={setActiveMarks}
        onActiveTextVariantChange={setActiveVariant}
      />
    </Stack>
  );
};

export { TextEditor, type TextEditorProps };
