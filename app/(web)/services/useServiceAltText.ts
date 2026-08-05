import { getServiceMetadata } from "./metadata-config";

export function useServiceAltText(slug: string): string {
  const metadata = getServiceMetadata(slug);
  return metadata.altText;
}
