import { left, right, type Either } from '@/core/either';
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found';
import type { QuestionsRepository } from '../repositories/questions-repository';

interface DeleteQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
}

type DeleteQuestionUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>;

export class DeleteQuestionUseCase {
  constructor(private questionRepository: QuestionsRepository) {
    /** nothing here */
  }

  async execute({
    authorId,
    questionId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (question?.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    await this.questionRepository.delete(question);

    return right({});
  }
}
