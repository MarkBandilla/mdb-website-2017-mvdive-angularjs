// module
var app = angular.module('myApp', ['ui.router','ngSanitize']);

// controller
app.controller('myCtrl', ['$scope', '$location', '$timeout', '$anchorScroll', function($scope, $location, $timeout, $anchorScroll) {
	$scope.pages = database.pages;
	$scope.$watch('pages', function() {
		$.each($scope.pages, function(key, value) {	
			var template = "<div>" + value.template + "</div>";
			var sections = $(template).find('section');

			$.each(sections, function() {
				var id = $(this).attr('id');
				if(id) {
					if(!$scope.pages[key].sub)
						$scope.pages[key].sub = [];
					var link = $scope.pages[key].link + '#' + id;
					$scope.pages[key].sub.push({label: id, link: link});
				}
			});
			//console.log($scope.pages[key].label, $scope.pages[key].sub);
		});
	});
	$scope.scrollTo = function(id) {
		// console.log($location.hash(), id);
		$location.hash(id);
		$anchorScroll();
    }
    $scope.reserved = false;
    $scope.reserve = function(data) {
    	data.subject = "Reservation:" + data.fullname;
    	console.log('reserve', data);

	    $.ajax({
	      type: 'post',
	      url: 'php/contact.php',
	      data: data,
	      success: function(res) {
	      	$scope.reserved = true;
	      	$scope.$apply();
	        console.log('success', res);
	      },
	      error: function(err) {
	        console.log('error', err);
	      }
	    });
    }
	$scope.$on('$viewContentLoaded', function(){
		// initialize theme
		$timeout(function() {
			themeInit();
			
			$('[data-force-show]').attr('style', '');
			$.each($('.menu > ul > li > a'), function() {
				if($(this).attr('href') === "#" + $location.$$path) {
					$(this).closest('li').addClass('active');
				} else {
					$(this).closest('li').removeClass('active');
				}
			});			
		}, 0);
  	});
  	$scope.getDBCollection = function(name) {
  		for(var i = 0; i < database.db.length; i ++) {
	      if(database.db[i].name === name) {
	        return database.db[i].collections;
	      }
	    }
  	}
  	$scope.testimonials = $scope.getDBCollection("Testimonials");
  	$scope.partners = $scope.getDBCollection("Partners");

}]);

// route
app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
		.state('page', {
			url: '/:page/:id', 
            params: { 
              id: {value: null, squash: true} 
            },
			template: function($stateParams) {
				console.log('page', $stateParams);
				if(!$stateParams.page) {
					var found 		= false;
					var current 	= {};

					$.each(database.pages, function(key, page) {
						if(page.link === 'home') {
							found = true;
							current = page;
						}
					});
				} else {
					var found 		= false;
					var current 	= {};

					$.each(database.pages, function(key, page) {
						if(page.link === $stateParams.page) {
							found = true;
							if(page.type == "view" && $stateParams.id) current = page;
							else if(page.type === undefined && $stateParams.id === null) current = page;
						}
					});
				}

				if(!found) {
					return 	'<div ng-include="\'template/404.html\'"></div>';
				} else return current.template;
			},
			controllerProvider: function($stateParams) {
				return ["$stateParams", "$scope", "$compile", "$sce", function($stateParams, $scope, $compile, $sce) {
					$scope.message = 'Hello from controller';
					$scope.getDBCollection = function(name) {
			  		for(var i = 0; i < database.db.length; i ++) {
				      if(database.db[i].name.toLowerCase() === name) {
				        return database.db[i].collections;
				      }
				    }
			  	}
					if($stateParams.id) {
						var collections = $scope.getDBCollection($stateParams.page);
						for(var i = 0; i < collections.length; i ++) {
							if(collections[i]._id == $stateParams.id) {
								var collection = collections[i];
								$.each(collection, function(key, value) {
									var html = /<(?=.*? .*?\/ ?>|br|hr|input|!--|wbr)[a-z]+.*?>|<([a-z]+).*?<\/\1>/i.test(value);
									// console.log(html, key, value);

									if(html) {
										var expression = "{{"+key+"}}";
										var parent = $('*').filter(function(index) { return $(this).text() === expression; });
										$(parent).html("");
										$(parent).attr("ng-bind-html", key);
										$compile($(parent).parent().contents())($scope);
										$scope[key] = $sce.trustAsHtml(value);
									}
									else $scope[key] = value;
								});
							}
						}
					}
				}]
			}
  	})
  }]);