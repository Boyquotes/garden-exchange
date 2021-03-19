<?php
namespace App\Utils;

class AntiBots
{

    public function checkReferer($referer)
    {
        if(empty($referer)){
            return false;
        }
        else{
            if($_SERVER['APP_ENV'] == 'dev' && $referer == $_SERVER['HOST_DEV']){
                return true;
            }
            else if($_SERVER['APP_ENV'] == 'prod' && $referer == $_SERVER['HOST_PROD']){
                return true;
            }
        }
        return false;
    }

    function get_domaine($string) {
        preg_match('@^(?:http://)(?:https://)?([^/]+)@i',$string, $matches);
        //~ dump($matches);
        $host = $matches[1];
        //~ dump($host);
        return $host;
    }

    //~ public function checkTime($time)
    //~ {
        //~ dump($time);

        //~ return true;
    //~ }

    //~ check tags


}
