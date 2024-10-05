console.log("scripts added")

function getTimeString(time){
    const hour = parseInt(time / 3600)
    let remainingSecond = time % 3600;
    const mint = parseInt(remainingSecond/ 60)
    remainingSecond = remainingSecond %60
    return `${hour} hours ${mint} minuites ${remainingSecond} seconds ago`;
}
const removeActiveClass = () =>{
    const buttons = document.getElementsByClassName("category-btn")
    console.log(buttons)
    for(let btn of buttons){
        btn.classList.remove("active")
    }

}
// 1- fetch, load and show categories on html

// create loadCategories
const loadcategories = () => {
    // fetch data
    fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
        .then((res) => res.json())
        .then((data) => displayCategories(data.categories))
        .catch(error => console.log(error));
}

const loadvideos = (searchText= "") => {
    // fetch data
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
        .then((res) => res.json())
        .then((data) => displayVideos(data.videos))
        .catch(error => console.log(error));
}

const loadCategoryVideos = (id) => {
    // alert(id);
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
        .then((res) => res.json())
        .then((data) => {
// shobaike activeclass rmv korao
            removeActiveClass();
            const activeBtn= document.getElementById(`btn-${id}`)
            activeBtn.classList.add("active")
            displayVideos(data.category)
        })
        .catch(error => console.log(error));
}

const loadDetails = async (video_id) => {
    console.log(video_id)
    const url = `https://openapi.programming-hero.com/api/phero-tube/video/${video_id}`
    const res = await fetch(url)
    const data = await res.json();
    displayDetails(data.video)
}
const displayDetails = (video) => {
    console.log(video)
    const detailsContainer = document.getElementById("modal-content")
    document.getElementById("customModal").showModal();

    detailsContainer.innerHTML=`
    <img
        src=${video.thumbnail}
        class="h-full w-full object-cover"/>
    <P>${video.description}</P>
    `
}

// const cardDemo = {
//     "category_id": "1003",
//     "video_id": "aaaj",
//     "thumbnail": "https://i.ibb.co/xgWL3vQ/kid-gorgeous.jpg",
//     "title": "Kid Gorgeous",
//     "authors": [
//         {
//             "profile_picture": "https://i.ibb.co/xsfkwN2/john.jpg",
//             "profile_name": "John Mulaney",
//             "verified": true
//         }
//     ],
//     "others": {
//         "views": "241K",
//         "posted_date": ""
//     },
//     "description": "John Mulaney's 'Kid Gorgeous' has captured the hearts of many with 241K views. As a verified comedian, John delivers a masterclass in stand-up with clever anecdotes, quick wit, and relatable humor. This performance is a laugh-filled adventure through his unique take on life, politics, and pop culture."
// }


const displayVideos = (videos) => {
    const videoContainer = document.getElementById("videos");
    videoContainer.innerHTML="";

    if(videos.length == 0){
        videoContainer.classList.remove("grid")
        videoContainer.innerHTML =`
        <div class= "min-h-[300px] flex flex-col gap-5 justify-center items-center">
            <img src="assets/icon.png" />
            <h2 class="text-center text-xl font-bold">NO Content Here in this Category</h2>
        </div>
        `
    }
    else{
        videoContainer.classList.add("grid")
    }
    videos.forEach(video => {
        console.log(video);
        const card = document.createElement("div");
        card.classList = "card card-compact"
        card.innerHTML = `
        <figure class="h-[200px] relative">
            <img
                src=${video.thumbnail}
                class="h-full w-full object-cover"
                alt="Shoes" />
                ${video.others.posted_date?.length == 0 
            ? "" : `<span class="absolute text-xs right-2 bottom-2 bg-black text-white rounded p-1">${getTimeString(video.others.posted_date)}</span>`

                }

                
                </figure >
    <div class="px-0 py-2 flex gap-2">
        <div>
            <img class="w-10 h-10 rounded-full object-cover" src=${video.authors[0].profile_picture} />
        </div>
        <div>
            <h2 class= "font-bold" >${video.title}</h2>
            <div class="flex items-center gap-2">
                <p class= "text-gray-400">${video.authors[0].profile_name}</p>
                ${video.authors[0].verified === true ? `<img class="w-5" src="https://img.icons8.com/?size=48&id=98A4yZTt9abw&format=png" />` : ""}

                
            </div>
            <p> <button onclick="loadDetails('${video.video_id}')" class= "btn btn-sm btn-error">details</button></p>
        </div>
    </div>
        `;
    videoContainer.append(card);
    })
}
// create DisplayCategories
const displayCategories = (categories) => {
    const categoryContainer = document.getElementById("categories")

    categories.forEach((item) => {
        console.log(item)
        //  category_id: '1001',
        //  category: 'Music'

        // create a button
        const buttonContainer = document.createElement("div")
        buttonContainer.innerHTML=`
        <button id="btn-${item.category_id}" onclick="loadCategoryVideos(${item.category_id})" class="btn category-btn">
        ${item.category}
        </button>`

        // add button to category container
        categoryContainer.append(buttonContainer);

    });
}

document.getElementById("search-input").addEventListener("keyup", (event)=>{
    loadvideos(event.target.value)
})
loadcategories()
loadvideos()