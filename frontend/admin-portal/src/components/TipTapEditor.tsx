import React, { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextStyle from "@tiptap/extension-text-style";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TextAlign from "@tiptap/extension-text-align";
import ImageResize from "tiptap-extension-resize-image";
import { HexColorPicker } from "react-colorful";
import { useApplyMarkDataColor } from "../hooks/useApplyMarkDataColor";
import "./TipTapEditor.css";

// 커스텀 FontFamily 확장
const FontFamily = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontFamily: {
        default: null,
        parseHTML: (element) => element.style.fontFamily,
        renderHTML: (attributes) => {
          if (!attributes.fontFamily) {
            return {};
          }
          return {
            style: `font-family: ${attributes.fontFamily}`,
          };
        },
      },
    };
  },
});

// 커스텀 FontSize 확장
const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: (element) => element.style.fontSize,
        renderHTML: (attributes) => {
          if (!attributes.fontSize) {
            return {};
          }
          return {
            style: `font-size: ${attributes.fontSize}`,
          };
        },
      },
    };
  },
});

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({ value, onChange }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [color, setColor] = useState("#000000");
  const [highlightColor, setHighlightColor] = useState("#ffff00");
  const [selectedFont, setSelectedFont] = useState("Arial");
  const [selectedFontSize, setSelectedFontSize] = useState("16px");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ strike: {}, code: false }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      FontFamily,
      FontSize,
      Underline,
      ImageResize,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value || "<p></p>",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const currentEditorHtml = editor.getHTML();
    if (currentEditorHtml !== value) {
      console.log("=== 이미지 디버깅 ===");
      console.log("원본 HTML:", value);

      // 이미지 태그 개수 확인
      const imgMatches = value.match(/<img[^>]*>/g);
      console.log("이미지 태그 개수:", imgMatches ? imgMatches.length : 0);

      if (imgMatches) {
        imgMatches.forEach((imgTag, index) => {
          console.log(`이미지 ${index + 1}:`, imgTag);
        });
      }

      editor.commands.setContent(value || "<p></p>", false);

      // 에디터가 렌더링된 후 이미지가 없으면 직접 추가
      setTimeout(() => {
        const editorElement = document.querySelector(".tiptap");
        if (editorElement) {
          const images = editorElement.querySelectorAll("img");
          console.log("에디터 내 이미지 개수:", images.length);

          // 이미지가 없고 원본에 이미지가 있으면 직접 추가
          if (images.length === 0 && imgMatches && imgMatches.length > 0) {
            console.log("이미지를 직접 추가합니다");
            imgMatches.forEach((imgTag) => {
              // 임시 div를 만들어서 이미지 태그를 파싱
              const tempDiv = document.createElement("div");
              tempDiv.innerHTML = imgTag;
              const img = tempDiv.querySelector("img");
              if (img) {
                // 이미지 스타일 적용
                img.style.maxWidth = "100%";
                img.style.height = "auto";
                img.style.display = "block";
                img.style.margin = "1rem 0";

                // 에디터에 추가
                editorElement.appendChild(img);
                console.log("이미지 추가됨:", img.outerHTML);
              }
            });
          }
        }
      }, 100);
    }
  }, [value, editor]);

  // data- 속성 처리
  useApplyMarkDataColor([value], document);

  const setTextColor = useCallback(
    (color: string) => {
      if (editor) {
        editor.chain().focus().setColor(color).run();
      }
    },
    [editor]
  );

  const applyHighlightColor = useCallback(
    (color: string) => {
      if (editor) {
        editor.chain().focus().setHighlight({ color }).run();
      }
    },
    [editor]
  );

  useEffect(() => {
    const handlePaste = (event: Event) => {
      const clipboardEvent = event as ClipboardEvent;
      const items = clipboardEvent.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf("image") !== -1) {
          const blob = item.getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (e) => {
              editor
                ?.chain()
                .focus()
                .setImage({ src: e.target?.result as string })
                .run();
            };
            reader.readAsDataURL(blob);
            event.preventDefault();
            break;
          }
        }
      }
    };
    const editorElement = document.querySelector(".tiptap");
    if (editorElement) {
      editorElement.addEventListener("paste", handlePaste);
      return () => {
        editorElement.removeEventListener("paste", handlePaste);
      };
    }
  }, [editor]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const isColorPickerOpen = showColorPicker || showHighlightPicker;
      if (!isColorPickerOpen) return;
      const colorPickerPopovers = document.querySelectorAll(
        ".color-picker-popover"
      );
      let isInsidePopover = false;
      colorPickerPopovers.forEach((popover) => {
        if (popover.contains(target)) {
          isInsidePopover = true;
        }
      });
      if (!isInsidePopover) {
        setShowColorPicker(false);
        setShowHighlightPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showColorPicker, showHighlightPicker]);

  return (
    <div className="tiptap-editor">
      <div className="editor-toolbar">
        {/* 폰트 패밀리 */}
        <select
          value={selectedFont}
          onChange={(e) => {
            setSelectedFont(e.target.value);
            if (e.target.value) {
              editor
                ?.chain()
                .focus()
                .setMark("textStyle", { fontFamily: e.target.value })
                .run();
            } else {
              editor?.chain().focus().unsetMark("textStyle").run();
            }
          }}
          className="toolbar-select"
          title="폰트"
        >
          <option value="">기본</option>
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="Verdana">Verdana</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Comic Sans MS">Comic Sans MS</option>
          <option value="Impact">Impact</option>
        </select>
        {/* 글자 크기 */}
        <select
          value={selectedFontSize}
          onChange={(e) => {
            setSelectedFontSize(e.target.value);
            if (e.target.value) {
              editor
                ?.chain()
                .focus()
                .setMark("textStyle", { fontSize: e.target.value })
                .run();
            } else {
              editor?.chain().focus().unsetMark("textStyle").run();
            }
          }}
          className="toolbar-select"
          title="글자 크기"
        >
          <option value="">기본</option>
          <option value="8px">8px</option>
          <option value="10px">10px</option>
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
          <option value="28px">28px</option>
          <option value="32px">32px</option>
          <option value="36px">36px</option>
          <option value="48px">48px</option>
        </select>
        {/* 텍스트 색상 */}
        <div className="color-picker-container">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowColorPicker(!showColorPicker);
            }}
            className="toolbar-button"
            style={{ backgroundColor: color, color: "#fff" }}
            title="텍스트 색상"
          >
            A
          </button>
          {showColorPicker && (
            <div
              className="color-picker-popover"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
            >
              <HexColorPicker color={color} onChange={setColor} />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setTextColor(color);
                  setShowColorPicker(false);
                }}
              >
                적용
              </button>
            </div>
          )}
        </div>
        {/* 하이라이트 */}
        <div className="color-picker-container">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowHighlightPicker(!showHighlightPicker);
            }}
            className="toolbar-button"
            title="하이라이트"
            style={{ background: highlightColor }}
          >
            <span style={{ background: highlightColor }}>H</span>
          </button>
          {showHighlightPicker && (
            <div
              className="color-picker-popover"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
            >
              <HexColorPicker
                color={highlightColor}
                onChange={setHighlightColor}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  applyHighlightColor(highlightColor);
                  setShowHighlightPicker(false);
                }}
              >
                적용
              </button>
            </div>
          )}
        </div>
        {/* 굵게 */}
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className="toolbar-button"
          title="굵게"
        >
          <b>B</b>
        </button>
        {/* 기울임 */}
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className="toolbar-button"
          title="기울임"
        >
          <i>I</i>
        </button>
        {/* 밑줄 */}
        <button
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className="toolbar-button"
          title="밑줄"
        >
          <u>U</u>
        </button>
        {/* 취소선 */}
        <button
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          className="toolbar-button"
          title="취소선"
        >
          <s>S</s>
        </button>
        {/* 표 삽입 */}
        <button
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
          className="toolbar-button"
          title="표 삽입"
        >
          표
        </button>
        {/* 이미지 업로드 */}
        <input
          type="file"
          id="img-upload"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (ev) => {
                editor
                  ?.chain()
                  .focus()
                  .setImage({ src: ev.target?.result as string })
                  .run();
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        <button
          onClick={() => document.getElementById("img-upload")?.click()}
          className="toolbar-button"
          title="이미지 삽입"
        >
          🖼️
        </button>
      </div>
      <EditorContent editor={editor} className="tiptap" />
    </div>
  );
};

export default TipTapEditor;
