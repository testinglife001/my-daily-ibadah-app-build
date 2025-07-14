

export const buildCategoryTreeUI = (flatList, parentId = null) => {
  const map = {};
  const roots = [];

  flatList.forEach(cat => (map[cat.id] = { ...cat, children: [] }));

  flatList.forEach(cat => {
    if (cat.parentId) {
      map[cat.parentId]?.children.push(map[cat.id]);
    } else {
      roots.push(map[cat.id]);
    }
  });

  return roots;
};
