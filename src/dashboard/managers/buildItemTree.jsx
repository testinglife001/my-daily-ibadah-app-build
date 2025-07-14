// buildItemTree.js
export const buildItemTree = (items, parentId = null) => {
  return items
    .filter((item) => item.parentId === parentId)
    .map((item) => ({
      ...item,
      children: buildItemTree(items, item.id)
    }));
};
