# smiley

very silly, probably buggy, quite simple implementation of a KV/cookie session-based feedback system for urls. inspired by this article on how the vimtricks team [collects feedback](https://nimbleindustries.io/2020/04/29/how-we-collect-feedback-on-vimtricks/).

## usage

pass in `url` and `feedback` (must be between 1 - 4, 1 being "i hate this" and 4 being "i love this") to your deployed worker's `/respond` path.

[😠 i hate this project](https://smiley.signalnerve.workers.dev/respond?url=https://github.com/signalnerve/smiley&feedback=1)

[😐 i dislike this project](https://smiley.signalnerve.workers.dev/respond?url=https://github.com/signalnerve/smiley&feedback=2)

[😄 i like this project](https://smiley.signalnerve.workers.dev/respond?url=https://github.com/signalnerve/smiley&feedback=3)

[😁 i love this project](https://smiley.signalnerve.workers.dev/respond?url=https://github.com/signalnerve/smiley&feedback=4)

```markdown
[😠 i hate this project](https://smiley.signalnerve.workers.dev/respond?url=https://github.com/signalnerve/smiley&feedback=1)

[😐 i dislike this project](https://smiley.signalnerve.workers.dev/respond?url=https://github.com/signalnerve/smiley&feedback=2)

[😄 i like this project](https://smiley.signalnerve.workers.dev/respond?url=https://github.com/signalnerve/smiley&feedback=3)

[😁 i love this project](https://smiley.signalnerve.workers.dev/respond?url=https://github.com/signalnerve/smiley&feedback=4)
```

view feedback for a project using the `/responses` path, passing in the same `url` param

[view feedback for this project](https://smiley.signalnerve.workers.dev/responses?url=https://github.com/signalnerve/smiley)
