document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search');
  const searchBtn = document.querySelector('.search-btn');
  const bookTableBody = document.getElementById('book-table-body');
  const API_URL = 'http://localhost:3000/api/books';

  function init() {
    initEventListeners();
    loadBooks();
  }

  function initEventListeners() {
    document.getElementById('add-book-btn').addEventListener('click', () => {
      openBookModal();
    });
        
    searchBtn.addEventListener('click', () => {
      const searchTerm = searchInput.value.trim();
      if (searchTerm) loadBooks(searchTerm);
    });
    document.querySelector('.reset-btn').addEventListener('click', () => {
      searchInput.value = '';
      loadBooks();
    });
    document.getElementById('edit-form').addEventListener('submit', handleFormSubmit);

    document.querySelector('.close-modal').addEventListener('click', () => {
      closeModal();
    });

    document.getElementById('edit-modal').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.getElementById('edit-modal').style.display === 'block') {
        closeModal();
      }
    });

    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', toggleView);
    });
  }

  async function loadBooks(searchTerm = '') {
    try {
      if (!searchTerm) {
        searchInput.value = '';
      }
        
      const url = searchTerm 
        ? `${API_URL}/search?query=${encodeURIComponent(searchTerm)}`
        : API_URL;
            
      const response = await fetch(url);
      if (!response.ok) throw new Error('Ошибка загрузки книг');
        
      const books = await response.json();
      renderBooks(books.data || books);
    } catch (error) {
      console.error('Error:', error);
      showAlert('Ошибка при загрузке книг', 'error');
    }
  }

  function renderBooks(books) {
    bookTableBody.innerHTML = '';
        
    if (books.length === 0) {
      bookTableBody.innerHTML = '<tr><td colspan="5">Книги не найдены</td></tr>';
      return;
    }
        
    books.forEach(book => {
      renderBookTableRow(book);
    });

    initBookActions();
  }

  function renderBookTableRow(book) {
    const row = document.createElement('tr');
    row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.genre || '-'}</td>
            <td>${book.year || '-'}</td>
            <td>
                <button class="btn btn-edit" data-id="${book.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-delete" data-id="${book.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
    bookTableBody.appendChild(row);
  }

  function initBookActions() {
    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', handleDeleteBook);
    });

    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', handleEditBook);
    });
  }

  async function handleDeleteBook(e) {
    const id = e.currentTarget.getAttribute('data-id');
    if (!confirm('Вы уверены, что хотите удалить эту книгу?')) return;
        
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
            
      if (!response.ok) throw new Error('Ошибка при удалении книги');
            
      loadBooks();
      showAlert('Книга успешно удалена!', 'success');
    } catch (error) {
      console.error('Error:', error);
      showAlert('Ошибка при удалении книги', 'error');
    }
  }

  async function handleEditBook(e) {
    const id = e.currentTarget.getAttribute('data-id');
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error('Ошибка загрузки данных книги');
            
      const book = await response.json();
      openBookModal(book.data || book);
    } catch (error) {
      console.error('Error:', error);
      showAlert('Ошибка при загрузке данных книги', 'error');
    }
  }

  function openBookModal(book = null) {
    const isEditMode = book !== null;
    const modal = document.getElementById('edit-modal');
        
    document.getElementById('modal-title').textContent = 
            isEditMode ? 'Редактировать книгу' : 'Добавить новую книгу';
    document.getElementById('submit-text').textContent = 
            isEditMode ? 'Сохранить' : 'Добавить';
        
    document.getElementById('edit-id').value = isEditMode ? book.id : '';
    document.getElementById('edit-title').value = isEditMode ? book.title : '';
    document.getElementById('edit-author').value = isEditMode ? book.author : '';
    document.getElementById('edit-genre').value = isEditMode ? book.genre || '' : '';
    document.getElementById('edit-year').value = isEditMode ? book.year || '' : '';
        
    modal.style.display = 'block';
        
  }

  function closeModal() {
    document.getElementById('edit-modal').style.display = 'none';
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
        
    const bookData = {
      title: document.getElementById('edit-title').value,
      author: document.getElementById('edit-author').value,
      genre: document.getElementById('edit-genre').value,
      year: parseInt(document.getElementById('edit-year').value)
    };
        
    const id = document.getElementById('edit-id').value;
    const isEditMode = !!id;

    try {
      const url = isEditMode ? `${API_URL}/${id}` : API_URL;
      const method = isEditMode ? 'PUT' : 'POST';
            
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
      });

      if (!response.ok) throw new Error(`Ошибка ${isEditMode ? 'обновления' : 'добавления'} книги`);
            
      closeModal();
      loadBooks();
      showAlert(`Книга успешно ${isEditMode ? 'обновлена' : 'добавлена'}!`, 'success');
    } catch (error) {
      console.error('Error:', error);
      showAlert(`Ошибка: ${error.message}`, 'error');
    }
  }

  function toggleView(e) {
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    e.currentTarget.classList.add('active');
        
    if (e.currentTarget.getAttribute('data-view') === 'table') {
      document.querySelector('.table-view').style.display = 'block';
    } else {
      document.querySelector('.table-view').style.display = 'none';
    }
  }

  function showAlert(message) {
    alert(message); 
  }

  init();
});