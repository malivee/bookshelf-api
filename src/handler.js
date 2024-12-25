const { nanoid } = require('nanoid');
const books = require('./books');

const postBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  };


  const noBookName = name === undefined;
  const biggerReadPage = readPage > pageCount;

  if (noBookName) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);

    return response;
  }

  if (biggerReadPage) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);

    return response;
  }

  books.push(newBook);



  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id
    },
  });
  response.code(201);


  return response;

};

const getBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  const newBooksArray = books.map((book) => ({ id: book.id, name: book.name, publisher: book.publisher }));


  if (reading == 1) {
    const booksReaded = books.filter((book) => book.reading === true).map((book) => ({ id: book.id, name: book.name, publisher: book.publisher }));
    const response = h.response({
      status: 'success',
      data: {
        books: booksReaded
      }
    });
    response.code(200);
    return response;
  } else if (reading == 0) {
    const booksNotReaded = books.filter((book) => book.reading === false).map((book) => ({ id: book.id, name: book.name, publisher: book.publisher }));
    const response = h.response({
      status: 'success',
      data: {
        books: booksNotReaded
      }
    });
    response.code(200);
    return response;
  }

  if (finished == 1) {
    const booksFinished = books.filter((book) => book.finished === true).map((book) => ({ id: book.id, name: book.name, publisher: book.publisher }));
    const response = h.response({
      status: 'success',
      data: {
        books: booksFinished
      }
    });
    response.code(200);
    return response;

  } else if (finished == 0) {
    const booksNotFinished = books.filter((book) => book.finished === false).map((book) => ({ id: book.id, name: book.name, publisher: book.publisher }));
    const response = h.response({
      status: 'success',
      data: {
        books: booksNotFinished
      }
    });
    response.code(200);
    return response;

  }


  if (name != undefined) {
    const bookName = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase())).map((book) => ({ id: book.id, name: book.name, publisher: book.publisher }));
    const response = h.response({
      status: 'success',
      data: {
        books: bookName
      }
    });
    response.code(200);
    return response;
  }


  const response = h.response({
    status: 'success',
    data: {
      books: newBooksArray
    },
  });
  response.code(200);
  return response;
};


const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.find((book) => book.id === bookId);

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book: book
      }
    });
    response.code(200);
    return response;
  }


  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  });
  response.code(404);
  return response;

};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const updatedAt = new Date().toISOString();

  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    if (name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku'
      });
      response.code(400);
      return response;
    }

    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
      });
      response.code(400);
      return response;
    }


    books[bookIndex] = {
      ...books[bookIndex],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    });
    response.code(200);
    return response;
  };

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  });
  response.code(404);
  return response;
};


const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    });
    response.code(200);

    return response;
  };

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  });
  response.code(404);
  return response;
};

module.exports = { postBookHandler, getBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };