// normal distrib

function NormalDistr(x,u,variance)
{
    var sd = Math.sqrt(variance);
    return 1.0/(sd*Math.sqrt(2*Math.PI))*Math.pow(Math.E, -0.5*Math.pow((x-u)/sd,2));
}