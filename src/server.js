// const express = require("express") OLD IMPORT SYNTAX
import Express from "express" // NEW IMPORT SYNTAX (We can use it only if we add "type": "module", to package.json)
import listEndpoints from "express-list-endpoints"
import usersRouter from "./api/users/index.js"
import booksRouter from "./api/books/index.js"

const server = Express()
const port = 3001

// ************************** MIDDLEWARES *********************
const loggerMiddleware = (req, res, next) => {
  console.log(`Request method ${req.method} -- url ${req.url} -- ${new Date()}`)
  req.user = "Diego"
  next()
}

const policeOfficerMiddleware = (req, res, next) => {
  console.log("Hey I am the police officer!")
  if (req.user === "Diego") {
    next()
  } else {
    res.status(401).send({ message: "I am sorry only Diegos are allowed!" })
  }
}

server.use(loggerMiddleware)
server.use(policeOfficerMiddleware)
server.use(Express.json()) // If you don't add this line BEFORE the endpoints all request bodies will be UNDEFINED!!!!!!!!!!!!!!!

// ************************** ENDPOINTS ***********************
server.use("/users", usersRouter)
server.use("/books", loggerMiddleware, booksRouter)

server.listen(port, () => {
  console.table(listEndpoints(server))
  console.log(`Server is running on port ${port}`)
})
