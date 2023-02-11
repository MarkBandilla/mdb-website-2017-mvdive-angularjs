function themeInit() {
  // console.log('themeInit');

  // alert('hello');

  //initialize swiper when document ready  
  var mySwiper = new Swiper ('.swiper-container', {
    autoplay: 0,
    loop: 1,
    speed: 1000,
    center: 0,
    slidesPerView: 1,
    pagination: '.swiper-pagination',
    paginationClickable: true,
    nextButton: '.swiper-arrow-right',
    prevButton: '.swiper-arrow-left',
  }) 
  
  // Sticker
  $(window).scroll(function () {
    // set distance user needs to scroll before we fadeIn sticker
    if ($(this).scrollTop() > 600) {
      $('#StickyMenu').addClass('sticky');
      $('#StickyMenu .logo').removeClass('hide');
    } else {
      $('#StickyMenu').removeClass('sticky');
      $('#StickyMenu .logo').addClass('hide');
    }
  });

  // COLLECTIONS
  function getDB(name) {
    for(var i = 0; i < database.db.length; i ++) {
      if(database.db[i].name === name) {
        return database.db[i];
      }
    }
  }
  $.each($('[data-collection]'), function() {
    var dbname = $(this).data('collection');
    var db = getDB(dbname);
    var list = $(this);
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
    

    var list = new List(id, options, data);

  });
  
  // video background
  // var vid = document.getElementById("bgvid");
  // var pauseButton = document.querySelector("#polina button");

  // if (window.matchMedia('(prefers-reduced-motion)').matches) {
  //     vid.removeAttribute("autoplay");
  //     vid.pause();
  //     pauseButton.innerHTML = "Paused";
  // }

  // function vidFade() {
  //   vid.classList.add("stopfade");
  // }

  // vid.addEventListener('ended', function()
  // {
  //   // only functional if "loop" is removed 
  //   vid.pause();
  //   // to capture IE10
  //   vidFade();
  // }); 
  
  $wHeight = $(window).height();
  $('.fullscreen').height($wHeight - 62);


  $('#frm_reservation').on('submit', function(e) {
    e.preventDefault();
    
    var data = $(this).serialized();
    console.log('frm_reservation', data);

    $.ajax({
      type: 'post',
      url: 'php/contact.php',
      data: data,
      success: function(res) {
        console.log('success', res);
      },
      error: function(err) {
        console.log('error', err);
      }
    });
  });

} themeInit();


$(window).on('resize', function (){
  $wHeight = $(window).height();
  $('.fullscreen').height($wHeight - 62);
});

// SECTION FUNCTIONS
$('body').delegate('#frm-subscribe', 'submit', function(e) {
  // console.log('frm-subscribe');

  e.preventDefault();
  var db = database.db[2].collections;
  var input = $(this).find('[type="email"]');
  var email = $(input).val();
  if(db.length) var id = db[db.length - 1]._id + 1;
  else var id = 0;

  var data = { "_id": id, "Email": email };
  db.push(data);
  // console.log(data);

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
        $(input).val("");  
        toastr.success('Subscription Complete', 'Success!');
      }
    },
    error: function(error) {

    }
  });
});