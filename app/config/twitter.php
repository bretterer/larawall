<?php

return [
    'query2' => '(from:@daytonwp OR @daytonwp OR #wcdayton OR (#wcdayton AND #bingo) ) AND exclude:retweets',
    'query' => '#LittleCouple exclude:retweets',
    'consumer_key'      => getenv('twitter_apikey'),
    'consumer_secret'   => getenv('twitter_apisecret'),
    'token'             => getenv('twitter_accesstoken'),
    'token_secret'      => getenv('twitter_accesstokensecret'),
    'ignore_rt'         => true
];