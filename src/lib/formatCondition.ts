export type Condition = "new" | "used_like_new" | "used_good" | "used_fair";

/**
 * Returns a human-readable condition label.
 * @param short  true  → short form used in filter pills  ("Like New")
 *               false → full form used in detail pages   ("Used - Like New")
 */
export function formatCondition(condition: Condition, short = false): string {
  switch (condition) {
    case "new":
      return "New";
    case "used_like_new":
      return short ? "Like New" : "Used - Like New";
    case "used_good":
      return short ? "Good" : "Used - Good";
    case "used_fair":
      return short ? "Fair" : "Used - Fair";
  }
}
