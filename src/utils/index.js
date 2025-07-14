export const excerpt = (str, count) => {
  if (str?.length > count) {
    str = str.substring(0, count) + " ... ";
  }
  return str;
};

export const excerptSimple = (str, count) => {
  if (!str) return "";
  return str.length > count ? str.substring(0, count) + "..." : str;
};

