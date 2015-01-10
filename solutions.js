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
        { code: 'P1', description: '10 proteins', volume: 0.2, solutes: [
            { name: 'A', pI: 6.5, mW: 4*12, precipitationSaltConcentration: 80 },
            { name: 'B', pI: 9.3, mW: 1*23.5, precipitationSaltConcentration: 60 },
            { name: 'C', pI: 8.0, mW: 2*43.5, precipitationSaltConcentration: 40 },
            { name: 'D', pI: 5.5, mW: 1*77, precipitationSaltConcentration: 20 },
            { name: '1', pI: 7.2, mW: 8*7, precipitationSaltConcentration: 20 },
            { name: '2', pI: 6.5, mW: 1*17, precipitationSaltConcentration: 20 },
            { name: '3', pI: 7.5, mW: 1*27, precipitationSaltConcentration: 20 },
            { name: '4', pI: 4.5, mW: 2*37.5, precipitationSaltConcentration: 20 },
            { name: '5', pI: 9.1, mW: 3*50, precipitationSaltConcentration: 20 },
            { name: '6', pI: 7.5, mW: 1*32.5, precipitationSaltConcentration: 20 },
        ] },
        { code: 'Standard', description: 'SeeBlue Plus2 Protein Standard', volume: 0.2, solutes: [
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

    $scope.startSDSPAGE2D = function() {
        $scope.SDSPAGE2Ddone = false;

        var canvas = $('#pageCanvas').get(0);
        ctx = canvas.getContext("2d");

        start2DPAGE(canvas, $scope.selectedSDSPAGE2DSolution.solutes, function()
            {
                $scope.SDSPAGE2Ddone = true;
            });
    }
}
