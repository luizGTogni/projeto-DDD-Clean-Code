import type { AnswerComment } from '../../enterprise/entities/answer-comment';
import type { AnswerCommentsRepository } from '../repositories/answer-comments-repository';

interface FetchAnswerCommentsUseCaseRequest {
  answerId: string;
  page: number;
}

interface FetchAnswerCommentsUseCaseResponse {
  answerComments: AnswerComment[];
}

export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {
    /** nothing here */
  }

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const answerComments = await this.answerCommentsRepository.findManyAnswerId(
      answerId,
      {
        page,
      }
    );

    return { answerComments };
  }
}
