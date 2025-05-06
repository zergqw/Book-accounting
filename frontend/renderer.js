const knex = require('./database');

// Функция для добавления новой книги
async function addBook(title, author, genre, year) {
  await knex('books').insert({ title, author, genre, year });
}

// Функция для редактирования книги
async function editBook(id, title, author, genre, year) {
  await knex('books')
    .where({ id })
    .update({ title, author, genre, year });
}

// Функция для удаления книги
async function deleteBook(id) {
  await knex('books')
    .where({ id })
    .del();
}

// Функция для поиска книг
async function searchBooks(query) {
  return knex('books')
    .where('title', 'like', `%${query}%`)
    .orWhere('author', 'like', `%${query}%`)
    .orWhere('genre', 'like', `%${query}%`);
}

// Функция для получения всех книг
async function getAllBooks() {
  return knex('books').select('*');
}

// Загрузка книг в таблицу
async function loadBooks(books = null) {
  if (!books) {
    books = await getAllBooks();
  }
  const tbody = document.getElementById('book-table-body');
  const cardsView = document.getElementById('book-cards-view');
  tbody.innerHTML = '';
  cardsView.innerHTML = '';

  books.forEach(book => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.genre}</td>
      <td>${book.year}</td>
      <td>
        <button class="btn-icon edit" data-id="${book.id}"><i class="fas fa-edit"></i></button>
        <button class="btn-icon delete" data-id="${book.id}"><i class="fas fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(row);

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-header">
        <h3>${book.title}</h3>
        <span class="year">${book.year}</span>
      </div>
      <div class="card-body">
        <p><strong>Автор:</strong> ${book.author}</p>
        <p><strong>Жанр:</strong> ${book.genre}</p>
      </div>
      <div class="card-actions">
        <button class="btn-icon edit" data-id="${book.id}"><i class="fas fa-edit"></i></button>
        <button class="btn-icon delete" data-id="${book.id}"><i class="fas fa-trash"></i></button>
      </div>
    `;
    cardsView.appendChild(card);
  });
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
  loadBooks();

  // Обработка добавления книги
  document.getElementById('book-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const genre = document.getElementById('genre').value;
    const year = parseInt(document.getElementById('year').value, 10);

    await addBook(title, author, genre, year);
    loadBooks();
  });

  // Обработка поиска книг
  document.querySelector('.search-btn').addEventListener('click', async () => {
    const query = document.getElementById('search').value.trim();
    if (query) {
      const books = await searchBooks(query);
      loadBooks(books);
    } else {
      loadBooks();
    }
  });

  // Обработка редактирования и удаления
  document.addEventListener('click', async (e) => {
    if (e.target.closest('.edit')) {
      const id = e.target.closest('.edit').dataset.id;
      const title = prompt('Введите новое название:');
      const author = prompt('Введите нового автора:');
      const genre = prompt('Введите новый жанр:');
      const year = prompt('Введите новый год:');
      await editBook(id, title, author, genre, parseInt(year, 10));
      loadBooks();
    }

    if (e.target.closest('.delete')) {
      const id = e.target.closest('.delete').dataset.id;
      if (confirm('Вы уверены, что хотите удалить эту книгу?')) {
        await deleteBook(id);
        loadBooks();
      }
    }
  });

  // Переключение представлений
  document.querySelectorAll('.view-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');

      if (e.target.dataset.view === 'table') {
        document.querySelector('.table-view').style.display = 'block';
        document.querySelector('.cards-view').style.display = 'none';
      } else {
        document.querySelector('.table-view').style.display = 'none';
        document.querySelector('.cards-view').style.display = 'grid';
      }
    });
  });
});