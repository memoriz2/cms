import { useEffect } from "react";

/**
 * data-color 속성을 가진 <mark> 태그에 style.backgroundColor를 적용하고,
 * data-style 속성을 가진 모든 태그에 style을 복원하는 커스텀 훅
 * @param deps - 의존성 배열(예: [게시글 목록, 내용 등])
 * @param root - 적용할 루트(기본값: document)
 */
export function useApplyMarkDataColor(
  deps: any[] = [],
  root: HTMLElement | Document = document
) {
  useEffect(() => {
    // mark[data-color] 처리
    root.querySelectorAll("mark[data-color]").forEach((el) => {
      const color = el.getAttribute("data-color");
      if (color) {
        (el as HTMLElement).style.backgroundColor = color;
      }
    });

    // data-style 처리
    root.querySelectorAll("[data-style]").forEach((el) => {
      const dataStyle = el.getAttribute("data-style");
      if (dataStyle) {
        (el as HTMLElement).setAttribute("style", dataStyle);
        el.removeAttribute("data-style");
      }
    });

    // 표 스타일 복원 (data-table 속성이 있는 경우)
    root.querySelectorAll("table[data-table]").forEach((table) => {
      // 표에 기본 스타일 적용
      (table as HTMLElement).style.borderCollapse = "collapse";
      (table as HTMLElement).style.width = "100%";
      (table as HTMLElement).style.marginBottom = "1rem";

      // 셀에 기본 스타일 적용
      table.querySelectorAll("th, td").forEach((cell) => {
        (cell as HTMLElement).style.border = "1px solid #ddd";
        (cell as HTMLElement).style.padding = "8px";
        (cell as HTMLElement).style.textAlign = "left";
      });

      // 헤더 셀에 배경색 적용
      table.querySelectorAll("th").forEach((header) => {
        (header as HTMLElement).style.backgroundColor = "#f2f2f2";
        (header as HTMLElement).style.fontWeight = "bold";
      });

      // data-table 속성 제거
      table.removeAttribute("data-table");
    });

    // 이미지 스타일 복원 (data-image 속성이 있는 경우)
    root.querySelectorAll("img[data-image]").forEach((img) => {
      // 이미지에 기본 스타일 적용
      (img as HTMLElement).style.maxWidth = "100%";
      (img as HTMLElement).style.height = "auto";
      (img as HTMLElement).style.display = "block";
      (img as HTMLElement).style.margin = "1rem 0";

      // data-image 속성 제거
      img.removeAttribute("data-image");
    });
  }, deps);
}
