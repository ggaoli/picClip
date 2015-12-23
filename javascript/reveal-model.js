// JavaScript Document
$(function(){
	var preventDefault =function(e){
		var e = e || window.event;
		if(e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
	}
	var closeModal = function(cur,Close){
			
	}
	$(".close-reveal-modal").click(function(e){
		preventDefault(e);
		$("#TB_overlayBG").css("display","none");
		$(".box-content ").css("display","none").css("top","-100%");
		$('body').attr("style"," ");
		$('html').removeClass('visible');
	});
	var id="";
	$('.click-block').each(function(){
				$(this).click(function(e){
					if($(this).parents("div").hasClass("box-content")){
						$(this).parents(".box-content").fadeOut(0,function(){
							$(this).hide();
							$(this).css("top","-100%");
							$(this).parents(".box-content").prev().css("display","none");
						});
						preventDefault(e);
						id = $(this).attr("reveal-model-id");
						$('#'+id).css("display","block");
						$("#TB_overlayBG").css({
							display:"block",height:$(document).height()
						});
						var int =self.setInterval(function () {
							var speed= ((($(window).height()-$('#'+id).height())/2)+$(window).scrollTop()-$('#'+id)[0].offsetTop)/10;
							$('#'+id)[0].style.top=$('#'+id)[0].offsetTop+speed+'px';
							if(speed<=0.5){
								clearInterval(int);
							}
						},10);
						$("#"+id).css({
							left:($("body").width()-$("#"+id).outerWidth())/2+"px"
						});
						$('body').css("overflow","hidden");
						$('html').addClass('visible');
					}else{
							preventDefault(e);
							id = $(this).attr("reveal-model-id");
							$('#'+id).css("display","block");
							$("#TB_overlayBG").css({
								display:"block",height:$(document).height()
							});
							
							var int =self.setInterval(function () {
								var speed= ((($(window).height()-$('#'+id).height())/2)+$(window).scrollTop()-$('#'+id)[0].offsetTop)/10;
								$('#'+id)[0].style.top=$('#'+id)[0].offsetTop+speed+'px';
								if(speed<=0.5){
									clearInterval(int);
								}
								//document.title=$('#'+id)[0].offsetTop+','+speed 
							},10);
							$("#"+id).css({
								left:($("body").width()-$("#"+id).outerWidth())/2+"px"
							});
							$('body').css("overflow","hidden");
							$('html').addClass('visible');
						}
				});
			});
		$(document).on("click","#TB_overlayBG",function(){
			if($('#'+id).hasClass("noClick")){
				return;
			}else{
				$("#TB_overlayBG").css("display","none");
				$('#'+id).css("display","none").css("top","-100%");
				$('body').attr("style"," ");
				$('html').removeClass('visible');
				return id;
			}
		});
	$.fn.mask = function(){
		this.show = function(a){
			this.append(a);
		}
		this.append = function(a){
			var tagfram = '<div id="TB_overlayBG"></div>'
			if($("body").children("div").hasClass("TB_overlayBG")){
				return;
			}else{
				$("body").append(tagfram);
			}
		}
		this.noClick= function(){
			this.addClass("noClick")
		}
		return this;
	}
});

//提示框位置
function slide(state,title) {
	var top =self.setInterval(function () {
		//ie6执行的代码
		var ie6=!-[1,]&&!window.XMLHttpRequest;
		if(ie6){
			var speed=($(window).scrollTop()-$('.'+state+'-top')[0].offsetTop)/2;
		}else{
			var speed=$('.'+state+'-top')[0].offsetTop/-10;
		}
		$('.'+state+'-top')[0].style.top=$('.'+state+'-top')[0].offsetTop+speed+'px';
		if(speed<=0.5){
			clearInterval(top);
			setTimeout(function(){
				$('.'+state+'-top').css("top","-100px");
				$('.'+state+'-top').css("display","block");
			},1000);
		}
	},10);
	$('.'+state+'-top').css({
		left:($("body").width()-$('.'+state+'-top').outerWidth())/2+"px"
	});
}
//提示框内容
function loading(state,title) {
	var fragment = '<div class="'+state+'-top"><div class="'+state+'-content">'+title+'</div></div>';
	if( $('.alert-top')[0] || $('.success-top')[0]){
		var topEle = $('.alert-top')[0] ? $('.alert-top')[0] : $('.success-top')[0];
		topEle.className = state + '-top';
		topEle.innerHTML = '<div class="' + state + '-content">' + title + '</div>';
		slide(state,title);
	}else{
		$("body").append(fragment);
		slide(state,title);
	}
	$('.'+state+'-top').css({
		left:($("body").width()-$('.'+state+'-top').outerWidth())/2+"px"
	});
}