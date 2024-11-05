//////////////__________________U T I L S__________________//////////////

//___S O R T________________________________________________________//
export function sortByPrio(arr) {
  arr.sort((a, b) => a.prio - b.prio);
}

export function sortByDueDate(arr) {
  arr.sort((a, b) => {
    if (!a.dueDateObj && !b.dueDateObj) return 0;
    if (!a.dueDateObj) return 1;
    if (!b.dueDateObj) return -1;

    return a.dueDateObj.getTime() - b.dueDateObj.getTime();
  });
}

export function sortByAlpha(arr) {
  arr.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
}

export function sortByCreated(arr) {
  arr.sort((a, b) => b.created.getTime() - a.created.getTime());
}
