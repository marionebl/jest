/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

let createRuntime;

describe('Runtime', () => {
  beforeEach(() => {
    createRuntime = require('createRuntime');
  });

  describe('jest.fn', () => {
    it('creates mock functions', async () => {
      const runtime = await createRuntime(__filename);
      const root = runtime.requireModule(runtime.__mockRootPath);
      const mock = root.jest.fn();
      expect(mock._isMockFunction).toBe(true);
      mock();
      expect(mock).toHaveBeenCalled();
    });

    it('creates mock functions with mock implementations', async () => {
      const runtime = await createRuntime(__filename);
      const root = runtime.requireModule(runtime.__mockRootPath);
      const mock = root.jest.fn(string => `${string} implementation`);
      expect(mock._isMockFunction).toBe(true);
      const value = mock('mock');
      expect(value).toBe('mock implementation');
      expect(mock).toHaveBeenCalled();
    });
  });

  describe('jest.isMockFunction', () => {
    it('recognizes a mocked function', async () => {
      const runtime = await createRuntime(__filename);
      const root = runtime.requireModule(runtime.__mockRootPath);
      const mock = root.jest.fn();
      expect(root.jest.isMockFunction(() => {})).toBe(false);
      expect(root.jest.isMockFunction(mock)).toBe(true);
    });
  });

  describe('jest.clearAllMocks', () => {
    it('clears all mocks', async () => {
      const runtime = await createRuntime(__filename);
      const root = runtime.requireModule(runtime.__mockRootPath);

      const mock1 = root.jest.fn();
      mock1();

      const mock2 = root.jest.fn();
      mock2();

      expect(mock1).toHaveBeenCalled();
      expect(mock2).toHaveBeenCalled();

      runtime.clearAllMocks();

      expect(mock1).not.toHaveBeenCalled();
      expect(mock2).not.toHaveBeenCalled();
    });
  });
});
