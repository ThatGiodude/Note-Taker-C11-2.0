const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');


const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({extended: false }));
app.use(express.json());
app.use(express.static('public'));
// GET route for the home
app.get("/", (req,res) => 
res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get("/notes", (req,res) =>
res.sendFile(path.join(__dirname, '/publice/notes.html'))
); //GET route for the notes page

app.post('/api/notes', (req,res) => {
    const dbJson = JSON.parse(fs.readFileSync("db/db.json", "utf8"));
    const newNotes = {
        title: req.body.title,
        text: req.body.text,
        id: uuidv4(),
    };
    console.log(`Post request recieved: ${newNotes}`);
    dbJson.push(newNotes);
    fs.writeFileSync("db/db.json", JSON.stringify(dbJson));
    res.json(dbJson);
});
    // route to delete notes and parse the data
app.delete('/api/notes/:id', (req,res) => {
    let data = fs.readFileSync("db/db.json", "utf8");
    const dataJSON = JSON.parse(data);
    const newNotes1 = dataJSON.filter((note) =>{
        return note.id !== req.params.id;
    });
    fs.writeFileSync("db/db.json", JSON.stringify(newNotes1));
    res.json("You have deleted the selected note");
});

app.get('*', (req,res) =>
res.sendFile(path.join(__dirname, '/public/index.html')
));

app.listen(PORT, () => 
console.log(`App listening at http://localhost:${PORT}`)
);