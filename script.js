window.addEventListener('DOMContentLoaded', function() {
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PlAYER_STORAGE_KEY = "F8_PLAYER";
const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");
const playerDuration = $(".player-duration");
const playerRemaining = $('.player-remaining');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    // config trả về value của key đó
    config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Waiting for you",
            singer: "Mono",
            path: "./songs/audio1.mp3",
            image: "./image/img1.jpg"
        },
        {
            name: "Believe",
            singer: "Smooth Type Beat",
            path: "./songs/audio2.mp3",
            image:
                "./image/img2.jpg"
        },
        {
            name: "Naachne Ka Shaunq",
            singer: "Raftaar x Brobha V",
            path:
                "./songs/audio3.mp3",
            image: "./image/img3.jpeg"
        },
        {
            name: "Love Story",
            singer: "Guitar Instrumental",
            path: "./songs/audio4.mp3",
            image:
                "./image/img4.jpg"
        },
        {
            name: "Colde x Anderson Paak",
            singer: "wavytrbl",
            path: "./songs/audio5.mp3",
            image:
                "./image/img5.jpg"
        },
        {
            name: "Sweet",
            singer: "Goku Beats",
            path:
                "./songs/audio6.mp3",
            image:
                "./image/img6.jpg"
        },
        {
            name: "Chill R&B Guitar Type",
            singer: "CREAM",
            path: "./songs/audio7.mp3",
            image:
                "./image/img7.jpg"
        }
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        // thisIs.setConfig('isRandom', thisIs.isRandom)
        localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
        // nhét key và object {key, value} vào localstorage, chuyển đổi sang string 
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                        <div class="song ${index === this.currentIndex ? "active" : ""}" data-index="${index}">
                            <div class="thumb"
                                style="background-image: url('${song.image}')">
                            </div>
                            <div class="body">
                                <h3 class="title">${song.name}</h3>
                                <p class="author">${song.singer}</p>
                            </div>
                            <div id="like-heart" class="like">
                            <i class="fa fa-heart"></i>
                      </div>
                        </div>
                    `;
        });
        playlist.innerHTML = htmls.join("");
    },
    currentSong: function() {
        return this.songs[this.currentIndex];
    },
    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // Xử lý CD quay / dừng
        // Handle CD spins / stops
        const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
            duration: 10000, // 10 seconds
            iterations: Infinity
        });
        cdThumbAnimate.pause();

        // Xử lý phóng to / thu nhỏ CD
        // Handles CD enlargement / reduction
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };

        // Xử lý khi click play
        // Handle when click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        // Khi song được play
        // When the song is played
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        };

        // Khi song bị pause
        // When the song is pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        };

        // Khi tiến độ bài hát thay đổi
        // When the song progress changes
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(
                    (audio.currentTime / audio.duration) * 100
                );
                progress.value = progressPercent;

                const currentMinute = Math.floor(audio.currentTime / 60);
                const currentSecond = Math.floor(audio.currentTime % 60);
                playerDuration.textContent = `0${currentMinute}:${currentSecond > 9 ? currentSecond : '0' + currentSecond}`;
            }
        };


        // Xử lý khi tua song
        // Handling when seek
        progress.onchange = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
        };

        // Khi next song
        // When next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            // _this.render();
            _this.scrollToActiveSong();
        };

        // Khi prev song
        // When prev song
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            // _this.render();
            _this.scrollToActiveSong();
        };

        // Xử lý bật / tắt random song
        // Handling on / off random song
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig("isRandom", _this.isRandom);
            randomBtn.classList.toggle("active", _this.isRandom);
        };

        // Xử lý lặp lại một song
        // Single-parallel repeat processing
        repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig("isRepeat", _this.isRepeat);
            repeatBtn.classList.toggle("active", _this.isRepeat);
        };

        function clickButton(btn) {
            btn.onmousedown = function () {
                this.classList.add('active')
            }
            btn.onmouseup = function () {
                this.classList.remove('active')
            }
        }
        // Tạo cảm giác bấm khi click vào nút next và prev
        clickButton(nextBtn)
        clickButton(prevBtn)

        // Xử lý next song khi audio ended
        // Handle next song when audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };

        // Tính thời gian tổng của bài hát
        audio.onloadeddata = function () {
            _this.songTime = audio.duration.toFixed();
            // _this.songVolume=audio.volume*100; 
            const second = _this.songTime % 60;
            playerRemaining.textContent = `0${Math.floor(_this.songTime / 60)}:${second > 9 ? second : '0' + second}`;
        }

        // Lắng nghe hành vi click vào playlist
        // Listen to playlist clicks
        playlist.onclick = function (event) {
            const songNode = event.target.closest(".song:not(.active)");
            const likeHeart = event.target.closest('.like');

            if (songNode || likeHeart) {
                // Xử lý khi click vào song
                // Handle when clicking on the song
                if (songNode && !likeHeart) {
                    _this.currentIndex = parseInt(songNode.dataset.index);
                    _this.loadCurrentSong();
                    audio.play();

                    setTimeout(function () {
                        songNode.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        })
                    }, 250)
                }

                // Thả tim cho từng bài hát
                if (likeHeart) {
                    likeHeart.classList.toggle('heart')
                }
            }
        };
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            if ((this.currentIndex) <= 2) {
                $('.song.active').scrollIntoView({
                    behavior: "smooth",
                    block: 'end'
                })
            } else {
                $('.song.active').scrollIntoView({
                    behavior: "smooth",
                    block: 'center'
                })
            }
        }, 400)
    },
    loadCurrentSong: function () {
        // Lưu currentIndex vào localstorage
        this.setConfig('currentIndex', this.currentIndex)
        heading.textContent = this.currentSong().name;
        cdThumb.style.backgroundImage = `url('${this.currentSong().image}')`;
        audio.src = this.currentSong().path;

        // Active song khi chuyển bài hát
        const songActive = $$('.song');
        [...songActive].forEach((item) => item.classList.remove('active'));
        [...songActive].forEach((item) => {
            if (parseInt(item.dataset.index) === this.currentIndex) {
                item.classList.toggle('active')
            }
        });
    },
    firstAccess: function () {
        if (this.config.currentIndex === undefined) {
            this.config.isRandom = false
            this.config.isRepeat = false
        } else {
            this.currentIndex = this.config.currentIndex
            // Lưu nhớ vị trí active khi reset
        }
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function () {
        // Gán cấu hình từ config vào ứng dụng
        // Assign configuration from config to application

        this.firstAccess()
        // Kiểm tra điều kiện khi lần đầu truy cập vào web localstorage

        this.loadConfig();

        // Định nghĩa các thuộc tính cho object
        // Defines properties for the object
        this.currentSong()

        // Lắng nghe / xử lý các sự kiện (DOM events)
        // Listening / handling events (DOM events)
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        // Load the first song information into the UI when running the app
        this.loadCurrentSong();

        this.render()

        // Render playlist

        // Hiển thị trạng thái ban đầu của button repeat & random
        // Display the initial state of the repeat & random button
        randomBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isRepeat);
    }
};

app.start();

}) // Khi DOM load xong javascript mới thực thi