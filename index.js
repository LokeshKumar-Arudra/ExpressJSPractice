const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const app = express()
app.use(express.json())

const dbPath = path.join(__dirname, 'goodreads.db')
let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}
initializeDBAndServer()

// Get Books API
app.get('/books/', async (request, response) => {
  const getBooksQuery = `
    SELECT
      *
    FROM
      book
    ORDER BY
      book_id;`
  const booksArray = await db.all(getBooksQuery)
  response.send(booksArray)
})

//Get Book API
app.get('/books/:bookId/', async (request, response) => {
  let bookId = request.params
  let query = `
  SELECT * 
  FROM book
  WHERE book_id = ${bookId}`
  let book = await db.get(query) // get returns a promise object
  response.send(book)
  console.log(book)
})

//Add Book

app.post('/books/', async (request, response) => {
  let bookDetails = request.body
  //console.log('Request Body', bookDetails)
  const {
    title,
    authorId,
    rating,
    ratingCount,
    reviewCount,
    description,
    pages,
    dateOfPublication,
    editionLanguage,
    price,
    onlineStores,
  } = bookDetails

  const postQuery = `
    INSERT INTO
      book (title,author_id,rating,rating_count,review_count,description,pages,date_of_publication,edition_language,price,online_stores)
    VALUES
      (
        '${title}',
         ${authorId},
         ${rating},
         ${ratingCount},
         ${reviewCount},
        '${description}',
         ${pages},
        '${dateOfPublication}',
        '${editionLanguage}',
         ${price},
        '${onlineStores}'
      );`
  let dbResponse = await db.run(postQuery)
  let primaryKey = dbResponse.lastID
  console.log({bookId: primaryKey})
  response.send({bookId: primaryKey})
})

// Update Book API
app.put('/books/:bookId/', (request, reponse) => {
  let {bookId} = request.params
  let bookDetails = request.body

})
