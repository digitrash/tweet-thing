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

?>