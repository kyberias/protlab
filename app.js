var app = angular.module('protlabApp', ['localytics.directives'])
    .service('solutionsService', function () {
        var solutions = [
        { code: 'P1', description: '10 proteins', volume: 0.2, solutes: [
            { name: 'A', pI: 6.5, mW: 12, multipl: 4,  precipitationSaltConcentration: 45 },
            { name: 'B', pI: 9.3, mW: 23.5, multipl: 1, precipitationSaltConcentration: 35 },
            { name: 'C', pI: 8.0, mW: 43.5, multipl: 2, precipitationSaltConcentration: 70 },
            { name: 'D', pI: 5.5, mW: 77, multipl: 1, precipitationSaltConcentration: 50 },
            { name: '1', pI: 7.2, mW: 7, multipl: 8, precipitationSaltConcentration: 65 },
            { name: '2', pI: 6.5, mW: 17, multipl: 1, precipitationSaltConcentration: 35 },
            { name: '3', pI: 7.5, mW: 27, multipl: 1, precipitationSaltConcentration: 25 },
            { name: '4', pI: 4.5, mW: 37.5, multipl: 2, precipitationSaltConcentration: 15 },
            { name: '5', pI: 9.1, mW: 50, multipl: 3, precipitationSaltConcentration: 5 },
            { name: '6', pI: 7.5, mW: 32.5, multipl: 1, precipitationSaltConcentration: 45 },
        ] },
        { code: 'Standard', description: 'SeeBlue Plus2 Protein Standard', standard: true, volume: 0.2, solutes: [
            { name: 'Myosin', pI: 6.5, mW: 250 },
            { name: 'Phosphorylase', pI: 9.3, mW: 148, color: '255,165,0' },
            { name: 'BSA', pI: 8.0, mW: 98, precipitationSaltConcentration: 40 },
            { name: 'Glutamic dehydrogenase', pI: 5.5, mW: 64, precipitationSaltConcentration: 20 },
            { name: 'Alcohol dehydrogenase', pI: 7.2, mW: 50, precipitationSaltConcentration: 20 },
            { name: 'Carbonic anhydrase', pI: 6.5, mW: 36, precipitationSaltConcentration: 20 },
            { name: 'Myoglobin red', pI: 7.5, mW: 22, color: '153,50,204' },
            { name: 'Lysozyme', pI: 4.5, mW: 16, precipitationSaltConcentration: 20 },
            { name: 'Aprotinin', pI: 9.1, mW: 6, precipitationSaltConcentration: 20 },
            { name: 'Insulin B chain', pI: 7.5, mW: 4, precipitationSaltConcentration: 20 },
        ] },
        ];
        return {
            add : function(sol) {
                solutions.push(sol);
            },
            getAll : function() {
                return solutions;
            }

       };
    });

app.directive('mySortable', function () {
    return {
        link: function (scope, el, attrs) {
            el.sortable({
                revert: true
            });
            el.disableSelection();

            el.on("sortdeactivate", function (event, ui) {
                var from = angular.element(ui.item).scope().$index;
                var to = el.children().index(ui.item);
                if (to >= 0) {
                    scope.$apply(function () {
                        if (from >= 0) {
                            scope.$emit('my-sorted', { from: from, to: to });
                        } else {
                            scope.$emit('my-created', { to: to, name: ui.item.text() });
                            ui.item.remove();
                        }
                    })
                }
            });
        }
    }
})

app.directive('myDraggable', function () {

    return {
        link: function (scope, el, attrs) {
            el.draggable({
                connectToSortable: attrs.myDraggable,
                helper: "clone",
                revert: "invalid"
            });
            el.disableSelection();
        }
    }

})