(function () {

    angular
        .module('RotondeApp')
        .controller('reservationsCtrl', reservationsCtrl)

    reservationsCtrl.$inject = ['$location', 'authentication', 'meanData'];
    function reservationsCtrl($location, authentication, meanData) {
        var vm = this;
        vm.minDate = new Date();
        vm.result = "";

        vm.reservations = {
            res : [newReservation()],
            light: 0,
            sound: 0,
            comments :"",
            orgaID: authentication.currentUser().id,
            orgaName: authentication.currentUser().name
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

        vm.onSubmit = function (){
            //todo check slots
            meanData.postReservations(vm.reservations)
                .error(function (err) {
                    //alert(err.message);
                    vm.result = "Erreur lors de l'enregistrement de votre réservation"
                })
                .then(function () {
                    vm.reservations = {
                        res : [newReservation()],
                        orgaID: authentication.currentUser().id,
                        orgaName: authentication.currentUser().name,
                        light: 0,
                        sound: 0,
                        comments :""
                    };
                    vm.result = "Votre/vos réservations ont été enregistrées avec succès. Un mail récapitulatif" +
                        " viens de vous être envoyé."
                });
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
                audience: false
            };
            return res;
        }
    };



})();

