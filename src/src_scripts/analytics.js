class Analytics {
  gaLoaded() {
    return (typeof window.ga !== 'undefined');
  }

  trackEvent({ category, action, label, value, nonInteraction }) {
    const fields = {
      hitType: 'event',
      eventCategory: category,
      eventAction: action,
      eventLabel: label
    };

    // GA only accepts integers for this...
    if (typeof value === 'number') {
      fields.eventValue = value;
    }

    if (typeof nonInteraction !== 'undefined') {
      fields.nonInteraction = nonInteraction;
    }

    window.ga && window.ga('send', fields);
  }

  trackEventWithRetry(params) {
    let tries = 0;
    const wait = 1e3;

    const t = () => {
      this.trackEvent(params);
    };

    const checkWithRetry = () => {
      if (this.gaLoaded()) {
        t();
      }
      else {
        if (tries < 6) {
          setTimeout(checkWithRetry, wait);
        }
        else {
          // GA not loaded after 6 secs..
        }
      }

      tries++;
    };

    checkWithRetry();
  }

  trackPageView(path) {
    if (this.gaLoaded()) {
      window.ga('set', 'page', path);
      window.ga('send', 'pageview');
    }
  }
}

export default new Analytics();
