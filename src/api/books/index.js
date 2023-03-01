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

const booksRouter = Express.Router()

const booksJSONPath = join(dirname(fileURLToPath(import.meta.url)), "books.json")
const getBooks = () => JSON.parse(fs.readFileSync(booksJSONPath))
const writeBooks = booksArray => fs.writeFileSync(booksJSONPath, JSON.stringify(booksArray))

booksRouter.post("/", (req, res) => {
  const newBook = { ...req.body, id: uniqid(), createdAt: new Date(), updatedAt: new Date() }

  const booksArray = getBooks()
  booksArray.push(newBook)
  writeBooks(booksArray)

  res.status(201).send({ id: newBook.id })
})

booksRouter.get("/", (req, res) => {
  console.log("REQ.QUERY:", req.query)
  const books = getBooks()
  if (req.query && req.query.category) {
    const filteredBooks = books.filter(book => book.category === req.query.category)
    res.send(filteredBooks)
  } else {
    res.send(books)
  }
})

booksRouter.get("/:bookId", (req, res) => {
  const booksArray = getBooks()

  const foundBook = booksArray.find(book => book.id === req.params.bookId)
  res.send(foundBook)
})

booksRouter.put("/:bookId", (req, res) => {
  const booksArray = getBooks()

  const index = booksArray.findIndex(book => book.id === req.params.bookId)

  const oldBook = booksArray[index]

  const updatedBook = { ...oldBook, ...req.body, updatedAt: new Date() }

  booksArray[index] = updatedBook

  writeBooks(booksArray)

  res.send(updatedBook)
})

booksRouter.delete("/:bookId", (req, res) => {
  const booksArray = getBooks()

  const remainingBooks = booksArray.filter(book => book.id !== req.params.bookId)

  writeBooks(remainingBooks)

  res.status(204).send()
})

export default booksRouter
