/**!
 * BFEditor - Bootstrap Front-end content editor
 * @copyright: MarkBandilla (http://mdb.co)
 * @author: MarkBandilla (http://mdb.co)
 * @version: 1.0
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 *
 * Configuration:
 * @option {Boolean} niceScrollEnabled Enable niceScroll or not
 * @option {String} btnMoveContainerText Text content for move button of container
 * @option {String} btnMoveComponentText Text content for move button of component
 * @option {String} btnSettingContainerText Text content for setting button of container
 * @option {String} btnSettingComponentText Text content for setting button of component
 * @option {String} btnDuplicateContainerText Text content for duplicate button of container
 * @option {String} btnDuplicateComponentText Text content for duplicate button of component
 * @option {String} btnDeleteContainerText Text content for delete button of container
 * @option {String} btnDeleteComponentText Text content for delete button of component
 * @option {String} tabContainersText Text for Containers tab
 * @option {String} tabContainersTitle Title for Containers tab
 * @option {String} tabComponentsText Text for Components tab
 * @option {String} tabComponentsTitle Title for Components tab
 * @option {Boolean} tabTooltipEnabled Bootstrap Tooltip is enabled for Component and Container tab or not
 * @option {Object} extraTabs Extra tabs besides Containers and Components tabs in sidebar
 * Example: {
 *     tabName: {
 *         text: 'My Extra Tab #1',
 *         title: 'My Extra Tab #1',
 *         content: 'Here is content of My Extra Tab #1'
 *     }
 * }
 * @option {String|Function} defaultComponentType Default component type of component. If type of component does not exist in BFEditor.components, will be used 'defaultComponentType' as type of this component. If is function, argument is component - jQuery object of component
 * @option {String} snippetsUrl Url to snippets file
 * @option {String} snippetsListId Id of element which contains snippets. As default, value is "bfeditor-snippets-list" and BFEditor will render snippets sidebar automatically. If you specific other id, only snippets will rendered and put into your element
 * @option {Boolean} snippetsTooltipEnabled Bootstrap tooltip is enable for snippet or not
 * @option {String} snippetsTooltipPosition Position of Bootstrap tooltip for snippet. Can be 'left', 'right', 'top' and 'bottom'
 * @option {Boolean} snippetsFilterEnabled Enable filtering snippets by categories and text searching or not
 * @option {String} snippetsCategoriesSeparator The separator character between each categories
 * @option {Boolean} iframeMode BFEditor is created inside an iframe or not. Keditor will add all elements which have 'data-type=bfeditor-style' for iframe stylesheet. These elements can be 'link', 'style' or any tags. If these elements have 'href' attribute, will create link tag with href. If these elements do not have 'href' attribute, will create style tag with css rule is html code inside element
 * @option {String} contentAreasSelector Selector of content areas. If is null or selector does not match any elements, will create default content area and wrap all content inside it.
 * @option {String} contentAreasWrapper The wrapper element for all contents inside iframe. It's just for displaying purpose. If you want all contents inside iframe are appended into body tag
 * @option {Boolean} containerSettingEnabled Enable setting panel for container
 * @option {Function} containerSettingInitFunction Method will be called when initializing setting panel for container
 * @option {Function} containerSettingShowFunction Method will be called when setting panel for container is showed
 * @option {Function} containerSettingHideFunction Method will be called when setting panel for container is hidden
 * @option {Function} onReady Callback will be called after bfeditor instance is ready
 * @option {Function} onInitFrame Callback will be called after iframe and content areas wrapper inside it are created. Arguments: frame, frameHead, frameBody
 * @option {Function} onSidebarToggled Callback will be called after toggled sidebar. Arguments: isOpened
 * @option {Function} onInitContentArea Callback will be called when initializing content area. It can return array of jQuery objects which will be initialized as container in content area. By default, all first level sections under content area will be initialized. Arguments: contentArea
 * @option {Function} onContentChanged Callback will be called when content is changed. Includes add, delete, duplicate container or component. Or content of a component is changed. Arguments: event
 * @option {Function} onInitContainer Callback will be called when initializing container. It can return array of jQuery objects which will be initialized as editable components in container content (NOTE: these objects MUST be under elements which have attribute data-type="container-content"). By default, all first level sections under container content will be initialized. Arguments: container
 * @option {Function} onBeforeContainerDeleted Callback will be called before container is deleted. Arguments: event, selectedContainer
 * @option {Function} onContainerDeleted Callback will be called after container and its components are already deleted. Arguments: event, selectedContainer
 * @option {Function} onContainerChanged Callback will be called when content of container is changed. It can be when container received new component from snippet or from other container. Or content of any components are changed or any components are deleted or duplicated. Arguments: event, changedContainer
 * @option {Function} onContainerDuplicated Callback will be called when a container is duplicated. Arguments: event, originalContainer, newContainer
 * @option {Function} onContainerSelected Callback will be called when a container is selected. Arguments: event, selectedContainer
 * @option {Function} onContainerSnippetDropped Callback will be called when a container snippet is dropped into content area. Arguments: event, newContainer, droppedContainer
 * @option {Function} onComponentReady Callback will be called after component is initialized. This callback is available or not is depend on component type handler.
 * @option {Function} onInitComponent Callback will be called when initializing component. Arguments: component
 * @option {Function} onBeforeComponentDeleted Callback will be called before a component is deleted. Arguments: event, selectedComponent
 * @option {Function} onComponentDeleted Callback will be called after a component is deleted. Arguments: event, selectedComponent
 * @option {Function} onComponentChanged Callback will be called when content of a component is changed. Arguments: event, changedComponent
 * @option {Function} onComponentDuplicated Callback will be called when a component is duplicated. Arguments: event, originalComponent, newComponent
 * @option {Function} onComponentSelected Callback will be called when a component is selected. Arguments: event, selectedComponent
 * @option {Function} onComponentSnippetDropped Callback will be called after a component snippet is dropped into a container. Arguments: event, newComponent, droppedComponent
 * @option {Function} onBeforeDynamicContentLoad Callback will be called before loading dynamic content. Arguments: dynamicElement, component
 * @option {Function} onDynamicContentLoaded Callback will be called after dynamic content is loaded. Arguments: dynamicElement, response, status, xhr
 * @option {Function} onDynamicContentError Callback will be called if loading dynamic content is error, abort or timeout. Arguments: dynamicElement, response, status, xhr
 */
(function ($) {
    // Log function will print log message when "BFEditor.debug" equals "true"
    var flog = function () {
        if (typeof (console) !== 'undefined' && BFEditor.debug === true) {
            if (navigator.appName == 'Microsoft Internet Explorer') {
                // BM: Previous used JSON, but that crashed IE sometimes. So this is pretty crap, but at least safer
                if (arguments.length == 1) {
                    console.log('[BFEditor]', arguments[0]);
                } else if (arguments.length == 2) {
                    console.log('[BFEditor]', arguments[0], arguments[1]);
                } else if (arguments.length > 2) {
                    console.log('[BFEditor]', arguments[0], arguments[1], arguments[2]);
                }
            } else {
                console.log(['BFEditor'], arguments);
            }
        }
    };
    
    // Throw error message
    var error = function (msg) {
        throw new Error('[BFEditor] ' + msg);
    };
    
    // Check dependencies
    if (!$.fn.draggable) {
        error('$.fn.draggable does not exist. Please import $.fn.draggable into your document for continue using BFEditor.');
    }
    if (!$.fn.droppable) {
        error('$.fn.droppable does not exist. Please import $.fn.droppable into your document for continue using BFEditor.');
    }
    if (!$.fn.sortable) {
        error('$.fn.sortable does not exist. Please import $.fn.sortable into your document for continue using BFEditor.');
    }
    
    // BFEditor class
    var BFEditor = function (target, options) {
        this.options = $.extend({}, BFEditor.DEFAULTS, options);
        this.init(target);
    };
    
    // Turn on/off debug mode
    BFEditor.debug = false;
    
    // Version of BFEditor
    BFEditor.version = '1.1.4';
    
    // Default configuration of BFEditor
    BFEditor.DEFAULTS = {
        niceScrollEnabled: true,
        btnMoveContainerText: '<i class="fa fa-sort"></i>',
        btnMoveComponentText: '<i class="fa fa-arrows"></i>',
        btnSettingContainerText: '<i class="fa fa-cog"></i>',
        btnSettingComponentText: '<i class="fa fa-cog"></i>',
        btnDuplicateContainerText: '<i class="fa fa-files-o"></i>',
        btnDuplicateComponentText: '<i class="fa fa-files-o"></i>',
        btnDeleteContainerText: '<i class="fa fa-times"></i>',
        btnDeleteComponentText: '<i class="fa fa-times"></i>',
        tabContainersText: 'Containers',
        tabContainersTitle: 'Containers',
        tabComponentsText: 'Components',
        tabComponentsTitle: 'Components',
        tabTooltipEnabled: true,
        extraTabs: null,
        defaultComponentType: 'blank',
        snippetsUrl: 'snippets/default/snippets.html',
        snippetsListId: 'bfeditor-snippets-list',
        snippetsTooltipEnabled: true,
        snippetsTooltipPosition: 'left',
        snippetsFilterEnabled: true,
        snippetsCategoriesSeparator: ';',
        iframeMode: false,
        contentAreasSelector: null,
        contentAreasWrapper: '<div class="bfeditor-content-areas-wrapper container"></div>',
        containerSettingEnabled: true,
        containerSettingInitFunction: function(form, bfeditor) {},
        containerSettingShowFunction: function(form, bfeditor, editor) {
            // console.log('bfeditor', editor.options);

            var section = $(bfeditor).find('.bfeditor-container-inner');
            var id = $(section).prop('id');
            var cClass = $(section).prop('class').replace(/bfeditor-container-inner/g, '');
            var height = $(section).css('height');
            var color = $(section).css('background-color');
            var image = $(section).css('background-image').replace('url("', "").replace('")', "");
            var isContainer = $(section).find('> div').hasClass('container');
            var isFluid = $(section).find('> div').hasClass('container-fluid');
            var margin = $(section).css('margin');
            var padding = $(section).css('padding');

            var imageOptions = "";
            imageOptions =  '	<div class="row">' +
            				'	<div class="col-xs-6">' +
            				'       <label><input type="checkbox" name="repeat"> Repeat</label>' +
                            '       <label><input type="checkbox" name="center"> Center</label>' +
                            '	</div>' +
                            '	<div class="col-xs-6">' +
                            '       <label><input type="checkbox" name="fixed"> Fixed</label>' +
                            '       <label><input type="checkbox" name="cover"> Cover</label>' +
                            '	</div>' +
                            '	</div>';

            var containerOptions = "";
            if(isContainer) {
                containerOptions =  '<option value="main-wraper">none</option>' +
                                    '<option selected>container</option>' +
                                    '<option>container-fluid</option>';
            } else if(isFluid) {
                containerOptions =  '<option value="main-wraper">none</option>' +
                                    '<option>container</option>' +
                                    '<option selected>container-fluid</option>';
            } else {
                containerOptions =  '<option value="main-wraper" selected>none</option>' +
                                    '<option>container</option>' +
                                    '<option>container-fluid</option>';
            }

            // var overflowOptions = "";
            // if($(section).css('overflow') === 'visible') {
            //     overflowOptions =  '<option selected>visible</option>' +
            //                         '<option>auto</option>' +
            //                         '<option>hidden</option>';
            // } else if($(section).css('overflow') === 'auto') {
            //     overflowOptions =  '<option>visible</option>' +
            //                         '<option selected>auto</option>' +
            //                         '<option>hidden</option>';
            // } else if($(section).css('overflow') === 'hidden') {
            //     overflowOptions =  '<option>visible</option>' +
            //                         '<option>auto</option>' +
            //                         '<option selected>hidden</option>';
            // }

            // console.log('component', id, color, image, isContainer, isFluid, padding);


            form.html(
                '<form class="form-horizontal form-container-settings">' +
                '   <legend>Property</legend>' +
                '   <div class="form-group">' +
                '       <label class="control-label col-xs-3">Type:</label>' +
                '       <div class="col-xs-9">' +
                '           <select name="type" class="form-control">' +
                containerOptions +
                '           </select>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label class="control-label col-xs-3">ID:</label>' +
                '       <div class="col-xs-9">' +
                '           <input type="text" name="id" class="form-control" value="' + id + '" />' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label class="control-label col-xs-3">Class:</label>' +
                '       <div class="col-xs-9">' +
                '           <input type="text" name="class" class="form-control" value="' + cClass + '" />' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label class="control-label col-xs-3">Height:</label>' +
                '       <div class="col-xs-9">' +
                '           <input type="text" name="height" class="form-control" value="' + height + '" />' +
                '       </div>' +
                '   </div>' +
                // '   <div class="form-group">' +
                // '       <label class="control-label col-xs-3">Overflow:</label>' +
                // '       <div class="col-xs-9">' +
                // '           <select name="overflow" class="form-control">' +
                // overflowOptions +
                // '           </select>' +                
                // '       </div>' +
                // '   </div>' +
                '   <br>' +
                '   <legend>Background</legend>' +
                '   <div class="form-group">' +
                '       <label class="control-label col-xs-3">Color:</label>' +
                '       <div class="col-xs-9">' +
                '           <input type="text" name="color" placeholder="Color" class="form-control" value="' + color + '" />' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label class="control-label col-xs-3">Image:</label>' +
                '       <div class="col-xs-9">' +
                '           <button type="button" class="btn btn-lg btn-block dp-chooser" style="height: 50px; border: 1px solid #ccc; background: url('+image+') center center; background-size: cover;"></button>' +
                '       </div>' +
                '       <div class="col-xs-11 col-xs-offset-1">' +
                '       <br>' +
                imageOptions +
                '       </div>' +
                '   </div>' +
                '   <br>' +
                '   <legend>Spacing</legend>' +
                '   <div class="form-group">' +
                '       <label class="control-label col-xs-3">Margin:</label>' +
                '       <div class="col-xs-9">' +
                '           <input type="text" name="margin" class="form-control" value="' + margin +'" />' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label class="control-label col-xs-3">Padding:</label>' +
                '       <div class="col-xs-9">' +
                '           <input type="text" name="padding" class="form-control" value="' + padding +'" />' +
                '       </div>' +
                '   </div>' +
                '</form>'
            );

            if($(section).css('background-repeat') === 'no-repeat') {
                form.find('[name="repeat"]').prop('checked', false);
            } else {
                form.find('[name="repeat"]').prop('checked', true);                
            }
            if($(section).css('background-size') === 'cover') {
                form.find('[name="cover"]').prop('checked', true);
            }
            if($(section).css('background-attachment') === 'fixed') {
                form.find('[name="fixed"]').prop('checked', true);
            }
            if($(section).css('background-position') === '50% 50%') {
                form.find('[name="center"]').prop('checked', true);
            }

            form.find('.dp-chooser').on('click', function() {
                var _this = $(this)
                dpChooser('image', function(link) {
                    console.log(link);
                    var bg = "url('"+link+"')";
                    // console.log($(_this).css("background-image"));
                    $(_this).css({"background-image": bg});

                    var color = $(this).closest('form').find('[name="color"]').val();
                    var image = $(this).closest('form').find('[name="image"]').css("background-image");
                    var repeat = $(this).closest('form').find('[name="repeat"]:checked').val();
                    var center = $(this).closest('form').find('[name="center"]:checked').val();
                    var fixed = $(this).closest('form').find('[name="fixed"]:checked').val();
                    var cover = $(this).closest('form').find('[name="cover"]:checked').val();

                    var bg = "";
                    if(color) bg += color + " ";
                    if(image != null || image != undefined || image != '' && image != 'none') bg += "url('" +image+ "') ";
                    if(!repeat) bg += "no-repeat ";
                    if(center) bg += "center center ";
                    if(fixed) bg += "fixed ";

                    if(image) $(section).css('background', bg);
                    if(cover) $(section).css('background-size', 'cover');

                });
            });

            form.find('[name]').on('change', function(e) {
                e.preventDefault();
                var color = $(this).closest('form').find('[name="color"]').val();
                var image = $(this).closest('form').find('[name="image"]').css("background-image");
                var repeat = $(this).closest('form').find('[name="repeat"]:checked').val();
                var center = $(this).closest('form').find('[name="center"]:checked').val();
                var fixed = $(this).closest('form').find('[name="fixed"]:checked').val();
                var cover = $(this).closest('form').find('[name="cover"]:checked').val();

                // console.log('bg', color, image, repeat, center, fixed, cover);

                switch($(this).attr('name')) {
                    case 'id':
                        $(section).prop('id', $(this).val());
                    break;
                    case 'class':
                        $(section).prop('class', 'bfeditor-container-inner ' + $(this).val());
                    break;
                    case 'height':
                        $(section).css('height', $(this).val());
                    break;
                    // case 'overflow':
                    //     $(section).css('overflow', $(this).val());
                    // break;
                    case 'type':
                        $(section).find('> div').removeClass('container-fluid');
                        $(section).find('> div').removeClass('container');

                        $(section).find('> div').addClass($(this).val());
                    break;
                    case 'margin':
                        $(section).css('margin', $(this).val());
                    break;
                    case 'padding':
                        $(section).css('padding', $(this).val());
                    break;
                    default:
                        var bg = "";
                        if(color) bg += color + " ";
                        if(image != null && image != undefined && image != '' && image != 'none') bg += "url('" +image+ "') ";
                        if(!repeat) bg += "no-repeat ";
                        if(center) bg += "center center ";
                        if(fixed) bg += "fixed ";

                        console.log('bg', bg);

                        $(section).css('background', bg);
                        if(cover) $(section).css('background-size', 'cover');
                    break;
                }

                if (typeof editor.options.onContentChanged === 'function') {
                    editor.options.onContentChanged.call(null, null);
                }
            });
        },
        containerSettingHideFunction: null,
        onReady: function () {
        },
        onInitFrame: function (frame, frameHead, frameBody) {
        },
        onSidebarToggled: function (isOpened) {
        },
        onInitContentArea: function (contentArea) {
            // $(contentArea).prepend(database.layout.header.template);
            // $(contentArea).append(database.layout.footer.template);
        },
        onContentChanged: function (event) {
        },
        onInitContainer: function (container) {
        },
        onBeforeContainerDeleted: function (event, selectedContainer) {
        },
        onContainerDeleted: function (event, selectedContainer) {
        },
        onContainerChanged: function (event, changedContainer) {
            // FORCE SHOW
            $.each($(changedContainer).find('[data-force-show]'), function() {
                var css = $(this).data('force-show');
                console.log('css', css);
                $(this).css(css);
            });
        },
        onContainerDuplicated: function (event, originalContainer, newContainer) {
        },
        onContainerSelected: function (event, selectedContainer) {
        },
        onContainerSnippetDropped: function (event, newContainer, droppedContainer) {
        },
        onComponentReady: function (component) {
        },
        onInitComponent: function (component) {
        },
        onBeforeComponentDeleted: function (event, selectedComponent) {
        },
        onComponentDeleted: function (event, selectedComponent) {
        },
        onComponentChanged: function (event, changedComponent) {
        },
        onComponentDuplicated: function (event, originalComponent, newComponent) {
        },
        onComponentSelected: function (event, selectedComponent) {
        },
        onComponentSnippetDropped: function (event, newComponent, droppedComponent) {
        },
        onBeforeDynamicContentLoad: function (dynamicElement, component) {
        },
        onDynamicContentLoaded: function (dynamicElement, response, status, xhr) {
        },
        onDynamicContentError: function (dynamicElement, response, status, xhr) {
        }
    };
    
    // Component types
    BFEditor.components = {
        blank: {
            settingEnabled: false
        }
    };
    
    // Export log methods;
    BFEditor.log = flog;
    BFEditor.error = error;
    
    BFEditor.prototype = {
        init: function (target) {
            var self = this;
            var options = self.options;
            
            if (options.iframeMode) {
                target = self.initFrame(target);
            } else {
                self.body = $(document.body);
                
                if (target.is('textarea')) {
                    flog('Target is textarea', target);
                    
                    var htmlContent = target.val();
                    var bfeditorWrapper = $('<div />');
                    var bfeditorWrapperId = self.generateId('wrapper');
                    
                    target.after(bfeditorWrapper);
                    bfeditorWrapper.attr({
                        id: bfeditorWrapperId,
                        class: 'bfeditor-wrapper'
                    });
                    
                    bfeditorWrapper.html(htmlContent);
                    target.css('display', 'none');
                    target.attr('data-bfeditor-wrapper', '#' + bfeditorWrapperId);
                    
                    target = bfeditorWrapper;
                }
            }
            
            var body = self.body;
            var ajaxRequest;
            if (body.hasClass('initialized-snippets-list')) {
                flog('Snippets list is already initialized!');
            } else {
                ajaxRequest = self.initSidebar();
                body.addClass('initialized-snippets-list');
            }
            if (body.hasClass('initialized-click-event-handlers')) {
                flog('CLick event handlers is already initialized!');
            } else {
                self.initBFEditorClicks();
                body.addClass('initialized-click-event-handlers');
            }
            
            self.initContentAreas(target);
            
            if (!ajaxRequest && typeof options.onReady === 'function') {
                options.onReady.call(self);
            }
        },
        
        generateId: function (type) {
            var timestamp = (new Date()).getTime();
            return 'bfeditor-' + type + '-' + timestamp;
        },
        
        initNiceScroll: function (target) {
            flog('initNiceScroll', target);
            
            if ($.fn.niceScroll && this.options.niceScrollEnabled) {
                flog('Initialize $.fn.niceScroll');
                target.niceScroll({
                    cursorcolor: '#999',
                    cursorwidth: 6,
                    railpadding: {
                        top: 0,
                        right: 0,
                        left: 0,
                        bottom: 0
                    },
                    cursorborder: '',
                    disablemutationobserver: true
                });
            } else {
                flog('$.fn.niceScroll does not exist. Use default sidebar.');
            }
        },
        
        initFrame: function (target) {
            flog('initFrame', target);
            
            var self = this;
            var options = self.options;
            var originalContent = target.html();
            var iframe = $('<iframe />');
            var iframeId = self.generateId('frame');
            
            target.after(iframe);
            iframe.attr({
                'id': iframeId,
                'class': 'bfeditor-frame'
            });
            
            target.css('display', 'none');
            target.attr('data-bfeditor-frame', '#' + iframeId);
            
            var iframeDoc = iframe.contents();
            var iframeHead = iframeDoc.find('head');
            var iframeBody = iframeDoc.find('body');
            
            flog('Adding styles to iframe...');
            var styles = '';
            $('[data-type="bfeditor-style"]').each(function () {
                var style = $(this);
                var href = style.attr('href') || style.attr('data-href') || '';
                
                if (href) {
                    styles += '<link rel="stylesheet" type="text/css" href="' + href + '" />\n';
                } else {
                    styles += '<style type="text/css">' + style.html() + '</style>\n';
                }
            });
            flog('Styles: \n' + styles);
            
            iframeHead.append(styles);
            flog('All styles are added');
            
            flog('Adding original content to iframe...');
            var contentAreasWrapper;
            if (options.contentAreasWrapper) {
                contentAreasWrapper = $(options.contentAreasWrapper);
                iframeBody.append(contentAreasWrapper);
                contentAreasWrapper.html(originalContent);
            } else {
                iframeBody.html(originalContent);
            }
            
            // In frame, have to use default snippets container
            options.snippetsListId = BFEditor.DEFAULTS.snippetsListId;
            
            self.body = iframeBody;
            
            if (typeof options.onInitFrame === 'function') {
                options.onInitFrame.call(iframe, iframe, iframeHead, iframeBody);
            }
            
            return contentAreasWrapper || iframeBody;
        },
        
        initSidebar: function () {
            flog('initSidebar');
            
            var self = this;
            var options = self.options;
            var body = self.body;
            body.addClass('opened-bfeditor-sidebar');
            
            if (options.snippetsListId === BFEditor.DEFAULTS.snippetsListId) {
                flog('Render default BFEditor snippet container');
                
                body.append(
                    '<div id="bfeditor-sidebar">' +
                    '   <a id="bfeditor-sidebar-toggler"><i class="fa fa-chevron-right"></i></a>' +
                    '   <div id="bfeditor-snippets-list"></div>' +
                    '   <div id="bfeditor-snippets-content" style="display: none"></div>' +
                    '   <div id="bfeditor-setting-panel">' +
                    '       <div id="bfeditor-setting-header"><span id="bfeditor-setting-title"></span><a href="#" id="bfeditor-setting-closer"><i class="fa fa-arrow-right"></i></a></div>' +
                    '       <div id="bfeditor-setting-body"><div id="bfeditor-setting-forms"></div></div>' +
                    '   </div>' +
                    '</div>'
                );
                self.initSidebarToggler();
            } else {
                flog('Render BFEditor snippets content after custom snippets list with id="' + options.snippetsListId + '"');
                body.find('#' + options.snippetsListId).after('<div id="bfeditor-snippets-content" style="display: none"></div>');
            }
            
            if (typeof options.snippetsUrl === 'string' && options.snippetsUrl.length > 0) {
                flog('Getting snippets form "' + options.snippetsUrl + '"...');
                
                return $.ajax({
                    type: 'get',
                    dataType: 'html',
                    url: options.snippetsUrl,
                    success: function (resp) {
                        flog('Success in getting snippets', resp);
                        
                        self.renderSnippets(resp);
                        self.initSnippets();
                        self.initTabs();
                        self.initTabsSwitcher();
                        self.initSettingPanel();
                        
                        if (options.snippetsFilterEnabled) {
                            self.initSnippetsFilter('Container');
                            self.initSnippetsFilter('Component');
                        }
                        
                        if (options.snippetsTooltipEnabled || options.tabTooltipEnabled) {
                            flog('Initialize Bootstrap tooltip plugin');
                            body.find('#' + options.snippetsListId).find('[data-toggle="tooltip"]').tooltip();
                        }
                        
                        if (typeof options.onReady === 'function') {
                            options.onReady.call(self);
                        }
                    },
                    error: function (jqXHR) {
                        flog('Error when getting snippets', jqXHR);
                    }
                });
            } else {
                error('"snippetsUrl" must be not null!');
            }
        },
        
        initSnippetsFilter: function (type) {
            flog('initSnippetsFilter', type);
            
            var self = this;
            var options = self.options;
            var body = self.body;
            var lowerCaseType = type.toLowerCase();
            var categories = self['snippets' + type + 'Categories'];
            
            var filterHtml = '';
            filterHtml += '<div id="bfeditor-' + lowerCaseType + '-snippets-filter-wrapper" class="bfeditor-snippets-filter-wrapper">';
            filterHtml += '     <input type="text" id="bfeditor-' + lowerCaseType + '-snippets-search" class="bfeditor-snippets-search" value="" placeholder="Type to search..." />';
            filterHtml += '     <select id="bfeditor-' + lowerCaseType + '-snippets-filter" class="bfeditor-snippets-filter">';
            filterHtml += '         <option value="" selected="selected">All</option>';
            
            for (var i = 0; i < categories.length; i++) {
                filterHtml += '     <option value="' + categories[i] + '">' + categories[i] + '</option>';
            }
            
            filterHtml += '     </select>';
            filterHtml += '</div>';
            
            var tab = body.find('#bfeditor-' + lowerCaseType + '-snippets-tab');
            var snippets = tab.find('.bfeditor-snippet');
            tab.prepend(filterHtml);
            
            snippets.each(function () {
                var snippet = $(this);
                var categories = snippet.attr('data-categories') || '';
                var filterCategories = categories.toLowerCase();
                categories = categories.split(options.snippetsCategoriesSeparator);
                filterCategories = filterCategories.split(options.snippetsCategoriesSeparator);
                
                snippet.data('categories', categories);
                snippet.data('categoriesFilter', filterCategories);
            });
            
            var txtSearch = tab.find('.bfeditor-snippets-search');
            var cbbFilter = tab.find('.bfeditor-snippets-filter');
            
            var doFilter = function () {
                var selectedCategory = (cbbFilter.val() || '').toLowerCase();
                var searchText = (txtSearch.val() || '').toLowerCase();
                
                flog('Do filter with selected category is "' + selectedCategory + '" and search text is "' + searchText + '"');
                
                if (selectedCategory || searchText) {
                    flog('Filtering snippets');
                    
                    snippets.each(function () {
                        var snippet = $(this);
                        var dataCategories = snippet.data('categoriesFilter');
                        var dataCategoriesString = dataCategories.join(';');
                        var error = 0;
                        
                        if (selectedCategory) {
                            if ($.inArray(selectedCategory, dataCategories) === -1) {
                                error++;
                            }
                        }
                        
                        if (searchText) {
                            var title = snippet.attr('title').toLowerCase();
                            if (title.indexOf(searchText) === -1 && dataCategoriesString.indexOf(searchText) === -1) {
                                error++;
                            }
                        }
                        
                        snippet[error === 0 ? 'removeClass' : 'addClass']('not-matched');
                    });
                } else {
                    flog('Show all snippets');
                    snippets.removeClass('not-matched');
                }
            };
            
            cbbFilter.on('change', function () {
                doFilter();
            });
            
            var timer;
            txtSearch.on('keydown', function () {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    doFilter();
                }, 200);
            });
        },
        
        toggleSidebar: function (showSidebar) {
            flog('toggleSidebar', showSidebar);
            
            var self = this;
            var options = self.options;
            var body = self.body;
            var icon = body.find('#bfeditor-sidebar-toggler i');
            
            if (showSidebar) {
                body.addClass('opened-bfeditor-sidebar');
                icon.attr('class', 'fa fa-chevron-right')
            } else {
                body.removeClass('opened-bfeditor-sidebar');
                icon.attr('class', 'fa fa-chevron-left')
            }
            
            if (typeof options.onSidebarToggled === 'function') {
                options.onSidebarToggled.call(null, showSidebar);
            }
        },
        
        initSidebarToggler: function () {
            flog('initSidebarToggler');
            
            var self = this;
            var body = self.body;
            
            body.find('#bfeditor-sidebar-toggler').on('click', function (e) {
                e.preventDefault();
                
                self.toggleSidebar(!body.hasClass('opened-bfeditor-sidebar'));
            });
        },
        
        renderSnippets: function (resp) {
            flog('renderSnippets', resp);
            
            var self = this;
            var options = self.options;
            var body = self.body;
            
            var snippetsContainerHtml = '';
            var snippetsComponentHtml = '';
            var snippetsContentHtml = '';
            
            self.snippetsContainerCategories = [];
            self.snippetsComponentCategories = [];
            
            $('<div />').html(resp).find('> div').each(function (i) {
                var snippet = $(this);
                var content = snippet.html().trim();
                var previewUrl = snippet.attr('data-preview');
                var type = snippet.attr('data-type');
                var title = snippet.attr('data-bfeditor-title');
                var snippetHtml = '';
                var categories = snippet.attr('data-categories') || '';
                
                flog('Snippet #' + i + ' type=' + type + ' categories=' + categories, previewUrl, content);
                
                snippetHtml += '<section class="bfeditor-snippet" data-snippet="#bfeditor-snippet-' + i + '" data-type="' + type + '" ' + (options.snippetsTooltipEnabled ? 'data-toggle="tooltip" data-placement="' + options.snippetsTooltipPosition + '"' : '') + ' title="' + title + '" data-categories="' + categories + '">';
                snippetHtml += '   <img class="bfeditor-snippet-preview" src="' + previewUrl + '" />';
                snippetHtml += '</section>';
                
                categories = categories.split(options.snippetsCategoriesSeparator);
                
                if (type === 'container') {
                    snippetsContainerHtml += snippetHtml;
                    self.snippetsContainerCategories = self.snippetsContainerCategories.concat(categories);
                } else if (type.indexOf('component') !== -1) {
                    snippetsComponentHtml += snippetHtml;
                    self.snippetsComponentCategories = self.snippetsComponentCategories.concat(categories);
                }
                
                var dataAttributes = self.getDataAttributes(snippet, ['data-preview', 'data-type', 'data-bfeditor-title', 'data-categories'], true);
                snippetsContentHtml += '<script id="bfeditor-snippet-' + i + '" type="text/html" ' + dataAttributes.join(' ') + '>' + content + '</script>';
            });
            
            self.snippetsContainerCategories = self.beautifyCategories(self.snippetsContainerCategories);
            self.snippetsComponentCategories = self.beautifyCategories(self.snippetsComponentCategories);
            
            body.find('#' + options.snippetsListId).html(
                '<ul id="bfeditor-snippets-type-switcher" class="nav nav-tabs nav-justified">' +
                '    <li class="active"><a href="#bfeditor-container-snippets-tab">' + options.tabContainersText + '</a></li>' +
                '    <li><a href="#bfeditor-component-snippets-tab">' + options.tabComponentsText + '</a></li>' +
                '</ul>' +
                '<div id="bfeditor-snippets-container" class="tab-content">' +
                '   <div class="tab-pane bfeditor-snippets active" id="bfeditor-container-snippets-tab"><div class="bfeditor-snippets-inner">' + snippetsContainerHtml + '</div></div>' +
                '   <div class="tab-pane bfeditor-snippets" id="bfeditor-component-snippets-tab"><div class="bfeditor-snippets-inner">' + snippetsComponentHtml + '</div></div>' +
                '</div>'
            ).addClass('loaded-snippets');
            body.find('#bfeditor-snippets-content').html(snippetsContentHtml);
        },
        
        beautifyCategories: function (categories) {
            flog('beautifyCategories', categories);
            
            var newArray = [];
            for (var i = 0; i < categories.length; i++) {
                var category = categories[i] || '';
                
                if (category !== '' && $.inArray(category, newArray) === -1) {
                    newArray.push(category);
                }
            }
            
            return newArray.sort();
        },
        
        initSnippets: function () {
            flog('initSnippets');
            
            var self = this;
            var options = self.options;
            var body = self.body;
            var snippetsList = body.find('#' + options.snippetsListId);
            
            flog('Initialize $.fn.draggable for container snippets list');
            snippetsList.find('.bfeditor-snippet[data-type=container]').draggable({
                helper: 'clone',
                revert: 'invalid',
                connectToSortable: body.find('.bfeditor-content-area'),
                start: function () {
                    $('[contenteditable]').blur();
                    $('.bfeditor-container.showed-bfeditor-toolbar').removeClass('showed-bfeditor-toolbar');
                    $('.bfeditor-component.showed-bfeditor-toolbar').removeClass('showed-bfeditor-toolbar');
                },
                stop: function () {
                    snippetsList.find('.bfeditor-snippet[data-type^=component]').draggable('option', 'connectToSortable', body.find('.bfeditor-container-content'));
                }
            });
            
            snippetsList.find('.bfeditor-snippet[data-type^=component]').draggable({
                helper: 'clone',
                revert: 'invalid',
                connectToSortable: body.find('.bfeditor-container-content'),
                start: function () {
                    body.find('[contenteditable]').blur();
                    body.find('.bfeditor-container.showed-bfeditor-toolbar').removeClass('showed-bfeditor-toolbar');
                    body.find('.bfeditor-component.showed-bfeditor-toolbar').removeClass('showed-bfeditor-toolbar');
                    body.addClass('highlighted-container-content');
                },
                stop: function () {
                    body.removeClass('highlighted-container-content');
                }
            });
        },
        
        initTabs: function () {
            flog('initTabs');
            
            var self = this;
            var body = self.body;
            var options = self.options;
            var switcherWrapper = body.find('#bfeditor-snippets-type-switcher');
            var tabPaneWrapper = body.find('#bfeditor-snippets-container');
            
            if (options.extraTabs && $.isPlainObject(options.extraTabs)) {
                flog('Add extra tabs', options.extraTabs);
                
                for (var tabName in options.extraTabs) {
                    var tabData = options.extraTabs[tabName];
                    
                    switcherWrapper.append('<li><a href="#bfeditor-extra-tab-' + tabName + '"' + (options.tabTooltipEnabled ? 'data-toggle="tooltip" data-placement="bottom" title="' + tabData.title + '"' : '') + '>' + tabData.text + '</a></li>');
                    tabPaneWrapper.append('<div class="tab-pane bfeditor-snippets" id="bfeditor-extra-tab-' + tabName + '"><div class="bfeditor-snippets-inner">' + tabData.content + '</div></div>');
                }
            }
            
            self.initNiceScroll(tabPaneWrapper.find('.bfeditor-snippets-inner'));
        },
        
        initTabsSwitcher: function () {
            flog('initTabsSwitcher');
            
            var self = this;
            var body = self.body;
            var switcherLis = body.find('#bfeditor-snippets-type-switcher li');
            var tabPane = body.find('#bfeditor-snippets-container .tab-pane');
            
            switcherLis.find('a').on('click', function (e) {
                e.preventDefault();
                
                var a = $(this);
                var li = a.parent();
                var href = a.attr('href');
                
                if (!li.hasClass('active')) {
                    var activatedLi = switcherLis.filter('.active');
                    var activatedPane = tabPane.filter('.active');
                    var targetDiv = body.find(href);
                    
                    activatedLi.removeClass('active');
                    activatedPane.removeClass('active');
                    
                    li.addClass('active');
                    targetDiv.addClass('active');
                    
                    if ($.fn.niceScroll && self.options.niceScrollEnabled) {
                        activatedPane.getNiceScroll().hide();
                        
                        var targetNiceScroll = targetDiv.getNiceScroll();
                        targetNiceScroll.show();
                        targetNiceScroll.resize();
                    }
                }
            });
        },
        
        initSettingPanel: function () {
            flog('initSettingPanel');
            
            var self = this;
            var options = self.options;
            var body = self.body;
            
            body.find('#bfeditor-setting-closer').on('click', function (e) {
                e.preventDefault();
                
                self.hideSettingPanel();
            });
            
            var settingForms = body.find('#bfeditor-setting-forms');
            self.initNiceScroll(settingForms);
            
            if (options.containerSettingEnabled === true) {
                if (typeof options.containerSettingInitFunction === 'function') {
                    
                    var form = $('<div id="bfeditor-container-setting" class="bfeditor-setting-form clearfix"></div>');
                    settingForms.append(form);
                    
                    flog('Initialize container setting panel');
                    options.containerSettingInitFunction.call(self, form, self);
                } else {
                    error('"containerSettingInitFunction" is not function!');
                }
            }
        },
        
        setSettingContainer: function (container) {
            flog('setSettingContainer', container);
            
            var self = this;
            var body = self.body;
            
            if (container) {
                var idSettingContainer = container.attr('id');
                body.attr('data-setting-container', idSettingContainer);
            } else {
                body.removeAttr('data-setting-container');
            }
        },
        
        getSettingContainer: function () {
            flog('getSettingContainer');
            
            var self = this;
            var body = self.body;
            var idSettingContainer = body.attr('data-setting-container');
            
            return body.find('#' + idSettingContainer);
        },
        
        setSettingComponent: function (component) {
            flog('setSettingComponent', component);
            
            var self = this;
            var body = self.body;
            
            if (component) {
                var idSettingComponent = component.attr('id');
                body.attr('data-setting-component', idSettingComponent);
            } else {
                body.removeAttr('data-setting-component');
            }
        },
        
        getSettingComponent: function () {
            flog('getSettingComponent');
            
            var self = this;
            var body = self.body;
            var idSettingComponent = body.attr('data-setting-component');
            
            return body.find('#' + idSettingComponent);
        },
        
        showSettingPanel: function (target) {
            flog('showSettingPanel', target);
            
            var self = this;
            var options = self.options;
            var body = self.body;
            var isComponent = target.is('.bfeditor-component');

            // console.log('isComponent', isComponent);
            
            var activeForm = body.find('#bfeditor-setting-forms').children('.active');
            activeForm.removeClass('active');
            
            if (isComponent) {
                self.setSettingComponent(target);
                self.setSettingContainer(null);
                
                var componentType = self.getComponentType(target);
                var componentData = BFEditor.components[componentType];
                body.find('#bfeditor-setting-title').html(componentData.settingTitle);
                
                var settingForms = body.find('#bfeditor-setting-forms');
                var settingForm = body.find('#bfeditor-setting-' + componentType);
                
                if (settingForm.length === 0) {
                    var componentData = BFEditor.components[componentType];
                    if (typeof componentData.initSettingForm === 'function') {
                        settingForm = $('<div id="bfeditor-setting-' + componentType + '" data-type="' + componentType + '" class="bfeditor-setting-form clearfix active"></div>');
                        var loadingText = $('<span />').html('Loading...');
                        settingForms.append(settingForm);
                        settingForm.append(loadingText);
                        
                        flog('Initializing setting form for component type "' + componentType + '"');
                        
                        var initFunction = componentData.initSettingForm.call(componentData, settingForm, self);
                        $.when(initFunction).done(function () {
                            flog('Initialized setting form for component type "' + componentType + '"');
                            
                            setTimeout(function () {
                                loadingText.remove();
                                
                                if (typeof componentData.showSettingForm === 'function') {
                                    flog('Show setting form of component type "' + componentType + '"');
                                    componentData.showSettingForm.call(componentData, settingForm, target, self);
                                } else {
                                    flog('"showSettingForm" function of component type "' + componentType + '" does not exist');
                                }
                            }, 100);
                        });
                    } else {
                        flog('"initSettingForm" function of component type "' + componentType + '" does not exist');
                    }
                } else {
                    if (typeof componentData.showSettingForm === 'function') {
                        flog('Show setting form of component type "' + componentType + '"');
                        componentData.showSettingForm.call(componentData, settingForm, target, self);
                    } else {
                        flog('"showSettingForm" function of component type "' + componentType + '" does not exist');
                    }
                    settingForm.addClass('active');
                }
            } else {
                self.setSettingContainer(target);
                self.setSettingComponent(null);
                
                body.find('#bfeditor-setting-title').html("Container Settings");
                
                var settingForm = body.find('#bfeditor-container-setting');
                if (typeof options.containerSettingShowFunction === 'function') {
                    flog('Show setting form of container');
                    options.containerSettingShowFunction.call(self, settingForm, target, self);
                } else {
                    flog('"containerSettingShowFunction" does not exist');
                }
                settingForm.addClass('active');
            }
            
            self.toggleSidebar(true);
            body.addClass('opened-bfeditor-setting');
        },
        
        hideSettingPanel: function () {
            flog('hideSettingPanel');
            
            var self = this;
            var options = self.options;
            var body = self.body;
            
            body.removeClass('opened-bfeditor-setting');
            
            var activeForm = body.find('#bfeditor-setting-forms').children('.active');
            if (activeForm.length > 0) {
                if (activeForm.is('#bfeditor-container-setting')) {
                    if (typeof options.containerSettingHideFunction === 'function') {
                        flog('Hide setting form of container');
                        options.containerSettingHideFunction.call(self, activeForm, self);
                    } else {
                        flog('"containerSettingHideFunction" does not exist');
                    }
                } else {
                    var activeType = activeForm.attr('data-type');
                    var componentData = BFEditor.components[activeType];
                    
                    if (typeof componentData.hideSettingForm === 'function') {
                        flog('Hide setting form of component type "' + activeType + '"');
                        componentData.hideSettingForm.call(componentData, activeForm, self);
                    } else {
                        flog('"hideSettingForm" function of component type "' + activeType + '" does not exist');
                    }
                }
                
                activeForm.removeClass('active');
            }
            
            body.removeClass('opened-bfeditor-setting');
            self.setSettingComponent(null);
            self.setSettingContainer(null);
        },
        
        getContentAreas: function (target) {
            flog('getContentAreas', target);
            
            var self = this;
            var options = self.options;
            var contentAreas;
            if (options.contentAreasSelector) {
                contentAreas = target.find(options.contentAreasSelector);
            }
            
            if (!contentAreas || contentAreas.length === 0) {
                flog('Do not find any content area. Creating default content area...');
                contentAreas = $('<div />');
                
                var originalContent = target.html();
                contentAreas.html(originalContent);
                target.empty().append(contentAreas);
            }
            
            return contentAreas;
        },
        
        initContentAreas: function (target) {
            flog('initContentAreas', target);
            
            var self = this;
            var contentAreas = self.getContentAreas(target);
            
            contentAreas.each(function () {
                var contentArea = $(this);
                if (!contentArea.attr('id')) {
                    contentArea.attr('id', self.generateId('content-area'));
                }
                
                self.initContentArea(contentArea);
                contentArea.data('bfeditor', self);
            });
        },
        
        initContentArea: function (contentArea) {
            flog('initContentArea', contentArea);
            
            var self = this;
            var options = self.options;
            var body = self.body;
            
            contentArea.addClass('bfeditor-content-area');
            
            flog('Initialize $.fn.droppable for content area');
            contentArea.droppable({
                accept: '.bfeditor-snippet[data-type=container]',
                tolerance: 'pointer',
                greedy: true
            });
            
            flog('Initialize $.fn.sortable for content area');
            contentArea.sortable({
                handle: '.btn-container-reposition',
                items: '> section',
                connectWith: '.bfeditor-content-area',
                axis: 'y',
                tolerance: 'pointer',
                sort: function () {
                    $(this).removeClass('ui-state-default');
                },
                receive: function (event, ui) {
                    flog('On received snippet', event, ui);
                    
                    var helper = ui.helper;
                    var item = ui.item;
                    
                    if (item.is('.bfeditor-snippet')) {
                        var snippetContent = body.find(item.attr('data-snippet')).html();
                        flog('Snippet content', snippetContent);
                        
                        var container = $(
                            '<section class="bfeditor-container">' +
                            '   <section class="bfeditor-container-inner">' + snippetContent + '</section>' +
                            '</section>'
                        );
                        helper.replaceWith(container);
                        
                        if (!container.hasClass('showed-bfeditor-toolbar')) {
                            $('.bfeditor-container.showed-bfeditor-toolbar').removeClass('showed-bfeditor-toolbar');
                            container.addClass('showed-bfeditor-toolbar');
                        }
                        
                        if (typeof options.onContainerSnippetDropped === 'function') {
                            options.onContainerSnippetDropped.call(contentArea, event, container, ui.item);
                        }
                        
                        self.initContainer(contentArea, container);
                    }
                    
                    self.hideSettingPanel();
                    
                    if (typeof options.onContentChanged === 'function') {
                        options.onContentChanged.call(contentArea, event);
                    }
                }
            });
            
            flog('Initialize existing containers in content area');
            contentArea.children('section').each(function () {
                self.convertToContainer(contentArea, $(this));
            });
            
            if (typeof options.onInitContentArea === 'function') {
                var contentData = options.onInitContentArea.call(contentArea, contentArea);
                if (contentData && contentData.length > 0) {
                    $.each(contentData, function () {
                        self.convertToContainer(contentArea, $(this));
                    });
                }
            }
        },
        
        convertToContainer: function (contentArea, target) {
            flog('convertToContainer', contentArea, target);
            
            var self = this;
            var isSection = target.is('section');
            var container;
            
            if (isSection) {
                target.addClass('bfeditor-container-inner');
                target.wrap('<section class="bfeditor-container"></section>');
                container = target.parent();
            } else {
                target.wrap('<section class="bfeditor-container"><section class="bfeditor-container-inner"></section></section>');
                container = target.parent().parent();
            }
            
            self.initContainer(contentArea, container);
        },
        
        initContainer: function (contentArea, container) {
            flog('initContainer', contentArea, container);
            
            var self = this;
            var options = self.options;
            
            if (!container.hasClass('bfeditor-initialized-container') || !container.hasClass('bfeditor-initializing-container')) {
                container.addClass('bfeditor-initializing-container');
                
                var settingBtn = '';
                if (options.containerSettingEnabled === true) {
                    settingBtn = '<a href="#" class="btn-container-setting">' + options.btnSettingContainerText + '</a>';
                }
                
                flog('Render BFEditor toolbar for container', container);
                container.append(
                    '<div class="bfeditor-toolbar bfeditor-toolbar-container">' +
                    '   <a href="#" class="btn-container-reposition">' + options.btnMoveContainerText + '</a>' + settingBtn +
                    '   <a href="#" class="btn-container-duplicate">' + options.btnDuplicateContainerText + '</a>' +
                    '   <a href="#" class="btn-container-delete">' + options.btnDeleteContainerText + '</a>' +
                    '</div>'
                );
                
                container.attr('id', self.generateId('container'));
                
                var containerContents = container.find('[data-type="container-content"]');
                // var containerContents = container.find('[class*="col"]');
                flog('Initialize ' + containerContents.length + ' container content(s)');
                containerContents.each(function () {
                    var containerContent = $(this);
                    
                    self.initContainerContent(contentArea, container, containerContent);
                });
                
                if (typeof options.onInitContainer === 'function') {
                    options.onInitContainer.call(contentArea, container);
                }
                
                container.addClass('bfeditor-initialized-container');
                container.removeClass('bfeditor-initializing-container');
            } else {
                if (container.hasClass('bfeditor-initialized-container')) {
                    flog('Container is already initialized!');
                } else {
                    flog('Container is initializing...');
                }
            }
        },
        
        initContainerContent: function (contentArea, container, containerContent) {
            flog('initContainerContent', contentArea, container, containerContent);
            
            var self = this;
            var options = self.options;
            var body = self.body;
            containerContent.addClass('bfeditor-container-content');
            containerContent.attr('id', self.generateId('container-content'));
            
            flog('Initialize $.fn.droppable for container content');
            containerContent.droppable({
                accept: '.bfeditor-snippet[data-type=component]',
                tolerance: 'pointer',
                greedy: true
            });
            
            flog('Initialize $.fn.sortable for container content');
            containerContent.sortable({
                scrollSpeed: 5,
                handle: '.btn-component-reposition',
                items: '> section',
                connectWith: '.bfeditor-container-content',
                tolerance: 'pointer',
                forcePlaceholderSize: true,
                sort: function () {
                    $(this).removeClass('ui-state-default');
                },
                receive: function (event, ui) {
                    flog('On received snippet', event, ui);
                    
                    var helper = ui.helper;
                    var item = ui.item;
                    var container;
                    
                    if (item.is('.bfeditor-snippet')) {
                        var snippetContentElement = body.find(item.attr('data-snippet'));
                        var snippetContent = snippetContentElement.html();
                        var componentType = item.attr('data-type');
                        flog('Snippet content', snippetContent);
                        
                        var dataAttributes = self.getDataAttributes(snippetContentElement, null, true);
                        var component = $(
                            '<section class="bfeditor-component" data-type="' + componentType + '" ' + dataAttributes.join(' ') + '>' +
                            '   <section class="bfeditor-component-content">' + snippetContent + '</section>' +
                            '</section>'
                        );
                        helper.replaceWith(component);
                        
                        container = component.closest('.bfeditor-container');
                        
                        if (typeof options.onComponentSnippetDropped === 'function') {
                            options.onComponentSnippetDropped.call(contentArea, event, component, ui.item);
                        }
                        
                        self.initComponent(contentArea, container, component);
                    } else {
                        container = item.closest('.bfeditor-container');
                    }
                    
                    if (!container.hasClass('showed-bfeditor-toolbar')) {
                        $('.bfeditor-container.showed-bfeditor-toolbar').removeClass('showed-bfeditor-toolbar');
                        container.addClass('showed-bfeditor-toolbar');
                    }
                    
                    if (typeof options.onContainerChanged === 'function') {
                        options.onContainerChanged.call(contentArea, event, container);
                    }
                    
                    if (typeof options.onContentChanged === 'function') {
                        options.onContentChanged.call(contentArea, event);
                    }
                }
            });
            
            flog('Initialize existing components inside container content');
            containerContent.children().each(function () {
                var content = $(this);
                
                self.convertToComponent(contentArea, container, content, true);
            });
        },
        
        convertToComponent: function (contentArea, container, target, isExisting) {
            flog('convertToComponent', contentArea, container, target, isExisting);
            
            var self = this;
            var isSection = target.is('section');
            var component;
            
            if (isSection) {
                target.addClass('bfeditor-component');
                target.wrapInner('<section class="bfeditor-component-content"></section>');
                component = target;
            } else {
                target.wrap('<section class="bfeditor-component"><section class="bfeditor-component-content"></section></section>');
                component = target.parent().parent();
            }
            
            if (isExisting) {
                component.addClass('existing-component');
            }
            
            self.initComponent(contentArea, container, component);
        },
        
        getDataAttributes: function (target, ignoreAttributes, isArray) {
            flog('getDataAttributes', target, ignoreAttributes, isArray);
            
            var dataAttributes = isArray ? [] : {};
            if (!ignoreAttributes) {
                ignoreAttributes = [];
            }
            
            $.each(target.get(0).attributes, function (i, attr) {
                if (attr.name.indexOf('data-') === 0 && $.inArray(attr.name, ignoreAttributes) === -1) {
                    if (isArray) {
                        dataAttributes.push(attr.name + '="' + attr.value + '"');
                    } else {
                        dataAttributes[attr.name] = attr.value;
                    }
                }
            });
            
            return dataAttributes;
        },
        
        getComponentType: function (component) {
            flog('getComponentType', component);
            
            var self = this;
            var options = self.options;
            
            var dataType = component.attr('data-type');
            var componentType = dataType ? dataType.replace('component-', '') : '';
            if (componentType && (componentType in BFEditor.components)) {
                return componentType;
            } else {
                if (componentType) {
                    flog('Component type "' + componentType + '" does not exist');
                } else {
                    flog('This component does not contain data-type attribute');
                }
                
                if (typeof options.defaultComponentType === 'string') {
                    componentType = options.defaultComponentType;
                } else if (typeof options.defaultComponentType === 'function') {
                    componentType = options.defaultComponentType.call(component, component);
                }
                
                if (!componentType) {
                    error('Component type is undefined!');
                }
                
                flog('Fallback to defaultComponentType: ' + componentType);
                return componentType;
            }
        },
        
        initComponent: function (contentArea, container, component) {
            flog('initComponent', contentArea, container, component);
            
            var self = this;
            var options = self.options;
            var body = self.body;
            
            if (!component.hasClass('bfeditor-initialized-component') || !component.hasClass('bfeditor-initializing-component')) {
                component.addClass('bfeditor-initializing-component');
                component.attr('id', self.generateId('component'));
                
                var componentContent = component.children('.bfeditor-component-content');
                componentContent.attr('id', self.generateId('component-content'));
                
                var componentType = self.getComponentType(component);
                flog('Component type: ' + componentType);
                componentOptions = "";
                if(componentType == "text") {
                    componentOptions = '   <a href="#" class="btn-component pull-left ctrl-select hide" title="Bold"><i class="fa fa-bold"></i></a>' +
                    '   <a href="#" class="btn-component pull-left ctrl-select hide" title="Italic"><i class="fa fa-italic"></i></a>' +
                    '   <a href="#" class="btn-component pull-left ctrl-select hide" title="Underline"><i class="fa fa-underline"></i></a>' +
                    '   <a href="#" class="btn-component pull-left ctrl-select hide" title="Strikethrough"><i class="fa fa-strikethrough"></i></a>' +
                    '   <a href="#" class="btn-component pull-left ctrl-select hide" title="Superscript"><i class="fa fa-superscript"></i></a>' +
                    '   <a href="#" class="btn-component pull-left ctrl-select hide" title="Subscript"><i class="fa fa-subscript"></i></a>' +
                    // '   <a href="#" class="btn-component pull-left" title="Text Height"><i class="fa fa-text-height"></i></a>' +
                    '   <span class="pull-left">|</span>' +
                    '   <a href="#" class="btn-component pull-left ctrl-both hide" title="Heading"><i class="fa fa-header"></i></a>' +
                    // '   <a href="#" class="btn-component pull-left" title="Font Name"><i class="fa fa-font"></i></a>' +
                    '   <a href="#" class="btn-component pull-left ctrl-both hide" title="Color"><i class="fa fa-paint-brush"></i></a>' +
                    '   <span class="pull-left">|</span>' +
                    '   <a href="#" class="btn-component pull-left ctrl-both hide" title="Clear"><i class="fa fa-eraser"></i></a>' +
                    '   <span class="pull-left">|</span>' +
                    '   <a href="#" class="btn-component pull-left ctrl-click hide" title="Left"><i class="fa fa-align-left"></i></a>' +
                    '   <a href="#" class="btn-component pull-left ctrl-click hide" title="Justify"><i class="fa fa-align-justify"></i></a>' +
                    '   <a href="#" class="btn-component pull-left ctrl-click hide" title="Center"><i class="fa fa-align-center"></i></a>' +
                    '   <a href="#" class="btn-component pull-left ctrl-click hide" title="Right"><i class="fa fa-align-right"></i></a>' +
                    '   <span class="pull-left">|</span>' +
                    '   <a href="#" class="btn-component pull-left ctrl-select hide" title="Link"><i class="fa fa-link"></i></a>' +
                    '   <a href="#" class="btn-component pull-left ctrl-select hide" title="Unlink"><i class="fa fa-unlink"></i></a>' +
                    '   <span class="pull-left">|</span>' +
                    '   <a href="#" class="btn-component pull-left ctrl-click hide" title="OL"><i class="fa fa-list-ol"></i></a>' +
                    '   <a href="#" class="btn-component pull-left ctrl-click hide" title="UL"><i class="fa fa-list-ul"></i></a>' +
                    '   <a href="#" class="btn-component pull-left ctrl-click hide" title="Table"><i class="fa fa-table"></i></a>' +
                    '   <span class="pull-left">|</span>' +
                    '   <a href="#" class="btn-component pull-left ctrl-click hide" title="Paragraph"><i class="fa fa-paragraph"></i></a>' +
                    '   <a href="#" class="btn-component pull-left ctrl-click hide" title="Button"><i class="fa fa-hand-pointer-o"></i></a>' +
                    '   <a href="#" class="btn-component pull-left ctrl-click hide" title="Icon"><i class="fa fa-smile-o"></i></a>' +
                    '   <a href="#" class="btn-component pull-left ctrl-click hide" title="Image"><i class="fa fa-image"></i></a>' +
                    // '   <a href="#" class="btn-component pull-left" title="Video"><i class="fa fa-video-camera"></i></a>' +
                    // '   <a href="#" class="btn-component pull-left" title="Map"><i class="fa fa-map-marker"></i></a>' +
                    '   <span class="pull-left">|</span>' +
                    '   <a href="#" class="btn-component pull-left" title="Undo"><i class="fa fa-undo"></i></a>' +
                    '   <a href="#" class="btn-component pull-left" title="Redo"><i class="fa fa-repeat"></i></a>' +
                    '   <span class="pull-left">|</span>';
                }
                
                var componentData = BFEditor.components[componentType];
                var isSettingEnabled = componentData.settingEnabled;
                var settingBtn = '';
                if (isSettingEnabled) {
                    settingBtn = '<a href="#" class="btn-component-setting">' + options.btnSettingComponentText + '</a>';
                }
                
                flog('Render BFEditor toolbar for component', component);
                component.append(
                    '<div class="bfeditor-toolbar bfeditor-toolbar-component">' +
                    componentOptions + 
                    settingBtn +
                    '   <a href="#" class="btn-component-reposition" title="Move">' + options.btnMoveComponentText + '</a>' + 
                    '   <a href="#" class="btn-component-duplicate" title="Duplicate">' + options.btnDuplicateComponentText + '</a>' +
                    '   <a href="#" class="btn-component-delete" title="Delete">' + options.btnDeleteComponentText + '</a>' +
                    '</div>'
                );
                
                var dynamicContentRequests = [];
                component.find('[data-dynamic-href]').each(function () {
                    var dynamicElement = $(this);
                    
                    dynamicContentRequests.push(self.initDynamicContent(dynamicElement));
                });
                
                $.when.apply(null, dynamicContentRequests).then(function () {
                    if (typeof componentData.init === 'function') {
                        componentData.init.call(componentData, contentArea, container, component, self);
                    } else {
                        body.removeClass('highlighted-container-content');
                        flog('"init" function of component type "' + componentType + '" does not exist');
                    }
                    
                    if (typeof options.onInitComponent === 'function') {
                        options.onInitComponent.call(contentArea, component);
                    }
                    
                    component.addClass('bfeditor-initialized-component');
                    component.removeClass('bfeditor-initializing-component');
                });
            } else {
                if (component.hasClass('bfeditor-initialized-component')) {
                    flog('Component is already initialized!');
                } else {
                    flog('Component is initializing...');
                }
            }
        },
        
        getClickedElement: function (event, selector) {
            var target = $(event.target);
            var closest = target.closest(selector);
            
            if (target.is(selector)) {
                return target;
            } else if (closest.length > 0) {
                return closest;
            } else {
                return null;
            }
        },
        
        initBFEditorClicks: function () {
            flog('initBFEditorClicks');
            
            var self = this;
            var options = self.options;
            var body = self.body;

            body.on('blur', '[contenteditable]', function(e) {
                if (typeof options.onContentChanged === 'function') {
                    options.onContentChanged.call(null, e);
                }
            });

            body.on('blur', function (e) {
                e.preventDefault();

                $('.ctrl-both').addClass('hide');
                $('.ctrl-select').addClass('hide');
                $('.ctrl-click').addClass('hide');
            });
            
            body.on('click', function (e) {

                var $selected = document.getSelection().toString();
                var $range = $selected.length;

                $('.ctrl-both').removeClass('hide');

                if($range) {
                    $('.ctrl-select').removeClass('hide');
                    $('.ctrl-click').addClass('hide');
                } else {
                    $('.ctrl-select').addClass('hide');
                    $('.ctrl-click').removeClass('hide');
                }

                var sidebar = self.getClickedElement(e, '#bfeditor-sidebar');
                
                var container = self.getClickedElement(e, '.bfeditor-container');
                if (container) {
                    flog('Click on .bfeditor-container', container);
                    
                    if (!container.hasClass('showed-bfeditor-toolbar')) {
                        body.find('.bfeditor-container.showed-bfeditor-toolbar').removeClass('showed-bfeditor-toolbar');
                        body.find('.bfeditor-component.showed-bfeditor-toolbar').removeClass('showed-bfeditor-toolbar');
                        container.addClass('showed-bfeditor-toolbar');
                        
                        var contentArea = container.parent();
                        if (typeof options.onContainerSelected === 'function') {
                            options.onContainerSelected.call(contentArea, e, container);
                        }

                        if (body.hasClass('opened-bfeditor-setting')) {
                       		// self.showSettingPanel(container);
                        }
                    }
                } else {
                    // if (!sidebar) {
                    //     body.find('.bfeditor-container.showed-bfeditor-toolbar').removeClass('showed-bfeditor-toolbar');
                    //     body.find('.bfeditor-component.showed-bfeditor-toolbar').removeClass('showed-bfeditor-toolbar');
                    //     body.removeClass('opened-bfeditor-setting');
                    // }
                }
                
                var component = self.getClickedElement(e, '.bfeditor-component');
                if (component) {
                    flog('Click on .bfeditor-component', component);
                    
                    if (!component.hasClass('showed-bfeditor-toolbar')) {
                        body.find('.bfeditor-component.showed-bfeditor-toolbar').removeClass('showed-bfeditor-toolbar');
                        component.addClass('showed-bfeditor-toolbar');
                        
                        var contentArea = component.parent();
                        if (typeof options.onComponentSelected === 'function') {
                            options.onComponentSelected.call(contentArea, e, component);
                        }
                    }
                } else {
                    if (!sidebar) {
                        body.find('.bfeditor-component.showed-bfeditor-toolbar').removeClass('showed-bfeditor-toolbar');
                    }
                }
            });

            body.delegate('.bfeditor-content-area .simple-text img', 'click', function (e) {
                var _this = $(this);
                // var image = prompt("Please enter Image URL", $(this).attr('src'));
                dpChooser('image', function(image) {
                    if(image) {
                        // var width = prompt("Please enter Image Width", $(this).css('width'));
                        width = "100%";
                        // var imageClass = prompt("Please enter Image Class", $(this).attr('class'));
                        imageClass = "img-rounded";

                        $(_this).attr('src', image);
                        $(_this).css({'width': width});
                        $(_this).attr('class', imageClass);
                    }
                });

            });
            
            
            body.on('click', '.btn-container-setting', function (e) {
                // console.log('btn-container-setting');
                e.preventDefault();
                
                var btn = $(this);
                flog('Click on .btn-container-setting', btn);
                
                var container = btn.closest('.bfeditor-container');
                if (body.hasClass('opened-bfeditor-setting') && body.hasClass('opened-bfeditor-sidebar')) {
                    if (!container.is(self.getSettingContainer())) {
                        self.showSettingPanel(container);
                    } else {
                        self.hideSettingPanel();
                    }
                } else {
                    self.showSettingPanel(container);
                }
            });
            
            body.on('click', '.btn-container-duplicate', function (e) {
                e.preventDefault();
                
                var btn = $(this);
                flog('Click on .btn-container-duplicate', btn);
                
                var container = btn.closest('.bfeditor-container');
                var contentArea = container.parent();
                var newContainer = $(self.getContainerContent(container));
                
                container.after(newContainer);
                self.convertToContainer(contentArea, newContainer);
                
                var snippetsList = body.find('#' + options.snippetsListId);
                var componentSnippets = snippetsList.find('.bfeditor-snippet[data-type^=component]');
                var currentLinkedContainerContents = componentSnippets.draggable('option', 'connectToSortable');
                componentSnippets.draggable('option', 'connectToSortable', currentLinkedContainerContents.add(newContainer.find('.bfeditor-container-content')));
                
                flog('Container is duplicated');
                
                if (typeof options.onContainerDuplicated === 'function') {
                    options.onContainerDuplicated.call(contentArea, container, newContainer);
                }
                
                if (typeof options.onContentChanged === 'function') {
                    options.onContentChanged.call(contentArea, e);
                }
            });
            
            body.on('click', '.btn-container-delete', function (e) {
                e.preventDefault();
                
                var btn = $(this);
                flog('Click on .btn-container-delete', btn);
                
                if (confirm('Are you sure that you want to delete this container? This action can not be undo!')) {
                    var container = btn.closest('.bfeditor-container');
                    var components = container.find('.bfeditor-component');
                    var contentArea = container.parent();
                    
                    if (typeof options.onBeforeContainerDeleted === 'function') {
                        options.onBeforeContainerDeleted.call(contentArea, e, container);
                    }
                    
                    var settingComponent = self.getSettingComponent();
                    if (settingComponent) {
                        var settingComponentParent = settingComponent.closest('.bfeditor-container');
                        if (settingComponentParent.is(container)) {
                            flog('Deleting container is container of setting container. Close setting panel for this setting component', settingComponent);
                            self.hideSettingPanel();
                        }
                    } else if (self.getSettingContainer().is(container)) {
                        flog('Deleting container is setting container. Close setting panel for this container', container);
                        self.hideSettingPanel();
                    }
                    
                    if (components.length > 0) {
                        components.each(function () {
                            self.deleteComponent($(this));
                        });
                    }
                    
                    container.remove();
                    
                    body.removeClass('opened-bfeditor-setting');
                    
                    if (typeof options.onContainerDeleted === 'function') {
                        options.onContainerDeleted.call(contentArea, e, container);
                    }
                    
                    if (typeof options.onContentChanged === 'function') {
                        options.onContentChanged.call(contentArea, e);
                    }
                }
            });
            
            body.on('click', '.btn-component-setting', function (e) {
                e.preventDefault();
                // console.log('btn-component-setting');
                
                var btn = $(this);
                flog('Click on .btn-component-setting', btn);
                
                var component = btn.closest('.bfeditor-component');
                if (body.hasClass('opened-bfeditor-setting') && body.hasClass('opened-bfeditor-sidebar')) {
                    // console.log('opened');
                    if (!component.is(self.getSettingComponent())) {
                        self.showSettingPanel(component);
                    } else {
                        self.hideSettingPanel();
                    }
                } else {
                    // console.log('closed');
                    self.showSettingPanel(component);
                }
            });
            
            body.on('click', '.btn-component-duplicate', function (e) {
                e.preventDefault();
                
                var btn = $(this);
                flog('Click on .btn-component-duplicate', btn);
                
                var component = btn.closest('.bfeditor-component');
                var container = component.closest('.bfeditor-container');
                var contentArea = container.parent();
                var newComponent = $(self.getComponentContent(component));
                
                component.after(newComponent);
                self.convertToComponent(contentArea, container, newComponent);
                
                flog('Component is duplicated');
                
                if (typeof options.onComponentDuplicated === 'function') {
                    options.onComponentDuplicated.call(contentArea, component, newComponent);
                }
                
                if (typeof options.onContainerChanged === 'function') {
                    options.onContainerChanged.call(contentArea, e, container);
                }
                
                if (typeof options.onContentChanged === 'function') {
                    options.onContentChanged.call(contentArea, e);
                }
            });
            
            body.on('click', '.btn-component-delete', function (e) {
                e.preventDefault();
                
                var btn = $(this);
                flog('Click on .btn-component-delete', btn);
                
                if (confirm('Are you sure that you want to delete this component? This action can not be undo!')) {
                    var component = btn.closest('.bfeditor-component');
                    var contentArea = component.closest('.bfeditor-content-area');
                    
                    if (typeof options.onBeforeComponentDeleted === 'function') {
                        options.onBeforeComponentDeleted.call(contentArea, e, component);
                    }
                    
                    if (self.getSettingComponent().is(component)) {
                        self.hideSettingPanel();
                    }
                    
                    self.deleteComponent(component);
                    
                    if (typeof options.onComponentDeleted === 'function') {
                        options.onComponentDeleted.call(contentArea, e, component);
                    }
                    
                    if (typeof options.onContainerChanged === 'function') {
                        options.onContainerChanged.call(contentArea, e, component);
                    }
                    
                    if (typeof options.onContentChanged === 'function') {
                        options.onContentChanged.call(contentArea, e);
                    }
                }
            });

            body.on('click', '.btn-component', function (e) {
                e.preventDefault();
                var $tag = $(this).attr('title').toLowerCase();
                var $element = document.getSelection().getRangeAt(0).commonAncestorContainer.parentNode;
                var $elementTag = document.getSelection().getRangeAt(0).commonAncestorContainer.parentNode.tagName;
                var $selected = document.getSelection().toString();
                var $range = $selected.length;
                // console.log('element', $($element).html());
                // console.log('selected', $selected);
                // console.log('range', $range);
                // console.log('selected', $elementTag);

                switch($tag) {
                    case 'color':
                        var color = "text-muted";
                        color = prompt("Please enter Color", color);
                        var html = "";
                        if(color === "text-muted" || color === "text-primary" || color === "text-info" || color === "text-success" || color === "text-warning" || color === "text-danger" || color === "text-black" || color === "text-white")
                            html = '<span class="' +color+ '">' +$selected+ '</span>';
                        else
                            html = '<span style="color:' +color+ ';">' +$selected+ '</span>';

                        if(color) {
                            if($range) {
                                // document.execCommand("insertHtml", false, html);
                                // IE <= 10
                                if (document.selection) {
                                    var range = document.selection.createRange();
                                        range.pasteHTML(html);
                                // IE 11 && Firefox, Opera .....
                                } else if(document.getSelection){
                                    var range = document.getSelection().getRangeAt(0);
                                    var nnode = document.createElement("span");
                                    range.surroundContents(nnode);
                                    if(color === "text-muted" || color === "text-primary" || color === "text-info" || color === "text-success" || color === "text-warning" || color === "text-danger" || color === "text-black" || color === "text-white")
                                        $(nnode).removeClass("text-muted").removeClass("text-primary").removeClass("text-info").removeClass("text-success").removeClass("text-warning").removeClass("text-danger").removeClass("text-black").removeClass("text-white").addClass(color).css({color:null});
                                    else
                                        $(nnode).css({color: color});
                                };
                            } else {
                                if(color === "text-muted" || color === "text-primary" || color === "text-info" || color === "text-success" || color === "text-warning" || color === "text-danger" || color === "text-black" || color === "text-white")
                                    $($element).removeClass("text-muted").removeClass("text-primary").removeClass("text-info").removeClass("text-success").removeClass("text-warning").removeClass("text-danger").removeClass("text-black").removeClass("text-white").addClass(color).css({color:null});
                                else
                                    $($element).css({color: color});
                            }
                        }
                    break;
                    case 'heading':
                        var heading = "H1";
                        heading = prompt("Please enter Heading", heading);
                        var html = "<" +heading+ ">" +$selected+ "</" +heading+ ">";

                        if(heading) {
                            if($range) document.execCommand("insertHtml", false, html);
                            else $($element).replaceWith("<" +heading+ ">" +$($element).html()+ "</" +heading+ ">");
                        }
                    break;
                    case 'left':
                        document.execCommand("justifyLeft", false, null);
                    break;
                    case 'justify':
                        document.execCommand("justifyFull", false, null);
                    break;
                    case 'center':
                        document.execCommand("justifyCenter", false, null);
                    break;
                    case 'right':
                        document.execCommand("justifyRight", false, null);
                    break;
                    case 'clear':
                        document.execCommand("removeFormat", false, null);
                    break;
                    case 'link':
                        var url = "http://www.website.com";
                        url = prompt("Please enter URL", url);

                        if(url) {
                            document.execCommand("createLink", false, url);
                        }
                    break;
                    case 'ol':
                        document.execCommand("insertOrderedList", false, null);
                    break;
                    case 'ul':
                        document.execCommand("insertUnorderedList", false, null);
                    break;
                    case 'table':
                        var row = prompt("Please enter Row#", 2);
                        var col = prompt("Please enter Col#", 3);
                        var tbody = "";

                        if(row && col) {
                            for(var r=0; r < parseInt(row); r++) {
                                tbody += "<tr>";
                                for(var c=0; c < parseInt(col); c++) {
                                    tbody += "<td></td>";
                                };
                                tbody += "</tr>";
                            };
                        }

                        var html =  '<table class="table table-bordered table-hover">' +tbody + '</table>';
                        document.execCommand("insertHTML", false, html);
                    break;
                    case 'paragraph':
                        var ipsum = [
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc mollis maximus arcu eget maximus. Aliquam erat volutpat. Quisque et ipsum augue. Pellentesque lobortis, libero quis bibendum blandit, dui erat egestas tellus, vitae pellentesque mauris turpis eget neque. Quisque sit amet ornare justo, ac pretium purus. Cras porttitor lorem quis massa congue finibus. Morbi sagittis dapibus leo, consequat maximus purus viverra sit amet. Ut gravida molestie nulla ac convallis. Nulla eget condimentum lorem. Donec sit amet vehicula leo, id tristique augue. Sed vehicula odio nibh, nec consequat elit lobortis eget.",
                            "Aenean nulla ante, tincidunt vitae leo eget, luctus aliquet nulla. Curabitur maximus, sem eu vestibulum dapibus, ex augue dictum ex, at consectetur est erat quis urna. Curabitur a sodales magna, et interdum nisl. Ut sit amet mauris egestas, maximus dolor fermentum, elementum est. Morbi ac sollicitudin lectus. Curabitur ac egestas ex. Curabitur at neque ante. Cras et tincidunt est. Suspendisse non elementum urna. Proin justo odio, sodales eget ipsum sed, egestas dictum turpis. Aenean eu dignissim massa, ac sagittis sapien. Sed sollicitudin volutpat elementum. Mauris ut semper lorem.",
                            "Duis id porta lacus. Nam ultrices consectetur neque, ac venenatis enim varius sed. Proin at porta sem. Pellentesque congue pretium efficitur. Phasellus neque nisi, luctus at justo quis, fermentum ultrices orci. Aliquam erat volutpat. Sed dignissim et tortor dictum blandit.",
                            "Sed vitae ornare nisl. Mauris pulvinar auctor eros, quis ultrices quam scelerisque ac. Maecenas vitae ex convallis, molestie urna a, pretium odio. Morbi in nibh sit amet velit finibus cursus a eget lectus. Suspendisse potenti. Donec in pretium augue. Vestibulum scelerisque accumsan venenatis.",
                            "Pellentesque lorem leo, tempor at massa a, hendrerit venenatis neque. Vivamus porttitor finibus dui ut suscipit. In id justo fringilla massa maximus lacinia. Nullam sit amet lectus magna. Integer tincidunt libero at orci vehicula iaculis. Vivamus porta orci est, nec gravida lorem laoreet a. Fusce laoreet mauris ac ex faucibus, id pretium velit tincidunt. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;",
                            "Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.",
                            "Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit."
                        ];
                        var paragraph = prompt("Please enter Paragraph", ipsum[Math.floor(Math.random()*ipsum.length)]);
                        var html = "<p>" +paragraph+ "</p>";
                        if(paragraph) {
                            document.execCommand("insertHtml", false, paragraph);
                        }
                    break;
                    case 'button':
                        var btnType = prompt("Please enter Type", "button");
                        var btnClass = prompt("Please enter Class", "btn btn-primary btn-lg");
                        var icon = prompt("Please enter Icon", "fa fa-plus");
                        var text = prompt("Please enter Text", "Add");
                        var link = prompt("Please enter Link", "http://www.website.com");
                        var onClick = prompt("Please enter ClickEvent", "return false;");

                        if(btnType) {
                            var html = '<button type="' +btnType+ '" href="' +link+ '" onclick="' +onClick+ '" class="' +btnClass+ '"><i class="' +icon+ '"></i> &nbsp;' +text+ '</button>';
                            document.execCommand("insertHtml", false, html);
                        }
                    break;
                    case 'icon':
                        var icon = "fa fa-smile-o";
                        icon = prompt("Please enter Icon", icon);

                        if(icon) {
                            var html = '<span class="' + icon + '"></span>';
                            // document.execCommand("insertHtml", false, html);
                            // IE <= 10
                            if (document.selection) {
                                var range = document.selection.createRange();
                                    range.pasteHTML(html);
                            // IE 11 && Firefox, Opera .....
                            } else if(document.getSelection){
                                var range = document.getSelection().getRangeAt(0);
                                var nnode = document.createElement("span");
                                range.surroundContents(nnode);
                                $(nnode).addClass(icon);
                            };
                        }
                    break;
                    case 'image':
                        dpChooser('image', function(image){
                            // var image = prompt("Please enter Image URL");
                            // var width = prompt("Please enter Image Width", "100%");
                            // var imageClass = prompt("Please enter Image Class", "img-thumbnail");
                            // var html = '<img src="' +image+ '" width="' +width+ '" class="' +imageClass+ '" />';
                            var width = "100%";
                            var imageClass = "img-rounded";

                            if(image) {
                                var html = '<img src="' +image+ '" width="' +width+ '" class="' +imageClass+ '" />';
                                // document.execCommand("insertHtml", false, html);
                                // IE <= 10
                                if (document.selection) {
                                    var range = document.selection.createRange();
                                        range.pasteHTML(html);
                                // IE 11 && Firefox, Opera .....
                                } else if(document.getSelection){
                                    var range = document.getSelection().getRangeAt(0);
                                    var nnode = document.createElement("img");
                                    range.surroundContents(nnode);
                                    $(nnode).prop('src', image);
                                    if(width) $(nnode).css({width: width});
                                    if(imageClass) $(nnode).attr('class', imageClass);
                                };
                            }
                        });
                    break;
                    default:
                        document.execCommand($tag, false, null);
                    break;
                }
                // console.log('btn-component', $(this).attr('title'));
            });
        },
        
        deleteComponent: function (component) {
            flog('deleteComponent', component);
            
            var self = this;
            
            var componentType = self.getComponentType(component);
            var componentData = BFEditor.components[componentType];
            if (typeof componentData.destroy === 'function') {
                componentData.destroy.call(componentData, component, self);
            } else {
                flog('"destroy" function of component type "' + componentType + '" does not exist');
            }
            
            component.remove();
        },
        
        initDynamicContent: function (dynamicElement) {
            flog('initDynamicContent', dynamicElement);
            
            var self = this;
            var options = self.options;
            var component = dynamicElement.closest('.bfeditor-component');
            var contentArea = dynamicElement.closest('.bfeditor-content-area');
            
            if (!dynamicElement.attr('id')) {
                dynamicElement.attr('id', self.generateId('dynamic-element'));
            }
            
            if (typeof options.onBeforeDynamicContentLoad === 'function') {
                options.onBeforeDynamicContentLoad.call(contentArea, dynamicElement, component);
            }
            
            var dynamicHref = dynamicElement.attr('data-dynamic-href');
            var data = self.getDataAttributes(component, ['data-type', 'data-dynamic-href'], false);
            data = $.param(data);
            flog('Dynamic href: ' + dynamicHref, 'Data: ' + data);
            
            return $.ajax({
                url: dynamicHref,
                data: data,
                type: 'GET',
                dataType: 'HTML',
                success: function (response, status, xhr) {
                    flog('Dynamic content is loaded', dynamicElement, response, status, xhr);
                    dynamicElement.html(response);
                    
                    if (typeof options.onDynamicContentLoaded === 'function') {
                        options.onDynamicContentLoaded.call(contentArea, dynamicElement, response, status, xhr);
                    }
                },
                error: function (response, status, xhr) {
                    flog('Error when loading dynamic content', dynamicElement, response, status, xhr);
                    
                    if (typeof options.onDynamicContentError === 'function') {
                        options.onDynamicContentError.call(contentArea, dynamicElement, response, status, xhr);
                    }
                }
            });
        },
        
        getComponentContent: function (component) {
            flog('getComponentContent', component);
            
            var self = this;
            var componentType = self.getComponentType(component);
            var componentData = BFEditor.components[componentType];
            var dataAttributes = self.getDataAttributes(component, null, true);
            var content;
            
            if (typeof componentData.getContent === 'function') {
                content = componentData.getContent.call(componentData, component, self);
            } else {
                flog('"getContent" function of component type "' + componentType + '" does not exist. Using default getContent method');
                var componentContent = component.children('.bfeditor-component-content');
                content = componentContent.html();
            }
            
            var tempDiv = $('<div />').html(content);
            tempDiv.find('[data-dynamic-href]').each(function () {
                $(this).html('');
            });
            content = tempDiv.html();
            
            return '<section ' + dataAttributes.join(' ') + '>' + content + '</section>';
        },
        
        getContainerContent: function (container) {
            flog('getContainerContent', container);
            
            var self = this;
            var options = self.options;
            var containerInner = container.children('.bfeditor-container-inner').clone();
            var containerId = containerInner.attr("id");
            var containerStyle = containerInner.attr("style");
            
            // containerInner.find('[data-type=container-content]').each(function () {
            containerInner.find('[class*="col"]').each(function () {
                var containerContent = $(this);
                containerContent.removeClass('bfeditor-container-content ui-droppable ui-sortable').removeAttr('id');
                
                containerContent.children('.bfeditor-component').each(function () {
                    var component = $(this);
                    
                    component.replaceWith(self.getComponentContent(component));
                });
            });

            if(containerId) containerId = 'id="' + containerId + '"';
                else containerId = "";
            if(containerStyle) containerStyle = "style='" + containerStyle + "'";
                else containerStyle = "";
            
            return '<section ' + containerId + ' ' + containerStyle + '>' + containerInner.html() + '</section>';
        }
        
    };
    
    // Plugin methods
    var methods = {
        __init: function (options) {
            return $(this).each(function () {
                var target = $(this);

                if (target.data('bfeditor')) {
                    flog('BFEditor will re-initialized!');
                    methods.destroy();
                }

                flog('Initialze BFEditor', target, options);
                var bfeditor = new BFEditor(target, options);
                target.data('bfeditor', bfeditor);
            });
        },

        destroy: function() {
            var target = $(this);
            var body = $('body');
            target.empty();
            $.removeData(target, 'bfeditor');
            body.removeClass('opened-bfeditor-sidebar');
            body.removeClass('initialized-snippets-list');
            $('#bfeditor-sidebar').remove();
            // $('.cke').remove();
        },
        
        getContent: function (inArray) {
            var target = $(this);
            var bfeditor = target.data('bfeditor');
            var options = bfeditor.options;
            var result = [];
            target = options.iframeMode ? bfeditor.body : target;
            
            target.find('.bfeditor-content-area').each(function () {
                var html = '';
                $(this).children('.bfeditor-container').each(function () {
                    var container = $(this);
                    
                    html += bfeditor.getContainerContent(container, options);
                });
                
                result.push(html);
            });
            
            return inArray ? result : result.join('\n');
        },
        
        getOptions: function () {
            var bfeditor = $(this).data('bfeditor');
            
            return bfeditor.options;
        }
    };
    
    // Export BFEditor
    $.bfeditor = BFEditor;
    
    // BFEditor plugins
    $.fn.bfeditor = function (method) {
        if (methods[method] && method !== 'init') {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.__init.apply(this, arguments);
        } else {
            error('Method ' + method + ' does not exist on $.fn.bfeditor');
        }
    };
    
})(jQuery);

