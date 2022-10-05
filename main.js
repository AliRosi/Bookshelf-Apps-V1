const books = [];
const RENDER_EVENT = "render-book";


function addBook() {
  const inputBookTitle = document.getElementById("inputBookTitle").value;
  const inputBookAuthor = document.getElementById("inputBookAuthor").value;
  const inputBookYear = document.getElementById("inputBookYear").value;
  const inputBookIsComplete = document.getElementById("inputBookIsComplete").checked;
  
  const generateID = generateId();
  const bookObject = generateBookObject(generateID, inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete, false);
  books.push(bookObject);
  
  document.dispatchEvent(new Event(RENDER_EVENT));
  
  saveData();
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete){
  return {
    id,
    title,
    author,
    year,
    isComplete,
  }
}

function findBook(bookId) {
  for (bookItem of books) {
    if (bookItem.id == bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (index in books) {
    if (books[index].id == bookId) {
      return index;
    }
  }
  return -1;
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  
  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  
  saveData();
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;
  
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  
  saveData();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget === null) return;
  
  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  
  saveData();
}

function makeBook(bookObject) {
  const bookTitle = document.createElement('h3');
  bookTitle.classList.add('md:text-lg', 'inline-block', 'text-md');
  bookTitle.innerText = bookObject.title;
  
  const bookAuthor = document.createElement('p');
  bookAuthor.classList.add('md:text-sm', 'text-gray-700', 'italic', 'inline-block', 'text-xs');
  bookAuthor.innerText = bookObject.author;
  
  const bookYear = document.createElement('p');
  bookYear.classList.add('md:text-sm', 'text-gray-700', 'inline-block', 'text-xs');
  bookYear.innerText = bookObject.year;
  
  const articleItem = document.createElement('div');
  articleItem.classList.add('flex', 'flex-col', 'space-y-1')
  articleItem.append(bookTitle, bookAuthor, bookYear);
  
  const bookContainer = document.createElement('article');
  bookContainer.classList.add('book_item', 'rounded-t-md', 'p-4', 'border-b-2', 'border-black', 'shadow-lg', 'shadow-indigo-200/60', 'flex', 'items-center', 'justify-between', 'space-x-6');
  bookContainer.append(articleItem);
  bookContainer.setAttribute('id', `book-${bookObject.id}`);
  
  const action = document.createElement('div');
  action.classList.add('action', 'flex', 'flex-col', 'space-y-4');
  
  if (bookObject.isComplete) {
    const undoButton = document.createElement('button');
    undoButton.innerText = "Undo";
    undoButton.classList.add('yellow', 'text-xs', 'border-2', 'border-black', 'rounded-md', 'px-2', 'py-1', 'font-medium', 'shadow-lg', 'shadow-yellow-200/60', 'hover:-translate-y-1', 'hover:scale-10', 'transition', 'duration-300');
    undoButton.addEventListener('click', function () {
      undoBookFromCompleted(bookObject.id);
    });
    
    const removeButton = document.createElement('button');
    removeButton.innerHTML = "Hapus buku";
    removeButton.classList.add('red', 'text-xs', 'border-2', 'border-black', 'rounded-md', 'px-2', 'py-1', 'font-medium', 'shadow-lg', 'shadow-red-200/60', 'hover:-translate-y-1', 'hover:scale-10', 'transition', 'duration-300');
    removeButton.addEventListener('click', function () {
      if (confirm("Apakah Anda yakin ingin menghapus buku " + bookObject.title + "?") == true) {
        removeBookFromCompleted(bookObject.id);
      }
    });
    
    action.append(undoButton, removeButton);
    bookContainer.append(action);
    
  } else {
    const finishedButton = document.createElement('button');
    finishedButton.innerText = "Selesai dibaca";
    finishedButton.classList.add('green', 'text-xs', 'border-2', 'border-black', 'rounded-md', 'px-2', 'py-1', 'font-medium', 'shadow-lg', 'shadow-green-200/60', 'hover:-translate-y-1', 'hover:scale-10', 'transition', 'duration-300');
    finishedButton.addEventListener('click', function () {
      addBookToCompleted(bookObject.id);
    });
    
    const removeButton = document.createElement('button');
    removeButton.innerText = "Hapus buku";
    removeButton.classList.add('red', 'text-xs', 'border-2', 'border-black', 'rounded-md', 'px-2', 'py-1', 'font-medium', 'shadow-lg', 'shadow-red-200/60', 'hover:-translate-y-1', 'hover:scale-10', 'transition', 'duration-300');
    removeButton.addEventListener('click', function () {
      if (confirm("Apakah Anda yakin ingin menghapus buku " + bookObject.title + "?") == true) {
        removeBookFromCompleted(bookObject.id);
          }
        });
        
        action.append(finishedButton, removeButton);
        bookContainer.append(action);
      }
      
      return bookContainer;
    }
    
    document.addEventListener(RENDER_EVENT, function () {
      const incompleteBookList = document.getElementById("incompleteBookshelfList");
      incompleteBookList.innerHTML = "";
      
      const completeBookList = document.getElementById("completeBookshelfList");
      completeBookList.innerHTML = "";
      
      for (bookItem of books) {
        const bookElement = makeBook(bookItem);
        
        if (bookItem.isComplete == false) {
          incompleteBookList.append(bookElement);
        } else {
          completeBookList.append(bookElement);
        }
      }
    });
    
    const SAVED_EVENT = "saved-book";
    const STORAGE_KEY = "BOOKSHELF_APPS";
    
    function saveData() {
      if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
      }
    }
    
    function isStorageExist() {
      if (typeof (Storage) === "undefined") {
        alert("BrowserAnda tidak mendukung Local Web Storage");
        return false;
      }
      
      return true;
    }
    
    document.addEventListener(SAVED_EVENT, function () {
      console.log(localStorage.getItem(STORAGE_KEY));
    });
    
    function loadDataFromStorage() {
      const serializedData = localStorage.getItem(STORAGE_KEY);
      let data = JSON.parse(serializedData);
      
      if (data !== null) {
        for (let book of data) {
          books.push(book);
        }
      }
      
      document.dispatchEvent(new Event(RENDER_EVENT));
    }
    
    document.addEventListener("DOMContentLoaded", function () {
      if (isStorageExist()) {
        loadDataFromStorage();
      }
    });
    
    function isChecked() {
      document.getElementById("redStatus").innerText = "Selesai Dibaca";
    }
    
    function isUnchecked() {
      document.getElementById("redStatus").innerText = "Belum Selesai Dibaca";
    }
    
    function searchBook() {
      const bookTitle = document.getElementById("searchBookTitle").value;
      
      const searchBook = buku.filter(function (book) {
        const bookName = book.title.toLowerCase();
        
        return bookName.includes(bookTitle.toLowerCase());
      });
      
      return searchBook;
    }

    document.addEventListener("DOMContentLoaded", function () {
      const submitForm = document.getElementById("inputBook");
     
      submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        alert("Buku Berhasil Ditambahkan")
        addBook();
      })
    });

    