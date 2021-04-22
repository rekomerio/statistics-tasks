import express from 'express'
import cors from 'cors'

import {pages} from './pages.js'

const app = express();
const port = 9080;

app.use(express.static('dist'));

app.get('/api/solr/:page', cors(), async (req, res) => {
    const page = parseInt(req.params.page, 10);
    if (page < 0) {
        return res.status(500).send();
    } else if (page > 2) {
        return res.status(404).send({})
    } else
        await new Promise(resolve => setInterval(() => {
                resolve();
        }, page * 4000));

        return res.status(200).send(pages[page]);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
