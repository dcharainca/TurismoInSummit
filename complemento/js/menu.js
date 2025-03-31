$(document).ready(function() {

    $(window).on("scroll",function () {
        var bodyScroll = $(window).scrollTop();
        if(bodyScroll > 100) {
            $(".wrapper-menu").addClass("wrapper-menu-fixed");
        } else {
            $(".wrapper-menu").removeClass("wrapper-menu-fixed");
        }
    });

    $('.linkeo').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top-80
                }, 1000);
                return false;
            }
        }
    });

    $(".btnMenuBar").on('click', function() {
        $('.wrapper-hero').addClass('wrapper-hero-open');
        $('body').addClass('overflow-hidden');
    });

    $('.btn-hero-bar').on('click', function() {
        $('.wrapper-hero').removeClass('wrapper-hero-open');
        $('body').removeClass('overflow-hidden');
    });

    $('.wrapper-hero .linkeo').on('click', function(){
        $('.wrapper-hero').removeClass('wrapper-hero-open');
        $('body').removeClass('overflow-hidden');
    });
    
});