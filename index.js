require("dotenv").config({ path: __dirname + "/.env" });
const axios = require('axios');
const { twitterClient } = require("./twitterClient.js");

// Define the NewsAPI URL
const newsAPIURL = `https://newsapi.org/v2/everything?q=technology OR tech OR software OR business&language=en&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}`;

// Function to fetch the latest news and tweet about it
const tweet = async () => {
    try {
        // Fetch the latest news from NewsAPI
        const response = await axios.get(newsAPIURL);
        const articles = response.data.articles;

        if (articles && articles.length > 0) {
            // Get the first article's title and URL
            const article = articles[0];
            console.log('Article:', article);
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

// Trigger the tweet function
tweet();
