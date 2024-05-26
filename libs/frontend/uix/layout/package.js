import Accordion from "./accordion.js";
import Block from "./block.js";
import Card from "./card.js";
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
  "uix-card": Card,
};

export default {
  views,
};
