// JavaScript source code
// Chromatography simulation

function ChromaColumnSim()
{
    var m = 1;
    var elutesteps = 1000; // how many "steps" of elute gradient we pass through the column

    var N = 50; // Number of column segments

    for(var m=1;m<=elutesteps;m++)
    {
        ////////////////////////////////////////////////////////
        // change eluent concentration based on gradient

        for(var z = N; z >= 0; z--) // For all column segments
        {
            if(z == N)
            {
                // top segment => insert elute to the column segment
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
            // C[m,z Ai] = Ø * init(E^y-)^m,z + init[E^y-1]^m,z

            ////////////////////////////////////////////////////////
            // Choose an approx (eq [E^y-]m,z) for Eq. (15)

            while(Approx1 != Approx2)
            {
                // Calculate sums:
                // Eq. (15)
                // Eq. (17)

                // If all concentrations in Eq. (4) > 0, then
                // Approx for solution of Eq. (15) equals mobile phase eluent concentration

                // Calculate new approximation according to Eq. (16)
            }

            ////////////////////////////////////////////////////////
            // Calculate concentrations
            // Analytes: Eq.(9) and Eq.(3)
            // Eluent: Eq.(5) and Eq.(4)
        }

        // Save results of (final?) segment for chromatogram or plot it.
    }
}