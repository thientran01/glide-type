/**
 * Calculate the Minimum String Distance (Levenshtein distance) between two strings.
 * This is the minimum number of single-character edits (insertions, deletions, or substitutions)
 * required to change one string into the other.
 */
export function calculateMSD(presented: string, transcribed: string): number {
  const m = presented.length;
  const n = transcribed.length;

  // Create a matrix of size (m+1) x (n+1)
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  // Initialize first column (deletions from presented)
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }

  // Initialize first row (insertions to get transcribed)
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (presented[i - 1] === transcribed[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]; // Characters match, no operation needed
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,     // Deletion
          dp[i][j - 1] + 1,     // Insertion
          dp[i - 1][j - 1] + 1  // Substitution
        );
      }
    }
  }

  return dp[m][n];
}
