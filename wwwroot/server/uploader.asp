<%

dim fso, f, sFile, filePath, ym, d
d = date()
ym = year(d)&month(d)
set fso = createObject("Scripting.FileSystemObject")

sFile = replace(replace(replace(replace(unescape(request("fn")(1))," ","_"),"　","_"),"(","_"),")","_")

sFile = split(sFile,".")(0) & "_" & ToUnixTime(now, +8) &"."&split(sFile,".")(1)

filePath = NetBox.MapPath("\wwwroot\upload\") & ym &"\"
if not fso.FolderExists(filePath) then fso.CreateFolder filePath

filePath = filePath & sFile

set f = CreateObject("NetBOX.File")
f.Create filePath, true
f.Write request.form("file").Item
f.close
set f =Nothing

filePath = escape("/upload/" & ym & "/" & sFile)

response.Write "{""src"":""" & filePath & """}"

Function ToUnixTime(strTime, intTimeZone)
    If IsEmpty(strTime) Or Not IsDate(strTime) Then strTime = Now
    If IsEmpty(intTimeZone) Or Not IsNumeric(intTimeZone) Then intTimeZone = 0
    ToUnixTime = DateAdd("h", - intTimeZone, strTime)
    ToUnixTime = DateDiff("s", "1970-1-1 0:0:0", ToUnixTime)
End Function

 %>


