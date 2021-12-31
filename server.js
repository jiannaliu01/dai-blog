const express = require('express');
const path = require('path');
const fileupload = require('express-fileupload');
const { appendFileSync } = require('fs');
const e = require('express');

let initial_path = path.join(__dirname, "src");

const app = express();
app.use(fileupload());
app.use(express.static(initial_path));

app.get('/', (req, res) => {
    res.sendFile(path.join(initial_path, "home.html"));
})

app.get('/editor', (req, res) => {
    res.sendFile(path.join(initial_path, "editor.html"));
})

// upload link 
app.post('/upload', (req, res) => {
    let file = req.files.image;
    let date = new Date(); 
    // image name 
    let imagename = date.getDate() + date.getTime() + file.name; 
    // image upload path 
    let path = 'src/uploads/' + imagename; 

    // create upload 
    file.mv(path, (err, result) => {
        if(err) {
            throw err;
        } else {
            res.json(`uploads/${imagename}`)
        }
    })
})

app.listen("3000", () => {
    console.log('listening...');
})