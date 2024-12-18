require("dotenv").config({ path: __dirname + "/.env" });
const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 4000;
const { twitterClient } = require("./twitterClient.js");
const CronJob = require("cron").CronJob;

// Define the NewsAPI URL
//const newsAPIURL = `https://newsapi.org/v2/everything?q=technology&from=2024-11-18&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}`;
//const newsAPIURL = `https://newsapi.org/v2/everything?q=technology OR tech OR software OR buisness&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}`;
const newsAPIURL = `https://newsapi.org/v2/everything?q=technology OR tech OR software OR business&language=en&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}`;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// Function to fetch the latest news and tweet about it
const tweet = async () => {
    try {
        // Fetch the latest news from NewsAPI
        const response = await axios.get(newsAPIURL);
        const articles = response.data.articles;

        if (articles && articles.length > 0) {
            // Get the first article's title and URL
            const article = articles[1];
            console.log('Article:', article);
            //console.log('Articles:', articles);
            const tweetContent = `${article.title}\nRead More - ${article.url}`;

            // Send the tweet using the Twitter API
            await twitterClient.v2.tweet(tweetContent);
            console.log('Tweeted:', tweetContent);
        } else {
            console.log('No articles found');
        }
    } catch (e) {
        console.error('Error fetching the news or tweeting:', e.message);
    }
};


const cronTweet = new CronJob("0 */2 * * *", async () => {
    tweet();
});

cronTweet.start();

// Optionally, you can also manually trigger a tweet if needed
//tweet();
