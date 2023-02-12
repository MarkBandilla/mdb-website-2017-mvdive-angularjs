/**
 * BFEditor - Bootstrap Front-end content editor
 * @copyright: MarkBandilla (http://mdb.co)
 * @author: MarkBandilla (http://mdb.co)
 * @version: 1.0
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var BFEditor = $.bfeditor;
    var flog = BFEditor.log;

    BFEditor.components['carousel'] = {
        init: function (contentArea, container, component, bfeditor) {
            flog('init "Carousel" component', component);

            var componentContent = component.children('.bfeditor-component-content');

            $(componentContent).find('.carousel').carousel({
                interval: 5000 //changes the speed
            });
        },

        settingEnabled: true,

        settingTitle: 'Caorusel Settings',

        initSettingForm: function (form, bfeditor) {
            flog('initSettingForm "Caorusel" component');

            var self = this;
            var options = bfeditor.options;
        }
    };

})(jQuery);

/**
 * BFEditor Set Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: 1.1.4
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var BFEditor = $.bfeditor;
    var flog = BFEditor.log;

    BFEditor.components['hash'] = {
        init: function (contentArea, container, component, bfeditor) {
            flog('init "hash" component', component);
            // console.log(bfeditor);
        },

        settingEnabled: true,

        settingTitle: 'Hash Settings',

        initSettingForm: function (form, bfeditor) {
            flog('initSettingForm "hash" component');
        },

        showSettingForm: function (form, component, bfeditor) {
            var self = this;
            var options = bfeditor.options;
            var container = bfeditor.getSettingComponent().find('[data-hash]');
            var template = bfeditor.getSettingComponent().find('[data-item]');
            var hash = $('.bfeditor-content-area').find('section.bfeditor-container-inner[id]');
            container.html("");

            $.each(hash, function() {
                if(hash != "") {
                    var content = template.html();
                    var Label = '((Label))';
                    var Link = '((Link))';
                    content = content.split(Label).join($(this).attr('id'));
                    // content = content.split(Link).join('#'+$(this).attr('id'));
                    content = content.split(Link).join($(this).attr('id'));
                    container.append(content);                    
                }
            });

            if (typeof options.onContentChanged === 'function') {
                options.onContentChanged.call(null, null);
            }
        }
    };

})(jQuery);

/**
 * BFEditor Set Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: 1.1.4
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var BFEditor = $.bfeditor;
    var flog = BFEditor.log;

    BFEditor.components['set'] = {
        init: function (contentArea, container, component, bfeditor) {
            flog('init "list" component', component);

            var componentContent = component.children('.bfeditor-component-content');
        },

        settingEnabled: true,

        settingTitle: 'Set Settings',

        initSettingForm: function (form, bfeditor) {
            flog('initSettingForm "set" component');
            console.log('COMPONENT-SET INIT');
        },

        showSettingForm: function (form, component, bfeditor) {

            var self = this;
            var options = bfeditor.options;
            var data = bfeditor.getSettingComponent().find('[data-set]').data('set');
            var record = bfeditor.getSettingComponent().find('[data-record]').data('record');

            // console.log('record', record);

            var setForm = function() {
                // var html = formBuilder(data, record);

                // setHtml();
                // return html;
                var html = "";
                $.each(data, function(dKey, dValue) {
                    html+= '<div class="form-group">';
                    html+= '<label>' + dValue.label + '</label>';
                    // console.log(data, record);
                    if(database.currentPage.type != "view") {
                        if(dValue.type == "image") {
                            html+= '<button type="button" class="btn btn-lg btn-block dp-image-chooser" style="height: 50px; background: url('+record[dValue.label]+') center center; background-size: cover;"></button>';
                        // } else if(dValue.type == "video") {
                        //     html+= '<button type="button" class="btn btn-lg btn-block dp-video-chooser" style="height: 50px; background: url('+record[dValue.label]+') center center; background-size: cover;"></button>';
                        } else {
                            html+= '<input type="text" name="'+ dValue.label +'" class="form-control" value="' + record[dValue.label] + '">';
                        }
                    } else {
                        var db = getDB(database.currentPage.collection);
                        var schema = db.schema;
                        var collections = db.collections;
                        record = collections[0];
                        var options = '<option value="">'+dValue.label+'..</option>';

                        $.each(schema, function(key, value) {
                            if(dValue.type === value.type) {
                                console.log(dValue.type, value, record);
                                options += '<option value="{{'+value.label+'}}">'+value.label+'</option>';                                
                            }
                        });

                        console.log('record', record);
                        html+=  '<select name="'+ dValue.label +'" class="form-control">' +
                                options +
                                '</select>';
                    }
                    html+= '</div>';
                });

                setHtml();
                return html;
            }

            var setHtml = function() {
                var listTmpl = bfeditor.getSettingComponent().find('[data-item]');
                var item = listTmpl.clone().removeAttr("data-item").removeClass('hide');
                listTmpl.addClass('hide');
                var tmpl = listTmpl.clone();
                var parent = listTmpl.parent();
                parent.html(tmpl);

                var newItem = item.clone();

                $.each(data, function(dKey, dValue) {
                    var string = '(('+dValue.label+'))';
                    // console.log(string, record[dValue.label]);
                    var content = newItem.html();
                    var hash = "#/" + database.currentPage.link;
                    var page = database.currentPage.label;
                    content = content.split(string).join(record[dValue.label]);
                    content = content.replace('"((data))"', "'"+JSON.stringify(record)+"'");
                    content = content.replace('((hash))', hash);
                    if(page != "Home" && page != "home") content = content.replace('((page))', page);
                    else content = content.replace('((page))', '');
                    newItem.html(content);

                    parent.append(newItem);
                });

                if (typeof options.onContentChanged === 'function') {
                    options.onContentChanged.call(null, null);
                }
            }

            form.html(setForm());
            form.delegate('[name]', 'change', function() {
                var value = $(this).val();
                var name = $(this).attr('name');

                $.each(data, function(dKey, dValue) {
                    if(dValue.label == name) {
                        record[dValue.label] = value;
                    } 
                });
                bfeditor.getSettingComponent().find('[data-record]').attr('data-record', JSON.stringify(record));

                setHtml();
            });
            form.delegate('.dp-image-chooser', 'click', function() {
                var _this = $(this);
                dpChooser('image', function(link) {
                    // console.log(link);
                    var bg = "url('"+link+"')";
                    $(_this).css({"background-image": bg});
                    // console.log($(_this).css("background-image"));
                    $.each(data, function(dKey, dValue) {
                        if(dValue.type == "image") {
                            record[dValue.label] = link;
                        } 
                    });
                    bfeditor.getSettingComponent().find('[data-record]').attr('data-record', JSON.stringify(record));
                    
                    setHtml();

                });
            });
            form.delegate('.dp-video-chooser', 'click', function() {
                var _this = $(this);
                dpChooser('video', function(link) {
                    // console.log(link);
                    var bg = "url('"+link+"')";
                    $(_this).css({"background-image": bg});
                    // console.log($(_this).css("background-image"));
                    $.each(data, function(dKey, dValue) {
                        if(dValue.type == "video") {
                            record[dValue.label] = link;
                        } 
                    });
                    bfeditor.getSettingComponent().find('[data-record]').attr('data-record', JSON.stringify(record));
                    
                    setHtml();

                });
            });
        }
    };

})(jQuery);

/**
 * BFEditor - Bootstrap Front-end content editor
 * @copyright: MarkBandilla (http://mdb.co)
 * @author: MarkBandilla (http://mdb.co)
 * @version: 1.0
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var BFEditor = $.bfeditor;
    var flog = BFEditor.log;

    BFEditor.components['list'] = {
        init: function (contentArea, container, component, bfeditor) {
            flog('init "list" component', component);

            var componentContent = component.children('.bfeditor-component-content');
        },

        settingEnabled: true,

        settingTitle: 'List Settings',

        initSettingForm: function (form, bfeditor) {
            flog('initSettingForm "list" component');
        },

        showSettingForm: function (form, component, bfeditor) {
            var self = this;
            var options = bfeditor.options;
            var data = bfeditor.getSettingComponent().find('[data-list]').data('list');
            var records = bfeditor.getSettingComponent().find('[data-records]').data('records');
            var count = parseInt(bfeditor.getSettingComponent().find('[data-count]').data('count'));
            var setForm = function() {
                var html = formBuilder([{"type":"search", "label":"Search"}, {"type":"table", "schema": data}], records);

                setHtml();
                return html;
            }
            var setHtml = function() {
                var listTmpl = bfeditor.getSettingComponent().find('[data-item]');
                var item = listTmpl.clone().removeAttr("data-item").removeClass('hide');
                listTmpl.addClass('hide');
                var tmpl = listTmpl.clone();
                var parent = listTmpl.parent();
                parent.html(tmpl);
                // console.log('parent before', parent.html());
                $.each(records, function(rKey, rValue) {
                    var newItem = item.clone();

                    $.each(data, function(dKey, dValue) {
                        var string = '(('+dValue.label+'))';
                        var content = newItem.html();
                        var hash = "#/" + database.currentPage.link;
                        content = content.split(string).join(rValue[dValue.label]);
                        content = content.replace('"((data))"', "'"+JSON.stringify(rValue)+"'");
                        content = content.replace('((hash))', hash);
                        newItem.html(content);
                    });
                    if(bfeditor.getSettingComponent().find('[data-sort]').data('sort') === 'desc')
                        parent.prepend($(newItem).html());
                    else
                        parent.append($(newItem).html());
                });
                // console.log('parent after', parent.html());

                if (typeof options.onContentChanged === 'function') {
                    options.onContentChanged.call(null, null);
                }
            }

            if(records) form.html(setForm());

            form.delegate('.list-add', 'click', function (e) {
                e.preventDefault();
                var input = {};
                count ++;
                input._id = count;

                $.each(data, function(key, value) {
                    input[value.label] = "";
                });

                records.push(input);
                // console.log('new-list', records);
                bfeditor.getSettingComponent().find('[data-records]').attr('data-records', JSON.stringify(records));
                bfeditor.getSettingComponent().find('[data-count]').attr('data-count', count);

                form.html(setForm());
            });

            form.delegate('[name]', 'change', function() {
                var name = $(this).attr('name');
                var value = $(this).val();
                var _id = parseInt($(this).closest('tr').attr('list-id'));

                // console.log(_id, name, value);

                $.each(records, function(rKey, rValue) {
                    if(rValue._id === _id) {
                        rValue[name] = value;
                        // console.log(rValue);
                    }
                });

                // console.log('update-list', records);
                bfeditor.getSettingComponent().find('[data-records]').attr('data-records', JSON.stringify(records));

                form.html(setForm());

            });

            form.delegate('.dp-chooser', 'click', function() {
                var _this = $(this);
                var _id = parseInt($(this).closest('tr').attr('list-id'));
                var name = $(this).attr('key');
                var value = $(this).val();

                dpChooser('image', function(link) {
                    // console.log(link);
                    $(_this).attr('src', link);

                    $.each(records, function(rKey, rValue) {
                        if(rValue._id === _id) {
                            rValue[name] = link;
                        }
                    });

                    bfeditor.getSettingComponent().find('[data-records]').attr('data-records', JSON.stringify(records));

                    form.html(setForm());
                });
            });
            form.delegate('.list-edit', 'click', function (e) {
                e.preventDefault();
                var input = {};
                var _id = parseInt($(this).closest('tr').attr('list-id'));

                $.each(records, function(rKey, rValue) {
                    if(rValue._id === _id) {
                        input = rValue;
                        $.each(data, function(dKey, dValue) {
                            input[dValue.label] = prompt(dValue.label, rValue[dValue.label]);
                        });  

                        rValue = input;                      
                    }
                });

                // console.log('update-list', records);
                bfeditor.getSettingComponent().find('[data-records]').attr('data-records', JSON.stringify(records));

                form.html(setForm());
            });

            form.delegate('.list-delete', 'click', function (e) {
                e.preventDefault();
                var input = {};
                var _id = parseInt($(this).closest('tr').attr('list-id'));

                $.each(records, function(rKey, rValue) {
                    if(rValue._id === _id) {
                        input = rValue;
                        var confirm = window.confirm('Your about to delete ' + input[data[0].label] + ', are you sure?');
                        if(confirm) {
                            records = $.grep(records, function(rec){ 
                                return rec._id != _id; 
                            });

                            // console.log('update-list', records);
                            bfeditor.getSettingComponent().find('[data-records]').attr('data-records', JSON.stringify(records));

                            form.html(setForm());                            
                        }
                    }
                });

            });
        }
    };

})(jQuery);

/**
 * BFEditor - Bootstrap Front-end content editor
 * @copyright: MarkBandilla (http://mdb.co)
 * @author: MarkBandilla (http://mdb.co)
 * @version: 1.0
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var BFEditor = $.bfeditor;
    var flog = BFEditor.log;

    BFEditor.components['collection'] = {
        init: function (contentArea, container, component, bfeditor) {
            flog('init "db" component', component);

            var componentContent = component.children('.bfeditor-component-content');
        },

        settingEnabled: true,

        settingTitle: 'Collection Settings',

        initSettingForm: function (form, bfeditor) {
            flog('initSettingForm "collection" component');
        },

        showSettingForm: function (form, component, bfeditor) {
            var self = this;
            var options = bfeditor.options;
            var dbname = bfeditor.getSettingComponent().find('[data-collection]').data('collection');
            var db = getDB(dbname);
            var data = getDBSchema(dbname);
            var records = getDBCollection(dbname);

            // console.log(db, data, records);

            var setForm = function() {
                var list = bfeditor.getSettingComponent().find('[data-collection]');
                var id = $(list).attr('id');
                var search = false; if($(list).data("search")) search = $(list).data("search");
                var pagination = false; if($(list).data('pagination')) pagination = $(list).data('pagination');
                var page = 0; if($(list).data("page")) page = $(list).data("page");

                var html = formBuilder([
                    {"type":"text", "label":"ID"}, 
                    {"type":"select", "label":"Search", "options": [true, false]},
                    {"type":"select", "label":"Pagination", "options": [true, false]},
                    {"type":"number", "label": "Page", "placeholder":"# of items per page.."}
                ], {"ID":id, "Search":search, "Pagination":pagination, "Page":page});
                html += '<button class="btn btn-primary btn-block" onclick="editDB('+db._id+')">Edit Collection</button>';
                html += '<button class="btn btn-default btn-block refresh-component">Refresh Component</button>';
                // var html = formBuilder([{"type":"search", "label":"Search"}, {"type":"table", "schema": data}], records);

                setHtml();
                return html;
            }
            var setHtml = function() {
                // console.log('setHtml');
                var list = bfeditor.getSettingComponent().find('[data-collection]');
                var id = $(list).attr('id');
                var data = db.collections;
                var names = db.names;
                var template = $.trim($(list).find('.template').html());
                var search = false; if($(list).data("search")) search = $(list).data("search");

                var options = {
                    valueNames: names,
                    item      : template
                };

                $(list).find('.list').html("");
                if(!$(list).data("search")) 
                    $(list).find('.search').addClass('hide');
                else
                    $(list).find('.search').removeClass('hide');
                if($(list).data('pagination')) {
                    options.pagination = $(list).data('pagination'); 
                }
                if($(list).data("page")) { 
                    options.page = $(list).data("page");
                    if($(list).data("pagination")) 
                        $(list).find('.pagination').removeClass('hide');
                } else { 
                    $(list).find('.pagination').addClass('hide');
                }
                
                // console.log(id, options, data);
                var list = new List(id, options, data);

                if (typeof options.onContentChanged === 'function') {
                    options.onContentChanged.call(null, null);
                }
            }

            if(records) form.html(setForm());

            form.delegate('.refresh-component', 'click', function (e) {
                setHtml();
            });

            form.delegate('[name]', 'change', function() {
                var name = $(this).attr('name').toLowerCase();
                var list = bfeditor.getSettingComponent().find('[data-collection]');
                var val = $(this).val();
                $(list).attr('data-' + name, val);
                if(val === "true") val = true;
                if(val === "false") val = false;
                $(list).data(name, val);

                // console.log(name, $(this).val());

                form.html(setForm());
            });

            form.delegate('.dp-chooser', 'click', function() {
                var _this = $(this);
                var _id = parseInt($(this).closest('tr').attr('list-id'));
                var name = $(this).attr('key');
                var value = $(this).val();

                dpChooser('image', function(link) {
                    // console.log(link);
                    $(_this).attr('src', link);

                    $.each(records, function(rKey, rValue) {
                        if(rValue._id === _id) {
                            rValue[name] = link;
                        }
                    });

                    bfeditor.getSettingComponent().find('[data-records]').attr('data-records', JSON.stringify(records));

                    form.html(setForm());
                });
            });

            form.delegate('.list-edit', 'click', function (e) {
                e.preventDefault();
                var input = {};
                var _id = parseInt($(this).closest('tr').attr('list-id'));

                $.each(records, function(rKey, rValue) {
                    if(rValue._id === _id) {
                        input = rValue;
                        $.each(data, function(dKey, dValue) {
                            input[dValue.label] = prompt(dValue.label, rValue[dValue.label]);
                        });  

                        rValue = input;                      
                    }
                });

                // console.log('update-list', records);
                bfeditor.getSettingComponent().find('[data-records]').attr('data-records', JSON.stringify(records));

                form.html(setForm());
            });

            form.delegate('.list-delete', 'click', function (e) {
                e.preventDefault();
                var input = {};
                var _id = parseInt($(this).closest('tr').attr('list-id'));

                $.each(records, function(rKey, rValue) {
                    if(rValue._id === _id) {
                        input = rValue;
                        var confirm = window.confirm('Your about to delete ' + input[data[0].label] + ', are you sure?');
                        if(confirm) {
                            records = $.grep(records, function(rec){ 
                                return rec._id != _id; 
                            });

                            // console.log('update-list', records);
                            bfeditor.getSettingComponent().find('[data-records]').attr('data-records', JSON.stringify(records));

                            form.html(setForm());                            
                        }
                    }
                });
            });
        }
    };

})(jQuery);

/**
 * BFEditor Form Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: 1.1.4
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var BFEditor = $.bfeditor;
    var flog = BFEditor.log;

    BFEditor.components['form'] = {
        init: function (contentArea, container, component, bfeditor) {
            flog('init "list" component', component);

            var componentContent = component.children('.bfeditor-component-content');
        },

        settingEnabled: true,

        settingTitle: 'Form Settings',

        initSettingForm: function (form, bfeditor) {
            flog('initSettingForm "form" component');
        },

        showSettingForm: function (form, component, bfeditor) {

            var self = this;
            var options = bfeditor.options;
            var subject = bfeditor.getSettingComponent().find('[data-subject]').val();
            var data = bfeditor.getSettingComponent().find('[data-form]').data('form');
            var records = bfeditor.getSettingComponent().find('[data-records]').data('records');
            var list = bfeditor.getSettingComponent().find('[data-list]');

            // console.log('record', record);

            var setForm = function() {
                var html = "";
                html+= '<div class="form-group">';
                html+= '<label>Subject</label>';
                html+= '<input type="text" class="form-control input-sm" value="' + subject + '" />';
                html+= '</div>';

                var dHtml = "";
                $.each(data, function(key, value) {
                    dHtml+= '<th>' + value.label + '</th>';
                });
                var fHtml = "";
                $.each(data, function(key, value) {
                    if(value.type === 'image') {
                        fHtml+= '<td><img src="" class="img-rounded" style="height:35px;"/></td>';
                    } else if(value.type === 'select') {
                        var oHtml = "";
                        $.each(value.options, function(oKey, oValue) {
                            oHtml += '<option>' + oValue + '</option>';
                        });
                        fHtml+= '<td>'+
                                '   <select class="form-control input-xs">'+
                                '       <option value="">'+value.label+'..</option>'+
                                oHtml+
                                '   </select>'+
                                '</td>';
                    } else {
                        fHtml+= '<td><input type="text" class="form-control input-xs" value="" placeholder="'+value.label+'"/></td>';
                    }
                });
                var rHtml = "";
                $.each(records, function(rKey, rValue) {
                    rHtml+= '<tr list-id="' + rValue._id + '">';
                    $.each(data, function(dKey, dValue) {
                        if(dValue.type === 'image') {
                            rHtml+= '<td><img src="' + rValue[dValue.label] + '" class="img-rounded" style="height:35px;"/></td>';
                        } else if(dValue.type === 'select') {
                            var oHtml = "";
                            $.each(dValue.options, function(oKey, oValue) {
                                if(rValue[dValue.label] === oValue)
                                    oHtml += '<option selected>' + oValue + '</option>';
                                else
                                    oHtml += '<option>' + oValue + '</option>';
                            });
                            rHtml+= '<td>'+
                                    '   <select class="form-control input-xs">'+
                                    '       <option value="">'+dValue.label+'..</option>'+
                                    oHtml+
                                    '   </select>'+
                                    '</td>';
                        } else {
                            rHtml+= '<td><input type="text" class="form-control input-xs" placeholder="'+dValue.label+'" value="' + rValue[dValue.label] + '"/></td>';
                        }
                    });
                    rHtml+= '<td class="text-center"><a href="#" class="btn btn-xs list-delete"><i class="fa fa-trash"></i></a></td>';
                    rHtml+= '</tr>';
                });

                html +=  '<div class="table-responsive">' +
                        '   <table class="table table-bordered table-striped table-hover">' +
                        '       <thead><tr>' +
                        dHtml +
                        '           <th></th>' +
                        '       </tr></thead>' +
                        '       <tfoot><tr>' +
                        fHtml +
                        '           <th class="text-center" style="width: 65px;"><a href="#" class="btn btn-xs list-add"><i class="fa fa-plus"></i></a></th>' +
                        '       </tr></tfoot>' +
                        '       <tbody>' +
                        rHtml +
                        '       </tbody>' +
                        '   </table>' +
                        '</div>';

                // setHtml();
                return html;
            }

            var setHtml = function() {
                var listTmpl = bfeditor.getSettingComponent().find('[data-item]');
                var item = listTmpl.clone().removeAttr("data-item").removeClass('hide');
                listTmpl.addClass('hide');
                var tmpl = listTmpl.clone();
                var parent = listTmpl.parent();
                parent.html(tmpl);

                var newItem = item.clone();

                $.each(data, function(dKey, dValue) {
                    var string = '(('+dValue.label+'))';
                    // console.log(string, record[dValue.label]);
                    var content = newItem.html();
                    var hash = "#/" + database.currentPage.link;
                    var page = database.currentPage.label;
                    content = content.split(string).join(record[dValue.label]);
                    content = content.replace('"((data))"', "'"+JSON.stringify(record)+"'");
                    content = content.replace('((hash))', hash);
                    content = content.replace('((page))', page);
                    newItem.html(content);

                    parent.append(newItem);
                });

                if (typeof options.onContentChanged === 'function') {
                    options.onContentChanged.call(null, null);
                }
            }

            form.html(setForm());
            form.delegate('[name]', 'change', function() {
                var value = $(this).val();
                var name = $(this).attr('name')
                $.each(data, function(dKey, dValue) {
                    if(dValue.label == name) {
                        record[dValue.label] = value;
                    } 
                });
                bfeditor.getSettingComponent().find('[data-record]').attr('data-record', JSON.stringify(record));

                setHtml();
            });
            form.delegate('.dp-chooser', 'click', function() {
                var _this = $(this)
                dpChooser('image', function(link) {
                    // console.log(link);
                    var bg = "url('"+link+"')";
                    $(_this).css({"background-image": bg});
                    // console.log($(_this).css("background-image"));
                    $.each(data, function(dKey, dValue) {
                        if(dValue.type == "image") {
                            record[dValue.label] = link;
                        } 
                    });
                    bfeditor.getSettingComponent().find('[data-record]').attr('data-record', JSON.stringify(record));
                    
                    setHtml();

                });
            });
        }
    };

})(jQuery);

/**
 * BFEditor Text Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: 1.1.4
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var BFEditor = $.bfeditor;
    var flog = BFEditor.log;

    // Text component
    // ---------------------------------------------------------------------
    BFEditor.components['text'] = {
        init: function (contentArea, container, component, bfeditor) {
            flog('init "text" component', component);

            var self = this;
            var options = bfeditor.options;

            var componentContent = component.children('.bfeditor-component-content');
            componentContent.prop('contenteditable', true);

            componentContent.on('input', function (e) {
                if (typeof options.onComponentChanged === 'function') {
                    options.onComponentChanged.call(contentArea, e, component);
                }

                if (typeof options.onContainerChanged === 'function') {
                    options.onContainerChanged.call(contentArea, e, container);
                }

                if (typeof options.onContentChanged === 'function') {
                    options.onContentChanged.call(contentArea, e);
                }
            });
        },

        getContent: function (component, bfeditor) {
            flog('getContent "text" component', component);

            var componentContent = component.find('.bfeditor-component-content');
            var id = componentContent.attr('id');
            // var editor = CKEDITOR.instances[id];
            var editor = null;
            if (editor) {
                return editor.getData();
            } else {
                return componentContent.html();
            }
        },

        destroy: function (component, bfeditor) {
            flog('destroy "text" component', component);

            var id = component.find('.bfeditor-component-content').attr('id');
            // var editor = CKEDITOR.instances[id];
            var editor = null;
            if (editor) {
                editor.destroy();
            }
        }
    };

})(jQuery);

/**
 * BFEditor Photo Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: 1.1.4
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var BFEditor = $.bfeditor;
    var flog = BFEditor.log;

    BFEditor.components['photo'] = {
        init: function (contentArea, container, component, bfeditor) {
            flog('init "photo" component', component);

            var componentContent = component.children('.bfeditor-component-content');
            var img = componentContent.find('img');

            img.css('display', 'inline-block');
        },

        settingEnabled: true,

        settingTitle: 'Photo Settings',

        initSettingForm: function (form, bfeditor) {
            flog('initSettingForm "photo" component');

            var self = this;
            var options = bfeditor.options;
            var url = bfeditor.getSettingComponent().find('img').attr("src");
            // console.log(url);

            form.append(
                '<form class="form-horizontal">' +
                '   <div class="form-group">' +
                '       <label for="photo-align" class="col-sm-12">Image</label>' +
                '       <div class="col-sm-12">' +
                // '           <input type="text" class="form-control" value="' + url + '" />' +
                '           <img src="' + url + '" class="img-thumbnail" id="photo-preview" />' +
                '           <button type="button" class="btn btn-block btn-primary" id="photo-edit">Change Photo</button>' +
                '           <input type="file" style="display: none" />' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label for="photo-link" class="col-sm-12">Link</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="text" id="photo-link" class="form-control" />' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label for="photo-link-target" class="col-sm-12">Link Target</label>' +
                '       <div class="col-sm-12">' +
                '           <select id="photo-link-target" class="form-control">' +
                '               <option>_self</option>' +
                '               <option>_blank</option>' +
                '           </select>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label for="photo-responsive" class="col-sm-12">Fullwidth</label>' +
                '       <div class="col-sm-12">' +
                '           <select id="photo-fullwidth" class="form-control">' +
                '               <option value="">No</option>' +
                '               <option value="row no-padd">Yes</option>' +
                '           </select>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label for="photo-align" class="col-sm-12">Align</label>' +
                '       <div class="col-sm-12">' +
                '           <select id="photo-align" class="form-control">' +
                '               <option value="left">Left</option>' +
                '               <option value="center">Center</option>' +
                '               <option value="right">Right</option>' +
                '           </select>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label for="photo-style" class="col-sm-12">Style</label>' +
                '       <div class="col-sm-12">' +
                '           <select id="photo-style" class="form-control">' +
                '               <option value="">None</option>' +
                '               <option value="img-rounded">Rounded</option>' +
                '               <option value="img-circle">Circle</option>' +
                '               <option value="img-thumbnail">Thumbnail</option>' +
                '           </select>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label for="photo-width" class="col-sm-12">Width</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="number" id="photo-width" class="form-control" />' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label for="photo-height" class="col-sm-12">Height</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="number" id="photo-height" class="form-control" />' +
                '       </div>' +
                '   </div>' +
                '</form>'
            );

            var photoEdit = form.find('#photo-edit');
            var fileInput = photoEdit.next();
            photoEdit.on('click', function (e) {
                e.preventDefault();
                var img = bfeditor.getSettingComponent().find('img');
                var preview = form.find('img');

                dpChooser('image', function(link) {
                    img.attr('src', link);
                    preview.attr('src', link);
                    img.css({
                        width: '',
                        height: ''
                    });
                    img.load(function () {
                        bfeditor.showSettingPanel(bfeditor.getSettingComponent(), options);
                    });
                });
                // fileInput.trigger('click');
            });
            fileInput.on('change', function () {
                var file = this.files[0];
                if (/image/.test(file.type)) {
                    var img = bfeditor.getSettingComponent().find('img');
                    img.attr('src', URL.createObjectURL(file));
                    img.css({
                        width: '',
                        height: ''
                    });
                    img.load(function () {
                        bfeditor.showSettingPanel(bfeditor.getSettingComponent(), options);
                    });
                } else {
                    alert('Your selected file is not photo!');
                }
            });

            var inputFullwidth = form.find('#photo-link');
            inputFullwidth.on('change', function () {
                bfeditor.getSettingComponent().find('a').attr('href', $(this).val());
            });

            var inputFullwidth = form.find('#photo-link-target');
            inputFullwidth.on('change', function () {
                bfeditor.getSettingComponent().find('a').attr('target', $(this).val());
            });

            var inputFullwidth = form.find('#photo-fullwidth');
            inputFullwidth.on('change', function () {
                bfeditor.getSettingComponent().find('.photo-panel')[$(this).val() ? 'addClass' : 'removeClass']('row no-padd');
            });

            var inputAlign = form.find('#photo-align');
            inputAlign.on('change', function () {
                var panel = bfeditor.getSettingComponent().find('.photo-panel');
                panel.css('text-align', this.value);
            });

            var inputResponsive = form.find('#photo-responsive');
            inputResponsive.on('click', function () {
                bfeditor.getSettingComponent().find('img')[this.checked ? 'addClass' : 'removeClass']('img-responsive');
            });

            var cbbStyle = form.find('#photo-style');
            cbbStyle.on('change', function () {
                var img = bfeditor.getSettingComponent().find('img');
                var val = this.value;

                img.removeClass('img-rounded img-circle img-thumbnail');
                if (val) {
                    img.addClass(val);
                }
            });

            var inputWidth = form.find('#photo-width');
            var inputHeight = form.find('#photo-height');
            inputWidth.on('change', function () {
                var img = bfeditor.getSettingComponent().find('img');
                var newWidth = +this.value;
                var newHeight = Math.round(newWidth / self.ratio);

                if (newWidth <= 0) {
                    newWidth = self.width;
                    newHeight = self.height;
                    this.value = newWidth;
                }

                img.css({
                    'width': newWidth,
                    'height': newHeight
                });
                inputHeight.val(newHeight);
            });
            inputHeight.on('change', function () {
                var img = bfeditor.getSettingComponent().find('img');
                var newHeight = +this.value;
                var newWidth = Math.round(newHeight * self.ratio);

                if (newHeight <= 0) {
                    newWidth = self.width;
                    newHeight = self.height;
                    this.value = newHeight;
                }

                img.css({
                    'height': newHeight,
                    'width': newWidth
                });
                inputWidth.val(newWidth);
            });
        },

        showSettingForm: function (form, component, bfeditor) {
            flog('showSettingForm "photo" component', component);

            var self = this;
            var inputAlign = form.find('#photo-align');
            var inputResponsive = form.find('#photo-responsive');
            var inputWidth = form.find('#photo-width');
            var inputHeight = form.find('#photo-height');
            var cbbStyle = form.find('#photo-style');
            var imgPreview = form.find('#photo-preview');

            var panel = component.find('.photo-panel');
            var img = panel.find('img');

            var url = img.attr("src");
            console.log('url', url);

            var align = panel.css('text-align');
            if (align !== 'right' || align !== 'center') {
                align = 'left';
            }

            if (img.hasClass('img-rounded')) {
                cbbStyle.val('img-rounded');
            } else if (img.hasClass('img-circle')) {
                cbbStyle.val('img-circle');
            } else if (img.hasClass('img-thumbnail')) {
                cbbStyle.val('img-thumbnail');
            } else {
                cbbStyle.val('');
            }

            inputAlign.val(align);
            inputResponsive.prop('checked', img.hasClass('img-responsive'));
            inputWidth.val(img.width());
            inputHeight.val(img.height());
            imgPreview.attr('src', url);

            $('<img />').attr('src', img.attr('src')).load(function() {
                self.ratio = this.width / this.height;
                self.width = this.width;
                self.height = this.height;
            });
        }
    };

})(jQuery);

/**
 * BFEditor Youtube Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: 1.1.4
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var BFEditor = $.bfeditor;
    var flog = BFEditor.log;

    BFEditor.components['youtube'] = {
        getContent: function (component, bfeditor) {
            flog('getContent "youtube" component', component);

            var componentContent = component.children('.bfeditor-component-content');
            componentContent.find('.youtube-cover').remove();

            return componentContent.html();
        },

        settingEnabled: true,

        settingTitle: 'Youtube Settings',

        initSettingForm: function (form, bfeditor) {
            flog('initSettingForm "youtube" component');

            form.append(
                '<form class="form-horizontal">' +
                '   <div class="form-group">' +
                '       <div class="col-sm-12">' +
                '           <button type="button" class="btn btn-block btn-primary btn-youtube-edit">Change Video</button>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label class="col-sm-12">Autoplay</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="checkbox" id="youtube-autoplay" />' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label class="col-sm-12">Aspect Ratio</label>' +
                '       <div class="col-sm-12">' +
                '           <button type="button" class="btn btn-sm btn-default btn-youtube-169">16:9</button>' +
                '           <button type="button" class="btn btn-sm btn-default btn-youtube-43">4:3</button>' +
                '       </div>' +
                '   </div>' +
                '</form>'
            );

            var btnEdit = form.find('.btn-youtube-edit');
            btnEdit.on('click', function (e) {
                e.preventDefault();

                var inputData = prompt('Please enter Youtube URL in here:');
                var youtubeRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/))([^\?&\"'>]+)/;
                var match = inputData.match(youtubeRegex);
                if (match && match[1]) {
                    bfeditor.getSettingComponent().find('.embed-responsive-item').attr('src', 'https://www.youtube.com/embed/' + match[1] + '?rel=0&amp;showinfo=0?ecver=1');
                } else {
                    alert('Your Youtube URL is invalid!');
                }
            });

            var btn169 = form.find('.btn-youtube-169');
            btn169.on('click', function (e) {
                e.preventDefault();

                bfeditor.getSettingComponent().find('.embed-responsive').removeClass('embed-responsive-4by3').addClass('embed-responsive-16by9');
            });

            var btn43 = form.find('.btn-youtube-43');
            btn43.on('click', function (e) {
                e.preventDefault();

                bfeditor.getSettingComponent().find('.embed-responsive').removeClass('embed-responsive-16by9').addClass('embed-responsive-4by3');
            });

            var chkAutoplay = form.find('#youtube-autoplay');
            chkAutoplay.on('click', function () {
                var embedItem = bfeditor.getSettingComponent().find('.embed-responsive-item');
                var currentUrl = embedItem.attr('src');
                var newUrl = (currentUrl.replace(/(\?.+)+/, '')) + '?autoplay=' + (chkAutoplay.is(':checked') ? 1 : 0);

                flog('Current url: ' + currentUrl, 'New url: ' + newUrl);
                embedItem.attr('src', newUrl);
            });
        },

        showSettingForm: function (form, component, bfeditor) {
            flog('showSettingForm "youtube" component', component);

            var embedItem = component.find('.embed-responsive-item');
            var chkAutoplay = form.find('#youtube-autoplay');
            var src = embedItem.attr('src');

            chkAutoplay.prop('checked', src.indexOf('autoplay=1') !== -1);
        }
    };

})(jQuery);


/**
 * BFEditor Google Map Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: 1.1.4
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var BFEditor = $.bfeditor;
    var flog = BFEditor.log;

    BFEditor.components['googlemap'] = {
        getContent: function (component, bfeditor) {
            flog('getContent "googlemap" component', component);

            var componentContent = component.children('.bfeditor-component-content');
            componentContent.find('.googlemap-cover').remove();

            return componentContent.html();
        },

        settingEnabled: true,

        settingTitle: 'Google Map Settings',

        initSettingForm: function (form, bfeditor) {
            flog('initSettingForm "googlemap" component');

            form.append(
                '<form class="form-horizontal">' +
                '   <div class="form-group">' +
                '       <div class="col-sm-12">' +
                '           <button type="button" class="btn btn-block btn-primary btn-googlemap-edit">Update Map</button>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label class="col-sm-12">Aspect Ratio</label>' +
                '       <div class="col-sm-12">' +
                '           <button type="button" class="btn btn-sm btn-default btn-googlemap-169">16:9</button>' +
                '           <button type="button" class="btn btn-sm btn-default btn-googlemap-43">4:3</button>' +
                '       </div>' +
                '   </div>' +
                '</form>'
            );

            var btnEdit = form.find('.btn-googlemap-edit');
            btnEdit.on('click', function (e) {
                e.preventDefault();

                var inputData = prompt('Please enter Google Map embed code in here:');
                var iframe = $(inputData);
                var src = iframe.attr('src');
                if (iframe.length > 0 && src && src.length > 0) {
                    bfeditor.getSettingComponent().find('.embed-responsive-item').attr('src', src);
                } else {
                    alert('Your Google Map embed code is invalid!');
                }
            });

            var btn169 = form.find('.btn-googlemap-169');
            btn169.on('click', function (e) {
                e.preventDefault();

                bfeditor.getSettingComponent().find('.embed-responsive').removeClass('embed-responsive-4by3').addClass('embed-responsive-16by9');
            });

            var btn43 = form.find('.btn-googlemap-43');
            btn43.on('click', function (e) {
                e.preventDefault();

                bfeditor.getSettingComponent().find('.embed-responsive').removeClass('embed-responsive-16by9').addClass('embed-responsive-4by3');
            });
        }
    };

})(jQuery);

