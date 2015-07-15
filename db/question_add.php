<?php
/**
 * Created by PhpStorm.
 * User: glavnyjpolzovatel
 * Date: 13.07.15
 * Time: 13:35
 */

include('db.php');

$method = $_REQUEST['act'];
if(!isset($method)) { $method = 'get'; }
$catid = $_REQUEST['formCatId'];
$question = $_REQUEST['question'];
$answer1 = $_REQUEST['answer1'];
$answer2 = $_REQUEST['answer2'];
$answer3 = $_REQUEST['answer3'];
$answer4 = $_REQUEST['answer4'];
$answer5 = $_REQUEST['answer5'];
$correctAnswer = $_REQUEST['correctAnswer'];


$con = mysql_connect($dbhost, $dbuser, $dbpasswd);
if(!$con) { die('{"status":false,"message":"Error connection to db"}'); }
mysql_select_db($dbname);

if(isset($catid) && isset($question) && isset($answer1) && isset($answer2) && isset($answer3) && isset($answer4) && isset($answer5) && isset($correctAnswer)) {
    $query = "insert into questions values (0, "
        . "'" .$catid . "', "
        . "'" .mysql_real_escape_string($answer1) . "', "
        . "'" .mysql_real_escape_string($answer2) . "', "
        . "'" .mysql_real_escape_string($answer3) . "', "
        . "'" .mysql_real_escape_string($answer4) . "', "
        . "'" .mysql_real_escape_string($answer5) . "', "
        . "'" .$correctAnswer . "', "
        . "'" .mysql_real_escape_string($question) . "'"
        . ")";
    //echo $query;
    if(mysql_query($query)) {
        echo '{"status":true}';
    } else { echo '{"status":false,"message":"Error executing query to db"}'; }
}
mysql_close($con);

?>