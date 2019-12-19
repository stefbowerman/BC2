// Used by the index / page view to initialize whatever sections are found on there

import CollectionSection from './sections/collection';
import ContactSection from './sections/contact';
import SubscribeSection from './sections/subscribe';
import StockistsSection from './sections/stockists';

export default {
  collection: CollectionSection,
  contact: ContactSection,
  subscribe: SubscribeSection,
  stockists: StockistsSection
};
