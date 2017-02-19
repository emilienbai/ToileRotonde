(function () {

    angular
        .module('RotondeApp')
        .service('meanData', meanData);

    meanData.$inject = ['$http', 'authentication'];
    function meanData($http, authentication) {

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

            return {
                getProfile: getProfile,
                postReservations: postReservation
            };
        }

    }
    )();