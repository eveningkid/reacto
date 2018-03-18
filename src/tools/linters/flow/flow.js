import CodeMirror from 'codemirror';

/**
 * Clearly inspired, partly copy/pasted from.
 * @see https://github.com/AtomLinter/linter-flow
 * because it simply works the same.
 * Thank you for their job, really neat.
 */
export default class FlowLinter {
  constructor() {
    this.name = 'flow';
  }

  lint(application, resolve) {
    if (!application.project.isFlowLinter()) {
      return resolve([]);
    }

    const cwd = application.project.cwd;
    const currentFile = application.session.currentFile;

    const args = [
      'check-contents',
      '--json',
      '--root',
      cwd,
      currentFile.filePath.substr(cwd.length + 1),
    ];

    const options = {
      cwd,
      stdin: application.session.currentSession.code,
      ignoreExitCode: true,
    };

    application.environment.run('flow', args, options)
      .then(JSON.parse)
      .then((results) => {
        results = this.handleResults(results);
        resolve(results);
      });
  }

  handleResults(output) {
    if (output.passed || !output.errors) {
      return [];
    }

    return output.errors.reduce((messages, error) =>
      messages.concat(this.flowErrorToLinterMessages(error)), []);
  }

  flowErrorToLinterMessages(flowError) {
    const blameMessages = flowError.message.filter((m) => m.type === 'Blame');

    return blameMessages.map((message, i) => ({
      severity: flowError.level,
      message: flowError.message
        .map((errorMessage) => errorMessage.descr)
        .join(' '),
      from: CodeMirror.Pos(message.line - 1, message.start - 1),
      to: CodeMirror.Pos(message.endline - 1, message.end),
    }));
  }
}
