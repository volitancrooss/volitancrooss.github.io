const songs = [
    {
        title: "Canción 1",
        file: "/project/music/ytmp3free.cc_lil-baby-gunna-business-is-business-official-audio-youtubemp3free.org.mp3"
    },
    {
        title: "Canción 2",
        file: "/project/music/ytmp3free.cc_post-malone-wow-official-music-video-youtubemp3free.org.mp3"
    },
    {
        title: "Canción 3",
        file: "/project/music/ytmp3free.cc_shoreline-mafia-back-in-bidness-official-music-video-youtubemp3free.org.mp3"
    }
]

let currentSongIndex = 0;
let isPlaying = false;
const audioPlayer = document.getElementById('audioPlayer');
const musicBtn = document.querySelector('.music-btn');
const musicBtnLayer = document.querySelector('.music-btn-layer');

function toggleMusic() {
    if (!isPlaying) {
        playSong();
    } else {
        nextSong();
    }
}

function updateMusicButtons(playing) {
    const buttons = [musicBtn, musicBtnLayer];
    const currentSong = songs[currentSongIndex].title;
    
    buttons.forEach(btn => {
        if (btn) {
            if (playing) {
                btn.classList.add('playing');
                btn.setAttribute('data-song', currentSong);
            } else {
                btn.classList.remove('playing');
                btn.setAttribute('data-song', 'Click para reproducir');
            }
        }
    });
}

function playSong() {
    const basePath = window.location.pathname.includes('/project/') ? '/project' : '';
    const currentSong = songs[currentSongIndex];
    audioPlayer.src = basePath + currentSong.file.replace('/project', '');
    
    audioPlayer.play()
        .then(() => {
            isPlaying = true;
            updateMusicButtons(true);
        })
        .catch(error => {
            console.error('Error playing audio:', error);
        });
}
function pauseSong() {
    audioPlayer.pause();
    isPlaying = false;
    updateMusicButtons(false);
}
function nextSong() {
    currentSongIndex =(currentSongIndex + 1) % songs.length;
    if (currentSongIndex === 0) {
        pauseSong();
        return;
    }
    
    audioPlayer.src = songs[currentSongIndex].file;
    if (isPlaying) {
        playSong();
    }
}

audioPlayer.addEventListener('ended', () => {
    if (currentSongIndex === songs.length - 1) {
        pauseSong();
        currentSongIndex = 0; 
    } else {
        nextSong();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    updateMusicButtons(false);
});