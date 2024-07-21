import { useEffect } from "react";

export function useOutsideAlerter(ref, setIsNavOpen) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsNavOpen(false);
      }
    }

    function handleTouchMove(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsNavOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("touchmove", handleTouchMove);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [ref, setIsNavOpen]);
}
