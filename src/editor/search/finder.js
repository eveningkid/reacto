class Finder {
  constructor() {
    this.plugins = [];
  }

  static sortByPriority(a, b) {
    return b.priority - a.priority;
  }

  addPlugin(plugin) {
    this.plugins.push(plugin);
    return this;
  }

  getSuggestions(input) {
    let suggestions = [];
    for (const plugin of this.plugins) {
      // Limit each plugin to suggest maximum 8 suggestions
      const pluginSuggestions = plugin(input)
        .sort(Finder.sortByPriority)
        .slice(0, 8);

      suggestions = suggestions.concat(pluginSuggestions);
    }
    return suggestions;
  }
}

export default Finder;
