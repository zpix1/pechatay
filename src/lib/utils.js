export function findParent(scheme, id) {
  for (let i = 0; i < scheme.items.length; i++) {
    if (scheme.items[i].type === 'set') {
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
