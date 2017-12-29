jQuery('document').ready(function ($) {

    calendarDatePicker();

    function calendarDatePicker () {

        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var firstDay = new Date(y, m, 1);
        var lastDay = new Date(y, m + 1, 0);

        var start = moment(firstDay);
        var end = moment(lastDay);

        $('.calendar__date-range div[name="date-picker"]').daterangepicker({
            "startDate": start,
            "endDate": end,
            "autoApply": true,
            "ranges": {
               'Today': [moment(), moment()],
               'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
               'Last 7 Days': [moment().subtract(6, 'days'), moment()],
               'Last 30 Days': [moment().subtract(29, 'days'), moment()],
               'This Month': [moment().startOf('month'), moment().endOf('month')],
               'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            "parentEl": "calendar__date-range",
            "opens": "left",
            "showCustomRangeLabel": false,
            "alwaysShowCalendars": true
        }, function(start, end, label) {
            $('.calendar__date-result').html(start.format('MMM Do') + ' - ' + end.format('MMM Do'))
            postData( start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD') );
        });

    }

    function postData ( startDate, endDate ) {
        $('.release-dates-cover').addClass('loading');

        $.ajax({
            url: ajaxfilter.ajaxurl,
            type: 'post',
            data: {
                action: 'calendar',
                type: 'calendar',
                startDate: startDate,
                endDate: endDate
            },
            success: function( result ) {
                $('#calendar-list').html( result );
                $('.release-dates-cover').removeClass('loading');
            }
        });
    }

});
