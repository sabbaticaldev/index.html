import Breadcrumb from "./breadcrumb.js";
import ContextMenu from "./context-menu.js";
import Drawer from "./drawer±.js";
import Modal from "./modal.js";
import Pagination from "./pagination.js";
import Stepper from "./stepper.js";
import Tabs from "./tabs.js";
import Tooltip from "./tooltip.js";
import Wizard from "./wizard.js";

export default {
  views: {
    "uix-modal": Modal,
    "uix-tooltip": Tooltip,
    "uix-tabs": Tabs,
    "uix-pagination": Pagination,
    "uix-context-menu": ContextMenu,
    "uix-breadcrumb": Breadcrumb,
    "uix-drawer": Drawer,
    "uix-stepper": Stepper,
    "uix-wizard": Wizard,
  },
};
