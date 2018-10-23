$(function(){

    // 管理员批准点位申请
    $("body").on('click', '.approve', function () {
        var id = $(this).attr("data-id");
        var status_id = "#status" + id;
        var badge_number = parseInt($('#badge').text());
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
                        $(status_id).html(data["status"]+'<a href="#" class="delete" data-id='+id+' name='+pk+'><span class="glyphicon glyphicon-remove"></span></a>');
                        $(status_id).css('background-color', 'rgb(255, 78, 78)');
                        $('#badge').html(badge_number-1);
                    }
                }
            });
            return true;
        }else{
            return false;
        };
    });

    // 管理员拒绝点位批准的申请
    $("body").on('click', '.reject', function () {
        var id = $(this).attr("data-id");
        var status_id = "#status" + id;
        var user_information_id = "#user_information" + id;
        var apply_id = '#apply' + id;
        var submit_id = "#submit" + id;
        var badge_number = parseInt($('#badge').text());
        if(confirm("确定拒绝该点位请求吗？")==true){
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
                        $(status_id).html(data["status"]);
                        $(status_id).css('background-color', 'rgb(79, 204, 79)');
                        $(user_information_id).html("无");
                        $('#badge').html(badge_number-1);
                        $(apply_id).html(
                            '<a href="#" data-toggle="modal" data-target="#submit'+id+'">\
                                <button type="button" class="btn btn-warning">申请</button>\
                            </a>'
                        );
                        $(submit_id+" textarea").val("");
                    }
                }
            });
            return true;
        }else{
            return false;
        };
    });

    // 普通用户取消待批准的点位申请
    $("body").on('click', '.reject_user', function () {
        var id = $(this).attr("data-id");
        var status_id = "#status" + id;
        var user_information_id = "#user_information" + id;
        var apply_id = '#apply' + id;
        var submit_id = "#submit" + id;
        var badge_number = parseInt($('#badge').text());
        var ip_id = "#ip" + id;
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
                        $(status_id).html(data["status"]);
                        $(status_id).css('background-color', 'rgb(79, 204, 79)');
                        $(user_information_id).html("无");
                        $('#badge').html(badge_number-1);
                        $(apply_id).html(
                            '<a href="#" data-toggle="modal" data-target="#submit'+id+'">\
                                <button type="button" class="btn btn-warning">申请</button>\
                            </a>'
                        );
                        $(submit_id+" textarea").val("");
                        $(ip_id).html("该IP不可见");
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
        var user_information_id = "#user_information" + id;
        var apply_id = '#apply' + id;
        var submit_id = "#submit" + id;
        var ip_id = "#ip" + id;
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
                        $(status_id).html(data["status"]);
                        $(status_id).css('background-color', 'rgb(79, 204, 79)');
                        $(user_information_id).html("无");
                        $(apply_id).html(
                            '<a href="#" data-toggle="modal" data-target="#submit'+id+'">\
                                <button type="button" class="btn btn-warning">申请</button>\
                            </a>'
                        );
                        $(submit_id+" textarea").val("");
                        if(!data['isAdmin']){
                            $(ip_id).html("该IP不可见");
                        }
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
        var detail_id = "#detail" + id;
        var submit_id = "#submit" + id;
        var status_id = "#status" + id;
        var user_information_id = "#user_information" + id;
        var apply_id = '#apply' + id;
        var ip_id = '#ip' + id;
        if($(information_id).val()){
            var pk = $(this).attr("name");
            content = $(information_id).val();
            $.ajax({
                url: "/Stable/submit/",
                type:"POST",
                data:{
                    "pk":pk,
                    "content":content,
                    "csrfmiddlewaretoken":$('[name="csrfmiddlewaretoken"]').val()
                    },
                success:function(data){
                    var data = JSON.parse(data);
                    if (!data["error"]){

                        if (data['isAdmin']){
                            $(status_id).html(data["status"] + '<a href="#" class="approve" data-id='+id+' name='+pk+'><span class="glyphicon glyphicon-ok"></span></a>   <a href="#" data-id='+id+' class="reject" name='+pk+'><span class="glyphicon glyphicon-remove" style="color: red"></span></a>');
                            var badge_number = parseInt($('#badge').text());
                            $('#badge').html(badge_number+1);
                        }else{
                            $(status_id).html(data["status"] + '<a href="#" data-id='+id+' class="reject_user" name='+pk+'><span class="glyphicon glyphicon-remove" style="color: red"></span></a>');
                        };
    
                        $(status_id).css('background-color', 'yellow');
                        $(user_information_id).html(data["user"] + '<a href="#" data-toggle="modal" data-target="#detail' + id +'"><span class="glyphicon glyphicon-search"></span></a>');
                        $(apply_id).html("该点位暂不能申请");
                        $(detail_id+" .modal-body").html(
                            '<p>使用者：'+data['user']+'</p>\
                            <p>设备信息：</p>\
                            <pre>'+data['information']+'</pre>'
                        );
                        $(ip_id).html(data['ip']);
                    };
                    $(submit_id).modal('hide');
                }
            });
            return true;
        }else{
            alert("请填写设备信息！");
            return false;
        };
    });

    // 下拉框筛选用dataTable搜索栏实现
    $("#select-location").change(function(){
        var location = $(this).children('option:selected').val();
        var table = $('#table_id_index').DataTable();
        if (location != "0"){
            table.search($(this).children('option:selected').text()).draw();
        }else{
            table.search('').draw();
        }
    });
})