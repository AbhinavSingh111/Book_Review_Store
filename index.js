import bodyParser from "body-parser";
import express from "express";
import pg from "pg";

const app = express();
const port = 4000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "books",
  password: "1234",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function get_reviews(criteria) {
  const reviews = await db.query(
    `SELECT * FROM reviews order by ${criteria} desc`
  );
  const result = [];
  reviews.rows.forEach((review) => {
    let isbn = review.isbn.toString().split("-").join("");
    let img_url = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
    review.img_url = img_url;
    result.push(review);
  });

  return result;
}

async function fetchIsbnWise(isbn) {
  const detail = await db.query(
    "select isbn,title,date,notes,rating from reviews where isbn =($1)",
    [isbn]
  );
  let img_url = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
  const data = detail.rows[0];
  data.imageUrl = img_url;
  return data;
}

async function editIsbnWise(isbn, title, date, rating, notes) {
  await db.query(
    "update reviews set title = ($1), date=($2), notes=($3), rating=($4) where isbn =($5)",
    [title, date, notes, rating, isbn]
  );
}

async function create_review(isbn, title, date, about, notes, rating) {
  await db.query(
    "INSERT INTO reviews (isbn, title, date, about, notes, rating) VALUES ($1, $2, $3, $4, $5, $6)",
    [isbn, title, date, about, notes, rating]
  );
}

async function fetchTitleWise(title) {
  const words = title.split(" ");
  const conditions = words
    .map((word) => `LOWER(title) LIKE '%${word}%'`)
    .join(" AND ");
  const query = `select isbn,title,date,notes,rating FROM reviews WHERE ${conditions} LIMIT 1;`;
  const detail = await db.query(query);
  if (detail.rows.length > 0) {
    const data = detail.rows[0];
    let img_url = `https://covers.openlibrary.org/b/isbn/${data.isbn}-L.jpg`;
    data.imageUrl = img_url;
    return data;
  } else {
    return null;
  }
}

function isAllDigits(inputString) {
  return /^\d+$/.test(inputString);
}

app.get("/", async (req, res) => {
  const data = await get_reviews("title");
  res.render("index.ejs", { data: data });
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

app.post("/user-message", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;
  await db.query(
    "INSERT INTO user_messages (name, email, query) VALUES ($1, $2, $3)",
    [name, email, message]
  );
  res.redirect("/contact");
});

app.post("/search", async (req, res) => {
  const searchParam = req.body.searchBy;
  if (isAllDigits(searchParam) && searchParam.length === 13) {
    const data = await fetchIsbnWise(searchParam);
    res.render("partials/review.ejs", { data: data });
  } else {
    const data = await fetchTitleWise(searchParam);
    res.render("partials/review.ejs", { data: data });
  }
});

app.post("/orderby", async (req, res) => {
  const criteria = req.body.orderby;
  const data = await get_reviews(criteria);
  res.render("index.ejs", { data: data });
});

app.get("/add-review", (req, res) => {
  res.render("create_review.ejs");
});

app.post("/new-review/saved", async (req, res) => {
  let isbn = req.body.isbn;
  let title = req.body.title;
  let date = req.body.date;
  let about = req.body.about;
  let rating = req.body.rating;
  let notes = req.body.notes;
  await create_review(isbn, title, date, about, notes, rating);
  res.redirect("/");
});

app.get("/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  const data = await fetchIsbnWise(isbn);
  res.render("partials/review.ejs", { data: data });
});

app.get("/:isbn/edit", async (req, res) => {
  const isbn = req.params.isbn;
  const data = await fetchIsbnWise(isbn);
  res.render("partials/edit_reviews.ejs", { data: data });
});

app.post("/:isbn/saved", async (req, res) => {
  let isbn = req.params.isbn;
  let title = req.body.title;
  let date = req.body.date;
  let rating = req.body.rating;
  let notes = req.body.notes;
  await editIsbnWise(isbn, title, date, rating, notes);
  const data = await fetchIsbnWise(isbn);
  res.render("partials/review.ejs", { data: data });
});

app.get("/:isbn/delete", async (req, res) => {
  const isbn = req.params.isbn;
  await db.query("delete from reviews where isbn=($1)", [isbn]);
  res.redirect("/");
});

app.listen(port, (req, res) => {
  console.log(`server running on port ${port}`);
});
