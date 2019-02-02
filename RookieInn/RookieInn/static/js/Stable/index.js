// 需要注意的四点状态改变
// 1.申请提交
// 2.取消，拒绝待批准点位
// 3.取消使用中的点位
// 4.同意待批准的点位


$(function(){

    // 异常提交
    $("body").on('click', "#abnormal-submit", function(){
        var abnormal_information = $("#abnormal-information").val();
        console.log(abnormal_information);
        $.ajax({
            url:"/Stable/abnormal/",
            type:"POST",
            data:{
                "information":abnormal_information,
                "csrfmiddlewaretoken":$('[name="csrfmiddlewaretoken"]').val()
            },
            success:function(data){
                $("#abnormal-information").text('');
                alert("提交成功！");
                $("#abnormal").modal('hide');
            }
        })
    })

    function filter_abnormal_location(){
        $("#abnormal-location-loading").css("display", "inline-block");
        $('#abnormal-location-main-table').css("display", "none");
        $('#abnormal-location-main').html("");
        var table = $('#table_id_index').DataTable();
        var locations = table.cells('.location').nodes();
        var ips = table.cells('.ip').nodes();
        var statues = table.cells('.status').nodes();
        var num = 0
        for (var i=0;i<locations.length;i++){
            // 把没填IP的点位筛选掉
            if (ips[i].children.length == 1){
                continue;
            }
            if ($(ips[i].children[1]).css("background-color").replace(/^\s*|\s*$/g,"") == "rgb(0, 255, 0)" && $(statues[i]).text().replace(/^\s*|\s*$/g,"") == "未使用"){
                $("#abnormal-location-main").append(
                    "<tr><td class='text-center' width='20%'>" + $(ips[i]).html() + "</td> \
                    <td class='text-center' width='30%'>" + $(locations[i]).text()+"</td> \
                    <td class='text-center' width='10%'>" + $(statues[i]).text()+"</td> \
                    <td class='text-center' width='40%'>" + "该点位无人使用但IP被占用"+"</td> \
                    </tr>");
                num = num + 1;
            } else if (($(ips[i].children[1]).css("background-color").replace(/^\s*|\s*$/g,"") == "rgb(255, 0, 0)" || $(ips[i].children[1]).css("background-color").replace(/^\s*|\s*$/g,"") == "red") && $(statues[i]).text().replace(/^\s*|\s*$/g,"")  == "使用中"){
                $("#abnormal-location-main").append(
                    "<tr><td class='text-center' width='20%'>" + $(ips[i]).html() + "</td> \
                    <td class='text-center' width='30%'>" + $(locations[i]).text()+"</td> \
                    <td class='text-center' width='10%'>" + $(statues[i]).text()+"</td> \
                    <td class='text-center' width='40%'>" + "该使用中的点位IP已断开"+"</td> \
                    </tr>");
                num = num + 1;
            }
        }
        $('#abnormal-location-main-table').removeAttr("style");
        $("#abnormal-location-loading").css("display", "none");
        $("#abnormal-location-number").css("display", "inline");
        $("#abnormal-location-number").text(num);
        console.log("complete");    
    }
    
    // 点击异常点位筛选
    $("body").on('click', '#open-abnormal-location', filter_abnormal_location);

    // 点击申请之后初始化申请模态框
    $("body").on('click', '.submit-btn', function() {
        var id = $(this).attr('data-id');
        var ip_id = "#ip" + id;
        $("#connect-information").text("");
        $("#connect-information").removeAttr("class");
        if ($(ip_id).text() == '该点位IP暂为空') {
            $("#ping-single").css("display","inline-block");
            $("#addip").val("");
            $("#addip").removeAttr('disabled');
        }else{
            $("#ping-single").css("display","none");
            $("#addip").val($(ip_id).text());
            $("#addip").attr('disabled', 'disabled');
        }
        $("#pk").attr('data-id', $(this).attr('data-id'));
        // 清除申请模态框里的信息
        $("#information").val("");
        $("#expiration").val("");
    })

    // 判断申请框中的IP的连接状态
    $("body").on("click", "#ping-single", function(){
        $.ajax({
            url: "/Stable/ping/",
                type:"POST",
                data:{
                    "ip":$("#addip").val(),
                    "csrfmiddlewaretoken":$('[name="csrfmiddlewaretoken"]').val()
                },
                success:function(data){
                    var data = JSON.parse(data);
                    if (!data["error"]){
                        if(data["ping"]){
                            $("#connect-information").css("color", "red");
                            $("#connect-information").removeAttr("class");
                            $("#connect-information").text("该IP已被人使用");
                        }else{
                            $("#connect-information").attr("class", "glyphicon glyphicon-ok");
                            $("#connect-information").text("");
                            $("#connect-information").css("color", "green");
                        }
                    }else if(data["error"] == 3){
                        $("#connect-information").css("color", "red");
                        $("#connect-information").removeAttr("class");
                        $("#connect-information").text("此IP不为有效IP");
                    }
                }
        })
    })

    // 初始化使用信息模态框
    $("body").on('click', '.information-btn', function() {
        var id = $(this).attr('data-id');
        var device_user = "#device_user" + id;
        var device_admin = "#device_admin" + id;
        var device_information = "#device_information" + id;
        $("#detail"+" .modal-body").html(
            '<p>使用者：'+$(device_user).text()+'</p>\
            <p>管理员：'+$(device_admin).text()+'</p>\
            <p>设备信息：</p>\
            <pre>'+$(device_information).text()+'</pre>'
        );
    })

    // 申请提交
    $("body").on("click", '.application', function () {
        
        var id = $(this).attr("data-id"); // 列标记
        var pk_id = "#device_pk" + id;    // PK标记
        var ip_id = "#ip" + id;           // IP列
        var status_id = "#status" + id;   // 状态列
        var expiration_id = "#expiration" + id; // 过期时间列
        var user_information_id = "#user_information" + id; // 使用信息列
        var apply_id = '#apply' + id; // 申请列
        var device_user = "#device_user" + id;  // 使用者列
        var device_admin = "#device_admin" + id; // 管理员列
        var device_information = "#device_information" + id; // 设备信息列
        if($("#information").val() && $("#expiration").val() && $("#addip").val()){
            var pk = $(pk_id).attr("name");
            content = $("#information").val();
            expiration = $("#expiration").val();
            addip = $("#addip").val();
            $.ajax({
                url: "/Stable/submit/",
                type:"POST",
                data:{
                    "pk":pk,
                    "content":content,
                    "expiration":expiration,
                    "addip": addip,
                    "csrfmiddlewaretoken":$('[name="csrfmiddlewaretoken"]').val()
                    },
                success:function(data){
                    var data = JSON.parse(data);
                    if (!data["error"]){
                        
                        // 下拉框待批设备数量变化
                        var waiting_permit_devices_num = parseInt($("#waiting_permit_devices_num").text());
                        $("#waiting_permit_devices_num").html(waiting_permit_devices_num+1);    

                        if (data['isAdmin']){

                            // 待批准数量变化
                            var badge_number = parseInt($('#badge').text());
                            $('#badge').html(badge_number+1);

                            // 状态列
                            $(status_id).html(data["status"] + '<a href="#" class="approve" data-id='+id+' name='+pk+'><span class="glyphicon glyphicon-ok"></span></a>   <a href="#" data-id='+id+' class="reject" name='+pk+'><span class="glyphicon glyphicon-remove" style="color: red"></span></a>');     
                        }else{
                            $(status_id).html(data["status"] + '<a href="#" data-id='+id+' class="reject_user" name='+pk+'><span class="glyphicon glyphicon-remove" style="color: red"></span></a>');
                        };
                        $(status_id).css('background-color', 'yellow');

                        // IP列
                        $(ip_id).parent().attr('class', 'text-center ip');
                        if (data['ping']) {
                            $(ip_id).parent().html('<span id="ip'+ id +'"> '+ data['ip'] + '</span> \
                            <i style="width:10px;height:10px;border-radius:50%;border-style: solid;border-width: thin;  background-color:#00FF00;display: inline-block"></i>');
                        }else{
                            $(ip_id).parent().html('<span id="ip'+ id +'"> '+ data['ip'] + '</span> \
                            <i style="width:10px;height:10px;border-radius:50%;border-style: solid;border-width: thin;  background-color:red;display: inline-block"></i>');
                        }
                        
                        // 使用信息列
                        $(user_information_id).html(data["user"] + '<a href="#" data-toggle="modal" data-target="#detail' + id +'"><span class="glyphicon glyphicon-search"></span></a>');
                        // 申请列
                        $(apply_id).html("该点位暂不能申请");
                        // 过期时间列
                        $(expiration_id).html(data["expiration"]);
                        var timestamp = new Date(Date.parse(data["expiration"].replace(/-/g,"/")));
                        var dateNow = new Date();
                        if (dateNow > timestamp){
                            $(expiration_id).css("color", 'red');
                        } else if (dateNow > (timestamp - 1000 * 60 * 60 * 24 * 7) && dateNow <= timestamp) {
                            $(expiration_id).css("color", 'DarkGoldenRod');
                        }
                        // 隐藏列信息更新
                        $(device_user).html(data['user']);
                        $(device_admin).html(data['admin']);
                        $(device_information).html(data['information']);
                    }else if (data['error'] == 1){
                        alert("该IP已经存在！");
                        $("#addip").val('');
                    }else if (data['error'] == 2){
                        alert("该点位已经被申请使用！");
                        window.location.reload();
                    }else if (data['error'] == 3){
                        alert("请输入合法的IP！");
                        $("#addip").val('');
                    };
                    $("#submit").modal('hide');
                }
            });
            return true;
        }else if(!$("#information").val()){
            alert("请填写设备信息！");
            return false;
        }else if(!$("#addip").val()){
            alert("请填写设备IP！");
            return false;
        }else if(!$("expiration").val()){
            alert("请填写到期时间！");
            return false;
        };
    });

    // 管理员批准点位申请
    $("body").on('click', '.approve', function () {
        var id = $(this).attr("data-id");
        var status_id = "#status" + id;
        if(confirm("确定批准该点位请求吗？")==true){
            var pk = $(this).attr("name");
            $.ajax({
                url: "/Stable/approve/",
                type: "POST",
                data:{
                    "pk": pk,
                    "csrfmiddlewaretoken":$('[name="csrfmiddlewaretoken"]').val()
                },
                success:function(data){
                    var data = JSON.parse(data);
                    if (!data["error"]){
                        // 状态列
                        $(status_id).html(data["status"]+'<a href="#" class="delete" data-id='+id+' name='+pk+'><span class="glyphicon glyphicon-remove"></span></a>');
                        $(status_id).css('background-color', 'rgb(255, 78, 78)');

                        // 待批准数量
                        var badge_number = parseInt($('#badge').text());
                        $('#badge').html(badge_number-1);

                        // 我的设备和待批设备数量（只对管理员有效）
                        if (data['isChangeDevicesNum']){
                            var using_devices_num = parseInt($("#using_devices_num").text());
                            var waiting_permit_devices_num = parseInt($("#waiting_permit_devices_num").text());
                            $("#using_devices_num").html(using_devices_num +1);
                            $("#waiting_permit_devices_num").html(waiting_permit_devices_num-1);
                        }
                    }else if (data['error'] == 1){
                        alert('该点位已经被批准或者取消申请！');
                        window.location.reload();
                    }
                }
            });
            return true;
        }else{
            return false;
        };
    });

    // 取消、拒绝待批准的点位申请
    $("body").on('click', '.reject', function () {
        var id = $(this).attr("data-id");  // 列标记
        var status_id = "#status" + id;    // 状态列
        var expiration_id = "#expiration" + id; // 过期时间列
        var user_information_id = "#user_information" + id; // 使用信息列
        var apply_id = '#apply' + id; // 申请列
        var device_user = "#device_user" + id; // 使用者列
        var device_information = "device_information" + id; // 设备信息列
        if(confirm("确定取消申请吗？")==true){
            var pk = $(this).attr("name");
            $.ajax({
                url: "/Stable/delete/",
                type:"POST",
                data:{
                    "pk":pk,
                    "csrfmiddlewaretoken":$('[name="csrfmiddlewaretoken"]').val()
                },
                success:function(data){
                    var data = JSON.parse(data);
                    if (!data["error"]){
                        // 待批准数量（管理员可见）
                        if (data['isAdmin']){
                            var badge_number = parseInt($('#badge').text());
                            $('#badge').html(badge_number-1);
                        }

                        // 下拉框待批设备数量
                        if (data['isChangeDevicesNum']) {
                            var waiting_permit_devices_num = parseInt($("#waiting_permit_devices_num").text());
                            $("#waiting_permit_devices_num").html(waiting_permit_devices_num-1);                            
                        }

                        // 状态列
                        $(status_id).html(data["status"]);
                        $(status_id).css('background-color', 'rgb(79, 204, 79)');
                        // 使用信息列
                        $(user_information_id).html("无");
                        // 隐藏信息
                        $(device_information).html("");
                        $(device_user).html("");
                        // 过期时间列
                        $(expiration_id ).html("暂无");
                        $(expiration_id ).css("color", 'black');
                        // 申请列
                        $(apply_id).html(
                            '<a href="#" data-toggle="modal" data-target="#submit"> \
                            <button type="button" class="btn btn-warning submit-btn" data-id="' + id +'">申请</button></a>'
                        );
                    }else if (data['error'] == 1){
                        alert('该点位已经处于未使用状态了！');
                        window.location.reload();
                    }else if (data['error'] == 2){
                        alert('该点位已经被人批准使用了！');
                        window.location.reload();
                    }
                }
            });
            return true;
        }else{
            return false;
        };
    });

    // 将使用中的点位置为未使用
    $("body").on('click', '.delete', function () {
        var id = $(this).attr("data-id");  // 列标记
        var status_id = "#status" + id;    // 状态列
        var expiration_id = "#expiration" + id; // 过期时间列
        var user_information_id = "#user_information" + id; // 使用信息列
        var device_information = "#device_information" + id; // 设备信息列
        var device_user = "#device_user" + id;  // 使用者列
        var apply_id = '#apply' + id;  // 申请列
        if(confirm("确定删除该点位的使用信息并使该点位置为未使用吗？")==true){
            var pk = $(this).attr("name");
            $.ajax({
                url: "/Stable/delete/",
                type:"POST",
                data:{
                    "pk":pk,
                    "csrfmiddlewaretoken":$('[name="csrfmiddlewaretoken"]').val()
                },
                success:function(data){
                    var data = JSON.parse(data);
                    if (!data["error"]){
                        // 下拉框我的设备数量变化
                        if (data['isChangeDevicesNum']){
                            var using_devices_num = parseInt($("#using_devices_num").text());
                            $("#using_devices_num").html(using_devices_num -1);
                        }                        

                        // 状态列
                        $(status_id).html(data["status"]);
                        $(status_id).css('background-color', 'rgb(79, 204, 79)');
                        // 使用信息列
                        $(user_information_id).html("无");
                        // 设备信息列
                        $(device_information).html("无");
                        // 申请列这里要检查
                        $(apply_id).html(
                            '<a href="#" data-toggle="modal" data-target="#submit"> \
                            <button type="button" class="btn btn-warning submit-btn" data-id="' + id +'">申请</button></a>'
                        );
                        // 过期时间列
                        $(expiration_id ).html("暂无");
                        $(expiration_id ).css("color", 'black');
                        // 隐藏信息列
                        $(device_information).html("");
                        $(device_user).html("");
                    }else if (data['error'] == 1){
                        alert('该点位已经处于未使用状态了！');
                        window.location.reload();
                    }else if (data['error'] == 2){
                        alert('该点位已经被人批准使用了！');
                        window.location.reload();
                    }
                }
            });
            return true;
        }else{
            return false;
        };
    });


    // 下拉框筛选用dataTable搜索栏实现
    var search_info = new Array(); 

    // 对应search_info[1]，主要是快速筛选点位位置
    $("#select-location").change(function(){
        var location = $(this).children('option:selected').val();
        var table = $('#table_id_index').DataTable();
        if (location != "0"){
            search_info[0] = $(this).children('option:selected').text();
            table.search(search_info.join('')).draw();
        }else{
            search_info[0] = ''
            table.search(search_info.join('')).draw();
        }
    });

    // 过期时间的提醒的前端实现
    function over_time(){
        var table = $('#table_id_index').DataTable();
        var timed = table.cells('.timed').nodes();  // 所有class='timed'的节点
        var dateNow = new Date();
        for (var i=0,len=timed.length;i<len;i++){
            if(timed[i].innerHTML == '暂无'){
                continue;
            } else {
                timestamp = new Date(timed[i].innerHTML).getTime();
                if (dateNow > timestamp){
                    timed[i].style.color = 'red';
                } else if (dateNow > (timestamp - 1000 * 60 * 60 * 24 * 7) && dateNow <= timestamp) {
                    timed[i].style.color = 'DarkGoldenRod';
                }
            }
        }
    }

    over_time();

    // 每隔10分钟向后台请求设备的连接状况
    function ping(){
        $.ajax({
            url : "/Stable/ping/",
            type :"GET",
            dataTyoe: "json",
            cache: false,
            success : function(data){
                var data = JSON.parse(data);
                var table = $('#table_id_index').DataTable();
                var ips = table.cells('.ip').nodes();
                for (var i=0;i<ips.length;i++){
                    if (data[ips[i].children[0].innerHTML]) {
                        ips[i].children[1].style.backgroundColor = "#00FF00";
                    }
                }
                $('.close').click();
                filter_abnormal_location();
            },
        })
    }
    ping();
    setInterval(ping, 1000*60*10);

})