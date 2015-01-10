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
    $scope.newVisible = false;

    $scope.SDSPageSolutions = [];

    $scope.solutions = [
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

    $scope.resins = [
        // cation exchange
        { name: 'Bio-Rex 70 (cat. exch. weak acid)', material: 'polystyrene', charge: -1 },
        { name: 'AG 50W (cat. exch. strong acid)', material: 'polystyrene', charge: -1 },

        // anion exchange
        { name: 'Bio-Rex 5 (an. exch. intermediate base)', material: 'polystyrene', charge: +1 },
        { name: 'AG 1 (an. exch. strong base)', material: 'polystyrene', charge: +1 },
    ];

    $scope.buffers = [
        //{ name: 'phosphatebuffer 20mM, pH 8.0', c: 0.020, pH: 8.0 },
    // Cation exchange
    { name: 'Maleic acid', pKa: 2.0 },
    { name: 'Malonic acid', pKa: 2.88 },
    { name: 'Citric acid', pKa: 3.13 },
    { name: 'Lactic acid', pKa: 3.81 },
    { name: 'Formic acid', pKa: 3.75 },
    { name: 'Butaneandioic acid', pKa: 4.21 },
    { name: 'Acetic acid', pKa: 4.76 },
    { name: 'Malonic acid', pKa: 5.68 },
    { name: 'Phosphate', pKa: 7.20 },
    { name: 'HEPES', pKa: 7.55 },

    // Anion exchange
    { name: 'Tris', pKa: 8.06 },
    { name: 'N-methyl-diethanolamine', pKa: 8.52 },
    { name: 'diethanolamine', pKa: 8.88 },
    { name: '1,3-diaminopropane', pKa: 8.64 },
    { name: 'ethanolamine', pKa: 9.50 },
    { name: 'piperazine', pKa: 9.73 },
    { name: '1,3-diaminopropane', pKa: 10.47 },
    { name: 'piperidine', pKa: 11.12 },
    { name: 'phosphate', pKa: 12.33 }
    ];

    $scope.runChroma = function () {
        var canvas = $('#ChromaCanvas').get(0);
        ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var resin = $scope.selectedResin;
        var solution = $scope.selectedChromaSolution;
        var buffer = $scope.selectedBuffer;

        var pH = buffer.pKa;

        // figure out whether the proteins in the solution stick to the resin in this pH

        var stuck = [];
        var maxCharge=0;

        for(var i=0;i<solution.solutes.length;i++)
        {
            var solute = solution.solutes[i];

            var charge = solute.pI - pH;
            var normalcharge = charge / Math.abs(charge);

            var chargeDiff = resin.charge + normalcharge;
            if(chargeDiff == 0)
            {
                //var percentage = pI 
                stuck.push({ solute: solute, charge: charge, normalcharge: normalcharge });
                if (normalcharge > maxCharge)
                    maxCharge = normalcharge;
            }
        }

        // elute with gradient NaCl from 0M -> 4M

        var startC = 0, endC = 4.0;
        var eluPoints = 500.0;
        var fractionsN = 10;

        ctx.beginPath();
        ctx.moveTo(0, 400);

        var fractions = [];
        fractions.push({ solutes: {} });
        fractions.push({ solutes: {} });
        fractions.push({ solutes: {} });
        fractions.push({ solutes: {} });
        fractions.push({ solutes: {} });
        fractions.push({ solutes: {} });
        fractions.push({ solutes: {} });
        fractions.push({ solutes: {} });
        fractions.push({ solutes: {} });
        fractions.push({ solutes: {} });

        for (var i = 0; i < eluPoints; i++) {
            var currC = (endC - startC) * 1.0 * (i / eluPoints);

            var x = currC;

            var elutepH = 14.0 * (i / eluPoints);

            var y = 0;

            var crFr = Math.floor((i / eluPoints) * fractionsN);

            for (var s = 0; s < stuck.length; s++) {
                var posX = Math.abs(stuck[s].charge) / maxCharge;
                var u = NormalDistr(x, posX, 0.01);
                if (u)
                {
                    fractions[crFr].solutes[stuck[s].solute.name] = stuck[s].solute;
                }
                y += u;
            }
            ctx.lineTo(x / endC * 640.0, 450 - (y*20));
        }
        ctx.strokeStyle = "red";
        ctx.stroke();

        for(var i=0;i<fractions.length;i++)
        {
            var solution = {
                code: "EL" + (i + 1), description: "Elution fraction " + (i + 1), solutes: []
            };

            for (var s in fractions[i].solutes)
            {
                solution.solutes.push(fractions[i].solutes[s]);
            }

            if (solution.solutes.length > 0) {
                $scope.solutions.push(solution);
            }
        }

        /*{ code: 'P1', description: '10 proteins', volume: 0.2, solutes: [
        { name: 'A', pI: 6.5, mW: 4*12, precipitationSaltConcentration: 80 },
        { name: 'B', pI: 9.3, mW: 1*23.5, precipitationSaltConcentration: 60 },*/
    }

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
            $scope.$apply(function () {
                $scope.SDSPAGE2Ddone = true;
            });
            });
    }

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
