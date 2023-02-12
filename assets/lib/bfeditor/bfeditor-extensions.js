// DROPBOX CHOOSER
// function dpChooser(type = null, callback) {
function dpChooser(type, callback) {
    if(typeof(Dropbox) === 'undefined') {
        var image = prompt("Please enter Image URL");

        if(image) {
            callback(image);
        }
    } else {        
        var options = {
            success: function(files) {
                if(type === "video") var fileLink = files[0].link.split('dl=0').join('dl=1');
                else var fileLink = files[0].link.split('dl=0').join('raw=1');

                callback(fileLink);
            },
            cancel: function() {
            },
            linkType: "preview", // or "direct"
            multiselect: false, // or true
        };

        if(type === 'image') {
            options.extensions = ['.jpg', '.jpeg', '.png', '.gif'];
        } else if(type === 'video') {
            options.extensions = ['.mp4'];
        } else if(type === 'docs') {
            options.extensions = ['.docx'];
        }

        Dropbox.choose(options);
    
    } 
}

// FORM BUILDER
// function formBuilder(schema, values, editable = true) {
function formBuilder(schema, values, editable) {
    if(editable !== false) editable = true;
    // console.log('formBuilder', schema, values, editable);

    var formHtml = "";
    var placeholder = "";
    if(schema.placeholder) placeholder = schema.placeholder; else placeholder = schema.label;
    // console.log('isArray', schema.label, Array.isArray(schema));

    if(Array.isArray(schema)) {
        console.log('currentPage', database.currentPage);
        // console.log('typeArray');
        $.each(schema, function(sKey, sValue) {
            // console.log('sValue', sValue);
            formHtml += '<div class="form-group">';
            if(sValue.label) formHtml += '<label>'+sValue.label+'</label>';
            formHtml += formBuilder(sValue, values);
            formHtml += '</div>';
        });
    }
    switch(schema.type) {
        case "textarea":
            // console.log('textarea');
            formHtml += '<textarea class="form-control input-xs" placeholder="'+placeholder+'" name="'+schema.label+'">' + (values[schema.label] || "") + '</textarea>';
        break;
        case "select":
            // console.log('select');
            var oHtml = "";
            $.each(schema.options, function(oKey, oValue) {
                // console.log(values[schema.label], oValue);
                if(values[schema.label] === oValue)
                    oHtml += '<option selected>' + oValue + '</option>';
                else
                    oHtml += '<option>' + oValue + '</option>';
            });
            formHtml+= '<select class="form-control input-xs" name="'+schema.label+'">'+
                    '   <option value="">'+placeholder+'..</option>'+
                    oHtml+
                    '</select>';
        break;
        case "image":
            // console.log('image');
            if(editable) {
                formHtml += '<button type="button" class="btn btn-lg btn-block dp-image-chooser" key="'+schema.label+'" style="height: 100px; background: url(' + (values[schema.label] || 'data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==') + ') center center no-repeat / cover;"></button>';
            }
            else formHtml += '<img key="'+schema.label+'" src="' + (values[schema.label] || 'data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==') + '" class="img-rounded dp-chooser"/>';
        break;
        case "image-btn":
        break;
        case "video":
        break;
        case "set":
        break;
        case "table":
            // console.log('table');
            var thead = "";
            $.each(schema.schema, function(key, value) {
                thead+= '<th>' + value.label + '</th>';
            });
            var tbody = "";
            $.each(values, function(tbKey, tbValue) {
                tbody+= '<tr list-id="' + tbValue._id + '">';
                $.each(schema.schema, function(sKey, sValue) {
                    tbody+= '<td>' + formBuilder(sValue, tbValue, false) + '</td>';
                });
                tbody+= '<td class="text-center">'+
                        // '   <a href="#" class="btn btn-xs list-edit"><i class="fa fa-pencil"></i></a>'+
                        '   <a href="#" class="btn btn-xs list-delete"><i class="fa fa-trash"></i></a>'+
                        '</td>';
                tbody+= '</tr>';
            });

            formHtml +=  '<div class="table-responsive">' +
                    '   <table class="table table-bordered table-striped table-hover table-cms">' +
                    '       <thead><tr>' +
                    thead +
                    '           <th class="text-center" style="width: 68px;"><a href="#" class="btn btn-xs list-add"><i class="fa fa-plus"></i></a></th>' +
                    '       </tr></thead>' +
                    '       <tbody>' +
                    tbody +
                    '       </tbody>' +
                    '   </table>' +
                    '</div>';
        break;
        case "richtext":
            if(editable) {
                formHtml += "<div contenteditable key='"+schema.label+"'>" + (values[schema.label] || "") + "</div>";
            }
            else formHtml += '<button type="button" class="btn btn-default btn-richtext" name="' + schema.label + '"><i class="fa fa-pencil"></i> Richtext</button>';
        break;
        case "viewlink":
            formHtml += '<a href="' + window.location.href.split("editor.php")[0] + values[schema.label] + '" target="_blank">' + values[schema.label] + "</a>";
        break;
        default:
            // console.log('default');
            if(schema.type)
            formHtml += '<input type="'+schema.type+'" class="form-control input-xs" placeholder="'+placeholder+'" name="'+schema.label+'" value="' + (values[schema.label] || "") + '"/>';
        break;
    }


    // console.log(formHtml);
    return formHtml;
}

// COLLECTION
function getDB(name) {
    for(var i = 0; i < database.db.length; i ++) {
      if(database.db[i].name.toLowerCase() === name.toLowerCase()) {
        return database.db[i];
      }
    }
}
function getDBSchema(name) {
    for(var i = 0; i < database.db.length; i ++) {
      if(database.db[i].name.toLowerCase() === name.toLowerCase()) {
        return database.db[i].schema;
      }
    }
}
function getDBCollection(name) {
    for(var i = 0; i < database.db.length; i ++) {
      if(database.db[i].name.toLowerCase() === name.toLowerCase()) {
        return database.db[i].collections;
      }
    }
}

function addDB() {
    var db = {
      "_id": 1,
      "name": "Testimonials",
      "schema": [],
      "collections": []
    };
    $('#mdl-db-editor .modal-title').html('<b><span class="fa fa-plus"></span> Add Collection</b>');
    $('#mdl-db-editor .modal-body').html(formBuilder([{type:"text", label:"name"}, {type:"table", schema: [{"type":"select","label":"type","options":["text","number","date","email","textarea","richtext","select","image","viewlink"]}, {"type":"text","label":"label"}]}], db));
    $('#mdl-db-editor').modal('show');    
}

function editDB(id) {
  for(var i = 0; i < database.db.length; i ++) {
    var db = database.db[i];
    if(id === db._id) {
      database.currentDB = db;
      $('#mdl-db-editor .modal-title').text(db.name);
      $('#mdl-db-editor .modal-body').html(formBuilder({type:"table", schema:db.schema}, db.collections));
      $('#mdl-db-editor').modal('show');
    }
  }
}

function configDB(id) {
  for(var i = 0; i < database.db.length; i ++) {
    var db = database.db[i];
    if(id === db._id) {
      database.currentDB = db;
      $('#mdl-db-editor .modal-title').text(db.name);
      $('#mdl-db-editor .modal-body').html(formBuilder({type:"table", schema: [{"type":"select","label":"type","options":["text","number","date","email","textarea","richtext","select","image","viewlink"]}, {"type":"text","label":"label"}]}, db.schema));
      $('#mdl-db-editor').modal('show');
    }
  }    
}

// RECORD
function getDBRecord(collection, id) {
    for(var i = 0; i < collection.length; i ++) {
        if(id == collection[i]._id) {
          return collection[i];
        }
    }
}



function saveToFile() {
  var html = $('.main').bfeditor('getContent');
            
  for(var i = 0; i < database.pages.length; i ++) {
    if(database.currentPage._id == database.pages[i]._id) {
      database.pages[i].template = html;
    }
  }

  var file = "app.db.js";

  if(file.indexOf(".") == -1) {
    file = file + ".js";
  } else {
    if(file.split('.').pop().toLowerCase() == "js") {
    } else {
      file = file.split('.')[0] + ".js";
    }
  } 

  var data = 'var database = ' + JSON.stringify(database, true, 2);

  $.ajax({
    type: 'post',
    url: 'php/app.db.php',
    data: {db: data},
    success: function(res) {
      if(res === 'success') {
        toastr.success('Your website is now up-to-date', 'Success!');
      } else {
        toastr.error('Pls Try Again', 'Failed!');
        console.log('res', res);
      }
    },
    error: function(error) {

    }
  });

  // var blob = new Blob([data], {type: 'application/javascript;charset=utf-8'});
  // saveAs(blob, file);
}