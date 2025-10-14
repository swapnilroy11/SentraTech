/**
 * Web Worker for Heavy Computations
 * Offloads CPU-intensive tasks to keep main thread smooth
 */

// Handle messages from main thread
self.onmessage = function(e) {
  const { data, type, id } = e.data;

  try {
    let result;

    switch (type) {
      case 'ROI_CALCULATION':
        result = calculateROI(data);
        break;
      
      case 'DATA_PROCESSING':
        result = processLargeDataset(data);
        break;
      
      case 'ANIMATION_CALCULATIONS':
        result = calculateAnimationFrames(data);
        break;
      
      case 'IMAGE_PROCESSING':
        result = processImageData(data);
        break;

      default:
        throw new Error(`Unknown computation type: ${type}`);
    }

    // Send result back to main thread
    self.postMessage({
      id: id,
      result: result,
      success: true
    });

  } catch (error) {
    // Send error back to main thread
    self.postMessage({
      id: id,
      error: error.message,
      success: false
    });
  }
};

// ROI Calculation functions
function calculateROI(params) {
  const {
    callVolume,
    interactionVolume,
    currentCostPerCall,
    targetAutomationRate,
    costReductionRate,
    implementationCost
  } = params;

  const totalVolume = callVolume + interactionVolume;
  const currentMonthlyCost = totalVolume * currentCostPerCall;
  const currentYearlyCost = currentMonthlyCost * 12;

  // Calculate savings with automation
  const automatedVolume = totalVolume * (targetAutomationRate / 100);
  const remainingManualVolume = totalVolume - automatedVolume;
  
  const automatedCostPerCall = currentCostPerCall * (1 - costReductionRate / 100);
  const newMonthlyCost = (automatedVolume * automatedCostPerCall) + 
                        (remainingManualVolume * currentCostPerCall);
  
  const monthlySavings = currentMonthlyCost - newMonthlyCost;
  const yearlySavings = monthlySavings * 12;
  const netSavings = yearlySavings - implementationCost;
  
  const roi = ((yearlySavings - implementationCost) / implementationCost) * 100;
  const paybackPeriod = implementationCost / monthlySavings;

  return {
    currentMonthlyCost: Math.round(currentMonthlyCost),
    currentYearlyCost: Math.round(currentYearlyCost),
    newMonthlyCost: Math.round(newMonthlyCost),
    monthlySavings: Math.round(monthlySavings),
    yearlySavings: Math.round(yearlySavings),
    netSavings: Math.round(netSavings),
    roi: Math.round(roi * 100) / 100,
    paybackPeriod: Math.round(paybackPeriod * 10) / 10,
    automationRate: targetAutomationRate,
    costReduction: costReductionRate
  };
}

// Process large datasets efficiently
function processLargeDataset(data) {
  const { dataset, operation } = data;
  
  switch (operation) {
    case 'SORT':
      return dataset.sort((a, b) => a.timestamp - b.timestamp);
    
    case 'FILTER':
      return dataset.filter(item => item.active === true);
    
    case 'AGGREGATE':
      return dataset.reduce((acc, item) => {
        acc.total += item.value;
        acc.count += 1;
        return acc;
      }, { total: 0, count: 0 });
    
    case 'TRANSFORM':
      return dataset.map(item => ({
        ...item,
        processedAt: Date.now(),
        normalized: item.value / dataset.length
      }));
    
    default:
      return dataset;
  }
}

// Calculate animation frames for complex animations
function calculateAnimationFrames(params) {
  const { duration, easing, fromValue, toValue, fps = 60 } = params;
  
  const frameCount = Math.ceil(duration / 1000 * fps);
  const frames = [];
  
  for (let i = 0; i <= frameCount; i++) {
    const progress = i / frameCount;
    const easedProgress = applyEasing(progress, easing);
    const value = fromValue + (toValue - fromValue) * easedProgress;
    
    frames.push({
      frame: i,
      progress: progress,
      value: value,
      timestamp: i * (1000 / fps)
    });
  }
  
  return frames;
}

// Apply easing functions
function applyEasing(t, easing) {
  switch (easing) {
    case 'linear':
      return t;
    
    case 'easeInQuad':
      return t * t;
    
    case 'easeOutQuad':
      return t * (2 - t);
    
    case 'easeInOutQuad':
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    
    case 'easeInCubic':
      return t * t * t;
    
    case 'easeOutCubic':
      return --t * t * t + 1;
    
    case 'easeInOutCubic':
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    
    case 'easeInQuart':
      return t * t * t * t;
    
    case 'easeOutQuart':
      return 1 - (--t) * t * t * t;
    
    case 'easeInOutQuart':
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    
    default:
      return t; // fallback to linear
  }
}

// Process image data (for future image optimization features)
function processImageData(data) {
  const { imageData, operation } = data;
  
  switch (operation) {
    case 'RESIZE':
      // Placeholder for image resize logic
      return { ...imageData, resized: true };
    
    case 'COMPRESS':
      // Placeholder for image compression logic
      return { ...imageData, compressed: true };
    
    case 'FORMAT_CONVERT':
      // Placeholder for format conversion logic
      return { ...imageData, converted: true };
    
    default:
      return imageData;
  }
}

// Error handling for uncaught exceptions
self.onerror = function(error) {
  console.error('Worker error:', error);
  self.postMessage({
    error: error.message,
    success: false
  });
};

// Handle worker termination
self.onbeforeunload = function() {
  // Cleanup any ongoing operations
  console.log('Worker terminating...');
};