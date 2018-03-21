import React from 'react';
import uniqid from 'uniqid';
import classNames from 'classnames';
import searchNpmRegistry from 'search-npm-registry';
import { connect } from 'react-redux';
import { Badge, Icon, Popover } from 'antd';
import { Button, Checkbox, Container, InputSearch, List } from '../../../components/_ui';
import { EventsManager, NotificationManager } from '../../../editor/managers';
import { perf } from '../../../utils';

class PackageManagerRenderer extends React.Component {
  state = {
    isOpened: false,
    searchPackage: '',
    installOptions: [],
    runningTasks: new Set(),
    openedActionsFor: null,
    suggestions: [],
  };

  componentWillMount() {
    EventsManager.on('focus-package-manager', () => this.focusSearchInput());
  }

  focusSearchInput = () => {
    this.setState({ isOpened: true }, () => {
      setTimeout(() => {
        this.setState({ forceAutoFocus: true });
      }, 200);
    });
  }

  /**
   * Let the dependencies list which module's actions is currently opened
   *
   * @param {string} dependency module name
   */
  toggleActions = (dependency, event) => {
    event.stopPropagation();
    const openedActionsFor = this.state.openedActionsFor;

    if (openedActionsFor === dependency) {
      return this.resetActionsForModule(event);
    }

    this.setState({ openedActionsFor: dependency });
  }

  /**
   * Handle multiple installations e.g. "module-a module-b".
   * Should start two tasks
   *
   * @param {string} modules
   */
  prepareToAddModules = (modules) => {
    modules.split(' ').forEach((moduleName) => this.addModule(moduleName));
  }

  addModule = async (moduleName) => {
    if (!moduleName) {
      return;
    }

    const installOptions = this.state.installOptions;

    const options = {
      isGlobal: installOptions.includes('isGlobal'),
      isDev: installOptions.includes('isDev'),
    };

    await this.addTask(moduleName);
    await this.props.packageManager.add(moduleName, options);
    !this.state.isOpened && NotificationManager.success(`Module ${moduleName} installed`);
    this.removeTask(moduleName);
  }

  removeModule = async (moduleName) => {
    await this.addTask(moduleName);
    await this.props.packageManager.remove(moduleName);
    !this.state.isOpened && NotificationManager.success(`Module ${moduleName} uninstalled`);
    this.removeTask(moduleName);
  }

  upgradeModule = async (moduleName) => {
    await this.addTask(moduleName);
    await this.props.packageManager.upgrade(moduleName);
    !this.state.isOpened && NotificationManager.success(`Module ${moduleName} upgraded`);
    this.removeTask(moduleName);
  }

  addTask = (task) => {
    let runningTasks = this.state.runningTasks;
    runningTasks.add(task);

    return new Promise((resolve, reject) => {
      this.setState({ runningTasks, searchPackage: '' }, () => resolve());
    });
  }

  removeTask = (task) => {
    let runningTasks = this.state.runningTasks;
    runningTasks.delete(task);

    return new Promise((resolve, reject) => {
      this.setState({ runningTasks, searchPackage: '' }, () => resolve());
    });
  }

  closePackageManager = () => {
    this.setState({ isOpened: false });
  }

  /**
   * Quickly reset "openedActionsFor".
   * Useful when the use clicks somewhere else to display one module's version
   * again
   */
  resetActionsForModule = (event) => {
    event.stopPropagation();
    this.setState({ openedActionsFor: null });
  }

  searchSuggestions = async () => {
    if (this.state.searchPackage.length === 0) return;

    const suggestions = await searchNpmRegistry()
      .text(this.state.searchPackage)
      .size(5)
      .search();

    this.setState({ suggestions });
  }

  renderRunningTask(task) {
    return (
      <div className="running-task" key={uniqid()}>
        <Badge status="processing" text={task} />
      </div>
    );
  }

  renderSubcategoryDependencies(title, dependencies, className) {
    if (dependencies.length === 0) {
      return null;
    }

    return (
      <Container>
        <h1>{title}</h1>

        <List>
          {dependencies.map(([dependency, version]) => {
            const hasActionsOpened = this.state.openedActionsFor === dependency;
            const versionClasses = classNames('version', {
              'has-actions-opened': hasActionsOpened,
            });

            return (
              <List.Entry key={uniqid()}>
                <p>{dependency}</p>

                <span className={versionClasses} onClick={this.toggleActions.bind(this, dependency)}>
                  {hasActionsOpened ? (
                    <React.Fragment>
                      <div className="action delete" onClick={this.removeModule.bind(this, dependency)}>
                        <Icon type="delete" />
                      </div>

                      <div className="action upgrade" onClick={this.upgradeModule.bind(this, dependency)}>
                        <Icon type="arrow-up" />
                      </div>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      {version}
                      <Icon type="setting" />
                    </React.Fragment>
                  )}
                </span>
              </List.Entry>
            );
          })}
        </List>
      </Container>
    );
  }

  updateSearchPackage = (searchPackage) => {
    this.setState({ searchPackage });
    perf.debounce(this.searchSuggestions, 1000)();
  }

  openProjectPackage = () => {
    this.closePackageManager();
    this.props.openFile(this.props.pathToPackage);
  }

  filterDependencies = ([dependency]) => dependency.includes(this.state.searchPackage);

  renderSuggestions = () => {
    const suggestions = this.state.suggestions;

    if (suggestions.length === 0) {
      return null;
    }

    // Keep only dependencies module names
    const allDependencies = this.props.packageManager
      .allDependencies
      .map(([dependency]) => dependency);

    return (
      <Container>
        <h1>Suggestions</h1>

        <List>
          {suggestions
            .filter((suggestion) => !allDependencies.includes(suggestion.name))
            .map((suggestion) => (
              <List.Entry key={uniqid()} title="Install" onCheck={this.prepareToAddModules.bind(this, suggestion.name)}>
                <p>
                  <strong>{suggestion.name}</strong><br />
                  <span className="description">{suggestion.description}</span>
                </p>
              </List.Entry>
            ))
          }
        </List>
      </Container>
    );
  }

  renderPopover() {
    const { searchPackage } = this.state;
    const runningTasks = Array.from(this.state.runningTasks);

    let dependencies = this.props.packageManager.dependencies;
    let devDependencies = this.props.packageManager.devDependencies;

    if (searchPackage) {
      dependencies = dependencies.filter(this.filterDependencies);
      devDependencies = devDependencies.filter(this.filterDependencies);
    }

    const options = [
      { label: 'Global', value: 'isGlobal' },
      { label: 'Dev', value: 'isDev' },
    ];

    return (
      <React.Fragment>
        <InputSearch
          placeholder="Install package, search (⌘⇧P)"
          value={searchPackage}
          onChange={this.updateSearchPackage}
          onSearch={this.prepareToAddModules.bind(this, searchPackage)}
          onEscape={this.closePackageManager}
          autoFocus={this.state.forceAutoFocus}
        />

        {searchPackage && (
          <div className="install-package">
            <Checkbox.Group
              options={options}
              value={this.state.installOptions}
              onChange={(installOptions) => this.setState({ installOptions })}
            />

            <span
              className="install-package-link"
              onClick={this.prepareToAddModules.bind(this, searchPackage)}
            >
              Install
            </span>
          </div>
        )}

        {runningTasks && (
          <div className="running-tasks">
            {runningTasks.map(this.renderRunningTask)}
          </div>
        )}

        <div onClick={this.resetActionsForModule} className="dependencies">
          {this.renderSubcategoryDependencies('Dependencies', dependencies, 'normal')}
          {this.renderSubcategoryDependencies('Dev Dependencies', devDependencies, 'dev')}
          {searchPackage && this.renderSuggestions()}
        </div>

        <Button onClick={this.openProjectPackage} style={{ marginTop: 16 }}>
          Edit package.json
        </Button>
      </React.Fragment>
    );
  }

  render() {
    return (
      <Popover
        placement="bottom"
        content={this.renderPopover()}
        trigger="click"
        onVisibleChange={(isOpened) => this.setState({ isOpened })}
        visible={this.state.isOpened}
        overlayClassName="PackageManagerPopover"
      >
        <div>
          <Badge
            status={this.state.runningTasks.size > 0 ? "processing" : "default"}
            text="Package Manager"
          />
        </div>
      </Popover>
    );
  }
}

const mapStateToProps = state => ({
  packageManager: state.project.packageManager,
  pathToPackage: state.project.packageManager.pathToPackage,
});

const mapDispatchToProps = dispatch => ({
  openFile: pathToFile => dispatch.session.openFileAsync(pathToFile),
});

export default connect(mapStateToProps, mapDispatchToProps)(PackageManagerRenderer);
