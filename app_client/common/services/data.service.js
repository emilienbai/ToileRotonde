(function () {

    angular
        .module('RotondeApp')
        .service('meanData', meanData);

    meanData.$inject = ['$http', 'authentication', 'multipartForm'];
    function meanData($http, authentication, multipartForm) {

        var getProfile = function () {
            return $http.get('/api/profile', {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        };

        var postReservation = function (reservations) {
            return $http.post('/api/reservations',
                {
                    reservations: reservations
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + authentication.getToken()
                    }
                });
        };

        var postArticle = function (article){
            var url = '/api/article';
            return multipartForm.post(url, article, function (response) {
                if (response.status === 200) {
                    //todo party hard
                }
            });
        };

            return {
                getProfile: getProfile,
                postReservations: postReservation,
                postArticle: postArticle
            };
        }

    }
    )();