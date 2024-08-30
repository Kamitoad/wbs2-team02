import { TimeCodePipe } from './time-code.pipe';

describe('TimeCodePipe', () => {
  it('create an instance', () => {
    const pipe = new TimeCodePipe();
    expect(pipe).toBeTruthy();
  });
});
