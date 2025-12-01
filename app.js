// Stock Span Analyzer - Enhanced JavaScript with Multi-Layer Particles
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components with proper error handling
    initializeParticles();
    initializeAOS();
    initializeThemeToggle();
    initializeFormHandlers();
    initializeSampleData();

    // Load sample data on page load for demonstration
    setTimeout(() => {
        loadSampleData();
    }, 2000);
});

// Enhanced Multi-Layer Particles Configuration
function initializeParticles() {
    // Check if particles.js is available
    if (typeof particlesJS !== 'undefined') {
        // Layer 1 - Main particles
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#20c997' },
                shape: { type: 'circle', stroke: { width: 0, color: '#000000' } },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: '#20c997', opacity: 0.4, width: 1 },
                move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
            },
            interactivity: {
                detect_on: 'canvas',
                events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
                modes: { repulse: { distance: 200, duration: 0.4 }, push: { particles_nb: 4 } }
            },
            retina_detect: true
        });

        // Layer 2 - Secondary particles
        particlesJS('particles-js-2', {
            particles: {
                number: { value: 40, density: { enable: true, value_area: 800 } },
                color: { value: '#0dcaf0' },
                shape: { type: 'triangle' },
                opacity: { value: 0.3, random: true },
                size: { value: 6, random: true },
                line_linked: { enable: false },
                move: { enable: true, speed: 1, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false }
            },
            interactivity: { detect_on: 'canvas', events: { resize: true } },
            retina_detect: true
        });

        // Layer 3 - Floating elements
        particlesJS('particles-js-3', {
            particles: {
                number: { value: 15, density: { enable: true, value_area: 1200 } },
                color: { value: '#ffffff' },
                shape: { type: 'circle' },
                opacity: { value: 0.6, random: true },
                size: { value: 8, random: true },
                line_linked: { enable: false },
                move: { enable: true, speed: 0.5, direction: 'top', random: false, straight: false, out_mode: 'out', bounce: true }
            },
            interactivity: { detect_on: 'canvas', events: { resize: true } },
            retina_detect: true
        });
    } else {
        // Fallback: Create CSS particles
        createCSSParticles();
    }
}

// CSS Particles Fallback
function createCSSParticles() {
    const particlesContainer = document.getElementById('particles-js');
    if (!particlesContainer) return;

    // Create 60 CSS particles
    for (let i = 0; i < 60; i++) {
        const particle = document.createElement('div');
        particle.className = 'css-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 6 + 2}px;
            height: ${Math.random() * 6 + 2}px;
            background: #20c997;
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.8 + 0.2};
            animation: float ${Math.random() * 15 + 10}s infinite linear;
            animation-delay: ${Math.random() * 5}s;
        `;
        particlesContainer.appendChild(particle);
    }
}

// AOS Animation Initialization
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            offset: 100
        });
    }
}

// Enhanced Theme Toggle Functionality
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const html = document.documentElement;

    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    function setTheme(theme) {
        html.setAttribute('data-bs-theme', theme);
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

        // Update particles color for theme
        updateParticlesTheme(theme);
    }

    function updateParticlesTheme(theme) {
        const primaryColor = theme === 'dark' ? '#20c997' : '#0d6efd';
        const secondaryColor = theme === 'dark' ? '#0dcaf0' : '#198754';

        // Update particle colors if particles.js is available
        if (window.pJSDom && window.pJSDom.length > 0) {
            // Update layer 1
            if (window.pJSDom[0]) {
                window.pJSDom[0].pJS.particles.color.value = primaryColor;
                window.pJSDom[0].pJS.particles.line_linked.color = primaryColor;
                window.pJSDom[0].pJS.fn.particlesRefresh();
            }
            // Update layer 2
            if (window.pJSDom[1]) {
                window.pJSDom[1].pJS.particles.color.value = secondaryColor;
                window.pJSDom[1].pJS.fn.particlesRefresh();
            }
        }

        // Update CSS particles
        const cssParticles = document.querySelectorAll('.css-particle');
        cssParticles.forEach(particle => {
            particle.style.background = primaryColor;
        });
    }
}

// Form Handlers
function initializeFormHandlers() {
    const stockForm = document.getElementById('stockForm');
    const computeBtn = document.getElementById('computeBtn');
    const pricesInput = document.getElementById('prices');

    stockForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const prices = pricesInput.value.trim();
        if (!prices) {
            showAlert('Please enter stock prices', 'warning');
            return;
        }

        // Parse and validate prices
        const priceArray = parseAndValidatePrices(prices);
        if (!priceArray) {
            showAlert('Please enter valid numeric prices separated by commas', 'danger');
            return;
        }

        // Show loading state
        setLoadingState(true);

        // Simulate processing delay
        setTimeout(() => {
            try {
                const result = calculateStockSpan(priceArray);
                displayResults(result);
                setLoadingState(false);
                showAlert('Stock span analysis completed successfully!', 'success');

                // Smooth scroll to results
                document.getElementById('results').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            } catch (error) {
                setLoadingState(false);
                showAlert('Error calculating stock span: ' + error.message, 'danger');
            }
        }, 1500);
    });

    // Auto-resize textarea
    pricesInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });
}

// Sample Data Initialization
function initializeSampleData() {
    const loadSampleBtn = document.getElementById('loadSampleBtn');
    loadSampleBtn.addEventListener('click', function() {
        loadSampleData();
    });
}

// Load Sample Data
function loadSampleData() {
    const samplePrices = [100, 80, 60, 70, 60, 75, 85];
    const pricesInput = document.getElementById('prices');

    pricesInput.value = samplePrices.join(', ');
-
    // Add animation to the input
    pricesInput.classList.add('success-pulse');
    setTimeout(() => {
        pricesInput.classList.remove('success-pulse');
    }, 800);

    // Auto-calculate for demo
    setTimeout(() => {
        const result = calculateStockSpan(samplePrices);
        displayResults(result);
        showAlert('Sample data loaded and analyzed!', 'info');
    }, 1000);
}

// Parse and Validate Prices
function parseAndValidatePrices(pricesString) {
    try {
        const prices = pricesString.split(',').map(price => {
            const num = parseFloat(price.trim());
            if (isNaN(num) || num <= 0) {
                throw new Error('Invalid price');
            }
            return num;
        });

        if (prices.length === 0) {
            throw new Error('No prices provided');
        }

        if (prices.length > 100) {
            throw new Error('Too many prices (maximum 100)');
        }

        return prices;
    } catch (error) {
        return null;
    }
}

// Stock Span Calculation Algorithm (Optimized Stack-based O(n))
function calculateStockSpan(prices) {
    if (!prices || prices.length === 0) {
        throw new Error('No prices provided');
    }

    const n = prices.length;
    const spans = new Array(n);
    const stack = [];

    for (let i = 0; i < n; i++) {
        // Pop elements from stack while stack is not empty and
        // price at top of stack is less than or equal to current price
        while (stack.length > 0 && prices[stack[stack.length - 1]] <= prices[i]) {
            stack.pop();
        }

        // If stack becomes empty, then price[i] is greater than all elements
        // to left of it, i.e., price[0], price[1], ..., price[i-1]
        spans[i] = stack.length === 0 ? i + 1 : i - stack[stack.length - 1];

        // Push this element to stack
        stack.push(i);
    }

    // Create result object
    const result = {
        prices: prices,
        spans: spans,
        days: Array.from({length: n}, (_, i) => i + 1)
    };

    return result;
}

// Display Results with Enhanced UI
function displayResults(data) {
    const resultsSection = document.getElementById('results');
    const resultsTable = document.getElementById('resultsTable').querySelector('tbody');

    // Clear existing results
    resultsTable.innerHTML = '';

    // Populate table with enhanced styling
    data.days.forEach((day, index) => {
        const row = document.createElement('tr');
        const span = data.spans[index];
        const price = data.prices[index];

        // Determine status based on span
        let statusBadge;
        if (span >= 5) {
            statusBadge = '<span class="status status--success">Strong Bullish</span>';
        } else if (span >= 3) {
            statusBadge = '<span class="status status--success">Bullish</span>';
        } else if (span >= 2) {
            statusBadge = '<span class="status status--warning">Neutral</span>';
        } else {
            statusBadge = '<span class="status status--error">Bearish</span>';
        }

        row.innerHTML = `
            <td><strong>Day ${day}</strong></td>
            <td><strong>₹${price.toFixed(2)}</strong></td>
            <td><strong>${span}</strong></td>
            <td>${statusBadge}</td>
        `;

        resultsTable.appendChild(row);
    });

    // Calculate and display summary statistics
    const maxSpan = Math.max(...data.spans);
    const avgSpan = (data.spans.reduce((a, b) => a + b, 0) / data.spans.length).toFixed(2);
    const totalDays = data.days.length;

    document.getElementById('maxSpan').textContent = maxSpan;
    document.getElementById('avgSpan').textContent = avgSpan;
    document.getElementById('totalDays').textContent = totalDays;

    // Show results section with animation
    resultsSection.classList.remove('d-none');
    resultsSection.style.opacity = '0';
    resultsSection.style.transform = 'translateY(30px)';

    setTimeout(() => {
        resultsSection.style.transition = 'all 0.6s ease';
        resultsSection.style.opacity = '1';
        resultsSection.style.transform = 'translateY(0)';
    }, 100);

    // Create chart with delay to ensure proper rendering
    setTimeout(() => {
        createChart(data);
    }, 300);
}

// Enhanced Chart Creation using Chart.js
function createChart(data) {
    const chartCanvas = document.getElementById('stockChart');
    if (!chartCanvas) return;

    const ctx = chartCanvas.getContext('2d');

    // Destroy existing chart if it exists
    if (window.stockChartInstance) {
        window.stockChartInstance.destroy();
    }

    // Create new chart
    window.stockChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.days.map(day => `Day ${day}`),
            datasets: [
                {
                    label: 'Stock Price (₹)',
                    data: data.prices,
                    borderColor: '#20c997',
                    backgroundColor: 'rgba(32, 201, 151, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#20c997',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                {
                    label: 'Stock Span',
                    data: data.spans,
                    borderColor: '#0dcaf0',
                    backgroundColor: 'rgba(13, 202, 240, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#0dcaf0',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Stock Price and Span Analysis',
                    color: '#ffffff',
                    font: { size: 16, weight: 'bold' }
                },
                legend: {
                    labels: { color: '#ffffff', font: { size: 14 } }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#20c997',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#ffffff' },
                    title: {
                        display: true,
                        text: 'Trading Days',
                        color: '#ffffff',
                        font: { size: 14, weight: 'bold' }
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#ffffff' },
                    title: {
                        display: true,
                        text: 'Stock Price (₹)',
                        color: '#ffffff',
                        font: { size: 14, weight: 'bold' }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: { drawOnChartArea: false },
                    ticks: { color: '#ffffff' },
                    title: {
                        display: true,
                        text: 'Stock Span',
                        color: '#ffffff',
                        font: { size: 14, weight: 'bold' }
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Loading State Management
function setLoadingState(isLoading) {
    const computeBtn = document.getElementById('computeBtn');
    const btnText = computeBtn.querySelector('.btn-text');
    const spinner = computeBtn.querySelector('.spinner-border');

    if (isLoading) {
        btnText.textContent = 'Computing...';
        spinner.classList.remove('d-none');
        computeBtn.disabled = true;
    } else {
        btnText.textContent = 'Compute Span';
        spinner.classList.add('d-none');
        computeBtn.disabled = false;
    }
}

// Alert System
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    const alertId = 'alert-' + Date.now();

    const alertHTML = `
        <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show" role="alert">
            <i class="fas fa-${getAlertIcon(type)} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    alertContainer.insertAdjacentHTML('beforeend', alertHTML);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        const alertElement = document.getElementById(alertId);
        if (alertElement) {
            alertElement.remove();
        }
    }, 5000);
}

function getAlertIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'danger': return 'exclamation-triangle';
        case 'warning': return 'exclamation-circle';
        case 'info': return 'info-circle';
        default: return 'info-circle';
    }
}

// Smooth scrolling for navigation links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add scroll effect to navigation
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.15)';
        navbar.style.backdropFilter = 'blur(25px)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.08)';
        navbar.style.backdropFilter = 'blur(20px)';
    }
});