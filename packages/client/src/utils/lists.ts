export const mapFilter = <T, J>(
  list: T[],
  filter: (elem: T) => boolean,
  map: (elem: T) => J,
) => {
  const newList = [];
  for (const elem of list) {
    if (filter(elem)) {
      newList.push(map(elem));
    }
  }
  return newList;
};
