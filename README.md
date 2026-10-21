# Cloudwise

Cloudwise is an independent, unofficial AZ-900 study app built to make practice more useful for beginners. It pairs original, topic-based questions with immediate explanations and an account-linked readiness tracker.

## What it does

- Offers 58 original practice questions across the three AZ-900 skill domains, aligned to the public Microsoft Learn study guide.
- Lets learners choose a domain or start a mixed round.
- Explains each answer immediately and links learners back to the public skills outline.
- Tracks account-linked attempts, domain accuracy, suggested focus areas, and missed-question review using Supabase.
- Supports guest practice with progress saved in the current browser.

## Run locally

Serve the folder over HTTP; Supabase sign-in does not work from a `file://` URL. For example, run `python3 -m http.server 8000` in this directory, then open `http://localhost:8000`. If using a different local server address, allow that URL in Supabase Auth's redirect URL list. Without Supabase configured, the app uses its local starter questions and browser-only progress.

## Supabase setup

The browser integration uses Supabase Auth and Postgres. To configure a project:

1. Create a Supabase project in your account.
2. In the project dashboard, open **SQL Editor** and run `supabase/schema.sql`.
3. Run `supabase/seed.sql` to import 58 original practice questions.
4. Confirm the `questions` table contains 58 published questions across all three AZ-900 domains.

To update an existing project, run the latest `supabase/seed.sql` again. It upserts by question ID, so existing questions are refreshed and new questions are added without duplicating rows.

The question bank is readable without signing in. Learner attempts are private to each account under row-level security and are written through a database function. The seed questions are original practice material tied to the published skills outline; they are not copied from the exam or Microsoft's practice assessment. For Microsoft's own free example questions, use the [official AZ-900 practice assessment](https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/practice/assessment?assessment-type=practice&assessmentId=23&practice-assessment-type=certification).

Once the database is ready, add the project's URL and publishable key to `supabase-config.js`. That local config file is ignored by Git. In Supabase **Authentication → URL Configuration**, allow `http://localhost:8000/` as a redirect URL for local development. In **Authentication → Sign In / Providers → Email**, keep Email enabled and turn off **Confirm email**. This lets new learners create an account and sign in without verifying their address. Because addresses are unverified, a typo can make an account difficult to recover. Never put a `service_role` or secret key in browser code.

With the project configured, the app loads the shared question bank. Learners can continue as guests or use **Sign in** / **Create account** with email and password. Signed-in attempts are saved to the learner's account, and readiness and missed-question review are reconstructed from that account's history. Existing guest scores are not migrated to an account; guest scores remain available after signing out on the same browser.

## Demo walkthrough

1. On **Overview**, introduce the three skill domains and their published exam weight ranges.
2. Open **Practice quiz**, choose a domain, and start a short round.
3. Select an answer and show the immediate feedback and explanation.
4. Open **My readiness** to show topic-level progress and suggested focus; revisit a missed question.
5. If time permits, sign out and back in to demonstrate account-linked persistence.

## Pitch

Learners often practise questions without understanding why an answer is right, and they may not know which AZ-900 topics need more work. Cloudwise turns each practice answer into a learning moment: it provides an explanation, organizes original questions by the public skills outline, and uses account-linked practice history to show progress by domain and queue missed questions for review. It is an unofficial beginner-focused prototype built with HTML, CSS, JavaScript, and Supabase. The same approach could support other beginner certifications by replacing the skills outline and question bank.

## Project choices

- Practice questions and explanations are written for this prototype; they are not copied from the AZ-900 exam.
- The Supabase seed bank contains 58 original questions mapped across the current published objectives. It is a useful starter set, not full coverage of every exam objective.
- Domain names and exam weight ranges follow the [Microsoft Learn AZ-900 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900). Check that guide for current objectives before adding more questions.
- The app is an independent, unofficial study project and is not affiliated with Microsoft; it does not use Microsoft logos.
- Scores describe practice history. They are not a pass prediction or readiness guarantee.
- The suggested next area prioritizes domains not yet practiced, then the lowest observed accuracy. Use it as a study prompt; a small number of questions is not a reliable measure of mastery.
- Guest missed questions and scores stay in the current browser. Signed-in learners get account-linked attempt history and review queues.
- If Supabase is not configured or its question bank cannot be loaded, the app falls back to its local starter questions and device-only progress.
- Cloudwise is an independent study project and is not affiliated with Microsoft.

## Future improvements

- Expand the original question bank to cover every objective in the official skills outline.
- Add more context-rich examples from everyday life across Africa.
- Expand account recovery and profile settings if the app grows beyond the hackathon prototype.
