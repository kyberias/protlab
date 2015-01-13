app.controller('SDSPAGECtrl', function ($scope, solutionsService) {
	$scope.solutions = solutionsService.getAll();
    $scope.SDSPageSolutions = [$scope.solutions[0]];

    $scope.addSolutionToPAGE = function () {
        if ($scope.SDSPageSolutions.length < 10) {
            $scope.SDSPageSolutions.push($scope.selectedSDSPAGESolution);
        }
    }

    $scope.runPAGE = function () {
        var canvas = $('#SDSPAGECanvas').get(0);
        ctx = canvas.getContext("2d");

        startPAGE(canvas, $scope.SDSPageSolutions, function () {
            $scope.$apply(function () {
                $scope.SDSPAGEdone = true;
            });
        });
    }
}
);