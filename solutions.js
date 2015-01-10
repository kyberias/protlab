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

function SolutionsCtrl($scope) {
    $scope.totalSolutions = 10;
    $scope.newVisible = false;

    $scope.solutions = [
        { code: 'P1', description: '10 proteins', volume: 0.2 },
        { code: 'CH_P1_1', description: 'Chromatography elution 1 from P1', volume: 0.003 },
        { code: 'CH_P1_2', description: 'Chromatography elution 2 from P1', volume: 0.008 },
        { code: 'CH_P1_3', description: 'Chromatography elution 3 from P1', volume: 0.010 }
    ];

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