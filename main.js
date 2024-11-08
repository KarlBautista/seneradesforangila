const musicBody = document.getElementById("music-body");
const searchMusic = document.getElementById("searchMusic");
const albumPic = document.getElementById("albumPic");
const progressBar = document.getElementById("progress-bar");
const currentTimeDisplay = document.getElementById("current-time");
const totalDurationDisplay = document.getElementById("total-duration");
const prev = document.getElementById("prev");
const pause = document.getElementById("pause");
const next = document.getElementById("next");
const title = document.querySelector(".title");
const artistAlbum = document.querySelector(".artist-album");

const songsList = [
    { file: "Yellow-Coldplay.mp3", name: "Yellow", artist: "Coldplay", image: "yellow-bg.jpg" },
    { file: "save your tears.mp3", name: "Save Your Tears", artist: "The Weeknd", image: "save your tears-bg.png" },
    { file: "Dilaw.mp3", name: "Dilaw", artist: "Maki", image: "dilaww.jpg" },
    { file: "in bloom.mp3", name: "In Bloom", artist: "Neck Deep", image: "inbloom.jpg" },
    { file: "cancer.mp3", name: "Cancer", artist: "My Chemical Romance", image: "cancerr.jpg" },
    { file: "Starboy.mp3", name: "Starboy", artist: "The Weeknd", image: "starboy.png" },
    { file: "love story.mp3", name: "Love Story", artist: "Taylor Swift", image: "lovestory.jpg" },
    {file: "myboyonlybreakshisfavoritetoy.mp3", name: "My Boy Only Breaks His Favorite Toy", artist: Taylor Swift, image: "tpdept.png"},
];

let currentSong = null;
let currentPlayIcon = null;
let currentIndex = null;
let previousMusicBox = null;

function display(songsToDisplay) {
    musicBody.innerHTML = ""; // Clear previous songs
    
    songsToDisplay.forEach((song, index) => {
        const musicContainer = document.createElement("div");
        musicContainer.classList.add("music-container");

        const musicBox = document.createElement("div");
        musicBox.classList.add("music-box");

        const globalIndex = songsList.findIndex(s => s.name === song.name);
        musicBox.onclick = () => playSong(globalIndex);

        if (globalIndex === currentIndex) {
            musicBox.classList.add("gradient-background");
        }

        const img = document.createElement("img");
        img.setAttribute("data-src", song.image); // Use data-src for lazy loading
        img.alt = song.name;
        img.classList.add("lazy"); // Add a class to identify lazy-loaded images

        const name = document.createElement("h3");
        name.textContent = song.name;

        const artist = document.createElement("p");
        artist.textContent = song.artist;

        const playIcon = document.createElement("p");
        playIcon.classList.add("play-icon");
        playIcon.innerHTML = '<i class="fas fa-play"></i>';

        if (globalIndex === currentIndex) {
            playIcon.innerHTML = currentSong && !currentSong.paused ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
            currentPlayIcon = playIcon;
        }

        const loader = document.createElement("div");
        loader.classList.add("loader");
        loader.style.display = globalIndex === currentIndex ? "block" : "none";

        musicBox.appendChild(img);
        musicBox.appendChild(name);
        musicBox.appendChild(artist);
        musicBox.appendChild(loader);
        musicBox.appendChild(playIcon);
        musicContainer.appendChild(musicBox);
      
        musicBody.appendChild(musicContainer);
    });

    // Lazy load images
    lazyLoadImages();
}

function lazyLoadImages() {
    const lazyImages = document.querySelectorAll('img.lazy');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src'); // Set src from data-src
                img.classList.remove("lazy");
                observer.unobserve(img); // Stop observing once loaded
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

display(songsList); // Initial display of all songs


function playSong(index) {
    const { file, name, artist, image } = songsList[index];

    if (currentSong) {
        if (currentSong.src === new URL(file, window.location.href).href) {
            // Toggle play/pause if the same song is clicked
            if (currentSong.paused) {
                currentSong.play();
                currentPlayIcon.innerHTML = '<i class="fas fa-pause"></i>';
                pause.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                currentSong.pause();
                currentPlayIcon.innerHTML = '<i class="fas fa-play"></i>';
                pause.innerHTML = '<i class="fas fa-play"></i>';
            }
            return;
        } else {
            currentSong.pause();
            currentPlayIcon.innerHTML = '<i class="fas fa-play"></i>';
        }
    }

    currentIndex = index;

    // Lazy load the audio file by creating a new Audio instance only when needed
    currentSong = new Audio(file);
    currentPlayIcon = document.querySelectorAll(".play-icon")[index];
    currentPlayIcon.innerHTML = '<i class="fas fa-pause"></i>';
    pause.innerHTML = '<i class="fas fa-pause"></i>';

    // Play the audio file
    currentSong.play();

    // Update album image, title, and artist
    albumPic.src = image;
    title.textContent = name;
    artistAlbum.textContent = artist;

    display(songsList); // Re-display to apply the correct styles

    setUpAudio();
    controlBtn();
}


function setUpAudio() {
    currentSong.addEventListener("loadedmetadata", () => {
        totalDurationDisplay.textContent = formatTime(currentSong.duration);
        progressBar.max = Math.floor(currentSong.duration);
    });

    currentSong.addEventListener("timeupdate", () => {
        currentTimeDisplay.textContent = formatTime(currentSong.currentTime);
        progressBar.value = Math.floor(currentSong.currentTime);
    });

    progressBar.addEventListener("input", () => {
        currentSong.currentTime = progressBar.value;
    });
}

function controlBtn() {
    pause.onclick = () => {
        if (currentSong.paused) {
            currentSong.play();
            currentPlayIcon.innerHTML = '<i class="fas fa-pause"></i>';
            pause.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            currentSong.pause();
            currentPlayIcon.innerHTML = '<i class="fas fa-play"></i>';
            pause.innerHTML = '<i class="fas fa-play"></i>';
        }
    };

    prev.onclick = () => playSong(currentIndex - 1 < 0 ? songsList.length - 1 : currentIndex - 1);
    next.onclick = () => playSong((currentIndex + 1) % songsList.length);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

searchMusic.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const filteredSongs = songsList.filter(song =>
        song.name.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query)
    );

    display(filteredSongs);
});

const burgerMenu = document.getElementById("burger");
burgerMenu.className = 'burger-menu';
burgerMenu.innerHTML = '💛'; // Unicode for burger icon


burgerMenu.addEventListener('click', () => {
    const isClose = true;
    if(isClose == true){
        document.querySelector('.sidebar').classList.toggle('show');
    }
    else{
        document.querySelector('.sidebar').classList.toggle('show');
    }
    
   
});

const searchIcon = document.querySelector('.search-icon');
const searchContainer = document.querySelector('.header-right');

searchIcon.addEventListener('click', () => {
    searchContainer.classList.toggle('active');
});


