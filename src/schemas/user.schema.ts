import { object, string, TypeOf, z } from "zod";
import {RoleEnumType} from "../entities/user.entity"

export const createUserSchema = object({
    body: object({
        firstName: string({
            required_error: "First Name must be provided"
        }),

        lastName: string({
            required_error: "Last Name must be provided"
        }),

        email: string({
            required_error: "Email is required"
        }).email('Invalid email address'),

        password: string({
            required_error: "Password is required"
        }).min(8, "Password must be at least 8 characters").max(32, "Password must be at least 32 characters"),

        passwordConfirmation: string({
            required_error: "Password must be confirmed"
        }),

        role: z.optional(z.nativeEnum(RoleEnumType)),

    }).refine((data) => data.password === data.passwordConfirmation, {
        path: ['passwordConfirm'],
        message: 'Password do not match'
    })
});


export const loginUserSchema = object({
    body: object({
        email: string({
            required_error: "Email is required"
        }).email('Invalid email'),

        password: string({
            required_error: "Password is required"
        }).min(8, 'Invalid Email or Password')
    })
});


export type createUserInput = Omit<TypeOf<typeof createUserSchema>['body'], 'passwordConfirm'>;


export type loginUserInput = TypeOf<typeof loginUserSchema>['body'];