<?php
require_once('api_config.php');

$query = $_GET['q'];

/** Perform a GET request and echo the response **/
/** Note: Set the GET field BEFORE calling buildOauth(); **/
$url = 'https://api.twitter.com/1.1/users/search.json';
$getfield = '?q='.$query;
$requestMethod = 'GET';
$twitter = new TwitterAPIExchange($settings);
$results = $twitter->setGetfield($getfield)
             ->buildOauth($url, $requestMethod)
             ->performRequest();

header('Content-Type:application/json;charset=utf-8');
echo $results;

?>