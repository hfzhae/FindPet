<!-- #include virtual="/NetPower3.asp" -->
<!-- #include virtual="/WeixinAPI.asp" -->
<% 
dim wxobj, s, code

s = request("callback")
code = request("code")
set wxobj = new WeixinAPI

wxobj.init(conn)    
response.Write s&"("&wxobj.GetOpenid(code)&")"

 %>

