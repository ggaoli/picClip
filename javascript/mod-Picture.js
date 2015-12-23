// 图片上传demo
var p={};
(function($) {
	var $modPic = $('#modPic'),
		$upArea = $modPic.find('.uploader-area'),
		$upList = $modPic.find('.uploader-list'),
		$list = $('#fileList'),
		isBtnInit = false,
	// 优化retina, 在retina下这个值是2
		ratio = window.devicePixelRatio || 1,
		result_width = 0,
		result_height = 0,

		img = new Image(),
		jcrop_api,
		imgObjPreview,
		isSave = false,
		geometric = 1, //比例
		imgFile,
		uploadImg,
		uploader,


	// 判断浏览器是否支持图片的base64
		isSupportBase64 = ( function() {
			var data = new Image();
			var support = true;
			data.onload = data.onerror = function() {
				if( this.width != 1 || this.height != 1 ) {
					support = false;
				}
			}
			data.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
			return support;
		} )(),

	// 检测是否已经安装flash，检测flash的版本
		flashVersion = ( function() {
			var version;
			try {
				version = navigator.plugins[ 'Shockwave Flash' ];
				version = version.description;
			} catch ( ex ) {
				try {
					version = new ActiveXObject('ShockwaveFlash.ShockwaveFlash')
						.GetVariable('$version');
				} catch ( ex2 ) {
					version = '0.0';
				}
			}
			version = version.match( /\d+/g );
			return parseFloat( version[ 0 ] + '.' + version[ 1 ], 10 );
		} )();

	if ( !WebUploader.Uploader.support('flash') && WebUploader.browser.ie ) {

		// flash 安装了但是版本过低。
		if (flashVersion) {
			(function(container) {
				window['expressinstallcallback'] = function( state ) {
					switch(state) {
						case 'Download.Cancelled':
							alert('您取消了更新！')
							break;

						case 'Download.Failed':
							alert('安装失败')
							break;

						default:
							alert('安装已成功，请刷新！');
							break;
					}
					delete window['expressinstallcallback'];
				};

				var swf = './expressInstall.swf';
				// insert flash object
				var html = '<object type="application/' +
					'x-shockwave-flash" data="' +  swf + '" ';

				if (WebUploader.browser.ie) {
					html += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
				}

				html += 'width="100%" height="100%" style="outline:0">'  +
				'<param name="movie" value="' + swf + '" />' +
				'<param name="wmode" value="transparent" />' +
				'<param name="allowscriptaccess" value="always" />' +
				'</object>';

				container.html(html);

			})($wrap);

			// 没有安转flash的情况下。
		} else {
			$wrap.html('<a href="http://www.adobe.com/go/getflashplayer" target="_blank" border="0"><img alt="get flash player" src="http://www.adobe.com/macromedia/style_guide/images/160x41_Get_Flash_Player.jpg" /></a>');
		}

		return;
	} else if (!WebUploader.Uploader.support()) {
		alert( 'Web Uploader 不支持您的浏览器！');
		return;
	}

	if(document.body.clientWidth < 740){
		thumbnailWidth = 300 * ratio,
			thumbnailHeight = 180 * ratio
	}else {
		thumbnailWidth = 680 * ratio,
			thumbnailHeight = 380 * ratio
	};

	function saveHead() {
		jcp.setOptions({onSelect:updatePreview});
		jcp.setOptions({onChange:updatePreview});
		$('.uploader-bn').html('<i class="fa fa-refresh"></i>重新选择');

		//$("#caseId").val("00000006");
		//$("#act").val("uploadAndCutImg");
		if ($('#x').val() == "0" && $('#x').val() == "0" && $('#y').val() == "0" && $('#w').val() == "0" && $('#h').val() == "0") {
			var width = img.width;
			var height = img.height;
			$('#x').val("0");
			$('#y').val("0");
			$('#w').val(parseInt(100 * width / 400));
			$('#h').val(parseInt(100 * height / 400));
		}
		uploader.option('formData', {
			"x": $('#x').val(),
			"y": $('#y').val(),
			"w": $('#w').val(),
			"h": $('#h').val()
		});
		uploader.option('server', 'http://192.168.4.211:8080/fileCenter/fileUpload.sp?act=uploadAndCutImg&appId=00000001&caseId=00000006');
		isSave = true;
		uploader.retry(imgFile);

	}

	function showCutImg() {
		$('#crop1 .crop-img img')[0].src = uploadImg;
		uploader.removeFile(imgFile);
		//var clipLoad=$("<div class='upload-bg-load'><img src='images/loading-017.gif' alt=' ' /> </div>")
		//clipLoad.appendTo(".crop-img");
	}

	// 初始化Web Uploader
	uploader = WebUploader.create({

		// 自动上传。
		auto: true,

		// swf文件路径
		swf: './flash/Uploader.swf',

		formData: {
			uid: 123
		},
		dnd: '#modPic',
		paste: '#uploader',

		chunked: false,
		chunkSize: 512 * 1024,

		// 文件接收服务端。
		//server: './server/fileupload.php',
		server: 'http://192.168.4.211:8080/fileCenter/fileUpload.sp?act=uploadSave&appId=00000001&caseId=00000018',

		// 选择文件的按钮。可选。
		// 内部根据当前运行是创建，可能是input元素，也可能是flash.
		pick: '#filePicker',
		fileNumLimit : 1,

		// 禁掉全局的拖拽功能。这样不会出现图片拖进页面的时候，把图片打开。
		disableGlobalDnd: true,
		fileSizeLimit: 200 * 1024 * 1024,    // 200 M
		fileSingleSizeLimit: 50 * 1024 * 1024,    // 50 M

		// 只允许选择文件，可选。
		accept: {
			title: 'Images',
			extensions: 'gif,jpg,jpeg,bmp,png',
			mimeTypes: 'image/*'
		}
	});
	// 当有文件添加进来的时候
	/*
	 uploader.on( 'fileQueued', function( file) {

	 $('.uploader-area').addClass('load-img');
	 var $li = $(
	 '<div id="' + file.id + '" class="file-item thumbnail">' +
	 '<img>' +
	 '</div>'
	 ),
	 $img = $li.find('img');
	 //$list.append( $li );
	 $list.html("").append( $li );

	 var curWwwPath = window.document.location.href;
	 var rootPath = curWwwPath.substring(0, curWwwPath.lastIndexOf('/'));

	 // 创建缩略图
	 uploader.makeThumb( file, function( error, src ) {
	 if ( error ) {
	 $img.replaceWith('<span>不能预览</span>');
	 return;
	 }
	 $img.attr( 'src', rootPath + '/server/upload/' + file.name );
	 var img_url = $img.attr('src');
	 var pic = new Image();
	 pic.src = img_url;
	 pic.onload = function(){
	 $img.LoadImage(true, pic.width, pic.height, pic.src);
	 };
	 }, result_width, result_height );
	 });
	 */
	// 文件上传过程中创建进度条实时显示。
	uploader.on( 'uploadProgress', function( file, percentage ) {
		var $li = $( '#'+file.id ),
			$percent = $li.find('.progress span');

		// 避免重复创建
		if ( !$percent.length ) {
			$percent = $('<p class="progress"><span></span></p>')
				.appendTo( $li )
				.find('span');
		}
		$percent.css( 'width', percentage * 100 + '%' );
	});
	// 文件上传成功，给item添加成功class, 用样式标记上传成功。
	uploader.on( 'uploadSuccess', function( file,response ) {
		uploadImg = response.url;
		//未剪切前上传头像
		if (!isSave) {
//			setTimeout(function() {
			imgFile=file;
			$('.uploader-area').addClass('load-img');
			var $li = $(
					'<div id="' + file.id + '" class="file-item thumbnail">' +
					'<img>' +
					'</div>'
				),
				$img = $li.find('img');
			$img.attr( 'src', response.url).attr('id', "cropbox");
			$list.html("").append( $li );

			var url = response.url;
			img.src = $('#cropbox').attr("src");

			$('#cropbox').LoadImage(true, $list.width(), $list.height(), url);

			$( '#'+file.id ).addClass('upload-state-done');
			$('#modPic p,#modPic span').hide();
			$( '#filePicker2,.clip-success-btn,#rotate-img' ).show();

			$( '#modPic' ).css('height','auto');
			$('.uploader-area').removeClass('load-img');

			if (!isBtnInit) {
				uploader.addButton({
					id: '#filePicker2'
				});
			}
//			}, 2500);
		} else {
			showCutImg();

//			$('#crop1 .crop-img img')[0].src = response.url;
		}
		$list.find('.progress').remove();
//		uploader.reset();
	});
	// 文件上传失败，现实上传出错。
	uploader.on( 'uploadError', function( file ) {
		var $li = $( '#'+file.id ),
			$error = $li.find('div.error');

		// 避免重复创建
		if ( !$error.length ) {
			$error = $('<div class="error"></div>').appendTo( $li );
		}
		$error.text('上传失败');
	});

	// 完成上传完了，成功或者失败，先删除进度条。
	uploader.on( 'uploadComplete', function( file ) {

	});
	function initJcrop(){
		jcp = $.Jcrop('#modPic .uploader-list img',{
			//minSize: [100, 100],
			maxSize: [680, 380],
			aspectRatio: 1.7894
		});

		$upArea.addClass('webuploader-element-invisible');
		$upList.show();
		if(document.body.clientWidth < 740){
			jcp.setSelect([0, 0, 80, 48]);
		}else {
			jcp.setSelect([0, 0, 420, 250]);
		}

		$('.uploader-bn').click(function(){
			jcp.release();
			jcp.setOptions({onSelect:null});
			jcp.setOptions({onChange:null})
		});
		uploader.removeFile( imgFile );

	};


	$('.clip-success-btn').click(function(){
		saveHead();

	});

	$('#filePicker2').click(function(){
		isSave = false;
		uploader.option('server', 'http://192.168.4.211:8080/fileCenter/fileUpload.sp?act=uploadSave&appId=00000001&caseId=00000018');
	});

	function updatePreview(c){
		/*
		 if (parseInt(c.w) > 0){
		 if(document.body.clientWidth < 740){
		 var rx = 300 / c.w;
		 var ry = 180 / c.h;
		 }else {
		 var rx = 470 / c.w;
		 var ry = 280 / c.h;
		 }
		 $('#crop1 .crop-img img').css({
		 width: Math.round(rx * parseInt(result_width)) + 'px',
		 height: Math.round(ry * parseInt(result_height)) + 'px',
		 marginLeft: '-' + Math.round(rx * c.x) + 'px',
		 marginTop: '-' + Math.round(ry * c.y) + 'px'
		 });
		 }
		 */
		var width = img.width;
		var height = img.height;
		$('#x').val(parseInt(c.x * width / result_width));
		$('#y').val(parseInt(c.y * height / result_height));

		$('#w').val(parseInt(c.w * width / result_width));
		$('#h').val(parseInt(c.h * height / result_height));
	};

	jQuery.fn.LoadImage = function(scaling, width, height, loadpic) {
		return this.each(function() {
			var t = $(this);
			var src = $(this).attr("src")
			var img = new Image();
			img.src = src;

			//自动缩放图片
			var autoScaling = function() {
				if (scaling) {

					if (img.width > 0 && img.height > 0) {
						if (img.width / img.height >= width / height) {
							if (img.width > width) {
								t.width(width);
								t.height((img.height * width) / img.width);
							} else {
								t.width(img.width);
								t.height(img.height);
							}
						} else {
							if (img.height > height) {
								t.height(height);
								t.width((img.width * height) / img.height);
							} else {
								t.width(img.width);
								t.height(img.height);
							}
						}
					}
				}
			}
			//处理ff下会自动读取缓存图片
			if (img.complete) {
				//alert("getToCache!");
				autoScaling();
				return;
			}
			$(this).attr("src", "");
			var loading = $("<img alt=\"加载中\" title=\"图片加载中\" src=\"" + loadpic + "\" />");
			t.hide();
			t.after(loading);
			$(img).load(function() {
				autoScaling();
				loading.remove();
				t.attr("src", this.src);
				t.show();
				//alert("finally!")
				$("#cropbox").width(t.width());
				$("#cropbox").height(t.height());
				result_width = t.width();
				result_height = t.height();
				initJcrop();
			});
		});
	}

})(jQuery);


$(document).ready(function(){
	//tab切换
	new o_tab().init( "datatable_pic","li","post_dttab_con_","on","",1,"" );
	$('.box-content').mask().show();
	var a= $('#pic-clip1').mask();
	a.noClick();
})
//强制居中
$('.click-block').click(function(){
	var picBox=$('.row-upload #pic-clip1');
	var picBoxTop = ($(window).height() - picBox.height())/2;
	var picBoxLeft = ($(window).width() - picBox.width())/2;
	$('#pic-clip-show').css({'top':picBoxTop,'left':picBoxLeft});
	window.onresize = function () {
		$('#pic-clip-show').css({'top':picBoxTop});
		// console.log(picBoxTop);
	}
})
//活动海报选择
$('.picture-select-box ul li').each(function(){
	$(this).click(function(){
		$('.select-success-btn').show();
		$('.picture-select-box ul li').removeClass('select');
		$(this).addClass('select');
	});
});
$('.select-success-btn').bind('click',function(){
	var picSrc=$('.box-content').find('.picture-select-box ul li.select img').attr("real-src");
	$('.uploader-bn').html('<i class="fa fa-refresh"></i>重新选择');
	var cropImg= $('.crop .crop-img img').attr('src', picSrc);
	//if(document.body.clientWidth < 740){
	//	cropImg.css({'width':'1px','height':'auto','margin':'0px'});
	//}else{
	//	cropImg.css({'width':'470px','height':'auto','margin':'0px'});
	//}

	//var clipLoad=$("<div class='upload-bg-load'><img src='images/loading-017.gif' alt=' ' /> </div>")
	//clipLoad.appendTo(".crop-img");
	//setTimeout("$('.upload-bg-load').remove()",2000);//2秒

	$('#fileList1 img').attr('src',picSrc);
});



//ie低版本判断选择

var browser=navigator.appName;
var b_version=navigator.appVersion;
var version=b_version.split(";");
var trim_Version=version[1].replace(/[ ]/g,"");
if(browser=="Microsoft Internet Explorer" && ( trim_Version=="MSIE6.0" || trim_Version=="MSIE7.0")){
	$('.more-preview-pic').remove();
	$('.normal-preview-pic').show();
//普通图片上传
	var uploader_a,
		$list = $('#fileList1'),
		arr_images = [];
	uploader_a = WebUploader.create({
		// 选完文件后，是否自动上传。
		auto: true,
		// swf文件路径
		swf: './javascript/Uploader.swf',
		// 文件接收服务端。
		server: 'server/fileupload.php',
		// 选择文件的按钮。可选。
		// 内部根据当前运行是创建，可能是input元素，也可能是flash.
		pick: '#filePicker1',
		// 只允许选择图片文件。
		accept: {
			title: 'Images',
			extensions: 'gif,jpg,jpeg,bmp,png',
			mimeTypes: 'image/*'
		},
		fileNumLimit: 0,
		duplicate: true
	});
	uploader_a.on('uploadSuccess', function (file, response) {

		$list.find('.uploader').remove();

			//var $li = '<li class="th"><img class="activity-img shop-show-img" src=' + response.url + '></li>';
		//  var $li = '<div class="uploader uploaded"><span class="bg-preview"><img src="images/1.jpg" /></span><span class="fa fa-times reset"></span></div>';
		var $li = '<div class="uploader uploaded"><span class="bg-preview"><img src="images/1.jpg" alt="" /></span></div>';
		arr_images.push(response.url);
		$list.find('.no-bullet').append($li);
//                        $('.reset').on('click',function(){
//                            $(this).parent('.uploader').remove();
//                        });
	});
	uploader_a.on('error', function (reason) {
		var fail = $('.v_info_fail').find('.v_show_info');
		switch (reason) {
			case 'Q_TYPE_DENIED':
				fail.text('类型错误');
				$('.v_info_fail').addClass("show");
				setTimeout(function () {
					$('.v_info_fail').removeClass("show");
				}, 3000);
				break;
		}
	});
}
else if(browser=="Microsoft Internet Explorer" && ( trim_Version=="MSIE8.0" || trim_Version=="MSIE9.0"|| trim_Version=="MSIE6.0" || trim_Version=="MSIE7.0")){
	$('#modPic p').remove();
	$('.up-span-pic').css('left','45%');
}
else {
	$('.normal-preview-pic').remove();
}


