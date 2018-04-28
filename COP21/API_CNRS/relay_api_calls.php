<?php
// Relay client's needs for queries on api.iscpif.fr
//                      so as to do them from our server

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// echo '<h4>INSIDE</h4><br>' ;

// retrieve passed params
$query_array = isset($_GET["q"]) ? $_GET["q"] : ['__noquery__'] ;  // ex: ['grassland','ocean acidification']
$count = isset($_GET["count"]) ? $_GET["count"] : 3 ;
$since = isset($_GET["since"]) ? $_GET["since"] : '1990-01-01T00%3A00%3A00.000Z' ;
$until = isset($_GET["until"]) ? $_GET["until"] : '2016-01-01T00%3A00%3A00.000Z' ;

$jsonoutput = tweets_proxy($query_array, $count, $since, $until) ;

header('Content-Type: application/json');
echo $jsonoutput;

/*
 * Relay to query iscpif *tweets* API
 *
 * ex: https://api.iscpif.fr/1/climate/search/tweets/articles.json?q%5B%5D=forest&since=2015-03-30T00%3A00%3A00.000Z&until=2016-06-06T00%3A00%3A00.000Z&count=4
 */
function tweets_proxy ($query_array, $count, $since, $until)  {
    // target url to relay to
    $url = 'https://api.iscpif.fr/1/climate/search/tweets/articles.json' ;

    // url query array params
    $url .= "?q[]=". join('&q[]=', array_map("quotez", $query_array)) ;
    // ex: ...articles.json?q[]="grassland"&q[]="ocean acidification"

    // url other inline params
    $url .= "&since=". $since ;
    $url .= "&until=". $until ;
    $url .= "&type=2" ;
    $url .= "&count=". $count ;

    // like ajax but with just the contents
    $response_contents = file_get_contents($url) ;

    return $response_contents ;
}

/* quotes a string and converts any ' ' to '+'
 */
function quotez ($a_string) {
    return '"'.str_replace(' ', '+',$a_string).'"' ;
}

?>
