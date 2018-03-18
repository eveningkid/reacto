/*
 *  Copyright (c) 2015-present, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

module.exports = function getParser(parserName) {
  switch (parserName) {
    case 'babel':
      return require('../parser/babel5Compat');
    case 'flow':
      return require('../parser/flow');
    case 'babylon':
    default:
      return require('../parser/babylon');
  }
};
