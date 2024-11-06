const PORT = 5000;
const cheerio = require('cheerio');
const axios = require('axios');
const express = require('express');
const app = express();


const newspages = [
    {
        name: 'theguardian',
        address: 'https://www.theguardian.com/uk/technology',
        base: 'https://www.theguardian.com',
    },
    {
        name: 'thetimes',
        address: 'https://www.thetimes.com/business-money/technology',
        base: '',
    }
];

const articles = [];

newspages.forEach(newspage => {

    axios.get(newspage.address)
    .then(function(response) {
        const post = response.data
        const $ = cheerio.load(post)

        $('a:contains("technology")', post).each(function() {
            const title = $(this).text()
            const url = $(this).attr('href')
            articles.push({
                title,
                url: newspage.base + url,
                source: newspage.name
             })
        })
        res.send(articles)
    }).catch((err) => console.log(err))
})


app.get('/', function (req, res) {
    res.send('Welcome to Technology API');
    res.json(articles);
});

app.get('/news', (req, res) => {
    res.json(articles);
    console.log(articles);
});


app.get('/news/:newspageId', (req, res) => {

    const newspageId = req.params.newspageId;
    const newsPageAddress = newspages.filter(newspage => newspage.name === newspageId)[0].address;
    const newspageBase = newspages.filter(newspage => newspage.name == newspageId)[0].base;

    axios.get(newsPageAddress).then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const specificArticles = [];

        $('a:contains("technology")', html).each(function () {
            const title = $(this).text();
            const url = $(this).attr('href');
            specificArticles.push({
                title,
                url: newspageBase + url,
                source: newspageId,
            });
        });
        res.json(specificArticles);
    });
});

app.listen(PORT, () => console.log('Server running on port ' + PORT))