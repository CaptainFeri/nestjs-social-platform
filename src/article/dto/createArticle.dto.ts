import { IsNotEmpty } from "class-validator";
import { TagEntity } from "src/tags/tags.entity";

export class CreateArticleDto {
    @IsNotEmpty()
    readonly title: string;
    @IsNotEmpty()
    readonly description: string;
    @IsNotEmpty()
    readonly body: string;

    readonly tags?: string[];
}