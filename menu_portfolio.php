<html>
<body>

<?php
echo "start";

$dir = 'images/';
$src = $_FILES['phote']['tmp_name'];
$name =$_FILES['phote']['name'];
$name = explode(".",$name);
$name = $name[0];
if ( $_POST['newName'] <> '' )
{
	$name = $_POST['newName'];
}

$reload = $_POST['reload'];
$edit = $_POST['edit'];
$loadOneFile = $_POST['loadOneFile'];

$targ_w = $_POST['target_w'];
$targ_h = $_POST['target_h'];
$source_w = $_POST['source_w'];
$source_h = $_POST['source_h'];

$aspectRation  = $source_w / $source_h;

// quality
$jpeg_quality = 90;
// photo path
echo "part2";

if ( $reload == 'false' && $edit == 'false' && $loadOneFile == 'false' )
{	echo 'upload<br>';
	uploadFile();
} elseif ($reload == 'true') {
	echo 'reload<br>';
	reloadFile();
} elseif ($edit == 'true') {
	echo 'edit<br>';
	editFile();
} elseif ($loadOneFile == 'true') {
	loadOneFile();
}

function uploadFile()
{
	global $src, $targ_w, $targ_h, $aspectRation, $jpeg_quality, $name;

	$photo_dest = 'images/'.$name.'.jpg';
		// copy the photo from the tmp path to our path
	copy($src, $photo_dest);

	// create new jpeg image based on the target sizes
	$img_r = imagecreatefromjpeg($src);
	$dst_r = ImageCreateTrueColor( $targ_w, $targ_h );
	echo "part3";
	// crop photo
	imagecopyresampled($dst_r,$img_r,0,0,$_POST['x'],$_POST['y'], $targ_w,$targ_h,$_POST['w'],$_POST['h']*$aspectRation);
	// create the physical photo
	imagejpeg($dst_r,$src,$jpeg_quality);
	echo "part4";
	$photo_dest = 'images/'.$name.'_thumb.jpg';
	echo $photo_dest;
	copy($src, $photo_dest);
	echo "Ok";
}
function reloadFile()
{
	global $targ_w, $targ_h, $aspectRation, $jpeg_quality;
	$srcEdit = $_POST['srcName'];

	echo $srcEdit.'<br>';
	$name = explode("/",$srcEdit);
	print_r($name);
	$src = 'images/'.$name[count($name) -1 ];
	echo $src;
	$img_r = imagecreatefromjpeg($src);
	if( !$img_r )
	{
		echo ' error on imagecreatefromjpeg ';
	}

	echo " width:$targ_w, height:$targ_h ";

	$dst_r = ImageCreateTrueColor( $targ_w, $targ_h );
	if( !$dst_r )
	{
		echo ' error on ImageCreateTrueColor ';
	}
	echo "part3";
	// crop photo
	$succ = imagecopyresampled($dst_r,$img_r,0,0,$_POST['x'],$_POST['y'], $targ_w,$targ_h,$_POST['w'],$_POST['h']*$aspectRation);
	if ( !$succ)
	{
		echo ' error on imagecopyresampled ';
	}
	// create the physical photo
	$src = explode(".",$src);
	$src_r = $src[0]."_thumb.jpg";
	$succ = imagejpeg($dst_r,$src_r,$jpeg_quality);
	if ( !$succ)
	{
		echo ' error on imagejpeg ';
	}
	echo "part4";
	// $photo_dest = 'images/'.$name.'_thumb.jpg';
	// copy($src, $photo_dest);
	echo "Ok";	

}

function editFile()
{
	global $targ_w, $targ_h, $aspectRation, $jpeg_quality;
	$srcEdit = $_POST['srcName'];

	echo $srcEdit.'<br>';
	$name = explode("/",$srcEdit);

	$src = 'images/'.$name[count($name) -1 ];
	echo $src;
	$img_r = imagecreatefromjpeg($src);
	if( !$img_r )
	{
		echo ' error on imagecreatefromjpeg ';
	}

	echo " width:$targ_w, height:$targ_h ";

	$dst_r = ImageCreateTrueColor( $targ_w, $targ_h );
	if( !$dst_r )
	{
		echo ' error on ImageCreateTrueColor ';
	}
	echo "part3";
	// crop photo
	$succ = imagecopyresampled($dst_r,$img_r,0,0,$_POST['x'],$_POST['y'], $targ_w,$targ_h,$_POST['w'],$_POST['h']*$aspectRation);
	if ( !$succ)
	{
		echo ' error on imagecopyresampled ';
	}
	// create the physical photo
	$succ = imagejpeg($dst_r,$src,$jpeg_quality);
	if ( !$succ)
	{
		echo ' error on imagejpeg ';
	}
	echo "part4";
	// $photo_dest = 'images/'.$name.'_thumb.jpg';
	// copy($src, $photo_dest);
	echo "Ok";
}

function loadOneFile()
{
	global $src, $targ_w, $targ_h, $aspectRation, $jpeg_quality, $name;


	// create new jpeg image based on the target sizes
	$img_r = imagecreatefromjpeg($src);
	$dst_r = ImageCreateTrueColor( $targ_w, $targ_h );
	echo "part3";
	// crop photo
	imagecopyresampled($dst_r,$img_r,0,0,$_POST['x'],$_POST['y'], $targ_w,$targ_h,$_POST['w'],$_POST['h']*$aspectRation);
	// create the physical photo
	imagejpeg($dst_r,$src,$jpeg_quality);
	echo "part4";
	$photo_dest = 'images/'.$name.'_thumb.jpg';
	echo $photo_dest;
	copy($src, $photo_dest);
	echo "Ok";
}
?>
</body>
</html>