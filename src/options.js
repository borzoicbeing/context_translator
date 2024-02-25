// Saves options to chrome.storage
const saveOptions = () => {
    const openaiApikey = document.getElementById('openai_apikey').value;
    const openaiModel = document.getElementById('openai_model').value;
    const language = document.getElementById('language').value;
  
    chrome.storage.sync.set(
      { openaiApikey,openaiModel,language },
      () => {
        // Update status to let user know options were saved.
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(() => {
          status.textContent = '';
        }, 750);
      }
    );
  };
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  const restoreOptions = () => {
    chrome.storage.sync.get(
      { openaiApikey:"",openaiModel:"gpt-3.5-turbo", language:"Japanese" },
      (items) => {
        document.getElementById('openai_apikey').value = items.openaiApikey;
        document.getElementById('openai_model').value = items.openaiModel;
        document.getElementById('language').value = items.language;
      }
    );
  };
  
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('save').addEventListener('click', saveOptions);