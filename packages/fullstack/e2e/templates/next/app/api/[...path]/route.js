import { createCmsMediaBrowserFixture } from "../../../../backend.mjs";

let fixture;
const dispatch = async (request) => {
  fixture ??= createCmsMediaBrowserFixture("next");
  return (await fixture)(request);
};

export const GET = dispatch;
export const POST = dispatch;
export const PATCH = dispatch;
export const DELETE = dispatch;
export const PUT = dispatch;
