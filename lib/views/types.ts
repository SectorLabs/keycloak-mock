import { ClientRequest } from "http";
import { ReplyFnResult as NockClientResponse } from "nock";

import { MockInstance } from "../instance";

type NockClientRequest = ClientRequest & {
  headers: Record<string, string>;
};

export type ViewFn = (
  instance: MockInstance,
  request: NockClientRequest
) => Promise<NockClientResponse>;
