import { useLayoutEffect, useRef, useState } from "react";

export default function TextareaAutosize() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");

  /**
   * 브라우저가 화면을 다시 그리기 전에 실행되는 useEffect
   * 브라우저가 화면을 그리기 전에 레이아웃을 계산해야할 떄 사용해야 함
   * @link https://ko.react.dev/reference/react/useLayoutEffect
   */
  useLayoutEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      className="w-1/2 h-auto border resize-none"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
    />
  );
}
