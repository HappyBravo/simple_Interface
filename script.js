document.addEventListener('DOMContentLoaded', () => {
  const addButton = document.getElementById('add-document');
  const documentList = document.getElementById('document-list');
  const documentViewer = document.getElementById('document-viewer');
  const keywordList = document.getElementById('keyword-list');

  addButton.addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.txt'; // Accepts only text files

    fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];

      if (file && file.name.endsWith('.txt')) {
        const reader = new FileReader();

        reader.addEventListener('load', (event) => {
          const documentText = event.target.result;

          const listItem = document.createElement('li');
          const documentLink = document.createElement('a');
          const deleteButton = document.createElement('span'); // Delete button element

          documentLink.href = '#';
          documentLink.textContent = file.name;
          documentLink.addEventListener('click', () => {
            documentViewer.innerHTML = documentText;
            displayKeywords(documentText);
          });

          deleteButton.className = 'delete-button'; // Add delete button class
          deleteButton.textContent = ''; // Display "x" symbol

          // Delete button click event
          deleteButton.addEventListener('click', () => {
            listItem.remove();
            documentViewer.innerHTML = '';
            keywordList.innerHTML = '';
          });

          listItem.appendChild(documentLink);
          listItem.appendChild(deleteButton); // Append delete button to list item
          documentList.appendChild(listItem);
        });

        reader.readAsText(file);
      }
    });

    fileInput.click();
  });

  function displayKeywords(documentText) {
    const keywords = extractKeywords(documentText);
    keywordList.innerHTML = '';

    keywords.forEach((keyword) => {
      const keywordItem = document.createElement('li');
      keywordItem.textContent = keyword;
      keywordItem.addEventListener('click', highlightKeyword);
      
      const deleteButton = document.createElement('span');
      deleteButton.className = 'delete-button';
      deleteButton.textContent = '';
      deleteButton.addEventListener('click', deleteKeyword);
      
      keywordItem.appendChild(deleteButton);
      keywordList.appendChild(keywordItem);
    });
  }

  function extractKeywords(documentText) {
    // Logic to extract keywords from the document text
    // This is a placeholder implementation; you can replace it with your own logic
    const words = documentText.toLowerCase().split(/\W+/);
    const keywordCount = {};
    const keywords = [];

    words.forEach((word) => {
      if (word.length > 3) {
        keywordCount[word] = (keywordCount[word] || 0) + 1;
      }
    });

    for (const keyword in keywordCount) {
      keywords.push(`${keyword} (${keywordCount[keyword]})`);
    }

    return keywords;
  }

  function highlightKeyword() {
    var keyword = this.textContent.trim();
    // var keyword = this.textContent;
    var str = keyword;
    str = str.replace(/\s*\(.*?\)\s*/g, '');
    keyword = str;
    console.log(str);

    const documentContent = documentViewer.innerText;
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const highlightedContent = documentContent.replace(regex, '<span class="highlight">$&</span>');
    documentViewer.innerHTML = highlightedContent;
  }
  
  function deleteKeyword(event) {
    event.stopPropagation();
    const listItem = this.parentNode;
    listItem.remove();
    const currentHighlighted = document.querySelectorAll('.highlight');
    currentHighlighted.forEach((highlighted) => {
      highlighted.classList.remove('highlight');
    });
  }

   // Add event listener to capture selected text in document viewer
   documentViewer.addEventListener('mouseup', () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      const keywordItem = document.createElement('li');
      keywordItem.textContent = selectedText;

      keywordItem.addEventListener('click', highlightKeyword);
      
      const deleteButton = document.createElement('span');
      deleteButton.className = 'delete-button';
      deleteButton.textContent = '';
      deleteButton.addEventListener('click', deleteKeyword);
      
      keywordItem.appendChild(deleteButton);
      keywordList.appendChild(keywordItem);
    }
  });
  
});
