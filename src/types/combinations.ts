export enum SearchCombinations {
  toggleSearch = "ctrl+f",

  search = "enter",

  add = "shift+enter",
  preAdd = "shift",

  remove = "shift+alt+enter, ctrl+shift+enter",
  preRemove = "shift+alt, ctrl+shift",

  esc = "esc",

  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  tab = "tab",

  arrowDown = "ArrowDown",
  arrowUp = "ArrowUp"
}

export enum OtherCombinations {
  copy = "ctrl+c",
  keybinds = "ctrl+space"
}

export const allKeybinds = { ...SearchCombinations, ...OtherCombinations };

export type AllKeybinds = typeof SearchCombinations & typeof OtherCombinations;
