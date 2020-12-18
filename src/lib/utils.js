import {LETTERS_IN_WORD} from "@/lib/constants";

export function findParent(scheme, id) {
  for (let i = 0; i < scheme.items.length; i++) {
    if (scheme.items[i].type === "set") {
      let res = findParent(scheme.items[i], id);
      if (res) {
        return res;
      }
    } else {
      if (scheme.items[i].id === id) {
        return {
          parent: scheme,
          index: i
        };
      }
    }
  }
  return false;
}

export function placeCaretAtEnd(el) {
  el.focus();
  if (typeof window.getSelection != "undefined"
          && typeof document.createRange != "undefined") {
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
  } else if (typeof document.body.createTextRange != "undefined") {
      const textRange = document.body.createTextRange();
      textRange.moveToElementText(el);
      textRange.collapse(false);
      textRange.select();
  }
}

export function getWPM(totalMs, totalLetters) {
  if (totalMs !== 0) {
    return (totalLetters / LETTERS_IN_WORD) / (totalMs / 1000 / 60);
  } else {
    return 0;
  }
}

export function randomName() {
  let length = 10;
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function langToEmoji(lang) {
  if (lang === "ru") {
    return "🇷🇺";
  }
  if (lang === "en") {
    return "🇬🇧";
  }
  if (lang === "fr") {
    return "🇫🇷";
  }
  return lang.toUpperCase();
}