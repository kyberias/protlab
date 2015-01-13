app.controller('SDSPAGE2DCtrl', function ($scope, solutionsService) {
	$scope.solutions = solutionsService.getAll();

    $scope.startSDSPAGE2D = function() {
        $scope.SDSPAGE2Ddone = false;

        var canvas = $('#pageCanvas').get(0);
        ctx = canvas.getContext("2d");

        start2DPAGE(canvas, $scope.selectedSDSPAGE2DSolution.solutes, function()
            {
            $scope.$apply(function () {
                $scope.SDSPAGE2Ddone = true;
            });
            });
    }
}
);
