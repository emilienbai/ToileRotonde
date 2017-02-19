(function () {
    angular
        .module('RotondeApp')
        .controller('reservationSSIAPCtrl', reservationSSIAPCtrl);

    reservationSSIAPCtrl.$inject = ['authentication', 'meanData'];
    function reservationSSIAPCtrl(authentication, meanData) {
        var vm = this;

        vm.reservation = {
            name:"",
            dateIn: new Date(),
            dateOut: new Date(),
            timeOpening: "",
            timeStart: "",
            duration: "",
            comment: "",
            orgaID: authentication.currentUser().id,
            orgaName: authentication.currentUser().name
        };

        vm.multipleDates = false;
        vm.minDate = new Date();

        vm.updateDateOut = function() {
            if (vm.reservation.dateOut < vm.reservation.dateIn){
                vm.reservation.dateOut = vm.reservation.dateIn;
            }
        };

        vm.onSubmit = function () {
            meanData.postReservationSSIAP(vm.reservation, function (response) {
                if(response.status === 200){
                    //todo party if success
                } else{
                    //todo cry in the corner
                }
            })
        };
    }

})();