import { useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export default function (timeout?: number) {
  const [otherLang, setOtherLang] = useState<boolean>(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useHotkeys(
    "*",
    k => {
      if (!k.code.includes("Key")) return;

      const onlyEng = /^[a-zA-Z]+$/.test(k.key);
      setOtherLang(!onlyEng);
      // если язык - англ и есть таймаут - удалить его и выйти из ф-ции
      if (onlyEng === true && timeoutRef.current !== null) return clearTimeout(timeoutRef.current);

      // если язык НЕ англ, сносит старый таймаут чтобы повесить новый
      if (otherLang === true && timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        setOtherLang(true);
      }
      // ну и таймаут
      timeoutRef.current = setTimeout(() => {
        setOtherLang(false);
        // то что рефы нормально использовать для ref assignment
        // второй пример первого ответа, https://stackoverflow.com/questions/53090432/react-hooks-right-way-to-clear-timeouts-and-intervals
        if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
      }, timeout);
    },
    { enableOnFormTags: true },
    [otherLang, timeoutRef.current, timeout]
  );

  return { otherLang };
}
