# Contributing to WildMind AI Education

Thanks for wanting to help! WildMind brings AI inside the assignment so teachers can see how students use it. Contributions of any size are welcome.

## Getting started

1. Fork the repo and clone your fork.
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in a Postgres connection string (Neon works well) and a Gemini API key.
4. Set up the database: `npm run db:push` then `npm run db:seed`
5. Run the app: `npm run dev`
6. Before opening a PR, run `npm run lint` and `npm run build`.

## Picking something to work on

- Look for issues labelled [good first issue](https://github.com/dlealvilla/lms_ai/labels/good%20first%20issue) or [help wanted](https://github.com/dlealvilla/lms_ai/labels/help%20wanted).
- Comment on the issue before you start so work isn't duplicated.
- Have an idea that isn't listed? Start a thread in [Discussions](https://github.com/dlealvilla/lms_ai/discussions) or open an issue first.

## Pull requests

- Open PRs against `main`, small and focused on one thing.
- Describe what changed and how you tested it; screenshots help for UI changes.
- All changes are reviewed and merged by the maintainer, [@dlealvilla](https://github.com/dlealvilla).

## Security

Please don't open public issues for security problems; see [SECURITY.md](SECURITY.md).
