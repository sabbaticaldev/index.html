import ContextMenu from "./context-menu.js";
import Modal from "./modal.js";
import Pagination from "./pagination.js";
import Tabs from "./tabs.js";
import Tooltip from "./tooltip.js";

export default {
  views: {
    "uix-modal": Modal,
    "uix-tooltip": Tooltip,
    "uix-tabs": Tabs,
    "uix-pagination": Pagination,
    "uix-context-menu": ContextMenu,
  },
};
