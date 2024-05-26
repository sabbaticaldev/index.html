import Accordion, { AccordionItem } from "./accordion.js";
import Block from "./block.js";
import Card, { CardBody, CardFooter, CardHeader } from "./card.js";
import Divider from "./divider.js";
import List from "./list.js";

const views = {
  "uix-block": Block,
  "uix-list": List,
  "uix-divider": Divider,
  "uix-accordion": Accordion,
  "uix-accordion-item": AccordionItem,
  "uix-card": Card,
  "uix-card-header": CardHeader,
  "uix-card-body": CardBody,
  "uix-card-footer": CardFooter,
};

export default {
  views,
};
