# Test plans

Plans for the test agents live here, one file per area. They go through three steps:

1. `playwright-test-planner` explores the page and saves the plan.
2. `playwright-test-plan-reviewer` (a stronger model) checks the plan against the project rules
   and the real page, fixes it and marks it approved. The planner starts it itself.
3. `playwright-test-generator` turns the approved items into scenarios, steps and page objects.

A reviewed plan has the line `**Review:** approved` below the title and a `## Status` table with
one row per plan item: `Done`, `Not yet`, or `Left out` when I decided not to implement it.
`node scripts/plan-check.mjs <plan>` checks the approval, every row of the table and the
`Done: x of y items.` line. The generator runs it before it starts and after it updates the
table.
