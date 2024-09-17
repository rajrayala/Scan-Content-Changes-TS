export function compareJson(newData: any, oldData: any): any {
  const differences = diffObjects(oldData, newData);
  return differences;
}

function diffObjects(oldObj: any, newObj: any): any {
  const changes: any = { item_added: {}, item_removed: {} };

  function recursiveDiff(o: any, n: any, path: string[] = []) {
    if (o === n) return; // Skip if values are identical

    if (
      typeof o === "object" &&
      o !== null &&
      typeof n === "object" &&
      n !== null
    ) {
      new Set([...Object.keys(o), ...Object.keys(n)]).forEach((key) =>
        recursiveDiff(o[key], n[key], [...path, key])
      );
    } else {
      const p = `root['${path.join("']['")}']`;
      if (n === undefined) changes.item_removed[p] = o;
      if (o === undefined) changes.item_added[p] = n;
      if (n !== undefined && o !== undefined) {
        changes.item_removed[p] = o;
        changes.item_added[p] = n;
      }
    }
  }

  recursiveDiff(oldObj, newObj, []);
  return {
    ...(Object.keys(changes.item_added).length > 0 && {
      item_added: changes.item_added,
    }),
    ...(Object.keys(changes.item_removed).length > 0 && {
      item_removed: changes.item_removed,
    }),
  };
}
