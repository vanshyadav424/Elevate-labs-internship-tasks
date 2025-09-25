const bookList = document.getElementById("book-list");
const bookForm = document.getElementById("book-form");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const searchInput = document.getElementById("search");
const toast = document.getElementById("toast");

let allBooks = [];
let isEditing = false;
let editBookId = null;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

window.onload = fetchBooks;

function fetchBooks() {
  fetch("http://localhost:3000/books")
    .then(res => res.json())
    .then(data => {
      allBooks = data;
      renderFilteredBooks();
    });
}

searchInput.addEventListener("input", renderFilteredBooks);

function renderFilteredBooks() {
  const keyword = searchInput.value.toLowerCase();
  bookList.innerHTML = "";

  allBooks
    .filter(book =>
      book.title.toLowerCase().includes(keyword) ||
      book.author.toLowerCase().includes(keyword)
    )
    .forEach(book => renderBook(book));
}

function renderBook(book) {
  const li = document.createElement("li");

  const bookImg = document.createElement("img");
  bookImg.src = `https://covers.openlibrary.org/b/title/${encodeURIComponent(book.title)}-M.jpg`;
  bookImg.alt = "Book cover";
  bookImg.onerror = () => {
    bookImg.src = "https://via.placeholder.com/50x70?text=No+Image";
  };

  const detailsSpan = document.createElement("span");
  detailsSpan.innerHTML = `<strong>${book.title}</strong> by ${book.author}`;

  const bookDetails = document.createElement("div");
  bookDetails.className = "book-details";
  bookDetails.appendChild(bookImg);
  bookDetails.appendChild(detailsSpan);

  const buyLink = document.createElement("a");
  buyLink.href = `https://www.amazon.in/s?k=${encodeURIComponent(book.title + " " + book.author)}`;
  buyLink.target = "_blank";
  buyLink.innerHTML = "🛒";

  const editBtn = document.createElement("button");
  editBtn.innerHTML = "✏️";
  editBtn.onclick = () => {
    isEditing = true;
    editBookId = book.id;
    titleInput.value = book.title;
    authorInput.value = book.author;
    bookForm.querySelector("button").textContent = "Update Book ✏️";
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "🗑️";
  deleteBtn.onclick = () => {
    deleteBook(book.id);
  };

  const actions = document.createElement("div");
  actions.className = "actions";
  actions.appendChild(buyLink);
  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(bookDetails);
  li.appendChild(actions);
  bookList.appendChild(li);
}

bookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  if (!title || !author) return;

  if (isEditing) {
    fetch(`http://localhost:3000/books/${editBookId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, author })
    })
      .then(res => res.json())
      .then(updatedBook => {
        allBooks = allBooks.map(book =>
          book.id === editBookId ? updatedBook : book
        );
        showToast("✏️ Book updated!");
        resetForm();
        renderFilteredBooks();
      });
  } else {
    fetch("http://localhost:3000/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, author })
    })
      .then(res => res.json())
      .then(newBook => {
        allBooks.push(newBook);
        showToast("✅ Book added!");
        resetForm();
        renderFilteredBooks();
      });
  }
});

function deleteBook(id) {
  fetch(`http://localhost:3000/books/${id}`, {
    method: "DELETE"
  }).then(() => {
    allBooks = allBooks.filter(book => book.id !== id);
    renderFilteredBooks();
    showToast("❌ Book deleted!");
  });
}

function resetForm() {
  isEditing = false;
  editBookId = null;
  titleInput.value = "";
  authorInput.value = "";
  bookForm.querySelector("button").textContent = "Add Book 📘";
}





