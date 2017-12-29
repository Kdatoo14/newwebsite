jQuery('document').ready(function ($) {

    ajaxPlayVideo();
    ajaxListVideos();

    function ajaxPlayVideo () {
        var postId = 0;
        postDataPlay( 0 );
    }

    function postDataPlay ( postId ) {
        $('.now-playing-title').html( '' );

        $.ajax({
            url: ajaxfilter.ajaxurl,
            type: 'post',
            dataType: 'json',
            data: {
                action: 'video',
                type: 'video_play',
                postId: postId
            },
            success: function( result ) {
                $('.now-playing-title').html( result.title );
                $('.video-player').html( result.player );
            }
        });
    }

    function videoItemClick () {
        $('.teaser--video a').on('click', function (ev) {
            ev.preventDefault();
            postDataPlay( $(this).data('post-id') );
            $('.video-player').html('');

            setItemPlayingOnClick( $(this) );

            var target = $('.video-player').position().top;
            $('html, body').animate({
                scrollTop: target - 130
            }, 300);
        });
    }

    function ajaxListVideos () {
        postDataList();
    }

    function postDataList ( $pageNum ) {

        $('.video-list-wrap').addClass('loading');
        $.each($('.video-list-wrap .teaser').get().reverse(), function (i, el) {
            setTimeout(function () {
                $(el).removeClass('loaded');
            }, i*50);
        } );

        if ( $pageNum != '' ) {
            $pageNum = $pageNum;
        } else {
            $pageNum = getParameterByName('page');
        }

        $.ajax({
            url: ajaxfilter.ajaxurl,
            type: 'post',
            dataType: 'json',
            data: {
                action: 'video',
                type: 'video_list',
                pageNum: $pageNum
            },
            success: function( result ) {
                var $videoWrap = $('.video-list-wrap');
                var $pagination = $('.pagination-wrap--video');

                $videoWrap.html( '' );

                $.each(result.videos, function (i, el) {
                    $videoWrap.append(el);
                });

                $.each($('.video-list-wrap .teaser'), function (i, el) {
                    setTimeout(function () {
                        $(el).addClass('loaded');
                    }, i*50);
                } );

                $pagination.html( result.pagination );
                paginationClick();

                videoItemClick();

                setItemPlayingOnLoad();

                $videoWrap.removeClass('loading');
            }
        });

    }

    function setItemPlayingOnLoad () {
        $('.teaser--video a').removeClass('playing');

        var playingVidId = $('.video-wrap').data('vid-id');
        var playingVidItem = $('.teaser--video a').attr('data-vid-id');
        if ( playingVidItem == playingVidId ) {
            $('.teaser--video a[data-vid-id='+playingVidId+']').addClass('playing');
        }
    }

    function setItemPlayingOnClick (self) {
        if ( !self.hasClass('playing') ) {
            $('.teaser--video a').removeClass('playing');
            self.addClass('playing');
        }
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

    function paginationClick () {
        $('.pagination-wrap--video .pagination-numbered a').on('click', function (ev) {
            ev.preventDefault();

            var pageNum = this.href.match(/page=(.*)/);

            postDataList( pageNum[1] );
        });
    }

});
