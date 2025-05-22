import React, { useState, useEffect, useRef } from "react";
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";
import "draft-js/dist/Draft.css";
import { ChevronDown, List, ListOrdered, AlignLeft, AlignCenter, Link } from "lucide-react";

// Optional: TypeScript type definition
type RichTextEditorProps = {
  label?: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ label, name, value, onChange }) => {
  const editorRef = useRef<any>(null); // ref to trigger focus

  const [editorState, setEditorState] = useState(() => {
    try {
      return value ? EditorState.createWithContent(convertFromRaw(JSON.parse(value))) : EditorState.createEmpty();
    } catch {
      return EditorState.createEmpty();
    }
  });

  const [showBlockDropdown, setShowBlockDropdown] = useState(false);

  useEffect(() => {
    if (value) {
      try {
        const newContentState = convertFromRaw(JSON.parse(value));
        const currentContentState = editorState.getCurrentContent();
        if (JSON.stringify(convertToRaw(currentContentState)) !== JSON.stringify(convertToRaw(newContentState))) {
          setEditorState(EditorState.createWithContent(newContentState));
        }
      } catch {
        setEditorState(EditorState.createEmpty());
      }
    }
  }, [value]);

  const handleEditorChange = (state: EditorState) => {
    setEditorState(state);
    const content = state.getCurrentContent();
    onChange(name, JSON.stringify(convertToRaw(content)));
  };

  const handleInlineStyleToggle = (e: React.MouseEvent, style: string) => {
    e.preventDefault();
    handleEditorChange(RichUtils.toggleInlineStyle(editorState, style));
  };

  const handleBlockTypeToggle = (e: React.MouseEvent, blockType: string) => {
    e.preventDefault();
    handleEditorChange(RichUtils.toggleBlockType(editorState, blockType));
    setShowBlockDropdown(false);
  };

  const getCurrentBlockType = () => {
    const selection = editorState.getSelection();
    const block = editorState.getCurrentContent().getBlockForKey(selection.getStartKey());
    const type = block.getType();
    const labels: { [key: string]: string } = {
      unstyled: "Normal Text",
      "header-one": "Heading 1",
      "header-two": "Heading 2",
      "header-three": "Heading 3",
      "unordered-list-item": "Bullet List",
      "ordered-list-item": "Numbered List",
    };
    return labels[type] || "Normal Text";
  };

  const hasInlineStyle = (style: string) => editorState.getCurrentInlineStyle().has(style);

  const hasBlockType = (blockType: string) => {
    const selection = editorState.getSelection();
    const block = editorState.getCurrentContent().getBlockForKey(selection.getStartKey());
    return block.getType() === blockType;
  };

  return (
    <div className="mb-5">
      {label && <label className="block font-medium mb-1">{label}</label>}

      <div className="border border-gray-300 rounded">
        {/* Toolbar */}
        <div className="flex flex-wrap overflow-x-auto border-b border-gray-300">
          {/* Block Type Dropdown */}
          <div className="relative border-r border-gray-300">
            <button type="button" className="flex items-center px-3 py-2 hover:bg-gray-100" onClick={() => setShowBlockDropdown(!showBlockDropdown)} onMouseDown={(e) => e.preventDefault()} aria-label="Block Type">
              <span className="mr-1">{getCurrentBlockType()}</span>
              <ChevronDown size={14} />
            </button>

            {showBlockDropdown && (
              <div className="absolute z-10 w-40 mt-1 bg-white border border-gray-300 rounded shadow-lg">
                <button type="button" onMouseDown={(e) => handleBlockTypeToggle(e, "unstyled")} className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm">
                  Normal Text
                </button>
                <button type="button" onMouseDown={(e) => handleBlockTypeToggle(e, "header-one")} className="w-full px-3 py-2 text-left hover:bg-gray-100 font-bold text-lg">
                  Heading 1
                </button>
                <button type="button" onMouseDown={(e) => handleBlockTypeToggle(e, "header-two")} className="w-full px-3 py-2 text-left hover:bg-gray-100 font-bold text-base">
                  Heading 2
                </button>
              </div>
            )}
          </div>

          {/* Format Buttons */}
          {[
            { label: "Bold", style: "BOLD", class: "font-bold" },
            { label: "Italic", style: "ITALIC", class: "italic" },
            { label: "Underline", style: "UNDERLINE", class: "underline" },
          ].map((btn) => (
            <button
              key={btn.style}
              type="button"
              aria-label={btn.label}
              onMouseDown={(e) => handleInlineStyleToggle(e, btn.style)}
              className={`px-4 py-2 border-r border-gray-300 hover:bg-gray-100 ${btn.class} ${hasInlineStyle(btn.style) ? "bg-gray-100" : ""}`}
            >
              {btn.label}
            </button>
          ))}

          {/* List Buttons */}
          <button
            type="button"
            onMouseDown={(e) => handleBlockTypeToggle(e, "unordered-list-item")}
            className={`px-4 py-2 border-r border-gray-300 hover:bg-gray-100 ${hasBlockType("unordered-list-item") ? "bg-gray-100" : ""}`}
            aria-label="Bullet List"
          >
            <List size={18} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => handleBlockTypeToggle(e, "ordered-list-item")}
            className={`px-4 py-2 border-r border-gray-300 hover:bg-gray-100 ${hasBlockType("ordered-list-item") ? "bg-gray-100" : ""}`}
            aria-label="Numbered List"
          >
            <ListOrdered size={18} />
          </button>

          {/* Optional alignment/link buttons (non-functional here) */}
          <button type="button" className="px-4 py-2 border-r border-gray-300 hover:bg-gray-100" onMouseDown={(e) => e.preventDefault()} aria-label="Align Left">
            <AlignLeft size={18} />
          </button>
          <button type="button" className="px-4 py-2 border-r border-gray-300 hover:bg-gray-100" onMouseDown={(e) => e.preventDefault()} aria-label="Align Center">
            <AlignCenter size={18} />
          </button>
          <button type="button" className="px-4 py-2 hover:bg-gray-100" onMouseDown={(e) => e.preventDefault()} aria-label="Insert Link">
            <Link size={18} />
          </button>
        </div>

        {/* Editor Area */}
        <div className="min-h-[160px] p-4 cursor-text" onClick={() => editorRef.current?.focus()}>
          <Editor editorState={editorState} onChange={handleEditorChange} placeholder="Tuliskan konten..." ref={editorRef} />
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
