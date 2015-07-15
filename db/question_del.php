<?php
/**
 * Created by PhpStorm.
 * User: glavnyjpolzovatel
 * Date: 13.07.15
 * Time: 13:35
 */

include('db.php');

$qid = $_REQUEST['qid'];


$con = mysql_connect($dbhost, $dbuser, $dbpasswd);
if(!$con) { die('{"status":false,"message":"Error connection to db"}'); }
mysql_select_db($dbname);

if(isset($qid)) {
    $query = "delete from questions where id = " . $qid;
    if(mysql_query($query)) {
        echo '{"status":true}';
    } else { echo '{"status":false,"message":"Error executing query to db"}'; }
}
mysql_close($con);

?>