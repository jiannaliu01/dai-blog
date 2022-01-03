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
    if (file.length) {
        try {
            let data = []; 
    
            //loop all images
            file.forEach((image) => {
                // move image to uploads directory
                let imagename = date.getDate() + date.getTime() + image.name; 
                // image upload path 
                let path = 'src/uploads/' + imagename; 
                image.mv(path);
                // push image details
                data.push({
                    name: "uploads/" + imagename,
                });
            });
    
            //return response
            res.send({
                status: true,
                message: 'Images uploaded!',
                data: data
            });
        } catch (err) {
            res.status(500).send(err);
        }
    } else {
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
    }   
})

app.get("/:blog", (req, res) => {
    res.sendFile(path.join(initial_path, "blog.html"));
})

app.use((req, res) => {
    res.json("404");
})

app.listen("3000", () => {
    console.log('listening...');
})