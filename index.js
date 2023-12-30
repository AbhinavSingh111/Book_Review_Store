import bodyParser from 'body-parser';
import express from 'express';
import pg from 'pg';

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

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));






async function get_reviews() {
    const reviews = await db.query('SELECT * FROM reviews');
    const result = [];
    const image_urls = [];
    reviews.rows.forEach((review)=>{
        let isbn = review.isbn.toString().split('-').join('');
        let img_url = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
        // image_urls.push(img_url);
        review.img_url = img_url;
       

        
        result.push(review);
    })
    console.log(result);
    return result;
   
  }



app.get('/',async(req,res)=>{
    const data = await get_reviews();
    res.render('index.ejs',{data:data})
});

app.get('/about', (req,res)=>{
    res.render('about.ejs');
})

app.get('/contact',(req,res)=>{
    res.render('contact.ejs');
})



app.listen(port,(req,res)=>{console.log("server running on port 4000");});