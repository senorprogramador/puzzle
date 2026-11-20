import { headers } from "next/headers";

const RenderingErrorScenario = async () => {
  await headers();
  throw new Error("Intentional App Router rendering error");
};

export default RenderingErrorScenario;
