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