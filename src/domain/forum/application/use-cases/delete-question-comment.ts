import type { QuestionCommentsRepository } from '../repositories/question-comments-repository';

interface DeleteQuestionCommentUseCaseRequest {
  authorId: string;
  questionCommentId: string;
}

interface DeleteQuestionCommentUseCaseResponse {
  /** nothing here */
}

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
      throw new Error('Question comment not found.');
    }

    if (questionComment?.authorId.toString() !== authorId) {
      throw new Error('Not allowed.');
    }

    await this.questionCommentsRepository.delete(questionComment);

    return {};
  }
}
