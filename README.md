## Tech Speedrun

Небольшое приложения для быстрого набора tech стака в текст

Во-первых для личного использования, во вторых для отработки навыка обработки кнопок (возможно в будущем приложение на electron переедет), анимаций, бэм и пр.

### Хотелки

1. Анимации
2. Ререндеры (сейчас всё что может - реренедерится)
3. History действий
4. Фикс инпутов в options (вообще их переработать надо-бы, там hardcoded values)
5. Мб запретить copy если selectedlanguages.length === 0
6. Фокус в другом поле после выбора/удаления tech если был фокус (пример: добавил через фокус в результат, сразу же фокус на него после добавления, тогда setFocusPath должен быть не через 3s, а после фокуса в другом элементе (все tech должны проверить не сходится ли id с path id))
7. Сортировать по результату в search или в первую подсказку подсказывать последнее что использовал
8. Не прописывать полный путь, не frontend/rea, а rea -> frontend/rea
9. Через фокус удалять всю категорию (e.g. «frontend» или «frontend/»)

### Проблемы

1. Фокус на options инпуты не работает (кривая вёрстка)
2. Кривая вёрстка высоты окна, [подтверждённый баг](https://stackoverflow.com/a/8468131/14889638) (например body: min-height:100vh, #root: height:100% не сработает)
3. При поиске devtools показывает что FocusWindow ререндерится, хотя по факту нет. Возможно, это [этот баг](https://github.com/facebook/react/issues/19778)
4. Если у tech нет иконки, то при добавлении в resultList ей присвоится рандомная, а не та-же что в languageList
5. При memo у OptionsSwitch toggle border изначально неправильной ширины, но это, наверное, в общем проблема что ширина назначается вторым рендером (который из-за memo не происходит)
6. [x] margin bottom при фокусе неправильный на react в result list, например
7. В поиске при одинаковых tech'ах (redux-toolkit, redux-saga), оный подсказывает первый пример, а не показываает все возможные варианты
8. Из-за того что я не настроил группы keybind'ов, то esc будет закрывать и поиск, и подсказку по комбинациям клавиш
9. Поиск строчки идёт с начала слова, т.е. Mong -> MongoDB, но oDB !== MongoDB

## Пример работы

|  |  |
| :-: | :-: |
| <img width="800" alt="result preview" src="./.git.content/tech-preview.png"> result preview | <img width="800" alt="figma layout" src="./.git.content/figma-layout.png"> figma layout |
| <img width="800" alt="search preview" src="./.git.content/search-preview.png"> search preview | <img width="800" alt="figma draft" src="./.git.content/figma-draft.png"> figma-draft (alt was excluded) |
