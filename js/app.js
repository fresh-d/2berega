
$(function() {

	//имитация стандартного плейсхолдера для инпутов и текстовых полей
	if (!('placeholder' in document.createElement("input"))){
		$(document)
			.on("focus",'input[placeholder], textarea[placeholder]',function(){if(this.value==$(this).attr('placeholder')) {this.value='';$(this).removeClass("placeholder")};})
			.on("blur", 'input[placeholder], textarea[placeholder]',function(){if(this.value=='') {this.value=$(this).attr('placeholder');$(this).addClass("placeholder")};});
		$('input[placeholder], textarea[placeholder]').blur();
		$('input[placeholder], textarea[placeholder]').each(function(){if(this.value==$(this).attr('placeholder')) $(this).addClass("placeholder");});
	}
	
	var ua = navigator.userAgent;
	var isiPad = /iPad/i.test(ua) || /iPhone/i.test(ua);
	if (isiPad) $("body").addClass("ipad");

	// =================================================================

	/*tabs*/
	$("[data-tabs] [data-tab]").click(function(){
		id=$(this).parent().attr("data-tabs");
		$(this).parents("[data-tabs-container="+id+"]").find("[data-tabs="+id+"]>[data-tab], [data-tabs-content="+id+"]>[data-tab-content]").removeClass("active");
		$(this).addClass("active");
		$(this).parents("[data-tabs-container="+id+"]").find("[data-tabs-content="+id+"]>[data-tab-content]").eq($(this).index()).addClass("active");
		if ($(this).parents("[data-tabs-container]").eq(0).hasClass("b-search-form")) {
			if ($(this).index()==0) $("[data-tabs-container].b-search-form").addClass("first-tab-selected");
			else $("[data-tabs-container].b-search-form").removeClass("first-tab-selected");
		}
	});
	$("[data-tabs] [data-tab].active").click();
	
	// =================================================================
	
	/*select*/

	
	$("[data-select] select").change(function(){
		$(this).parents("[data-select]").find("[data-select-val]").html($(this).find("option:selected").html());
	});

	
	$(".b-search-form select").change(function(){
		$(this).parents(".b-select").addClass("activated");
		if ($(this).find("option:selected").attr("data-sel-empty")!=undefined) {
			$(this).parents(".b-select").addClass("empty");
			}
		else{
			$(this).parents(".b-select").removeClass("empty");
		}
	});

	$("[data-select] select").each(function(){
		$(this).change();
	});
	
	$(".b-search-form input[type=text]").change(function(){
		$(this).addClass("activated");
		if ($(this).val()=="") $(this).removeClass("activated");
	});
	
	$("[data-from-clear]").click(function(){
		$(".b-search-form input[type=text]").val("");
		$(".b-search-form input[type=text], .b-search-form .b-select").removeClass("activated");
		$(".b-search-form .b-radio-box li").removeClass("active");
		$(".b-search-form .b-select [data-sel-empty]").attr("selected","selected");
		$(".b-search-form select").change();

	});
	
	$("[data-extended-search-link]").click(function(){
		$(this).toggleClass("extended");
		$("[data-extended-params]").toggle();
	});
	
	
	// =================================================================
	/*radio multi*/
		$(document).on("click","[data-radio-el]",function(){
		isActive=$(this).hasClass("active");
		//$(this).parents("[data-radio]").find("[data-radio-el]").removeClass("active");
		if (isActive){
			$(this).parents("[data-radio]").find("[data-radio-value]").attr("value",-1);
			$(this).removeClass("active");
		}
		else{
			$(this).parents("[data-radio]").find("[data-radio-value]").attr("value",$(this).attr("data-radio-el"));
			$(this).addClass("active");
		}
	})

	/*submit*/
	$("[data-submit-button]").click(function(){
		$(this).parents("form").submit();
	});
	
	$("[data-favorite-link]").click(function(){
		$(this).toggleClass("active");
	});

	// =================================================================
	
	$(document).on("click",'[data-photo-gallery-id]',function(){
		//$('[data-photo-gallery="wrap"]').fadeIn();
	});
	// =================================================================
	
	/* всплывающая фотогалерея */
	$(document).on("click",'[data-photo-gallery-id]',function(){
		$(this).parents("ul").find("li").removeClass("active");
		$(this).parents("li").addClass("active");
		
		//если клик на странице машины - активируем нужную фотку в галерее по параметру data-photo-gallery-id
		if ($(this).parents('.b-view-page').length>0){
			$('[data-photo-gallery="list"] [data-photo-gallery-id="'+$(this).attr("data-photo-gallery-id")+'"]').click();
		}
		//console.log($(this).attr("href"))
    var tmpImg = new Image();
    tmpImg.onload = function() {
      $('[data-photo-gallery="photo"]').css("background-image","url("+tmpImg.src+")");
      $('[data-photo-gallery="wrap"]').fadeIn();
			getGalleryWidth();
			//console.log("url("+tmpImg.src+")");

    } ;
    tmpImg.src = $(this).attr("href");
		return false;
		
		list=$('[data-photo-gallery="list"]');
		if ($(list).find("li:first").hasClass("active")){
			$('[data-photo-gallery="prev"]').fadeOut("fast");
		}
		else{
			$('[data-photo-gallery="prev"]').fadeIn("fast");
		}
		
		if ($(list).find("li:last").hasClass("active")){
			$('[data-photo-gallery="next"]').fadeOut("fast");
		}
		else{
			$('[data-photo-gallery="next"]').fadeIn("fast");
		}		
		
		return false;
	});
	
	
	//считаем ширину нижней галереи по кол-ву фоток. ширина фоток стандартная, считается по первому элементу
	function getGalleryWidth(){
		list=$('[data-photo-gallery="list"]');
		$(list).find('ul').css("width",$(list).find("li").length*($(list).find("li").eq(0).outerWidth()+parseInt($(list).find("li").eq(0).css("margin-right"))));
		console.log($(list).find("li").eq(0).html());
		if (parseInt($(list).find('ul').css("width"))>parseInt($(list).width())) {
			$('[data-photo-gallery="list"] [data-photo-gallery="list-next"]').show();
		}
		else{
			$('[data-photo-gallery="list"] [data-photo-gallery="list-next"]').hide();		
		}
		
	}
	
	getGalleryWidth();
	
	//двигаем нижний список фоток
	$(document).on("click",'[data-photo-gallery="list-next"], [data-photo-gallery="list-prev"]',function(){
		var gallery_scroll_count=3; //кол-во элементов для прокрутки
		
		isnext = false;
		isprev = false;
		//выставляем флаги - какая кнопка нажата
		if ($(this).attr('data-photo-gallery')=="list-next") {
			isnext=true;
		}
		else {
			isprev=true;
		}
		
		list=$('[data-photo-gallery="list"]');//родитель списка
		li_width=$(list).find("li").eq(0).outerWidth()+parseInt($(list).find("li").eq(0).css("margin-right")); //ширина одного элемента
		ul_width=$(list).find('ul').width();//ширина всего списка
		pos=parseInt((list).find("ul").css("margin-left")); //текущая позиция прокрутки
		//прокручиваем на заданное кол-во элементов
		if (isnext) {
			pos-=gallery_scroll_count*li_width;
		}
		if (isprev) {
			pos+=gallery_scroll_count*li_width;
		}
		
		//console.log(pos+ul_width, $(list).width());
		
		//определяем показывать ли кнопки туда/сюда
		if (pos<0) {
			$('[data-photo-gallery="list"] [data-photo-gallery="list-prev"]').show();
		}
		else {
			$('[data-photo-gallery="list"] [data-photo-gallery="list-prev"]').hide();
		}
		
		if (pos+ul_width>=$(list).width()) {
			$('[data-photo-gallery="list"] [data-photo-gallery="list-next"]').show();
		}
		else {
			$('[data-photo-gallery="list"] [data-photo-gallery="list-next"]').hide();
		}
		
		//если справа/слева при прокрутке появляется дыра, делаем прокрутку на меньшее число элементов
		if (-pos>ul_width-$(list).width()) {
			pos=-(ul_width-$(list).width());
		}
		
		if (pos>0) {
			pos=0;
		}
		
		//делаем сдвиг
		$(list).find("ul").animate({"margin-left":pos})

	});
	
	/* кнопка закрыть */
	$(document).on("click",'[data-photo-gallery="close"]',function(){
		$('[data-photo-gallery="wrap"]').fadeOut();
	});
	
	$(document).on("click",'[data-photo-gallery="next"], [data-photo-gallery="prev"]',function(){
		list=$('[data-photo-gallery="list"]');
		
		prev=$(list).find("li.active").prev();
		next=$(list).find("li.active").next();
		
		if ($(this).attr('data-photo-gallery')=="next") {
			next.find("a").click();
		}
		else{
			prev.find("a").click();
		}
		
	
	});
	

	// =================================================================
	
	
});