import type { Iresource } from "@/types";

function RustResponse({ resource }: Iresource) {
  const response = resource.read();
  return <p>{response}</p>;
}

export default RustResponse;
