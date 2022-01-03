const blogTitleField = document.querySelector('.title');
const articleField = document.querySelector('.article');

// banner
const bannerImage = document.querySelector('#banner-upload');
const banner = document.querySelector(".banner");
let bannerPath;

const publishBtn = document.querySelector('.publish-btn');
const uploadInput = document.querySelector('#image-upload');
const uploadMultInput = document.querySelector('#mult-image-upload');
const videoInput = document.querySelector('#video-upload');

bannerImage.addEventListener('change', () => {
    uploadImage(bannerImage, "banner");
})

uploadInput.addEventListener('change', () => {
    uploadImage(uploadInput, "image");
})

uploadMultInput.addEventListener('change', () => {
    uploadImage(uploadMultInput, "images");
})

videoInput.addEventListener('change', () => {
    uploadImage(videoInput, "video");
})

const uploadImage = (uploadFile, uploadType) => {
    const [file] = uploadFile.files;
    if(file && (file.type.includes("image") || file.type.includes("video"))){
        const formdata = new FormData();
        if (uploadType == "images") {
            let length = uploadFile.files.length;

            for (let x = 0; x < length; x++) {
                formdata.append("image", uploadFile.files[x]);
            }
        } else {
            formdata.append('image', file);
        }
        fetch('/upload', {
            method: 'post',
            body: formdata
        }).then(res => res.json())
        .then(data => {
            console.log(data, 'data')
            if(uploadType == "image"){
                addImage(data, file.name);
            } else if(uploadType == "images") {
                addImages(data.data);
            } else if(uploadType == "video") {
                addVideo(data, file.name);
            }else{
                bannerPath = `${location.origin}/${data}`;
                banner.style.backgroundImage = `url("${bannerPath}")`;
            }
        })
    } else{
        alert("upload Image only");
    }
}

const addImage = (imagepath, alt) => {
    let curPos = articleField.selectionStart;
    let textToInsert = `\r![${alt}](${imagepath})\r`;
    articleField.value = articleField.value.slice(0, curPos) + textToInsert + articleField.value.slice(curPos);
}

const addImages = (imagepaths) => {
    let curPos = articleField.selectionStart;
    let textToInsert = "\r!";
    imagepaths.forEach((imagepath) => {
        textToInsert += `![${imagepath.name}](${imagepath.name})`;
    });
    textToInsert += `\r`;
    articleField.value = articleField.value.slice(0, curPos) + textToInsert + articleField.value.slice(curPos);
}

const addVideo = (videopath, alt) => {
    let curPos = articleField.selectionStart;
    let textToInsert = `\r!(${alt})(${videopath})\r`;
    articleField.value = articleField.value.slice(0, curPos) + textToInsert + articleField.value.slice(curPos);
}

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

publishBtn.addEventListener('click', () => {
    if(articleField.value.length && blogTitleField.value.length){
        // generating id
        let letters = 'abcdefghijklmnopqrstuvwxyz';
        let blogTitle = blogTitleField.value.split(" ").join("-");
        let id = '';
        for(let i = 0; i < 4; i++){
            id += letters[Math.floor(Math.random() * letters.length)];
        }

        // setting up docName
        let docName = `${blogTitle}-${id}`;
        let date = new Date(); // for published at info

        //access firstore with db variable;
        db.collection("blogs").doc(docName).set({
            title: blogTitleField.value,
            article: articleField.value,
            bannerImage: bannerPath,
            publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
        })
        .then(() => {
            location.href = `/${docName}`;
        })
        .catch((err) => {
            console.error(err);
        })
    }
})