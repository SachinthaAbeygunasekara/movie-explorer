var swiper = new Swiper(".movieSwiper", {
    loop: true,
    centeredSlides: true,
    slidesPerView: 3.2,
    spaceBetween: 10,
    grabCursor: true,
    speed: 650,

    autoplay: {
        delay: 2500,
        disableOnInteraction: false
    },

    keyboard: {
        enabled: true,
        onlyInViewport: true
    },

    mousewheel: {
        forceToAxis: true
    },

    breakpoints: {
        0: { slidesPerView: 1 },
        576: { slidesPerView: 2 },
        992: { slidesPerView: 3 },
        1200: { slidesPerView: 3.2 }
    }
});
