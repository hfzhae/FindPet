<!-- #include file="public.asp" -->
<% 
dim s, version, rs
s = request("callback")
set rs = conn.execute("select top 1 version from info where infotype=2003 and isdeleted=0")
if not rs.eof then
    version = rs("version").value
else
    version = "2017070132039"
end if
%>
<%=s%>(
    {
        v:<%=version %>
    }
)