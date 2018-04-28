<?php

#header('Content-type: application/json')
include("curlGET.php");
#http://tina.iscpif.fr/explorerjs/php/bridgePyJava.php?unique_id=Carla__Taramasco&it=10
$unique_id = $_GET['motscles'];
$g = "";
if (!empty($_GET["g"]))
	$g="&g=".$_GET['g'];

// echo "hila";
// echo is_array($unique_id);

$url="http://localhost:2020/twitterquery_dygraph?motscles=".urlencode($unique_id).$g;
$res=remote_get_contents($url);


if(isset($_GET['callback'])) echo $_GET['callback'].'('.$res.')';
else echo $res;
// #$object = json_decode($res);
?>
