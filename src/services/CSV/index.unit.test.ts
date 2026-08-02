jest.mock('rn-fetch-blob', () => ({
  fs: {
    dirs: { DownloadDir: '/mock/downloads' },
    createFile: jest.fn().mockResolvedValue(undefined),
  },
}));

import { createCSV, recordToCSVString } from './index';

describe('CSV service barrel', () => {
  test('re-exports createCSV and recordToCSVString', () => {
    expect(typeof createCSV).toBe('function');
    expect(typeof recordToCSVString).toBe('function');
  });
});
