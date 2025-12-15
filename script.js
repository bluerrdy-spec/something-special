document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const nextButton = document.getElementById('next-slide-btn');
    const startButton = document.getElementById('start-button');
    const loopButton = document.getElementById('loop-button');
    const audio = document.getElementById('backgroundMusic');

    let currentSlideIndex = 0;
    const totalSlides = slides.length; // Total 14: 0 (Intro) + 11 (Content) + 1 (Feedback) + 1 (GIF) = 14

    // --- FUNGSI INTI ---

    function activateSlide(index, direction = 'next') {
        // 1. Nonaktifkan slide lama (jika ada)
        if (currentSlideIndex < totalSlides && slides[currentSlideIndex]) {
            slides[currentSlideIndex].classList.remove('active');
            // Menambahkan kelas untuk animasi keluar (geser ke kiri)
            if (currentSlideIndex !== 0 && index > currentSlideIndex) {
                 slides[currentSlideIndex].classList.add('transitioning-out');
            }
        }

        currentSlideIndex = index;
        const incomingSlide = slides[currentSlideIndex];

        // Bersihkan kelas animasi keluar dari slide sebelumnya
        slides.forEach(slide => {
            slide.classList.remove('transitioning-out');
        });

        // 2. Aktifkan slide baru
        incomingSlide.classList.add('active');
        
        // Hapus/reset kelas animasi masuk sementara agar bisa dire-trigger
        incomingSlide.classList.remove('transitioning-in');
        setTimeout(() => {
             incomingSlide.classList.add('transitioning-in'); // Trigger animasi masuk
        }, 50); // Sedikit jeda

        // 3. Update Navigasi Panah
        updateNavigationVisibility();

        // 4. Kontrol Musik (Mulai saat slide pertama diaktifkan)
        if (currentSlideIndex === 1) {
            audio.play().catch(e => console.log("Autoplay diblokir. Pengguna harus mengklik terlebih dahulu."));
        }
    }

    function goToNextSlide() {
        if (currentSlideIndex < totalSlides - 1) {
            activateSlide(currentSlideIndex + 1, 'next');
        } else {
            // Jika sudah di slide terakhir, tidak melakukan apa-apa (kecuali loop button)
            console.log("Sudah mencapai slide terakhir.");
        }
    }
    
    function updateNavigationVisibility() {
         // Tampilkan panah jika kita berada di antara slide 1 sampai 12 (sebelum slide gif terakhir)
        if (currentSlideIndex >= 1 && currentSlideIndex <= totalSlides - 2) {
            nextButton.classList.add('visible');
        } else {
            nextButton.classList.remove('visible');
        }
    }


    // --- EVENT LISTENERS ---

    // 1. Tombol Mulai (Dari Slide 0 ke Slide 1)
    startButton.addEventListener('click', () => {
        activateSlide(1, 'next');
    });

    // 2. Tombol Navigasi Panah (Untuk Slide 1 - 12)
    nextButton.addEventListener('click', goToNextSlide);

    // 3. Keyboard Arrows (Opsional, untuk navigasi cepat)
    document.addEventListener('keydown', (e) => {
        if (e.key === "ArrowRight" && nextButton.classList.contains('visible')) {
            goToNextSlide();
        } else if (e.key === "ArrowLeft" && currentSlideIndex > 1) {
            // Navigasi mundur (Ini sedikit lebih kompleks karena animasi harus dibalik)
            activateSlide(currentSlideIndex - 1, 'prev');
        }
    });
    
    // 4. Tombol Loop (Di Slide Terakhir/Slide 13)
    loopButton.addEventListener('click', () => {
        // Mulai ulang dari Slide 0
        activateSlide(0); 
        // Kosongkan semua kelas 'transitioning-out' setelah reset
        slides.forEach(slide => {
            slide.classList.remove('transitioning-out');
        });
    });
    
    // Inisialisasi: Atur slide pertama (Slide 0) sebagai aktif dan sembunyikan panah
    activateSlide(0);
});