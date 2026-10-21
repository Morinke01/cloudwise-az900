# Cloudwise

Cloudwise is an unofficial AZ-900 practice quiz and learning progress prototype. It helps beginners practice original multiple-choice questions, understand each answer, and review accuracy across the exam's three skill domains.

## Run it

Serve the folder over HTTP (Supabase sign-in does not work from a `file://` URL). For example, run `python3 -m http.server 8000` in this directory, then open `http://localhost:8000`. Without Supabase configured, practice progress stays in that browser on that device.

## Supabase setup

The browser integration is ready, but it needs your project credentials and database setup. First prepare the database:

1. Create a Supabase project in your account.
2. In the project dashboard, open **SQL Editor** and run `supabase/schema.sql`.
3. Run `supabase/seed.sql` to import 31 original practice questions.
4. Confirm the `questions` table contains published questions across all three AZ-900 domains.

The question bank is readable without signing in. Learner attempts are private to each account and are written through a database function that checks the answer. The seed questions are original practice material tied to the published skills outline; they are not copied from the exam or Microsoft's practice assessment. For Microsoft's own free example questions, use the [official AZ-900 practice assessment](https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/practice/assessment?assessment-type=practice&assessmentId=23&practice-assessment-type=certification).

Once the database is ready, add the project's URL and publishable key to `supabase-config.js`. That local config file is ignored by Git. In Supabase **Authentication → URL Configuration**, allow `http://localhost:8000/` as a redirect URL for local development. In **Authentication → Sign In / Providers → Email**, keep Email enabled and turn off **Confirm email**. This lets new learners create an account and sign in without verifying their address. Because addresses are unverified, a typo can make an account difficult to recover. Never put a `service_role` or secret key in browser code.

With the project configured, the app loads the shared question bank. Learners can continue as guests or use **Sign in** / **Create account** with email and password. Signed-in answers are checked and saved as account attempts, then readiness and missed-question review are reconstructed from that account's private history. Existing guest scores are not migrated to an account; guest scores remain available after signing out on the same browser.

## Demo path

1. Start on Overview and compare the three skill domains and their published exam weight ranges.
2. Choose a domain or start a mixed round.
3. Select an answer to see the correct option and explanation immediately.
4. Finish the round, then open My readiness to review results by domain, get a suggested next area, and revisit missed questions.

## Project choices

- Practice questions and explanations are written for this prototype; they are not copied from the AZ-900 exam.
- The Supabase seed bank contains 31 original questions mapped to the current published objectives. It is a useful starter set, not full coverage of every exam objective.
- Domain names and exam weight ranges follow the [Microsoft Learn AZ-900 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900). Check that guide for current objectives before adding more questions.
- Scores describe practice history. They are not a pass prediction or readiness guarantee.
- The suggested next area prioritizes domains not yet practiced, then the lowest observed accuracy. Use it as a study prompt; a small number of questions is not a reliable measure of mastery.
- Guest missed questions and scores stay in the current browser. Signed-in learners get account-linked attempt history and review queues.
- If Supabase is not configured or its question bank cannot be loaded, the app falls back to its local starter questions and device-only progress.
- Cloudwise is an independent study project and is not affiliated with Microsoft.

## Next improvements

- Expand the original question bank to cover every objective in the official skills outline.
- Add more context-rich examples from everyday life across Africa.
- Expand account recovery and profile settings if the app grows beyond the hackathon prototype.
