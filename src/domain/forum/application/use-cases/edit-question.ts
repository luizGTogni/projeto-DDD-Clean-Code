import { left, right, type Either } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import type { Question } from '../../enterprise/entities/question';
import { QuestionAttachment } from '../../enterprise/entities/question-attachment';
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list';
import type { QuestionAttachmentsRepository } from '../repositories/question-attachments-repository';
import type { QuestionsRepository } from '../repositories/questions-repository';
import { NotAllowedError } from './errors/not-allowed-error';
import { ResourceNotFoundError } from './errors/resource-not-found';

interface EditQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
  title: string;
  content: string;
  attachmentsIds: string[];
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question;
  }
>;

export class EditQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository
  ) {
    /** nothing here */
  }

  async execute({
    authorId,
    questionId,
    title,
    content,
    attachmentsIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (question?.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    const currentQuestionAttachments =
      await this.questionAttachmentsRepository.findManyQuestionId(questionId);

    const questionAttachmentList = new QuestionAttachmentList(currentQuestionAttachments);

    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id,
      });
    });

    questionAttachmentList.update(questionAttachments);

    question.attachments = questionAttachmentList;
    question.title = title;
    question.content = content;

    await this.questionsRepository.save(question);

    return right({ question });
  }
}
