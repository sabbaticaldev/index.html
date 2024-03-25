import { T } from "brazuka";

export default {
  users: {
    id: T.string({ primary: true }),
    name: T.string(),
    avatar: T.string(),
    phoneNumber: T.string(),
    _initialData: [],
  },
  posts: {
    id: T.string({ primary: true }),
    type: T.string(), // e.g., 'event', 'service', 'product'
    content: T.string(),
    timestamp: T.date(),
    author: T.one("users"),
    _initialData: [],
  },
  announcements: {
    id: T.string({ primary: true }),
    messageType: T.string(), // Corresponds to post types, e.g., 'event', 'service', 'product'
    time: T.date(),
    content: T.string(), // Template or predefined content for the message
    _initialData: [],
  },
  sesions: {
    id: T.string({ primary: true }),
    phone: T.string(),
    sessionData: T.object(), // Stores session data after QR code scan
    _initialData: [],
  },
};
