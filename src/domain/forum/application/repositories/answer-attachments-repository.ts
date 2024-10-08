import type { AnswerAttachment } from '../../enterprise/entities/answer-attachment';

export interface AnswerAttachmentsRepository {
  findManyAnswerId(answerId: string): Promise<AnswerAttachment[]>;
  deleteManyByAnswerId(answerId: string): Promise<void>;
}
