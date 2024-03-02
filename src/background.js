// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// A generic onclick callback function.

importScripts('ExtPay.js') // or `import` / `require` if using a bundler

chrome.contextMenus.onClicked.addListener(genericOnClick);

// A generic onclick callback function.
async function genericOnClick(info) {
  switch (info.menuItemId) {
    case 'enable':
      // Radio item function
      console.log('Radio item clicked. Status:', info.checked);
      break;
    case 'execution':
      // Checkbox item function
          //Add all you functional Logic here
        extpay.getUser().then(user => {
          if (user.paid) {
            (async () => {
              const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
            const response = await chrome.tabs.sendMessage(tab.id, {
              "function": "translateByOpenAI",
              "params":{
                "searchText":info.selectionText
              }
            });
            // do something with response here, not outside the function
            console.log(response);
            })();
    
          } else {
              console.log('not paid!!')
              extpay.openPaymentPage()
          }
        })
      break;
    default:
      // Standard context menu item function
      console.log('Standard context menu item clicked.');
  }
}
chrome.runtime.onInstalled.addListener(function () {
  // Create one test item for each context type.

  chrome.contextMenus.create({
    title: "Context Translator",
    contexts:[
      'selection',
      'editable',
    ],
    id: 'execution'
  });

  // Create a parent item and two children.
  chrome.contextMenus.create({
    title: 'Settings',
    id: 'parent'
  });

  // chrome.contextMenus.create({
  //   title: 'Open Setting',
  //   parentId: settingMenu,
  //   id: 'child1'
  // });

  // Create a radio item.
  chrome.contextMenus.create({
    title: 'Enable',
    type: 'radio',
    id: 'enable'
  });


  // Intentionally create an invalid item, to show off error checking in the
  // create callback.
  chrome.contextMenus.create(
    { title: 'Oops', parentId: 999, id: 'errorItem' },
    function () {
      if (chrome.runtime.lastError) {
        console.log('Got expected error: ' + chrome.runtime.lastError.message);
      }
    }
  );
});


const extpay = ExtPay('context-plugin-for-chrome');
extpay.startBackground(); 