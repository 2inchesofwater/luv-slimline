
fetchComics.module('sitemapServiceId', [], function($comics) {
	$comics.factory('fetchComicsId', function() {
		var promise, sort;
		this.comics = function() {
		  if(!promise){
			promise = $http.get('http://ilikeluvcomics.com/admin/?q=json')
			.then(function(response){
			  return response.data.comics.reverse()
			})
		  }
		  return promise;
		};
	});
});


function sitemapController($scope, $http, fetchComicsId) {
	$scope.url = "test.com";
	$scope.callFetchComicsId = function() {
		$scope.comics = fetchComicsId();
		
	}  
}]);
