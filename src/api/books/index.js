// *********************************************** BOOKS RELATED ENDPOINTS ******************************************

/* ************************************************* BOOKS CRUD ENDPOINTS *******************************************

1. CREATE --> POST http://localhost:3001/books/ (+ body)
2. READ --> GET http://localhost:3001/books/ (+ optional query search params)
3. READ (single book) --> GET http://localhost:3001/books/:bookId
4. UPDATE (single book) --> PUT http://localhost:3001/books/:bookId (+ body)
5. DELETE (single book) --> DELETE http://localhost:3001/books/:bookId

*/

import Express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import uniqid from "uniqid"
import createHttpError from "http-errors"

const booksRouter = Express.Router()

const booksJSONPath = join(dirname(fileURLToPath(import.meta.url)), "books.json")
const getBooks = () => JSON.parse(fs.readFileSync(booksJSONPath))
const writeBooks = booksArray => fs.writeFileSync(booksJSONPath, JSON.stringify(booksArray))

const aStupidMiddleware = (req, res, next) => {
  console.log("I am a stupid middleware!")
  next()
}

booksRouter.post("/", aStupidMiddleware, (req, res, next) => {
  const newBook = { ...req.body, id: uniqid(), createdAt: new Date(), updatedAt: new Date() }

  const booksArray = getBooks()
  booksArray.push(newBook)
  writeBooks(booksArray)

  res.status(201).send({ id: newBook.id })
})

booksRouter.get("/", aStupidMiddleware, (req, res, next) => {
  // throw new Error("KABOOOOOOOOOOOOOOOOOOM!")
  const books = getBooks()
  if (req.query && req.query.category) {
    const filteredBooks = books.filter(book => book.category === req.query.category)
    res.send(filteredBooks)
  } else {
    res.send(books)
  }
})

booksRouter.get("/:bookId", (req, res, next) => {
  try {
    const booksArray = getBooks()

    const foundBook = booksArray.find(book => book.id === req.params.bookId)
    if (foundBook) {
      res.send(foundBook)
    } else {
      // the book has not been found, I'd like to trigger a 404 error
      next(createHttpError(404, `Book with id ${req.params.bookId} not found!`)) // this jumps to the error handlers
    }
  } catch (error) {
    next(error) // This error does not have a status code, it should trigger a 500
  }
})

booksRouter.put("/:bookId", (req, res, next) => {
  try {
    const booksArray = getBooks()

    const index = booksArray.findIndex(book => book.id === req.params.bookId)
    if (index !== -1) {
      const oldBook = booksArray[index]

      const updatedBook = { ...oldBook, ...req.body, updatedAt: new Date() }

      booksArray[index] = updatedBook

      writeBooks(booksArray)

      res.send(updatedBook)
    } else {
      next(createHttpError(404, `Book with id ${req.params.bookId} not found!`)) //
    }
  } catch (error) {
    next(error)
  }
})

booksRouter.delete("/:bookId", (req, res, next) => {
  try {
    const booksArray = getBooks()

    const remainingBooks = booksArray.filter(book => book.id !== req.params.bookId)

    if (booksArray.length !== remainingBooks.length) {
      writeBooks(remainingBooks)

      res.status(204).send()
    } else {
      next(createHttpError(404, `Book with id ${req.params.bookId} not found!`)) //
    }
  } catch (error) {
    next(error)
  }
})

export default booksRouter
