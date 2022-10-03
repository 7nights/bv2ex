import '@polymer/polymer/polymer-legacy.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<custom-style>
  <style>
    body.theme-dark {
      --surface: #121212;
      --surface-8dp: rgb(45, 45, 45);
      --surface-1dp: rgb(30, 30, 30);
      --surface-2dp: rgb(34, 34, 34);
      --surface-3dp: rgb(36, 36, 36);
      --surface-4dp: rgb(39, 39, 39);
      --surface-6dp: rgb(44, 44, 44);
      --surface-8dp: rgb(46, 46, 46);
      --surface-12dp: rgb(50, 50, 50);
      --surface-16dp: rgb(53, 53, 53);
      --surface-24dp: rgb(56, 56, 56);
      --surface-secondary: var(--surface-2dp);
      --input-background: var(--surface-2dp);
      --border-color: var(--surface-8dp);

      /** material design dark typography */
      --dark-text-primary-color: rgba(0, 0, 0, .87);
      --light-text-primary-color: rgba(255, 255, 255, .87);
      --light-text-secondary-color: rgba(255, 255, 255, .60);
      --light-text-disabled-color: rgba(255, 255, 255, .38);

      --light-blue-fg: #c0d7f9;
      --light-blue-bg: rgb(10, 83, 173);

      --blue: #106be2;
    }
    html {
      /* --blue: #358CFD; */
      --blue: #1a7dff;
      /* --orange: #f3a864; */
      --yellow: #f5c035;
      --orange: #ffa14b;
      --orange-bg: {
        background-color: var(--orange);
        color: #fff;
      }

      --page-height: calc(100vh - var(--bv-toolbar-height));

      --border-color: #efefef;
      --border-color-darker: #ddd;

      --border-radius: 10px;
      --border-radius-large: 12px;

      --color-primary-600: #1a7dff;
      --color-primary-500: #008cff;
      --color-primary-400: #2f9dff;
      --color-primary-300: #58afff;
      --color-primary-200: #8bc6ff;
      --color-primary-100: #badbff;
      --color-primary-50: #e2f1ff;
      --color-primary-900: #2b36b8;
      --color-primary-800: #2858d7;
      --color-primary-700: #236aea;

      --color-secondary-500: #ff9c1a;
      --color-secondary-600: #fb9018;
      --color-secondary-700: #f48015;
      --color-secondary-800: #ee7114;
      --color-secondary-900: #e45811;
      --color-secondary-400: #ffaa32;
      --color-secondary-300: #ffba54;
      --color-secondary-200: #ffce84;
      --color-secondary-100: #ffe1b5;
      --color-secondary-50: #fff3e1;

      --surface-secondary: #fafafa;
      --surface_rgb: 255, 255, 255;
      --surface: #ffffff;
      --surface-8dp: #ffffff;
      --surface-1dp: #ffffff;
      --surface-2dp: #ffffff;
      --surface-3dp: #ffffff;
      --surface-4dp: #ffffff;
      --surface-6dp: #ffffff;
      --surface-8dp: #ffffff;
      --surface-12dp: #ffffff;
      --surface-16dp: #ffffff;
      --surface-24dp: #ffffff;

      --light-blue-border: #7faef7;
      --light-blue-bg: #ecf4ff;
      --light-blue-fg: #3983f4;

      --lighter-blue: rgb(0, 148, 255);
      /* --blue: var(--paper-blue-a400); */
      /* --blue: rgb(0, 122, 255); */
      --blue-bg: {
        background-color: var(--blue);
        color: #fff;
      }
      --text-secondary-color: #95989A;
      --light-bg-button: {
        background-color: #F3F3F3;
        color: var(--blue);
      }
      --bv-toolbar-height: 56px;
      --bv-gradient-bg: {
        background-image: linear-gradient(90deg, #2797FF, #0084FF);
        color: #fff;
      }

      --input-background: #F5F5F5;

      /** material design typography */
      --light-text-primary-color: rgba(0, 0, 0, .87);
      --light-text-secondary-color: rgba(0, 0, 0, .54);
      --light-text-disabled-color: rgba(0, 0, 0, .38);

      --dark-text-primary-color: rgba(255, 255, 255, .87);

      /** shadows */
      --md-box-shadow-1dp: 0 0 2px 0 rgba(0, 0, 0, .14), 0 2px 2px 0 rgba(0, 0, 0, .12), 0 1px 3px 0 rgba(0, 0, 0, .2);
      --md-box-shadow-2dp: 0 0 4px 0 rgba(0, 0, 0, .14), 0 3px 4px 0 rgba(0, 0, 0, .12), 0 1px 5px 0 rgba(0, 0, 0, .2);
      --md-box-shadow-3dp: 0 3px 3px 0 rgba(0, 0, 0, .14), 0 3px 4px 0 rgba(0, 0, 0, .12), 0 1px 8px 0 rgba(0, 0, 0, .2);
      --md-box-shadow-4dp: 0 2px 4px 0 rgba(0, 0, 0, .14), 0 4px 5px 0 rgba(0, 0, 0, .12), 0 1px 10px 0 rgba(0, 0, 0, .2);
      --md-box-shadow-6dp: 0 6px 10px 0 rgba(0, 0, 0, .14), 0 1px 18px 0 rgba(0, 0, 0, .12), 0 3px 5px 0 rgba(0, 0, 0, .2);
      --md-box-shadow-8dp: 0 8px 10px 1px rgba(0, 0, 0, .14), 0 3px 14px 3px rgba(0, 0, 0, .12), 0 4px 15px 0 rgba(0, 0, 0, .2);
      --md-box-shadow-9dp: 0 9px 12px 1px rgba(0, 0, 0, .14), 0 3px 16px 2px rgba(0, 0, 0, .12), 0 5px 6px 0 rgba(0, 0, 0, .2);
      --md-box-shadow-12dp: 0 12px 17px 2px rgba(0, 0, 0, .14), 0 5px 22px 4px rgba(0, 0, 0, .12), 0 7px 8px 0 rgba(0, 0, 0, .2);
      --md-box-shadow-16dp: 0 16px 24px 2px rgba(0, 0, 0, .14), 0 6px 30px 5px rgba(0, 0, 0, .12), 0 8px 10px 0 rgba(0, 0, 0, .2);
      --md-box-shadow-24dp: 0 24px 38px 3px rgba(0, 0, 0, .14), 0 9px 46px 8px rgba(0, 0, 0, .12), 0 11px 15px 0 rgba(0, 0, 0, .2);
    }
    body.smaller-toolbar bv-toolbar, body.smaller-toolbar {
      --bv-toolbar-height: 50px;
      padding-top: 3px;
    }
    * {
      box-sizing: border-box;
    }

    #global-error-toast {
      --paper-toast-background-color: red;
      --paper-toast-color: white;
    }
  </style>
</custom-style>`;

document.head.appendChild($_documentContainer.content);
