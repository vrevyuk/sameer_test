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
$catname = $_REQUEST['catname'];
$page = $_REQUEST['$page'];

$con = mysql_connect($dbhost, $dbuser, $dbpasswd);
if(!$con) { die('{"status":false,"message":"Error connection to db"}'); }
mysql_select_db($dbname);


switch ($method) {
    case 'get':
        get($catid);
        break;
    case 'post':
        if(isset($catname)) add($catname);
        break;
    case 'put':
        change($catid, $catname);
        break;
    case 'delete':
        if(isset($catid)) delete($catid);
        break;
}

function change($catid, $catname) {
    $query = "UPDATE categories SET catname = '" . $catname . "' WHERE id = " . $catid;
    if(mysql_query($query)) {
        echo '{"status":true}';
    } else { echo '{"status":false,"message":"Error executing query to db"}'; }
}

function delete($catid) {
    $query = "delete from categories where id = " . $catid;
    if(mysql_query($query)) {
        echo '{"status":true}';
    } else { echo '{"status":false,"message":"Error executing query to db"}'; }
}

function add($catname) {
    $query = "insert into categories values (0, '" . mysql_real_escape_string($catname) . "')";
    if(mysql_query($query)) {
        echo '{"status":true}';
    } else { echo '{"status":false,"message":"Error executing query to db"}'; }
}

function get($catid) {
    if($catid) {
        $query = 'select * from categories where catid = ' . $catid;
    } else {
        $query = 'select * from categories order by id desc';
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