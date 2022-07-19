import { Entity, Index, Column, BeforeInsert } from "typeorm";
import bcrypt from "bcryptjs";
import Model from './model.entity'

export enum RoleEnumType  {
    USER = "user",
    ADMIN = "admin"
}

@Entity('users')
export class User extends Model {
    
    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Index('email_index')
    @Column({
        unique: true,
    })
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: RoleEnumType,
        default: RoleEnumType.USER,
    })
    role: RoleEnumType.USER;

    @Column({
        default: 'default.png',
    })
    photo: string;

    @Column({
        default: false,
    })
    verified: boolean;

    // 👇 Hash password before saving to database
    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 12);
    }

    // 👇 Validate password
    static async comparePasswords(
        candidatePassword: string,
        hashedPassword: string
    ) {
        return await bcrypt.compare(candidatePassword, hashedPassword);
    }

    toJSON() {
        return { ...this, password: undefined, verified: undefined };
    }
}
