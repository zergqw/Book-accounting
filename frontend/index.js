/* eslint-disable no-dupe-keys */

document.addEventListener('DOMContentLoaded', () => {
  const bookForm = document.getElementById('book-form');
  const searchInput = document.getElementById('search');
  const searchBtn = document.querySelector('.search-btn');
  const booksTableBody = document.querySelector('tbody');
  const booksCardsContainer = document.querySelector('.cards-view');
  const viewButtons = document.querySelectorAll('.view-btn');

  let books = JSON.parse(localStorage.getItem('books')) || [];

  function init() {
    // eslint-disable-next-line no-use-before-define
    renderBooks();
    // eslint-disable-next-line no-use-before-define
    setupEventListeners();
  }

  function setupEventListeners() {
    // eslint-disable-next-line no-use-before-define
    bookForm.addEventListener('submit', handleSubmit);
    // eslint-disable-next-line no-use-before-define
    searchBtn.addEventListener('click', handleSearch);
    // eslint-disable-next-line no-use-before-define
    viewButtons.forEach((btn) => btn.addEventListener('click', switchView));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newBook = {
      id: Date.now(),
      title: document.getElementById('title').value.trim(),
      author: document.getElementById('author').value.trim(),
      genre: document.getElementById('genre').value,
      year: document.getElementById('year').value,
    };

    // eslint-disable-next-line no-use-before-define
    if (validateForm(newBook)) {
      books.push(newBook);
      // eslint-disable-next-line no-use-before-define
      saveToLocalStorage();
      // eslint-disable-next-line no-use-before-define
      renderBooks();
      bookForm.reset();
    }
  }

  function validateForm(book) {
    // Проверка на заполненность полей
    if (!book.title || !book.author || !book.genre || !book.year) {
      alert('Заполните все обязательные поля!');
      return false;
    }
    // Список книг с обязательными авторами и жанрами
    const bookData = {
      'Мастер и Маргарита': {
        author: 'Михаил Булгаков',
        genre: 'Роман',
        minYear: 1966,
        maxYear: 1967,
      },
      1984: {
        author: 'Джордж Оруэлл',
        genre: 'Другое',
        minYear: 1949,
        maxYear: 1949,
      },
      // Добавьте остальные книги по аналогии
      'Дон Кихот': {
        author: 'Мигель де Сервантес',
        genre: 'Роман',
        minYear: 1605,
        maxYear: 1615,
      },
      Гамлет: {
        author: 'Уильям Шекспир',
        genre: 'Другое',
        minYear: 1603,
        maxYear: 1603,
      },
      Фауст: {
        author: 'Иоганн Вольфганг Гёте',
        genre: 'Другое',
        minYear: 1587,
        maxYear: 1604,
      },
      'Потерянный рай': {
        author: 'Джон Мильтон',
        genre: 'Другое',
        minYear: 1667,
        maxYear: 1667,
      },
      'Путешествия Гулливера': {
        author: 'Джонатан Свифт',
        genre: 'Фантастика',
        minYear: 1726,
        maxYear: 1726,
      },
      Кандид: {
        author: 'Вольтер',
        genre: 'Другое',
        minYear: 1759,
        maxYear: 1759,
      },
      'Страдания юного Вертера': {
        author: 'Иоганн Гёте',
        genre: 'Роман',
        minYear: 1774,
        maxYear: 1774,
      },
      'Робинзон Крузо': {
        author: 'Даниель Дефо',
        genre: 'Роман',
        minYear: 1719,
        maxYear: 1719,
      },
      'Евгений Онегин': {
        author: 'А.С. Пушкин',
        genre: 'Роман',
        minYear: 1823,
        maxYear: 1831,
      },
      'Капитанская дочка': {
        author: 'А.С. Пушкин',
        genre: 'Роман',
        minYear: 1836,
        maxYear: 1836,
      },
      'Герой нашего времени': {
        author: 'М.Ю. Лермонтов',
        genre: 'Роман',
        minYear: 1840,
        maxYear: 1840,
      },
      'Мёртвые души': {
        author: 'Н.В. Гоголь',
        genre: 'Другое',
        minYear: 1842,
        maxYear: 1842,
      },
      'Война и мир': {
        author: 'Л.Н. Толстой',
        genre: 'Роман',
        minYear: 1869,
        maxYear: 1869,
      },
      'Гордость и предубеждение': {
        author: 'Джейн Остин',
        genre: 'Роман',
        minYear: 1813,
        maxYear: 1813,
      },
      Франкенштейн: {
        author: 'Мэри Шелли',
        genre: 'Фантастика',
        minYear: 1818,
        maxYear: 1818,
      },
      'Моби Дик': {
        author: 'Герман Мелвилл',
        genre: 'Другое',
        minYear: 1851,
        maxYear: 1851,
      },
      'Доктор Живаго': {
        author: 'Б.Л. Пастернак',
        genre: 'Роман',
        minYear: 1957,
        maxYear: 1957,
      },
      1984: {
        author: 'Джордж Оруэлл',
        genre: 'Другое',
        minYear: 1949,
        maxYear: 1949,
      },
      Улисс: {
        author: 'Джеймс Джойс',
        genre: 'Другое',
        minYear: 1922,
        maxYear: 1922,
      },
      'Старик и море': {
        author: 'Эрнест Хемингуэй',
        genre: 'Другое',
        minYear: 1952,
        maxYear: 1952,
      },
      Исчезнувшая: {
        author: 'Гиллиан Флинн',
        genre: 'Другое',
        minYear: 2012,
        maxYear: 2012,
      },
      Щегол: {
        author: 'Донна Тартт',
        genre: 'Другое',
        minYear: 2013,
        maxYear: 2013,
      },
      'Три тела': {
        author: 'Лю Цысинь',
        genre: 'Фантастика',
        minYear: 2008,
        maxYear: 2008,
      },
      'Диалог о двух главнейших системах мира': {
        author: 'Галилео Галилей',
        genre: 'Другое',
        minYear: 1632,
        maxYear: 1632,
      },
      'Математические начала натуральной философии': {
        author: 'Исаак Ньютон',
        genre: 'Другое',
        minYear: 1687,
        maxYear: 1687,
      },
      'Анатомическое исследование о движении сердца и крови у животных': {
        author: 'Уильям Гарвей',
        genre: 'Другое',
        minYear: 1687,
        maxYear: 1687,
      },
      'Система природы': {
        author: 'Карл Линней',
        genre: 'Другое',
        minYear: 1735,
        maxYear: 1735,
      },
      'Элементарный учебник химии': {
        author: 'Антуан Лавуазье',
        genre: 'Другое',
        minYear: 1789,
        maxYear: 1789,
      },
      'Введение в анализ бесконечно малых': {
        author: 'Леонард Эйлер',
        genre: 'Другое',
        minYear: 1748,
        maxYear: 1748,
      },
      'Происхождение видов': {
        author: 'Леонард Эйлер',
        genre: 'Другое',
        minYear: 1859,
        maxYear: 1859,
      },
      'Трактат об электричестве и магнетизме': {
        author: 'Джеймс Клерк Максвелл',
        genre: 'Другое',
        minYear: 1859,
        maxYear: 1859,
      },
      'Основы химии': {
        author: 'Дмитрий Менделеев',
        genre: 'Другое',
        minYear: 1869,
        maxYear: 1869,
      },
      'К электродинамике движущихся тел': {
        author: 'Альберт Эйнштейн',
        genre: 'Другое',
        minYear: 1905,
        maxYear: 1905,
      },
      'О строении атомов': {
        author: 'Нильс Бор',
        genre: 'Другое',
        minYear: 1913,
        maxYear: 1913,
      },
      'Молекулярная структура нуклеиновых кислот': {
        author: 'Уотсон и Крик',
        genre: 'Другое',
        minYear: 1953,
        maxYear: 1953,
      },
      'Краткая история времени': {
        author: 'Стивен Хокинг',
        genre: 'Другое',
        minYear: 1996,
        maxYear: 1996,
      },
      'Краткая история времени': {
        author: 'Стивен Хокинг',
        genre: 'Другое',
        minYear: 1998,
        maxYear: 1998,
      },
      'Работы по CRISPR-Cas9': {
        author: 'Дженнифер Дудна',
        genre: 'Другое',
        minYear: 2010,
        maxYear: 2010,
      },
      'Убийство Роджера Экройда': {
        author: 'Агата Кристи',
        genre: 'Детектив',
        minYear: 1926,
        maxYear: 1926,
      },
      'Десять негритят': {
        author: 'Агата Кристи',
        genre: 'Детектив',
        minYear: 1939,
        maxYear: 1939,
      },
      'Убийство в Восточном экспрессе': {
        author: 'Агата Кристи',
        genre: 'Детектив',
        minYear: 1934,
        maxYear: 1934,
      },
      'Прощай, любимая': {
        author: 'Рэймонд Чандлер',
        genre: 'Детектив',
        minYear: 1940,
        maxYear: 1940,
      },
      'Высокое окно': {
        author: 'Рэймонд Чандлер',
        genre: 'Детектив',
        minYear: 1942,
        maxYear: 1942,
      },
      'Чей труп': {
        author: 'Дороти Сэйерс',
        genre: 'Детектив',
        minYear: 1923,
        maxYear: 1923,
      },
      'Мегрэ и старая дама': {
        author: 'Жорж Сименон',
        genre: 'Детектив',
        minYear: 1950,
        maxYear: 1950,
      },
      'Девушка с татуировкой дракона': {
        author: 'Стиг Ларссон',
        genre: 'Детектив',
        minYear: 2005,
        maxYear: 2005,
      },
      'Имя розы': {
        author: 'Умберто Эко',
        genre: 'Детектив',
        minYear: 1980,
        maxYear: 1980,
      },
      Исчезнувшая: {
        author: 'Джиллиан Флинн',
        genre: 'Детектив',
        minYear: 2012,
        maxYear: 2012,
      },
      Снеговик: {
        author: 'Ю Несбё',
        genre: 'Детектив',
        minYear: 2007,
        maxYear: 2007,
      },
      'Ребёнок 44': {
        author: 'Том Роб Смит',
        genre: 'Детектив',
        minYear: 2008,
        maxYear: 2008,
      },
      'Преступления прошлого': {
        author: 'Кейт Аткинсон',
        genre: 'Детектив',
        minYear: 2019,
        maxYear: 2019,
      },
      Азазель: {
        author: 'Борис Акунин',
        genre: 'Детектив',
        minYear: 1998,
        maxYear: 1998,
      },
      'Стечение обстоятельств': {
        author: 'Александра Маринина',
        genre: 'Детектив',
        minYear: 1993,
        maxYear: 1993,
      },
      'Крутые наследнички': {
        author: 'Дарья Донцова',
        genre: 'Детектив',
        minYear: 1993,
        maxYear: 1993,
      },
    };
    // Проверка автора
    if (bookData[book.title] && bookData[book.title].author !== book.author) {
      // eslint-disable-next-line no-alert
      alert('Неверно введено имя автора!');
      return false;
    }
  
    // Проверка жанра
    if (bookData[book.title] && bookData[book.title].genre !== book.genre) {
      alert('Неверный жанр!');
      return false;
    }
  
    // Проверка года издания
    const currentYear = new Date().getFullYear();
    if (book.year < 1000 || book.year > currentYear) {
      alert('Неверно выбран год! Допустимый диапазон: 1000-' + currentYear);
      return false;
    }
  
    // Дополнительная проверка года для конкретных книг
    if (bookData[book.title]) {
      const bookInfo = bookData[book.title];
      if (book.year < bookInfo.minYear || book.year > bookInfo.maxYear) {
        alert(`Для книги "${book.title}" неверно введён год!`);
        return false;
      }
    }
  
    return true;
  }

  function saveToLocalStorage() {
    localStorage.setItem('books', JSON.stringify(books));
  }

  function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(searchTerm)
            || book.author.toLowerCase().includes(searchTerm)
            || book.genre.toLowerCase().includes(searchTerm));
    // eslint-disable-next-line no-use-before-define
    renderBooks(filteredBooks);
  }

  function switchView(e) {
    viewButtons.forEach((btn) => btn.classList.remove('active'));
    e.target.classList.add('active');

    const tableView = document.querySelector('.table-view');
    const cardsView = document.querySelector('.cards-view');

    if (e.target.dataset.view === 'table') {
      tableView.style.display = 'block';
      cardsView.style.display = 'none';
    } else {
      tableView.style.display = 'none';
      cardsView.style.display = 'grid';
    }
  }

  function createTableRow(book) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.genre}</td>
            <td>${book.year}</td>
            <td>
                <button class="btn-icon edit" onclick="editBook(${book.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon delete" onclick="deleteBook(${book.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
    return tr;
  }

  function createBookCard(book) {
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
                <button class="btn-icon edit" onclick="editBook(${book.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon delete" onclick="deleteBook(${book.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    return card;
  }

  function renderBooks(booksToRender = books) {
    booksTableBody.innerHTML = '';
    booksCardsContainer.innerHTML = '';

    booksToRender.forEach((book) => {
      booksTableBody.appendChild(createTableRow(book));
      booksCardsContainer.appendChild(createBookCard(book));
    });
  }

  // eslint-disable-next-line func-names
  window.deleteBook = function (id) {
    // eslint-disable-next-line no-restricted-globals, no-alert
    books = books.filter((book) => book.id !== id);
    saveToLocalStorage();
    renderBooks();
  };

  // eslint-disable-next-line func-names
  window.editBook = function (id) {
    // eslint-disable-next-line no-shadow
    const book = books.find((book) => book.id === id);
    if (book) {
      document.getElementById('title').value = book.title;
      document.getElementById('author').value = book.author;
      document.getElementById('genre').value = book.genre;
      document.getElementById('year').value = book.year;

      // eslint-disable-next-line no-shadow
      books = books.filter((book) => book.id !== id);
      saveToLocalStorage();
      renderBooks();
    }
  };

  init();
});
