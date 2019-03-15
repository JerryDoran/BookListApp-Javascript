/*jshint esversion: 6 */

// BOOK CLASS: REPRESENTS A BOOK
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
// UI CLASS: HANDLE UI TASKS
class UI {
  static DisplayBooks() {
    // const storedBooks = [
    //   {
    //     title: 'Book One',
    //     author: 'John Doe',
    //     isbn: '3434434'
    //   },
    //   {
    //     title: 'Book Two',
    //     author: 'Jane Doe',
    //     isbn: '4554554'
    //   }
    // ];

    const books = Store.GetBooks();

    books.forEach((book) => UI.AddBookToList(book));

    // ---OR --- //

    // books.forEach(function(book) {
    //   UI.addBookToList(book);
    // });
  }

  static AddBookToList(book) {
    const list = document.querySelector('#book-list');
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a><td>`;

      list.appendChild(row);
  }

  static DeleteBook(el) {
    if(el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static ShowAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);

    // Vanish message in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 2000);
  }

  static ClearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }
}

// STORE CLASS: HANDLES LOCAL STORAGE
class Store {
  static GetBooks(){
    let books;
    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static AddBook(book) {
    const books = Store.GetBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static RemoveBook(isbn) {
    const books = Store.GetBooks();

    books.forEach((book, index) => {
      if(book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

// EVENT: DISPLAY BOOKS
document.addEventListener('DOMContentLoaded', UI.DisplayBooks());

// EVENT: ADD A BOOK
document.querySelector('#book-form').addEventListener('submit', (e) => {
  // Prevent actual submit of form
  e.preventDefault();
  // Get values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  // Validate
  if(title === '' || author === '' || isbn === '') {
    UI.ShowAlert('Please fill in all fields', 'danger');
  } else {
    // Instantiate book
    const book = new Book(title, author, isbn);

    // Add book to List
    UI.AddBookToList(book);

    // Add book to store
    Store.AddBook(book);

    // Show success message
    UI.ShowAlert('Book Added', 'success');

    // Clear fields
    UI.ClearFields();
  }
});

// OR
// document.querySelector('#book-form').addEventListener('submit', addNewBook);
//
// function addNewBook(e) {
//   // Prevent actual submit of form
//   e.preventDefault();
//   // Get values
//   const title = document.querySelector('#title').value;
//   const author = document.querySelector('#author').value;
//   const isbn = document.querySelector('#isbn').value;
//
//   // Instantiate book
//   const book = new Book(title, author, isbn);
//
//   console.log(book);
// }

// EVENT: REMOVE A BOOK
document.querySelector('#book-list').addEventListener('click', (e) => {
  // Remove book from UI
  UI.DeleteBook(e.target);

  // Remove book from Store
  Store.RemoveBook(e.target.parentElement.previousElementSibling.textContent);

  // Show success message
  UI.ShowAlert('Book Remove', 'success');
});
