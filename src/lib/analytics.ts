/**
 * Analytics utility for tracking user interactions
 * Sends events to both Microsoft Clarity and Google Analytics 4
 * 
 * NOTE: Analytics is DISABLED in development mode to avoid polluting production data
 */

// Declare global types for analytics
declare global {
  interface Window {
    clarity?: (action: string, ...args: string[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Check if we should track (only in production)
 */
function shouldTrack(): boolean {
  return !import.meta.env.DEV;
}

/**
 * Track a custom event to both Clarity and GA4
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  // Always log to console for debugging (both dev and production)
  console.log('[Analytics]', eventName, params);

  // Only send to analytics services in production
  if (!shouldTrack()) {
    return;
  }

  // Google Analytics 4
  if (window.gtag) {
    window.gtag('event', eventName, params);
  }

  // Microsoft Clarity - custom tags
  if (window.clarity) {
    window.clarity('set', eventName, JSON.stringify(params ?? {}));
  }
}

// ============================================
// Pre-defined events for the Thirukkural app
// ============================================

/**
 * Track when user selects Practice or Competition mode
 */
export function trackModeSelection(mode: 'practice' | 'competition', group: string) {
  trackEvent('mode_selection', {
    mode,
    group,
  });
}

/**
 * Track when user selects a group (பிரிவு 2 or 3)
 */
export function trackGroupSelection(group: string, mode: 'practice' | 'competition') {
  trackEvent('group_selection', {
    group,
    mode,
  });
}

/**
 * Track when timer starts
 */
export function trackTimerStart(topic: string, group: string) {
  trackEvent('timer_start', {
    topic,
    group,
  });
}

/**
 * Track when timer stops/expires
 */
export function trackTimerEnd(topic: string, group: string, questionsAnswered: number) {
  trackEvent('timer_end', {
    topic,
    group,
    questions_answered: questionsAnswered,
  });
}

/**
 * Track topic change
 */
export function trackTopicChange(topic: string, group: string) {
  trackEvent('topic_change', {
    topic,
    group,
  });
}

/**
 * Track navigation (next/previous question)
 */
export function trackNavigation(direction: 'next' | 'previous', topic: string) {
  trackEvent('question_navigation', {
    direction,
    topic,
  });
}

/**
 * Track when user views answer
 */
export function trackAnswerView(topic: string) {
  trackEvent('answer_view', {
    topic,
  });
}

/**
 * Track competition round change
 */
export function trackRoundChange(round: number, group: string) {
  trackEvent('round_change', {
    round,
    group,
  });
}

/**
 * Track competition completion
 */
export function trackCompetitionComplete(group: string, totalScore: number) {
  trackEvent('competition_complete', {
    group,
    total_score: totalScore,
  });
}

/**
 * Track when user clicks home/sign out
 */
export function trackSignOut(mode: 'practice' | 'competition', confirmed: boolean) {
  trackEvent('sign_out', {
    mode,
    confirmed,
  });
}
