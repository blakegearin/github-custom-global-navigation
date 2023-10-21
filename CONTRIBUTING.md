# Contributing

Community contributions are welcome, despite experience level. If you'd like to contribute, please follow these guidelines.

## Bug Reports & Feature Requests

If you find a bug or have a feature request, search on the [Issues page](https://github.com/blakegearin/github-custom-global-naviation/issues) to check if it's already been added.

   - If there is...

     - 👍 the original post
     - if you have additional details feel free to add a comment

   - If there isn't, feel free to create a [new issue](https://github.com/blakegearin/github-custom-global-naviation/issues/new)

     - if it's a bug report related to responsive design, please indicate what width(s) are impacted

## Code Contributions

1. Fork this repository on GitHub
1. Clone your forked repository to your local machine
1. Create a new branch for your feature or bug fix: `git checkout -b feature-or-bugfix-branch`
1. Remove or disable the original userscript if installed
1. Test your changes locally from your forked repository, via `@require file:///`

   1. [Tampermonkey](https://www.tampermonkey.net/faq.php?locale=en#Q204)
   1. [Violentmonkey](https://violentmonkey.github.io/posts/how-to-edit-scripts-with-your-favorite-editor/)
   1. Greasemonkey [doesn't support](https://github.com/greasemonkey/greasemonkey/issues/3033) local files

1. Once finished, make sure to lint: `npm run lint`

   - Auto-fix: `npm run clean`

1. Push your changes to your forked repository
1. Rebase as needed to ensure your changes are in one (1) commit
1. Open a pull request to this original repository
