import * as d3 from 'd3';

export async function loadMedicalData() {
    try {
        const data = await d3.csv('/medical-charges.csv', (d) => ({
            age: +d.age,
            sex: d.sex,
            bmi: +d.bmi,
            children: +d.children,
            smoker: d.smoker,
            region: d.region,
            charges: +d.charges,
        }));

        return data;
    } catch (error) {
        console.error('Error loading medical data:', error);
        throw error;
    }
}

export function calculateStats(data) {
    if (!data || data.length === 0) {
        return {
            avgCharge: 0,
            avgAge: 0,
            avgBMI: 0,
            totalCount: 0,
            smokerCount: 0,
            nonSmokerCount: 0,
        };
    }

    const avgCharge = d3.mean(data, d => d.charges);
    const avgAge = d3.mean(data, d => d.age);
    const avgBMI = d3.mean(data, d => d.bmi);
    const totalCount = data.length;
    const smokerCount = data.filter(d => d.smoker === 'yes').length;
    const nonSmokerCount = data.filter(d => d.smoker === 'no').length;

    return {
        avgCharge,
        avgAge,
        avgBMI,
        totalCount,
        smokerCount,
        nonSmokerCount,
    };
}

export function getRegionalAverages(data) {
    if (!data || data.length === 0) return [];

    const grouped = d3.group(data, d => d.region);
    const regionalData = [];

    grouped.forEach((values, region) => {
        const avgCharges = d3.mean(values, d => d.charges);
        regionalData.push({
            region,
            avgCharges,
            count: values.length,
        });
    });

    return regionalData.sort((a, b) => b.avgCharges - a.avgCharges);
}

export function getBMIDistribution(data, binCount = 15) {
    if (!data || data.length === 0) return [];

    const bmiValues = data.map(d => d.bmi);
    const histogram = d3.histogram()
        .domain(d3.extent(bmiValues))
        .thresholds(binCount);

    const bins = histogram(bmiValues);

    return bins.map(bin => ({
        x0: bin.x0,
        x1: bin.x1,
        count: bin.length,
        midpoint: (bin.x0 + bin.x1) / 2,
    }));
}
