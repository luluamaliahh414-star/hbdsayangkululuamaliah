// ==================== VARIABLES ====================
let progress = 0;
let isPressed = false;
let pressInterval;
let currentScrapbookPage = 1;
const totalPages = 3;

// ==================== DOM ELEMENTS ====================
const heart = document.getElementById('heart');
const heartFill = document.getElementById('heartFill');
const progressText = document.getElementById('progressText');
const birthdayMusic = document.getElementById('birthdayMusic');
const cakeSection = document.getElementById('cakeSection');
const scrapbookGallery = document.getElementById('scrapbookGallery');
const closeScrapbook = document.getElementById('closeScrapbook');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageIndicator = document.getElementById('pageIndicator');

// ==================== MUSIC MANAGEMENT ====================
// Fungsi untuk menyimpan status musik
function saveMusicState(isPlaying, currentTime) {
    sessionStorage.setItem('musicPlaying', isPlaying);
    sessionStorage.setItem('musicTime', currentTime);
}

// Fungsi untuk mengambil status musik
function getMusicState() {
    return {
        isPlaying: sessionStorage.getItem('musicPlaying') === 'true',
        currentTime: parseFloat(sessionStorage.getItem('musicTime')) || 0
    };
}

// Fungsi untuk memulai musik
function startMusic() {
    if (birthdayMusic) {
        const musicState = getMusicState();
        
        birthdayMusic.volume = 0.5;
        birthdayMusic.currentTime = musicState.currentTime;
        
        // Coba play musik
        birthdayMusic.play().then(() => {
            console.log('🎵 Musik berhasil diputar!');
            saveMusicState(true, birthdayMusic.currentTime);
        }).catch(error => {
            console.log('⚠️ Autoplay diblokir, memerlukan interaksi user');
            // Jika autoplay gagal, coba lagi saat user klik
            document.body.addEventListener('click', function playOnClick() {
                birthdayMusic.play().then(() => {
                    saveMusicState(true, birthdayMusic.currentTime);
                    document.body.removeEventListener('click', playOnClick);
                });
            }, { once: true });
        });

        // Update currentTime di sessionStorage setiap 1 detik
        setInterval(() => {
            if (!birthdayMusic.paused) {
                saveMusicState(true, birthdayMusic.currentTime);
            }
        }, 1000);
    }
}

// ==================== EVENT LISTENERS ====================
// Heart interaction events (hanya untuk love.html)
if (heart) {
    heart.addEventListener('mousedown', startPress);
    heart.addEventListener('mouseup', stopPress);
    heart.addEventListener('mouseleave', stopPress);
    heart.addEventListener('touchstart', startPress, {passive: false});
    heart.addEventListener('touchend', stopPress);
}

// Scrapbook events (hanya untuk kue.html)
if (cakeSection) {
    cakeSection.addEventListener('click', openScrapbook);
}

if (closeScrapbook) {
    closeScrapbook.addEventListener('click', closeScrapbookGallery);
}

if (prevBtn) {
    prevBtn.addEventListener('click', prevPage);
}

if (nextBtn) {
    nextBtn.addEventListener('click', nextPage);
}

// Prevent context menu on touch devices
document.addEventListener('contextmenu', e => e.preventDefault());

// ==================== HEART INTERACTION FUNCTIONS ====================
function startPress(e) {
    e.preventDefault();
    isPressed = true;
    
    pressInterval = setInterval(() => {
        if (isPressed && progress < 100) {
            progress += 2;
            updateHeartFill();
            createFloatingHeart();
            
            if (progress >= 100) {
                completeHeart();
            }
        }
    }, 50);
}

function stopPress() {
    isPressed = false;
    if (pressInterval) {
        clearInterval(pressInterval);
    }
}

function updateHeartFill() {
    if (heartFill && progressText) {
        heartFill.style.height = progress + '%';
        progressText.textContent = Math.round(progress) + '%';
        
        // Add heartbeat animation when filling
        if (heart) {
            heart.style.animation = 'bounceIn 0.3s ease';
            setTimeout(() => {
                heart.style.animation = '';
            }, 300);
        }
    }
}

function completeHeart() {
    stopPress();
    if (progressText) {
        progressText.textContent = '100% - Perfect! 💕';
    }
    
    // Create celebration effect
    for (let i = 0; i < 30; i++) {
        setTimeout(() => createFloatingHeart(), i * 100);
    }
    
    // Simpan status musik sebelum redirect
    if (birthdayMusic && !birthdayMusic.paused) {
        saveMusicState(true, birthdayMusic.currentTime);
    }
    
    // REDIRECT KE KUE.HTML setelah 2 detik
    setTimeout(() => {
        window.location.href = 'kue.html';
    }, 2000);
}

// ==================== SCRAPBOOK FUNCTIONS ====================
function openScrapbook() {
    // Simpan status musik sebelum redirect ke gallery
    if (birthdayMusic && !birthdayMusic.paused) {
        saveMusicState(true, birthdayMusic.currentTime);
    }
    
    // REDIRECT KE GALLERY.HTML
    window.location.href = 'gallery.html';
}

function closeScrapbookGallery() {
    if (scrapbookGallery) {
        scrapbookGallery.classList.remove('show');
    }
}

function nextPage() {
    if (currentScrapbookPage < totalPages) {
        const currentPageElement = document.getElementById(`page${currentScrapbookPage}`);
        const nextPageElement = document.getElementById(`page${currentScrapbookPage + 1}`);
        
        if (currentPageElement && nextPageElement) {
            currentPageElement.style.animation = 'slideOutToLeft 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)';
            
            setTimeout(() => {
                currentPageElement.classList.remove('active');
                currentScrapbookPage++;
                nextPageElement.classList.add('active');
                nextPageElement.style.animation = 'slideInFromRight 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)';
                updatePageIndicator();
                
                setTimeout(() => {
                    currentPageElement.style.animation = '';
                    nextPageElement.style.animation = '';
                }, 500);
            }, 250);
        }
    }
}

function prevPage() {
    if (currentScrapbookPage > 1) {
        const currentPageElement = document.getElementById(`page${currentScrapbookPage}`);
        const prevPageElement = document.getElementById(`page${currentScrapbookPage - 1}`);
        
        if (currentPageElement && prevPageElement) {
            currentPageElement.style.animation = 'slideOutToRight 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)';
            
            setTimeout(() => {
                currentPageElement.classList.remove('active');
                currentScrapbookPage--;
                prevPageElement.classList.add('active');
                prevPageElement.style.animation = 'slideInFromLeft 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)';
                updatePageIndicator();
                
                setTimeout(() => {
                    currentPageElement.style.animation = '';
                    prevPageElement.style.animation = '';
                }, 500);
            }, 250);
        }
    }
}

function updatePageIndicator() {
    if (pageIndicator) {
        pageIndicator.textContent = `${currentScrapbookPage} / ${totalPages}`;
        pageIndicator.style.animation = 'pulse 0.4s ease-in-out';
        setTimeout(() => {
            pageIndicator.style.animation = '';
        }, 400);
    }
}

// ==================== VISUAL EFFECTS FUNCTIONS ====================
function createFloatingHeart() {
    const hearts = ['❤️', '💕', '💖', '💝', '🌹'];
    const floatingHeart = document.createElement('div');
    floatingHeart.className = 'floating-heart';
    floatingHeart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    floatingHeart.style.left = Math.random() * 100 + '%';
    floatingHeart.style.fontSize = (Math.random() * 20 + 15) + 'px';
    floatingHeart.style.animationDuration = (Math.random() * 2 + 2) + 's';
    
    const container = document.getElementById('floatingHearts');
    if (container) {
        container.appendChild(floatingHeart);
        
        setTimeout(() => {
            floatingHeart.remove();
        }, 3000);
    }
}

function createFireworks() {
    const fireworks = ['🎆', '✨', '🌟', '💫'];
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.style.position = 'fixed';
            firework.style.left = Math.random() * 100 + '%';
            firework.style.top = Math.random() * 100 + '%';
            firework.style.fontSize = '3em';
            firework.style.zIndex = '9999';
            firework.style.pointerEvents = 'none';
            firework.textContent = fireworks[Math.floor(Math.random() * fireworks.length)];
            firework.style.animation = 'twinkle 1s ease-in-out';
            
            document.body.appendChild(firework);
            
            setTimeout(() => {
                firework.remove();
            }, 1000);
        }, i * 200);
    }
}

// ==================== AUDIO FUNCTIONS ====================
function createCelebrationSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.2);
        oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.4);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.6);
    } catch (e) {
        console.log('Web Audio API not supported');
    }
}

// ==================== KEYBOARD & TOUCH NAVIGATION ====================
document.addEventListener('keydown', (e) => {
    if (scrapbookGallery && scrapbookGallery.classList.contains('show')) {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
            prevPage();
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
            nextPage();
        } else if (e.key === 'Escape') {
            closeScrapbookGallery();
        }
    }
});

// Touch gesture support for scrapbook
let touchStartX = 0;
let touchEndX = 0;

if (scrapbookGallery) {
    scrapbookGallery.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    scrapbookGallery.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            prevPage();
        } else {
            nextPage();
        }
    }
}

// ==================== AMBIENT EFFECTS ====================
setInterval(() => {
    if (Math.random() < 0.3) {
        createFloatingHeart();
    }
}, 2000);

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎉 Happy Birthday App Loaded!');
    
    // Mulai musik otomatis di kue.html
    if (birthdayMusic) {
        startMusic();
    }

    // Add initial floating hearts
    setTimeout(() => {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => createFloatingHeart(), i * 500);
        }
    }, 1000);
    
    // Add fireworks on kue.html
    if (document.getElementById('birthdayCard')) {
        setTimeout(() => {
            createFireworks();
        }, 1500);
    }
});