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
	// elem.on('click','#menu-portfolio-size-fix',onSizeFix);
	// elem.on('click','#menu-portfolio-crop-fix',onCropFix);
	elem.on('input','#menu-portfolio-dest-width', onDestWidth);
	elem.on('input','#menu-portfolio-dest-height', onDestHeight);

	elem.on('blur','#menu-portfolio-crop-width', onCropWidth);
	elem.on('blur','#menu-portfolio-crop-height', onCropHeight);

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
	function onDestWidth(event)
	{
		var value = parseInt(event.target.value);
		if ( isNaN(value) || value <= 0 ) return false;
		TARGET_W = value;
		elem.find('#target_w').val(value);
		var x = parseInt(elem.find('#x').val());
		var y = parseInt(elem.find('#y').val());

		var aspectRatio = TARGET_W / TARGET_H;
		var h = parseInt( value / aspectRatio );
		self.jcrop_api.setSelect([x,y,x+value,y+h]);
		self.jcrop_api.setOptions({aspectRatio:aspectRatio});
	}
	function onDestHeight(event)
	{
		var value = parseInt(event.target.value);
		if ( isNaN(value) || value <= 0 ) return false;
		TARGET_H = value;
		elem.find('#target_h').val(value);
		var x = parseInt(elem.find('#x').val());
		var y = parseInt(elem.find('#y').val());

		var aspectRatio = TARGET_W / TARGET_H;
		var w = parseInt( value * aspectRatio );
		self.jcrop_api.setSelect([x,y,x+w,y+value]);
		self.jcrop_api.setOptions({aspectRatio:aspectRatio});
	}
	function onCropWidth(event)
	{

		var value = parseInt(event.target.value);
		if ( isNaN(value) || value <= 0) return false;

		elem.find('#x').val(0);
		elem.find('#y').val(0);

		var aspectRatio = TARGET_W / TARGET_H;
		var h = parseInt( value / aspectRatio ) + 1;
		var w = value + 1;

		elem.find('#w').val(w);	
		elem.find('#h').val(h);

		// console.log("src1 - w:" + w + ",h:" + h);	
		var resizeCoords1 = new ResizeCoords({
			w:w,
			h:h,
			source_w:source_w,
			source_h:source_w,
			sizeImage:sizeImage
		});

		w = resizeCoords1.getBoxW();
		h = resizeCoords1.getBoxH();
		// console.log("box - w:" + w + ",h:" + h);

		self.jcrop_api.setSelect([0,0, w, h]);
		
	}

	function onCropHeight(event)
	{
		var value = parseInt(event.target.value);
		if ( isNaN(value) || value <= 0) return false;

		elem.find('#x').val(0);
		elem.find('#y').val(0);

		var aspectRatio = TARGET_W / TARGET_H;
		var w = parseInt( value * aspectRatio ) + 1;
		var h = value + 1;

		elem.find('#w').val(w);	
		elem.find('#h').val(h);

		// console.log("src1 - w:" + w + ",h:" + h);	
		var resizeCoords1 = new ResizeCoords({
			w:w,
			h:h,
			source_w:source_w,
			source_h:source_w,
			sizeImage:sizeImage
		});

		w = resizeCoords1.getBoxW();
		h = resizeCoords1.getBoxH();
		// console.log("box - w:" + w + ",h:" + h);

		self.jcrop_api.setSelect([0,0, w, h]);
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
					elem.find('#menu-portfolio-size-width').html(source_w);
					elem.find('#menu-portfolio-size-height').html(source_h);
					elem.find('#menu-portfolio-crop-width').val(TARGET_W);
					elem.find('#menu-portfolio-crop-height').val(TARGET_H);
					createCrop(100,100, TARGET_W, TARGET_H);	
					
				};
			};
		}
	}
	//end loadFile

	function createCrop(x, y, w, h)
	{
		try 
		{
			self.jcrop_api.destroy();
			self.jcrop_api = null;
		} 
		catch (e) 
		{
				// object not defined
		}
		var aspectRatio = TARGET_W / TARGET_H;

		$('#menu-portfolio-img > img').Jcrop({
	      // trueSize:[source_w,source_h],
	      aspectRatio: aspectRatio,
	      boxWidth:sizeImage,
	      boxHeight:sizeImage,
	      setSelect: [ x, y, x + w , y + h ],
	      onSelect: updateCoords,
	      onChange: updateCoords
	    },function(){
	        self.jcrop_api = this;
	    });
	}
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
		var resizeCoords = new ResizeCoords({
			x:c.x,
			y:c.y,
			w:c.w,
			h:c.h,
			source_w:source_w,
			source_h:source_h,
			sizeImage:sizeImage
		});
		var aspectRatio = source_w / source_h;
		// что-то не так
		var x = resizeCoords.getSrcX();
		var y = resizeCoords.getSrcY();

		var width = resizeCoords.getSrcW();
		var height = resizeCoords.getSrcH();

		elem.find('#x').val(x);
		elem.find('#y').val(y);
		elem.find('#w').val(width);
		elem.find('#h').val(height);
		elem.find('#menu-portfolio-crop-width').val(width);
		elem.find('#menu-portfolio-crop-height').val(height);
		// console.log("x:" + c.x + ",y:" + c.y + ",w:" + c.w + ",h:" + c.h);
	}

	function clear()
	{
		elem.find('#menu-portfolio-img').empty();
		elem.find('.menu-portfolio-newName-result').empty();
		elem.find('#menu-portfolio-dest-width').val('');
		elem.find('#menu-portfolio-dest-height').val('');
		elem.find('#menu-portfolio-crop-width').val('');
		elem.find('#menu-portfolio-crop-height').val('');
		elem.find('#menu-portfolio-size-width').html(0);
		elem.find('#menu-portfolio-size-height').html(0);
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

// class resizeCoords
function ResizeCoords(opts)
{
	var source_w = opts.source_w;
	var source_h = opts.source_h;
	var sizeImage = opts.sizeImage;
	var x = opts.x || 0;
	var y = opts.y || 0;
	var w = opts.w;
	var h = opts.h;
	var aspectRatio = source_w / source_h;

	function axisSrcX(x)
	{
		var src_x = x * source_w / sizeImage;
		return (aspectRatio > 1) ? parseInt(src_x) : parseInt(src_x / aspectRatio);
	}
	function axisSrcY(y)
	{
		var src_y = y * source_h / sizeImage;
		return (aspectRatio < 1) ? parseInt(src_y) : parseInt(src_y * aspectRatio);	
	}
	function axisBoxX(x)
	{
		var box_x = x * sizeImage / source_w ;
		return (aspectRatio > 1) ? parseInt(box_x) : parseInt(box_x * aspectRatio);
	}
	function axisBoxY(y)
	{
		var box_y = y * sizeImage / source_h ;
		return (aspectRatio < 1) ? parseInt(box_y) : parseInt(box_y  / aspectRatio);	
	}

	this.getSrcX = function() 
	{
		var max_side = Math.max(source_w, source_h);
		var delta = (max_side - source_w) * sizeImage / (2 * max_side);

		return axisSrcX(x - delta);
	}
	this.getSrcY = function()
	{
		var max_side = Math.max(source_w, source_h);
		var delta = (max_side - source_h) * sizeImage / (2 * max_side);	
		return axisSrcY(y - delta);
	}
	this.getSrcW = function()
	{
		return axisSrcX(w);
	}
	this.getSrcH = function()
	{
		return axisSrcY(h);
	}
	this.getBoxX = function()
	{
		return axisBoxX(x);
	}
	this.getBoxY = function()
	{
		return axisBoxY(y);
	}
	this.getBoxW = function()
	{
		return axisBoxX(w);
	}
	this.getBoxH = function()
	{
		return axisBoxY(h);
	}
}// end class ResizeCoords
var menu_portfolio_form = new MenuPortfolioForm({ elem:$('#popup-menu-portfolio'),open_btn:$('#open_btn')});
	
