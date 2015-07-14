<?php
/**
 * Created by PhpStorm.
 * User: vitaly
 * Date: 13.07.15
 * Time: 23:51
 */
include('db.php');

$method = $_REQUEST['act'];
if(!isset($method)) { $method = 'get'; }
$page = $_REQUEST['page'];
if(!isset($page)) { $page = 1; }
$catid = $_REQUEST['catid'];

$con = mysql_connect($dbhost, $dbuser, $dbpasswd);
if(!$con) { die('{"status":false,"message":"Error connection to db"}'); }
mysql_select_db($dbname);


switch ($method) {
    case 'get':
        get($catid, $page);
        break;
    case 'post':
        break;
    case 'put':
        break;
    case 'delete':
        break;
}

function get($catid, $page) {
    if($catid) {
        $query = 'select c.catname, q.* from categories as c, questions as q where c.id = q.catid and catid = ' . $catid . ' limit ' . (($page-1)*10) . ', 20';
        if($result = mysql_query($query)) {
            $array = array();
            while($r = mysql_fetch_assoc($result)) {
                array_push($array, $r);
            }
            echo '{"status":true,"result":'.json_encode($array).'}';
        } else { echo '{"status":false,"message":"Error executing query to db"}'; }
    } else { echo '{"status":false,"message":"Not enough parameters"}'; }
}

mysql_close($con);

?>