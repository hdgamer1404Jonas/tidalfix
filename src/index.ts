import express from 'express';
import axios from 'axios';
import { config } from 'dotenv';
import NodeCache from 'node-cache';
config();

const app = express();
const PORT = 3069;
const cache = new NodeCache({ stdTTL: 3600 });

app.get('/track/:id', async (req, res) => {
    if (!req.params.id) {
        res.send(`
            <html>
                <head>
                    <meta property="og:title" content="Error 301 - Invalid Request">
                </head>
                <body>
                </body>
            </html>
        `);
        return;
    }

    const url = `https://openapi.tidal.com/tracks/${req.params.id}`;

    const value = cache.get(url);
    if (value) {
        res.send(value);
        return;
    }

    const response = await axios.get(url, {
        params: { countryCode: 'DE' },
        headers: {
            accept: 'application/vnd.tidal.v1+json',
            Authorization:`Bearer ${process.env.TIDAL_TOKEN}`,
            'Content-Type': 'application/vnd.tidal.v1+json'
        }
    }).then((response) => {
    const json = response.data.resource;
    const title = json.title;
    const artists = json.artists.map((artist: any) => artist.name).join(", ");
    const album = json.album.title;
    const cover = json.album.imageCover[0].url;
    const url = json.tidalUrl;

    cache.set(url, `
        <html>
            <head>
                <meta property="og:title" content="${title} - ${artists}">
                <meta property="og:description" content="${album}">
                <meta property="og:image" content="${cover}">
                <meta property="og:url" content="${url}">
            </head>
            <body>
                <img src="${cover}" />
            </body>
        </html>
    `);

    res.send(`
        <html>
            <head>
                <meta property="og:title" content="${title} - ${artists}">
                <meta property="og:description" content="${album}">
                <meta property="og:image" content="${cover}">
                <meta property="og:url" content="${url}">
            </head>
            <body>
                <img src="${cover}" />
            </body>
        </html>
    `);
    }).catch((error) => {
        res.send(`
            <html>
                <head>
                    <meta property="og:title" content="Error 404 - Not found">
                </head>
                <body>
                    Not found
                </body>
            </html>
        `);
        console.log(error);
        return;
    });
});

app.get('/album/:id', async (req, res) => {
    if (!req.params.id) {
        res.send(`
            <html>
                <head>
                    <meta property="og:title" content="Error 301 - Invalid Request">
                </head>
                <body>
                </body>
            </html>
        `);
        return;
    }

    // check the cache first
    const url = `https://openapi.tidal.com/albums/${req.params.id}`;
    const value = cache.get(url);
    if (value) {
        res.send(value);
        return;
    }

    const response = await axios.get(url, {
        params: { countryCode: 'DE' },
        headers: {
            accept: 'application/vnd.tidal.v1+json',
            Authorization:`Bearer ${process.env.TIDAL_TOKEN}`,
            'Content-Type': 'application/vnd.tidal.v1+json'
        }
    }).then((response) => {
        const json = response.data.resource;
        const title = json.title;
        const artists = json.artists.map((artist: any) => artist.name).join(", ");
        const cover = json.imageCover[0].url;
        const url = json.tidalUrl;
        
        cache.set(url, `
            <html>
                <head>
                    <meta property="og:title" content="${title} - ${artists}">
                    <meta property="og:image" content="${cover}">
                    <meta property="og:url" content="${url}">
                </head>
                <body>
                    <img src="${cover}" />
                </body>
            </html>
        `);

        res.send(`
            <html>
                <head>
                    <meta property="og:title" content="${title} - ${artists}">
                    <meta property="og:image" content="${cover}">
                    <meta property="og:url" content="${url}">
                </head>
                <body>
                    <img src="${cover}" />
                </body>
            </html>
        `);
    }).catch((error) => {
        res.send(`
            <html>
                <head>
                    <meta property="og:title" content="Error 404 - Not found">
                </head>
                <body>
                    Not found
                </body>
            </html>
        `);
        console.log(error);
        return;
    });
});

app.get('/artist/:id', async (req, res) => {
    if (!req.params.id) {
        res.send(`
            <html>
                <head>
                    <meta property="og:title" content="Error 301 - Invalid Request">
                </head>
                <body>
                </body>
            </html>
        `);
        return;
    }

    const url = `https://openapi.tidal.com/artists/${req.params.id}`;

    const value = cache.get(url);
    if (value) {
        res.send(value);
        return;
    }

    const response = await axios.get(url, {
        params: { countryCode: 'DE' },
        headers: {
            accept: 'application/vnd.tidal.v1+json',
            Authorization:`Bearer ${process.env.TIDAL_TOKEN}`,
            'Content-Type': 'application/vnd.tidal.v1+json'
        }
    }).then((response) => {
        const json = response.data.resource;
        const name = json.name;
        const cover = json.picture[0].url;
        const url = json.tidalUrl;

        res.send(`
            <html>
                <head>
                    <meta property="og:title" content="${name}">
                    <meta property="og:image" content="${cover}">
                    <meta property="og:url" content="${url}">
                </head>
                <body>
                    <img src="${cover}" />
                </body>
            </html>
        `);
    }).catch((error) => {
        res.send(`
            <html>
                <head>
                    <meta property="og:title" content="Error 404 - Not found">
                </head>
                <body>
                    Not found
                </body>
            </html>
        `);
        console.log(error);
        return;
    });
});

app.get('/video/:id', async (req, res) => {
    if (!req.params.id) {
        res.send(`
            <html>
                <head>
                    <meta property="og:title" content="Error 301 - Invalid Request">
                </head>
                <body>
                </body>
            </html>
        `);
        return;
    }

    const url = `https://openapi.tidal.com/videos/${req.params.id}`;

    const value = cache.get(url);
    if (value) {
        res.send(value);
        return;
    }

    const response = await axios.get(url, {
        params: { countryCode: 'DE' },
        headers: {
            accept: 'application/vnd.tidal.v1+json',
            Authorization:`Bearer ${process.env.TIDAL_TOKEN}`,
            'Content-Type': 'application/vnd.tidal.v1+json'
        }
    }).then((response) => {
        const json = response.data.resource;
        const title = json.title;
        const artists = json.artists.map((artist: any) => artist.name).join(", ");
        const cover = json.image[0].url;
        const url = json.tidalUrl;
        
        cache.set(url, `
            <html>
                <head>
                    <meta property="og:title" content="${title} - ${artists}">
                    <meta property="og:image" content="${cover}">
                    <meta property="og:url" content="${url}">
                </head>
                <body>
                    <img src="${cover}" />
                </body>
            </html>
        `);

        res.send(`
            <html>
                <head>
                    <meta property="og:title" content="${title} - ${artists}">
                    <meta property="og:image" content="${cover}">
                    <meta property="og:url" content="${url}">
                </head>
                <body>
                    <img src="${cover}" />
                </body>
            </html>
        `);
    }).catch((error) => {
        res.send(`
            <html>
                <head>
                    <meta property="og:title" content="Error 404 - Not found">
                </head>
                <body>
                    Not found
                </body>
            </html>
        `);
        console.log(error);
        return;
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
