import React, { useState, useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { SketchPicker, ColorResult } from "react-color";
import "./TipTapEditor.css";
import Image from "@tiptap/extension-image";
import ResizeImage from "tiptap-extension-resize-image";
import sanitizeHtml from "sanitize-html";

// 폰트 패밀리 커스텀 익스텐션
import { Extension } from "@tiptap/core";

const FontFamily = Extension.create({
  name: "fontFamily",
  addOptions() {
    return {
      types: ["textStyle"],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontFamily: {
            default: null,
            parseHTML: (element) =>
              element.style.fontFamily.replace(/['"]/g, "") || null,
            renderHTML: (attributes) => {
              if (!attributes.fontFamily) {
                return {};
              }
              return {
                style: `font-family: ${attributes.fontFamily}`,
              };
            },
          },
        },
      },
    ];
  },
});

const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) =>
              element.style.fontSize?.replace(/['"]/g, "") || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
});

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const fontList = [
  { label: "기본", value: "" },
  { label: "Arial", value: "Arial" },
  { label: "나눔고딕", value: "Nanum Gothic" },
  { label: "굴림", value: "Gulim" },
  { label: "맑은 고딕", value: "Malgun Gothic" },
  { label: "Serif", value: "serif" },
  { label: "Monospace", value: "monospace" },
];

const fontSizeList = [
  { label: "기본", value: "" },
  { label: "12px", value: "12px" },
  { label: "14px", value: "14px" },
  { label: "16px", value: "16px" },
  { label: "18px", value: "18px" },
  { label: "20px", value: "20px" },
  { label: "24px", value: "24px" },
  { label: "28px", value: "28px" },
  { label: "32px", value: "32px" },
];

const TipTapEditor: React.FC<TipTapEditorProps> = ({ value, onChange }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [color, setColor] = useState("#000000");
  const [highlightColor, setHighlightColor] = useState("#ffff00");
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const highlightPickerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 팝오버 바깥 클릭 시 닫힘
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showColorPicker &&
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        setShowColorPicker(false);
      }
      if (
        showHighlightPicker &&
        highlightPickerRef.current &&
        !highlightPickerRef.current.contains(event.target as Node)
      ) {
        setShowHighlightPicker(false);
      }
    }
    if (showColorPicker || showHighlightPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showColorPicker, showHighlightPicker]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      FontSize,
      Underline,
      Strike,
      Link.configure({ autolink: true, openOnClick: true, linkOnPaste: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      FontFamily,
      Image,
      ResizeImage,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const sanitizedHtml = sanitizeHtml(html, {
        allowedTags: [
          "b",
          "i",
          "u",
          "s",
          "a",
          "p",
          "ul",
          "ol",
          "li",
          "br",
          "span",
          "div",
          "img",
          "table",
          "thead",
          "tbody",
          "tr",
          "th",
          "td",
          "h1",
          "h2",
          "h3",
        ],
        allowedAttributes: {
          a: ["href", "target", "rel"],
          img: ["src", "width", "height", "alt", "style"],
          span: ["style"],
          div: ["style"],
          "*": ["style", "class"],
        },
        allowedSchemes: ["http", "https", "data"],
      });
      onChange(sanitizedHtml);
    },
  });

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    editor
      ?.chain()
      .focus()
      .setMark("textStyle", { fontFamily: e.target.value })
      .run();
  };

  // 파일 업로드 핸들러
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      editor?.chain().focus().setImage({ src: base64 }).run();
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!editor) return;
    const handlePaste = (event: ClipboardEvent) => {
      if (!event.clipboardData) return;
      const items = event.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const base64 = e.target?.result as string;
              editor.chain().focus().setImage({ src: base64 }).run();
            };
            reader.readAsDataURL(file);
          }
          event.preventDefault();
        }
      }
    };
    const dom = editor.view.dom;
    dom.addEventListener("paste", handlePaste);
    return () => {
      dom.removeEventListener("paste", handlePaste);
    };
  }, [editor]);

  return (
    <div>
      <div className="editor-toolbar">
        {/* 글꼴 선택 */}
        <select
          onChange={handleFontChange}
          value={editor?.getAttributes("textStyle").fontFamily || ""}
        >
          {fontList.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
        {/* 폰트 크기 선택 */}
        <select
          onChange={(e) =>
            editor
              ?.chain()
              .focus()
              .setMark("textStyle", { fontSize: e.target.value })
              .run()
          }
          value={editor?.getAttributes("textStyle").fontSize || ""}
        >
          {fontSizeList.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={editor?.isActive("bold") ? "is-active" : ""}
        >
          <b>B</b>
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={editor?.isActive("italic") ? "is-active" : ""}
        >
          <i>I</i>
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={editor?.isActive("underline") ? "is-active" : ""}
        >
          <u>U</u>
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          className={editor?.isActive("strike") ? "is-active" : ""}
        >
          <s>S</s>
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={editor?.isActive("bulletList") ? "is-active" : ""}
        >
          • •
        </button>
        {/* 컬러피커 */}
        <div className="color-picker-container" ref={colorPickerRef}>
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
          >
            A
          </button>
          {showColorPicker && (
            <div className="color-picker-popover">
              <SketchPicker
                color={color}
                onChangeComplete={(c: ColorResult) => {
                  setColor(c.hex);
                  editor?.chain().focus().setColor(c.hex).run();
                }}
              />
            </div>
          )}
        </div>
        {/* 형광펜 컬러피커 */}
        <div className="color-picker-container" ref={highlightPickerRef}>
          <button
            type="button"
            onClick={() => setShowHighlightPicker(!showHighlightPicker)}
          >
            <span
              style={{
                background: "#ffff00",
                padding: "0 4px",
                borderRadius: "2px",
              }}
            >
              H
            </span>
          </button>
          {showHighlightPicker && (
            <div className="color-picker-popover">
              <SketchPicker
                color={highlightColor}
                onChangeComplete={(c: ColorResult) => {
                  setHighlightColor(c.hex);
                  editor
                    ?.chain()
                    .focus()
                    .toggleHighlight({ color: c.hex })
                    .run();
                }}
              />
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => editor?.chain().focus().setTextAlign("left").run()}
        >
          ⯇
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().setTextAlign("center").run()}
        >
          ≡
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().setTextAlign("right").run()}
        >
          ⯈
        </button>
        <button type="button" onClick={() => fileInputRef.current?.click()}>
          🖼️
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />
        <button
          type="button"
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
          title="표 삽입"
        >
          <svg width="20" height="20" viewBox="0 0 20 20">
            <rect
              x="2"
              y="2"
              width="16"
              height="16"
              fill="none"
              stroke="#333"
              strokeWidth="1.5"
            />
            <line x1="2" y1="8" x2="18" y2="8" stroke="#333" strokeWidth="1" />
            <line
              x1="2"
              y1="14"
              x2="18"
              y2="14"
              stroke="#333"
              strokeWidth="1"
            />
            <line x1="8" y1="2" x2="8" y2="18" stroke="#333" strokeWidth="1" />
            <line
              x1="14"
              y1="2"
              x2="14"
              y2="18"
              stroke="#333"
              strokeWidth="1"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().addColumnBefore().run()}
        >
          ↔
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().addRowBefore().run()}
        >
          ↕
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().deleteTable().run()}
        >
          ❌
        </button>
        <button
          type="button"
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .insertContent(
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi vel consectetur euismod, nisl nisi consectetur nisi, euismod euismod nisi nisi euismod."
              )
              .run()
          }
        >
          Lorem
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTapEditor;
