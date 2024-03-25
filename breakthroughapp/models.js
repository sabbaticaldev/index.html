import { T } from "brazuka";

export default {
  practitioners: {
    name: T.string({ primary: true }),
    avatar: T.string(),
    paths: T.many("paths", "practitioner"),
    _initialData: [],
  },
  paths: {
    title: T.string({ primary: true }),
    description: T.string(),
    difficulty: T.string(),
    practitioner: T.one("practitioners", "paths"),
    realms: T.many("realms", "path"),
    _initialData: [],
  },
  realms: {
    title: T.string({ primary: true }),
    description: T.string(),
    completed: T.boolean({ defaultValue: false }),
    path: T.one("paths", "realms"),
    breakthroughs: T.many("breakthroughs", "realm"),
    _initialData: [],
  },
  breakthroughs: {
    update: T.string(),
    date: T.date(),
    realm: T.one("realms", "breakthroughs"),
    _initialData: [],
  },

  todo: {
    title: T.string(),
    completed: T.boolean(),
  },
};
