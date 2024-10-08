import { left, right, type Either } from '@/core/either';
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found';
import type { AnswersRepository } from '../repositories/answers-repository';

interface DeleteAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
}

type DeleteAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>;

export class DeleteAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {
    /** nothing here */
  }

  async execute({
    authorId,
    answerId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (answer?.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    await this.answersRepository.delete(answer);

    return right({});
  }
}
