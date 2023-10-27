// ==UserScript==
// @name         GitHub Custom Global Navigation
// @namespace    https://github.com/blakegearin/github-custom-global-naviation
// @version      1.0.0
// @description  Customize GitHub's new global navigation
// @author       Blake Gearin
// @match        *://github.com/*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM.getValue
// @grant        GM.setValue
// @license      MIT
// @icon         https://raw.githubusercontent.com/blakegearin/github-custom-global-naviation/main/img/logo.svg
// @supportURL   https://github.com/blakegearin/github-custom-global-naviation/issues
// ==/UserScript==

/*global GM_config*/

(function () {
  'use strict';

  const SILENT = 0;
  const QUIET = 1;
  const INFO = 2;
  const DEBUG = 3;
  const VERBOSE = 4;

  const CURRENT_LOG_LEVEL = VERBOSE;
  const USERSCRIPT_NAME = 'GitHub Custom Global Navigation';

  function log(level, message, variable = null) {
    if (CURRENT_LOG_LEVEL < level) return;

    console.log(`${USERSCRIPT_NAME}: ${message}`);
    if (variable) console.log(variable);
  }

  function logError(message) {
    console.error(`${USERSCRIPT_NAME}: ${message}`);
  }

  log(QUIET, 'Running');

  function updateHeader() {
    log(DEBUG, 'updateHeader()');

    if (CONFIG.backgroundColor !== '') {
      HEADER_STYLE.textContent += `
        ${SELECTORS.header.self}
        {
          background-color: ${CONFIG.backgroundColor} !important;
        }
      `;
    }

    updateHamburgerButton();
    updateLogo();

    if (CONFIG.repositoryHeader.import) importRepositoryHeader();

    updatePageTitle();
    updateSearch();

    if (CONFIG.divider.remove) removeDivider();

    updateLink('issues');
    updateLink('pullRequests');

    if (CONFIG.flipIssuesPullRequests) flipIssuesPullRequests();

    updateCreateNewButton();
    updateInboxLink();

    if (CONFIG.flipCreateInbox) flipCreateInbox();

    updateGlobalBar();
    updateLocalBar();

    if (CONFIG.sidebars.backdropColor !== '') updateSidebarBackdropColor();

    HEADER.appendChild(HEADER_STYLE);
  }

  function updateHamburgerButton() {
    log(DEBUG, 'updateHamburgerButton()');

    const configKey = 'hamburgerButton';
    const elementConfig = CONFIG.hamburgerButton;
    log(DEBUG, `elementConfig: ${elementConfig}`);

    const hamburgerButton = HEADER.querySelector(SELECTORS[configKey]);

    if (!hamburgerButton) {
      logError(`${SELECTORS[configKey]} button not found`);
      return;
    }

    if (elementConfig.remove) {
      hamburgerButton.remove();
      return;
    }
  }

  function updateLogo() {
    log(DEBUG, 'updateLogo()');

    const elementConfig = CONFIG.logo;

    if (elementConfig.remove) {
      HEADER.querySelector(SELECTORS.logo.topDiv).remove();
    }

    const logo = HEADER.querySelector(SELECTORS.logo.svg);

    if (elementConfig.color !== '') {
      logo.style.setProperty('fill', elementConfig.color, 'important');
    }

    if (elementConfig.customSvg !== '') {
      const oldSvg = logo;

      let newSvg;

      if (isValidURL(elementConfig.customSvg)) {
        newSvg = document.createElement('img');
        newSvg.src = elementConfig.customSvg;
      } else {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(elementConfig.customSvg, 'image/svg+xml');
        newSvg = svgDoc.documentElement;
      }

      oldSvg.parentNode.replaceChild(newSvg, oldSvg);
    }
  }

  function updatePageTitle() {
    log(DEBUG, 'updatePageTitle()');

    const elementConfig = CONFIG.pageTitle;
    log(DEBUG, `elementConfig: ${elementConfig}`);

    const pageTitle = HEADER.querySelector(SELECTORS.pageTitle.topDiv);

    if (!pageTitle) {
      logError(`${SELECTORS.pageTitle.topDiv} div not found`);
      return;
    }

    if (elementConfig.remove) {
      pageTitle.style.setProperty('display', 'none', 'important');
    }

    if (elementConfig.color !== '') {
      HEADER_STYLE.textContent += `
        ${SELECTORS.pageTitle.links}
        {
          color: ${elementConfig.color} !important;
        }
      `;
    }

    if (elementConfig.hover.color !== '') {
      HEADER_STYLE.textContent += `
        ${SELECTORS.pageTitle.links}:hover
        {
          color: ${elementConfig.hover.color} !important;
        }
      `;
    }

    if (elementConfig.hover.backgroundColor !== '') {
      HEADER_STYLE.textContent += `
        ${SELECTORS.pageTitle.links}:hover
        {
          background-color: ${elementConfig.hover.backgroundColor} !important;
        }
      `;
    }
  }

  function updateSearch() {
    log(DEBUG, 'updateSearch()');

    const elementConfig = CONFIG.search;

    if (elementConfig.width === 'auto') {
      HEADER_STYLE.textContent += `
        @media (min-width: 1012px) {
          ${SELECTORS.search.input}
          {
            width: auto !important
          }

          ${SELECTORS.header.leftAligned}
          {
            flex: 0 1 auto !important;
          }

          ${SELECTORS.header.rightAligned}
          {
            flex: 1 1 auto !important;
            justify-content: space-between !important;
          }

          ${SELECTORS.search.topDiv}
          {
            display: block !important;
          }

          ${SELECTORS.search.topDiv}-whenRegular
          {
            max-width: none !important;
          }
        }
      `;
    } else if (elementConfig.width !== '') {
      HEADER_STYLE.textContent += `
        @media (min-width: 1012px)
        {
          ${SELECTORS.search.input}
          {
            width: ${elementConfig.width} !important
          }
        }
      `;
    }

    if (elementConfig.margin.left !== '') {
      HEADER_STYLE.textContent += `
        @media (min-width: 1012px)
        {
          ${SELECTORS.search.input}
          {
            margin-left: ${elementConfig.margin.left} !important
          }
        }
      `;
    }

    if (elementConfig.margin.right!== '') {
      HEADER_STYLE.textContent += `
        @media (min-width: 1012px)
        {
          ${SELECTORS.search.input}
          {
            margin-right: ${elementConfig.margin.right} !important
          }
        }
      `;
    }

    if (elementConfig.rightButton !== 'command palette') {
      const commandPaletteButton = HEADER.querySelector(SELECTORS.search.commandPalette);
      if (!commandPaletteButton) {
        logError(`Selector ${SELECTORS.search.commandPalette} not found`);
      } else {
        commandPaletteButton.remove();
      }
    }

    const placeholderSpan = HEADER.querySelector(SELECTORS.search.placeholderSpan);

    if (!placeholderSpan) {
      logError(`Selector ${SELECTORS.search.placeholderSpan} not found`);
      return;
    }

    if (elementConfig.placeholder.text !== '') {
      // Without this, the placeholder text is overwritten by the shadow DOM
      // You may see the following error in the console:
      // qbsearch-input-element.ts:421 Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'innerHTML')
      placeholderSpan.setAttribute('data-target', 'avoidShadowDOM');
      placeholderSpan.innerText = elementConfig.placeholder.text;
    }

    if (elementConfig.placeholder.color !== '') {
      HEADER_STYLE.textContent += `
        ${SELECTORS.search.placeholderSpan}
        {
          color: ${elementConfig.placeholder.color} !important;
        }
      `;
    }

    const searchButton = HEADER.querySelector(SELECTORS.search.button);

    if (!searchButton) {
      logError(`Selector ${SELECTORS.search.button} not found`);
      return;
    }

    if (elementConfig.backgroundColor !== '') {
      HEADER_STYLE.textContent += `
        ${SELECTORS.search.button}
        {
          background-color: ${elementConfig.backgroundColor} !important;
        }
      `;
    }

    if (elementConfig.borderColor !== '') {
      HEADER_STYLE.textContent += `
        ${SELECTORS.search.button}
        {
          border-color: ${elementConfig.borderColor} !important;
        }
      `;
    }

    if (elementConfig.boxShadow !== '') {
      HEADER_STYLE.textContent += `
        ${SELECTORS.search.button}
        {
          box-shadow: ${elementConfig.boxShadow} !important;
        }
      `;
    }

    if (elementConfig.magnifyingGlassIcon.remove) {
      searchButton?.parentNode?.firstElementChild?.remove();
    }

    if (elementConfig.modal.width !== '') {
      HEADER_STYLE.textContent += `
        ${SELECTORS.search.modal}
        {
          width: ${elementConfig.modal.width} !important;
        }
      `;
    }


    if (elementConfig.rightButton === 'slash key') {
      HEADER_STYLE.textContent += `
        ${SELECTORS.search.placeholderSpan}
        {
          width: 100% !important;
        }

        @media (min-width: 768px)
        {
          ${SELECTORS.search.input}
          {
            --feed-sidebar: 320px;
          }
        }

        @media (min-width: 1400px)
        {
          ${SELECTORS.search.input}
          {
            --feed-sidebar: 336px;
          }
        }
      `;

      const slashImg = document.createElement('img');
      slashImg.src = 'https://github.githubassets.com/images/search-key-slash.svg';
      slashImg.alt = 'slash key to search';
      slashImg.className = 'header-search-key-slash';

      const placeholderDiv = HEADER.querySelector(SELECTORS.search.placeholderDiv);

      if (!placeholderDiv) {
        logError(`Selector ${SELECTORS.search.placeholderDiv} not found`);
        return;
      }

      HEADER_STYLE.textContent += `
        ${SELECTORS.search.placeholderDiv}
        {
          display: flex !important;
        }

        ${SELECTORS.search.button}
        {
          padding-inline-start: 8px !important;
        }
      `;

      placeholderDiv.appendChild(slashImg);
    }

    if (elementConfig.alignLeft) {
      const searchTopDiv = HEADER.querySelector(SELECTORS.search.topDiv);

      if (!searchTopDiv) {
        logError(`${SELECTORS.search.topDiv} div not found`);
        return;
      }

      HEADER_STYLE.textContent += `
        ${SELECTORS.search.topDiv}
        {
          flex: 0 1 auto !important;
          justify-content: flex-start !important;
        }
      `;

      leftAlignElement(searchTopDiv);
    }
  }

  function removeDivider() {
    log(DEBUG, 'removeDivider()');

    HEADER_STYLE.textContent += `
      ${SELECTORS.header.actionsDiv}::before
      {
        content: none !important;
      }
    `;
  }

  function updateLink(configKey) {
    log(DEBUG, 'updateLink()');

    const tooltipElement = SELECTORS.toolTips[configKey];

    if (!tooltipElement) {
      logError(`${configKey} tooltip not found`);
      return;
    }

    const link = tooltipElement.previousElementSibling;

    const elementConfig = CONFIG[configKey];

    if (elementConfig.remove) {
      link.parentNode.remove();
      return;
    } else if (!elementConfig.tooltip) {
      tooltipElement.remove();
    }

    const padding = '7px';
    link.style.setProperty('padding-left', padding, 'important');
    link.style.setProperty('padding-right', padding, 'important');

    link.style.setProperty('display', 'flex', 'important');

    let textContent = elementConfig.text.content;

    const divId = `${configKey}-div`;
    link.parentNode.setAttribute('id', divId);

    if (elementConfig.icon.remove) {
      link.querySelector('svg').remove();
    } else {
      link.querySelector('svg').style.setProperty('fill', elementConfig.icon.color);
      textContent = UNICODE_NON_BREAKING_SPACE + textContent;
    }

    if (elementConfig.text.content !== '') {
      const spanElement = document.createElement('span');
      if (elementConfig.text.color) spanElement.style.setProperty('color', elementConfig.text.color);

      const textNode = document.createTextNode(textContent);
      spanElement.appendChild(textNode);

      link.appendChild(spanElement);
    }

    if (!elementConfig.border) {
      link.style.setProperty('border', 'none', 'important');
    }

    if (elementConfig.hover.backgroundColor !== '') {
      HEADER_STYLE.textContent += `
        #${divId} a:hover
        {
          background-color: ${elementConfig.hover.backgroundColor} !important;
        }
      `;
    }

    if (elementConfig.hover.color !== '') {
      HEADER_STYLE.textContent += `
        #${divId} a span:hover
        {
          color: ${elementConfig.hover.color} !important;
        }
      `;
    }

    if (elementConfig.alignLeft) {
      leftAlignElement(link.parentNode);
    }

    log(DEBUG, `Updates applied to link ${configKey}: `, link);
  }

  function flipIssuesPullRequests() {
    log(DEBUG, 'flipIssuesPullRequest()');

    const issuesDiv = HEADER.querySelector(SELECTORS.issues);
    const pullRequestsDiv = HEADER.querySelector(SELECTORS.pullRequests);

    issuesDiv.parentNode.insertBefore(pullRequestsDiv, issuesDiv);
  }

  function updateCreateNewButton() {
    log(DEBUG, 'updateCreateNewButton()');

    const configKey = 'create';
    const tooltipElement = SELECTORS.toolTips[configKey];

    if (!tooltipElement) {
      logError(`${configKey} tooltip not found`);
      return;
    }

    const button = HEADER.querySelector(SELECTORS.create.button);

    if (!button) {
      logError('"Create new..." button not found');
      return;
    }

    const elementConfig = CONFIG[configKey];

    if (elementConfig.remove) {
      button.parentNode.parentNode.parentNode.remove();
      return;
    } else if (!elementConfig.tooltip) {
      tooltipElement.remove();
    }

    const buttonLabel = button.querySelector(SELECTORS.create.dropdownIcon);

    if (elementConfig.plusIcon.remove) {
      button.querySelector(SELECTORS.create.plusIcon).remove();
    } else {

      if (elementConfig.plusIcon.color !== '') {
        HEADER_STYLE.textContent += `
        ${SELECTORS.create.plusIcon}
        {
          color: ${elementConfig.plusIcon.color} !important;
        }
      `;
      }

      if (elementConfig.plusIcon.hover.color !== '') {
        HEADER_STYLE.textContent += `
          ${SELECTORS.create.plusIcon.split(' ').join(':hover ')} svg path
          {
            fill: ${elementConfig.plusIcon.hover.color} !important;
          }
        `;
      }

      if (elementConfig.plusIcon.marginRight !== '') {
        HEADER_STYLE.textContent += `
          ${SELECTORS.create.plusIcon}
          {
            margin-right: ${elementConfig.plusIcon.marginRight} !important;
          }
        `;
      }
    }

    if (elementConfig.text.content !== '') {
      // Update the text's font properties to match the others
      HEADER_STYLE.textContent += `
        ${SELECTORS.create.button}
        {
          font-size: var(--text-body-size-medium, 0.875rem) !important;
          font-weight: var(--base-text-weight-medium, 500) !important;
        }
      `;

      const spanElement = document.createElement('span');
      spanElement.style.setProperty('color', elementConfig.text.color);
      spanElement.textContent = elementConfig.text.content;

      // New span is inserted between the plus sign and dropdown icon
      buttonLabel.parentNode.insertBefore(spanElement, buttonLabel);
    }

    if (elementConfig.dropdownIcon.remove) {
      buttonLabel.remove();
    } else {
      HEADER_STYLE.textContent += `
        ${SELECTORS.create.dropdownIcon}
        {
          grid-area: initial !important;
        }
      `;

      if (elementConfig.dropdownIcon.color !== '') {
        HEADER_STYLE.textContent += `
          ${SELECTORS.create.dropdownIcon}
          {
            color: ${elementConfig.dropdownIcon.color} !important;
          }
        `;
      }

      if (elementConfig.dropdownIcon.hover.color !== '') {
        HEADER_STYLE.textContent += `
          ${SELECTORS.create.dropdownIcon.split(' ').join(':hover ')} svg path
          {
            fill: ${elementConfig.dropdownIcon.hover.color} !important;
          }
        `;
      }
    }

    if (!elementConfig.border) {
      HEADER_STYLE.textContent += `
        ${SELECTORS.create.button}
        {
          border: none !important;
        }
      `;
    }

    if (elementConfig.hoverBackgroundColor !== '') {
      HEADER_STYLE.textContent += `
        ${SELECTORS.create.button}:hover
        {
          background-color: ${elementConfig.hoverBackgroundColor} !important;
        }
      `;
    }

    log(DEBUG, `Updates applied to button ${configKey}: `, button);
  }

  function updateInboxLink() {
    log(DEBUG, 'updateInboxLink()');

    const configKey = 'notifications';

    const inboxLink = HEADER.querySelector(SELECTORS.notifications.link);

    if (!inboxLink) {
      logError(`${SELECTORS.notifications.link} link not found`);
      return;
    }

    const elementConfig = CONFIG[configKey];

    if (elementConfig.remove) {
      inboxLink.parentNode.remove();
    } else if (!elementConfig.tooltip) {
      SELECTORS.toolTips.notifications.remove();
    }

    if (elementConfig.dot.remove) {
      HEADER_STYLE.textContent += `
        ${SELECTORS.notifications.dot}
        {
          content: none !important;
        }
      `;
    } else {
      if (elementConfig.dot.color !== '') {
        HEADER_STYLE.textContent += `
          ${SELECTORS.notifications.dot}
          {
            background: ${elementConfig.dot.color} !important;
          }
        `;
      }

      if (elementConfig.dot.boxShadowColor !== '') {
        HEADER_STYLE.textContent += `
          ${SELECTORS.notifications.dot}
          {
            box-shadow: 0 0 0 calc(var(--base-size-4, 4px)/2) ${elementConfig.dot.boxShadowColor} !important;
          }
        `;
      }
    }

    if (elementConfig.icon.symbol === 'inbox') {
      if (elementConfig.icon.color !== '') {
        HEADER_STYLE.textContent += `
          ${SELECTORS.notifications.link} svg
          {
            fill: elementConfig.icon.color !important;
          }
        `;
      }
    } else {
      inboxLink.querySelector('svg').remove();
    }

    if (elementConfig.icon.symbol === 'bell') {
      // Bell icon from https://gist.github.com
      const bellSvg = `<svg aria-hidden='true' height='16' viewBox='0 0 16 16' version='1.1' width='16' data-view-component='true' class='octicon octicon-bell'><path fill='${elementConfig.icon.color}' d='M8 16a2 2 0 0 0 1.985-1.75c.017-.137-.097-.25-.235-.25h-3.5c-.138 0-.252.113-.235.25A2 2 0 0 0 8 16ZM3 5a5 5 0 0 1 10 0v2.947c0 .05.015.098.042.139l1.703 2.555A1.519 1.519 0 0 1 13.482 13H2.518a1.516 1.516 0 0 1-1.263-2.36l1.703-2.554A.255.255 0 0 0 3 7.947Zm5-3.5A3.5 3.5 0 0 0 4.5 5v2.947c0 .346-.102.683-.294.97l-1.703 2.556a.017.017 0 0 0-.003.01l.001.006c0 .002.002.004.004.006l.006.004.007.001h10.964l.007-.001.006-.004.004-.006.001-.007a.017.017 0 0 0-.003-.01l-1.703-2.554a1.745 1.745 0 0 1-.294-.97V5A3.5 3.5 0 0 0 8 1.5Z'></path></svg>`;
      inboxLink.insertAdjacentHTML('afterbegin', bellSvg);
    }

    if (elementConfig.icon.hover.color !== '') {
      HEADER_STYLE.textContent += `
        ${SELECTORS.notifications.link}:hover svg path
        {
          fill: ${elementConfig.icon.hover.color} !important;
        }
      `;
    }

    if (elementConfig.text.content !== '') {
      const padding = '9px';

      HEADER_STYLE.textContent += `
        ${SELECTORS.notifications.link}
        {
          padding-left: ${padding} !important;
          padding-right: ${padding} !important;
          width: auto !important;
          text-decoration: none !important;
          display: flex !important;
        }
      `;

      let textContent = elementConfig.text.content;

      if (elementConfig.icon !== '') {
        textContent = UNICODE_NON_BREAKING_SPACE + UNICODE_NON_BREAKING_SPACE + textContent;
      }

      const spanElement = document.createElement('span');

      // Update the text's font properties to match the others
      spanElement.style.setProperty('font-size', 'var(--text-body-size-medium, 0.875rem)', 'important');
      spanElement.style.setProperty('font-weight', 'var(--base-text-weight-medium, 500)', 'important');

      if (elementConfig.text.color) spanElement.style.setProperty('color', elementConfig.text.color);

      const textNode = document.createTextNode(textContent);
      spanElement.appendChild(textNode);

      inboxLink.appendChild(spanElement);
    }

    if (!elementConfig.border) {
      HEADER_STYLE.textContent += `
        ${SELECTORS.notifications.link}
        {
          border: none !important;
        }
      `;
    }

    if (elementConfig.dot.displayOverIcon) {
      HEADER_STYLE.textContent += `
        ${SELECTORS.notifications.dot}
        {
          top: 5px !important;
          left: 18px !important;
        }
      `;
    }

    if (elementConfig.hoverBackgroundColor !== '') {
      HEADER_STYLE.textContent += `
        ${SELECTORS.notifications.link}:hover
        {
          background-color: ${elementConfig.hoverBackgroundColor} !important;
        }
      `;
    }

    log(DEBUG, `Updates applied to link ${configKey}: `, inboxLink);
  }

  function updateGlobalBar() {
    log(DEBUG, 'updateGlobalBar()');

    const elementConfig = CONFIG.globalBar;

    if (elementConfig.boxShadowColor !== '') {
      HEADER_STYLE.textContent += `
        ${SELECTORS.header.globalBar}
        {
          box-shadow: inset 0 calc(var(--borderWidth-thin, 1px)*-1) ${elementConfig.boxShadowColor} !important;
        }
      `;
    }

    if (elementConfig.rightAligned.gap !== '') {
      HEADER_STYLE.textContent += `
        ${SELECTORS.header.rightAligned}
        {
          gap: ${elementConfig.rightAligned.gap} !important;
        }
      `;
    }

    if (elementConfig.leftAligned.gap !== '') {
      HEADER_STYLE.textContent += `
        ${SELECTORS.header.leftAligned}
        {
          gap: ${elementConfig.leftAligned.gap} !important;
        }
      `;
    }
  }

  function flipCreateInbox() {
    log(DEBUG, 'flipCreateInbox()');

    const createTopDiv = HEADER.querySelector(SELECTORS.create.topDiv);
    const notificationsIndicator = HEADER.querySelector(SELECTORS.notifications.indicator);

    let createTopDivClone = createTopDiv.cloneNode(true);
    let notificationsIndicatorClone = notificationsIndicator.cloneNode(true);

    createTopDiv.parentNode.replaceChild(notificationsIndicatorClone, createTopDiv);
    notificationsIndicator.parentNode.replaceChild(createTopDivClone, notificationsIndicator);
  }

  function updateLocalBar() {
    log(DEBUG, 'updateLocalBar()');

    const elementConfig = CONFIG.localBar;

    if (elementConfig.backgroundColor !== '') {
      HEADER_STYLE.textContent += `
        ${SELECTORS.header.localBar}
        {
          background-color: ${elementConfig.backgroundColor} !important;
          box-shadow: inset 0 calc(var(--borderWidth-thin, 1px)*-1) var(--color-border-default) !important;
        }
      `;
    }

    if (elementConfig.center) {
      HEADER_STYLE.textContent += `
        ${SELECTORS.header.localBar} nav
        {
          max-width: 1280px;
          margin-right: auto;
          margin-left: auto;
        }

        @media (min-width: 768px) {
          ${SELECTORS.header.localBar} nav
          {
            padding-right: var(--base-size-24, 24px) !important;
            padding-left: var(--base-size-24, 24px) !important;
          }
        }

        @media (min-width: 1012px) {
          ${SELECTORS.header.localBar} nav
          {
            padding-right: var(--base-size-32, 32px) !important;
            padding-left: var(--base-size-32, 32px) !important;
          }
        }
      `;
    }

    if (elementConfig.boxShadow.consistentColor) {
      HEADER_STYLE.textContent += `
        .UnderlineNav
        {
          box-shadow: none !important;
        }
      `;
    }

    if (elementConfig.links.color !== '') {
      HEADER_STYLE.textContent += `
        ${SELECTORS.header.localBar} a,
        ${SELECTORS.header.localBar} a span
        {
          color: ${elementConfig.links.color} !important;
        }
      `;
    }
  }

  function updateSidebarBackdropColor() {
    log(DEBUG, 'updateSidebarBackdropColor()');

    HEADER_STYLE.textContent += `
      .Overlay-backdrop--side
      {
        background-color: ${CONFIG.sidebars.backdropColor} !important;
      }
    `;
  }

  function importRepositoryHeader() {
    log(DEBUG, 'importRepositoryHeader()');

    const configKey = 'repositoryHeader';
    const repositoryHeader = document.querySelector(SELECTORS[configKey].id);

    if (!repositoryHeader) {
      // This is expected on pages that aren't repositories
      log(DEBUG, `${SELECTORS[configKey].id} not found`);
      return;
    }

    const topRepositoryHeaderElement = document.createElement('div');
    topRepositoryHeaderElement.style.setProperty('display', 'flex');
    topRepositoryHeaderElement.style.setProperty('padding', '0px');
    topRepositoryHeaderElement.style.setProperty('box-shadow', 'none');

    const elementConfig = CONFIG[configKey];

    if (elementConfig.backgroundColor !== '') {
      topRepositoryHeaderElement.style.setProperty('background-color', elementConfig.backgroundColor);
    }

    if (repositoryHeader.hidden) {
      log(DEBUG, `${SELECTORS[configKey].id} is hidden`);

      if (!HEADER.querySelector(SELECTORS.pageTitle.separator)) {
        log(INFO, `${SELECTORS.pageTitle.separator} div not found`);
        log(INFO, 'Not creating a repository header');

        return;
      }

      // A repo tab other than Code is being loaded for the first time
      if (!CONFIG.pageTitle.remove) return;

      const pageTitle = HEADER.querySelector(SELECTORS.pageTitle.topDiv);

      if (!pageTitle) {
        logError(`${SELECTORS.pageTitle.topDiv} div not found`);
        return;
      }

      const repositoryHeaderElement = document.createElement('div');
      repositoryHeaderElement.id = TEMP_REPOSITORY_HEADER_FLAG;
      repositoryHeaderElement.classList.add('pt-3', 'mb-2', REPOSITORY_HEADER_CLASS);

      const clonedPageTitle = pageTitle.cloneNode(true);
      repositoryHeaderElement.appendChild(clonedPageTitle);

      topRepositoryHeaderElement.appendChild(repositoryHeaderElement);
      insertNewGlobalBar(topRepositoryHeaderElement);
    } else if (HEADER.querySelector(`#${TEMP_REPOSITORY_HEADER_FLAG}`)) {
      // The Code tab is being loaded from another tab which has a temporary header
      HEADER.querySelector(`#${TEMP_REPOSITORY_HEADER_FLAG}`).remove();

      insertPermanentRepositoryHeader(topRepositoryHeaderElement, repositoryHeader);
    } else {
      // The Code tab being loaded for the first time
      insertPermanentRepositoryHeader(topRepositoryHeaderElement, repositoryHeader);
    }

    updateRepositoryHeaderName();

    if (elementConfig.backgroundColor !== '') {
      HEADER_STYLE.textContent += `
        .${REPOSITORY_HEADER_CLASS}
        {
          background-color: ${elementConfig.backgroundColor} !important;
        }
      `;
    }

    if (elementConfig.center) {
      HEADER_STYLE.textContent += `
        .${REPOSITORY_HEADER_CLASS}
        {
          max-width: 1280px;
          margin-right: auto;
          margin-left: auto;
        }

        .${REPOSITORY_HEADER_CLASS} div
        {
          padding-left: 0px !important;
          padding-right: 0px !important;
        }

        @media (min-width: 768px) {
          .${REPOSITORY_HEADER_CLASS}
          {
            padding-right: var(--base-size-24, 24px) !important;
            padding-left: var(--base-size-24, 24px) !important;
          }
        }

        @media (min-width: 1012px) {
          .${REPOSITORY_HEADER_CLASS}
          {
            padding-right: var(--base-size-32, 32px) !important;
            padding-left: var(--base-size-32, 32px) !important;
          }
        }
      `;
    }

    let linkColor, linkHoverColor, linkHoverBackgroundColor, linkHoverTextDecoration;

    if (elementConfig.link.color !== '') {
      linkColor = `color: ${elementConfig.link.color} !important;`;
    }

    if (elementConfig.link.color !== '') {
      linkColor = `color: ${elementConfig.link.color} !important;`;
    }

    if (elementConfig.link.hover.color !== '') {
      linkHoverColor = `color: ${elementConfig.link.hover.color} !important;`;
    }

    if (elementConfig.link.hover.backgroundColor !== '') {
      linkHoverBackgroundColor = `background-color: ${elementConfig.link.hover.backgroundColor} !important;`;
    }

    if (elementConfig.link.hover.textDecoration !== '') {
      linkHoverTextDecoration = `text-decoration: ${elementConfig.link.hover.textDecoration} !important;`;
    }

    HEADER_STYLE.textContent += `
      .${REPOSITORY_HEADER_CLASS}
      {
        flex: auto !important;
      }

      ${SELECTORS.repositoryHeader.details}
      {
        display: flex;
        align-items: center;
      }

      ${SELECTORS.repositoryHeader.links}
      {
        ${linkColor}
      }

      ${SELECTORS.repositoryHeader.links}:hover
      {
        ${linkHoverColor}
        ${linkHoverBackgroundColor}
        ${linkHoverTextDecoration}
      }

      ${SELECTORS.pageTitle.topDiv}
      {
        flex: 0 1 auto !important;
        height: auto !important;
        min-width: 0 !important;
      }

      @media (min-width: 768px)
      {
        .AppHeader-context .AppHeader-context-compact
        {
          display: none !important;
        }
      }

      .AppHeader-context .AppHeader-context-full
      {
        display: inline-flex !important;
        width: 100% !important;
        min-width: 0 !important;
        max-width: 100% !important;
        overflow: hidden !important;
      }

      .AppHeader-context .AppHeader-context-full ul {
        display: flex;
        flex-direction: row;
      }

      .AppHeader-context .AppHeader-context-full li:first-child {
        flex: 0 100 max-content;
      }

      .AppHeader-context .AppHeader-context-full li {
        display: inline-grid;
        grid-auto-flow: column;
        align-items: center;
        flex: 0 99999 auto;
      }

      .AppHeader-context .AppHeader-context-full ul, .AppHeader .AppHeader-globalBar .AppHeader-context .AppHeader-context-full li {
        list-style: none;
      }

      .AppHeader-context .AppHeader-context-item {
        display: flex;
        align-items: center;
        min-width: 3ch;
        line-height: var(--text-body-lineHeight-medium, 1.4285714286);
        text-decoration: none !important;
        border-radius: var(--borderRadius-medium, 6px);
        padding-inline: var(--control-medium-paddingInline-condensed, 8px);
        padding-block: var(--control-medium-paddingBlock, 6px);
      }

      .AppHeader-context .AppHeader-context-full li:last-child .AppHeader-context-item {
        font-weight: var(--base-text-weight-semibold, 600);
      }

      .AppHeader-context .AppHeader-context-item-separator {
        color: var(--fgColor-muted, var(--color-fg-muted));
        white-space: nowrap;
      }

      ${SELECTORS.header.globalBar}
      {
        padding: 16px !important;
      }
    `;

    return true;
  }

  function insertPermanentRepositoryHeader(topRepositoryHeaderElement, repositoryHeader) {
    log(DEBUG, 'insertPermanentRepositoryHeader()');

    const clonedRepositoryHeader = repositoryHeader.cloneNode(true);

    // This is needed to prevent pop-in via Turbo when navigating between tabs on a repo
    repositoryHeader.removeAttribute('data-turbo-replace');
    clonedRepositoryHeader.removeAttribute('data-turbo-replace');

    repositoryHeader.style.setProperty('display', 'none', 'important');

    clonedRepositoryHeader.classList.add(REPOSITORY_HEADER_SUCCESS_FLAG, REPOSITORY_HEADER_CLASS);

    topRepositoryHeaderElement.appendChild(clonedRepositoryHeader);

    insertNewGlobalBar(topRepositoryHeaderElement);

    clonedRepositoryHeader.firstElementChild.classList.remove('container-xl', 'px-lg-5');
  }

  function updateRepositoryHeaderName() {
    log(DEBUG, 'updateRepositoryHeaderName()');

    const elementConfig = CONFIG.repositoryHeader;

    const name = document.querySelector(SELECTORS.repositoryHeader.name);

    if (!name) {
      // When not in a repo, this is expected
      log(DEBUG, `${SELECTORS.repositoryHeader.name} link not found`);
      return;
    }

    name.style.setProperty('display', 'none', 'important');

    const pageTitle = HEADER.querySelector(SELECTORS.pageTitle.topDiv);

    if (!pageTitle) {
      logError(`${SELECTORS.pageTitle.topDiv} div not found`);
      return;
    }

    const ownerImg = document.querySelector(SELECTORS.repositoryHeader.ownerImg);

    if (!ownerImg) {
      logError(`${SELECTORS.repositoryHeader.ownerImg} avatar not found`);
      return;
    }

    const clonedPageTitle = pageTitle.cloneNode(true);
    clonedPageTitle.style.display = '';

    clonedPageTitle.querySelectorAll('svg').forEach(svg => svg.remove());

    ownerImg.parentNode.insertBefore(clonedPageTitle, ownerImg.nextSibling);

    if (elementConfig.avatar.remove) {
      ownerImg.remove();
    } else if (elementConfig.avatar.customSvg !== '') {
      if (isValidURL(elementConfig.avatar.customSvg)) {
        ownerImg.src = elementConfig.avatar.customSvg;
      } else {
        const divElement = document.createElement('div');
        divElement.style.setProperty('display', 'flex');
        divElement.style.setProperty('align-items', 'center');

        divElement.innerHTML = elementConfig.avatar.customSvg;

        ownerImg.parentNode.replaceChild(divElement, ownerImg);
      }
    }

    document.querySelector(SELECTORS.repositoryHeader.bottomBorder).remove();
  }

  function leftAlignElement(element) {
    log(DEBUG, 'leftAlignElement()');

    const leftAlignedDiv = HEADER.querySelector(SELECTORS.header.leftAligned);

    if (!leftAlignedDiv) {
      logError(`${SELECTORS.header.leftAligned} div not found`);
      return;
    }

    leftAlignedDiv.appendChild(element);
  }

  function insertNewGlobalBar(element) {
    log(DEBUG, 'insertNewGlobalBar()');

    let elementToInsertAfter = HEADER.querySelector(SELECTORS.header.globalBar);

    elementToInsertAfter.parentNode.insertBefore(element, elementToInsertAfter.nextSibling);
  }

  function isValidURL(string) {
    log(DEBUG, 'isValidURL()');

    const urlPattern = /^(https?:\/\/)?([\w.]+)\.([a-z]{2,6}\.?)(\/[\w.]*)*\/?$/i;
    return urlPattern.test(string);
  }

  function setSelectors(headerSelector, repositoryHeaderId) {
    log(DEBUG, 'setSelectors()');

    const toolTips = Array.from(HEADER.querySelectorAll('tool-tip'));
    SELECTORS = {
      header: {
        self: headerSelector,
        actionsDiv: '.AppHeader-actions',
        globalBar: '.AppHeader-globalBar',
        localBar: '.AppHeader-localBar',
        leftAligned: '.AppHeader-globalBar-start',
        rightAligned: '.AppHeader-globalBar-end',
      },
      logo: {
        topDiv: '.AppHeader-logo',
        svg: '.AppHeader-logo svg',
      },
      toolTips: {
        create: toolTips.find(
          tooltip => tooltip.textContent.includes('Create new')
        ),
        pullRequests: toolTips.find(
          tooltip => tooltip.textContent.includes('Pull requests')
        ),
        issues: toolTips.find(
          tooltip => tooltip.textContent.includes('Issues')
        ),
        notifications: toolTips.find(
          tooltip => tooltip.getAttribute('data-target') === 'notification-indicator.tooltip'
        ),
      },
      hamburgerButton: 'deferred-side-panel',
      pageTitle: {
        topDiv: '.AppHeader-context',
        links: '.AppHeader-context a',
        separator: '.AppHeader-context-item-separator',
      },
      search: {
        topDiv: '.AppHeader-search',
        input: '.search-input',
        button: '[data-target="qbsearch-input.inputButton"]',
        commandPalette: '#AppHeader-commandPalette-button',
        placeholderSpan: '#qb-input-query',
        placeholderDiv: '.AppHeader-search-control .overflow-hidden',
        modal: '[data-target="qbsearch-input.queryBuilderContainer"]',
      },
      create: {
        topDiv: 'action-menu',
        button: '#global-create-menu-button',
        plusIcon: '#global-create-menu-button .Button-visual.Button-leadingVisual',
        dropdownIcon: '#global-create-menu-button .Button-label',
      },
      issues: '#issues-div',
      pullRequests: '#pullRequests-div',
      notifications: {
        indicator: 'notification-indicator',
        link: 'notification-indicator a',
        dot: '.AppHeader-button.AppHeader-button--hasIndicator::before',
      },
      repositoryHeader: {
        id: repositoryHeaderId,
        ownerImg: `.${REPOSITORY_HEADER_CLASS} img`,
        name: `.${REPOSITORY_HEADER_CLASS} strong`,
        links: `.${REPOSITORY_HEADER_CLASS} nav[role="navigation"] a`,
        details: '#repository-details-container',
        bottomBorder: `.${REPOSITORY_HEADER_CLASS} .border-bottom.mx-xl-5`,
      },
    };
  }

  function waitForFeaturePreviewButton() {
    log(DEBUG, 'waitForFeaturePreviewButton()');

    const featurePreviewSearch = HEADER.querySelectorAll('[data-analytics-event*="FEATURE_PREVIEW"]');

    if (featurePreviewSearch.length === 1) {
      const featurePreviewButton = featurePreviewSearch[0];
      const featurePreviewLi = featurePreviewButton.parentNode;

      const newLiElement = featurePreviewLi.cloneNode(true);
      newLiElement.removeAttribute('data-targets');

      const newButton = newLiElement.querySelector('button');
      newButton.removeAttribute('id');
      newButton.removeAttribute('data-analytics-event');
      newButton.removeAttribute('data-show-dialog-id');
      newButton.removeAttribute('data-view-component');
      newButton.onclick = () => {
        GMC.open();
      };

      const textElement = newLiElement.querySelector('.ActionListItem-label');
      textElement.textContent = 'Customize global navigation';

      const oldSvg = newLiElement.querySelector('svg');

      const newSvg = document.createElement('img');
      newSvg.setAttribute('height', '16px');
      newSvg.setAttribute('width', '16px');
      newSvg.src = 'https://raw.githubusercontent.com/blakegearin/github-custom-global-naviation/main/img/logo_grey.svg';

      oldSvg.parentNode.replaceChild(newSvg, oldSvg);

      const parentUl = featurePreviewLi.parentNode;
      const settingsLi = HEADER.querySelector('a[href="/settings/profile"]').parentNode;

      parentUl.insertBefore(newLiElement, settingsLi.nextSibling);

      const divider = featurePreviewLi.parentNode.querySelector('.ActionList-sectionDivider');
      const newDivider = divider.cloneNode(true);

      parentUl.insertBefore(newDivider, settingsLi.nextSibling);
    } else {
      setTimeout(waitForFeaturePreviewButton, 100);
    }
  }

  function generateCustomConfig() {
    log(DEBUG, 'generateCustomConfig()');

    const customConfig = {
      light: {},
      dark: {},
    };

    function recursivelyGenerateCustomConfig(obj, customObj, themePrefix, parentKey = '') {
      for (const key in obj) {
        const currentKey = parentKey ? `${parentKey}.${key}` : key;
        if (typeof obj[key] === 'object') {
          customObj[key] = {};
          recursivelyGenerateCustomConfig(obj[key], customObj[key], themePrefix, currentKey);
        } else {
          const gmcKey = `${themePrefix}_${currentKey.replace(/\./g, '_')}`;
          customObj[key] = GMC.get(gmcKey);
        }
      }
    }

    recursivelyGenerateCustomConfig(configs.happyMedium.light, customConfig.light, 'light');
    recursivelyGenerateCustomConfig(configs.happyMedium.dark, customConfig.dark, 'dark');

    return customConfig;
  }

  function setTheme() {
    log(DEBUG, 'setTheme()');

    const dataColorMode = document.querySelector('html').getAttribute('data-color-mode');

    if (dataColorMode === 'auto') {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        THEME = 'dark';
      }
    } else if (dataColorMode === 'dark') {
      THEME = 'dark';
    } else if (dataColorMode !== 'light')  {
      logError(`${USERSCRIPT_NAME}: Unknown color mode`);
    }

    log(VERBOSE, `THEME: ${THEME}`);
  }

  function gmcInitialized() {
    log(DEBUG, 'gmcInitialized()');

    GMC.css.basic = '';
    window.addEventListener('load', () => {
      OBSERVER.observe(
        document.body,
        {
          childList: true,
          subtree: true
        }
      );
    });
  }

  function gmcOpened() {
    log(DEBUG, 'gmcOpened()');

    function updateCheckboxes() {
      log(DEBUG, 'updateCheckboxes()');

      const checkboxes = document.querySelectorAll('#gmc-frame input[type="checkbox"]');

      if (checkboxes.length > 0) {
        checkboxes.forEach(checkbox => {
          checkbox.classList.add('gmc-checkbox');
        });
      } else {
        setTimeout(updateCheckboxes, 100);
      }
    }

    updateCheckboxes();

    const configVars = document.querySelectorAll('.config_var');

    configVars.forEach(configVar => {
      const label = configVar.querySelector('.field_label');
      const input = configVar.querySelector('input');

      if (label && input) label.style.lineHeight = '33px';

      const select = configVar.querySelector('select');

      if (label && select) label.style.lineHeight = '33px';
    });

    document.querySelector('#gmc-frame .reset_holder').remove();

    document.querySelector('#gmc').classList.remove('hidden');
  }

  function gmcClosed() {
    log(DEBUG, 'gmcClosed()');

    document.querySelector('#gmc').classList.add('hidden');
  }

  function gmcClearCustom() {
    log(DEBUG, 'gmcClearCustom()');

    GMC.reset();
  }

  function configsToGMC(config, path = []) {
    log(DEBUG, 'configsToGMC()');

    for (const key in config) {
      if (typeof config[key] === 'object' && !Array.isArray(config[key])) {
        configsToGMC(config[key], path.concat(key));
      } else {
        const fieldName = path.concat(key).join('_');
        const fieldValue = config[key];

        GMC.set(fieldName, fieldValue);
      }
    }
  }

  function gmcApplyCustomDefaultConfig() {
    log(DEBUG, 'gmcApplyCustomDefaultConfig()');

    configsToGMC(configs.default);

    GMC.close();
    GMC.open();
  }

  function gmcApplyCustomOldSchoolConfig() {
    log(DEBUG, 'gmcApplyCustomOldSchoolConfig()');

    configsToGMC(configs.oldSchool);

    GMC.close();
    GMC.open();
  }

  function observeAndModify(mutationsList) {
    log(DEBUG, 'observeAndModify()');

    if (IDLE_MUTATION_COUNT > MAX_IDLE_MUTATIONS) {
      console.error('MAX_IDLE_MUTATIONS exceeded');
      OBSERVER.disconnect();

      return;
    }

    const configName = {
      'Happy Medium': 'happyMedium',
      'Old School': 'oldSchool',
      'Custom': 'custom',
    }[GMC.get('type')];

    if (configName === 'off') return;

    if (configName === 'custom') configs.custom = generateCustomConfig();

    CONFIG = configs[configName][THEME];

    log(VERBOSE, 'CONFIG');
    log(VERBOSE, CONFIG);

    const headerSuccessFlag = 'customizedHeader';
    const repositoryHeaderId = '#repository-container-header';

    for (const mutation of mutationsList) {
      // Use header id to determine if updates have already been applied
      if (mutation.type !== 'childList') return;

      log(VERBOSE, 'mutation');
      log(VERBOSE, mutation);

      if (!document.getElementById(headerSuccessFlag)) {
        const headerSelector = 'header.AppHeader';
        HEADER = document.querySelector(headerSelector);

        if (!HEADER) continue;

        setSelectors(headerSelector, repositoryHeaderId);

        if (configName === 'oldSchool') {
          HEADER_STYLE.textContent += `
            @media (max-width: 767.98px)
            {
              action-menu
              {
                display: none !important;
              }
            }
          `;
        }

        updateHeader();
        HEADER.setAttribute('id', headerSuccessFlag);

        log(QUIET, 'Complete');

        const featurePreviewButton = HEADER.querySelector('[aria-label="Open user account menu"]');
        if (featurePreviewButton) {
          featurePreviewButton.addEventListener('click', waitForFeaturePreviewButton);
        }

        break;
      }
      else if (CONFIG.repositoryHeader.import) {
        // When starting in a repository tab like Issues, the proper repository header
        // (including  Unwatch, Star, and Fork) is not present per GitHub's design.
        // If page title is removed, the page will be missing any location context in the header.
        // To improve this experience, a temporary repository header is created with the
        // page title or breadcrumbs.
        // The proper repository header replaces the temporary one when navigating to the Code tab.
        if (
          !document.querySelector(repositoryHeaderId)?.hidden &&
          (
            document.querySelector(`#${TEMP_REPOSITORY_HEADER_FLAG}`) ||
            !document.querySelector(`.${REPOSITORY_HEADER_SUCCESS_FLAG}`)
          )
        ) {
          const updated = importRepositoryHeader();

          if (updated) {
            log(QUIET, 'Repository header updated');
          } else {
            IDLE_MUTATION_COUNT++;
          }

          break;
        }
      }
    }
  }

  let CONFIG;
  let HEADER;
  let SELECTORS;
  let HEADER_STYLE = document.createElement('style');
  let THEME = 'light';
  let IDLE_MUTATION_COUNT = 0;

  const UNICODE_NON_BREAKING_SPACE = '\u00A0';
  const REPOSITORY_HEADER_SUCCESS_FLAG = 'permCustomizedRepositoryHeader';
  const TEMP_REPOSITORY_HEADER_FLAG = 'tempCustomizedRepositoryHeader';
  const REPOSITORY_HEADER_CLASS = 'customizedRepositoryHeader';
  const MAX_IDLE_MUTATIONS = 1000;

  setTheme();

  const oldSchoolColor = '#F0F6FC';
  const oldSchoolHoverColor = '#FFFFFFB3';
  const oldSchoolHoverBackgroundColor = 'transparent';
  let configs = {
    happyMedium: {
      light: {
        backgroundColor: '',
        applyPositionTransformations: false,
        hamburgerButton: {
          remove: false,
        },
        logo: {
          remove: true,
          color: '',
          customSvg: '',
        },
        pageTitle: {
          remove: false,
          color: '',
          hover: {
            backgroundColor: '',
            color: '',
          },
        },
        search: {
          backgroundColor: '',
          borderColor: '',
          boxShadow: '',
          alignLeft: false,
          width: 'auto',
          margin: {
            left: '',
            right: '',
          },
          magnifyingGlassIcon: {
            remove: false,
          },
          placeholder: {
            text: '',
            color: '',
          },
          rightButton: 'command palette',
          modal: {
            width: '',
          },
        },
        divider: {
          remove: true,
        },
        flipCreateInbox: true,
        create: {
          remove: false,
          border: true,
          tooltip: false,
          hoverBackgroundColor: '',
          plusIcon: {
            remove: false,
            color: '',
            marginRight: '0px',
            hover: {
              color: '',
            }
          },
          text: {
            content: 'Create',
            color: '',
          },
          dropdownIcon: {
            remove: false,
            color: '',
            hover: {
              color: '',
            },
          },
        },
        flipIssuesPullRequests: false,
        issues: {
          remove: false,
          border: true,
          tooltip: false,
          alignLeft: true,
          icon: {
            remove: false,
            color: '',
          },
          text: {
            content: 'Issues',
            color: '',
          },
          hover: {
            backgroundColor: '',
            color: '',
          },
        },
        pullRequests: {
          remove: false,
          border: true,
          tooltip: false,
          alignLeft: true,
          icon: {
            remove: false,
            color: '',
          },
          text: {
            content: 'Pull requests',
            color: '',
          },
          hover: {
            backgroundColor: '',
            color: '',
          },
        },
        notifications: {
          remove: false,
          border: true,
          tooltip: false,
          hoverBackgroundColor: '',
          icon: {
            symbol: 'bell', // Accepts 'inbox', 'bell', or ''
            color: '',
            hover: {
              color: '',
            }
          },
          text: {
            content: 'Inbox',
            color: '',
          },
          dot: {
            remove: false,
            boxShadowColor: '',
            color: '',
            displayOverIcon: true,
          },
        },
        avatar: {
          dropdownIcon: false,
        },
        globalBar: {
          boxShadowColor: '',
          leftAligned: {
            gap: '',
          },
          rightAligned: {
            gap: '',
          },
        },
        localBar: {
          backgroundColor: '#02040A',
          center: false,
          boxShadow: {
            consistentColor: true,
          },
          links: {
            color: '',
          },
        },
        sidebars: {
          backdropColor: 'transparent',
        },
        repositoryHeader: {
          import: true,
          center: false,
          backgroundColor: '#02040A',
          avatar: {
            remove: false,
            customSvg: '',
          },
          link: {
            color: '#6AAFF9',
            hover: {
              backgroundColor: 'transparent',
              color: 'var(--color-accent-fg)',
              textDecoration: 'underline',
            },
          },
        },
      },
      dark: {
        backgroundColor: '',
        hamburgerButton: {
          remove: false,
        },
        logo: {
          remove: true,
          color: '',
          customSvg: '',
        },
        pageTitle: {
          remove: false,
          color: '',
          hover: {
            backgroundColor: '',
            color: '',
          },
        },
        search: {
          backgroundColor: '',
          borderColor: '',
          boxShadow: '',
          alignLeft: false,
          width: 'auto',
          margin: {
            left: '',
            right: '',
          },
          magnifyingGlassIcon: {
            remove: false,
          },
          placeholder: {
            text: '',
            color: '',
          },
          rightButton: 'command palette',
          modal: {
            width: '',
          },
        },
        divider: {
          remove: true,
        },
        flipCreateInbox: true,
        create: {
          remove: false,
          border: true,
          tooltip: false,
          hoverBackgroundColor: '',
          plusIcon: {
            remove: false,
            color: '',
            marginRight: '0px',
            hover: {
              color: '',
            }
          },
          text: {
            content: 'Create',
            color: '',
          },
          dropdownIcon: {
            remove: false,
            color: '',
            hover: {
              color: '',
            },
          },
        },
        flipIssuesPullRequests: false,
        issues: {
          remove: false,
          border: true,
          tooltip: false,
          alignLeft: true,
          icon: {
            remove: false,
            color: '',
          },
          text: {
            content: 'Issues',
            color: '',
          },
          hover: {
            backgroundColor: '',
            color: '',
          },
        },
        pullRequests: {
          remove: false,
          border: true,
          tooltip: false,
          alignLeft: true,
          icon: {
            remove: false,
            color: '',
          },
          text: {
            content: 'Pull requests',
            color: '',
          },
          hover: {
            backgroundColor: '',
            color: '',
          },
        },
        notifications: {
          remove: false,
          border: true,
          tooltip: false,
          hoverBackgroundColor: '',
          icon: {
            symbol: 'bell', // Accepts 'inbox', 'bell', or ''
            color: '',
            hover: {
              color: '',
            }
          },
          text: {
            content: 'Inbox',
            color: '',
          },
          dot: {
            remove: false,
            boxShadowColor: '',
            color: '',
            displayOverIcon: true,
          },
        },
        avatar: {
          dropdownIcon: false,
        },
        globalBar: {
          boxShadowColor: '',
          leftAligned: {
            gap: '',
          },
          rightAligned: {
            gap: '',
          },
        },
        localBar: {
          backgroundColor: '#02040A',
          center: false,
          boxShadow: {
            consistentColor: true,
          },
          links: {
            color: '',
          },
        },
        sidebars: {
          backdropColor: 'transparent',
        },
        repositoryHeader: {
          import: true,
          center: false,
          backgroundColor: '#02040A',
          avatar: {
            remove: false,
            customSvg: '',
          },
          link: {
            color: '#6AAFF9',
            hover: {
              backgroundColor: 'transparent',
              color: 'var(--color-accent-fg)',
              textDecoration: 'underline',
            },
          },
        },
      },
    },
    oldSchool: {
      light: {
        backgroundColor: '#161C20',
        applyPositionTransformations: true,
        hamburgerButton: {
          remove: true,
        },
        logo: {
          remove: false,
          color: '#e6edf3',
          customSvg: '',
        },
        pageTitle: {
          remove: true,
          color: oldSchoolColor,
          hover: {
            backgroundColor: oldSchoolHoverBackgroundColor,
            color: oldSchoolHoverColor,
          },
        },
        search: {
          backgroundColor: '#494D54',
          borderColor: '#30363d',
          boxShadow: 'none',
          alignLeft: true,
          width: 'calc(var(--feed-sidebar) - 67px)',
          margin: {
            left: '',
            right: '',
          },
          magnifyingGlassIcon: {
            remove: true,
          },
          placeholder: {
            text: 'Search or jump to...',
            color: '#B3B3B5',
          },
          rightButton: 'slash key',
          modal: {
            width: '450px',
          },
        },
        divider: {
          remove: true,
        },
        flipCreateInbox: true,
        create: {
          remove: false,
          border: false,
          tooltip: false,
          hoverBackgroundColor: oldSchoolHoverBackgroundColor,
          plusIcon: {
            remove: false,
            color: oldSchoolColor,
            marginRight: '0px',
            hover: {
              color: oldSchoolHoverColor,
            },
          },
          text: {
            content: '',
            color: '',
          },
          dropdownIcon: {
            remove: false,
            color: oldSchoolColor,
            hover: {
              color: oldSchoolHoverColor,
            },
          },
        },
        flipIssuesPullRequests: true,
        issues: {
          remove: false,
          border: false,
          tooltip: false,
          alignLeft: true,
          icon: {
            remove: true,
            color: '',
          },
          text: {
            content: 'Issues',
            color: oldSchoolColor,
          },
          hover: {
            backgroundColor: oldSchoolHoverBackgroundColor,
            color: oldSchoolHoverColor,
          },
        },
        pullRequests: {
          remove: false,
          border: false,
          tooltip: false,
          alignLeft: true,
          icon: {
            remove: true,
            color: '',
          },
          text: {
            content: 'Pull requests',
            color: oldSchoolColor,
          },
          hover: {
            backgroundColor: oldSchoolHoverBackgroundColor,
            color: oldSchoolHoverColor,
          },
        },
        notifications: {
          remove: false,
          border: false,
          tooltip: false,
          hoverBackgroundColor: oldSchoolHoverBackgroundColor,
          icon: {
            symbol: 'bell',
            color: oldSchoolColor,
            hover: {
              color: oldSchoolHoverColor,
            }
          },
          text: {
            content: '',
            color: '',
          },
          dot: {
            remove: false,
            boxShadowColor: '#161C20',
            color: '',
            displayOverIcon: true,
          },
        },
        avatar: {
          dropdownIcon: true,
        },
        globalBar: {
          boxShadowColor: '#21262D',
          leftAligned: {
            gap: '2px',
          },
          rightAligned: {
            gap: '2px',
          },
        },
        localBar: {
          backgroundColor: '#FAFBFD',
          center: true,
          boxShadow: {
            consistentColor: true,
          },
          links: {
            color: '',
          },
        },
        sidebars: {
          backdropColor: oldSchoolHoverBackgroundColor,
        },
        repositoryHeader: {
          import: true,
          center: true,
          backgroundColor: '#FAFBFD',
          avatar: {
            remove: false,
            customSvg: '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-repo mr-1 color-fg-muted"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path></svg>',
          },
          link: {
            color: '#2F81F7',
            hover: {
              backgroundColor: 'transparent',
              color: '#0969da',
              textDecoration: 'underline',
            },
          },
        },
      },
      dark: {
        backgroundColor: '#161C20',
        hamburgerButton: {
          remove: true,
        },
        logo: {
          remove: false,
          color: '#e6edf3',
          customSvg: '',
        },
        pageTitle: {
          remove: true,
          color: oldSchoolColor,
          hover: {
            backgroundColor: oldSchoolHoverBackgroundColor,
            color: oldSchoolHoverColor,
          },
        },
        search: {
          backgroundColor: '#0E1217',
          borderColor: '#30363d',
          boxShadow: 'none',
          alignLeft: true,
          width: 'calc(var(--feed-sidebar) - 67px)',
          margin: {
            left: '',
            right: '',
          },
          magnifyingGlassIcon: {
            remove: true,
          },
          placeholder: {
            text: 'Search or jump to...',
            color: '#B3B3B5',
          },
          rightButton: 'slash key',
          modal: {
            width: '450px',
          },
        },
        divider: {
          remove: true,
        },
        flipCreateInbox: true,
        create: {
          remove: false,
          border: false,
          tooltip: false,
          hoverBackgroundColor: oldSchoolHoverBackgroundColor,
          plusIcon: {
            remove: false,
            color: oldSchoolColor,
            marginRight: '0px',
            hover: {
              color: oldSchoolHoverColor,
            },
          },
          text: {
            content: '',
            color: '',
          },
          dropdownIcon: {
            remove: false,
            color: oldSchoolColor,
            hover: {
              color: oldSchoolHoverColor,
            },
          },
        },
        flipIssuesPullRequests: true,
        issues: {
          remove: false,
          border: false,
          tooltip: false,
          alignLeft: true,
          icon: {
            remove: true,
            color: '',
          },
          text: {
            content: 'Issues',
            color: oldSchoolColor,
          },
          hover: {
            backgroundColor: oldSchoolHoverBackgroundColor,
            color: oldSchoolHoverColor,
          },
        },
        pullRequests: {
          remove: false,
          border: false,
          tooltip: false,
          alignLeft: true,
          icon: {
            remove: true,
            color: '',
          },
          text: {
            content: 'Pull requests',
            color: oldSchoolColor,
          },
          hover: {
            backgroundColor: oldSchoolHoverBackgroundColor,
            color: oldSchoolHoverColor,
          },
        },
        notifications: {
          remove: false,
          border: false,
          tooltip: false,
          hoverBackgroundColor: oldSchoolHoverBackgroundColor,
          icon: {
            symbol: 'bell',
            color: oldSchoolColor,
            hover: {
              color: oldSchoolHoverColor,
            }
          },
          text: {
            content: '',
            color: '',
          },
          dot: {
            remove: false,
            boxShadowColor: '#161C20',
            color: '',
            displayOverIcon: true,
          },
        },
        avatar: {
          dropdownIcon: true,
        },
        globalBar: {
          boxShadowColor: '#21262D',
          leftAligned: {
            gap: '0.75rem',
          },
          rightAligned: {
            gap: '2px',
          },
        },
        localBar: {
          backgroundColor: '#0D1117',
          center: true,
          boxShadow: {
            consistentColor: true,
          },
          links: {
            color: '#e6edf3',
          },
        },
        sidebars: {
          backdropColor: oldSchoolHoverBackgroundColor,
        },
        repositoryHeader: {
          import: true,
          center: true,
          backgroundColor: '#0D1116',
          avatar: {
            remove: false,
            customSvg: '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-repo mr-1 color-fg-muted"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path></svg>',
          },
          link: {
            color: '#58A6FF',
            hover: {
              backgroundColor: 'transparent',
              color: '#2F81F7',
              textDecoration: 'underline',
            },
          },
        },
      },
    },
  };

  const gmcFrameStyle = document.createElement('style');
  gmcFrameStyle.textContent += `
    #gmc
    {
      border: none !important;
      border-radius: 0.75rem !important;
      box-shadow: 0 0 0 1px #30363d, 0 16px 32px rgba(1,4,9,0.85) !important;
    }

    #gmc.hidden
    {
      display: none !important;
    }

    #gmc-frame
    {
      font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
      text-align: left;

      inset: initial !important;
      border: none !important;
      height: auto !important;
      max-height: initial !important;
      max-width: initial !important;
      opacity: 1 !important;
      overflow: visible !important;
      padding: initial !important;
      position: static !important;
      width: auto !important;
      z-index: initial !important;
      display: block !important;
    }

    #gmc-frame .config_header
    {
      font-size: 2em;
      font-weight: 400;
      line-height: 1.25;

      padding-bottom: 0.3em;
      margin-bottom: 16px;
    }

    #gmc-frame #gmc-frame_type_var
    {
      display: inline-flex;
    }

    #gmc-frame .section_header
    {
      font-size: 1.5em;
      font-weight: 600;
      line-height: 1.25;

      margin-bottom: 16px;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #30363D;
    }

    #gmc-frame .section_desc,
    #gmc-frame h3
    {
      background: none;
      border: none;
      font-size: 1.25em;

      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
      text-align: left;
    }

    #gmc-frame .config_var
    {
      padding: 0rem 1.5rem;
      margin-bottom: 1rem;
      display: flex;
    }

    #gmc-frame .config_var[id*='hamburgerButton_remove_var'],
    #gmc-frame .config_var[id*='hamburgerButton_remove_var'],
    #gmc-frame .config_var[id*='logo_remove_var'],
    #gmc-frame .config_var[id*='pageTitle_remove_var'],
    #gmc-frame .config_var[id*='search_backgroundColor_var'],
    #gmc-frame .config_var[id*='divider_remove_var'],
    #gmc-frame .config_var[id*='create_remove_var'],
    #gmc-frame .config_var[id*='issues_remove_var'],
    #gmc-frame .config_var[id*='pullRequests_remove_var'],
    #gmc-frame .config_var[id*='notifications_remove_var'],
    #gmc-frame .config_var[id*='globalBar_boxShadowColor_var'],
    #gmc-frame .config_var[id*='localBar_backgroundColor_var'],
    #gmc-frame .config_var[id*='sidebars_backdropColor_var'],
    #gmc-frame .config_var[id*='repositoryHeader_import_var'],
    #gmc-frame .config_var[id*='flipCreateInbox_var'],
    #gmc-frame .config_var[id*='flipIssuesPullRequests_var']
    {
      display: flow;
      border-top: 1px solid #30363D;
      padding-top: 1rem;
    }

    #gmc-frame .config_var[id*='flipCreateInbox_var'],
    #gmc-frame .config_var[id*='flipIssuesPullRequests_var']
    {
      display: flex;
    }

    #gmc-frame .field_label
    {
      font-weight: 600;
      margin-right: 0.5rem;
    }

    #gmc-frame .field_label,
    #gmc-frame .gmc-label
    {
      width: 13rem;
    }

    #gmc-frame .radio_label:not(:last-child)
    {
      margin-right: 4rem;
    }

    #gmc-frame .radio_label
    {
      line-height: 17px;
    }

    #gmc-frame .gmc-label
    {
      display: table-caption;
      line-height: 17px;
    }

    #gmc-frame input[type="radio"]
    {
      appearance: none;
      border-style: solid;
      cursor: pointer;
      height: 1rem;
      place-content: center;
      position: relative;
      width: 1rem;
      border-radius: 624rem;
      transition: background-color 0s ease 0s, border-color 80ms cubic-bezier(0.33, 1, 0.68, 1) 0s;
      margin-right: 0.5rem;
    }

    #gmc-frame input[type="checkbox"]
    {
      appearance: none;
      border-color: #6e7681;
      border-style: solid;
      border-width: 1px;
      cursor: pointer;
      place-content: center;
      position: relative;
      height: 17px;
      width: 17px;
      border-radius: 3px;
      transition: background-color 0s ease 0s, border-color 80ms cubic-bezier(0.33, 1, 0.68, 1) 0s;
    }

    #gmc-frame #gmc-frame_field_type
    {
      display: flex;
    }

    #gmc-frame input[type="radio"]:checked
    {
      border-width: 0.25rem;
    }

    #gmc-frame input[type="radio"]:checked,
    #gmc-frame .gmc-checkbox:checked
    {
      border-color: #2f81f7;
    }

    #gmc-frame .gmc-checkbox:checked
    {
      background-color: #2f81f7;
    }

    #gmc-frame .gmc-checkbox:checked::before {
      visibility: visible;
      transition: visibility 0s linear 0s;
    }

    #gmc-frame .gmc-checkbox::before,
    #gmc-frame .gmc-checkbox:indeterminate::before
    {
      animation: 80ms cubic-bezier(0.65, 0, 0.35, 1) 80ms 1 normal forwards running checkmarkIn;
    }

    #gmc-frame .gmc-checkbox::before
    {
      width: 1rem;
      height: 1rem;
      visibility: hidden;
      content: "";
      background-color: #FFFFFF;
      clip-path: inset(1rem 0 0 0);
      -webkit-mask-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDEyIDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTEuNzgwMyAwLjIxOTYyNUMxMS45MjEgMC4zNjA0MjcgMTIgMC41NTEzMDUgMTIgMC43NTAzMTNDMTIgMC45NDkzMjEgMTEuOTIxIDEuMTQwMTkgMTEuNzgwMyAxLjI4MUw0LjUxODYgOC41NDA0MkM0LjM3Nzc1IDguNjgxIDQuMTg2ODIgOC43NiAzLjk4Nzc0IDguNzZDMy43ODg2NyA4Ljc2IDMuNTk3NzMgOC42ODEgMy40NTY4OSA4LjU0MDQyTDAuMjAxNjIyIDUuMjg2MkMwLjA2ODkyNzcgNS4xNDM4MyAtMC4wMDMzMDkwNSA0Ljk1NTU1IDAuMDAwMTE2NDkzIDQuNzYwOThDMC4wMDM1NTIwNSA0LjU2NjQzIDAuMDgyMzg5NCA0LjM4MDgxIDAuMjIwMDMyIDQuMjQzMjFDMC4zNTc2NjUgNC4xMDU2MiAwLjU0MzM1NSA0LjAyNjgxIDAuNzM3OTcgNC4wMjMzOEMwLjkzMjU4NCA0LjAxOTk0IDEuMTIwOTMgNC4wOTIxNyAxLjI2MzM0IDQuMjI0ODJMMy45ODc3NCA2Ljk0ODM1TDEwLjcxODYgMC4yMTk2MjVDMTAuODU5NSAwLjA3ODk5MjMgMTEuMDUwNCAwIDExLjI0OTUgMEMxMS40NDg1IDAgMTEuNjM5NSAwLjA3ODk5MjMgMTEuNzgwMyAwLjIxOTYyNVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=");
      -webkit-mask-size: 75%;
      -webkit-mask-repeat: no-repeat;
      -webkit-mask-position: center center;
      display: block;
    }

    #gmc-frame .gmc-checkbox
    {
      appearance: none;
      border-color: #6E7681;
      border-style: solid;
      border-width: 1px;
      cursor: pointer;

      height: var(--base-size-16,16px);
      margin: 0.125rem 0px 0px;
      place-content: center;
      position: relative;
      width: var(--base-size-16,16px);
      border-radius: 3px;
      transition: background-color 0s ease 0s, border-color 80ms cubic-bezier(0.33, 1, 0.68, 1) 0s;
    }

    #gmc-frame input
    {
      color: fieldtext;
      letter-spacing: normal;
      word-spacing: normal;
      text-transform: none;
      text-indent: 0px;
      text-shadow: none;
      display: inline-block;
      text-align: start;
      appearance: auto;
      -webkit-rtl-ordering: logical;
    }

    #gmc-frame .gmc-checkbox:checked
    {
      transition: background-color 0s ease 0s, border-color 80ms cubic-bezier(0.32, 0, 0.67, 0) 0ms;
    }

    #gmc-frame input[type="radio"]
    {
      color: #6D7681;
    }

    #gmc-frame #gmc-frame_section_0
    {
      width: 50%;
      border-radius: 6px;
      border: 1px solid #30363D;
    }

    #gmc-frame #gmc-frame_section_1,
    #gmc-frame #gmc-frame_section_2
    {
      margin-top: 2rem;
      width: 50%;
      box-sizing: border-box;
      float: left;
    }

    #gmc-frame #gmc-frame_section_1
    {
      border-radius: 6px;
      border: 1px solid #30363D;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    #gmc-frame #gmc-frame_section_2
    {
      border-radius: 6px;
      border: 1px solid #30363D;
      border-left: none;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    #gmc-frame #gmc-frame_section_3
    {
      display: inline-grid;
      width: 50%;
      margin-top: 2rem;
      box-sizing: border-box;
      border: 1px solid #f8514966;
      border-radius: 6px;
    }

    #gmc-frame #gmc-frame_section_3 .config_var:not(:last-child)
    {
      padding-bottom: 1rem;
      border-bottom: 1px solid #30363D;
    }

    #gmc-frame #gmc-frame_buttons_holder
    {
      position: fixed;
      transform: translate(-50%, 0%);
      left: 50%;
      bottom: 0;
      padding: 1rem;

      border-bottom: none !important;
      border-radius: 6px;
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
    }

    #gmc-frame .saveclose_buttons
    {
      margin-right: 0.25rem;
    }

    #gmc-frame [type=button],
    #gmc-frame .saveclose_buttons,
    #gmc-frame .reset_holder
    {
      position: relative;
      display: inline-block;
      padding: 5px 16px;
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      white-space: nowrap;
      vertical-align: middle;
      cursor: pointer;
      -webkit-user-select: none;
      user-select: none;
      border: 1px solid;
      border-radius: 6px;
      -webkit-appearance: none;
      appearance: none;

      color: #c9d1d9;
      background-color: #21262d;
      border-color: #f0f6fc1a;

      font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
    }

    #gmc-frame [type=button]:hover,
    #gmc-frame .saveclose_buttons:hover
    {
      background-color: #30363d;
      border-color: #8b949e;
    }

    #gmc-frame #gmc-frame_section_3 input
    {
      background-color: #21262d;
      border-color: #f0f6fc1a;
      color: #f85149;
    }

    #gmc-frame #gmc-frame_section_3 input:hover
    {
      background-color: #da3633;
      border-color: #f85149;
      color: #ffffff;
    }

    #gmc-frame #gmc-frame_saveBtn
    {
      background-color: #238636;
      border-color: #F0F6FC1A;
      box-shadow: 0 0 transparent;
      color: #FFFFFF;
    }

    #gmc-frame #gmc-frame_saveBtn:hover
    {
      background-color: #2EA043;
      border-color: #F0F6FC1A;
    }

    #gmc-frame input[type="text"],
    #gmc-frame textarea,
    #gmc-frame select
    {
      padding: 5px 12px;
      border-radius: 6px;
      border: 1px solid #5B626C;
    }

    #gmc-frame input[type="text"]:focus,
    #gmc-frame textarea:focus,
    #gmc-frame select:focus
    {
      border-color: #2f81f7;
      outline: 1px solid #2f81f7;
    }

    #gmc-frame svg
    {
      height: 17px;
      width: 17px;
      fill: #E6EDF3;
      margin-left: 0.5rem;
    }

    #gmc-frame small
    {
      font-size: x-small;
      margin-left: 3px;
    }
  `;

  if (THEME === 'light') {
    gmcFrameStyle.textContent += `
      #gmc
      {
        background-color: #FFFFFF;
        color: #1F2328;
      }
    `;
  } else if (THEME === 'dark') {
    gmcFrameStyle.textContent += `
      #gmc
      {
        background-color: #161B22;
        color: #E6EDF3;
      }

      #gmc-frame_buttons_holder
      {
        background-color: #0D1117;
        border: 1px solid #30363D;
      }

      #gmc-frame input[type="text"],
      #gmc-frame textarea
      {
        background-color: #010409;
        border: 1px solid #5B626C;
        color: #FFFFFF;
      }

      #gmc-frame input[type="text"]:focus,
      textarea:focus
      {
        background-color: #0d1117;
      }

      #gmc-frame .section_header_holder
      {
        background-color: #0D1117;
      }
    `;
  }

  document.head.appendChild(gmcFrameStyle);

  const body = document.querySelector('body');
  const gmcDiv = document.createElement('div');
  gmcDiv.id = 'gmc';
  gmcDiv.style = `
    display: grid;
    position: fixed;
    height: 75%;
    width: 75%;
    max-height: 95%;
    max-width: 95%;
    inset: 69px auto auto 208px;
    padding: 2rem !important;
    overflow: auto;
    z-index: 9999;
  `;
  gmcDiv.classList.add('hidden');
  body.appendChild(gmcDiv);

  const gmcFrameDiv = document.createElement('div');
  gmcFrameDiv.id = 'gmc-frame';

  gmcDiv.appendChild(gmcFrameDiv);

  let OBSERVER = new MutationObserver(observeAndModify);

  let GMC = new GM_config({
    id: 'gmc-frame',
    title: 'Customize Global Navigation',
    center: false,
    events: {
      init: gmcInitialized,
      open: gmcOpened,
      close: gmcClosed,
    },
    frame: gmcFrameDiv,
    fields: {
      type: {
        section: [
          `
            Configuration Type
            <small>
              <a href="https://github.com/blakegearin/github-custom-global-naviation#configurations" target="_blank">
                learn more
              </a>
            </small>
          `,
        ],
        type: 'radio',
        options: [
          'Off',
          'Happy Medium',
          'Old School',
          'Custom',
        ],
        default: 'Happy Medium',
      },
      light_backgroundColor: {
        label: 'Background color',
        section: [
          `
          Custom Light
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <path d="M16 11.5a5 5 0 0 1 3.54 1.5A5 5 0 0 1 21 16.22a1 1 0 0 0 1.05 1 1 1 0 0 0 .95-1.11 7 7 0 1 0-2 5.34 6.49 6.49 0 0 0 .76-.89 1 1 0 1 0-1.63-1.16 5.38 5.38 0 0 1-.54.64A5 5 0 1 1 16 11.5z"/><path d="m29.29 15.54-1.21-.36a3 3 0 0 1-2-2 3 3 0 0 1 .47-2.82l.77-1a1 1 0 0 0 0-1.2 1 1 0 0 0-1.14-.35L25 8.26a2.91 2.91 0 0 1-2.75-.39A3 3 0 0 1 21 5.3V4a1 1 0 0 0-1.83-.59l-.71 1.05A3 3 0 0 1 16 5.81a3 3 0 0 1-2.48-1.32l-.71-1.05A1 1 0 0 0 11 4v1.3a3 3 0 0 1-.62 1.94A1 1 0 0 0 12 8.45a5 5 0 0 0 .85-1.76A5 5 0 0 0 16 7.81a5 5 0 0 0 3.15-1.12 5 5 0 0 0 5.1 3.74 5.08 5.08 0 0 0-.08 3.4 5 5 0 0 0 2 2.67 5 5 0 0 0-2 2.67 5.08 5.08 0 0 0 .08 3.4 5 5 0 0 0-5.1 3.74A5 5 0 0 0 16 25.19a5 5 0 0 0-3.15 1.12 5 5 0 0 0-1.92-2.8 4.94 4.94 0 0 0-3.18-.94 5.08 5.08 0 0 0 .08-3.4 5 5 0 0 0-2-2.67 5 5 0 0 0 2-2.67 5.08 5.08 0 0 0-.08-3.4 1 1 0 0 0 .25 0 1 1 0 0 0 0-2 2.88 2.88 0 0 1-1-.18l-1.18-.42a1 1 0 0 0-1.14.35 1 1 0 0 0 0 1.2l.77 1a3 3 0 0 1 .47 2.82 2.94 2.94 0 0 1-2 2l-1.21.36a1 1 0 0 0 0 1.92l1.21.36a2.94 2.94 0 0 1 2 2 3 3 0 0 1-.47 2.82l-.77 1a1 1 0 0 0 0 1.2 1 1 0 0 0 1.14.35L7 24.74a2.91 2.91 0 0 1 2.75.39A3 3 0 0 1 11 27.7V29a1 1 0 0 0 1.83.59l.71-1a3 3 0 0 1 5 0l.71 1A1 1 0 0 0 20 30a1 1 0 0 0 .3-.05 1 1 0 0 0 .7-1v-1.27a3 3 0 0 1 1.26-2.57 2.91 2.91 0 0 1 2.74-.37l1.19.43a1 1 0 0 0 1.14-.35 1 1 0 0 0 0-1.2l-.77-1a3 3 0 0 1-.47-2.82 3 3 0 0 1 2-2l1.21-.36a1 1 0 0 0 0-1.92z"/>
          </svg>
          `,
        ],
        type: 'text',
        default: '',
      },
      light_hamburgerButton_remove: {
        label: '<h3>Hamburger button</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      light_logo_remove: {
        label: '<h3>Logo</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      light_logo_color: {
        label: 'Color',
        type: 'text',
        default: '',
      },
      light_logo_customSvg: {
        label: 'Custom SVG (URL or text)',
        type: 'textarea',
        default: '',
      },
      light_pageTitle_remove: {
        label: '<h3>Page title</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      light_pageTitle_color: {
        label: 'Color',
        type: 'text',
        default: '',
      },
      light_pageTitle_hover_backgroundColor: {
        label: 'Hover background color',
        type: 'text',
        default: '',
      },
      light_pageTitle_hover_color: {
        label: 'Hover color',
        type: 'text',
        default: '',
      },
      light_search_backgroundColor: {
        label: '<h3>Search</h3><div class="gmc-label">Background color</div>',
        type: 'text',
        default: '',
      },
      light_search_borderColor: {
        label: 'Border color',
        type: 'text',
        default: '',
      },
      light_search_boxShadow: {
        label: 'Box shadow',
        type: 'text',
        default: '',
      },
      light_search_alignLeft: {
        label: 'Left aligned',
        type: 'checkbox',
        default: false,
      },
      light_search_width: {
        label: 'Width',
        type: 'text',
        default: '',
      },
      light_search_margin_left: {
        label: 'Margin left',
        type: 'text',
        default: '',
      },
      light_search_margin_right: {
        label: 'Margin right',
        type: 'text',
        default: '',
      },
      light_search_magnifyingGlassIcon_remove: {
        label: 'Magnifying glass icon remove',
        type: 'checkbox',
        default: false,
      },
      light_search_placeholder_text: {
        label: 'Placeholder text',
        type: 'text',
        default: '',
      },
      light_search_placeholder_color: {
        label: 'Placeholder color',
        type: 'text',
        default: '',
      },
      light_search_rightButton: {
        label: 'Right button',
        type: 'select',
        options: [
          'none',
          'command palette',
          'slash key',
        ],
        default: 'command palette',
      },
      light_search_modal_width: {
        label: 'Modal width',
        type: 'text',
        default: '',
      },
      light_divider_remove: {
        label: '<h3>Divider</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      light_flipCreateInbox: {
        label: 'Flip the order of Create and Notifications',
        type: 'checkbox',
        default: false,
      },
      light_create_remove: {
        label: '<h3>Create button</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      light_create_border: {
        label: 'Border',
        type: 'checkbox',
        default: true,
      },
      light_create_tooltip: {
        label: 'Tooltip',
        type: 'checkbox',
        default: true,
      },
      light_create_hoverBackgroundColor: {
        label: 'Hover background color',
        type: 'text',
        default: '',
      },
      light_create_plusIcon_remove: {
        label: 'Plus icon remove',
        type: 'checkbox',
        default: false,
      },
      light_create_plusIcon_color: {
        label: 'Plus icon color',
        type: 'text',
        default: '',
      },
      light_create_plusIcon_marginRight: {
        label: 'Plus icon margin right',
        type: 'text',
        default: '',
      },
      light_create_plusIcon_hover_color: {
        label: 'Plus icon hover color',
        type: 'text',
        default: '',
      },
      light_create_text_content: {
        label: 'Text content',
        type: 'text',
        default: '',
      },
      light_create_text_color: {
        label: 'Text color',
        type: 'text',
        default: '',
      },
      light_create_dropdownIcon_remove: {
        label: 'Dropdown icon remove',
        type: 'checkbox',
        default: false,
      },
      light_create_dropdownIcon_color: {
        label: 'Dropdown icon color',
        type: 'text',
        default: '',
      },
      light_create_dropdownIcon_hover_color: {
        label: 'Dropdown icon hover color',
        type: 'text',
        default: '',
      },
      light_flipIssuesPullRequests: {
        label: 'Flip the order of Issues and Pull requests',
        type: 'checkbox',
        default: false,
      },
      light_issues_remove: {
        label: '<h3>Issues button</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      light_issues_border: {
        label: 'Border',
        type: 'checkbox',
        default: true,
      },
      light_issues_tooltip: {
        label: 'Tooltip',
        type: 'checkbox',
        default: true,
      },
      light_issues_icon_remove: {
        label: 'Icon remove',
        type: 'checkbox',
        default: false,
      },
      light_issues_icon_color: {
        label: 'Icon color',
        type: 'text',
        default: '',
      },
      light_issues_text_content: {
        label: 'Text content',
        type: 'text',
        default: '',
      },
      light_issues_text_color: {
        label: 'Text color',
        type: 'text',
        default: '',
      },
      light_issues_hover_backgroundColor: {
        label: 'Hover background color',
        type: 'text',
        default: '',
      },
      light_issues_hover_color: {
        label: 'Hover color',
        type: 'text',
        default: '',
      },
      light_pullRequests_remove: {
        label: '<h3>Pull requests button</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      light_pullRequests_border: {
        label: 'Border',
        type: 'checkbox',
        default: true,
      },
      light_pullRequests_tooltip: {
        label: 'Tooltip',
        type: 'checkbox',
        default: true,
      },
      light_pullRequests_icon_remove: {
        label: 'Icon remove',
        type: 'checkbox',
        default: false,
      },
      light_pullRequests_icon_color: {
        label: 'Icon color',
        type: 'text',
        default: '',
      },
      light_pullRequests_text_content: {
        label: 'Text content',
        type: 'text',
        default: '',
      },
      light_pullRequests_text_color: {
        label: 'Text color',
        type: 'text',
        default: '',
      },
      light_pullRequests_hover_backgroundColor: {
        label: 'Hover background color',
        type: 'text',
        default: '',
      },
      light_pullRequests_hover_color: {
        label: 'Hover color',
        type: 'text',
        default: '',
      },
      light_notifications_remove: {
        label: '<h3>Notifications button</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      light_notifications_border: {
        label: 'Border',
        type: 'checkbox',
        default: true,
      },
      light_notifications_tooltip: {
        label: 'Tooltip',
        type: 'checkbox',
        default: true,
      },
      light_notifications_hoverBackgroundColor: {
        label: 'Hover background color',
        type: 'text',
        default: '',
      },
      light_notifications_icon_symbol: {
        label: 'Icon symbol',
        type: 'select',
        options: [
          'none',
          'inbox',
          'bell',
        ],
        default: 'inbox',
      },
      light_notifications_icon_color: {
        label: 'Icon color',
        type: 'text',
        default: '',
      },
      light_notifications_icon_hover_color: {
        label: 'Icon hover color',
        type: 'text',
        default: '',
      },
      light_notifications_text_content: {
        label: 'Text content',
        type: 'text',
        default: '',
      },
      light_notifications_text_color: {
        label: 'Text color',
        type: 'text',
        default: '',
      },
      light_notifications_dot_remove: {
        label: 'Dot remove',
        type: 'checkbox',
        default: false,
      },
      light_notifications_dot_boxShadowColor: {
        label: 'Dot hover color',
        type: 'text',
        default: '',
      },
      light_notifications_dot_color: {
        label: 'Dot color',
        type: 'text',
        default: '',
      },
      light_notifications_dot_displayOverIcon: {
        label: 'Dot display over icon',
        type: 'checkbox',
        default: false,
      },
      light_avatar_dropdownIcon: {
        label: '<h3>Avatar</h3><div class="gmc-label">Dropdown icon</div>',
        type: 'checkbox',
        default: false,
      },
      light_globalBar_boxShadowColor: {
        label: '<h3>Global bar</h3><div class="gmc-label">Box shadow color</div>',
        type: 'text',
        default: '',
      },
      light_globalBar_leftAligned_gap: {
        label: 'Left aligned gap',
        type: 'text',
        default: '',
      },
      light_globalBar_rightAligned_gap: {
        label: 'Right aligned gap',
        type: 'text',
        default: '',
      },
      light_localBar_backgroundColor: {
        label: '<h3>Local bar</h3><div class="gmc-label">Background color</div>',
        type: 'text',
        default: '',
      },
      light_localBar_center: {
        label: 'Center',
        type: 'checkbox',
        default: false,
      },
      light_localBar_boxShadow_consistentColor: {
        label: 'Box shadow consistent color',
        type: 'checkbox',
        default: false,
      },
      light_localBar_links_color: {
        label: 'Links color',
        type: 'text',
        default: '',
      },
      light_sidebars_backdropColor: {
        label: '<h3>Sidebars</h3><div class="gmc-label">Backdrop color</div>',
        type: 'text',
        default: '',
      },
      light_repositoryHeader_import: {
        label: '<h3>Repository header</h3><div class="gmc-label">Import</div>',
        type: 'checkbox',
        default: false,
      },
      light_repositoryHeader_center: {
        label: 'Center',
        type: 'checkbox',
        default: false,
      },
      light_repositoryHeader_backgroundColor: {
        label: 'Background color',
        type: 'text',
        default: '',
      },
      light_repositoryHeader_avatar_remove: {
        label: 'Avatar remove',
        type: 'checkbox',
        default: false,
      },
      light_repositoryHeader_avatar_customSvg: {
        label: 'Custom SVG (URL or text)',
        type: 'textarea',
        default: '',
      },
      light_repositoryHeader_link_color: {
        label: 'Link color',
        type: 'text',
        default: '',
      },
      light_repositoryHeader_link_hover_backgroundColor: {
        label: 'Link hover background color',
        type: 'text',
        default: '',
      },
      light_repositoryHeader_link_hover_color: {
        label: 'Link hover color',
        type: 'text',
        default: '',
      },
      light_repositoryHeader_link_hover_textDecoration: {
        label: 'Link hover text decoration',
        type: 'text',
        default: '',
      },
      dark_backgroundColor: {
        label: 'Background color',
        section: [
          `
            Custom Dark
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
              <path d="M30 8.27a1 1 0 0 0-.8-.68L25.53 7l-1.62-3.42a1 1 0 0 0-1.82 0L20.47 7l-3.62.55a1 1 0 0 0-.8.68 1 1 0 0 0 .23 1L18.93 12l-.63 3.84a1 1 0 0 0 .42 1 1 1 0 0 0 1.06.06L23 15.09l3.22 1.79a1.07 1.07 0 0 0 .49.12 1 1 0 0 0 1-1.16L27.07 12l2.65-2.72A1 1 0 0 0 30 8.27zM25.28 11a1 1 0 0 0-.27.86l.38 2.31-1.91-1.05a1 1 0 0 0-1 0l-1.91 1.05.43-2.35a1 1 0 0 0-.27-.86l-1.65-1.68 2.22-.34a1 1 0 0 0 .75-.56l.95-2 .95 2a1 1 0 0 0 .75.56l2.22.34z"/><path d="M25.44 24A12.5 12.5 0 0 1 15.7 3.74a1.1 1.1 0 0 0 .3-.46.2.2 0 0 1 0-.07A1.9 1.9 0 0 0 16 3a1 1 0 0 0-.36-.72 1 1 0 0 0-1-.14A14 14 0 0 0 8.46 4.2a1 1 0 0 0-.3 1.38A1 1 0 0 0 9 6a1 1 0 0 0 .54-.15 12 12 0 0 1 3.28-1.44A14.66 14.66 0 0 0 11 11.5a14.5 14.5 0 0 0 12 14.27A12 12 0 0 1 6.77 8.33a1 1 0 1 0-1.54-1.28A14 14 0 0 0 16 30a13.91 13.91 0 0 0 9.69-3.9.7.7 0 0 0 .13-.17 1 1 0 0 0 .62-.93 1 1 0 0 0-1-1z"/>
            </svg>
          `,
        ],
        type: 'text',
        default: '',
      },
      dark_hamburgerButton_remove: {
        label: '<h3>Hamburger button</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      dark_logo_remove: {
        label: '<h3>Logo</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      dark_logo_color: {
        label: 'Color',
        type: 'text',
        default: '',
      },
      dark_logo_customSvg: {
        label: 'Custom SVG (URL or text)',
        type: 'textarea',
        default: '',
      },
      dark_pageTitle_remove: {
        label: '<h3>Page title</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      dark_pageTitle_color: {
        label: 'Color',
        type: 'text',
        default: '',
      },
      dark_pageTitle_hover_backgroundColor: {
        label: 'Hover background color',
        type: 'text',
        default: '',
      },
      dark_pageTitle_hover_color: {
        label: 'Hover color',
        type: 'text',
        default: '',
      },
      dark_search_backgroundColor: {
        label: '<h3>Search</h3><div class="gmc-label">Background color</div>',
        type: 'text',
        default: '',
      },
      dark_search_borderColor: {
        label: 'Border color',
        type: 'text',
        default: '',
      },
      dark_search_boxShadow: {
        label: 'Box shadow',
        type: 'text',
        default: '',
      },
      dark_search_alignLeft: {
        label: 'Left aligned',
        type: 'checkbox',
        default: false,
      },
      dark_search_width: {
        label: 'Width',
        type: 'text',
        default: '',
      },
      dark_search_margin_left: {
        label: 'Margin left',
        type: 'text',
        default: '',
      },
      dark_search_margin_right: {
        label: 'Margin right',
        type: 'text',
        default: '',
      },
      dark_search_magnifyingGlassIcon_remove: {
        label: 'Magnifying glass icon remove',
        type: 'checkbox',
        default: false,
      },
      dark_search_placeholder_text: {
        label: 'Placeholder text',
        type: 'text',
        default: '',
      },
      dark_search_placeholder_color: {
        label: 'Placeholder color',
        type: 'text',
        default: '',
      },
      dark_search_rightButton: {
        label: 'Right button',
        type: 'select',
        options: [
          'none',
          'command palette',
          'slash key',
        ],
        default: 'command palette',
      },
      dark_search_modal_width: {
        label: 'Modal width',
        type: 'text',
        default: '',
      },
      dark_divider_remove: {
        label: '<h3>Divider</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      dark_flipCreateInbox: {
        label: 'Flip the order of Create and Notifications',
        type: 'checkbox',
        default: false,
      },
      dark_create_remove: {
        label: '<h3>Create button</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      dark_create_border: {
        label: 'Border',
        type: 'checkbox',
        default: true,
      },
      dark_create_tooltip: {
        label: 'Tooltip',
        type: 'checkbox',
        default: true,
      },
      dark_create_hoverBackgroundColor: {
        label: 'Hover background color',
        type: 'text',
        default: '',
      },
      dark_create_plusIcon_remove: {
        label: 'Plus icon remove',
        type: 'checkbox',
        default: false,
      },
      dark_create_plusIcon_color: {
        label: 'Plus icon color',
        type: 'text',
        default: '',
      },
      dark_create_plusIcon_marginRight: {
        label: 'Plus icon margin right',
        type: 'text',
        default: '',
      },
      dark_create_plusIcon_hover_color: {
        label: 'Plus icon hover color',
        type: 'text',
        default: '',
      },
      dark_create_text_content: {
        label: 'Text content',
        type: 'text',
        default: '',
      },
      dark_create_text_color: {
        label: 'Text color',
        type: 'text',
        default: '',
      },
      dark_create_dropdownIcon_remove: {
        label: 'Dropdown icon remove',
        type: 'checkbox',
        default: false,
      },
      dark_create_dropdownIcon_color: {
        label: 'Dropdown icon color',
        type: 'text',
        default: '',
      },
      dark_create_dropdownIcon_hover_color: {
        label: 'Dropdown icon hover color',
        type: 'text',
        default: '',
      },
      dark_flipIssuesPullRequests: {
        label: 'Flip the order of Issues and Pull requests',
        type: 'checkbox',
        default: false,
      },
      dark_issues_remove: {
        label: '<h3>Issues button</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      dark_issues_border: {
        label: 'Border',
        type: 'checkbox',
        default: true,
      },
      dark_issues_tooltip: {
        label: 'Tooltip',
        type: 'checkbox',
        default: true,
      },
      dark_issues_icon_remove: {
        label: 'Icon remove',
        type: 'checkbox',
        default: false,
      },
      dark_issues_icon_color: {
        label: 'Icon color',
        type: 'text',
        default: '',
      },
      dark_issues_text_content: {
        label: 'Text content',
        type: 'text',
        default: '',
      },
      dark_issues_text_color: {
        label: 'Text color',
        type: 'text',
        default: '',
      },
      dark_issues_hover_backgroundColor: {
        label: 'Hover background color',
        type: 'text',
        default: '',
      },
      dark_issues_hover_color: {
        label: 'Hover color',
        type: 'text',
        default: '',
      },
      dark_pullRequests_remove: {
        label: '<h3>Pull requests button</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      dark_pullRequests_border: {
        label: 'Border',
        type: 'checkbox',
        default: true,
      },
      dark_pullRequests_tooltip: {
        label: 'Tooltip',
        type: 'checkbox',
        default: true,
      },
      dark_pullRequests_icon_remove: {
        label: 'Icon remove',
        type: 'checkbox',
        default: false,
      },
      dark_pullRequests_icon_color: {
        label: 'Icon color',
        type: 'text',
        default: '',
      },
      dark_pullRequests_text_content: {
        label: 'Text content',
        type: 'text',
        default: '',
      },
      dark_pullRequests_text_color: {
        label: 'Text color',
        type: 'text',
        default: '',
      },
      dark_pullRequests_hover_backgroundColor: {
        label: 'Hover background color',
        type: 'text',
        default: '',
      },
      dark_pullRequests_hover_color: {
        label: 'Hover color',
        type: 'text',
        default: '',
      },
      dark_notifications_remove: {
        label: '<h3>Notifications button</h3><div class="gmc-label">Remove</div>',
        type: 'checkbox',
        default: false,
      },
      dark_notifications_border: {
        label: 'Border',
        type: 'checkbox',
        default: true,
      },
      dark_notifications_tooltip: {
        label: 'Tooltip',
        type: 'checkbox',
        default: true,
      },
      dark_notifications_hoverBackgroundColor: {
        label: 'Hover background color',
        type: 'text',
        default: '',
      },
      dark_notifications_icon_symbol: {
        label: 'Icon symbol',
        type: 'select',
        options: [
          'none',
          'inbox',
          'bell',
        ],
        default: 'inbox',
      },
      dark_notifications_icon_color: {
        label: 'Icon color',
        type: 'text',
        default: '',
      },
      dark_notifications_icon_hover_color: {
        label: 'Icon hover color',
        type: 'text',
        default: '',
      },
      dark_notifications_text_content: {
        label: 'Text content',
        type: 'text',
        default: '',
      },
      dark_notifications_text_color: {
        label: 'Text color',
        type: 'text',
        default: '',
      },
      dark_notifications_dot_remove: {
        label: 'Dot remove',
        type: 'checkbox',
        default: false,
      },
      dark_notifications_dot_boxShadowColor: {
        label: 'Dot hover color',
        type: 'text',
        default: '',
      },
      dark_notifications_dot_color: {
        label: 'Dot color',
        type: 'text',
        default: '',
      },
      dark_notifications_dot_displayOverIcon: {
        label: 'Dot display over icon',
        type: 'checkbox',
        default: false,
      },
      dark_avatar_dropdownIcon: {
        label: '<h3>Avatar</h3><div class="gmc-label">Dropdown icon</div>',
        type: 'checkbox',
        default: false,
      },
      dark_globalBar_boxShadowColor: {
        label: '<h3>Global bar</h3><div class="gmc-label">Box shadow color</div>',
        type: 'text',
        default: '',
      },
      dark_globalBar_leftAligned_gap: {
        label: 'Left aligned gap',
        type: 'text',
        default: '',
      },
      dark_globalBar_rightAligned_gap: {
        label: 'Right aligned gap',
        type: 'text',
        default: '',
      },
      dark_localBar_backgroundColor: {
        label: '<h3>Local bar</h3><div class="gmc-label">Background color</div>',
        type: 'text',
        default: '',
      },
      dark_localBar_center: {
        label: 'Center',
        type: 'checkbox',
        default: false,
      },
      dark_localBar_boxShadow_consistentColor: {
        label: 'Box shadow consistent color',
        type: 'checkbox',
        default: false,
      },
      dark_localBar_links_color: {
        label: 'Links color',
        type: 'text',
        default: '',
      },
      dark_sidebars_backdropColor: {
        label: '<h3>Sidebars</h3><div class="gmc-label">Backdrop color</div>',
        type: 'text',
        default: '',
      },
      dark_repositoryHeader_import: {
        label: '<h3>Repository header</h3><div class="gmc-label">Import</div>',
        type: 'checkbox',
        default: false,
      },
      dark_repositoryHeader_center: {
        label: 'Center',
        type: 'checkbox',
        default: false,
      },
      dark_repositoryHeader_backgroundColor: {
        label: 'Background color',
        type: 'text',
        default: '',
      },
      dark_repositoryHeader_avatar_remove: {
        label: 'Avatar remove',
        type: 'checkbox',
        default: false,
      },
      dark_repositoryHeader_avatar_customSvg: {
        label: 'Custom SVG (URL or text)',
        type: 'textarea',
        default: '',
      },
      dark_repositoryHeader_link_color: {
        label: 'Link color',
        type: 'text',
        default: '',
      },
      dark_repositoryHeader_link_hover_backgroundColor: {
        label: 'Link hover background color',
        type: 'text',
        default: '',
      },
      dark_repositoryHeader_link_hover_color: {
        label: 'Link hover color',
        type: 'text',
        default: '',
      },
      dark_repositoryHeader_link_hover_textDecoration: {
        label: 'Link hover text decoration',
        type: 'text',
        default: '',
      },
      clear_custom_config: {
        label: 'Clear Custom',
        section: ['Danger Zone'],
        type: 'button',
        click: gmcClearCustom,
      },
      apply_default_config: {
        label: 'Apply Default to Custom',
        type: 'button',
        click: gmcApplyCustomDefaultConfig,
      },
      apply_oldSchool_config: {
        label: 'Apply Old School to Custom',
        type: 'button',
        click: gmcApplyCustomOldSchoolConfig,
      },
    },
  });

  // GMC.open();
})();
