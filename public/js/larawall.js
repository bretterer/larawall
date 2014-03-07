var larawall = {
    tweets : {
        tweet_timer : '',
        display_timer : '',
        since_id : 0,
        queue : [],
        init : function() {},
        getNewTweets : function() {},
        queueNextTweet : function() {},
        renderHTML : function() {},
        displayTweet : function(renderedTweet) {}
    },
    schedule : {
        list : [],
        $schedules : '',
        lastDue : 0,
        timer : '',
        rotation : '',
        init : function() {},
        scheduleRun : function() {},
        nextSchedule : function() {},
        previousSchedule : function() {},
        rotateScheduleGroup : function() {},
        findNextSchedule : function (number) {},
        showSchedule : function (findNextSession) {},
        parseTime : function() {}
    },
    sponsors : {
        rotation : '',
        init : function() {},
        rotateSponsors : function() {}
    },
    utility : {}
}

larawall.tweets.init = function() {
    larawall.tweets.getNewTweets();
    larawall.tweets.tweet_timer = setInterval(larawall.tweets.getNewTweets, 10000);

    larawall.tweets.queueNextTweet();
    larawall.tweets.display_timer = setTimeout(larawall.tweets.loopQueue(), 2000);

}

larawall.tweets.getNewTweets = function() {

    var count = '';
    if(larawall.tweets.since_id == 0) {
        count = '&count=10';
    }
    $.getJSON('twitter/search?since_id=' + larawall.tweets.since_id + count, function(data) {

        if(data.statuses !== undefined && data.statuses.length > 0) {

            if(data.max_id > larawall.tweets.since_id) {
                larawall.tweets.since_id = data.max_id;
            }
            statuses = data.statuses.reverse();
            $.each(data.statuses, function(index, value) {
                larawall.tweets.queue.push(value);
            });
        }
    });
}

larawall.tweets.loopQueue = function() {
    var plus = 1000;
    if(larawall.tweets.queue.length > 15) {
        var plus = 100;
    }
        var rand = Math.round(Math.random() * (3000 - 500)) + plus;
//        console.log(rand);
        setTimeout(function() {
            larawall.tweets.queueNextTweet();
            larawall.tweets.loopQueue();
        }, rand);

}

larawall.tweets.queueNextTweet = function() {
    if(larawall.tweets.queue[0] !== undefined) {
        larawall.tweets.renderHTML(larawall.tweets.queue[0]);
        larawall.tweets.queue.shift();
    }

}

larawall.tweets.renderHTML = function(tweet) {

    var values = tweet.created_at.split(" "),
        created = new Date(Date.parse(values[1] + " " + values[2] + ", " + values[5] + " " + values[3] + " GMT"));

    var html = '<li><div class="tweet">';
    html += '<div class="vcard"><a href="http://twitter.com/' + tweet.user.screen_name + '" class="url"><img style="height: 48px; width: 48px;" alt="' + tweet.user.name + '" class="photo fn" height="48" src="' + tweet.user.profile_image_url + '" width="48" /></a></div>';
    html += '<div class="hentry"><strong><a href="http://twitter.com/';
    html += tweet.user.screen_name + '" ';
    html += 'title="' + tweet.user.name + '">' + tweet.user.screen_name + '</a></strong> ';
    html += '<span class="entry-content">';
    html += tweet.text; //twitterlib.expandLinks(tweet));
    html += '</span> <span class="meta entry-meta"><a href="http://twitter.com/' + tweet.user.screen_name;
    html += '/status/' + tweet.id_str + '" class="entry-date" rel="bookmark"><span class="published" title="';
    html += tweet.created_at + '">' + larawall.utility.parseDate(created) + ' ' + larawall.utility.parseTime(created) + '</span></a>';
    if (tweet.retweetedby) html += ' <span>retweeted by ' + tweet.retweetedby.screen_name + '</span>';

    if (tweet.entities && tweet.entities.media && tweet.entities.media.length) {
        tweet.entities.media.forEach(function(data) {
            html += '<div class="pic-wrapper"><img class="pic" id="pic' + data.id_str + '" src="' + data.media_url + '"></div>';
        });
    }


    html += '</span></div></div></li>';

    larawall.tweets.displayTweet(html);
}

larawall.tweets.displayTweet = function(renderedTweet) {
    $('.tweets').prepend(renderedTweet);

}



larawall.schedule.init = function() {
    larawall.schedule.$schedules = $('.sessions > .session-group').each(function () {
        larawall.schedule.list[this.getAttribute('data-time')] = $(this);
    });

    larawall.schedule.scheduleRun();

    larawall.schedule.rotateScheduleGroup();
}

larawall.schedule.scheduleRun = function() {
    clearInterval(larawall.schedule.timer);
    larawall.schedule.showSchedule(larawall.schedule.findNextSchedule(5));
    larawall.schedule.timer = setInterval(larawall.schedule.scheduleRun, 5000);
}

larawall.schedule.nextSchedule = function() {
    var keys = Object.keys(larawall.schedule.list);
    var i = keys.indexOf(larawall.schedule.lastDue) + 1;
    if (i > keys.length-1) i = 0;

    clearInterval(larawall.schedule.timer);
    clearInterval(larawall.schedule.rotation);
    larawall.schedule.showSchedule(keys[i]);
//    larawall.schedule.rotateScheduleGroup();
}

larawall.schedule.previousSchedule = function() {
    var keys = Object.keys(larawall.schedule.list);
    var i = keys.indexOf(larawall.schedule.lastDue) - 1;

    if (i == -1) i = keys.length - 1;
    clearInterval(larawall.schedule.timer);
    clearInterval(larawall.schedule.rotation);
    larawall.schedule.showSchedule(keys[i]);
//    larawall.schedule.rotateScheduleGroup();
}

larawall.schedule.rotateScheduleGroup = function() {
    var $sessionGroup = $('.sessions > .session-group:visible > .session');

    if ($sessionGroup.length >= 1) {
        var current = 0,
            length = $sessionGroup.length;

        var show = function () {
            var $current = $sessionGroup.removeClass('show').eq(current % length).addClass('show');
            current++;
        };

        show();
        clearInterval(larawall.schedule.rotation);
        larawall.schedule.rotation = setInterval(show, 4500);
    }
}

larawall.schedule.findNextSchedule = function(delay) {
    var delay = delay ? delay : 0,
        time = (new Date()).getTime(),
        list = Object.keys(larawall.schedule.list).sort();

    for (var i = 0; i < list.length; i++) {
        var s;
        s = list[i];
        if ((larawall.schedule.parseTime(s) + delay) > time) break;
    }

    return s;

}

larawall.schedule.showSchedule = function(due) {

    if (due != larawall.schedule.lastDue) {
        larawall.schedule.lastDue = due;
        larawall.schedule.$schedules.hide();
        larawall.schedule.list[due].show();
        $('#schedule').attr('data-time', due);
        larawall.schedule.rotateScheduleGroup();
    }
}

larawall.schedule.parseTime = function(t) {
        var d = new Date();
        d.setHours(t.substr(0, 2));
        d.setMinutes(t.substr(2, 2));

        return d.getTime();
}



larawall.sponsors.init = function() {
    larawall.sponsors.rotateSponsors();
}

larawall.sponsors.rotateSponsors = function() {
    var $sponsors = $('.sponsors .sponsor');

    if ($sponsors.length > 1) {
        var current = 0,
            length = $sponsors.length;

        var show = function () {
            var $current = $sponsors.removeClass('show').eq(current % length).addClass('show');
            current++;
        };

        show();
        larawall.sponsors.rotation = setInterval(show, 5000);

    }

}



larawall.utility.parseTime = function(date) {
    var hour = date.getHours(),
        min = date.getMinutes() + "",
        ampm = 'AM';

    if (hour == 0) {
        hour = 12;
    } else if (hour == 12) {
        ampm = 'PM';
    } else if (hour > 12) {
        hour -= 12;
        ampm = 'PM';
    }

    if (min.length == 1) {
        min = '0' + min;
    }

    return hour + ':' + min + ' ' + ampm;
}

larawall.utility.parseDate  = function(date) {
    var monthDict = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var mon = monthDict[date.getMonth()],
        day = date.getDate()+'',
        dayi = ~~(day),
        year = date.getFullYear(),
        thisyear = (new Date()).getFullYear(),
        th = 'th';

    // anti-'th' - but don't do the 11th, 12th or 13th
    if ((dayi % 10) == 1 && day.substr(0, 1) != '1') {
        th = 'st';
    } else if ((dayi % 10) == 2 && day.substr(0, 1) != '1') {
        th = 'nd';
    } else if ((dayi % 10) == 3 && day.substr(0, 1) != '1') {
        th = 'rd';
    }

    if (day.substr(0, 1) == '0') {
        day = day.substr(1);
    }

    return mon + ' ' + day + th + (thisyear != year ? ', ' + year : '');
}