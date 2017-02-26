(function () {

    angular
        .module('RotondeApp')
        .directive('planning', planning);

    function planning() {
        return {
            restrict: 'EA',
            templateUrl: '/common/directives/planning/planning.template.html',
            controller: 'planningCtrl as planvm'
        };
    }

})();