jQuery('document').ready(function ($) {

    var $products = $('#products');
    var minPrice = 0;
    var maxPrice = 650;
    var slider = $('.price-slider')[0];

    if ( $products[0] ) {
        priceSlider();
        ajaxFilter();
    }

    function ajaxFilter () {

        if ( getParameterByName('brand') ) {
            var brandsArray = getParameterByName('brand').split(',');
        } else {
            var brandsArray = [];
        }

        if ( getParameterByName('colour') ) {
            var coloursArray = getParameterByName('colour').split(',');
        } else {
            var coloursArray = [];
        }

        if ( getParameterByName('stock') ) {
            var stockArray = getParameterByName('stock').split(',');
        } else {
            var stockArray = [];
        }

        if ( getParameterByName('min_price') ) {
            var minPrice = getParameterByName('min_price');
        } else {
            var minPrice = 0;
        }

        if ( getParameterByName('max_price') ) {
            var maxPrice = getParameterByName('max_price');
        } else {
            var maxPrice = 650;
        }

        $('.check').change(function () {

            // BRANDS
            if ( getParameterByName('brand') ) {
                brandsArray = getParameterByName('brand').split(',');
            } else {
                brandsArray = [];
            }

            if ( $(this).hasClass('check-brand') ) {

                if ( $(this).is(":checked") ) {
                    brandsArray.push( $(this).val() );
                    ga( 'send', 'event', 'filter', 'brands', $(this).val() );
                } else {
                    var itemRemove = brandsArray.indexOf( $(this).val() );
                    brandsArray.splice( itemRemove, 1 );
                }

            }

            // COLOURS
            if ( getParameterByName('colour') ) {
                coloursArray = getParameterByName('colour').split(',');
            } else {
                coloursArray = [];
            }

            if ( $(this).hasClass('check-colour') ) {

                if ( $(this).is(":checked") ) {
                    coloursArray.push( $(this).val() );
                    ga( 'send', 'event', 'filter', 'colour', $(this).val() );
                } else {
                    var itemRemove = coloursArray.indexOf( $(this).val() );
                    coloursArray.splice( itemRemove, 1 );
                }

            }

            // STOCK
            if ( getParameterByName('stock') ) {
                stockArray = getParameterByName('stock').split(',');
            } else {
                stockArray = [];
            }
            if ( $(this).hasClass('check-stock') ) {

                if ( $(this).is(":checked") ) {
                    stockArray.push( $(this).val() );
                    ga( 'send', 'event', 'filter', 'stock', $(this).val() );
                } else {
                    var itemRemove = stockArray.indexOf( $(this).val() );
                    stockArray.splice( itemRemove, 1 );
                }

            }

            postData( JSON.stringify(brandsArray), JSON.stringify(coloursArray), JSON.stringify(stockArray), minPrice, maxPrice );
        })

        slider.noUiSlider.on('end', function () {
            minPrice = $('.price-slider-value-low span').text().replace('.00', '');
            maxPrice = $('.price-slider-value-high span').text().replace('.00', '');

            ga( 'send', 'event', 'filter', 'min price', minPrice );
            ga( 'send', 'event', 'filter', 'max price', maxPrice );

            postData( JSON.stringify(brandsArray), JSON.stringify(coloursArray), JSON.stringify(stockArray), minPrice, maxPrice );
        });

    }

    function postData ( brands, colours, stock, minPrice, maxPrice ) {

        $('.release-dates-cover').addClass('loading');

        var urlParams = new URLSearchParams( window.location.search );
        var searchParam = urlParams.get( 'search_key' );

        $.ajax({
            url: ajaxfilter.ajaxurl,
            type: 'post',
            dataType: 'json',
            data: {
                action: 'filter',
                type: 'filter',
                brands: brands,
                colours: colours,
                stock: stock,
                minPrice: minPrice,
                maxPrice: maxPrice,
                search: searchParam
            },
            success: function( result ) {
                updateUrl( searchParam, brands, colours, stock, minPrice, maxPrice );

                var $products = $('#products');
                var $pagination = $('.pagination-wrap');
                $products.html('');

                $.each(result.products, function (i, el) {
                    $products.append(el);
                });

                $('.release-dates-cover').removeClass('loading');

                initOverlay('.overlay-trigger');

                $pagination.html( result.pagination );
            }
        });
    }

    function updateUrl ( search, brands, colours, stock, minPrice, maxPrice ) {
        if ( search == null ) {
            search = '';
        }

        var query = [];

        query[0] = 'search_key=' + search;
        query[1] = 'brand=' + JSON.parse(brands).join(',');
        query[2] = 'colour=' + JSON.parse(colours).join(',');
        query[3] = 'stock=' + JSON.parse(stock).join(',');
        query[4] = 'min_price=' + minPrice;
        query[5] = 'max_price=' + maxPrice;

        var queryString = query.join('&');

        var newUrl = '/release-dates/?' + queryString;
        history.pushState(null, null, newUrl);
    }

    function removeFromArray ( array, value ) {
        var index = array.indexOf( value );
        if (index > -1) {
            array.splice( index, 1 );
        }
        return array;
    }

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function priceSlider () {
        var priceValues = [
            $('.price-slider-value-low span')[0],
            $('.price-slider-value-high span')[0]
        ];

        var startMin, startMax;

        if ( getParameterByName('min_price') && getParameterByName('max_price') ) {
            startMin = getParameterByName('min_price');
            startMax = getParameterByName('max_price');
        } else {
            startMin = minPrice;
            startMax = maxPrice;
        }

        noUiSlider.create(slider, {
            start: [ startMin, startMax ],
            step: 20,
            range: {
                'min': minPrice,
                'max': maxPrice
            }
        });

        slider.noUiSlider.on('update', function( values, handle ) {
            priceValues[handle].innerHTML = values[handle];
        });
    }


});

// SET REMINDER
function notifyAvailable ( id, user, type ) {
    var data = {
        'action': 'set_shoe_reminder',
        'shoe_id': id,
        'user_id': user,
        'type': 'available'
    };


    jQuery.post( ajaxfilter.ajaxurl, data, function( response ) {
        if( response.trim() == 'true' ) {
            jQuery('.reminder_ico[data-shoe='+id+']').toggleClass('available');
            jQuery('.reminder_ico[data-shoe='+id+']').addClass('reminder_active').removeClass('reminder_inactive');
        }
    } );
};

function notifyRelease ( id, user, type ) {
    var data = {
        'action': 'set_shoe_reminder',
        'shoe_id': id,
        'user_id': user,
        'type': 'release'
    };

    jQuery.post( ajaxfilter.ajaxurl, data, function( response ) {
        if( response.trim() == 'true' ) {
            jQuery('.reminder_ico[data-shoe='+id+']').toggleClass('release');
            jQuery('.reminder_ico[data-shoe='+id+']').addClass('reminder_active').removeClass('reminder_inactive');
        }
    } );
};

// ADD FAVOURITE
var addProductToFavourite = function ( id ) {
    var data = {
        'action': 'set_shoe_favourite',
        'shoe_id': id,
    };

    jQuery('.product-add-to-fav-btn[data-shoe='+id+']').addClass('fav-loading');

    jQuery.post( ajaxfilter.ajaxurl, data, function( response ) {
        jQuery('.product-add-to-fav-btn[data-shoe='+id+']').removeClass('fav-loading');
        var label = jQuery('.product-add-to-fav-btn[data-shoe='+id+']').find('.product-add-to-fav-label');
        if( response.trim() == 'set' ) {
            jQuery('.product-add-to-fav-btn[data-shoe='+id+']').addClass('fav-active');
            label.html('<i class="fa fa-check"></i> Added to favourites');
        } else if( response.trim() == 'unset' ) {
            jQuery('.product-add-to-fav-btn[data-shoe='+id+']').removeClass('fav-active');
            label.html('<i class="fa fa-check"></i> Removed from favourites');
        }
        label.slideDown();
        var label_timer = setInterval( function () {
            label.slideUp();
            clearInterval( label_timer );
        }, 2000);
    } );
};
