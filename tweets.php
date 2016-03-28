<?php
require_once('api_config.php');

$max = 100;
$id = $_GET['id'];

/** Perform a GET request and echo the response **/
/** Note: Set the GET field BEFORE calling buildOauth(); **/
$url = 'https://api.twitter.com/1.1/statuses/user_timeline.json';
$getfield = '?user_id='.$id.'&count='.$max;
$requestMethod = 'GET';
$twitter = new TwitterAPIExchange($settings);
$results = $twitter->setGetfield($getfield)
             ->buildOauth($url, $requestMethod)
             ->performRequest();

function process_tweets($tweet) {
    $data = array(
        'id' => $tweet->id,
        'created_at' => $tweet->created_at,
        'retweeted' => $tweet->retweeted,
        'retweet_count' => ($tweet->retweeted ? $tweet->retweeted_status->retweet_count : $tweet->retweet_count),
        'favorite_count' => ($tweet->retweeted ? $tweet->retweeted_status->favorite_count : $tweet->favorite_count),
        'user' => ($tweet->retweeted ? $tweet->retweeted_status->user : $tweet->user),
        'text' => ($tweet->retweeted ? $tweet->retweeted_status->text : $tweet->text),
    );

    if ($tweet->entities->media && $tweet->entities->media[0]->type == 'photo') {
        $data['photo'] = $tweet->entities->media[0]->media_url;
    }
    return $data;
}

$parsed_results = array_map("process_tweets", json_decode($results));

$json = json_encode($parsed_results);

header('Content-Type:application/json;charset=utf-8');
echo $json;

?>