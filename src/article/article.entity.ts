import { TagEntity } from '../tags/tags.entity';
import {
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'articles' })
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  body: string;

  @Column({
    type: 'timestamp',
    default: new Date(),
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: new Date(),
  })
  updatedAt: Date;

  @ManyToMany(() => TagEntity, (tag) => tag.id, { eager: true })
  @JoinTable()
  tags: TagEntity[];

  @Column({
    default: 0,
  })
  favoritesCount: number;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }

  @ManyToOne(() => UserEntity, (user) => user.articles, { eager: true })
  author: UserEntity;
}
