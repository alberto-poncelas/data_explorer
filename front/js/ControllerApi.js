var app = angular.module("MyApp", ["ngResource"])

app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }

]);



function createUrlQuery(data)
{
   var res = [];
   for (var i in data)
      res.push(encodeURIComponent(i) + "=" + encodeURIComponent(data[i]));
   return res.join("&");
}

function ControllerApi($scope, $http) {
    $scope.items = [];

    $scope.submit = function(){
        var callback = $scope.callback 
        var url= $scope.url
        url=url+'?'+createUrlQuery($scope.formData)

        $http.get(url).success(function(data){
            $scope.formData=data;
            eval(callback+'(data)')
        });
    }


    $scope.getJSON = function(id) {
        var url=document.getElementById(id).getAttribute("url")
        var callback=document.getElementById(id).getAttribute("callback")

        $http({method : 'GET',url : url})
            .success(function(data, status) {
                $scope.data = data;
                eval(callback+'(data)')
            })

    };
}
