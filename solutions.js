function readSingleFile(e) {
    var file = e.target.files[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
        var contents = e.target.result;
        displayContents(contents);
    };
    reader.readAsText(file);
}

var app = angular.module('protlabApp', [])
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
    })

function SolutionsCtrl($scope, solutionsService) {
    $scope.newVisible = false;

    $scope.solutions = solutionsService.getAll();

    $scope.columns = [{ name: '' } ];

    $scope.createNewSolution = function() {
        $scope.newSolution = {
            code: '',
            description: 'new',
            solubles : []
        };
        $scope.newVisible = true;
    }

    $scope.saveNewSolution = function () {
        $scope.solutions.push($scope.newSolution);
        $scope.newVisible = false;
    }

    $scope.cancelNewSolution = function () {
        $scope.newVisible = false;
    }

    $scope.createNewSoluble = function () {
        $scope.newSolution.solubles.push({
            name: '',
            c: 0,
            mW: 0,
            pI: 0
        });
    }

    $scope.saveSolutionsAs = function () {
        var blob = new Blob([JSON.stringify($scope.solutions)], { type: "application/json;charset=utf-8" });
        saveAs(blob, "solutions.json");
    }

    $scope.fileChanged = function () {

        // define reader
        var reader = new FileReader();

        // A handler for the load event (just defining it, not executing it right now)
        reader.onload = function (e) {
            $scope.$apply(function () {
                $scope.solutions = JSON.parse(reader.result);
            });
        };

        // get <input> element and the selected file 
        var jsonFileInput = document.getElementById('fileInput');
        var jsonFile = jsonFileInput.files[0];

        // use reader to read the selected file
        // when read operation is successfully finished the load event is triggered
        // and handled by our reader.onload function
        reader.readAsText(jsonFile);
    };

}
