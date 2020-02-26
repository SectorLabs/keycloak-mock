import { ViewFn } from "./types";

import { MockInstance } from "../instance";

const listCertificates: ViewFn = (instance, request) => {
  return Promise.resolve([200, instance.store.toJSON(false)]);
};

export default listCertificates;
