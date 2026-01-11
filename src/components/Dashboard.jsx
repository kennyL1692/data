import { useEffect, useState } from 'react';
import anime from 'animejs';
import { loadMedicalData, calculateStats, getRegionalAverages, getBMIDistribution } from '../utils/dataLoader';
import StatsCard from './StatsCard';
import ScatterPlot from './Charts/ScatterPlot';
import BarChart from './Charts/BarChart';
import Histogram from './Charts/Histogram';
import './Dashboard.css';

export default function Dashboard() {
    const [data, setData] = useState([]);
    const [stats, setStats] = useState(null);
    const [regionalData, setRegionalData] = useState([]);
    const [bmiData, setBmiData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const medicalData = await loadMedicalData();
                setData(medicalData);

                const calculatedStats = calculateStats(medicalData);
                setStats(calculatedStats);

                const regional = getRegionalAverages(medicalData);
                setRegionalData(regional);

                const bmi = getBMIDistribution(medicalData);
                setBmiData(bmi);

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        if (!loading && stats) {
            // Animate stats cards
            anime({
                targets: '.stats-card',
                translateY: [30, 0],
                opacity: [0, 1],
                duration: 800,
                delay: anime.stagger(100, { start: 200 }),
                easing: 'easeOutCubic'
            });

            // Animate charts
            anime({
                targets: '.chart-container',
                translateY: [40, 0],
                opacity: [0, 1],
                duration: 1000,
                delay: anime.stagger(150, { start: 600 }),
                easing: 'easeOutCubic'
            });
        }
    }, [loading, stats]);

    if (loading) {
        return (
            <div className="dashboard">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Loading medical data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard">
                <div className="error-container">
                    <h2>Error Loading Data</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1 className="dashboard-title">Medical Charges Dashboard V2</h1>
                <p className="dashboard-subtitle">
                    Interactive visualization of medical insurance cost data
                </p>
            </header>

            <section className="stats-section">
                <div className="stats-grid">
                    <StatsCard
                        title="Average Charge"
                        value={`$${stats.avgCharge.toFixed(2)}`}
                        subtitle="Mean medical insurance cost"
                        icon="💰"
                        color="primary"
                    />
                    <StatsCard
                        title="Average Age"
                        value={`${stats.avgAge.toFixed(1)} yrs`}
                        subtitle="Mean age of patients"
                        icon="👤"
                        color="secondary"
                    />
                    <StatsCard
                        title="Average BMI"
                        value={stats.avgBMI.toFixed(1)}
                        subtitle="Mean Body Mass Index"
                        icon="📊"
                        color="success"
                    />
                    <StatsCard
                        title="Total Records"
                        value={stats.totalCount.toLocaleString()}
                        subtitle={`${stats.smokerCount} smokers, ${stats.nonSmokerCount} non-smokers`}
                        icon="📋"
                        color="warning"
                    />
                </div>
            </section>

            <section className="charts-section">
                <div className="charts-grid">
                    <div className="chart-full">
                        <ScatterPlot data={data} />
                    </div>

                    <div className="chart-half">
                        <BarChart data={regionalData} />
                    </div>

                    <div className="chart-half">
                        <Histogram data={bmiData} />
                    </div>
                </div>
            </section>

            <footer className="dashboard-footer">
                <p>Data visualization powered by D3.js & Anime.js</p>
            </footer>
        </div>
    );
}
