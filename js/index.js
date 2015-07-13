/**
 * Created by glavnyjpolzovatel on 13.07.15.
 */

testManager = {
    title: null,
    //catList: null,
    //codeList: null,
    listview: null,
    panel: null,
    init: function () {
        this.listview = $('#listView');
        //this.catList = $('#catList');
        //this.codeList = $('#codeList');
        this.title = $('#titleHeader');
        this.panel = $('#mainPanel');
        //this.loadCategories();
        //this.loadCode();
    },

    load: {
        catPage: function () {
            testManager.title.html('Categories of subjects');
            //testManager.codeList.empty();
            testManager.loadCategories();
            testManager.panel.panel('close');
        },
        codePage: function () {
            testManager.title.html('Access codes');
            //testManager.catList.empty();
            testManager.loadCode();
            testManager.panel.panel('close');
        }
    },

    loadCategories: function () {
        $.ajax({
            url: 'db/categories.php',
            dataType: 'json',
            async: 'true',
            success: function(response) {
                if(response.status) {
                    var list = response.result;
                    testManager.listview.empty();
                    list.forEach(function (item, position, all) {
                        testManager.listview.append('<li data-icon="false" id="cat' + item.id + '"><a onclick="testManager.catDetail(' + item.id + ')">' + item.catname + '</a></li>');
                    });
                    testManager.listview.listview('refresh');
                } else { alert(response.message); }
            },
            error: function(data, status, errorThrow) {
                alert(data.responseText);
            }
        });
    },

    catDetail: function (catid) {
        $.ajax({
            url: 'db/cat_detail.php?act=get&catid=' + catid,
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var res = response.result;
                    testManager.listview.empty();
                    res.forEach(function (item, position, all) {
                        testManager.title.html(item.catname);
                        li = '<li data-icon="delete">';
                        li += '<a><h3>' + item.question + '</h3>';
                        li += '<ol>';
                        li += '<li class="' + (item.success==1?'correct':'') + '">' + item.answer1 + '</li>';
                        li += '<li class="' + (item.success==2?'correct':'') + '">' + item.answer2 + '</li>';
                        li += '<li class="' + (item.success==3?'correct':'') + '">' + item.answer3 + '</li>';
                        li += '<li class="' + (item.success==4?'correct':'') + '">' + item.answer4 + '</li>';
                        li += '<li class="' + (item.success==5?'correct':'') + '">' + item.answer5 + '</li>';
                        li += '</ol></a>';
                        li += '<a></a>';
                        li += '</li>';
                        testManager.listview.append(li).listview('refresh');
                    });
                } else { alert(response.message); }
            },
            error: function (data, status, errorThrow) {
                alert (data.responseText);
            }
        });
    },

    loadCode: function () {
        $.ajax({
            url: 'db/code.php?act=get',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var result = response.result;
                    testManager.listview.empty();
                    testManager.listview.append('<li><a class="ui-btn ui-corner-all" onclick="testManager.addCode()">Add new code</a></li>');
                    result.forEach(function(item, count, all) {
                        testManager.listview.append('<li id="' + item.id + '"><a><h3>' + item.code + '</h3><p>' + item.email + '</p>' +
                        (item.used == '1'?'<span class="ui-li-count">used</span>':'') + '</a><a data-icon="delete" onclick="testManager.removeCode(' + item.id + ')"></a>' +
                        '</li>').listview('refresh');
                    });
                } else { alert(response.message); }
            },
            error: function (data, status, errorThrow) {
                alert (data.responseText);
            }
        });
    },

    addCode: function() {
        var email;
        if(email = prompt('Enter email from request', '')) {
            $.ajax({
                url: 'db/code.php?act=post&email=' + email,
                dataType: 'json',
                success: function(response) {
                    if(response.status) {
                        var r = response.result;
                        alert('For ' + r.email + ' generated code: ' + r.code);
                        testManager.loadCode();
                    } else { alert(response.message); }
                },
                error: function(data, status, errorThrow) {
                    alert(data.responseText);
                }
            });
        }
    },

    removeCode: function(id) {
        if(confirm('Are you sure?')) {
            $.ajax({
                url: 'db/code.php?act=delete&id='+id,
                dataType: 'json',
                success: function(response) {
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
