// import { createSlice } from "@reduxjs/toolkit";

// type HistoryProp = {
//     name: string,
//     action: any
// }
// export type HistoryState =

// const HistorySlice = createSlice({
//     name: 'history',
//     initialState
// })

// хранить предыдущий стейт (и будущий если откатился на предыдущий, но предыдущий как бы и есть будущим, какой-то loop), либо весь, либо только те поля, которые пользователь мог обновить,
// я про, например, подсказки, если прожал tab и принял подсказку, то при ctrl+z убирает её назад, при ctrl+x применяет опять
// !!!!!НО!!!!! это не относится к условно говоря CTRL+F или CTRL+SPACE, который можно спамить (я не разобрался как в хук useHotkeys засунуть троттл)
