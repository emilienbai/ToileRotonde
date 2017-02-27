(function () {

    angular
        .module('RotondeApp')
        .controller('profileCtrl', profileCtrl);

    profileCtrl.$inject = ['$scope', 'authentication', 'meanData', 'planningService'];
    function profileCtrl($scope, authentication, meanData, planningService) {
        var vm = this;
        vm.isAdmin = false;
        vm.isOrga = false;
        vm.sReservations = [];
        vm.articles = [];
        vm.reservations = [];

        vm.clickedEvent = null;
        $scope.$watch(planningService.getClickedEvent, function (change) {
            vm.clickedEvent = change;
        });

        vm.formatEvent = function () {
            return planningService.formatEvent(vm.clickedEvent);
        };

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

        function onUserIsOrga() {
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

        function onUserIsAdmin() {
            vm.isAdmin = true;

            vm.addedSlots = [];

            /****************************************SSIAP Reservations************************************************/
            meanData.getPendingSSIAPReservation(false, false)
                .success(function (data) {
                    vm.sReservations = data;
                })
                .error(function (e) {
                    console.log(e);
                });

            vm.archiveSSIAPRes = function (res) {
                res.archived = true;
                meanData.archiveReservationSSIAP(res)
                    .success(function (data) {
                        for (let i = 0; i < vm.sReservations.length; i++) {
                            if (vm.sReservations[i]._id == res._id) {
                                vm.sReservations.splice(i, 1);
                            }
                        }
                    })
                    .error(function (e) {
                        console.log(e)
                    });
            };

            /************************************************Articles**************************************************/
            meanData.getPendingArticles()
                .success(function (data) {
                    vm.articles = data;
                })
                .error(function (e) {
                    console.log(e);
                });

            vm.validArticle = function (article){
                article.valid = true;
                meanData.editArticle(article)
                    .success(function(data){
                        for (let i = 0; i < vm.articles.length; i++) {
                            if (vm.articles[i]._id == article._id) {
                                vm.articles.splice(i, 1);
                            }
                        }
                    })
                    .error(function(e){
                        console.log(e.message)
                    })
            };

            /*************************************************Reservation**********************************************/
            meanData.getPendingReservations()
                .success(function (data) {
                    vm.reservations = data;
                })
                .error(function (e) {
                    console.log(e);
                });

            vm.addSlot = function (orgaID, orgaName, slotToAdd) {
                console.log(slotToAdd);
                var slots = [];

                function newSlot(slotDate, period) {
                    let s =
                        {
                            orgaID: orgaID,
                            orgaName: orgaName,
                            date: slotDate,
                            period: period,
                            audience: slotToAdd.audience
                        };
                    return s;
                }

                var startDate = moment(slotToAdd.dateIn).startOf('day');
                console.log("startDate: " + moment(startDate).format('DD-MM-YYYY-hh:mm:ss'));
                var endDate = moment(slotToAdd.dateOut).startOf('day');
                console.log("endDate: " + moment(endDate).format('DD-MM-YYYY-hh:mm:ss'));
                for (var date = moment(startDate); date.diff(endDate) <= 0; date.add(1, 'days')) {
                    console.log(moment(date).format('DD-MM-YYYY'));
                    var d = new Date(date.get("year"),
                        date.get("month"),
                        date.get("date"), 0, 0, 0, 0);
                    if (slotToAdd.morning) {
                        slots.push(newSlot(d, "morning"));
                    }
                    if (slotToAdd.afternoon) {
                        slots.push(newSlot(d, "afternoon"));
                    }
                    if (slotToAdd.evening) {
                        slots.push(newSlot(d, "evening"));
                    }
                }
                meanData.postSlots(slots)
                    .success(function (data) {
                        vm.addedSlots.push(slotToAdd._id);
                        planningService.addSlots(data);
                    })
                    .error(function (error) {
                        console.log(error.message);
                    })
            };

            vm.archiveReservation = function (reservation){
                reservation.archived = true;
                meanData.editReservation(reservation)
                    .success(function(data){
                        for (let i = 0; i< vm.reservations.length; i++){
                            if(reservation._id == vm.reservations[i]._id){
                                vm.reservations.splice(i, 1);
                                break;
                            }
                        }
                    })
                    .error(function(error){
                        console.log(error.message);
                    })
            };

            vm.onPlanning = function (slot) {
                for (let i = 0; i < vm.addedSlots.length; i++) {
                    if (vm.addedSlots[i] == slot._id) {
                        return true;
                    }
                }
                return false;
            };

        }

        /***************************************************User*******************************************************/
        vm.user = {};
        meanData.getProfile()
            .success(function (data) {
                vm.user = data;
                if (vm.user.accountType == "OrgaINSA") {
                    onUserIsOrga();
                }
                if (vm.user.accountType == "admin") {
                    onUserIsAdmin();
                }
            })
            .error(function (e) {
                console.log(e);
            });
    }

})();