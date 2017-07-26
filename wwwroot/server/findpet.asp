<%

Class FindpetObj
    private Conn
    
    public function init(vConn)
        set Conn = vConn
    end function
    
    '精确匹配方法,参数:timeInput(时间),Varieties(品种),Gender(性别),color(颜色),placeText(地址),placepoint(坐标),sendType(类型1捡到0寻宠),返回找到的ID 2017-7-17 zz
    public function findpet(timeInput, Varieties, Gender, color, placeText, placepoint, sendType)
        dim rs, sql, strWhere, placeArr
        
        findpet = 0
        
        timeInput = GetDateStr(timeInput)
        Varieties = SQLInputParam(Varieties)
        Gender = SQLInputParam(Gender)
        color = SQLInputParam(color)
        placeText = SQLInputParam(placeText)
        placepoint = SQLInputParam(placepoint)
        sendType = ClngEx(sendType)
        
        if sendType = 0 then 
            strWhere = "isdeleted=0 and sendType=1"
        else 
            strWhere = "isdeleted=0 and sendType=0"
        end if
        
        
        if len(timeInput) > 0 then '30天内匹配查询
            strWhere = strWhere & " and DateAdd(d, -30, timeInput) < '"&timeInput&"'"
        end if
        
        if len(Varieties) > 0 then
            strWhere = strWhere & " and Varieties='"&Varieties&"'"
        end if
        
        if len(Gender) > 0 then
            strWhere = strWhere & " and Gender='"&Gender&"'"
        end if
                 
        if len(color) > 0 then
            strWhere = strWhere & " and color='"&color&"'"
        end if
        
        if len(placeText) > 0 then
            placeArr = split(placeText, ",")
            if UBound(placeArr) = 4 then
                strWhere = strWhere & " and SUBSTRING(placeText,0,charindex(',',placeText,0)) = '"& placeArr(0) &"'"
                strWhere = strWhere & " and SUBSTRING(SUBSTRING(placeText,charindex(',',placeText,0)+1,len(placeText)),0,charindex(',',SUBSTRING(placeText,charindex(',',placeText,0)+1,len(placeText)),0)) = '"& placeArr(1) &"'"
            else
                exit function
            end if
        end if
                
        sql = "select top 1 id from findpet where "& strWhere &" order by id desc"

        set rs = CreateObject("Adodb.Recordset")
        rs.CursorLocation = 3
        rs.Open sql, Conn, 0, 1
        
        if not rs.eof then
            findpet = rs("id").value
        end if
    
    end function

    '模糊匹配方法,参数:timeInput(时间),Varieties(品种),Gender(性别),color(颜色),placeText(地址),placepoint(坐标),sendType(类型1捡到0寻宠),返回找到的ID 2017-7-17 zz
    public function findpetRs(timeInput, Varieties, Gender, color, placeText, placepoint, sendType)
        dim rs, sql, strWhere, placeArr
                
        timeInput = GetDateStr(timeInput)
        Varieties = SQLInputParam(Varieties)
        Gender = SQLInputParam(Gender)
        color = SQLInputParam(color)
        placeText = SQLInputParam(placeText)
        placepoint = SQLInputParam(placepoint)
        sendType = ClngEx(sendType)
        
        if sendType = 0 then 
            sendType = 1 
        else 
            sendType = 0 
        end if
        
        strWhere = "isdeleted=0 and sendType=" & sendType
        
        if len(timeInput) > 0 then '30天内匹配查询
            strWhere = strWhere & " and DateAdd(d, -30, timeInput) < '"&timeInput&"'"
        end if
        
        if len(Varieties) > 0 then
            strWhere = strWhere & " and Varieties='"&Varieties&"'"
        end if
        
        if len(Gender) > 0 then
            'strWhere = strWhere & " and Gender='"&Gender&"'"
        end if
                 
        if len(color) > 0 then
            'strWhere = strWhere & " and color='"&color&"'"
        end if
        
        if len(placeText) > 0 then
            placeArr = split(placeText, ",")
            if UBound(placeArr) = 4 then
                strWhere = strWhere & " and SUBSTRING(placeText,0,charindex(',',placeText,0)) = '"& placeArr(0) &"'"
                'strWhere = strWhere & " and SUBSTRING(SUBSTRING(placeText,charindex(',',placeText,0)+1,len(placeText)),0,charindex(',',SUBSTRING(placeText,charindex(',',placeText,0)+1,len(placeText)),0)) = '"& placeArr(1) &"'"
            end if
        end if
        
        sql = "select * from findpet where "& strWhere &" order by id desc"

        set rs = CreateObject("Adodb.Recordset")
        rs.CursorLocation = 3
        rs.Open sql, Conn, 0, 1
        
        set findpetRs = rs
    end function

    
    function SQLInputParam(s):SQLInputParam = replace(Replace(s, "'", ""),"--",""):End Function
    function ClngEx(v):ClngEx = 0:on error resume next:ClngEx = CLng(v):on error goto 0:end function
    function CCurEx(v):CCurEx = 0:on error resume next:CCurEx = CCur(v):on error goto 0:end function
    function GetDateStr(d):GetDateStr = year(d) & "-" & Right("0" & month(d), 2) & "-" & Right("0" & day(d), 2):end function
end class


 %>