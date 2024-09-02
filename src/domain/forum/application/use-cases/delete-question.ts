import type { QuestionsRepository } from '../repositories/questions-repository';

interface DeleteQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
}

interface DeleteQuestionUseCaseResponse {
  /** nothing here */
}

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
      throw new Error('Question not found.');
    }

    if (question?.authorId.toString() !== authorId) {
      throw new Error('Not allowed.');
    }

    await this.questionRepository.delete(question);

    return {};
  }
}
