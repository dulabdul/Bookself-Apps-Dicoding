// Navbar
const menuToggle = document.querySelector(".menu-toggle input");
const nav = document.querySelector("nav ul");

menuToggle.addEventListener("click", function () {
	nav.classList.toggle("slide");
});

// End of navbar

const books = [];
const RENDER_BOOK = "render-book";
const SAVED_BOOKS = 'saved-books';
const STORAGE_KEY = 'BOOKS_APPS';
const titleBooks = document.querySelector("#inputBookTitle");
const authorBooks = document.querySelector("#inputAuthorTitle");
const yearBooks = document.querySelector("#inputYearTitle");

const isStorageExits = () => {
	if (typeof (Storage) === undefined) {
		alert('Browser Not Supported Local Storage');
		return false;
	}
	return true;
}
const uniqueId = () => {
	return +new Date();
};
const generateBookObject = (id, title, author, year, isCompleted) => {
	return {
		id,
		title,
		author,
		year,
		isCompleted,
	};
};

const findBook = (bookId) => {
	for (const bookItem of books) {
		if (bookItem.id === bookId) {
			return bookItem;
		}
	}

	return null;
};
const findBookIndex = (bookId) => {
	for (const index in books) {
		if (books[index].id === bookId) {
			return index;
		}
	}
	return -1;
};

const makeBooks = (booksObject) => {
	const {
		id,
		title,
		author,
		year,
		isCompleted
	} = booksObject;

	const textTitle = document.createElement("h3");
	textTitle.setAttribute("id", "title-books");
	textTitle.innerText = title;
	const textAuthor = document.createElement("h4");
	textAuthor.setAttribute("id", "author-books");
	textAuthor.innerText = author;
	const textYear = document.createElement("h4");
	textYear.setAttribute("id", "year-books");
	textYear.innerText = year;

	const container = document.createElement("div");
	container.append(textTitle, textAuthor, textYear);
	container.setAttribute("id", `books-${id}`);
	container.classList.add("container-books");

	if (isCompleted) {
		const undoButton = document.createElement("button");
		undoButton.innerHTML = '<i class="fa-solid fa-rotate-left"></i>';
		undoButton.classList.add("btn-icons", "undo");
		undoButton.addEventListener("click", () => {
			undoBooksFromCompleted(id);
			if (addBooksToCompleted !== false) {
				swal("Success move book to uncompleted reading ", {
					icon: "success",
				});
			} else {
				swal("Failed Move Book", {
					icon: "error",
				});
			}
		});

		const trashButton = document.createElement("button");
		trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
		trashButton.classList.add("btn-icons", "trash");
		trashButton.addEventListener("click", () => {
			swal({
					title: "Are you sure?",
					text: "Once deleted, you book totally removed!",
					icon: "warning",
					buttons: true,
					dangerMode: true,
				})
				.then((willDelete) => {
					if (willDelete) {
						swal("Poof! You book success deleted", {
							icon: "success",
						});
						removeBooksFromCompleted(id)
					} else {
						swal("Your book file is cancel deleted!");
					}
				});
		});
		container.append(undoButton, trashButton);
	} else {
		const checkButton = document.createElement("button");
		checkButton.innerHTML = '<i class="fa-solid fa-check"></i>';
		checkButton.classList.add("btn-icons", "completed");
		checkButton.addEventListener("click", () => {
			addBooksToCompleted(id);
			if (addBooksToCompleted !== false) {
				swal("Yeyy, your books has finish read!", {
					icon: "success",
				});
			} else {
				swal("Failed Move Book", {
					icon: "error",
				});
			}
		});
		const trashButton = document.createElement("button");
		trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
		trashButton.classList.add("btn-icons", "trash");
		trashButton.addEventListener("click", () => {
			swal({
					title: "Are you sure?",
					text: "Once deleted, you book totally removed!",
					icon: "warning",
					buttons: true,
					dangerMode: true,
				})
				.then((willDelete) => {
					if (willDelete) {
						swal("Poof! You book success deleted", {
							icon: "success",
						});
						removeBooksFromCompleted(id)
					} else {
						swal("Your book file is cancel deleted!");
					}
				});

		});
		container.append(checkButton, trashButton);
	}
	return container;
};

const addBooks = () => {
	const addTitleBooks = titleBooks.value;
	const addAuthorBooks = authorBooks.value;
	const addYearBooks = parseInt(yearBooks.value);
	const generateId = uniqueId();
	const booksObject = generateBookObject(
		generateId,
		addTitleBooks,
		addAuthorBooks,
		addYearBooks,
		false
	);
	books.push(booksObject);
	document.dispatchEvent(new Event(RENDER_BOOK));
	saveDataBooks();
};

const addBooksToCompleted = (bookId) => {
	const booksTarget = findBook(bookId);
	if (booksTarget == null) return;

	booksTarget.isCompleted = true;
	document.dispatchEvent(new Event(RENDER_BOOK));
	saveDataBooks();
};

const removeBooksFromCompleted = (bookId) => {
	const booksTarget = findBookIndex(bookId);

	if (booksTarget === -1) return;
	books.splice(booksTarget, 1);
	document.dispatchEvent(new Event(RENDER_BOOK));
	saveDataBooks();
};

const undoBooksFromCompleted = (bookId) => {
	const booksTarget = findBook(bookId);
	if (booksTarget == null) return;

	booksTarget.isCompleted = false;
	document.dispatchEvent(new Event(RENDER_BOOK));
	saveDataBooks();
};


const saveDataBooks = () => {
	if (isStorageExits()) {
		const parsedData = JSON.stringify(books);
		localStorage.setItem(STORAGE_KEY, parsedData);
		document.dispatchEvent(new Event(SAVED_BOOKS));
	}
}

const loadDataFromStorage = () => {
	const serializeData = localStorage.getItem(STORAGE_KEY);
	let data = JSON.parse(serializeData);

	if (data !== null) {
		for (const book of data) {
			books.push(book);
		}
	}
	document.dispatchEvent(new Event(RENDER_BOOK));
}
const searchBooks = () => {
	let search = document.querySelector('#searchBookInput').value;
	let returnSearch = document.getElementsByClassName('container-books');

	for (const bookItem of returnSearch) {
		let titleBook = bookItem.innerText.toUpperCase();
		let searchBook = titleBook.search(search.toUpperCase());
		if (searchBook != -1) {
			bookItem.style.display = '';

		} else {
			bookItem.style.display = 'none';
		}
	}
}
document.addEventListener("DOMContentLoaded", () => {
	const submitForm = document.querySelector("#inputBooks");
	const searchForm = document.querySelector('#BookSearch');
	submitForm.addEventListener("submit", (e) => {
		e.preventDefault();
		addBooks();
		swal("Success Add Book!", {
			icon: "success",
		})
	});
	searchForm.addEventListener('submit', (e) => {
		e.preventDefault();
		searchBooks();

	})
	if (isStorageExits()) {
		loadDataFromStorage();
	}
});
document.addEventListener(SAVED_BOOKS, () => {
	console.log(localStorage.getItem(STORAGE_KEY));
})
document.addEventListener(RENDER_BOOK, () => {
	const uncompletedBookList = document.querySelector(".uncompletedBookList");
	const listCompletedBooks = document.querySelector(".completedBookList");

	uncompletedBookList.innerHTML = "";
	listCompletedBooks.innerHTML = "";

	for (const bookItem of books) {
		const bookElement = makeBooks(bookItem);
		if (bookItem.isCompleted) {
			listCompletedBooks.append(bookElement);
		} else {
			uncompletedBookList.append(bookElement);
		}
	}
});