# README

## JavaScript style guide, linter, and formatter
This module saves you (and others!) time in three ways:

* *No configuration.* The easiest way to enforce code quality in your
project. No decisions to make. No `.eslintrc` files to 
manage. It just works.
* *Automatically format code.* Just run `standard --fix` and say goodbye to
messy or inconsistent code.
* *Catch style issues & programmer errors early.* Save precious code review
time by eliminating back-and-forth between reviewer & contributor.

Give it a try by running `npx standard --fix` right now!

## Table of Contents

* Quick start
	* [Install](#install)
	* [Usage](#usage)
	* [What you might do if you're clever](#what-you-might-do-if-youre-clever)
* FAQ
	* [Why should I use JavaScript Standard Style?](#why-should-i-use-javascript-standard-style)
	* [Who uses JavaScript Standard Style?](#who-uses-javascript-standard-style)
	* [Are there text editor plugins?](#are-there-text-editor-plugins)
	* [Is there a readme badge?](#is-there-a-readme-badge)
	* [I disagree with rule X, can you change it?](#i-disagree-with-rule-x-can-you-change-it)
	* [But this isn't a real web standard!](#but-this-isnt-a-real-web-standard)
	* [Is there an automatic formatter?](#is-there-an-automatic-formatter)
	* [How do I ignore files?](#how-do-i-ignore-files)
	* [How do I hide a certain warning?](#how-do-i-hide-a-certain-warning)
	* [I use a library that pollutes the global namespace. How do I prevent "variable is not defined" errors?](#i-use-a-library-that-pollutes-the-global-namespace-how-do-i-prevent-variable-is-not-defined-errors)
	* [How do I use experimental JavaScript (ES Next) features?](#how-do-i-use-experimental-javascript-es-next-features)
	* [Can I use a JavaScript language variant, like Flow or TypeScript?](#can-i-use-a-javascript-language-variant-like-flow-or-typescript)
	* [What about Mocha, Jest, Jasmine, QUnit, etc?](#what-about-mocha-jest-jasmine-qunit-etc)
	* [What about Web Workers and Service Workers?](#what-about-web-workers-and-service-workers)
	* [Can I check code inside of Markdown or HTML files?](#can-i-check-code-inside-of-markdown-or-html-files)
	* [Is there a Git `pre-commit` hook?](#is-there-a-git-pre-commit-hook)
	* [How do I make the output all colorful and pretty?](#how-do-i-make-the-output-all-colorful-and-pretty)
	* [Is there a Node.js API?](#is-there-a-nodejs-api)
	* [How do I contribute to StandardJS?](#how-do-i-contribute-to-standardjs)
* [License](#license)

## Install
The easiest way to use JavaScript Standard Style is to install it globally as a
Node command line program. Run the following command in Terminal:

```bash
$ npm install standard --global
```

Or, you can install `standard` locally, for use in a single project:

```bash
$ npm install standard --save-dev
```

/Note: To run the preceding commands, [Node.js](http://nodejs.org) and [npm](https://npmjs.com) must be installed./

## Usage
After you've installed `standard`, you should be able to use the `standard` program. The
simplest use case would be checking the style of all JavaScript files in the
current working directory:

```bash
$ standard
Error: Use JavaScript Standard Style
  lib/torrent.js:950:11: Expected '===' and instead saw '=='.
```

If you've installed `standard` locally, run with `npx` instead:

```bash
$ npx standard
```

You can optionally pass in a directory (or directories) using the glob pattern. Be
sure to quote paths containing glob patterns so that they are expanded by
`standard` instead of your shell:

```bash
$ standard "src/util/**/*.js" "test/**/*.js"
```

*Note:* by default `standard` will look for all files matching the patterns:
`**/*.js`, `**/*.jsx`.

## What you might do if you're clever

1. Add it to `package.json`

```json
{
  "name": "my-cool-package",
  "devDependencies": {
    "standard": "*"
  },
  "scripts": {
    "test": "standard && node my-tests.js"
  }
}
```

2. Style is checked automatically when you run `npm test`

```bash
$ npm test
Error: Use JavaScript Standard Style
  lib/torrent.js:950:11: Expected '===' and instead saw '=='.
```

3. Never give style feedback on a pull request again!

## Why should I use JavaScript Standard Style?
The beauty of JavaScript Standard Style is that it's simple. No one wants to
maintain multiple hundred-line style configuration files for every module/project
they work on. Enough of this madness!

This module saves you (and others!) time in three ways:

* *No configuration.* The easiest way to enforce consistent style in your
project. Just drop it in.
* *Automatically format code.* Just run `standard --fix` and say goodbye to
messy or inconsistent code.
* *Catch style issues & programmer errors early.* Save precious code review
time by eliminating back-and-forth between reviewer & contributor.

Adopting `standard` style means ranking the importance of code clarity and
community conventions higher than personal style. This might not make sense for
100% of projects and development cultures, however open source can be a hostile
place for newbies. Setting up clear, automated contributor expectations makes a
project healthier.

For more info, see the conference talk ["Write Perfect Code with Standard and
ESLint"](https://www.youtube.com/watch?v=kuHfMw8j4xk). In this talk, you'll learn
about linting, when to use `standard` versus `eslint`, and how `prettier` compares
to `standard`.

## Who uses JavaScript Standard Style?
[](https://nodejs.org) | [](https://www.npmjs.com) | [](https://github.com) | [](https://www.elastic.co) |
|---|---|---|---|

[](http://expressjs.com) | [](http://electron.atom.io) | [](https://nuxtjs.org/) | [](https://atom.io) |
|---|---|---|---|

| [](https://www.mongodb.com) | [](https://www.zendesk.com) | [](https://www.brave.com) | [](https://zeit.co) |
|---|---|---|---|

| [](https://nodesource.com) | [](http://www.nearform.com) | [](https://www.typeform.com) | [](https://gds.blog.gov.uk) |
|---|---|---|---|

| [](https://www.heroku.com) | [](https://saucelabs.com) | [](https://automattic.com) | [](https://www.godaddy.com) |
|---|---|---|---|

| [](https://webtorrent.io) | [](https://ipfs.io) | [](https://datproject.org) | [](https://bitcoinjs.org) |
|---|---|---|---|

| [](https://voltra.co) | [](https://www.treasuredata.com) | [](https://bitmidi.com) | [](https://www.apstudynotes.org) |
|---|---|---|---|

| [](https://www.optiopay.com) | [](https://www.jlrtechincubator.com/jlrti/) | [](https://www.bustle.com) | [](https://www.zentrick.com) |
|---|---|---|---|

| [](https://greenkeeper.io) | [](https://karma-runner.github.io) | [](https://www.taser.com) | [](https://www.neo4j.com) |
|---|---|---|---|

| [](https://rentograph.com) | [](https://www.eaze.com) | [](https://www.ctrlaltdeseat.com) | [](https://clevertech.biz) |
|---|---|---|---|

| [](https://aragon.org) | [](https://www.flowsent.com) | [](https://www.pumabrowser.com/) | [](https://www.jetbrains.com/webstorm/) |
|---|---|---|---|

| [](https://www.fastify.io) | [](https://www.scuttlebutt.nz) | [](https://solid.inrupt.com) | [](https://www.grab.com) |
|---|---|---|---|

| Your logo here | Your logo here | Your logo here | Your logo here |
|---|---|---|---|

In addition to companies, many community members use `standard` on packages that
are [too numerous](https://raw.githubusercontent.com/standard/standard-packages/master/all.json)
to list here.

`standard` is also the top-starred linter in GitHub's
[Clean Code Linter](https://github.com/showcases/clean-code-linters) showcase.

## Are there text editor plugins?
First, install `standard`. Then, install the appropriate plugin for your editor:

### Sublime Text
Using *[Package Control](https://packagecontrol.io/)*, install *[SublimeLinter](http://www.sublimelinter.com/en/latest/)* and
*[SublimeLinter-contrib-standard](https://packagecontrol.io/packages/SublimeLinter-contrib-standard)*.

For automatic formatting on save, install *[StandardFormat](https://packagecontrol.io/packages/StandardFormat)*.

### Atom
Install *[linter-js-standard](https://atom.io/packages/linter-js-standard)*.

Alternatively, you can install *[linter-js-standard-engine](https://atom.io/packages/linter-js-standard-engine)*. Instead of
bundling a version of `standard` it will automatically use the version installed
in your current project. It will also work out of the box with other linters based
on *[standard-engine](https://github.com/standard/standard-engine)*.

For automatic formatting, install *[standard-formatter](https://atom.io/packages/standard-formatter)*. For snippets,
install *[standardjs-snippets](https://atom.io/packages/standardjs-snippets)*.

### Visual Studio Code
Install *[vscode-standardjs](https://marketplace.visualstudio.com/items/chenxsan.vscode-standardjs)*. (Includes support for automatic formatting.)

For JS snippets, install: *[vscode-standardjs-snippets](https://marketplace.visualstudio.com/items?itemName=capaj.vscode-standardjs-snippets)*. For React snippets, install *[vscode-react-standard](https://marketplace.visualstudio.com/items/TimonVS.ReactSnippetsStandard)*.

### Vim
Install *[ale](https://github.com/w0rp/ale)*. And add these lines to your `.vimrc` file.

```vim
let g:ale_linters = {
\   'javascript': ['standard'],
\}
let g:ale_fixers = {'javascript': ['standard']}
```

This sets standard as your only linter and fixer for javascript files and so prevents conflicts with eslint. For linting and automatic fixing on save, add these lines to `.vimrc`:
```vim
let g:ale_lint_on_save = 1
let g:ale_fix_on_save = 1
```

Alternative plugins to consider include [neomake](https://github.com/neomake/neomake) and [syntastic](https://github.com/vim-syntastic/syntastic), both of which have built-in support for `standard` (though configuration may be necessary).

### Emacs
Install *[Flycheck](http://www.flycheck.org)* and check out the *[manual](http://www.flycheck.org/en/latest/user/installation.html)* to learn
how to enable it in your projects.

### Brackets
Search the extension registry for *["Standard Code Style"](https://github.com/ishamf/brackets-standard/)* and click "Install".

### WebStorm (PhpStorm, IntelliJ, RubyMine, JetBrains, etc.)
WebStorm [recently announced native support](https://blog.jetbrains.com/webstorm/2017/01/webstorm-2017-1-eap-171-2272/)
for `standard` directly in the IDE.

If you still prefer to configure `standard` manually, [follow this guide](docs/webstorm.md). This applies to all JetBrains products, including PhpStorm, IntelliJ, RubyMine, etc.

## Is there a readme badge?
Yes! If you use `standard` in your project, you can include one of these badges in
your readme to let people know that your code is using the standard style.

[JavaScript Style Guide](https://github.com/standard/standard)

```md
[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)
```

[JavaScript Style Guide](https://standardjs.com)

```md
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
```

## I disagree with rule X, can you change it?
No. The whole point of `standard` is to save you time by avoiding
[bikeshedding](https://www.freebsd.org/doc/en/books/faq/misc.html#bikeshed-painting) about code style. There are lots of debates online about
tabs vs. spaces, etc. that will never be resolved. These debates just distract from
getting stuff done. At the end of the day you have to 'just pick something', and
that's the whole philosophy of `standard` -- its a bunch of sensible 'just pick
something' opinions. Hopefully, users see the value in that over defending their
own opinions.

There are a couple of similar packages for anyone who does not want to completely accept `standard`:
* [semistandard](https://github.com/standard/semistandard) - standard, with semicolons
* [standardx](https://github.com/standard/standardx) - standard, with custom tweaks

If you really want to configure hundreds of ESLint rules individually, you can
always use `eslint` directly with
[eslint-config-standard](https://github.com/standard/eslint-config-standard) to
layer your changes on top.
[`standard-eject`](https://github.com/josephfrazier/standard-eject) can help
you migrate from `standard` to `eslint` and `eslint-config-standard`.

Pro tip: Just use `standard` and move on. There are actual real problems that you
could spend your time solving! :P

## But this isn't a real web standard!
Of course it's not! The style laid out here is not affiliated with any official web
standards groups, which is why this repo is called `standard/standard` and not
`ECMA/standard`.

The word "standard" has more meanings than just "web standard" :-) For example:

* This module helps hold our code to a high /standard of quality/.
* This module ensures that new contributors follow some basic /style standards/.

## Is there an automatic formatter?
Yes! You can use `standard --fix` to fix most issues automatically.

`standard --fix` is built into `standard` for maximum convenience. Most problems
are fixable, but some errors (like forgetting to handle errors) must be fixed
manually.

To save you time, `standard` outputs the message "`Run standard --fix to automatically fix some problems`" when it detects problems that can be fixed
automatically.

## How do I ignore files?
Certain paths (`node_modules/`, `coverage/`, `vendor/`, `*.min.js`, `bundle.js`,
and files/folders that begin with `.` like `.git/`) are automatically ignored.

Paths in a project's root `.gitignore` file are also automatically ignored.

Sometimes you need to ignore additional folders or specific minified files. To do
that, add a `standard.ignore` property to `package.json`:

```json
"standard": {
  "ignore": [
    "**/out/",
    "/lib/select2/",
    "/lib/ckeditor/",
    "tmp.js"
  ]
}
```

## How do I hide a certain warning?
In rare cases, you'll need to break a rule and hide the warning generated by
`standard`.

JavaScript Standard Style uses [ESLint](http://eslint.org/) under-the-hood and
you can hide warnings as you normally would if you used ESLint directly.

To get verbose output (so you can find the particular rule name to ignore), run:

```bash
$ standard --verbose
Error: Use JavaScript Standard Style
  routes/error.js:20:36: 'file' was used before it was defined. (no-use-before-define)
```

Disable *all rules* on a specific line:

```js
file = 'I know what I am doing' // eslint-disable-line
```

Or, disable *only* the `"no-use-before-define"` rule:

```js
file = 'I know what I am doing' // eslint-disable-line no-use-before-define
```

Or, disable the `"no-use-before-define"` rule for *multiple lines*:

```js
/* eslint-disable no-use-before-define */
console.log('offending code goes here...')
console.log('offending code goes here...')
console.log('offending code goes here...')
/* eslint-enable no-use-before-define */
```

## I use a library that pollutes the global namespace. How do I prevent "variable is not defined" errors?
Some packages (e.g. `mocha`) put their functions (e.g. `describe`, `it`) on the
global object (poor form!). Since these functions are not defined or `require`'d
anywhere in your code, `standard` will warn that you're using a variable that is
not defined (usually, this rule is really useful for catching typos!). But we want
to disable it for these global variables.

To let `standard` (as well as humans reading your code) know that certain variables
are global in your code, add this to the top of your file:

```js
/* global myVar1, myVar2 */
```

If you have hundreds of files, it may be desirable to avoid adding comments to
every file. In this case, run:

```bash
$ standard --global myVar1 --global myVar2
```

Or, add this to `package.json`:

```json
{
  "standard": {
    "globals": [ "myVar1", "myVar2" ]
  }
}
```

/Note: `global` and `globals` are equivalent./

## How do I use experimental JavaScript (ES Next) features?
`standard` supports the latest ECMAScript features, ES8 (ES2017), including
language feature proposals that are in "Stage 4" of the proposal process.

To support experimental language features, `standard` supports specifying a
custom JavaScript parser. Before using a custom parser, consider whether the added
complexity is worth it.

To use a custom parser, first install it from npm:

```bash
npm install babel-eslint --save-dev
```

Then run:

```bash
$ standard --parser babel-eslint
```

Or, add this to `package.json`:

```json
{
  "standard": {
    "parser": "babel-eslint"
  }
}
```

## Can I use a JavaScript language variant, like Flow or TypeScript?
`standard` supports the latest ECMAScript features. However, Flow and TypeScript add new
syntax to the language, so they are not supported out-of-the-box.

To support JavaScript language variants, `standard` supports specifying a custom JavaScript
parser as well as an ESLint plugin to handle the changed syntax. Before using a JavaScript
language variant, consider whether the added complexity is worth it.

### Flow
To use Flow, you need to run `standard` with `babel-eslint` as the parser and
`eslint-plugin-flowtype` as a plugin.

```bash
npm install babel-eslint eslint-plugin-flowtype --save-dev
```

Then run:

```bash
$ standard --parser babel-eslint --plugin flowtype
```

Or, add this to `package.json`:

```json
{
  "standard": {
    "parser": "babel-eslint",
    "plugins": [ "flowtype" ]
  }
}
```

/Note: `plugin` and `plugins` are equivalent./

### TypeScript
To use TypeScript, you need to run `standard` with `@typescript-eslint/parser` as the parser,
`@typescript-eslint/eslint-plugin` as a plugin, and tell standard to lint `**/*.ts` files (since it
doesn't by default).

Unfortunately, there's an outstanding [issue](https://github.com/standard/standard/issues/1283)
with `standard` and Typescript where `standard` would incorrectly emit unused-variable errors
(e.g: when you import interfaces). And as a workaround, you need to use
[standardx](https://github.com/standard/standardx) instead:sweat_smile:.

```bash
npm install standardx @typescript-eslint/parser @typescript-eslint/eslint-plugin --save-dev
```

Then run:

```bash
$ standardx --parser @typescript-eslint/parser --plugin @typescript-eslint/eslint-plugin **/*.ts
```

Or, add this to `package.json`:

```json
{
  "eslintConfig": {
    "rules": {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error"
    }
  },
  "standardx": {
    "parser": "@typescript-eslint/parser",
    "plugins": [ "@typescript-eslint/eslint-plugin" ]
  }
}
```

With that in `package.json`, you can run:

```bash
standardx **/*.ts
```

And you probably should remove `standard` too to avoid confusion where it's used by mistake
instead of `standardx`.

```bash
npm uninstall standard
```

## What about Mocha, Jest, Jasmine, QUnit, etc?
To support mocha in test files, add this to the top of the test files:

```js
/* eslint-env mocha */
```

Or, run:

```bash
$ standard --env mocha
```

Where `mocha` can be one of `jest`, `jasmine`, `qunit`, `phantomjs`, and so on. To see a
full list, check ESLint's
[specifying environments](http://eslint.org/docs/user-guide/configuring.html#specifying-environments)
documentation. For a list of what globals are available for these environments,
check the
[globals](https://github.com/sindresorhus/globals/blob/master/globals.json) npm
module.

/Note: `env` and `envs` are equivalent./

## What about Web Workers and Service Workers?
Add this to the top of web worker files:

```js
/* eslint-env worker */
```

This lets `standard` (as well as humans reading the code) know that `self` is a
global in web worker code.

For Service workers, add this instead:

```js
/* eslint-env serviceworker */
```

## Can I check code inside of Markdown or HTML files?
To check code inside Markdown files, use [`standard-markdown`](https://www.npmjs.com/package/standard-markdown).

Alternatively, there are ESLint plugins that can check code inside Markdown, HTML,
and many other types of language files:

To check code inside Markdown files, use an ESLint plugin:

```bash
$ npm install eslint-plugin-markdown
```

Then, to check JS that appears inside code blocks, run:

```bash
$ standard --plugin markdown '**/*.md'
```

To check code inside HTML files, use an ESLint plugin:

```bash
$ npm install eslint-plugin-html
```

Then, to check JS that appears inside `<script>` tags, run:

```bash
$ standard --plugin html '**/*.html'
```

## Is there a Git `pre-commit` hook?
Funny you should ask!

```bash
#!/bin/bash

# Ensure all JavaScript files staged for commit pass standard code style
function xargs-r() {
  # Portable version of "xargs -r". The -r flag is a GNU extension that
  # prevents xargs from running if there are no input files.
  if IFS= read -r -d $'\n' path; then
    { echo "$path"; cat; } | xargs $@
  fi
}
git diff --name-only --cached --relative | grep '\.jsx\?$' | sed 's/[^[:alnum:]]/\\&/g' | xargs-r -E '' -t standard
if [[ $? -ne 0 ]]; then
  echo 'JavaScript Standard Style errors were detected. Aborting commit.'
  exit 1
fi
```

## How do I make the output all colorful and pretty?
The built-in output is simple and straightforward, but if you like shiny things,
install [snazzy](https://www.npmjs.com/package/snazzy):

```bash
$ npm install snazzy
```

And run:

```bash
$ standard --verbose | snazzy
```

There's also [standard-tap](https://www.npmjs.com/package/standard-tap),
[standard-json](https://www.npmjs.com/package/standard-json),
[standard-reporter](https://www.npmjs.com/package/standard-reporter), and
[standard-summary](https://www.npmjs.com/package/standard-summary).

## Is there a Node.js API?
Yes!

### `standard.lintText(text, [opts], callback)`
Lint the provided source `text`. An `opts` object may be provided:

```js
{
  cwd: '',      // current working directory (default: process.cwd())
  filename: '', // path of the file containing the text being linted (optional, though some eslint plugins require it)
  fix: false,   // automatically fix problems
  globals: [],  // custom global variables to declare
  plugins: [],  // custom eslint plugins
  envs: [],     // custom eslint environment
  parser: ''    // custom js parser (e.g. babel-eslint)
}
```

Additional options may be loaded from a `package.json` if it's found for the
current working directory.

The `callback` will be called with an `Error` and `results` object.

The `results` object will contain the following properties:

```js
var results = {
  results: [
    {
      filePath: '',
      messages: [
        { ruleId: '', message: '', line: 0, column: 0 }
      ],
      errorCount: 0,
      warningCount: 0,
      output: '' // fixed source code (only present with {fix: true} option)
    }
  ],
  errorCount: 0,
  warningCount: 0
}
```

### `results = standard.lintTextSync(text, [opts])`
Synchronous version of `standard.lintText()`. If an error occurs, an exception is
thrown. Otherwise, a `results` object is returned.

### `standard.lintFiles(files, [opts], callback)`
Lint the provided `files` globs. An `opts` object may be provided:

```js
var opts = {
  ignore: [],   // file globs to ignore (has sane defaults)
  cwd: '',      // current working directory (default: process.cwd())
  fix: false,   // automatically fix problems
  globals: [],  // global variables to declare
  plugins: [],  // eslint plugins
  envs: [],     // eslint environment
  parser: ''    // js parser (e.g. babel-eslint)
}
```

The `callback` will be called with an `Error` and `results` object (same as above).

## How do I contribute to StandardJS?
Contributions are welcome! Check out the [issues](https://github.com/standard/standard/issues) or the [PRs](https://github.com/standard/standard/pulls), and make your own if you want something that you don't see there.

Want to chat? Join contributors on IRC in the `#standard` channel on freenode.

Here are some important packages in the `standard` ecosystem:

* *[standard](https://github.com/standard/standard)* - this repo
	* *[standard-engine](https://github.com/standard/standard-engine)* - cli engine for arbitrary eslint rules
	* *[eslint-config-standard](https://github.com/standard/eslint-config-standard)* - eslint rules for standard
	* *[eslint-config-standard-jsx](https://github.com/standard/eslint-config-standard-jsx)* - eslint rules for standard (JSX)
	* *[eslint-plugin-standard](https://github.com/standard/eslint-plugin-standard)* - custom eslint rules for standard (not part of eslint core)
	* *[eslint](https://github.com/eslint/eslint)* - the linter that powers standard
* *[snazzy](https://github.com/standard/snazzy)* - pretty terminal output for standard
* *[standard-www](https://github.com/standard/standard-www)* - code for https://standardjs.com
* *[semistandard](https://github.com/standard/semistandard)* - standard, with semicolons (if you must)
* *[standardx](https://github.com/standard/standardx)* - standard, with custom tweaks

There are also many *[editor plugins](#are-there-text-editor-plugins)*, a list of
*[npm packages that use `standard`](https://github.com/standard/standard-packages)*,
and an awesome list of
*[packages in the `standard` ecosystem](https://github.com/standard/awesome-standard)*.

## Security Policies and Procedures
The `standard` team and community take all security bugs in `standard` seriously. Please see our [security policies and procedures](https://github.com/standard/.github/blob/master/SECURITY.md) document to learn how to report issues.

## License
[MIT](LICENSE). Copyright (c) [Feross Aboukhadijeh](https://feross.org).