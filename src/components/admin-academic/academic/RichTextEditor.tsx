import React, { useState, useEffect, useRef } from "react";
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw, RawDraftContentState, ContentBlock } from "draft-js";
import "draft-js/dist/Draft.css"; // Penting: Ini mengimpor gaya dasar Draft.js
import { ChevronDown, List, ListOrdered, AlignLeft, AlignCenter, Link } from "lucide-react";

// Impor file CSS terpisah yang akan kita buat
import "./RichTextEditor.css";

// TypeScript type definition
type RichTextEditorProps = {
  label?: string;
  name: string;
  value: RawDraftContentState;
  onChange: (name: string, value: RawDraftContentState) => void;
};

// Fungsi gaya blok
// Fungsi ini menerapkan nama kelas CSS kustom ke elemen DOM tingkat blok.
// Kelas-kelas ini kemudian akan di-styling melalui CSS.
const blockStyleFn = (contentBlock: ContentBlock) => {
  const type = contentBlock.getType();

  switch (type) {
    case "unordered-list-item":
      return "custom-unordered-list-item"; // Kelas kustom yang akan kita styling di CSS
    case "ordered-list-item":
      return "custom-ordered-list-item"; // Kelas kustom yang akan kita styling di CSS
    case "header-one":
      return "custom-header-one";
    case "header-two":
      return "custom-header-two";
    case "header-three":
      return "custom-header-three";
    default:
      return "";
  }
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ label, name, value, onChange }) => {
  const editorRef = useRef<Editor>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [editorState, setEditorState] = useState(() => {
    try {
      // Buat EditorState dari konten mentah jika tersedia, jika tidak, buat editor kosong.
      if (value && value.blocks && value.blocks.length > 0) {
        const contentState = convertFromRaw(value);
        return EditorState.createWithContent(contentState);
      }
      return EditorState.createEmpty();
    } catch (e) {
      console.error("Error creating editor state from value:", e);
      return EditorState.createEmpty(); // Kembali ke status kosong jika terjadi kesalahan
    }
  });

  const [showBlockDropdown, setShowBlockDropdown] = useState(false);

  // Efek untuk memperbarui status editor jika prop 'value' berubah dari induk
  useEffect(() => {
    try {
      const currentContent = editorState.getCurrentContent();
      // Hanya perbarui jika nilai dari prop berbeda dengan status saat ini untuk mencegah loop tak terbatas
      // dan pastikan rendering ulang hanya ketika nilai eksternal berubah.
      if (value && JSON.stringify(value) !== JSON.stringify(convertToRaw(currentContent))) {
        const newContentState = convertFromRaw(value);
        setEditorState(EditorState.createWithContent(newContentState));
      } else if (!value || value.blocks.length === 0) {
        // Tangani kasus di mana induk meneruskan status kosong, reset editor
        setEditorState(EditorState.createEmpty());
      }
    } catch (e) {
      console.error("Error updating editor state from value prop:", e);
      setEditorState(EditorState.createEmpty()); // Fallback jika terjadi kesalahan
    }
  }, [value]); // Bergantung pada prop 'value'

  // Efek untuk menangani klik di luar dropdown untuk menutupnya
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowBlockDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEditorChange = (state: EditorState) => {
    setEditorState(state);
    const content = state.getCurrentContent();
    onChange(name, convertToRaw(content));
  };

  const handleInlineStyleToggle = (e: React.MouseEvent, style: string) => {
    e.preventDefault(); // Mencegah editor kehilangan fokus
    handleEditorChange(RichUtils.toggleInlineStyle(editorState, style));
  };

  const handleBlockTypeToggle = (e: React.MouseEvent, blockType: string) => {
    e.preventDefault(); // Mencegah editor kehilangan fokus
    handleEditorChange(RichUtils.toggleBlockType(editorState, blockType));
    setShowBlockDropdown(false); // Tutup dropdown setelah pemilihan
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
          {/* Dropdown Tipe Blok */}
          <div className="relative border-r border-gray-300" ref={dropdownRef}>
            <button type="button" className="flex items-center px-3 py-2 hover:bg-gray-100" onClick={() => setShowBlockDropdown(!showBlockDropdown)} onMouseDown={(e) => e.preventDefault()} aria-label="Tipe Blok">
              <span className="mr-1">{getCurrentBlockType()}</span>
              <ChevronDown size={14} />
            </button>

            {showBlockDropdown && (
              <div className="absolute z-10 w-40 mt-1 bg-white border border-gray-300 rounded shadow-lg">
                <button type="button" onMouseDown={(e) => handleBlockTypeToggle(e, "unstyled")} className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm">
                  Normal Text
                </button>
                <button type="button" onMouseDown={(e) => handleBlockTypeToggle(e, "header-one")} className="w-full px-3 py-2 text-left hover:bg-gray-100 font-bold text-xl">
                  Heading 1
                </button>
                <button type="button" onMouseDown={(e) => handleBlockTypeToggle(e, "header-two")} className="w-full px-3 py-2 text-left hover:bg-gray-100 font-bold text-lg">
                  Heading 2
                </button>
                <button type="button" onMouseDown={(e) => handleBlockTypeToggle(e, "header-three")} className="w-full px-3 py-2 text-left hover:bg-gray-100 font-bold text-base">
                  Heading 3
                </button>
              </div>
            )}
          </div>

          {/* Tombol Format */}
          {[
            { label: "B", style: "BOLD", class: "font-bold" },
            { label: "I", style: "ITALIC", class: "italic" },
            { label: "U", style: "UNDERLINE", class: "underline" },
          ].map((btn) => (
            <button
              key={btn.style}
              type="button"
              aria-label={btn.label}
              onMouseDown={(e) => handleInlineStyleToggle(e, btn.style)}
              className={`px-4 py-2 border-r border-gray-300 hover:bg-gray-100 w-10 ${btn.class} ${hasInlineStyle(btn.style) ? "bg-gray-100" : ""}`}
            >
              {btn.label}
            </button>
          ))}

          {/* Tombol Daftar */}
          <button
            type="button"
            onMouseDown={(e) => handleBlockTypeToggle(e, "unordered-list-item")}
            className={`px-4 py-2 border-r border-gray-300 hover:bg-gray-100 ${hasBlockType("unordered-list-item") ? "bg-gray-100" : ""}`}
            aria-label="Daftar Poin"
          >
            <List size={18} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => handleBlockTypeToggle(e, "ordered-list-item")}
            className={`px-4 py-2 border-r border-gray-300 hover:bg-gray-100 ${hasBlockType("ordered-list-item") ? "bg-gray-100" : ""}`}
            aria-label="Daftar Bernomor"
          >
            <ListOrdered size={18} />
          </button>

          {/* Tombol perataan/tautan opsional */}
          <button type="button" className="px-4 py-2 border-r border-gray-300 hover:bg-gray-100" onMouseDown={(e) => e.preventDefault()} aria-label="Rata Kiri">
            <AlignLeft size={18} />
          </button>
          <button type="button" className="px-4 py-2 border-r border-gray-300 hover:bg-gray-100" onMouseDown={(e) => e.preventDefault()} aria-label="Rata Tengah">
            <AlignCenter size={18} />
          </button>
          <button type="button" className="px-4 py-2 hover:bg-gray-100" onMouseDown={(e) => e.preventDefault()} aria-label="Sisipkan Tautan">
            <Link size={18} />
          </button>
        </div>

        {/* Area Editor */}
        <div className="min-h-[160px] p-4 cursor-text draft-editor-wrapper" onClick={() => editorRef.current?.focus()}>
          {/* Penting: blockRendererFn tidak digunakan untuk list, biarkan Draft.js menanganinya secara default. */}
          <Editor editorState={editorState} onChange={handleEditorChange} placeholder="Tuliskan konten..." ref={editorRef} blockStyleFn={blockStyleFn} />
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
