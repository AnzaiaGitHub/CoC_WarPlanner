import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { randomUUID } from 'crypto';
import { RegisterResponseDTO } from '../auth/DTOs/register.dto';
import { UserCreationData } from './types/UserCreationData';

@Injectable()
export class UsersService {
  private users: User[] = []; // In-memory storage for users

  create({ email, passwordHash }: UserCreationData): RegisterResponseDTO {
    if(this.findByEmail(email)) {
      throw new Error('User with this email already exists');
    }

    const newUser: User = {
      id: randomUUID(), // Generate a unique ID for the user
      email: email,
      passwordHash: passwordHash,
      createdAt: new Date(),
      displayName: null,
      activeAccount: null,
      claimedAccounts: [],
    };
    this.users.push(newUser);
    return {id: newUser.id, email: newUser.email};
  }

  findById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  findByEmail(email: string): User | undefined {
    return this.users.find(user => user.email === email);
  }
}
