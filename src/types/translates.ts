import { AllKeybinds } from "./combinations";

type Translates<someType = object> = {
  ru: someType | string;
  en: someType | string;
};

export const resultListHeaderTranslates: Translates = {
  ru: "Мой технологический стек",
  en: "Here is my tech stack"
};
export const resultListTechCategoriesTranslates: Translates = {
  ru: {
    frontend: "фронтенд",
    backend: "бекенд",
    devops: "devops",
    others: "остальное"
  },
  en: {
    frontend: "frontend",
    backend: "backend",
    devops: "devops",
    others: "others"
  }
};

export type KeybindDescription = { title: string; description?: string };
export const keybindsDescriptions: Translates<{ [keybind in keyof Partial<AllKeybinds>]: KeybindDescription }> = {
  ru: {
    toggleSearch: {
      title: "Переключить поиск",
      description: "Позволяет искать, добавлять и удалять технологии в списках"
    },
    search: {
      title: "Поиск технологии в двух списках",
      description: "Если технология найдена, то на 3с будет установлен фокус"
    },
    add: {
      title: "Добавить технологию в результат"
    },
    remove: {
      title: "Удалить технологию из результата"
    },
    tab: {
      title: "Принять подсказку",
      description: "Работает вместе с стрелочками, выбор папки (с подсказкой кол-ва элементов на уровне) и выбор технологии"
    },
    arrowUp: {
      title: "Предыдущаяя подсказка"
    },
    arrowDown: {
      title: "Следующаяя подсказка"
    },
    esc: {
      title: "Закрыть модальные окна"
    },
    keybinds: {
      title: "Открыть подсказку по комбинациям клавиш"
    },

    copy: {
      title: "Копирование текста из результата"
    }
  },
  en: {
    toggleSearch: {
      title: "Toggle Search",
      description: "Allows searching, adding, and removing technologies in lists"
    },
    search: {
      title: "Search for technology in two lists",
      description: "If the technology is found, focus on it will be set for 3s"
    },
    add: {
      title: "Add Technology to result list"
    },
    remove: {
      title: "Remove Technology from result list"
    },
    tab: {
      title: "Accept Hint",
      description: "Works with arrows, folder selection (with a hint of the number of items at the level), and technology selection"
    },
    arrowUp: {
      title: "Previous Hint"
    },
    arrowDown: {
      title: "Next Hint"
    },
    esc: {
      title: "Close Modal windows"
    },
    keybinds: {
      title: "Open keybindings hint"
    },
    copy: {
      title: "Copy Text from result list"
    }
  }
};

export const keybindsTitle: Translates<string> = {
  ru: "Сочетание клавиш",
  en: "KEEybinds"
};
