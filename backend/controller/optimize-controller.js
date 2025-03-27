import GLPK from 'glpk.js';
import PSO from 'pso';


const formatInput = (data) => {
  const { ingredientsData, ingredients, nutrients } = data;

  // === objective function (minimize cost) ===
  const objectives = ingredients.map(ingredient => {
    const coef = ingredientsData.find(item => item.name === ingredient.name).price;
    return {
      name: ingredient.name,
      coef: coef
    }
  });

  // === nutrient constraints === (e.g. 5x1 + 10x2 + 4x3 >= 15)
  const constraints = nutrients.map(nutrient => {
    const bndType = nutrient.minimum && nutrient.maximum ? "GLP_DB" : nutrient.maximum ? "GLP_UP" : "GLP_LO";
    return {
      name: nutrient.name,
      vars: ingredients.map(ingredient => {
        const nutrientData = ingredientsData.find(item => item.name === ingredient.name).nutrients;
        const nutrientValue = nutrientData.find(n => n.nutrient === nutrient.nutrientId)?.value || 0;
        return {
          name: ingredient.name,
          coef: nutrientValue
        };
      }),
      bnds: {
        type: bndType,
        lb: nutrient.minimum,
        ub: nutrient.maximum
      }
    }
  });

  // === ingredient variable bounds === (e.g. 1 <= x1 <= 14)
  const variableBounds = ingredients.map(ingredient => {
    const bndType = ingredient.minimum && ingredient.maximum ? "GLP_DB" : ingredient.maximum ? "GLP_UP" : "GLP_LO";
    return {
      name: ingredient.name,
      type: bndType,
      lb: ingredient.minimum,
      ub: ingredient.maximum
    }
  });

  console.log("objectives", objectives);
  console.log("constraints", constraints);
  console.log("variableBounds", variableBounds);
  return { objectives, constraints, variableBounds };
}

const determineOptimizedNutrients = (optimizedIngredients, constraints) => {
  const total = Object.values(optimizedIngredients).reduce((sum, value) => sum + value, 0);
  const ratios = {};
  for (const [ingredient, value] of Object.entries(optimizedIngredients)) {
    ratios[ingredient] = total > 0 ? (value / total).toFixed(2) : "0.00";
  }

  console.log("optimizedIngredients", optimizedIngredients);

  const finalNutrients = constraints.map(constraint => {
    const nutrientName = constraint.name;
    var optimizedNutrientValue = 0;
    // get the percentage of each optimized ingredient
    // Object.entries(ratios).forEach(([ingredient, percentage]) => {
    //   const involvedIngredient = constraint.vars.find(v => v.name === ingredient);
    //   const nutrientValue = involvedIngredient.coef * percentage;
    //   optimizedNutrientValue += nutrientValue;
    // })
    // NOTE: its not percentage!!
    Object.entries(optimizedIngredients).forEach(([ingredient, value]) => {
      const involvedIngredient = constraint.vars.find(v => v.name === ingredient);
      const nutrientValue = involvedIngredient.coef * value;
      optimizedNutrientValue += nutrientValue;
    })
    return {
      name: nutrientName,
      value: optimizedNutrientValue.toFixed(2)
    }
  })
  return finalNutrients;
}

const simplex = async (req, res) => {
  const { objectives, constraints, variableBounds } = formatInput(req.body);

  try {
    const glpk = GLPK();
    const options = {
      msglev: glpk.GLP_MSG_ALL,
      presol: true,
      cb: {
        call: progress => console.log(progress),
        each: 1
      }
    };

    // format the constraints to be used in the optimization
    const subjects = [];
    for (let i = 0; i < constraints.length; i++) {
      subjects.push({
        name: 'c' + i,
        vars: constraints[i].vars,  // variables
        // sample: [{ name: 'x1', coef: 1.0 }, { name: 'x2', coef: 2.0 }],
        bnds: constraints[i].bnds   // bounds
        // sample: { type: glpk.GLP_UP, ub: 40.0, lb: 0.0 }
      });
      subjects[i].bnds.type = glpk[subjects[i].bnds.type];    // convert the bound type to GLPK format
    }

    // format the variable bounds to be used in the optimization
    const varsSubjects = [];
    for (let i = 0; i < variableBounds.length; i++) {
      varsSubjects.push({
        name: variableBounds[i].name,
        type: variableBounds[i].type,
        ub: variableBounds[i].ub,
        lb: variableBounds[i].lb

      });
      varsSubjects[i].type = glpk[varsSubjects[i].type];    // convert the bound type to GLPK format
    }

    // run the optimization
    const output = glpk.solve({
      name: 'LP',
      objective: {
        direction: glpk.GLP_MIN,
        name: 'obj',
        vars: objectives
        // sample: [{ name: 'x1', coef: 1.2 }, { name: 'x2', coef: 1.5 }]
      },
      subjectTo: [
        ...subjects
      ],
      bounds: [
        ...varsSubjects
      ]
    }, options);


    // Check if the result has an optimal solution
    if (output.result.status == glpk.GLP_OPT) {

      // determine the optimized nutrients
      const optimizedNutrients = determineOptimizedNutrients(output.result.vars, constraints);
      // reformat ingredients to be used in the response (make it an array of objects)
      const optimizedIngredients = [];
      Object.entries(output.result.vars).forEach(([key, value]) => {
        optimizedIngredients.push({
          name: key,
          value: value.toFixed(2)
        });
      });

      // Return the solution values
      res.status(200).json({
        status: 'Optimal solution found',
        // objectives: objectives,
        // constraints: constraints,
        // variableBounds: variableBounds,
        optimizedCost: output.result.z.toFixed(2),
        optimizedIngredients: optimizedIngredients,
        optimizedNutrients: optimizedNutrients
      });
    } else {
      // If no optimal solution is found, send a message
      res.status(400).json({
        status: 'No optimal solution',
        message: output.status,
      });
    }
  } catch (error) {
    console.error("Error in Simplex optimization:", error);
    res.status(500).json({ error: "An error occurred during Simplex optimization." });
  }

}


const pso = async (req, res) => {
  try {
    const { ingredients, nutrients } = req.body.formulations;

    // Define the objective function for PSO
    const objectiveFunction = (particle) => {
      // Calculate total cost (placeholder - should use actual ingredient costs)
      const totalCost = particle.reduce((sum, value) => sum + value, 0);

      // Check constraints
      let penalty = 0;

      // 1. Sum must equal 100%
      const sum = particle.reduce((a, b) => a + b, 0);
      penalty += Math.abs(sum - 100) * 1000;

      // 2. Ingredient constraints
      particle.forEach((value, index) => {
        const ingredient = ingredients[index];
        if (ingredient.minimum !== null && ingredient.minimum !== undefined) {
          if (value < ingredient.minimum) {
            penalty += (ingredient.minimum - value) * 1000;
          }
        }
        if (ingredient.maximum !== null && ingredient.maximum !== undefined) {
          if (value > ingredient.maximum) {
            penalty += (value - ingredient.maximum) * 1000;
          }
        }
      });

      // 3. Nutrient constraints
      nutrients.forEach((nutrient, nutrientIndex) => {
        // Calculate nutrient value (placeholder - should use actual nutrient composition)
        const nutrientValue = particle.reduce((sum, value) => sum + value, 0);

        if (nutrient.minimum !== null && nutrient.minimum !== undefined) {
          if (nutrientValue < nutrient.minimum) {
            penalty += (nutrient.minimum - nutrientValue) * 1000;
          }
        }
        if (nutrient.maximum !== null && nutrient.maximum !== undefined) {
          if (nutrientValue > nutrient.maximum) {
            penalty += (nutrientValue - nutrient.maximum) * 1000;
          }
        }
      });

      return totalCost + penalty;
    };

    // Define bounds for each dimension (ingredient)
    const bounds = ingredients.map(ingredient => ({
      min: ingredient.minimum !== null ? ingredient.minimum : 0,
      max: ingredient.maximum !== null ? ingredient.maximum : 100
    }));

    // Configure PSO
    const options = {
      particles: 50,
      dimensions: ingredients.length,
      bounds: bounds,
      maxIterations: 1000,
      learningRate: 0.1,
      inertia: 0.8,
      tolerance: 1e-6
    };

    // Create and run PSO
    const pso = new PSO(objectiveFunction, options);
    const result = pso.optimize();

    // Process the results
    const solution = {
      status: result.converged ? 'converged' : 'not_converged',
      objective: result.bestFitness,
      variables: result.bestPosition,
      iterations: result.iterations,
      message: result.converged ? 'Optimal solution found' : 'No optimal solution found'
    };

    res.status(200).json({
      message: 'success',
      solution
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
      message: 'error'
    });
  }
};

export {
  simplex,
  pso
};
