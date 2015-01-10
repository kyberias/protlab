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
