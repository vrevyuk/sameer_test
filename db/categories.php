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
$catid = $_REQUEST['catid'];

$con = mysql_connect($dbhost, $dbuser, $dbpasswd);
if(!$con) { die('{"status":false,"message":"Error connection to db"}'); }
mysql_select_db($dbname);


switch ($method) {
    case 'get':
        get($catid);
        break;
    case 'post':
        break;
    case 'put':
        break;
    case 'delete':
        break;
}

function get($catid) {
    if($catid) {
        $query = 'select * from categories where catid = ' . $catid;
    } else {
        $query = 'select * from categories';
    }
    if($result = mysql_query($query)) {
        $array = array();
        while($r = mysql_fetch_assoc($result)) {
            array_push($array, $r);
        }
        echo '{"status":true,"result":'.json_encode($array).'}';
    } else { echo '{"status":false,"message":"Error executing query to db"}'; }
}

mysql_close($con);

?>