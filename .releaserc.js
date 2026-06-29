const pkgRoot = 'packages/aziface';

module.exports = {
  branches: ['main'],
  tagFormat: 'v${version}',
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        releaseRules: [
          { type: 'feat', release: 'minor' },
          { type: 'chore', release: 'minor' },
          { type: 'fix', release: 'patch' },
          { type: 'perf', release: 'patch' },
          { type: 'style', release: 'patch' },
        ],
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES'],
        },
      },
    ],
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: `${pkgRoot}/CHANGELOG.md`,
      },
    ],
    [
      '@semantic-release/npm',
      {
        pkgRoot,
        npmPublish: true,
      },
    ],
    '@semantic-release/github',
    [
      '@semantic-release/exec',
      {
        successCmd:
          'git add packages/aziface/package.json packages/aziface/CHANGELOG.md && git diff --staged --quiet || (git commit -m "chore(release): ${nextRelease.version} [skip ci]" && git push origin HEAD:refs/heads/main)',
      },
    ],
  ],
};
