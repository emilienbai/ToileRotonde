(function () {
    angular
        .module('RotondeApp')
        .controller('addArticleCtrl', addArticleCtrl);

    addArticleCtrl.$inject = ['authentication', 'meanData'];
    function addArticleCtrl(authentication, meanData) {
        var vm = this;

        vm.multipleDates = false;
        vm.minDate = new Date();

        vm.article = {
            name: "",
            dateIn: new Date(),
            dateOut: new Date(),
            time: "",
            text:"",
            orgaID: authentication.currentUser().id,
            orgaName: authentication.currentUser().name
        };

        vm.updateDateOut = function() {
            if (vm.article.dateOut < vm.article.dateIn){
                vm.article.dateOut = vm.article.dateIn;
            }
        };

        vm.onSubmit = function () {
            meanData.postArticle(vm.article, function (response) {
                if(response.status === 200){
                    //todo party if success
                } else{
                    //todo cry in the corner
                }
            })
        };
    }

})();