document.querySelectorAll('.card').forEach(card => {
            const player = card.querySelector('audio');
    const playToggle = card.querySelector('.play-toggle');
            const progress = card.querySelector('.bar > div');
    let currentTrack = null;

    function fmtTime(sec) {
                if (isNaN(sec)) return '–:–';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
            }

            // Load track durations
            card.querySelectorAll('.track').forEach(el => {
                const tmp = new Audio();
    tmp.preload = 'metadata';
    tmp.src = el.dataset.src;
                tmp.addEventListener('loadedmetadata', () => {
        el.querySelector('.duration').textContent = fmtTime(tmp.duration);
                });
            });

            card.querySelector('.playlist').addEventListener('click', e => {
                const track = e.target.closest('.track');
    if (!track) return;
                card.querySelectorAll('.track').forEach(t => t.classList.remove('active'));
    track.classList.add('active');
    player.src = track.dataset.src;
    player.play();
    currentTrack = track;
    playToggle.textContent = '⏸';
            });

            playToggle.addEventListener('click', () => {
                if (player.paused) {
                    if (!currentTrack) {
                        const first = card.querySelector('.track');
    first.click();
                    } else {
        player.play();
    playToggle.textContent = '⏸';
                    }
                } else {
        player.pause();
    playToggle.textContent = '▶';
                }
            });

            player.addEventListener('timeupdate', () => {
                if (!isNaN(player.duration)) {
        progress.style.width = (player.currentTime / player.duration) * 100 + '%';
                }
            });

            player.addEventListener('ended', () => {
                if (currentTrack) {
                    const next = currentTrack.nextElementSibling;
    if (next) next.click();
                }
            });
        });