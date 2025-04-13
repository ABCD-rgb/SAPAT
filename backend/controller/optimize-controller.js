import GLPK from 'glpk.js';
import PSO from 'pso';


const formatInput = (data) => {
  const { ingredientsData, ingredients, nutrients } = data;

  // === objective function (minimize cost) ===
  const objectives = ingredients.map(ingredient => {
    // the copy of ingredient either comes from global or user-revised
    const coef = ingredientsData.find(item => (item._id === ingredient.ingredient_id) || (item.ingredient_id === ingredient.ingredient_id)).price;

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
        const nutrientValue = nutrientData.find(n => n.nutrient === nutrient.nutrient_id)?.value || 0;
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

  // === total weight constraint ===
  const totalWeightConstraint = {
    name: "Total Weight",
    vars: ingredients.map(ingredient => ({
      name: ingredient.name,
      coef: 1 // Coefficient of 1 for each ingredient to sum to 100
    })),
    bnds: {
      type: "GLP_FX", // Fixed bound (exactly equal)
      lb: 100,
      ub: 100
    }
  };

  // Add the total weight constraint to the existing constraints
  constraints.push(totalWeightConstraint);

  // console.log("objectives", objectives);
  // console.log("constraints", constraints);
  // console.log("variableBounds", variableBounds);
  return { objectives, constraints, variableBounds };
}

const determineOptimizedNutrients = (optimizedIngredients, constraints) => {
  const total = Object.values(optimizedIngredients).reduce((sum, value) => sum + value, 0);
  const ratios = {};
  for (const [ingredient, value] of Object.entries(optimizedIngredients)) {
    ratios[ingredient] = total > 0 ? (value / total).toFixed(2) : "0.00";
  }
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
        constraints: constraints,
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


// const pso = async (req, res) => {
//   try {
//     const { ingredients, nutrients } = req.body.formulations;
//
//     // Define the objective function for PSO
//     const objectiveFunction = (particle) => {
//       // Calculate total cost (placeholder - should use actual ingredient costs)
//       const totalCost = particle.reduce((sum, value) => sum + value, 0);
//
//       // Check constraints
//       let penalty = 0;
//
//       // 1. Sum must equal 100%
//       const sum = particle.reduce((a, b) => a + b, 0);
//       penalty += Math.abs(sum - 100) * 1000;
//
//       // 2. Ingredient constraints
//       particle.forEach((value, index) => {
//         const ingredient = ingredients[index];
//         if (ingredient.minimum !== null && ingredient.minimum !== undefined) {
//           if (value < ingredient.minimum) {
//             penalty += (ingredient.minimum - value) * 1000;
//           }
//         }
//         if (ingredient.maximum !== null && ingredient.maximum !== undefined) {
//           if (value > ingredient.maximum) {
//             penalty += (value - ingredient.maximum) * 1000;
//           }
//         }
//       });
//
//       // 3. Nutrient constraints
//       nutrients.forEach((nutrient, nutrientIndex) => {
//         // Calculate nutrient value (placeholder - should use actual nutrient composition)
//         const nutrientValue = particle.reduce((sum, value) => sum + value, 0);
//
//         if (nutrient.minimum !== null && nutrient.minimum !== undefined) {
//           if (nutrientValue < nutrient.minimum) {
//             penalty += (nutrient.minimum - nutrientValue) * 1000;
//           }
//         }
//         if (nutrient.maximum !== null && nutrient.maximum !== undefined) {
//           if (nutrientValue > nutrient.maximum) {
//             penalty += (nutrientValue - nutrient.maximum) * 1000;
//           }
//         }
//       });
//
//       return totalCost + penalty;
//     };
//
//     // Define bounds for each dimension (ingredient)
//     const bounds = ingredients.map(ingredient => ({
//       min: ingredient.minimum !== null ? ingredient.minimum : 0,
//       max: ingredient.maximum !== null ? ingredient.maximum : 100
//     }));
//
//     // Configure PSO
//     const options = {
//       particles: 50,
//       dimensions: ingredients.length,
//       bounds: bounds,
//       maxIterations: 1000,
//       learningRate: 0.1,
//       inertia: 0.8,
//       tolerance: 1e-6
//     };
//
//     // Create and run PSO
//     const pso = new PSO(objectiveFunction, options);
//     const result = pso.optimize();
//
//     // Process the results
//     const solution = {
//       status: result.converged ? 'converged' : 'not_converged',
//       objective: result.bestFitness,
//       variables: result.bestPosition,
//       iterations: result.iterations,
//       message: result.converged ? 'Optimal solution found' : 'No optimal solution found'
//     };
//
//     res.status(200).json({
//       message: 'success',
//       solution
//     });
//
//   } catch (err) {
//     res.status(500).json({
//       error: err.message,
//       message: 'error'
//     });
//   }
// };

// PSO (Particle Swarm Optimization) implementation for diet formulation
// This handles the same optimization problem as the simplex method



const determineOptimizedNutrientsPSO = (optimizedIngredients, constraints) => {
  const total = Object.values(optimizedIngredients).reduce((sum, value) => sum + value, 0);
  const ratios = {};
  for (const [ingredient, value] of Object.entries(optimizedIngredients)) {
    ratios[ingredient] = total > 0 ? (value / total).toFixed(2) : "0.00";
  }
  const finalNutrients = constraints.map(constraint => {
    const nutrientName = constraint.name;
    var optimizedNutrientValue = 0;

    Object.entries(optimizedIngredients).forEach(([ingredient, value]) => {
      const involvedIngredient = constraint.vars.find(v => v.name === ingredient);
      if (involvedIngredient) {
        const nutrientValue = involvedIngredient.coef * value;
        optimizedNutrientValue += nutrientValue;
      }
    })
    return {
      name: nutrientName,
      value: optimizedNutrientValue.toFixed(2)
    }
  })
  return finalNutrients;
}

/**
 * PSO optimization function
 * @param {Object} options PSO algorithm parameters
 * @param {Number} options.iterations Maximum number of iterations
 * @param {Number} options.particles Number of particles in the swarm
 * @param {Number} options.inertia Inertia weight for velocity update
 * @param {Number} options.social Social (global best) coefficient
 * @param {Number} options.personal Personal (particle best) coefficient
 * @param {Number} options.tolerance Convergence tolerance
 */
const psoOptimize = (objectives, constraints, variableBounds, options = {}) => {
  const defaults = {
    iterations: 2000,
    particles: 50,
    inertia: 0.7,
    social: 1.5,
    personal: 1.5,
    tolerance: 1e-6
  };

  const settings = { ...defaults, ...options };

  // Extract ingredient names
  const ingredientNames = objectives.map(obj => obj.name);

  // Create variable bounds array in the format needed for PSO
  const bounds = [];

  variableBounds.forEach(bound => {
    const lb = bound.lb !== undefined ? bound.lb : 0;
    const ub = bound.ub !== undefined ? bound.ub : 100;
    bounds.push([lb, ub]);
  });

  // Initialize particles
  const particles = [];
  for (let i = 0; i < settings.particles; i++) {
    // Random initial position within bounds
    const position = variableBounds.map((bound, idx) => {
      const lb = bound.lb !== undefined ? bound.lb : 0;
      const ub = bound.ub !== undefined ? bound.ub : 100;
      return lb + Math.random() * (ub - lb);
    });

    // Adjust to meet total weight constraint
    let totalWeight = position.reduce((sum, val) => sum + val, 0);
    if (totalWeight > 0) {
      // Scale to sum to 100
      position.forEach((val, idx) => {
        position[idx] = (val / totalWeight) * 100;
      });
    } else {
      // If all zeros, distribute evenly
      const equalWeight = 100 / position.length;
      position.forEach((val, idx) => {
        position[idx] = equalWeight;
      });
    }

    // Random initial velocity
    const velocity = variableBounds.map((bound) => {
      const lb = bound.lb !== undefined ? bound.lb : 0;
      const ub = bound.ub !== undefined ? bound.ub : 100;
      const range = ub - lb;
      return -range/10 + Math.random() * range/5; // Velocity in range [-range/10, range/10]
    });

    particles.push({
      position,
      velocity,
      bestPosition: [...position],
      bestFitness: Infinity
    });
  }

  // Global best
  let globalBestPosition = null;
  let globalBestFitness = Infinity;

  // Fitness function (objective + penalty for constraint violations)
  function calculateFitness(position) {
    // Create a mapping of ingredient name to position value
    const positionMap = {};
    ingredientNames.forEach((name, idx) => {
      positionMap[name] = position[idx];
    });

    // Calculate objective value (cost)
    let cost = 0;
    objectives.forEach((obj, idx) => {
      cost += obj.coef * position[idx];
    });

    // Calculate constraint violations
    let penalty = 0;

    // Check total weight constraint (should be exactly 100)
    const totalWeight = position.reduce((sum, val) => sum + val, 0);
    penalty += Math.abs(totalWeight - 100) * 1000; // Strong penalty for total weight deviation

    // Check other constraints
    constraints.forEach(constraint => {
      // Skip the total weight constraint as we handled it separately
      if (constraint.name === "Total Weight") return;

      // Calculate the current value for this constraint
      let constraintValue = 0;
      constraint.vars.forEach((variable) => {
        const ingredientIndex = ingredientNames.indexOf(variable.name);
        if (ingredientIndex !== -1) {
          constraintValue += variable.coef * position[ingredientIndex];
        }
      });

      // Check if constraint is violated
      if (constraint.bnds.type === "GLP_LO" || constraint.bnds.type === "GLP_DB") {
        // Lower bound constraint
        if (constraintValue < constraint.bnds.lb) {
          penalty += (constraint.bnds.lb - constraintValue) * 1000;
        }
      }

      if (constraint.bnds.type === "GLP_UP" || constraint.bnds.type === "GLP_DB") {
        // Upper bound constraint
        if (constraintValue > constraint.bnds.ub) {
          penalty += (constraintValue - constraint.bnds.ub) * 1000;
        }
      }

      if (constraint.bnds.type === "GLP_FX") {
        // Fixed constraint
        penalty += Math.abs(constraintValue - constraint.bnds.lb) * 1000;
      }
    });

    // Check variable bounds
    variableBounds.forEach((bound, idx) => {
      if (bound.type === "GLP_LO" || bound.type === "GLP_DB") {
        if (position[idx] < bound.lb) {
          penalty += (bound.lb - position[idx]) * 1000;
        }
      }

      if (bound.type === "GLP_UP" || bound.type === "GLP_DB") {
        if (position[idx] > bound.ub) {
          penalty += (position[idx] - bound.ub) * 1000;
        }
      }
    });

    return cost + penalty;
  }

  // Run PSO iterations
  let converged = false;
  let bestFitness = Infinity;
  let lastImprovement = 0;

  console.log("Starting PSO optimization...");

  for (let iter = 0; iter < settings.iterations && !converged; iter++) {
    // Update each particle
    particles.forEach(particle => {
      // Calculate fitness
      const fitness = calculateFitness(particle.position);

      // Update personal best
      if (fitness < particle.bestFitness) {
        particle.bestFitness = fitness;
        particle.bestPosition = [...particle.position];

        // Update global best
        if (fitness < globalBestFitness) {
          globalBestFitness = fitness;
          globalBestPosition = [...particle.bestPosition];
          lastImprovement = iter;
        }
      }

      // Update velocity and position
      particle.position.forEach((pos, idx) => {
        // Update velocity with inertia, cognitive and social components
        particle.velocity[idx] =
          settings.inertia * particle.velocity[idx] +
          settings.personal * Math.random() * (particle.bestPosition[idx] - pos) +
          settings.social * Math.random() * (globalBestPosition[idx] - pos);

        // Update position
        particle.position[idx] = pos + particle.velocity[idx];

        // Clamp position to bounds
        if (variableBounds[idx].type === "GLP_LO" || variableBounds[idx].type === "GLP_DB") {
          particle.position[idx] = Math.max(variableBounds[idx].lb, particle.position[idx]);
        }

        if (variableBounds[idx].type === "GLP_UP" || variableBounds[idx].type === "GLP_DB") {
          particle.position[idx] = Math.min(variableBounds[idx].ub, particle.position[idx]);
        }
      });

      // Enforce total weight constraint = 100
      let totalWeight = particle.position.reduce((sum, val) => sum + val, 0);
      if (totalWeight > 0) {
        particle.position.forEach((val, idx) => {
          particle.position[idx] = (val / totalWeight) * 100;
        });
      }
    });

    // Check for convergence every 100 iterations
    if (iter > 0 && iter % 100 === 0) {
      const currentBestFitness = calculateFitness(globalBestPosition);
      const improvement = Math.abs(bestFitness - currentBestFitness);

      if (improvement < settings.tolerance || (iter - lastImprovement > 500)) {
        converged = true;
        console.log(`Converged at iteration ${iter}, improvement: ${improvement}`);
      }

      bestFitness = currentBestFitness;
    }
  }

  // Format the results to match the simplex output
  const optimizedIngredients = {};
  ingredientNames.forEach((name, idx) => {
    optimizedIngredients[name] = globalBestPosition[idx];
  });

  // Determine optimized nutrients
  const optimizedNutrients = determineOptimizedNutrientsPSO(optimizedIngredients, constraints);

  // Format output
  const formattedOptimizedIngredients = ingredientNames.map((name, idx) => ({
    name,
    value: globalBestPosition[idx].toFixed(2)
  }));

  const optimizedCost = objectives.reduce((sum, obj, idx) =>
    sum + obj.coef * globalBestPosition[idx], 0).toFixed(2);

  return {
    status: 'Optimal solution found',
    optimizedCost,
    optimizedIngredients: formattedOptimizedIngredients,
    optimizedNutrients
  };
};

const pso = async (req, res) => {
  const { objectives, constraints, variableBounds } = formatInput(req.body);

  try {
    console.log("Running PSO optimization...");

    // Configure PSO options
    const options = {
      iterations: 2000,
      particles: 50,
      inertia: 0.7,
      social: 1.5,
      personal: 1.5,
      tolerance: 1e-5
    };

    // Run PSO optimization
    const output = psoOptimize(objectives, constraints, variableBounds, options);

    if (output.status === 'Optimal solution found') {
      res.status(200).json({
        status: 'Optimal solution found',
        constraints: constraints,
        optimizedCost: output.optimizedCost,
        optimizedIngredients: output.optimizedIngredients,
        optimizedNutrients: output.optimizedNutrients
      });
    } else {
      res.status(400).json({
        status: 'No optimal solution',
        message: output.status,
      });
    }
  } catch (error) {
    console.error("Error in PSO optimization:", error);
    res.status(500).json({ error: "An error occurred during PSO optimization." });
  }
};


export {
  simplex,
  pso
};
