// INITIALIZE THEME
var listItems
function initTheme() {
	// SHOPPING LIST
	var listOptions = {
		valueNames: [ 'Product', 'Price', 'Category' ],
		page: 6,
		pagination: true
	};
	if($('#shop').length) {
		listItems = new List('shop', listOptions);
		// listItems.show(2, listItems.items.length);
		// listItems.update();
		// console.log('listItems', listItems);

	}

	listCart();
}

// BUTTON CONTACT
$('body').delegate('#frm_contact', 'submit', function(e) {
	e.preventDefault();

	var url = "php/contact.php";
	var data = $(this).serialize();

	var button = $(this).find('button');
	$(button).prop('disabled', true);
	var inputs = $(this).find('input, textarea');

	$.ajax({
		type: "post", // post & get
		url: url,
		data: data,
		success: function(res) {
			$(button).prop('disabled', false);
			if(res == "success") {
				$(inputs).val("");

				console.log('success', res);
				toastr.success("Message Sent!", "Success");
			} else {
				$(button).prop('disabled', false);
				console.log('error', res);
				toastr.success("Server Error.. pls. try again", "Failed!");
			}
		},
		error: function(err) {
			$(button).prop('disabled', false);
			console.log('error', err);
			toastr.error("Server Error.. pls. try again", "Failed!");
		}
	});
});

// BUTTON CATEGORY
$('body').delegate('.btn-category', 'click', function(e) {
  e.preventDefault();

  var category = $(this).text();
  var search = $('.search');
  listItems.search(category);
  $(search).val(category);
});

// BUTTON SHOP
$('body').delegate('.add-to-cart', 'click', function(e) {
  e.preventDefault();

  var data = $(this).closest('.productinfo').data('record');
  var localDB = localStorage.getItem("eshopperItems");
  if(localDB) {
    localDB = JSON.parse(localDB);
  } else {
    var localDB = [];
  }
  
  localDB.push(data);
  localStorage.setItem("eshopperItems", JSON.stringify(localDB));

  toastr.success(data.Product + " was Added to Cart", "Success!");
});

// BUTTON CART DELETE
$('body').delegate('.cart_quantity_delete', 'click', function(e) {
  e.preventDefault();

  var id = $(this).data('index');
  var localDB = localStorage.getItem("eshopperItems");
  if(localDB) {
    localDB = JSON.parse(localDB);

    for(var i=0; i < localDB.length; i ++) {
      if(localDB[i]._id == id) {
        localDB.splice(i, 1);
      }
    }

    localStorage.setItem("eshopperItems", JSON.stringify(localDB));
    toastr.success("Item Removed", "Success!");

    listCart();
  }
})

// LIST CART
function listCart() {
  var cart = $('[data-custom-cart]');
  var item = $(cart).find('[data-item]');
  var localDB = localStorage.getItem("eshopperItems");
  $(cart).html("");
  $(cart).append(item);

  if(localDB && cart.html() && item.html()) {
    localDB = JSON.parse(localDB);
    $.each(localDB, function(index, itm) {
      var clone = $(item).clone();
      clone.removeClass("hide");
      var html = clone.html();
      $.each(itm, function(key, value) {
        html = html.replace("((" + key + "))", value);
      });
      $(cart).append("<tr>"+html+"</tr>");
    });
  }
}
