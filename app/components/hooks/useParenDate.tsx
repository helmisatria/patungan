import { useMatches } from "@remix-run/react";

export function useParentData(pathname: string): unknown {
  let matches = useMatches();
  let parentMatch = matches.find((match) => match.pathname === pathname);
  if (!parentMatch) return null;
  return parentMatch.data;
}
