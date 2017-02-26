(function () {

    angular
        .module('RotondeApp')
        .controller('planningCtrl', planningCtrl);

    planningCtrl.$inject = ['$scope', 'planningService'];
    function planningCtrl($scope, planningService) {

        $scope.events = [];
        $scope.clickedEvent = null;

        /* alert on eventClick */
        $scope.alertOnEventClick = function (date, jsEvent, view) {
            console.log(date);
            planningService.setClickedEvent(date);
        };

        /* Change View */
        $scope.changeView = function (view, calendar) {
            uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
        };
        /* Change View */
        $scope.renderCalender = function (calendar) {
            if (uiCalendarConfig.calendars[calendar]) {
                uiCalendarConfig.calendars[calendar].fullCalendar('render');
            }
        };

        planningService.getSlots("2016-02", "2018-02", function (data) {
            angular.copy(data, $scope.events);
        });

        /* config object */
        $scope.uiConfig = {
            calendar: {
                height: 500,
                editable: false,
                header: {
                    left: 'month agendaWeek',
                    center: 'title',
                    right: 'today prev,next'
                },
                locale: "fr",
                dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
                eventClick: $scope.alertOnEventClick,
                eventRender: $scope.eventRender
            }
        };

        /* event sources array*/
        $scope.eventSources = [$scope.events];
    }
})();