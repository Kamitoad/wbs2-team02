import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  it('should be defined', () => {
    // @ts-ignore
    expect(new RolesGuard()).toBeDefined();
  });
});
