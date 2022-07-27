import { Column, Entity } from "typeorm";
import Model from "./model.entity";

@Entity("products")
export class Product extends Model {
    @Column()
    title: string;

    @Column()
    price: number;

    @Column()
    description: string;

    @Column()
    image: string;

    @Column()
    category: string;
}