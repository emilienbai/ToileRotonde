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

            var getUserReservations = function (orgaID, archived) {
                var query = "";
                if (orgaID != null) {
                    query += "?orgaID=" + orgaID;
                    if (archived != null) {
                        query += "&archived=" + archived;
                    }
                } else if (archived != null) {
                    query += "?archived=" + archived;
                }

                return $http.get('/api/reservations'+query, {
                    headers: {
                        Authorization: 'Bearer ' + authentication.getToken()
                    }
                });
            };

            var getPendingReservations = function () {
                return $http.get('/api/reservations?archived=false',{
                    headers: {
                        Authorization: 'Bearer ' + authentication.getToken()
                    }
                });
            };

            var postReservationSSIAP = function (reservation) {
                return $http.post('/api/reservationSSIAP',
                    {
                        reservation: reservation
                    },
                    {
                        headers: {
                            Authorization: 'Bearer ' + authentication.getToken()
                        }
                    });
            };

            var archiveReservationSSIAP = function (reservation){
                return $http.put('/api/reservationSSIAP',
                    {
                        reservation: reservation
                    },
                    {
                        headers: {
                            Authorization: 'Bearer ' + authentication.getToken()
                        }
                    });
            };

            var getReservationSSIAP = function (orgaID, archived) {
                var query = "";
                if (orgaID != null) {
                    query += "?orgaID=" + orgaID;
                    if (archived != null) {
                        query += "&archived=" + archived;
                    }
                } else if (archived != null) {
                    query += "?archived=" + archived;
                }

                return $http.get('/api/reservationSSIAP'+query, {
                    headers: {
                        Authorization: 'Bearer ' + authentication.getToken()
                    }
                });
            };

            var getPendingSSIAPReservation = function(){
                return $http.get('/api/reservationSSIAP?archived=false', {
                    headers: {
                        Authorization: 'Bearer ' + authentication.getToken()
                    }
                });
            };

            var getUserArticles = function (orgaID, archived) {
                var query = "";
                if (orgaID != null) {
                    query += "?orgaID=" + orgaID;
                    if (archived != null) {
                        query += "&archived=" + archived;
                    }
                } else if (archived != null) {
                    query += "?archived=" + archived;
                }

                return $http.get('/api/article'+query, {
                    headers: {
                        Authorization: 'Bearer ' + authentication.getToken()
                    }
                });
            };

            var getPendingArticles = function (){
                return $http.get('/api/article?valid=false', {
                    headers: {
                        Authorization: 'Bearer ' + authentication.getToken()
                    }
                });
            };


            var postArticle = function (article) {
                var url = '/api/article';
                return multipartForm.post(url, article, function (response) {
                    if (response.status === 200) {
                        //todo party hard
                    }
                });
            };

            var postSlots = function (slots){
                return $http.post('/api/slot',
                {
                    slots: slots
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + authentication.getToken()
                    }
                });
            };

            var getSlots = function (from, to){
                return $http.get('/api/slot?from='+from+'&to='+to);
            };

            return {
                getProfile: getProfile,
                postReservations: postReservation,
                getUserReservations: getUserReservations,
                getPendingReservations: getPendingReservations,
                postArticle: postArticle,
                getUserArticles: getUserArticles,
                getPendingArticles: getPendingArticles,
                postReservationSSIAP: postReservationSSIAP,
                getReservationSSIAP: getReservationSSIAP,
                getPendingSSIAPReservation: getPendingSSIAPReservation,
                archiveReservationSSIAP: archiveReservationSSIAP,
                postSlots: postSlots,
                getSlots: getSlots
            };
        }

    })();