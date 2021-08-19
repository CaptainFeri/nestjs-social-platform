import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { hash } from 'bcrypt';
import { ArticleEntity } from "../article/article.entity";

@Entity({name: 'users'})
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column({
        type: 'text',
        default:"09106299465",
        name:"mobile"
    })
    mobile: string;

    @Column({ default: ''})
    bio: string;

    @Column({
        type:'text',
        default: ''
    })
    image: string;

    @Column({ select : false })
    password: string;

    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password,10);
    }

    @OneToMany(() => ArticleEntity, (article) => article.author)
    articles: ArticleEntity[];

    @ManyToMany(()=> ArticleEntity)
    @JoinTable()
    favorites: ArticleEntity[];
    
}