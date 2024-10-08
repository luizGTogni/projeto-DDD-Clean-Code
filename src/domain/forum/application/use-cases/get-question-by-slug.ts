import { left, right, type Either } from '@/core/either';
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found';
import { Question } from '../../enterprise/entities/question';
import type { QuestionsRepository } from '../repositories/questions-repository';

interface GetQuestionBySlugUseCaseRequest {
  slug: string;
}

type GetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    question: Question;
  }
>;

export class GetQuestionBySlugUseCase {
  constructor(private questionRepository: QuestionsRepository) {
    /** nothing here */
  }

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionRepository.findBySlug(slug);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    return right({ question });
  }
}
