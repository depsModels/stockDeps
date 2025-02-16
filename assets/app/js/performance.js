// Performance Monitoring Script
const PerformanceMonitor = {
    metrics: {},
    
    // Start timing a specific operation
    startTimer: function(operationName) {
        this.metrics[operationName] = {
            startTime: performance.now()
        };
    },

    // End timing and calculate duration
    endTimer: function(operationName) {
        if (this.metrics[operationName]) {
            const endTime = performance.now();
            const duration = endTime - this.metrics[operationName].startTime;
            this.metrics[operationName].duration = duration;
            this.metrics[operationName].endTime = endTime;
            console.log(`${operationName} took ${duration.toFixed(2)}ms`);
            return duration;
        }
        return 0;
    },

    // Measure page load metrics
    measurePageLoad: function() {
        window.addEventListener('load', () => {
            const pageLoadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
            const domLoadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
            
            console.log('Performance Metrics:');
            console.log(`Page Load Time: ${pageLoadTime}ms`);
            console.log(`DOM Load Time: ${domLoadTime}ms`);
            
            // Get resource timing data
            const resources = window.performance.getEntriesByType('resource');
            const jsFiles = resources.filter(r => r.name.endsWith('.js'));
            
            console.log('\nJavaScript File Load Times:');
            jsFiles.forEach(file => {
                console.log(`${file.name.split('/').pop()}: ${file.duration.toFixed(2)}ms`);
            });
        });
    },

    // Measure function execution time
    measureFunction: function(fn, fnName) {
        return function(...args) {
            const start = performance.now();
            const result = fn.apply(this, args);
            const end = performance.now();
            console.log(`${fnName} took ${(end - start).toFixed(2)}ms`);
            return result;
        };
    },

    // Clear all metrics
    clearMetrics: function() {
        this.metrics = {};
    }
};

// Initialize performance monitoring
PerformanceMonitor.measurePageLoad();
