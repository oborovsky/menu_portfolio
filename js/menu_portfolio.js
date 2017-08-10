/**
*class Crop_Form инициализируется options, содержащий JQuery объект elem,
*преставляющий сам widget
*/
function MenuPortfolioForm(options)
{
	var elem = options.elem;
	var open_btn = options.open_btn;

	var TARGET_W = options.target_w || 200;
	var TARGET_H = options.target_h || 200;
	var source_w = options.source_w || 200;
	var source_h = options.source_h || 200;	
	var sizeImage = options.sizeImage || 400;
	var sizeFix = false;
	var cropFix = false;

	this.jcrop_api = null;
	var self = this;

	elem.on('change','#menu-portfolio-upload_btn',onLoadFile);
	elem.on('click','#menu-portfolio-reset_btn', onReset);
	elem.on('click','#menu-portfolio-submit_btn', onSave);
	elem.on('click','#menu-portfolio-close_btn',onClose);
	elem.on('input','#menu-portfolio-newName-input',onChangeName);
	elem.on('click','#menu-portfolio-size-fix',onSizeFix);
	elem.on('click','#menu-portfolio-crop-fix',onCropFix);
	elem.on('input','#menu-portfolio-size-width', onSizeWidth);
	elem.on('input','#menu-portfolio-size-height', onSizeHeight);
	// elem.find('#menu-portfolio-crop-width').on('input',onCropWidth);
	// elem.on('click','#menu-portfolio-crop-width', onCropWidth);
	// elem.on('input','#menu-portfolio-crop-height', onCropHeight);
	// elem.find('#crop-form').on('blur','[type=text]', onCropChange);

	open_btn.on('click', onOpen); 
	//обработчик для таблицы уже загруженных картинок
	
	function onLoadFile(event)
	{
		loadFile(event.target.files);
	}

	function onReset(event)
	{
		clear();
	}
	function onSave(event)
	{
		close();
	}
	function onClose(event)
	{
		close();
	}

	function onOpen()
	{
		open();
	}

	function onChangeName(event)
	{
		setNewName(event.target.value);
	}
	function onSizeFix(event)
	{
		sizeFix = !sizeFix;
		event.target.classList.toggle('sprit-icons-zamok');
		event.target.classList.toggle('sprit-icons-zamok-close');
		event.preventDefault();
	}
	function onCropFix(event)
	{
		cropFix = !cropFix;
		var span = event.target;
		if ( span.tagName != 'SPAN') 
		{
			span = span.children[0];
		}
		var aspectRatio = (cropFix) ? 1 : 0;
		if(self.jcrop_api ) 
		{
			self.jcrop_api.setOptions({aspectRatio:aspectRatio});
		}
		span.classList.toggle('menu-portfolio-black');
		event.preventDefault();
	}
	function onSizeWidth(event)
	{
		var aspectRatio = source_w / source_h;
		var value = event.target.value;
		if (sizeFix) 
		{
			var sizeHight = elem.find('#menu-portfolio-size-height');
			var valueHeight = Math.floor(value / aspectRatio);
			sizeHight.val(valueHeight);
			TARGET_H = valueHeight;
		}
		TARGET_W = value;
	}
	function onSizeHeight(event)
	{
		var aspectRatio = source_w / source_h;
		var value = event.target.value;
		if (sizeFix) 
		{
			var sizeWidth = elem.find('#menu-portfolio-size-width');
			var valueWidth = Math.floor(value * aspectRatio);
			sizeWidth.val(valueWidth);
			TARGET_W = valueWidth;
		}	
		TARGET_H = value;
	}
	function onCropWidth(event)
	{
		var value = parseInt(event.target.value);
		var x = parseInt(elem.find('#x').val());
		var y = parseInt(elem.find('#y').val());
		var h = parseInt(elem.find('#h').val());

		elem.find('#w').val(value);	

		if (cropFix) 
		{
			var cropHight = elem.find('#menu-portfolio-crop-height');
			cropHight.val(value);
			elem.find('#h').val(value);
			if (self.jcrop_api)
			{
				self.jcrop_api.setSelect([x,y,value,value]);
			}
		}
		else
		{
			if (self.jcrop_api)
			{
				self.jcrop_api.setSelect([x,y,value,h]);
			}
		}
	}

	function onCropHeight(event)
	{
		var value = parseInt(event.target.value);
		var x = parseInt(elem.find('#x').val());
		var y = parseInt(elem.find('#y').val());
		var w = parseInt(elem.find('#w').val());

		elem.find('#h').val(value);		

		if (cropFix) 
		{
			var cropWidth = elem.find('#menu-portfolio-crop-width');
			cropWidth.val(value);
			elem.find('#w').val(value);
			self.jcrop_api.setSelect([x,y,value,value]);
		}
		else
		{
			self.jcrop_api.setSelect([x,y,w,value]);
		}
	}
	function onCropChange(event)
	{
		var target = $(event.target);
		var x = parseInt(elem.find('#x').val());
		var y = parseInt(elem.find('#y').val());
		var h = parseInt(elem.find('#menu-portfolio-crop-height').val());
		var w = parseInt(elem.find('#menu-portfolio-crop-width').val());
		if ( self.jcrop_api)
		{
			self.jcrop_api.setSelect([x,y,w,h]);	
		}

	}
	//==========================================
	function loadFile(files)
	{
	
		var file = files[0];
		var name = file.name;

		var img1 = document.createElement('img');
	

		img1.classList.add('obj');
		img1.file = file;
		img1.width = sizeImage;
		
		var base_name = name.split('.');
		var newName = elem.find('#menu-portfolio-newName-input').val();
		if (newName.length > 0 ) 
		{
			base_name[0] = newName;
		}

		elem.find('#menu-portfolio-img').empty().append($(img1));

		var reader = new FileReader();

		reader.onload = onLoadReader([img1]);
		reader.readAsDataURL(file);

		function onLoadReader(imgs)
		{
			return function(e) {
				imgs.forEach(function(img,i) {
					img.src=e.target.result;
				});

				img = new Image();
				img.src = e.target.result;
				
				img.onload = onLoadImage;

				function onLoadImage()
				{
					source_w = this.width;
					source_h = this.height;
					elem.find('#source_h').val(source_h);
					elem.find('#source_w').val(source_w);
					elem.find('#menu-portfolio-size-width').val(source_w);
					elem.find('#menu-portfolio-size-height').val(source_h);
					elem.find('#menu-portfolio-crop-width').val(TARGET_W)
					elem.find('#menu-portfolio-crop-height').val(TARGET_H);

					try 
					{
						self.jcrop_api.destroy();
					} 
					catch (e) 
					{
							// object not defined
					}
					var aspectRatio = source_w / source_h;( cropFix ) ? 1 : 0;//source_w / source_h
					$('#menu-portfolio-img > img').Jcrop({
				      // trueSize:[source_w,source_h],
				      // aspectRatio: aspectRatio,
				      boxWidth:sizeImage,
				      boxHeight:sizeImage,
				      setSelect: [ 100, 100, TARGET_W, TARGET_H ],
				      onSelect: updateCoords,
				      onChange: updateCoords
				    },function(){
				        self.jcrop_api = this;
				    });
				};
			};
		}
	}
	//end loadFile
	
	function setNewName(newName)
	{
		var name = elem.find('.menu-portfolio-newName-result')
		
		if( newName != '') 
		{
			name.html(newName + '.jpg');
		}
		else
		{
			name.html('');
		}
	}
	// updateCoords : updates hidden input values after every crop selection
	function updateCoords(c)
	{
		var x = parseInt(c.x * source_w / sizeImage);
		var y = parseInt(c.y * source_h / sizeImage);

		var aspectRatio = source_w / source_h;
		var width = c.w / sizeImage * source_w ;
		var height = c.h / sizeImage * source_h ;

		width = (aspectRatio > 1) ? parseInt(width) : parseInt(width / aspectRatio);
		height = (aspectRatio < 1) ? parseInt(height) : parseInt(height * aspectRatio);
		x = (aspectRatio > 1) ? parseInt(x) : parseInt(x / aspectRatio);
		y = (aspectRatio < 1) ? parseInt(y) : parseInt(y * aspectRatio);

		elem.find('#x').val(x);
		elem.find('#y').val(y);
		elem.find('#w').val(width);
		elem.find('#h').val(height);
		elem.find('#menu-portfolio-crop-width').val(width);
		if (cropFix )
		{
			elem.find('#menu-portfolio-crop-height').val(width);
		}
		else
		{
			elem.find('#menu-portfolio-crop-height').val(height);
		}
	}

	function clear()
	{
		elem.find('#menu-portfolio-img').empty();
		elem.find('.menu-portfolio-newName-result').empty();
		if ( sizeFix )
		{
			elem.find('#menu-portfolio-size-fix').removeClass('sprit-icons-zamok-close').addClass('sprit-icons-zamok');
			sizeFix = false;
		}

		if (cropFix )
		{
			elem.find('#menu-portfolio-crop-fix > span').removeClass('menu-portfolio-black');
			cropFix = false;
		}
		try
		{
			self.jcrop_api.destroy();
			self.jcrop_api = null;
		}
		catch(e)
		{

		}
	}

	function close()
	{
		elem.hide();	
	}

	function open()
	{
		elem.find('#menu-portfolio-reset_btn').click();
		elem.show();	
	}
}
//end class MenuPortfolioForm

var menu_portfolio_form = new MenuPortfolioForm({ elem:$('#popup-menu-portfolio'),open_btn:$('#open_btn')});
	
