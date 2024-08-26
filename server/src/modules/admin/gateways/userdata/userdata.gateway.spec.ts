import { Test, TestingModule } from '@nestjs/testing';
import { UserdataGateway } from './userdata.gateway';

describe('UserdataGateway', () => {
    let gateway: UserdataGateway;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserdataGateway],
        }).compile();

        gateway = module.get<UserdataGateway>(UserdataGateway);
    });

    it('should be defined', () => {
        expect(gateway).toBeDefined();
    });
});
