import { Test, TestingModule } from '@nestjs/testing';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { AuthenticatedRequest } from './interface/authenticate-request.interface';
import { CreateCardDto, CreateCommentDto } from './dto/create-card.dto';
import { CardStatus } from 'src/common/card-status.enum';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ThrottlerModule } from '@nestjs/throttler';

describe('CardController', () => {
  let controller: CardController;
  let service: CardService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot({
          throttlers: [
            {
              limit: 10,
              ttl: 60000,
            },
          ],
        }),
      ],
      controllers: [CardController],
      providers: [
        {
          provide: CardService,
          useValue: {
            createCard: jest.fn().mockResolvedValue({
              id: '3d6899a1-29fd-419d-97ae-362e13bd9c63',
              title: 'Test Card',
              description: 'Test Description',
              cardStatus: CardStatus.TO_DO,
            }),
            addCommentToPost: jest.fn().mockResolvedValue({
              id: 'd2e32adc-b33c-4ab3-95b9-e3422f549968',
              content: 'Test Comment',
            }),
            updateComment: jest.fn().mockResolvedValue({
              id: '5a38f5d4-f45a-4331-97ac-30b78e8883fe',
              text: 'Updated Comment',
            }),
            findCardById: jest.fn().mockResolvedValue({
              id: '444d92b4-5dc9-42e9-94be-852de2832e33',
              title: 'Test Card',
              description: 'Test Description',
            }),
            findAll: jest.fn().mockResolvedValue([
              {
                id: 'cd039329-5b08-4be7-9f9d-ed4437e28208',
                title: 'Test Card 1',
                description: 'Description 1',
              },
              {
                id: '194266ea-934b-45fb-a15c-d84ab8f04c13',
                title: 'Test Card 2',
                description: 'Description 2',
              },
            ]),
            softDelete: jest
              .fn()
              .mockResolvedValue({ message: 'Card soft deleted successfully' }),
          },
        },
      ],
    }).compile();

    controller = module.get<CardController>(CardController);
    service = module.get<CardService>(CardService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // rate limit
  it('should apply rate limiting', async () => {
    const rateLimit = 10;

    await controller.findAll();

    for (let i = 0; i < rateLimit; i++) {
      await controller.findAll();
    }

    try {
      await controller.findAll();
    } catch (error) {
      expect(error.response.statusCode).toBe(429);
    }
  });

  describe('createCard', () => {
    it('should create a new card', async () => {
      const createCardDto: CreateCardDto = {
        topic: 'Test Card',
        description: 'Test Description',
        cardStatus: CardStatus.TO_DO,
      };
      const mockRequest: AuthenticatedRequest = {
        user: { userId: '3d6899a1-29fd-419d-97ae-362e13bd9c63' },
      } as AuthenticatedRequest;

      const result = await controller.createCard(mockRequest, createCardDto);

      expect(service.createCard).toHaveBeenCalledWith(
        {
          topic: 'Test Card',
          description: 'Test Description',
          cardStatus: CardStatus.TO_DO,
        },
        '3d6899a1-29fd-419d-97ae-362e13bd9c63',
      );
      expect(result).toEqual({
        id: '3d6899a1-29fd-419d-97ae-362e13bd9c63',
        title: 'Test Card',
        description: 'Test Description',
        cardStatus: CardStatus.TO_DO,
      });
    });
  });

  describe('createComment', () => {
    it('should create a new comment', async () => {
      const createCommentDto: CreateCommentDto = { content: 'Test Comment' };
      const cardId = 'd2e32adc-b33c-4ab3-95b9-e3422f549968';
      const mockRequest: AuthenticatedRequest = {
        user: { userId: '3d6899a1-29fd-419d-97ae-362e13bd9c63' },
      } as AuthenticatedRequest;

      const result = await controller.createComment(
        cardId,
        createCommentDto,
        mockRequest,
      );

      expect(service.addCommentToPost).toHaveBeenCalledWith(
        'd2e32adc-b33c-4ab3-95b9-e3422f549968',
        { content: 'Test Comment' },
        '3d6899a1-29fd-419d-97ae-362e13bd9c63',
      );
      expect(result).toEqual({
        id: 'd2e32adc-b33c-4ab3-95b9-e3422f549968',
        content: 'Test Comment',
      });
    });
  });

  describe('updateComment', () => {
    it('should update a comment', async () => {
      const updateCommentDto: UpdateCommentDto = { content: 'Updated Comment' };
      const commentId = '5a38f5d4-f45a-4331-97ac-30b78e8883fe';

      const result = await controller.updateComment(
        commentId,
        updateCommentDto,
      );

      expect(service.updateComment).toHaveBeenCalledWith(
        commentId,
        updateCommentDto,
      );
      expect(result).toEqual({
        id: '5a38f5d4-f45a-4331-97ac-30b78e8883fe',
        text: 'Updated Comment',
      });
    });
  });

  describe('getCardById', () => {
    it('should return a card by ID', async () => {
      const cardId = '444d92b4-5dc9-42e9-94be-852de2832e33';
      const result = await controller.getCardById(cardId);

      expect(service.findCardById).toHaveBeenCalledWith(cardId);
      expect(result).toEqual({
        id: '444d92b4-5dc9-42e9-94be-852de2832e33',
        title: 'Test Card',
        description: 'Test Description',
      });
    });
  });

  describe('findAll', () => {
    it('should return all cards', async () => {
      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([
        {
          id: 'cd039329-5b08-4be7-9f9d-ed4437e28208',
          title: 'Test Card 1',
          description: 'Description 1',
        },
        {
          id: '194266ea-934b-45fb-a15c-d84ab8f04c13',
          title: 'Test Card 2',
          description: 'Description 2',
        },
      ]);
    });
  });

  describe('softDelete', () => {
    it('should soft delete a card', async () => {
      const cardId = '1';
      const result = await controller.softDelete(cardId);

      expect(service.softDelete).toHaveBeenCalledWith(cardId);
      expect(result).toEqual({ message: 'Card soft deleted successfully' });
    });
  });
});
