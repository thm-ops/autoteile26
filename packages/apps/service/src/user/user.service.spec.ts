import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

const mockUser: User = {
  id: 'uuid-123',
  email: 'admin@autoteile26.de',
  password: '$2b$10$hashedpassword',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  it('should create a user with hashed password', async () => {
    mockRepository.create.mockReturnValue(mockUser);
    mockRepository.save.mockResolvedValue(mockUser);

    const result = await service.createUser('admin@autoteile26.de', 'password123');

    expect(mockRepository.create).toHaveBeenCalled();
    expect(mockRepository.save).toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });

  it('should return user if credentials are valid', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    mockRepository.findOne.mockResolvedValue({ ...mockUser, password: hashedPassword });

    const result = await service.validateUser('admin@autoteile26.de', 'password123');

    expect(result).not.toBeNull();
  });

  it('should return null if credentials are invalid', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    mockRepository.findOne.mockResolvedValue({ ...mockUser, password: hashedPassword });

    const result = await service.validateUser('admin@autoteile26.de', 'wrongpassword');

    expect(result).toBeNull();
  });

  it('should update password', async () => {
    mockRepository.findOne.mockResolvedValue(mockUser);
    mockRepository.save.mockResolvedValue(mockUser);

    await service.updatePassword('admin@autoteile26.de', 'newPassword123');

    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('should delete user', async () => {
    mockRepository.findOne.mockResolvedValue(mockUser);
    mockRepository.remove.mockResolvedValue(mockUser);

    await service.deleteUser('admin@autoteile26.de');

    expect(mockRepository.remove).toHaveBeenCalled();
  });
});