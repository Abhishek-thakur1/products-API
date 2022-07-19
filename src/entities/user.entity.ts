import { Entity, Index, Column } from "typeorm";
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

    toJSON() {
        return { ...this, password: undefined, verified: undefined };
    }
}
