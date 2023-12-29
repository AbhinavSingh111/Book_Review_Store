import express from 'express';

const app = express();
const port = 4000;
app.get('/',(req,res)=>{
    res.render('index.ejs')
});

app.listen(port,(req,res)=>{console.log("server running on port 4000");});