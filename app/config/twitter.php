<?php

return [
    'query' => '(from:@daytonwp OR @daytonwp OR #wcdayton OR (#wcdayton AND #bingo) ) AND exclude:retweets',
    'consumer_key'      => getenv('TWITTER_APIKEY'),
    'consumer_secret'   => getenv('TWITTER_APISECRET'),
    'token'             => getenv('TWITTER_ACCESSTOKEN'),
    'token_secret'      => getenv('TWITTER_ACCESSTOKENSECRET'),
    'ignore_rt'         => true
];