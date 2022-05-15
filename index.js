require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const validUrl = require('valid-url')
const shortid = require('shortid')
const {Url} = require('./urls.js')
const baseUrl = 'http:localhost:3030'
const mongoose = require('mongoose');
mongoose.connect(process.env.DB).then(()=>{console.log('mongodb connected')}).catch(()=>{console.log(error);})
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
app.post('/api/shorturl', async (req,res)=>{
  let longUrl = req.body.url
  if(!validUrl.isUri(baseUrl)){
    res.json({error :'Invalid url'})
  }
  const urlCode = shortid.generate()

  if(validUrl.isUri(longUrl)){
    try{
      let url = await Url.findOne({
        longUrl
      })
      if(url){
        res.json(url)
      }else{
        const shortUrl = baseUrl + '/' + urlCode
        url = new Url({
          longUrl,
          shortUrl,
          urlCode,
          date: new Date()
        })
        await url.save()
        res.json({original_url: url.longUrl, shortUrl : url.urlCode})
      }
    }
  catch(error){
  console.log(error)
  res.status(500).json('Server Error')
}
  }else{
    res.status(401).json('Invalid longurl')
  }
})
app.get('/:code', async (req, res)=>{
  try{
    const url = await Url.findOne({
      urlCode: req.params.code
    })
    if(url){
      return res.redirect(url.longUrl)
    }else{
      return res.status(404).json('No url found')
    }
  }catch(err){
    console.log(err)
    res.status(500).json('Server Error')
  }
})
app.listen(process.env.PORT, function() {
  console.log(`Listening on port ${port}`);
});
