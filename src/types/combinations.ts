export enum SearchCombinations {
  toggleSearch = "ctrl+f",

  search = "enter",

  add = "shift+enter",
  preAdd = "shift",

  remove = "shift+alt+enter, ctrl+shift+enter",
  preRemove = "shift+alt, ctrl+shift",

  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  tab = "tab",

  arrowDown = "ArrowDown",
  arrowUp = "ArrowUp"
}

export enum OtherCombinations {
  esc = "esc",
  copy = "ctrl+c",
  keybinds = "ctrl+space"
}

export enum HistoryCombinations {
  undo = "ctrl+z",
  redo = "ctrl+x, ctrl+shift+z"
}

export const allKeybinds = { ...SearchCombinations, ...OtherCombinations, ...HistoryCombinations };

export type AllKeybinds = typeof SearchCombinations & typeof OtherCombinations & typeof HistoryCombinations;
