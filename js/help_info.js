var info_btn = $('#help-info');
info_btn.on('click',onHelpInfo);

function onHelpInfo(event)
{
	var id_help_info = +event.target.dataset.idHelpInfo;
	showHelpInfo(id_help_info);
}

function showHelpInfo( id )
{
	$.post("help_info.php",{"id":id,"type":"get"}, onSuccess, 'html');

}
function onSuccess(data)
{
	document.body.insertAdjacentHTML('beforeEnd',data);
	$('#help-info-container').show().draggable().resizable();

	var HelpInfo = $('#help-info-container');
	HelpInfo.find('#help-info-close_btn').on('click', onClose)
	HelpInfo.find('#help-info-cancle_btn').on('click', onCancle);
	HelpInfo.find('#help-info-save_btn').on('click', onSave);
	function onCancle(event)
	{
		HelpInfo.hide();
	}
	function onClose(event)
	{
		HelpInfo.hide();
	}

	function onSave(event)
	{
		var idHelpInfo = HelpInfo.find('#help-info-id').val();
		var text = HelpInfo.find('#help-info-text').val();
		$.post("help_info.php",{"id":idHelpInfo,"text":text,"type":'add'},onSuccessSave,'text');
		HelpInfo.hide();
	}
	function onSuccessSave(data)
	{
		console.log(data);
	}
}
