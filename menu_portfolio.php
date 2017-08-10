<html>
<body>

<?php
echo "start ";

$dir = 'images/';
$src = $_FILES['menu-portfolio-upload_btn']['tmp_name'];

list($name,) = explode(".",$_FILES['menu-portfolio-upload_btn']['name']);

echo " name: $name ";

if ( $_POST['menu-portfolio-newName-input'] <> '' )
{
	$name = $_POST['menu-portfolio-newName-input'];
	echo " newname:$name ";
}

print_r($_FILES);
print_r($_POST);

$targ_w = $_POST['target_w'];
$targ_h = $_POST['target_h'];
$source_w = $_POST['source_w'];
$source_h = $_POST['source_h'];
$x = $_POST['x'];
$y = $_POST['y'];
$w = $_POST['w'];
$h = $_POST['h'];

$aspectRation  = $source_w / $source_h;

$jpeg_quality = 90;
// photo path
echo " uploadFile ";
uploadFile();

function uploadFile()
{
	global $src, $targ_w, $targ_h, $aspectRation, $jpeg_quality, $name, $source_h, $source_w, $x, $y, $w, $h;


	// create new jpeg image based on the target sizes
	$img_r = imagecreatefromjpeg($src);
	$dst_r = imagecreatetruecolor( $targ_w, $targ_h );
	$back_color = imagecolorallocate($dst_r, 255, 255, 255);
	imagefill($dst_r, 0, 0, $back_color);
	$delta_x = ($w - $source_w) / 2  * ($targ_w/$w);
	$delta_y = ($h - $source_h) / 2  * ($targ_h/$h);
	echo " copyresample dx: $delta_x dy: $delta_y ";
	// crop photo
	imagecopyresampled($dst_r,$img_r,$delta_x,$delta_y,$x,$y, $targ_w,$targ_h,$w,$h);
	// create the physical photo
	$photo_dest = 'images/'.$name.'.jpg';
	echo " tojpeg ";
	imagejpeg($dst_r,$photo_dest,$jpeg_quality);
	echo $photo_dest;
	echo " Ok ";
}

?>
</body>
</html>