<?php
header('Content-Type: text/plain');
ignore_user_abort(true);
set_time_limit(0);
ini_set('memory_limit', '512M');

$z1 = new ZipArchive;
if ($z1->open('core.zip') === TRUE) {
    $z1->extractTo(__DIR__);
    $z1->close();
    @unlink('core.zip');
    echo "CORE_OK\n";
}
@unlink(__FILE__);
?>