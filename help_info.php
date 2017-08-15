<?php
$user = "root";
$password = "4995";
$host='localhot';
$database = 'test';
$table = 'help_tbl';
$type = $_POST['type'];
$idHelpInfo = $_POST['id'];

$bd = mysql_connect($hostname, $user, $password) or die("Opps some thing went wrong");
mysql_select_db($database, $bd) or die("Opps some thing went wrong");

if ( $type == 'get')
{
	$helpText='error';
	$strQuery = "select help from help_tbl where id=".$idHelpInfo;
	$result = mysql_query($strQuery);
	if( !$result)
	{
		die("невеный запрос:".mysql_error());
	}
	$row = mysql_fetch_assoc($result);
	if ( !$row )
	{
		die("нет данных:".mysql_error());
	}
	$helpText = $row["help"];

$response = <<<EOS
	<div id='help-info-container' class="help-info-container">
	<span class="help-info-close_btn"  id='help-info-close_btn'>x</span>
			<input type="button" name="help-info-cancle_btn" id='help-info-cancle_btn' value='Отменить' class='help-info-cancle_btn'>
			<input type='button' name='help-info-save_btn' id='help-info-save_btn' value='Сохранить' class='help-info-save_btn'>
			<input type="hidden" id="help-info-id" name="help-info-id" value="$idHelpInfo" />
			<textarea cols="50" rows="20" name='help-info-text' id='help-info-text' class='help-info-text'>$helpText</textarea>
	</div>
EOS;
	mysql_free_result($result);
	echo $response;
}
if( $type == 'add')
{
	$helpText = $_POST['text'];//add into base;
	$strQuery = "update `help_tbl` set `help`='".mysql_escape_string($helpText)."' where `id`=".$idHelpInfo;
	echo $strQuery;
	$result = mysql_query($strQuery);
	if( !$result)
	{
		die("не обновилось:".mysql_error());
	}
	mysql_free_result($result);
	echo ' ok';
}
?>