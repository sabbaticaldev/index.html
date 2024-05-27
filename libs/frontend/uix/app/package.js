import AppShell from "./app-shell.js";
import FeatureBlock from "./feature-block.js";
import FeatureList from "./feature-list.js";
import Footer from "./footer.js";
import Header from "./header.js";
import Hero from "./hero.js";
import PricingTable from "./pricing-table.js";
import Router from "./router.js";
import Stats from "./stats.js";
import Testimonial from "./testimonial.js";

export default {
  i18n: {},
  views: {
    "uix-app-shell": AppShell,
    "uix-router": Router,
    "uix-feature-block": FeatureBlock,
    "uix-feature-list": FeatureList,
    "uix-footer": Footer,
    "uix-header": Header,
    "uix-hero": Hero,
    "uix-pricing-table": PricingTable,
    "uix-stats": Stats,
    "uix-testimonial": Testimonial,
  },
};
