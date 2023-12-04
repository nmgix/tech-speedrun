## Tech Speedrun

Небольшое приложения для быстрого набора tech стака в текст

Во-первых для личного использования, во вторых для отработки навыка обработки кнопок (возможно в будущем приложение на electron переедет), анимаций, бэм и пр.

### Хотелки

1. Анимации
2. History действий
3. Фикс инпутов в options (вообще их переработать надо-бы, там hardcoded values)
4. Мб запретить copy если selectedLanguages.length === 0
5. Фокус в другом поле после выбора/удаления tech если был фокус (пример: добавил через фокус в результат, сразу же фокус на него после добавления, тогда setFocusPath должен быть не через 3s, а после фокуса в другом элементе (все tech должны проверить не сходится ли id с path id))
6. Сортировать по результату в search или в первую подсказку подсказывать последнее что использовал
7. Не прописывать полный путь, не frontend/rea, а rea -> frontend/rea
8. Через фокус удалять всю категорию (e.g. «frontend» или «frontend/»)

### Проблемы

1. Фокус на options инпуты не работает (кривая вёрстка)

## Пример работы

|  |  |
| :-: | :-: |
| <img width="800" alt="result preview" src="./.git.content/tech-preview.png"> result preview | <img width="800" alt="figma layout" src="./.git.content/figma-layout.png"> figma layout |
| <img width="800" alt="search preview" src="./.git.content/search-preview.png"> search preview | <img width="800" alt="figma draft" src="./.git.content/figma-draft.png"> figma-draft (alt was excluded) |
