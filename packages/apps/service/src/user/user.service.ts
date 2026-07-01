import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class UserService {
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
    const isValid = await bcrypt.compare(password, user.password);
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
}
