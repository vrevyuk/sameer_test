/**
 * Created by glavnyjpolzovatel on 13.07.15.
 */

testManager = {
    catList: null,
    codeList: null,
    init: function () {
        this.catList = $('#catList');
        this.codeList = $('#codeList');
        this.loadCategories();
        this.loadCode();
    },

    loadCategories: function () {
        $.ajax({
            method: 'get',
            url: 'db/categories/',
            dataType: 'json',
            async: 'true',
            success: function(response) {
                if(response.status) {
                    var list = response.result;
                    testManager.catList.empty();
                    list.forEach(function (item, position, all) {
                        testManager.catList.append('<li id="cat' + item.id + '">' + item.catname + '</li>');
                    });
                    testManager.catList.listview('refresh');
                } else { alert(response.message); }
            },
            error: function(data, status, errorThrow) {
                alert(data.responseText);
            }
        });
    },
    loadCode: function () {
        $.ajax({
            type: 'GET',
            url: 'db/code',
            dataType: 'json',
            async: 'true',
            success: function(response) {
                if(response.status) {
                    var result = response.result;
                    testManager.codeList.empty();
                    testManager.codeList.append('<li><div class="small-circle-btn" onclick="testManager.addCode()">+</div></li>');
                    result.forEach(function(item, count, all) {
                        testManager.codeList.append('<li id="' + item.id + '"><a><h3>' + item.code + '</h3><p>' + item.email + '</p></a><a data-icon="delete"></a></a></li>').listview('refresh');
                    });
                } else { alert(response.message); }
            },
            error: function(data, status, errorThrow) {
                alert(data.responseText);
            }
        });
    },

    addCode: function() {
        var email;
        if(email = prompt('Enter email from request', '')) {
            $.ajax({
                type: 'POST',
                url: 'db/code',
                data: {email: email},
                //dataType: 'json',
                success: function(response) {
                    alert(response);
                    if(response.status) {
                        testManager.loadCode();
                    } else { alert(response.message); }
                },
                error: function(data, status, errorThrow) {
                    alert(data.responseText);
                }
            });
        }
    }
};
