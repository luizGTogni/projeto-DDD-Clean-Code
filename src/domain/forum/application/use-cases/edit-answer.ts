import type { Answer } from '../../enterprise/entities/answer';
import type { AnswersRepository } from '../repositories/answers-repository';

interface EditAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
  content: string;
}

interface EditAnswerUseCaseResponse {
  answer: Answer;
}

export class EditAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {
    /** nothing here */
  }

  async execute({
    authorId,
    answerId,
    content,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      throw new Error('Answer not found.');
    }

    if (answer?.authorId.toString() !== authorId) {
      throw new Error('Not allowed.');
    }

    answer.content = content;

    await this.answersRepository.save(answer);

    return { answer };
  }
}
