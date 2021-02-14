import {Test, TestingModule} from '@nestjs/testing';
import {GlobalLinkController} from "./global-link.controller";

describe('LinksController', () => {
    let controller: GlobalLinkController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [GlobalLinkController],
        }).compile();

        controller = module.get<GlobalLinkController>(GlobalLinkController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
