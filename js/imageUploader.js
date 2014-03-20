/*

이미지 업로드 모듈
Javascript class ImageUploader 

=OverView
PhoneGap을 사용하여 teamSF서버에 프로필 사진 등을 업로드하고 image PK, absolute path 등을 리턴하는 래퍼 클래스

=setNavigatorObj ( navObj ) : void 
navObj 폰갭에서 제공하는 Navigator 인스턴스 
무조건 이 값을 맨 먼저 세팅해야함

=selectImage ( callBackFunction ) : void 
callBackFunction 콜백메서드
안드로이드/ios 디바이스의 갤러리를 열고 사용자가 사진 선택하면 거기에 대한 Local Uri 를 callback으로 리턴하는 메서드
콜백메서드는 JSONObject 하나가 넘어오며 키는 다음과 같음
success : 성공/실패여부 (true/false)
cancel : 실패인 경우만 값이 주어짐. 사용자가 취소하였는지의 여부 (true/false)
cause : 실패인 경우의 실패사유
imageUri : 선택한 이미지의 Local URI

=uploadImage ( imageUri , callBackFunction ) : void
imageUri 업로드할 이미지의 Local URI 
callBackFunction 콜백메서드
선택한 이미지를 서버로 실제로 업로드하는 메서드
콜백메서드는 JSONObject 하나가 넘어오며 키는 다음과 같음
success : 성공/실패여부 (true/false)
cause : 실패인 경우의 실패사유
image_id : 업로드한 이미지의 DB의 PK
file_name : 이미지의 파일이름
img_full_path : 이미지의 절대경로 ( http://teamsf.co.kr/~coms.... )

*/


function ImageUploader ()
{
	this.mNavObj = null;
	
	this.getNavigatorObj = function () { return this.mNavObj; };
	this.setNavigatorObj = function ( navObj ) { this.mNavObj = navObj; };
	this.selectImage = function ( callback )
	{
		if ( this.mNavObj == null )  
		{ callback ( {"success":false,"cause":"Navigator object null","cancel":false} ); return; }
		
		var imageOption = 
		{
			"quality":50,
			"destinationType":this.mNavObj.camera.DestinationType.FILE_URI,
	    	"sourceType":this.mNavObj.camera.PictureSourceType.PHOTOLIBRARY,
	    	"targetWidth":500,
	    	"targetHeight":400,
	    	"encodingType": Camera.EncodingType.JPEG
		};
		
		this.mNavObj.camera.getPicture ( 
				function ( imageUri ) { callback ({"success":true,"cause":null,"imageUri":imageUri}); }, 
				function ( errmsg ) { callback ({"success":false,"cause":errmsg,"cancel":true}); },
				imageOption
		);
	};
	this.uploadImage = function ( imageUri , callback )
	{
		if ( this.mNavObj == null )  
		{ callback ( {"success":false,"cause":"Navigator object null"} ); return; }
		
		var ft = new FileTransfer ();
		var option = new FileUploadOptions ();
		option.fileKey = "file";
		option.fileName = imageUri.substr(imageUri.lastIndexOf('/')+1);
		option.mimeType = "multipart/form-data";
		option.chunkedMode = false;
		option.headers = { Connection: "close" };
		
		ft.upload ( imageUri , "http://teamsf.co.kr/~coms/image_upload.php" , 
				function ( response )
				{
					var resObj = JSON.parse(response.response);
					callback ( resObj );
				},
				function ( errorObj ) 
				{ 
					callback ( {"success":false,"cause":"ERROR CODE "+errorObj.code} );
				},
				option );
	};
}