<!-- #include virtual="/NetPower3.asp" -->
<!-- #include virtual="/WeixinAPI.asp" -->
<%
dim wxobj, s
s = request("callback")
set wxobj = new WeixinAPI
wxobj.init(conn)    
response.Write s&"("&wxobj.Getticket(wxobj.Getaccess_token())&")"

 %>