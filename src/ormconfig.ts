import { ConnectionOptions } from "typeorm";
import { ArticleEntity } from "./article/article.entity";
import { FollowEntity } from "./profile/entity/follow.entity";
import { TagEntity } from "./tags/tags.entity";
import { UserEntity } from "./user/user.entity";

const config : ConnectionOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'admin',
    database:"my-server",
    entities: [TagEntity,UserEntity,ArticleEntity,FollowEntity],
    // entities: ["dist/**/*.entity{.ts,.js}"],
    synchronize: true,
};

export default config;