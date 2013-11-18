var comicsApp = angular.module('comicsApp', ['ngSanitize','ngRoute','ngAnimate', 'ngTouch']);

comicsApp.config(function($locationProvider, $routeProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider
    .when('/~luvcomic/test/', {
      templateUrl: '/~luvcomic/test/partials/comic.html', 
      controller: 'comicsCtrl'
    })
    .when('/~luvcomic/test/:comicAlias', {
      templateUrl: '/~luvcomic/test/partials/comic.html', 
      controller:  'comicsCtrl'
    })
    .otherwise({ redirectTo: '/~luvcomic/test/' });
});

function MainCtrl($route, $routeParams, $location) {
  this.$route = $route;
  this.$location = $location;
  this.$routeParams = $routeParams;
}


comicsApp.service('comicsService', function($http) {
    var promise, sort;
    this.comics = function() {
      if(!promise){
        promise = $http.get('http://bne-hawk.hostnetworks.com.au/~luvcomic/admin/?q=json')
        .then(function(response){
          return response.data.comics.reverse()
        })
      }
      return promise;
    };
    this.setSortFromLatest = function(bool){
      sort = bool;
    };
    this.sortFromLatest = function(){
      return sort;
    };
});

function comicsCtrl($scope, $http, $routeParams, $route, $location, comicsService) {

  options = {startSlide:0,speed:300,continuous:false,slogan:"LUV Comics - Geeks. Dating. Music. Zombies. Comics by Sally Browne and Dan Gilmore"};
  var speed = options.speed || 300;
  var continuous = options.continuous !== undefined ? options.continuous : true;
  var slogan = options.slogan;
  
    // check browser capabilities
  var browser = {
    addEventListener: !!window.addEventListener,
    touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
    transitions: (function(temp) {
      var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
      for ( var i in props ) if (temp.style[ props[i] ] !== undefined) return true;
      return false;
    })(document.createElement('swipe'))
  };

  if(typeof comicsService.sortFromLatest() == 'undefined')
    {comicsService.setSortFromLatest(true)};
  $scope.swipeDirection = 'left';
  $scope.comics = [];
  $scope.comics.push({title: "Latest comic"});
  $scope.comicsLength = 0;
  $scope.siteBaseURL = "http://bne-hawk.hostnetworks.com.au/~luvcomic"

  $scope.xY = "";


//   /~luvcomic/testing/test/comics.json
//   /luv-slimline/test/comics.json
//http://bne-hawk.hostnetworks.com.au/~luvcomic/admin/?q=json

   //  $http.get('http://bne-hawk.hostnetworks.com.au/~luvcomic/admin/?q=json').success(function(data) {
   //    $scope.comics = data.comics;
	  // $scope.comicsLength = $scope.comics.length || 0;
   //  });

  comicsService.comics().then(function(data) {
    $scope.comics = data;
    console.log($scope.comics);
    $scope.comicsLength = $scope.comics.length || 0;

    if($routeParams.comicAlias){
      $scope.currentIndex = $scope.comics.map(function(e){
        return e.alias
      }).indexOf($routeParams.comicAlias);
    } else {
      $scope.currentIndex = $scope.comicsLength - 1;
    }

    $scope.currentComic = $scope.comics[$scope.currentIndex];
    document.title = $scope.currentComic.title + " | " + slogan;
    
    if ($scope.currentComic.title == "") {
      $scope.currentComic.TitleAndEdition = ""
    } else {
      $scope.currentComic.TitleAndEdition = $scope.currentComic.title + "<span class='edition'><sup>#</sup>" + $scope.currentComic.edition + "</span>"; 
    };

  });


/*  $scope.setCurrentSlideIndex = function (index) {
      $scope.swipeDirection = (index > $scope.currentIndex) ? 'left' : 'right';
      $scope.currentIndex = index;
  }

  $scope.isCurrentSlideIndex = function (index) {
      return $scope.currentIndex === index;
  }
*/

  $scope.reverseObject = function() {
    $scope.comics;
    comicsService.setSortFromLatest(false);
  }

  $scope.btnlatest = function(){
	  return ($scope.currentIndex==0)?"reveal":"hidden";
  }
  $scope.btnnext = function(){
	  //older
	  var next = [];
	  next['index']=($scope.currentIndex > 0)?"reveal":"hidden";
	  next['sort']=(comicsService.sortFromLatest())?"primary default":"";
	  return next['index'] + " " + next['sort'];
  }
  $scope.btnprev = function(){
	  //newer
	  var prev = [];
	  prev['index']=($scope.currentIndex<($scope.comicsLength - 1))?"reveal":"hidden";
	  prev['sort']=(!comicsService.sortFromLatest())?"primary default":"";
	  return prev['index'] + " " + prev['sort'];
  }
  $scope.btnstart = function(){
	  return ($scope.currentIndex==($scope.comicsLength - 1))?"reveal":"hidden";
  }


  $scope.next = function () {
    $scope.swipeDirection = 'left';
    // $scope.currentIndex = ($scope.currentIndex < $scope.comics.length - 1) ? ++$scope.currentIndex : 0;
    var newIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.comics.length - 1;
    scrollToComicTop();
    $location.path('/~luvcomic/test/' + $scope.comics[newIndex].alias);
  }

  $scope.prev = function () {
    $scope.swipeDirection = 'right';
    /*if (options.continuous) slide(index-1);*/
    // $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.comics.length - 1;
    var newIndex = ($scope.currentIndex < $scope.comics.length - 1) ? ++$scope.currentIndex : 0;
    scrollToComicTop();
    $location.path('/~luvcomic/test/' + $scope.comics[newIndex].alias);
  }

  $scope.beginning = function () {

    comicsService.setSortFromLatest(false);
    scrollToComicTop();
    $location.path('/~luvcomic/test/' + $scope.comics[0].alias);

  }

  $scope.latest = function () {
    comicsService.setSortFromLatest(true);
    var newIndex = ($scope.comicsLength - 1);
    scrollToComicTop();
    $location.path('/~luvcomic/test/' + $scope.comics[newIndex].alias);
  }
		
$('#comic .slide').bind('touchmove',function(e){
      e.preventDefault();
      var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
      var elm = $(this).offset();
      var x = touch.pageX - elm.left;
      if(x < $(this).width() && x > 0){
		  //CODE GOES HERE
		  $scope.xY = touch.pageY+' '+touch.pageX;
		  return $scope.xY;
      }
});
	
  function scrollToComicTop() {
	  var completeCalled = false;
	$("html, body").animate(
		{ scrollTop: 0, easing:"easeInOut" },
		{
			complete : function(){
				if(!completeCalled){
					completeCalled = true;
				}
			}
		}
	);
  }

	
  function slide(to, slideSpeed) {

    // do nothing if already on requested slide
    if (index == to) return;
    
    if (browser.transitions) {

      var direction = Math.abs(index-to) / (index-to); // 1: backward, -1: forward


      var diff = Math.abs(index-to) - 1;

      // move all the slides between index and to in the right direction
      while (diff--) move( circle((to > index ? to : index) - diff - 1), width * direction, 0);
            
      to = circle(to);

      move(index, width * direction, slideSpeed || speed);
      move(to, 0, slideSpeed || speed);

    } else {     
      
      to = circle(to);
      animate(index * -width, to * -width, slideSpeed || speed);
      //no fallback for a circular continuous if the browser does not accept transitions
    }

    index = to;
    offloadFn(options.callback && options.callback(index, slides[index]));
  }
	
	
	
  } //end ComicsCtrl

  function searchCtrl($scope, $http) {

  };
  
  function pagesCtrl($scope, $http) {
	  
  };