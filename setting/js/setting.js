
//var myScroll;
var g_lh = null;
var g_iu = null;
var g_isOpen = false;

function initAll ()
{
	$.mobile.defaultPageTransition = 'none';

	g_lh = new LoginHandler ();
	g_iu = new ImageUploader ();	
	g_iu.setNavigatorObj ( navigator );
	
	bindBackButton ();
	
	// 상단 공지 버튼들 이벤트 바인딩
	$(".notice-link").on ( "click" , function ()
	{
		var pageTitle = $(this).attr("title");
		var pageCategory = $(this).attr("category");
		
		$("#page-notice").attr("title",pageTitle)
						.attr("category",pageCategory);
		$.mobile.changePage ( "#page-notice" );
	});
	
	// 페이지별 이벤트 바인딩 
	bindAccountSettingPage ();
	bindLogoutPage ();
	bindAccountDeletePage ();
	bindNoticePage ();
}

function initPhoneGap ()
{
	document.addEventListener("deviceready", initAll , true);
}

function bindBackButton ()
{
	var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
	if ( deviceType != "Android" ) { return; }
	
	navigator.app.overrideBackbutton(true);
	document.addEventListener("backbutton", function ()
	{
		if ( g_isOpen == true ) { return; }
    	g_isOpen = true;
    	
		navigator.notification.confirm ( "콤스를 종료하시겠습니까?", function ( btnIndex )
    	{	
    		g_isOpen = false;
    		if ( btnIndex == 1 ) { navigator.app.exitApp(); }
    	}, "콤스 종료" ,"확인,취소" );
	}, true );
}

function doAlert ( msg , title , callbackFunction )
{
	navigator.notification.alert ( msg , callbackFunction , title , "확인" );
}

function bindNoticePage ()
{
	$(document).on("pagebeforeshow","#page-notice",function()
	{
		var pageTitle = $(this).attr("title");
		var pageCategory = $(this).attr("category");
		$("#notice-title").html(pageTitle);
		
		$.ajax ({
			url:"http://teamsf.co.kr/~coms/notice_list_show.php",
			data:{cat:pageCategory},
			dataType:"json",
			type:"post",
			success:function ( resultObj )
			{
				var i; var wholeExpr = "";
				for ( i = 0 ; i < resultObj.length ; i++ )
				{
					var row = resultObj[i];
					var rowExpr = 
						"<div data-role=\"collapsible\">" +
						"	<h3>" + row.title + "</h3>" +
						"	<p>" + row.content + "</p>";
					if ( row.image_path != null )
					{
						rowExpr += "<img src=\"" + row.image_path + "\" style=\"width:100%;\">";
					}
					
					rowExpr += "</div>";
					wholeExpr += rowExpr;
				}
				$("#notice-list").html(wholeExpr)
				.trigger("create");
			}
		});
	});
}

function bindAccountDeletePage ()
{
	$(document).on("pageinit","#page-account-delete",function ()
	{
		if ( g_lh.getLocalLoginInfo() == null )
		{
			doAlert ( "로그인 되어 있지 않습니다!" , "계정삭제 오류!" , function () {} );
			location.href = "./index.html";
			return;
		}
		
		$("#btn-account-delete").on ( "click" , function ()
		{
			navigator.notification.confirm(
		        '계정을 삭제 하시겠습니까?', // message
		         function(btnIndex){
		         	if (btnIndex != 1) { return; };
		    		var ajaxParam = 
					{
						mid:g_lh.getLocalLoginInfo().id,
						block:true
					};
					
					$.ajax ({
						url:"http://teamsf.co.kr/~coms/member_block_modify.php",
						data:ajaxParam,
						dataType:"json",
						type:"post",
						success:function ( resultObj )
						{
							g_lh.flushLogin ();
							location.href="../index.html";							
						}
					});
		         },            // callback to invoke with index of button pressed
		        '계정 삭제',           // title
		        ['Yes','No']         // buttonLabels
		    );
		});
	});
}

function bindLogoutPage ()
{
	$(document).on("pagebeforeshow","#page-logout",function ()
	{
		if ( g_lh.getLocalLoginInfo() == null )
		{
			doAlert ( "로그인 되어 있지 않습니다!" , "로그아웃 오류!" , function () {} );
			location.href = "./index.html";
			return;
		}
		
		$("#btn-logout").on ( "click" , function ()
		{
			navigator.notification.confirm(
		        '로그아웃 하시겠습니까?', // message
		         function(btnIndex){
		         	if (btnIndex != 1) { return; };
		    		g_lh.flushLogin ();
					//doAlert ( "성공적으로 로그아웃하였습니다!" , "로그아웃" , function () {} );
					location.href = "../member/index.html";     	
		         },            // callback to invoke with index of button pressed
		        '로그아웃',           // title
		        ['Yes','No']         // buttonLabels
		    );
			
		});
	});
}

function bindAccountSettingPage ()
{
	// 계정 설정 페이지 initializations
	$(document).on("pagebeforeshow","#page-account-setting", function() 
	{
		if ( g_lh.getLocalLoginInfo () == null ) 
		{ 
			doAlert ( "로그인 되어 있지 않습니다!" , "계정 설정 오류!" , function () {} ); 
			location.href = "./index.html";
			return;
		}
		var id = g_lh.getLocalLoginInfo().id;
		loadPrevAccountSetting ( id );	
		
		// 프로필 이미지 설정 버튼 
		$("#btn-profile-register").on ( "click" , function ()
		{
			if ( g_isOpen == false )
			{
				g_isOpen = true;
				g_iu.selectImage ( function ( resultObj )
				{	
					if ( resultObj.success == false ) 
					{
						g_isOpen = false;
						return;
					}
					
					var imageUri = resultObj.imageUri;
					g_iu.uploadImage ( imageUri , function ( result )
					{
						g_isOpen = false;
						if ( result.success == false ) 
						{ 
							doAlert ( result.cause , "프로필 이미지 변경 오류!" , function () {} );
							return;
						}
		
						$("#profile-img").attr("src",result.img_full_path)
						.attr("imgid",result.image_id);
					});
				});
			}
		});
		
		// 계정 설정 변경완료 버튼 
		$("#btn-account-modify").on ( "click" , function ()
		{
			navigator.notification.confirm(
		        '변경을 완료 하시겠습니까?', // message
		         onConfirm,            // callback to invoke with index of button pressed
		        '계정 설정',           // title
		        ['Yes','No']         // buttonLabels
		    );

			function onConfirm(btnIndex) {
				if (btnIndex != 1) { return; };
				var memberId = g_lh.getLocalLoginInfo().id;
				var imgid = $("#profile-img").attr("imgid");
				var newPw = $("#edit-pw").val();
				var confirmPw = $("#edit-pw-confirm").val();
				var phoneNum = $("#phone1").val() + "-" + $("#phone2").val() + "-" + $("#phone3").val();
				var authCode = $("#edit-authcode").val();
				var newNick = $("#edit-nick").val();
				
				if ( newPw.length != 0 )
				{
					if ( newPw != confirmPw ) 
					{ 
						doAlert ( "두 패스워드가 서로 다릅니다!" , "계정 설정 오류" , function () {} );
						return; 
					}
				}
				
				if ( $("#phone1").val().length == 0 ||
						$("#phone2").val().length == 0 || 
						$("#phone3").val().length == 0 ) { phoneNum = ""; }
				
				if ( phoneNum.length == 0 ) 
				{
					doAlert ( "휴대폰 번호를 적으셔야 합니다!" , "계정 설정 오류" , function () {} );
					return; 
				}
				
				var ajaxParam = {
					mid:memberId,
					pw:newPw,
					imgid:imgid,
					phonenum:phoneNum,
					authcode:authCode,
					nick:newNick
				};
				
				$.ajax ({
					url:"http://teamsf.co.kr/~coms/member_info_modify.php",
					data:ajaxParam,
					dataType:"json",
					type:"post",
					success:function ( resultObj )
					{
						if ( resultObj.success == true ) 
						{ 
							if ( resultObj.pw_changed == true )
							{
								g_lh.flushLogin ();
								g_lh.setId ( resultObj.email ); g_lh.setPw ( newPw );
								g_lh.doLogin ( function ( loginResult )
								{
									doAlert ( "비밀번호를 변경하면 로그아웃 됩니다. 다시 로그인 해주세요." , "계정 설정" , function () {} );
									location.href="./index.html";
								});
							}
							else
							{
								doAlert ( "정보를 변경하는데 성공하였습니다!" , "계정 설정" , function () {} );
								location.href="./index.html";
							}
						}
						else 
						{
							doAlert ( resultObj.cause , "계정 설정 실패" , function () {} ); 
						}
					}
				});
			}
		});
	});	
}

function loadPrevAccountSetting ( id )
{	
	$.ajax ({
		url:"http://teamsf.co.kr/~coms/zone_list_show.php",
		type:"post",
		dataType:"json",
		success:function ( zoneListArr )
		{
			
			var param = {mid:id};
			$.ajax ({
				url:"http://teamsf.co.kr/~coms/member_mycoms_info.php",
				type:"post",
				dataType:"json",
				data:param,
				success:function ( resultObj )
				{
					if ( resultObj.profile_img_id == 0 ) { $("#profile-img").attr("imgid",0); }
					else
					{
						$("#profile-img").attr( "imgid",resultObj.profile_img_id )
										.attr( "src",resultObj.profile_img_path );
					}

					$("#account-customer-name").html ( resultObj.name );
					$("#account-customer-email").html ( resultObj.email );
					
					var phone = resultObj.phone;
					var phoneArr = phone.split ( "-" );
					
					$("#phone1").val(phoneArr[0]); $("#phone2").val(phoneArr[1]); $("#phone3").val(phoneArr[2]);

					$("#edit-nick").val(resultObj.nickname);
				}
			});
		}
	});
}