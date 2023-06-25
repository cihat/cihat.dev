export interface IRandomPhoto {
  id:                       string;
  slug:                     string;
  created_at:               Date;
  updated_at:               Date;
  promoted_at:              Date;
  width:                    number;
  height:                   number;
  color:                    string;
  blur_hash:                string;
  description:              null;
  alt_description:          string;
  urls:                     Urls;
  links:                    IRandomPhotoLinks;
  likes:                    number;
  liked_by_user:            boolean;
  current_user_collections: any[];
  sponsorship:              null;
  topic_submissions:        TopicSubmissions;
  user:                     User;
  exif:                     Exif;
  location:                 Location;
  meta:                     Meta;
  public_domain:            boolean;
  tags:                     Tag[];
  tags_preview:             Tag[];
  views:                    number;
  downloads:                number;
  topics:                   any[];
}

interface Exif {
  make:          null;
  model:         null;
  name:          null;
  exposure_time: null;
  aperture:      null;
  focal_length:  null;
  iso:           null;
}

interface IRandomPhotoLinks {
  self:              string;
  html:              string;
  download:          string;
  download_location: string;
}

interface Location {
  name:     null;
  city:     null;
  country:  null;
  position: Position;
}

interface Position {
  latitude:  number;
  longitude: number;
}

interface Meta {
  index: boolean;
}

interface Tag {
  type:    Type;
  title:   string;
  source?: null[];
}

enum Type {
  LandingPage = "landing_page",
  Search = "search",
}

interface TopicSubmissions {
}

interface Urls {
  raw:      string;
  full:     string;
  regular:  string;
  small:    string;
  thumb:    string;
  small_s3: string;
}

interface User {
  id:                 string;
  updated_at:         Date;
  username:           string;
  name:               string;
  first_name:         string;
  last_name:          string;
  twitter_username:   string;
  portfolio_url:      string;
  bio:                string;
  location:           string;
  links:              UserLinks;
  profile_image:      ProfileImage;
  instagram_username: string;
  total_collections:  number;
  total_likes:        number;
  total_photos:       number;
  accepted_tos:       boolean;
  for_hire:           boolean;
  social:             Social;
}

interface UserLinks {
  self:      string;
  html:      string;
  photos:    string;
  likes:     string;
  portfolio: string;
  following: string;
  followers: string;
}

interface ProfileImage {
  small:  string;
  medium: string;
  large:  string;
}

interface Social {
  instagram_username: string;
  portfolio_url:      string;
  twitter_username:   string;
  paypal_email:       null;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
class Convert {
  public static toIRandomPhoto(json: string): IRandomPhoto {
      return cast(JSON.parse(json), r("IRandomPhoto"));
  }

  public static iRandomPhotoToJson(value: IRandomPhoto): string {
      return JSON.stringify(uncast(value, r("IRandomPhoto")), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
  const prettyTyp = prettyTypeName(typ);
  const parentText = parent ? ` on ${parent}` : '';
  const keyText = key ? ` for key "${key}"` : '';
  throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
  if (Array.isArray(typ)) {
      if (typ.length === 2 && typ[0] === undefined) {
          return `an optional ${prettyTypeName(typ[1])}`;
      } else {
          return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
      }
  } else if (typeof typ === "object" && typ.literal !== undefined) {
      return typ.literal;
  } else {
      return typeof typ;
  }
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
      const map: any = {};
      typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
      typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
      const map: any = {};
      typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
      typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
  function transformPrimitive(typ: string, val: any): any {
      if (typeof typ === typeof val) return val;
      return invalidValue(typ, val, key, parent);
  }

  function transformUnion(typs: any[], val: any): any {
      // val must validate against one typ in typs
      const l = typs.length;
      for (let i = 0; i < l; i++) {
          const typ = typs[i];
          try {
              return transform(val, typ, getProps);
          } catch (_) {}
      }
      return invalidValue(typs, val, key, parent);
  }

  function transformEnum(cases: string[], val: any): any {
      if (cases.indexOf(val) !== -1) return val;
      return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
  }

  function transformArray(typ: any, val: any): any {
      // val must be an array with no invalid elements
      if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
      return val.map(el => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
      if (val === null) {
          return null;
      }
      const d = new Date(val);
      if (isNaN(d.valueOf())) {
          return invalidValue(l("Date"), val, key, parent);
      }
      return d;
  }

  function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
      if (val === null || typeof val !== "object" || Array.isArray(val)) {
          return invalidValue(l(ref || "object"), val, key, parent);
      }
      const result: any = {};
      Object.getOwnPropertyNames(props).forEach(key => {
          const prop = props[key];
          const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
          result[prop.key] = transform(v, prop.typ, getProps, key, ref);
      });
      Object.getOwnPropertyNames(val).forEach(key => {
          if (!Object.prototype.hasOwnProperty.call(props, key)) {
              result[key] = transform(val[key], additional, getProps, key, ref);
          }
      });
      return result;
  }

  if (typ === "any") return val;
  if (typ === null) {
      if (val === null) return val;
      return invalidValue(typ, val, key, parent);
  }
  if (typ === false) return invalidValue(typ, val, key, parent);
  let ref: any = undefined;
  while (typeof typ === "object" && typ.ref !== undefined) {
      ref = typ.ref;
      typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === "object") {
      return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
          : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
          : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
          : invalidValue(typ, val, key, parent);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== "number") return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
  return { literal: typ };
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  "IRandomPhoto": o([
      { json: "id", js: "id", typ: "" },
      { json: "slug", js: "slug", typ: "" },
      { json: "created_at", js: "created_at", typ: Date },
      { json: "updated_at", js: "updated_at", typ: Date },
      { json: "promoted_at", js: "promoted_at", typ: Date },
      { json: "width", js: "width", typ: 0 },
      { json: "height", js: "height", typ: 0 },
      { json: "color", js: "color", typ: "" },
      { json: "blur_hash", js: "blur_hash", typ: "" },
      { json: "description", js: "description", typ: null },
      { json: "alt_description", js: "alt_description", typ: "" },
      { json: "urls", js: "urls", typ: r("Urls") },
      { json: "links", js: "links", typ: r("IRandomPhotoLinks") },
      { json: "likes", js: "likes", typ: 0 },
      { json: "liked_by_user", js: "liked_by_user", typ: true },
      { json: "current_user_collections", js: "current_user_collections", typ: a("any") },
      { json: "sponsorship", js: "sponsorship", typ: null },
      { json: "topic_submissions", js: "topic_submissions", typ: r("TopicSubmissions") },
      { json: "user", js: "user", typ: r("User") },
      { json: "exif", js: "exif", typ: r("Exif") },
      { json: "location", js: "location", typ: r("Location") },
      { json: "meta", js: "meta", typ: r("Meta") },
      { json: "public_domain", js: "public_domain", typ: true },
      { json: "tags", js: "tags", typ: a(r("Tag")) },
      { json: "tags_preview", js: "tags_preview", typ: a(r("Tag")) },
      { json: "views", js: "views", typ: 0 },
      { json: "downloads", js: "downloads", typ: 0 },
      { json: "topics", js: "topics", typ: a("any") },
  ], false),
  "Exif": o([
      { json: "make", js: "make", typ: null },
      { json: "model", js: "model", typ: null },
      { json: "name", js: "name", typ: null },
      { json: "exposure_time", js: "exposure_time", typ: null },
      { json: "aperture", js: "aperture", typ: null },
      { json: "focal_length", js: "focal_length", typ: null },
      { json: "iso", js: "iso", typ: null },
  ], false),
  "IRandomPhotoLinks": o([
      { json: "self", js: "self", typ: "" },
      { json: "html", js: "html", typ: "" },
      { json: "download", js: "download", typ: "" },
      { json: "download_location", js: "download_location", typ: "" },
  ], false),
  "Location": o([
      { json: "name", js: "name", typ: null },
      { json: "city", js: "city", typ: null },
      { json: "country", js: "country", typ: null },
      { json: "position", js: "position", typ: r("Position") },
  ], false),
  "Position": o([
      { json: "latitude", js: "latitude", typ: 0 },
      { json: "longitude", js: "longitude", typ: 0 },
  ], false),
  "Meta": o([
      { json: "index", js: "index", typ: true },
  ], false),
  "Tag": o([
      { json: "type", js: "type", typ: r("Type") },
      { json: "title", js: "title", typ: "" },
      { json: "source", js: "source", typ: u(undefined, a(null)) },
  ], false),
  "TopicSubmissions": o([
  ], false),
  "Urls": o([
      { json: "raw", js: "raw", typ: "" },
      { json: "full", js: "full", typ: "" },
      { json: "regular", js: "regular", typ: "" },
      { json: "small", js: "small", typ: "" },
      { json: "thumb", js: "thumb", typ: "" },
      { json: "small_s3", js: "small_s3", typ: "" },
  ], false),
  "User": o([
      { json: "id", js: "id", typ: "" },
      { json: "updated_at", js: "updated_at", typ: Date },
      { json: "username", js: "username", typ: "" },
      { json: "name", js: "name", typ: "" },
      { json: "first_name", js: "first_name", typ: "" },
      { json: "last_name", js: "last_name", typ: "" },
      { json: "twitter_username", js: "twitter_username", typ: "" },
      { json: "portfolio_url", js: "portfolio_url", typ: "" },
      { json: "bio", js: "bio", typ: "" },
      { json: "location", js: "location", typ: "" },
      { json: "links", js: "links", typ: r("UserLinks") },
      { json: "profile_image", js: "profile_image", typ: r("ProfileImage") },
      { json: "instagram_username", js: "instagram_username", typ: "" },
      { json: "total_collections", js: "total_collections", typ: 0 },
      { json: "total_likes", js: "total_likes", typ: 0 },
      { json: "total_photos", js: "total_photos", typ: 0 },
      { json: "accepted_tos", js: "accepted_tos", typ: true },
      { json: "for_hire", js: "for_hire", typ: true },
      { json: "social", js: "social", typ: r("Social") },
  ], false),
  "UserLinks": o([
      { json: "self", js: "self", typ: "" },
      { json: "html", js: "html", typ: "" },
      { json: "photos", js: "photos", typ: "" },
      { json: "likes", js: "likes", typ: "" },
      { json: "portfolio", js: "portfolio", typ: "" },
      { json: "following", js: "following", typ: "" },
      { json: "followers", js: "followers", typ: "" },
  ], false),
  "ProfileImage": o([
      { json: "small", js: "small", typ: "" },
      { json: "medium", js: "medium", typ: "" },
      { json: "large", js: "large", typ: "" },
  ], false),
  "Social": o([
      { json: "instagram_username", js: "instagram_username", typ: "" },
      { json: "portfolio_url", js: "portfolio_url", typ: "" },
      { json: "twitter_username", js: "twitter_username", typ: "" },
      { json: "paypal_email", js: "paypal_email", typ: null },
  ], false),
  "Type": [
      "landing_page",
      "search",
  ],
};