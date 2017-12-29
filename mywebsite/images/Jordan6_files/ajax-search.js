jQuery('document').ready(function ($) {

    if( window.mobileLarge.matches ) {
        ajaxSearch('.header');
    } else {
        ajaxSearch('.overlay');
    }

    function ajaxSearch ( hook ) {

        // $(hook + ' #searchform #search_key').on('input', debounce(function () {
        //     var val = this.value;
        //     var options = $(hook + ' .search-options');

        //     if ( val != '' && val.length > 2 ) {
        //         postData( val, hook );
        //     } else {
        //         options.html('');
        //     }
        // }, 300 ));

    }

    function postData ( searchTerm, hook ) {

        $.ajax({
            url: ajaxfilter.ajaxurl,
            type: 'post',
            data: {
                action: 'search',
                type: 'search',
                search: searchTerm
            },
            success: function( result ) {
                $(hook + ' .search-options').html(
                    '<ul>' +
                        result +
                    '</ul>'
                );

                if ( hook == '.header' ) {
                    $(hook + ' .teaser').addClass('teaser--search');
                } else if (hook == '.overlay') {
                    $(hook + ' .teaser').addClass('teaser--search-mobile');
                }
            }
        });
    }

    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

});
