<%Option Explicit
 

dim conn

GetConn

function GetConn()
    set conn = Server.CreateObject("ADODB.Connection")   
    '���Ӵ���Ҫע��sqlserver��ʵ�������Ƿ���Ĭ�ϣ���Ĭ�ϱ���Ҫд����  
    conn.open "provider=sqloledb;data source=.;uid=sa;pwd=1qaz!QAZ;database=FindPet"
end function

function SQLInputParam(s):SQLInputParam = replace(Replace(s, "'", ""),"--",""):End Function
function ClngEx(v):ClngEx = 0:on error resume next:ClngEx = CLng(v):on error goto 0:end function
function CCurEx(v):CCurEx = 0:on error resume next:CCurEx = CCur(v):on error goto 0:end function

%>