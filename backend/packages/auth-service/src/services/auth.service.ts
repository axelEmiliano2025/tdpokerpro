import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '@tdpokerpro/database';
import * as bcrypt from 'bcrypt';

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

export interface JwtPayload {
    userId: string;
    username: string;
    email: string;
    role: string;
}

/**
 * Auth Service (NestJS)
 * JWT authentication with bcrypt
 */
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto): Promise<{ user: User; accessToken: string }> {
        const { username, email, password, firstName, lastName } = registerDto;

        // Check if user exists
        const existingUser = await this.userRepository.findOne({
            where: [{ email }, { username }],
        });

        if (existingUser) {
            throw new UnauthorizedException('Email or username already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = this.userRepository.create({
            username,
            email,
            passwordHash: hashedPassword,
            firstName,
            lastName,
            role: 'player',
            status: 'active',
        });

        const savedUser = await this.userRepository.save(user);

        // Generate JWT
        const accessToken = this.generateToken(savedUser);

        // Don't return password
        const { passwordHash, ...userWithoutPassword } = savedUser;

        return { user: userWithoutPassword as User, accessToken };
    }

    async login(loginDto: LoginDto): Promise<{ user: User; accessToken: string }> {
        const { email, password } = loginDto;

        // Find user
        const user = await this.userRepository.findOne({
            where: { email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);

        if (!isValidPassword) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Update last login
        await this.userRepository.update(user.id, {
            lastLogin: new Date(),
        });

        // Generate JWT
        const accessToken = this.generateToken(user);

        // Don't return password
        const { passwordHash, ...userWithoutPassword } = user;

        return { user: userWithoutPassword as User, accessToken };
    }

    async validateUser(payload: JwtPayload): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { id: payload.userId },
        });

        if (!user || user.status !== 'active') {
            throw new UnauthorizedException('User not found or inactive');
        }

        return user;
    }

    private generateToken(user: User): string {
        const payload: JwtPayload = {
            userId: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        };

        return this.jwtService.sign(payload);
    }

    async refreshToken(userId: string): Promise<string> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return this.generateToken(user);
    }
}
