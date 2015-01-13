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

app.controller('SolutionsCtrl', function ($scope, solutionsService) {
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
);