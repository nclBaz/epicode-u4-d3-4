// const express = require("express") OLD IMPORT SYNTAX
import Express from "express" // NEW IMPORT SYNTAX (We can use it only if we add "type": "module", to package.json)
import listEndpoints from "express-list-endpoints"
import usersRouter from "./api/users/index.js"

const server = Express()
const port = 3001

server.use(Express.json()) // If you don't add this line BEFORE the endpoints all request bodies will be UNDEFINED!!!!!!!!!!!!!!!

// ************************** ENDPOINTS ***********************
server.use("/users", usersRouter)

server.listen(port, () => {
  console.table(listEndpoints(server))
  console.log(`Server is running on port ${port}`)
})
