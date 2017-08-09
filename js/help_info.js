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
	$('#popup-help-info').show();

	var popupHelpInfo = $('#popup-help-info');
	popupHelpInfo.find('#help-info-close_btn').on('click', onClose)
	popupHelpInfo.find('#help-info-cancle_btn').on('click', onCancle);
	popupHelpInfo.find('#help-info-save_btn').on('click', onSave);
	function onCancle(event)
	{
		popupHelpInfo.hide();
	}
	function onClose(event)
	{
		popupHelpInfo.hide();
	}

	function onSave(event)
	{
		var idHelpInfo = popupHelpInfo.find('#help-info-id').val();
		var text = popupHelpInfo.find('#help-info-text').html();
		$.post("help_info.php",{"id":idHelpInfo,"text":text,"type":'add'});
		popupHelpInfo.hide();
	}
}
