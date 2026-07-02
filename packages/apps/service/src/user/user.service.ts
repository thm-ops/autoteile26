import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class UserService {

    private readonly maxFailedLoginAttempts = 10; // 10 Attempts
    private readonly lockoutDurationMs = 30 * 60 * 1000; // 30 Minutes

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

 /**
 * Creates a new user with a hashed password.
 * @param email - The email address of the user.
 * @param password - The plain text password to be hashed.
 * @returns The created User entity.
 */
  async createUser(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ email, password: hashedPassword });
    return this.userRepository.save(user);
  }

  /**
 * Validates a user by email and password.
 * @param email - The email address of the user.
 * @param password - The plain text password to validate.
 * @returns The User entity if credentials are valid, or null if the user is not found or the password is incorrect.
 */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return null;


    if (user.lockedUntil) {

      const lockedUntilTime = new Date(user.lockedUntil).getTime();

      if (lockedUntilTime > Date.now()) {

        throw new UnauthorizedException('Account is temporarily locked');
      }
    
      user.failedLoginAttempts = 0;
      user.lockedUntil = null;
    }
    

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {

      user.failedLoginAttempts = (user.failedLoginAttempts ?? 0) + 1;

      if (user.failedLoginAttempts >= this.maxFailedLoginAttempts) {
        user.lockedUntil = new Date(Date.now() + this.lockoutDurationMs);
      }
    }

    else {

      user.lockedUntil = null;
      user.failedLoginAttempts = 0;

    }
    await this.userRepository.save(user);

    return isValid ? user : null;
  }

  /**
 * Updates the password of an existing user.
 * @param email - The email address of the user.
 * @param newPassword - The new plain text password to be hashed and saved.
 * @throws NotFoundException if the user is not found.
 * @returns void
 */
  async updatePassword(email: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);
  }

  /**
 * Deletes a user by email.
 * @param email - The email address of the user to delete.
 * @throws NotFoundException if the user is not found.
 * @returns void
 */
  async deleteUser(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    await this.userRepository.remove(user);
  }


  async unlockUser(email: string): Promise<User> {

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.failedLoginAttempts = 0;
    user.lockedUntil = null;

    return this.userRepository.save(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

}
