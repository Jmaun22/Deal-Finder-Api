const PORT = process.env.PORT || 8000

const express = require('express')

const axios = require('axios')
const cheerio = require('cheerio')

const app = express();
import myJson from './books.json';


const newspapers = [
    {
        name: 'tennis.com',
        address: 'https://www.tennis.com/',
        base: 'https://www.tennis.com'
    },
    {
        name: 'yahoo',
        address: 'https://sports.yahoo.com/tennis/',
        base: 'https://sports.yahoo.com/tennis/'
    },
    {
        name: 'eurosports',
        address: 'https://www.eurosport.com/tennis/',
        base: ''
    },
    {
        name: 'cnn',
        address: 'https://www.cnn.com/sport/tennis',
        base: ''
    },
    {
        name: 'new york times',
        address: 'https://www.nytimes.com/topic/subject/tennis',
        base: 'https://www.nytimes.com/topic/subject/tennis'
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/sport/tennis',
        base: ''
    },
    {
        name: 'espn',
        address: 'https://www.espn.com/tennis/',
        base: ''
    },



]

const articles = [];

newspapers.forEach(newspaper => {

    axios.get(newspaper.address)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html);

        $(`a:contains("deal")`, html).each(function () {
            const title = $(this).text()

            const url = $(this).attr('href');

            articles.push({
                title,
                url: newspaper.base + url,
                source: newspaper.name
            })

        })


        
    })
})

app.get('/', (req, res) =>{

    res.json('Welcome to my deal finder api');

})

app.get('/news', (req, res) => {


   res.json(articles);

})

app.get('/news/:newspaperId', async (req, res) => {

    console.log(req.params);
   const  newspaperId = req.params.newspaperId

   const newspaperAddress =  newspapers.filter(newspaper => newspaper.name === newspaperId)[0].address

   const newspaperBase = newspapers.filter(newspaper => newspaper.name === newspaperId)[0].base

   console.log(newspaperAddress)

    axios.get(newspaperAddress)
    .then(response => {
       const html =  response.data
       const $ = cheerio.load(html);
       const specficArticles = [];

       $(`a:contains("tennis")`, html).each(function () {

       const title =  $(this).text();
       const url = $(this).attr('href');
       specficArticles.push({
        title, 
        url: newspaperBase + url,
        source: newspaperId
       })
       })

       res.json(specficArticles)

    }).catch(err => console.log(err))
})
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))