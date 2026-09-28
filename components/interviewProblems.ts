// Curated interview coding problems for the free "Solve it yourself" practice mode.
//
// Each problem is self-contained C#:
//   - starterCode: a `public static class Solution` skeleton the user fills in.
//   - harness: top-level C# statements that call Solution.X against fixed cases
//     and print machine-parseable "##CASE|idx|PASS|label|detail" lines plus a
//     final "##SUMMARY|passed|total". The InterviewPractice component runs
//     `harness + userCode` in the in-browser .NET runtime and parses those lines.
//   - solution / complexity / explanation: revealed after the user attempts it.
//
// The problems mirror Stefan's dotnet_interview_questions repo so the practice
// mode stays authentic to the kit.

export type Difficulty = "Easy" | "Medium" | "Hard";
export type Category = "Arrays" | "Strings" | "Lists" | "Trees";

export type Problem = {
  id: string;
  title: string;
  category: Category;
  difficulty: Difficulty;
  prompt: string;
  starterCode: string;
  harness: string;
  solution: string;
  complexity: string;
  explanation: string;
};

// Shared harness scaffolding so every problem prints results the same way.
const PRE = `using System;
using System.Collections.Generic;
using System.Linq;

int __p = 0, __t = 0;
void Check(string label, bool cond, string detail)
{
    __t++;
    if (cond) __p++;
    Console.WriteLine($"##CASE|{__t}|{(cond ? "PASS" : "FAIL")}|{label}|{detail}");
}
try
{
`;

const POST = `}
catch (Exception __ex)
{
    Console.WriteLine($"##ERROR|{__ex.Message}");
}
Console.WriteLine($"##SUMMARY|{__p}|{__t}");
`;

function harness(cases: string, extraClasses = ""): string {
  return PRE + cases + "\n" + POST + (extraClasses ? "\n" + extraClasses + "\n" : "");
}

export const PROBLEMS: Problem[] = [
  // ── Arrays ────────────────────────────────────────────────────────────────
  {
    id: "reverse-array",
    title: "Reverse an array",
    category: "Arrays",
    difficulty: "Easy",
    prompt:
      "Return a new array with the elements of `nums` in reverse order. Aim to do it in a single pass with O(1) extra space (besides the output).",
    starterCode: `public static class Solution
{
    // Return the elements of nums in reverse order.
    public static int[] Reverse(int[] nums)
    {
        // TODO: your solution here
        return nums;
    }
}`,
    harness: harness(`    var a = Solution.Reverse(new[] { 1, 2, 3, 4, 5 });
    Check("[1,2,3,4,5]", a != null && a.SequenceEqual(new[] { 5, 4, 3, 2, 1 }),
        "got " + (a == null ? "null" : "[" + string.Join(",", a) + "]"));

    var b = Solution.Reverse(new[] { 7 });
    Check("single element", b != null && b.SequenceEqual(new[] { 7 }),
        "got " + (b == null ? "null" : "[" + string.Join(",", b) + "]"));

    var c = Solution.Reverse(new int[0]);
    Check("empty array", c != null && c.Length == 0,
        "got " + (c == null ? "null" : "[" + string.Join(",", c) + "]"));

    var d = Solution.Reverse(new[] { -1, 0, 9 });
    Check("negatives", d != null && d.SequenceEqual(new[] { 9, 0, -1 }),
        "got " + (d == null ? "null" : "[" + string.Join(",", d) + "]"));`),
    solution: `public static class Solution
{
    public static int[] Reverse(int[] nums)
    {
        var result = new int[nums.Length];
        for (int i = 0; i < nums.Length; i++)
            result[i] = nums[nums.Length - 1 - i];
        return result;
    }
}`,
    complexity: "Time O(n) · Space O(n) for the output (O(1) if reversing in place)",
    explanation:
      "Walk the array once, copying element i from the mirror index (length-1-i). If you're allowed to mutate the input, swap from both ends toward the middle for O(1) extra space. The two-pointer swap is the answer interviewers usually want to hear.",
  },
  {
    id: "max-subarray",
    title: "Maximum subarray sum (Kadane's)",
    category: "Arrays",
    difficulty: "Medium",
    prompt:
      "Return the largest sum of any contiguous subarray of `nums` (the array has at least one element, values can be negative). The optimal solution is a single O(n) pass — Kadane's algorithm.",
    starterCode: `public static class Solution
{
    // Return the maximum sum of a contiguous subarray.
    public static int MaxSubArray(int[] nums)
    {
        // TODO: your solution here
        return 0;
    }
}`,
    harness: harness(`    Check("[-2,1,-3,4,-1,2,1,-5,4] => 6", Solution.MaxSubArray(new[] { -2, 1, -3, 4, -1, 2, 1, -5, 4 }) == 6,
        "got " + Solution.MaxSubArray(new[] { -2, 1, -3, 4, -1, 2, 1, -5, 4 }));
    Check("all negative [-3,-1,-2] => -1", Solution.MaxSubArray(new[] { -3, -1, -2 }) == -1,
        "got " + Solution.MaxSubArray(new[] { -3, -1, -2 }));
    Check("single [5] => 5", Solution.MaxSubArray(new[] { 5 }) == 5,
        "got " + Solution.MaxSubArray(new[] { 5 }));
    Check("all positive [1,2,3,4] => 10", Solution.MaxSubArray(new[] { 1, 2, 3, 4 }) == 10,
        "got " + Solution.MaxSubArray(new[] { 1, 2, 3, 4 }));`),
    solution: `public static class Solution
{
    public static int MaxSubArray(int[] nums)
    {
        int best = nums[0];
        int current = nums[0];
        for (int i = 1; i < nums.Length; i++)
        {
            current = Math.Max(nums[i], current + nums[i]);
            best = Math.Max(best, current);
        }
        return best;
    }
}`,
    complexity: "Time O(n) · Space O(1)",
    explanation:
      "At each index decide whether to extend the running subarray or start fresh at the current element: current = max(nums[i], current + nums[i]). Track the best value seen. Seeding both from nums[0] handles the all-negative case correctly — a common bug is initialising best to 0 and returning 0 for an all-negative array.",
  },
  {
    id: "missing-number",
    title: "Find the missing number",
    category: "Arrays",
    difficulty: "Easy",
    prompt:
      "`nums` contains n distinct numbers taken from the range 0..n (so exactly one value in that range is missing). Return the missing number in O(n) time and O(1) space.",
    starterCode: `public static class Solution
{
    // nums holds n distinct values from 0..n. Return the one that's missing.
    public static int MissingNumber(int[] nums)
    {
        // TODO: your solution here
        return -1;
    }
}`,
    harness: harness(`    Check("[3,0,1] => 2", Solution.MissingNumber(new[] { 3, 0, 1 }) == 2,
        "got " + Solution.MissingNumber(new[] { 3, 0, 1 }));
    Check("[0,1] => 2", Solution.MissingNumber(new[] { 0, 1 }) == 2,
        "got " + Solution.MissingNumber(new[] { 0, 1 }));
    Check("[9,6,4,2,3,5,7,0,1] => 8", Solution.MissingNumber(new[] { 9, 6, 4, 2, 3, 5, 7, 0, 1 }) == 8,
        "got " + Solution.MissingNumber(new[] { 9, 6, 4, 2, 3, 5, 7, 0, 1 }));
    Check("[0] => 1", Solution.MissingNumber(new[] { 0 }) == 1,
        "got " + Solution.MissingNumber(new[] { 0 }));`),
    solution: `public static class Solution
{
    public static int MissingNumber(int[] nums)
    {
        int n = nums.Length;
        int expected = n * (n + 1) / 2;
        int actual = 0;
        foreach (var x in nums) actual += x;
        return expected - actual;
    }
}`,
    complexity: "Time O(n) · Space O(1)",
    explanation:
      "The sum of 0..n is n*(n+1)/2. Subtract the actual sum of the array and what's left is the missing value. XOR-ing all indices and values (0..n and nums) also works and avoids any overflow risk on very large inputs — mention both.",
  },
  {
    id: "binary-search",
    title: "Binary search",
    category: "Arrays",
    difficulty: "Easy",
    prompt:
      "`sorted` is in ascending order. Return the index of `target`, or -1 if it isn't present. Must run in O(log n).",
    starterCode: `public static class Solution
{
    // Return the index of target in the ascending array, or -1 if absent.
    public static int BinarySearch(int[] sorted, int target)
    {
        // TODO: your solution here
        return -1;
    }
}`,
    harness: harness(`    Check("find 7 in [1,3,5,7,9] => 3", Solution.BinarySearch(new[] { 1, 3, 5, 7, 9 }, 7) == 3,
        "got " + Solution.BinarySearch(new[] { 1, 3, 5, 7, 9 }, 7));
    Check("find 1 (first) => 0", Solution.BinarySearch(new[] { 1, 3, 5, 7, 9 }, 1) == 0,
        "got " + Solution.BinarySearch(new[] { 1, 3, 5, 7, 9 }, 1));
    Check("find 9 (last) => 4", Solution.BinarySearch(new[] { 1, 3, 5, 7, 9 }, 9) == 4,
        "got " + Solution.BinarySearch(new[] { 1, 3, 5, 7, 9 }, 9));
    Check("absent 4 => -1", Solution.BinarySearch(new[] { 1, 3, 5, 7, 9 }, 4) == -1,
        "got " + Solution.BinarySearch(new[] { 1, 3, 5, 7, 9 }, 4));
    Check("empty => -1", Solution.BinarySearch(new int[0], 1) == -1,
        "got " + Solution.BinarySearch(new int[0], 1));`),
    solution: `public static class Solution
{
    public static int BinarySearch(int[] sorted, int target)
    {
        int lo = 0, hi = sorted.Length - 1;
        while (lo <= hi)
        {
            int mid = lo + (hi - lo) / 2;
            if (sorted[mid] == target) return mid;
            if (sorted[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }
}`,
    complexity: "Time O(log n) · Space O(1)",
    explanation:
      "Keep a [lo, hi] window and repeatedly probe the middle. Compute mid as lo + (hi - lo) / 2 rather than (lo + hi) / 2 to avoid integer overflow on large indices — the detail interviewers look for. The loop condition is lo <= hi so a single remaining element is still checked.",
  },
  {
    id: "two-sum",
    title: "Two sum",
    category: "Arrays",
    difficulty: "Medium",
    prompt:
      "Return the indices of the two numbers in `nums` that add up to `target`. Exactly one solution exists and you may not reuse the same element. Return them as an int[] of length 2 with the smaller index first. Aim for O(n).",
    starterCode: `public static class Solution
{
    // Return the two indices whose values sum to target (smaller index first).
    public static int[] TwoSum(int[] nums, int target)
    {
        // TODO: your solution here
        return new int[0];
    }
}`,
    harness: harness(`    var a = Solution.TwoSum(new[] { 2, 7, 11, 15 }, 9);
    Check("[2,7,11,15], t=9 => [0,1]", a != null && a.SequenceEqual(new[] { 0, 1 }),
        "got " + (a == null ? "null" : "[" + string.Join(",", a) + "]"));

    var b = Solution.TwoSum(new[] { 3, 2, 4 }, 6);
    Check("[3,2,4], t=6 => [1,2]", b != null && b.SequenceEqual(new[] { 1, 2 }),
        "got " + (b == null ? "null" : "[" + string.Join(",", b) + "]"));

    var c = Solution.TwoSum(new[] { 3, 3 }, 6);
    Check("[3,3], t=6 => [0,1]", c != null && c.SequenceEqual(new[] { 0, 1 }),
        "got " + (c == null ? "null" : "[" + string.Join(",", c) + "]"));`),
    solution: `public static class Solution
{
    public static int[] TwoSum(int[] nums, int target)
    {
        var seen = new Dictionary<int, int>();
        for (int i = 0; i < nums.Length; i++)
        {
            int need = target - nums[i];
            if (seen.TryGetValue(need, out int j))
                return new[] { j, i };
            seen[nums[i]] = i;
        }
        return new int[0];
    }
}`,
    complexity: "Time O(n) · Space O(n)",
    explanation:
      "Store each value's index in a hash map as you go. For every element, check whether its complement (target - value) was already seen — if so you have the pair. Because you look up the complement before inserting the current element, you never pair an element with itself. The brute-force double loop is O(n²); the map trades space for a single pass.",
  },

  // ── Strings ───────────────────────────────────────────────────────────────
  {
    id: "reverse-words",
    title: "Reverse the words in a sentence",
    category: "Strings",
    difficulty: "Easy",
    prompt:
      "Return `s` with the order of the words reversed and words separated by a single space. Collapse any leading, trailing, or repeated spaces. Example: \"  the sky  is blue \" → \"blue is sky the\".",
    starterCode: `public static class Solution
{
    // Reverse the word order; single spaces between words, no leading/trailing space.
    public static string ReverseWords(string s)
    {
        // TODO: your solution here
        return s;
    }
}`,
    harness: harness(`    Check("\\"the sky is blue\\"", Solution.ReverseWords("the sky is blue") == "blue is sky the",
        "got \\"" + Solution.ReverseWords("the sky is blue") + "\\"");
    Check("extra spaces", Solution.ReverseWords("  hello   world  ") == "world hello",
        "got \\"" + Solution.ReverseWords("  hello   world  ") + "\\"");
    Check("single word", Solution.ReverseWords("dotnet") == "dotnet",
        "got \\"" + Solution.ReverseWords("dotnet") + "\\"");
    Check("empty", Solution.ReverseWords("   ") == "",
        "got \\"" + Solution.ReverseWords("   ") + "\\"");`),
    solution: `public static class Solution
{
    public static string ReverseWords(string s)
    {
        var words = s.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        Array.Reverse(words);
        return string.Join(" ", words);
    }
}`,
    complexity: "Time O(n) · Space O(n)",
    explanation:
      "Split on whitespace while dropping empty entries (that collapses runs of spaces), reverse the resulting array, and join with a single space. StringSplitOptions.RemoveEmptyEntries is what quietly handles all the leading/trailing/duplicate-space edge cases the tests probe.",
  },
  {
    id: "is-anagram",
    title: "Valid anagram",
    category: "Strings",
    difficulty: "Easy",
    prompt:
      "Return true if `b` is an anagram of `a` — same characters with the same counts, order aside. Comparison is case-sensitive. Aim for O(n).",
    starterCode: `public static class Solution
{
    // True if b is an anagram of a (same chars, same counts).
    public static bool IsAnagram(string a, string b)
    {
        // TODO: your solution here
        return false;
    }
}`,
    harness: harness(`    Check("anagram/nagaram => true", Solution.IsAnagram("anagram", "nagaram") == true,
        "got " + Solution.IsAnagram("anagram", "nagaram"));
    Check("rat/car => false", Solution.IsAnagram("rat", "car") == false,
        "got " + Solution.IsAnagram("rat", "car"));
    Check("different length => false", Solution.IsAnagram("a", "ab") == false,
        "got " + Solution.IsAnagram("a", "ab"));
    Check("empty/empty => true", Solution.IsAnagram("", "") == true,
        "got " + Solution.IsAnagram("", ""));`),
    solution: `public static class Solution
{
    public static bool IsAnagram(string a, string b)
    {
        if (a.Length != b.Length) return false;
        var counts = new Dictionary<char, int>();
        foreach (var c in a)
            counts[c] = counts.TryGetValue(c, out var n) ? n + 1 : 1;
        foreach (var c in b)
        {
            if (!counts.TryGetValue(c, out var n) || n == 0) return false;
            counts[c] = n - 1;
        }
        return true;
    }
}`,
    complexity: "Time O(n) · Space O(k) for k distinct characters",
    explanation:
      "Length mismatch is an instant false. Otherwise tally each character in the first string, then decrement while scanning the second — if a character is missing or already at zero, it's not an anagram. Sorting both strings and comparing is the O(n log n) alternative that's fine to mention.",
  },
  {
    id: "first-unique-char",
    title: "First non-repeating character",
    category: "Strings",
    difficulty: "Medium",
    prompt:
      "Return the index of the first character in `s` that appears exactly once. If there is none, return -1.",
    starterCode: `public static class Solution
{
    // Index of the first character that occurs exactly once, or -1.
    public static int FirstUniqChar(string s)
    {
        // TODO: your solution here
        return -1;
    }
}`,
    harness: harness(`    Check("\\"leetcode\\" => 0", Solution.FirstUniqChar("leetcode") == 0,
        "got " + Solution.FirstUniqChar("leetcode"));
    Check("\\"loveleetcode\\" => 2", Solution.FirstUniqChar("loveleetcode") == 2,
        "got " + Solution.FirstUniqChar("loveleetcode"));
    Check("all repeating \\"aabb\\" => -1", Solution.FirstUniqChar("aabb") == -1,
        "got " + Solution.FirstUniqChar("aabb"));
    Check("single \\"z\\" => 0", Solution.FirstUniqChar("z") == 0,
        "got " + Solution.FirstUniqChar("z"));`),
    solution: `public static class Solution
{
    public static int FirstUniqChar(string s)
    {
        var counts = new Dictionary<char, int>();
        foreach (var c in s)
            counts[c] = counts.TryGetValue(c, out var n) ? n + 1 : 1;
        for (int i = 0; i < s.Length; i++)
            if (counts[s[i]] == 1) return i;
        return -1;
    }
}`,
    complexity: "Time O(n) · Space O(k) for k distinct characters",
    explanation:
      "Two passes: the first counts every character, the second returns the index of the first character whose count is 1. Two O(n) passes still total O(n) — much better than the O(n²) approach of re-scanning the string for each character.",
  },

  // ── Lists ─────────────────────────────────────────────────────────────────
  {
    id: "remove-duplicates",
    title: "Remove duplicates, keep order",
    category: "Lists",
    difficulty: "Easy",
    prompt:
      "Return a new list containing the elements of `items` with duplicates removed, preserving the order of first appearance.",
    starterCode: `public static class Solution
{
    // Remove duplicates, preserving first-seen order.
    public static List<int> RemoveDuplicates(List<int> items)
    {
        // TODO: your solution here
        return items;
    }
}`,
    harness: harness(`    var a = Solution.RemoveDuplicates(new List<int> { 1, 2, 2, 3, 1, 4 });
    Check("[1,2,2,3,1,4] => [1,2,3,4]", a != null && a.SequenceEqual(new[] { 1, 2, 3, 4 }),
        "got " + (a == null ? "null" : "[" + string.Join(",", a) + "]"));

    var b = Solution.RemoveDuplicates(new List<int> { 5, 5, 5 });
    Check("[5,5,5] => [5]", b != null && b.SequenceEqual(new[] { 5 }),
        "got " + (b == null ? "null" : "[" + string.Join(",", b) + "]"));

    var c = Solution.RemoveDuplicates(new List<int>());
    Check("empty => empty", c != null && c.Count == 0,
        "got " + (c == null ? "null" : "[" + string.Join(",", c) + "]"));`),
    solution: `public static class Solution
{
    public static List<int> RemoveDuplicates(List<int> items)
    {
        var seen = new HashSet<int>();
        var result = new List<int>();
        foreach (var x in items)
            if (seen.Add(x))
                result.Add(x);
        return result;
    }
}`,
    complexity: "Time O(n) · Space O(n)",
    explanation:
      "A HashSet.Add returns false when the value is already present, so it doubles as the 'have I seen this?' check and the record of seen values in one call. Appending only on a successful Add preserves first-seen order — which distinguishing this from `items.Distinct()` (also valid) or `new HashSet<int>(items)` (loses order).",
  },

  // ── Trees ─────────────────────────────────────────────────────────────────
  {
    id: "max-depth",
    title: "Maximum depth of a binary tree",
    category: "Trees",
    difficulty: "Medium",
    prompt:
      "Return the maximum depth of a binary tree — the number of nodes along the longest path from the root down to a leaf. An empty tree (null root) has depth 0. A `TreeNode` type is provided: it has `int val` and `TreeNode left, right`.",
    starterCode: `public static class Solution
{
    // TreeNode is provided: { int val; TreeNode left, right; }
    public static int MaxDepth(TreeNode root)
    {
        // TODO: your solution here
        return 0;
    }
}`,
    harness: harness(`    var root = new TreeNode(3,
        new TreeNode(9),
        new TreeNode(20, new TreeNode(15), new TreeNode(7)));
    Check("balanced-ish tree => 3", Solution.MaxDepth(root) == 3,
        "got " + Solution.MaxDepth(root));
    Check("null root => 0", Solution.MaxDepth(null) == 0,
        "got " + Solution.MaxDepth(null));
    Check("single node => 1", Solution.MaxDepth(new TreeNode(1)) == 1,
        "got " + Solution.MaxDepth(new TreeNode(1)));

    var skewed = new TreeNode(1, new TreeNode(2, new TreeNode(3, new TreeNode(4), null), null), null);
    Check("left-skewed chain => 4", Solution.MaxDepth(skewed) == 4,
        "got " + Solution.MaxDepth(skewed));`,
      `public class TreeNode
{
    public int val;
    public TreeNode left;
    public TreeNode right;
    public TreeNode(int val = 0, TreeNode left = null, TreeNode right = null)
    {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}`),
    solution: `public static class Solution
{
    public static int MaxDepth(TreeNode root)
    {
        if (root == null) return 0;
        int left = MaxDepth(root.left);
        int right = MaxDepth(root.right);
        return 1 + Math.Max(left, right);
    }
}`,
    complexity: "Time O(n) · Space O(h) for the recursion stack (h = tree height)",
    explanation:
      "Classic divide-and-conquer: a null node contributes depth 0, and any other node's depth is 1 plus the deeper of its two subtrees. The recursion visits every node once (O(n)); the call stack grows to the tree's height, which is O(log n) when balanced and O(n) in the worst case (a skewed chain).",
  },
];
