/**
 * Is it currently Flow linter
 */
function isFlowLinter(state) {
  const code = state.session.currentSession.code;
  const isFirstLineFlowComment = code && code.split('\n')[0].includes('@flow');
  const isFlow = state.project.compiler === 'flow';
  return isFirstLineFlowComment || isFlow;
}

export default function project(project, rootState) {
  return {
    ...project,
    isFlowLinter: () => isFlowLinter(rootState),
  };
}
