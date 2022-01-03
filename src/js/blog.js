let blogId = decodeURI(location.pathname.split("/").pop());

let docRef = db.collection("blogs").doc(blogId);

docRef.get().then((doc) => {
    if(doc.exists){
        setupBlog(doc.data());
    } else{
        location.replace("/");
    }
})

const setupBlog = (data) => {
    const banner = document.querySelector('.banner');
    const blogTitle = document.querySelector('.title');
    const titleTag = document.querySelector('title');
    const publish = document.querySelector('.published');
    
    banner.style.backgroundImage = `url(${data.bannerImage})`;

    titleTag.innerHTML += blogTitle.innerHTML = data.title;
    publish.innerHTML += data.publishedAt;

    const article = document.querySelector('.article');
    addArticle(article, data.article);
}

const addArticle = (ele, data) => {
    data = data.split("\n").filter(item => item.length);
    // console.log(data);

    data.forEach(item => {
        // check for heading
        console.log(item, 'item')
        if(item[0] == '#'){
            let hCount = 0;
            let i = 0;
            while(item[i] == '#'){
                hCount++;
                i++;
            }
            let tag = `h${hCount}`;
            ele.innerHTML += `<${tag}>${item.slice(hCount, item.length)}</${tag}>`
        } 
        //checking for image format
        else if(item[0] == "!" && item[1] == "["){
            let separator;

            for(let i = 0; i <= item.length; i++){
                if(item[i] == "]" && item[i + 1] == "(" && item[item.length - 1] == ")"){
                    separator = i;
                }
            }

            let alt = item.slice(2, separator);
            let src = item.slice(separator + 2, item.length - 1);
            console.log(alt, src, "alt src in img")
            ele.innerHTML += `
            <img src="${src}" alt="${alt}" class="article-image">
            `;
        }
        //checking for multiple images
        else if(item[0] == "!" && item[1] == "!" && item[2] == "["){
            // generating id
            let letters = 'abcdefghijklmnopqrstuvwxyz';
            let id = '';
            for(let i = 0; i < 4; i++){
                id += letters[Math.floor(Math.random() * letters.length)];
            }

            let separator;
            let carousel = `<div id="carouselIndicators${id}" class="carousel slide" data-ride="carousel"> <ol class="carousel-indicators">`;
            let datatargets = [];
            let count = 0;
            let carouselimages = [];
            let split = item.split("!");
            console.log(split);
            for(let j = 0; j < split.length; j++){
                item = split[j];
                if (item.length) {
                for (let i = 0; i < item.length; i++) {
                    if(item[i] == "]" && item[i + 1] == "(" && item[item.length - 1] == ")"){
                        separator = i;
                        let alt = item.slice(1, separator);
                        let src = item.slice(separator + 2, item.length - 1);
                        if (count == 0) {
                            datatargets.push(`<li data-target="#carouselIndicators${id}" data-slide-to="${count}" class="active"></li>`);
                            carouselimages.push(`<div class="carousel-item active">
                            <img class="d-block w-100" src="${src}" alt="${alt}">
                                </div>`);
                        } else {
                            datatargets.push(`<li data-slide-to="${count}"></li>`);
                            carouselimages.push(`<div class="carousel-item">
                            <img class="d-block w-100" src="${src}" alt="${alt}">
                                </div>`);
                        }
                        count += 1;
                    }
                }
            }
            }

            for (let i = 0; i < datatargets.length; i++) {
                carousel += datatargets[i];
            }
            carousel += `</ol> <div class="carousel-inner">`;
            for (let i = 0; i < carouselimages.length; i++) {
                carousel += carouselimages[i];
            }
            carousel += `</div> 
            <a class="carousel-control-prev" href="#carouselIndicators${id}" role="button" data-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
            </a>
            <a class="carousel-control-next" href="#carouselIndicators${id}" role="button" data-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
            </a>
            </div>`;

            console.log(carousel, "carousel")
            ele.innerHTML += carousel;
        }

        //checking for video format
        else if(item[0] == "!" && item[1] == "("){
            console.log('in mult images')
            let separator;

            for(let i = 0; i <= item.length; i++){
                if(item[i] == ")" && item[i + 1] == "(" && item[item.length - 1] == ")"){
                    separator = i;
                }
            }

            let alt = item.slice(2, separator);
            let src = item.slice(separator + 2, item.length - 1);
            console.log(alt, src, "alt and src")
            ele.innerHTML += `
            <video autoplay controls class="article-image" >
                <source src="${src}" />
            </video>
            `;
        }

        else{
            ele.innerHTML += `<p>${item}</p>`;
        }
    })
}