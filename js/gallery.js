// ==================== CONFIGURATION ====================
// Define your image collections

    // Scrapbook Collection 
const imageCollections = {
    scrapbook: [
        { src: 'img/lulu1.png', caption: '🎂 Birthday Celebration', title: 'Sweet Memories' },
        { src: 'img/lulu2.png', caption: '💕 Beautiful Moment', title: 'Precious Time' },
        { src: 'img/lulu3.png', caption: '🌟 Special Day', title: 'Golden Memories' },
        { src: 'img/lulu4.png', caption: '🎈 Happy Times', title: 'Forever Young' },
        { src: 'img/lulu5.png', caption: '✨ Magical Moment', title: 'Beautiful Days' },
        { src: 'img/lulu6.png', caption: '🎉 Celebration Time', title: 'Joyful Memories' },
    ],
    
    //Album Gallery Collections 
    happybirthday: [
        { src: 'img/photoboth.png', caption: 'PhotoBoth' },
        { src: 'img/idulfitri.png', caption: 'Idul Fitri' },
        { src: 'img/guci.png', caption: 'Guci' },
        { src: 'img/Richeese.png', caption: 'Richeese' },
        { src: 'img/cutee.png', caption: 'Lovee' },
        { src: 'img/shooping.png', caption: 'Shooping' },
        { src: 'img/17agustus.png', caption: '17 Agustus' },
        { src: 'img/moovie.png', caption: 'Movie Time' },
        { src: 'img/shoopping2.png', caption: 'Shooping' },
        { src: 'img/pasarmalem.png', caption: 'Pasar Malem' },
        { src: 'img/potongrambut.png', caption: 'Barber' },
        { src: 'img/gril.png', caption: 'Grill' },
    ],
};

// ==================== GLOBAL VARIABLES ====================
let currentPage = 0;
let totalPages = imageCollections.scrapbook.length;
let isAnimating = false;
let touchStartX = 0;
let touchEndX = 0;
let currentTab = 'happybirthday';
let isScrapbookMode = true;
let heartInterval = null;
let messageInterval = null;
let slideshowInterval = null;
let celebrationTimeout = null;

// ==================== DOM ELEMENTS ====================
const scrapbookMode = document.getElementById('scrapbookMode');
const galleryMode = document.getElementById('galleryMode');
const galleryBtn = document.getElementById('galleryBtn');
const backToScrapbook = document.getElementById('backToScrapbook');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link[data-tab]');
const modal = document.getElementById('photoModal');
const modalImage = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const modalClose = document.querySelector('.modal-close');
const birthdayMusic = document.getElementById('birthdayMusic');

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
            console.log('🎵 Musik berhasil diputar di gallery!');
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

// ==================== BIRTHDAY HEADER ANIMATIONS ====================
class BirthdayHeaderAnimations {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        // Wait for DOM elements to be available
        setTimeout(() => {
            this.bindEvents();
            this.startAutoAnimations();
            this.isInitialized = true;
        }, 500);
    }

    bindEvents() {
        // Age number click event
        const ageNumber = document.querySelector('.age-number');
        if (ageNumber) {
            ageNumber.addEventListener('click', this.triggerCelebration.bind(this));
            ageNumber.addEventListener('mouseenter', this.onAgeHover.bind(this));
        }

        // Birthday text events
        const birthdayLine1 = document.querySelector('.birthday-line-1');
        const birthdayLine2 = document.querySelector('.birthday-line-2');
        
        if (birthdayLine1) {
            birthdayLine1.addEventListener('mouseenter', this.triggerRainbow.bind(this));
            birthdayLine1.addEventListener('click', this.triggerTextCelebration.bind(this));
        }
        
        if (birthdayLine2) {
            birthdayLine2.addEventListener('mouseenter', this.triggerHeartFloat.bind(this));
            birthdayLine2.addEventListener('click', this.triggerNameCelebration.bind(this));
        }
    }

    triggerCelebration() {
        const ageNumber = document.querySelector('.age-number');
        const particles = document.querySelector('.celebration-particles');
        const hearts = document.querySelector('.floating-hearts');
        
        if (!ageNumber) return;

        // Add celebration class
        ageNumber.classList.add('celebrate');
        
        // Trigger particles
        if (particles) {
            particles.classList.add('active');
        }
        
        // Trigger hearts
        if (hearts) {
            hearts.classList.add('active');
        }
        
        // Create number explosion
        this.createNumberExplosion();
        
        // Show celebration message
        this.showCelebrationMessage();
        
        // Reset after animation
        if (celebrationTimeout) clearTimeout(celebrationTimeout);
        celebrationTimeout = setTimeout(() => {
            ageNumber.classList.remove('celebrate');
            if (particles) particles.classList.remove('active');
            if (hearts) hearts.classList.remove('active');
        }, 3000);
    }

    onAgeHover() {
        const ageNumber = document.querySelector('.age-number');
        if (ageNumber) {
            ageNumber.style.transform = 'scale(1.15) rotate(5deg)';
            ageNumber.style.textShadow = '0 0 30px rgba(253, 203, 110, 0.8)';
            
            setTimeout(() => {
                ageNumber.style.transform = '';
                ageNumber.style.textShadow = '';
            }, 300);
        }
    }

    triggerRainbow() {
        const birthdayLine1 = document.querySelector('.birthday-line-1');
        if (birthdayLine1) {
            birthdayLine1.style.animation = 'rainbow 2s ease-in-out, titleWave 4s ease-in-out infinite';
            
            // Create rainbow sparkles
            this.createRainbowSparkles();
            
            setTimeout(() => {
                birthdayLine1.style.animation = 'titleWave 4s ease-in-out infinite';
            }, 2000);
        }
    }

    triggerHeartFloat() {
        const hearts = document.querySelector('.floating-hearts');
        if (hearts) {
            hearts.classList.add('active');
            
            setTimeout(() => {
                hearts.classList.remove('active');
            }, 4000);
        }
    }

    triggerTextCelebration() {
        const birthdayLine1 = document.querySelector('.birthday-line-1');
        if (birthdayLine1) {
            // Enhanced text animation
            birthdayLine1.style.animation = 'rainbow 1s ease-in-out infinite';
            
            setTimeout(() => {
                birthdayLine1.style.animation = 'titleWave 4s ease-in-out infinite';
            }, 3000);
        }
    }

    triggerNameCelebration() {
        const birthdayLine2 = document.querySelector('.birthday-line-2');
        if (birthdayLine2) {
            // Name celebration effect
            birthdayLine2.style.animation = 'float 0.5s ease-in-out 6';
            
            // Create heart explosion
            this.createHeartExplosion();
            
            // Show love message
            setTimeout(() => {
                this.showMessage('💖 Lulu Amaliah yang cantik! 💖', 'love');
            }, 500);
            
            setTimeout(() => {
                birthdayLine2.style.animation = 'float 3s ease-in-out infinite';
            }, 3000);
        }
    }

    createNumberExplosion() {
        const particles = ['2️⃣', '2️⃣', '🎂', '🎉', '🎈', '✨', '🌟', '💫', '⭐', '🎊'];
        const colors = ['#fdcb6e', '#fd79a8', '#667eea', '#764ba2'];
        
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.textContent = particles[Math.floor(Math.random() * particles.length)];
            
            const angle = (i * 30) * Math.PI / 180;
            const distance = 150 + Math.random() * 100;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            particle.style.cssText = `
                position: fixed;
                left: 50%;
                top: 20%;
                font-size: ${1.5 + Math.random()}em;
                color: ${colors[Math.floor(Math.random() * colors.length)]};
                pointer-events: none;
                z-index: 9999;
                transform: translate(-50%, -50%);
                animation: explodeParticle 2s ease-out forwards;
                --end-x: ${x}px;
                --end-y: ${y}px;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 2000);
        }
    }

    createRainbowSparkles() {
        const sparkles = ['✨', '🌟', '💫', '⭐', '🌈'];
        
        for (let i = 0; i < 8; i++) {
            const sparkle = document.createElement('div');
            sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
            sparkle.style.cssText = `
                position: fixed;
                left: ${30 + Math.random() * 40}%;
                top: ${25 + Math.random() * 10}%;
                font-size: ${1 + Math.random() * 0.5}em;
                pointer-events: none;
                z-index: 9998;
                animation: sparkleFloat 3s ease-out forwards;
            `;
            
            document.body.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 3000);
        }
    }

    createTextParticles(text) {
        const chars = text.split('');
        
        chars.forEach((char, index) => {
            if (char === ' ') return;
            
            const particle = document.createElement('div');
            particle.textContent = char;
            particle.style.cssText = `
                position: fixed;
                left: ${20 + (index * 3)}%;
                top: 25%;
                font-size: 1.5em;
                font-weight: bold;
                color: #fd79a8;
                pointer-events: none;
                z-index: 9997;
                animation: textParticleFloat 4s ease-out forwards;
                animation-delay: ${index * 0.1}s;
            `;
            
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 4000);
        });
    }

    createHeartExplosion() {
        const hearts = ['💕', '💖', '💝', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤍', '🖤', '💗'];
        
        for (let i = 0; i < 15; i++) {
            const heart = document.createElement('div');
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            
            const angle = Math.random() * 360 * Math.PI / 180;
            const distance = 100 + Math.random() * 150;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            heart.style.cssText = `
                position: fixed;
                left: 50%;
                top: 35%;
                font-size: ${1 + Math.random() * 0.8}em;
                pointer-events: none;
                z-index: 9996;
                transform: translate(-50%, -50%);
                animation: heartBurst 3s ease-out forwards;
                --heart-x: ${x}px;
                --heart-y: ${y}px;
            `;
            
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 3000);
        }
    }

    showCelebrationMessage() {
        const messages = [
            '🎉 Happy 22nd Birthday! 🎉',
            '🎂 Selamat Ulang Tahun ke-22! 🎂',
            '🌟 Semoga bahagia selalu! 🌟',
            '💖 Birthday Girl yang cantik! 💖'
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        this.showMessage(randomMessage, 'celebration');
    }

    showMessage(text, type = 'info') {
        const messageElement = document.createElement('div');
        const gradients = {
            love: 'linear-gradient(45deg, #fd79a8, #fdcb6e)',
            celebration: 'linear-gradient(45deg, #667eea, #764ba2)',
            success: 'linear-gradient(45deg, #00b894, #00a085)',
            info: 'linear-gradient(45deg, #74b9ff, #0984e3)',
            warning: 'linear-gradient(45deg, #fdcb6e, #e17055)'
        };
        
        messageElement.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: ${gradients[type] || gradients.info};
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            font-size: 1.2em;
            font-weight: 600;
            box-shadow: 0 15px 35px rgba(253, 121, 168, 0.4);
            z-index: 9995;
            opacity: 0;
            transition: all 0.5s ease;
            max-width: 90%;
            text-align: center;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.2);
        `;
        
        messageElement.textContent = text;
        document.body.appendChild(messageElement);
        
        // Animate in
        requestAnimationFrame(() => {
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateX(-50%) translateY(0)';
        });
        
        // Animate out
        setTimeout(() => {
            messageElement.style.opacity = '0';
            messageElement.style.transform = 'translateX(-50%) translateY(-100px)';
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 500);
        }, 4000);
    }

    startAutoAnimations() {
        if (!isScrapbookMode) {
            // Auto-trigger celebration on gallery mode entry
            setTimeout(() => {
                this.triggerCelebration();
            }, 1000);
            
            // Periodic heart floating
            setInterval(() => {
                if (!isScrapbookMode) {
                    this.triggerHeartFloat();
                }
            }, 8000);
        }
    }
}

// ==================== SCRAPBOOK CLASS ====================
class ScrapbookGallery {
    constructor() {
        this.init();
    }

    init() {
        this.createPages();
        this.bindEvents();
        this.updateIndicator();
        this.hideLoading();
        this.startHintAnimation();
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }

    startHintAnimation() {
        setTimeout(() => {
            const hint = document.getElementById('swipeHint');
            if (hint) {
                hint.style.opacity = '0';
                hint.style.transition = 'opacity 0.5s ease';
            }
        }, 5000);
    }

    createPages() {
        const container = document.getElementById('scrapbookContainer');
        if (!container) return;
        
        const loading = document.getElementById('loading');
        container.innerHTML = '';
        if (loading) container.appendChild(loading);
        
        imageCollections.scrapbook.forEach((imageData, index) => {
            const page = document.createElement('div');
            page.className = `scrapbook-page page-${(index % 4) + 1}`;
            page.id = `page${index}`;
            
            if (index === 0) {
                page.classList.add('active');
            } else if (index === 1) {
                page.classList.add('next');
            } else {
                page.classList.add('hidden');
            }

            page.innerHTML = `
                <div class="decorative-corner corner-1"></div>
                <div class="decorative-corner corner-2"></div>
                <div class="decorative-corner corner-3"></div>
                <div class="decorative-corner corner-4"></div>
                
                <div class="decorative-tape tape-1"></div>
                <div class="decorative-tape tape-2"></div>
                <div class="decorative-tape tape-3"></div>
                
                <div class="page-content">
                    <h2 class="page-title">${imageData.title}</h2>
                    <img class="scrapbook-photo" src="${imageData.src}" alt="${imageData.caption}" 
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'; this.nextElementSibling.innerHTML='📸<br>Photo not found';">
                    <div style="display:none; align-items:center; justify-content:center; width:300px; height:200px; background:#ddd; border-radius:10px; font-size:2em; color:#666; text-align:center;"></div>
                    <div class="photo-caption">${imageData.caption}</div>
                </div>
            `;

            container.appendChild(page);
        });
    }

    bindEvents() {
        const container = document.getElementById('scrapbookContainer');
        if (!container) return;

        container.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        container.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });
        container.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
        container.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        container.addEventListener('contextmenu', e => e.preventDefault());
    }

    handleTouchStart(e) {
        if (isAnimating || !isScrapbookMode) return;
        touchStartX = e.touches[0].clientX;
    }

    handleTouchMove(e) {
        if (isAnimating || !isScrapbookMode) return;
    }

    handleTouchEnd(e) {
        if (isAnimating || !isScrapbookMode) return;
        touchEndX = e.changedTouches[0].clientX;
        this.handleSwipe();
    }

    handleMouseDown(e) {
        if (isAnimating || !isScrapbookMode) return;
        touchStartX = e.clientX;
        
        const handleMouseMove = (e) => {};
        
        const handleMouseUp = (e) => {
            touchEndX = e.clientX;
            this.handleSwipe();
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0 && currentPage > 0) {
                this.previousPage();
            } else if (swipeDistance < 0 && currentPage < totalPages - 1) {
                this.nextPage();
            }
        }
    }

    handleKeyPress(e) {
        if (isAnimating || !isScrapbookMode) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                this.previousPage();
                break;
            case 'ArrowRight':
                this.nextPage();
                break;
        }
    }

    nextPage() {
        if (isAnimating || currentPage >= totalPages - 1) return;
        
        isAnimating = true;
        this.animatePageTransition(currentPage, currentPage + 1, 'next');
        currentPage++;
        
        setTimeout(() => {
            this.updatePageClasses();
            this.updateIndicator();
            isAnimating = false;
        }, 600);
    }

    previousPage() {
        if (isAnimating || currentPage <= 0) return;
        
        isAnimating = true;
        this.animatePageTransition(currentPage, currentPage - 1, 'prev');
        currentPage--;
        
        setTimeout(() => {
            this.updatePageClasses();
            this.updateIndicator();
            isAnimating = false;
        }, 600);
    }

    animatePageTransition(fromIndex, toIndex, direction) {
        const fromPage = document.getElementById(`page${fromIndex}`);
        const toPage = document.getElementById(`page${toIndex}`);

        if (!fromPage || !toPage) return;

        if (direction === 'next') {
            fromPage.classList.add('page-flip-left');
            toPage.classList.remove('next', 'hidden');
            toPage.classList.add('active');
        } else {
            fromPage.classList.add('page-flip-right');
            toPage.classList.remove('prev', 'hidden');
            toPage.classList.add('active');
        }

        setTimeout(() => {
            fromPage.classList.remove('page-flip-left', 'page-flip-right');
        }, 600);
    }

    updatePageClasses() {
        document.querySelectorAll('.scrapbook-page').forEach((page, index) => {
            page.classList.remove('active', 'next', 'prev', 'hidden');
            
            if (index === currentPage) {
                page.classList.add('active');
            } else if (index === currentPage + 1) {
                page.classList.add('next');
            } else if (index === currentPage - 1) {
                page.classList.add('prev');
            } else {
                page.classList.add('hidden');
            }
        });
    }

    updateIndicator() {
        const indicator = document.getElementById('pageIndicator');
        if (indicator) {
            indicator.textContent = `${currentPage + 1} / ${totalPages}`;
        }
    }

    reset() {
        currentPage = 0;
        this.updatePageClasses();
        this.updateIndicator();
    }
}

// ==================== LETTER FEATURE CLASS ====================
class LetterFeature {
    constructor() {
        this.isOpen = false;
        this.confettiInterval = null;
        this.init();
    }

    init() {
        setTimeout(() => {
            this.bindEvents();
        }, 1000);
    }

    bindEvents() {
        const envelope = document.getElementById('envelope');
        const letterClose = document.getElementById('letterClose');
        const letterPaper = document.getElementById('letterPaper');

        if (envelope) {
            envelope.addEventListener('click', this.openLetter.bind(this));
        }

        if (letterClose) {
            letterClose.addEventListener('click', this.closeLetter.bind(this));
        }

        // Close letter when clicking overlay
        if (letterPaper) {
            letterPaper.addEventListener('click', (e) => {
                if (e.target === letterPaper) {
                    this.closeLetter();
                }
            });
        }

        // Close letter with ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeLetter();
            }
        });
    }

    openLetter() {
        if (this.isOpen) return;
        this.isOpen = true;

        const envelope = document.getElementById('envelope');
        const letterPaper = document.getElementById('letterPaper');
        const letterHint = document.getElementById('letterHint');
        const confettiContainer = document.getElementById('confettiContainer');

        // Hide hint
        if (letterHint) {
            letterHint.style.opacity = '0';
            letterHint.style.transform = 'translateY(20px)';
        }

        // Open envelope animation
        if (envelope) {
            envelope.classList.add('opened');
            envelope.style.transform = 'scale(0.95) translateY(-20px)';
            envelope.style.transition = 'all 0.5s ease';
        }

        // Create confetti explosion
        this.createConfettiExplosion(confettiContainer);

        // Show letter paper after delay
        setTimeout(() => {
            if (letterPaper) {
                letterPaper.classList.add('show');
                this.createLetterConfetti();
                this.playOpenSound();
            }

            // Create overlay
            this.createOverlay();
        }, 800);

        // Play celebration sound
        this.playCelebrationSound();

        // Show success message
        setTimeout(() => {
            showMessage('💌 Surat spesial untuk kamu! 💌', 'love');
        }, 1500);
    }

    closeLetter() {
        if (!this.isOpen) return;
        this.isOpen = false;

        const envelope = document.getElementById('envelope');
        const letterPaper = document.getElementById('letterPaper');
        const letterHint = document.getElementById('letterHint');
        const overlay = document.querySelector('.letter-overlay');

        // Hide letter paper
        if (letterPaper) {
            letterPaper.classList.remove('show');
        }

        // Remove overlay
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.remove();
                }
            }, 300);
        }

        // Stop confetti
        if (this.confettiInterval) {
            clearInterval(this.confettiInterval);
            this.confettiInterval = null;
        }

        // Reset envelope
        setTimeout(() => {
            if (envelope) {
                envelope.classList.remove('opened');
                envelope.style.transform = '';
            }

            // Show hint again
            if (letterHint) {
                letterHint.style.opacity = '1';
                letterHint.style.transform = 'translateY(0)';
            }
        }, 500);

        // Clear letter confetti
        const letterConfetti = document.getElementById('letterConfetti');
        if (letterConfetti) {
            letterConfetti.innerHTML = '';
        }
    }

    createConfettiExplosion(container) {
        if (!container) return;

        const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#ff9ff3', '#54a0ff'];
        const emojis = ['🎉', '🎊', '🎈', '✨', '💖', '💝', '💕', '⭐', '🌟', '💫'];
        const shapes = ['circle', 'square', 'triangle'];

        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                const useEmoji = Math.random() > 0.5;

                if (useEmoji) {
                    confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                    confetti.style.fontSize = `${Math.random() * 20 + 15}px`;
                } else {
                    const shape = shapes[Math.floor(Math.random() * shapes.length)];
                    confetti.className = `confetti-piece confetti-${shape}`;
                    confetti.style.width = `${Math.random() * 10 + 5}px`;
                    confetti.style.height = confetti.style.width;
                    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];

                    if (shape === 'triangle') {
                        confetti.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
                    } else if (shape === 'circle') {
                        confetti.style.borderRadius = '50%';
                    }
                }

                confetti.style.cssText += `
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    pointer-events: none;
                    z-index: 1501;
                    opacity: 1;
                `;

                const angle = (Math.random() * 360) * (Math.PI / 180);
                const velocity = Math.random() * 200 + 150;
                const endX = Math.cos(angle) * velocity;
                const endY = Math.sin(angle) * velocity;
                const rotation = Math.random() * 1080 - 540;
                const duration = Math.random() * 1 + 1.5;

                confetti.animate([
                    {
                        transform: 'translate(-50%, -50%) rotate(0deg)',
                        opacity: 1
                    },
                    {
                        transform: `translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px)) rotate(${rotation}deg)`,
                        opacity: 0
                    }
                ], {
                    duration: duration * 1000,
                    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                });

                container.appendChild(confetti);

                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.remove();
                    }
                }, duration * 1000);
            }, i * 20);
        }
    }

    createLetterConfetti() {
        const letterConfetti = document.getElementById('letterConfetti');
        if (!letterConfetti) return;

        const emojis = ['💖', '💕', '💗', '💝', '🎀', '🌸', '🌺', '🌹', '✨', '⭐', '🌟', '💫'];

        const createParticle = () => {
            const particle = document.createElement('div');
            particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            particle.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                top: -50px;
                font-size: ${Math.random() * 15 + 10}px;
                pointer-events: none;
                animation: letterConfettiFall ${Math.random() * 3 + 3}s linear forwards;
                opacity: ${Math.random() * 0.5 + 0.5};
            `;

            letterConfetti.appendChild(particle);

            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 6000);
        };

        // Create initial burst
        for (let i = 0; i < 15; i++) {
            setTimeout(createParticle, i * 100);
        }

        // Continue creating particles
        this.confettiInterval = setInterval(createParticle, 500);
    }

    createOverlay() {
        const existingOverlay = document.querySelector('.letter-overlay');
        if (existingOverlay) {
            existingOverlay.classList.add('show');
            return;
        }

        const overlay = document.createElement('div');
        overlay.className = 'letter-overlay';
        overlay.addEventListener('click', this.closeLetter.bind(this));

        document.body.appendChild(overlay);

        setTimeout(() => {
            overlay.classList.add('show');
        }, 10);
    }

    playCelebrationSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('Audio not supported');
        }
    }

    playOpenSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.3);

            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            console.log('Audio not supported');
        }
    }
}

// ==================== GALLERY FUNCTIONS ====================
function switchToGalleryMode() {
    if (!scrapbookMode || !galleryMode) return;
    
    scrapbookMode.style.display = 'none';
    galleryMode.style.display = 'block';
    galleryMode.classList.add('active');
    document.body.classList.add('gallery-active');
    document.body.style.overflow = 'auto';
    isScrapbookMode = false;
    
    loadPhotosToGrid();
    
    setTimeout(() => {
        startGalleryEffects();
        if (window.birthdayAnimations) {
            window.birthdayAnimations.startAutoAnimations();
        }
    }, 1000);
    
    showMessage('🎉 Selamat datang di Gallery Mode!', 'success');
}

function switchToScrapbookMode() {
    if (!scrapbookMode || !galleryMode) return;
    
    galleryMode.style.display = 'none';
    galleryMode.classList.remove('active');
    scrapbookMode.style.display = 'flex';
    document.body.classList.remove('gallery-active');
    document.body.style.overflow = 'hidden';
    isScrapbookMode = true;
    
    stopGalleryEffects();
    showMessage('📖 Kembali ke mode Scrapbook', 'info');
}

function switchTab(tabName) {
    if (!tabName) return;
    
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    const targetTab = document.getElementById(tabName);
    const targetLink = document.querySelector(`[data-tab="${tabName}"]`);
    
    if (targetTab) targetTab.classList.add('active');
    if (targetLink) targetLink.classList.add('active');
    
    currentTab = tabName;
    
    if (targetTab) {
        targetTab.style.animation = 'fadeInUp 0.5s ease-out';
        setTimeout(() => targetTab.style.animation = '', 500);
    }
}

// ==================== PHOTO LOADING FUNCTIONS ====================
function loadPhotosToGrid() {
    loadBirthdayPhotos();
}

function loadBirthdayPhotos() {
    const birthdayGrid = document.getElementById('birthdayGrid');
    if (!birthdayGrid) return;
    
    birthdayGrid.innerHTML = '';
    
    imageCollections.happybirthday.forEach((photo, index) => {
        const photoFrame = createPhotoFrame(photo.src, photo.caption, index);
        birthdayGrid.appendChild(photoFrame);
    });
}

function createPhotoFrame(imageSrc, caption, index) {
    const photoFrame = document.createElement('div');
    photoFrame.className = 'photo-frame';
    
    const rotations = ['-3deg', '-1deg', '1deg', '2deg', '3deg'];
    const randomRotation = rotations[index % rotations.length];
    photoFrame.style.transform = `rotate(${randomRotation})`;
    
    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = caption;
    img.style.cssText = `
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 3px;
        cursor: pointer;
        transition: all 0.3s ease;
    `;
    
    img.onerror = function() {
        this.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
            width: 100%;
            height: 200px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 3px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3em;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        placeholder.textContent = '📸';
        placeholder.onclick = () => openModal(createPlaceholderImage(caption), caption);
        this.parentNode.appendChild(placeholder);
    };
    
    img.onclick = () => openModal(imageSrc, caption);
    
    photoFrame.innerHTML = `
        <div class="photo-placeholder has-image"></div>
        <div class="photo-caption">${caption}</div>
    `;
    
    const placeholder = photoFrame.querySelector('.photo-placeholder');
    if (placeholder) {
        placeholder.appendChild(img);
    }
    
    setTimeout(() => {
        photoFrame.style.animation = 'slideInUp 0.6s ease-out';
        photoFrame.style.animationDelay = `${index * 0.1}s`;
        photoFrame.style.animationFillMode = 'both';
    }, 100);
    
    return photoFrame;
}

function createPlaceholderImage(caption) {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createLinearGradient(0, 0, 400, 400);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 400);
    
    ctx.font = '100px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.fillText('📸', 200, 200);
    
    ctx.font = '20px Arial';
    ctx.fillText(caption, 200, 320);
    
    return canvas.toDataURL();
}

// ==================== MODAL FUNCTIONS ====================
function openModal(imageSrc, caption) {
    if (!modal || !modalImage || !modalCaption) return;
    
    modal.style.display = 'block';
    modalImage.src = imageSrc;
    modalCaption.textContent = caption;
    document.body.style.overflow = 'hidden';
    
    modal.style.animation = 'fadeIn 0.3s ease-out';
    modalImage.style.animation = 'modalZoom 0.4s ease-out';
}

function closeModal() {
    if (!modal) return;
    
    modal.style.animation = 'fadeOut 0.3s ease-in';
    setTimeout(() => {
        modal.style.display = 'none';
        modal.style.animation = '';
        if (isScrapbookMode) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, 300);
}

// ==================== ANIMATION EFFECTS ====================
function createFloatingHeart() {
    const hearts = ['💕', '💖', '💝', '🌹', '✨', '💫', '⭐', '🌟'];
    const heart = document.createElement('div');
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    
    heart.style.cssText = `
        position: fixed;
        left: ${Math.random() * 100}%;
        top: 100vh;
        font-size: ${Math.random() * 25 + 15}px;
        color: #fd79a8;
        pointer-events: none;
        z-index: 999;
        text-shadow: 0 0 10px rgba(253, 121, 168, 0.5);
        animation: floatUpCustom ${Math.random() * 3 + 4}s ease-out forwards;
    `;
    
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 7000);
}

function showRandomLoveMessage() {
    const messages = [
        "💕 Setiap foto ini menyimpan kenangan indah",
        "🌟 Moment spesial yang tak terlupakan", 
        "💖 Terima kasih sudah menjadi bagian dari cerita ini",
        "🎈 Gallery kenangan yang dibuat dengan cinta",
        "🌈 Setiap warna dalam hidup lebih indah bersamamu"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    showMessage(randomMessage, 'love');
}

function showMessage(text, type = 'info') {
    const messageElement = document.createElement('div');
    const gradients = {
        love: 'linear-gradient(45deg, #fd79a8, #fdcb6e)',
        success: 'linear-gradient(45deg, #00b894, #00a085)',
        info: 'linear-gradient(45deg, #74b9ff, #0984e3)',
        warning: 'linear-gradient(45deg, #fdcb6e, #e17055)',
        celebration: 'linear-gradient(45deg, #667eea, #764ba2)'
    };
    
    messageElement.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: ${gradients[type] || gradients.info};
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        font-size: 1.1em;
        box-shadow: 0 15px 35px rgba(253, 121, 168, 0.4);
        z-index: 1000;
        opacity: 0;
        transition: all 0.5s ease;
        max-width: 90%;
        text-align: center;
        font-weight: 500;
    `;
    
    messageElement.textContent = text;
    document.body.appendChild(messageElement);
    
    setTimeout(() => {
        messageElement.style.opacity = '1';
        messageElement.style.transform = 'translateX(-50%) translateY(0)';
    }, 200);
    
    setTimeout(() => {
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateX(-50%) translateY(-100px)';
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 500);
    }, 4000);
}

function startPhotoSlideshow() {
    const photos = document.querySelectorAll('.photo-frame');
    if (photos.length === 0) return;
    
    let currentIndex = 0;
    
    const highlightPhoto = () => {
        photos.forEach(photo => {
            photo.style.boxShadow = '';
            photo.style.transform = '';
            photo.style.zIndex = '';
        });
        
        if (photos[currentIndex]) {
            const rotations = ['-2deg', '2deg', '-1deg', '1deg'];
            const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];
            
            photos[currentIndex].style.boxShadow = '0 25px 50px rgba(253, 121, 168, 0.5)';
            photos[currentIndex].style.transform = `rotate(${randomRotation}) scale(1.08)`;
            photos[currentIndex].style.zIndex = '10';
            photos[currentIndex].style.transition = 'all 0.5s ease';
        }
        
        currentIndex = (currentIndex + 1) % photos.length;
    };
    
    highlightPhoto();
    if (slideshowInterval) clearInterval(slideshowInterval);
    slideshowInterval = setInterval(highlightPhoto, 4000);
}

// ==================== GALLERY EFFECTS MANAGEMENT ====================
function startGalleryEffects() {
    if (heartInterval) clearInterval(heartInterval);
    heartInterval = setInterval(createFloatingHeart, 2500);
    
    setTimeout(showRandomLoveMessage, 3000);
    if (messageInterval) clearInterval(messageInterval);
    messageInterval = setInterval(showRandomLoveMessage, 25000);
    
    setTimeout(startPhotoSlideshow, 1500);
}

function stopGalleryEffects() {
    if (heartInterval) {
        clearInterval(heartInterval);
        heartInterval = null;
    }
    
    if (messageInterval) {
        clearInterval(messageInterval);
        messageInterval = null;
    }
    
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
    }
}

// ==================== EVENT LISTENERS ====================
function initializeEventListeners() {
    if (galleryBtn) {
        galleryBtn.addEventListener('click', switchToGalleryMode);
    }
    
    if (backToScrapbook) {
        backToScrapbook.addEventListener('click', (e) => {
            e.preventDefault();
            switchToScrapbookMode();
        });
    }
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    if (navLinks) {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = link.getAttribute('data-tab');
                if (tab) {
                    switchTab(tab);
                    if (navMenu && navToggle) {
                        navMenu.classList.remove('active');
                        navToggle.classList.remove('active');
                    }
                }
            });
        });
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            closeModal();
        }
    });
}

// ==================== DYNAMIC CSS ANIMATIONS ====================
function addDynamicAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes explodeParticle {
            0% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1) rotate(0deg);
            }
            100% {
                opacity: 0;
                transform: translate(calc(-50% + var(--end-x)), calc(-50% + var(--end-y))) scale(0.3) rotate(720deg);
            }
        }
        
        @keyframes sparkleFloat {
            0% {
                opacity: 0;
                transform: translateY(0px) scale(0.5) rotate(0deg);
            }
            50% {
                opacity: 1;
                transform: translateY(-30px) scale(1.2) rotate(180deg);
            }
            100% {
                opacity: 0;
                transform: translateY(-60px) scale(0.8) rotate(360deg);
            }
        }
        
        @keyframes textParticleFloat {
            0% {
                opacity: 0;
                transform: translateY(0px) scale(0.5);
            }
            20% {
                opacity: 1;
                transform: translateY(-20px) scale(1);
            }
            80% {
                opacity: 1;
                transform: translateY(-40px) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(-80px) scale(0.5);
            }
        }
        
        @keyframes heartBurst {
            0% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1) rotate(0deg);
            }
            100% {
                opacity: 0;
                transform: translate(calc(-50% + var(--heart-x)), calc(-50% + var(--heart-y))) scale(0.5) rotate(360deg);
            }
        }
        
        @keyframes floatUpCustom {
            0% {
                opacity: 0;
                transform: translateY(0px) rotate(0deg);
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                opacity: 0;
                transform: translateY(-100vh) rotate(180deg);
            }
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }

        @keyframes letterConfettiFall {
            0% {
                transform: translateY(-50px) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// ==================== CLEANUP FUNCTIONS ====================
function cleanup() {
    stopGalleryEffects();
    
    const dynamicElements = document.querySelectorAll('[style*="position: fixed"]');
    dynamicElements.forEach(el => {
        if (el.textContent.match(/[💕💖💝🌹✨💫⭐🌟🎂🎉🎈❤️🧡💛💚💙💜]/)) {
            el.remove();
        }
    });
    
    const photos = document.querySelectorAll('.photo-frame');
    photos.forEach(photo => {
        photo.style.boxShadow = '';
        photo.style.transform = '';
        photo.style.zIndex = '';
        photo.style.animation = '';
    });
    
    if (celebrationTimeout) {
        clearTimeout(celebrationTimeout);
    }
}

// ==================== INITIALIZATION ====================
let scrapbookGallery = null;
let birthdayAnimations = null;
let letterFeature = null;

function initializeGallery() {
    console.log('Gallery initialization started...');
    
    try {
        scrapbookGallery = new ScrapbookGallery();
        birthdayAnimations = new BirthdayHeaderAnimations();
        letterFeature = new LetterFeature();
        
        window.birthdayAnimations = birthdayAnimations;
        window.letterFeature = letterFeature;
        
        initializeEventListeners();
        addDynamicAnimations();
        
        // Mulai musik otomatis di gallery
        if (birthdayMusic) {
            startMusic();
        }
        
        isScrapbookMode = true;
        currentTab = 'happybirthday';
        
        console.log('Gallery initialized successfully!');
        
    } catch (error) {
        console.error('Gallery initialization failed:', error);
        setTimeout(() => {
            showMessage('Error loading gallery. Please refresh the page.', 'warning');
        }, 1000);
    }
}

// ==================== MAIN INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
    
    window.addEventListener('beforeunload', cleanup);
    
    console.log('Gallery fully loaded and ready!');
});

// ==================== EXPORT FOR DEBUGGING ====================
if (typeof window !== 'undefined') {
    window.GalleryDebug = {
        switchToGalleryMode,
        switchToScrapbookMode,
        switchTab,
        createFloatingHeart,
        showRandomLoveMessage,
        cleanup,
        scrapbookGallery: () => scrapbookGallery,
        birthdayAnimations: () => birthdayAnimations,
        letterFeature: () => letterFeature
    };
}
