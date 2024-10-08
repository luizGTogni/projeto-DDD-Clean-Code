import { left, right, type Either } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found';
import { QuestionComment } from '../../enterprise/entities/question-comment';
import type { QuestionCommentsRepository } from '../repositories/question-comments-repository';
import type { QuestionsRepository } from '../repositories/questions-repository';

interface CommentOnQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
  content: string;
}

type CommentOnQuestionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment;
  }
>;

export class CommentOnQuestionUseCase {
  constructor(
    private questionRepository: QuestionsRepository,
    private questionCommentsRepository: QuestionCommentsRepository
  ) {
    /** nothing here */
  }

  async execute({
    authorId,
    questionId,
    content,
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      content,
    });

    await this.questionCommentsRepository.create(questionComment);

    return right({ questionComment });
  }
}
