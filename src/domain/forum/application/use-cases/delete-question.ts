import { left, right, type Either } from '@/core/either';
import type { QuestionsRepository } from '../repositories/questions-repository';
import { NotAllowedError } from './errors/not-allowed-error';
import { ResourceNotFoundError } from './errors/resource-not-found';

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
