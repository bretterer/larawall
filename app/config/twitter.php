<?php

return [
    'query2' => '(from:@daytonwp OR @daytonwp OR #wcdayton OR (#wcdayton AND #bingo) ) AND exclude:retweets',
    'query' => '#LittleCouple exclude:retweets',
    'consumer_key'      => getenv('twitter.apikey'),
    'consumer_secret'   => getenv('twitter.apisecret'),
    'token'             => getenv('twitter.accesstoken'),
    'token_secret'      => getenv('twitter.accesstokensecret'),
    'ignore_rt'         => true
];