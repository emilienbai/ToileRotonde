(function () {

    angular
        .module('RotondeApp')
        .controller('reservationsCtrl', reservationsCtrl)

    reservationsCtrl.$inject = ['$location', 'authentication'];
    function reservationsCtrl($location, authentication) {
        var vm = this;
        vm.minDate = new Date();
        vm.reservations = {
            res : [newReservation()],
            light: 0,
            sound: 0,
            comments :""
        };

        vm.addReservation = function() {
            vm.reservations.res.push(newReservation());
        };

        vm.removeReservation = function() {
          vm.reservations.res.pop();
        };

        vm.formatDate = function(reservation){
            let value ="";
            let din = reservation.dateIn;
            value = moment(din).format('DD-MM-YYYY')

            if(reservation.isRange) {
                let dout = reservation.dateOut;
                value += " au " + moment(dout).format('DD-MM-YYYY');
            }
            return value;
        };

        vm.updateDateOut = function (reservation){
            if (reservation.dateOut < reservation.dateIn){
                reservation.dateOut = reservation.dateIn;
            }
        };

        vm.emptySlots = function (reservation) {
            return (reservation.morning || reservation.afternoon || reservation.evening)
        };

        function newReservation(){
            var res = {
                name:"",
                isRange: false,
                dateIn: new Date(),
                dateOut: new Date(),
                morning: false,
                afternoon: false,
                evening: false,
                audience: false,
                orgaID: authentication.currentUser().id,
                orgaName: authentication.currentUser().name
            }
            return res;
        }

    };



})();

