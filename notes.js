
let db;

const request = indexedDB.open('NotesDB', 1);

request.onupgradeneeded = event => {
  db = event.target.result;
  const store = db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
  store.createIndex('title', 'title', { unique: false });
};

request.onsuccess = event => {
  db = event.target.result;
  displayNotes();
};

request.onerror = () => {
  console.error('Błąd otwierania bazy danych.');
};

document.getElementById('noteForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();

  const tx = db.transaction('notes', 'readwrite');
  const store = tx.objectStore('notes');
  store.add({ title, content });

  tx.oncomplete = () => {
    this.reset();
    displayNotes();
  };
});

function displayNotes() {
  const notesList = document.getElementById('notesList');
  notesList.innerHTML = '';

  const tx = db.transaction('notes', 'readonly');
  const store = tx.objectStore('notes');
  const request = store.openCursor();

  request.onsuccess = event => {
    const cursor = event.target.result;
    if (cursor) {
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="note-item">
          <div>
            <strong>${cursor.value.title}</strong>: ${cursor.value.content}
          </div>
          <button class="delete-btn" data-id="${cursor.value.id}">Usuń</button>
        </div>
      `;
      li.querySelector('button').addEventListener('click', deleteNote);
      notesList.appendChild(li);
      cursor.continue();
    }
  };
}


function deleteNote(event) {
  const id = Number(event.target.dataset.id);
  const tx = db.transaction('notes', 'readwrite');
  const store = tx.objectStore('notes');
  store.delete(id);
  tx.oncomplete = () => displayNotes();
}

