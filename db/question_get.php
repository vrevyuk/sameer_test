<?php
/**
 * Created by PhpStorm.
 * User: vitaly
 * Date: 13.07.15
 * Time: 23:51
 */
include('db.php');

$catid = $_REQUEST['catid'];

$con = mysql_connect($dbhost, $dbuser, $dbpasswd);
if(!$con) { die('{"status":false,"message":"Error connection to db"}'); }
mysql_select_db($dbname);

if($catid) {
    $query = 'select c.catname, q.* from categories as c, questions as q where c.id = q.catid and catid = ' . $catid . ' order by q.id desc';
    if($result = mysql_query($query)) {
        $array = array();
        while($r = mysql_fetch_assoc($result)) {
            array_push($array, $r);
        }
        echo '{"status":true,"result":'.json_encode($array).'}';
    } else { echo '{"status":false,"message":"Error executing query to db"}'; }
} else { echo '{"status":false,"message":"Not enough parameters"}'; }

mysql_close($con);

?>