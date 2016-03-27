<?php
ini_set('display_errors', 1);
define('__ROOT__', dirname(__FILE__));
require_once(__ROOT__.'/twitter-api-php-master/TwitterAPIExchange.php');

/** Won't be checking in actual Twitter account details **/
$settings = array(
    'oauth_access_token' => "YOUR_OAUTH_ACCESS_TOKEN",
    'oauth_access_token_secret' => "YOUR_OAUTH_ACCESS_TOKEN_SECRET",
    'consumer_key' => "YOUR_CONSUMER_KEY",
    'consumer_secret' => "YOUR_CONSUMER_SECRET"
);

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


//$data = array( 'Stuff' => 'Lots of stuff', 'query' => $query );

//$json = json_encode($data);
	
header('Content-Type:application/json;charset=utf-8');
echo $results;

?>