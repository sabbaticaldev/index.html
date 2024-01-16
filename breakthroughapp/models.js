import { T } from "brazuka";

export default {
  practitioners: {
    name: T.string({ primary: true }),
    avatar: T.string(),
    paths: T.many("paths", "practitioner"),
    _initialData: [], // Initial practitioner data can be populated here
  },
  paths: {
    title: T.string({ primary: true }),
    description: T.string(),
    difficulty: T.string(),
    practitioner: T.one("practitioners", "paths"),
    realms: T.many("realms", "path"),
    _initialData: [], // Initial cultivation paths data can be populated here
  },
  realms: {
    title: T.string({ primary: true }),
    description: T.string(),
    completed: T.boolean({ defaultValue: false }),
    path: T.one("paths", "realms"),
    breakthroughs: T.many("breakthroughs", "realm"),
    _initialData: [], // Initial cultivation realms data can be populated here
  },
  breakthroughs: {
    update: T.string(),
    date: T.date(),
    realm: T.one("realms", "breakthroughs"),
    _initialData: [], // Initial breakthrough updates can be populated here
  },
};
