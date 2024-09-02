import { Question } from '../../enterprise/entities/question';
import type { QuestionsRepository } from '../repositories/questions-repository';

interface FetchRecentQuestionsUseCaseRequest {
  page: number;
}

interface FetchRecentQuestionsUseCaseResponse {
  questions: Question[];
}

export class FetchRecentQuestionsUseCase {
  constructor(private questionRepository: QuestionsRepository) {
    /** nothing here */
  }

  async execute({
    page,
  }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    const questions = await this.questionRepository.findManyRecent({ page });

    return { questions };
  }
}
