(function () {

    angular
        .module('RotondeApp')
        .controller('profileCtrl', profileCtrl);

    profileCtrl.$inject = ['authentication', 'meanData'];
    function profileCtrl(authentication, meanData) {
        var vm = this;
        vm.isAdmin = false;
        vm.isOrga = false;
        vm.sReservations = [];
        vm.articles = [];
        vm.reservations = [];

        vm.hasImage = function (article) {
            return (article.imageUrl != "");
        };

        vm.formatDate = function (reservation) {
            var temp = moment(reservation.dateIn).format('DD-MM-YYYY');
            if (reservation.dateOut != reservation.dateIn) {
                temp += " au " + moment(reservation.dateOut).format('DD-MM-YYYY');
                temp = "du " + temp;
            } else {
                temp = "le " + temp
            }
            return temp;
        };

        function onUserIsOrga (){
            vm.isOrga = true;

            //SSIAP Reservations
            var orgaID = authentication.currentUser().id;
            meanData.getReservationSSIAP(orgaID, false)
                .success(function (data) {
                    vm.sReservations = data;
                })
                .error(function (e) {
                    console.log(e);
                });

            //Articles
            meanData.getUserArticles(orgaID, false)
                .success(function (data) {
                    vm.articles = data;
                })
                .error(function (e) {
                    console.log(e);
                });



            //Hall Reservation
            meanData.getUserReservations(orgaID, false)
                .success(function (data) {
                    vm.reservations = data;
                })
                .error(function (e) {
                    console.log(e);
                });
        }

        function onUserIsAdmin (){
            vm.isAdmin = true;

            //SSIAP Reservations
            meanData.getPendingSSIAPReservation(false, false)
                .success(function (data) {
                    vm.sReservations = data;
                })
                .error(function (e) {
                    console.log(e);
                });

            //Articles
            meanData.getPendingArticles()
                .success(function (data) {
                    vm.articles = data;
                })
                .error(function (e) {
                    console.log(e);
                });
        }

        //User
        vm.user = {};
        meanData.getProfile()
            .success(function (data) {
                vm.user = data;
                if(vm.user.accountType == "OrgaINSA"){
                    onUserIsOrga();
                }
                if(vm.user.accountType == "admin"){
                    onUserIsAdmin();
                }
            })
            .error(function (e) {
                console.log(e);
            });
    }

})();