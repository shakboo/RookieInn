// 需要注意的四点状态改变
// 1.申请提交
// 2.取消，拒绝待批准点位
// 3.取消使用中的点位
// 4.同意待批准的点位


$(function(){

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
                        // 表格、模态框变化
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
        var id = $(this).attr("data-id");
        var status_id = "#status" + id;
        var expiration_id = "#expiration" + id;
        var user_information_id = "#user_information" + id;
        var apply_id = '#apply' + id;
        var submit_id = "#submit" + id;
        var device_information_id = "device_information" + id;
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

                        // 表格、模态框变化
                        $(status_id).html(data["status"]);
                        $(status_id).css('background-color', 'rgb(79, 204, 79)');
                        $(user_information_id).html("无");
                        $(device_information_id).html("");
                        $(expiration_id + '_web').html("暂无");
                        $(expiration_id + '_web').css("color", 'black');
                        $(apply_id).html(
                            '<a href="#" data-toggle="modal" data-target="#submit'+id+'">\
                                <button type="button" class="btn btn-warning">申请</button>\
                            </a>'
                        );
                        $(submit_id+" textarea").val("");
                        $(expiration_id).val("");
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
        var id = $(this).attr("data-id");
        var status_id = "#status" + id;
        var expiration_id = "#expiration" + id;
        var user_information_id = "#user_information" + id;
        var device_information_id = "device_information" + id;
        var apply_id = '#apply' + id;
        var submit_id = "#submit" + id;
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

                        // 表格、模态框变化
                        $(status_id).html(data["status"]);
                        $(status_id).css('background-color', 'rgb(79, 204, 79)');
                        $(user_information_id).html("无");
                        $(device_information_id).html("无");
                        $(apply_id).html(
                            '<a href="#" data-toggle="modal" data-target="#submit'+id+'">\
                                <button type="button" class="btn btn-warning">申请</button>\
                            </a>'
                        );
                        $(expiration_id + '_web').html("暂无");
                        $(expiration_id + '_web').css("color", 'black');
                        $(submit_id+" textarea").val(""); 
                        $(expiration_id).val("");
                    }
                }
            });
            return true;
        }else{
            return false;
        };
    });

    // 申请提交
    $("body").on("click", '.application', function () {
        var id = $(this).attr("data-id");
        var information_id = "#information" + id;
        var expiration_id = "#expiration" + id;
        var detail_id = "#detail" + id;
        var submit_id = "#submit" + id;
        var status_id = "#status" + id;
        var user_information_id = "#user_information" + id;
        var apply_id = '#apply' + id;
        if($(information_id).val() && $(expiration_id).val()){
            var pk = $(this).attr("name");
            content = $(information_id).val();
            expiration = $(expiration_id).val();
            $.ajax({
                url: "/Stable/submit/",
                type:"POST",
                data:{
                    "pk":pk,
                    "content":content,
                    "expiration":expiration,
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
                            // 表格、模态框状态变化
                            $(status_id).html(data["status"] + '<a href="#" class="approve" data-id='+id+' name='+pk+'><span class="glyphicon glyphicon-ok"></span></a>   <a href="#" data-id='+id+' class="reject" name='+pk+'><span class="glyphicon glyphicon-remove" style="color: red"></span></a>');     
                        }else{
                            $(status_id).html(data["status"] + '<a href="#" data-id='+id+' class="reject_user" name='+pk+'><span class="glyphicon glyphicon-remove" style="color: red"></span></a>');
                        };
    
                        $(status_id).css('background-color', 'yellow');
                        $(user_information_id).html(data["user"] + '<a href="#" data-toggle="modal" data-target="#detail' + id +'"><span class="glyphicon glyphicon-search"></span></a>');
                        $(apply_id).html("该点位暂不能申请");
                        $(expiration_id+"_web").html(data["expiration"]);
                        var timestamp = new Date(Date.parse(data["expiration"].replace(/-/g,"/")));
                        var dateNow = new Date();
                        if (dateNow > timestamp){
                            $(expiration_id+"_web").css("color", 'red');
                        } else if (dateNow > (timestamp - 1000 * 60 * 60 * 24 * 7) && dateNow <= timestamp) {
                            $(expiration_id+"_web").css("color", 'DarkGoldenRod');
                        }
                        $(detail_id+" .modal-body").html(
                            '<p>使用者：'+data['user']+'</p>\
                            <p>管理员：'+data['admin']+'</p>\
                            <p>设备信息：</p>\
                            <pre>'+data['information']+'</pre>'
                        );
                    };
                    $(submit_id).modal('hide');
                }
            });
            return true;
        }else if(!$(information_id).val()){
            alert("请填写设备信息！");
            return false;
        }else{
            alert("请填写到期时间！");
            return false;
        };
    });

    // 下拉框筛选用dataTable搜索栏实现
    var search_info = new Array(); 

    // 对应search_info[0]，主要是快速筛选点位位置
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
            success : function(data){
                var data = JSON.parse(data);
                var table = $('#table_id_index').DataTable();
                var ips = table.cells('.ip').nodes();
                for (var i=0;i<ips.length;i++){
                    if (data[ips[i].children[0].innerHTML]) {
                        ips[i].children[1].style.backgroundColor = "#00FF00";
                    }
                }
            },
        })
    }
    ping();
    setInterval('ping()', 1000*60*10);
})