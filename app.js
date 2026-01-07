const notesList = document.querySelector("#notes-list");
const noteEditor = document.querySelector("#note-editor");
const noteContent = document.querySelector("#note-content");
const editorPlaceholder = document.querySelector(".editor-placeholder");
const noteDate = document.querySelector("#note-date");

const newNoteButton = document.querySelector("#new-note-btn");
const deleteNoteButton = document.querySelector("#delete-note-btn");

let notes = [];
let selectedNoteId = null;

loadNotes();
renderNotes();

//Functions

function createNote() {
  const newNote = {
    id: Date.now(),
    content: "",
    createdAt: new Date().toLocaleDateString(),
  };
  notes.push(newNote);
  return newNote;
}

function renderNotes() {
  notesList.innerHTML = "";
  notes.forEach((note) => {
    const notePreview = note.content || "New Note";

    const noteHTML = `
    <div class="note-item" data-id="${note.id}">
      <div class="note-preview">${notePreview}</div>
      <small>${note.createdAt}</small>
     </div>
    `;

    notesList.innerHTML += noteHTML;
  });
}

function selectNote(id) {
  const note = notes.find((note) => note.id === id);
  if (!note) return;
  selectedNoteId = note.id;
  editorPlaceholder.classList.add("hidden");
  noteEditor.classList.remove("hidden");
  noteContent.value = note.content;
  noteDate.textContent = note.createdAt;
}

function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  renderNotes();
  selectedNoteId = null;
  noteEditor.classList.add("hidden");
  editorPlaceholder.classList.remove("hidden");
}

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function loadNotes() {
  const savedNotes = localStorage.getItem("notes");
  if (savedNotes !== null) {
    notes = JSON.parse(savedNotes);
  }
}

// EventListeners

newNoteButton.addEventListener("click", () => {
  const note = createNote();
  renderNotes();
  saveNotes();
  selectNote(note.id);
});

notesList.addEventListener("click", (e) => {
  const noteItem = e.target.closest(".note-item");

  if (noteItem) {
    const noteId = Number(noteItem.dataset.id);
    selectNote(noteId);
  }
});

noteContent.addEventListener("input", () => {
  const note = notes.find((note) => note.id === selectedNoteId);
  if (!note) return;

  note.content = noteContent.value;
  renderNotes();
  saveNotes();
});

deleteNoteButton.addEventListener("click", () => {
  deleteNote(selectedNoteId);
  saveNotes();
});
