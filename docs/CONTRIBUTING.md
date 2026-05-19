# Contributing to GymFree

Thank you for considering contributing to GymFree! This project is open-source and community-driven.

## Code of Conduct

Be respectful, inclusive, and constructive. We do not tolerate harassment or toxicity.

## How to Contribute

### 1. Find or Create an Issue

- Check [existing issues](https://github.com/samuerodg/GymFree/issues) before creating a new one
- Use labels: `bug`, `enhancement`, `feature`, `docs`, `good-first-issue`

### 2. Fork & Branch

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/GymFree.git
   cd GymFree
   ```
3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/samuerodg/GymFree.git
   ```
4. Create a branch following our [branching strategy](./BRANCHING.md):
   ```bash
   git checkout -b feature/your-feature
   ```

### 3. Setup Development Environment

Follow the [Local Development Guide](./LOCAL_DEV.md) to set up your environment.

### 4. Make Changes

- Follow the [Style Guide](./STYLE_GUIDE.md)
- Write tests for new functionality
- Ensure all existing tests pass
- Keep changes focused (one feature/fix per branch)

### 5. Commit

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat(workout): add rest timer between sets"
```

### 6. Push & Create Pull Request

```bash
git push origin feature/your-feature
```

Create a PR against the `develop` branch with:
- Clear description of changes
- Screenshots for UI changes
- Related issue number

### 7. Review Process

- At least 1 maintainer approval required
- CI checks must pass
- Address review feedback
- Squash commits before merge if needed

## Development Guidelines

### Local-First Mindset

Always consider offline scenarios:
- Cache data locally before showing UI
- Handle sync failures gracefully
- Show sync status indicators

### Testing

- **Unit tests**: Vitest for backend logic
- **Integration tests**: API endpoint tests
- **E2E tests**: Detox or Maestro for mobile (future)

## Need Help?

- Open a [Discussion](https://github.com/samuerodg/GymFree/discussions)
- Join our community chat (coming soon)

## License

By contributing, you agree that your contributions will be licensed under the GNU GPL v3.
