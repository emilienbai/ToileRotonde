(function () {

    angular
        .module('RotondeApp')
        .service('planningService', planning);

    planning.$inject = ['meanData'];
    function planning(meanData) {

        var events = [];
        var clickedEvent = null;

        var stringToColour = function (str) {
            var hash = 0;
            for (let i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 5) - hash);
            }
            var colour = '#';
            for (let i = 0; i < 3; i++) {
                var value = (hash >> (i * 8)) & 0xFF;
                colour += ('00' + value.toString(16)).substr(-2);
            }
            return colour;
        };

        var updateEvents = function (data) {
            events = [];
            for (var i = 0; i < data.length; i++) {
                var date = new Date(data[i].date);
                var d = date.getDate();
                var m = date.getMonth();
                var y = date.getFullYear();
                var start;
                var end;
                if (data[i].period == "morning") {
                    start = new Date(y, m, d, 8, 0);
                    end = new Date(y, m, d, 13, 0);
                } else if (data[i].period == "afternoon") {
                    start = new Date(y, m, d, 13, 0);
                    end = new Date(y, m, d, 18, 0);
                } else if (data[i].period == "evening") {
                    start = new Date(y, m, d, 18, 0);
                    end = new Date(y, m, d, 23, 59);
                }
                var name = data[i].orgaName;
                if (data[i].audience) {
                    name = "*" + name + "*";
                }
                events.push({
                    id: data[i]._id,
                    title: name,
                    start: start,
                    end: end,
                    allDay: false,
                    color: stringToColour(data[i].orgaID),
                    audience: data[i].audience,
                    orgaName: data[i].orgaName,
                    period: data[i].period
                });
            }
            return events;
        };

        var getSlots = function (from, to, callback) {
            meanData.getSlots(from, to)
                .success(function (data) {
                    callback(updateEvents(data));
                })
                .error(function (error) {
                    console.log(error.message);
                    callback(null);
                })
        };

        var addSlots = function (slots) {

        };

        var removeSlot = function (slotId) {

        };

        var setClickedEvent = function (event) {
            clickedEvent = event;
        };

        var getClickedEvent = function (event) {
            return clickedEvent;
        };

        var formatEvent = function (event) {
            if (event == null) return;
            let res = {};
            res.date = moment(event.start).format("DD-MM-YYYY");
            res.audience = event.audience ? "oui" : "non";
            res.period = (event.period == "morning") ? "Matin" : ((event.period == "afternoon") ? "Après-midi" : "Soirée")
            return res;
        };

        return {
            getSlots: getSlots,
            addSlots: addSlots,
            removeSlot: removeSlot,
            setClickedEvent: setClickedEvent,
            getClickedEvent: getClickedEvent,
            formatEvent: formatEvent
        }
    }
})();