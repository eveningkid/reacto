function render(type, token, Element, all, suggestion) {
  const icon = document.createElement('span');
  icon.className = 'autocomplete-icon autocomplete-icon--' + type;
  icon.appendChild(document.createTextNode(type));

  const suggestionName = document.createElement('span');

  let html = '';

  if (token) {
    const regex = new RegExp(token.string, 'i');
    html += suggestion.displayText.replace(regex, '<strong>$&</strong>');
  } else {
    html += suggestion.displayText;
  }

  html += suggestion.metadata
    ? '<span class="metadata">' + suggestion.metadata + '</span>'
    : '';
  suggestionName.innerHTML = html;

  Element.appendChild(icon);
  Element.appendChild(suggestionName);

  return Element;
}

export const autocomplete = {
  render,
};
