// JavaScript source code
function normalDist() {
    R1 = Math.random();
    R2 = Math.random();
    return Math.sqrt(-2 * Math.log(R1)) * Math.cos(2 * Math.PI * R2)
}

function resetPositions(prots, lane) {
    for (var i = 0; i < prots.length; i++) {
        var prot = prots[i];

        prot.x = lane * 100 + normalDist() * 10;
        prot.y = 20 + normalDist() * 1;
    }
}

var ctx;

function drawBlot(ctx, x, y, rad) {
    var grd = ctx.createRadialGradient(x, y, rad, x, y, 1);

    //console.log('createRadialGradient ' + x + ' ' + y + ' ' + rad)

    var bias = 180;

    grd.addColorStop(0, "rgba(" + bias + ", " + bias + ", 255, 0)");
    grd.addColorStop(1, "rgba(" + bias + ", " + bias + ", 255, 0.2)");

    //grd.addColorStop(0, "transparent");
    //grd.addColorStop(1, "blue");

    // Fill with gradient
    //ctx.arc(50, 50, 50, 0, 2 * Math.PI);
    ctx.fillStyle = grd;
    ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    //console.log('fillRect' + (x-rad) + ' ' + (y-rad) + ' ' + rad*2 + ' ' + rad*2)
}

var protsToRender;

var runInterval;

function renderSDSPAGE(canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var stopRun = false;

    // apply voltage force and move proteins
    for (var i = 0; i < protsToRender.length; i++) {
        var prot = protsToRender[i];

        prot.y += (0.09 * 100 - 0.09 * prot.kW);

        drawBlot(ctx, prot.x, prot.y, 5);

        if (prot.y >= (canvas.height - 30)) {
            // Stop when proteins start to run out of the gel
            stopRun = true;
        }
    }

    if (stopRun) {
        clearInterval(runInterval);
        run2DPAGE(canvas, protsToRender);
    }
}

function calcpH(pHleft, pHright, x, width) {
    return pHleft + (pHright - pHleft) * 1.0 * x / width;
}

function chargeInPh(pI, pH) {
    return pI - pH;
}

function render2DPAGE(canvas, prots) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var stopRun = false;

    // apply voltage force and move proteins
    for (var i = 0; i < prots.length; i++) {
        var prot = prots[i];

        var pH = calcpH(4, 10, prot.x, canvas.width);
        var charge = chargeInPh(prot.pI, pH);

        prot.x += (0.9 * charge);

        drawBlot(ctx, prot.x, prot.y, 5);

        if (prot.x >= (canvas.width - 30)) {
            // Stop when proteins start to run out of the gel
            stopRun = true;
        }
    }

    if (stopRun) {
        clearInterval(runInterval);
    }
}

function run2DPAGE(canvas, prots) {
    runInterval = setInterval(render2DPAGE, 50, canvas, prots);
}

function runSDSPAGE(canvas) {
    var prots = createProteins();

    resetPositions(prots, 1);

    protsToRender = prots;
    runInterval = setInterval(renderSDSPAGE, 50, canvas);
}



function generateProtsWithWeightAndpI(name, howmany, pI, kW) {
    var prots = [];

    for (var i = 0; i < howmany; i++) {
        var prot = {
            name: name,
            pI: pI + normalDist() * 0.03,
            kW: kW + 0.05 * normalDist()
        };
        prots.push(prot);
    }
    return prots;
}

function createProteins() {
    var num = 100;

    all = [];
    all = all.concat(generateProtsWithWeightAndpI('A', num, 6.5, 12));
    all = all.concat(generateProtsWithWeightAndpI('B', num, 9.3, 23.5));
    all = all.concat(generateProtsWithWeightAndpI('C', num, 8.0, 43.5));
    all = all.concat(generateProtsWithWeightAndpI('D', num, 5.5, 77));
    all = all.concat(generateProtsWithWeightAndpI('1', num, 7.2, 7));
    all = all.concat(generateProtsWithWeightAndpI('2', num, 6.5, 17));
    all = all.concat(generateProtsWithWeightAndpI('3', num, 7.5, 27));
    all = all.concat(generateProtsWithWeightAndpI('4', num, 4.5, 37.5));
    all = all.concat(generateProtsWithWeightAndpI('5', num, 9.1, 50));
    all = all.concat(generateProtsWithWeightAndpI('6', num, 7.5, 32.5));

    return all;
}


$(document).ready(function () {

    $('#start_sdspage2d').click(function () {

        var canvas = $('#pageCanvas').get(0);
        ctx = canvas.getContext("2d");

        runSDSPAGE(canvas);
        return;

        //drawBlot(ctx, 100, 100, 10);

        var targetx = 100;
        var targety = 100;
        var rad = 5;

        var randradx = 20;
        var randrady = 3;

        for (var i = 0; i < 200; i++) {
            drawBlot(ctx,
                //targetx + Math.random() * randradx - randradx / 2,
                //targety + Math.random() * randrady - randrady / 2,
                targetx + normalDist() * randradx,
                targety + normalDist() * randrady,
                rad);
        }
    });
});
