const notesList = document.querySelector("#notes-list");
const noteEditor = document.querySelector("#note-editor");
const noteContent = document.querySelector("#note-content");
const editorPlaceholder = document.querySelector(".editor-placeholder");
const noteDate = document.querySelector("#note-date");

const newNoteButton = document.querySelector("#new-note-btn");
const deleteNoteButton = document.querySelector("#delete-note-btn");

const searchBar = document.querySelector("#searchbar");

let notes = [];
let selectedNoteId = null;

loadNotes();
renderNotes();

//---------- keyboard shortcuts ------------

// document.addEventListener("keydown", (e) => {
//   if ((e.ctrlKey || e.metaKey) && e.key === "n") {
//     e.preventDefault();
//     const note = createNote();
//     saveNotes();
//     selectNote(note.id);
//     renderNotes();
//   }
// });

// document.addEventListener("keydown", (e) => {
//   if (e.key === "Delete") {
//     if (selectedNoteId !== null) {
//       e.preventDefault();
//       const confirmDelete = confirm("U sure u wanna delete this note?");
//       if (confirmDelete) {
//         deleteNote(selectedNoteId);
//         saveNotes();
//       }
//     }
//   }
// });

// document.addEventListener("keydown", (e) => {
//   if (e.key === "Escape") {
//     selectedNoteId = null;
//     editorPlaceholder.classList.remove("hidden");
//     noteEditor.classList.add("hidden");
//     renderNotes();
//   }
// });

document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "n") {
    e.preventDefault();
    const note = createNote();
    saveNotes();
    selectNote(note.id);
    renderNotes();
  }

  if (e.key === "Delete") {
    if (selectedNoteId !== null) {
      e.preventDefault();
      const confirmDelete = confirm("U sure u wanna delete this note?");
      if (confirmDelete) {
        deleteNote(selectedNoteId);
        saveNotes();
      }
    }
  }

  if (e.key === "Escape") {
    selectedNoteId = null;
    editorPlaceholder.classList.remove("hidden");
    noteEditor.classList.add("hidden");
    renderNotes();
  }
});

//
//------------- Functions ---------------
//

function createNote() {
  const newNote = {
    id: Date.now(),
    content: "",
    createdAt: new Date().toLocaleDateString(),
  };
  notes.push(newNote);
  return newNote;
}

function renderNotes(notesToRender = notes) {
  notesList.innerHTML = "";
  notesToRender.forEach((note) => {
    // const notePreview = note.content || "New Note";
    const splitLine = note.content.split("\n");
    const notePreview = splitLine[0] || "New Note";

    const isActive = note.id === selectedNoteId;

    const noteHTML = `
    <div class="note-item ${isActive ? "active" : ""}" data-id="${note.id}">
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

function filterNotes(searchTerm) {
  if (searchTerm === "") {
    return notes;
  }
  return notes.filter((note) => {
    return note.content.toLowerCase().includes(searchTerm.toLowerCase());
  });
}
// ---------------------------------
// ------------------------------------
//-------- EventListeners ----------

newNoteButton.addEventListener("click", () => {
  const note = createNote();
  saveNotes();
  selectNote(note.id);
  renderNotes();
});

notesList.addEventListener("click", (e) => {
  const noteItem = e.target.closest(".note-item");

  if (noteItem) {
    const noteId = Number(noteItem.dataset.id);
    selectNote(noteId);
    renderNotes();
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
  const confirmDelete = confirm("U sure u wanna delete this note?");
  if (confirmDelete) {
    deleteNote(selectedNoteId);
    saveNotes();
  }
});

searchBar.addEventListener("input", () => {
  const searchTerm = searchBar.value;
  const filteredNotes = filterNotes(searchTerm);

  if (filteredNotes.length === 0) {
    notesList.innerHTML = "<p class='no-results'>No Notes Found</p>";
  } else {
    renderNotes(filteredNotes);
  }
});
