<?php
$host='localhot';
$db = 'help_info';
$table = 'help_info';
$type = $_POST['type'];

$helpText='gagaga blablabala utiputi !';
if ( $type == 'get')
{
	$idHelpInfo = $_POST['id'];
$response = <<<EOS
<div id='popup-help-info'>
	<div id='help-info-container' class="help-info-container">
	<span class="help-info-close_btn"  id='help-info-close_btn'>x</span>
			<textarea cols="80" rows="30" name='help-info-text' id='help-info-text' class='help-info-text'>$helpText</textarea>
			<input type="button" name="help-info-cancle_btn" id='help-info-cancle_btn' value='Отменить' class='help-info-cancle_btn'>
			<input type='button' name='help-info-save_btn' id='help-info-save_btn' value='Сохранить' class='help-info-save_btn'>
			<input type="hidden" id="help-info-id" name="help-info-id" value="$idHelpInfo" />
	</div>
</div>
EOS;
echo $response;
}
if( $type == 'add')
{
	//add into base;
}
?>