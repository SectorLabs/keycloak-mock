import { ClientRequest } from "http";
import { ReplyFnResult as NockClientResponse } from "nock";

import { MockInstance } from "./instance";
import { MockUserProfile } from "./database";

type NockClientRequest = ClientRequest & {
  user?: MockUserProfile | null;
  headers: Record<string, string>;
};

export type ViewFn = (
  instance: MockInstance,
  request: NockClientRequest
) => NockClientResponse;

export type PostViewFn = (
  instance: MockInstance,
  request: NockClientRequest,
  body: string | Record<string, any>
) => NockClientResponse;

export type MiddlewareFn = (
  instance: MockInstance,
  request: NockClientRequest
) => Promise<void>;
