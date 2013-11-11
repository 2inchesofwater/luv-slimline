var comicsApp = angular.module('comicsApp', ['ngSanitize','ngRoute','ngAnimate', 'ngTouch'])

    .config(function($routeProvider, $locationProvider) {
     
    // configure html5 to get links working on jsfiddle
    $locationProvider.html5Mode(true);
    });
	
comicsApp.controller('comicsCtrl', ['$scope', '$http', 
  function comicsCtrl($scope, $http, $route, $routeParams, $location) {

    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
	
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

  $scope.swipeDirection = 'left';
  $scope.currentIndex = 0;
  $scope.comics = [];
  //$scope.comics.push({title: "Latest comic", edition:""});
  $scope.comicsLength = 0;
  $scope.siteBaseURL = "http://localhost/luv-slimline"
  $scope.sortFromLatest = true;
  $scope.xY = "";

//   /~luvcomic/testing/test/comics.json
//   /luv-slimline/test/comics.json
//http://bne-hawk.hostnetworks.com.au/~luvcomic/admin/?q=json

    $http.get('/luv-slimline/test/comics.json').success(function(data) {
      $scope.comics = data.comics;
	  $scope.comicsLength = $scope.comics.length || 0;
    });

    $scope.currentTitle = function() {
		return $scope.comics[$scope.currentIndex].title || "";
	}

    $scope.currentImage = function() {
		return $scope.comics[$scope.currentIndex].artwork || "";
	}

	$scope.currentThumbnail = function() {
		return $scope.comics[$scope.currentIndex].thumbnail;
	}

	$scope.currentSocial = function() {
		return $scope.comics[$scope.currentIndex].social;
	}
			
	$scope.currentBody = function() {
		return $scope.comics[$scope.currentIndex].notes;
	}

	$scope.currentScript = function() {
		return $scope.comics[$scope.currentIndex].script;
	}

	$scope.currentPath = function() {
		//return $scope.comics[$scope.currentIndex].path;
	}

	$scope.currentDate = function() {
		return $scope.comics[$scope.currentIndex].publication;
	}

	$scope.currentEdition = function() {
		return $scope.comics[$scope.currentIndex].edition;
	}
					
	$scope.currentTitle_Tag = function() {
		return $scope.comics[$scope.currentIndex].title + " | " + slogan;
	}

    $scope.currentTitleAndEdition = function() {
		if (!$scope.comics[$scope.currentIndex].title) return;
		return $scope.comics[$scope.currentIndex].title + "<span class='edition'><sup>#</sup>" + $scope.comics[$scope.currentIndex].edition + "</span>";
	}

	$scope.currentDesc = function() {
		var desc = $scope.currentBody();
		return encodeURI(desc);
	}
	



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
	$scope.sortFromLatest = false;  
  }

  $scope.btnlatest = function(){
	  var latest = [];
	  latest['index']=($scope.currentIndex==($scope.comicsLength - 1))?"reveal":"hidden";
	  return latest['index'];
  }
  $scope.btnnext = function(){
	  //older
	  var next = [];
	  next['index']=($scope.currentIndex< ($scope.comicsLength - 1))?"reveal":"hidden";
	  next['sort']=($scope.sortFromLatest)?"primary default":"";
	  return next['index'] + " " + next['sort'];
  }
  $scope.btnprev = function(){
	  //newer
	  var prev = [];
	  prev['index']=($scope.currentIndex>0)?"reveal":"hidden";
	  prev['sort']=(!$scope.sortFromLatest)?"primary default":"";
	  return prev['index'] + " " + prev['sort'];
  }
  $scope.btnstart = function(){
	  var start = [];
	  start['index']=($scope.currentIndex==0)?"reveal":"hidden";
	  return start['index'];
  }


        $scope.next = function () {
            $scope.swipeDirection = 'left';
            $scope.currentIndex = ($scope.currentIndex < $scope.comics.length - 1) ? ++$scope.currentIndex : 0;
			scrollToComicTop();
        }

        $scope.prev = function () {
            $scope.swipeDirection = 'right';
			/*if (options.continuous) slide(index-1);*/
            $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.comics.length - 1;
			scrollToComicTop();
        } 

        $scope.beginning = function () {
			$scope.sortFromLatest = false;
            $scope.currentIndex = ($scope.comicsLength - 1);
			scrollToComicTop();
        }

        $scope.latest = function () {
			$scope.sortFromLatest = true;
            $scope.currentIndex = 0;
			scrollToComicTop();
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

]);

  function searchCtrl($scope, $http) {

  };
  
  function pagesCtrl($scope, $http) {
	  
  };