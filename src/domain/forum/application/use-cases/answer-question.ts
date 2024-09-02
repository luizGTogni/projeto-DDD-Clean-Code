import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Answer } from '../../enterprise/entities/answer';
import type { AnswersRepository } from '../repositories/answers-repository';

interface AnswerQuestionUseCaseRequest {
  instructorId: string;
  questionId: string;
  content: string;
}

interface AnswerQuestionUseCaseResponse {
  answer: Answer;
}

export class AnswerQuestionUseCase {
  constructor(private answersRepository: AnswersRepository) {
    /** nothing here */
  }

  async execute({
    instructorId,
    questionId,
    content,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      questionId: new UniqueEntityID(questionId),
      authorId: new UniqueEntityID(instructorId),
    });

    await this.answersRepository.create(answer);

    return { answer };
  }
}
