import { left, right, type Either } from '@/core/either';
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found';
import type { QuestionCommentsRepository } from '../repositories/question-comments-repository';

interface DeleteQuestionCommentUseCaseRequest {
  authorId: string;
  questionCommentId: string;
}

type DeleteQuestionCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>;

export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {
    /** nothing here */
  }

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment =
      await this.questionCommentsRepository.findById(questionCommentId);

    if (!questionComment) {
      return left(new ResourceNotFoundError());
    }

    if (questionComment?.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    await this.questionCommentsRepository.delete(questionComment);

    return right({});
  }
}
