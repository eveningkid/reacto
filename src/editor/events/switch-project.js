import { dispatch } from '@rematch/core';

export default function switchProject(_, path) {
  dispatch.project.switchProject(path);
}
