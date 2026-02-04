/**
 * Carbon Sequestration Adjustment Calculator
 * 
 * Adjusts carbon sequestration estimates based on land health scores
 * Uses IPCC and FAO carbon factors
 * 
 * Key Concept:
 * Healthier ecosystems sequester carbon more efficiently
 * Land health score acts as a multiplier for base carbon calculations
 */

import ipccFactors from '@/data/ipcc_carbon_factors.json';

export interface CarbonCalculationInput {
    treeCount: number;
    avgTreeAgeYears: number;
    forestType: keyof typeof ipccFactors.forest_types;
    hectares: number;
    landHealthScore: number; // 0-100
}

export interface CarbonCalculationResult {
    baseCarbon: number;           // tC (tonnes of carbon)
    adjustedCarbon: number;       // tC adjusted for land health
    healthMultiplier: number;     // Land health as decimal (0-1)
    improvementPercent: number;   // % improvement from health adjustment
    co2Equivalent: number;        // tCO2e (carbon dioxide equivalent)
    formulas: {
        base: string;
        adjustment: string;
        co2Conversion: string;
    };
}

// CO2 to Carbon conversion factor
const CO2_TO_C_RATIO = 3.67; // 1 tC = 3.67 tCO2

/**
 * Calculate base carbon sequestration (without health adjustment)
 * 
 * Formula:
 * Base Carbon = Hectares × Growth Rate × Age Factor
 * 
 * Where:
 * - Growth Rate = tC/ha/year from IPCC factors
 * - Age Factor = multiplier based on tree age
 */
export function calculateBaseCarbon(input: CarbonCalculationInput): number {
    const forestType = ipccFactors.forest_types[input.forestType];

    if (!forestType) {
        console.warn(`Unknown forest type: ${input.forestType}, using tropical_rainforest`);
        return calculateBaseCarbon({ ...input, forestType: 'tropical_rainforest' });
    }

    // Get age-based multiplier
    const ageFactor = getAgeFactor(input.avgTreeAgeYears);

    // Base calculation: hectares × growth_rate × age_factor
    const baseCarbon = input.hectares * forestType.growth_rate * ageFactor;

    return Math.round(baseCarbon * 10) / 10;
}

/**
 * Get age-based carbon accumulation factor
 */
function getAgeFactor(ageYears: number): number {
    const ageFactors = ipccFactors.age_based_factors;

    if (ageYears < 5) {
        return ageFactors['0-5_years'].carbon_multiplier;
    } else if (ageYears < 10) {
        return ageFactors['5-10_years'].carbon_multiplier;
    } else if (ageYears < 20) {
        return ageFactors['10-20_years'].carbon_multiplier;
    } else if (ageYears < 40) {
        return ageFactors['20-40_years'].carbon_multiplier;
    } else {
        return ageFactors['40+_years'].carbon_multiplier;
    }
}

/**
 * Adjust carbon sequestration based on land health
 * 
 * Formula:
 * Adjusted Carbon = Base Carbon × (Land Health Score / 100)
 * 
 * Rationale:
 * - Healthy soil → better nutrient cycling → faster tree growth
 * - High vegetation density → more photosynthesis
 * - Adequate moisture → optimal growth conditions
 * - High biodiversity → ecosystem resilience
 */
export function adjustCarbonForHealth(
    baseCarbon: number,
    landHealthScore: number
): number {
    const healthMultiplier = landHealthScore / 100;
    const adjustedCarbon = baseCarbon * healthMultiplier;

    return Math.round(adjustedCarbon * 10) / 10;
}

/**
 * Convert carbon to CO2 equivalent
 */
export function carbonToCO2(carbonTonnes: number): number {
    return Math.round(carbonTonnes * CO2_TO_C_RATIO * 10) / 10;
}

/**
 * Complete carbon calculation with health adjustment
 */
export function calculateCarbonSequestration(
    input: CarbonCalculationInput
): CarbonCalculationResult {
    const baseCarbon = calculateBaseCarbon(input);
    const healthMultiplier = input.landHealthScore / 100;
    const adjustedCarbon = adjustCarbonForHealth(baseCarbon, input.landHealthScore);
    const improvementPercent = input.landHealthScore; // Since multiplier is 0-1, this represents % of potential
    const co2Equivalent = carbonToCO2(adjustedCarbon);

    const forestType = ipccFactors.forest_types[input.forestType] ||
        ipccFactors.forest_types.tropical_rainforest;

    return {
        baseCarbon,
        adjustedCarbon,
        healthMultiplier,
        improvementPercent,
        co2Equivalent,
        formulas: {
            base: `Base Carbon = ${input.hectares} ha × ${forestType.growth_rate} tC/ha/year × ${getAgeFactor(input.avgTreeAgeYears)} (age factor) = ${baseCarbon} tC`,
            adjustment: `Adjusted Carbon = ${baseCarbon} tC × (${input.landHealthScore} / 100) = ${adjustedCarbon} tC`,
            co2Conversion: `CO₂ Equivalent = ${adjustedCarbon} tC × ${CO2_TO_C_RATIO} = ${co2Equivalent} tCO₂e`
        }
    };
}

/**
 * Calculate carbon improvement from restoration
 */
export function calculateCarbonImprovement(
    baselineHealth: number,
    currentHealth: number,
    baseCarbon: number
): {
    baselineCarbon: number;
    currentCarbon: number;
    improvement: number;
    improvementPercent: number;
} {
    const baselineCarbon = adjustCarbonForHealth(baseCarbon, baselineHealth);
    const currentCarbon = adjustCarbonForHealth(baseCarbon, currentHealth);
    const improvement = currentCarbon - baselineCarbon;
    const improvementPercent = baselineCarbon > 0
        ? Math.round((improvement / baselineCarbon) * 100)
        : 0;

    return {
        baselineCarbon: Math.round(baselineCarbon * 10) / 10,
        currentCarbon: Math.round(currentCarbon * 10) / 10,
        improvement: Math.round(improvement * 10) / 10,
        improvementPercent
    };
}

/**
 * Get available forest types
 */
export function getForestTypes(): Array<{
    key: string;
    name: string;
    growthRate: number;
    description: string;
}> {
    return Object.entries(ipccFactors.forest_types).map(([key, value]) => ({
        key,
        name: key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        growthRate: value.growth_rate,
        description: value.description
    }));
}

/**
 * Get carbon factor details for transparency
 */
export function getCarbonFactorDetails(forestType: keyof typeof ipccFactors.forest_types) {
    return ipccFactors.forest_types[forestType] || ipccFactors.forest_types.tropical_rainforest;
}
