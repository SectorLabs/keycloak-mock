import { ClientRequest } from "http";
import { ReplyFnResult as NockClientResponse } from "nock";

import { MockInstance } from "./instance";
import { MockUser } from "./database";

export type NockClientRequest = ClientRequest & {
  user?: MockUser | null;
  headers: Record<string, string>;
};

export type ViewFn = (
  instance: MockInstance,
  request: NockClientRequest
) => NockClientResponse;

export type PostViewFn = (
  instance: MockInstance,
  request: NockClientRequest,
  body: Record<string, any>
) => NockClientResponse;

export type MiddlewareFn = (
  instance: MockInstance,
  request: NockClientRequest
) => Promise<void>;
