app.controller('SDSPAGECtrl', function ($scope, solutionsService) {
    $scope.solutions = solutionsService.getAll();
    var sol = $scope.solutions[0];
	$scope.SDSPageSolutions = [ { name: sol.code, sol: sol }];

    $scope.addSolutionToPAGE = function () {
        if ($scope.SDSPageSolutions.length < 10) {
            $scope.SDSPageSolutions.push($scope.selectedSDSPAGESolution);
        }
    }

    $scope.runPAGE = function () {
        var canvas = $('#SDSPAGECanvas').get(0);
        ctx = canvas.getContext("2d");

        var sols = $scope.SDSPageSolutions.map(function (s) { return s.sol; });

        startPAGE(canvas, sols, function () {
            $scope.$apply(function () {
                $scope.SDSPAGEdone = true;
            });
        });
    }

    $scope.$on('my-sorted', function (ev, val) {
        $scope.SDSPageSolutions.splice(val.to, 0, $scope.SDSPageSolutions.splice(val.from, 1)[0]);
    })

    $scope.$on('my-created', function (ev, val) {
        var result = $.grep($scope.solutions, function(e){ return e.code == val.name; });
        $scope.SDSPageSolutions.splice(val.to, 0, { name: val.name, sol: result[0] } /*{ name: '#' + ($scope.SDSPageSolutions.length + 1) + ': ' + val.name }*/);
    })
}
);