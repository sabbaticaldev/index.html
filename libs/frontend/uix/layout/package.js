import Accordion, { AccordionItem } from "./accordion.js";
import Block from "./block.js";
import Card, { CardBody, CardFooter, CardHeader } from "./card.js";
import Container from "./container.js";
import Divider from "./divider.js";
import Flex from "./flex.js";
import Grid from "./grid.js";
import List from "./list.js";
import Media from "./media.js";
import Spacer from "./spacer.js";
import Stack from "./stack.js";

const views = {
  "uix-grid": Grid,
  "uix-stack": Stack,
  "uix-flex": Flex,
  "uix-container": Container,
  "uix-media": Media,
  "uix-spacer": Spacer,
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
