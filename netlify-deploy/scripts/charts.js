// ===== CHART MANAGEMENT =====

// Chart.js default configuration
Chart.defaults.color = '#94A3B8';
Chart.defaults.borderColor = '#334155';
Chart.defaults.backgroundColor = 'rgba(79, 70, 229, 0.1)';

// Chart theme configuration
const chartTheme = {
    primary: '#4F46E5',
    accent: '#22D3EE',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    background: 'rgba(26, 26, 33, 0.7)',
    grid: '#334155',
    text: '#94A3B8'
};

// Chart factory
class ChartManager {
    constructor() {
        this.charts = new Map();
        this.defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: chartTheme.text,
                        font: {
                            family: 'Poppins'
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: chartTheme.grid
                    },
                    ticks: {
                        color: chartTheme.text
                    }
                },
                y: {
                    grid: {
                        color: chartTheme.grid
                    },
                    ticks: {
                        color: chartTheme.text
                    }
                }
            }
        };
    }

    // Create traffic growth chart
    createTrafficChart(canvasId) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const data = {
            labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
            datasets: [{
                label: 'Ziyaretçi',
                data: [1200, 1900, 3000, 2800, 4200, 3800, 4500, 5200, 4800, 5500, 6100, 6500],
                borderColor: chartTheme.primary,
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: chartTheme.primary,
                pointBorderColor: '#1A1A21',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        };

        const options = {
            ...this.defaultOptions,
            plugins: {
                ...this.defaultOptions.plugins,
                legend: {
                    display: false
                }
            },
            scales: {
                ...this.defaultOptions.scales,
                y: {
                    ...this.defaultOptions.scales.y,
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString('tr-TR');
                        }
                    }
                }
            }
        };

        const chart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: options
        });

        this.charts.set(canvasId, chart);
        return chart;
    }

    // Create ranking timeline chart
    createRankingChart(canvasId) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const data = {
            labels: ['1. Hafta', '2. Hafta', '3. Hafta', '4. Hafta', '5. Hafta', '6. Hafta'],
            datasets: [
                {
                    label: 'techblog.com',
                    data: [45, 38, 42, 35, 28, 25],
                    borderColor: chartTheme.primary,
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'rakip1.com',
                    data: [32, 35, 33, 38, 40, 42],
                    borderColor: chartTheme.warning,
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'rakip2.com',
                    data: [28, 30, 25, 22, 20, 18],
                    borderColor: chartTheme.success,
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4
                }
            ]
        };

        const options = {
            ...this.defaultOptions,
            plugins: {
                ...this.defaultOptions.plugins,
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y}. pozisyon`;
                        }
                    }
                }
            },
            scales: {
                ...this.defaultOptions.scales,
                y: {
                    ...this.defaultOptions.scales.y,
                    reverse: true,
                    min: 0,
                    max: 50,
                    ticks: {
                        callback: function(value) {
                            return `${value}.`;
                        }
                    },
                    title: {
                        display: true,
                        text: 'Google Sıralaması',
                        color: chartTheme.text
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Zaman',
                        color: chartTheme.text
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        };

        const chart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: options
        });

        this.charts.set(canvasId, chart);
        return chart;
    }

    // Create keyword difficulty chart
    createKeywordChart(canvasId) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const data = {
            labels: ['Kolay', 'Orta', 'Zor', 'Çok Zor'],
            datasets: [{
                label: 'Anahtar Kelime Sayısı',
                data: [45, 78, 32, 15],
                backgroundColor: [
                    chartTheme.success,
                    chartTheme.warning,
                    chartTheme.error,
                    '#8B5CF6'
                ],
                borderColor: [
                    chartTheme.success,
                    chartTheme.warning,
                    chartTheme.error,
                    '#8B5CF6'
                ],
                borderWidth: 2,
                hoverBackgroundColor: [
                    '#16A34A',
                    '#D97706',
                    '#DC2626',
                    '#7C3AED'
                ]
            }]
        };

        const options = {
            ...this.defaultOptions,
            plugins: {
                ...this.defaultOptions.plugins,
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label} kelimeler: ${context.parsed.y} adet`;
                        }
                    }
                }
            },
            scales: {
                ...this.defaultOptions.scales,
                y: {
                    ...this.defaultOptions.scales.y,
                    beginAtZero: true,
                    ticks: {
                        stepSize: 10
                    }
                }
            }
        };

        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: options
        });

        this.charts.set(canvasId, chart);
        return chart;
    }

    // Create SEO score gauge
    createSEOGauge(canvasId, score) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const data = {
            datasets: [{
                data: [score, 100 - score],
                backgroundColor: [
                    score >= 80 ? chartTheme.success : score >= 60 ? chartTheme.warning : chartTheme.error,
                    'rgba(51, 65, 85, 0.3)'
                ],
                borderWidth: 0,
                cutout: '75%'
            }]
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        };

        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: options
        });

        this.charts.set(canvasId, chart);
        return chart;
    }

    // Create performance metrics chart
    createPerformanceChart(canvasId) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const data = {
            labels: ['Sayfa Hızı', 'Mobil Uyumluluk', 'Güvenlik', 'Erişilebilirlik'],
            datasets: [{
                label: 'Skor',
                data: [87, 92, 78, 85],
                backgroundColor: chartTheme.primary,
                borderColor: chartTheme.primary,
                borderWidth: 1
            }]
        };

        const options = {
            ...this.defaultOptions,
            plugins: {
                ...this.defaultOptions.plugins,
                legend: {
                    display: false
                }
            },
            scales: {
                ...this.defaultOptions.scales,
                y: {
                    ...this.defaultOptions.scales.y,
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        };

        const chart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: options
        });

        this.charts.set(canvasId, chart);
        return chart;
    }

    // Create competition analysis chart
    createCompetitionChart(canvasId) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const data = {
            labels: ['Biz', 'Rakip A', 'Rakip B', 'Rakip C', 'Rakip D'],
            datasets: [
                {
                    label: 'Organik Trafik',
                    data: [6500, 8200, 5400, 3800, 2200],
                    backgroundColor: 'rgba(79, 70, 229, 0.8)',
                    borderColor: chartTheme.primary,
                    borderWidth: 1
                },
                {
                    label: 'Backlink Sayısı',
                    data: [1250, 2100, 890, 670, 340],
                    backgroundColor: 'rgba(34, 211, 238, 0.8)',
                    borderColor: chartTheme.accent,
                    borderWidth: 1
                }
            ]
        };

        const options = {
            ...this.defaultOptions,
            plugins: {
                ...this.defaultOptions.plugins,
                legend: {
                    position: 'top'
                }
            },
            scales: {
                ...this.defaultOptions.scales,
                y: {
                    ...this.defaultOptions.scales.y,
                    beginAtZero: true
                }
            }
        };

        const chart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: options
        });

        this.charts.set(canvasId, chart);
        return chart;
    }

    // Create monthly progress chart
    createProgressChart(canvasId) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const data = {
            labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
            datasets: [{
                label: 'SEO İlerleme %',
                data: [45, 52, 68, 73, 82, 89],
                backgroundColor: 'rgba(79, 70, 229, 0.3)',
                borderColor: chartTheme.primary,
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        };

        const options = {
            ...this.defaultOptions,
            plugins: {
                ...this.defaultOptions.plugins,
                legend: {
                    display: false
                }
            },
            scales: {
                ...this.defaultOptions.scales,
                y: {
                    ...this.defaultOptions.scales.y,
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        };

        const chart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: options
        });

        this.charts.set(canvasId, chart);
        return chart;
    }

    // Update chart data
    updateChart(canvasId, newData) {
        const chart = this.charts.get(canvasId);
        if (chart && newData) {
            chart.data = { ...chart.data, ...newData };
            chart.update('active');
            return chart;
        }
        return null;
    }

    // Destroy chart
    destroyChart(canvasId) {
        const chart = this.charts.get(canvasId);
        if (chart) {
            chart.destroy();
            this.charts.delete(canvasId);
            return true;
        }
        return false;
    }

    // Destroy all charts
    destroyAllCharts() {
        this.charts.forEach((chart, canvasId) => {
            chart.destroy();
        });
        this.charts.clear();
    }

    // Get chart instance
    getChart(canvasId) {
        return this.charts.get(canvasId);
    }

    // Check if chart exists
    hasChart(canvasId) {
        return this.charts.has(canvasId);
    }

    // Animate chart entrance
    animateChartEntrance(canvasId, delay = 0) {
        const chart = this.charts.get(canvasId);
        if (chart) {
            setTimeout(() => {
                chart.update('active');
            }, delay);
        }
    }
}

// Export chart manager instance
const chartManager = new ChartManager();

// Chart creation utilities
function createTrafficChart() {
    return chartManager.createTrafficChart('trafficChart');
}

function createRankingChart() {
    return chartManager.createRankingChart('rankingChart');
}

function createKeywordChart() {
    return chartManager.createKeywordChart('keywordChart');
}

function createSEOGauge(score = 87) {
    const canvas = document.createElement('canvas');
    canvas.width = 120;
    canvas.height = 120;
    canvas.style.position = 'absolute';
    canvas.style.top = '50%';
    canvas.style.left = '50%';
    canvas.style.transform = 'translate(-50%, -50%)';
    canvas.style.zIndex = '1';
    
    const container = document.querySelector('.score-circle');
    if (container) {
        container.style.position = 'relative';
        container.appendChild(canvas);
    }
    
    return chartManager.createSEOGauge(canvas, score);
}

function createPerformanceChart() {
    return chartManager.createPerformanceChart('performanceChart');
}

function createCompetitionChart() {
    return chartManager.createCompetitionChart('competitionChart');
}

function createProgressChart() {
    return chartManager.createProgressChart('progressChart');
}

// Chart update utilities
function updateChart(canvasId, data) {
    return chartManager.updateChart(canvasId, data);
}

function destroyChart(canvasId) {
    return chartManager.destroyChart(canvasId);
}

function destroyAllCharts() {
    chartManager.destroyAllCharts();
}

// Real-time chart updates
function startRealTimeUpdates() {
    // Simulate real-time data updates
    setInterval(() => {
        const trafficChart = chartManager.getChart('trafficChart');
        if (trafficChart) {
            const currentData = trafficChart.data.datasets[0].data;
            const lastValue = currentData[currentData.length - 1];
            const newValue = lastValue + Math.floor(Math.random() * 100 - 50);
            currentData.push(Math.max(0, newValue));
            currentData.shift(); // Remove first element
            trafficChart.update('none');
        }
    }, 5000); // Update every 5 seconds
}

// Chart export utilities
function exportChartAsPNG(canvasId, filename = 'chart.png') {
    const chart = chartManager.getChart(canvasId);
    if (chart) {
        const url = chart.toBase64Image();
        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        link.click();
    }
}

function exportChartAsPDF(canvasId, filename = 'chart.pdf') {
    // This would require a PDF library like jsPDF
    console.log('PDF export requires additional library (jsPDF)');
}

// Chart theme utilities
function applyDarkTheme() {
    Chart.defaults.color = '#94A3B8';
    Chart.defaults.borderColor = '#334155';
}

function applyLightTheme() {
    Chart.defaults.color = '#374151';
    Chart.defaults.borderColor = '#D1D5DB';
}

// Initialize charts on screen load
function initializeCharts(screenName) {
    switch (screenName) {
        case 'dashboard':
            setTimeout(() => {
                createTrafficChart();
            }, 500);
            break;
            
        case 'report':
            setTimeout(() => {
                createRankingChart();
                createKeywordChart();
            }, 500);
            break;
            
        case 'analytics': // If you add an analytics screen later
            setTimeout(() => {
                createPerformanceChart();
                createCompetitionChart();
            }, 500);
            break;
    }
}

// Cleanup charts when leaving screen
function cleanupCharts(screenName) {
    // Keep charts that might be reused
    // Destroy charts specific to leaving screen if needed
}

// Make functions globally available
window.chartManager = chartManager;
window.createTrafficChart = createTrafficChart;
window.createRankingChart = createRankingChart;
window.createKeywordChart = createKeywordChart;
window.createSEOGauge = createSEOGauge;
window.createPerformanceChart = createPerformanceChart;
window.createCompetitionChart = createCompetitionChart;
window.createProgressChart = createProgressChart;
window.updateChart = updateChart;
window.destroyChart = destroyChart;
window.destroyAllCharts = destroyAllCharts;
window.startRealTimeUpdates = startRealTimeUpdates;
window.exportChartAsPNG = exportChartAsPNG;
window.exportChartAsPDF = exportChartAsPDF;
window.applyDarkTheme = applyDarkTheme;
window.applyLightTheme = applyLightTheme;
window.initializeCharts = initializeCharts;
window.cleanupCharts = cleanupCharts;