// ==UserScript==
// @name         GitHub Custom Global Navigation
// @namespace    https://blakegearin.com
// @version      1.0.0
// @description  Customize GitHub's new global navigation
// @author       Blake Gearin
// @match        *://github.com/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  const OLD_STYLE = true;

  const SILENT = false;
  const QUIET = true;

  let CONFIG = {
    backgroundColor: '',
    hamburgerButton: {
      remove: false,
    },
    logo: {
      remove: true,
      customSvg: '',
    },
    pageTitle: {
      remove: false,
    },
    search: {
      backgroundColor: '',
      magnifyingGlassIcon: {
        remove: false,
      },
      text: {
        content: '',
        color: '',
      },
      width: 'auto',
      commandPalette: {
        remove: false,
      },
      marginRight: '',
      modal: {
        width: '',
      },
    },
    divider: {
      remove: true,
    },
    create: {
      remove: false,
      plusIcon: {
        remove: false,
        color: '',
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
      hoverBackgroundColor: '',
      border: true,
      tooltip: false,
    },
    issues: {
      remove: false,
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
      border: true,
      tooltip: false,
    },
    pullRequests: {
      remove: false,
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
      border: true,
      tooltip: false,
    },
    notifications: {
      remove: false,
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
        color: '',
        displayOverIcon: true,
      },
      hoverBackgroundColor: '',
      border: true,
      tooltip: false,
    },
    globalBar: {
      boxShadowColor: '',
    },
    localBar: {
      backgroundColor: '#02040A',
      boxShadow: {
        consistentColor: true,
      },
      centered: false,
    },
    sidebars: {
      backdropColor: 'transparent',
    },
    repositoryHeader: {
      import: true,
      backgroundColor: '#02040A',
      centered: false,
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
  };

  if (OLD_STYLE) {
    const color = '#F0F6FC';
    const hoverColor = '#FFFFFFB3';
    const hoverBackgroundColor = 'transparent';

    CONFIG = {
      backgroundColor: '#161C20',
      hamburgerButton: {
        remove: true,
      },
      logo: {
        remove: false,
        customSvg: '',
      },
      pageTitle: {
        remove: true,
      },
      search: {
        backgroundColor: '#0E1217',
        magnifyingGlassIcon: {
          remove: true,
        },
        text: {
          content: 'Search or jump to...',
          color: '#B3B3B5',
        },
        width: 'calc(var(--feed-sidebar) - 75px)',
        commandPalette: {
          remove: true,
        },
        marginRight: '8px',
        modal: {
          width: '450px',
        },
      },
      divider: {
        remove: true,
      },
      create: {
        remove: false,
        plusIcon: {
          remove: false,
          color: color,
          hover: {
            color: hoverColor,
          },
        },
        text: {
          content: '',
          color: '',
        },
        dropdownIcon: {
          remove: false,
          color: color,
          hover: {
            color: hoverColor,
          },
        },
        hoverBackgroundColor: hoverBackgroundColor,
        border: false,
        tooltip: false,
      },
      issues: {
        remove: false,
        icon: {
          remove: true,
          color: '',
        },
        text: {
          content: 'Issues',
          color: color,
        },
        hover: {
          backgroundColor: hoverBackgroundColor,
          color: hoverColor,
        },
        border: false,
        tooltip: false,
      },
      pullRequests: {
        remove: false,
        icon: {
          remove: true,
          color: '',
        },
        text: {
          content: 'Pull requests',
          color: color,
        },
        hover: {
          backgroundColor: hoverBackgroundColor,
          color: hoverColor,
        },
        border: false,
        tooltip: false,
      },
      notifications: {
        remove: false,
        icon: {
          symbol: 'bell',
          color: color,
          hover: {
            color: hoverColor,
          }
        },
        text: {
          content: '',
          color: '',
        },
        dot: {
          remove: false,
          color: '',
          displayOverIcon: true,
        },
        hoverBackgroundColor: hoverBackgroundColor,
        border: false,
        tooltip: false,
      },
      globalBar: {
        boxShadowColor: '#21262D',
      },
      localBar: {
        backgroundColor: '#0D1116',
        boxShadow: {
          consistentColor: true,
        },
        centered: true,
      },
      sidebars: {
        backdropColor: hoverBackgroundColor,
      },
      repositoryHeader: {
        import: true,
        backgroundColor: '#0D1116',
        centered: true,
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
    };
  }

  const UNICODE_NON_BREAKING_SPACE = '\u00A0';

  let HEADER;
  let SELECTORS;
  let CUSTOM_STYLE;

  if (!SILENT) console.log('GitHub Custom Global Navigation running');

  function updateHeader() {
    if (!QUIET) console.log('GitHub Custom Global Navigation updating links...');

    if (CONFIG.backgroundColor !== '') {
      CUSTOM_STYLE.textContent += `
        ${SELECTORS.header.self}
        {
          background-color: ${CONFIG.backgroundColor} !important;
        }
      `;
    }

    if (CONFIG.hamburgerButton.remove) removeHamburgerButton();
    updateLogo();

    let pageTitleMoved = false;
    if (CONFIG.repositoryHeader.import) pageTitleMoved = importRepositoryHeader();
    if (CONFIG.pageTitle.remove && !pageTitleMoved) removePageTitle();

    updateSearch();

    if (CONFIG.divider.remove) removeDivider();

    updateLink('pullRequests');
    updateLink('issues');
    updateCreateNewButton();
    updateInboxLink();
    updateGlobalBar();
    updateLocalBar();

    if (CONFIG.sidebars.backdropColor !== '') updateSidebarBackdropColor();
    if (OLD_STYLE) addOldStyleCSS();

    HEADER.appendChild(CUSTOM_STYLE);
  }

  function removeHamburgerButton() {
    const hamburgerButton = HEADER.querySelector(SELECTORS.hamburgerButton);

    if (!hamburgerButton) {
      console.error(`${SELECTORS.hamburgerButton} tooltip not found`);
      return;
    }

    hamburgerButton.remove();
    if (!QUIET) console.log('Hamburger button removed');
  }

  function updateLogo() {
    const elementConfig = CONFIG.logo;

    if (elementConfig.remove) {
      HEADER.querySelector(SELECTORS.logo.topDiv).remove();
    }

    if (elementConfig.customSvg !== '') {
      const oldSvg = HEADER.querySelector(SELECTORS.logo.svg);

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

  function removePageTitle() {
    const pageTitle = HEADER.querySelector(SELECTORS.title);

    if (!pageTitle) {
      console.error(`${SELECTORS.title} div not found`);
      return;
    }

    pageTitle.remove();

    if (!QUIET) console.log('Page title removed');
  }

  function updateSearch() {
    const elementConfig = CONFIG.search;

    if (elementConfig.width === 'auto') {
      CUSTOM_STYLE.textContent += `
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
      CUSTOM_STYLE.textContent += `
        @media (min-width: 1012px)
        {
          ${SELECTORS.search.input}
          {
            width: ${elementConfig.width} !important
          }
        }
      `;
    }

    if (elementConfig.marginRight !== '') {
      CUSTOM_STYLE.textContent += `
        @media (min-width: 1012px)
        {
          ${SELECTORS.search.input}
          {
            margin-right: ${elementConfig.marginRight} !important
          }
        }
      `;
    }

    if (OLD_STYLE) {
      CUSTOM_STYLE.textContent += `
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
    }

    if (elementConfig.commandPalette.remove) {
      const commandPaletteButton = HEADER.querySelector(SELECTORS.search.commandPalette);
      if (!commandPaletteButton) {
        console.error(`Selector ${SELECTORS.search.commandPalette} not found`);
      } else {
        commandPaletteButton.remove();
        if (!QUIET) console.log('Command palette removed');
      }
    }

    const placeholderSpan = HEADER.querySelector(SELECTORS.search.placeholderSpan);

    if (!placeholderSpan) {
      console.error(`Selector ${SELECTORS.search.placeholderSpan} not found`);
      return;
    }

    if (elementConfig.text.content !== '') {
      // Without this, the placeholder text is overwritten by the shadow DOM
      // You may see the following error in the console:
      // qbsearch-input-element.ts:421 Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'innerHTML')
      placeholderSpan.setAttribute('data-target', 'avoidShadowDOM');
      placeholderSpan.innerText = elementConfig.text.content;
    }

    if (elementConfig.text.color !== '') {
      CUSTOM_STYLE.textContent += `
        ${SELECTORS.search.placeholderSpan}
        {
          color: ${elementConfig.text.color} !important;
        }
      `;
    }

    const searchButton = HEADER.querySelector(SELECTORS.search.button);

    if (!searchButton) {
      console.error(`Selector ${SELECTORS.search.button} not found`);
      return;
    }

    if (elementConfig.backgroundColor !== '') {
      CUSTOM_STYLE.textContent += `
        ${SELECTORS.search.button}
        {
          background-color: ${elementConfig.backgroundColor} !important;
        }
      `;
    }

    if (elementConfig.magnifyingGlassIcon.remove) {
      searchButton?.parentNode?.firstElementChild?.remove();
    }

    if (elementConfig.modal.width !== '') {
      CUSTOM_STYLE.textContent += `
        ${SELECTORS.search.modal}
        {
          width: ${elementConfig.modal.width} !important;
        }
      `;
    }

    if (OLD_STYLE) {
      CUSTOM_STYLE.textContent += `
        ${SELECTORS.search.placeholderSpan}
        {
          width: 100% !important;
        }
      `;

      const slashImg = document.createElement('img');
      slashImg.src = 'https://github.githubassets.com/images/search-key-slash.svg';
      slashImg.alt = 'slash key to search';
      slashImg.className = 'header-search-key-slash';

      const placeholderDiv = HEADER.querySelector(SELECTORS.search.placeholderDiv);

      if (!placeholderDiv) {
        console.error(`Selector ${SELECTORS.search.placeholderDiv} not found`);
        return;
      }

      CUSTOM_STYLE.textContent += `
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
  }

  function removeDivider() {
    CUSTOM_STYLE.textContent += `
      ${SELECTORS.header.actionsDiv}::before
      {
        content: none !important;
      }
    `;
  }

  function updateLink(configKey) {
    const tooltipElement = SELECTORS.toolTips[configKey];

    if (!tooltipElement) {
      console.error(`${configKey} tooltip not found`);
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
      CUSTOM_STYLE.textContent += `
        #${divId} a:hover
        {
          background-color: ${elementConfig.hover.backgroundColor} !important;
        }
      `;
    }

    if (elementConfig.hover.color !== '') {
      CUSTOM_STYLE.textContent += `
        #${divId} a span:hover
        {
          color: ${elementConfig.hover.color} !important;
        }
      `;
    }

    if (OLD_STYLE) {
      let elementToInsertAfter;

      if (configKey === 'pullRequests') {
        const actionsDiv = link.parentNode.parentNode;
        actionsDiv.parentNode.removeChild(actionsDiv);

        elementToInsertAfter = HEADER.querySelector(SELECTORS.search.topDiv);
        elementToInsertAfter.parentNode.insertBefore(actionsDiv, elementToInsertAfter.nextSibling);

        if (!QUIET) console.log('Moved pull requests link');
      } else if (configKey === 'issues') {
        const parentDiv = link.parentNode;
        parentDiv.parentNode.removeChild(parentDiv);

        elementToInsertAfter = HEADER.querySelector(SELECTORS.pullRequests);
        elementToInsertAfter.parentNode.insertBefore(parentDiv, elementToInsertAfter.nextSibling);

        if (!QUIET) console.log('Moved issues link');
      }
    }

    if (!QUIET) console.log(`Updates applied to link ${configKey}: `, link);
  }

  function updateCreateNewButton() {
    const configKey = 'create';
    const tooltipElement = SELECTORS.toolTips[configKey];

    if (!tooltipElement) {
      console.error(`${configKey} tooltip not found`);
      return;
    }

    const button = HEADER.querySelector(SELECTORS.create.button);

    if (!button) {
      console.error('"Create new..." button not found');
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
        CUSTOM_STYLE.textContent += `
        ${SELECTORS.create.plusIcon}
        {
          color: ${elementConfig.plusIcon.color} !important;
        }
      `;
      }

      if (elementConfig.plusIcon.hover.color !== '') {
        CUSTOM_STYLE.textContent += `
          ${SELECTORS.create.plusIcon.split(' ').join(':hover ')} svg path
          {
            fill: ${elementConfig.plusIcon.hover.color} !important;
          }
        `;
      }
    }

    if (elementConfig.text.content !== '') {
      // Update the text's font properties to match the others
      CUSTOM_STYLE.textContent += `
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
      CUSTOM_STYLE.textContent += `
        ${SELECTORS.create.dropdownIcon}
        {
          grid-area: initial !important;
        }
      `;

      if (elementConfig.dropdownIcon.color !== '') {
        CUSTOM_STYLE.textContent += `
          ${SELECTORS.create.dropdownIcon}
          {
            color: ${elementConfig.dropdownIcon.color} !important;
          }
        `;
      }

      if (elementConfig.dropdownIcon.hover.color !== '') {
        CUSTOM_STYLE.textContent += `
          ${SELECTORS.create.dropdownIcon.split(' ').join(':hover ')} svg path
          {
            fill: ${elementConfig.dropdownIcon.hover.color} !important;
          }
        `;
      }
    }

    if (!elementConfig.border) {
      CUSTOM_STYLE.textContent += `
        ${SELECTORS.create.button}
        {
          border: none !important;
        }
      `;
    }

    if (elementConfig.hoverBackgroundColor !== '') {
      CUSTOM_STYLE.textContent += `
        ${SELECTORS.create.button}:hover
        {
          background-color: ${elementConfig.hoverBackgroundColor} !important;
        }
      `;
    }

    if (OLD_STYLE) {
      const actionMenu = button.parentNode.parentNode.parentNode;
      actionMenu.parentNode.removeChild(actionMenu);

      let elementToInsertAfter = HEADER.querySelector(SELECTORS.notifications.indicator);

      elementToInsertAfter.parentNode.insertBefore(actionMenu, elementToInsertAfter.nextSibling);

      if (!QUIET) console.log('Moved create button');
    }

    if (!QUIET) console.log(`Updates applied to button ${configKey}: `, button);
  }

  function updateInboxLink() {
    const configKey = 'notifications';

    const inboxLink = HEADER.querySelector(SELECTORS.notifications.link);

    if (!inboxLink) {
      console.error(`${SELECTORS.notifications.link} link not found`);
      return;
    }

    const elementConfig = CONFIG[configKey];

    if (elementConfig.remove) {
      inboxLink.parentNode.remove();
    } else if (!elementConfig.tooltip) {
      SELECTORS.toolTips.notifications.remove();
    }

    if (elementConfig.dot.remove) {
      CUSTOM_STYLE.textContent += `
        ${SELECTORS.notifications.dot}
        {
          content: none !important;
        }
      `;
    } else if (elementConfig.dot.color !== '') {
      CUSTOM_STYLE.textContent += `
        ${SELECTORS.notifications.dot}
        {
          background: ${elementConfig.dot.color} !important;
        }
      `;
    }

    if (elementConfig.icon.symbol === 'inbox') {
      if (elementConfig.icon.color !== '') {
        CUSTOM_STYLE.textContent += `
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
      CUSTOM_STYLE.textContent += `
        ${SELECTORS.notifications.link}:hover svg path
        {
          fill: ${elementConfig.icon.hover.color} !important;
        }
      `;
    }

    if (elementConfig.text.content !== '') {
      const padding = '9px';

      CUSTOM_STYLE.textContent += `
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
      CUSTOM_STYLE.textContent += `
        ${SELECTORS.notifications.link}
        {
          border: none !important;
        }
      `;
    }

    if (elementConfig.dot.displayOverIcon) {
      CUSTOM_STYLE.textContent += `
        ${SELECTORS.notifications.dot}
        {
          top: 5px !important;
          left: 18px !important;
        }
      `;
    }

    if (elementConfig.hoverBackgroundColor !== '') {
      CUSTOM_STYLE.textContent += `
        ${SELECTORS.notifications.link}:hover
        {
          background-color: ${elementConfig.hoverBackgroundColor} !important;
        }
      `;
    }

    if (!QUIET) console.log(`Updates applied to link ${configKey}: `, inboxLink);
  }

  function updateGlobalBar() {
    const elementConfig = CONFIG.globalBar;

    if (elementConfig.boxShadowColor !== '') {
      CUSTOM_STYLE.textContent += `
        ${SELECTORS.header.globalBar}
        {
          box-shadow: inset 0 calc(var(--borderWidth-thin, 1px)*-1) ${elementConfig.boxShadowColor} !important;
        }
      `;
    }
  }

  function updateLocalBar() {
    const elementConfig = CONFIG.localBar;

    if (elementConfig.backgroundColor !== '') {
      CUSTOM_STYLE.textContent += `
        ${SELECTORS.header.localBar}
        {
          background-color: ${elementConfig.backgroundColor} !important;
          box-shadow: inset 0 calc(var(--borderWidth-thin, 1px)*-1) var(--color-border-default) !important;
        }
      `;
    }

    if (elementConfig.centered) {
      CUSTOM_STYLE.textContent += `
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
      CUSTOM_STYLE.textContent += `
        .UnderlineNav
        {
          box-shadow: none !important;
        }
      `;
    }
  }

  function updateSidebarBackdropColor() {
    CUSTOM_STYLE.textContent += `
      .Overlay-backdrop--side
      {
        background-color: ${CONFIG.sidebars.backdropColor} !important;
      }
    `;
  }

  function addOldStyleCSS() {
    CUSTOM_STYLE.textContent += `
      ${SELECTORS.header.actionsDiv}::before
      {
        content: none !important;
      }

      ${SELECTORS.header.actionsDiv}
      {
        display: flex !important;
        justify-content: flex-end !important;
      }

      @media (max-width: 767.98px)
      {
        ${SELECTORS.header.actionsDiv} div,
        action-menu
        {
          display: none !important;
        }
      }

      ${SELECTORS.header.actionsDiv}
      {
        position: relative !important;
        display: flex !important;
        flex: 1 1 auto !important;
        justify-content: left !important;
      }

      ${SELECTORS.header.leftAligned}
      {
        flex: 0 1 auto !important;
      }
      ${SELECTORS.header.rightAligned}
      {
        flex: 1 1 auto !important;
        justify-content: flex-start !important;
      }

      ${SELECTORS.search.topDiv}
      {
        flex: 0 1 auto !important;
        justify-content: flex-start !important;
      }

      ${SELECTORS.create.plusIcon}
      {
        margin-right: 0px !important;
      }

      ${SELECTORS.header.rightAligned}
      {
        gap: 2px !important;
      }
    `;
  }

  function importRepositoryHeader() {
    const elementConfig = CONFIG.repositoryHeader;

    const name = document.querySelector(SELECTORS.repositoryHeader.name);

    if (!name) {
      // When not in a repo, this is expected
      if (!QUIET) console.log(`${SELECTORS.repositoryHeader.name} link not found`);
      return;
    } else {
      name.remove();
    }

    const repositoryHeader = document.querySelector(SELECTORS.repositoryHeader.id);

    repositoryHeader.parentNode.removeChild(repositoryHeader);

    const divElement = document.createElement('div');
    divElement.classList.add('AppHeader-globalBar');
    divElement.style.setProperty('padding', '0px', 'important');
    divElement.style.setProperty('box-shadow', 'none', 'important');

    if (elementConfig.backgroundColor !== '') {
      divElement.style.setProperty('background-color', elementConfig.backgroundColor);
    }

    divElement.appendChild(repositoryHeader);

    let elementToInsertAfter = HEADER.querySelector(SELECTORS.header.globalBar);

    elementToInsertAfter.parentNode.insertBefore(divElement, elementToInsertAfter.nextSibling);

    repositoryHeader.firstElementChild.classList.remove('container-xl', 'px-lg-5');

    const pageTitle = HEADER.querySelector(SELECTORS.title);

    if (!pageTitle) {
      console.error(`${SELECTORS.title} div not found`);
      return;
    }

    pageTitle.querySelectorAll('svg').forEach(svg => svg.remove());

    const ownerImg = HEADER.querySelector(SELECTORS.repositoryHeader.ownerImg);

    if (!ownerImg) {
      console.error(`${SELECTORS.repositoryHeader.ownerImg} avatar not found`);
      return;
    }

    ownerImg.parentNode.insertBefore(pageTitle, ownerImg.nextSibling);

    HEADER.querySelector(SELECTORS.repositoryHeader.bottomBorder).remove();

    if (elementConfig.backgroundColor !== '') {
      CUSTOM_STYLE.textContent += `
        ${SELECTORS.repositoryHeader.id}
        {
          background-color: ${elementConfig.backgroundColor} !important;
        }
      `;
    }

    if (elementConfig.centered) {
      CUSTOM_STYLE.textContent += `
        ${SELECTORS.repositoryHeader.id}
        {
          max-width: 1280px;
          margin-right: auto;
          margin-left: auto;
        }

        ${SELECTORS.repositoryHeader.id} > div
        {
          padding-left: 0px !important;
          padding-right: 0px !important;
        }

        @media (min-width: 768px) {
          ${SELECTORS.repositoryHeader.id}
          {
            padding-right: var(--base-size-24, 24px) !important;
            padding-left: var(--base-size-24, 24px) !important;
          }
        }

        @media (min-width: 1012px) {
          ${SELECTORS.repositoryHeader.id}
          {
            padding-right: var(--base-size-32, 32px) !important;
            padding-left: var(--base-size-32, 32px) !important;
          }
        }
      `;
    }

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

    CUSTOM_STYLE.textContent += `
      ${SELECTORS.repositoryHeader.id}
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

      ${SELECTORS.title}
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

      ${SELECTORS.header.globalBar} .AppHeader-context .AppHeader-context-full
      {
        display: inline-flex !important;
        width: 100% !important;
        min-width: 0 !important;
        max-width: 100% !important;
        overflow: hidden !important;
      }

      ${SELECTORS.header.globalBar}
      {
        padding: 16px !important;
      }
    `;

    return true;
  }

  function isValidURL(string) {
    const urlPattern = /^(https?:\/\/)?([\w.]+)\.([a-z]{2,6}\.?)(\/[\w.]*)*\/?$/i;
    return urlPattern.test(string);
  }

  function observeAndModify(mutationsList) {
    const successFlag = 'customizedHeader';

    for (const mutation of mutationsList) {
      // Use header id to determine if updates have already been applied
      if (mutation.type === 'childList' && !document.getElementById(successFlag)) {
        const headerSelector = 'header.AppHeader';
        HEADER = document.querySelector(headerSelector);

        if (!HEADER) continue;

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
          title: '.AppHeader-context',
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
            button: '#global-create-menu-button',
            plusIcon: '#global-create-menu-button .Button-visual.Button-leadingVisual',
            dropdownIcon: '#global-create-menu-button .Button-label',
          },
          pullRequests: '#pullRequests-div',
          notifications: {
            indicator: 'notification-indicator',
            link: 'notification-indicator a',
            dot: '.AppHeader-button.AppHeader-button--hasIndicator::before',
          },
          repositoryHeader: {
            id: '#repository-container-header',
            ownerImg: '#repository-container-header img',
            name: '#repository-container-header strong',
            links: '#repository-container-header nav[role="navigation"] a',
            details: '#repository-details-container',
            bottomBorder: '#repository-container-header .border-bottom.mx-xl-5',
          },
        };
        CUSTOM_STYLE = document.createElement('style');

        updateHeader();
        HEADER.setAttribute('id', successFlag);

        if (!SILENT) console.log('GitHub Custom Global Navigation complete!');

        break;
      }
    }
  }

  const observer = new MutationObserver(observeAndModify);

  window.addEventListener('load', () => {
    observer.observe(
      document.body,
      {
        childList: true,
        subtree: true
      }
    );
  });
})();
