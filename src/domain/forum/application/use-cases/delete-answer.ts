import type { AnswersRepository } from '../repositories/answers-repository';

interface DeleteAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
}

interface DeleteAnswerUseCaseResponse {
  /** nothing here */
}

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
      throw new Error('Answer not found.');
    }

    if (answer?.authorId.toString() !== authorId) {
      throw new Error('Not allowed.');
    }

    await this.answersRepository.delete(answer);

    return {};
  }
}
