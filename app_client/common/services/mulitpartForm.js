(function () {

    angular
        .module('RotondeApp')
        .service('multipartForm', multipartForm);

    multipartForm.$inject = ['$http', 'authentication'];
    function multipartForm($http, authentication) {
        this.post = function(uploadUrl, data, callback){
            var fd = new FormData();
            for(var key in data){
                fd.append(key, data[key]);
            }

            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined,
                    'Authorization': 'Bearer ' + authentication.getToken()}
            }).then(
                function(response){
                   callback(response);
                },
                function(response){
                    callback(response);
                }
            );
        }

    }

})();