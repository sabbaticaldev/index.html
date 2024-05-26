import Accordion, { AccordionItem } from "./accordion.js";
import Block from "./block.js";
import Card, { CardBody, CardFooter, CardHeader } from "./card.js";
import Divider from "./divider.js";
import List from "./list.js";

const theme = (userTheme, props) => ({
  "uix-block": { spacing: props.SpacingSizes, variant: props.BaseVariants },
  "uix-list": {
    _base: "flex",
    spacing: props.SpacingSizes,
    gap: props.Gaps,
    justify: props.JustifyContent,
    full: ({ vertical }) => ({ true: vertical ? "w-full" : "h-full" }),
    vertical: { true: "flex-col" },
    responsive: ({ vertical }) => ({
      true: vertical ? "lg:flex-col sm:flex-row" : "sm:flex-col lg:flex-row",
    }),
    reverse: ({ vertical }) => ({
      true: vertical ? "flex-col-reverse" : "flex-row-reverse",
    }),
  },
  "uix-divider": "flex items-center my-2",
  "uix-divider__border": "border-t border-gray-400 flex-grow",
  "uix-divider__label": "px-3 text-gray-800 font-bold text-2xl",
});

export default {
  theme,
  views: {
    "uix-block": Block,
    "uix-list": List,
    "uix-divider": Divider,
    "uix-accordion": Accordion,
    "uix-accordion-item": AccordionItem,
    "uix-card": Card,
    "uix-card-header": CardHeader,
    "uix-card-body": CardBody,
    "uix-card-footer": CardFooter,
  },
};
