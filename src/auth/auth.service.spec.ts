import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Role, User } from 'src/user/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },}
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // register
  it('should register a user successfully', async () => {
    const email = 'test@example.com';
    const password = 'password123';

    const hashedPassword: string = 'hashedPassword';
    const user: User = { email, password: hashedPassword } as User;

    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      return Promise.resolve(hashedPassword);
    });

    jest.spyOn(userRepository, 'create').mockReturnValue(user);
    jest.spyOn(userRepository, 'save').mockResolvedValue(user);

    const result = await service.register(email, password);

    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    expect(userRepository.create).toHaveBeenCalledWith({
      email,
      password: hashedPassword,
    });
    expect(userRepository.save).toHaveBeenCalledWith(user);
    expect(result).toEqual({ message: 'User registered successfully' });
  });

  // login
  it('should login successfully and return an access token', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const user: User = { id: 1, email, password: 'hashedPassword', role: Role.USER };
    const token = 'accessToken123';

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
      return Promise.resolve(true);
    });

    jest.spyOn(jwtService, 'sign').mockReturnValue(token);

    const result = await service.login(email, password);

    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email } });
    expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
    expect(jwtService.sign).toHaveBeenCalledWith({ id: user.id, email: user.email });
    expect(result).toEqual({ accessToken: token });
  });

  it('should throw UnauthorizedException if credentials are invalid', async () => {
    const email = 'test@example.com';
    const password = 'wrongPassword';

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

    try {
      await service.login(email, password);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toBe('Invalid credentials');
    }
  });

  it('should throw UnauthorizedException if password does not match', async () => {
    const email = 'test@example.com';
    const password = 'wrongPassword';
    const user = { id: 1, email, password: 'hashedPassword' };

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as any);

    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
      return Promise.resolve(false);
    });

    try {
      await service.login(email, password);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toBe('Invalid credentials');
    }
  });
});
