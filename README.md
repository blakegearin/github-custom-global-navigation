<p align="center">
  <img
    height="60%"
    width="60%"
    src="img/logo.svg"
    alt="GitHub Custom Global Navigation logo"
    title="GitHub Custom Global Navigation logo"
  />
</p>

# GitHub Custom Global Navigation

This is a [userscript](https://openuserjs.org/about/Userscript-Beginners-HOWTO) to customize the global navigation of GitHub.

## Usage

1. Install a userscript manager like [Tampermonkey](https://www.tampermonkey.net), [Violentmonkey](https://violentmonkey.github.io), or [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)
1. Go to this userscript's [GreasyFork page](https://greasyfork.org/en/scripts/477926-github-custom-global-navigation)
1. Click "Install this script"
1. The userscript will open in your userscript manager where you can install it

## Documentation

### Defaults

There are two (2) default configurations that are actively maintained and supported.

1. True default

   - This is the out-of-the-box experience
   - It previews some the best features and aims to deliver a "[happy medium](https://dictionary.cambridge.org/dictionary/english/happy-medium)" between the old and new styles without compromising on accessibility
   - It relies more on CSS variables to adapt to GitHub changes

1. Old style

   - This is a single opt-in flag that overrides the true defaults
   - It aims to deliver an experience as close to the old style as reasonably possible without compromising on accessibility
   - It may not match the old mobile experience, as the details surrounding this are more difficult to find online
   - Where applicable, it uses hardcoded values instead of CSS variables to prevent side effects from GitHub changes
   - It contains unique updates that are not otherwise available (e.g. button rearranging)

Accessibility is important, and GitHub [agrees](https://accessibility.github.com). However, this userscript doesn't go out of its way to improve accessability when it comes to HTML tags. For example, there are several `a` tags presenting as buttons, which is not ideal. In some cases, elements added by the userscript take a similar approach for consistency.

### Responsive Design

GitHub's new design is responsive, hiding and condensing more elements as screen width decreases. There are breakpoints at `1011px` and `768px`.

Because this userscript is highly customizable, it's complex to make every possible variant similarly responsive. However, the default configurations can be regularly tested during development. It's also worth noting userscripts are not popularly run on tablets or phones.

With these considerations in mind, this is the support priority order of screen widths:

1. `1011px` - `1920px` (e.g. laptops)
1. `1920px` and up (e.g. external monitors)
1. `1011px` and below (e.g. tablets, phones)

## Background

In April 2023, GitHub released a public beta for a redesigned global navigation and asked for [feedback](https://github.com/orgs/community/discussions/52083).

In October 2023, GitHub initiated a [public rollout](https://github.blog/changelog/2023-10-17-redesigned-navigation-now-available-to-all-users/) and removed the opt-out from [Release preview](https://docs.github.com/en/get-started/using-github/exploring-early-access-releases-with-feature-preview).

## Credit

- Colors, icons, and element properties were collected from a variety of sources
  - [Internet Archive](https://archive.org) ([donate](https://archive.org/donate))
  - [GitHub](https://github.com/)
  - [Gist](https://gist.github.com/)
  - [YouTube](https://www.youtube.com) <sup><a href="https://www.youtube.com/watch?v=ULsLaA__Xe8">[1]</a></sup><sup><a href="https://www.youtube.com/watch?v=v_1iqtOnUMg">[2]</a></sup><sup><a href="https://youtu.be/jG4Vs81kMlc">[3]</a></sup>

- Archiving

  - Formatter: [Web Formatter](https://webformatter.com/html)

- Logo

  - Silhouette: [Mohamed Hassan](https://pixabay.com/vectors/silhouette-octopus-vector-graphic-3313481/)

  - Optimization: [SVGOMG](https://svgomg.net)

Not affiliated with Microsoft Corporation, GitHub, Inc., or any of their affiliations.
