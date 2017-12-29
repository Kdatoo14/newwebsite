jQuery('document').ready(function ($) {

	window.mobile = window.matchMedia( "(min-width: 768px)" );
    window.mobileLarge = window.matchMedia("(min-width: 1200px)");
    // FUNCTIONS

    // NAV
    var mobMenuToggle = function() {


    	$(".nav__close-mobile-menu").on("click", function() {
    		if($(".nav--header").hasClass("nav--header-open")) {
    			$(".nav--header").removeClass("nav--header-open");
                $('body').removeClass("nav--open");
    		}
    	});

    	$(".nav__open-mobile-menu").on("click", function(e) {
            e.stopPropagation();
    		$(".nav--header").addClass("nav--header-open");
            $('body').addClass("nav--open");

            closeNav();
    	});

    }

    var closeNav = function () {
        $('.main-content').not('.nav--header-open, .nav__open-mobile-menu').on('click', function() {
            if( $('body').hasClass( 'nav--open' ) ) {
                $(".nav--header").removeClass("nav--header-open");
                $('body').removeClass("nav--open");
            }
        });
    }

    // General Accordian slide down function
    var accordian = function(className) {
        $(className).click(function(e) {
            e.preventDefault();

            var $this = $(this);

            if ($this.next().hasClass('showit')) {
                $this.next().removeClass('showit');
                $this.removeClass('arrow-rotate');
            } else {
                $this.next().toggleClass('showit');
                $this.addClass('arrow-rotate');
            }
        });
    }

    var accordianPlus = function(className) {
        var subMenuExpand = $('.menu-item-has-children > .sub-menu > .menu-item-has-children')
        subMenuExpand.append('<div class="accordian-expand"></div>');

        $(className).click(function(e) {

            var $this = $(this);

            if ($this.prev().hasClass('showit')) {
                $this.prev().removeClass('showit');
                $this.parent().find('a').removeClass('accordian-expand-close');
                $this.removeClass('arrow-rotate');
            } else {
                $this.prev().toggleClass('showit');
                $this.parent().find('a').addClass('accordian-expand-close');
                $this.addClass('arrow-rotate');
            }
        });
    }

    var accordianFilter = function(className) {

        $(className).click(function(e) {

            var $this = $(this);

            if ($this.next().hasClass('showit')) {
                $this.next().removeClass('showit');
                // $this.parent().next().removeClass('showit');
                $this.removeClass('accordian-expand-close');
            } else {
                $this.next().toggleClass('showit');
                // $this.parent().next().addClass('showit');
                $this.addClass('accordian-expand-close');
            }
        });

    }

    var readMore = function() {

        $('.product__copy-expand').click(function(e) {

            var $this = $(this);

            if ($this.prev().hasClass('showit')) {
                $this.prev().removeClass('showit');
                $this.html('Read More');
            } else {
                $this.prev().toggleClass('showit');
                $this.html('Read Less');
            }
        });
    }

    var initSwiper = function($class, $effect) {

    	var homeSwiper = new Swiper($class + " .swiper-container", {
    		effect: $effect,
    		loop: true,
    		slidesPerView: "auto",
    		spaceBetween: 10,
    		nextButton: $class +' .swiper-button-next',
    		prevButton: $class +' .swiper-button-prev',
            breakpoints: {
                768: {
                    centeredSlides: true
                }
            }

    	});
    }

    var productSwiper = function($class) {

        var params;

        if ( window.mobile.matches === true ) {
            params = {
                nextButton: $class + " .swiper-button-next",
                prevButton: $class + " .swiper-button-prev",
                spaceBetween: 10,
                onTransitionStart: productTransitionStart
            }
        } else {
            params = {
                pagination: $class + " .swiper-pagination",
                paginationType: "fraction",
                paginationHide: false,
                nextButton: $class + " .swiper-button-next",
                prevButton: $class + " .swiper-button-prev",
                spaceBetween: 10,
                onTransitionStart: productTransitionStart
            }
        }

        var galleryTop = new Swiper($class + " .gallery-top", params);

        $('.gallery-thumbs div').on( 'click', function () {
            $('.gallery-thumbs div').removeClass('active');
            $(this).addClass('active');
            galleryTop.slideTo( $(this).data('index'), 500 );
        } );

    }

    var productTransitionStart = function ( swiper ) {
        var index = swiper.activeIndex;
        $('.gallery-thumbs div').removeClass('active');
        $('.gallery-thumbs div[data-index='+index+']').addClass('active');
    }

    var bootsSwiper = function () {

        $( '.carousel--boots .swiper-container' ).each( function (i) {
            var children = $( this ).find( '.swiper-slide' ).length;
            new Swiper( $( this ), {
                slidesPerView: 4,
                spaceBetween: 10,
                nextButton: $( this ).parent().find( '.swiper-button-next' ),
                prevButton: $( this ).parent().find( '.swiper-button-prev' ),
                breakpoints: {
                    767: {
                        centeredSlides: true,
                        loop: true,
                        slidesPerView: "auto",
                    }
                },

                onInit: function ( swiper ) {
                    if ( children < 5 ) {
                        $(swiper.nextButton).addClass('swiper-button-disabled');
                        $(swiper.prevButton).addClass('swiper-button-disabled');
                    }
                }
            } );
        });

    }

    function initCalendar () {
        var $calendar = $('#calendar');
        if ( $calendar[0] ) {

            $calendar.fullCalendar({
                events: {
                    url: '/wp-content/themes/sole-supplier/inc/calendar-data.php',
                    cache: true
                },
                header: {
                    left:   'prev',
                    center: 'title',
                    right:  'next'
                },
                firstDay: 1,
                fixedWeekCount: false,
                timeFormat: 'H:mm',
                eventAfterAllRender: function () {
                    $('.calendar-cover').addClass('loaded');
                    calendarNextPrevLink();
                }
            })

        }
    }

    function calendarNextPrevLink () {
        var $calendarBtn = $('.fc-button');
        if ($calendarBtn) {
            $calendarBtn.on('click', function () {
                $('.calendar-cover').removeClass('loaded');
            });
        }
    }

    function profileRecentlyViewed () {
        $tab = window.location.hash;
        if ( $tab ) {
            profileRecentlyViewedClassUpdate( $('.profile-tabs a[href='+$tab+']'), $tab );
        }

        $('.profile-tabs a').on('click', function ( ev ) {
            $self = $(this);
            $href = $self.attr('href');

            profileRecentlyViewedClassUpdate( $self, $href );
        });
    }

    function profileRecentlyViewedClassUpdate ( $self, $href ) {
        if ( !$self.hasClass('active') ) {
            $( window ).scrollTop();

            $('.profile-tabs li').removeClass('active');
            $('.recent-content').removeClass('active');

            $self.parent('li').addClass('active');
            $($href).addClass('active');
        }
    }

    var initPopover = function() {
        var bodyClass = $('body');
        var popTrigger = $('.popover-trigger');
        var popActive = 'popover-active';


        popTrigger.on('click', function(e) {
            e.stopPropagation();

            if ( $(this).find('.popover').hasClass(popActive) ) {
                $(this).find('.popover').removeClass(popActive);
            } else   {
                $('.popover').removeClass(popActive);
                $(this).find('.popover').addClass(popActive);
            }

            closePopover();
        });

    }

    var closePopover = function () {
        $('body').not('.popover, .popover-trigger').on('click', function() {
            if( $('.popover').hasClass( 'popover-active' ) ) {
                $('.popover').removeClass( 'popover-active' );
            }
        });
    }

    // When item is not clicked then remove
    var whenNot = function(sel) {
        $('body').not(sel).on('click', function() {
            clearContent('.search--header .search-options');
        });
    }

    var loginRegisterToggle = function() {
        $('.login-link').on('click', function() {
            $('.form--register').addClass('form--register-hide');
            $('.form--login').addClass('form--login-show');
        });
        $('.register-link').on('click', function(e) {
            e.preventDefault();
            $('.form--register').removeClass('form--register-hide');
            $('.form--login').removeClass('form--login-show');
        });
    }

    var createAfilliateBtn = function() {
        var count = 0;
        $('.img-buy-now-img').each(function() {
            var affiliateURL = $(this).data('affiliateUrl');
            var affiliateLogo = $(this).data('affiliate');

            // $(this).after($(this).data('affiliate'));
            var buyBox = "<div class='article__buy-now'>" +
                "<div class='article__buy-now-logo'>" +
                    "<img src='"+affiliateLogo+"'>"+
                "</div>" +
                "<div class='article__buy-now-url'>" +
                    "<a href='"+affiliateURL+"'>" +
                        "<button class='button'>Buy Now</button>"
                    "</a>" +
                "</div>" +
            "</div>";

            $(this).after(buyBox);
        });
    }

    createAfilliateBtn();

    mobMenuToggle();

    if(window.mobileLarge.matches === false) {
        accordian('#menu-main-menu > .menu-item-has-children > a');
        accordianPlus('.menu-item-has-children > .accordian-expand');
        readMore();
    } else {
        $('.filter__inner').addClass('showit');
        $('.filter__inner').prev().addClass('arrow-rotate');
        whenNot('.search--header');
    }

    accordian('.toggle');
    accordianFilter('.filter__has-children-expand');

    if(window.mobile.matches === true) {
    	initSwiper(".carousel--home", "fade");
    }

    initSwiper(".carousel--release-dates", "slide");

    productSwiper(".carousel--product-page");

    bootsSwiper();

    initCalendar();

    profileRecentlyViewed();

    initOverlay('.overlay-trigger');
    initPopover();

    loginRegisterToggle();

    // GA Tracking
    $('.affiliate__item .affiliate__link a').on('click', function () {
        ga('send', 'event', {
            eventCategory: 'Outbound Links',
            eventAction: $(this).attr('href'),
            eventLabel: window.location.pathname,
            transport: 'beacon'
        });
    });

});


function initOverlay(sel) {

    var initClass = sel;
    var bodyClass = jQuery('body');
    var overlayOn = 'overlay--on';
    var overlayOpen = 'overlay--open';
    var closeClass = '.overlay-close';

    jQuery(initClass).on('click', function(e) {
        e.preventDefault();

        var $this = jQuery(this);
        var activeOverlay = jQuery('.'+$this.data('overlayTrigger'));

        if ( activeOverlay.selector == '.overlay--affiliate' ) {

            if ( bodyClass.hasClass(overlayOn) ) {
                bodyClass.removeClass(overlayOn);
                $this.parent().next(activeOverlay).removeClass(overlayOpen);
            } else {
                bodyClass.addClass(overlayOn);
                $this.parent().next(activeOverlay).addClass(overlayOpen);
            }

        } else if ( activeOverlay.selector == '.overlay--affiliate-home' ) {

            if ( bodyClass.hasClass(overlayOn) ) {
                bodyClass.removeClass(overlayOn);
                $this.parent().next(activeOverlay).removeClass(overlayOpen);
            } else {
                var overlayIndex = $this.parent().parent().data('swiper-slide-index');
                console.log(overlayIndex);
                bodyClass.addClass(overlayOn);
                jQuery('#overlay-index-'+overlayIndex).addClass(overlayOpen);
            }

        } else {

            if( bodyClass.hasClass(overlayOn) ) {
                bodyClass.removeClass(overlayOn);
                activeOverlay.removeClass(overlayOpen);
            } else {
                bodyClass.addClass(overlayOn);
                activeOverlay.addClass(overlayOpen);
            }

        }

        if ( jQuery(this).hasClass('search-mobile-trigger') ) {
            jQuery('.search--overlay input').focus();
        }

    });

    jQuery(closeClass).on('click', function() {
        bodyClass.removeClass(overlayOn);
        jQuery('.overlay').removeClass(overlayOpen);
        jQuery('.search--overlay input').attr('value', '');
        clearContent('.search--overlay .search-options');
    });
}

function clearContent(sel) {
    jQuery(sel).html('')
}
