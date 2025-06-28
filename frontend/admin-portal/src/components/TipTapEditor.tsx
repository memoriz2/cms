import React, { useState, useEffect, useCallback, useRef } from "react";
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
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Editor } from "@tiptap/core";
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
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  // onChange 함수를 안정화
  const stableOnChange = useCallback(
    (html: string) => {
      onChange(html);
    },
    [onChange]
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        strike: {},
        code: false,
      }),
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
      Link,
      Image.configure({
        HTMLAttributes: {
          class: "editor-image",
        },
        allowBase64: true,
      }),
    ],
    content: value || "<p>여기에 텍스트를 입력하세요...</p>",
    editable: true,
    autofocus: true,
    onFocus: ({ editor }) => {
      console.log("에디터 포커스됨");
      setIsEditorReady(true);
    },
    onBlur: ({ editor }) => {
      console.log("에디터 블러됨");
      const html = editor.getHTML();
      stableOnChange(html);
    },
    onCreate: ({ editor }) => {
      console.log("에디터 생성됨");
      // 생성 후 강제 포커스
      setTimeout(() => {
        try {
          editor.commands.focus();
          setIsEditorReady(true);
          console.log("에디터 생성 후 포커스 설정됨");
        } catch (error) {
          console.error("에디터 생성 후 포커스 실패:", error);
        }
      }, 100);
    },
  });

  // 에디터 클릭 시 포커스
  const handleEditorClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // forceCursor() 호출 제거 - 클릭 이벤트 중복 방지
  }, []);

  // 에디터 영역 클릭 시 포커스
  const handleEditorAreaClick = useCallback(() => {
    // forceCursor() 호출 제거 - 클릭 이벤트 중복 방지
  }, []);

  // 에디터 준비 상태 변경 시 커서 강제 생성
  useEffect(() => {
    if (isEditorReady) {
      // forceCursor 호출 제거 - 중복 방지
      // setTimeout(() => {
      //   forceCursor();
      // }, 200);
    }
  }, [isEditorReady]);

  // data- 속성 처리
  useApplyMarkDataColor([value], document);

  const setTextColor = useCallback(
    (color: string) => {
      if (editor) {
        editor.chain().setColor(color).run();
      }
    },
    [editor]
  );

  const applyHighlightColor = useCallback(
    (color: string) => {
      if (editor) {
        editor.chain().setHighlight({ color }).run();
      }
    },
    [editor]
  );

  useEffect(() => {
    const handlePaste = (event: Event) => {
      console.log("=== Paste 이벤트 발생 ===");
      const clipboardEvent = event as ClipboardEvent;
      const items = clipboardEvent.clipboardData?.items;
      console.log("클립보드 아이템:", items);

      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        console.log(`아이템 ${i}:`, item.type);

        if (item.type.indexOf("image") !== -1) {
          console.log("이미지 발견!");
          const blob = item.getAsFile();
          if (blob) {
            console.log("이미지 파일:", blob);
            const reader = new FileReader();
            reader.onload = (e) => {
              console.log("이미지 로드 완료:", e.target?.result);
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

    // 에디터 요소에 직접 이벤트 리스너 추가
    if (editor) {
      const editorElement = editor.view.dom;
      editorElement.addEventListener("paste", handlePaste);
      console.log("Paste 이벤트 리스너 등록됨");

      return () => {
        editorElement.removeEventListener("paste", handlePaste);
        console.log("Paste 이벤트 리스너 제거됨");
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

  // 에디터 초기화 - 한 번만 실행되도록 수정
  useEffect(() => {
    if (!editor || !isEditorReady) return;

    console.log("=== 에디터 초기화 ===");
    console.log("초기 value:", value);

    // 초기 콘텐츠 설정
    if (value) {
      editor.commands.setContent(value, false);
      console.log("초기 콘텐츠 설정 완료");

      // 이미지가 있는지 확인하고 처리
      setTimeout(() => {
        const editorElement = editor.view.dom;
        const images = editorElement.querySelectorAll("img");
        console.log("에디터 내 이미지 개수:", images.length);

        images.forEach((img, index) => {
          console.log(`이미지 ${index + 1}:`, img.src);
          // 이미지 로드 확인
          if (img.complete) {
            console.log(`이미지 ${index + 1} 로드 완료`);
          } else {
            console.log(`이미지 ${index + 1} 로드 중...`);
            img.onload = () => {
              console.log(`이미지 ${index + 1} 로드 완료 (onload)`);
            };
            img.onerror = () => {
              console.error(`이미지 ${index + 1} 로드 실패:`, img.src);
            };
          }
        });
      }, 100);
    }

    // update 이벤트 리스너 제거 - onBlur에서 처리하므로 불필요
    // const handleUpdate = ({ editor }: { editor: Editor }) => {
    //   const html = editor.getHTML();
    //   stableOnChange(html);
    // };

    // editor.on("update", handleUpdate);

    // return () => {
    //   editor.off("update", handleUpdate);
    // };
  }, [editor, isEditorReady, value]); // value 의존성 다시 추가

  return (
    <div className="tiptap-editor">
      <div className="editor-toolbar">
        <select
          value={selectedFont}
          onChange={(e) => {
            setSelectedFont(e.target.value);
            console.log("폰트 변경:", e.target.value);
            if (e.target.value) {
              editor
                ?.chain()
                .setMark("textStyle", { fontFamily: e.target.value })
                .run();
              console.log("폰트 적용 완료");
            } else {
              editor?.chain().unsetMark("textStyle").run();
              console.log("폰트 제거 완료");
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
          <option value="맑은 고딕">맑은 고딕</option>
          <option value="Malgun Gothic">Malgun Gothic</option>
          <option value="궁서체">궁서체</option>
          <option value="Batang">Batang</option>
          <option value="굴림체">굴림체</option>
          <option value="Gulim">Gulim</option>
          <option value="바탕체">바탕체</option>
          <option value="Dotum">Dotum</option>
          <option value="돋움체">돋움체</option>
        </select>
        <select
          value={selectedFontSize}
          onChange={(e) => {
            setSelectedFontSize(e.target.value);
            console.log("글자 크기 변경:", e.target.value);
            if (e.target.value) {
              editor
                ?.chain()
                .setMark("textStyle", { fontSize: e.target.value })
                .run();
              console.log("글자 크기 적용 완료");
            } else {
              editor?.chain().unsetMark("textStyle").run();
              console.log("글자 크기 제거 완료");
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
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log("굵게 버튼 클릭");
            editor?.chain().toggleBold().run();
            console.log("굵게 적용 완료");
          }}
          className="toolbar-button"
          title="굵게"
        >
          <b>B</b>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log("기울임 버튼 클릭");
            editor?.chain().toggleItalic().run();
            console.log("기울임 적용 완료");
          }}
          className="toolbar-button"
          title="기울임"
        >
          <i>I</i>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log("밑줄 버튼 클릭");
            editor?.chain().toggleUnderline().run();
            console.log("밑줄 적용 완료");
          }}
          className="toolbar-button"
          title="밑줄"
        >
          <u>U</u>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log("취소선 버튼 클릭");
            editor?.chain().toggleStrike().run();
            console.log("취소선 적용 완료");
          }}
          className="toolbar-button"
          title="취소선"
        >
          <s>S</s>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log("표 삽입 버튼 클릭");
            editor
              ?.chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run();
            console.log("표 삽입 완료");
          }}
          className="toolbar-button"
          title="표 삽입"
        >
          표
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log("이미지 업로드 버튼 클릭됨");

            // 파일 input을 직접 클릭하는 대신 새로운 input을 생성
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.style.display = "none";

            input.onchange = (event) => {
              const target = event.target as HTMLInputElement;
              const file = target.files?.[0];
              if (file) {
                console.log("파일 선택됨:", file);
                console.log("파일 타입:", file.type);
                console.log("파일 크기:", file.size);
                const reader = new FileReader();
                reader.onload = (ev) => {
                  console.log("파일 로드 완료:", ev.target?.result);
                  console.log("에디터 상태:", editor);
                  editor
                    ?.chain()
                    .focus()
                    .setImage({ src: ev.target?.result as string })
                    .run();
                  console.log("이미지 삽입 명령 실행됨");
                };
                reader.readAsDataURL(file);
              } else {
                console.log("선택된 파일이 없음");
              }
            };

            document.body.appendChild(input);
            input.click();
            document.body.removeChild(input);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          className="toolbar-button"
          title="이미지 삽입"
        >
          🖼️
        </button>

        {/* 텍스트 정렬 버튼들 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log("좌측 정렬 버튼 클릭");
            editor?.chain().focus().setTextAlign("left").run();
            console.log("좌측 정렬 적용 완료");
          }}
          className={`toolbar-button ${
            editor?.isActive({ textAlign: "left" }) ? "active" : ""
          }`}
          title="좌측 정렬"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="3" y="6" width="14" height="2" rx="1" fill="#222" />
            <rect x="3" y="11" width="10" height="2" rx="1" fill="#222" />
            <rect x="3" y="16" width="7" height="2" rx="1" fill="#222" />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log("가운데 정렬 버튼 클릭");
            editor?.chain().focus().setTextAlign("center").run();
            console.log("가운데 정렬 적용 완료");
          }}
          className={`toolbar-button ${
            editor?.isActive({ textAlign: "center" }) ? "active" : ""
          }`}
          title="가운데 정렬"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="5" y="6" width="14" height="2" rx="1" fill="#222" />
            <rect x="7" y="11" width="10" height="2" rx="1" fill="#222" />
            <rect x="9" y="16" width="6" height="2" rx="1" fill="#222" />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log("우측 정렬 버튼 클릭");
            editor?.chain().focus().setTextAlign("right").run();
            console.log("우측 정렬 적용 완료");
          }}
          className={`toolbar-button ${
            editor?.isActive({ textAlign: "right" }) ? "active" : ""
          }`}
          title="우측 정렬"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="7" y="6" width="14" height="2" rx="1" fill="#222" />
            <rect x="11" y="11" width="10" height="2" rx="1" fill="#222" />
            <rect x="14" y="16" width="7" height="2" rx="1" fill="#222" />
          </svg>
        </button>
      </div>
      <div
        ref={editorRef}
        onClick={handleEditorAreaClick}
        style={{ cursor: "text" }}
        className="editor-container"
        tabIndex={0}
      >
        <EditorContent editor={editor} className="tiptap" />
      </div>
    </div>
  );
};

export default TipTapEditor;
