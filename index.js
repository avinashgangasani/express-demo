const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

var candidates = [
    { id: 1000, name: 'Avinash' },
    { id: 1001, name: 'Sindhuja' },
    { id: 1002, name: 'Anusha' }
]

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/api/courses', (req, res) => {
    res.send(req.query);
    //res.send([1, 2, 3, 4, 5]);
});

app.get('/api/candidates/:id', (req, res) => {
    const candidate = candidates.find(x => x.id === parseInt(req.params.id));
    if (candidate) {
        res.send(candidate);
    }
    else {
        res.sendStatus(404);
    }
});

app.get('/api/courses/:month/:year', (req, res) => {
    res.send(req.params);
});

app.post('/api/candidates/', (req, res) => {
    const candidate = { id: req.body.id, name: req.body.name };
    candidates.push(candidate);
    res.send(validateCandidate(candidate));
});

app.put('/api/candidates/', (req, res) => {
    const validationResult = validateCandidate({ id: req.body.id, name: req.body.name });
    const output = { result: candidates, status: validationResult };

    if (!validationResult.error) {
        const candidate = candidates.find(x => x.id === parseInt(req.body.id));
        if (candidate) {
            candidate.name = req.body.name;
            res.send(output);
        }
        else {
            res.sendStatus(404);
        }
    }
    else {
        res.send(output);
    }
})

function validateCandidate(candidate) {
    const schema = Joi.object({
        id: Joi.number().min(1000).required(),
        name: Joi.string().min(3).required()
    });

    const result = schema.validate(candidate);
    return result;
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
