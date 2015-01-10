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

function drawBlot(ctx, x, y, rad, color) {
    var grd = ctx.createRadialGradient(x, y, rad, x, y, 1);

    //console.log('createRadialGradient ' + x + ' ' + y + ' ' + rad)

    var bias = 180;

    if(color)
    {
    grd.addColorStop(0, "rgba(" + color + ", 0)");
    grd.addColorStop(1, "rgba(" + color + ", 0.2)");
    } else {
    grd.addColorStop(0, "rgba(" + bias + ", " + bias + ", 255, 0)");
    grd.addColorStop(1, "rgba(" + bias + ", " + bias + ", 255, 0.2)");
    }
    //grd.addColorStop(0, "transparent");
    //grd.addColorStop(1, "blue");

    // Fill with gradient
    //ctx.arc(50, 50, 50, 0, 2 * Math.PI);
    ctx.fillStyle = grd;
    ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    //console.log('fillRect' + (x-rad) + ' ' + (y-rad) + ' ' + rad*2 + ' ' + rad*2)
}

var runInterval;

function renderSDSPAGE(canvas, prots, completion) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var stopRun = false;

    // apply voltage force and move proteins
    for (var i = 0; i < prots.length; i++) {
        var prot = prots[i];

        var a = 10.0 / prot.mW;
        prot.y += a;//(0.04 * 100 - 0.01 * prot.mW);

        drawBlot(ctx, prot.x, prot.y, 5, prot.stain);

        if (prot.y >= (canvas.height - 30)) {
            // Stop when proteins start to run out of the gel
            stopRun = true;
        }
    }

    if (stopRun) {
        clearInterval(runInterval);
        completion();
    }
}

function calcpH(pHleft, pHright, x, width) {
    return pHleft + (pHright - pHleft) * 1.0 * x / width;
}

function chargeInPh(pI, pH) {
    return pI - pH;
}

function render2DPAGE(canvas, prots, completion) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var stopRun = false;

    var largestMove = 0;

    // apply voltage force and move proteins
    for (var i = 0; i < prots.length; i++) {
        var prot = prots[i];

        var pH = calcpH(4, 10, prot.x, canvas.width);
        var charge = chargeInPh(prot.pI, pH);

        var movex = (0.9 * charge);
        prot.x += movex;
        movex = Math.abs(movex);
        if(movex > largestMove) {
            largestMove = movex;
        }

        drawBlot(ctx, prot.x, prot.y, 5, prot.stain);

        if (prot.x >= (canvas.width - 30)) {
            // Stop when proteins start to run out of the gel
            stopRun = true;
        }
    }

    if (stopRun || largestMove < 0.5) {
        clearInterval(runInterval);
        completion();
    }
}

function generateProtsWithWeightAndpI(name, howmany, pI, mW, stain) {
    var prots = [];

    for (var i = 0; i < howmany; i++) {
        var prot = {
            name: name,
            pI: pI + normalDist() * 0.03,
            mW: mW,// + 0.05 * normalDist(),
            stain: stain
        };
        prots.push(prot);
    }
    return prots;
}

function start2DPAGE(canvas, solutes, completion) {
    var prots = [];

    var num=100;

    for(var i = 0;i<solutes.length;i++) {
        var solute = solutes[i];
        prots = prots.concat(generateProtsWithWeightAndpI('foobar', num, solute.pI, solute.mW, solute.color));
    }

    resetPositions(prots, 1);
    protsToRender = prots;
    runInterval = setInterval(renderSDSPAGE, 50, canvas, prots, function() {
        runInterval = setInterval(render2DPAGE, 50, canvas, prots, completion);
    });
//    runInterval = setInterval(render2DPAGE, 50, canvas, prots);
}

function runSDSPAGE(canvas, prots, completion) {
    resetPositions(prots, 1);

    protsToRender = prots;
    runInterval = setInterval(renderSDSPAGE, 50, canvas, prots, completion);
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
