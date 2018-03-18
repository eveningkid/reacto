class SearchSuggestion {
  constructor(options) {
    this.type = options.type;
    this.title = options.title || 'Unknown';
    this.description = options.description || null;
    // Callback when the suggestion is selected
    this.select = options.select || null;
  }
}

export default SearchSuggestion;
