<?php namespace Larawall\Twitter;

use Carbon\Carbon;
use Guzzle\Service\Client;
use Config;
use Cache;
use Request;

class TwitterAPI {

    protected $client;

    public function __construct(Client $client) {
        $this->client = $client;
    }

    public function tweets() {
        $last_run = Cache::has('twitter.last_run') ? Cache::get('twitter.last_run') : 0;

        if (time() > $last_run + 5)
        {
            // variables
            $statusArray = [];

            // Setup the query string
            $query = [];
            $query['count'] = 100;
            $query['q'] = Config::get('twitter.query');
            $qs = http_build_query($query);

            // Make the http request
            $response = $this->client->get("search/tweets.json?" . $qs)->send();
            $statuses = $response->json()['statuses'];

            // build the custom array to store in the cached tweets array
            foreach($statuses as $status) {
                $statusArray[$status['id']] = $status;
            }

           // Save to tweet queue
            Cache::forever('twitter.queue', $statusArray);
            Cache::forever('twitter.last_run', time());
        }


        $requested_since_id = Request::get('since_id') ?: 0;
        $count = Request::get('count') ?: 100;
        $queue = array_slice(Cache::get('twitter.queue'), 0, $count);
        $tweets = [];
        $max_id = 0;


        foreach($queue as $id => $tweet) {
            if($tweet['id_str'] > $max_id) {
                $max_id = $tweet['id_str'];
            }
            if($tweet['id_str'] > $requested_since_id) {
                $tweets['statuses'][] = $tweet;
            }
        }

        $tweets['max_id'] = $max_id;

        return array_reverse($tweets);
    }

    public function user_timeline() {
        $response = $this->client->get("statuses/user_timeline.json?" . $_SERVER['QUERY_STRING'])->send();

        return $response->getBody();
    }

    public function statuses() {

        $response = $this->client->get("lists/statuses.json?" . $_SERVER['QUERY_STRING'])->send();

        return $response->getBody();
    }

    public function favorites() {

        $response = $this->client->get("favorites/list.json?" . $_SERVER['QUERY_STRING'])->send();

        return $response->getBody();
    }

    public function retweeted_by_user() {

        $response = $this->client->get("statuses/retweeted_by_user.json?" . $_SERVER['QUERY_STRING'])->send();

        return $response->getBody();
    }



}