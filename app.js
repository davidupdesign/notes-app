const notesList = document.querySelector("#notes-list")
const noteEditor = document.querySelector("#note-editor")
const noteContent = document.querySelector("#note-content")
const editorPlaceholder = document.querySelector(".editor-placeholder")
const noteDate = document.querySelector("#note-date")

const newNoteButton = document.querySelector("#new-note-btn")
const deleteNoteButton = document.querySelector("#delete-note-btn")

let notes = [];
let selectedNoteId = null;