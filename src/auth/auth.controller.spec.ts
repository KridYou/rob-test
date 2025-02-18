import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      register: jest.fn().mockResolvedValue({
        email: 'test@example.com',
        password: 'hashed-password',
      }),
      login: jest.fn().mockResolvedValue({
        accessToken: 'jwt-token',
      }),
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{
        provide: AuthService,
        useValue: mockAuthService

      }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a user', async () => {
    const registerDto: CreateAuthDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const result = await controller.register(registerDto);

    expect(result).toEqual({
      email: 'test@example.com',
      password: 'hashed-password',
    });
    expect(service.register).toHaveBeenCalledWith(registerDto.email, registerDto.password);
    expect(service.register).toHaveBeenCalledTimes(1);
  });

  it('should login a user and return a JWT token', async () => {
    const loginDto: CreateAuthDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const result = await controller.login(loginDto);

    expect(result).toEqual({
      accessToken: 'jwt-token',
    });
    expect(service.login).toHaveBeenCalledWith(loginDto.email, loginDto.password);
    expect(service.login).toHaveBeenCalledTimes(1);
  });
});
