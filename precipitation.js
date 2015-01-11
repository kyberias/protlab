function precipitate(solution, saltCons, tempC) {
    var solutes = solution.solutes;

    var results = [
        {
            code: solution.code + '_PR_1',
            description: 'Precipitate',
            solutes: []
        },
        {
            code: solution.code + '_PR_2',
            description: 'Supernatant',
            solutes: []
        }
    ];

    for (var i = 0; i < solutes.length; i++)
    {
        var solute = solutes[i];
        if (solute.precipitationSaltConcentration < saltCons) {
            results[0].solutes.push(solute);
        } else {
            results[1].solutes.push(solute);
        }
    }

    return results;
}

function PrecipitationCtrl($scope, solutionsService) {
    $scope.solutions = solutionsService.getAll();

    $scope.startPrecipitation = function() {
        $scope.enablePrecSave = false;
        var result = precipitate($scope.selectedPrecSolution, $scope.saltConcentration, 25);

        if(result.length == 2)
        {
            $scope.precResult1 = result[0];
            $scope.precResult2 = result[1];
            $scope.enablePrecSave = true;
        }
    }

    $scope.savePrecResults = function() {
        $scope.solutions.push($scope.precResult1);
        $scope.solutions.push($scope.precResult2);
        $scope.precResult1 = null;
        $scope.precResult2 = null;
        $scope.enablePrecSave = false;
    }
}
