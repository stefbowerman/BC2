import SmoothScroll from 'smooth-scroll';
import { throttle } from 'throttle-debounce';
import BaseSection from './base';
import ProductDetailForm from '../product/productDetailForm';
import Drawer from '../uiComponents/drawer';
import * as Breakpoints from '../breakpoints';

const selectors = {
  sizeGuideDrawer: '[data-size-guide-drawer]',
  sizeGuideShow: '[data-size-guide-show]',
  productEssential: '[data-product-essential]',
  fixedDescription: '[data-fixed-description]',
  secondaryDescription: '[data-secondary-description]',
  secondaryDescriptionLink: '[data-secondary-description-link]'
};

const classes = {
  secondaryLinkHidden: 'is-hidden',
  hide: 'hide',
  bodySizeGuideOpen: 'size-guide-open'
};

const $window = $(window);
const $body = $(document.body);

export default class ProductSection extends BaseSection {
  constructor(container) {
    super(container, 'product');

    this.bpTabletMin       = Breakpoints.getBreakpointMinWidth('sm');
    this.bpDesktopMin      = Breakpoints.getBreakpointMinWidth('lg');
    this.smoothScroll      = new SmoothScroll();
    this.productDetailForm = new ProductDetailForm({
      $el: this.$container,
      $container: this.$container,
      enableHistoryState: false
    });

    this.productDetailForm.initialize();

    this.$productEssential         = $(selectors.productEssential, this.$container);
    this.$fixedDescription         = $(selectors.fixedDescription, this.$container);
    this.$secondaryDescription     = $(selectors.secondaryDescription, this.$container);
    this.$secondaryDescriptionLink = $(selectors.secondaryDescriptionLink, this.$container);
    this.$sizeGuideDrawerEl        = $(selectors.sizeGuideDrawer, this.$container);

    if (this.$sizeGuideDrawerEl.length) {
      this.drawer = new Drawer(this.$sizeGuideDrawerEl);

      this.$container.on('click', selectors.sizeGuideShow, (e) => {
        e.preventDefault();
        this.drawer.show();
      });

      this.$sizeGuideDrawerEl.on(this.drawer.events.SHOW, (e) => {
        $body.addClass(classes.bodySizeGuideOpen);
      });

      this.$sizeGuideDrawerEl.on(this.drawer.events.HIDDEN, (e) => {
        $body.removeClass(classes.bodySizeGuideOpen);
      });
    }

    // Description visibility stuff
    this.fixedFormFullHeight = null;
    this.fixedDescriptionHidden = false;
    this.secondaryDescriptionInView = false;

    $window.on('scroll', throttle(50, this.onScroll.bind(this)));
    $window.on('resize', throttle(50, this.onResize.bind(this)));
    this.$secondaryDescriptionLink.on('click', this.onSecondaryDescriptionLinkClick.bind(this));

    this.onResize();
    this.secondaryDescriptionCheck();
  }

  secondaryDescriptionCheck() {
    const triggerOffset = $window.scrollTop() + window.innerHeight - 100; // Make sure at least 100px of the description are in view
    this.secondaryDescriptionInView = (this.$secondaryDescription.offset().top < triggerOffset);

    if (this.secondaryDescriptionInView) {
      this.$secondaryDescriptionLink.addClass(classes.secondaryLinkHidden);
      // console.log('fixed description in view');
    }
    else {
      this.$secondaryDescriptionLink.removeClass(classes.secondaryLinkHidden);
      // console.log('fixed description NOT in view');
    }
  }

  onScroll() {
    this.secondaryDescriptionCheck();
  }

  onResize() {
    this.secondaryDescriptionCheck();

    if (this.fixedFormFullHeight === null && window.innerWidth >= this.bpDesktopMin) {
      this.fixedFormFullHeight = this.$productEssential.outerHeight();
    }

    if (this.fixedFormFullHeight) {
      if (window.innerHeight < this.fixedFormFullHeight && this.fixedDescriptionHidden === false) {
        this.$fixedDescription.addClass(classes.hide);
        this.$secondaryDescriptionLink.css('display', 'block');
        this.$secondaryDescription.css('display', 'block');
        this.fixedDescriptionHidden = true;
      }
      else if (window.innerHeight >= this.fixedFormFullHeight && this.fixedDescriptionHidden === true) {
        this.$fixedDescription.removeClass(classes.hide);
        this.$secondaryDescriptionLink.css('display', 'none');
        this.$secondaryDescription.css('display', '');
        this.fixedDescriptionHidden = false;
      }
    }

    if (window.innerWidth < this.bpDesktopMin && window.innerWidth >= this.bpTabletMin) {
      // If we don't have the fixed form full height that means we aren't above the 1200px breakpoint
      // but the secondary description is still visible so show the link to view it
      this.$secondaryDescriptionLink.css('display', 'block');
    }
  }

  onSecondaryDescriptionLinkClick(e) {
    e.preventDefault();

    if (this.secondaryDescriptionInView) return;

    const scrollToOffset = this.$secondaryDescription.offset().top - 80;
    
    this.smoothScroll.animateScroll(scrollToOffset, 0, {
      speed: 1000,
      durationMax: 1000,
      updateURL: false,
      popstate: false,
      easing: 'easeOutQuart'
    });
  }
}
