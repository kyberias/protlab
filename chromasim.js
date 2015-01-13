// JavaScript source code
// Chromatography simulation

function NewtonRapshon(f, Df, x0, diff) {
    var x = x0;
    do {
        x1 = x0 + f(x0) / Df(x0);
    } while (Math.abs(x1 - x0) > diff);
    return x1;
}

function ChromaColumnSim() {
    var numAnalytes = 3;
    var elutesteps = 1000.0; // how many "steps" of elute gradient we pass through the column

    var analyteForTimeStep = function(t) {
        return 0;
    }

    var eluteForTimeStep = function (t) {
        return ((t - 1) / elutesteps) * 4.0;
    }

    // Array of analytye concentrations in stationary phase in different segments (N)
    var A_s = []; // Should be array of arrays
    var A_m = [];

    var N = 50; // Number of column segments

    for(var m=1;m<=elutesteps;m++)
    {
        ////////////////////////////////////////////////////////
        // change eluent concentration based on gradient

        var E_m; // elute concentration in mobile phase

        for(var z = N; z >= 0; z--) // For all column segments
        {
            if(z == N)
            {
                // top segment => insert elute to the column segment
                A_m = analyteForTimeStep(m);
                E_m = eluteForTimeStep(m);
            } else {
                // move eluent/analyte concentrations from the previous step (z+1 ?)
            }

            ////////////////////////////////////////////////////////
            // calculate values from Eqs. (3) & (4)
            //
            // () = stationary phase concentration
            // [] = mobile phase concentration
            // Ø = represents the ratio between the volume of the stationary phase (Vs) and the volume of the mobile phase (Vm) in the column.
            // Eqs. (3)
            // C[m,z Ai] = Ø * init(A^xi-_i)^m,z + init[A^xi-_ i]^m,z
            //
            // e.g. (A^xi-_i) = analyte i concentration in stationary phase
            //
            // Eqs. (4)
            // C[m,z E] = Ø * init(E^y-)^m,z + init[E^y-1]^m,z

            for (var i = 0; i < numAnalytes; i++) {
                C_A[i] = A_m[i] + A_s[z][i]; // Eq. 3
            }
            C_E = E_m + E_s; // Eq. 4

            ////////////////////////////////////////////////////////
            // Choose an approx (eq [E^y-]m,z) for Eq. (15)

            var approx_eqE = E_m; // only if all in Eq. 4 positive?

            var f = function(eqE) {
                //C_E - Q/(y*Vm) - eqE - 
            }
            var Df = function (eqE) {

            }

            var threshold = 0.01;
            new_eqE = NewtonRapshon(f, Df, approx_eqE, threshold);

            ////////////////////////////////////////////////////////
            // Calculate concentrations
            // Analytes: Eq.(9) and Eq.(3)
            // Eluent: Eq.(5) and Eq.(4)

            for (var i = 0; i < numAnalytes; i++) {
                A_m[i] = C_A[i] / (k[i] + 1);
                // Repeat Eq. 3?
            }
            //A_m = C_A / (  )
        }

        // Save results of (final?) segment for chromatogram or plot it.
    }
}