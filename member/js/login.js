
var g_lh = null;

function initAll ()
{
	g_lh = new LoginHandler ();
	initLoginPage ();
	initLostFoundPage ();
}

function doAlert ( msg , title , callbackFunction )
{
	navigator.notification.alert ( msg , callbackFunction , title , "확인" );
}

function initLoginPage ()
{
	$("#btn-login").click ( function ()
	{
        var email = $("#usr-email").val();
        var pwd = $("#usr-passwd").val();

        g_lh.setId(email); g_lh.setPw(pwd);
        g_lh.doLogin ( function ( resultObj )
        {
            if ( resultObj.success == true ) 
            { 
                location.href="../coms/index.html";
            }
            else 
            {
            	doAlert ( resultObj.cause , "로그인 오류" , function (){} );
            }
        });
    });
}

function initLostFoundPage ()
{	
	$("#btn-find-id").on("tap",function()
	{
		var phone1 = $("#txt-id-phone1").val(); 
		var phone2 = $("#txt-id-phone2").val();
		var phone3 = $("#txt-id-phone3").val();
		var userName = $("#txt-id-name").val();
		
		if ( phone1.length == 0 || phone2.length == 0 || phone3.length == 0 )
		{
			doAlert ( "휴대폰 번호를 입력해주세요!" , "아이디 찾기 오류" , function (){} );
			return;
		}
		if ( userName.length == 0 )
		{
			doAlert ( "사용자명을 입력해주세요!" , "아이디 찾기 오류" , function (){} );
			return;
		}
		var phoneNum = phone1 + "-" + phone2 + "-" + phone3;
		var ajaxParam = 
		{
			name:userName, 
			phone:phoneNum,
			type:"id"
		};
		
		$.ajax ({
			url:"http://teamsf.co.kr/~coms/lost_and_found.php",
			data:ajaxParam,
			type:"post",
			dataType:"json",
			success:function ( resultObj )
			{
				if ( resultObj.success == true )
				{
					var msg = "이메일아이디는 다음과 같습니다.\n"; var i;
					for ( i = 0 ; i < resultObj.email_arr.length ; i++ )
					{
						msg += "[" + resultObj.email_arr[i] + "]\n";
					}
					doAlert ( msg , "아이디 찾기 성공" , function (){
						location.href="../member/index.html";
					} );
				}
				else
				{
					doAlert ( resultObj.cause , "아이디 찾기 오류" , function (){
						//location.href="../index.html";
					} );
				}
			}
		});
	});
	
	$("#btn-find-pw").on("tap",function()
	{
		var phone1 = $("#txt-pw-phone1").val(); 
		var phone2 = $("#txt-pw-phone2").val();
		var phone3 = $("#txt-pw-phone3").val();
		var userName = $("#txt-pw-name").val();
		var mailAddr = $("#txt-pw-email").val();
		
		if ( phone1.length == 0 || phone2.length == 0 || phone3.length == 0 )
		{
			doAlert ( "휴대폰 번호를 입력해주세요!" , "비밀번호 찾기 오류" , function (){} );
			return;
		}
		if ( userName.length == 0 )
		{
			doAlert ( "사용자명을 입력해주세요!" , "비밀번호 찾기 오류" , function (){} );
			return;
		}
		if ( mailAddr.length == 0 )
		{
			doAlert ( "메일주소를 입력하세요!" , "비밀번호 찾기 오류" , function (){} );
			return;
		}
		var phoneNum = phone1 + "-" + phone2 + "-" + phone3;
		var ajaxParam = 
		{
			name:userName,
			phone:phoneNum,
			email:mailAddr,
			type:"pw"
		};
		
		$.ajax ({
			url:"http://teamsf.co.kr/~coms/lost_and_found.php",
			data:ajaxParam,
			type:"post",
			dataType:"json",
			success:function ( resultObj )
			{
				g_lh.flushLogin ();
				if ( resultObj.success == true )
				{
					doAlert ( "가입시의 이메일로 임시 패스워드가 전송되었습니다." , "비밀번호 찾기 성공" , function (){
						location.href="../member/index.html";
					} );
				}
				else
				{
					doAlert ( resultObj.cause , "비밀번호 찾기 오류" , function (){
						//location.href="../coms/index.html";
					} );
				}
			}
		});
	});
}

function initPhonegap ()
{
	document.addEventListener("deviceready", initAll , false);	
}