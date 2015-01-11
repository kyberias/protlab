// normal distrib

function NormalDistr(x,u,variance)
{
    var sd = Math.sqrt(variance);
    return 1.0/(sd*Math.sqrt(2*Math.PI))*Math.pow(Math.E, -0.5*Math.pow((x-u)/sd,2));
}

app.controller('ChromatographyCtrl', function ($scope, solutionsService) {
    $scope.solutions = solutionsService.getAll();

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

}
);